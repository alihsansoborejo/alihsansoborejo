import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { Trophy, Award, Medal, Calendar, MapPin, Sparkles } from 'lucide-react';

export const AchievementsSection: React.FC = () => {
  const { achievements } = useDataContext();
  const [filterCategory, setFilterCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Tahfidz & Keagamaan', 'Seni & Budaya', 'Akademik & Sains', 'Olahraga & Kepanduan'];

  const filteredAchievements = filterCategory === 'Semua'
    ? achievements
    : achievements.filter(item => item.category === filterCategory);

  return (
    <section id="prestasi" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase font-bold tracking-widest text-[#0b3c26] bg-[#e8f3ee] px-3.5 py-1 rounded-full inline-block mb-3 border border-[#0b3c26]/20">
          KEBANGGAAN MADRASAH
        </span>
        <h3 className="font-heading text-2xl sm:text-4xl font-bold text-[#072217] tracking-tight">
          Prestasi & Jejak Juara Santri
        </h3>
        <p className="font-body text-sm sm:text-base text-gray-600 mt-2">
          Bukti nyata dedikasi santri dan bimbingan penuh kasih ustadz/ustadzah MI Ma'arif Al Ihsan Soborejo di tingkat kecamatan hingga kabupaten.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              filterCategory === cat
                ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-md border border-[#d4af37]/40'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Achievements Cards */}
      {filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredAchievements.map((item) => (
            <div
              key={item.id}
              id={`achievement-${item.id}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image with Trophy Ribbon */}
                <div className="relative h-44 overflow-hidden bg-emerald-900">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0b3c26] to-[#072217] text-[#d4af37]">
                      <Trophy className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Gold Rank Badge */}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-[#d4af37] to-[#b89228] text-[#072217] px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1 shadow-md">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{item.rank}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#f3e5ab] bg-[#072217]/80 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Text Info */}
                <div className="p-5 space-y-3">
                  <h4 className="font-heading text-base sm:text-lg font-bold text-[#072217] group-hover:text-[#0b3c26] transition-colors leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <Medal className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span className="truncate">{item.winner}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Tahun {item.year}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 text-[#0b3c26] font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Tingkat {item.level}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="bg-[#f8faf9] rounded-xl p-2.5 text-[11px] text-emerald-900 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3 h-3 text-[#d4af37]" />
                    Apresiasi Santri
                  </span>
                  <span className="text-gray-500 text-[10px]">Madrasah Ma'arif</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center max-w-xl mx-auto border border-gray-100 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#0b3c26] flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-7 h-7 text-[#d4af37]" />
          </div>
          <h4 className="font-heading font-bold text-lg text-[#072217]">Data Prestasi Belum Ditambahkan</h4>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
            Daftar perolehan kejuaraan dan capaian membanggakan santri MI Ma'arif Al Ihsan Soborejo akan ditampilkan di sini.
          </p>
        </div>
      )}
    </section>
  );
};
