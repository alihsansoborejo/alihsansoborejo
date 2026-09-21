import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Award,
  ArrowRight,
  Compass,
  Download,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Camera,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDataContext } from '../context/DataContext';
import { HeroSlide } from '../types';

interface HeroProps {
  onOpenPPDB: () => void;
  onExploreProfile: () => void;
  onDownloadBrochure: () => void;
  onOpenStatusCheck: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenPPDB,
  onExploreProfile,
  onDownloadBrochure,
  onOpenStatusCheck,
}) => {
  const { schoolProfile } = useDataContext();

  // Fallback slides if none configured
  const defaultSlides: HeroSlide[] = [
    {
      id: 'slide-1',
      badge: schoolProfile.heroBadge || "LP Ma'arif NU Temanggung • Soborejo, Pringsurat",
      title: schoolProfile.heroTitle || schoolProfile.tagline || "Mencetak Peserta Didik yang Religius, Berakhlaqul Karimah, Cerdas, dan Berprestasi",
      subtitle: schoolProfile.heroSubtitle || `Selamat datang di website resmi ${schoolProfile.name}, Kecamatan Pringsurat, Kabupaten Temanggung. Berkomitmen menyelenggarakan pendidikan dasar Islam yang bermakna dan berkarakter.`,
      photoUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop",
      photoCaption: "Suasana Pembelajaran Aktif & Islami di Kelas",
      bannerUrl: schoolProfile.heroBannerUrl || "https://images.unsplash.com/photo-1584697964190-7bb8c5a2cbb5?q=80&w=1920&auto=format&fit=crop",
    },
    {
      id: 'slide-2',
      badge: "Program Unggulan Madrasah • Tahfidz & Karakter Aswaja",
      title: "Membentuk Generasi Qur'ani, Berakhlak Mulia & Unggul Berprestasi",
      subtitle: "Didukung pembiasaan sholat dhuha dan dhuhur berjamaah, hafalan Juz 'Amma dan tartil Al-Qur'an, kajian Aswaja An-Nahdliyyah, serta pembelajaran Kurikulum Merdeka yang inspiratif dan berwawasan masa depan.",
      photoUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
      photoCaption: "Bimbingan Tahfidz Juz 30 & Tartil Al-Qur'an",
      bannerUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1920&auto=format&fit=crop",
    },
    {
      id: 'slide-3',
      badge: "Penerimaan Peserta Didik Baru (PPDB) • Buka Pendaftaran",
      title: "Raih Masa Depan Gemilang Bersama MI Ma'arif Al Ihsan Soborejo",
      subtitle: "Pendaftaran santri baru kini semakin praktis dan transparan secara online. Fasilitas representatif, lingkungan asri ramah anak, dan dewan guru berdedikasi tinggi siap mendampingi putra-putri tercinta.",
      photoUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
      photoCaption: "Penerimaan Peserta Didik Baru (PPDB) TP 2025/2026",
      bannerUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1920&auto=format&fit=crop",
    }
  ];

  const slides: HeroSlide[] = (schoolProfile.heroSlides && schoolProfile.heroSlides.length > 0)
    ? schoolProfile.heroSlides
    : defaultSlides;

  // Duration in seconds (clamp between 2s and 30s)
  const durationSec = Math.max(2, Math.min(30, schoolProfile.heroSliderDuration || 5));
  const autoPlayEnabled = schoolProfile.heroSliderAutoPlay ?? true;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlayEnabled);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  // Touch gesture support
  const touchStartX = useRef<number | null>(null);

  // Highlights bar
  const highlights = schoolProfile.heroHighlights && schoolProfile.heroHighlights.length > 0
    ? schoolProfile.heroHighlights
    : [
        "Tahfidz Juz 30 & Tartil",
        "Kurikulum Merdeka + Kemenag",
        "Karakter Aswaja An-Nahdliyyah",
        "Lingkungan Asri & Ramah Anak"
      ];

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  // Safe index guard
  useEffect(() => {
    if (currentIndex >= totalSlides) {
      setCurrentIndex(0);
      setProgress(0);
    }
  }, [totalSlides, currentIndex]);

  // Sync autoPlay setting changes
  useEffect(() => {
    setIsPlaying(autoPlayEnabled);
  }, [autoPlayEnabled]);

  // Progress and Auto-slide timer
  useEffect(() => {
    if (!isPlaying || isHovered || totalSlides <= 1) {
      return;
    }

    const intervalStepMs = 50; // update progress every 50ms for smooth bar
    const totalSteps = (durationSec * 1000) / intervalStepMs;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 / totalSteps);
        if (next >= 100) {
          nextSlide();
          return 0;
        }
        return next;
      });
    }, intervalStepMs);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, totalSlides, durationSec, nextSlide]);

  const activeSlide = slides[currentIndex] || slides[0] || defaultSlides[0];
  const activeBg = activeSlide.bannerUrl || schoolProfile.heroBannerUrl || defaultSlides[0].bannerUrl;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="beranda"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-[520px] lg:min-h-[580px] xl:min-h-[620px] bg-gradient-to-br from-[#063b25] via-[#042819] to-[#02180f] flex items-center justify-center text-white px-4 sm:px-8 py-8 sm:py-12 lg:py-14 overflow-hidden select-none"
    >
      {/* Background Cover Image with Transition */}
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25 transition-all duration-1000 ease-out"
        style={{
          backgroundImage: `url('${activeBg}')`,
        }}
      />

      {/* Islamic Radial Geometric Pattern Overlay */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-15 pointer-events-none" />

      {/* Subtle Warm Gold Glow in Center */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 sm:w-[580px] h-96 sm:h-[580px] bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Progress Bar (When Auto-play is active) */}
      {totalSlides > 1 && isPlaying && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-20">
          <div
            className="h-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Slider Left Arrow (Desktop & Tablet) */}
      {totalSlides > 1 && (
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Slide Sebelumnya"
          className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-[#d4af37] text-white hover:text-[#072217] border border-white/20 hover:border-[#d4af37] items-center justify-center backdrop-blur-md transition-all duration-200 shadow-xl hover:scale-105 active:scale-95 group"
        >
          <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
        </button>
      )}

      {/* Slider Right Arrow (Desktop & Tablet) */}
      {totalSlides > 1 && (
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Slide Berikutnya"
          className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-[#d4af37] text-white hover:text-[#072217] border border-white/20 hover:border-[#d4af37] items-center justify-center backdrop-blur-md transition-all duration-200 shadow-xl hover:scale-105 active:scale-95 group"
        >
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </button>
      )}

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* Dynamic Animated Slide Content */}
        <div className="min-h-[360px] sm:min-h-[420px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id || currentIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full"
            >
              {activeSlide.photoUrl ? (
                /* 2-Column Responsive Layout: Text on Left, Featured Photo on Right */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center text-center lg:text-left">
                  {/* Text Column */}
                  <div className="lg:col-span-7 flex flex-col items-center lg:items-start">
                    {/* Accreditation & Location Tag / Slide Badge */}
                    <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 bg-[#d4af37]/15 border border-[#d4af37]/60 text-[#f3e5ab] px-4 py-1.5 rounded-full text-xs tracking-wider uppercase mb-4 sm:mb-5 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                      <Award className="w-4 h-4 text-[#d4af37]" />
                      <span className="font-semibold">{activeSlide.badge || schoolProfile.heroBadge || "LP Ma'arif NU • Lembaga Satu Atap"}</span>
                      <span className="w-1 h-1 rounded-full bg-[#d4af37] hidden sm:inline" />
                      <span className="hidden sm:inline">MI NPSN: {schoolProfile.miNpsn || schoolProfile.npsn}</span>
                      {schoolProfile.raNpsn && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-[#d4af37] hidden md:inline" />
                          <span className="hidden md:inline">RA NPSN: {schoolProfile.raNpsn}</span>
                        </>
                      )}
                    </div>

                    {/* Main Hero Headline (Slide Title) */}
                    <h1
                      id="hero-main-title"
                      className="font-heading text-xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-bold leading-[1.2] tracking-tight mb-3 sm:mb-4 bg-gradient-to-b from-white via-white to-[#f3e5ab] bg-clip-text text-transparent drop-shadow-sm"
                    >
                      {activeSlide.title}
                    </h1>

                    {/* Subtitle with local context (Slide Subtitle) */}
                    <p className="font-body text-xs sm:text-sm lg:text-base text-white/90 font-light max-w-2xl mb-5 sm:mb-6 leading-relaxed">
                      {activeSlide.subtitle}
                    </p>

                    {/* Primary Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 w-full sm:w-auto">
                      <button
                        id="hero-btn-register"
                        onClick={onOpenPPDB}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] via-[#e6c25a] to-[#b89228] text-[#072217] font-bold text-xs sm:text-xs tracking-wider uppercase px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-[0_4px_16px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_24px_rgba(212,175,55,0.55)] hover:-translate-y-0.5 transition-all duration-200 border border-[#f3e5ab]"
                      >
                        <span>Daftar PPDB Online</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        id="hero-btn-profile"
                        onClick={onExploreProfile}
                        className="inline-flex items-center justify-center gap-2 border border-white/40 text-white hover:text-[#d4af37] hover:border-[#d4af37] hover:bg-[#d4af37]/10 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs font-semibold tracking-wide backdrop-blur-sm transition-all duration-200"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Jelajahi Profil</span>
                      </button>
                    </div>
                  </div>

                  {/* Featured Photo Column */}
                  <div className="lg:col-span-5 w-full max-w-md lg:max-w-none mx-auto">
                    <div className="relative group">
                      {/* Atmospheric Glow */}
                      <div className="absolute -inset-2 bg-gradient-to-tr from-[#d4af37]/40 via-[#126b40]/50 to-[#d4af37]/30 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

                      {/* Photo Frame Card */}
                      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#d4af37]/60 shadow-[0_16px_40px_rgba(0,0,0,0.5)] bg-[#042819]/90 backdrop-blur-md">
                        <div className="aspect-[4/3] sm:aspect-[16/12] w-full max-h-[360px] sm:max-h-[420px] overflow-hidden relative bg-black/40">
                          <img
                            src={activeSlide.photoUrl}
                            alt={activeSlide.title}
                            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="eager"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                          {/* Top Floating Badge */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[10px] text-[#f3e5ab] font-medium shadow-md">
                            <Camera className="w-3 h-3 text-[#d4af37]" />
                            <span>Foto Slide {currentIndex + 1} dari {totalSlides}</span>
                          </div>

                          {/* Bottom Caption Pill */}
                          {activeSlide.photoCaption && (
                            <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/75 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 text-left flex items-start gap-1.5 shadow-lg">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shrink-0 mt-1 shadow-[0_0_6px_#d4af37]" />
                              <p className="text-[11px] sm:text-xs text-white/95 font-medium leading-snug line-clamp-2">
                                {activeSlide.photoCaption}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Fallback Centered Text Layout when no photo attached */
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                  <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-[#d4af37]/15 border border-[#d4af37]/60 text-[#f3e5ab] px-4 py-1.5 rounded-full text-xs tracking-wider uppercase mb-5 sm:mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    <Award className="w-4 h-4 text-[#d4af37]" />
                    <span className="font-semibold">{activeSlide.badge || schoolProfile.heroBadge || "LP Ma'arif NU • Lembaga Satu Atap"}</span>
                    <span className="w-1 h-1 rounded-full bg-[#d4af37] hidden sm:inline" />
                    <span className="hidden sm:inline">MI NPSN: {schoolProfile.miNpsn || schoolProfile.npsn}</span>
                    {schoolProfile.raNpsn && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-[#d4af37] hidden md:inline" />
                        <span className="hidden md:inline">RA NPSN: {schoolProfile.raNpsn}</span>
                      </>
                    )}
                  </div>

                  <h1
                    id="hero-main-title"
                    className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold leading-tight tracking-tight mb-5 bg-gradient-to-b from-white via-white to-[#f3e5ab] bg-clip-text text-transparent drop-shadow-sm max-w-3xl"
                  >
                    {activeSlide.title}
                  </h1>

                  <p className="font-body text-sm sm:text-base md:text-lg text-white/90 font-light max-w-2xl mx-auto mb-7 sm:mb-8 leading-relaxed">
                    {activeSlide.subtitle}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-2">
                    <button
                      id="hero-btn-register"
                      onClick={onOpenPPDB}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] via-[#e6c25a] to-[#b89228] text-[#072217] font-bold text-sm tracking-wider uppercase px-7 py-3.5 rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.6)] hover:-translate-y-0.5 transition-all duration-300 border border-[#f3e5ab]"
                    >
                      <span>Daftar PPDB Online</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      id="hero-btn-profile"
                      onClick={onExploreProfile}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/40 text-white hover:text-[#d4af37] hover:border-[#d4af37] hover:bg-[#d4af37]/10 px-6 py-3.5 rounded-full text-sm font-semibold tracking-wide backdrop-blur-sm transition-all duration-300"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Jelajahi Profil Madrasah</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Interactive Slider Navigation & Indicators */}
        {totalSlides > 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 mt-5 sm:mt-6 mb-3 sm:mb-4">
            {/* Prev button for mobile */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Sebelumnya"
              className="sm:hidden w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Slide Dots / Indicator Pills */}
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
              {slides.map((slide, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={slide.id || idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    aria-label={`Buka slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                      isActive
                        ? 'w-7 sm:w-8 h-1.5 sm:h-2 bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.6)]'
                        : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                );
              })}
            </div>

            {/* Slide Counter & Duration Info */}
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-[#f3e5ab]/80 bg-black/30 px-2 py-0.5 rounded-full border border-white/15">
              <span className="text-white font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span>/</span>
              <span>{String(totalSlides).padStart(2, '0')}</span>
            </div>

            {/* Play/Pause Toggle */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? `Jeda putar otomatis (${durationSec} detik/slide)` : 'Putar otomatis slider'}
              aria-label={isPlaying ? 'Jeda putar otomatis' : 'Putar otomatis'}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/30 hover:bg-black/60 border border-white/15 flex items-center justify-center text-[#f3e5ab] hover:text-white transition-all text-xs"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
            </button>

            {/* Next button for mobile */}
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Berikutnya"
              className="sm:hidden w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Secondary Action Link Buttons (Cek Status & Unduh Brosur) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">
          <button
            id="hero-btn-status-check"
            onClick={onOpenStatusCheck}
            className="inline-flex items-center justify-center gap-1.5 border border-[#d4af37]/40 bg-[#072217]/60 text-[#f3e5ab] hover:border-[#d4af37] hover:bg-[#072217]/90 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-medium tracking-wide transition-all shadow-sm"
          >
            <Search className="w-3 h-3 text-[#d4af37]" />
            <span>Cek Status PPDB</span>
          </button>

          <button
            id="hero-btn-brochure"
            onClick={onDownloadBrochure}
            className="inline-flex items-center justify-center gap-1.5 text-white/75 hover:text-white px-3 py-1.5 text-[11px] sm:text-xs font-medium tracking-wide transition-all hover:underline"
          >
            <Download className="w-3 h-3 text-[#d4af37]" />
            <span>Unduh Brosur</span>
          </button>
        </div>

        {/* Micro highlights pill bar */}
        {highlights && highlights.length > 0 && (
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-white/85 max-w-3xl mx-auto">
            {highlights.map((hl, idx) => (
              <div key={idx} className="flex items-center justify-center gap-1 py-0.5 px-2.5 rounded-full bg-white/5 border border-white/10">
                <Sparkles className="w-3 h-3 text-[#d4af37] shrink-0" />
                <span>{hl}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
