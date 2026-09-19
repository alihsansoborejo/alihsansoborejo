import React, { useState, useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import { useShare } from '../context/ShareContext';
import { AchievementItem } from '../types';
import { Trophy, Award, Medal, Calendar, MapPin, Sparkles, Share2, X, CheckCircle2 } from 'lucide-react';

export const AchievementsSection: React.FC = () => {
  const { achievements } = useDataContext();
  const { activeDeepLink, consumeDeepLink, openShare } = useShare();
  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementItem | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Auto-respond to deep links
  useEffect(() => {
    if (activeDeepLink && activeDeepLink.type === 'prestasi' && activeDeepLink.id) {
      const match = achievements.find(
        (item) =>
          item.id === activeDeepLink.id ||
          item.title.toLowerCase().includes(activeDeepLink.id!.toLowerCase()) ||
          item.winner.toLowerCase().includes(activeDeepLink.id!.toLowerCase())
      );
      if (match) {
        setSelectedAchievement(match);
        setHighlightedId(match.id);
        consumeDeepLink();

        setTimeout(() => {
          const el = document.getElementById(`achievement-${match.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    }
  }, [activeDeepLink, achievements, consumeDeepLink]);

  const categories = ['Semua', 'Tahfidz & Keagamaan', 'Seni & Budaya', 'Akademik & Sains', 'Olahraga & Kepanduan'];

  const filteredAchievements = filterCategory === 'Semua'
    ? achievements
    : achievements.filter(item => item.category === filterCategory);

  const handleShareAchievement = (item: AchievementItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    openShare({
      type: 'prestasi',
      id: item.id,
      title: `${item.rank}: ${item.title}`,
      description: `Diraih oleh ${item.winner} pada tingkat ${item.level} (Tahun ${item.year}). ${item.description}`,
      category: item.category,
      imageUrl: item.imageUrl,
    });
  };

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
          Bukti nyata dedikasi santri dan bimbingan penuh kasih asatidz MI Ma'arif Al Ihsan Soborejo di tingkat kecamatan hingga kabupaten.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
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
              onClick={() => setSelectedAchievement(item)}
              className={`group bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                highlightedId === item.id
                  ? 'ring-4 ring-[#d4af37] border-[#d4af37] -translate-y-1.5 shadow-2xl'
                  : 'border-gray-200/80 hover:-translate-y-1.5'
              }`}
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

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <Medal className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                      <span className="truncate font-semibold text-[#072217]">{item.winner}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>Tahun {item.year}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 text-[#0b3c26] font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                      <span>Tingkat {item.level}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="bg-[#f8faf9] rounded-xl p-2.5 text-[11px] text-emerald-900 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-semibold text-[#0b3c26]">
                    <Sparkles className="w-3 h-3 text-[#d4af37]" />
                    Lihat Detail
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleShareAchievement(item, e)}
                    className="p-1.5 text-gray-400 hover:text-[#0b3c26] hover:bg-emerald-100/60 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-semibold text-[11px]"
                    title="Bagikan Prestasi Ini"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Bagikan</span>
                  </button>
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

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div
          id="achievement-modal-backdrop"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            id="achievement-modal-content"
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#d4af37]/30 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="achievement-modal-close-btn"
              onClick={() => setSelectedAchievement(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/50 text-white hover:bg-black/70 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="h-56 relative bg-emerald-950">
              {selectedAchievement.imageUrl ? (
                <img
                  src={selectedAchievement.imageUrl}
                  alt={selectedAchievement.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0b3c26] to-[#072217] text-[#d4af37]">
                  <Trophy className="w-16 h-16" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gradient-to-r from-[#d4af37] to-[#b89228] text-[#072217] px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1 shadow-md">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{selectedAchievement.rank}</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#f3e5ab] bg-[#072217]/80 px-2.5 py-0.5 rounded-full border border-[#d4af37]/30">
                      {selectedAchievement.category}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white leading-tight">
                    {selectedAchievement.title}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200/70 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Santri Peraih:</span>
                  <span className="font-bold text-[#072217] text-sm flex items-center gap-1 mt-0.5">
                    <Medal className="w-3.5 h-3.5 text-[#d4af37]" />
                    {selectedAchievement.winner}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Tahun Pelaksanaan:</span>
                  <span className="font-bold text-[#072217] text-sm flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    Tahun {selectedAchievement.year}
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-gray-200/60">
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Tingkat Kompetisi:</span>
                  <span className="font-bold text-[#0b3c26] text-sm flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    Tingkat {selectedAchievement.level}
                  </span>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-[#072217] uppercase tracking-wider mb-1">
                  Deskripsi &amp; Cerita Capaian:
                </h5>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {selectedAchievement.description}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  id="achievement-share-modal-btn"
                  onClick={() => handleShareAchievement(selectedAchievement)}
                  className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#0b3c26] border border-emerald-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Bagikan Prestasi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAchievement(null)}
                  className="flex-1 py-2.5 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

