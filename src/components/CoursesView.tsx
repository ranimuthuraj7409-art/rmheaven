import React, { useState } from 'react';
import { Course, NavigationTab } from '../types';
import { BookOpen, CheckCircle2, Lock, ArrowRight, Clock, Users, ChevronRight } from 'lucide-react';

interface CoursesViewProps {
  courses: Course[];
  onSelectTab: (tab: NavigationTab) => void;
  onRequestEnrollment: (courseTitle: string) => void;
  brandName: string;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  onSelectTab,
  onRequestEnrollment,
  brandName
}) => {
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(courses[0]?.id || null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#FCFAF8] text-[#393333]">
      
      {/* Header */}
      <div className="border-b border-[#EAE1DD] pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#800020]">
          Academic Syllabi & Curriculum
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#393333]">
          Dynamic Academic Courses
        </h1>
        <p className="text-xs sm:text-sm text-[#817779] max-w-3xl leading-relaxed">
          Comprehensive, industry-aligned programs in Coding and Digital Marketing. Access to complete study notes and PDF handbooks requires formal Owner enrollment approval.
        </p>
      </div>

      {/* Mentor Welcome Banner with Confident Lion Executive */}
      <div className="bg-gradient-to-r from-white via-[#F8F3EE] to-white border-2 border-[#D6B878]/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative w-24 h-36 sm:w-28 sm:h-40 rounded-2xl overflow-hidden bg-white border-2 border-[#D6B878] shrink-0 shadow-sm">
            <img
              src="/assets/aistudio/Confident_Lion_Executive_with_Laptop_2cf6151e.png"
              alt="RM Heaven Executive Tech Mentor with Laptop"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#800020] bg-[#EAD5D8]/50 px-2.5 py-0.5 rounded inline-block">
              Faculty & Technical Mentorship
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-[#393333]">
              Hands-On Projects · Real Code Execution
            </h3>
            <p className="text-xs text-[#817779] leading-relaxed">
              Explore the detailed weekly modules below. Once your enrollment request is approved by the Platform Owner, all protected study notes, code examples, practice questions, and downloadable PDF manuals are instantly unlocked.
            </p>
          </div>
        </div>
        <button
          onClick={() => onSelectTab('register')}
          className="px-5 py-2.5 text-xs font-bold bg-[#800020] hover:bg-[#630018] text-white rounded-xl shadow-xs transition-colors whitespace-nowrap"
        >
          Request Course Approval
        </button>
      </div>

      {/* Courses Detailed Cards */}
      <div className="space-y-10">
        {courses.map((course) => {
          const isExpanded = expandedCourseId === course.id;

          return (
            <div
              key={course.id}
              className="bg-white border-2 border-[#EAE1DD] rounded-2xl p-6 sm:p-10 shadow-sm space-y-6"
            >
              {/* Top Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EAE1DD]">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#817779] mb-1">
                    <span className="font-bold text-[#800020] uppercase">{course.category}</span>
                    <span>·</span>
                    <span className="font-mono">{course.durationWeeks} Weeks Full Duration</span>
                    <span>·</span>
                    <span>Level: {course.level}</span>
                  </div>
                  <h2 className="text-2xl font-bold font-heading text-[#393333]">
                    {course.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSelectTab('register')}
                    className="px-5 py-2.5 text-xs font-semibold bg-[#800020] hover:bg-[#630018] text-white rounded-xl shadow-xs transition-colors"
                  >
                    Apply for Enrollment
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#817779] leading-relaxed">
                {course.fullDescription}
              </p>

              {/* Modules Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#702D3D]">
                    Curriculum Modules & Study Notes ({course.modules.length} Modules):
                  </h3>
                  <span className="text-[11px] text-[#817779] flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#800020]" />
                    <span>Protected Study Notes</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {course.modules.map((mod) => (
                    <div
                      key={mod.id}
                      className="p-4 bg-[#FCFAF8] border border-[#EAE1DD] rounded-xl space-y-2 hover:border-[#800020]/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-[#393333] text-xs">{mod.title}</span>
                        <span className="text-[10px] font-mono text-[#800020] bg-[#F8F3EE] px-1.5 py-0.5 rounded">
                          {mod.lessons.length} Note(s)
                        </span>
                      </div>
                      <p className="text-[11px] text-[#817779] leading-relaxed">
                        {mod.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protection Notice */}
              <div className="p-4 bg-[#F8F3EE] border border-[#EAE1DD] rounded-xl flex items-center justify-between text-xs text-[#817779]">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#800020] shrink-0" />
                  <span>
                    Study notes, code walkthroughs, and assignments are protected under platform security.
                  </span>
                </div>
                <button
                  onClick={() => onSelectTab('register')}
                  className="font-semibold text-[#800020] hover:underline"
                >
                  Create Student Account to Request Access →
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
