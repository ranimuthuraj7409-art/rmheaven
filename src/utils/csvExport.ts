import { InternshipApplication } from '../types';

export function exportApplicationsToCSV(applications: InternshipApplication[]): void {
  const headers = [
    'Application ID',
    'Internship ID',
    'Internship Title',
    'Student Name',
    'Student Email',
    'Student Phone',
    'College / Institute',
    'Resume File',
    'Statement of Purpose',
    'Status',
    'Applied Date',
    'Mentor Feedback'
  ];

  const rows = applications.map(app => [
    `"${app.id}"`,
    `"${app.internshipId}"`,
    `"${(app.internshipTitle || '').replace(/"/g, '""')}"`,
    `"${(app.studentName || '').replace(/"/g, '""')}"`,
    `"${app.studentEmail || ''}"`,
    `"${app.studentPhone || ''}"`,
    `"${(app.studentCollege || '').replace(/"/g, '""')}"`,
    `"${(app.resumeFileName || '').replace(/"/g, '""')}"`,
    `"${(app.statementOfPurpose || '').replace(/"/g, '""')}"`,
    `"${app.status}"`,
    `"${app.appliedDate}"`,
    `"${(app.feedback || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Academic_Internship_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

