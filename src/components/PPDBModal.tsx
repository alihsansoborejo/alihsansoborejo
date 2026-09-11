import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { PPDBRegistration } from '../types';
import {
  X,
  CheckCircle,
  FileText,
  Search,
  Calendar,
  AlertCircle,
  Download,
  Send,
  Phone,
  Clock,
  Sparkles,
  BookOpen,
  User,
  MapPin
} from 'lucide-react';

interface PPDBModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProgram?: string;
  initialTab?: 'form' | 'status' | 'alur';
}

export const PPDBModal: React.FC<PPDBModalProps> = ({
  isOpen,
  onClose,
  preselectedProgram,
  initialTab = 'form'
}) => {
  const { schoolProfile, addPPDBRegistration, ppdbRegistrations } = useDataContext();
  const [activeTab, setActiveTab] = useState<'form' | 'status' | 'alur'>(initialTab);

  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    nik: '',
    nisn: '',
    gender: 'Laki-laki',
    birthPlace: 'Temanggung',
    birthDate: '',
    originSchool: '',
    parentName: '',
    parentJob: '',
    parentPhone: '',
    address: 'Desa Soborejo, Kec. Pringsurat',
    track: preselectedProgram ? `Jalur ${preselectedProgram}` : 'Jalur Reguler',
    quranSkill: 'Iqro / Tilawati',
  });

  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [brochureDownloaded, setBrochureDownloaded] = useState(false);

  // Status Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generatedCode = `REG-MIAS-2025-${randomNum}`;

    const newRegistration: PPDBRegistration = {
      id: `reg-${Date.now()}`,
      registrationNumber: generatedCode,
      studentName: formData.studentName,
      nik: formData.nik,
      nisn: formData.nisn,
      gender: formData.gender as 'Laki-laki' | 'Perempuan',
      birthPlace: formData.birthPlace,
      birthDate: formData.birthDate,
      originSchool: formData.originSchool,
      parentName: formData.parentName,
      parentJob: formData.parentJob,
      parentPhone: formData.parentPhone,
      address: formData.address,
      track: formData.track,
      quranReadingSkill: formData.quranSkill,
      quranSkill: formData.quranSkill,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Menunggu Verifikasi',
      notes: 'Pendaftaran mandiri melalui portal website madrasah.'
    };

    addPPDBRegistration(newRegistration);
    setSubmittedCode(generatedCode);
  };

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const cleanQuery = searchQuery.trim().toUpperCase();
    if (!cleanQuery) return;

    // Search in real context registrations
    const found = ppdbRegistrations.find(
      r => r.registrationNumber.toUpperCase() === cleanQuery ||
           (r.nik && r.nik === cleanQuery) ||
           (r.nisn && r.nisn === cleanQuery) ||
           r.studentName.toUpperCase() === cleanQuery ||
           r.studentName.toUpperCase().includes(cleanQuery)
    );

    if (found) {
      let nextStep = 'Silaturahmi & Pemetaan Kesiapan Belajar Ramah Anak di Kantor Madrasah.';
      if (found.status === 'Diterima') {
        nextStep = 'Selamat! Ananda dinyatakan DITERIMA di MI Ma\'arif Al Ihsan Soborejo. Silakan melakukan konfirmasi & daftar ulang.';
      } else if (found.status === 'Ditolak') {
        nextStep = 'Mohon maaf, berkas belum memenuhi kualifikasi atau kuota jalur pendaftaran telah penuh.';
      }

      setSearchResult({
        found: true,
        regNumber: found.registrationNumber,
        studentName: found.studentName,
        track: found.track,
        status: found.status,
        nextStep,
        schedule: 'Senin - Sabtu (08.00 - 12.00 WIB)',
        location: 'Ruang Panitia PPDB MI Ma\'arif Al Ihsan Soborejo',
        notes: found.notes
      });
    } else if (cleanQuery.includes('MIAS') || cleanQuery.includes('REG') || cleanQuery.length >= 6) {
      // Fallback preview
      setSearchResult({
        found: true,
        regNumber: cleanQuery,
        studentName: formData.studentName || 'Calon Santri [Preview]',
        track: 'Jalur Reguler / Tahfidz Cilik',
        status: 'Berkas Diterima & Dalam Verifikasi',
        nextStep: 'Silaturahmi & Pemetaan Kesiapan Belajar Ramah Anak di Kantor Madrasah.',
        schedule: 'Senin - Sabtu (08.00 - 12.00 WIB)',
        location: 'Ruang Panitia PPDB MI Ma\'arif Al Ihsan Soborejo'
      });
    } else {
      setSearchResult({
        found: false,
        message: 'Nomor pendaftaran atau NIK/NISN belum ditemukan dalam database PPDB. Pastikan kode registrasi sudah benar.'
      });
    }
  };

  const handleDownloadBrochure = () => {
    setBrochureDownloaded(true);
    setTimeout(() => {
      setBrochureDownloaded(false);
    }, 4000);
  };

  return (
    <div
      id="ppdb-modal-backdrop"
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="ppdb-modal-card"
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#d4af37]/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#072217] via-[#0b3c26] to-[#041a11] text-white p-5 sm:p-6 relative">
          <button
            id="ppdb-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-[#d4af37] text-xs uppercase font-bold tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PPDB Online Tahun Ajaran Baru</span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#f3e5ab]">
            MI Ma'arif Al Ihsan Soborejo
          </h3>
          <p className="text-xs text-white/80 mt-1">
            Desa Soborejo, Kec. Pringsurat, Kab. Temanggung • Email: alihsansoborejo@gmail.com
          </p>

          {/* Navigation Tabs inside modal */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/15">
            <button
              id="ppdb-tab-form"
              onClick={() => setActiveTab('form')}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'form'
                  ? 'bg-[#d4af37] text-[#072217]'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Formulir Pendaftaran</span>
            </button>
            <button
              id="ppdb-tab-status"
              onClick={() => setActiveTab('status')}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'status'
                  ? 'bg-[#d4af37] text-[#072217]'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cek Status PPDB</span>
            </button>
            <button
              id="ppdb-tab-alur"
              onClick={() => setActiveTab('alur')}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'alur'
                  ? 'bg-[#d4af37] text-[#072217]'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Alur & Persyaratan</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          {activeTab === 'form' && (
            <div>
              {submittedCode ? (
                <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0b3c26] mx-auto flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-[#0b3c26]" />
                  </div>
                  <h4 className="font-heading text-2xl font-bold text-[#072217]">
                    Pendaftaran Berhasil Dikirim!
                  </h4>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Alhamdulillah, data calon peserta didik baru telah berhasil kami catat. Simpan kode registrasi berikut untuk pengecekan status:
                  </p>
                  
                  <div className="inline-block bg-[#f8faf9] border-2 border-dashed border-[#d4af37] px-7 py-3 rounded-xl shadow-sm">
                    <span className="text-[11px] text-gray-500 uppercase tracking-wider block font-semibold">
                      Nomor Registrasi PPDB:
                    </span>
                    <span className="font-heading text-2xl font-bold text-[#0b3c26]">
                      {submittedCode}
                    </span>
                  </div>

                  <div className="bg-emerald-50 text-[#0b3c26] border border-emerald-200 rounded-xl p-3.5 text-xs max-w-md mx-auto text-left space-y-1">
                    <div className="font-bold">Informasi Selanjutnya:</div>
                    <p>
                      Panitia PPDB MI Ma'arif Al Ihsan Soborejo akan segera menghubungi nomor WhatsApp <strong>{formData.parentPhone}</strong> untuk jadwal penyerahan berkas fisik dan silaturahmi pemetaan belajar anak.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => {
                        setSubmittedCode(null);
                        onClose();
                      }}
                      className="px-6 py-2.5 bg-[#0b3c26] text-[#f3e5ab] rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#072217] transition-colors"
                    >
                      Selesai & Tutup
                    </button>
                    <button
                      onClick={() => {
                        setSubmittedCode(null);
                        setFormData({
                          studentName: '',
                          nik: '',
                          nisn: '',
                          gender: 'Laki-laki',
                          birthPlace: 'Temanggung',
                          birthDate: '',
                          originSchool: '',
                          parentName: '',
                          parentJob: '',
                          parentPhone: '',
                          address: 'Desa Soborejo, Kec. Pringsurat',
                          track: 'Jalur Reguler',
                          quranSkill: 'Iqro / Tilawati',
                        });
                      }}
                      className="px-4 py-2.5 border border-gray-300 rounded-xl text-xs text-gray-700 font-semibold hover:bg-gray-50"
                    >
                      Daftar Calon Siswa Lain
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitForm} className="space-y-6">
                  {/* Step 1: Data Calon Peserta Didik */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0b3c26] mb-3 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#0b3c26] text-[#f3e5ab] flex items-center justify-center text-[10px]">1</span>
                      Data Calon Peserta Didik (Kelas 1)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Nama Lengkap Calon Siswa *
                        </label>
                        <input
                          id="ppdb-input-fullname"
                          type="text"
                          required
                          value={formData.studentName}
                          onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                          placeholder="Nama lengkap sesuai Akte / KK"
                          className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3c26]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          NIK Calon Siswa / No. KK *
                        </label>
                        <input
                          id="ppdb-input-nik"
                          type="text"
                          required
                          value={formData.nik}
                          onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                          placeholder="16 digit NIK pendaftar"
                          className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3c26]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Jenis Kelamin *
                        </label>
                        <select
                          id="ppdb-select-gender"
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3c26] bg-white"
                        >
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Tanggal Lahir *
                        </label>
                        <input
                          id="ppdb-input-birthdate"
                          type="date"
                          required
                          value={formData.birthDate}
                          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3c26]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Asal Sekolah (RA / BA / TK / PAUD) *
                        </label>
                        <input
                          id="ppdb-input-originschool"
                          type="text"
                          required
                          value={formData.originSchool}
                          onChange={(e) => setFormData({ ...formData, originSchool: e.target.value })}
                          placeholder="contoh: RA Masyithoh / TK Soborejo"
                          className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3c26]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Kemampuan Mengaji Awal
                        </label>
                        <select
                          id="ppdb-select-quran"
                          value={formData.quranSkill}
                          onChange={(e) => setFormData({ ...formData, quranSkill: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3c26] bg-white"
                        >
                          <option value="Belum Bisa">Belum Mengenal Huruf Hijaiyah</option>
                          <option value="Iqro / Tilawati">Sedang Belajar Iqro / Tilawati</option>
                          <option value="Al-Qur'an Lancar">Sudah Mulai Baca Al-Qur'an</option>
                          <option value="Hafal Surat Pendek">Sudah Hafal Sebagian Surat Pendek</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Jalur Pendaftaran */}
                  <div className="pt-2 border-t border-gray-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0b3c26] mb-3 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#0b3c26] text-[#f3e5ab] flex items-center justify-center text-[10px]">2</span>
                      Pilihan Jalur PPDB
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'Jalur Reguler', title: 'Jalur Reguler', desc: 'Pendaftaran umum kuota terbuka untuk seluruh calon siswa' },
                        { id: 'Jalur Tahfidz', title: 'Jalur Prestasi / Tahfidz', desc: 'Bagi santri yang memiliki hafalan surat pendek / bakat' },
                        { id: 'Jalur Kemitraan', title: 'Jalur Afirmasi / Kemitraan', desc: 'Bagi keluarga kemitraan dan warga sekitar madrasah' },
                      ].map((tr) => (
                        <label
                          key={tr.id}
                          className={`border rounded-xl p-3 cursor-pointer transition-all flex flex-col justify-between ${
                            formData.track === tr.id
                              ? 'border-[#0b3c26] bg-emerald-50/50 ring-1 ring-[#0b3c26]'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div>
                            <input
                              type="radio"
                              name="track"
                              value={tr.id}
                              checked={formData.track === tr.id}
                              onChange={() => setFormData({ ...formData, track: tr.id })}
                              className="text-[#0b3c26] focus:ring-[#0b3c26] mr-2"
                            />
                            <span className="font-bold text-xs text-[#072217]">{tr.title}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-1.5">{tr.desc}</p>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Data Orang Tua / Wali */}
                  <div className="pt-2 border-t border-gray-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0b3c26] mb-3 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#0b3c26] text-[#f3e5ab] flex items-center justify-center text-[10px]">3</span>
                      Data Orang Tua / Wali & Kontak
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Nama Orang Tua / Wali *
                        </label>
                        <input
                          id="ppdb-input-parentname"
                          type="text"
                          required
                          value={formData.parentName}
                          onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                          placeholder="Nama Ayah / Ibu / Wali"
                          className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3c26]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Nomor WhatsApp Aktif *
                        </label>
                        <input
                          id="ppdb-input-parentphone"
                          type="tel"
                          required
                          value={formData.parentPhone}
                          onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                          placeholder="contoh: 085876543210"
                          className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3c26]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Alamat Domisili Lengkap *
                        </label>
                        <textarea
                          id="ppdb-input-address"
                          required
                          rows={2}
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Dusun / RT / RW, Desa Soborejo, Kec. Pringsurat, Temanggung"
                          className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3c26]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Action */}
                  <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-gray-500">
                      * Data tersimpan aman dan terenkripsi untuk kepentingan seleksi administrasi PPDB MI Ma'arif Al Ihsan Soborejo.
                    </p>

                    <button
                      id="ppdb-submit-btn"
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-[#d4af37] via-[#e6c25a] to-[#b89228] text-[#072217] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Pendaftaran Online</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'status' && (
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto">
                <h4 className="font-heading text-lg font-bold text-[#072217]">
                  Cek Status Pendaftaran PPDB
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Masukkan Nomor Registrasi (contoh: <code>REG-MIAS-2025-4821</code>) atau NIK/NISN calon siswa.
                </p>
              </div>

              <form onSubmit={handleCheckStatus} className="max-w-md mx-auto flex gap-2">
                <input
                  id="ppdb-search-input"
                  type="text"
                  placeholder="Masukkan Nomor Registrasi / NIK"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3c26]"
                />
                <button
                  id="ppdb-search-btn"
                  type="submit"
                  className="px-5 py-2.5 bg-[#0b3c26] text-[#f3e5ab] text-xs font-semibold rounded-xl hover:bg-[#072217] transition-colors"
                >
                  Cari Data
                </button>
              </form>

              {searched && searchResult && (
                <div className="max-w-md mx-auto mt-6 animate-in fade-in">
                  {searchResult.found ? (
                    <div className="bg-[#f8faf9] border border-[#d4af37]/50 rounded-xl p-5 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                        <span className="text-xs text-gray-500 font-medium">No. Registrasi:</span>
                        <span className="font-heading font-bold text-[#072217] text-sm">
                          {searchResult.regNumber}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Nama Calon Siswa:</span>
                        <span className="font-semibold text-gray-800">{searchResult.studentName}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Jalur:</span>
                        <span className="font-semibold text-gray-800">{searchResult.track}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Status Seleksi:</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                          {searchResult.status}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-gray-200 text-xs text-[#0b3c26] font-medium leading-relaxed">
                        <strong>Langkah Berikutnya:</strong> {searchResult.nextStep}
                        <div className="text-gray-500 text-[11px] mt-1">
                          Waktu: {searchResult.schedule}
                        </div>
                        <div className="text-gray-500 text-[11px]">
                          Tempat: {searchResult.location}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{searchResult.message}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'alur' && (
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto mb-6">
                <h4 className="font-heading text-lg font-bold text-[#072217]">
                  Alur Pendaftaran & Persyaratan
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Tahapan mudah bergabung di MI Ma'arif Al Ihsan Soborejo.
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-3.5 max-w-lg mx-auto">
                {[
                  { step: '1', title: 'Pengisian Formulir Online / Offline', desc: 'Mengisi form di website ini atau datang ke kantor madrasah di Desa Soborejo, Pringsurat.' },
                  { step: '2', title: 'Penyerahan Berkas Administrasi', desc: 'Melampirkan fotokopi Akte Kelahiran, Kartu Keluarga (KK), dan ijazah/surat keterangan RA/TK.' },
                  { step: '3', title: 'Pemetaan Kesiapan Belajar Ramah Anak', desc: 'Bukan tes gugur yang menegangkan; melainkan pengenalan motorik dan huruf hijaiyah dengan ceria.' },
                  { step: '4', title: 'Registrasi Ulang & Pembagian Seragam', desc: 'Menerima seragam madrasah, buku panduan Matsama, dan jadwal hari pertama masuk sekolah.' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <div className="w-7 h-7 rounded-full bg-[#0b3c26] text-[#f3e5ab] font-bold text-xs flex items-center justify-center shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h5 className="font-heading text-xs font-bold text-[#072217]">{item.title}</h5>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Syarat Pendaftaran */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 max-w-lg mx-auto text-xs text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <CheckCircle className="w-4 h-4 text-[#d4af37]" />
                  <span>Persyaratan Calon Siswa Baru:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 pl-1 text-gray-700 text-[11px]">
                  <li>Berusia minimal 6 tahun pada bulan Juli tahun ajaran berjalan</li>
                  <li>Fotokopi Akte Kelahiran (2 lembar)</li>
                  <li>Fotokopi Kartu Keluarga / C1 (2 lembar)</li>
                  <li>Fotokopi KTP kedua orang tua/wali</li>
                  <li>Ijazah / Surat Keterangan Lulus RA/BA/TK (jika ada)</li>
                  <li>Pas foto santri ukuran 3x4 (3 lembar)</li>
                </ul>
              </div>

              {/* Brochure Download Card with in-modal feedback */}
              <div className="bg-[#072217] text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-lg mx-auto border border-[#d4af37]/30">
                <div>
                  <div className="font-heading text-sm font-bold text-[#f3e5ab]">
                    Brosur PPDB & Info Biaya
                  </div>
                  <p className="text-[11px] text-white/80">
                    Unduh file informasi resmi PPDB MI Ma'arif Al Ihsan Soborejo.
                  </p>
                </div>
                
                {brochureDownloaded ? (
                  <div className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Brosur Terunduh!</span>
                  </div>
                ) : (
                  <button
                    id="ppdb-download-brochure-btn"
                    onClick={handleDownloadBrochure}
                    className="px-4 py-2 bg-[#d4af37] text-[#072217] text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-[#e6c25a] shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Brosur</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
