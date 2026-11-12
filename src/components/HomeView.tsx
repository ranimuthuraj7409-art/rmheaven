import React from 'react';
import { 
  NavigationTab, 
  Course, 
  Internship, 
  PdfDocument, 
  WebsiteCMS 
} from '../types';
import { MascotCharacter } from './MascotCharacter';
import { BrandLogo } from './BrandLogo';
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Lock, 
  BookOpen, 
  Users, 
  Clock, 
  ChevronRight, 
  Sparkles,
  AlertTriangle,
  Award,
  Layers,
  Compass
} from 'lucide-react';

interface HomeViewProps {
  cms: WebsiteCMS;
  courses: Course[];
  internships: Internship[];
  pdfDocuments: PdfDocument[];
  onSelectTab: (tab: NavigationTab) => void;
  onSelectCourse: (course: Course) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  cms,
  courses,
  internships,
  pdfDocuments,
  onSelectTab,
  onSelectCourse
}) => {
  const disciplineBehaviors = [
    {
      num: '01',
      title: 'Professional Behaviour',
      desc: 'Students must maintain respectful and professional behaviour when interacting with instructors, mentors, administrators and other students.'
    },
    {
      num: '02',
      title: 'Attendance and Punctuality',
      desc: 'Students are expected to attend scheduled sessions, participate in learning activities and complete assigned work on time.'
    },
    {
      num: '03',
      title: 'Academic Integrity',
      desc: 'Plagiarism, cheating, copying assignments and submitting another person\'s work as their own are strictly prohibited.'
    },
    {
      num: '04',
      title: 'Respectful Communication',
      desc: 'Students must use respectful language and maintain appropriate conduct in online and offline communication.'
    },
    {
      num: '05',
      title: 'Responsible Technology Usage',
      desc: 'Students must use learning resources, accounts and platform facilities responsibly without tampering with security.'
    },
    {
      num: '06',
      title: 'Assignment Responsibility',
      desc: 'Students must complete assignments independently unless collaboration is specifically permitted by the syllabus.'
    },
    {
      num: '07',
      title: 'Platform Security',
      desc: 'Students must not share passwords, attempt unauthorized access or misuse another student\'s account.'
    },
    {
      num: '08',
      title: 'Confidentiality',
      desc: 'Students must respect the privacy of other students, instructors and any confidential educational or internship materials.'
    },
    {
      num: '09',
      title: 'Participation',
      desc: 'Students should actively participate in course activities, code reviews, and practical learning opportunities.'
    },
    {
      num: '10',
      title: 'Disciplinary Violations',
      desc: 'Misconduct, harassment, abusive behaviour, fraud, plagiarism and repeated violations may result in warnings, temporary suspension or removal from the platform, following a fair review process.'
    }
  ];

  const howItWorksSteps = [
    {
      step: 'Step 1',
      title: 'Create a student account',
      desc: 'Register with your verified academic email and institutional details.'
    },
    {
      step: 'Step 2',
      title: 'Select your preferred course',
      desc: 'Choose Coding, Digital Marketing, or both courses depending on your aspirations.'
    },
    {
      step: 'Step 3',
      title: 'Wait for owner approval',
      desc: 'The Platform Owner reviews your credentials to approve your enrollment dossier.'
    },
    {
      step: 'Step 4',
      title: 'Access your approved course materials',
      desc: 'Unlock protected study notes, PDF master manuals, assignments, and mentorship.'
    }
  ];

  return (
    <div className="space-y-16 pb-20 bg-[#FCFAF8] text-[#393333]">
      
      {/* SECTION 2 – HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FCFAF8] to-[#F8F3EE] border-b border-[#EAE1DD] pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Official RM Heaven Crest Lockup */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white border border-[#D6B878]/70 rounded-full shadow-2xs">
                  <BrandLogo variant="emblem" size="xs" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#800020]">
                    {cms.brandName}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-[#702D3D]/80 font-medium border-l border-[#EAE1DD] pl-2">
                    Official Academic Portal
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F8F3EE] border border-[#EAE1DD] rounded-full text-xs font-semibold text-[#800020]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D6B878]" />
                  <span>Autonomous Academic Institute</span>
                </div>
              </div>

              {/* Dynamic Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#393333] tracking-tight font-heading leading-[1.15]">
                {cms.heroHeadline}
              </h1>

              {/* Dynamic Supporting Text */}
              <p className="text-base sm:text-lg text-[#817779] leading-relaxed max-w-xl">
                {cms.heroSubtext}
              </p>

              {/* Buttons: Explore Courses & Create Student Account */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onSelectTab('courses')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold bg-[#800020] hover:bg-[#630018] text-white rounded-xl shadow-md transition-all hover:shadow-lg"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSelectTab('register')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold bg-[#F8F3EE] hover:bg-[#F1E8DC] text-[#702D3D] border border-[#EAE1DD] rounded-xl transition-all shadow-xs"
                >
                  <span>Create Student Account</span>
                </button>
              </div>

              {/* Academic Highlights */}
              <div className="pt-6 border-t border-[#EAE1DD] flex flex-wrap items-center gap-6 text-xs text-[#817779]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#800020]" />
                  <span>Protected Study Notes</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#800020]" />
                  <span>Strict Enrollment Approval</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#800020]" />
                  <span>Code of Conduct Enforced</span>
                </span>
              </div>

            </div>

            {/* Right Mascot Column */}
            <div className="lg:col-span-5 flex justify-center">
              {cms.mascotSettings.visibleInHero && (
                <MascotCharacter variant="hero" />
              )}
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3 – WELCOME AND INSTITUTIONAL INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#EAE1DD] rounded-2xl p-8 sm:p-12 shadow-sm space-y-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#702D3D]">
              Institutional Introduction
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#393333] mt-1">
              {cms.welcomeSection.heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-[#EAE1DD]">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#800020] font-bold text-sm">
                <Compass className="w-5 h-5 text-[#D6B878]" />
                <span>Our Mission</span>
              </div>
              <p className="text-xs text-[#817779] leading-relaxed">
                {cms.welcomeSection.mission}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#800020] font-bold text-sm">
                <Layers className="w-5 h-5 text-[#D6B878]" />
                <span>Teaching Approach</span>
              </div>
              <p className="text-xs text-[#817779] leading-relaxed">
                {cms.welcomeSection.teachingApproach}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#800020] font-bold text-sm">
                <Award className="w-5 h-5 text-[#D6B878]" />
                <span>Learning Opportunities</span>
              </div>
              <p className="text-xs text-[#817779] leading-relaxed">
                {cms.welcomeSection.learningOpportunities}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 – COURSES (Coding & Digital Marketing dynamically loaded) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-[#EAE1DD]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#702D3D]">
              Academic Programs
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#393333] mt-1">
              Dynamic Course Offerings
            </h2>
            <p className="text-xs text-[#817779] mt-1">
              Select Coding, Digital Marketing, or Both Courses. Access to protected notes is granted following Owner approval.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('courses')}
            className="text-xs font-semibold text-[#800020] hover:text-[#630018] flex items-center gap-1"
          >
            <span>View Full Syllabi</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2 Premium Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white border-2 border-[#EAE1DD] hover:border-[#800020]/40 rounded-2xl p-7 shadow-sm transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-[#817779]">
                  <span className="font-semibold text-[#800020]">{course.category}</span>
                  <span className="font-mono text-[11px] bg-[#F8F3EE] px-2 py-0.5 rounded text-[#702D3D]">
                    {course.durationWeeks} Weeks
                  </span>
                </div>

                <h3 className="text-xl font-bold font-heading text-[#393333]">
                  {course.title}
                </h3>

                <p className="text-xs text-[#817779] leading-relaxed">
                  {course.shortDescription}
                </p>

                {/* Modules Snapshot */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-[#393333] block mb-2">
                    Included Curriculum Modules ({course.modules.length}):
                  </span>
                  <div className="space-y-1.5 text-xs text-[#817779]">
                    {course.modules.slice(0, 4).map((mod, mIdx) => (
                      <div key={mIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B878] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{mod.title}</span>
                      </div>
                    ))}
                    {course.modules.length > 4 && (
                      <span className="text-[11px] text-[#702D3D] font-medium pl-5 block">
                        + {course.modules.length - 4} additional advanced modules & practical projects
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-8 pt-5 border-t border-[#EAE1DD] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[#817779]">
                  <Lock className="w-3.5 h-3.5 text-[#800020]" />
                  <span>Protected Study Notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectCourse(course)}
                    className="px-4 py-2 text-xs font-medium text-[#393333] bg-[#F8F3EE] hover:bg-[#F1E8DC] border border-[#EAE1DD] rounded-lg transition-colors"
                  >
                    View Syllabi
                  </button>
                  <button
                    onClick={() => onSelectTab('register')}
                    className="px-4 py-2 text-xs font-semibold bg-[#800020] hover:bg-[#630018] text-white rounded-lg transition-colors shadow-xs"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Executive Tech Mentor Spotlight Card */}
        <div className="bg-gradient-to-r from-white via-[#F8F3EE] to-white border-2 border-[#D6B878]/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative w-28 h-40 sm:w-36 sm:h-48 rounded-2xl overflow-hidden bg-white border-2 border-[#D6B878] shrink-0 shadow-md">
              <img
                src="/assets/aistudio/Confident_Lion_Executive_with_Laptop_2cf6151e.png"
                alt="RM Heaven Executive Lion Mentor with Laptop"
                className="w-full h-full object-contain p-1 hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#EAE1DD] rounded-full text-xs font-semibold text-[#800020]">
                <Sparkles className="w-3.5 h-3.5 text-[#D6B878]" />
                <span>Hands-On Industry Mentorship</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#393333]">
                Learn directly with practical laptop-first coursework
              </h3>
              <p className="text-xs text-[#817779] leading-relaxed">
                Every enrolled scholar works on real-world Git repositories, production deployments, and analytical performance marketing. Your assignments are reviewed individually by verified academic mentors.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="text-[11px] font-bold text-[#800020] bg-white px-2.5 py-1 rounded-md border border-[#EAE1DD]">
                  ✓ Verified Capstones
                </span>
                <span className="text-[11px] font-bold text-[#702D3D] bg-white px-2.5 py-1 rounded-md border border-[#EAE1DD]">
                  ✓ Code Review & Graded Feedback
                </span>
                <span className="text-[11px] font-bold text-[#393333] bg-white px-2.5 py-1 rounded-md border border-[#EAE1DD]">
                  ✓ Research Fellowships
                </span>
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <button
              onClick={() => onSelectTab('register')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold bg-[#800020] hover:bg-[#630018] text-white rounded-xl shadow-md transition-all hover:shadow-lg whitespace-nowrap"
            >
              <span>Apply for Enrollment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5 – STUDENT DISCIPLINE AND CODE OF CONDUCT (CRITICAL: Visible on homepage!) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F8F3EE] border-2 border-[#EAE1DD] rounded-2xl p-8 sm:p-12 shadow-sm space-y-8">
          
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#800020]">
              <ShieldCheck className="w-4 h-4 text-[#D6B878]" />
              <span>Institutional Policy & Governance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#393333]">
              Student Discipline & Code of Conduct
            </h2>
            <p className="text-sm font-semibold text-[#702D3D]">
              Learn with Responsibility. Grow with Integrity.
            </p>
            <p className="text-xs text-[#817779] leading-relaxed">
              Every student enrolled on this platform is held to the highest standard of academic honesty, professional demeanor, and mutual respect. Familiarize yourself with our 10 foundational behavioral mandates:
            </p>
          </div>

          {/* 10 Expected Behaviours Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {disciplineBehaviors.map((item) => (
              <div
                key={item.num}
                className="bg-white border border-[#EAE1DD] rounded-xl p-4 shadow-2xs space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#800020] bg-[#F8F3EE] px-2 py-0.5 rounded">
                    {item.num}
                  </span>
                  <h3 className="text-xs font-bold text-[#393333]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-[#817779] leading-relaxed pl-8">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Button: Read Complete Student Discipline Policy */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#EAE1DD]">
            <p className="text-xs text-[#817779]">
              Policy Version: <strong>1.8-ACAD</strong> · Governed by the Academic Disciplinary Board
            </p>
            <button
              onClick={() => onSelectTab('discipline')}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold bg-[#702D3D] hover:bg-[#592330] text-white rounded-xl shadow-xs transition-colors"
            >
              <span>Read Complete Student Discipline Policy</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 6 – TERMS AND CONDITIONS NOTICE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#800020] block">
              Pre-Registration Advisory
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#393333] font-heading">
              Terms & Conditions Notice
            </h3>
            <p className="text-xs text-[#817779] leading-relaxed">
              Before registering, students are expected to understand and accept the platform's Terms and Conditions, Privacy Policy and Student Code of Conduct.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onSelectTab('terms')}
              className="px-3.5 py-2 text-xs font-medium bg-[#F8F3EE] hover:bg-[#F1E8DC] text-[#393333] border border-[#EAE1DD] rounded-lg transition-colors"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => onSelectTab('discipline')}
              className="px-3.5 py-2 text-xs font-medium bg-[#F8F3EE] hover:bg-[#F1E8DC] text-[#702D3D] border border-[#EAE1DD] rounded-lg transition-colors"
            >
              Student Discipline Policy
            </button>
            <button
              onClick={() => onSelectTab('privacy')}
              className="px-3.5 py-2 text-xs font-medium bg-[#F8F3EE] hover:bg-[#F1E8DC] text-[#393333] border border-[#EAE1DD] rounded-lg transition-colors"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 7 – HOW IT WORKS (4 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#702D3D]">
            Simple Admission Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#393333] mt-1">
            How Platform Enrollment Works
          </h2>
          <p className="text-xs text-[#817779] mt-1">
            Four clear steps from registration to verified course material access.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorksSteps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-xs space-y-3 relative"
            >
              <div className="w-9 h-9 rounded-full bg-[#800020] text-white flex items-center justify-center font-bold text-xs">
                0{idx + 1}
              </div>
              <h3 className="text-sm font-bold text-[#393333]">
                {s.title}
              </h3>
              <p className="text-xs text-[#817779] leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8 – INTERNSHIP OPPORTUNITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-[#EAE1DD]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#702D3D]">
              Career Pathways
            </span>
            <h2 className="text-2xl font-bold font-heading text-[#393333] mt-1">
              Active Internship Opportunities
            </h2>
            <p className="text-xs text-[#817779] mt-0.5">
              Practical industry projects and research placements for enrolled scholars.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('internships')}
            className="text-xs font-semibold text-[#800020] hover:underline"
          >
            Explore All Listings →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {internships.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-[#817779] mb-1">
                  <span className="font-semibold text-[#800020]">{item.department}</span>
                  <span>·</span>
                  <span>{item.workMode}</span>
                  <span>·</span>
                  <span>{item.duration}</span>
                </div>
                <h3 className="text-base font-bold text-[#393333]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#817779] mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.skills.map((sk, sIdx) => (
                    <span key={sIdx} className="text-[10px] bg-[#F8F3EE] text-[#702D3D] px-2 py-0.5 rounded border border-[#EAE1DD]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE1DD] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#817779]">
                  Deadline: <strong className="text-[#393333]">{item.deadline}</strong>
                </span>
                <button
                  onClick={() => onSelectTab('internships')}
                  className="px-3.5 py-1.5 font-semibold text-xs bg-[#702D3D] hover:bg-[#800020] text-white rounded-lg transition-colors"
                >
                  View & Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9 – LEARNING RESOURCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-[#EAE1DD]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#702D3D]">
              Study Materials
            </span>
            <h2 className="text-2xl font-bold font-heading text-[#393333] mt-1">
              Protected Study Notes & PDF Handbooks
            </h2>
            <p className="text-xs text-[#817779] mt-0.5">
              Original academic notes, code documentation, and field manuals available for approved scholars.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('resources')}
            className="text-xs font-semibold text-[#800020] hover:underline"
          >
            Access Study Vault →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pdfDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-[#EAE1DD] rounded-xl p-5 shadow-xs flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F8F3EE] text-[#800020] flex items-center justify-center shrink-0 border border-[#EAE1DD]">
                <FileText className="w-6 h-6 text-[#D6B878]" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#702D3D] font-bold">
                  {doc.fileSize} · PDF Document
                </span>
                <h3 className="text-sm font-bold text-[#393333]">
                  {doc.title}
                </h3>
                <p className="text-xs text-[#817779] leading-relaxed">
                  {doc.description}
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#800020] font-semibold">
                    <Lock className="w-3 h-3" />
                    <span>Protected Document (Requires Approved Enrollment)</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 10 – CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#702D3D] via-[#800020] to-[#630018] text-white rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-xl relative overflow-hidden">
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
              Your Future Starts With What You Learn Today.
            </h2>
            <p className="text-xs sm:text-sm text-[#F1E8DC] leading-relaxed">
              Join a disciplined, high-achievement academic community. Register your individual student account and submit your enrollment request today.
            </p>
            <div className="pt-4 flex justify-center">
              <button
                onClick={() => onSelectTab('register')}
                className="px-8 py-3.5 text-sm font-bold bg-[#D6B878] hover:bg-[#E8D4A6] text-[#393333] rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
