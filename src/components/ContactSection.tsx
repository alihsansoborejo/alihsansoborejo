import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Send, 
  ExternalLink, 
  Building2, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { schoolProfile } = useDataContext();
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Informasi PPDB Online');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Clean WhatsApp number
  const cleanPhone = (schoolProfile.whatsapp || schoolProfile.phone || '6281234567890').replace(/[^0-9]/g, '');
  const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Assalamu'alaikum Wr. Wb. Panitia/Pengelola ${schoolProfile.name || "MI & RA Al Ihsan Soborejo"},\n\nPerkenalkan saya:\nNama: ${formName || 'Wali Santri / Pengunjung'}\nNo. HP: ${formPhone || '-'}\nKeperluan: ${formCategory}\n\nPesan:\n${formMessage || 'Mohon informasi seputar pendaftaran santri baru dan program madrasah.'}\n\nTerima kasih. Wassalamu'alaikum Wr. Wb.`;
    
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyAddress = () => {
    const fullText = `${schoolProfile.name || "MI Ma'arif Al Ihsan Soborejo"}, ${schoolProfile.fullAddress || schoolProfile.address + ', Desa Soborejo, Kec. Pringsurat, Kab. Temanggung, Jawa Tengah'}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <section id="kontak-page" className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Alamat */}
        <div className="bg-white rounded-2xl p-6 border border-[#0b3c26]/10 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0b3c26] flex items-center justify-center border border-emerald-100">
            <MapPin className="w-5 h-5 text-[#d4af37]" />
          </div>
          <h3 className="font-heading text-base font-bold text-[#072217]">
            Alamat Madrasah
          </h3>
          <p className="font-body text-xs text-gray-600 leading-relaxed">
            {schoolProfile.fullAddress || `${schoolProfile.address}, Desa Soborejo, Kecamatan Pringsurat, Kabupaten Temanggung, Jawa Tengah ${schoolProfile.postalCode || '56272'}`}
          </p>
          <button
            type="button"
            onClick={handleCopyAddress}
            className="text-[11px] font-semibold text-[#0b3c26] hover:text-[#d4af37] inline-flex items-center gap-1 cursor-pointer"
          >
            {isCopied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Alamat Tersalin!</span>
              </>
            ) : (
              <span>Salin Alamat Lengkap</span>
            )}
          </button>
        </div>

        {/* Card 2: Telepon & WhatsApp */}
        <div className="bg-white rounded-2xl p-6 border border-[#0b3c26]/10 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#0b3c26] flex items-center justify-center border border-amber-100">
            <Phone className="w-5 h-5 text-[#d4af37]" />
          </div>
          <h3 className="font-heading text-base font-bold text-[#072217]">
            Telepon &amp; WhatsApp
          </h3>
          <div className="space-y-1 text-xs text-gray-600">
            <p className="font-medium text-gray-900">
              {schoolProfile.phone || '0812-3456-7890'}
            </p>
            <p className="text-[11px] text-gray-500">
              Layanan Informasi Cepat &amp; Konsultasi PPDB
            </p>
          </div>
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b3c26] hover:text-[#d4af37] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat Langsung WhatsApp</span>
          </a>
        </div>

        {/* Card 3: Email Resmi */}
        <div className="bg-white rounded-2xl p-6 border border-[#0b3c26]/10 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0b3c26] flex items-center justify-center border border-blue-100">
            <Mail className="w-5 h-5 text-[#d4af37]" />
          </div>
          <h3 className="font-heading text-base font-bold text-[#072217]">
            Surat Elektronik (Email)
          </h3>
          <div className="space-y-1 text-xs text-gray-600">
            <p className="font-medium text-gray-900 break-all">
              {schoolProfile.email || 'alihsansoborejo@gmail.com'}
            </p>
            <p className="text-[11px] text-gray-500">
              Persuratan dinas, permohonan berkas &amp; kemitraan
            </p>
          </div>
          <a
            href={`mailto:${schoolProfile.email}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b3c26] hover:text-[#d4af37] transition-colors"
          >
            <span>Kirim Email</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Card 4: Jam Pelayanan */}
        <div className="bg-white rounded-2xl p-6 border border-[#0b3c26]/10 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#0b3c26] flex items-center justify-center border border-purple-100">
            <Clock className="w-5 h-5 text-[#d4af37]" />
          </div>
          <h3 className="font-heading text-base font-bold text-[#072217]">
            Jam Pelayanan Kantor
          </h3>
          <div className="space-y-1 text-xs text-gray-600">
            <p className="font-semibold text-[#0b3c26]">
              Senin - Sabtu: 07.00 - 13.30 WIB
            </p>
            <p className="text-[11px] text-gray-500">
              Hari Ahad &amp; Hari Libur Nasional: Tutup (Kecuali Janji Temu PPDB)
            </p>
          </div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
            Buka KBM &amp; Tata Usaha
          </span>
        </div>
      </div>

      {/* Main Grid: Form WhatsApp & Peta Lokasi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Chat & Konsultasi Langsung */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#0b3c26]/10 shadow-lg space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs uppercase font-bold tracking-widest text-[#d4af37]">
              KONSULTASI LANGSUNG
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1">
              Kirim Pesan Langsung ke WhatsApp Madrasah
            </h2>
            <p className="font-body text-xs sm:text-sm text-gray-600 mt-1">
              Isi data berikut untuk langsung terhubung dengan admin dan panitia PPDB RA &amp; MI Ma'arif Al Ihsan Soborejo.
            </p>
          </div>

          <form onSubmit={handleSendWhatsApp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nama Lengkap / Nama Wali Santri <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Contoh: Bapak Ahmad Fauzi / Ibu Siti Rahma"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0b3c26]/20 focus:border-[#0b3c26]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nomor WhatsApp / HP
                </label>
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0b3c26]/20 focus:border-[#0b3c26]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Kategori Keperluan
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0b3c26]/20 focus:border-[#0b3c26] bg-white"
                >
                  <option value="Informasi PPDB Online (RA / MI)">Informasi PPDB Online (RA / MI)</option>
                  <option value="Konsultasi Biaya &amp; Program Beasiswa">Konsultasi Biaya &amp; Beasiswa</option>
                  <option value="Program Tahfidz &amp; Ekstrakurikuler">Program Tahfidz &amp; Ekskul</option>
                  <option value="Surat Keterangan / Administrasi">Surat Keterangan / Administrasi</option>
                  <option value="Kunjungan Lembaga / Silaturahmi">Kunjungan Lembaga / Silaturahmi</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Pesan / Pertanyaan Anda
              </label>
              <textarea
                rows={4}
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                placeholder="Tuliskan pertanyaan atau hal yang ingin Anda konsultasikan..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0b3c26]/20 focus:border-[#0b3c26] leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#0b3c26] to-[#072217] hover:from-[#125838] hover:to-[#0b3c26] text-[#f3e5ab] text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.01]"
            >
              <Send className="w-4 h-4 text-[#d4af37]" />
              <span>Buka Chat WhatsApp Resmi</span>
            </button>
            <p className="text-[11px] text-gray-400 text-center">
              Pesan Anda akan otomatis dibuka pada aplikasi WhatsApp Anda tanpa perantara pihak ketiga.
            </p>
          </form>
        </div>

        {/* Peta Lokasi & Profil Lembaga Satu Atap */}
        <div className="lg:col-span-6 space-y-6">
          {/* Peta Interaktif / Map Frame */}
          <div className="bg-white rounded-3xl p-6 border border-[#0b3c26]/10 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
                  PETA LOKASI RESMI
                </span>
                <h3 className="font-heading text-lg font-bold text-[#072217]">
                  Lokasi Desa Soborejo, Pringsurat
                </h3>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("MI Ma'arif Al Ihsan Soborejo Pringsurat Temanggung")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#0b3c26] hover:text-[#d4af37] font-semibold"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Responsive Map Embed */}
            <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-gray-200 relative bg-emerald-900/10">
              <iframe
                title="Peta Lokasi MI Ma'arif Al Ihsan Soborejo"
                src="https://maps.google.com/maps?q=Soborejo%2C%20Pringsurat%2C%20Temanggung%2C%20Central%20Java&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

            {/* Petunjuk Arah */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#0b3c26]">
                <Building2 className="w-4 h-4 text-[#d4af37]" />
                <span>Petunjuk Menuju Lokasi Madrasah:</span>
              </div>
              <p className="leading-relaxed text-gray-700">
                Berada di lingkungan pedesaan yang tenang dan asri di Desa Soborejo, Kecamatan Pringsurat, Kabupaten Temanggung. Akses jalan aspal mudah dijangkau dari jalan raya Pringsurat / jalur Magelang - Temanggung.
              </p>
            </div>
          </div>

          {/* Card Ringkasan Legalitas Satu Atap */}
          <div className="bg-gradient-to-br from-[#072217] to-[#041a11] text-white rounded-3xl p-6 border-2 border-[#d4af37]/30 shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span className="text-xs uppercase font-bold tracking-wider text-[#d4af37]">
                LEMBAGA RESMI TERDAFTAR KEMENAG
              </span>
            </div>
            <h3 className="font-heading text-lg font-bold text-white leading-tight">
              Pendidikan Satu Atap Berkesinambungan
            </h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Memudahkan orang tua mendidik putra-putrinya sejak jenjang pra-sekolah di RA Al Ihsan hingga tuntas jenjang dasar di MI Ma'arif Al Ihsan Soborejo dengan satu lingkungan asri dan kultur santri Nahdliyyin.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-white/10">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[#d4af37] font-bold block text-[11px]">MI MA'ARIF AL IHSAN:</span>
                <span className="text-white/80 text-[11px]">NPSN: {schoolProfile.miNpsn || schoolProfile.npsn}</span>
                <span className="text-white/60 block text-[10px]">NSM: {schoolProfile.miNsm || schoolProfile.nsm}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-amber-300 font-bold block text-[11px]">RA AL IHSAN:</span>
                <span className="text-white/80 text-[11px]">NPSN: {schoolProfile.raNpsn || '69991234'}</span>
                <span className="text-white/60 block text-[10px]">NSM: {schoolProfile.raNsm || '101233230045'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
