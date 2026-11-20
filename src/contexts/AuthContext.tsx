import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase/config';
import { createNotification } from '../firebase/services';
import { CONDUCT_VERSION, TERMS_VERSION } from '../constants/legal';
import type { UserProfile } from '../types';

const BOOTSTRAP_ADMIN_EMAIL = 'ranimuthuraj7409@gmail.com';

export interface RegistrationDetails {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  qualification: string;
  institution?: string;
  city: string;
  courseInterests: string[];
  termsAccepted: boolean;
  conductAccepted: boolean;
}

export interface ProfileCompletionDetails {
  fullName: string;
  mobile: string;
  qualification: string;
  institution?: string;
  city: string;
  courseInterests: string[];
  termsAccepted: boolean;
  conductAccepted: boolean;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  authReady: boolean;
  loadingProfile: boolean;
  registerStudent: (details: RegistrationDetails) => Promise<void>;
  completeGoogleOnboarding: (details: ProfileCompletionDetails) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<{ isAdminUser: boolean }>;
  loginWithGoogle: () => Promise<{ needsOnboarding: boolean; isAdminUser: boolean }>;
  sendVerificationEmail: () => Promise<void>;
  refreshAuthUser: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const resolveUserState = useCallback(async (firebaseUser: User | null) => {
    if (!firebaseUser) {
      setProfile(null);
      setIsAdmin(false);
      setLoadingProfile(false);
      setAuthReady(true);
      return;
    }

    setLoadingProfile(true);
    try {
      const isBootstrapAdmin =
        firebaseUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL &&
        firebaseUser.emailVerified === true;

      let adminDocExists = false;
      if (firebaseUser.emailVerified) {
        try {
          const adminSnap = await getDoc(doc(db, 'admins', firebaseUser.uid));
          adminDocExists = adminSnap.exists();
        } catch {
          adminDocExists = false;
        }
      }

      setIsAdmin(isBootstrapAdmin || adminDocExists);

      try {
        const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
        setProfile(userSnap.exists() ? (userSnap.data() as UserProfile) : null);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
      }
    } finally {
      setLoadingProfile(false);
      setAuthReady(true);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      void resolveUserState(firebaseUser);
    });
    return () => unsub();
  }, [resolveUserState]);

  const refreshProfile = useCallback(async () => {
    await resolveUserState(auth.currentUser);
  }, [resolveUserState]);

  const writeStudentProfile = async (
    uid: string,
    email: string,
    details: {
      fullName: string;
      mobile: string;
      qualification: string;
      institution?: string;
      city: string;
      courseInterests: string[];
    },
  ) => {
    const payload: Record<string, unknown> = {
      uid,
      fullName: details.fullName.trim().slice(0, 120),
      email: email.trim().slice(0, 160),
      mobile: details.mobile.trim().slice(0, 24),
      qualification: details.qualification.trim().slice(0, 120),
      city: details.city.trim().slice(0, 100),
      courseInterests: details.courseInterests.slice(0, 12).map((s) => s.slice(0, 80)),
      role: 'student',
      accountStatus: 'active',
      termsAccepted: true,
      termsVersion: TERMS_VERSION,
      conductAccepted: true,
      conductVersion: CONDUCT_VERSION,
      acceptedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const inst = details.institution?.trim().slice(0, 180);
    if (inst) payload.institution = inst;

    try {
      await setDoc(doc(db, 'users', uid), payload);
      await createNotification({
        recipientId: 'ADMIN',
        recipientRole: 'admin',
        title: 'New Student Registered',
        message: `${details.fullName.trim()} (${email.trim()}) registered on RM HEAVEN.`,
        type: 'registration',
        linkPath: '/admin',
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${uid}`);
    }
  };

  const registerStudent = async (details: RegistrationDetails) => {
    if (!details.termsAccepted || !details.conductAccepted) {
      throw new Error('You must accept the Terms & Conditions and Student Discipline & Code of Conduct before registering.');
    }
    const cred = await createUserWithEmailAndPassword(auth, details.email.trim(), details.password);
    await updateProfile(cred.user, { displayName: details.fullName.trim() });
    await sendEmailVerification(cred.user);
    await writeStudentProfile(cred.user.uid, details.email.trim(), details);
    await resolveUserState(cred.user);
  };

  const completeGoogleOnboarding = async (details: ProfileCompletionDetails) => {
    const current = auth.currentUser;
    if (!current) throw new Error('No authenticated session found.');
    if (!details.termsAccepted || !details.conductAccepted) {
      throw new Error('You must accept the Terms & Conditions and Student Code of Conduct.');
    }
    await writeStudentProfile(current.uid, current.email || '', details);
    await resolveUserState(current);
  };

  const loginWithEmail = async (email: string, password: string): Promise<{ isAdminUser: boolean }> => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const firebaseUser = cred.user;
    const isBootstrapAdmin =
      firebaseUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL &&
      firebaseUser.emailVerified === true;
    let adminDocExists = false;
    if (firebaseUser.emailVerified) {
      try {
        const adminSnap = await getDoc(doc(db, 'admins', firebaseUser.uid));
        adminDocExists = adminSnap.exists();
      } catch {
        adminDocExists = false;
      }
    }
    await resolveUserState(firebaseUser);
    return { isAdminUser: isBootstrapAdmin || adminDocExists };
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    const firebaseUser = cred.user;

    const isBootstrapAdmin =
      firebaseUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL &&
      firebaseUser.emailVerified === true;

    let adminDocExists = false;
    if (firebaseUser.emailVerified) {
      try {
        const adminSnap = await getDoc(doc(db, 'admins', firebaseUser.uid));
        adminDocExists = adminSnap.exists();
      } catch {
        adminDocExists = false;
      }
    }

    const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
    await resolveUserState(firebaseUser);

    return {
      needsOnboarding: !userSnap.exists() && !(isBootstrapAdmin || adminDocExists),
      isAdminUser: isBootstrapAdmin || adminDocExists,
    };
  };

  const sendVerificationEmail = async () => {
    if (!auth.currentUser) throw new Error('Please sign in first.');
    await sendEmailVerification(auth.currentUser);
  };

  const refreshAuthUser = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    await reload(auth.currentUser);
    await auth.currentUser.getIdToken(true);
    await resolveUserState(auth.currentUser);
    return auth.currentUser.emailVerified;
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        authReady,
        loadingProfile,
        registerStudent,
        completeGoogleOnboarding,
        loginWithEmail,
        loginWithGoogle,
        sendVerificationEmail,
        refreshAuthUser,
        resetPassword,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
