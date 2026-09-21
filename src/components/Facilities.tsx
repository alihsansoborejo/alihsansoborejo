import React, { useState, useEffect, useMemo } from 'react';
import { useDataContext } from '../context/DataContext';
import { useShare } from '../context/ShareContext';
import { FacilityItem, GalleryItem, VideoGalleryItem, VideoAspectRatio } from '../types';
import { parseVideoUrl, getVideoAspectConfig, detectVideoAspectRatio } from '../lib/videoUtils';
import {
  Building2,
  Camera,
  CheckCircle,
  X,
  ZoomIn,
  Calendar,
  Play,
  Video,
  ExternalLink,
  User,
  Share2,
  Film,
  ArrowLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export type ActiveMedia =
  | { type: 'foto'; item: GalleryItem }
  | { type: 'video'; item: VideoGalleryItem };

export const Facilities: React.FC = () => {
  const { facilities, gallery, videoGallery } = useDataContext();
  const { activeDeepLink, consumeDeepLink, openShare } = useShare();
  const [activeTab, setActiveTab] = useState<'galeri' | 'galeri_video' | 'fasilitas'>('galeri');
  const [selectedFacility, setSelectedFacility] = useState<FacilityItem | null>(null);
  const [activeMedia, setActiveMedia] = useState<ActiveMedia | null>(null);
  const [sidebarFilter, setSidebarFilter] = useState<'semua' | 'foto' | 'video'>('semua');
  const [facilitySidebarFilter, setFacilitySidebarFilter] = useState<string>('Semua');
  const [fullscreenPhoto, setFullscreenPhoto] = useState<{
    id: string;
    title: string;
    imageUrl: string;
    category?: string;
    description?: string;
  } | null>(null);
  const [playerAspect, setPlayerAspect] = useState<VideoAspectRatio>('auto');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const sidebarFacilities = useMemo(() => {
    return facilities.filter((fac) => {
      if (fac.id === selectedFacility?.id) return false;
      if (facilitySidebarFilter === 'Semua') return true;
      return fac.category.toLowerCase() === facilitySidebarFilter.toLowerCase();
    });
  }, [facilities, selectedFacility, facilitySidebarFilter]);

  const handleSelectFacility = (fac: FacilityItem) => {
    setSelectedFacility(fac);
    setActiveMedia(null);
    setTimeout(() => {
      const el = document.getElementById('galeri');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Unified list of all media for the sidebar
  const allMediaList = useMemo(() => {
    const photos = (gallery || []).map((g) => ({
      id: g.id,
      type: 'foto' as const,
      title: g.title,
      description: g.description,
      category: g.category,
      date: g.date,
      thumbnailUrl: g.imageUrl,
      rawItem: g,
    }));

    const videos = (videoGallery || []).map((v) => {
      const autoAspect = detectVideoAspectRatio(v.videoUrl, v.aspectRatio, v.title, v.description);
      const parsed = parseVideoUrl(v.videoUrl, v.thumbnailUrl, autoAspect, v.title, v.description);
      return {
        id: v.id,
        type: 'video' as const,
        title: v.title,
        description: v.description,
        category: v.category,
        date: v.date,
        duration: v.duration,
        author: v.author,
        thumbnailUrl: parsed.thumbnailUrl,
        rawItem: v,
      };
    });

    return { photos, videos, combined: [...videos, ...photos] };
  }, [gallery, videoGallery]);

  // Items to display in the right column of the showcase
  const sidebarItems = useMemo(() => {
    let list: typeof allMediaList.combined = [];
    if (sidebarFilter === 'foto') {
      list = allMediaList.photos;
    } else if (sidebarFilter === 'video') {
      list = allMediaList.videos;
    } else {
      if (activeMedia?.type === 'video') {
        list = [...allMediaList.videos, ...allMediaList.photos];
      } else {
        list = [...allMediaList.photos, ...allMediaList.videos];
      }
    }
    // Filter out current active item so it matches "PHOTO/VIDEO YANG lain"
    return list.filter((item) => item.id !== activeMedia?.item.id);
  }, [allMediaList, sidebarFilter, activeMedia]);

  // Auto-respond to deep links
  useEffect(() => {
    if (!activeDeepLink) return;

    if (activeDeepLink.type === 'galeri' && activeDeepLink.id) {
      const match = gallery.find(
        (g) => g.id === activeDeepLink.id || g.title.toLowerCase().includes(activeDeepLink.id!.toLowerCase())
      );
      if (match) {
        setActiveTab('galeri');
        setActiveMedia({ type: 'foto', item: match });
        setSidebarFilter('foto');
        consumeDeepLink();
        setTimeout(() => {
          const el = document.getElementById('galeri');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    } else if (activeDeepLink.type === 'video' && activeDeepLink.id) {
      const match = (videoGallery || []).find(
        (v) => v.id === activeDeepLink.id || v.title.toLowerCase().includes(activeDeepLink.id!.toLowerCase())
      );
      if (match) {
        setActiveTab('galeri_video');
        const autoAspect = detectVideoAspectRatio(match.videoUrl, match.aspectRatio, match.title, match.description);
        setPlayerAspect(autoAspect);
        setActiveMedia({ type: 'video', item: match });
        setSidebarFilter('video');
        consumeDeepLink();
        setTimeout(() => {
          const el = document.getElementById('galeri');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    } else if (activeDeepLink.type === 'fasilitas' && activeDeepLink.id) {
      const match = facilities.find(
        (f) => f.id === activeDeepLink.id || f.name.toLowerCase().includes(activeDeepLink.id!.toLowerCase())
      );
      if (match) {
        setActiveTab('fasilitas');
        setSelectedFacility(match);
        setActiveMedia(null);
        consumeDeepLink();
        setTimeout(() => {
          const card = document.getElementById(`facility-card-${match.id}`);
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [activeDeepLink, gallery, videoGallery, facilities, consumeDeepLink]);

  const galleryCategories = ['Semua', 'Prestasi', 'Ibadah & Karakter', 'Kegiatan Belajar', 'Ekstrakurikuler', 'Fasilitas'];
  const videoCategories = ['Semua', 'Profil Madrasah', 'Ibadah & Karakter', 'Kegiatan Belajar', 'Ekstrakurikuler', 'Prestasi & Pentas Seni', 'Dokumentasi PPDB'];
  const facilityCategories = ['Semua', 'Akademik', 'Spiritual', 'Teknologi', 'Olahraga', 'Kesehatan'];

  const filteredGallery = activeCategory === 'Semua'
    ? gallery
    : gallery.filter(g => g.category.toLowerCase() === activeCategory.toLowerCase());

  const filteredVideos = activeCategory === 'Semua'
    ? (videoGallery || [])
    : (videoGallery || []).filter(v => (v.category || '').toLowerCase() === activeCategory.toLowerCase());

  const filteredFacilities = activeCategory === 'Semua'
    ? facilities
    : facilities.filter(f => f.category.toLowerCase() === activeCategory.toLowerCase());

  const handleTabChange = (tab: 'galeri' | 'galeri_video' | 'fasilitas') => {
    setActiveTab(tab);
    setActiveCategory('Semua');
    if (tab === 'fasilitas') {
      setActiveMedia(null);
    } else if (tab === 'galeri') {
      setSidebarFilter('foto');
    } else if (tab === 'galeri_video') {
      setSidebarFilter('video');
    }
  };

  const handleOpenMedia = (media: ActiveMedia) => {
    setActiveMedia(media);
    if (media.type === 'video') {
      const autoAspect = detectVideoAspectRatio(media.item.videoUrl, media.item.aspectRatio, media.item.title, media.item.description);
      setPlayerAspect(autoAspect);
      setSidebarFilter('video');
    } else {
      setSidebarFilter('foto');
    }
    setTimeout(() => {
      const el = document.getElementById('galeri');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return {
          bg: 'bg-red-600 text-white',
          label: 'YouTube',
          border: 'border-red-500/40',
        };
      case 'facebook':
        return {
          bg: 'bg-blue-600 text-white',
          label: 'Facebook Watch',
          border: 'border-blue-500/40',
        };
      case 'tiktok':
        return {
          bg: 'bg-black text-white',
          label: 'TikTok',
          border: 'border-neutral-700',
        };
      case 'vimeo':
        return {
          bg: 'bg-sky-600 text-white',
          label: 'Vimeo',
          border: 'border-sky-500/40',
        };
      case 'gdrive':
        return {
          bg: 'bg-amber-600 text-white',
          label: 'Google Drive',
          border: 'border-amber-500/40',
        };
      case 'direct':
        return {
          bg: 'bg-emerald-700 text-white',
          label: 'Video MP4',
          border: 'border-emerald-600/40',
        };
      default:
        return {
          bg: 'bg-teal-700 text-white',
          label: 'Video Web',
          border: 'border-teal-600/40',
        };
    }
  };

  return (
    <section id="galeri" className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {selectedFacility ? (
        /* ========================================================================= */
        /* SHOWCASE VIEW FOR FASILITAS & RUANG BELAJAR (Matching Layout.png)        */
        /* ========================================================================= */
        <div id="fasilitas-showcase-view" className="animate-in fade-in duration-300">
          {/* Top Control Bar: Back to Grid & Quick Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200">
            <button
              id="back-to-facility-grid-btn"
              type="button"
              onClick={() => setSelectedFacility(null)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#0b3c26] text-[#072217] hover:text-[#f3e5ab] text-xs sm:text-sm font-bold transition-all border border-gray-300 hover:border-[#0b3c26] shadow-xs cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#0b3c26] group-hover:text-[#f3e5ab]" />
              <span>← Kembali ke Semua Fasilitas (Grid)</span>
            </button>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">Pilihan Galeri &amp; Fasilitas:</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedFacility(null);
                  setActiveTab('galeri');
                  setSidebarFilter('foto');
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Galeri Foto ({gallery.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedFacility(null);
                  setActiveTab('galeri_video');
                  setSidebarFilter('video');
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Galeri Video ({(videoGallery || []).length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('fasilitas');
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-[#0b3c26] text-[#f3e5ab] shadow-sm"
              >
                Fasilitas ({facilities.length})
              </button>
            </div>
          </div>

          {/* 2-COLUMN SHOWCASE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT COLUMN: FASILITAS UTAMA */}
            <div id="facility-main-viewer" className="lg:col-span-7 xl:col-span-8 space-y-5">
              {/* Media Container: Photo with Ambient Backdrop */}
              <div className="relative w-full aspect-video sm:h-96 rounded-2xl overflow-hidden bg-neutral-950 shadow-xl border border-gray-200/80 flex items-center justify-center group">
                <img
                  src={selectedFacility.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
                />
                <img
                  src={selectedFacility.imageUrl}
                  alt={selectedFacility.name}
                  className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80';
                  }}
                />

                {/* Overlaid Badges */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2 flex-wrap pointer-events-none">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#0b3c26]/90 text-[#f3e5ab] border border-[#d4af37]/40 shadow-md">
                    Fasilitas &amp; Ruang Belajar
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#0b3c26] border border-emerald-200 shadow-sm">
                    {selectedFacility.category}
                  </span>
                </div>

                {/* Zoom Button */}
                <button
                  type="button"
                  onClick={() => setFullscreenPhoto({
                    id: selectedFacility.id,
                    title: selectedFacility.name,
                    imageUrl: selectedFacility.imageUrl,
                    category: selectedFacility.category,
                    description: selectedFacility.description,
                  })}
                  className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white transition-all cursor-pointer opacity-80 hover:opacity-100"
                  title="Lihat Gambar Ukuran Penuh"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Actions */}
              <div className="pt-2 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#0b3c26] text-[#f3e5ab] border border-[#d4af37]/30">
                      Sarana Prasarana
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#0b3c26] border border-emerald-200">
                      {selectedFacility.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openShare({
                        type: 'fasilitas',
                        id: selectedFacility.id,
                        title: selectedFacility.name,
                        description: selectedFacility.description,
                        category: selectedFacility.category,
                        imageUrl: selectedFacility.imageUrl,
                      })}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0b3c26] text-xs font-bold transition-colors cursor-pointer border border-emerald-200"
                      title="Bagikan Fasilitas"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Bagikan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFullscreenPhoto({
                        id: selectedFacility.id,
                        title: selectedFacility.name,
                        imageUrl: selectedFacility.imageUrl,
                        category: selectedFacility.category,
                        description: selectedFacility.description,
                      })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer border border-gray-200"
                      title="Lihat Penuh"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Perbesar</span>
                    </button>
                  </div>
                </div>

                {/* Judul Fasilitas */}
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#072217] tracking-tight leading-snug">
                  {selectedFacility.name}
                </h2>

                {/* Deskripsi Lengkap */}
                <div className="pt-2 border-t border-gray-200/80">
                  <p className="font-body text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedFacility.description}
                  </p>
                </div>

                {/* Spesifikasi & Keunggulan Fasilitas */}
                {selectedFacility.specifications && selectedFacility.specifications.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-heading text-sm font-bold text-[#072217] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#d4af37]" />
                      <span>Spesifikasi &amp; Fasilitas Penunjang:</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedFacility.specifications.map((spec, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-xs text-gray-800 bg-emerald-50/70 border border-emerald-200/60 p-3 rounded-xl font-medium">
                          <CheckCircle className="w-4 h-4 text-[#0b3c26] shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: FASILITAS LAINNYA (Sidebar Stack) */}
            <div className="lg:col-span-5 xl:col-span-4 bg-gray-50/70 p-4 sm:p-5 rounded-2xl border border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="font-heading text-base font-bold text-[#072217]">
                    Fasilitas Lainnya
                  </h3>
                  <span className="text-xs text-gray-500">({sidebarFacilities.length})</span>
                </div>

                <select
                  value={facilitySidebarFilter}
                  onChange={(e) => setFacilitySidebarFilter(e.target.value)}
                  className="text-xs py-1 px-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#0b3c26]"
                >
                  {facilityCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Stacked list of facilities */}
              <div className="space-y-3.5 max-h-[820px] overflow-y-auto pr-1">
                {sidebarFacilities.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-xs bg-white rounded-xl border border-dashed border-gray-200">
                    Tidak ada fasilitas lainnya dalam kategori ini.
                  </div>
                ) : (
                  sidebarFacilities.map((fac) => (
                    <div
                      key={fac.id}
                      id={`sidebar-facility-${fac.id}`}
                      onClick={() => handleSelectFacility(fac)}
                      className="group bg-white p-3 rounded-xl border border-gray-200 hover:border-[#0b3c26] shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex gap-3 items-start"
                    >
                      <div className="relative w-28 h-20 sm:w-32 sm:h-22 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                        <img
                          src={fac.imageUrl}
                          alt={fac.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-1 left-1 bg-[#072217]/85 backdrop-blur-xs text-[#d4af37] text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded">
                          {fac.category}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading text-xs sm:text-sm font-bold text-[#072217] group-hover:text-[#0b3c26] transition-colors line-clamp-2 leading-snug">
                          {fac.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                          {fac.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : activeMedia ? (
        /* ========================================================================= */
        /* SHOWCASE VIEW (Matching Layout.png when a photo/video is clicked)         */
        /* ========================================================================= */
        <div id="galeri-showcase-view" className="animate-in fade-in duration-300">
          {/* Top Control Bar: Back to Grid & Quick Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200">
            <button
              id="back-to-grid-btn"
              type="button"
              onClick={() => setActiveMedia(null)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#0b3c26] text-[#072217] hover:text-[#f3e5ab] text-xs sm:text-sm font-bold transition-all border border-gray-300 hover:border-[#0b3c26] shadow-xs cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#0b3c26] group-hover:text-[#f3e5ab]" />
              <span>← Kembali ke Semua Galeri (Grid)</span>
            </button>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">Pilihan Galeri:</span>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('galeri');
                  setSidebarFilter('foto');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeMedia.type === 'foto' && sidebarFilter === 'foto'
                    ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Galeri Foto ({gallery.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('galeri_video');
                  setSidebarFilter('video');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeMedia.type === 'video' && sidebarFilter === 'video'
                    ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Galeri Video ({(videoGallery || []).length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMedia(null);
                  setActiveTab('fasilitas');
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Fasilitas ({facilities.length})
              </button>
            </div>
          </div>

          {/* 2-COLUMN SHOWCASE GRID MATCHING Layout.png */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ------------------------------------------------------------- */}
            {/* LEFT COLUMN: PHOTO/VIDEO YANG SEDANG DITAMPILKAN             */}
            {/* ------------------------------------------------------------- */}
            <div id="galeri-main-viewer" className="lg:col-span-7 xl:col-span-8 space-y-4">
              {/* Media Container: Dark Rectangle */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-950 shadow-xl border border-gray-200/80 flex items-center justify-center">
                {activeMedia.type === 'video' ? (() => {
                  const vid = activeMedia.item as VideoGalleryItem;
                  const autoAspect = detectVideoAspectRatio(vid.videoUrl, vid.aspectRatio, vid.title, vid.description);
                  const effectiveAspect = playerAspect && playerAspect !== 'auto' ? playerAspect : autoAspect;
                  const parsed = parseVideoUrl(vid.videoUrl, vid.thumbnailUrl, effectiveAspect, vid.title, vid.description);
                  const badge = getPlatformBadge(parsed.platform);

                  return (
                    <div className="w-full h-full relative flex items-center justify-center bg-black">
                      {parsed.isDirectVideo ? (
                        <video
                          controls
                          autoPlay
                          playsInline
                          poster={parsed.thumbnailUrl}
                          src={vid.videoUrl}
                          className="w-full h-full object-contain"
                        >
                          Browser Anda tidak mendukung tag video HTML5.
                        </video>
                      ) : parsed.embedUrl ? (
                        <iframe
                          key={`${vid.id}-${effectiveAspect}`}
                          src={parsed.embedUrl}
                          title={vid.title}
                          scrolling="no"
                          style={{ border: 'none', overflow: 'hidden', width: '100%', height: '100%' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full border-0 block"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white">
                          <Film className="w-12 h-12 text-[#d4af37] mb-2" />
                          <p className="text-sm text-gray-200 mb-3">
                            Video ini dapat diputar langsung di platform resminya:
                          </p>
                          <a
                            href={vid.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 bg-[#d4af37] text-[#072217] font-bold text-xs rounded-xl flex items-center gap-2 hover:brightness-110 transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Buka Video di {badge.label}</span>
                          </a>
                        </div>
                      )}

                      {/* Floating Platform Badge */}
                      <div className="absolute top-3 left-3 z-20 pointer-events-none">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md border ${badge.bg} ${badge.border}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>
                  );
                })() : (() => {
                  const photo = activeMedia.item as GalleryItem;
                  return (
                    <div className="w-full h-full relative flex items-center justify-center bg-neutral-950 overflow-hidden group">
                      {/* Ambient Blurred Backdrop so vertical/unusual photos fit elegantly without white bars */}
                      <img
                        src={photo.imageUrl}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
                      />
                      {/* Sharp Full Image */}
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                      {/* Quick Zoom Action */}
                      <button
                        type="button"
                        onClick={() => setFullscreenPhoto(photo)}
                        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white transition-all cursor-pointer opacity-80 hover:opacity-100"
                        title="Lihat Gambar Ukuran Penuh"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* Title & Metadata & Full Description */}
              <div className="pt-2">
                {/* Meta badges & Share actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#0b3c26] text-[#f3e5ab] border border-[#d4af37]/30">
                      {activeMedia.type === 'video' ? 'Video Dokumentasi' : 'Foto Dokumentasi'}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#0b3c26] border border-emerald-200">
                      {activeMedia.item.category}
                    </span>
                    {activeMedia.item.date && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{activeMedia.item.date}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (activeMedia.type === 'foto') {
                          openShare({
                            type: 'galeri',
                            id: activeMedia.item.id,
                            title: activeMedia.item.title,
                            description: activeMedia.item.description,
                            category: activeMedia.item.category,
                            imageUrl: (activeMedia.item as GalleryItem).imageUrl,
                          });
                        } else {
                          const vid = activeMedia.item as VideoGalleryItem;
                          openShare({
                            type: 'video',
                            id: vid.id,
                            title: vid.title,
                            description: vid.description,
                            category: vid.category,
                            imageUrl: vid.thumbnailUrl,
                          });
                        }
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0b3c26] text-xs font-bold transition-colors cursor-pointer border border-emerald-200"
                      title="Bagikan"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Bagikan</span>
                    </button>

                    {activeMedia.type === 'foto' && (
                      <button
                        type="button"
                        onClick={() => setFullscreenPhoto(activeMedia.item as GalleryItem)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer border border-gray-200"
                        title="Lihat Penuh"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Perbesar</span>
                      </button>
                    )}

                    {activeMedia.type === 'video' && (activeMedia.item as VideoGalleryItem).videoUrl && (
                      <a
                        href={(activeMedia.item as VideoGalleryItem).videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#b89228] text-[#072217] text-xs font-bold transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka Asli</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Judul Foto/Video */}
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#072217] tracking-tight leading-snug">
                  {activeMedia.item.title}
                </h2>

                {/* Author Info if available */}
                {activeMedia.type === 'video' && (activeMedia.item as VideoGalleryItem).author && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                    <User className="w-3.5 h-3.5 text-[#0b3c26]" />
                    <span>Sumber / Dokumentasi: {(activeMedia.item as VideoGalleryItem).author}</span>
                  </div>
                )}

                {/* Deskripsi lengkap mengenai photo/video yang ada pada galeri */}
                <div className="mt-4 pt-4 border-t border-gray-200/80">
                  <p className="font-body text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                    {activeMedia.item.description}
                  </p>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* RIGHT COLUMN: PHOTO/VIDEO YANG LAIN (Sidebar Stack)           */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-5 xl:col-span-4 bg-gray-50/70 p-4 sm:p-5 rounded-2xl border border-gray-200">
              {/* Header & Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="font-heading text-base font-bold text-[#072217]">
                    Galeri Lainnya
                  </h3>
                  <span className="text-xs text-gray-500">({sidebarItems.length})</span>
                </div>

                {/* Quick Filters */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setSidebarFilter('semua')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      sidebarFilter === 'semua'
                        ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => setSidebarFilter('foto')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      sidebarFilter === 'foto'
                        ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => setSidebarFilter('video')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      sidebarFilter === 'video'
                        ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Video
                  </button>
                </div>
              </div>

              {/* Stacked list of items: each with Left Thumbnail and Right Title + Description */}
              <div className="space-y-3.5 max-h-[820px] overflow-y-auto pr-1">
                {sidebarItems.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-xs bg-white rounded-xl border border-dashed border-gray-200">
                    Tidak ada item galeri lainnya dalam kategori ini.
                  </div>
                ) : (
                  sidebarItems.map((item) => (
                    <div
                      key={item.id}
                      id={`sidebar-item-${item.id}`}
                      onClick={() => {
                        if (item.type === 'foto') {
                          handleOpenMedia({ type: 'foto', item: item.rawItem as GalleryItem });
                        } else {
                          handleOpenMedia({ type: 'video', item: item.rawItem as VideoGalleryItem });
                        }
                      }}
                      className="group flex flex-col sm:flex-row gap-3 p-3 rounded-xl border border-gray-200/90 bg-white hover:border-[#0b3c26]/40 hover:bg-[#e8f3ee]/30 transition-all cursor-pointer shadow-2xs hover:shadow-md"
                    >
                      {/* Left: Thumbnail box */}
                      <div className="relative w-full sm:w-40 md:w-44 aspect-video rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-gray-200/80 flex items-center justify-center">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        {item.type === 'video' ? (
                          <>
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-[#0b3c26]/90 text-[#f3e5ab] border border-[#d4af37] flex items-center justify-center shadow-md">
                                <Play className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37] ml-0.5" />
                              </div>
                            </div>
                            {item.duration && (
                              <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white font-mono text-[10px] px-1.5 py-0.5 rounded font-semibold">
                                {item.duration}
                              </span>
                            )}
                          </>
                        ) : (
                          <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white p-1 rounded-md">
                            <Camera className="w-3 h-3 text-[#d4af37]" />
                          </div>
                        )}
                      </div>

                      {/* Right: Judul Foto/Video & Deskripsi lengkap */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="font-heading text-sm font-bold text-[#072217] group-hover:text-[#0b3c26] transition-colors line-clamp-2 leading-snug">
                            {item.title}
                          </h4>
                          <p className="font-body text-xs text-gray-600 line-clamp-2 leading-relaxed mt-1">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-400">
                          <span className="font-semibold text-[#0b3c26] bg-[#e8f3ee] px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          {item.date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{item.date}</span>
                            </span>
                          )}
                        </div>
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
        /* STANDARD OVERVIEW / GRID VIEW (Before any gallery item is clicked)        */
        /* ========================================================================= */
        <div>
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-[#0b3c26] bg-[#e8f3ee] px-3.5 py-1 rounded-full inline-block mb-3 border border-[#0b3c26]/20">
              DOKUMENTASI & SARANA PRASARANA
            </span>
            <h3 className="font-heading text-2xl sm:text-4xl font-bold text-[#072217] tracking-tight">
              Galeri Kegiatan & Fasilitas Madrasah
            </h3>
            <p className="font-body text-sm sm:text-base text-gray-600 mt-2">
              Potret kehangatan belajar, dokumentasi video pembiasaan ibadah harian, dan sarana representatif di lingkungan MI Ma'arif Al Ihsan Soborejo.
            </p>
          </div>

          {/* Main Mode Tabs (Foto vs Video vs Fasilitas) */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex flex-wrap justify-center p-1.5 bg-gray-100 rounded-2xl border border-gray-200 gap-1 sm:gap-0">
              <button
                id="tab-galeri-btn"
                type="button"
                onClick={() => handleTabChange('galeri')}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'galeri'
                    ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Galeri Foto ({gallery.length})</span>
              </button>

              <button
                id="tab-video-btn"
                type="button"
                onClick={() => handleTabChange('galeri_video')}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'galeri_video'
                    ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Video className="w-4 h-4 text-[#d4af37]" />
                <span>Galeri Video ({(videoGallery || []).length})</span>
              </button>

              <button
                id="tab-fasilitas-btn"
                type="button"
                onClick={() => handleTabChange('fasilitas')}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'fasilitas'
                    ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Fasilitas & Ruang Belajar ({facilities.length})</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {(activeTab === 'galeri'
              ? galleryCategories
              : activeTab === 'galeri_video'
              ? videoCategories
              : facilityCategories
            ).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#d4af37] text-[#072217] font-bold shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 1. Galeri Foto View */}
          {activeTab === 'galeri' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-in fade-in duration-300">
              {filteredGallery.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  <Camera className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 font-medium">Belum ada foto dalam kategori ini.</p>
                </div>
              ) : (
                filteredGallery.map((item) => (
                  <div
                    key={item.id}
                    id={`gallery-card-${item.id}`}
                    onClick={() => handleOpenMedia({ type: 'foto', item })}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative h-60 overflow-hidden bg-slate-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      
                      <div className="absolute top-3 left-3 bg-[#072217]/90 backdrop-blur-md text-[#d4af37] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-[#d4af37]/30">
                        {item.category}
                      </div>

                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-4 h-4" />
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="flex items-center gap-1 text-[11px] text-[#f3e5ab] mb-1">
                          <Calendar className="w-3 h-3" />
                          <span>{item.date}</span>
                        </div>
                        <h4 className="font-heading text-base font-bold leading-snug">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <div className="p-4 flex items-center justify-between gap-2">
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed flex-1">
                        {item.description}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openShare({
                            type: 'galeri',
                            id: item.id,
                            title: item.title,
                            description: item.description,
                            category: item.category,
                            imageUrl: item.imageUrl,
                          });
                        }}
                        className="p-1.5 text-gray-400 hover:text-[#0b3c26] hover:bg-emerald-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                        title="Bagikan Foto Ini"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 2. Galeri Video View */}
          {activeTab === 'galeri_video' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {filteredVideos.length === 0 ? (
                <div className="py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  <Film className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <h4 className="font-heading text-base font-bold text-gray-700">Belum Ada Video dalam Kategori Ini</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                    Admin madrasah dapat menambahkan video dokumentasi dari YouTube, Facebook, atau link video lainnya melalui menu Admin Dashboard.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredVideos.map((video) => {
                    const autoAspect = detectVideoAspectRatio(video.videoUrl, video.aspectRatio, video.title, video.description);
                    const parsed = parseVideoUrl(video.videoUrl, video.thumbnailUrl, autoAspect, video.title, video.description);
                    const badge = getPlatformBadge(parsed.platform);

                    return (
                      <div
                        key={video.id}
                        id={`video-card-${video.id}`}
                        onClick={() => handleOpenMedia({ type: 'video', item: video })}
                        className="group bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                      >
                        {/* Video Thumbnail with Play Button Overlay */}
                        <div className="relative aspect-video w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                          <img
                            src={parsed.thumbnailUrl}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-35 pointer-events-none"
                          />
                          <img
                            src={parsed.thumbnailUrl}
                            alt={video.title}
                            className="relative w-full h-full object-contain z-10 group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-10 pointer-events-none" />

                          {/* Platform Badge */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-20">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md border ${badge.bg} ${badge.border}`}>
                              {badge.label}
                            </span>
                            {video.featured && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#d4af37] text-[#072217] shadow-sm">
                                Unggulan
                              </span>
                            )}
                          </div>

                          {/* Duration Tag */}
                          {video.duration && (
                            <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 z-20">
                              <span>{video.duration}</span>
                            </div>
                          )}

                          {/* Big Center Play Icon Button */}
                          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#0b3c26]/90 text-[#f3e5ab] border-2 border-[#d4af37] shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#072217] transition-all duration-300">
                              <Play className="w-6 h-6 fill-[#d4af37] text-[#d4af37] ml-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Meta info & Description */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-2">
                              <span className="font-semibold text-[#0b3c26] bg-[#e8f3ee] px-2 py-0.5 rounded">
                                {video.category}
                              </span>
                              {video.date && (
                                <span className="flex items-center gap-1 text-gray-400">
                                  <Calendar className="w-3 h-3" />
                                  <span>{video.date}</span>
                                </span>
                              )}
                            </div>

                            <h4 className="font-heading text-base font-bold text-[#072217] group-hover:text-[#0b3c26] transition-colors line-clamp-2 leading-snug">
                              {video.title}
                            </h4>

                            {video.description && (
                              <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                                {video.description}
                              </p>
                            )}
                          </div>

                          <div className="pt-3.5 mt-3.5 border-t border-gray-100 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-gray-400 font-medium truncate max-w-[130px]">
                              {video.author || 'MI Al Ihsan Soborejo'}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openShare({
                                    type: 'video',
                                    id: video.id,
                                    title: video.title,
                                    description: video.description,
                                    category: video.category,
                                    imageUrl: video.thumbnailUrl,
                                  });
                                }}
                                className="p-1 text-gray-400 hover:text-[#0b3c26] hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                                title="Bagikan Video Ini"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-[#0b3c26] font-bold flex items-center gap-1 group-hover:text-[#d4af37] transition-colors">
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Tonton Video</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3. Fasilitas View */}
          {activeTab === 'fasilitas' && (
            <div id="fasilitas" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-in fade-in duration-300">
              {filteredFacilities.map((fac) => (
                <div
                  key={fac.id}
                  id={`facility-card-${fac.id}`}
                  onClick={() => handleSelectFacility(fac)}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={fac.imageUrl}
                      alt={fac.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#072217]/85 backdrop-blur-md text-[#d4af37] text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-[#d4af37]/30">
                      {fac.category}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-heading text-base sm:text-lg font-bold text-[#072217] mb-2 group-hover:text-[#0b3c26] transition-colors">
                        {fac.name}
                      </h4>
                      <p className="text-xs text-[#52635c] line-clamp-2 mb-4 leading-relaxed">
                        {fac.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#0b3c26] font-semibold">
                      <span>Lihat Spesifikasi Fasilitas</span>
                      <span className="text-[#d4af37] group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal (if user clicks "Perbesar") */}
      {fullscreenPhoto && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setFullscreenPhoto(null)}
        >
          <div
            className="bg-[#072217] text-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#d4af37]/40 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setFullscreenPhoto(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={fullscreenPhoto.imageUrl}
                alt={fullscreenPhoto.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="p-5 bg-[#0b3c26] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#072217] bg-[#d4af37] px-2.5 py-0.5 rounded-full">
                  {fullscreenPhoto.category}
                </span>
                <h3 className="font-heading text-lg font-bold text-[#f3e5ab] mt-1.5">
                  {fullscreenPhoto.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => openShare({
                  type: 'galeri',
                  id: fullscreenPhoto.id,
                  title: fullscreenPhoto.title,
                  description: fullscreenPhoto.description,
                  category: fullscreenPhoto.category,
                  imageUrl: fullscreenPhoto.imageUrl,
                })}
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
