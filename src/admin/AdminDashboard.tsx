import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import {
  LayoutDashboard,
  Building,
  Users,
  Newspaper,
  BookOpen,
  Trophy,
  Camera,
  MessageSquare,
  HelpCircle,
  Database,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  X,
  Search,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Eye,
  FileText,
  GraduationCap,
  Sparkles,
  BarChart2
} from 'lucide-react';
import {
  SchoolProfile,
  ProgramItem,
  ExtracurricularItem,
  AchievementItem,
  NewsArticle,
  FacilityItem,
  GalleryItem,
  TestimonialItem,
  FAQItem,
  PPDBRegistration,
  StaffMember,
  StatItem
} from '../types';

type AdminTab =
  | 'overview'
  | 'hero_stats'
  | 'profile'
  | 'staff'
  | 'ppdb'
  | 'news'
  | 'programs'
  | 'extracurriculars'
  | 'achievements'
  | 'facilities'
  | 'testimonials_faq'
  | 'backup';

export const AdminDashboard: React.FC = () => {
  const {
    schoolProfile,
    updateSchoolProfile,
    staffList,
    addStaff,
    updateStaff,
    deleteStaff,
    statsList,
    addStat,
    updateStat,
    deleteStat,
    programs,
    addProgram,
    updateProgram,
    deleteProgram,
    extracurriculars,
    addExtracurricular,
    updateExtracurricular,
    deleteExtracurricular,
    achievements,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    newsList,
    addNews,
    updateNews,
    deleteNews,
    facilities,
    addFacility,
    updateFacility,
    deleteFacility,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    faqs,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    ppdbRegistrations,
    addPPDBRegistration,
    updatePPDBStatus,
    deletePPDBRegistration,
    setViewMode,
    resetToDefaultData,
    exportBackupJSON,
    importBackupJSON
  } = useDataContext();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Profile Form state
  const [profileForm, setProfileForm] = useState<SchoolProfile>(schoolProfile);

  // New Article Form state
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: '',
    category: 'Berita Madrasah' as NewsArticle['category'],
    summary: '',
    contentString: '',
    author: 'Admin Madrasah',
    readTime: '3 Menit',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    date: new Date().toISOString().split('T')[0]
  });

  // PPDB Search & Filter
  const [ppdbFilter, setPpdbFilter] = useState<string>('all');
  const [ppdbSearch, setPpdbSearch] = useState<string>('');
  const [isAddingPPDB, setIsAddingPPDB] = useState(false);
  const [manualPPDBForm, setManualPPDBForm] = useState({
    studentName: '',
    nik: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    birthDate: '',
    originSchool: '',
    parentName: '',
    parentPhone: '',
    address: 'Desa Soborejo, Kec. Pringsurat',
    track: 'Jalur Reguler',
    quranReadingSkill: 'Iqro / Tilawati',
    status: 'Berkas Diterima' as PPDBRegistration['status'],
    notes: 'Pendaftar langsung di kantor madrasah'
  });

  // New Achievement Form state
  const [isAddingAch, setIsAddingAch] = useState(false);
  const [achForm, setAchForm] = useState({
    title: '',
    winner: '',
    category: 'Tahfidz & Keagamaan' as AchievementItem['category'],
    level: 'Kabupaten Temanggung' as AchievementItem['level'],
    year: '2024',
    rank: 'Juara 1',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80'
  });

  // New Gallery Form state
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'Kegiatan Belajar' as GalleryItem['category'],
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    description: '',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  });

  // GTK (Staff) Form state
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [staffFilterCategory, setStaffFilterCategory] = useState<string>('Semua');
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: '',
    category: 'Guru Kelas' as StaffMember['category'],
    education: 'S.Pd.',
    nipOrNuptk: '-',
    subjects: '',
    phone: '',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    status: 'Aktif Mengajar',
    order: 10,
  });

  // Backup file ref
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Hero Section Form state
  const [heroForm, setHeroForm] = useState({
    heroTitle: schoolProfile.heroTitle || schoolProfile.tagline || 'Mencetak Peserta Didik yang Religius, Berakhlaqul Karimah, Cerdas, dan Berprestasi',
    heroSubtitle: schoolProfile.heroSubtitle || `Selamat datang di website resmi ${schoolProfile.name}, Kecamatan Pringsurat, Kabupaten Temanggung. Berkomitmen menyelenggarakan pendidikan dasar Islam yang bermakna dan berkarakter, menumbuhkan penghayatan ajaran agama, keluhuran budi pekerti, serta membina kecerdasan dan prestasi setiap peserta didik secara optimal.`,
    heroBadge: schoolProfile.heroBadge || "LP Ma'arif NU Temanggung • Soborejo, Pringsurat",
    heroBannerUrl: schoolProfile.heroBannerUrl || 'https://images.unsplash.com/photo-1584697964190-7bb8c5a2cbb5?q=80&w=1920&auto=format&fit=crop',
    highlights: schoolProfile.heroHighlights && schoolProfile.heroHighlights.length > 0
      ? [...schoolProfile.heroHighlights]
      : [
          'Tahfidz Juz 30 & Tartil',
          'Kurikulum Merdeka + Kemenag',
          'Karakter Aswaja An-Nahdliyyah',
          'Lingkungan Asri & Ramah Anak'
        ]
  });

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile({
      heroTitle: heroForm.heroTitle,
      heroSubtitle: heroForm.heroSubtitle,
      heroBadge: heroForm.heroBadge,
      heroBannerUrl: heroForm.heroBannerUrl,
      heroHighlights: heroForm.highlights,
      tagline: heroForm.heroTitle
    });
    notify('Teks & tampilan Beranda (Hero) berhasil diperbarui!');
  };

  // Stats Form state
  const [isAddingStat, setIsAddingStat] = useState(false);
  const [editingStat, setEditingStat] = useState<StatItem | null>(null);
  const [statForm, setStatForm] = useState({
    value: '',
    suffix: '',
    label: '',
    detail: ''
  });

  const handleSaveStat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statForm.value.trim() || !statForm.label.trim()) {
      notify('Angka Nilai dan Label Statistik wajib diisi!');
      return;
    }
    if (editingStat) {
      updateStat(editingStat.id, statForm);
      notify(`Statistik "${statForm.label}" berhasil diperbarui!`);
      setEditingStat(null);
    } else {
      addStat(statForm);
      notify(`Statistik baru "${statForm.label}" berhasil ditambahkan!`);
      setIsAddingStat(false);
    }
    setStatForm({ value: '', suffix: '', label: '', detail: '' });
  };

  const handleEditStat = (item: StatItem) => {
    setEditingStat(item);
    setStatForm({
      value: item.value,
      suffix: item.suffix || '',
      label: item.label,
      detail: item.detail || ''
    });
    setIsAddingStat(true);
  };

  const handleDeleteStat = (id: string, label: string) => {
    if (window.confirm(`Hapus data statistik "${label}"?`)) {
      deleteStat(id);
      notify(`Statistik "${label}" berhasil dihapus.`);
    }
  };

  const handleSeedExampleStats = () => {
    const examples: Omit<StatItem, 'id'>[] = [
      {
        value: '150',
        suffix: '+',
        label: 'Peserta Didik Aktif',
        detail: 'Santri putra dan putri terdaftar resmi di EMIS Kemenag TP 2024/2025'
      },
      {
        value: '12',
        suffix: 'GTK',
        label: 'Guru & Tenaga Kependidikan',
        detail: 'Pendidik sarjana kualifikasi linier dan kompeten di bidangnya'
      },
      {
        value: '6',
        suffix: 'Rombel',
        label: 'Rombongan Belajar',
        detail: 'Kelas 1 hingga Kelas 6 dengan ruang kelas representative'
      },
      {
        value: '100',
        suffix: '%',
        label: 'Tingkat Kelulusan',
        detail: 'Alumni melanjutkan ke MTs/SMP favorit dan pondok pesantren'
      }
    ];
    examples.forEach((item) => addStat(item));
    notify('4 data statistik referensi madrasah berhasil dimuat!');
  };

  const handleClearAllStats = () => {
    if (window.confirm('Kosongkan semua kartu statistik madrasah? Di halaman depan, bagian statistik akan disembunyikan sampai Anda menambahkan data baru.')) {
      statsList.forEach((st) => deleteStat(st.id));
      notify('Semua data statistik berhasil dikosongkan.');
    }
  };

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile(profileForm);
    notify('Data profil dan identitas madrasah berhasil diperbarui!');
  };

  // Staff (GTK) Save
  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      updateStaff(editingStaff.id, staffForm);
      notify(`Data ${staffForm.name} berhasil diperbarui!`);
      setEditingStaff(null);
    } else {
      addStaff(staffForm);
      notify(`Anggota GTK baru "${staffForm.name}" berhasil ditambahkan!`);
      setIsAddingStaff(false);
    }
    setStaffForm({
      name: '',
      role: '',
      category: 'Guru Kelas',
      education: 'S.Pd.',
      nipOrNuptk: '-',
      subjects: '',
      phone: '',
      photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      status: 'Aktif Mengajar',
      order: 10,
    });
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (window.confirm(`Hapus data pendidik / tenaga kependidikan "${name}"?`)) {
      deleteStaff(id);
      notify(`Data ${name} berhasil dihapus.`);
    }
  };

  const handleEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
    setStaffForm({
      name: staff.name,
      role: staff.role,
      category: staff.category,
      education: staff.education || '',
      nipOrNuptk: staff.nipOrNuptk || '-',
      subjects: staff.subjects || '',
      phone: staff.phone || '',
      photoUrl: staff.photoUrl || '',
      status: staff.status || 'Aktif Mengajar',
      order: staff.order || 10,
    });
  };

  // PPDB Manual Save
  const handleSaveManualPPDB = (e: React.FormEvent) => {
    e.preventDefault();
    const code = addPPDBRegistration({
      registrationNumber: `REG-OFFLINE-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: manualPPDBForm.studentName,
      nik: manualPPDBForm.nik,
      gender: manualPPDBForm.gender,
      birthDate: manualPPDBForm.birthDate || '2018-05-10',
      originSchool: manualPPDBForm.originSchool,
      parentName: manualPPDBForm.parentName,
      parentPhone: manualPPDBForm.parentPhone,
      address: manualPPDBForm.address,
      track: manualPPDBForm.track,
      quranReadingSkill: manualPPDBForm.quranReadingSkill,
      status: manualPPDBForm.status,
      notes: manualPPDBForm.notes
    });
    notify(`Pendaftar baru berhasil ditambahkan dengan kode ${code}!`);
    setIsAddingPPDB(false);
    setManualPPDBForm({
      studentName: '',
      nik: '',
      gender: 'Laki-laki',
      birthDate: '',
      originSchool: '',
      parentName: '',
      parentPhone: '',
      address: 'Desa Soborejo, Kec. Pringsurat',
      track: 'Jalur Reguler',
      quranReadingSkill: 'Iqro / Tilawati',
      status: 'Berkas Diterima',
      notes: 'Pendaftar langsung di kantor madrasah'
    });
  };

  // Export PPDB to CSV
  const handleExportPPDBToCSV = () => {
    const headers = [
      'No Registrasi',
      'Tanggal Daftar',
      'Nama Siswa',
      'NIK',
      'Gender',
      'Tgl Lahir',
      'Asal Sekolah',
      'Nama Orang Tua',
      'No WhatsApp',
      'Alamat',
      'Jalur',
      'Status'
    ];
    const rows = ppdbRegistrations.map((r) => [
      r.registrationNumber,
      r.submissionDate,
      `"${r.studentName}"`,
      `'${r.nik}'`,
      r.gender,
      r.birthDate,
      `"${r.originSchool}"`,
      `"${r.parentName}"`,
      `'${r.parentPhone}'`,
      `"${r.address.replace(/"/g, '""')}"`,
      `"${r.track || 'Reguler'}"`,
      `"${r.status}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data-pendaftar-ppdb-mi-al-ihsan-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('File CSV data pendaftar PPDB berhasil diunduh!');
  };

  // News Save
  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    const contentParagraphs = newsForm.contentString
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    if (editingNews) {
      updateNews(editingNews.id, {
        title: newsForm.title,
        category: newsForm.category,
        summary: newsForm.summary,
        content: contentParagraphs.length > 0 ? contentParagraphs : [newsForm.summary],
        author: newsForm.author,
        readTime: newsForm.readTime,
        imageUrl: newsForm.imageUrl,
        date: newsForm.date
      });
      notify('Berita berhasil diperbarui!');
      setEditingNews(null);
    } else {
      addNews({
        title: newsForm.title,
        category: newsForm.category,
        summary: newsForm.summary,
        content: contentParagraphs.length > 0 ? contentParagraphs : [newsForm.summary],
        author: newsForm.author,
        readTime: newsForm.readTime,
        imageUrl: newsForm.imageUrl,
        date: newsForm.date
      });
      notify('Berita baru berhasil dipublikasikan!');
      setIsAddingNews(false);
    }

    setNewsForm({
      title: '',
      category: 'Berita Madrasah',
      summary: '',
      contentString: '',
      author: 'Admin Madrasah',
      readTime: '3 Menit',
      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      date: new Date().toISOString().split('T')[0]
    });
  };

  // Achievement Save
  const handleSaveAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    addAchievement(achForm);
    notify('Data prestasi santri berhasil ditambahkan!');
    setIsAddingAch(false);
    setAchForm({
      title: '',
      winner: '',
      category: 'Tahfidz & Keagamaan',
      level: 'Kabupaten Temanggung',
      year: '2024',
      rank: 'Juara 1',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80'
    });
  };

  // Gallery Save
  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    addGalleryItem(galleryForm);
    notify('Foto kegiatan santri berhasil ditambahkan ke galeri!');
    setIsAddingGallery(false);
    setGalleryForm({
      title: '',
      category: 'Kegiatan Belajar',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      description: '',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    });
  };

  // Filtered PPDB list
  const filteredPPDB = ppdbRegistrations.filter((r) => {
    const matchStatus = ppdbFilter === 'all' || r.status === ppdbFilter;
    const matchSearch =
      r.studentName.toLowerCase().includes(ppdbSearch.toLowerCase()) ||
      r.registrationNumber.toLowerCase().includes(ppdbSearch.toLowerCase()) ||
      (r.nik && r.nik.includes(ppdbSearch)) ||
      r.parentName.toLowerCase().includes(ppdbSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div id="admin-dashboard-container" className="min-h-screen bg-[#f3f6f4] text-[#1d2925] flex flex-col">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#072217] text-[#f3e5ab] px-5 py-3 rounded-xl shadow-2xl border border-[#d4af37] flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-300">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Admin Dashboard Header */}
      <header className="bg-gradient-to-r from-[#072217] via-[#0b3c26] to-[#041a11] text-white py-5 px-4 sm:px-8 border-b border-[#d4af37]/40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#d4af37] text-[#072217] flex items-center justify-center font-bold text-lg shadow-md border border-white/20">
              MI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-lg sm:text-xl font-bold text-[#f3e5ab]">
                  Panel Pengelola Konten (CMS)
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Admin Aktif
                </span>
              </div>
              <p className="text-xs text-white/70">
                MI Ma'arif Al Ihsan Soborejo • Pringsurat, Kab. Temanggung
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('public')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#b89228] text-[#072217] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:brightness-105 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Lihat Pratinjau Website</span>
            </button>
            <button
              onClick={exportBackupJSON}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-[#f3e5ab] text-xs font-semibold rounded-xl border border-white/15 transition-all"
              title="Unduh file backup seluruh konten"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup JSON</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace Layout */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-6 p-4 sm:p-6 lg:p-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 bg-white rounded-2xl border border-gray-200/80 shadow-sm p-3 self-start">
          <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 px-3 py-2">
            Menu Pengelolaan
          </div>

          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Ringkasan & Status', icon: LayoutDashboard },
              { id: 'hero_stats', label: 'Teks Beranda & Statistik', icon: Sparkles, badge: statsList.length },
              { id: 'profile', label: 'Profil & Identitas', icon: Building },
              { id: 'staff', label: 'Manajemen GTK (Guru)', icon: GraduationCap, badge: staffList.length },
              { id: 'ppdb', label: 'Pendaftar PPDB Online', icon: Users, badge: ppdbRegistrations.length },
              { id: 'news', label: 'Berita & Pengumuman', icon: Newspaper, badge: newsList.length },
              { id: 'programs', label: 'Program Unggulan', icon: BookOpen },
              { id: 'extracurriculars', label: 'Ekstrakurikuler', icon: Trophy },
              { id: 'achievements', label: 'Prestasi Santri', icon: Trophy },
              { id: 'facilities', label: 'Galeri & Fasilitas', icon: Camera },
              { id: 'testimonials_faq', label: 'Testimoni & FAQ', icon: MessageSquare },
              { id: 'backup', label: 'Cadangan & Pemulihan', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#d4af37]' : 'text-gray-500'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-[#d4af37] text-[#072217]' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-6 pt-4 border-t border-gray-100 px-3">
            <div className="text-[11px] text-gray-500">
              Penyimpanan: <strong>Lokal Browser (Offline-Ready)</strong>
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              Setiap perubahan otomatis disimpan secara persisten.
            </div>
          </div>
        </aside>

        {/* Content Workspace Area */}
        <main className="flex-1 bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 sm:p-7 min-w-0">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full">
                  Pusat Kendali
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1">
                  Selamat Datang di Panel Pengelola MI Ma'arif Al Ihsan Soborejo
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Kelola seluruh konten, identitas, pendaftar santri baru, warta berita, hingga galeri kegiatan madrasah dengan mudah.
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveTab('ppdb')}
                  className="p-4 rounded-xl bg-[#f8faf9] border border-gray-200 hover:border-[#0b3c26] cursor-pointer transition-colors"
                >
                  <div className="text-xs text-gray-500 font-medium">Pendaftar PPDB</div>
                  <div className="font-heading text-2xl font-bold text-[#0b3c26] mt-1">
                    {ppdbRegistrations.length}
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
                    <span>
                      {ppdbRegistrations.filter((r) => r.status === 'Lulus Seleksi Administrasi').length} Lulus Seleksi
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('news')}
                  className="p-4 rounded-xl bg-[#f8faf9] border border-gray-200 hover:border-[#0b3c26] cursor-pointer transition-colors"
                >
                  <div className="text-xs text-gray-500 font-medium">Berita & Warta</div>
                  <div className="font-heading text-2xl font-bold text-[#072217] mt-1">
                    {newsList.length}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">Artikel Terpublikasi</div>
                </div>

                <div
                  onClick={() => setActiveTab('achievements')}
                  className="p-4 rounded-xl bg-[#f8faf9] border border-gray-200 hover:border-[#0b3c26] cursor-pointer transition-colors"
                >
                  <div className="text-xs text-gray-500 font-medium">Prestasi Santri</div>
                  <div className="font-heading text-2xl font-bold text-[#d4af37] mt-1">
                    {achievements.length}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">Tingkat Kec/Kab/Prov</div>
                </div>

                <div
                  onClick={() => setActiveTab('facilities')}
                  className="p-4 rounded-xl bg-[#f8faf9] border border-gray-200 hover:border-[#0b3c26] cursor-pointer transition-colors"
                >
                  <div className="text-xs text-gray-500 font-medium">Foto Galeri</div>
                  <div className="font-heading text-2xl font-bold text-[#072217] mt-1">
                    {gallery.length}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">Dokumentasi Kegiatan</div>
                </div>
              </div>

              {/* Card Banner: Teks Beranda & Statistik Madrasah */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0b3c26] text-[#d4af37] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-[#072217]">
                      Teks Beranda (Hero) & Statistik Madrasah
                    </h3>
                    <p className="text-xs text-emerald-900/80 mt-0.5">
                      Data dummy telah dibersihkan. Anda dapat mengelola headline, sambutan madrasah, dan menambahkan indikator statistik riil ({statsList.length} kartu aktif saat ini).
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('hero_stats')}
                  className="px-4 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Edit className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Kelola Beranda & Statistik</span>
                </button>
              </div>

              {/* Status Kelengkapan Data Profil */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-sm font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Data Penting yang Masih Berisi Label Pengingat:</span>
                    </h3>
                    <p className="text-xs text-amber-800/80 mt-1">
                      Beberapa kolom masih menggunakan placeholder resmi yang dapat Anda ubah sekarang di tab <strong>Profil & Identitas</strong>:
                    </p>
                    <ul className="text-xs text-gray-700 mt-2 space-y-1 list-disc list-inside">
                      <li>Nama Kepala Madrasah saat ini: <code className="bg-white px-1.5 py-0.5 rounded font-bold text-amber-900">{schoolProfile.headmasterName}</code></li>
                      <li>Nomor Telepon: <code className="bg-white px-1.5 py-0.5 rounded font-mono">{schoolProfile.phone}</code></li>
                      <li>Nomor WhatsApp PPDB: <code className="bg-white px-1.5 py-0.5 rounded font-mono">{schoolProfile.whatsapp}</code></li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className="px-4 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl whitespace-nowrap transition-colors"
                  >
                    Lengkapi Profil
                  </button>
                </div>
              </div>

              {/* Quick Actions & Recent PPDB */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading text-base font-bold text-[#072217]">
                    Pendaftar PPDB Terbaru
                  </h3>
                  <button
                    onClick={() => setActiveTab('ppdb')}
                    className="text-xs font-semibold text-[#0b3c26] hover:underline flex items-center gap-1"
                  >
                    <span>Lihat Semua ({ppdbRegistrations.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="p-3">No. Registrasi</th>
                        <th className="p-3">Nama Santri</th>
                        <th className="p-3">Asal Sekolah</th>
                        <th className="p-3">Jalur</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {ppdbRegistrations.slice(0, 4).map((reg) => (
                        <tr key={reg.id} className="hover:bg-gray-50/80">
                          <td className="p-3 font-mono font-bold text-[#0b3c26]">{reg.registrationNumber}</td>
                          <td className="p-3 font-semibold">{reg.studentName}</td>
                          <td className="p-3 text-gray-500">{reg.originSchool}</td>
                          <td className="p-3">{reg.track || 'Reguler'}</td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                reg.status === 'Lulus Seleksi Administrasi'
                                  ? 'bg-green-100 text-green-800'
                                  : reg.status === 'Berkas Diterima'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {reg.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HERO & STATISTIK BERANDA */}
          {activeTab === 'hero_stats' && (
            <div className="space-y-8">
              {/* Header Tab */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full">
                    Bagian Terdepan Website
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1">
                    Kelola Teks Beranda (Hero) & Kartu Statistik
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    Atur tagline utama, sambutan selamat datang, badge identitas, serta kelola angka capaian statistik madrasah.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setViewMode('public')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#0b3c26]" />
                    <span>Lihat Halaman Utama</span>
                  </button>
                </div>
              </div>

              {/* SECTION 1: HERO SECTION CMS */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0b3c26]/10 flex items-center justify-center text-[#0b3c26]">
                      <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-[#072217]">
                        1. Pengaturan Teks & Visual Beranda (Hero Banner)
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Ditampilkan paling atas saat pengunjung pertama kali membuka website madrasah.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#063b25] via-[#042819] to-[#02180f] p-5 sm:p-7 text-white text-center border border-[#d4af37]/30 shadow-inner">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay pointer-events-none"
                    style={{ backgroundImage: `url('${heroForm.heroBannerUrl}')` }}
                  />
                  <div className="relative z-10 max-w-xl mx-auto space-y-3">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3e5ab]">
                      {heroForm.heroBadge || "LP Ma'arif NU Temanggung • Soborejo"}
                    </span>
                    <h4 className="font-heading text-lg sm:text-xl font-bold leading-snug bg-gradient-to-b from-white to-[#f3e5ab] bg-clip-text text-transparent">
                      {heroForm.heroTitle}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-white/80 line-clamp-3 leading-relaxed">
                      {heroForm.heroSubtitle}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[10px] text-white/70">
                      {heroForm.highlights.map((hl, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white/10 rounded-full border border-white/10">
                          ✦ {hl}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-2 right-3 text-[10px] text-[#f3e5ab]/60 uppercase tracking-wider font-mono">
                    Pratinjau Langsung
                  </div>
                </div>

                {/* Hero Form */}
                <form onSubmit={handleSaveHero} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Judul Utama / Tagline Beranda (Hero Headline) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={heroForm.heroTitle}
                      onChange={(e) => setHeroForm({ ...heroForm, heroTitle: e.target.value })}
                      placeholder="Mencetak Peserta Didik yang Religius, Berakhlaqul Karimah, Cerdas, dan Berprestasi"
                      className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0b3c26] focus:border-[#0b3c26]"
                    />
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      Teks headline besar yang merefleksikan visi madrasah di hadapan publik.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Teks Penjelas / Sambutan Selamat Datang <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={heroForm.heroSubtitle}
                      onChange={(e) => setHeroForm({ ...heroForm, heroSubtitle: e.target.value })}
                      placeholder="Selamat datang di website resmi MI Ma'arif Al Ihsan Soborejo..."
                      className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0b3c26] focus:border-[#0b3c26] leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Teks Badge Afiliasi & Wilayah
                      </label>
                      <input
                        type="text"
                        value={heroForm.heroBadge}
                        onChange={(e) => setHeroForm({ ...heroForm, heroBadge: e.target.value })}
                        placeholder="LP Ma'arif NU Temanggung • Soborejo, Pringsurat"
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#0b3c26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        URL Gambar Latar Hero (Cover)
                      </label>
                      <input
                        type="url"
                        value={heroForm.heroBannerUrl}
                        onChange={(e) => setHeroForm({ ...heroForm, heroBannerUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#0b3c26]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setHeroForm({
                            ...heroForm,
                            heroBannerUrl:
                              'https://images.unsplash.com/photo-1584697964190-7bb8c5a2cbb5?q=80&w=1920&auto=format&fit=crop',
                          })
                        }
                        className="text-[11px] text-[#0b3c26] hover:underline font-medium mt-1 inline-block"
                      >
                        Reset ke Cover Nuansa Madrasah Default
                      </button>
                    </div>
                  </div>

                  {/* Highlights Inputs */}
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      4 Poin Keunggulan Ringkas (Pill Bar Bawah Hero)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {heroForm.highlights.map((hl, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="w-5 text-[11px] font-bold text-gray-400 text-center">
                            #{index + 1}
                          </span>
                          <input
                            type="text"
                            value={hl}
                            onChange={(e) => {
                              const updated = [...heroForm.highlights];
                              updated[index] = e.target.value;
                              setHeroForm({ ...heroForm, highlights: updated });
                            }}
                            className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                            placeholder={`Keunggulan ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold shadow-md transition-colors"
                    >
                      <Save className="w-4 h-4 text-[#d4af37]" />
                      <span>Simpan Perubahan Tampilan Hero</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* SECTION 2: STATS MANAGEMENT */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 flex items-center justify-center text-[#b89228]">
                      <BarChart2 className="w-4 h-4 text-[#0b3c26]" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-[#072217]">
                        2. Manajemen Kartu Statistik Madrasah
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Kelola kartu indikator capaian madrasah yang tampil di bawah Hero (misal: Santri, GTK, Rombel, Kelulusan).
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStat(null);
                        setStatForm({ value: '', suffix: '', label: '', detail: '' });
                        setIsAddingStat(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl shadow-sm transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Tambah Statistik Baru</span>
                    </button>

                    {statsList.length === 0 && (
                      <button
                        type="button"
                        onClick={handleSeedExampleStats}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#0b3c26] text-xs font-semibold rounded-xl border border-emerald-200 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Isi Contoh Statistik Riil</span>
                      </button>
                    )}

                    {statsList.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllStats}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Kosongkan Semua</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Alert */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 leading-relaxed flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Kebijakan Pengelolaan Data Riil:</strong> Data dummy telah dibersihkan. Anda bebas memasukkan angka riil madrasah (atau menghapusnya). Jika daftar di bawah ini kosong, bagian statistik tidak akan dimunculkan di halaman publik agar website tetap profesional tanpa angka fiktif.
                  </div>
                </div>

                {/* Form Modal / Inline Form for Add / Edit Stat */}
                {isAddingStat && (
                  <div className="p-4 sm:p-5 rounded-xl bg-amber-50/50 border-2 border-[#d4af37]/40 shadow-sm animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-200/60">
                      <h4 className="font-heading text-sm font-bold text-[#072217]">
                        {editingStat ? 'Edit Kartu Statistik' : 'Tambah Kartu Statistik Baru'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingStat(false);
                          setEditingStat(null);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveStat} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-1">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Angka / Nilai <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: 150 atau 12 atau 100"
                            value={statForm.value}
                            onChange={(e) => setStatForm({ ...statForm, value: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                          />
                        </div>

                        <div className="sm:col-span-1">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Satuan / Suffix (Opsional)
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: + atau % atau GTK atau Rombel"
                            value={statForm.suffix}
                            onChange={(e) => setStatForm({ ...statForm, suffix: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                          />
                        </div>

                        <div className="sm:col-span-1">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Label Indikator <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Peserta Didik Aktif"
                            value={statForm.label}
                            onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Keterangan Singkat / Detail Interaktif
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Santri putra dan putri terdaftar resmi di EMIS Kemenag TP 2024/2025"
                          value={statForm.detail}
                          onChange={(e) => setStatForm({ ...statForm, detail: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                        />
                        <span className="text-[10px] text-gray-500 mt-1 block">
                          Teks penjelas yang muncul saat pengunjung mengarahkan kursor atau mengklik kartu statistik.
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingStat(false);
                            setEditingStat(null);
                          }}
                          className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-lg shadow-sm"
                        >
                          <Save className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>{editingStat ? 'Perbarui Statistik' : 'Simpan Statistik'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Stats List Grid */}
                {statsList.length === 0 ? (
                  <div className="text-center py-10 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                      <BarChart2 className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="max-w-md mx-auto">
                      <h4 className="text-sm font-bold text-gray-800">Daftar Statistik Masih Kosong</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Data dummy telah berhasil dibersihkan sesuai permintaan Anda. Anda dapat menambahkan data riil satu per satu atau memuat contoh data referensi madrasah.
                      </p>
                    </div>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingStat(null);
                          setStatForm({ value: '', suffix: '', label: '', detail: '' });
                          setIsAddingStat(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b3c26] text-[#f3e5ab] text-xs font-bold rounded-xl shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Tambah Kartu Pertama</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSeedExampleStats}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#0b3c26]" />
                        <span>Muat 4 Contoh Statistik</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsList.map((stat, idx) => (
                      <div
                        key={stat.id || idx}
                        className="p-4 rounded-xl border border-gray-200 bg-[#fbfdfc] hover:border-[#0b3c26]/40 transition-all flex flex-col justify-between shadow-sm relative group"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                            <span className="font-mono font-bold text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
                              #{idx + 1}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleEditStat(stat)}
                                className="p-1 rounded text-gray-400 hover:text-[#0b3c26] hover:bg-gray-100"
                                title="Edit Statistik"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteStat(stat.id, stat.label)}
                                className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50"
                                title="Hapus Statistik"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="font-heading text-2xl sm:text-3xl font-bold text-[#0b3c26]">
                            {stat.value}
                            {stat.suffix && (
                              <span className="text-[#d4af37] ml-0.5 text-xl font-bold">{stat.suffix}</span>
                            )}
                          </div>

                          <div className="text-xs font-bold text-gray-800 mt-1">
                            {stat.label}
                          </div>

                          {stat.detail && (
                            <div className="text-[11px] text-gray-500 mt-1.5 leading-snug line-clamp-3">
                              {stat.detail}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                          <span>Aktif di Halaman Utama</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PROFIL & IDENTITAS MADRASAH */}
          {activeTab === 'profile' && (
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full">
                  Identitas Lembaga
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1">
                  Kelola Data Profil & Sambutan Madrasah
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  Ubah nama madrasah, alamat resmi Soborejo Pringsurat, kontak, nama Kepala Madrasah, visi, misi, dan teks sambutan.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Info Utama & Logo */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b3c26] mb-3">
                    Identitas, Logo & Legalitas Madrasah
                  </h3>

                  {/* Logo Management */}
                  <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-16 h-16 rounded-xl border-2 border-[#d4af37] bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                      {profileForm.logoUrl ? (
                        <img
                          src={profileForm.logoUrl}
                          alt="Pratinjau Logo"
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Logo_Nahdlatul_Ulama.svg/400px-Logo_Nahdlatul_Ulama.svg.png';
                          }}
                        />
                      ) : (
                        <div className="text-[10px] text-gray-400 text-center font-bold px-1">
                          Emblem Default
                        </div>
                      )}
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        URL Logo Madrasah (Ditampilkan pada Navbar & Dokumen)
                      </label>
                      <input
                        type="url"
                        placeholder="https://... URL tautan gambar logo resmi madrasah (.png / .jpg / .svg)"
                        value={profileForm.logoUrl || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, logoUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                      />
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() =>
                            setProfileForm({
                              ...profileForm,
                              logoUrl:
                                'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Logo_Nahdlatul_Ulama.svg/400px-Logo_Nahdlatul_Ulama.svg.png',
                            })
                          }
                          className="text-[11px] text-emerald-800 hover:text-emerald-950 font-medium underline"
                        >
                          Gunakan Logo LP Ma'arif NU
                        </button>
                        <span className="text-gray-300">•</span>
                        <button
                          type="button"
                          onClick={() => setProfileForm({ ...profileForm, logoUrl: '' })}
                          className="text-[11px] text-red-600 hover:text-red-800 font-medium underline"
                        >
                          Reset ke Emblem Bawaan
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Resmi Madrasah</label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Motto / Tagline</label>
                      <input
                        type="text"
                        required
                        value={profileForm.tagline}
                        onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">NPSN</label>
                      <input
                        type="text"
                        value={profileForm.npsn}
                        onChange={(e) => setProfileForm({ ...profileForm, npsn: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">NSM</label>
                      <input
                        type="text"
                        value={profileForm.nsm}
                        onChange={(e) => setProfileForm({ ...profileForm, nsm: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Status Akreditasi</label>
                      <input
                        type="text"
                        value={profileForm.accreditation}
                        onChange={(e) => setProfileForm({ ...profileForm, accreditation: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Status Lembaga</label>
                      <input
                        type="text"
                        value={profileForm.status || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                      />
                    </div>
                  </div>
                </div>

                {/* Kontak & Lokasi */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b3c26] mb-3">
                    Kontak & Alamat Lembaga
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email Resmi</label>
                      <input
                        type="email"
                        required
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Telepon Kantor</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp PPDB</label>
                      <input
                        type="text"
                        value={profileForm.whatsapp}
                        onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
                      <textarea
                        rows={2}
                        value={profileForm.fullAddress || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, fullAddress: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                      />
                    </div>
                  </div>
                </div>

                {/* Kepala Madrasah & Sambutan */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b3c26] mb-3">
                    Kepala Madrasah & Teks Sambutan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap Kepala Madrasah</label>
                      <input
                        type="text"
                        value={profileForm.headmasterName}
                        onChange={(e) => setProfileForm({ ...profileForm, headmasterName: e.target.value })}
                        placeholder="contoh: H. Ahmad Fauzi, S.Pd.I"
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Jabatan / Gelar</label>
                      <input
                        type="text"
                        value={profileForm.headmasterTitle}
                        onChange={(e) => setProfileForm({ ...profileForm, headmasterTitle: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Paragraf Sambutan Kepala Madrasah (Pisahkan setiap paragraf dengan baris kosong/enter)
                    </label>
                    <textarea
                      rows={6}
                      value={profileForm.headmasterWelcome.join('\n\n')}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          headmasterWelcome: e.target.value.split('\n\n').filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                    />
                  </div>
                </div>

                {/* Visi, Misi & Tujuan */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b3c26] mb-3">
                    Visi, Misi & Tujuan Madrasah
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Visi Madrasah</label>
                      <textarea
                        rows={2}
                        value={profileForm.vision}
                        onChange={(e) => setProfileForm({ ...profileForm, vision: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Butir-butir Misi (Pisahkan setiap butir misi dengan baris baru / Enter)
                      </label>
                      <textarea
                        rows={5}
                        value={profileForm.missions.join('\n')}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            missions: e.target.value.split('\n').filter(Boolean),
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Butir-butir Tujuan Madrasah (Pisahkan setiap butir tujuan dengan baris baru / Enter)
                      </label>
                      <textarea
                        rows={6}
                        value={(profileForm.goals || []).join('\n')}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            goals: e.target.value.split('\n').filter(Boolean),
                          })
                        }
                        placeholder="a. Dalam Ujian, siswa memperoleh..."
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Profil</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB GTK: MANAJEMEN DEWAN GURU & TENAGA KEPENDIDIKAN */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full">
                    Dewan Asatidz & Staf
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1">
                    Manajemen Guru & Tenaga Kependidikan (GTK)
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    Kelola data asatidz, guru kelas, guru bidang studi, dan staf administrasi madrasah.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingStaff(null);
                    setStaffForm({
                      name: '',
                      role: '',
                      category: 'Guru Kelas',
                      education: 'S.Pd.',
                      nipOrNuptk: '-',
                      subjects: '',
                      phone: '',
                      photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
                      status: 'Aktif Mengajar',
                      order: (staffList.length + 1) * 10,
                    });
                    setIsAddingStaff(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Guru / Staf Baru</span>
                </button>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-2">
                {['Semua', 'Pimpinan', 'Guru Kelas', 'Guru Bidang Studi', 'Tenaga Kependidikan'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setStaffFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      staffFilterCategory === cat
                        ? 'bg-[#0b3c26] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Staff Table / Cards */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3">Foto & Nama Lengkap</th>
                      <th className="p-3">Jabatan & Kategori</th>
                      <th className="p-3">NIP / NUPTK</th>
                      <th className="p-3">Kualifikasi & Tugas</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {staffList
                      .filter((s) => staffFilterCategory === 'Semua' || s.category === staffFilterCategory)
                      .sort((a, b) => (a.order || 99) - (b.order || 99))
                      .map((staff) => (
                        <tr key={staff.id} className="hover:bg-gray-50/80">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={staff.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80'}
                                alt={staff.name}
                                className="w-10 h-10 rounded-full object-cover border border-[#d4af37]/40 shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=200&q=80';
                                }}
                              />
                              <div>
                                <div className="font-bold text-[#072217]">{staff.name}</div>
                                {staff.phone && (
                                  <div className="text-[10px] text-gray-400">{staff.phone}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-emerald-900">{staff.role}</div>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {staff.category}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-gray-600">
                            {staff.nipOrNuptk || '-'}
                          </td>
                          <td className="p-3">
                            <div className="font-medium text-gray-800">{staff.education}</div>
                            <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                              {staff.subjects || '-'}
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEditStaff(staff)}
                                className="p-1.5 hover:bg-emerald-50 text-emerald-700 rounded-lg transition-colors"
                                title="Edit Data GTK"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStaff(staff.id, staff.name)}
                                className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                title="Hapus GTK"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Add / Edit GTK Modal */}
              {(isAddingStaff || editingStaff) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-200">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                      <h3 className="font-heading text-lg font-bold text-[#072217]">
                        {editingStaff ? 'Edit Data Guru / Tenaga Kependidikan' : 'Tambah Anggota GTK Baru'}
                      </h3>
                      <button
                        onClick={() => {
                          setIsAddingStaff(false);
                          setEditingStaff(null);
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveStaff} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Nama Lengkap & Gelar *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="contoh: Ahmad Fauzi, S.Pd.I."
                            value={staffForm.name}
                            onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Jabatan / Amanah *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="contoh: Guru Kelas 1 / Kepala Madrasah"
                            value={staffForm.role}
                            onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Kategori GTK
                          </label>
                          <select
                            value={staffForm.category}
                            onChange={(e) =>
                              setStaffForm({ ...staffForm, category: e.target.value as StaffMember['category'] })
                            }
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                          >
                            <option value="Pimpinan">Pimpinan</option>
                            <option value="Guru Kelas">Guru Kelas</option>
                            <option value="Guru Bidang Studi">Guru Bidang Studi</option>
                            <option value="Tenaga Kependidikan">Tenaga Kependidikan</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Kualifikasi Akademik
                          </label>
                          <input
                            type="text"
                            placeholder="contoh: S.Pd.I. / S.Pd."
                            value={staffForm.education}
                            onChange={(e) => setStaffForm({ ...staffForm, education: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            NIP / NUPTK
                          </label>
                          <input
                            type="text"
                            placeholder="contoh: 1980... atau -"
                            value={staffForm.nipOrNuptk}
                            onChange={(e) => setStaffForm({ ...staffForm, nipOrNuptk: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Mata Pelajaran / Tugas Tambahan
                          </label>
                          <input
                            type="text"
                            placeholder="contoh: Tematik & Al-Qur'an Hadits / Pembina Pramuka"
                            value={staffForm.subjects}
                            onChange={(e) => setStaffForm({ ...staffForm, subjects: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            No. Telepon / WhatsApp (Opsional)
                          </label>
                          <input
                            type="text"
                            placeholder="08..."
                            value={staffForm.phone}
                            onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Urutan Tampil (Angka kecil tampil di awal)
                          </label>
                          <input
                            type="number"
                            value={staffForm.order}
                            onChange={(e) => setStaffForm({ ...staffForm, order: parseInt(e.target.value) || 10 })}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            URL Foto Profil Guru / Staf
                          </label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={staffForm.photoUrl}
                            onChange={(e) => setStaffForm({ ...staffForm, photoUrl: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingStaff(false);
                            setEditingStaff(null);
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0b3c26] text-[#f3e5ab] text-xs font-bold rounded-lg hover:bg-[#072217]"
                        >
                          {editingStaff ? 'Simpan Perubahan' : 'Tambahkan GTK'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: KELOLA PPDB */}
          {activeTab === 'ppdb' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full">
                    Penerimaan Siswa Baru
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1">
                    Kelola Pendaftar PPDB Online
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    Lihat berkas, ubah status seleksi calon siswa, atau tambah pendaftar manual langsung.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsAddingPPDB(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Pendaftar Manual</span>
                  </button>
                  <button
                    onClick={handleExportPPDBToCSV}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-[#0b3c26]" />
                    <span>Ekspor ke CSV</span>
                  </button>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari nama, NIK, no. registrasi..."
                    value={ppdbSearch}
                    onChange={(e) => setPpdbSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0b3c26]"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                  {['all', 'Menunggu Verifikasi', 'Berkas Diterima', 'Lulus Seleksi Administrasi'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setPpdbFilter(st)}
                      className={`text-[11px] px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                        ppdbFilter === st
                          ? 'bg-[#0b3c26] text-[#f3e5ab] font-bold'
                          : 'bg-white text-gray-600 hover:bg-gray-150 border border-gray-200'
                      }`}
                    >
                      {st === 'all' ? 'Semua Status' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Applicants Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8faf9] text-gray-600 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="p-3">No. Registrasi</th>
                        <th className="p-3">Calon Siswa</th>
                        <th className="p-3">Asal Sekolah</th>
                        <th className="p-3">Orang Tua / Kontak</th>
                        <th className="p-3">Jalur & Mengaji</th>
                        <th className="p-3">Status Seleksi</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {filteredPPDB.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-500">
                            Tidak ditemukan pendaftar yang cocok dengan kata kunci/filter.
                          </td>
                        </tr>
                      ) : (
                        filteredPPDB.map((reg) => (
                          <tr key={reg.id} className="hover:bg-gray-50/80">
                            <td className="p-3 font-mono font-bold text-[#0b3c26] whitespace-nowrap">
                              {reg.registrationNumber}
                              <div className="text-[10px] text-gray-400 font-normal">{reg.submissionDate}</div>
                            </td>
                            <td className="p-3 font-semibold">
                              {reg.studentName}
                              <div className="text-[10px] text-gray-500 font-normal">
                                {reg.gender} • NIK: {reg.nik || '-'}
                              </div>
                            </td>
                            <td className="p-3 text-gray-600">{reg.originSchool}</td>
                            <td className="p-3">
                              <div className="font-medium text-gray-800">{reg.parentName}</div>
                              <a
                                href={`https://wa.me/${reg.parentPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3 text-emerald-600" />
                                <span>{reg.parentPhone}</span>
                              </a>
                            </td>
                            <td className="p-3">
                              <span className="font-medium text-[#072217] block">{reg.track || 'Reguler'}</span>
                              <span className="text-[10px] text-gray-500">{reg.quranReadingSkill || '-'}</span>
                            </td>
                            <td className="p-3">
                              <select
                                value={reg.status}
                                onChange={(e) =>
                                  updatePPDBStatus(reg.id, e.target.value as PPDBRegistration['status'])
                                }
                                className={`text-[10px] font-bold rounded-lg px-2 py-1 border focus:outline-none ${
                                  reg.status === 'Lulus Seleksi Administrasi'
                                    ? 'bg-green-50 text-green-800 border-green-300'
                                    : reg.status === 'Berkas Diterima'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                <option value="Berkas Diterima">Berkas Diterima</option>
                                <option value="Lulus Seleksi Administrasi">Lulus Seleksi Administrasi</option>
                                <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                              </select>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  if (window.confirm(`Hapus pendaftar ${reg.studentName}?`)) {
                                    deletePPDBRegistration(reg.id);
                                    notify('Data pendaftar dihapus.');
                                  }
                                }}
                                className="p-1 text-gray-400 hover:text-red-600 rounded"
                                title="Hapus pendaftar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Tambah Pendaftar Manual */}
              {isAddingPPDB && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                  <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#d4af37]/30 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                      <h3 className="font-heading text-base font-bold text-[#072217]">
                        Tambah Pendaftar PPDB Manual
                      </h3>
                      <button onClick={() => setIsAddingPPDB(false)} className="text-gray-400 hover:text-gray-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveManualPPDB} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Nama Lengkap Siswa *</label>
                        <input
                          type="text"
                          required
                          value={manualPPDBForm.studentName}
                          onChange={(e) => setManualPPDBForm({ ...manualPPDBForm, studentName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">NIK Calon Siswa *</label>
                          <input
                            type="text"
                            required
                            value={manualPPDBForm.nik}
                            onChange={(e) => setManualPPDBForm({ ...manualPPDBForm, nik: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Jenis Kelamin</label>
                          <select
                            value={manualPPDBForm.gender}
                            onChange={(e) =>
                              setManualPPDBForm({ ...manualPPDBForm, gender: e.target.value as any })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                          >
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Asal TK / RA / BA *</label>
                          <input
                            type="text"
                            required
                            value={manualPPDBForm.originSchool}
                            onChange={(e) => setManualPPDBForm({ ...manualPPDBForm, originSchool: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Jalur Pendaftaran</label>
                          <select
                            value={manualPPDBForm.track}
                            onChange={(e) => setManualPPDBForm({ ...manualPPDBForm, track: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                          >
                            <option value="Jalur Reguler">Jalur Reguler</option>
                            <option value="Jalur Prestasi / Tahfidz">Jalur Prestasi / Tahfidz</option>
                            <option value="Jalur Afirmasi Kemitraan">Jalur Afirmasi Kemitraan</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Nama Orang Tua *</label>
                          <input
                            type="text"
                            required
                            value={manualPPDBForm.parentName}
                            onChange={(e) => setManualPPDBForm({ ...manualPPDBForm, parentName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">No. WhatsApp *</label>
                          <input
                            type="tel"
                            required
                            value={manualPPDBForm.parentPhone}
                            onChange={(e) => setManualPPDBForm({ ...manualPPDBForm, parentPhone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
                        <textarea
                          rows={2}
                          value={manualPPDBForm.address}
                          onChange={(e) => setManualPPDBForm({ ...manualPPDBForm, address: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Status Awal</label>
                        <select
                          value={manualPPDBForm.status}
                          onChange={(e) =>
                            setManualPPDBForm({ ...manualPPDBForm, status: e.target.value as any })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        >
                          <option value="Berkas Diterima">Berkas Diterima</option>
                          <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                          <option value="Lulus Seleksi Administrasi">Lulus Seleksi Administrasi</option>
                        </select>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingPPDB(false)}
                          className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0b3c26] text-[#f3e5ab] font-bold rounded-xl"
                        >
                          Simpan Pendaftar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: KELOLA BERITA & PENGUMUMAN */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full">
                    Publikasi & Informasi
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1">
                    Kelola Berita & Pengumuman Madrasah
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    Tulis warta kegiatan, pengumuman resmi Matsama/PPDB, atau artikel parenting madrasah.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingNews(null);
                    setNewsForm({
                      title: '',
                      category: 'Berita Madrasah',
                      summary: '',
                      contentString: '',
                      author: 'Admin Madrasah',
                      readTime: '3 Menit',
                      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
                      date: new Date().toISOString().split('T')[0]
                    });
                    setIsAddingNews(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tulis Berita Baru</span>
                </button>
              </div>

              {/* News List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newsList.map((article) => (
                  <div
                    key={article.id}
                    className="border border-gray-200 rounded-xl p-4 flex gap-3 hover:border-[#0b3c26] transition-colors relative group"
                  >
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-24 h-24 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2 py-0.5 rounded">
                          {article.category}
                        </span>
                        <span className="text-[10px] text-gray-400">{article.date}</span>
                      </div>
                      <h4 className="font-heading text-xs sm:text-sm font-bold text-[#072217] line-clamp-1">
                        {article.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">
                        {article.summary}
                      </p>
                      <div className="text-[10px] text-gray-400 mt-2">
                        Oleh: <strong>{article.author}</strong> • {article.readTime}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingNews(article);
                          setNewsForm({
                            title: article.title,
                            category: article.category,
                            summary: article.summary,
                            contentString: article.content.join('\n\n'),
                            author: article.author,
                            readTime: article.readTime,
                            imageUrl: article.imageUrl,
                            date: article.date
                          });
                          setIsAddingNews(true);
                        }}
                        className="p-1.5 text-gray-500 hover:text-[#0b3c26] hover:bg-gray-100 rounded"
                        title="Edit Berita"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus berita: "${article.title}"?`)) {
                            deleteNews(article.id);
                            notify('Berita telah dihapus.');
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Hapus Berita"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Tulis / Edit Berita */}
              {isAddingNews && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                  <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#d4af37]/30 max-h-[92vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                      <h3 className="font-heading text-base font-bold text-[#072217]">
                        {editingNews ? 'Edit Berita Madrasah' : 'Tulis Berita Baru'}
                      </h3>
                      <button onClick={() => setIsAddingNews(false)} className="text-gray-400 hover:text-gray-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveNews} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Judul Berita *</label>
                        <input
                          type="text"
                          required
                          value={newsForm.title}
                          onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Kategori</label>
                          <select
                            value={newsForm.category}
                            onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                          >
                            <option value="Berita Madrasah">Berita Madrasah</option>
                            <option value="Pengumuman">Pengumuman</option>
                            <option value="Prestasi">Prestasi</option>
                            <option value="Kegiatan Siswa">Kegiatan Siswa</option>
                            <option value="Artikel Parenting">Artikel Parenting</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Penulis</label>
                          <input
                            type="text"
                            required
                            value={newsForm.author}
                            onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">URL Gambar / Foto Berita</label>
                        <input
                          type="url"
                          required
                          value={newsForm.imageUrl}
                          onChange={(e) => setNewsForm({ ...newsForm, imageUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Ringkasan Berita *</label>
                        <textarea
                          rows={2}
                          required
                          value={newsForm.summary}
                          onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">
                          Isi Lengkap Artikel (Gunakan enter 2x untuk paragraf baru)
                        </label>
                        <textarea
                          rows={6}
                          required
                          value={newsForm.contentString}
                          onChange={(e) => setNewsForm({ ...newsForm, contentString: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg leading-relaxed"
                        />
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingNews(false)}
                          className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0b3c26] text-[#f3e5ab] font-bold rounded-xl"
                        >
                          {editingNews ? 'Simpan Perubahan' : 'Terbitkan Berita'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: KELOLA PRESTASI SANTRI */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full">
                    Apresiasi & Juara
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1">
                    Kelola Prestasi Madrasah & Santri
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    Tampilkan deretan piala, kejuaraan tahfidz, sains, seni hadroh, dan pramuka.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingAch(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Prestasi</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:border-[#d4af37] transition-colors relative"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1.5">
                        <span className="font-bold text-[#0b3c26]">{ach.level}</span>
                        <span>{ach.year}</span>
                      </div>
                      <div className="inline-block bg-[#d4af37]/20 text-[#072217] text-[10px] font-bold px-2 py-0.5 rounded mb-2">
                        {ach.rank}
                      </div>
                      <h4 className="font-heading text-sm font-bold text-[#072217] mb-1">
                        {ach.title}
                      </h4>
                      <p className="text-xs text-gray-600 font-medium">Santri: {ach.winner}</p>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{ach.description}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus prestasi "${ach.title}"?`)) {
                            deleteAchievement(ach.id);
                            notify('Prestasi dihapus.');
                          }
                        }}
                        className="text-xs text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Tambah Prestasi */}
              {isAddingAch && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                  <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#d4af37]/30">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                      <h3 className="font-heading text-base font-bold text-[#072217]">
                        Tambah Prestasi Santri Baru
                      </h3>
                      <button onClick={() => setIsAddingAch(false)} className="text-gray-400 hover:text-gray-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveAchievement} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Nama Lomba / Kejuaraan *</label>
                        <input
                          type="text"
                          required
                          value={achForm.title}
                          onChange={(e) => setAchForm({ ...achForm, title: e.target.value })}
                          placeholder="contoh: MHQ Tahfidz Juz 30 Tingkat SD/MI"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Nama Santri / Tim *</label>
                          <input
                            type="text"
                            required
                            value={achForm.winner}
                            onChange={(e) => setAchForm({ ...achForm, winner: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Peringkat / Juara *</label>
                          <input
                            type="text"
                            required
                            value={achForm.rank}
                            onChange={(e) => setAchForm({ ...achForm, rank: e.target.value })}
                            placeholder="Juara 1 / Terbaik 2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Tingkat</label>
                          <select
                            value={achForm.level}
                            onChange={(e) => setAchForm({ ...achForm, level: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                          >
                            <option value="Kecamatan">Kecamatan</option>
                            <option value="Kabupaten Temanggung">Kabupaten Temanggung</option>
                            <option value="Karesidenan">Karesidenan</option>
                            <option value="Provinsi Jawa Tengah">Provinsi Jawa Tengah</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Tahun Perolehan</label>
                          <input
                            type="text"
                            required
                            value={achForm.year}
                            onChange={(e) => setAchForm({ ...achForm, year: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Deskripsi Singkat</label>
                        <textarea
                          rows={2}
                          value={achForm.description}
                          onChange={(e) => setAchForm({ ...achForm, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingAch(false)}
                          className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0b3c26] text-[#f3e5ab] font-bold rounded-xl"
                        >
                          Simpan Prestasi
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: KELOLA PROGRAM UNGGULAN & EKSTRAKURIKULER */}
          {(activeTab === 'programs' || activeTab === 'extracurriculars') && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full">
                  Kurikulum & Pembiasaan
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1">
                  {activeTab === 'programs' ? 'Kelola Program Unggulan' : 'Kelola Ekstrakurikuler'}
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  Semua program dan ekskul yang aktif akan langsung muncul di halaman beranda publik.
                </p>
              </div>

              {activeTab === 'programs' && (
                <div className="space-y-3">
                  {programs.map((prog) => (
                    <div
                      key={prog.id}
                      className="border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4"
                    >
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-emerald-50 px-2 py-0.5 rounded inline-block mb-1">
                          {prog.category}
                        </div>
                        <h4 className="font-heading text-sm font-bold text-[#072217]">
                          {prog.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">{prog.shortDesc}</p>
                        <div className="text-[11px] text-[#0b3c26] font-medium mt-2">
                          Target: {prog.target} • Jadwal: {prog.schedule}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus program "${prog.title}"?`)) {
                            deleteProgram(prog.id);
                            notify('Program dihapus.');
                          }
                        }}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Hapus Program"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'extracurriculars' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {extracurriculars.map((ekskul) => (
                    <div
                      key={ekskul.id}
                      className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-emerald-50 px-2 py-0.5 rounded inline-block mb-1">
                          {ekskul.category}
                        </div>
                        <h4 className="font-heading text-sm font-bold text-[#072217]">
                          {ekskul.name}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">{ekskul.description}</p>
                        <div className="text-[11px] text-gray-500 mt-2">
                          Pembina: <strong>{ekskul.coach}</strong> • Jadwal: {ekskul.schedule}
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus ekskul "${ekskul.name}"?`)) {
                              deleteExtracurricular(ekskul.id);
                              notify('Ekstrakurikuler dihapus.');
                            }
                          }}
                          className="text-xs text-red-600 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: KELOLA GALERI & FASILITAS */}
          {activeTab === 'facilities' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full">
                    Dokumentasi & Aset
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1">
                    Kelola Foto Galeri Kegiatan & Fasilitas
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    Tambah dokumentasi momen santri dan pembaruan sarana prasarana madrasah.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingGallery(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Foto Galeri</span>
                </button>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-xl overflow-hidden group relative bg-gray-50"
                  >
                    <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover" />
                    <div className="p-2.5">
                      <span className="text-[9px] font-bold uppercase text-[#0b3c26] block">
                        {item.category}
                      </span>
                      <h5 className="font-heading text-xs font-bold text-[#072217] line-clamp-1 mt-0.5">
                        {item.title}
                      </h5>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus foto "${item.title}"?`)) {
                          deleteGalleryItem(item.id);
                          notify('Foto dihapus dari galeri.');
                        }
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Modal Tambah Foto Galeri */}
              {isAddingGallery && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                  <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#d4af37]/30">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                      <h3 className="font-heading text-base font-bold text-[#072217]">
                        Tambah Foto Kegiatan ke Galeri
                      </h3>
                      <button onClick={() => setIsAddingGallery(false)} className="text-gray-400 hover:text-gray-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveGallery} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Judul / Momen Foto *</label>
                        <input
                          type="text"
                          required
                          value={galleryForm.title}
                          onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                          placeholder="contoh: Senam Sehat Ceria Santri Soborejo"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Kategori</label>
                        <select
                          value={galleryForm.category}
                          onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        >
                          <option value="Kegiatan Belajar">Kegiatan Belajar</option>
                          <option value="Ibadah & Karakter">Ibadah & Karakter</option>
                          <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                          <option value="Fasilitas">Fasilitas</option>
                          <option value="Prestasi">Prestasi</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">URL Gambar / Foto</label>
                        <input
                          type="url"
                          required
                          value={galleryForm.imageUrl}
                          onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Deskripsi Singkat</label>
                        <textarea
                          rows={2}
                          value={galleryForm.description}
                          onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingGallery(false)}
                          className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0b3c26] text-[#f3e5ab] font-bold rounded-xl"
                        >
                          Simpan ke Galeri
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: KELOLA TESTIMONI & FAQ */}
          {activeTab === 'testimonials_faq' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full">
                  Suara Wali & Edukasi
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1">
                  Kelola Testimoni & FAQ (Tanya Jawab)
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  Ubah atau hapus testimoni kepuasan orang tua santri dan tanya-jawab seputar pendaftaran.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b3c26] mb-3">
                  Daftar Testimoni Orang Tua Santri ({testimonials.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {testimonials.map((t) => (
                    <div key={t.id} className="border border-gray-200 rounded-xl p-4 flex justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-xs text-[#072217]">{t.name} ({t.role})</h4>
                        <div className="text-[11px] text-gray-500 mb-2">Orang tua dari: {t.childName}</div>
                        <p className="text-xs text-gray-700 italic">"{t.quote}"</p>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus testimoni dari ${t.name}?`)) {
                            deleteTestimonial(t.id);
                            notify('Testimoni dihapus.');
                          }
                        }}
                        className="text-gray-400 hover:text-red-600 p-1 shrink-0 self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b3c26] mb-3">
                  Tanya Jawab Umum (FAQ) ({faqs.length})
                </h3>
                <div className="space-y-3">
                  {faqs.map((f) => (
                    <div key={f.id} className="border border-gray-200 rounded-xl p-4 flex justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#0b3c26] bg-emerald-50 px-2 py-0.5 rounded">
                          {f.category}
                        </span>
                        <h4 className="font-heading text-xs sm:text-sm font-bold text-[#072217] mt-1">
                          {f.question}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{f.answer}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus pertanyaan "${f.question}"?`)) {
                            deleteFAQ(f.id);
                            notify('FAQ dihapus.');
                          }
                        }}
                        className="text-gray-400 hover:text-red-600 p-1 shrink-0 self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: PENCADANGAN & PENGATURAN (BACKUP & RESTORE) */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full">
                  Keamanan Data
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1">
                  Cadangkan, Pulihkan & Pengaturan Data
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  Simpan seluruh data website madrasah ke dalam komputer Anda dalam format JSON untuk arsip atau transfer ke perangkat lain.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="border border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-white to-[#f8faf9] flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0b3c26] flex items-center justify-center mb-3">
                      <Download className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading text-base font-bold text-[#072217]">
                      Unduh Cadangan Lengkap (Export JSON)
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Menghasilkan file arsip JSON yang berisi seluruh profil madrasah, semua berita, data pendaftar PPDB, galeri, dan prestasi.
                    </p>
                  </div>

                  <button
                    onClick={exportBackupJSON}
                    className="mt-6 w-full py-2.5 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh File Backup Sekarang</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="border border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-white to-[#f8faf9] flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
                      <Upload className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading text-base font-bold text-[#072217]">
                      Pulihkan Data (Import JSON)
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Unggah file cadangan JSON yang pernah Anda simpan sebelumnya untuk memulihkan seluruh konten website.
                    </p>
                  </div>

                  <div>
                    <input
                      type="file"
                      accept=".json"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const content = event.target?.result as string;
                            const ok = importBackupJSON(content);
                            if (ok) {
                              notify('Data cadangan berhasil dipulihkan!');
                            } else {
                              alert('Format file JSON tidak sesuai atau rusak.');
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-6 w-full py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4 text-[#0b3c26]" />
                      <span>Pilih File Backup JSON</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone: Reset to Factory Defaults */}
              <div className="border border-red-200 bg-red-50/50 rounded-2xl p-6 mt-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-heading text-sm font-bold text-red-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>Atur Ulang ke Data Awal (Reset Default)</span>
                    </h4>
                    <p className="text-xs text-red-800/80 mt-1">
                      Menghapus seluruh perubahan yang disimpan di browser dan mengembalikan seluruh data website ke nilai bawaan awal.
                    </p>
                  </div>

                  <button
                    onClick={resetToDefaultData}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                  >
                    Reset ke Data Bawaan
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
