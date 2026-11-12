import React, { useState } from 'react';
import { Announcement, NavigationTab } from '../types';
import { Search, Bell, AlertCircle, Calendar } from 'lucide-react';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  brandName: string;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ announcements, brandName }) => {
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filtered = announcements.filter(ann => {
    const matchesCat = selectedCat === 'All' || ann.category === selectedCat;
    const matchesSearch = !search || 
      ann.title.toLowerCase().includes(search.toLowerCase()) ||
      ann.content.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#FCFAF8] text-[#393333]">
      
      {/* Header */}
      <div className="border-b border-[#EAE1DD] pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#800020]">
          Secretariat Gazette
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#393333]">
          Official Platform Announcements
        </h1>
        <p className="text-xs sm:text-sm text-[#817779] max-w-2xl leading-relaxed">
          Official circulars, enrollment review schedules, policy updates, and academic notifications from the Platform Owner.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#EAE1DD] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Enrollment', 'Academic', 'Assignment', 'Internship'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                selectedCat === cat
                  ? 'border-[#800020] bg-[#F8F3EE] text-[#800020] font-bold'
                  : 'border-[#EAE1DD] text-[#817779] hover:bg-[#FCFAF8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#817779]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search circulars..."
            className="w-full pl-8 pr-3 py-1.5 border border-[#EAE1DD] rounded-lg text-xs bg-[#FCFAF8]"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.map(ann => (
          <div
            key={ann.id}
            className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#EAE1DD]">
              <div className="flex items-center gap-2 text-[#817779]">
                <span className="font-mono text-[#800020] font-semibold">{ann.publishedDate}</span>
                <span>·</span>
                <span className="font-bold text-[#702D3D]">{ann.category} Circular</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                ann.priority === 'Urgent' ? 'bg-[#EAD5D8] text-[#800020]' :
                ann.priority === 'Important' ? 'bg-amber-100 text-amber-800' :
                'bg-[#F8F3EE] text-[#817779]'
              }`}>
                {ann.priority} Notice
              </span>
            </div>

            <h2 className="text-base font-bold font-heading text-[#393333]">
              {ann.title}
            </h2>

            <p className="text-xs text-[#817779] leading-relaxed">
              {ann.content}
            </p>

            <div className="pt-2 text-[11px] text-[#817779] font-mono">
              Issued by: Office of the Platform Owner, {brandName}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
