import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { Info, PlusCircle, Sparkles } from 'lucide-react';

export const Stats: React.FC = () => {
  const { statsList, isAdmin, setViewMode } = useDataContext();
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  if (!statsList || statsList.length === 0) {
    if (isAdmin) {
      return (
        <div id="stats-section" className="-mt-10 sm:-mt-12 relative z-20 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#d4af37]/40 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#0b3c26]/10 flex items-center justify-center text-[#0b3c26] shrink-0">
                <Sparkles className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#072217]">Data Statistik Madrasah</h4>
                <p className="text-xs text-gray-600">
                  Data dummy telah dibersihkan. Anda dapat menambahkan angka statistik riil (jumlah santri, guru, kelulusan, dsb).
                </p>
              </div>
            </div>
            <button
              onClick={() => setViewMode('admin')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0b3c26] text-white text-xs font-semibold hover:bg-[#072217] transition shadow shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-[#d4af37]" />
              <span>Kelola Statistik di Admin</span>
            </button>
          </div>
        </div>
      );
    }
    return null;
  }

  const gridColsClass =
    statsList.length === 1
      ? 'grid-cols-1 max-w-md'
      : statsList.length === 2
      ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl'
      : statsList.length === 3
      ? 'grid-cols-1 sm:grid-cols-3 max-w-4xl'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl';

  return (
    <div id="stats-section" className="-mt-14 sm:-mt-16 relative z-20 mx-auto px-4 sm:px-6">
      <div className={`bg-white rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[#d4af37]/25 grid ${gridColsClass} mx-auto gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100`}>
        {statsList.map((stat, idx) => (
          <div
            key={stat.id ? `stat-item-${stat.id}-${idx}` : `stat-item-${idx}`}
            id={`stat-card-${idx}`}
            className="text-center px-4 pt-4 sm:pt-0 first:pt-0 group relative cursor-pointer"
            onMouseEnter={() => setActiveTooltip(idx)}
            onMouseLeave={() => setActiveTooltip(null)}
            onClick={() => setActiveTooltip(activeTooltip === idx ? null : idx)}
          >
            <div className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0b3c26] tracking-tight group-hover:scale-105 transition-transform duration-300">
              {stat.value}
              {stat.suffix && <span className="text-[#d4af37] ml-0.5">{stat.suffix}</span>}
            </div>

            <div className="text-xs sm:text-sm font-semibold text-[#52635c] mt-2 group-hover:text-[#072217] transition-colors flex items-center justify-center gap-1">
              <span>{stat.label}</span>
              {stat.detail && <Info className="w-3 h-3 text-[#d4af37] opacity-60 group-hover:opacity-100" />}
            </div>

            {/* Interactive explanatory detail */}
            {stat.detail && (
              <div
                className={`mt-2 text-[11px] text-gray-500 leading-snug transition-all duration-300 ${
                  activeTooltip === idx ? 'opacity-100 max-h-20' : 'opacity-70 max-h-12'
                }`}
              >
                {stat.detail}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
