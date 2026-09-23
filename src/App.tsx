import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useDataContext } from './context/DataContext';
import { ShareProvider, useShare } from './context/ShareContext';
import { AdminBar } from './components/AdminBar';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './admin/AdminDashboard';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { PrincipalWelcome } from './components/PrincipalWelcome';
import { Programs } from './components/Programs';
import { ExtracurricularSection } from './components/ExtracurricularSection';
import { AchievementsSection } from './components/AchievementsSection';
import { Facilities } from './components/Facilities';
import { PPDBSection } from './components/PPDBSection';
import { NewsSection } from './components/NewsSection';
import { StaffSection } from './components/StaffSection';
import { Testimonials } from './components/Testimonials';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { PageBanner } from './components/PageBanner';
import { Footer } from './components/Footer';
import { PPDBModal } from './components/PPDBModal';
import { FloatingWA } from './components/FloatingWA';
import { NavigationTab } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Newspaper, 
  BookOpen, 
  Users, 
  GraduationCap, 
  Sparkles, 
  Award, 
  Camera, 
  MapPin, 
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Calendar
} from 'lucide-react';

function AppContent() {
  const { viewMode, schoolProfile, newsList, staffList, programs } = useDataContext();
  const { activeDeepLink } = useShare();
  const [activeTab, setActiveTab] = useState<NavigationTab>('beranda');
  const [isPPDBOpen, setIsPPDBOpen] = useState(false);
  const [ppdbInitialTab, setPpdbInitialTab] = useState<'form' | 'status' | 'alur'>('form');
  const [preselectedProgram, setPreselectedProgram] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedPreviewNewsIds, setExpandedPreviewNewsIds] = useState<Record<string, boolean>>({});

  const togglePreviewNews = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedPreviewNewsIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Sync favicon with schoolProfile.faviconUrl or fallback to logoUrl
  useEffect(() => {
    const activeFavicon = schoolProfile?.faviconUrl || schoolProfile?.logoUrl || '/assets/logo-maarif.svg';
    const favLink = document.getElementById('app-favicon') as HTMLLinkElement | null;
    if (favLink) {
      favLink.href = activeFavicon;
      if (activeFavicon.includes('.svg') || activeFavicon.startsWith('data:image/svg')) {
        favLink.type = 'image/svg+xml';
      } else if (activeFavicon.includes('.png') || activeFavicon.startsWith('data:image/png')) {
        favLink.type = 'image/png';
      } else if (activeFavicon.includes('.ico') || activeFavicon.includes('x-icon')) {
        favLink.type = 'image/x-icon';
      }
    }

    const appleLink = document.getElementById('app-apple-icon') as HTMLLinkElement | null;
    if (appleLink) {
      appleLink.href = activeFavicon;
    }
  }, [schoolProfile?.faviconUrl, schoolProfile?.logoUrl]);

  // Sync URL hash with activeTab
  useEffect(() => {
    const validTabs: NavigationTab[] = [
      'beranda',
      'berita',
      'profil',
      'gtk',
      'program',
      'ekstrakurikuler',
      'prestasi',
      'galeri',
      'ppdb',
      'kontak',
    ];

    const syncHash = () => {
      const rawHash = window.location.hash.replace('#', '').toLowerCase();
      if (validTabs.includes(rawHash as NavigationTab)) {
        setActiveTab(rawHash as NavigationTab);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  // Sync if deep-link opened from share
  useEffect(() => {
    if (activeDeepLink?.sectionId) {
      const sec = activeDeepLink.sectionId.toLowerCase();
      const validTabs: NavigationTab[] = [
        'beranda',
        'berita',
        'profil',
        'gtk',
        'program',
        'ekstrakurikuler',
        'prestasi',
        'galeri',
        'ppdb',
        'kontak',
      ];
      if (validTabs.includes(sec as NavigationTab)) {
        setActiveTab(sec as NavigationTab);
      }
    }
  }, [activeDeepLink]);

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    if (tab === 'beranda') {
      history.pushState(null, '', window.location.pathname);
    } else {
      history.pushState(null, '', `#${tab}`);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOpenPPDB = (tab: 'form' | 'status' | 'alur' = 'form', programTitle?: string) => {
    setPpdbInitialTab(tab);
    setPreselectedProgram(programTitle);
    setIsPPDBOpen(true);
  };

  const handleDownloadBrochure = () => {
    showToast("Brosur Resmi PPDB & Panduan MI Ma'arif Al Ihsan Soborejo (Format PDF) berhasil diunduh!");
  };

  // Preview articles for Beranda
  const latestNews = (newsList || []).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9] text-[#1d2925] font-body selection:bg-[#d4af37] selection:text-[#072217]">
      {/* Admin Mode Top Ribbon */}
      <AdminBar />

      {viewMode === 'admin' ? (
        /* Full Administrative CMS View */
        <AdminDashboard />
      ) : (
        /* Public School Website View with Page-by-Page View Architecture */
        <div className="flex-1 flex flex-col">
          {/* Top Bar with Prayer times & Temanggung weather */}
          <TopBar />

          {/* Primary Navigation Bar */}
          <Navbar 
            onOpenPPDB={() => handleOpenPPDB('form')} 
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          {/* Dynamic Page Views */}
          <AnimatePresence mode="wait">
            <motion.main
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex-1"
            >
              {/* VIEW 1: BERANDA */}
              {activeTab === 'beranda' && (
                <div id="beranda-view" className="space-y-12 sm:space-y-16">
                  {/* Hero Slider */}
                  <Hero
                    onOpenPPDB={() => handleOpenPPDB('form')}
                    onExploreProfile={() => handleTabChange('profil')}
                    onDownloadBrochure={handleDownloadBrochure}
                    onOpenStatusCheck={() => handleOpenPPDB('status')}
                  />

                  {/* Floating Stats */}
                  <Stats />

                  {/* Highlight 1: Warta & Berita Terkini */}
                  <section className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-gray-200/80 pb-4">
                      <div>
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0b3c26] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 mb-2">
                          <Newspaper className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>KABAR &amp; WARTA MADRASAH</span>
                        </div>
                        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#072217]">
                          Warta &amp; Berita Terkini
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          Kabar terbaru seputar kegiatan, agenda keagamaan, dan prestasi santri.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTabChange('berita')}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0b3c26] hover:text-[#d4af37] transition-colors group cursor-pointer"
                      >
                        <span>Lihat Semua Berita &amp; Agenda</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#d4af37]" />
                      </button>
                    </div>

                    {/* Preview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                      {latestNews.map((article) => {
                        const isExpanded = !!expandedPreviewNewsIds[article.id];
                        const contentParagraphs = Array.isArray(article.content)
                          ? article.content
                          : typeof article.content === 'string' && article.content.trim()
                          ? article.content.split(/\n\n+/).filter(Boolean)
                          : article.summary
                          ? [article.summary]
                          : [];

                        return (
                          <div
                            key={article.id}
                            className={`bg-white rounded-2xl overflow-hidden border transition-all flex flex-col justify-between ${
                              isExpanded
                                ? 'border-[#0b3c26]/40 shadow-md ring-1 ring-emerald-700/20'
                                : 'border-[#0b3c26]/10 shadow-sm hover:shadow-md'
                            }`}
                          >
                            <div
                              onClick={(e) => togglePreviewNews(article.id, e)}
                              className="relative h-48 overflow-hidden bg-gray-100 cursor-pointer group/img"
                              title="Klik foto untuk membaca berita"
                            >
                              <img
                                src={article.imageUrl || '/assets/madrasah-gedung.svg'}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/assets/madrasah-gedung.svg';
                                }}
                              />
                              <div className="absolute top-3 left-3 bg-[#0b3c26]/90 backdrop-blur-xs text-[#f3e5ab] text-[10px] font-bold px-2.5 py-1 rounded-md">
                                {article.category || 'Warta'}
                              </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-2">
                                  <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                                  <span>{article.date}</span>
                                </div>
                                <h3
                                  onClick={(e) => togglePreviewNews(article.id, e)}
                                  className="font-heading text-base font-bold text-[#072217] group-hover:text-[#0b3c26] line-clamp-2 transition-colors cursor-pointer hover:underline decoration-[#d4af37]/60"
                                  title="Klik judul untuk membaca"
                                >
                                  {article.title}
                                </h3>

                                <div className="text-xs text-gray-600 mt-2 leading-relaxed">
                                  {isExpanded ? (
                                    <div className="space-y-2.5 text-gray-800 animate-in fade-in duration-200">
                                      {contentParagraphs.length > 0 ? (
                                        contentParagraphs.map((p, pIdx) => (
                                          <p key={pIdx} className={pIdx === 0 ? "font-medium text-gray-900" : ""}>
                                            {p}
                                          </p>
                                        ))
                                      ) : (
                                        <p>{article.summary}</p>
                                      )}
                                      <div className="pt-2 text-[11px] text-emerald-800 font-medium border-t border-gray-100 flex items-center justify-between">
                                        <span>Penulis: {article.author}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleTabChange('berita')}
                                          className="text-[#0b3c26] hover:text-[#d4af37] underline cursor-pointer"
                                        >
                                          Buka Tab Berita
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="line-clamp-3">
                                      {article.summary || (contentParagraphs[0] ?? '')}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={(e) => togglePreviewNews(article.id, e)}
                                  className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all px-2.5 py-1.5 rounded-lg cursor-pointer ${
                                    isExpanded
                                      ? 'bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300/80 shadow-xs'
                                      : 'text-[#0b3c26] hover:text-[#d4af37] hover:bg-emerald-50'
                                  }`}
                                >
                                  <span>{isExpanded ? 'Ciutkan Berita' : 'Baca Selengkapnya'}</span>
                                  {isExpanded ? (
                                    <ChevronUp className="w-3.5 h-3.5 text-amber-900" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleTabChange('berita')}
                                  className="text-[11px] text-gray-500 hover:text-[#0b3c26] transition-colors cursor-pointer"
                                >
                                  Lihat Semua
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Highlight 2: Sekilas Profil & Sambutan Kepala Madrasah */}
                  <section className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="bg-gradient-to-br from-[#072217] via-[#0b3c26] to-[#041a11] text-white rounded-3xl p-6 sm:p-10 border-2 border-[#d4af37]/30 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-[#d4af37] shrink-0 shadow-lg bg-white/10">
                          <img
                            src={schoolProfile.principalPhoto || '/assets/kepala-madrasah.svg'}
                            alt={schoolProfile.principalName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/kepala-madrasah.svg';
                            }}
                          />
                        </div>

                        <div className="flex-1 text-center lg:text-left space-y-3">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-bold tracking-wider uppercase">
                            <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>SAMBUTAN KEPALA MADRASAH</span>
                          </div>

                          <h2 className="font-heading text-xl sm:text-3xl font-bold text-white leading-tight">
                            "Membentuk Generasi Santri yang Qur'ani, Berakhlakul Karimah, dan Unggul Akademik"
                          </h2>

                          <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-3xl">
                            {schoolProfile.principalWelcomeText 
                              ? schoolProfile.principalWelcomeText.slice(0, 240) + '...'
                              : "Selamat datang di website resmi Lembaga Pendidikan Satu Atap RA Al Ihsan dan MI Ma'arif Al Ihsan Soborejo, Pringsurat, Kabupaten Temanggung..."}
                          </p>

                          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                            <button
                              type="button"
                              onClick={() => handleTabChange('profil')}
                              className="px-5 py-2.5 rounded-full bg-[#d4af37] text-[#072217] hover:bg-[#e5c158] text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                            >
                              <span>Buka Profil, Visi-Misi &amp; Sejarah</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleTabChange('gtk')}
                              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-all border border-white/20 inline-flex items-center gap-2 cursor-pointer"
                            >
                              <Users className="w-4 h-4 text-[#d4af37]" />
                              <span>Lihat Dewan Guru (GTK)</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Highlight 3: Showcase Ekosistem Madrasah */}
                  <section className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                      <span className="text-xs uppercase font-bold tracking-widest text-[#d4af37] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        LAYANAN LENGKAP SATU ATAP
                      </span>
                      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#072217] mt-2">
                        Jelajahi Informasi Madrasah
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Pilih halaman yang ingin Anda tuju untuk melihat rincian kurikulum, prestasi santri, fasilitas, dan kegiatan.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {/* Box 1: Program */}
                      <div 
                        onClick={() => handleTabChange('program')}
                        className="bg-white p-6 rounded-2xl border border-[#0b3c26]/10 shadow-xs hover:shadow-md hover:border-[#d4af37]/60 transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0b3c26] flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
                            <GraduationCap className="w-5 h-5 text-[#d4af37]" />
                          </div>
                          <h3 className="font-heading text-base font-bold text-[#072217] group-hover:text-[#0b3c26]">
                            Program Unggulan
                          </h3>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Kelas Tahfidz Al-Qur'an, Pembiasaan Aswaja, Bilingual Arab-Inggris, dan KBM Terpadu.
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-[#0b3c26] flex items-center gap-1">
                          <span>Buka Program</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Box 2: Ekstrakurikuler */}
                      <div 
                        onClick={() => handleTabChange('ekstrakurikuler')}
                        className="bg-white p-6 rounded-2xl border border-[#0b3c26]/10 shadow-xs hover:shadow-md hover:border-[#d4af37]/60 transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#0b3c26] flex items-center justify-center border border-amber-100 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-5 h-5 text-[#d4af37]" />
                          </div>
                          <h3 className="font-heading text-base font-bold text-[#072217] group-hover:text-[#0b3c26]">
                            Ekstrakurikuler Santri
                          </h3>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Hadroh rebana, Pramuka Ma'arif, Pencak Silat Pagar Nusa, dan Kaligrafi Islam.
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-[#0b3c26] flex items-center gap-1">
                          <span>Buka Ekskul</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Box 3: Prestasi */}
                      <div 
                        onClick={() => handleTabChange('prestasi')}
                        className="bg-white p-6 rounded-2xl border border-[#0b3c26]/10 shadow-xs hover:shadow-md hover:border-[#d4af37]/60 transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#0b3c26] flex items-center justify-center border border-rose-100 group-hover:scale-110 transition-transform">
                            <Award className="w-5 h-5 text-[#d4af37]" />
                          </div>
                          <h3 className="font-heading text-base font-bold text-[#072217] group-hover:text-[#0b3c26]">
                            Prestasi Santri
                          </h3>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Raihan piala dan piagam kejuaraan MTQ, cerdas cermat sains, dan olahraga santri.
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-[#0b3c26] flex items-center gap-1">
                          <span>Buka Prestasi</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Box 4: Galeri & Fasilitas */}
                      <div 
                        onClick={() => handleTabChange('galeri')}
                        className="bg-white p-6 rounded-2xl border border-[#0b3c26]/10 shadow-xs hover:shadow-md hover:border-[#d4af37]/60 transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0b3c26] flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                            <Camera className="w-5 h-5 text-[#d4af37]" />
                          </div>
                          <h3 className="font-heading text-base font-bold text-[#072217] group-hover:text-[#0b3c26]">
                            Galeri Foto &amp; Fasilitas
                          </h3>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Ruang kelas nyaman, gedung madrasah, musholla, serta dokumentasi KBM santri.
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-[#0b3c26] flex items-center gap-1">
                          <span>Buka Galeri</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Highlight 4: Banner PPDB Terpadu */}
                  <section className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="bg-gradient-to-r from-[#0b3c26] via-[#125838] to-[#0b3c26] text-white rounded-3xl p-6 sm:p-10 border border-[#d4af37]/40 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
                      <div className="space-y-2 text-center lg:text-left">
                        <span className="text-xs uppercase font-bold tracking-widest text-[#f3e5ab] bg-white/10 px-3 py-1 rounded-full border border-white/20">
                          PENDAFTARAN PESERTA DIDIK BARU (PPDB)
                        </span>
                        <h2 className="font-heading text-xl sm:text-3xl font-bold text-white">
                          Penerimaan Santri Baru RA &amp; MI Al Ihsan Soborejo
                        </h2>
                        <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                          Daftarkan putra-putri tercinta untuk memperoleh pendidikan dasar terpadu berkarakter Islami dan berkualitas.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleTabChange('ppdb')}
                          className="px-5 py-3 rounded-xl bg-white text-[#072217] hover:bg-emerald-50 text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                        >
                          Pelajari Alur &amp; Syarat PPDB
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenPPDB('form')}
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b89228] text-[#072217] font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105"
                        >
                          Daftar Sekarang
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Testimonials */}
                  <Testimonials />

                  {/* FAQ */}
                  <FAQSection />
                </div>
              )}

              {/* VIEW 2: BERITA & WARTA */}
              {activeTab === 'berita' && (
                <div id="berita-page-view" className="space-y-3 sm:space-y-4">
                  <PageBanner
                    title="Warta, Berita &amp; Agenda Madrasah"
                    subtitle="Kabar prestasi, informasi agenda akademik, kalender pendidikan, dan dinamika kegiatan santri RA &amp; MI Ma'arif Al Ihsan Soborejo"
                    badge="WARTA &amp; INFORMASI"
                    icon={<Newspaper className="w-3.5 h-3.5" />}
                    activeTab="berita"
                    onGoHome={() => handleTabChange('beranda')}
                  />
                  <NewsSection />
                </div>
              )}

              {/* VIEW 3: PROFIL & SAMBUTAN */}
              {activeTab === 'profil' && (
                <div id="profil-page-view" className="space-y-3 sm:space-y-4">
                  <PageBanner
                    title="Profil Lembaga Satu Atap"
                    subtitle="Mengenal identitas madrasah, dewan pimpinan, visi misi lembaga, serta sejarah singkat perjuangan berdirinya RA &amp; MI Ma'arif Al Ihsan Soborejo"
                    badge="TENTANG KAMI"
                    icon={<BookOpen className="w-3.5 h-3.5" />}
                    activeTab="profil"
                    onGoHome={() => handleTabChange('beranda')}
                  />
                  <PrincipalWelcome />
                </div>
              )}

              {/* VIEW 4: GTK (GURU & TENAGA KEPENDIDIKAN) */}
              {activeTab === 'gtk' && (
                <div id="gtk-page-view" className="space-y-3 sm:space-y-4">
                  <PageBanner
                    title="Guru &amp; Tenaga Kependidikan (GTK)"
                    subtitle="Dewan Asatidz dan Asatidzah yang berdedikasi tinggi, berjiwa Ahlussunnah wal Jama'ah An-Nahdliyyah, membimbing santri dengan keteladanan dan kasih sayang"
                    badge="DEWAN PENDIDIK"
                    icon={<Users className="w-3.5 h-3.5" />}
                    activeTab="gtk"
                    onGoHome={() => handleTabChange('beranda')}
                  />
                  <StaffSection />
                </div>
              )}

              {/* VIEW 5: PROGRAM UNGGULAN */}
              {activeTab === 'program' && (
                <div id="program-page-view" className="space-y-3 sm:space-y-4">
                  <PageBanner
                    title="Program Unggulan Madrasah"
                    subtitle="Kurikulum terpadu berbasis keislaman, penguatan akhlak karimah, tahfidz Al-Qur'an, dan pembiasaan ibadah harian"
                    badge="KURIKULUM &amp; KBM"
                    icon={<GraduationCap className="w-3.5 h-3.5" />}
                    activeTab="program"
                    onGoHome={() => handleTabChange('beranda')}
                    actions={
                      <button
                        type="button"
                        onClick={() => handleOpenPPDB('form')}
                        className="px-4 py-2 rounded-full bg-[#d4af37] text-[#072217] font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#e5c158] transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Daftar Santri Baru</span>
                      </button>
                    }
                  />
                  <Programs onRegisterProgram={(title) => handleOpenPPDB('form', title)} />
                </div>
              )}

              {/* VIEW 6: EKSTRAKURIKULER */}
              {activeTab === 'ekstrakurikuler' && (
                <div id="ekstrakurikuler-page-view" className="space-y-3 sm:space-y-4">
                  <PageBanner
                    title="Ekstrakurikuler Santri"
                    subtitle="Wadah pembinaan minat, bakat, kepemimpinan, seni Islam hadroh, kepramukaan, dan kebugaran jasmani santri"
                    badge="MINAT &amp; BAKAT"
                    icon={<Sparkles className="w-3.5 h-3.5" />}
                    activeTab="ekstrakurikuler"
                    onGoHome={() => handleTabChange('beranda')}
                  />
                  <ExtracurricularSection />
                </div>
              )}

              {/* VIEW 7: PRESTASI */}
              {activeTab === 'prestasi' && (
                <div id="prestasi-page-view" className="space-y-3 sm:space-y-4">
                  <PageBanner
                    title="Prestasi Santri &amp; Madrasah"
                    subtitle="Rekam jejak kebanggaan raihan juara santri di bidang keagamaan, sains, seni, dan kepramukaan"
                    badge="PRESTASI &amp; PENGHARGAAN"
                    icon={<Award className="w-3.5 h-3.5" />}
                    activeTab="prestasi"
                    onGoHome={() => handleTabChange('beranda')}
                  />
                  <AchievementsSection />
                </div>
              )}

              {/* VIEW 8: GALERI & FASILITAS */}
              {activeTab === 'galeri' && (
                <div id="galeri-page-view" className="space-y-3 sm:space-y-4">
                  <PageBanner
                    title="Galeri Foto &amp; Sarana Prasarana"
                    subtitle="Dokumentasi visual lingkungan belajar, ruang kelas representatif, perpustakaan, dan fasilitas penunjang pembelajaran"
                    badge="DOKUMENTASI VISUAL"
                    icon={<Camera className="w-3.5 h-3.5" />}
                    activeTab="galeri"
                    onGoHome={() => handleTabChange('beranda')}
                  />
                  <Facilities />
                </div>
              )}

              {/* VIEW 9: PPDB ONLINE */}
              {activeTab === 'ppdb' && (
                <div id="ppdb-page-view" className="space-y-3 sm:space-y-4">
                  <PageBanner
                    title="Penerimaan Peserta Didik Baru (PPDB) Online"
                    subtitle="Pendaftaran santri baru RA Al Ihsan dan MI Ma'arif Al Ihsan Soborejo Tahun Ajaran Baru secara terpadu satu atap"
                    badge="PPDB SATU ATAP"
                    icon={<GraduationCap className="w-3.5 h-3.5" />}
                    activeTab="ppdb"
                    onGoHome={() => handleTabChange('beranda')}
                    actions={
                      <button
                        type="button"
                        onClick={() => handleOpenPPDB('form')}
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c59e2b] text-[#072217] font-bold text-xs uppercase shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Buka Formulir Pendaftaran</span>
                      </button>
                    }
                  />
                  <PPDBSection
                    onOpenPPDBForm={() => handleOpenPPDB('form')}
                    onOpenStatusCheck={() => handleOpenPPDB('status')}
                    onDownloadBrochure={handleDownloadBrochure}
                  />
                </div>
              )}

              {/* VIEW 10: KONTAK & LOKASI */}
              {activeTab === 'kontak' && (
                <div id="kontak-page-view" className="space-y-3 sm:space-y-4">
                  <PageBanner
                    title="Kontak &amp; Lokasi Madrasah"
                    subtitle="Layanan konsultasi informasi, pendaftaran santri via WhatsApp, serta peta lokasi Desa Soborejo, Pringsurat, Temanggung"
                    badge="HUBUNGI KAMI"
                    icon={<MapPin className="w-3.5 h-3.5" />}
                    activeTab="kontak"
                    onGoHome={() => handleTabChange('beranda')}
                  />
                  <ContactSection />
                  <FAQSection />
                </div>
              )}
            </motion.main>
          </AnimatePresence>

          {/* Footer with page navigation */}
          <Footer 
            onOpenPPDB={() => handleOpenPPDB('form')} 
            onTabChange={handleTabChange}
          />

          {/* PPDB Registration & Status Modal */}
          <PPDBModal
            isOpen={isPPDBOpen}
            onClose={() => setIsPPDBOpen(false)}
            initialTab={ppdbInitialTab}
            preselectedProgram={preselectedProgram}
          />

          {/* Floating WhatsApp Contact */}
          <FloatingWA />
        </div>
      )}

      {/* Admin Login Dialog Modal */}
      <AdminLoginModal />

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div
          id="app-toast-notification"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#072217] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#d4af37] flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-300 max-w-md text-xs sm:text-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ShareProvider>
          <AppContent />
        </ShareProvider>
      </DataProvider>
    </AuthProvider>
  );
}
