import React, { useState, useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
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
  BarChart2,
  Globe,
  Cloud,
  Server,
  Wifi,
  LogOut,
  User as UserIcon,
  Check,
  Copy,
  Edit3,
  Award,
  Sliders,
  ZoomIn,
  MoveVertical,
  UserCheck,
  FileSpreadsheet,
  Clock,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  Layers,
  Video,
  PlayCircle,
  Film,
  Smartphone,
  Tv,
  Square,
  History,
  RotateCcw
} from 'lucide-react';
import { parseVideoUrl, isPortraitVideoUrl, getVideoAspectConfig, detectVideoAspectRatio } from '../lib/videoUtils';
import { compressImage } from '../lib/imageCompressor';
import {
  toDateInputValue,
  formatDisplayDate,
  getDaysAgoDate,
  parseDateTimestamp
} from '../lib/dateUtils';
import {
  SUPABASE_SQL_SCRIPT,
  SUPABASE_URL,
  SUPABASE_PROJECT_REF,
  SUPABASE_SQL_EDITOR_URL,
  checkSupabaseStatus,
  SupabaseHealthResult
} from '../lib/supabase';
import {
  SchoolProfile,
  ProgramItem,
  ExtracurricularItem,
  AchievementItem,
  NewsArticle,
  FacilityItem,
  GalleryItem,
  VideoGalleryItem,
  VideoAspectRatio,
  TestimonialItem,
  FAQItem,
  PPDBRegistration,
  StaffMember,
  StatItem,
  StudentItem,
  HeroSlide
} from '../types';
import { StudentManagement } from './StudentManagement';
import { StaffCsvImportModal } from './StaffCsvImportModal';
import { FormattedTextEditor } from '../components/FormattedTextEditor';
import {
  generateCSV,
  downloadCSV,
  STAFF_CSV_HEADERS
} from '../lib/csvHelper';

