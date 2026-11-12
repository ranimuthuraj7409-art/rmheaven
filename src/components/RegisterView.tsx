import React, { useState } from 'react';
import { StudentProfile, EnrollmentRequest, NavigationTab } from '../types';
import { MascotCharacter } from './MascotCharacter';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, AlertCircle, CheckCircle2, Lock, ArrowRight, UserCheck } from 'lucide-react';

interface RegisterViewProps {
  onRegisterSuccess: (profile: StudentProfile, requestedCourses: string[]) => void;
  onSelectTab: (tab: NavigationTab) => void;
  brandName: string;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onRegisterSuccess,
  onSelectTab,
  brandName
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [academicYear, setAcademicYear] = useState('3rd Year (Semester VI)');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  
  // Course selection
  const [selectedCourseOption, setSelectedCourseOption] = useState<'Coding' | 'Digital Marketing' | 'Both Courses'>('Coding');

  // Mandatory 3 Unchecked Checkboxes (Strictly not preselected!)
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedDiscipline, setAgreedDiscipline] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredProfile, setRegisteredProfile] = useState<StudentProfile | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!fullName.trim() || !email.trim() || !mobileNumber.trim() || !college.trim() || !department.trim() || !city.trim() || !state.trim()) {
      setErrorMsg('Please complete all mandatory academic contact fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    // Strict requirement: all three mandatory checkboxes must be checked!
    if (!agreedTerms || !agreedDiscipline || !agreedPrivacy) {
      setErrorMsg('You must independently read and accept all three mandatory governance agreements (Terms, Discipline Policy, Privacy Policy) before completing registration.');
      return;
    }

    const coursesArray = selectedCourseOption === 'Both Courses' 
      ? ['Coding', 'Digital Marketing'] 
      : [selectedCourseOption];

    const newStudentId = `std-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProfile: StudentProfile = {
      id: newStudentId,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      mobileNumber: mobileNumber.trim(),
      college: college.trim(),
      department: department.trim(),
      academicYear,
      city: city.trim(),
      state: state.trim(),
      enrolledCourses: [], // No approved courses until owner approval!
      pendingCourseRequests: coursesArray, // Submitted for owner review
      status: 'Pending Approval',
      avatarUrl: '/assets/mascot/lion_mascot.png',
      agreedTermsVersion: '2.4-ACAD',
      agreedDisciplineVersion: '1.8-ACAD',
      agreedPrivacyVersion: '2.1-ACAD',
      agreedTimestamp: new Date().toISOString()
    };

    setRegisteredProfile(newProfile);
    setIsSuccess(true);
    onRegisterSuccess(newProfile, coursesArray);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-[#FCFAF8] text-[#393333]">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="flex justify-center">
          <BrandLogo variant="badge" size="sm" brandName={brandName} />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#800020]">
            Admissions Portal · Batch 2026
          </span>
          <h1 className="text-3xl font-bold font-heading text-[#393333] mt-1">
            Create Your Individual Student Account
          </h1>
          <p className="text-xs text-[#817779] mt-1">
            Register with your verified academic credentials. Course enrollment requires formal Platform Owner review and approval.
          </p>
        </div>
      </div>

      {isSuccess && registeredProfile ? (
        <div className="bg-white border-2 border-[#D6B878] rounded-2xl p-8 sm:p-12 shadow-lg text-center space-y-6 max-w-xl mx-auto">
          <div className="w-28 h-40 mx-auto rounded-2xl overflow-hidden bg-[#F8F3EE] border-2 border-[#D6B878] shadow-sm">
            <img
              src="/assets/aistudio/Confident_Lion_Executive_with_Laptop_2cf6151e.png"
              alt="Welcome to RM Heaven"
              className="w-full h-full object-contain p-1"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-heading text-[#393333]">
              Account Registered Successfully
            </h2>
            <p className="text-xs text-[#817779] leading-relaxed">
              Welcome, <strong className="text-[#393333]">{registeredProfile.fullName}</strong>. Your student profile has been created with Student ID: <span className="font-mono text-[#800020] font-bold">{registeredProfile.id}</span>.
            </p>
          </div>

          <div className="p-4 bg-[#F8F3EE] border border-[#EAE1DD] rounded-xl text-left text-xs space-y-2 text-[#393333]">
            <div className="flex justify-between">
              <span className="text-[#817779]">Selected Course Request:</span>
              <strong className="text-[#800020]">{selectedCourseOption}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#817779]">Enrollment Approval Status:</span>
              <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Pending Owner Review
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#817779]">Terms Agreement Logged:</span>
              <span className="font-mono text-[11px] text-[#702D3D]">v2.4-ACAD Verified</span>
            </div>
          </div>

          <p className="text-[11px] text-[#817779] leading-relaxed">
            In accordance with platform policy, your enrollment request has been queued for administrative review. You can log into your Student Dashboard to monitor approval status.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => onSelectTab('student-dashboard')}
              className="px-6 py-2.5 text-xs font-semibold bg-[#800020] hover:bg-[#630018] text-white rounded-xl shadow-xs transition-colors"
            >
              Open Student Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          
          {errorMsg && (
            <div className="p-4 bg-[#EAD5D8]/40 border border-[#800020]/20 rounded-xl text-xs text-[#800020] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-xs text-[#393333]">
            
            {/* Section 1: Personal & Academic Credentials */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#702D3D] border-b border-[#EAE1DD] pb-2">
                1. Student Identity & Contact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aditya Vardhan Raman"
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#800020] bg-[#FCFAF8]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Institutional Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@institution.ac.in"
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#800020] bg-[#FCFAF8]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#800020] bg-[#FCFAF8]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Password *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#800020] bg-[#FCFAF8]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#800020] bg-[#FCFAF8]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: College & Location Details */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#702D3D] border-b border-[#EAE1DD] pb-2">
                2. College, Department & Location
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">College / Institute Name *</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#800020] bg-[#FCFAF8]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Department / Branch *</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science / Electronics / Commerce"
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#800020] bg-[#FCFAF8]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Academic Year *</label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#800020] bg-[#FCFAF8]"
                  >
                    <option value="1st Year">1st Year Undergraduate</option>
                    <option value="2nd Year">2nd Year Undergraduate</option>
                    <option value="3rd Year (Semester VI)">3rd Year Pre-final</option>
                    <option value="4th Year (Semester VIII)">4th Year Final</option>
                    <option value="Postgraduate">Postgraduate / Master's</option>
                    <option value="Recent Graduate">Recent Graduate</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bangalore"
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#800020] bg-[#FCFAF8]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">State *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Karnataka"
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#800020] bg-[#FCFAF8]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Course Selection (Coding, Digital Marketing, or Both) */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#702D3D] border-b border-[#EAE1DD] pb-2">
                3. Course Enrollment Request
              </h3>
              <p className="text-[11px] text-[#817779]">
                Choose the course you wish to enroll in. Access to protected study notes is granted upon Owner approval.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`p-4 border rounded-xl cursor-pointer flex flex-col justify-between transition-all ${
                  selectedCourseOption === 'Coding' 
                    ? 'border-[#800020] bg-[#F8F3EE]' 
                    : 'border-[#EAE1DD] bg-white hover:bg-[#FCFAF8]'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-[#393333]">Coding</span>
                    <input
                      type="radio"
                      name="course-option"
                      checked={selectedCourseOption === 'Coding'}
                      onChange={() => setSelectedCourseOption('Coding')}
                      className="accent-[#800020]"
                    />
                  </div>
                  <span className="text-[11px] text-[#817779]">
                    Software Engineering, HTML, CSS, JS, Python & Projects.
                  </span>
                </label>

                <label className={`p-4 border rounded-xl cursor-pointer flex flex-col justify-between transition-all ${
                  selectedCourseOption === 'Digital Marketing' 
                    ? 'border-[#800020] bg-[#F8F3EE]' 
                    : 'border-[#EAE1DD] bg-white hover:bg-[#FCFAF8]'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-[#393333]">Digital Marketing</span>
                    <input
                      type="radio"
                      name="course-option"
                      checked={selectedCourseOption === 'Digital Marketing'}
                      onChange={() => setSelectedCourseOption('Digital Marketing')}
                      className="accent-[#800020]"
                    />
                  </div>
                  <span className="text-[11px] text-[#817779]">
                    SEO, Social Media, Meta Ads, Google Ads & Growth Analytics.
                  </span>
                </label>

                <label className={`p-4 border rounded-xl cursor-pointer flex flex-col justify-between transition-all ${
                  selectedCourseOption === 'Both Courses' 
                    ? 'border-[#800020] bg-[#F8F3EE]' 
                    : 'border-[#EAE1DD] bg-white hover:bg-[#FCFAF8]'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-[#800020]">Both Courses</span>
                    <input
                      type="radio"
                      name="course-option"
                      checked={selectedCourseOption === 'Both Courses'}
                      onChange={() => setSelectedCourseOption('Both Courses')}
                      className="accent-[#800020]"
                    />
                  </div>
                  <span className="text-[11px] text-[#817779]">
                    Full Dual Access: Coding + Digital Marketing curriculum.
                  </span>
                </label>
              </div>
            </div>

            {/* Section 4: MANDATORY STUDENT AGREEMENT (3 MANDATORY CHECKBOXES - NOT PRESELECTED) */}
            <div className="space-y-3 pt-3 bg-[#F8F3EE] p-5 rounded-xl border border-[#EAE1DD]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#800020]">
                <ShieldCheck className="w-4 h-4 text-[#D6B878]" />
                <span>Mandatory Student Governance Agreement</span>
              </div>
              <p className="text-[11px] text-[#817779]">
                In accordance with academic standards, you must explicitly read and acknowledge each of the following three governance mandates before your registration dossier is accepted:
              </p>

              <div className="space-y-3 pt-2">
                {/* Mandatory Checkbox 1 */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#EAE1DD] accent-[#800020] cursor-pointer"
                    required
                  />
                  <div className="text-xs text-[#393333]">
                    <span>I have read and agree to the </span>
                    <button
                      type="button"
                      onClick={() => onSelectTab('terms')}
                      className="font-bold text-[#800020] hover:underline"
                    >
                      Terms and Conditions
                    </button>
                    <span className="text-[#817779]"> (including strict restrictions on distributing course notes).</span>
                  </div>
                </label>

                {/* Mandatory Checkbox 2 */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedDiscipline}
                    onChange={(e) => setAgreedDiscipline(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#EAE1DD] accent-[#800020] cursor-pointer"
                    required
                  />
                  <div className="text-xs text-[#393333]">
                    <span>I agree to follow the </span>
                    <button
                      type="button"
                      onClick={() => onSelectTab('discipline')}
                      className="font-bold text-[#702D3D] hover:underline"
                    >
                      Student Discipline Policy and Code of Conduct
                    </button>
                    <span className="text-[#817779]"> (including academic honesty, zero tolerance for plagiarism, and professional behavior).</span>
                  </div>
                </label>

                {/* Mandatory Checkbox 3 */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedPrivacy}
                    onChange={(e) => setAgreedPrivacy(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#EAE1DD] accent-[#800020] cursor-pointer"
                    required
                  />
                  <div className="text-xs text-[#393333]">
                    <span>I have read the </span>
                    <button
                      type="button"
                      onClick={() => onSelectTab('privacy')}
                      className="font-bold text-[#800020] hover:underline"
                    >
                      Privacy Policy
                    </button>
                    <span className="text-[#817779]"> and understand how my academic information is handled and protected.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#EAE1DD] flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => onSelectTab('login')}
                className="text-xs font-semibold text-[#702D3D] hover:underline"
              >
                Already have an account? Log in here →
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 text-xs font-semibold bg-[#800020] hover:bg-[#630018] text-white rounded-xl shadow-md transition-colors"
              >
                Complete Registration & Submit Enrollment
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
};
