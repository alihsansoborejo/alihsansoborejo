import React, { useState, useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import { useShare } from '../context/ShareContext';
import { ExtracurricularItem } from '../types';
import {
  Compass,
  Music,
  ShieldAlert,
  Palette,
  FlaskConical,
  Activity,
  Calendar,
  UserCheck,
  Award,
  Share2,
  ZoomIn,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { FormattedText } from './FormattedText';

export const ExtracurricularSection: React.FC = () => {
  const { extracurriculars } = useDataContext();
  const { activeDeepLink, consumeDeepLink, openShare } = useShare();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeItem, setActiveItem] = useState<ExtracurricularItem | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<ExtracurricularItem | null>(null);

  const categories = ['Semua', 'Keagamaan', 'Kepanduan & Bela Diri', 'Kesenian', 'Olahraga & Sains'];

  const filteredItems = selectedCategory === 'Semua'
    ? extracurriculars
    : extracurriculars.filter((item) => item.category === selectedCategory);

  // Sync activeItem to first item when filter changes or on load
  useEffect(() => {
    if (!activeItem && filteredItems.length > 0) {
      setActiveItem(filteredItems[0]);
    } else if (activeItem && !filteredItems.some((item) => item.id === activeItem.id)) {
      if (filteredItems.length > 0) {
        setActiveItem(filteredItems[0]);
      }
    }
  }, [filteredItems, activeItem]);

  // Auto-respond to deep links
  useEffect(() => {
    if (activeDeepLink && (activeDeepLink.type === 'ekskul' || activeDeepLink.type === 'ekstrakurikuler') && activeDeepLink.id) {
      const match = extracurriculars.find(
        (item) =>
          item.id === activeDeepLink.id ||
          item.name.toLowerCase().includes(activeDeepLink.id!.toLowerCase())
      );
      if (match) {
        setSelectedCategory('Semua');
        setActiveItem(match);
        setHighlightedId(match.id);
        consumeDeepLink();

        setTimeout(() => {
          const el = document.getElementById('ekstrakurikuler');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [activeDeepLink, extracurriculars, consumeDeepLink]);

  const handleSelectItem = (item: ExtracurricularItem) => {
    setActiveItem(item);
    setTimeout(() => {
      const el = document.getElementById('ekstrakurikuler');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleShareEkskul = (item: ExtracurricularItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    openShare({
      type: 'ekskul',
      id: item.id,
      title: `Ekstrakurikuler ${item.name}`,
      description: `${item.description} Jadwal: ${item.schedule}. Pembina: ${item.coach}.`,
      category: item.category,
      imageUrl: item.imageUrl,
    });
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="w-4 h-4" />;
      case 'Music': return <Music className="w-4 h-4" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4" />;
      case 'Palette': return <Palette className="w-4 h-4" />;
      case 'FlaskConical': return <FlaskConical className="w-4 h-4" />;
      case 'Activity': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const currentActive = activeItem || filteredItems[0] || extracurriculars[0] || null;

  // Items for sidebar (excluding current active item)
  const sidebarItems = filteredItems.filter((item) => item.id !== currentActive?.id);

  return (
    <section id="ekstrakurikuler" className="pt-3 sm:pt-4 pb-14 sm:pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-3.5">
        <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-3 py-0.5 rounded-full inline-block mb-1.5 border border-[#0b3c26]/20">
          PENGEMBANGAN MINAT &amp; BAKAT
        </span>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] tracking-tight">
          Ekstrakurikuler &amp; Kreativitas Santri
        </h2>
        <p className="font-body text-xs sm:text-sm text-gray-600 mt-1 max-w-xl mx-auto leading-normal">
          Mengasah kemandirian, sportivitas, kepemimpinan, dan kecintaan pada warisan budaya Islam Ahlussunnah wal Jama'ah.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-md border border-[#d4af37]/40'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN SHOWCASE LAYOUT (Matching Layout.png)                            */}
      {/* ========================================================================= */}
      {currentActive ? (
        <div id="ekskul-showcase-view" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ------------------------------------------------------------- */}
          {/* LEFT COLUMN: EKSKUL YANG SEDANG DITAMPILKAN                   */}
          {/* ------------------------------------------------------------- */}
          <div id="ekskul-main-viewer" className="lg:col-span-7 xl:col-span-8 space-y-5">
            {/* Foto Container: Dark Rectangle uncropped photo */}
            <div className="relative w-full aspect-video sm:h-96 rounded-2xl overflow-hidden bg-neutral-950 shadow-xl border border-gray-200/80 flex items-center justify-center group">
              <img
                src={currentActive.imageUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
              />
              <img
                src={currentActive.imageUrl}
                alt={currentActive.name}
                className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-500"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80';
                }}
              />

              {/* Overlaid Badges */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2 flex-wrap pointer-events-none">
                <span className="bg-[#072217]/90 text-[#d4af37] border border-[#d4af37]/40 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                  {getIcon(currentActive.iconName)}
                  <span>{currentActive.category}</span>
                </span>
              </div>

              {/* Zoom Button */}
              <button
                type="button"
                onClick={() => setFullscreenImage(currentActive)}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white transition-all cursor-pointer opacity-80 hover:opacity-100"
                title="Perbesar Foto Kegiatan"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Judul & Deskripsi Lengkap below photo (Matching Layout.png) */}
            <div className="pt-2 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#0b3c26] text-[#f3e5ab] border border-[#d4af37]/30">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Pengembangan Minat &amp; Bakat</span>
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#0b3c26] border border-emerald-200">
                    {currentActive.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleShareEkskul(currentActive, e)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0b3c26] text-xs font-bold transition-colors cursor-pointer border border-emerald-200"
                    title="Bagikan Ekstrakurikuler Ini"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Bagikan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFullscreenImage(currentActive)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer border border-gray-200"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Perbesar</span>
                  </button>
                </div>
              </div>

              {/* Judul Ekskul */}
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#072217] tracking-tight leading-snug flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-100 text-[#0b3c26] inline-flex items-center justify-center">
                  {getIcon(currentActive.iconName)}
                </span>
                <span>{currentActive.name}</span>
              </h2>

              {/* Key Info Card: Schedule & Coach */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 bg-gray-50/90 rounded-2xl border border-gray-200/80 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0b3c26] flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-4.5 h-4.5 text-[#0b3c26]" />
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Jadwal Latihan Rutin</span>
                    <strong className="text-[#072217] text-xs sm:text-sm font-semibold mt-0.5 block">
                      {currentActive.schedule}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0b3c26] flex items-center justify-center shrink-0 mt-0.5">
                    <UserCheck className="w-4.5 h-4.5 text-[#0b3c26]" />
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Pembina / Pelatih Ahli</span>
                    <strong className="text-[#072217] text-xs sm:text-sm font-semibold mt-0.5 block">
                      {currentActive.coach}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Deskripsi Lengkap Kegiatan */}
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Deskripsi Lengkap Kegiatan
                </h3>
                <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-3 font-body">
                  <FormattedText text={currentActive.description} />
                </div>
              </div>

              {/* Rekam Jejak Prestasi & Capaian (If available) */}
              {currentActive.achievements && currentActive.achievements.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[#072217] space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-900 font-heading font-bold text-sm">
                    <Award className="w-4.5 h-4.5 text-amber-700 shrink-0" />
                    <span>Prestasi &amp; Jejak Kejuaraan Ekskul Ini</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    {currentActive.achievements.map((ach, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white/80 border border-amber-200/60 text-gray-800">
                        <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                          <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                        </div>
                        <span>
                          <FormattedText text={ach} asParagraphs={false} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* RIGHT COLUMN: EKSKUL LAINNYA (Playlist Stack)                 */}
          {/* ------------------------------------------------------------- */}
          <div id="ekskul-sidebar-list" className="lg:col-span-5 xl:col-span-4 space-y-3">
            {/* Header & Counter */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="font-heading text-base sm:text-lg font-bold text-[#072217]">
                Ekstrakurikuler Lainnya
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#e8f3ee] text-[#0b3c26] border border-emerald-200">
                {filteredItems.length} Kegiatan
              </span>
            </div>

            {/* Stacked list of other extracurriculars */}
            <div className="space-y-3 max-h-[820px] overflow-y-auto pr-1">
              {sidebarItems.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-xs bg-white rounded-xl border border-dashed border-gray-200">
                  Tidak ada ekstrakurikuler lainnya dalam kategori ini.
                </div>
              ) : (
                sidebarItems.map((item) => (
                  <div
                    key={item.id}
                    id={`sidebar-ekskul-${item.id}`}
                    onClick={() => handleSelectItem(item)}
                    className="group bg-white p-3 rounded-xl border border-gray-200/90 hover:border-[#0b3c26] shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row gap-3 items-start"
                  >
                    {/* Left Thumbnail */}
                    <div className="relative w-full sm:w-28 md:w-32 aspect-video sm:aspect-square rounded-lg overflow-hidden bg-neutral-900 shrink-0 flex items-center justify-center">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-1 left-1 bg-[#072217]/90 text-[#d4af37] text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-xs flex items-center gap-1">
                        {getIcon(item.iconName)}
                        <span>{item.category}</span>
                      </span>
                    </div>

                    {/* Right Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#0b3c26] mb-0.5">
                        <Calendar className="w-3 h-3 text-[#d4af37]" />
                        <span>{item.schedule}</span>
                      </div>
                      <h4 className="font-heading font-bold text-sm text-[#072217] group-hover:text-[#0b3c26] transition-colors leading-snug line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                        <span>Pembina: {item.coach}</span>
                        <span className="text-[#d4af37] font-bold group-hover:text-[#0b3c26]">Lihat →</span>
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
          <p className="text-gray-500 text-sm">Belum ada data ekstrakurikuler dalam kategori ini.</p>
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
                alt={fullscreenImage.name}
                className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>
            <div className="mt-3 text-center text-white">
              <h4 className="font-heading font-bold text-lg">{fullscreenImage.name}</h4>
              <p className="text-xs text-gray-300 mt-0.5">{fullscreenImage.schedule} • Pembina: {fullscreenImage.coach}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
