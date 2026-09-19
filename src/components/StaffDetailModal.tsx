import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Award,
  BookOpen,
  ShieldCheck,
  Phone,
  Share2,
  Quote,
  Clock,
  CheckCircle2,
  Sparkles,
  Heart,
  ZoomIn,
  Building,
} from 'lucide-react';
import { StaffMember } from '../types';
import { useShare } from '../context/ShareContext';

interface StaffDetailModalProps {
  staff: StaffMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StaffDetailModal: React.FC<StaffDetailModalProps> = ({
  staff,
  isOpen,
  onClose,
}) => {
  const { openShare } = useShare();
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);

  if (!isOpen || !staff) return null;

  const defaultBio =
    staff.bio ||
    `Pendidik berdedikasi di ${
      staff.institution === 'RA'
        ? 'RA Al Ihsan Soborejo'
        : staff.institution === 'Satu Atap'
        ? 'Lembaga Pendidikan Satu Atap MI Ma\'arif & RA Al Ihsan Soborejo'
        : 'MI Ma\'arif Al Ihsan Soborejo'
    }, berkomitmen membina generasi santri yang berakhlak mulia, cerdas, berlandaskan aqidah Ahlussunnah wal Jama\'ah An-Nahdliyyah.`;

  const defaultQuote =
    staff.quote ||
    'Mendidik bukan hanya mentransfer pengetahuan, melainkan menyalakan lentera akhlak dan keimanan di dada setiap santri.';

  const defaultServiceYears = staff.serviceYears || 'Pendidik Berdedikasi Aktif';

  const defaultExpertise =
    staff.expertise && staff.expertise.length > 0
      ? staff.expertise
      : [
          'Pendidikan Karakter Aswaja',
          'Pembiasaan Ibadah Harian',
          'Pedagogik Ramah Anak',
        ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#d4af37]/40 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Header Bar */}
        <div className="bg-gradient-to-r from-[#072217] via-[#0b3c26] to-[#072217] text-white p-5 sm:p-6 rounded-t-3xl relative overflow-hidden border-b border-[#d4af37]/30">
          <div className="absolute top-0 right-0 w-60 h-60 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-sm">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] block">
                  PROFIL LENGKAP GTK / PENDIDIK
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-white leading-tight">
                  Dewan Pendidik &amp; Tenaga Kependidikan
                </h3>
              </div>
            </div>

