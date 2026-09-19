import React, { useState } from 'react';
import { useShare } from '../context/ShareContext';
import { SCHOOL_PROFILE, PPDB_FLOW_STEPS } from '../data/schoolData';
import { Sparkles, ArrowRight, CheckCircle2, FileText, Download, Search, HelpCircle, ShieldCheck, Share2 } from 'lucide-react';

interface PPDBSectionProps {
  onOpenPPDBForm: () => void;
  onOpenStatusCheck: () => void;
  onDownloadBrochure: () => void;
}

export const PPDBSection: React.FC<PPDBSectionProps> = ({
  onOpenPPDBForm,
  onOpenStatusCheck,
  onDownloadBrochure
}) => {
  const { openShare } = useShare();
  const [activeTab, setActiveTab] = useState<'jalur' | 'alur' | 'syarat'>('jalur');

  return (
    <section id="ppdb" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-[#072217] via-[#0b3c26] to-[#041a11] text-white rounded-3xl p-6 sm:p-12 lg:p-16 border border-[#d4af37]/35 shadow-2xl relative overflow-hidden">
        {/* Glow & Islamic Background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#042819] rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#d4af37] bg-[#d4af37]/15 border border-[#d4af37]/40 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PENERIMAAN PESERTA DIDIK BARU (PPDB) SATU ATAP</span>
            </span>
            <h3 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
              Wujudkan Generasi Qur'ani Sejak Usia Dini
            </h3>
            <p className="font-body text-xs sm:text-base text-white/85 max-w-2xl mx-auto leading-relaxed">
              Bergabunglah bersama keluarga besar RA Al Ihsan &amp; MI Ma'arif Al Ihsan Soborejo, Temanggung. Tersedia jenjang Raudhatul Athfal (Kelompok A/B) dan Madrasah Ibtidaiyah (Kelas 1) dalam satu atap yang terpadu dan amanah.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
              <button
                id="ppdb-section-register-btn"
                onClick={onOpenPPDBForm}
                className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b89228] text-[#072217] font-bold text-xs uppercase tracking-wider rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.6)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 border border-[#f3e5ab]"
              >
                <span>Buka Formulir Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                id="ppdb-section-status-btn"
                onClick={onOpenStatusCheck}
                className="px-5 sm:px-6 py-3.5 border border-[#d4af37]/50 bg-white/5 hover:bg-white/10 text-[#f3e5ab] text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center gap-2"
              >
                <Search className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Cek Status Pendaftaran</span>
              </button>

              <button
                id="ppdb-section-brochure-btn"
                onClick={onDownloadBrochure}
                className="px-4 py-3.5 text-xs text-white/80 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Unduh Panduan PDF</span>
              </button>

              <button
                type="button"
                id="ppdb-section-share-btn"
                onClick={() => openShare({
                  type: 'ppdb',
                  title: 'Informasi & Pendaftaran PPDB Satu Atap RA & MI Ma\'arif Al Ihsan Soborejo',
                  description: 'Penerimaan Peserta Didik Baru (PPDB) RA Al Ihsan & MI Ma\'arif Al Ihsan Soborejo, Temanggung. Pendaftaran online terpadu, program unggulan tahfidz, dan fasilitas lengkap.',
                  category: 'PPDB'
                })}
                className="px-4 py-3.5 border border-emerald-400/30 bg-emerald-950/40 hover:bg-emerald-900/60 text-[#f3e5ab] text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
                title="Bagikan Informasi PPDB"
              >
                <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Bagikan Info PPDB</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex justify-center mb-8 border-b border-white/15 pb-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('jalur')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'jalur'
                    ? 'bg-[#d4af37] text-[#072217]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Jalur Penerimaan
              </button>
              <button
                onClick={() => setActiveTab('alur')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'alur'
                    ? 'bg-[#d4af37] text-[#072217]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Alur 4 Langkah
              </button>
              <button
                onClick={() => setActiveTab('syarat')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'syarat'
                    ? 'bg-[#d4af37] text-[#072217]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Persyaratan Calon Siswa
              </button>
            </div>
          </div>

          {/* Tab Content 1: Jalur */}
          {activeTab === 'jalur' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#d4af37]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center font-bold text-sm mb-4">
                  01
                </div>
                <h4 className="font-heading text-lg font-bold text-[#f3e5ab] mb-2">
                  Jalur Reguler
                </h4>
                <p className="text-xs text-white/80 leading-relaxed mb-4">
                  Terbuka bagi seluruh lulusan RA, TK, atau PAUD di wilayah Soborejo, Pringsurat, dan sekitarnya yang telah memenuhi usia kesiapan belajar.
                </p>
                <div className="text-[11px] text-[#d4af37] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Kuota Terbuka Kelas 1</span>
                </div>
              </div>

              <div className="bg-white/5 border border-[#d4af37]/40 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-3 right-3 bg-[#d4af37] text-[#072217] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  Unggulan
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center font-bold text-sm mb-4">
                  02
                </div>
                <h4 className="font-heading text-lg font-bold text-[#f3e5ab] mb-2">
                  Jalur Prestasi / Tahfidz Cilik
                </h4>
                <p className="text-xs text-white/80 leading-relaxed mb-4">
                  Diperuntukkan bagi santri cilik yang memiliki hafalan surat-surat pendek, potensi tilawah Al-Qur'an, atau kejuaraan seni/olahraga usia dini.
                </p>
                <div className="text-[11px] text-[#d4af37] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Prioritas Masuk & Beasiswa Khusus</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#d4af37]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center font-bold text-sm mb-4">
                  03
                </div>
                <h4 className="font-heading text-lg font-bold text-[#f3e5ab] mb-2">
                  Jalur Afirmasi Kemitraan
                </h4>
                <p className="text-xs text-white/80 leading-relaxed mb-4">
                  Dukungan subsidi pendidikan penuh bagi santri yatim, piatu, dhuafa, dan keluarga binaan LP Ma'arif NU Desa Soborejo.
                </p>
                <div className="text-[11px] text-[#d4af37] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Bantuan Perlengkapan Belajar</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Alur */}
          {activeTab === 'alur' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
              {PPDB_FLOW_STEPS.map((step) => (
                <div key={step.step} className="bg-white/5 border border-white/10 rounded-2xl p-5 relative">
                  <div className="text-[#d4af37] font-heading text-2xl font-bold mb-2">
                    {step.step}
                  </div>
                  <h4 className="font-heading text-sm font-bold text-white mb-1.5">
                    {step.title}
                  </h4>
                  <p className="text-xs text-white/75 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content 3: Syarat */}
          {activeTab === 'syarat' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto text-xs text-white/85 space-y-3 animate-in fade-in duration-300">
              <h4 className="font-heading text-base font-bold text-[#f3e5ab] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>Dokumen yang Perlu Disiapkan:</span>
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>Usia minimal 6 tahun per 1 Juli tahun ajaran baru (anak 5,5 - 6 th wajib rekomendasi kesiapan belajar)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>Fotokopi Akte Kelahiran calon siswa (2 lembar)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>Fotokopi Kartu Keluarga (KK) orang tua / wali (2 lembar)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>Fotokopi KTP Ayah dan Ibu / Wali murid</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>Ijazah atau Surat Keterangan Lulus dari RA/BA/TK asal</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>Pas foto berwarna anak ukuran 3x4 (3 lembar)</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
