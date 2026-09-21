import React, { useState, useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import { useShare } from '../context/ShareContext';
import { AchievementItem } from '../types';
import {
  Trophy,
  Award,
  Medal,
  Calendar,
  MapPin,
  Sparkles,
  Share2,
  X,
  ArrowLeft,
  ZoomIn,
  CheckCircle2
} from 'lucide-react';

export const AchievementsSection: React.FC = () => {
  const { achievements } = useDataContext();
  const { activeDeepLink, consumeDeepLink, openShare } = useShare();
  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementItem | null>(null);
  const [sidebarFilter, setSidebarFilter] = useState<string>('Semua');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<AchievementItem | null>(null);

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
          const el = document.getElementById('prestasi');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [activeDeepLink, achievements, consumeDeepLink]);

  const categories = ['Semua', 'Tahfidz & Keagamaan', 'Seni & Budaya', 'Akademik & Sains', 'Olahraga & Kepanduan'];

  const filteredAchievements = filterCategory === 'Semua'
    ? achievements
    : achievements.filter((item) => item.category === filterCategory);

  const handleSelectAchievement = (item: AchievementItem) => {
    setSelectedAchievement(item);
    setTimeout(() => {
      const el = document.getElementById('prestasi');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

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

  // Items for sidebar in showcase view
  const sidebarItems = achievements.filter((item) => {
    if (item.id === selectedAchievement?.id) return false;
    if (sidebarFilter === 'Semua') return true;
    return item.category === sidebarFilter;
  });

  return (
    <section id="prestasi" className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {selectedAchievement ? (
        /* ========================================================================= */
        /* SHOWCASE VIEW (2-Column Showcase matching Galeri layout)                 */
        /* ========================================================================= */
        <div id="prestasi-showcase-view" className="animate-in fade-in duration-300">
          {/* Top Control Bar: Back to Grid & Context Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200">
            <button
              id="back-to-prestasi-grid-btn"
              type="button"
              onClick={() => setSelectedAchievement(null)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#0b3c26] text-[#072217] hover:text-[#f3e5ab] text-xs sm:text-sm font-bold transition-all border border-gray-300 hover:border-[#0b3c26] shadow-xs cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#0b3c26] group-hover:text-[#f3e5ab]" />
              <span>← Kembali ke Semua Prestasi (Grid)</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">Total Jejak Juara:</span>
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#e8f3ee] text-[#0b3c26] border border-emerald-200">
                {achievements.length} Prestasi
              </span>
            </div>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ------------------------------------------------------------- */}
            {/* LEFT COLUMN: PRESTASI UTAMA YANG DITAMPILKAN                  */}
            {/* ------------------------------------------------------------- */}
            <div id="prestasi-main-viewer" className="lg:col-span-7 xl:col-span-8 space-y-5">
              {/* Media Container: Trophy Banner / Photo */}
              <div className="relative w-full aspect-video sm:h-96 rounded-2xl overflow-hidden bg-neutral-950 shadow-xl border border-gray-200/80 flex items-center justify-center group">
                {selectedAchievement.imageUrl ? (
                  <>
                    {/* Blurred backdrop for fitting all aspect ratios */}
                    <img
                      src={selectedAchievement.imageUrl}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
                    />
                    <img
                      src={selectedAchievement.imageUrl}
                      alt={selectedAchievement.title}
                      className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-500"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {/* Zoom Button */}
                    <button
                      type="button"
                      onClick={() => setFullscreenImage(selectedAchievement)}
                      className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white transition-all cursor-pointer opacity-80 hover:opacity-100"
                      title="Perbesar Foto Dokumentasi"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0b3c26] via-[#072217] to-neutral-950 text-[#d4af37] p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-[#d4af37]/50 flex items-center justify-center mb-3 shadow-lg shadow-black/40">
                      <Trophy className="w-10 h-10 text-[#d4af37]" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-[#f3e5ab]/80 font-bold">
                      Prestasi & Kejuaraan
                    </span>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-white mt-1 max-w-md">
                      {selectedAchievement.title}
                    </h3>
                  </div>
                )}

                {/* Overlaid Rank & Category Badges */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2 flex-wrap pointer-events-none">
                  <span className="bg-gradient-to-r from-[#d4af37] to-[#b89228] text-[#072217] px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase flex items-center gap-1.5 shadow-lg border border-[#f3e5ab]/60">
                    <Trophy className="w-3.5 h-3.5 fill-current" />
                    <span>{selectedAchievement.rank}</span>
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#f3e5ab] bg-[#072217]/90 px-3 py-1 rounded-full border border-[#d4af37]/40 backdrop-blur-sm shadow-md">
                    {selectedAchievement.category}
                  </span>
                </div>
              </div>

              {/* Title & Metadata Badges */}
              <div className="pt-2 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#0b3c26] border border-emerald-200">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Tingkat {selectedAchievement.level}</span>
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      <span>Tahun {selectedAchievement.year}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleShareAchievement(selectedAchievement)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0b3c26] text-xs font-bold transition-colors cursor-pointer border border-emerald-200"
                      title="Bagikan Prestasi Ini"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Bagikan</span>
                    </button>
                    {selectedAchievement.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setFullscreenImage(selectedAchievement)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer border border-gray-200"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Perbesar</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Heading */}
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#072217] tracking-tight leading-snug">
                  {selectedAchievement.title}
                </h2>

                {/* Key Metadata Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50/90 rounded-2xl border border-gray-200/80 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-[#0b3c26] flex items-center justify-center shrink-0 mt-0.5">
                      <Medal className="w-4 h-4 text-[#d4af37]" />
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">Santri Peraih Juara</span>
                      <span className="font-bold text-[#072217] text-sm">{selectedAchievement.winner}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-[#0b3c26] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-[#0b3c26]" />
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">Tingkat Penyelenggaraan</span>
                      <span className="font-bold text-[#072217] text-sm">Tingkat {selectedAchievement.level}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-[#0b3c26] flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">Tahun Kompetisi</span>
                      <span className="font-bold text-[#072217] text-sm">Tahun {selectedAchievement.year}</span>
                    </div>
                  </div>
                </div>

                {/* Full Description & Story */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-heading text-sm font-bold text-[#072217] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <span>Deskripsi & Cerita Kejuaraan:</span>
                  </h4>
                  <p className="font-body text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedAchievement.description}
                  </p>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* RIGHT COLUMN: PRESTASI LAINNYA (Sidebar Stack)                */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-5 xl:col-span-4 bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-200">
              {/* Header & Category Filters */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="font-heading text-base font-bold text-[#072217]">
                    Prestasi Lainnya
                  </h3>
                  <span className="text-xs text-gray-500">({sidebarItems.length})</span>
                </div>

                <select
                  value={sidebarFilter}
                  onChange={(e) => setSidebarFilter(e.target.value)}
                  className="text-xs py-1 px-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#0b3c26]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Stacked list of other achievements */}
              <div className="space-y-3 max-h-[780px] overflow-y-auto pr-1">
                {sidebarItems.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-xs bg-white rounded-xl border border-dashed border-gray-200">
                    Tidak ada prestasi lainnya dalam kategori ini.
                  </div>
                ) : (
                  sidebarItems.map((item) => (
                    <div
                      key={item.id}
                      id={`sidebar-prestasi-${item.id}`}
                      onClick={() => handleSelectAchievement(item)}
                      className="group bg-white p-3 rounded-xl border border-gray-200/90 hover:border-[#0b3c26] shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex gap-3 items-start"
                    >
                      {/* Left Thumbnail with Rank Badge */}
                      <div className="relative w-24 h-20 sm:w-28 sm:h-22 rounded-lg overflow-hidden bg-neutral-900 shrink-0 flex items-center justify-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0b3c26] to-[#072217] text-[#d4af37]">
                            <Trophy className="w-7 h-7" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute bottom-1 left-1 right-1 text-center bg-[#d4af37] text-[#072217] text-[9px] font-extrabold uppercase px-1 py-0.5 rounded shadow-xs truncate">
                          {item.rank}
                        </span>
                      </div>

                      {/* Right Text Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1">
                          <span className="text-[#0b3c26] font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 truncate">
                            {item.category}
                          </span>
                          <span>•</span>
                          <span>{item.year}</span>
                        </div>

                        <h4 className="font-heading text-xs sm:text-sm font-bold text-[#072217] group-hover:text-[#0b3c26] transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h4>

                        <div className="flex items-center gap-1 text-[11px] text-gray-600 font-semibold mt-1 truncate">
                          <Medal className="w-3 h-3 text-[#d4af37] shrink-0" />
                          <span className="truncate">{item.winner}</span>
                        </div>

                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* STANDARD GRID VIEW (Before an achievement is clicked)                     */
        /* ========================================================================= */
        <div>
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
                type="button"
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
                  onClick={() => handleSelectAchievement(item)}
                  className={`group bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                    highlightedId === item.id
                      ? 'ring-4 ring-[#d4af37] border-[#d4af37] -translate-y-1.5 shadow-2xl'
                      : 'border-gray-200/80 hover:-translate-y-1.5'
                  }`}
                >
                  <div>
                    {/* Image with Trophy Ribbon */}
                    <div className="relative h-48 overflow-hidden bg-emerald-950 flex items-center justify-center">
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
                        Lihat Detail & Cerita
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
        </div>
      )}

      {/* Fullscreen Image Lightbox if user clicks Perbesar */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setFullscreenImage(null)}
        >
          <div
            className="bg-[#072217] text-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#d4af37]/40 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setFullscreenImage(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={fullscreenImage.imageUrl}
                alt={fullscreenImage.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="p-5 bg-[#0b3c26] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#072217] bg-[#d4af37] px-2.5 py-0.5 rounded-full">
                  {fullscreenImage.rank} • {fullscreenImage.category}
                </span>
                <h3 className="font-heading text-lg font-bold text-[#f3e5ab] mt-1.5">
                  {fullscreenImage.title} ({fullscreenImage.winner})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleShareAchievement(fullscreenImage)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-[#f3e5ab] text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-[#d4af37]/30 shrink-0"
              >
                <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Bagikan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