            <button
              id="btn-close-staff-modal"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all"
              title="Tutup Jendela"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 space-y-6">
          {/* Top Section: Pass Foto 3x4 Utuh + Nama & Jabatan Utama */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            {/* 3x4 Pass Foto Frame - Utuh Tidak Terpotong */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="relative group">
                <div className="w-40 sm:w-48 aspect-[3/4] rounded-2xl border-2 border-[#d4af37] shadow-xl overflow-hidden bg-gradient-to-b from-[#0b3c26] via-[#072217] to-[#041a11] p-1.5 flex items-center justify-center relative">
                  {staff.photoUrl ? (
                    <img
                      src={staff.photoUrl}
                      alt={staff.name}
                      className="w-full h-full object-contain filter contrast-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#0b3c26] flex flex-col items-center justify-center text-white/80 p-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-white/10 border border-[#d4af37]/50 flex items-center justify-center mb-2">
                        <GraduationCap className="w-8 h-8 text-[#d4af37]" />
                      </div>
                      <span className="text-xs font-semibold text-emerald-100">{staff.role}</span>
                    </div>
                  )}

                  {/* Institution Badge on Photo */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded shadow text-white ${
                        staff.institution === 'RA'
                          ? 'bg-amber-600/90'
                          : staff.institution === 'MI'
                          ? 'bg-emerald-700/90'
                          : 'bg-teal-800/90'
                      }`}
                    >
                      {staff.institution === 'RA' ? 'Unit RA' : staff.institution === 'MI' ? 'Unit MI' : 'Satu Atap'}
                    </span>
                  </div>

                  {/* Zoom Indicator */}
                  {staff.photoUrl && (
                    <button
                      type="button"
                      onClick={() => setIsPhotoZoomed(!isPhotoZoomed)}
                      className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white/90 text-[10px] flex items-center gap-1 backdrop-blur-sm transition-all"
                      title="Lihat Pratinjau Foto"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <span className="text-[10px] font-semibold text-gray-500 mt-2 tracking-wide uppercase">
                Format Pas Foto 3 x 4 Resmi
              </span>
            </div>

            {/* Profile Identity & Key Badges */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#0b3c26] text-[#f3e5ab]">
                  {staff.category}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {staff.status || 'Aktif Mengajar'}
                </span>
                {staff.institution && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    {staff.institution === 'RA'
                      ? 'RA Al Ihsan Soborejo'
                      : staff.institution === 'MI'
                      ? 'MI Ma\'arif Al Ihsan'
                      : 'Lembaga Satu Atap'}
                  </span>
                )}
              </div>

              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] leading-snug">
                  {staff.name}
                </h2>
                <p className="text-sm font-semibold text-[#0b3c26] mt-0.5">
                  {staff.role}
                </p>
              </div>

              {/* Masa Pengabdian */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-[#0b3c26] border border-emerald-200 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{defaultServiceYears}</span>
              </div>

              {/* Quick Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-gray-700">
                {staff.education && (
                  <div className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <GraduationCap className="w-4 h-4 text-[#0b3c26] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Pendidikan Terakhir</span>
                      <span className="font-semibold text-gray-800">{staff.education}</span>
                    </div>
                  </div>
                )}

                {staff.nipOrNuptk && staff.nipOrNuptk !== '-' && (
                  <div className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <ShieldCheck className="w-4 h-4 text-[#0b3c26] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">NIP / NUPTK / PegID</span>
                      <span className="font-semibold text-gray-800">{staff.nipOrNuptk}</span>
                    </div>
                  </div>
                )}

                {staff.subjects && (
                  <div className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100 sm:col-span-2">
                    <BookOpen className="w-4 h-4 text-[#0b3c26] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Mata Pelajaran / Tugas Mengajar</span>
                      <span className="font-semibold text-gray-800">{staff.subjects}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pesan Inspiratif (Inspirational Quote) */}
          <div className="bg-gradient-to-r from-[#072217] via-[#0b3c26] to-[#041a11] text-white p-5 sm:p-6 rounded-2xl border border-[#d4af37]/40 shadow-md relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0 shadow-sm">
                <Quote className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37]">
                  Pesan Inspiratif &amp; Mutiara Hikmah Pendidik
                </span>
                <p className="font-serif-sub italic text-sm sm:text-base text-[#f3e5ab] leading-relaxed">
                  "{defaultQuote}"
                </p>
                <span className="text-[11px] text-emerald-200/80 block mt-1">
                  — {staff.name}
                </span>
              </div>
            </div>
          </div>

          {/* Biografi / Profil Lengkap */}
          <div className="bg-emerald-50/60 p-5 sm:p-6 rounded-2xl border border-emerald-200/70">
            <div className="flex items-center gap-2 mb-2 text-[#072217]">
              <Heart className="w-4 h-4 text-[#0b3c26]" />
              <h4 className="font-heading font-bold text-sm sm:text-base">
                Profil &amp; Dedikasi Pengabdian
              </h4>
            </div>
            <p className="font-body text-xs sm:text-sm text-gray-700 leading-relaxed">
              {defaultBio}
            </p>
          </div>

          {/* Bidang Keahlian & Pembinaan */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#072217] mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#d4af37]" />
              <span>Kompetensi &amp; Bidang Pembinaan Khusus:</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {defaultExpertise.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-[#0b3c26] text-xs font-semibold shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {staff.phone && (
                <a
                  href={`https://wa.me/${staff.phone.replace(/[^0-9]/g, '')}?text=Assalamu%27alaikum%20Wr.%20Wb.%20Ustadz%2FUstadzah%20${encodeURIComponent(
                    staff.name
                  )}%2C%20saya%20ingin%20bersilaturahmi%20mengenai%20informasi%20pendidikan%20di%20MI%20Ma%27arif%20Al%20Ihsan%20Soborejo.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Hubungi via WhatsApp</span>
                </a>
              )}

              <button
                type="button"
                onClick={() =>
                  openShare({
                    type: 'gtk',
                    id: staff.id,
                    title: `${staff.name} - ${staff.role}`,
                    description: `Profil Guru/Tenaga Kependidikan MI Ma'arif Al Ihsan Soborejo. ${
                      staff.education ? 'Pendidikan: ' + staff.education + '.' : ''
                    } "${defaultQuote}"`,
                    category: staff.category,
                    imageUrl: staff.photoUrl,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-all"
                title="Bagikan Tautan Profil Guru Ini"
              >
                <Share2 className="w-3.5 h-3.5 text-[#0b3c26]" />
                <span>Bagikan Profil</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold transition-all shadow-sm"
            >
              Tutup Profil
            </button>
          </div>
        </div>
      </div>

      {/* Optional Photo Full-Preview Lightbox */}
      {isPhotoZoomed && staff.photoUrl && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsPhotoZoomed(false)}
        >
          <div className="relative max-w-sm sm:max-w-md w-full bg-[#072217] p-2 rounded-2xl border-2 border-[#d4af37] shadow-2xl">
            <button
              onClick={() => setIsPhotoZoomed(false)}
              className="absolute -top-3 -right-3 p-1.5 rounded-full bg-white text-gray-800 shadow-lg hover:scale-110 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-full aspect-[3/4] overflow-hidden rounded-xl bg-black flex items-center justify-center">
              <img
                src={staff.photoUrl}
                alt={staff.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-3 text-center text-white">
              <p className="font-heading font-bold text-sm text-[#f3e5ab]">{staff.name}</p>
              <p className="text-xs text-emerald-200">{staff.role}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Pas Foto 3 x 4 Resmi (Utuh Tanpa Terpotong)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
