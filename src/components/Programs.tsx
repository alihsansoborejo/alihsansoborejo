import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { ProgramItem } from '../types';
import { BookOpen, Cpu, Languages, HeartHandshake, CheckCircle2, ArrowRight, X, Clock, Target, Sparkles, Palette, GraduationCap, BookOpenCheck, School } from 'lucide-react';

interface ProgramsProps {
  onRegisterProgram?: (programTitle: string) => void;
}

export const Programs: React.FC<ProgramsProps> = ({ onRegisterProgram }) => {
  const { programs } = useDataContext();
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'RA' | 'MI' | 'Satu Atap'>('ALL');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-8 h-8" />;
      case 'Palette':
        return <Palette className="w-8 h-8" />;
      case 'GraduationCap':
        return <GraduationCap className="w-8 h-8" />;
      case 'BookOpenCheck':
        return <BookOpenCheck className="w-8 h-8" />;
      case 'BookOpen':
        return <BookOpen className="w-8 h-8" />;
      case 'Cpu':
        return <Cpu className="w-8 h-8" />;
      case 'Languages':
        return <Languages className="w-8 h-8" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-8 h-8" />;
      default:
        return <BookOpen className="w-8 h-8" />;
    }
  };

  const filteredPrograms = programs.filter((p) => {
    if (filterLevel === 'ALL') return true;
    if (filterLevel === 'RA') return p.institutionLevel === 'RA';
    if (filterLevel === 'MI') return p.institutionLevel === 'MI';
    if (filterLevel === 'Satu Atap') return p.institutionLevel === 'Satu Atap' || !p.institutionLevel;
    return true;
  });

  return (
    <section id="program" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#d4af37] uppercase mb-2 block">
          Pendidikan Berkualitas &amp; Terintegrasi
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl text-[#072217] font-bold relative inline-block">
          Program Unggulan Satu Atap
        </h2>
        <div className="w-16 h-1 bg-[#d4af37] mx-auto mt-4 rounded-full" />
        <p className="font-body text-sm sm:text-base text-[#52635c] mt-4">
          Kurikulum berkesinambungan sejak prasekolah Raudhatul Athfal (RA) hingga Madrasah Ibtidaiyah (MI) Al Ihsan Soborejo.
        </p>
      </div>

      {/* Filter Tabs by Institution Level */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
        <button
          type="button"
          onClick={() => setFilterLevel('ALL')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            filterLevel === 'ALL'
              ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Semua Jenjang ({programs.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterLevel('RA')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            filterLevel === 'RA'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          Jenjang RA Al Ihsan (PAUD)
        </button>
        <button
          type="button"
          onClick={() => setFilterLevel('MI')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            filterLevel === 'MI'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          Jenjang MI Ma'arif (Kelas 1-6)
        </button>
        <button
          type="button"
          onClick={() => setFilterLevel('Satu Atap')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            filterLevel === 'Satu Atap'
              ? 'bg-[#072217] text-[#d4af37] border border-[#d4af37] shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Program Bersama (Satu Atap)
        </button>
      </div>

      {/* Programs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredPrograms.map((prog) => (
          <div
            key={prog.id}
            id={`program-card-${prog.id}`}
            className="group bg-white rounded-2xl p-7 border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(11,60,38,0.15)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top gradient border line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#0b3c26] to-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div>
              {/* Badges: Level & Category */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                {prog.institutionLevel === 'RA' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300/80 px-2 py-0.5 rounded-full">
                    Jenjang RA
                  </span>
                )}
                {prog.institutionLevel === 'MI' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 border border-emerald-300/80 px-2 py-0.5 rounded-full">
                    Jenjang MI
                  </span>
                )}
                {(!prog.institutionLevel || prog.institutionLevel === 'Satu Atap') && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#072217] bg-[#e8f3ee] border border-[#0b3c26]/30 px-2 py-0.5 rounded-full">
                    Satu Atap
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded-full">
                  {prog.category}
                </span>
              </div>

              {/* Icon Container */}
              <div className="w-16 h-16 rounded-xl bg-[#0b3c26]/5 text-[#0b3c26] group-hover:bg-[#0b3c26] group-hover:text-[#d4af37] flex items-center justify-center mb-6 transition-colors duration-300 shadow-sm">
                {getIcon(prog.iconName)}
              </div>

              {/* Title & Short Description */}
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#072217] mb-3 leading-snug">
                {prog.title}
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#52635c] leading-relaxed mb-6">
                {prog.shortDesc}
              </p>
            </div>

            {/* Read More Trigger Button */}
            <button
              id={`program-detail-btn-${prog.id}`}
              onClick={() => setSelectedProgram(prog)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0b3c26] group-hover:text-[#d4af37] transition-colors mt-2"
            >
              <span>Detail Kurikulum &amp; Target</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div
          id="program-detail-modal-backdrop"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedProgram(null)}
        >
          <div
            id="program-detail-modal-content"
            className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#d4af37]/30 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="program-modal-close-btn"
              onClick={() => setSelectedProgram(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#0b3c26] text-[#d4af37] flex items-center justify-center shrink-0">
                {getIcon(selectedProgram.iconName)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                    {selectedProgram.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    {selectedProgram.institutionLevel === 'RA'
                      ? 'Jenjang RA'
                      : selectedProgram.institutionLevel === 'MI'
                      ? 'Jenjang MI'
                      : 'Satu Atap (RA & MI)'}
                  </span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#072217]">
                  {selectedProgram.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {selectedProgram.fullDesc}
            </p>

            <div className="bg-[#f8faf9] p-4 rounded-xl border border-gray-100 mb-6 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#072217]">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <span>Waktu &amp; Jadwal: {selectedProgram.schedule || selectedProgram.duration || 'Sesuai Kalender Akademik'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#072217]">
                <Target className="w-4 h-4 text-[#d4af37]" />
                <span>Output Lulusan: {selectedProgram.target}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#072217] mb-3">
                Keunggulan &amp; Metode Pembelajaran:
              </h4>
              <ul className="space-y-2.5">
                {selectedProgram.highlights.map((point, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#0b3c26] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button
                id="program-modal-apply-btn"
                onClick={() => {
                  const title = selectedProgram.title;
                  setSelectedProgram(null);
                  if (onRegisterProgram) onRegisterProgram(title);
                }}
                className="flex-1 py-3 bg-gradient-to-r from-[#d4af37] to-[#b89228] text-[#072217] font-bold text-xs uppercase tracking-wider rounded-xl hover:shadow-lg transition-all"
              >
                Pilih Program Ini di PPDB
              </button>
              <button
                id="program-modal-dismiss-btn"
                onClick={() => setSelectedProgram(null)}
                className="px-5 py-3 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
