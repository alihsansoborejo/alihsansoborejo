import React, { useState, useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import { useShare } from '../context/ShareContext';
import {
  Users,
  GraduationCap,
  Award,
  BookOpen,
  ShieldCheck,
  Phone,
  Sparkles,
  UserCheck,
  Share2,
  Quote,
  CheckCircle2,
  Calendar,
  Building,
  Clock,
  Heart,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  Eye,
  EyeOff,
} from 'lucide-react';
import { StaffMember } from '../types';
import { FormattedText } from './FormattedText';

export const StaffSection: React.FC = () => {
  const { staffList, isAdmin, setViewMode } = useDataContext();
  const { activeDeepLink, consumeDeepLink, openShare } = useShare();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedInstitution, setSelectedInstitution] = useState<'Semua' | 'RA' | 'MI' | 'Satu Atap'>('Semua');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  // Comprehensive full detail mode rendered IN-PLACE in current window (No popup / modal)
  const [isFullDetailMode, setIsFullDetailMode] = useState<boolean>(false);
  const [isPhotoZoomed, setIsPhotoZoomed] = useState<boolean>(false);

  const categories = ['Semua', 'Pimpinan', 'Guru Kelas', 'Guru Bidang Studi', 'Tenaga Kependidikan'];

  const filteredStaff = staffList.filter((item) => {
    const matchesCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesInst =
      selectedInstitution === 'Semua' ||
      item.institution === selectedInstitution ||
      (!item.institution && selectedInstitution === 'MI');
    return matchesCat && matchesInst;
  }).sort((a, b) => (a.order || 99) - (b.order || 99));

  // Default selectedStaff to first item of filtered staff or staffList
  useEffect(() => {
    if (!selectedStaff && filteredStaff.length > 0) {
      setSelectedStaff(filteredStaff[0]);
    } else if (selectedStaff && !filteredStaff.some((s) => s.id === selectedStaff.id)) {
      if (filteredStaff.length > 0) {
        setSelectedStaff(filteredStaff[0]);
      }
    }
  }, [filteredStaff, selectedStaff]);

  // Auto-respond to deep links
  useEffect(() => {
    if (activeDeepLink && (activeDeepLink.type === 'gtk' || activeDeepLink.type === 'guru') && activeDeepLink.id) {
      const match = staffList.find(
        (s) =>
          s.id === activeDeepLink.id ||
          s.name.toLowerCase().includes(activeDeepLink.id!.toLowerCase())
      );
      if (match) {
        setSelectedInstitution('Semua');
        setSelectedCategory('Semua');
        setSelectedStaff(match);
        setHighlightedId(match.id);
        setIsFullDetailMode(true); // Auto show full details when targeted via deep link
        consumeDeepLink();

        setTimeout(() => {
          const el = document.getElementById('gtk-main-viewer');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      }
    }
  }, [activeDeepLink, staffList, consumeDeepLink]);

  const handleShareStaff = (staff: StaffMember, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    openShare({
      type: 'gtk',
      id: staff.id,
      title: `${staff.name} - ${staff.role}`,
      description: `${staff.role} di ${
        staff.institution === 'RA'
          ? 'RA Al Ihsan Soborejo'
          : staff.institution === 'MI'
          ? 'MI Ma\'arif Al Ihsan Soborejo'
          : 'Lembaga Pendidikan Satu Atap'
      }. Pendidikan: ${staff.education || '-'}.`,
      category: staff.category,
      imageUrl: staff.photoUrl,
    });
  };

  const handleSelectStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setTimeout(() => {
      const el = document.getElementById('gtk-main-viewer');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const currentActiveStaff = selectedStaff || filteredStaff[0] || staffList[0] || null;

  // Other staff members for the right playlist (excluding currently active staff)
  const otherStaffList = filteredStaff.filter((s) => s.id !== currentActiveStaff?.id);

  // Defaults for rich detail display
  const defaultBio =
    currentActiveStaff?.bio ||
    `Pendidik berdedikasi di ${
      currentActiveStaff?.institution === 'RA'
        ? 'RA Al Ihsan Soborejo'
        : currentActiveStaff?.institution === 'Satu Atap'
        ? 'Lembaga Pendidikan Satu Atap MI Ma\'arif & RA Al Ihsan Soborejo'
        : 'MI Ma\'arif Al Ihsan Soborejo'
    }, berkomitmen membina generasi santri yang berakhlak mulia, cerdas, berlandaskan aqidah Ahlussunnah wal Jama\'ah An-Nahdliyyah.`;

  const defaultQuote =
    currentActiveStaff?.quote ||
    'Mendidik bukan hanya mentransfer pengetahuan, melainkan menyalakan lentera akhlak dan keimanan di dada setiap santri.';

  const defaultServiceYears = currentActiveStaff?.serviceYears || 'Pendidik Berdedikasi Aktif';

  const defaultExpertise =
    currentActiveStaff?.expertise && currentActiveStaff.expertise.length > 0
      ? currentActiveStaff.expertise
      : [
          'Pendidikan Karakter Aswaja',
          'Pembiasaan Ibadah Harian',
          'Pedagogik Ramah Anak',
        ];

  return (
    <section id="gtk" className="pt-3 sm:pt-4 pb-14 sm:pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-3.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#0b3c26]/10 text-[#0b3c26] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-[#0b3c26]/20">
          <Users className="w-3 h-3" />
          <span>GURU &amp; TENAGA KEPENDIDIKAN (GTK) SATU ATAP</span>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] tracking-tight">
          Pendidik Berdedikasi, Pembimbing Hati
        </h2>
        <p className="font-body text-xs sm:text-sm text-gray-600 mt-1 max-w-xl mx-auto leading-normal">
          Dewan asatidz dan asatidzah RA Al Ihsan &amp; MI Ma'arif Al Ihsan Soborejo yang membina santri dengan ketulusan hati dan keteladanan akhlak.
        </p>
      </div>

      {/* Institution Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-2">
        {(['Semua', 'RA', 'MI', 'Satu Atap'] as const).map((inst) => (
          <button
            key={inst}
            onClick={() => setSelectedInstitution(inst)}
            className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-2xs cursor-pointer ${
              selectedInstitution === inst
                ? inst === 'RA'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : inst === 'MI'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-[#072217] text-[#f3e5ab] shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {inst === 'Semua'
              ? 'Semua Lembaga'
              : inst === 'RA'
              ? 'Unit RA Al Ihsan'
              : inst === 'MI'
              ? 'Unit MI Ma\'arif'
              : 'Satu Atap'}
          </button>
        ))}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-xs'
                : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN MASTER-DETAIL LAYOUT (Matching Layout.png)                       */}
      {/* ========================================================================= */}
      {currentActiveStaff ? (
        <div id="gtk-showcase-view" className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ------------------------------------------------------------- */}
          {/* LEFT COLUMN: GTK YANG SEDANG DITAMPILKAN                      */}
          {/* ------------------------------------------------------------- */}
          <div id="gtk-main-viewer" className="lg:col-span-7 xl:col-span-8 space-y-4">
            
            {/* Top Toolbar / Mode Switcher */}
            <div className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-[#0b3c26]">
                  {isFullDetailMode ? 'Mode Detail Menyeluruh' : 'Tampilan Profil GTK'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsFullDetailMode(!isFullDetailMode)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    isFullDetailMode
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                      : 'bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] border border-[#d4af37]/40'
                  }`}
                  title={isFullDetailMode ? 'Kembali ke Tampilan Ringkas' : 'Tampilkan Seluruh Detail Profil'}
                >
                  {isFullDetailMode ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Mode Ringkas</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Detail Lengkap</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => handleShareStaff(currentActiveStaff, e)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0b3c26] text-xs font-semibold transition-colors cursor-pointer border border-emerald-200"
                  title="Bagikan Profil Pendidik"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="hidden sm:inline">Bagikan</span>
                </button>
              </div>
            </div>

            {/* IF IN FULL DETAIL MODE (Detail Menyeluruh di Jendela yang Ada) */}
            {isFullDetailMode ? (
              <div id="gtk-full-detail-card" className="bg-white rounded-2xl border-2 border-[#d4af37]/50 shadow-lg p-4 sm:p-6 space-y-5 animate-in fade-in duration-200">
                {/* Header Profile Row: Foto 3x4 + Identitas Lengkap */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 pb-4 border-b border-gray-100">
                  {/* Pas Foto 3x4 Resmi */}
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="relative group">
                      <div className="w-36 sm:w-44 aspect-[3/4] rounded-xl border-2 border-[#d4af37] shadow-md overflow-hidden bg-gradient-to-b from-[#0b3c26] via-[#072217] to-[#041a11] p-1 flex items-center justify-center relative">
                        {currentActiveStaff.photoUrl ? (
                          <img
                            src={currentActiveStaff.photoUrl}
                            alt={currentActiveStaff.name}
                            className={`w-full h-full object-contain filter contrast-105 transition-transform duration-300 ${
                              isPhotoZoomed ? 'scale-125' : ''
                            }`}
                          />
                        ) : (
                          <div className="w-full h-full bg-[#0b3c26] flex flex-col items-center justify-center text-white/80 p-3 text-center">
                            <div className="w-12 h-12 rounded-full bg-white/10 border border-[#d4af37]/50 flex items-center justify-center mb-2">
                              <GraduationCap className="w-6 h-6 text-[#d4af37]" />
                            </div>
                            <span className="text-[11px] font-semibold text-emerald-100">{currentActiveStaff.role}</span>
                          </div>
                        )}

                        {/* Institution Badge on Photo */}
                        <div className="absolute top-2 left-2">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded shadow text-white ${
                              currentActiveStaff.institution === 'RA'
                                ? 'bg-amber-600/90'
                                : currentActiveStaff.institution === 'MI'
                                ? 'bg-emerald-700/90'
                                : 'bg-teal-800/90'
                            }`}
                          >
                            {currentActiveStaff.institution === 'RA' ? 'Unit RA' : currentActiveStaff.institution === 'MI' ? 'Unit MI' : 'Satu Atap'}
                          </span>
                        </div>

                        {/* Zoom Indicator */}
                        {currentActiveStaff.photoUrl && (
                          <button
                            type="button"
                            onClick={() => setIsPhotoZoomed(!isPhotoZoomed)}
                            className="absolute bottom-2 right-2 p-1 rounded-md bg-black/60 hover:bg-black/80 text-white text-[10px] flex items-center gap-1 backdrop-blur-xs transition-all"
                            title="Zoom Foto"
                          >
                            <ZoomIn className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] font-medium text-gray-500 mt-1.5 tracking-wider uppercase">
                      Pas Foto 3 x 4 Resmi
                    </span>
                  </div>

                  {/* Profile Identity Details */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#0b3c26] text-[#f3e5ab]">
                        {currentActiveStaff.category}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {currentActiveStaff.status || 'Aktif Mengajar'}
                      </span>
                      {currentActiveStaff.institution && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                          {currentActiveStaff.institution === 'RA'
                            ? 'RA Al Ihsan Soborejo'
                            : currentActiveStaff.institution === 'MI'
                            ? 'MI Ma\'arif Al Ihsan'
                            : 'Lembaga Satu Atap'}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] leading-snug">
                        {currentActiveStaff.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-[#0b3c26] mt-0.5">
                        {currentActiveStaff.role}
                      </p>
                    </div>

                    {/* Masa Pengabdian */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#0b3c26] border border-emerald-200 text-xs font-medium">
                      <Clock className="w-3 h-3 text-[#d4af37]" />
                      <span>{defaultServiceYears}</span>
                    </div>

                    {/* Quick Metadata Box */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-gray-700">
                      {currentActiveStaff.education && (
                        <div className="flex items-start gap-1.5 bg-gray-50 p-2 rounded-lg border border-gray-200">
                          <GraduationCap className="w-3.5 h-3.5 text-[#0b3c26] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[9px] text-gray-400 block font-medium">Pendidikan Terakhir</span>
                            <span className="font-semibold text-gray-800">{currentActiveStaff.education}</span>
                          </div>
                        </div>
                      )}

                      {currentActiveStaff.nipOrNuptk && currentActiveStaff.nipOrNuptk !== '-' && (
                        <div className="flex items-start gap-1.5 bg-gray-50 p-2 rounded-lg border border-gray-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#0b3c26] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[9px] text-gray-400 block font-medium">NIP / NUPTK / PegID</span>
                            <span className="font-semibold text-gray-800">{currentActiveStaff.nipOrNuptk}</span>
                          </div>
                        </div>
                      )}

                      {currentActiveStaff.subjects && (
                        <div className="flex items-start gap-1.5 bg-gray-50 p-2 rounded-lg border border-gray-200 sm:col-span-2">
                          <BookOpen className="w-3.5 h-3.5 text-[#0b3c26] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[9px] text-gray-400 block font-medium">Mata Pelajaran / Tugas Mengajar</span>
                            <span className="font-semibold text-gray-800">{currentActiveStaff.subjects}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pesan Inspiratif (Inspirational Quote Box) */}
                <div className="bg-gradient-to-r from-[#072217] via-[#0b3c26] to-[#041a11] text-white p-4 sm:p-5 rounded-xl border border-[#d4af37]/40 shadow-sm relative overflow-hidden">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0 shadow-2xs">
                      <Quote className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37]">
                        Pesan Inspiratif &amp; Mutiara Hikmah Pendidik
                      </span>
                      <p className="font-serif italic text-xs sm:text-sm text-[#f3e5ab] leading-relaxed">
                        "{defaultQuote}"
                      </p>
                      <span className="text-[10px] text-emerald-200/80 block mt-0.5">
                        — {currentActiveStaff.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Biografi / Profil Lengkap */}
                <div className="bg-emerald-50/60 p-4 sm:p-5 rounded-xl border border-emerald-200/70">
                  <div className="flex items-center gap-1.5 mb-1.5 text-[#072217]">
                    <Heart className="w-3.5 h-3.5 text-[#0b3c26]" />
                    <h4 className="font-heading font-bold text-xs sm:text-sm">
                      Biografi &amp; Profil Lengkap Dedikasi Pengabdian
                    </h4>
                  </div>
                  <div className="font-body text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2">
                    <FormattedText text={defaultBio} />
                  </div>
                </div>

                {/* Bidang Kompetensi & Pembinaan Khusus */}
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Kompetensi &amp; Pembinaan Khusus</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {defaultExpertise.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 text-gray-700 text-xs font-medium border border-gray-200"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {currentActiveStaff.phone && (
                      <a
                        href={`https://wa.me/${currentActiveStaff.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Hubungi via WhatsApp</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleShareStaff(currentActiveStaff, e)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Bagikan Profil</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFullDetailMode(false)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>Tutup Detail (Kembali ke Ringkasan)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* STANDARD COMPACT SHOWCASE VIEW */
              <div id="gtk-compact-card" className="space-y-4">
                {/* Foto Container: Dark Rectangle uncropped portrait with ambient background */}
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[460px] rounded-2xl overflow-hidden bg-neutral-950 shadow-md border border-gray-200 flex items-center justify-center group">
                  {currentActiveStaff.photoUrl ? (
                    <>
                      <img
                        src={currentActiveStaff.photoUrl}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
                      />
                      <img
                        src={currentActiveStaff.photoUrl}
                        alt={currentActiveStaff.name}
                        className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-white">
                      <div className="w-20 h-20 rounded-full bg-[#0b3c26] border-2 border-[#d4af37] flex items-center justify-center mb-2 shadow-md">
                        <GraduationCap className="w-10 h-10 text-[#d4af37]" />
                      </div>
                      <span className="text-xs font-semibold text-emerald-100">{currentActiveStaff.role}</span>
                    </div>
                  )}

                  {/* Overlaid Badges */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 flex-wrap pointer-events-none">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold shadow-xs text-white ${
                      currentActiveStaff.institution === 'RA'
                        ? 'bg-amber-600/95'
                        : currentActiveStaff.institution === 'MI'
                        ? 'bg-emerald-700/95'
                        : 'bg-[#072217]/95 border border-[#d4af37]/40'
                    }`}>
                      {currentActiveStaff.institution === 'RA'
                        ? 'Unit RA Al Ihsan'
                        : currentActiveStaff.institution === 'MI'
                        ? 'Unit MI Ma\'arif'
                        : 'Satu Atap'}
                    </span>

                    <span className="bg-[#072217]/90 text-[#d4af37] border border-[#d4af37]/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold shadow-xs">
                      {currentActiveStaff.category}
                    </span>
                  </div>

                  {currentActiveStaff.status && (
                    <div className="absolute bottom-3 left-3 z-20">
                      <span className="bg-emerald-800/90 text-[#f3e5ab] text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-xs">
                        <UserCheck className="w-3 h-3 text-[#d4af37]" />
                        <span>{currentActiveStaff.status}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Title & Details below the photo */}
                <div className="pt-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0b3c26] text-[#f3e5ab] border border-[#d4af37]/30">
                        {currentActiveStaff.role}
                      </span>
                      {currentActiveStaff.nipOrNuptk && currentActiveStaff.nipOrNuptk !== '-' && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                          NIP/NUPTK: {currentActiveStaff.nipOrNuptk}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsFullDetailMode(true)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold transition-colors cursor-pointer border border-[#d4af37]/40 shadow-2xs"
                      >
                        <Sparkles className="w-3 h-3 text-[#d4af37]" />
                        <span>Detail Lengkap</span>
                      </button>
                    </div>
                  </div>

                  {/* Judul: Nama Lengkap Pendidik */}
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] leading-tight">
                      {currentActiveStaff.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-[#0b3c26] mt-0.5">
                      {currentActiveStaff.role} • {currentActiveStaff.institution === 'RA' ? 'RA Al Ihsan Soborejo' : 'MI Ma\'arif Al Ihsan Soborejo'}
                    </p>
                  </div>

                  {/* Kualifikasi & Detail Metadata Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                    {currentActiveStaff.education && (
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <GraduationCap className="w-3.5 h-3.5 text-[#0b3c26] shrink-0" />
                        <span>Pendidikan: <strong>{currentActiveStaff.education}</strong></span>
                      </div>
                    )}
                    {currentActiveStaff.subjects && (
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <BookOpen className="w-3.5 h-3.5 text-[#0b3c26] shrink-0" />
                        <span>Bidang Studi: <strong>{currentActiveStaff.subjects}</strong></span>
                      </div>
                    )}
                    {currentActiveStaff.phone && (
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Phone className="w-3.5 h-3.5 text-[#0b3c26] shrink-0" />
                        <a
                          href={`https://wa.me/${currentActiveStaff.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 font-semibold hover:underline"
                        >
                          Hubungi via WhatsApp
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Pesan Inspiratif & Mutiara Hikmah Pendidik (Hanya bagian ini yang dimunculkan sebelum klik Detail Lengkap) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#072217] via-[#0b3c26] to-[#041a11] text-white border border-[#d4af37]/40 shadow-sm relative overflow-hidden">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0 shadow-2xs mt-0.5">
                        <Quote className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37] block">
                          Pesan Inspiratif &amp; Mutiara Hikmah Pendidik
                        </span>
                        <p className="font-serif italic text-xs sm:text-sm text-[#f3e5ab] leading-relaxed">
                          "{defaultQuote}"
                        </p>
                        <span className="text-[10px] text-emerald-200/80 block mt-1">
                          — {currentActiveStaff.name} ({currentActiveStaff.role})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ajakan Membuka Biografi & Profil Lengkap Dedikasi Pengabdian */}
                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/60">
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0" />
                      <span>Ingin membaca seluruh biografi &amp; rekam dedikasi pengabdian pendidik ini?</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFullDetailMode(true)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold transition-all shadow-xs cursor-pointer border border-[#d4af37]/40 group shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#d4af37] group-hover:rotate-12 transition-transform" />
                      <span>Detail Lengkap (Biografi Dedikasi)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* RIGHT COLUMN: DAFTAR GTK LAINNYA                              */}
          {/* ------------------------------------------------------------- */}
          <div id="gtk-sidebar-list" className="lg:col-span-5 xl:col-span-4 space-y-3">
            {/* Header Sidebar */}
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-200">
              <span className="font-heading text-sm sm:text-base font-bold text-[#072217]">
                Pendidik &amp; Tenaga Kependidikan
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#e8f3ee] text-[#0b3c26] border border-emerald-200">
                {filteredStaff.length} GTK
              </span>
            </div>

            {/* Vertical Playlist of Staff Members */}
            <div className="space-y-2.5 max-h-[780px] overflow-y-auto pr-1">
              {otherStaffList.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-xs bg-white rounded-xl border border-dashed border-gray-200">
                  Tidak ada anggota GTK lainnya dalam filter ini.
                </div>
              ) : (
                otherStaffList.map((staff) => (
                  <div
                    key={staff.id}
                    id={`staff-sidebar-item-${staff.id}`}
                    onClick={() => handleSelectStaff(staff)}
                    className="group flex flex-col sm:flex-row gap-2.5 p-2.5 rounded-xl border border-gray-200 bg-white hover:border-[#0b3c26]/40 hover:bg-[#e8f3ee]/30 transition-all cursor-pointer shadow-2xs hover:shadow-sm"
                  >
                    {/* Left: Thumbnail Foto GTK */}
                    <div className="relative w-full sm:w-24 md:w-28 aspect-square rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-gray-200/80 flex items-center justify-center">
                      {staff.photoUrl ? (
                        <img
                          src={staff.photoUrl}
                          alt={staff.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-[#0b3c26] flex items-center justify-center">
                          <GraduationCap className="w-7 h-7 text-[#d4af37]" />
                        </div>
                      )}
                      <span className="absolute top-1 left-1 bg-black/60 text-[9px] text-white font-bold px-1.5 py-0.5 rounded">
                        {staff.institution === 'RA' ? 'RA' : staff.institution === 'MI' ? 'MI' : 'Satu Atap'}
                      </span>
                    </div>

                    {/* Right: Judul (Nama) + Deskripsi Ringkas */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-[#072217] group-hover:text-[#0b3c26] transition-colors leading-snug line-clamp-1">
                          {staff.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-[#0b3c26] mt-0.5 line-clamp-1">
                          {staff.role}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {staff.quote ? `"${staff.quote}"` : staff.bio || `${staff.education ? `Lulusan ${staff.education}. ` : ''}Pengajar dedikatif di lingkungan madrasah.`}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500">
                        <span className="font-medium text-[#d4af37] group-hover:text-[#0b3c26] flex items-center gap-0.5">
                          <span>Lihat Profil</span>
                          <span className="text-[11px]">→</span>
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[9px]">
                          {staff.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-2xl border border-gray-200 max-w-lg mx-auto p-6">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <h4 className="font-heading font-bold text-sm text-gray-800">Belum Ada Data GTK</h4>
          <p className="text-xs text-gray-500 mt-1">
            Data dewan guru dan tenaga kependidikan untuk kategori ini belum ditambahkan.
          </p>
          {isAdmin && (
            <button
              onClick={() => setViewMode('admin')}
              className="mt-3 px-3.5 py-1.5 bg-[#0b3c26] text-white text-xs font-semibold rounded-lg hover:bg-[#072217] transition-all inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Kelola GTK di Dashboard Admin</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
};