type AdminTab =
  | 'overview'
  | 'hero_stats'
  | 'profile'
  | 'staff'
  | 'students'
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
    setStatsList,
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
    updateGalleryItem,
    deleteGalleryItem,
    videoGallery,
    addVideoItem,
    updateVideoItem,
    deleteVideoItem,
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
    logoutAdmin,
    cloudSyncStatus,
    lastSyncedAt,
    refreshFromCloud,
    pushAllToCloud,
    syncToSupabase,
    pullFromSupabase,
    resetToDefaultData,
    exportBackupJSON,
    importBackupJSON,
    studentList,
    addStudent,
    updateStudent,
    deleteStudent,
    addStudentsBatch,
    addStaffBatch
  } = useDataContext();

  const { user, authUser, signInWithGoogle, signOut, getToken } = useAuth();
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isStaffCsvModalOpen, setIsStaffCsvModalOpen] = useState(false);

  const handleExportStaffCSV = () => {
    if (staffList.length === 0) {
      alert('Belum ada data GTK untuk diekspor.');
      return;
    }
    const rows = staffList.map((s) => [
      s.name,
      s.role,
      s.category,
      s.nipOrNuptk || '',
      s.education || '',
      s.subjects || '',
      s.phone || '',
      s.photoUrl || '',
      s.status || 'Aktif Mengajar',
      String(s.order || 99),
    ]);
    const csvContent = generateCSV(STAFF_CSV_HEADERS, rows);
    downloadCSV(`data_gtk_mi_al_ihsan_${new Date().toISOString().split('T')[0]}.csv`, csvContent);
    notify(`${staffList.length} data GTK berhasil diekspor ke file CSV!`);
  };

  const notify = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleManualSyncCloud = async () => {
    try {
      setIsSyncingCloud(true);
      const token = await getToken();
      const ok = await pushAllToCloud(token);
      if (ok) {
        notify('Semua data berhasil disinkronkan ke Google Cloud SQL Database!');
      } else {
        notify('Sinkronisasi selesai (data tersimpan di database).');
      }
    } catch (e) {
      notify('Gagal menyinkronkan data ke Cloud SQL.');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const handleRefreshFromCloud = async () => {
    try {
      setIsSyncingCloud(true);
      await refreshFromCloud();
      notify('Data terbaru berhasil dimuat dari Google Cloud SQL!');
    } catch (e) {
      notify('Gagal memuat data dari Cloud SQL.');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  // Profile Form state
  const [profileForm, setProfileForm] = useState<SchoolProfile>(schoolProfile);

  useEffect(() => {
    setProfileForm(schoolProfile);
  }, [schoolProfile]);

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

  // Achievement Form state
  const [isAddingAch, setIsAddingAch] = useState(false);
  const [editingAch, setEditingAch] = useState<AchievementItem | null>(null);
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

  // Program Form state
  const [isAddingProgram, setIsAddingProgram] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null);
  const [programForm, setProgramForm] = useState({
    title: '',
    category: 'Program Utama',
    iconName: 'BookOpen',
    shortDesc: '',
    fullDesc: '',
    target: 'Seluruh Santri',
    schedule: 'Setiap Hari'
  });

  // Ekstrakurikuler Form state
  const [isAddingEkskul, setIsAddingEkskul] = useState(false);
  const [editingEkskul, setEditingEkskul] = useState<ExtracurricularItem | null>(null);
  const [ekskulForm, setEkskulForm] = useState({
    name: '',
    category: 'Seni & Olahraga',
    description: '',
    coach: 'Pembina Ekstrakurikuler',
    schedule: 'Sabtu Pagi',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80'
  });

  // Gallery Form state
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'Kegiatan Belajar' as GalleryItem['category'],
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    description: '',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  });

  // Video Gallery Form state
  const [videoGalleryTab, setVideoGalleryTab] = useState<'video' | 'foto' | 'fasilitas'>('video');
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoGalleryItem | null>(null);
  const [previewingVideo, setPreviewingVideo] = useState<VideoGalleryItem | null>(null);
  const [adminPreviewAspect, setAdminPreviewAspect] = useState<VideoAspectRatio>('auto');
  const [videoForm, setVideoForm] = useState<{
    title: string;
    category: string;
    videoUrl: string;
    thumbnailUrl: string;
    description: string;
    duration: string;
    author: string;
    date: string;
    featured: boolean;
    aspectRatio: VideoAspectRatio;
  }>({
    title: '',
    category: 'Profil Madrasah',
    videoUrl: '',
    thumbnailUrl: '',
    description: '',
    duration: '',
    author: "Tim Media MI Ma'arif Al Ihsan",
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    featured: false,
    aspectRatio: 'auto',
  });

  // Facility Form state
  const [isAddingFacility, setIsAddingFacility] = useState(false);
  const [editingFacility, setEditingFacility] = useState<FacilityItem | null>(null);
  const [facilityForm, setFacilityForm] = useState({
    name: '',
    category: 'Fasilitas Belajar',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    specificationsString: 'Ruang Representatif, Pencahayaan Nyaman, Terawat Bersih'
  });

  // Testimonial Form state
  const [isAddingTesti, setIsAddingTesti] = useState(false);
  const [editingTesti, setEditingTesti] = useState<TestimonialItem | null>(null);
  const [testiForm, setTestiForm] = useState({
    name: '',
    role: 'Wali Santri',
    childName: '',
    childGrade: 'Kelas 3',
    quote: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  });

  // FAQ Form state
  const [isAddingFAQ, setIsAddingFAQ] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);
  const [faqForm, setFaqForm] = useState({
    category: 'Pendaftaran PPDB',
    question: '',
    answer: ''
  });

  // Supabase State
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [isCheckingSupabase, setIsCheckingSupabase] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlViewer, setShowSqlViewer] = useState(false);
  const [supabaseHealth, setSupabaseHealth] = useState<SupabaseHealthResult | null>(null);

  // GTK (Staff) Form state
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [staffFilterCategory, setStaffFilterCategory] = useState<string>('Semua');
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: '',
    category: 'Guru Kelas' as StaffMember['category'],
    institution: 'MI' as 'MI' | 'RA' | 'Satu Atap',
    education: 'S.Pd.',
    nipOrNuptk: '-',
    subjects: '',
    phone: '',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    status: 'Aktif Mengajar',
    order: 10,
    bio: '',
    quote: '',
    serviceYears: '',
    expertise: '',
  });

  // Backup file ref
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Hero Section Form state with Slider & Duration
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
        ],
    sliderDuration: schoolProfile.heroSliderDuration || 5,
    sliderAutoPlay: schoolProfile.heroSliderAutoPlay ?? true,
    slides: (schoolProfile.heroSlides && schoolProfile.heroSlides.length > 0)
      ? schoolProfile.heroSlides.map((s) => ({ ...s }))
      : [
          {
            id: 'slide-1',
            badge: schoolProfile.heroBadge || "LP Ma'arif NU Temanggung • Soborejo, Pringsurat",
            title: schoolProfile.heroTitle || schoolProfile.tagline || 'Mencetak Peserta Didik yang Religius, Berakhlaqul Karimah, Cerdas, dan Berprestasi',
            subtitle: schoolProfile.heroSubtitle || `Selamat datang di website resmi ${schoolProfile.name}, Kecamatan Pringsurat, Kabupaten Temanggung. Berkomitmen menyelenggarakan pendidikan dasar Islam yang bermakna dan berkarakter.`,
            bannerUrl: schoolProfile.heroBannerUrl || 'https://images.unsplash.com/photo-1584697964190-7bb8c5a2cbb5?q=80&w=1920&auto=format&fit=crop'
          }
        ]
  });

  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);

  // Sync state if schoolProfile updates from cloud
  useEffect(() => {
    if (schoolProfile) {
      setHeroForm((prev) => ({
        ...prev,
        heroTitle: schoolProfile.heroTitle || prev.heroTitle,
        heroSubtitle: schoolProfile.heroSubtitle || prev.heroSubtitle,
        heroBadge: schoolProfile.heroBadge || prev.heroBadge,
        heroBannerUrl: schoolProfile.heroBannerUrl || prev.heroBannerUrl,
        highlights: schoolProfile.heroHighlights && schoolProfile.heroHighlights.length > 0
          ? [...schoolProfile.heroHighlights]
          : prev.highlights,
        sliderDuration: schoolProfile.heroSliderDuration || prev.sliderDuration || 5,
        sliderAutoPlay: schoolProfile.heroSliderAutoPlay ?? prev.sliderAutoPlay ?? true,
        slides: (schoolProfile.heroSlides && schoolProfile.heroSlides.length > 0)
          ? schoolProfile.heroSlides.map((s) => ({ ...s }))
          : prev.slides
      }));
    }
  }, [schoolProfile]);

  const handleAddSlide = () => {
    const newId = `slide-${Date.now()}`;
    const newSlide: HeroSlide = {
      id: newId,
      badge: "Program & Prestasi Madrasah",
      title: "Judul Slide Teks Baru Beranda",
      subtitle: "Tuliskan informasi penting, keunggulan pendidikan, atau warta sambutan madrasah di sini.",
      photoUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop",
      photoCaption: "Dokumentasi Pembelajaran & Prestasi Siswa",
      bannerUrl: heroForm.heroBannerUrl
    };
    setHeroForm((prev) => ({
      ...prev,
      slides: [...prev.slides, newSlide]
    }));
    setPreviewSlideIdx(heroForm.slides.length);
    notify('Slide teks & foto baru berhasil ditambahkan! Silakan atur judul, foto, dan penjelasnya.');
  };

  const handleRemoveSlide = (slideId: string) => {
    if (heroForm.slides.length <= 1) {
      notify('Minimal harus ada 1 slide teks di beranda!');
      return;
    }
    setHeroForm((prev) => {
      const nextSlides = prev.slides.filter((s) => s.id !== slideId);
      return { ...prev, slides: nextSlides };
    });
    setPreviewSlideIdx((prev) => Math.max(0, prev - 1));
    notify('Slide teks berhasil dihapus.');
  };

  const handleMoveSlide = (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= heroForm.slides.length) return;
    setHeroForm((prev) => {
      const updated = [...prev.slides];
      const temp = updated[idx];
      updated[idx] = updated[targetIdx];
      updated[targetIdx] = temp;
      return { ...prev, slides: updated };
    });
    setPreviewSlideIdx(targetIdx);
  };

  const handleUpdateSlideField = (slideId: string, field: keyof HeroSlide, val: string) => {
    setHeroForm((prev) => ({
      ...prev,
      slides: prev.slides.map((s) => (s.id === slideId ? { ...s, [field]: val } : s))
    }));
  };

  const handleSlidePhotoUpload = async (slideId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 1200, 900, 0.85);
        handleUpdateSlideField(slideId, 'photoUrl', compressed);
        notify('Foto slide berhasil diunggah!');
      } catch (err) {
        console.error('Gagal mengompres foto slide:', err);
        notify('Gagal memproses unggah foto slide');
      }
    }
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroForm.slides.length === 0) {
      notify('Minimal harus ada 1 slide teks beranda!');
      return;
    }
    const firstSlide = heroForm.slides[0];
    updateSchoolProfile({
      heroTitle: firstSlide?.title || heroForm.heroTitle,
      heroSubtitle: firstSlide?.subtitle || heroForm.heroSubtitle,
      heroBadge: firstSlide?.badge || heroForm.heroBadge,
      heroBannerUrl: heroForm.heroBannerUrl,
      heroHighlights: heroForm.highlights,
      tagline: firstSlide?.title || heroForm.heroTitle,
      heroSlides: heroForm.slides,
      heroSliderDuration: Math.max(2, Math.min(30, Number(heroForm.sliderDuration) || 5)),
      heroSliderAutoPlay: heroForm.sliderAutoPlay
    });
    notify('Slider teks Beranda dan pengaturan durasi berhasil disimpan!');
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
    const examples: StatItem[] = [
      {
        id: 'stat-active-students',
        value: '150',
        suffix: '+',
        label: 'Peserta Didik Aktif',
        detail: 'Santri putra dan putri terdaftar resmi di EMIS Kemenag TP 2024/2025'
      },
      {
        id: 'stat-teachers-staff',
        value: '12',
        suffix: 'GTK',
        label: 'Guru & Tenaga Kependidikan',
        detail: 'Pendidik sarjana kualifikasi linier dan kompeten di bidangnya'
      },
      {
        id: 'stat-study-groups',
        value: '6',
        suffix: 'Rombel',
        label: 'Rombongan Belajar',
        detail: 'Kelas 1 hingga Kelas 6 dengan ruang kelas representative'
      },
      {
        id: 'stat-graduation-rate',
        value: '100',
        suffix: '%',
        label: 'Tingkat Kelulusan',
        detail: 'Alumni melanjutkan ke MTs/SMP favorit dan pondok pesantren'
      }
    ];
    setStatsList(examples);
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
    const cleanHistory = (profileForm.history || []).map((h) => h.trim()).filter(Boolean);
    const payload = {
      ...profileForm,
      history: cleanHistory.length > 0 ? cleanHistory : profileForm.history,
    };
    updateSchoolProfile(payload);
    notify('Data profil, identitas, dan teks sejarah singkat madrasah berhasil diperbarui!');
  };

  // Staff (GTK) Save
  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...staffForm,
      expertise: staffForm.expertise
        ? staffForm.expertise.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    };
    if (editingStaff) {
      updateStaff(editingStaff.id, payload);
      notify(`Data ${staffForm.name} berhasil diperbarui!`);
      setEditingStaff(null);
    } else {
      addStaff(payload);
      notify(`Anggota GTK baru "${staffForm.name}" berhasil ditambahkan!`);
      setIsAddingStaff(false);
    }
    setStaffForm({
      name: '',
      role: '',
      category: 'Guru Kelas',
      institution: 'MI',
      education: 'S.Pd.',
      nipOrNuptk: '-',
      subjects: '',
      phone: '',
      photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      status: 'Aktif Mengajar',
      order: 10,
      bio: '',
      quote: '',
      serviceYears: '',
      expertise: '',
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
      institution: (staff.institution as any) || 'MI',
      education: staff.education || '',
      nipOrNuptk: staff.nipOrNuptk || '-',
      subjects: staff.subjects || '',
      phone: staff.phone || '',
      photoUrl: staff.photoUrl || '',
      status: staff.status || 'Aktif Mengajar',
      order: staff.order || 10,
      bio: staff.bio || '',
      quote: staff.quote || '',
      serviceYears: staff.serviceYears || '',
      expertise: (staff.expertise || []).join(', '),
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

    const finalDate = toDateInputValue(newsForm.date);

    if (editingNews) {
      updateNews(editingNews.id, {
        title: newsForm.title,
        category: newsForm.category,
        summary: newsForm.summary,
        content: contentParagraphs.length > 0 ? contentParagraphs : [newsForm.summary],
        author: newsForm.author,
        readTime: newsForm.readTime,
        imageUrl: newsForm.imageUrl,
        date: finalDate
      });
      if (newsForm.category === 'Prestasi') {
        notify('Berita berhasil diperbarui & disinkronkan ke Galeri serta Prestasi!');
      } else {
        notify('Berita berhasil diperbarui & foto otomatis tersimpan ke Galeri!');
      }
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
        date: finalDate
      });
      if (newsForm.category === 'Prestasi') {
        notify('Berita baru terbit! Foto otomatis masuk ke Galeri dan warta terdaftar di Prestasi.');
      } else {
        notify('Berita baru terbit! Foto berita otomatis tersimpan di Galeri.');
      }
      setIsAddingNews(false);
    }

    setNewsForm({
      title: '',
      category: 'Berita Madrasah',
      summary: '',
      contentString: '',
      author: 'Admin Madrasah',
      readTime: '3 Menit',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      date: new Date().toISOString().split('T')[0]
    });
  };

  // Headmaster Photo Upload with Compression
  const handleHeadmasterPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 1000, 1200, 0.85);
        setProfileForm((prev) => ({ ...prev, headmasterPhotoUrl: compressed }));
      } catch (err) {
        console.error('Gagal mengompres foto kepala madrasah:', err);
      }
    }
  };

  // Logo Upload with SVG and Image Support
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        if (file.type.includes('svg') || file.name.endsWith('.svg')) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            setProfileForm((prev) => ({ ...prev, logoUrl: ev.target?.result as string }));
          };
          reader.readAsDataURL(file);
        } else {
          const compressed = await compressImage(file, 600, 600, 0.9);
          setProfileForm((prev) => ({ ...prev, logoUrl: compressed }));
        }
      } catch (err) {
        console.error('Gagal memproses unggah logo:', err);
      }
    }
  };

  // Favicon Upload with SVG, ICO, and Image Support
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        if (
          file.type.includes('svg') ||
          file.name.endsWith('.svg') ||
          file.name.endsWith('.ico') ||
          file.type.includes('x-icon')
        ) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            setProfileForm((prev) => ({ ...prev, faviconUrl: ev.target?.result as string }));
          };
          reader.readAsDataURL(file);
        } else {
          // Compress to optimal icon resolution
          const compressed = await compressImage(file, 160, 160, 0.95);
          setProfileForm((prev) => ({ ...prev, faviconUrl: compressed }));
        }
      } catch (err) {
        console.error('Gagal memproses unggah favicon:', err);
      }
    }
  };

  // Staff (GTK) Photo Upload with Compression
  const handleStaffPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 800, 1000, 0.85);
        setStaffForm((prev) => ({ ...prev, photoUrl: compressed }));
      } catch (err) {
        console.error('Gagal mengompres foto GTK:', err);
      }
    }
  };

  // Achievement Handlers
  const handleAchFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setAchForm((prev) => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditAchievement = (ach: AchievementItem) => {
    setEditingAch(ach);
    setAchForm({
      title: ach.title,
      winner: ach.winner,
      category: ach.category,
      level: ach.level,
      year: ach.year,
      rank: ach.rank,
      description: ach.description || '',
      imageUrl: ach.imageUrl || 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80'
    });
  };

  const handleSaveAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAch) {
      updateAchievement(editingAch.id, achForm);
      notify('Data prestasi santri berhasil diperbarui!');
      setEditingAch(null);
    } else {
      addAchievement(achForm);
      notify('Data prestasi santri baru berhasil ditambahkan!');
      setIsAddingAch(false);
    }
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

  // Program Handlers
  const handleEditProgram = (prog: ProgramItem) => {
    setEditingProgram(prog);
    setProgramForm({
      title: prog.title,
      category: prog.category || 'Program Utama',
      iconName: prog.iconName || 'BookOpen',
      shortDesc: prog.shortDesc || '',
      fullDesc: prog.fullDesc || prog.shortDesc || '',
      target: prog.target || 'Seluruh Santri',
      schedule: prog.schedule || 'Setiap Hari'
    });
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProgram) {
      updateProgram(editingProgram.id, programForm);
      notify(`Program "${programForm.title}" berhasil diperbarui!`);
      setEditingProgram(null);
    } else {
      addProgram(programForm);
      notify(`Program "${programForm.title}" berhasil ditambahkan!`);
      setIsAddingProgram(false);
    }
    setProgramForm({
      title: '',
      category: 'Program Utama',
      iconName: 'BookOpen',
      shortDesc: '',
      fullDesc: '',
      target: 'Seluruh Santri',
      schedule: 'Setiap Hari'
    });
  };

  // Ekstrakurikuler Handlers
  const handleEkskulFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setEkskulForm((prev) => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditEkskul = (ekskul: ExtracurricularItem) => {
    setEditingEkskul(ekskul);
    setEkskulForm({
      name: ekskul.name,
      category: ekskul.category || 'Seni & Olahraga',
      description: ekskul.description || '',
      coach: ekskul.coach || 'Pembina Ekstrakurikuler',
      schedule: ekskul.schedule || 'Sabtu Pagi',
      imageUrl: ekskul.imageUrl || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80'
    });
  };

  const handleSaveEkskul = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEkskul) {
      updateExtracurricular(editingEkskul.id, ekskulForm);
      notify(`Ekstrakurikuler "${ekskulForm.name}" berhasil diperbarui!`);
      setEditingEkskul(null);
    } else {
      addExtracurricular(ekskulForm);
      notify(`Ekstrakurikuler "${ekskulForm.name}" berhasil ditambahkan!`);
      setIsAddingEkskul(false);
    }
    setEkskulForm({
      name: '',
      category: 'Seni & Olahraga',
      description: '',
      coach: 'Pembina Ekstrakurikuler',
      schedule: 'Sabtu Pagi',
      imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80'
    });
  };

  // Gallery Handlers
  const handleGalleryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setGalleryForm((prev) => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditGallery = (item: GalleryItem) => {
    setEditingGallery(item);
    setGalleryForm({
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      description: item.description || '',
      date: item.date || new Date().toLocaleDateString('id-ID')
    });
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGallery) {
      updateGalleryItem(editingGallery.id, galleryForm);
      notify('Foto galeri berhasil diperbarui!');
      setEditingGallery(null);
    } else {
      addGalleryItem(galleryForm);
      notify('Foto kegiatan santri berhasil ditambahkan ke galeri!');
      setIsAddingGallery(false);
    }
    setGalleryForm({
      title: '',
      category: 'Kegiatan Belajar',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      description: '',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    });
  };

  // Video Gallery Handlers
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title.trim()) {
      notify('Judul video wajib diisi!');
      return;
    }
    if (!videoForm.videoUrl.trim()) {
      notify('Tautan / URL video (YouTube, Facebook, atau file video) wajib diisi!');
      return;
    }

    const parsed = parseVideoUrl(videoForm.videoUrl, videoForm.thumbnailUrl, videoForm.aspectRatio, videoForm.title, videoForm.description);
    const finalThumbnail = videoForm.thumbnailUrl.trim() || parsed.thumbnailUrl;

    const autoAspect = detectVideoAspectRatio(videoForm.videoUrl, videoForm.aspectRatio, videoForm.title, videoForm.description);
    const effectiveAspect: VideoAspectRatio =
      videoForm.aspectRatio === 'auto'
        ? autoAspect
        : (videoForm.aspectRatio || autoAspect);

    const payload: Omit<VideoGalleryItem, 'id'> = {
      title: videoForm.title.trim(),
      category: videoForm.category,
      videoUrl: videoForm.videoUrl.trim(),
      thumbnailUrl: finalThumbnail,
      description: videoForm.description.trim(),
      duration: videoForm.duration.trim(),
      author: videoForm.author.trim() || "MI Ma'arif Al Ihsan Soborejo",
      date: videoForm.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      featured: videoForm.featured,
      aspectRatio: effectiveAspect
    };

    if (editingVideo) {
      updateVideoItem(editingVideo.id, payload);
      notify(`Video "${videoForm.title}" berhasil diperbarui!`);
      setEditingVideo(null);
    } else {
      addVideoItem(payload);
      notify(`Video "${videoForm.title}" berhasil ditambahkan ke galeri!`);
      setIsAddingVideo(false);
    }

    setVideoForm({
      title: '',
      category: 'Profil Madrasah',
      videoUrl: '',
      thumbnailUrl: '',
      description: '',
      duration: '',
      author: "Tim Media MI Ma'arif Al Ihsan",
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      featured: false,
      aspectRatio: 'auto'
    });
  };

  const handleEditVideo = (item: VideoGalleryItem) => {
    setEditingVideo(item);
    setVideoForm({
      title: item.title,
      category: item.category,
      videoUrl: item.videoUrl,
      thumbnailUrl: item.thumbnailUrl || '',
      description: item.description || '',
      duration: item.duration || '',
      author: item.author || "Tim Media MI Ma'arif Al Ihsan",
      date: item.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      featured: item.featured || false,
      aspectRatio: item.aspectRatio || detectVideoAspectRatio(item.videoUrl, item.aspectRatio, item.title, item.description)
    });
    setIsAddingVideo(true);
  };

  const handleDeleteVideo = (id: string, title: string) => {
    if (window.confirm(`Hapus video "${title}" dari galeri video madrasah?`)) {
      deleteVideoItem(id);
      notify('Video berhasil dihapus dari galeri.');
    }
  };

  const handleVideoThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setVideoForm((prev) => ({ ...prev, thumbnailUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Facility Handlers
  const handleFacilityFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setFacilityForm((prev) => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditFacility = (fac: FacilityItem) => {
    setEditingFacility(fac);
    setFacilityForm({
      name: fac.name,
      category: fac.category,
      description: fac.description || '',
      imageUrl: fac.imageUrl,
      specificationsString: (fac.specifications || []).join(', ')
    });
  };

  const handleSaveFacility = (e: React.FormEvent) => {
    e.preventDefault();
    const specs = facilityForm.specificationsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const itemData = {
      name: facilityForm.name,
      category: facilityForm.category,
      description: facilityForm.description,
      imageUrl: facilityForm.imageUrl,
      specifications: specs.length > 0 ? specs : ['Terawat & Bersih']
    };

    if (editingFacility) {
      updateFacility(editingFacility.id, itemData);
      notify(`Fasilitas "${facilityForm.name}" berhasil diperbarui!`);
      setEditingFacility(null);
    } else {
      addFacility(itemData);
      notify(`Fasilitas "${facilityForm.name}" berhasil ditambahkan!`);
      setIsAddingFacility(false);
    }
    setFacilityForm({
      name: '',
      category: 'Fasilitas Belajar',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
      specificationsString: 'Ruang Representatif, Pencahayaan Nyaman, Terawat Bersih'
    });
  };

  // Testimonial Handlers
  const handleEditTesti = (testi: TestimonialItem) => {
    setEditingTesti(testi);
    setTestiForm({
      name: testi.name,
      role: testi.role,
      childName: testi.childName,
      childGrade: testi.childGrade || 'Kelas 3',
      quote: testi.quote,
      avatarUrl: testi.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
  };

  const handleSaveTesti = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTesti) {
      updateTestimonial(editingTesti.id, testiForm);
      notify(`Testimoni dari "${testiForm.name}" berhasil diperbarui!`);
      setEditingTesti(null);
    } else {
      addTestimonial(testiForm);
      notify(`Testimoni baru dari "${testiForm.name}" berhasil ditambahkan!`);
      setIsAddingTesti(false);
    }
    setTestiForm({
      name: '',
      role: 'Wali Santri',
      childName: '',
      childGrade: 'Kelas 3',
      quote: '',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
  };

  // FAQ Handlers
  const handleEditFAQ = (faq: FAQItem) => {
    setEditingFAQ(faq);
    setFaqForm({
      category: faq.category,
      question: faq.question,
      answer: faq.answer
    });
  };

  const handleSaveFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFAQ) {
      updateFAQ(editingFAQ.id, faqForm);
      notify('Tanya jawab berhasil diperbarui!');
      setEditingFAQ(null);
    } else {
      addFAQ(faqForm);
      notify('Pertanyaan baru berhasil ditambahkan!');
      setIsAddingFAQ(false);
    }
    setFaqForm({
      category: 'Pendaftaran PPDB',
      question: '',
      answer: ''
    });
  };

  // Supabase Database Handlers
  const handleCheckSupabaseStatus = async () => {
    setIsCheckingSupabase(true);
    try {
      const health = await checkSupabaseStatus();
      setSupabaseHealth(health);
      if (health.hasTables) {
        notify('Koneksi berhasil! Tabel Supabase terdeteksi dan aktif.');
      } else {
        notify('Koneksi ke Supabase aktif, namun tabel belum dibuat. Silakan jalankan Skrip SQL di SQL Editor Supabase.');
      }
    } catch (e: any) {
      notify(`Gagal memeriksa status Supabase: ${e?.message || 'Error'}`);
    } finally {
      setIsCheckingSupabase(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'backup') {
      checkSupabaseStatus().then((h) => setSupabaseHealth(h)).catch(() => {});
    }
  }, [activeTab]);

  const handleSyncToSupabase = async () => {
    setIsSyncingSupabase(true);
    try {
      const res = await syncToSupabase();
      if (res.success) {
        notify('Berhasil disinkronkan ke Supabase!');
        checkSupabaseStatus().then((h) => setSupabaseHealth(h)).catch(() => {});
      } else {
        notify(`Supabase: ${res.message}`);
      }
    } catch (e: any) {
      notify(`Gagal simpan ke Supabase: ${e?.message || 'Error'}`);
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  const handlePullFromSupabase = async () => {
    setIsSyncingSupabase(true);
    try {
      const ok = await pullFromSupabase();
      if (ok) {
        notify('Data website berhasil dimuat dari Supabase!');
        checkSupabaseStatus().then((h) => setSupabaseHealth(h)).catch(() => {});
      } else {
        notify('Belum ada data di Supabase atau tabel belum dibuat.');
      }
    } catch (e) {
      notify('Gagal memuat data dari Supabase.');
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  const handleCopySqlScript = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
      setCopiedSql(true);
      notify('Skrip SQL Supabase (13 Tabel + RLS + Data Awal) berhasil disalin ke clipboard!');
      setTimeout(() => setCopiedSql(false), 3000);
    }
  };

  const handleDownloadSqlFile = () => {
    const blob = new Blob([SUPABASE_SQL_SCRIPT], { type: 'application/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supabase_schema_mi_alihsan_${new Date().toISOString().split('T')[0]}.sql`;
    a.click();
    URL.revokeObjectURL(url);
    notify('File SQL skema Supabase berhasil diunduh!');
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
      <header className="bg-gradient-to-r from-[#072217] via-[#0b3c26] to-[#041a11] text-white py-4 px-4 sm:px-8 border-b border-[#d4af37]/40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#d4af37] text-[#072217] flex items-center justify-center font-bold text-lg shadow-md border border-white/20 shrink-0">
              MI
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-lg sm:text-xl font-bold text-[#f3e5ab]">
                  Panel Pengelola Konten (CMS)
                </h1>
                <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Cloud SQL Online</span>
                </div>
              </div>
              <p className="text-xs text-white/70">
                MI Ma'arif Al Ihsan Soborejo • Database Cloud Aktif (Dapat Diakses Dari Komputer Manapun)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
            {/* Sync to Cloud Button */}
            <button
              onClick={handleManualSyncCloud}
              disabled={isSyncingCloud}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800/60 hover:bg-emerald-700/80 text-white text-xs font-semibold rounded-xl border border-emerald-500/40 transition-all shadow-sm disabled:opacity-50"
              title="Sinkronkan seluruh perubahan ke Google Cloud SQL"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#d4af37] ${isSyncingCloud ? 'animate-spin' : ''}`} />
              <span>{isSyncingCloud ? 'Menyinkronkan...' : 'Sinkron ke Cloud'}</span>
            </button>

            {/* View Public Website */}
            <button
              onClick={() => setViewMode('public')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#d4af37] to-[#b89228] text-[#072217] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:brightness-105 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Lihat Web</span>
            </button>

            {/* Backup JSON */}
            <button
              onClick={exportBackupJSON}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-[#f3e5ab] text-xs font-semibold rounded-xl border border-white/15 transition-all"
              title="Unduh file backup seluruh konten"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup</span>
            </button>

            {/* User Account / Logout */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/20">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'Admin'} className="w-7 h-7 rounded-full border border-[#d4af37]" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#d4af37] text-[#072217] flex items-center justify-center font-bold text-xs">
                    {(user.displayName || user.email || 'A').charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  onClick={() => {
                    signOut();
                    logoutAdmin();
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 rounded-lg text-xs transition-colors"
                  title="Keluar dari akun pengelola"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <button
                onClick={logoutAdmin}
                className="flex items-center gap-1 px-2.5 py-2 bg-white/10 hover:bg-red-500/30 hover:border-red-400 text-white/80 hover:text-white rounded-xl text-xs border border-white/15 transition-all"
                title="Tutup sesi pengelola"
              >
                <LogOut className="w-3 h-3" />
                <span>Keluar</span>
              </button>
            )}
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
              { id: 'hero_stats', label: 'Slider Beranda (Teks & Foto)', icon: Sparkles, badge: (heroForm.slides || []).length },
              { id: 'profile', label: 'Profil & Identitas', icon: Building },
              { id: 'staff', label: 'Manajemen GTK (Guru)', icon: GraduationCap, badge: staffList.length },
              { id: 'students', label: 'Data Siswa (Santri)', icon: UserCheck, badge: studentList.length },
              { id: 'ppdb', label: 'Pendaftar PPDB Online', icon: Users, badge: ppdbRegistrations.length },
              { id: 'news', label: 'Berita & Pengumuman', icon: Newspaper, badge: newsList.length },
              { id: 'programs', label: 'Program Unggulan', icon: BookOpen },
              { id: 'extracurriculars', label: 'Ekstrakurikuler', icon: Trophy },
              { id: 'achievements', label: 'Prestasi Santri', icon: Trophy },
              { id: 'facilities', label: 'Galeri Video, Foto & Fasilitas', icon: Video, badge: (videoGallery?.length || 0) + gallery.length },
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
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Cloud SQL Online Aktif</span>
            </div>
            <div className="text-[10px] text-gray-500 leading-snug">
              PostgreSQL • Region us-west1<br />
              Dapat diakses & dikelola dari komputer manapun.
            </div>
            {lastSyncedAt && (
              <div className="text-[9px] text-gray-400 mt-1">
                Sinkron terakhir: {lastSyncedAt} WIB
              </div>
            )}
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

              {/* CLOUD SQL ONLINE DATABASE STATUS CARD */}
              <div className="bg-gradient-to-br from-[#072217] to-[#0d3b27] text-white rounded-2xl p-5 sm:p-6 border border-[#d4af37]/40 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 -ml-4.5"></div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#d4af37] bg-white/10 px-2.5 py-0.5 rounded-full">
                        DATABASE ONLINE TERHUBUNG (CLOUD SQL)
                      </span>
                    </div>

                    <h3 className="font-heading text-lg sm:text-xl font-bold text-[#f3e5ab]">
                      Sistem Database Online Cloud SQL PostgreSQL Aktif
                    </h3>

                    <p className="text-xs text-white/80 max-w-2xl leading-relaxed">
                      Seluruh data (Pendaftar PPDB Online, Guru/GTK, Berita & Warta, Identitas Madrasah, dan Statistik) tersimpan di Cloud Database terpusat. Setiap perubahan yang Anda buat atau pendaftaran santri baru yang masuk akan langsung tersinkron dan dapat diakses dari <strong>komputer, laptop, maupun ponsel manapun</strong> secara real-time.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#f3e5ab]/90">
                      <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                        <Server className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Host: Cloud SQL (us-west1)</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                        <Database className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Engine: PostgreSQL + Drizzle ORM</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                        <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Akses: Publik & Admin Multi-Device</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
                    <button
                      onClick={handleManualSyncCloud}
                      disabled={isSyncingCloud}
                      className="px-4 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#b89228] hover:brightness-110 text-[#072217] text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                      <span>{isSyncingCloud ? 'Menyinkronkan...' : 'Sinkronkan ke Cloud'}</span>
                    </button>

                    <button
                      onClick={handleRefreshFromCloud}
                      disabled={isSyncingCloud}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-[#f3e5ab] text-xs font-semibold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tarik Data Terbaru</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                <div
                  onClick={() => setActiveTab('students')}
                  className="p-4 rounded-xl bg-[#f8faf9] border border-gray-200 hover:border-[#0b3c26] cursor-pointer transition-colors"
                >
                  <div className="text-xs text-gray-500 font-medium">Data Siswa (Santri)</div>
                  <div className="font-heading text-2xl font-bold text-[#0b3c26] mt-1">
                    {studentList.length}
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
                    <span>
                      {studentList.filter((s) => s.status === 'Aktif').length} Santri Aktif
                    </span>
                  </div>
                </div>

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
                  onClick={() => {
                    setVideoGalleryTab('foto');
                    setActiveTab('facilities');
                  }}
                  className="p-4 rounded-xl bg-[#f8faf9] border border-gray-200 hover:border-[#0b3c26] cursor-pointer transition-colors"
                >
                  <div className="text-xs text-gray-500 font-medium">Foto Galeri</div>
                  <div className="font-heading text-2xl font-bold text-[#072217] mt-1">
                    {gallery.length}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">Dokumentasi Foto</div>
                </div>

                <div
                  onClick={() => {
                    setVideoGalleryTab('video');
                    setActiveTab('facilities');
                  }}
                  className="p-4 rounded-xl bg-[#f8faf9] border border-gray-200 hover:border-[#0b3c26] cursor-pointer transition-colors"
                >
                  <div className="text-xs text-gray-500 font-medium flex items-center justify-between">
                    <span>Galeri Video</span>
                    <Video className="w-3.5 h-3.5 text-[#0b3c26]" />
                  </div>
                  <div className="font-heading text-2xl font-bold text-[#0b3c26] mt-1">
                    {(videoGallery || []).length}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-1">YouTube & FB</div>
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

              {/* SECTION 1: HERO SLIDER & CMS */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0b3c26]/10 flex items-center justify-center text-[#0b3c26]">
                      <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-[#072217]">
                        1. Pengaturan Slider Teks & Visual Beranda
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Atur slide teks bergulir di bagian atas beranda, ganti isi teks, dan tentukan durasi perpindahan otomatis slide.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAddSlide}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0b3c26] text-[#f3e5ab] text-xs font-semibold hover:bg-[#072217] transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Slide Baru</span>
                    </button>
                  </div>
                </div>

                {/* Duration & Auto-play Configuration Card */}
                <div className="bg-gradient-to-r from-[#0b3c26]/5 via-amber-500/5 to-emerald-500/5 rounded-xl p-4 sm:p-5 border border-[#0b3c26]/15">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-[#072217] flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#d4af37]" />
                          <span>Durasi Tayang per Slide Teks</span>
                        </label>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0b3c26] text-[#f3e5ab]">
                          {heroForm.sliderDuration} Detik
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mb-3">
                        Lama waktu teks slide tampil di beranda sebelum berganti ke slide berikutnya secara otomatis.
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={2}
                          max={20}
                          step={1}
                          value={heroForm.sliderDuration}
                          onChange={(e) => setHeroForm({ ...heroForm, sliderDuration: Number(e.target.value) })}
                          className="w-full accent-[#0b3c26] cursor-pointer"
                        />
                        <input
                          type="number"
                          min={2}
                          max={30}
                          value={heroForm.sliderDuration}
                          onChange={(e) => setHeroForm({ ...heroForm, sliderDuration: Math.max(2, Math.min(30, Number(e.target.value) || 5)) })}
                          className="w-16 px-2 py-1 text-xs text-center font-bold border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                        />
                      </div>

                      {/* Quick Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        <span className="text-[10px] text-gray-500 font-medium mr-1">Preset Cepat:</span>
                        {[
                          { sec: 3, label: '3s (Cepat)' },
                          { sec: 5, label: '5s (Standar)' },
                          { sec: 7, label: '7s (Santai)' },
                          { sec: 10, label: '10s (Lambat)' }
                        ].map((preset) => (
                          <button
                            key={preset.sec}
                            type="button"
                            onClick={() => setHeroForm({ ...heroForm, sliderDuration: preset.sec })}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                              heroForm.sliderDuration === preset.sec
                                ? 'bg-[#0b3c26] text-white'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t md:border-t-0 md:border-l border-gray-200 md:pl-5 pt-3 md:pt-0 flex flex-col justify-center space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs font-bold text-gray-800 block">
                            Putar Otomatis Slider (Auto-play)
                          </label>
                          <span className="text-[11px] text-gray-500 block">
                            Slide akan bergulir sendiri tanpa harus diklik oleh pengunjung.
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={heroForm.sliderAutoPlay}
                            onChange={(e) => setHeroForm({ ...heroForm, sliderAutoPlay: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0b3c26]"></div>
                        </label>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white border border-gray-200 flex items-center justify-between text-xs text-gray-600">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Layers className="w-4 h-4 text-[#d4af37]" />
                          <span>Total Slide Aktif:</span>
                        </span>
                        <span className="font-bold text-[#0b3c26]">
                          {heroForm.slides.length} Slide
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Preview Box with Slide Switcher */}
                {heroForm.slides.length > 0 && (() => {
                  const safeIdx = Math.min(previewSlideIdx, heroForm.slides.length - 1);
                  const activeSlidePreview = heroForm.slides[safeIdx] || heroForm.slides[0];
                  const previewBg = activeSlidePreview?.bannerUrl || heroForm.heroBannerUrl;

                  return (
                    <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#063b25] via-[#042819] to-[#02180f] p-5 sm:p-7 text-white text-center border border-[#d4af37]/30 shadow-inner">
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay pointer-events-none transition-all duration-500"
                        style={{ backgroundImage: `url('${previewBg}')` }}
                      />
                      <div className="relative z-10 max-w-2xl mx-auto space-y-3">
                        {activeSlidePreview?.photoUrl ? (
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center text-left">
                            <div className="sm:col-span-7 space-y-2">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3e5ab]">
                                {activeSlidePreview?.badge || "LP Ma'arif NU Temanggung"}
                              </span>
                              <h4 className="font-heading text-base sm:text-lg font-bold leading-snug bg-gradient-to-b from-white to-[#f3e5ab] bg-clip-text text-transparent">
                                {activeSlidePreview?.title || "Judul Slide Teks Beranda"}
                              </h4>
                              <p className="text-[11px] text-white/80 line-clamp-3 leading-relaxed">
                                {activeSlidePreview?.subtitle || "Deskripsi penjelas teks slide beranda."}
                              </p>
                            </div>
                            <div className="sm:col-span-5">
                              <div className="rounded-xl overflow-hidden border border-[#d4af37]/50 shadow-md relative bg-black/40 aspect-[4/3]">
                                <img
                                  src={activeSlidePreview.photoUrl}
                                  alt="Preview Slide"
                                  className="w-full h-full object-cover"
                                />
                                {activeSlidePreview.photoCaption && (
                                  <div className="absolute bottom-0 inset-x-0 bg-black/75 p-1.5 text-[9px] text-white/90 line-clamp-1">
                                    {activeSlidePreview.photoCaption}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3e5ab]">
                              {activeSlidePreview?.badge || "LP Ma'arif NU Temanggung • Soborejo"}
                            </span>
                            <h4 className="font-heading text-lg sm:text-xl font-bold leading-snug bg-gradient-to-b from-white to-[#f3e5ab] bg-clip-text text-transparent">
                              {activeSlidePreview?.title || "Judul Slide Teks Beranda"}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-white/80 line-clamp-3 leading-relaxed">
                              {activeSlidePreview?.subtitle || "Deskripsi penjelas teks slide beranda."}
                            </p>
                          </div>
                        )}

                        {/* Slider Selector Pills in Preview */}
                        <div className="pt-2 flex items-center justify-center gap-2">
                          {heroForm.slides.map((_, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => setPreviewSlideIdx(sIdx)}
                              className={`h-2 rounded-full transition-all duration-300 ${
                                sIdx === safeIdx
                                  ? 'w-7 bg-[#d4af37]'
                                  : 'w-2 bg-white/40 hover:bg-white/70'
                              }`}
                              title={`Tinjau Slide #${sIdx + 1}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Header tags in preview */}
                      <div className="absolute top-2.5 left-3 flex items-center gap-2 text-[10px] text-[#f3e5ab] font-mono">
                        <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">
                          Slide {safeIdx + 1} / {heroForm.slides.length}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/40 hidden sm:inline">
                          Durasi: {heroForm.sliderDuration}d
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-3 text-[10px] text-[#f3e5ab]/80 uppercase tracking-wider font-mono">
                        Pratinjau Langsung
                      </div>
                    </div>
                  );
                })()}

                {/* Hero Form */}
                <form onSubmit={handleSaveHero} className="space-y-6 pt-2">
                  {/* SLIDES LIST MANAGEMENT */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-[#0b3c26]" />
                        <span>Daftar Slide Teks & Foto Beranda (Dapat Diedit & Ditukar Urutannya)</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddSlide}
                        className="text-xs font-semibold text-[#0b3c26] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Slide</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {heroForm.slides.map((slide, sIndex) => {
                        const isSelectedForPreview = sIndex === previewSlideIdx;
                        return (
                          <div
                            key={slide.id || sIndex}
                            className={`rounded-xl border transition-all duration-200 p-4 ${
                              isSelectedForPreview
                                ? 'border-[#0b3c26] bg-[#0b3c26]/[0.02] shadow-sm'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            {/* Slide Header Toolbar */}
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[#0b3c26] text-[#f3e5ab] text-xs font-bold flex items-center justify-center">
                                  {sIndex + 1}
                                </span>
                                <span className="text-xs font-bold text-[#072217]">
                                  Slide #{sIndex + 1}
                                </span>
                                {isSelectedForPreview && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#d4af37]/20 text-[#8c7017] border border-[#d4af37]/30">
                                    Sedang Ditinjau
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setPreviewSlideIdx(sIndex)}
                                  className="p-1.5 text-xs text-gray-600 hover:text-[#0b3c26] hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                                  title="Tampilkan di kotak pratinjau"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline text-[11px]">Tinjau</span>
                                </button>
                                
                                <button
                                  type="button"
                                  disabled={sIndex === 0}
                                  onClick={() => handleMoveSlide(sIndex, 'up')}
                                  className="p-1.5 text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Pindahkan ke atas"
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  disabled={sIndex === heroForm.slides.length - 1}
                                  onClick={() => handleMoveSlide(sIndex, 'down')}
                                  className="p-1.5 text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Pindahkan ke bawah"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  disabled={heroForm.slides.length <= 1}
                                  onClick={() => handleRemoveSlide(slide.id)}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                  title="Hapus slide ini"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Slide Fields */}
                            <div className="space-y-3.5 text-left">
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                  Judul Utama Slide (Headline) <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={slide.title}
                                  onChange={(e) => handleUpdateSlideField(slide.id, 'title', e.target.value)}
                                  placeholder="Contoh: Mencetak Generasi Qur'ani dan Unggul Berprestasi"
                                  className="w-full px-3 py-2 text-xs font-semibold border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                  Teks Penjelas / Subtitle Slide <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                  required
                                  rows={2}
                                  value={slide.subtitle}
                                  onChange={(e) => handleUpdateSlideField(slide.id, 'subtitle', e.target.value)}
                                  placeholder="Tuliskan keterangan pendukung atau sambutan hangat..."
                                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                                />
                              </div>

                              {/* SECTION: FOTO SLIDE */}
                              <div className="pt-2 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                  <label className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
                                    <Camera className="w-3.5 h-3.5 text-[#0b3c26]" />
                                    <span>Foto Slide (Dapat Dipasang Foto)</span>
                                  </label>
                                  {slide.photoUrl ? (
                                    <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                      ✓ Foto Terpasang
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-gray-400">
                                      Opsional (Slide Teks Penuh jika kosong)
                                    </span>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start bg-gray-50/80 p-3 rounded-xl border border-gray-200">
                                  {/* Thumbnail Preview & Quick Actions */}
                                  <div className="sm:col-span-4 flex flex-col items-center">
                                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-gray-300 bg-gray-100 relative flex items-center justify-center shadow-xs">
                                      {slide.photoUrl ? (
                                        <img
                                          src={slide.photoUrl}
                                          alt="Foto Slide"
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="text-center p-2 text-gray-400">
                                          <Camera className="w-6 h-6 mx-auto mb-1 opacity-50" />
                                          <span className="text-[10px] block leading-tight">Belum ada foto</span>
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-1.5 mt-2 w-full">
                                      {/* File Upload button */}
                                      <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-[#0b3c26] text-[#f3e5ab] text-[11px] font-semibold rounded-lg hover:bg-[#072217] transition-all shadow-xs">
                                        <Upload className="w-3 h-3" />
                                        <span>{slide.photoUrl ? 'Ganti Foto' : 'Unggah Foto'}</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleSlidePhotoUpload(slide.id, e)}
                                          className="hidden"
                                        />
                                      </label>

                                      {slide.photoUrl && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            handleUpdateSlideField(slide.id, 'photoUrl', '');
                                            handleUpdateSlideField(slide.id, 'photoCaption', '');
                                          }}
                                          className="px-2 py-1.5 text-[11px] text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                                          title="Hapus foto dari slide ini"
                                        >
                                          Hapus
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Input Details */}
                                  <div className="sm:col-span-8 space-y-2.5">
                                    <div>
                                      <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">
                                        URL Tautan Gambar Foto
                                      </label>
                                      <input
                                        type="text"
                                        value={slide.photoUrl || ''}
                                        onChange={(e) => handleUpdateSlideField(slide.id, 'photoUrl', e.target.value)}
                                        placeholder="https://... URL tautan gambar foto slide"
                                        className="w-full px-3 py-1.5 text-xs font-mono text-[11px] border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">
                                        Keterangan Singkat Foto (Caption pada Slide)
                                      </label>
                                      <input
                                        type="text"
                                        value={slide.photoCaption || ''}
                                        onChange={(e) => handleUpdateSlideField(slide.id, 'photoCaption', e.target.value)}
                                        placeholder="Contoh: Suasana Pembelajaran Aktif & Interaktif di Kelas"
                                        className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                                      />
                                    </div>

                                    {/* Quick preset suggestions */}
                                    <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500">
                                      <span className="font-semibold text-gray-600">Pilihan Cepat Foto:</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleUpdateSlideField(slide.id, 'photoUrl', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop');
                                          handleUpdateSlideField(slide.id, 'photoCaption', 'Suasana Pembelajaran Aktif & Islami di Kelas');
                                        }}
                                        className="px-2 py-0.5 rounded bg-white hover:bg-gray-100 border border-gray-200 text-gray-700"
                                      >
                                        Belajar di Kelas
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleUpdateSlideField(slide.id, 'photoUrl', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop');
                                          handleUpdateSlideField(slide.id, 'photoCaption', "Bimbingan Tahfidz Juz 30 & Tartil Al-Qur'an");
                                        }}
                                        className="px-2 py-0.5 rounded bg-white hover:bg-gray-100 border border-gray-200 text-gray-700"
                                      >
                                        Tahfidz Al-Qur'an
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleUpdateSlideField(slide.id, 'photoUrl', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop');
                                          handleUpdateSlideField(slide.id, 'photoCaption', 'Penerimaan Peserta Didik Baru (PPDB) TP 2025/2026');
                                        }}
                                        className="px-2 py-0.5 rounded bg-white hover:bg-gray-100 border border-gray-200 text-gray-700"
                                      >
                                        Dokumentasi PPDB
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div>
                                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                    Teks Badge / Label Slide
                                  </label>
                                  <input
                                    type="text"
                                    value={slide.badge || ''}
                                    onChange={(e) => handleUpdateSlideField(slide.id, 'badge', e.target.value)}
                                    placeholder="Contoh: Program Unggulan • Tahfidz & Aswaja"
                                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                    URL Gambar Cover Khusus Slide (Latar Belakang)
                                  </label>
                                  <input
                                    type="url"
                                    value={slide.bannerUrl || ''}
                                    onChange={(e) => handleUpdateSlideField(slide.id, 'bannerUrl', e.target.value)}
                                    placeholder={heroForm.heroBannerUrl}
                                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Highlights Inputs */}
                  <div className="pt-2 border-t border-gray-100">
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

                  {/* General Cover URL */}
                  <div className="pt-2 border-t border-gray-100">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      URL Gambar Cover Utama / Default Beranda
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        value={heroForm.heroBannerUrl}
                        onChange={(e) => setHeroForm({ ...heroForm, heroBannerUrl: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#0b3c26]"
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
                        className="px-3 py-2 text-xs text-[#0b3c26] bg-[#0b3c26]/10 hover:bg-[#0b3c26]/20 font-medium rounded-xl transition-colors shrink-0"
                      >
                        Reset Cover Default
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold shadow-md transition-colors"
                    >
                      <Save className="w-4 h-4 text-[#d4af37]" />
                      <span>Simpan Slider Teks Beranda & Durasi</span>
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
                        key={stat.id ? `admin-stat-${stat.id}-${idx}` : `admin-stat-${idx}`}
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
                  Kelola Data Profil, Sambutan &amp; Sejarah Singkat Madrasah
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  Ubah nama madrasah, alamat resmi Soborejo Pringsurat, kontak, profil pimpinan, visi, misi, tujuan, teks sambutan, serta narasi sejarah singkat lembaga.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Info Utama & Logo */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b3c26] mb-3">
                    Identitas, Logo & Legalitas Madrasah
                  </h3>

                  {/* Logo Management */}
                  <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-20 h-20 rounded-xl border-2 border-[#d4af37] bg-emerald-50/50 flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-1.5">
                      {profileForm.logoUrl ? (
                        <img
                          src={profileForm.logoUrl}
                          alt="Pratinjau Logo"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/logo-maarif.svg';
                          }}
                        />
                      ) : (
                        <div className="text-[10px] text-gray-400 text-center font-bold px-1">
                          Emblem Default
                        </div>
                      )}
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <label className="block text-xs font-bold text-gray-800">
                          Logo Resmi Madrasah (Navbar, Kop Surat, & Seluruh Perangkat)
                        </label>
                        <span className="text-[11px] text-emerald-800 font-semibold">
                          Tersinkron Online & Realtime
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="https://... URL tautan gambar logo (.png, .jpg, .svg)"
                          value={profileForm.logoUrl || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, logoUrl: e.target.value })}
                          className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26] font-mono text-[11px]"
                        />

                        {/* File Upload Button */}
                        <label className="cursor-pointer shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#0b3c26] text-[#f3e5ab] text-xs font-semibold rounded-lg hover:bg-[#072217] transition-all shadow-sm">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah Logo</span>
                          <input
                            type="file"
                            accept="image/*,.svg"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            setProfileForm({
                              ...profileForm,
                              logoUrl: '/assets/logo-maarif.svg',
                            })
                          }
                          className="text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold underline inline-flex items-center gap-1"
                        >
                          ✓ Gunakan Logo Resmi LP Ma'arif NU (Vektor SVG)
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

                  {/* Favicon Website Management */}
                  <div className="mb-5 p-4 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#0b3c26]" />
                        <label className="block text-xs font-bold text-gray-800">
                          Favicon Website (Ikon Tab Browser & Pintasan Layar Ponsel)
                        </label>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          profileForm.faviconUrl
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        {profileForm.faviconUrl ? '★ Favicon Kustom Aktif' : '✓ Otomatis Mengikuti Logo Madrasah'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Live Browser Tab & Mobile Mockups */}
                      <div className="lg:col-span-5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          <span>Pratinjau Nyata (Live Preview):</span>
                          <span className="text-[9px] bg-slate-200 px-1.5 py-0.5 rounded text-gray-600 font-mono">16×16px & 32×32px</span>
                        </div>

                        {/* Chrome/Edge style tab mockup */}
                        <div className="bg-slate-200/90 pt-1 px-1.5 rounded-t-lg border-t border-x border-slate-300">
                          <div className="bg-white rounded-t-md px-3 py-1.5 flex items-center gap-2 shadow-xs max-w-full">
                            <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                              <img
                                src={profileForm.faviconUrl || profileForm.logoUrl || '/assets/logo-maarif.svg'}
                                alt="Favicon Preview"
                                className="w-4 h-4 object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/assets/logo-maarif.svg';
                                }}
                              />
                            </div>
                            <span className="text-[11px] text-gray-800 font-medium truncate flex-1">
                              {profileForm.shortName || profileForm.name || "MI Ma'arif Al Ihsan"}
                            </span>
                            <span className="text-[11px] text-gray-400 font-bold hover:text-gray-600 cursor-default leading-none">
                              ×
                            </span>
                          </div>
                        </div>

                        {/* Mobile bookmark icon preview */}
                        <div className="flex items-center gap-3 pt-1 text-[11px] text-gray-600">
                          <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center p-1.5 shrink-0">
                            <img
                              src={profileForm.faviconUrl || profileForm.logoUrl || '/assets/logo-maarif.svg'}
                              alt="Mobile Icon Preview"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/assets/logo-maarif.svg';
                              }}
                            />
                          </div>
                          <div className="text-[10px] leading-snug text-gray-500">
                            <div className="font-semibold text-gray-700">Ikon Layar Ponsel (Apple Touch & PWA)</div>
                            <div>Otomatis terpasang saat website disimpan ke Bookmark atau Beranda HP.</div>
                          </div>
                        </div>
                      </div>

                      {/* Controls and Input */}
                      <div className="lg:col-span-7 space-y-2.5">
                        <p className="text-[11px] text-gray-600 leading-relaxed">
                          Favicon adalah lambang identitas yang muncul di tab peramban Google Chrome, Safari, Firefox, bilah favorit, serta ikon pintasan pengunjung.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="https://... URL favicon (.png, .ico, .svg, .webp)"
                            value={profileForm.faviconUrl || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, faviconUrl: e.target.value })}
                            className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26] font-mono text-[11px]"
                          />

                          {/* Upload Favicon Button */}
                          <label className="cursor-pointer shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#0b3c26] text-[#f3e5ab] text-xs font-semibold rounded-lg hover:bg-[#072217] transition-all shadow-sm">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Unggah Favicon</span>
                            <input
                              type="file"
                              accept="image/*,.ico,.svg"
                              onChange={handleFaviconUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                          <button
                            type="button"
                            onClick={() =>
                              setProfileForm({
                                ...profileForm,
                                faviconUrl: profileForm.logoUrl || '/assets/logo-maarif.svg',
                              })
                            }
                            className="text-emerald-800 hover:text-emerald-950 font-semibold underline inline-flex items-center gap-1"
                          >
                            ✓ Samakan dengan Logo Madrasah
                          </button>
                          <span className="text-gray-300">•</span>
                          <button
                            type="button"
                            onClick={() =>
                              setProfileForm({
                                ...profileForm,
                                faviconUrl: '/assets/logo-maarif.svg',
                              })
                            }
                            className="text-emerald-800 hover:text-emerald-950 font-semibold underline inline-flex items-center gap-1"
                          >
                            Gunakan Logo LP Ma'arif (SVG)
                          </button>
                          {profileForm.faviconUrl && (
                            <>
                              <span className="text-gray-300">•</span>
                              <button
                                type="button"
                                onClick={() => setProfileForm({ ...profileForm, faviconUrl: '' })}
                                className="text-red-600 hover:text-red-800 font-medium underline"
                              >
                                Reset (Otomatis Ikuti Logo)
                              </button>
                            </>
                          )}
                        </div>
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

                  {/* IDENTITAS DUA LEMBAGA (SATU ATAP: RA & MI) */}
                  <div className="mt-5 pt-5 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full">
                        Dua Unit Satu Atap
                      </span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#072217]">
                        Detail Identitas Resmi Masing-Masing Unit (RA &amp; MI)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* RA Unit Settings */}
                      <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-xs text-amber-900 uppercase">
                            1. Unit RA Al Ihsan Soborejo (PAUD)
                          </span>
                          <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                            Prasekolah
                          </span>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Nama Unit RA</label>
                          <input
                            type="text"
                            value={profileForm.raName || 'RA AL IHSAN SOBOREJO'}
                            onChange={(e) => setProfileForm({ ...profileForm, raName: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg bg-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">NPSN RA</label>
                            <input
                              type="text"
                              value={profileForm.raNpsn || '69991234'}
                              onChange={(e) => setProfileForm({ ...profileForm, raNpsn: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg bg-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">NSM RA</label>
                            <input
                              type="text"
                              value={profileForm.raNsm || '101233230045'}
                              onChange={(e) => setProfileForm({ ...profileForm, raNsm: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg bg-white font-mono"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">Akreditasi RA</label>
                            <input
                              type="text"
                              value={profileForm.raAccreditation || 'Terakreditasi'}
                              onChange={(e) => setProfileForm({ ...profileForm, raAccreditation: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">Kepala RA</label>
                            <input
                              type="text"
                              value={profileForm.raHeadName || 'SITI ROHMAH, S.Pd.I.'}
                              onChange={(e) => setProfileForm({ ...profileForm, raHeadName: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* MI Unit Settings */}
                      <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-xs text-emerald-950 uppercase">
                            2. Unit MI Ma'arif Al Ihsan (SD/MI)
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                            Madrasah Ibtidaiyah
                          </span>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Nama Unit MI</label>
                          <input
                            type="text"
                            value={profileForm.miName || "MI MA'ARIF AL IHSAN SOBOREJO"}
                            onChange={(e) => setProfileForm({ ...profileForm, miName: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs border border-emerald-300 rounded-lg bg-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">NPSN MI</label>
                            <input
                              type="text"
                              value={profileForm.miNpsn || profileForm.npsn || '60713037'}
                              onChange={(e) => setProfileForm({ ...profileForm, miNpsn: e.target.value, npsn: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs border border-emerald-300 rounded-lg bg-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">NSM MI</label>
                            <input
                              type="text"
                              value={profileForm.miNsm || profileForm.nsm || '111233230053'}
                              onChange={(e) => setProfileForm({ ...profileForm, miNpsn: e.target.value, nsm: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs border border-emerald-300 rounded-lg bg-white font-mono"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">Akreditasi MI</label>
                            <input
                              type="text"
                              value={profileForm.miAccreditation || profileForm.accreditation || 'Terakreditasi Baik'}
                              onChange={(e) => setProfileForm({ ...profileForm, miAccreditation: e.target.value, accreditation: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs border border-emerald-300 rounded-lg bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">Kepala MI</label>
                            <input
                              type="text"
                              value={profileForm.headmasterName || 'MUIN, S.Pd.I.'}
                              onChange={(e) => setProfileForm({ ...profileForm, headmasterName: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs border border-emerald-300 rounded-lg bg-white"
                            />
                          </div>
                        </div>
                      </div>
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
                <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b3c26]">
                      Kepala Madrasah & Foto Sambutan Resmi
                    </h3>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 font-semibold px-2 py-0.5 rounded-full">
                      Tampil di Sambutan Beranda
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  {/* Foto Kepala Madrasah */}
                  <div className="bg-white p-5 rounded-xl border border-emerald-200/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-xs font-bold text-[#072217]">
                          Foto Kepala Madrasah (Tampil pada Sambutan di Beranda Utama)
                        </label>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Atur foto Bapak {profileForm.headmasterName} lengkap dengan penyesuaian posisi, skala/zoom, dan mode bingkai.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-[#d4af37] bg-[#072217] px-2.5 py-1 rounded-md">
                        Sambutan Beranda
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                      {/* Live Frame Preview */}
                      <div className="md:col-span-4 flex flex-col items-center">
                        <div className="relative w-36 h-48 sm:w-40 sm:h-52 rounded-xl overflow-hidden border-2 border-[#d4af37] shadow-lg bg-[#072217] flex items-center justify-center">
                          {profileForm.headmasterPhotoUrl ? (
                            <img
                              src={profileForm.headmasterPhotoUrl}
                              alt={profileForm.headmasterName || 'Kepala Madrasah'}
                              style={{
                                transform: `scale(${(profileForm.headmasterPhotoScale ?? 100) / 100})`,
                                transformOrigin:
                                  profileForm.headmasterPhotoPosition === 'top'
                                    ? 'top center'
                                    : profileForm.headmasterPhotoPosition === 'bottom'
                                    ? 'bottom center'
                                    : 'center center',
                              }}
                              className={`w-full h-full transition-transform duration-200 ${
                                profileForm.headmasterPhotoFit === 'contain' ? 'object-contain' : 'object-cover'
                              } ${
                                profileForm.headmasterPhotoPosition === 'top'
                                  ? 'object-top'
                                  : profileForm.headmasterPhotoPosition === 'bottom'
                                  ? 'object-bottom'
                                  : 'object-center'
                              }`}
                            />
                          ) : (
                            <div className="text-center p-2 text-white/70 text-[10px]">
                              <UserIcon className="w-10 h-10 mx-auto text-[#d4af37] mb-1" />
                              <span>Belum ada foto</span>
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1.5 font-medium">
                          Pratinjau Bingkai Sambutan
                        </span>
                      </div>

                      {/* Controls */}
                      <div className="md:col-span-8 space-y-3.5">
                        {/* URL & Upload */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            URL Gambar Foto / Unggah dari Perangkat
                          </label>
                          <input
                            type="text"
                            value={profileForm.headmasterPhotoUrl || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, headmasterPhotoUrl: e.target.value })}
                            placeholder="https://... tempelkan tautan langsung atau pilih file"
                            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg font-mono text-[11px]"
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-semibold rounded-lg shadow-sm transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Pilih Foto dari Perangkat</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleHeadmasterPhotoUpload}
                              className="hidden"
                            />
                          </label>

                          {profileForm.headmasterPhotoUrl && (
                            <button
                              type="button"
                              onClick={() => setProfileForm({ ...profileForm, headmasterPhotoUrl: '' })}
                              className="px-2.5 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                            >
                              Hapus Foto
                            </button>
                          )}
                        </div>

                        {/* Presets */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Pilihan Cepat Foto Islami Formal:
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                setProfileForm({
                                  ...profileForm,
                                  headmasterPhotoUrl:
                                    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
                                  headmasterPhotoPosition: 'top',
                                  headmasterPhotoScale: 100,
                                  headmasterPhotoFit: 'cover'
                                })
                              }
                              className="px-2 py-1 text-[11px] border border-gray-300 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 rounded-md text-gray-700"
                            >
                              Ustadz Berkacamata
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setProfileForm({
                                  ...profileForm,
                                  headmasterPhotoUrl:
                                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
                                  headmasterPhotoPosition: 'top',
                                  headmasterPhotoScale: 100,
                                  headmasterPhotoFit: 'cover'
                                })
                              }
                              className="px-2 py-1 text-[11px] border border-gray-300 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 rounded-md text-gray-700"
                            >
                              Jas Pimpinan Formal
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setProfileForm({
                                  ...profileForm,
                                  headmasterPhotoUrl:
                                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
                                  headmasterPhotoPosition: 'top',
                                  headmasterPhotoScale: 100,
                                  headmasterPhotoFit: 'cover'
                                })
                              }
                              className="px-2 py-1 text-[11px] border border-gray-300 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 rounded-md text-gray-700"
                            >
                              Pendidik Hangat Bersahaja
                            </button>
                          </div>
                        </div>

                        {/* Adjustments: Position, Zoom, Fit */}
                        <div className="pt-2 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* Position */}
                          <div>
                            <label className="block text-[10px] font-semibold text-gray-600 mb-1">
                              Fokus Posisi:
                            </label>
                            <div className="grid grid-cols-3 gap-1">
                              {(['top', 'center', 'bottom'] as const).map((pos) => (
                                <button
                                  key={pos}
                                  type="button"
                                  onClick={() => setProfileForm({ ...profileForm, headmasterPhotoPosition: pos })}
                                  className={`py-1 text-[10px] font-semibold rounded border transition-colors ${
                                    (profileForm.headmasterPhotoPosition || 'top') === pos
                                      ? 'bg-[#0b3c26] text-white border-[#0b3c26]'
                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                  }`}
                                >
                                  {pos === 'top' ? 'Atas' : pos === 'center' ? 'Tengah' : 'Bawah'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Zoom Scale */}
                          <div>
                            <div className="flex justify-between text-[10px] font-semibold text-gray-600 mb-1">
                              <span>Skala (Zoom):</span>
                              <span className="text-[#0b3c26] font-mono">{profileForm.headmasterPhotoScale ?? 100}%</span>
                            </div>
                            <input
                              type="range"
                              min="80"
                              max="160"
                              step="5"
                              value={profileForm.headmasterPhotoScale ?? 100}
                              onChange={(e) => setProfileForm({ ...profileForm, headmasterPhotoScale: Number(e.target.value) })}
                              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0b3c26]"
                            />
                          </div>

                          {/* Fit Mode */}
                          <div>
                            <label className="block text-[10px] font-semibold text-gray-600 mb-1">
                              Mode Bingkai:
                            </label>
                            <div className="grid grid-cols-2 gap-1">
                              {(['cover', 'contain'] as const).map((f) => (
                                <button
                                  key={f}
                                  type="button"
                                  onClick={() => setProfileForm({ ...profileForm, headmasterPhotoFit: f })}
                                  className={`py-1 text-[10px] font-semibold rounded border transition-colors ${
                                    (profileForm.headmasterPhotoFit || 'cover') === f
                                      ? 'bg-[#0b3c26] text-white border-[#0b3c26]'
                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                  }`}
                                >
                                  {f === 'cover' ? 'Penuh' : 'Utuh'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <FormattedTextEditor
                      id="admin-headmaster-welcome-editor"
                      label="Paragraf Sambutan Kepala Madrasah"
                      helperText="Gunakan Enter 2x untuk memisahkan antar-paragraf. Teks mendukung **tebal**, *miring*, <u>garis bawah</u>, emoji, serta ikon."
                      rows={6}
                      value={(profileForm.headmasterWelcome || []).join('\n\n')}
                      onChange={(val) => {
                        const paragraphs = val.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
                        setProfileForm({
                          ...profileForm,
                          headmasterWelcome: paragraphs.length > 0 ? paragraphs : [''],
                        });
                      }}
                      placeholder="Tuliskan kata sambutan hangat kepala madrasah untuk menyambut wali santri dan masyarakat..."
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
                      <FormattedTextEditor
                        id="admin-vision-editor"
                        label="Visi Madrasah"
                        helperText="Teks visi madrasah mendukung format tebal, miring, garis bawah, emoji, dan ikon."
                        rows={2}
                        value={profileForm.vision || ''}
                        onChange={(val) => setProfileForm({ ...profileForm, vision: val })}
                        placeholder="Terwujudnya Generasi Qur'ani, Berakhlak Mulia, dan Berprestasi Unggul..."
                      />
                    </div>
                    <div>
                      <FormattedTextEditor
                        id="admin-missions-editor"
                        label="Butir-butir Misi Madrasah"
                        helperText="Pisahkan setiap butir misi dengan Enter (baris baru). Anda dapat menambahkan format, emoji, dan ikon."
                        rows={5}
                        value={(profileForm.missions || []).join('\n')}
                        onChange={(val) =>
                          setProfileForm({
                            ...profileForm,
                            missions: val.split('\n').filter(Boolean),
                          })
                        }
                        placeholder="1. Menanamkan aqidah Islam Ahlussunnah wal Jama'ah..."
                      />
                    </div>
                    <div>
                      <FormattedTextEditor
                        id="admin-goals-editor"
                        label="Butir-butir Tujuan Madrasah"
                        helperText="Pisahkan setiap butir tujuan dengan Enter (baris baru). Anda dapat menambahkan format teks, emoji, dan ikon."
                        rows={5}
                        value={(profileForm.goals || []).join('\n')}
                        onChange={(val) =>
                          setProfileForm({
                            ...profileForm,
                            goals: val.split('\n').filter(Boolean),
                          })
                        }
                        placeholder="a. Membekali santri kecakapan membaca Al-Qur'an tartil..."
                      />
                    </div>
                  </div>
                </div>

                {/* Sejarah Singkat & Jejak Langkah Madrasah */}
                <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-[#0b3c26]" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b3c26]">
                          Sejarah Singkat &amp; Jejak Langkah Madrasah
                        </h3>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Tuliskan sejarah berdirinya lembaga, tokoh pendiri, dan perkembangan madrasah secara praktis. Pisahkan antar-paragraf dengan menekan <strong>Enter 2 kali</strong>.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const defaultRef = [
                            "Lembaga Pendidikan Satu Atap MI Ma'arif Al Ihsan Soborejo dan RA Al Ihsan Soborejo didirikan atas prakarsa para tokoh agama, alim ulama, dan sesepuh masyarakat Desa Soborejo, Kecamatan Pringsurat, Kabupaten Temanggung, yang mendambakan hadirnya sarana pendidikan Islam terpadu yang kokoh di tengah masyarakat.",
                            "Bermula dari komitmen membina anak-anak sejak usia dini di Raudhatul Athfal (RA Al Ihsan) dengan stimulasi adab dan kegembiraan belajar, kemudian dilanjutkan secara berkesinambungan di Madrasah Ibtidaiyah (MI Ma'arif Al Ihsan) tanpa perlu cemas menghadapi adaptasi lingkungan sekolah yang baru.",
                            "Berakar dari cita-cita luhur mencetak generasi yang tidak hanya mahir membaca dan berhitung, tetapi juga tekun dalam sholat, gemar menghafal Al-Qur'an, berbakti kepada orang tua, serta berpegang teguh pada aqidah Ahlussunnah wal Jama'ah An-Nahdliyyah.",
                            "Kini, lembaga satu atap ini terus bertumbuh dengan sarana belajar representatif yang ramah anak, program tahfidz terpadu, pembinaan seni rebana hadroh, serta pelayanan PPDB terpadu satu pintu untuk jenjang RA dan MI."
                          ];
                          if (window.confirm('Muat teks narasi sejarah asli pendirian Soborejo? Teks saat ini akan diperbarui dengan data referensi.')) {
                            setProfileForm({ ...profileForm, history: defaultRef });
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-[11px] font-medium transition-all shadow-2xs"
                        title="Muat teks narasi sejarah default"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                        <span>Muat Referensi Asli</span>
                      </button>
                    </div>
                  </div>

                  {/* Unified Rich Text Editor for History */}
                  <div>
                    <FormattedTextEditor
                      id="admin-history-editor"
                      label="Narasi Lengkap Sejarah Madrasah"
                      helperText="Pisahkan antar-paragraf cukup dengan menekan Enter 2 kali. Gunakan toolbar di atas untuk format tebal (**teks**), miring (*teks*), garis bawah (<u>teks</u>), emoji, dan ikon."
                      rows={8}
                      value={(profileForm.history || []).join('\n\n')}
                      onChange={(val) => {
                        const parsed = val
                          .split(/\n\s*\n/)
                          .map((p) => p.trim())
                          .filter(Boolean);
                        setProfileForm({ ...profileForm, history: parsed.length > 0 ? parsed : [''] });
                      }}
                      placeholder="Tuliskan sejarah berdirinya MI & RA Al Ihsan Soborejo, tokoh pendiri, serta tonggak perkembangannya di sini..."
                    />
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2 px-1">
                      <span>
                        💡 Terdeteksi: <strong>{(profileForm.history || []).filter((h) => h.trim().length > 0).length}</strong> paragraf tersusun rapi.
                      </span>
                      <span className="text-gray-400">
                        Otomatis diproses menjadi alinea terpisah saat disimpan
                      </span>
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

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingStaff(null);
                      setStaffForm({
                        name: '',
                        role: '',
                        category: 'Guru Kelas',
                        institution: 'MI',
                        education: 'S.Pd.',
                        nipOrNuptk: '-',
                        subjects: '',
                        phone: '',
                        photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
                        status: 'Aktif Mengajar',
                        order: (staffList.length + 1) * 10,
                        bio: '',
                        quote: '',
                        serviceYears: '',
                        expertise: '',
                      });
                      setIsAddingStaff(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Tambah GTK Manual</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsStaffCsvModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-emerald-50 text-[#0b3c26] border border-emerald-300 text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Import CSV GTK</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportStaffCSV}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all"
                    title="Download CSV data GTK madrasah"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor CSV</span>
                  </button>
                </div>
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
                            Unit Lembaga (Satu Atap) *
                          </label>
                          <select
                            value={staffForm.institution || 'MI'}
                            onChange={(e) =>
                              setStaffForm({ ...staffForm, institution: e.target.value as 'MI' | 'RA' | 'Satu Atap' })
                            }
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26] bg-white font-medium"
                          >
                            <option value="MI">MI Ma'arif Al Ihsan (Unit MI)</option>
                            <option value="RA">RA Al Ihsan Soborejo (Unit RA)</option>
                            <option value="Satu Atap">Lintas Lembaga (Satu Atap)</option>
                          </select>
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
                            Masa Pengabdian / Tahun Mulai
                          </label>
                          <input
                            type="text"
                            placeholder="contoh: Mengabdi sejak 2012 (13 Tahun Pengabdian)"
                            value={staffForm.serviceYears}
                            onChange={(e) => setStaffForm({ ...staffForm, serviceYears: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Pesan Inspiratif &amp; Mutiara Hikmah Pendidik
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Pesan inspiratif, mutiara kata, atau motivasi untuk santri dan wali murid..."
                            value={staffForm.quote}
                            onChange={(e) => setStaffForm({ ...staffForm, quote: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Biografi &amp; Profil Lengkap Dedikasi Pengabdian
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Tuliskan latar belakang pengalaman mengajar, falsafah pendidikan, dan pembinaan karakter di madrasah..."
                            value={staffForm.bio}
                            onChange={(e) => setStaffForm({ ...staffForm, bio: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Kompetensi Khusus &amp; Bidang Pembinaan (Pisahkan dengan koma)
                          </label>
                          <input
                            type="text"
                            placeholder="contoh: Tahfidz Al-Qur'an, Seni Hadroh, Pramuka Penggalang, P5RA"
                            value={staffForm.expertise}
                            onChange={(e) => setStaffForm({ ...staffForm, expertise: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Pas Foto 3 x 4 Resmi (Utuh Tanpa Terpotong)
                          </label>
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="w-16 aspect-[3/4] rounded-lg border-2 border-[#d4af37]/40 bg-[#072217] flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-0.5">
                              {staffForm.photoUrl ? (
                                <img
                                  src={staffForm.photoUrl}
                                  alt="Preview"
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80';
                                  }}
                                />
                              ) : (
                                <span className="text-[9px] text-gray-400">Foto 3x4</span>
                              )}
                            </div>
                            <div className="flex-1 w-full space-y-1.5">
                              <input
                                type="text"
                                placeholder="https://images.unsplash.com/... atau unggah dari perangkat"
                                value={staffForm.photoUrl}
                                onChange={(e) => setStaffForm({ ...staffForm, photoUrl: e.target.value })}
                                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                              />
                              <p className="text-[10px] text-gray-500">
                                Format pas foto 3x4 akan ditampilkan utuh dan tidak terpotong di halaman depan dan profil GTK.
                              </p>
                            </div>
                            <label className="cursor-pointer shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-900 transition-all">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Unggah Foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleStaffPhotoUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
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

              {/* Staff CSV Import Modal */}
              <StaffCsvImportModal
                isOpen={isStaffCsvModalOpen}
                onClose={() => setIsStaffCsvModalOpen(false)}
                currentStaffCount={staffList.length}
                onImportSuccess={(newStaff, replaceAll) => {
                  addStaffBatch(newStaff, replaceAll);
                  notify(
                    replaceAll
                      ? `Berhasil mengganti data GTK dengan ${newStaff.length} data dari CSV!`
                      : `Berhasil menambahkan ${newStaff.length} GTK baru dari file CSV!`
                  );
                }}
              />
            </div>
          )}

          {/* TAB: MANAJEMEN DATA SISWA (SANTRI) */}
          {activeTab === 'students' && (
            <StudentManagement
              students={studentList}
              onAddStudent={addStudent}
              onAddStudentsBatch={addStudentsBatch}
              onUpdateStudent={updateStudent}
              onDeleteStudent={deleteStudent}
              notify={notify}
            />
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
                {[...newsList]
                  .sort((a, b) => parseDateTimestamp(b.date) - parseDateTimestamp(a.date))
                  .map((article) => (
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
                        <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#0b3c26]" />
                          {formatDisplayDate(article.date)}
                        </span>
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
                          const articleContentString = Array.isArray(article.content)
                            ? article.content.join('\n\n')
                            : (typeof article.content === 'string' ? article.content : '');
                          setNewsForm({
                            title: article.title,
                            category: article.category,
                            summary: article.summary || '',
                            contentString: articleContentString,
                            author: article.author || 'Admin Madrasah',
                            readTime: article.readTime || '3 menit',
                            imageUrl: article.imageUrl || '',
                            date: toDateInputValue(article.date)
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Kategori Berita</label>
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
                          <label className="block font-semibold text-gray-700 mb-1">Penulis / Redaksi</label>
                          <input
                            type="text"
                            required
                            value={newsForm.author}
                            onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Contoh: Admin Madrasah / Tim Humas"
                          />
                        </div>
                      </div>

                      {/* Tanggal Terbit Manual Setting */}
                      <div className="bg-[#fcfdfd] border border-emerald-100 rounded-xl p-3.5 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <label className="font-semibold text-gray-800 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#0b3c26]" />
                            <span>Tanggal Terbit Berita *</span>
                          </label>
                          <div className="flex items-center gap-1 text-[11px]">
                            <button
                              type="button"
                              onClick={() => setNewsForm({ ...newsForm, date: getDaysAgoDate(0) })}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                                newsForm.date === getDaysAgoDate(0)
                                  ? 'bg-[#0b3c26] text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              Hari Ini
                            </button>
                            <button
                              type="button"
                              onClick={() => setNewsForm({ ...newsForm, date: getDaysAgoDate(1) })}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                                newsForm.date === getDaysAgoDate(1)
                                  ? 'bg-[#0b3c26] text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              Kemarin
                            </button>
                            <button
                              type="button"
                              onClick={() => setNewsForm({ ...newsForm, date: getDaysAgoDate(2) })}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                                newsForm.date === getDaysAgoDate(2)
                                  ? 'bg-[#0b3c26] text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              2 Hari Lalu
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                          <input
                            type="date"
                            required
                            value={newsForm.date}
                            onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white font-medium text-gray-800 text-xs focus:ring-2 focus:ring-[#0b3c26]/20 focus:border-[#0b3c26]"
                          />
                          <div className="text-[11px] text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between">
                            <span className="text-gray-400 text-[10px]">Tampilan Publik:</span>
                            <strong className="text-[#072217] font-semibold">{formatDisplayDate(newsForm.date) || '-'}</strong>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-tight">
                          💡 <em>Tanggal terbit dapat disesuaikan mundur (backdate) jika admin terlambat mengunggah warta kegiatan. Berita akan otomatis terurut berdasarkan tanggal ini di halaman utama.</em>
                        </p>
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
                        <div className="mt-1.5 p-2 bg-emerald-50 border border-emerald-200/60 rounded-lg text-[11px] text-[#0b3c26] space-y-1">
                          <p>📸 <strong>Otomatis ke Galeri:</strong> Foto ini akan langsung ditambahkan ke Galeri Foto Madrasah.</p>
                          {newsForm.category === 'Prestasi' && (
                            <p className="text-amber-800">🏆 <strong>Kategori Prestasi:</strong> Karena kategori dipilih <em>Prestasi</em>, berita dan foto ini juga otomatis tercatat di bagian Prestasi Madrasah.</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <FormattedTextEditor
                          id="admin-news-summary-editor"
                          label="Ringkasan Berita *"
                          helperText="Deskripsi singkat yang tampil pada kartu berita. Mendukung tebal, miring, emoji, dan ikon."
                          rows={2}
                          required
                          value={newsForm.summary}
                          onChange={(val) => setNewsForm({ ...newsForm, summary: val })}
                          placeholder="Tulis ringkasan singkat cuplikan berita..."
                        />
                      </div>

                      <div>
                        <FormattedTextEditor
                          id="admin-news-content-editor"
                          label="Isi Lengkap Artikel *"
                          helperText="Pisahkan antar-paragraf dengan Enter 2x. Gunakan tombol toolbar untuk tebal, miring, garis bawah, emoji, dan ikon."
                          rows={7}
                          required
                          value={newsForm.contentString}
                          onChange={(val) => setNewsForm({ ...newsForm, contentString: val })}
                          placeholder="Tuliskan berita lengkap acara, liputan prestasi, atau pengumuman madrasah di sini..."
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
                  onClick={() => {
                    setEditingAch(null);
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
                    setIsAddingAch(true);
                  }}
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
                    className="border border-gray-200 bg-white rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#d4af37] transition-all shadow-sm group"
                  >
                    {/* Achievement Photo */}
                    <div className="relative h-40 w-full bg-emerald-950 overflow-hidden">
                      {ach.imageUrl ? (
                        <img
                          src={ach.imageUrl}
                          alt={ach.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/50 text-xs">
                          <Award className="w-8 h-8 text-[#d4af37] mb-1" />
                          <span>Belum ada foto</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-[#d4af37] text-[#072217] text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        {ach.rank}
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        {ach.year}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-[#0b3c26] uppercase tracking-wider mb-1">
                          {ach.level} • {ach.category}
                        </div>
                        <h4 className="font-heading text-sm font-bold text-[#072217] mb-1 leading-snug">
                          {ach.title}
                        </h4>
                        <p className="text-xs text-emerald-800 font-semibold mb-1">
                          Santri: {ach.winner}
                        </p>
                        {ach.description && (
                          <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                            {ach.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">ID: {ach.id.slice(0, 6)}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditAchievement(ach)}
                            className="px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-medium rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus prestasi "${ach.title}"?`)) {
                                deleteAchievement(ach.id);
                                notify('Prestasi dihapus.');
                              }
                            }}
                            className="px-2.5 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 font-medium rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Tambah / Edit Prestasi */}
              {(isAddingAch || editingAch) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                  <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#d4af37]/30 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                      <h3 className="font-heading text-base font-bold text-[#072217]">
                        {editingAch ? 'Edit Data Prestasi Santri' : 'Tambah Prestasi Santri Baru'}
                      </h3>
                      <button
                        onClick={() => {
                          setIsAddingAch(false);
                          setEditingAch(null);
                        }}
                        className="text-gray-400 hover:text-gray-700"
                      >
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
                          placeholder="contoh: Juara 1 MHQ Tahfidz Juz 30 Tingkat SD/MI"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
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
                            placeholder="contoh: M. Rizki Pratama & Tim"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
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
                            <option value="Nasional">Nasional</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Kategori Bidang</label>
                          <select
                            value={achForm.category}
                            onChange={(e) => setAchForm({ ...achForm, category: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                          >
                            <option value="Tahfidz & Keagamaan">Tahfidz & Keagamaan</option>
                            <option value="Sains & Matematika">Sains & Matematika</option>
                            <option value="Seni & Olahraga">Seni & Olahraga</option>
                            <option value="Pramuka & Karakter">Pramuka & Karakter</option>
                          </select>
                        </div>
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

                      {/* Input Foto Prestasi */}
                      <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5">
                        <label className="block font-bold text-[#072217]">
                          Foto Piagam / Penyerahan Piala Prestasi
                        </label>

                        <div className="flex items-center gap-3">
                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-300 bg-emerald-950 shrink-0 flex items-center justify-center">
                            {achForm.imageUrl ? (
                              <img
                                src={achForm.imageUrl}
                                alt="Preview Prestasi"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] text-gray-400">Tidak ada foto</span>
                            )}
                          </div>

                          <div className="flex-1 space-y-1.5">
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0b3c26] text-[#f3e5ab] text-xs font-semibold rounded-lg hover:bg-[#072217] transition-colors">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Pilih Foto dari HP / Laptop</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleAchFileUpload}
                                className="hidden"
                              />
                            </label>

                            <input
                              type="text"
                              value={achForm.imageUrl}
                              onChange={(e) => setAchForm({ ...achForm, imageUrl: e.target.value })}
                              placeholder="Atau tempel URL gambar..."
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg font-mono text-[11px]"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <FormattedTextEditor
                          id="admin-achievement-desc-editor"
                          label="Deskripsi Singkat Prestasi"
                          helperText="Ceritakan penyelenggara lomba, lokasi, atau capaian santri. Mendukung tebal, miring, emoji piala 🏆, dan ikon."
                          rows={3}
                          value={achForm.description}
                          onChange={(val) => setAchForm({ ...achForm, description: val })}
                          placeholder="Ceritakan penyelenggara lomba, lokasi, atau capaian santri..."
                        />
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingAch(false);
                            setEditingAch(null);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0b3c26] text-[#f3e5ab] font-bold rounded-xl"
                        >
                          {editingAch ? 'Simpan Perubahan' : 'Simpan Prestasi'}
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full">
                    Kurikulum & Pembiasaan
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1">
                    {activeTab === 'programs' ? 'Kelola Program Unggulan Madrasah' : 'Kelola Ekstrakurikuler Santri'}
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    Semua program dan ekskul yang aktif akan langsung muncul di halaman publik madrasah.
                  </p>
                </div>

                {activeTab === 'programs' ? (
                  <button
                    onClick={() => {
                      setEditingProgram(null);
                      setProgramForm({
                        title: '',
                        category: 'Program Utama',
                        iconName: 'BookOpen',
                        shortDesc: '',
                        fullDesc: '',
                        target: 'Seluruh Santri',
                        schedule: 'Setiap Hari'
                      });
                      setIsAddingProgram(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Program</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingEkskul(null);
                      setEkskulForm({
                        name: '',
                        category: 'Seni & Olahraga',
                        description: '',
                        coach: 'Pembina Ekstrakurikuler',
                        schedule: 'Sabtu Pagi',
                        imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80'
                      });
                      setIsAddingEkskul(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Ekstrakurikuler</span>
                  </button>
                )}
              </div>

              {activeTab === 'programs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {programs.map((prog) => (
                    <div
                      key={prog.id}
                      className="border border-gray-200 bg-white rounded-xl p-4 flex flex-col justify-between hover:border-[#d4af37] transition-all shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-emerald-50 px-2 py-0.5 rounded">
                            {prog.category}
                          </span>
                          <span className="text-[10px] text-gray-400">ID: {prog.id.slice(0, 6)}</span>
                        </div>
                        <h4 className="font-heading text-sm font-bold text-[#072217]">
                          {prog.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{prog.shortDesc}</p>
                        <div className="text-[11px] text-emerald-800 font-medium mt-2.5 bg-emerald-50/60 p-2 rounded-lg">
                          Target: <strong>{prog.target}</strong> • Jadwal: <strong>{prog.schedule}</strong>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-gray-100 flex justify-end gap-2">
                        <button
                          onClick={() => handleEditProgram(prog)}
                          className="px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-medium rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus program "${prog.title}"?`)) {
                              deleteProgram(prog.id);
                              notify('Program dihapus.');
                            }
                          }}
                          className="px-2.5 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 font-medium rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'extracurriculars' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {extracurriculars.map((ekskul) => (
                    <div
                      key={ekskul.id}
                      className="border border-gray-200 bg-white rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#d4af37] transition-all shadow-sm group"
                    >
                      {ekskul.imageUrl && (
                        <div className="h-36 w-full overflow-hidden bg-emerald-950">
                          <img
                            src={ekskul.imageUrl}
                            alt={ekskul.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-emerald-50 px-2 py-0.5 rounded inline-block mb-1">
                            {ekskul.category}
                          </div>
                          <h4 className="font-heading text-sm font-bold text-[#072217]">
                            {ekskul.name}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-2">
                            {ekskul.description}
                          </p>
                          <div className="text-[11px] text-gray-500 mt-2">
                            Pembina: <strong>{ekskul.coach}</strong> • {ekskul.schedule}
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-gray-100 flex justify-end gap-2">
                          <button
                            onClick={() => handleEditEkskul(ekskul)}
                            className="px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-medium rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus ekskul "${ekskul.name}"?`)) {
                                deleteExtracurricular(ekskul.id);
                                notify('Ekstrakurikuler dihapus.');
                              }
                            }}
                            className="px-2.5 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 font-medium rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Modal Tambah / Edit Program */}
              {(isAddingProgram || editingProgram) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                  <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#d4af37]/30 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                      <h3 className="font-heading text-base font-bold text-[#072217]">
                        {editingProgram ? 'Edit Program Unggulan' : 'Tambah Program Unggulan Baru'}
                      </h3>
                      <button
                        onClick={() => {
                          setIsAddingProgram(false);
                          setEditingProgram(null);
                        }}
                        className="text-gray-400 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProgram} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Nama Program *</label>
                        <input
                          type="text"
                          required
                          value={programForm.title}
                          onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                          placeholder="contoh: Tahfidz Al-Qur'an Juz 30"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Kategori</label>
                          <input
                            type="text"
                            value={programForm.category}
                            onChange={(e) => setProgramForm({ ...programForm, category: e.target.value })}
                            placeholder="Program Unggulan"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Jadwal / Waktu</label>
                          <input
                            type="text"
                            value={programForm.schedule}
                            onChange={(e) => setProgramForm({ ...programForm, schedule: e.target.value })}
                            placeholder="Setiap Pagi 06.45 - 07.15"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Target Peserta Didik</label>
                        <input
                          type="text"
                          value={programForm.target}
                          onChange={(e) => setProgramForm({ ...programForm, target: e.target.value })}
                          placeholder="Seluruh Santri Kelas 1 - 6"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <FormattedTextEditor
                          id="admin-program-shortdesc-editor"
                          label="Deskripsi Singkat Program *"
                          helperText="Uraian manfaat dan keunggulan program. Mendukung teks tebal, miring, emoji, dan ikon."
                          rows={3}
                          required
                          value={programForm.shortDesc}
                          onChange={(val) => setProgramForm({ ...programForm, shortDesc: val })}
                          placeholder="Uraian manfaat dan metode program..."
                        />
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingProgram(false);
                            setEditingProgram(null);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0b3c26] text-[#f3e5ab] font-bold rounded-xl"
                        >
                          {editingProgram ? 'Simpan Perubahan' : 'Simpan Program'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Modal Tambah / Edit Ekstrakurikuler */}
              {(isAddingEkskul || editingEkskul) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                  <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#d4af37]/30 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                      <h3 className="font-heading text-base font-bold text-[#072217]">
                        {editingEkskul ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler Baru'}
                      </h3>
                      <button
                        onClick={() => {
                          setIsAddingEkskul(false);
                          setEditingEkskul(null);
                        }}
                        className="text-gray-400 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveEkskul} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Nama Kegiatan Ekskul *</label>
                        <input
                          type="text"
                          required
                          value={ekskulForm.name}
                          onChange={(e) => setEkskulForm({ ...ekskulForm, name: e.target.value })}
                          placeholder="contoh: Seni Hadroh & Rebana"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Kategori</label>
                          <select
                            value={ekskulForm.category}
                            onChange={(e) => setEkskulForm({ ...ekskulForm, category: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                          >
                            <option value="Seni & Olahraga">Seni & Olahraga</option>
                            <option value="Keagamaan">Keagamaan</option>
                            <option value="Kepanduan / Pramuka">Kepanduan / Pramuka</option>
                            <option value="Sains & Keterampilan">Sains & Keterampilan</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Jadwal Latihan</label>
                          <input
                            type="text"
                            value={ekskulForm.schedule}
                            onChange={(e) => setEkskulForm({ ...ekskulForm, schedule: e.target.value })}
                            placeholder="Sabtu Sore"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Nama Pembina / Pelatih</label>
                        <input
                          type="text"
                          value={ekskulForm.coach}
                          onChange={(e) => setEkskulForm({ ...ekskulForm, coach: e.target.value })}
                          placeholder="Ustadz / Guru Pembimbing"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      {/* Photo Upload & Preview */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                        <label className="block font-bold text-[#072217]">Foto Dokumentasi Ekskul</label>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-300 bg-emerald-950 shrink-0">
                            {ekskulForm.imageUrl ? (
                              <img
                                src={ekskulForm.imageUrl}
                                alt="Preview Ekskul"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[9px] text-gray-400 p-1 block text-center">Kosong</span>
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 bg-[#0b3c26] text-[#f3e5ab] text-[11px] font-semibold rounded-lg hover:bg-[#072217]">
                              <Upload className="w-3 h-3" />
                              <span>Pilih File</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleEkskulFileUpload}
                                className="hidden"
                              />
                            </label>
                            <input
                              type="text"
                              value={ekskulForm.imageUrl}
                              onChange={(e) => setEkskulForm({ ...ekskulForm, imageUrl: e.target.value })}
                              placeholder="URL foto..."
                              className="w-full px-2 py-1 border border-gray-300 rounded text-[11px]"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <FormattedTextEditor
                          id="admin-ekskul-desc-editor"
                          label="Deskripsi Kegiatan Ekskul"
                          helperText="Uraian kegiatan latihan, kompetisi, dan pembiasaan. Mendukung format tebal, miring, emoji, dan ikon."
                          rows={3}
                          value={ekskulForm.description}
                          onChange={(val) => setEkskulForm({ ...ekskulForm, description: val })}
                          placeholder="Tuliskan gambaran latihan, capaian, atau keistimewaan ekskul ini..."
                        />
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingEkskul(false);
                            setEditingEkskul(null);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0b3c26] text-[#f3e5ab] font-bold rounded-xl"
                        >
                          {editingEkskul ? 'Simpan Perubahan' : 'Simpan Ekstrakurikuler'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: KELOLA GALERI (VIDEO & FOTO) DAN FASILITAS */}
          {activeTab === 'facilities' && (
            <div className="space-y-6">
              {/* Top Sub-Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-gray-200/80 shadow-xs">
                <div className="inline-flex p-1 bg-gray-100 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => setVideoGalleryTab('video')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      videoGalleryTab === 'video'
                        ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Galeri Video ({(videoGallery || []).length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoGalleryTab('foto')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      videoGalleryTab === 'foto'
                        ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Galeri Foto ({gallery.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoGalleryTab('fasilitas')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      videoGalleryTab === 'fasilitas'
                        ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Fasilitas & Sarana ({facilities.length})</span>
                  </button>
                </div>

                {videoGalleryTab === 'video' && (
                  <button
                    onClick={() => {
                      setEditingVideo(null);
                      setVideoForm({
                        title: '',
                        category: 'Profil Madrasah',
                        videoUrl: '',
                        thumbnailUrl: '',
                        description: '',
                        duration: '',
                        author: "Tim Media MI Ma'arif Al Ihsan",
                        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                        featured: false
                      });
                      setIsAddingVideo(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Video Baru</span>
                  </button>
                )}

                {videoGalleryTab === 'foto' && (
                  <button
                    onClick={() => {
                      setEditingGallery(null);
                      setGalleryForm({
                        title: '',
                        category: 'Kegiatan Belajar',
                        imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
                        description: '',
                        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                      });
                      setIsAddingGallery(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Foto Galeri</span>
                  </button>
                )}

                {videoGalleryTab === 'fasilitas' && (
                  <button
                    onClick={() => {
                      setEditingFacility(null);
                      setFacilityForm({
                        name: '',
                        category: 'Fasilitas Belajar',
                        description: '',
                        imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
                        specificationsString: 'Ruang Representatif, Pencahayaan Nyaman, Terawat Bersih'
                      });
                      setIsAddingFacility(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Fasilitas</span>
                  </button>
                )}
              </div>

              {/* 1. SUB-TAB: GALERI VIDEO */}
              {videoGalleryTab === 'video' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Video Overview Banner */}
                  <div className="bg-gradient-to-r from-[#072217] to-[#0b3c26] text-white p-5 sm:p-6 rounded-2xl border border-[#d4af37]/30 shadow-md">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#072217] bg-[#d4af37] px-2.5 py-0.5 rounded-full">
                            Fitur Galeri Video
                          </span>
                          <span className="text-xs text-[#f3e5ab]">Mendukung YouTube, Facebook, & File Video</span>
                        </div>
                        <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mt-1.5">
                          Kelola Video Dokumentasi & Kegiatan Santri
                        </h3>
                        <p className="text-xs text-white/80 mt-1 max-w-2xl leading-relaxed">
                          Tambahkan tautan video dari YouTube, Facebook Watch/Reel, Vimeo, atau link file video langsung (.mp4) untuk ditampilkan di beranda madrasah. Platform video otomatis terdeteksi.
                        </p>
                      </div>

                      {/* Quick Platform Badges */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <span className="px-2.5 py-1 bg-red-600/90 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs">
                          YouTube
                        </span>
                        <span className="px-2.5 py-1 bg-blue-600/90 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs">
                          Facebook
                        </span>
                        <span className="px-2.5 py-1 bg-emerald-700/90 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs">
                          Direct Video / MP4
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Video Grid */}
                  {(videoGallery || []).length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                      <Film className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h4 className="font-heading text-base font-bold text-gray-700">Belum Ada Video di Galeri</h4>
                      <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                        Klik tombol "Tambah Video Baru" di atas untuk memasukkan link YouTube, Facebook, atau file video.
                      </p>
                      <button
                        onClick={() => {
                          setEditingVideo(null);
                          setIsAddingVideo(true);
                        }}
                        className="mt-4 px-4 py-2 bg-[#0b3c26] text-[#f3e5ab] text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Video Pertama</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {(videoGallery || []).map((video) => {
                        const itemAspect = detectVideoAspectRatio(video.videoUrl, video.aspectRatio, video.title, video.description);
                        const parsed = parseVideoUrl(video.videoUrl, video.thumbnailUrl, itemAspect, video.title, video.description);
                        const platformColor =
                          parsed.platform === 'youtube'
                            ? 'bg-red-600 text-white'
                            : parsed.platform === 'facebook'
                            ? 'bg-blue-600 text-white'
                            : parsed.platform === 'vimeo'
                            ? 'bg-sky-500 text-white'
                            : parsed.platform === 'direct'
                            ? 'bg-emerald-700 text-white'
                            : 'bg-teal-700 text-white';

                        return (
                          <div
                            key={video.id}
                            className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                          >
                            <div>
                              {/* Thumbnail preview */}
                              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                                <img
                                  src={parsed.thumbnailUrl}
                                  alt={video.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80';
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                                {/* Badges */}
                                <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs ${platformColor}`}>
                                    {parsed.platform.toUpperCase()}
                                  </span>
                                  {itemAspect === 'portrait' ? (
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600 text-white shadow-xs flex items-center gap-1">
                                      <Smartphone className="w-2.5 h-2.5" /> 9:16 Potret
                                    </span>
                                  ) : itemAspect === 'square' ? (
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-600 text-white shadow-xs flex items-center gap-1">
                                      <Square className="w-2.5 h-2.5" /> 1:1 Kotak
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-700 text-white shadow-xs flex items-center gap-1">
                                      <Tv className="w-2.5 h-2.5" /> 16:9
                                    </span>
                                  )}
                                  {video.featured && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#d4af37] text-[#072217] shadow-xs">
                                      Unggulan
                                    </span>
                                  )}
                                </div>

                                {video.duration && (
                                  <div className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[10px] px-2 py-0.5 rounded">
                                    {video.duration}
                                  </div>
                                )}

                                {/* Play Trigger for Admin Preview */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPreviewingVideo(video);
                                    setAdminPreviewAspect(itemAspect);
                                  }}
                                  className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-[#0b3c26]/90 text-[#d4af37] border border-[#d4af37] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg cursor-pointer"
                                  title="Pratinjau Pemutar Video"
                                >
                                  <Play className="w-5 h-5 fill-current ml-0.5" />
                                </button>
                              </div>

                              {/* Info Content */}
                              <div className="p-4">
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-1.5">
                                  <span className="font-semibold text-[#0b3c26] bg-[#e8f3ee] px-2 py-0.5 rounded">
                                    {video.category}
                                  </span>
                                  {video.date && <span>• {video.date}</span>}
                                </div>

                                <h4 className="font-heading text-sm font-bold text-[#072217] line-clamp-2">
                                  {video.title}
                                </h4>

                                {video.description && (
                                  <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                                    {video.description}
                                  </p>
                                )}

                                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                                  <span className="truncate max-w-[140px] font-mono text-[10px]">
                                    {video.videoUrl}
                                  </span>
                                  <a
                                    href={video.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-[#0b3c26] flex items-center gap-1"
                                    title="Buka URL asli di tab baru"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>Buka</span>
                                  </a>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPreviewingVideo(video);
                                    setAdminPreviewAspect(itemAspect);
                                  }}
                                  className="px-2.5 py-1 text-xs text-[#0b3c26] bg-[#e8f3ee] hover:bg-[#d8ece2] font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <PlayCircle className="w-3.5 h-3.5" />
                                  <span>Preview</span>
                                </button>

                                {/* Quick Orientation Switcher */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextAspect: VideoAspectRatio = itemAspect === 'portrait' ? 'landscape' : 'portrait';
                                    updateVideoItem(video.id, { aspectRatio: nextAspect });
                                    notify(`Format video diubah ke: ${nextAspect === 'portrait' ? '9:16 Potret (Reel/FB)' : '16:9 Lanskap'}`);
                                  }}
                                  className={`px-2 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                                    itemAspect === 'portrait'
                                      ? 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'
                                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200'
                                  }`}
                                  title="Ubah cepat rasio frame antara Potret (9:16) dan Lanskap (16:9)"
                                >
                                  {itemAspect === 'portrait' ? (
                                    <>
                                      <Smartphone className="w-3 h-3 text-indigo-600" />
                                      <span>9:16 Potret</span>
                                    </>
                                  ) : (
                                    <>
                                      <Tv className="w-3 h-3 text-gray-500" />
                                      <span>16:9 Lanskap</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleEditVideo(video)}
                                  className="px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-medium rounded-lg flex items-center gap-1 transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteVideo(video.id, video.title)}
                                  className="px-2.5 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 font-medium rounded-lg flex items-center gap-1 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Hapus</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 2. SUB-TAB: GALERI FOTO */}
              {videoGalleryTab === 'foto' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full">
                      Dokumentasi & Kegiatan
                    </span>
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1">
                      Kelola Foto Galeri Madrasah ({gallery.length})
                    </h2>
                    <p className="text-xs text-gray-600 mt-1">
                      Dokumentasi momen belajar, ibadah, kepanduan, dan prestasi santri di beranda.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingGallery(null);
                      setGalleryForm({
                        title: '',
                        category: 'Kegiatan Belajar',
                        imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
                        description: '',
                        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                      });
                      setIsAddingGallery(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Foto Galeri</span>
                  </button>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {gallery.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 bg-white rounded-xl overflow-hidden group relative flex flex-col justify-between hover:border-[#d4af37] transition-all shadow-sm"
                    >
                      <div className="relative">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-36 object-cover" />
                        <span className="absolute top-2 left-2 text-[9px] font-bold uppercase text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>
                      
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h5 className="font-heading text-xs font-bold text-[#072217] line-clamp-2">
                            {item.title}
                          </h5>
                          {item.description && (
                            <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                          )}
                        </div>

                        <div className="pt-2.5 mt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                          <span className="text-[10px] text-gray-400">{item.date}</span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleEditGallery(item)}
                              className="px-2 py-1 text-[11px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-medium rounded-md flex items-center gap-1 transition-colors"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Hapus foto "${item.title}"?`)) {
                                  deleteGalleryItem(item.id);
                                  notify('Foto dihapus dari galeri.');
                                }
                              }}
                              className="px-2 py-1 text-[11px] text-red-600 bg-red-50 hover:bg-red-100 font-medium rounded-md flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* 3. SUB-TAB: FASILITAS & SARANA */}
              {videoGalleryTab === 'fasilitas' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full">
                      Sarana Prasarana
                    </span>
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1">
                      Kelola Fasilitas Madrasah ({facilities.length})
                    </h2>
                    <p className="text-xs text-gray-600 mt-1">
                      Tampilkan ruang kelas, laboratorium, perpustakaan, musholla, dan lapangan olahraga.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingFacility(null);
                      setFacilityForm({
                        name: '',
                        category: 'Fasilitas Belajar',
                        description: '',
                        imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
                        specificationsString: 'Ruang Representatif, Pencahayaan Nyaman, Terawat Bersih'
                      });
                      setIsAddingFacility(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Fasilitas</span>
                  </button>
                </div>

                {/* Facility Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {facilities.map((fac) => (
                    <div
                      key={fac.id}
                      className="border border-gray-200 bg-white rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#d4af37] transition-all shadow-sm group"
                    >
                      <div className="relative">
                        <img src={fac.imageUrl} alt={fac.name} className="w-full h-40 object-cover" />
                        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase text-white bg-black/60 px-2 py-0.5 rounded">
                          {fac.category}
                        </span>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-heading text-sm font-bold text-[#072217]">{fac.name}</h4>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">{fac.description}</p>
                          {fac.specifications && fac.specifications.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {fac.specifications.map((s, idx) => (
                                <span key={idx} className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                                  ✓ {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-3 mt-3 border-t border-gray-100 flex justify-end gap-2">
                          <button
                            onClick={() => handleEditFacility(fac)}
                            className="px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-medium rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus fasilitas "${fac.name}"?`)) {
                                deleteFacility(fac.id);
                                notify('Fasilitas dihapus.');
                              }
                            }}
                            className="px-2.5 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 font-medium rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* Modal Tambah / Edit Foto Galeri */}
              {(isAddingGallery || editingGallery) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                  <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#d4af37]/30 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                      <h3 className="font-heading text-base font-bold text-[#072217]">
                        {editingGallery ? 'Edit Foto Galeri' : 'Tambah Foto Kegiatan ke Galeri'}
                      </h3>
                      <button
                        onClick={() => {
                          setIsAddingGallery(false);
                          setEditingGallery(null);
                        }}
                        className="text-gray-400 hover:text-gray-700"
                      >
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

                      <div className="grid grid-cols-2 gap-3">
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
                          <label className="block font-semibold text-gray-700 mb-1">Tanggal Kegiatan</label>
                          <input
                            type="text"
                            value={galleryForm.date}
                            onChange={(e) => setGalleryForm({ ...galleryForm, date: e.target.value })}
                            placeholder="Maret 2026"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Photo Upload & Preview */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                        <label className="block font-bold text-[#072217]">Foto Dokumentasi</label>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-300 bg-emerald-950 shrink-0">
                            {galleryForm.imageUrl ? (
                              <img
                                src={galleryForm.imageUrl}
                                alt="Preview Galeri"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[9px] text-gray-400 p-1 block text-center">Kosong</span>
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 bg-[#0b3c26] text-[#f3e5ab] text-[11px] font-semibold rounded-lg hover:bg-[#072217]">
                              <Upload className="w-3 h-3" />
                              <span>Pilih File</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleGalleryFileUpload}
                                className="hidden"
                              />
                            </label>
                            <input
                              type="text"
                              value={galleryForm.imageUrl}
                              onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                              placeholder="URL foto..."
                              className="w-full px-2 py-1 border border-gray-300 rounded text-[11px]"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <FormattedTextEditor
                          id="admin-gallery-desc-editor"
                          label="Deskripsi Singkat Foto"
                          helperText="Keterangan singkat momen foto. Mendukung format tebal, miring, emoji, dan ikon."
                          rows={2}
                          value={galleryForm.description}
                          onChange={(val) => setGalleryForm({ ...galleryForm, description: val })}
                          placeholder="Tuliskan keterangan momen dokumentasi foto..."
                        />
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingGallery(false);
                            setEditingGallery(null);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0b3c26] text-[#f3e5ab] font-bold rounded-xl"
                        >
                          {editingGallery ? 'Simpan Perubahan' : 'Simpan ke Galeri'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Modal Tambah / Edit Fasilitas */}
              {(isAddingFacility || editingFacility) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                  <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#d4af37]/30 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                      <h3 className="font-heading text-base font-bold text-[#072217]">
                        {editingFacility ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
                      </h3>
                      <button
                        onClick={() => {
                          setIsAddingFacility(false);
                          setEditingFacility(null);
                        }}
                        className="text-gray-400 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveFacility} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Nama Fasilitas *</label>
                        <input
                          type="text"
                          required
                          value={facilityForm.name}
                          onChange={(e) => setFacilityForm({ ...facilityForm, name: e.target.value })}
                          placeholder="contoh: Perpustakaan Digital & Ruang Baca"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Kategori Fasilitas</label>
                        <select
                          value={facilityForm.category}
                          onChange={(e) => setFacilityForm({ ...facilityForm, category: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        >
                          <option value="Fasilitas Belajar">Fasilitas Belajar</option>
                          <option value="Fasilitas Ibadah">Fasilitas Ibadah</option>
                          <option value="Fasilitas Olahraga">Fasilitas Olahraga</option>
                          <option value="Fasilitas Sanitasi & UKS">Fasilitas Sanitasi & UKS</option>
                          <option value="Fasilitas Penunjang">Fasilitas Penunjang</option>
                        </select>
                      </div>

                      {/* Photo Upload & Preview */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                        <label className="block font-bold text-[#072217]">Foto Fasilitas</label>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-300 bg-emerald-950 shrink-0">
                            {facilityForm.imageUrl ? (
                              <img
                                src={facilityForm.imageUrl}
                                alt="Preview Fasilitas"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[9px] text-gray-400 p-1 block text-center">Kosong</span>
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 bg-[#0b3c26] text-[#f3e5ab] text-[11px] font-semibold rounded-lg hover:bg-[#072217]">
                              <Upload className="w-3 h-3" />
                              <span>Pilih File</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFacilityFileUpload}
                                className="hidden"
                              />
                            </label>
                            <input
                              type="text"
                              value={facilityForm.imageUrl}
                              onChange={(e) => setFacilityForm({ ...facilityForm, imageUrl: e.target.value })}
                              placeholder="URL foto fasilitas..."
                              className="w-full px-2 py-1 border border-gray-300 rounded text-[11px]"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Spesifikasi / Keunggulan (Pisahkan koma)</label>
                        <input
                          type="text"
                          value={facilityForm.specificationsString}
                          onChange={(e) => setFacilityForm({ ...facilityForm, specificationsString: e.target.value })}
                          placeholder="AC, Koleksi Lengkap, Meja Baca Luas, WiFi"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <FormattedTextEditor
                          id="admin-facility-desc-editor"
                          label="Deskripsi Fasilitas"
                          helperText="Penjelasan fungsi, kapasitas, dan kenyamanan fasilitas madrasah. Mendukung format tebal, miring, emoji, dan ikon."
                          rows={2}
                          value={facilityForm.description}
                          onChange={(val) => setFacilityForm({ ...facilityForm, description: val })}
                          placeholder="Penjelasan fungsi, kenyamanan, atau keunggulan fasilitas madrasah..."
                        />
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingFacility(false);
                            setEditingFacility(null);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0b3c26] text-[#f3e5ab] font-bold rounded-xl"
                        >
                          {editingFacility ? 'Simpan Perubahan' : 'Simpan Fasilitas'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* MODAL 1: TAMBAH / EDIT VIDEO GALERI */}
              {(isAddingVideo || editingVideo) && (() => {
                const detected = parseVideoUrl(videoForm.videoUrl, videoForm.thumbnailUrl);
                return (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#d4af37]/30 my-6 max-h-[92vh] overflow-y-auto">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                        <div className="flex items-center gap-2">
                          <Video className="w-5 h-5 text-[#0b3c26]" />
                          <h3 className="font-heading text-base font-bold text-[#072217]">
                            {editingVideo ? 'Edit Video Galeri' : 'Tambah Video Baru ke Galeri'}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingVideo(false);
                            setEditingVideo(null);
                          }}
                          className="text-gray-400 hover:text-gray-700 cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveVideo} className="space-y-4 text-xs">
                        {/* Video URL with detection */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="font-semibold text-gray-700">
                              Tautan / URL Video (YouTube, Facebook, atau Lainnya) *
                            </label>
                            {videoForm.videoUrl.trim() && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  detected.platform === 'youtube'
                                    ? 'bg-red-100 text-red-700'
                                    : detected.platform === 'facebook'
                                    ? 'bg-blue-100 text-blue-700'
                                    : detected.platform === 'direct'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-teal-100 text-teal-700'
                                }`}
                              >
                                Terdeteksi: {detected.platform.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <input
                            type="url"
                            required
                            value={videoForm.videoUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              setVideoForm((prev) => {
                                const p = parseVideoUrl(val, prev.thumbnailUrl);
                                return {
                                  ...prev,
                                  videoUrl: val,
                                  thumbnailUrl: !prev.thumbnailUrl && p.platform === 'youtube' ? p.thumbnailUrl : prev.thumbnailUrl
                                };
                              });
                            }}
                            placeholder="https://www.youtube.com/watch?v=... atau https://www.facebook.com/.../videos/... atau link file .mp4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3c26] focus:border-transparent"
                          />
                          <p className="text-[11px] text-gray-500 mt-1">
                            Mendukung tautan video YouTube standar, Short, embed, Facebook Watch, Reel, video Google Drive, atau link file video langsung (.mp4/.webm).
                          </p>

                          {/* Quick fill test samples */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="text-[10px] text-gray-400">Contoh Cepat:</span>
                            <button
                              type="button"
                              onClick={() => {
                                const sample = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
                                const p = parseVideoUrl(sample);
                                setVideoForm((prev) => ({
                                  ...prev,
                                  videoUrl: sample,
                                  thumbnailUrl: p.thumbnailUrl,
                                  title: prev.title || 'Dokumentasi Profil Pembiasaan Santri MI Al Ihsan'
                                }));
                              }}
                              className="px-2 py-0.5 bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-semibold rounded border border-red-200 cursor-pointer"
                            >
                              + Contoh Link YouTube
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const sample = 'https://www.facebook.com/watch/?v=10153231379946729';
                                const p = parseVideoUrl(sample);
                                setVideoForm((prev) => ({
                                  ...prev,
                                  videoUrl: sample,
                                  thumbnailUrl: p.thumbnailUrl,
                                  title: prev.title || 'Liputan Kegiatan Santri di Facebook'
                                }));
                              }}
                              className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-semibold rounded border border-blue-200 cursor-pointer"
                            >
                              + Contoh Link Facebook
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const sample = 'https://www.facebook.com/reel/10153231379946729';
                                const p = parseVideoUrl(sample);
                                setVideoForm((prev) => ({
                                  ...prev,
                                  videoUrl: sample,
                                  thumbnailUrl: p.thumbnailUrl,
                                  title: prev.title || 'Reels Santri: Hafalan & Kreativitas',
                                  aspectRatio: 'portrait'
                                }));
                              }}
                              className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-semibold rounded border border-indigo-200 cursor-pointer"
                            >
                              + Contoh FB Reel (Potret 9:16)
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Judul Video *</label>
                          <input
                            type="text"
                            required
                            value={videoForm.title}
                            onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                            placeholder="Contoh: Profil MI Ma'arif Al Ihsan Soborejo - Menuju Generasi Qurani"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3c26]"
                          />
                        </div>

                        {/* Category and Duration */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold text-gray-700 mb-1">Kategori Video</label>
                            <select
                              value={videoForm.category}
                              onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                            >
                              <option value="Profil Madrasah">Profil Madrasah</option>
                              <option value="Ibadah & Karakter">Ibadah & Karakter</option>
                              <option value="Kegiatan Belajar">Kegiatan Belajar</option>
                              <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                              <option value="Prestasi & Pentas Seni">Prestasi & Pentas Seni</option>
                              <option value="Dokumentasi PPDB">Dokumentasi PPDB</option>
                              <option value="Kajian & Keagamaan">Kajian & Keagamaan</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-semibold text-gray-700 mb-1">Estimasi Durasi (Opsional)</label>
                            <input
                              type="text"
                              value={videoForm.duration}
                              onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                              placeholder="Contoh: 04:12 atau 10 Menit"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        </div>

                        {/* Author and Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold text-gray-700 mb-1">Sumber / Pembuat Video</label>
                            <input
                              type="text"
                              value={videoForm.author}
                              onChange={(e) => setVideoForm({ ...videoForm, author: e.target.value })}
                              placeholder="Tim Media MI Ma'arif Al Ihsan"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-gray-700 mb-1">Tanggal Video</label>
                            <input
                              type="text"
                              value={videoForm.date}
                              onChange={(e) => setVideoForm({ ...videoForm, date: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        </div>

                        {/* Format / Aspect Ratio Selector */}
                        {(() => {
                          const autoDetectedRatio = detectVideoAspectRatio(videoForm.videoUrl, undefined, videoForm.title, videoForm.description);
                          return (
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="font-semibold text-gray-800 flex items-center gap-1.5">
                                  <span>Format Rasio Video (Orientasi Frame)</span>
                                </label>
                                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                                  ⚡ Otomatis: {autoDetectedRatio === 'portrait' ? '9:16 Potret (Vertikal)' : autoDetectedRatio === 'square' ? '1:1 Kotak' : '16:9 Lanskap'}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                  { value: 'auto' as VideoAspectRatio, label: 'Otomatis', icon: Sparkles, desc: `Ikuti video (${autoDetectedRatio})` },
                                  { value: 'landscape' as VideoAspectRatio, label: 'Lanskap (16:9)', icon: Tv, desc: 'YouTube / Video standar' },
                                  { value: 'portrait' as VideoAspectRatio, label: 'Potret (9:16)', icon: Smartphone, desc: 'Facebook Reel / Short' },
                                  { value: 'square' as VideoAspectRatio, label: 'Kotak (1:1)', icon: Square, desc: 'Video persegi' },
                                  { value: 'classic' as VideoAspectRatio, label: 'Klasik (4:3)', icon: Tv, desc: 'Format 4:3 (TV/Dokumentasi)' },
                                ].map((opt) => (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setVideoForm({ ...videoForm, aspectRatio: opt.value })}
                                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                                      videoForm.aspectRatio === opt.value
                                        ? 'bg-[#0b3c26] text-[#f3e5ab] border-[#0b3c26] shadow-xs'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 font-bold text-xs">
                                      <opt.icon className="w-3.5 h-3.5 shrink-0" />
                                      <span>{opt.label}</span>
                                    </div>
                                    <p className={`text-[10px] mt-0.5 line-clamp-1 ${videoForm.aspectRatio === opt.value ? 'text-gray-200' : 'text-gray-400'}`}>
                                      {opt.desc}
                                    </p>
                                  </button>
                                ))}
                              </div>

                              {autoDetectedRatio === 'portrait' && videoForm.aspectRatio === 'landscape' && (
                                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                                  ⚠️ Catatan: Video ini terdeteksi sebagai video potret (Facebook Reel / Shorts). Sebaiknya pilih <strong>Otomatis</strong> atau <strong>Potret (9:16)</strong> agar frame pemutar tidak terpotong.
                                </p>
                              )}
                            </div>
                          );
                        })()}

                        {/* Custom Thumbnail URL or upload */}
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">
                            URL Gambar Thumbnail (Sampul Video)
                          </label>
                          <input
                            type="url"
                            value={videoForm.thumbnailUrl}
                            onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })}
                            placeholder="Otomatis terisi jika YouTube, atau masukkan URL gambar kustom"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[11px] text-gray-500">Atau upload gambar sampul:</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleVideoThumbnailUpload}
                              className="text-[11px] text-gray-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-[#0b3c26] file:text-[#f3e5ab] hover:file:bg-[#072217]"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <FormattedTextEditor
                            id="admin-video-desc-editor"
                            label="Deskripsi Ringkas Video"
                            helperText="Keterangan singkat mengenai isi video dan momen kegiatan santri. Mendukung teks tebal, miring, emoji, dan ikon."
                            rows={2}
                            value={videoForm.description}
                            onChange={(val) => setVideoForm({ ...videoForm, description: val })}
                            placeholder="Tuliskan keterangan singkat mengenai isi video dan momen kegiatan..."
                          />
                        </div>

                        {/* Featured Toggle */}
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <input
                            type="checkbox"
                            id="video-featured-toggle"
                            checked={videoForm.featured}
                            onChange={(e) => setVideoForm({ ...videoForm, featured: e.target.checked })}
                            className="rounded text-[#0b3c26] focus:ring-[#0b3c26]"
                          />
                          <label htmlFor="video-featured-toggle" className="font-semibold text-gray-800 cursor-pointer">
                            Tandai sebagai Video Unggulan (Tampil dengan badge "Unggulan" di galeri)
                          </label>
                        </div>

                        {/* Live Preview Card */}
                        {videoForm.videoUrl && (() => {
                          const formEffectiveAspect = detectVideoAspectRatio(videoForm.videoUrl, videoForm.aspectRatio, videoForm.title, videoForm.description);
                          const formConfig = getVideoAspectConfig(formEffectiveAspect, formEffectiveAspect === 'portrait');
                          return (
                            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                                  Pratinjau Kartu Video:
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  Format Frame Otomatis: {formConfig.badgeLabel}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className={`rounded-lg bg-black overflow-hidden relative shrink-0 ${formConfig.effectiveAspect === 'portrait' ? 'w-12 h-20' : formConfig.effectiveAspect === 'square' ? 'w-14 h-14' : 'w-20 h-12'}`}>
                                  <img
                                    src={detected.thumbnailUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).src =
                                        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80';
                                    }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <Play className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
                                  </div>
                                </div>
                                <div className="overflow-hidden">
                                  <h5 className="font-bold text-gray-800 truncate text-xs">
                                    {videoForm.title || 'Judul Belum Diisi'}
                                  </h5>
                                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-0.5 flex-wrap">
                                    <span className="text-emerald-700 font-semibold">{detected.platform.toUpperCase()}</span>
                                    <span>• {videoForm.category}</span>
                                    {videoForm.duration && <span>• {videoForm.duration}</span>}
                                    <span className="text-indigo-600 font-semibold">• Frame: {formConfig.badgeLabel}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingVideo(false);
                              setEditingVideo(null);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
                          >
                            {editingVideo ? 'Simpan Perubahan Video' : 'Simpan Video ke Galeri'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                );
              })()}

              {/* MODAL 2: PRATINJAU VIDEO PLAYER (ADMIN) */}
              {previewingVideo && (() => {
                const autoAspect = detectVideoAspectRatio(previewingVideo.videoUrl, previewingVideo.aspectRatio, previewingVideo.title, previewingVideo.description);
                const currentSetting = adminPreviewAspect !== 'auto' ? adminPreviewAspect : autoAspect;
                const aspectConfig = getVideoAspectConfig(currentSetting, currentSetting === 'portrait');
                const parsed = parseVideoUrl(previewingVideo.videoUrl, previewingVideo.thumbnailUrl, currentSetting, previewingVideo.title, previewingVideo.description);

                return (
                  <div
                    className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in overflow-y-auto"
                    onClick={() => setPreviewingVideo(null)}
                  >
                    <div
                      className={`bg-[#072217] text-white rounded-2xl ${aspectConfig.modalMaxWidth} w-full overflow-hidden shadow-2xl border border-[#d4af37]/40 relative my-auto transition-all duration-300`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setPreviewingVideo(null)}
                        className="absolute top-3 right-3 z-30 p-2 bg-black/60 text-white hover:bg-black/80 rounded-full transition-colors cursor-pointer"
                        title="Tutup Pratinjau"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* Top Frame Control Bar */}
                      <div className="p-3 bg-black/50 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 pr-12">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                            <Sparkles className="w-3 h-3 text-[#d4af37]" />
                            <span>Frame Otomatis: <strong>{aspectConfig.badgeLabel}</strong></span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-white/50">Uji Rasio:</span>
                          <div className="inline-flex rounded-lg bg-white/10 p-0.5 border border-white/10">
                            <button
                              type="button"
                              onClick={() => setAdminPreviewAspect('portrait')}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                aspectConfig.effectiveAspect === 'portrait'
                                  ? 'bg-[#d4af37] text-[#072217] shadow-xs'
                                  : 'text-white/80 hover:text-white'
                              }`}
                            >
                              <Smartphone className="w-3 h-3" />
                              <span>9:16</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setAdminPreviewAspect('landscape')}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                aspectConfig.effectiveAspect === 'landscape'
                                  ? 'bg-[#d4af37] text-[#072217] shadow-xs'
                                  : 'text-white/80 hover:text-white'
                              }`}
                            >
                              <Tv className="w-3 h-3" />
                              <span>16:9</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setAdminPreviewAspect('square')}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                aspectConfig.effectiveAspect === 'square'
                                  ? 'bg-[#d4af37] text-[#072217] shadow-xs'
                                  : 'text-white/80 hover:text-white'
                              }`}
                            >
                              <Square className="w-3 h-3" />
                              <span>1:1</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setAdminPreviewAspect('classic')}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                aspectConfig.effectiveAspect === 'classic'
                                  ? 'bg-[#d4af37] text-[#072217] shadow-xs'
                                  : 'text-white/80 hover:text-white'
                              }`}
                            >
                              <Tv className="w-3 h-3" />
                              <span>4:3</span>
                            </button>
                          </div>

                          {previewingVideo.aspectRatio !== aspectConfig.effectiveAspect && (
                            <button
                              type="button"
                              onClick={() => {
                                updateVideoItem(previewingVideo.id, { aspectRatio: aspectConfig.effectiveAspect });
                                setPreviewingVideo({ ...previewingVideo, aspectRatio: aspectConfig.effectiveAspect });
                                notify(`Format ${aspectConfig.badgeLabel} disimpan untuk video ini!`);
                              }}
                              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-md transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                              title="Kunci format frame ini secara permanen untuk video ini"
                            >
                              <Check className="w-3 h-3" />
                              <span>Kunci Format</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Platform Info Banner */}
                      {parsed.platform === 'facebook' && (
                        <div className="px-4 py-1.5 bg-blue-950/60 border-b border-blue-500/20 text-[11px] text-blue-200 flex items-center justify-between">
                          <span>
                            ℹ️ Orientasi video Facebook disesuaikan otomatis ({aspectConfig.badgeLabel})
                          </span>
                          <a
                            href={previewingVideo.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-white shrink-0 ml-2 text-[10px]"
                          >
                            Buka di Facebook ↗
                          </a>
                        </div>
                      )}

                      {/* Video Player */}
                      <div
                        className={`relative ${aspectConfig.containerAspectClass} bg-black flex items-center justify-center overflow-hidden mx-auto shadow-inner transition-all duration-300`}
                        style={aspectConfig.containerStyle}
                      >
                        {parsed.isDirectVideo ? (
                          <video
                            controls
                            autoPlay
                            playsInline
                            poster={parsed.thumbnailUrl}
                            src={previewingVideo.videoUrl}
                            className="w-full h-full object-contain"
                          >
                            Browser tidak mendukung tag video HTML5.
                          </video>
                        ) : parsed.embedUrl ? (
                          <iframe
                            src={parsed.embedUrl}
                            title={previewingVideo.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            scrolling="no"
                            style={{ border: 'none', overflow: 'hidden', width: '100%', height: '100%' }}
                            className="w-full h-full border-0 block"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                            <Film className="w-12 h-12 text-[#d4af37] mb-2" />
                            <p className="text-sm text-gray-200 mb-3">Tautan video eksternal:</p>
                            <a
                              href={previewingVideo.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-[#d4af37] text-[#072217] font-bold text-xs rounded-xl flex items-center gap-1.5"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Buka Video di {parsed.platform.toUpperCase()}</span>
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Video Info in Preview */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#072217] bg-[#d4af37] px-2.5 py-0.5 rounded-full">
                            {previewingVideo.category}
                          </span>
                          <span className="text-xs text-white/60">• Platform: {parsed.platform.toUpperCase()}</span>
                          <span className="text-xs text-indigo-300 font-semibold">• Rasio: {aspectConfig.effectiveAspect}</span>
                          {previewingVideo.duration && (
                            <span className="text-xs text-[#f3e5ab] font-mono">• {previewingVideo.duration}</span>
                          )}
                        </div>

                        <h3 className="font-heading text-lg font-bold text-[#f3e5ab]">
                          {previewingVideo.title}
                        </h3>

                        {previewingVideo.description && (
                          <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
                            {previewingVideo.description}
                          </p>
                        )}

                        <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                          <span>Sumber: {previewingVideo.author || 'MI Al Ihsan Soborejo'}</span>
                          <button
                            type="button"
                            onClick={() => setPreviewingVideo(null)}
                            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
                          >
                            Tutup Pratinjau
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 8: KELOLA TESTIMONI & FAQ */}
          {activeTab === 'testimonials_faq' && (
            <div className="space-y-8">
              {/* SECTION A: TESTIMONI */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full">
                      Suara Wali Santri
                    </span>
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1">
                      Kelola Testimoni Wali Santri ({testimonials.length})
                    </h2>
                    <p className="text-xs text-gray-600 mt-1">
                      Ulasan nyata dari orang tua santri tentang kemajuan dan akhlak anak di MI Ihsaniyah.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingTesti(null);
                      setTestiForm({
                        name: '',
                        role: 'Wali Santri',
                        childName: '',
                        childGrade: 'Kelas 3',
                        quote: '',
                        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                      });
                      setIsAddingTesti(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Testimoni</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className="border border-gray-200 bg-white rounded-xl p-4 flex flex-col justify-between hover:border-[#d4af37] transition-all shadow-sm"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <img
                            src={t.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                            alt={t.name}
                            className="w-10 h-10 rounded-full object-cover border border-emerald-300"
                          />
                          <div>
                            <h4 className="font-bold text-xs text-[#072217]">{t.name}</h4>
                            <div className="text-[10px] text-gray-500">
                              {t.role} • Santri: <strong>{t.childName}</strong> ({t.childGrade || 'Alumni/Siswa'})
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-700 italic leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                          "{t.quote}"
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-gray-100 flex justify-end gap-2">
                        <button
                          onClick={() => handleEditTesti(t)}
                          className="px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-medium rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus testimoni dari ${t.name}?`)) {
                              deleteTestimonial(t.id);
                              notify('Testimoni dihapus.');
                            }
                          }}
                          className="px-2.5 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 font-medium rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION B: FAQ */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full">
                      Informasi & Edukasi
                    </span>
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1">
                      Tanya Jawab Umum / FAQ ({faqs.length})
                    </h2>
                    <p className="text-xs text-gray-600 mt-1">
                      Jawaban cepat untuk pertanyaan yang sering diajukan calon wali santri baru.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingFAQ(null);
                      setFaqForm({
                        category: 'Pendaftaran PPDB',
                        question: '',
                        answer: ''
                      });
                      setIsAddingFAQ(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah FAQ</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {faqs.map((f) => (
                    <div
                      key={f.id}
                      className="border border-gray-200 bg-white rounded-xl p-4 flex flex-col justify-between hover:border-[#d4af37] transition-all shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-[#0b3c26] bg-emerald-50 px-2 py-0.5 rounded">
                            {f.category}
                          </span>
                        </div>
                        <h4 className="font-heading text-xs sm:text-sm font-bold text-[#072217]">
                          {f.question}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{f.answer}</p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-gray-100 flex justify-end gap-2">
                        <button
                          onClick={() => handleEditFAQ(f)}
                          className="px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-medium rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus pertanyaan "${f.question}"?`)) {
                              deleteFAQ(f.id);
                              notify('FAQ dihapus.');
                            }
                          }}
                          className="px-2.5 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 font-medium rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Tambah / Edit Testimoni */}
              {(isAddingTesti || editingTesti) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                  <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#d4af37]/30 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                      <h3 className="font-heading text-base font-bold text-[#072217]">
                        {editingTesti ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
                      </h3>
                      <button
                        onClick={() => {
                          setIsAddingTesti(false);
                          setEditingTesti(null);
                        }}
                        className="text-gray-400 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveTesti} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Nama Orang Tua / Wali *</label>
                        <input
                          type="text"
                          required
                          value={testiForm.name}
                          onChange={(e) => setTestiForm({ ...testiForm, name: e.target.value })}
                          placeholder="contoh: H. Syamsul Arifin"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Peran / Status</label>
                          <input
                            type="text"
                            value={testiForm.role}
                            onChange={(e) => setTestiForm({ ...testiForm, role: e.target.value })}
                            placeholder="Wali Santri"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Nama Santri</label>
                          <input
                            type="text"
                            required
                            value={testiForm.childName}
                            onChange={(e) => setTestiForm({ ...testiForm, childName: e.target.value })}
                            placeholder="Ahmad Fauzan"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Kelas Santri</label>
                        <input
                          type="text"
                          value={testiForm.childGrade}
                          onChange={(e) => setTestiForm({ ...testiForm, childGrade: e.target.value })}
                          placeholder="Kelas 3 / Alumni 2024"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <FormattedTextEditor
                          id="admin-testimonial-quote-editor"
                          label="Isi Kutipan Testimoni *"
                          helperText="Ceritakan pengalaman dan kesan selama menyekolahkan anak di madrasah. Mendukung tebal, miring, emoji, dan ikon."
                          rows={3}
                          required
                          value={testiForm.quote}
                          onChange={(val) => setTestiForm({ ...testiForm, quote: val })}
                          placeholder="Ceritakan pengalaman dan kesan selama menyekolahkan anak di madrasah..."
                        />
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingTesti(false);
                            setEditingTesti(null);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0b3c26] text-[#f3e5ab] font-bold rounded-xl"
                        >
                          {editingTesti ? 'Simpan Perubahan' : 'Simpan Testimoni'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Modal Tambah / Edit FAQ */}
              {(isAddingFAQ || editingFAQ) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                  <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#d4af37]/30 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                      <h3 className="font-heading text-base font-bold text-[#072217]">
                        {editingFAQ ? 'Edit Tanya Jawab (FAQ)' : 'Tambah Tanya Jawab (FAQ) Baru'}
                      </h3>
                      <button
                        onClick={() => {
                          setIsAddingFAQ(false);
                          setEditingFAQ(null);
                        }}
                        className="text-gray-400 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveFAQ} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Kategori Pertanyaan</label>
                        <select
                          value={faqForm.category}
                          onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        >
                          <option value="Pendaftaran PPDB">Pendaftaran PPDB</option>
                          <option value="Biaya & Beasiswa">Biaya & Beasiswa</option>
                          <option value="Kurikulum & Pembelajaran">Kurikulum & Pembelajaran</option>
                          <option value="Fasilitas & Asrama">Fasilitas & Asrama</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Pertanyaan *</label>
                        <input
                          type="text"
                          required
                          value={faqForm.question}
                          onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                          placeholder="contoh: Apakah ada beasiswa untuk anak yatim/piatu?"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <FormattedTextEditor
                          id="admin-faq-answer-editor"
                          label="Jawaban Lengkap *"
                          helperText="Tuliskan jawaban yang ramah, jelas, dan solutif. Mendukung tebal, miring, garis bawah, emoji, dan ikon."
                          rows={4}
                          required
                          value={faqForm.answer}
                          onChange={(val) => setFaqForm({ ...faqForm, answer: val })}
                          placeholder="Tuliskan jawaban yang ramah, jelas, dan solutif..."
                        />
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingFAQ(false);
                            setEditingFAQ(null);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0b3c26] text-[#f3e5ab] font-bold rounded-xl"
                        >
                          {editingFAQ ? 'Simpan Perubahan' : 'Simpan FAQ'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
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

              {/* Cloud SQL Database Sync Section */}
              <div className="bg-emerald-50/90 border border-emerald-300/80 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <h3 className="font-heading text-base font-bold text-emerald-950">
                        Sinkronisasi Online Database Cloud SQL (PostgreSQL)
                      </h3>
                    </div>
                    <p className="text-xs text-emerald-900/80 leading-relaxed">
                      Status: <strong>Online & Terkoneksi</strong> (Region us-west1). Data Anda tersimpan di server cloud Google Cloud SQL dan dapat diakses dari laptop, PC kantor, maupun smartphone pengelola lainnya.
                    </p>
                    {lastSyncedAt && (
                      <p className="text-[11px] text-emerald-700 mt-1">
                        Sinkronisasi terakhir berhasil pada: <strong>{lastSyncedAt} WIB</strong>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleManualSyncCloud}
                      disabled={isSyncingCloud}
                      className="px-4 py-2.5 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                      <span>{isSyncingCloud ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
                    </button>
                    <button
                      onClick={handleRefreshFromCloud}
                      disabled={isSyncingCloud}
                      className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-[#0b3c26]" />
                      <span>Tarik Dari Cloud</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Supabase Database Panel (User requested project) */}
              <div className="bg-[#1e293b] text-white rounded-2xl p-6 border border-slate-700 shadow-xl space-y-5">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded">
                        Supabase.com Cloud Database
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Project ID: {SUPABASE_PROJECT_REF}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                      <Database className="w-5 h-5 text-emerald-400" />
                      <span>Integrasi & Pembuatan Database di Supabase.com</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Kelola 13 tabel PostgreSQL madrasah, sinkronisasi data online, dan eksekusi skema database Supabase
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <a
                      href={SUPABASE_SQL_EDITOR_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Buka SQL Editor Supabase ↗</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopySqlScript}
                      className="px-3.5 py-2 bg-slate-800 border border-slate-600 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5"
                    >
                      {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSql ? 'Tersalin!' : 'Salin Skrip SQL'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadSqlFile}
                      className="px-3.5 py-2 bg-slate-800 border border-slate-600 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      <span>Unduh File .sql</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCheckSupabaseStatus}
                      disabled={isCheckingSupabase}
                      className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isCheckingSupabase ? 'animate-spin' : ''}`} />
                      <span>{isCheckingSupabase ? 'Memeriksa...' : 'Cek Status Tabel'}</span>
                    </button>
                  </div>
                </div>

                {/* Supabase Credentials & Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-between">
                      <span>Supabase Project URL</span>
                      <span className="text-emerald-400 font-bold text-[9px] bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">Aktif</span>
                    </div>
                    <div className="font-mono text-emerald-400 select-all break-all text-[11px]">
                      {SUPABASE_URL}
                    </div>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Publishable / Anon Key</div>
                    <div className="font-mono text-slate-300 select-all truncate text-[11px]">
                      sb_publishable_d0OLXPK4PRFrG1xwcD-Rtg_infX_Qwn
                    </div>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Status Keseluruhan Tabel</div>
                      <div className="text-xs font-bold mt-0.5">
                        {supabaseHealth?.hasTables ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Tabel Supabase Aktif
                          </span>
                        ) : (
                          <span className="text-amber-400 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Menunggu Eksekusi SQL
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSyncToSupabase}
                        disabled={isSyncingSupabase}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all shadow flex items-center gap-1"
                      >
                        <Upload className={`w-3.5 h-3.5 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
                        <span>{isSyncingSupabase ? 'Menyimpan...' : 'Kirim Data'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handlePullFromSupabase}
                        disabled={isSyncingSupabase}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-medium rounded-lg transition-all flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tarik</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 13 Table Health Grid */}
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Status 13 Tabel PostgreSQL di Supabase (Public Schema):</span>
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {supabaseHealth?.tables ? Object.values(supabaseHealth.tables).filter(Boolean).length : 0} / 13 Tabel Terverifikasi
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                    {[
                      { key: 'madrasah_store', label: '1. madrasah_store (Master)' },
                      { key: 'school_profile', label: '2. school_profile' },
                      { key: 'ppdb_registrations', label: '3. ppdb_registrations' },
                      { key: 'staff_members', label: '4. staff_members (GTK)' },
                      { key: 'news_articles', label: '5. news_articles' },
                      { key: 'achievements', label: '6. achievements' },
                      { key: 'programs', label: '7. programs' },
                      { key: 'extracurriculars', label: '8. extracurriculars' },
                      { key: 'facilities', label: '9. facilities' },
                      { key: 'gallery', label: '10. gallery' },
                      { key: 'testimonials', label: '11. testimonials' },
                      { key: 'faqs', label: '12. faqs' },
                      { key: 'stats', label: '13. stats' },
                    ].map((tbl) => {
                      const isReady = Boolean(supabaseHealth?.tables && (supabaseHealth.tables as any)[tbl.key]);
                      return (
                        <div
                          key={tbl.key}
                          className={`px-2.5 py-1.5 rounded-lg border text-[11px] flex items-center justify-between gap-1.5 ${
                            isReady
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                          }`}
                        >
                          <span className="font-mono truncate">{tbl.label}</span>
                          {isReady ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Tabel aktif"></span>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-amber-400/60 shrink-0" title="Menunggu eksekusi SQL"></span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive 3-Step Guide */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-4 rounded-xl border border-slate-700/80 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Cara Membuat Seluruh Database di Supabase.com (Mudah & Cepat):</span>
                    </h4>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-medium">
                      Hanya 3 Langkah
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">1</span>
                        <span className="font-bold text-white">Buka SQL Editor</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Klik tombol <strong>"Buka SQL Editor Supabase ↗"</strong> di atas untuk langsung membuka query editor proyek Anda:
                      </p>
                      <a
                        href={SUPABASE_SQL_EDITOR_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 underline font-mono break-all"
                      >
                        supabase.com/dashboard/project/{SUPABASE_PROJECT_REF}/sql/new
                      </a>
                    </div>

                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">2</span>
                        <span className="font-bold text-white">Tempel & Klik RUN</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Klik <strong>"Salin Skrip SQL"</strong> di atas, tempelkan ke editor Supabase, lalu tekan tombol hijau <strong>"RUN"</strong> (atau Ctrl+Enter / Cmd+Enter).
                      </p>
                      <div className="text-[10px] text-slate-400">
                        Otomatis membuat 13 tabel, mengaktifkan RLS, dan memasukkan data awal.
                      </div>
                    </div>

                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">3</span>
                        <span className="font-bold text-white">Klik Kirim Data</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Kembali ke halaman ini lalu klik tombol <strong>"Cek Status Tabel"</strong> dan <strong>"Kirim Data"</strong>. Semua konten madrasah akan tersimpan di cloud Supabase!
                      </p>
                      <div className="text-[10px] text-emerald-400 font-semibold">
                        Selesai! Database Supabase Anda aktif 100%.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collapsible SQL Script Preview */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setShowSqlViewer(!showSqlViewer)}
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 font-medium"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{showSqlViewer ? 'Sembunyikan Preview Skrip SQL' : 'Lihat Skrip SQL Lengkap (13 Tabel)'}</span>
                  </button>
                  <a
                    href="/supabase_schema.sql"
                    target="_blank"
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Buka File Raw SQL (/supabase_schema.sql)</span>
                  </a>
                </div>

                {showSqlViewer && (
                  <div className="bg-black/80 rounded-xl p-4 border border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">
                        Skrip Skema Tabel Supabase (PostgreSQL 15+)
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopySqlScript}
                          className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleDownloadSqlFile}
                          className="text-[11px] text-blue-300 hover:text-white flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded"
                        >
                          <Download className="w-3 h-3" />
                          <span>Unduh</span>
                        </button>
                      </div>
                    </div>
                    <pre className="text-[10px] font-mono text-slate-300 overflow-x-auto p-3 bg-slate-950 rounded-lg max-h-72 leading-relaxed">
                      {SUPABASE_SQL_SCRIPT}
                    </pre>
                  </div>
                )}
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
