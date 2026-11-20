import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { getCourseThumbnail } from '../../constants/legal';
import { BrandImage, EmptyState, LoadingState } from '../../components/BrandAssets';
import { RM_DEPARTMENTS } from '../../data/curriculum/departments';
import type { Course, Department } from '../../types';

export function CoursesPage({
  departments = [],
  courses,
  loading,
}: {
  departments?: Department[];
  courses: Course[];
  loading: boolean;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDept = searchParams.get('dept') || 'All';

  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>(initialDept);

  useEffect(() => {
    const paramDept = searchParams.get('dept');
    if (paramDept) {
      setDepartmentFilter(paramDept);
    }
  }, [searchParams]);

  const activeDepartments = useMemo(() => {
    if (departments.length > 0) return departments;
    return RM_DEPARTMENTS.map((d) => ({ ...d, createdAt: null, updatedAt: null }));
  }, [departments]);

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Executive'];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((c) => {
      const matchesLevel = levelFilter === 'All' || c.level === levelFilter;
      const matchesDept =
        departmentFilter === 'All' ||
        c.departmentId === departmentFilter ||
        c.departmentName === departmentFilter ||
        c.category === departmentFilter ||
        activeDepartments.some(
          (d) => d.id === departmentFilter && (c.departmentId === d.id || c.category === d.name),
        );
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.shortDescription.toLowerCase().includes(q) ||
        (c.departmentName || c.category).toLowerCase().includes(q);
      return matchesLevel && matchesDept && matchesSearch;
    });
  }, [courses, search, levelFilter, departmentFilter, activeDepartments]);

  const handleSelectDept = (deptId: string) => {
    setDepartmentFilter(deptId);
    if (deptId === 'All') {
      searchParams.delete('dept');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ dept: deptId }, { replace: true });
    }
  };

  return (
    <div className="min-h-[75vh] bg-[#F8F4ED] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-[#761D2D] uppercase">
              Academic Catalogue
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-[#292323] sm:text-5xl">
              Structured Online Courses
            </h1>
            <p className="mt-3 text-base leading-relaxed text-[#292323]/75">
              Explore RM HEAVEN programmes organized across four dedicated departments, complete with structured lessons, detailed 11-section study notes, quizzes, and guided AI tutoring.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#761D2D]">
            <Sparkles className="h-4 w-4" />
            <span>{filtered.length} {filtered.length === 1 ? 'Course' : 'Courses'} Available</span>
          </div>
        </div>

        {/* Department Filter Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleSelectDept('All')}
            className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition ${
              departmentFilter === 'All'
                ? 'border-[#761D2D] bg-[#761D2D] text-white'
                : 'border-[#292323]/12 bg-white text-[#292323] hover:border-[#761D2D]/40'
            }`}
          >
            All Departments ({courses.length})
          </button>
          {activeDepartments.map((dept) => {
            const count = courses.filter(
              (c) => c.departmentId === dept.id || c.category === dept.name,
            ).length;
            const active = departmentFilter === dept.id || departmentFilter === dept.name;
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => handleSelectDept(dept.id)}
                className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition ${
                  active
                    ? 'border-[#761D2D] bg-[#761D2D] text-white'
                    : 'border-[#292323]/12 bg-white text-[#292323] hover:border-[#761D2D]/40'
                }`}
              >
                {dept.name} {count > 0 ? `(${count})` : ''}
              </button>
            );
          })}
        </div>

        {/* Search & Level Filter Controls */}
        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-[#292323]/10 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#292323]/45" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses by title, topic, or department..."
              className="w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 py-2 pl-10 pr-4 text-sm text-[#292323] placeholder:text-[#292323]/45 focus:border-[#761D2D] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#F8F4ED] p-1">
            {levels.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevelFilter(lvl)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  levelFilter === lvl
                    ? 'bg-[#761D2D] text-white'
                    : 'text-[#292323]/75 hover:text-[#292323]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <LoadingState message="Loading published courses..." />
          ) : filtered.length === 0 ? (
            <EmptyState
              title={courses.length === 0 ? 'No Courses Published Yet' : 'No Matching Courses'}
              description={
                courses.length === 0
                  ? 'The live Firestore catalogue has not been initialized yet. Sign in with the Administrator account at /login and open /admin to automatically sync all 4 departments, 31 courses, 155 modules, 465 lessons, and 62 study notes.'
                  : 'Try adjusting your search keywords, department tab, or level filter.'
              }
              actionLabel={courses.length > 0 ? 'Reset Filters' : undefined}
              onAction={
                courses.length > 0
                  ? () => {
                      setSearch('');
                      setLevelFilter('All');
                      handleSelectDept('All');
                    }
                  : undefined
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course) => (
                <article
                  key={course.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-[#292323]/10 bg-white transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[#292323]/5">
                    <BrandImage
                      src={getCourseThumbnail(course)}
                      alt={course.title}
                      fallbackTitle={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#761D2D]">
                      <span>{course.departmentName || course.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{course.level}</span>
                      <span aria-hidden="true">·</span>
                      <span>{course.duration}</span>
                    </div>
                    <h2 className="mt-2 font-display text-2xl font-semibold text-[#292323]">
                      {course.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[#292323]/75">
                      {course.shortDescription}
                    </p>
                    <div className="mt-5 border-t border-[#292323]/10 pt-4">
                      <Link
                        to={`/courses/${course.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#761D2D] hover:text-[#8F2638]"
                      >
                        Course Details <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
