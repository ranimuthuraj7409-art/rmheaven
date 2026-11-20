import React from 'react';
import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';
import type { Certificate } from '../types';
import { formatTimestamp } from '../firebase/services';

export function CertificatePdfButton({ certificate }: { certificate: Certificate }) {
  const handleDownload = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    // Warm Ivory background
    doc.setFillColor(248, 244, 237);
    doc.rect(0, 0, w, h, 'F');

    // Outer Deep Maroon Frame
    doc.setDrawColor(118, 29, 45);
    doc.setLineWidth(14);
    doc.rect(24, 24, w - 48, h - 48);

    // Inner Champagne Gold Frame
    doc.setDrawColor(213, 183, 122);
    doc.setLineWidth(2);
    doc.rect(40, 40, w - 80, h - 80);

    // Brand Heading
    doc.setTextColor(118, 29, 45);
    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.text('RM HEAVEN', w / 2, 95, { align: 'center' });

    doc.setTextColor(41, 35, 35);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('ONLINE LEARNING & INTERNSHIP ACADEMY', w / 2, 116, { align: 'center' });

    // Certificate Title
    doc.setTextColor(143, 38, 56);
    doc.setFont('times', 'bold');
    doc.setFontSize(34);
    doc.text(
      certificate.programType === 'Internship'
        ? 'Certificate of Internship Completion'
        : 'Certificate of Academic Achievement',
      w / 2,
      178,
      { align: 'center' },
    );

    doc.setTextColor(41, 35, 35);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.text('This official credential is proudly awarded to', w / 2, 224, { align: 'center' });

    // Recipient Name
    doc.setTextColor(118, 29, 45);
    doc.setFont('times', 'bold');
    doc.setFontSize(32);
    doc.text(certificate.studentName, w / 2, 274, { align: 'center' });

    doc.setDrawColor(213, 183, 122);
    doc.setLineWidth(1.5);
    doc.line(w / 2 - 180, 288, w / 2 + 180, 288);

    // Program Title
    doc.setTextColor(41, 35, 35);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.text(
      `for successfully fulfilling all academic requirements of the ${certificate.programType.toLowerCase()} programme`,
      w / 2,
      324,
      { align: 'center' },
    );

    doc.setFont('times', 'bold');
    doc.setFontSize(20);
    doc.text(certificate.programTitle, w / 2, 360, { align: 'center' });

    // Verification & Date Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(41, 35, 35);
    doc.text(`Issued On: ${formatTimestamp(certificate.issuedAt)}`, 90, h - 92);
    doc.text(`Certificate ID: ${certificate.certificateCode}`, w / 2, h - 92, { align: 'center' });
    doc.text(`Status: ${certificate.status}`, w - 90, h - 92, { align: 'right' });

    doc.setFontSize(9);
    doc.setTextColor(118, 29, 45);
    doc.text(
      'Verify authenticity anytime at RM HEAVEN Certificate Verification Portal.',
      w / 2,
      h - 62,
      { align: 'center' },
    );

    doc.save(`RM_HEAVEN_${certificate.certificateCode}.pdf`);
  };

  if (!certificate.downloadAllowed || certificate.status !== 'Valid') {
    return (
      <span className="text-xs font-medium text-[#292323]/55">
        {certificate.status === 'Revoked' ? 'Certificate Revoked' : 'Download restricted by admin'}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-1.5 rounded-lg bg-[#761D2D] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#8F2638] transition-colors whitespace-nowrap"
    >
      <Download className="h-3.5 w-3.5" />
      Download PDF
    </button>
  );
}
