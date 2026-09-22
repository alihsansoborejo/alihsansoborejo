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
  ZoomIn,
  CheckCircle2
} from 'lucide-react';
import { FormattedText } from './FormattedText';

export const AchievementsSection: React.FC = () => {
  const { achievements } = useDataContext();
  const { activeDeepLink, consumeDeepLink, openShare } = useShare();
  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementItem | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<AchievementItem | null>(null);

  const categories = ['Semua', 'Tahfidz & Keagamaan', 'Seni & Budaya', 'Akademik & Sains', 'Olahraga & Kepanduan'];

  const filteredAchievements = filterCategory === 'Semua'
    ? achievements
    : achievements.filter((item) => item.category === filterCategory);

  // Sync selectedAchievement on filter change or initial load
  useEffect(() => {
    if (!selectedAchievement && filteredAchievements.length > 0) {
      setSelectedAchievement(filteredAchievements[0]);
    } else if (selectedAchievement && !filteredAchievements.some((item) => item.id === selectedAchievement.id)) {
      if (filteredAchievements.length > 0) {
        setSelectedAchievement(filteredAchievements[0]);
      }
    }
  }, [filteredAchievements, selectedAchievement]);

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
        setFilterCategory('Semua');
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

  const currentActive = selectedAchievement || filteredAchievements[0] || achievements[0] || null;

  // Sidebar items for other achievements
  const sidebarItems = filteredAchievements.filter((item) => item.id !== currentActive?.id);

  return (
    <section id="prestasi" className="pt-3 sm:pt-4 pb-14 sm:pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-3.5">
        <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-3 py-0.5 rounded-full inline-block mb-1.5 border border-[#0b3c26]/20">
          JEJAK PRESTASI SANTRI
        </span>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] tracking-tight">
          Kiprah &amp; Rekam Prestasi Membanggakan
        </h2>
        <p className="font-body text-xs sm:text-sm text-gray-600 mt-1 max-w-xl mx-auto leading-normal">
          Bukti nyata dedikasi, semangat belajar, dan bimbingan ikhlas para asatidz mengantarkan santri berprestasi di tingkat kecamatan hingga nasional.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filterCategory === cat
                ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-md border border-[#d4af37]/40'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN MASTER-DETAIL LAYOUT (Matching Layout.png)                       */}
      {/* ========================================================================= */}
      {currentActive ? (
        <div id="prestasi-showcase-view" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ------------------------------------------------------------- */}
          {/* LEFT COLUMN: PRESTASI YANG SEDANG DITAMPILKAN                 */}
          {/* ------------------------------------------------------------- */}
          <div id="prestasi-main-viewer" className="lg:col-span-7 xl:col-span-8 space-y-5">
            {/* Foto Container: Dark Rectangle uncropped photo */}
            <div className="relative w-full aspect-video sm:h-96 rounded-2xl overflow-hidden bg-neutral-950 shadow-xl border border-gray-200/80 flex items-center justify-center group">
              {currentActive.imageUrl ? (
                <>
                  {/* Blurred backdrop for fitting all aspect ratios */}
                  <img
                    src={currentActive.imageUrl}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
                  />
                  <img
                    src={currentActive.imageUrl}
                    alt={currentActive.title}
                    className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {/* Zoom Button */}
                  <button
                    type="button"
                    onClick={() => setFullscreenImage(currentActive)}
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
                    Prestasi &amp; Kejuaraan
                  </span>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-white mt-1 max-w-md">
                    {currentActive.title}
                  </h3>
                </div>
              )}

              {/* Overlaid Rank & Category Badges */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2 flex-wrap pointer-events-none">
                <span className="bg-gradient-to-r from-[#d4af37] to-[#b89228] text-[#072217] px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase flex items-center gap-1.5 shadow-lg border border-[#f3e5ab]/60">
                  <Trophy className="w-3.5 h-3.5 fill-current" />
                  <span>{currentActive.rank}</span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#f3e5ab] bg-[#072217]/90 px-3 py-1 rounded-full border border-[#d4af37]/40 backdrop-blur-sm shadow-md">
                  {currentActive.category}
                </span>
              </div>
            </div>

            {/* Judul & Deskripsi Lengkap below photo (Matching Layout.png) */}
            <div className="pt-2 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#0b3c26] border border-emerald-200">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Tingkat {currentActive.level}</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <span>Tahun {currentActive.year}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleShareAchievement(currentActive, e)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0b3c26] text-xs font-bold transition-colors cursor-pointer border border-emerald-200"
                    title="Bagikan Prestasi Ini"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Bagikan</span>
                  </button>
                  {currentActive.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setFullscreenImage(currentActive)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer border border-gray-200"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Perbesar</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Judul Prestasi */}
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#072217] tracking-tight leading-snug">
                {currentActive.title}
              </h2>

              {/* Key Metadata Card: Santri Peraih, Tingkat, Tahun */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50/90 rounded-2xl border border-gray-200/80 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-[#0b3c26] flex items-center justify-center shrink-0 mt-0.5">
                    <Medal className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Santri Peraih Juara</span>
                    <span className="font-bold text-[#072217] text-sm">{currentActive.winner}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-[#0b3c26] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#0b3c26]" />
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Tingkat Penyelenggaraan</span>
                    <span className="font-bold text-[#072217] text-sm">Tingkat {currentActive.level}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-[#0b3c26] flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Tahun Pencapaian</span>
                    <span className="font-bold text-[#072217] text-sm">Tahun {currentActive.year}</span>
                  </div>
                </div>
              </div>

              {/* Deskripsi Lengkap Prestasi */}
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Ulasan &amp; Cerita Prestasi
                </h3>
                <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-3 font-body">
                  <FormattedText text={currentActive.description} />
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* RIGHT COLUMN: PRESTASI LAINNYA (Sidebar Stack)                */}
          {/* ------------------------------------------------------------- */}
          <div id="prestasi-sidebar-list" className="lg:col-span-5 xl:col-span-4 space-y-3">
            {/* Header & Counter */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="font-heading text-base sm:text-lg font-bold text-[#072217]">
                Prestasi Lainnya
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#e8f3ee] text-[#0b3c26] border border-emerald-200">
                {filteredAchievements.length} Prestasi
              </span>
            </div>

            {/* Stacked list of other achievements */}
            <div className="space-y-3 max-h-[820px] overflow-y-auto pr-1">
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
                    className="group bg-white p-3 rounded-xl border border-gray-200/90 hover:border-[#0b3c26] shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row gap-3 items-start"
                  >
                    {/* Left Thumbnail with Rank Badge */}
                    <div className="relative w-full sm:w-28 md:w-32 aspect-video sm:aspect-square rounded-lg overflow-hidden bg-neutral-900 shrink-0 flex items-center justify-center">
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

                      <div className="text-[11px] text-gray-500 line-clamp-1 mt-1 leading-relaxed">
                        <FormattedText text={item.description} asParagraphs={false} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500 text-sm">Belum ada data prestasi dalam kategori ini.</p>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setFullscreenImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-7 h-7" />
            </button>
            <div className="w-full h-full flex items-center justify-center bg-black/40 rounded-2xl overflow-hidden p-2">
              <img
                src={fullscreenImage.imageUrl}
                alt={fullscreenImage.title}
                className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>
            <div className="mt-3 text-center text-white">
              <h4 className="font-heading font-bold text-lg">{fullscreenImage.title}</h4>
              <p className="text-xs text-gray-300 mt-0.5">{fullscreenImage.rank} • {fullscreenImage.winner} • Tingkat {fullscreenImage.level} ({fullscreenImage.year})</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
