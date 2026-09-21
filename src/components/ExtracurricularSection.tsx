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
  ArrowRight,
  ArrowLeft,
  Share2,
  ZoomIn,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const ExtracurricularSection: React.FC = () => {
  const { extracurriculars } = useDataContext();
  const { activeDeepLink, consumeDeepLink, openShare } = useShare();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeItem, setActiveItem] = useState<ExtracurricularItem | null>(null);
  const [sidebarFilter, setSidebarFilter] = useState<string>('Semua');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<ExtracurricularItem | null>(null);

  // Auto-respond to deep links
  useEffect(() => {
    if (activeDeepLink && (activeDeepLink.type === 'ekskul' || activeDeepLink.type === 'ekstrakurikuler') && activeDeepLink.id) {
      const match = extracurriculars.find(
        (item) =>
          item.id === activeDeepLink.id ||
          item.name.toLowerCase().includes(activeDeepLink.id!.toLowerCase())
      );
      if (match) {
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

  const categories = ['Semua', 'Keagamaan', 'Kepanduan & Bela Diri', 'Kesenian', 'Olahraga & Sains'];

  const filteredItems = selectedCategory === 'Semua'
    ? extracurriculars
    : extracurriculars.filter((item) => item.category === selectedCategory);

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

  // Sidebar items for other extracurriculars
  const sidebarItems = extracurriculars.filter((item) => {
    if (item.id === activeItem?.id) return false;
    if (sidebarFilter === 'Semua') return true;
    return item.category === sidebarFilter;
  });

  return (
    <section id="ekstrakurikuler" className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {activeItem ? (
        /* ========================================================================= */
        /* SHOWCASE VIEW (2-Column Showcase matching Galeri layout)                 */
        /* ========================================================================= */
        <div id="ekskul-showcase-view" className="animate-in fade-in duration-300">
          {/* Top Control Bar: Back to Grid & Context Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200">
            <button
              id="back-to-ekskul-grid-btn"
              type="button"
              onClick={() => setActiveItem(null)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#0b3c26] text-[#072217] hover:text-[#f3e5ab] text-xs sm:text-sm font-bold transition-all border border-gray-300 hover:border-[#0b3c26] shadow-xs cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#0b3c26] group-hover:text-[#f3e5ab]" />
              <span>← Kembali ke Semua Ekstrakurikuler (Grid)</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">Total Program Ekskul:</span>
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#e8f3ee] text-[#0b3c26] border border-emerald-200">
                {extracurriculars.length} Kegiatan
              </span>
            </div>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ------------------------------------------------------------- */}
            {/* LEFT COLUMN: EKSKUL UTAMA YANG DITAMPILKAN                    */}
            {/* ------------------------------------------------------------- */}
            <div id="ekskul-main-viewer" className="lg:col-span-7 xl:col-span-8 space-y-5">
              {/* Media Container: Image with Ambient Backdrop */}
              <div className="relative w-full aspect-video sm:h-96 rounded-2xl overflow-hidden bg-neutral-950 shadow-xl border border-gray-200/80 flex items-center justify-center group">
                <img
                  src={activeItem.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
                />
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.name}
                  className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80';
                  }}
                />

                {/* Overlaid Badges */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2 flex-wrap pointer-events-none">
                  <span className="bg-[#072217]/90 text-[#d4af37] border border-[#d4af37]/40 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                    {getIcon(activeItem.iconName)}
                    <span>{activeItem.category}</span>
                  </span>
                </div>

                {/* Zoom Button */}
                <button
                  type="button"
                  onClick={() => setFullscreenImage(activeItem)}
                  className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white transition-all cursor-pointer opacity-80 hover:opacity-100"
                  title="Perbesar Foto Kegiatan"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Metadata Badges */}
              <div className="pt-2 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#0b3c26] text-[#f3e5ab] border border-[#d4af37]/30">
                      <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Pengembangan Minat & Bakat</span>
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#0b3c26] border border-emerald-200">
                      {activeItem.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleShareEkskul(activeItem)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0b3c26] text-xs font-bold transition-colors cursor-pointer border border-emerald-200"
                      title="Bagikan Ekstrakurikuler Ini"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Bagikan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFullscreenImage(activeItem)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer border border-gray-200"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Perbesar</span>
                    </button>
                  </div>
                </div>

                {/* Main Heading */}
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#072217] tracking-tight leading-snug flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-100 text-[#0b3c26] inline-flex items-center justify-center">
                    {getIcon(activeItem.iconName)}
                  </span>
                  <span>{activeItem.name}</span>
                </h2>

                {/* Key Info Card: Schedule & Coach */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 bg-gray-50/90 rounded-2xl border border-gray-200/80 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0b3c26] flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar className="w-4.5 h-4.5 text-[#0b3c26]" />
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Jadwal Latihan Rutin</span>
                      <span className="font-bold text-[#072217] text-sm mt-0.5 block">{activeItem.schedule}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                      <UserCheck className="w-4.5 h-4.5 text-[#d4af37]" />
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Pelatih / Asatidz Pembina</span>
                      <span className="font-bold text-[#072217] text-sm mt-0.5 block">{activeItem.coach}</span>
                    </div>
                  </div>
                </div>

                {/* Full Description */}
                <div className="pt-3 border-t border-gray-200">
                  <h4 className="font-heading text-sm font-bold text-[#072217] uppercase tracking-wider mb-2">
                    Tentang Kegiatan Ekstrakurikuler:
                  </h4>
                  <p className="font-body text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                    {activeItem.description}
                  </p>
                </div>

                {/* Achievements & Milestones if any */}
                {activeItem.achievements && activeItem.achievements.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-heading text-sm font-bold text-[#072217] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#d4af37]" />
                      <span>Prestasi & Rekam Jejak Unggulan:</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeItem.achievements.map((ach, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-950 font-medium"
                        >
                          <div className="w-6 h-6 rounded-full bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0">
                            <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                          </div>
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* RIGHT COLUMN: EKSKUL LAINNYA (Sidebar Stack)                  */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-5 xl:col-span-4 bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-200">
              {/* Header & Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="font-heading text-base font-bold text-[#072217]">
                    Ekstrakurikuler Lainnya
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

              {/* Stacked list of other extracurriculars */}
              <div className="space-y-3 max-h-[780px] overflow-y-auto pr-1">
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
                      className="group bg-white p-3 rounded-xl border border-gray-200/90 hover:border-[#0b3c26] shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex gap-3 items-start"
                    >
                      {/* Left Thumbnail with Icon */}
                      <div className="relative w-24 h-20 sm:w-28 sm:h-22 rounded-lg overflow-hidden bg-neutral-900 shrink-0 flex items-center justify-center">
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
                        <h4 className="font-heading text-xs sm:text-sm font-bold text-[#072217] group-hover:text-[#0b3c26] transition-colors leading-snug truncate">
                          {item.name}
                        </h4>

                        <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                          <Calendar className="w-3 h-3 text-[#0b3c26] shrink-0" />
                          <span className="truncate">{item.schedule}</span>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-gray-600 mt-0.5">
                          <UserCheck className="w-3 h-3 text-[#d4af37] shrink-0" />
                          <span className="truncate">{item.coach}</span>
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
        /* STANDARD GRID VIEW (Before an item is clicked)                            */
        /* ========================================================================= */
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#0b3c26] bg-[#e8f3ee] px-3.5 py-1 rounded-full inline-block mb-3 border border-[#0b3c26]/20">
              PENGEMBANGAN MINAT & BAKAT
            </span>
            <h3 className="font-heading text-2xl sm:text-4xl font-bold text-[#072217] tracking-tight">
              Ekstrakurikuler & Kreativitas Santri
            </h3>
            <p className="font-body text-sm sm:text-base text-gray-600 mt-2">
              Mengasah kemandirian, sportivitas, kepemimpinan, dan kecintaan pada warisan budaya Islam Ahlussunnah wal Jama'ah.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center items-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-md border border-[#d4af37]/40'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of Extracurricular Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                id={`ekskul-card-${item.id}`}
                onClick={() => handleSelectItem(item)}
                className={`group bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  highlightedId === item.id
                    ? 'ring-4 ring-[#d4af37] border-[#d4af37] -translate-y-1.5 shadow-2xl'
                    : 'border-gray-200/80 hover:-translate-y-1.5'
                }`}
              >
                <div>
                  {/* Image with Tag */}
                  <div className="relative h-48 overflow-hidden bg-emerald-950">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 bg-[#072217]/90 text-[#d4af37] border border-[#d4af37]/30 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                      {getIcon(item.iconName)}
                      <span>{item.category}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="font-heading text-lg font-bold drop-shadow-sm">
                        {item.name}
                      </h4>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-3.5">
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#0b3c26] shrink-0" />
                        <span className="font-medium text-gray-500">Jadwal:</span>
                        <span className="font-semibold text-gray-800">{item.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-[#0b3c26] shrink-0" />
                        <span className="font-medium text-gray-500">Pembina:</span>
                        <span className="text-gray-800 truncate">{item.coach}</span>
                      </div>
                    </div>

                    {/* Achievements badge */}
                    {item.achievements && item.achievements.length > 0 && (
                      <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 text-[11px] text-amber-900 space-y-1">
                        <div className="font-bold flex items-center gap-1 text-amber-800">
                          <Award className="w-3 h-3 text-[#d4af37]" />
                          <span>Prestasi & Rekam Jejak:</span>
                        </div>
                        <ul className="list-disc list-inside pl-1 text-gray-700 line-clamp-1">
                          {item.achievements[0]}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    className="flex-1 py-2.5 bg-emerald-50 hover:bg-[#0b3c26] text-[#0b3c26] hover:text-[#f3e5ab] font-bold text-xs rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Lihat Informasi & Jadwal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleShareEkskul(item, e)}
                    className="p-2.5 bg-gray-100 hover:bg-emerald-100/60 text-gray-500 hover:text-[#0b3c26] rounded-xl transition-colors cursor-pointer"
                    title="Bagikan Ekstrakurikuler Ini"
                  >
                    <Share2 className="w-4 h-4 text-[#d4af37]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
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
                alt={fullscreenImage.name}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="p-5 bg-[#0b3c26] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#072217] bg-[#d4af37] px-2.5 py-0.5 rounded-full">
                  {fullscreenImage.category}
                </span>
                <h3 className="font-heading text-lg font-bold text-[#f3e5ab] mt-1.5">
                  {fullscreenImage.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleShareEkskul(fullscreenImage)}
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
