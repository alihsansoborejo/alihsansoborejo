import React, { useState, useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import { useShare } from '../context/ShareContext';
import { FacilityItem, GalleryItem, VideoGalleryItem, VideoAspectRatio } from '../types';
import { parseVideoUrl, isPortraitVideoUrl, getVideoAspectConfig, detectVideoAspectRatio } from '../lib/videoUtils';
import {
  Building2,
  Camera,
  CheckCircle,
  X,
  ZoomIn,
  Calendar,
  Play,
  PlayCircle,
  Video,
  ExternalLink,
  Clock,
  User,
  Share2,
  Check,
  Film,
  Tv,
  Smartphone,
  Square,
  Sparkles
} from 'lucide-react';

export const Facilities: React.FC = () => {
  const { facilities, gallery, videoGallery, updateVideoItem } = useDataContext();
  const { activeDeepLink, consumeDeepLink, openShare } = useShare();
  const [activeTab, setActiveTab] = useState<'galeri' | 'galeri_video' | 'fasilitas'>('galeri');
  const [selectedFacility, setSelectedFacility] = useState<FacilityItem | null>(null);
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoGalleryItem | null>(null);
  const [playerAspect, setPlayerAspect] = useState<VideoAspectRatio>('auto');
  const [aspectSavedToast, setAspectSavedToast] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [copiedLink, setCopiedLink] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Auto-respond to deep links
  useEffect(() => {
    if (!activeDeepLink) return;

    if (activeDeepLink.type === 'galeri' && activeDeepLink.id) {
      const match = gallery.find(
        (g) => g.id === activeDeepLink.id || g.title.toLowerCase().includes(activeDeepLink.id!.toLowerCase())
      );
      if (match) {
        setActiveTab('galeri');
        setSelectedGallery(match);
        setHighlightedId(match.id);
        consumeDeepLink();
        setTimeout(() => {
          const card = document.getElementById(`gallery-card-${match.id}`);
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    } else if (activeDeepLink.type === 'video' && activeDeepLink.id) {
      const match = (videoGallery || []).find(
        (v) => v.id === activeDeepLink.id || v.title.toLowerCase().includes(activeDeepLink.id!.toLowerCase())
      );
      if (match) {
        setActiveTab('galeri_video');
        setSelectedVideo(match);
        setHighlightedId(match.id);
        consumeDeepLink();
        setTimeout(() => {
          const card = document.getElementById(`video-card-${match.id}`);
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    } else if (activeDeepLink.type === 'fasilitas' && activeDeepLink.id) {
      const match = facilities.find(
        (f) => f.id === activeDeepLink.id || f.name.toLowerCase().includes(activeDeepLink.id!.toLowerCase())
      );
      if (match) {
        setActiveTab('fasilitas');
        setSelectedFacility(match);
        setHighlightedId(match.id);
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
  };

  const handleCopyVideoLink = (url: string) => {
    try {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (_) {}
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
      case 'vimeo':
        return {
          bg: 'bg-sky-500 text-white',
          label: 'Vimeo',
          border: 'border-sky-400/40',
        };
      case 'tiktok':
        return {
          bg: 'bg-neutral-900 text-white',
          label: 'TikTok',
          border: 'border-neutral-700',
        };
      case 'gdrive':
        return {
          bg: 'bg-emerald-600 text-white',
          label: 'Google Drive',
          border: 'border-emerald-500/40',
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
    <section id="galeri" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
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
            onClick={() => handleTabChange('galeri')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
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
            onClick={() => handleTabChange('galeri_video')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
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
            onClick={() => handleTabChange('fasilitas')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
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
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all ${
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
                onClick={() => setSelectedGallery(item)}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

      {/* 2. Galeri Video View (New Feature!) */}
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
                    onClick={() => {
                      setSelectedVideo(video);
                      setPlayerAspect(autoAspect);
                    }}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    {/* Video Thumbnail with Play Button Overlay */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                      {/* Blurred backdrop to fill margins without letterbox lines */}
                      <img
                        src={parsed.thumbnailUrl}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-35 pointer-events-none"
                      />
                      {/* Sharp intact thumbnail - uncropped with object-contain */}
                      <img
                        src={parsed.thumbnailUrl}
                        alt={video.title}
                        className="relative w-full h-full object-contain z-10 group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-10 pointer-events-none" />

                      {/* Platform and Portrait Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-20">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md border ${badge.bg} ${badge.border}`}>
                          {badge.label}
                        </span>
                        {autoAspect === 'portrait' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-sm flex items-center gap-1">
                            <Smartphone className="w-2.5 h-2.5" /> Potret (9:16)
                          </span>
                        )}
                        {autoAspect === 'square' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-600 text-white shadow-sm flex items-center gap-1">
                            <Square className="w-2.5 h-2.5" /> Kotak (1:1)
                          </span>
                        )}
                        {autoAspect === 'classic' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-700 text-white shadow-sm flex items-center gap-1">
                            <Tv className="w-2.5 h-2.5" /> 4:3 Klasik
                          </span>
                        )}
                        {video.featured && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#d4af37] text-[#072217] shadow-sm">
                            Unggulan
                          </span>
                        )}
                      </div>

                      {/* Duration Tag */}
                      {video.duration && (
                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 z-20">
                          <Clock className="w-3 h-3 text-[#d4af37]" />
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
                            <PlayCircle className="w-3.5 h-3.5" />
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
              onClick={() => setSelectedFacility(fac)}
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

      {/* Lightbox Modal for Photo Gallery */}
      {selectedGallery && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedGallery(null)}
        >
          <div
            className="bg-[#072217] text-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#d4af37]/40 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedGallery(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 text-white hover:bg-black/80 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedGallery.imageUrl}
              alt={selectedGallery.title}
              className="w-full max-h-[420px] object-cover"
            />

            <div className="p-6">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#072217] bg-[#d4af37] px-2.5 py-0.5 rounded-full">
                    {selectedGallery.category}
                  </span>
                  <span className="text-xs text-white/60">• {selectedGallery.date}</span>
                </div>
                <button
                  type="button"
                  onClick={() => openShare({
                    type: 'galeri',
                    id: selectedGallery.id,
                    title: selectedGallery.title,
                    description: selectedGallery.description,
                    category: selectedGallery.category,
                    imageUrl: selectedGallery.imageUrl,
                  })}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-[#f3e5ab] text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-[#d4af37]/30"
                  title="Bagikan Foto"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Bagikan Foto</span>
                </button>
              </div>
              <h3 className="font-heading text-xl font-bold text-[#f3e5ab] mb-2">
                {selectedGallery.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                {selectedGallery.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Lightbox Modal */}
      {selectedVideo && (() => {
        const autoAspect = detectVideoAspectRatio(selectedVideo.videoUrl, selectedVideo.aspectRatio, selectedVideo.title, selectedVideo.description);
        const effectiveAspect = playerAspect && playerAspect !== 'auto' ? playerAspect : autoAspect;
        const aspectConfig = getVideoAspectConfig(effectiveAspect, effectiveAspect === 'portrait');
        const parsed = parseVideoUrl(selectedVideo.videoUrl, selectedVideo.thumbnailUrl, effectiveAspect, selectedVideo.title, selectedVideo.description);
        const badge = getPlatformBadge(parsed.platform);

        return (
          <div
            id="video-player-modal"
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200 overflow-y-auto"
            onClick={() => setSelectedVideo(null)}
          >
            <div
              className={`bg-[#072217] text-white rounded-2xl ${aspectConfig.modalMaxWidth} w-full overflow-hidden shadow-2xl border border-[#d4af37]/40 relative my-auto transition-all duration-300`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Title and Close Button */}
              <div className="px-4 sm:px-5 py-3 bg-[#0b3c26] border-b border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0 ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <h4 className="font-bold text-sm text-[#f3e5ab] truncate">
                    {selectedVideo.title}
                  </h4>
                </div>
                <button
                  id="close-video-modal-btn"
                  onClick={() => setSelectedVideo(null)}
                  className="p-1.5 bg-black/40 hover:bg-black/80 text-white hover:text-[#d4af37] rounded-full transition-colors shrink-0 cursor-pointer"
                  title="Tutup pemutar video"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Automatic Frame Ratio Indicator & Quick Override */}
              <div className="bg-[#051a11] px-4 py-2 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-[#d4af37]" />
                    <span>Frame Otomatis: <strong>{aspectConfig.badgeLabel}</strong></span>
                  </span>
                  {parsed.platform === 'facebook' && (
                    <span className="text-[10px] text-blue-300/80 hidden sm:inline">
                      Orientasi video Facebook disesuaikan otomatis
                    </span>
                  )}
                </div>

                {/* Subtle orientation toggles if user wants to switch */}
                <div className="flex items-center gap-1 text-[11px] flex-wrap">
                  <span className="text-white/40 text-[10px] mr-1 hidden sm:inline">Rasio Frame:</span>
                  <button
                    type="button"
                    onClick={() => setPlayerAspect('portrait')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      aspectConfig.effectiveAspect === 'portrait'
                        ? 'bg-[#d4af37] text-[#072217] shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    title="Format Vertikal 9:16 (Facebook Reels, Shorts, TikTok)"
                  >
                    <Smartphone className="w-2.5 h-2.5" />
                    <span>9:16 Potret</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayerAspect('landscape')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      aspectConfig.effectiveAspect === 'landscape'
                        ? 'bg-[#d4af37] text-[#072217] shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    title="Format Mendatar 16:9 (YouTube, Standar)"
                  >
                    <Tv className="w-2.5 h-2.5" />
                    <span>16:9 Lanskap</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayerAspect('square')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      aspectConfig.effectiveAspect === 'square'
                        ? 'bg-[#d4af37] text-[#072217] shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    title="Format Kotak 1:1"
                  >
                    <Square className="w-2.5 h-2.5" />
                    <span>1:1 Kotak</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayerAspect('classic')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      aspectConfig.effectiveAspect === 'classic'
                        ? 'bg-[#d4af37] text-[#072217] shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    title="Format 4:3 Klasik"
                  >
                    <Tv className="w-2.5 h-2.5" />
                    <span>4:3 Klasik</span>
                  </button>

                  {selectedVideo.aspectRatio !== aspectConfig.effectiveAspect && (
                    <button
                      type="button"
                      onClick={() => {
                        updateVideoItem(selectedVideo.id, { aspectRatio: aspectConfig.effectiveAspect });
                        setSelectedVideo({ ...selectedVideo, aspectRatio: aspectConfig.effectiveAspect });
                        setAspectSavedToast(true);
                        setTimeout(() => setAspectSavedToast(false), 2500);
                      }}
                      className="ml-2 text-[10px] text-emerald-300 hover:text-emerald-200 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/30 px-2.5 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                      title="Kunci format frame ini secara permanen untuk video ini"
                    >
                      <Check className="w-3 h-3" />
                      <span>{aspectSavedToast ? 'Tersimpan!' : 'Kunci Format'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Video Player Container with Automatic Adaptive Aspect Ratio */}
              <div
                className={`relative ${aspectConfig.containerAspectClass} bg-black flex items-center justify-center overflow-hidden transition-all duration-300 shadow-inner`}
                style={aspectConfig.containerStyle}
              >
                {parsed.isDirectVideo ? (
                  <video
                    controls
                    autoPlay
                    playsInline
                    poster={parsed.thumbnailUrl}
                    src={selectedVideo.videoUrl}
                    className="w-full h-full object-contain"
                    onLoadedMetadata={(e) => {
                      const v = e.currentTarget;
                      if (v.videoHeight > v.videoWidth && playerAspect === 'auto') {
                        setPlayerAspect('portrait');
                      }
                    }}
                  >
                    Browser Anda tidak mendukung tag video HTML5.
                  </video>
                ) : parsed.embedUrl ? (
                  <iframe
                    key={`${selectedVideo.id}-${aspectConfig.effectiveAspect}`}
                    src={parsed.embedUrl}
                    title={selectedVideo.title}
                    scrolling="no"
                    style={{ border: 'none', overflow: 'hidden', width: '100%', height: '100%' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0 block"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900">
                    <Film className="w-12 h-12 text-[#d4af37] mb-2" />
                    <p className="text-sm text-gray-200 mb-3">
                      Video ini dapat diputar langsung di platform resminya:
                    </p>
                    <a
                      href={selectedVideo.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-[#d4af37] text-[#072217] font-bold text-xs rounded-xl flex items-center gap-2 hover:brightness-110 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Buka Video di {badge.label}</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Video Details & Meta */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#072217] bg-[#d4af37] px-2.5 py-0.5 rounded-full">
                      {selectedVideo.category}
                    </span>
                    {selectedVideo.duration && (
                      <span className="text-xs text-white/70 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{selectedVideo.duration}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Share Button */}
                    <button
                      type="button"
                      onClick={() => openShare({
                        type: 'video',
                        id: selectedVideo.id,
                        title: selectedVideo.title,
                        description: selectedVideo.description,
                        category: selectedVideo.category,
                        imageUrl: selectedVideo.thumbnailUrl,
                      })}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#f3e5ab] text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-[#d4af37]/30"
                      title="Bagikan Tautan Video Ini"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Bagikan Video</span>
                    </button>

                    {/* External Link */}
                    <a
                      href={selectedVideo.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d4af37] hover:bg-[#b89228] text-[#072217] text-xs font-bold rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka Asli</span>
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#f3e5ab] leading-snug">
                    {selectedVideo.title}
                  </h3>
                  {selectedVideo.description && (
                    <p className="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed">
                      {selectedVideo.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-white/50 pt-2">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Sumber: {selectedVideo.author || 'Dokumentasi MI Ma\'arif Al Ihsan Soborejo'}</span>
                  </span>
                  {selectedVideo.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{selectedVideo.date}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Facility Detail Modal */}
      {selectedFacility && (
        <div
          id="facility-modal-backdrop"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedFacility(null)}
        >
          <div
            id="facility-modal-content"
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#d4af37]/30 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="facility-modal-close-btn"
              onClick={() => setSelectedFacility(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/50 text-white hover:bg-black/70 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-60 relative">
              <img
                src={selectedFacility.imageUrl}
                alt={selectedFacility.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                    {selectedFacility.category}
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                    {selectedFacility.name}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-5">
                {selectedFacility.description}
              </p>

              <h4 className="text-xs font-bold uppercase tracking-wider text-[#072217] mb-3">
                Spesifikasi & Keunggulan Fasilitas:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {selectedFacility.specifications.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-[#0b3c26] shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="facility-share-btn"
                  onClick={() => openShare({
                    type: 'fasilitas',
                    id: selectedFacility.id,
                    title: selectedFacility.name,
                    description: selectedFacility.description,
                    category: selectedFacility.category,
                    imageUrl: selectedFacility.imageUrl,
                  })}
                  className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#0b3c26] border border-emerald-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Bagikan Fasilitas</span>
                </button>

                <button
                  type="button"
                  id="facility-modal-ok-btn"
                  onClick={() => setSelectedFacility(null)}
                  className="flex-1 py-2.5 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Tutup Informasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
