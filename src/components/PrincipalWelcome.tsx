import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { Quote, Sparkles, Compass, Eye, BookOpen, History, Shield, Heart, Award, Target, CheckCircle2, Sliders, Camera, Edit3 } from 'lucide-react';
import { HeadmasterPhotoModal } from './HeadmasterPhotoModal';
import { HistoryEditModal } from './HistoryEditModal';

export const PrincipalWelcome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sambutan' | 'visi-misi' | 'sejarah'>('sambutan');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const { schoolProfile, isAdmin } = useDataContext();

  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

  const photoPos = schoolProfile.headmasterPhotoPosition || 'top';
  const photoScale = schoolProfile.headmasterPhotoScale ?? 100;
  const photoFit = schoolProfile.headmasterPhotoFit || 'cover';

  const positionClass =
    photoPos === 'center'
      ? 'object-center'
      : photoPos === 'bottom'
      ? 'object-bottom'
      : 'object-top';

  const fitClass = photoFit === 'contain' ? 'object-contain' : 'object-cover';

  const transformOrigin =
    photoPos === 'top'
      ? 'top center'
      : photoPos === 'bottom'
      ? 'bottom center'
      : 'center center';

  return (
    <section id="profil" className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase font-bold tracking-widest text-[#0b3c26] bg-[#e8f3ee] px-3.5 py-1 rounded-full inline-block mb-3 border border-[#0b3c26]/20">
          PROFIL &amp; IDENTITAS LEMBAGA SATU ATAP
        </span>
        <h3 className="font-heading text-2xl sm:text-4xl font-bold text-[#072217] tracking-tight">
          Membina Generasi Rabbani Sejak Dini
        </h3>
        <p className="font-body text-sm sm:text-base text-gray-600 mt-2">
          Mengenal lebih dekat visi, kepemimpinan, dan sinergi berkelanjutan RA Al Ihsan &amp; MI Ma'arif Al Ihsan Soborejo, Temanggung.
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
                  {/* Action Button: Atur & Sesuaikan Foto */}
                  <button
                    id="btn-adjust-headmaster-photo"
                    type="button"
                    onClick={() => setIsPhotoModalOpen(true)}
                    className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#072217]/90 hover:bg-[#072217] text-[#d4af37] border border-[#d4af37]/70 shadow-lg text-[11px] font-semibold backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                    title="Atur, sesuaikan posisi/zoom, atau ganti foto kepala madrasah"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Atur Foto</span>
                  </button>

                  <div className="w-full h-[340px] sm:h-[380px] overflow-hidden relative flex items-center justify-center bg-[#041a11]">
                    {schoolProfile.headmasterPhotoUrl ? (
                      <img
                        src={schoolProfile.headmasterPhotoUrl}
                        alt={schoolProfile.headmasterName || "Kepala MI Ma'arif Al Ihsan Soborejo"}
                        style={{
                          transform: `scale(${photoScale / 100})`,
                          transformOrigin,
                        }}
                        className={`w-full h-full filter contrast-105 transition-transform duration-300 ${fitClass} ${positionClass}`}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#0b3c26] to-[#041a11]">
                        <div className="w-24 h-24 rounded-full bg-emerald-900/50 border-2 border-[#d4af37]/60 flex items-center justify-center mb-3 text-[#d4af37] shadow-xl">
                          <Camera className="w-10 h-10 opacity-70" />
                        </div>
                        <p className="text-white font-semibold text-sm">{schoolProfile.headmasterName || 'MUIN, S.Pd.I.'}</p>
                        <p className="text-emerald-300/80 text-xs mt-0.5">{schoolProfile.headmasterTitle || 'Kepala Madrasah'}</p>
                        <button
                          onClick={() => setIsPhotoModalOpen(true)}
                          className="mt-3 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#d4af37] text-emerald-950 hover:bg-[#c49f27] transition shadow"
                        >
                          Unggah Foto Resmi
                        </button>
                      </div>
                    )}
                  </div>

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
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

              <button
                id="btn-edit-history-text"
                type="button"
                onClick={() => setIsHistoryModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59e2b] hover:from-[#f3e5ab] hover:to-[#d4af37] text-[#072217] text-xs font-bold transition-all shadow-md shrink-0 hover:scale-105 active:scale-95 cursor-pointer self-start sm:self-auto"
                title="Ubah narasi dan butir sejarah singkat madrasah"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Ubah Teks Sejarah</span>
              </button>
            </div>

            <div className="space-y-4 font-body text-xs sm:text-sm text-white leading-relaxed max-w-4xl">
              {schoolProfile.history.map((hist, i) => (
                <div key={i} className="flex items-start gap-3.5 bg-[#052317]/90 p-4 sm:p-5 rounded-2xl border border-emerald-500/30 shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] shrink-0 mt-1.5 shadow-sm" />
                  <p className="text-white text-xs sm:text-sm leading-relaxed">{hist}</p>
                </div>
              ))}
            </div>

            {/* Identitas Resmi Kelembagaan Satu Atap - Didesain Kontras Tinggi dan Jelas */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs uppercase font-bold tracking-wider text-[#d4af37]">
                    Identitas Resmi Kelembagaan Satu Atap
                  </h5>
                  <p className="text-[11px] text-emerald-200">
                    Data pokok kelembagaan resmi di bawah naungan LP Ma'arif NU Kabupaten Temanggung
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* RA Al Ihsan Card */}
                <div className="bg-[#062618] p-5 sm:p-6 rounded-2xl border-2 border-amber-400/50 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-amber-400/20">
                    <div>
                      <span className="font-heading font-bold text-base sm:text-lg text-[#f3e5ab] block">
                        {schoolProfile.raName || "RA AL IHSAN SOBOREJO"}
                      </span>
                      <span className="text-[11px] text-emerald-200">Unit Pendidikan Anak Usia Dini</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold bg-amber-400/25 text-[#f3e5ab] px-2.5 py-1 rounded-full border border-amber-400/40 shrink-0">
                      Jenjang RA / PAUD
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-black/30 p-2.5 rounded-xl border border-amber-400/20">
                      <span className="text-emerald-200/90 font-medium block text-[11px] mb-0.5">NPSN RA</span>
                      <span className="font-bold text-white text-xs sm:text-sm tracking-wide">{schoolProfile.raNpsn || "69991234"}</span>
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-xl border border-amber-400/20">
                      <span className="text-emerald-200/90 font-medium block text-[11px] mb-0.5">NSM RA</span>
                      <span className="font-bold text-white text-xs sm:text-sm tracking-wide">{schoolProfile.raNsm || "101233230045"}</span>
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-xl border border-amber-400/20">
                      <span className="text-emerald-200/90 font-medium block text-[11px] mb-0.5">Status Akreditasi</span>
                      <span className="font-bold text-[#d4af37] text-xs sm:text-sm">{schoolProfile.raAccreditation || "Terakreditasi"}</span>
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-xl border border-amber-400/20">
                      <span className="text-emerald-200/90 font-medium block text-[11px] mb-0.5">Kepala RA</span>
                      <span className="font-bold text-white text-xs sm:text-sm">{schoolProfile.raHeadName || "SITI ROHMAH, S.Pd.I."}</span>
                    </div>
                  </div>
                </div>

                {/* MI Ma'arif Card */}
                <div className="bg-[#062618] p-5 sm:p-6 rounded-2xl border-2 border-emerald-400/50 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-emerald-400/20">
                    <div>
                      <span className="font-heading font-bold text-base sm:text-lg text-[#f3e5ab] block">
                        {schoolProfile.miName || "MI MA'ARIF AL IHSAN SOBOREJO"}
                      </span>
                      <span className="text-[11px] text-emerald-200">Unit Madrasah Ibtidaiyah Dasar</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold bg-emerald-500/25 text-emerald-200 px-2.5 py-1 rounded-full border border-emerald-400/40 shrink-0">
                      Jenjang MI (SD)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-black/30 p-2.5 rounded-xl border border-emerald-400/20">
                      <span className="text-emerald-200/90 font-medium block text-[11px] mb-0.5">NPSN MI</span>
                      <span className="font-bold text-white text-xs sm:text-sm tracking-wide">{schoolProfile.miNpsn || schoolProfile.npsn || "60713037"}</span>
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-xl border border-emerald-400/20">
                      <span className="text-emerald-200/90 font-medium block text-[11px] mb-0.5">NSM MI</span>
                      <span className="font-bold text-white text-xs sm:text-sm tracking-wide">{schoolProfile.miNsm || schoolProfile.nsm || "111233230053"}</span>
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-xl border border-emerald-400/20">
                      <span className="text-emerald-200/90 font-medium block text-[11px] mb-0.5">Status Akreditasi</span>
                      <span className="font-bold text-[#d4af37] text-xs sm:text-sm">{schoolProfile.miAccreditation || schoolProfile.accreditation || "Terakreditasi Baik"}</span>
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-xl border border-emerald-400/20">
                      <span className="text-emerald-200/90 font-medium block text-[11px] mb-0.5">Kepala MI</span>
                      <span className="font-bold text-white text-xs sm:text-sm">{schoolProfile.headmasterName || "MUIN, S.Pd.I."}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Catatan Sinergi Satu Atap di Bawah */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[#0b3c26] to-[#082e1e] border border-[#d4af37]/30 text-white flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0" />
                <p className="text-xs text-white leading-relaxed">
                  Layanan Satu Atap RA &amp; MI Ma'arif Al Ihsan Soborejo menyatukan kurikulum keagamaan, pembiasaan akhlak karimah, dan fasilitas belajar dalam satu harmoni pembinaan.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Pengaturan & Penyesuaian Foto Kepala Madrasah */}
      <HeadmasterPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
      />

      {/* Modal Pengaturan & Pengubahan Sejarah Singkat Madrasah */}
      <HistoryEditModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </section>
  );
};
