import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { Quote, Sparkles, Compass, Eye, BookOpen, History, Shield, Heart, Award, Target, CheckCircle2 } from 'lucide-react';

export const PrincipalWelcome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sambutan' | 'visi-misi' | 'sejarah'>('sambutan');
  const { schoolProfile } = useDataContext();

  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

  return (
    <section id="profil" className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase font-bold tracking-widest text-[#0b3c26] bg-[#e8f3ee] px-3.5 py-1 rounded-full inline-block mb-3 border border-[#0b3c26]/20">
          PROFIL & IDENTITAS MADRASAH
        </span>
        <h3 className="font-heading text-2xl sm:text-4xl font-bold text-[#072217] tracking-tight">
          Membangun Fondasi Generasi Rabbani
        </h3>
        <p className="font-body text-sm sm:text-base text-gray-600 mt-2">
          Mengenal lebih dekat visi, kepemimpinan, dan nilai luhur MI Ma'arif Al Ihsan Soborejo, Temanggung.
        </p>
      </div>

      <div className="bg-gradient-to-br from-[#072217] via-[#0b3c26] to-[#041a11] text-white rounded-3xl p-6 sm:p-12 lg:p-14 border border-[#d4af37]/30 shadow-2xl relative overflow-hidden">
        {/* Subtle Islamic Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#0b3c26] rounded-full blur-2xl pointer-events-none" />

        {/* Tab switchers: Sambutan vs Visi & Misi vs Sejarah */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8 border-b border-white/15 pb-4">
          <button
            id="profil-tab-sambutan"
            onClick={() => setActiveTab('sambutan')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all ${
              activeTab === 'sambutan'
                ? 'bg-[#d4af37] text-[#072217] shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Quote className="w-4 h-4" />
            <span>Sambutan Kepala Madrasah</span>
          </button>
          <button
            id="profil-tab-visi-misi"
            onClick={() => setActiveTab('visi-misi')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all ${
              activeTab === 'visi-misi'
                ? 'bg-[#d4af37] text-[#072217] shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Visi, Misi & Tujuan</span>
          </button>
          <button
            id="profil-tab-sejarah"
            onClick={() => setActiveTab('sejarah')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all ${
              activeTab === 'sejarah'
                ? 'bg-[#d4af37] text-[#072217] shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Sejarah Singkat</span>
          </button>
        </div>

        {activeTab === 'sambutan' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center animate-in fade-in duration-300">
            {/* Principal Photo Card with Luxury Border */}
            <div className="lg:col-span-5 relative group">
              <div className="relative mx-auto max-w-sm">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-[#d4af37] via-[#0b3c26] to-[#d4af37] rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition duration-300" />
                <div className="relative rounded-2xl overflow-hidden border-2 border-[#d4af37] shadow-2xl bg-[#072217]">
                  <img
                    src={schoolProfile.headmasterPhotoUrl || "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80"}
                    alt={schoolProfile.headmasterName || "Kepala MI Ma'arif Al Ihsan Soborejo"}
                    className="w-full h-[340px] sm:h-[380px] object-cover object-top filter contrast-105"
                  />
                  <div className="p-4 bg-[#072217]/95 backdrop-blur-md border-t border-[#d4af37]/30 text-center">
                    <div className="font-heading text-[#d4af37] font-bold text-sm tracking-wide">
                      {schoolProfile.headmasterName}
                    </div>
                    <div className="text-[11px] text-white/80 mt-0.5 font-medium">
                      {schoolProfile.headmasterTitle}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      NIP/NUPTK: {schoolProfile.headmasterNip}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Principal Speech */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#d4af37]">
                  KATA SAMBUTAN
                </span>
                <h4 className="font-heading text-xl sm:text-2xl lg:text-3xl text-white font-bold mt-1 leading-snug">
                  Mendidik dengan Hati, Menuntun dengan Al-Qur'an & Keteladanan
                </h4>
              </div>

              <blockquote className="font-serif-sub italic text-sm sm:text-base text-[#f3e5ab] border-l-2 border-[#d4af37] pl-4 py-1.5 leading-relaxed bg-[#d4af37]/10 rounded-r-lg">
                "Pendidikan bukan semata mentransfer hafalan dan nilai angka, melainkan menyalakan cahaya iman, adab, dan akhlak mulia dalam dada setiap anak."
              </blockquote>

              <div className="space-y-3 font-body text-xs sm:text-sm text-white/85 leading-relaxed">
                {schoolProfile.headmasterWelcome.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-5 border-t border-white/10 text-xs text-[#f3e5ab]">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>LP Ma'arif NU Cabang Temanggung</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>Kecamatan Pringsurat</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visi-misi' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Visi Card */}
            <div className="bg-white/5 border border-[#d4af37]/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-2 text-[#d4af37] text-xs uppercase font-bold tracking-wider mb-2">
                <Eye className="w-4 h-4" />
                <span>Visi Utama Madrasah</span>
              </div>
              <p className="font-serif-sub text-lg sm:text-xl text-[#f3e5ab] leading-relaxed">
                "{schoolProfile.vision}"
              </p>
            </div>

            {/* Misi List */}
            <div>
              <h4 className="text-xs uppercase font-bold tracking-widest text-[#d4af37] mb-4 flex items-center gap-2">
                <Compass className="w-4 h-4" />
                <span>Misi Strategis Madrasah:</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schoolProfile.missions.map((misi, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 text-xs sm:text-sm text-white/90 hover:border-[#d4af37]/50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs uppercase border border-[#d4af37]/30">
                      {alphabet[i] || `${i + 1}`}
                    </div>
                    <span className="leading-relaxed">{misi}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tujuan Madrasah */}
            <div className="pt-2">
              <h4 className="text-xs uppercase font-bold tracking-widest text-[#d4af37] mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>Tujuan MI Ma'arif Al Ihsan Soborejo:</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {(schoolProfile.goals || []).map((goal, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-[#d4af37]/10 p-3.5 rounded-xl border border-[#d4af37]/25 text-xs sm:text-sm text-white/90 hover:bg-[#d4af37]/15 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#d4af37] text-[#072217] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs uppercase shadow-sm">
                      {alphabet[idx] || `${idx + 1}`}
                    </div>
                    <span className="leading-relaxed">{goal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Values */}
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-xs uppercase font-bold tracking-widest text-[#d4af37] mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>5 Nilai Utama Karakter Santri:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {schoolProfile.coreValues.map((v) => (
                  <div key={v.title} className="bg-white/5 p-4 rounded-xl border border-white/10 text-left hover:border-[#d4af37]/40 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center mb-2.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="font-heading text-sm font-bold text-[#f3e5ab]">{v.title}</div>
                    <div className="text-[11px] text-white/70 mt-1 leading-snug">{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sejarah' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs uppercase font-bold tracking-widest text-[#d4af37]">
                JEJAK LANGKAH & KIPRAH
              </span>
              <h4 className="font-heading text-2xl text-white font-bold mt-1">
                Sejarah Singkat MI Ma'arif Al Ihsan Soborejo
              </h4>
              <p className="text-xs text-white/70 mt-1">
                Berdiri di Desa Soborejo, Kecamatan Pringsurat, Kabupaten Temanggung, Jawa Tengah.
              </p>
            </div>

            <div className="space-y-4 font-body text-xs sm:text-sm text-white/85 leading-relaxed max-w-3xl">
              {schoolProfile.history.map((hist, i) => (
                <div key={i} className="flex items-start gap-3.5 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0 mt-2" />
                  <p>{hist}</p>
                </div>
              ))}
            </div>

            {/* Identitas Resmi */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h5 className="text-xs uppercase font-bold tracking-wider text-[#d4af37] mb-3">
                Identitas Resmi Kelembagaan
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="text-gray-400 block text-[10px]">NPSN</span>
                  <span className="font-semibold text-white">{schoolProfile.npsn}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="text-gray-400 block text-[10px]">NSM</span>
                  <span className="font-semibold text-white">{schoolProfile.nsm}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="text-gray-400 block text-[10px]">Akreditasi</span>
                  <span className="font-semibold text-[#d4af37]">{schoolProfile.accreditation}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="text-gray-400 block text-[10px]">Afiliasi</span>
                  <span className="font-semibold text-white">LP Ma'arif NU</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
