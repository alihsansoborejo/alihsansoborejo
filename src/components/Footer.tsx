import React from 'react';
import { useDataContext } from '../context/DataContext';
import { MapPin, Phone, Mail, Globe, ArrowUp, Sparkles, ExternalLink, Lock } from 'lucide-react';

interface FooterProps {
  onOpenPPDB: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPPDB }) => {
  const { schoolProfile, isAdmin, setIsLoginModalOpen, setViewMode } = useDataContext();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      setViewMode('admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <footer id="kontak" className="bg-[#072217] text-white/70 pt-20 pb-8 px-4 sm:px-8 border-t-4 border-[#d4af37]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-16">
          {/* Column 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white border border-[#d4af37] flex items-center justify-center overflow-hidden shrink-0 p-1 shadow-sm">
                <img
                  src={schoolProfile.logoUrl || '/assets/logo-maarif.svg'}
                  alt="Logo Lembaga"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/logo-maarif.svg';
                  }}
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#d4af37] tracking-widest uppercase block">
                  LEMBAGA SATU ATAP
                </span>
                <h3 className="font-heading text-base font-bold text-white tracking-wide leading-tight">
                  MI MA'ARIF &amp; RA AL IHSAN
                </h3>
                <span className="text-[11px] text-gray-300 font-semibold block">
                  SOBOREJO • PRINGSURAT
                </span>
              </div>
            </div>

            <p className="font-body text-xs sm:text-sm text-white/75 leading-relaxed">
              Lembaga pendidikan satu atap di bawah naungan LP Ma'arif NU Kabupaten Temanggung. Memadukan pendidikan prasekolah Raudhatul Athfal (RA) dan Madrasah Ibtidaiyah (MI) yang terpadu, berakhlak mulia, dan berkarakter Qur'ani.
            </p>

            <div className="pt-2 text-xs text-[#f3e5ab] font-medium flex flex-col gap-1.5 border-t border-white/10">
              <div className="bg-white/5 p-2 rounded border border-white/10">
                <span className="text-[11px] text-amber-300 font-bold block mb-0.5">RA AL IHSAN SOBOREJO (PAUD/RA):</span>
                <span className="text-white/80 text-[11px]">NPSN: {schoolProfile.raNpsn || '69991234'} • NSM: {schoolProfile.raNsm || '101233230045'}</span>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/10">
                <span className="text-[11px] text-emerald-300 font-bold block mb-0.5">MI MA'ARIF AL IHSAN (SD/MI):</span>
                <span className="text-white/80 text-[11px]">NPSN: {schoolProfile.miNpsn || schoolProfile.npsn} • NSM: {schoolProfile.miNsm || schoolProfile.nsm}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigasi Cepat */}
          <div>
            <h4 className="font-heading text-sm font-bold text-[#d4af37] uppercase tracking-wider mb-4">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm list-none p-0 m-0">
              <li>
                <a href="#beranda" className="hover:text-[#f3e5ab] hover:translate-x-1 inline-block transition-transform">
                  Beranda Madrasah
                </a>
              </li>
              <li>
                <a href="#profil" className="hover:text-[#f3e5ab] hover:translate-x-1 inline-block transition-transform">
                  Sambutan & Visi Misi
                </a>
              </li>
              <li>
                <a href="#program" className="hover:text-[#f3e5ab] hover:translate-x-1 inline-block transition-transform">
                  Program Unggulan
                </a>
              </li>
              <li>
                <a href="#ekstrakurikuler" className="hover:text-[#f3e5ab] hover:translate-x-1 inline-block transition-transform">
                  Ekstrakurikuler Santri
                </a>
              </li>
              <li>
                <a href="#prestasi" className="hover:text-[#f3e5ab] hover:translate-x-1 inline-block transition-transform">
                  Prestasi Madrasah
                </a>
              </li>
              <li>
                <a href="#galeri" className="hover:text-[#f3e5ab] hover:translate-x-1 inline-block transition-transform">
                  Galeri Foto & Fasilitas
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenPPDB}
                  className="text-[#d4af37] hover:underline font-semibold text-left flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pendaftaran PPDB Online</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Jam KBM & Pembiasaan */}
          <div>
            <h4 className="font-heading text-sm font-bold text-[#d4af37] uppercase tracking-wider mb-4">
              Kegiatan Pembiasaan
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm list-none p-0 m-0 text-white/75">
              <li className="flex items-start gap-2">
                <span className="text-[#d4af37]">•</span>
                <span>Sholat Dhuha & Tadarus Pagi Berjamaah</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4af37]">•</span>
                <span>Asmaul Husna & Doa Awal KBM</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4af37]">•</span>
                <span>Sholat Dhuhur Berjamaah Setiap Hari</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4af37]">•</span>
                <span>Tahlil & Yasinan Rutin Kamis/Jumat</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4af37]">•</span>
                <span>Gerakan Pramuka Sako Ma'arif</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4af37]">•</span>
                <span>Pencak Silat Pagar Nusa Gasmi</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Kontak Kami */}
          <div className="space-y-3.5 text-xs sm:text-sm">
            <h4 className="font-heading text-sm font-bold text-[#d4af37] uppercase tracking-wider mb-4">
              Lokasi & Kontak
            </h4>
            <p className="flex items-start gap-2.5 text-white/80">
              <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-1" />
              <span>{schoolProfile.fullAddress}</span>
            </p>
            <p className="flex items-center gap-2.5 text-white/80">
              <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
              <a href={`tel:${schoolProfile.phone.replace(/[^0-9]/g, '')}`} className="hover:text-[#d4af37]">
                {schoolProfile.phone}
              </a>
            </p>
            <p className="flex items-center gap-2.5 text-white/80">
              <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
              <a href={`mailto:${schoolProfile.email}`} className="hover:text-[#d4af37]">
                {schoolProfile.email}
              </a>
            </p>
            <div className="pt-2 text-xs text-white/60">
              Jam Pelayanan Kantor:
              <div className="text-[#f3e5ab] font-medium">Senin - Sabtu: 07.00 - 13.30 WIB</div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <button
                id="footer-admin-btn"
                onClick={handleAdminClick}
                className="inline-flex items-center gap-2 text-xs text-[#d4af37] hover:text-white bg-[#041a11] hover:bg-[#0b3c26] px-3 py-1.5 rounded-lg border border-[#d4af37]/30 transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAdmin ? 'Panel Kontrol Admin (Aktif)' : 'Portal Pengelola Madrasah'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} RA Al Ihsan &amp; MI Ma'arif Al Ihsan Soborejo (Satu Atap), Kec. Pringsurat, Kab. Temanggung. Hak Cipta Dilindungi Undang-Undang.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-[#d4af37] hover:text-[#f3e5ab] p-1 transition-colors"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
