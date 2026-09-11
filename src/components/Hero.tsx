import React from 'react';
import { Award, ArrowRight, BookOpen, Compass, Download, ShieldCheck, Sparkles, CheckCircle2, Search } from 'lucide-react';
import { useDataContext } from '../context/DataContext';

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
  const { schoolProfile, isAdmin, setViewMode } = useDataContext();

  const heroTitle = schoolProfile.heroTitle || schoolProfile.tagline || "Mencetak Peserta Didik yang Religius, Berakhlaqul Karimah, Cerdas, dan Berprestasi";
  const heroSubtitle = schoolProfile.heroSubtitle || `Selamat datang di website resmi ${schoolProfile.name}, Kecamatan Pringsurat, Kabupaten Temanggung. Berkomitmen menyelenggarakan pendidikan dasar Islam yang bermakna dan berkarakter, menumbuhkan penghayatan ajaran agama, keluhuran budi pekerti, serta membina kecerdasan dan prestasi setiap peserta didik secara optimal.`;
  const heroBadge = schoolProfile.heroBadge || "LP Ma'arif NU Temanggung • Soborejo, Pringsurat";
  const heroBg = schoolProfile.heroBannerUrl || "https://images.unsplash.com/photo-1584697964190-7bb8c5a2cbb5?q=80&w=1920&auto=format&fit=crop";
  const highlights = schoolProfile.heroHighlights && schoolProfile.heroHighlights.length > 0
    ? schoolProfile.heroHighlights
    : [
        "Tahfidz Juz 30 & Tartil",
        "Kurikulum Merdeka + Kemenag",
        "Karakter Aswaja An-Nahdliyyah",
        "Lingkungan Asri & Ramah Anak"
      ];

  return (
    <section
      id="beranda"
      className="relative min-h-[88vh] bg-gradient-to-br from-[#063b25] via-[#042819] to-[#02180f] flex items-center justify-center text-center text-white px-4 sm:px-8 py-20 sm:py-28 overflow-hidden"
    >
      {/* Background Islamic Architecture & Children Atmosphere */}
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25"
        style={{
          backgroundImage: `url('${heroBg}')`,
        }}
      />

      {/* Islamic Radial Geometric Pattern Overlay */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-15 pointer-events-none" />

      {/* Subtle Warm Gold Glow in Center */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 sm:w-[550px] h-96 sm:h-[550px] bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Accreditation & Location Tag */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-[#d4af37]/15 border border-[#d4af37]/60 text-[#f3e5ab] px-4 py-1.5 rounded-full text-xs tracking-wider uppercase mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)]">
          <Award className="w-4 h-4 text-[#d4af37]" />
          <span className="font-semibold">{heroBadge}</span>
          {schoolProfile.npsn && (
            <>
              <span className="w-1 h-1 rounded-full bg-[#d4af37] hidden sm:inline" />
              <span className="hidden sm:inline">NPSN: {schoolProfile.npsn}</span>
            </>
          )}
        </div>

        {/* Main Hero Headline */}
        <h2
          id="hero-main-title"
          className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 bg-gradient-to-b from-white via-white to-[#f3e5ab] bg-clip-text text-transparent drop-shadow-sm"
        >
          {heroTitle}
        </h2>

        {/* Subtitle with local context */}
        <p className="font-body text-base sm:text-lg text-white/90 font-light max-w-2xl mx-auto mb-9 leading-relaxed">
          {heroSubtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-8">
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

          <button
            id="hero-btn-status-check"
            onClick={onOpenStatusCheck}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#d4af37]/40 bg-[#072217]/50 text-[#f3e5ab] hover:border-[#d4af37] hover:bg-[#072217]/80 px-5 py-3.5 rounded-full text-xs font-medium tracking-wide transition-all"
          >
            <Search className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Cek Status PPDB</span>
          </button>

          <button
            id="hero-btn-brochure"
            onClick={onDownloadBrochure}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-white/70 hover:text-white px-4 py-3.5 text-xs font-medium tracking-wide transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Unduh Brosur</span>
          </button>
        </div>

        {/* Micro highlights pill bar */}
        {highlights && highlights.length > 0 && (
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-white/85 max-w-3xl mx-auto">
            {highlights.map((hl, idx) => (
              <div key={idx} className="flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-full bg-white/5 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span>{hl}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
