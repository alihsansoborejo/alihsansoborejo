export interface SchoolProfile {
  name: string;
  shortName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  npsn: string;
  nsm: string;
  accreditation: string;
  status?: string;
  fullAddress?: string;
  address: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  email: string;
  phone: string;
  whatsapp: string;
  headmasterName: string;
  headmasterNip: string;
  headmasterTitle: string;
  headmasterPhotoUrl?: string;
  headmasterPhotoPosition?: 'top' | 'center' | 'bottom';
  headmasterPhotoScale?: number;
  headmasterPhotoFit?: 'cover' | 'contain';
  headmasterWelcome: string[];
  history: string[];
  vision: string;
  missions: string[];
  goals: string[];
  coreValues: { title: string; desc: string; icon: string }[];
  heroTitle?: string;
  heroSubtitle?: string;
  heroBadge?: string;
  heroBannerUrl?: string;
  heroHighlights?: string[];
  heroSlides?: HeroSlide[];
  heroSliderDuration?: number; // Durasi tampil per slide dalam detik (default: 5)
  heroSliderAutoPlay?: boolean; // Putar otomatis (default: true)
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  photoUrl?: string; // Foto yang dipasang pada slide
  photoCaption?: string; // Keterangan / label foto (opsional)
  bannerUrl?: string; // Gambar latar belakang cover (opsional)
}

export interface StatItem {
  id: string;
  value: string;
  suffix?: string;
  label: string;
  detail?: string;
  order?: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string; // e.g. 'Kepala Madrasah', 'Guru Kelas 1', 'Guru PAI & Fikih', 'Guru Penjasorkes', 'Tenaga Kependidikan / TU'
  category: 'Pimpinan' | 'Guru Kelas' | 'Guru Bidang Studi' | 'Tenaga Kependidikan';
  nipOrNuptk?: string;
  education?: string; // e.g. 'S.Pd.I', 'S.Pd.'
  photoUrl?: string;
  phone?: string;
  subjects?: string;
  order?: number;
  status?: 'Aktif' | 'Tugas Belajar' | 'Cuti';
}

export interface StudentItem {
  id: string;
  nis: string;
  nisn?: string;
  name: string;
  gender: 'Laki-laki' | 'Perempuan';
  grade: 'Kelas 1' | 'Kelas 2' | 'Kelas 3' | 'Kelas 4' | 'Kelas 5' | 'Kelas 6' | string;
  classRoom?: string; // e.g. '1A', '1B', '2'
  birthPlace?: string;
  birthDate?: string; // YYYY-MM-DD
  parentName?: string;
  parentPhone?: string;
  address?: string;
  academicYear?: string; // e.g. '2024/2025'
  status: 'Aktif' | 'Lulus' | 'Pindah' | 'Mutasi';
  photoUrl?: string;
  notes?: string;
}

export interface FacilityItem {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  specifications: string[];
}

export interface ProgramItem {
  id: string;
  title: string;
  category: 'Kurikulum' | 'Keislaman' | 'Karakter' | 'Teknologi';
  iconName: string;
  shortDesc: string;
  fullDesc: string;
  highlights: string[];
  target: string;
  schedule: string;
}

export interface ExtracurricularItem {
  id: string;
  name: string;
  category: 'Keagamaan' | 'Kepanduan & Bela Diri' | 'Kesenian' | 'Olahraga & Sains';
  iconName: string;
  description: string;
  coach: string;
  schedule: string;
  achievements: string[];
  imageUrl: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  winner: string;
  category: 'Tahfidz & Keagamaan' | 'Akademik & Sains' | 'Seni & Budaya' | 'Olahraga & Kepanduan';
  level: 'Kecamatan' | 'Kabupaten Temanggung' | 'Karesidenan' | 'Provinsi Jawa Tengah';
  year: string;
  rank: string;
  description: string;
  imageUrl?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  category: 'Berita Madrasah' | 'Pengumuman' | 'Prestasi' | 'Kegiatan Siswa' | 'Artikel Parenting';
  imageUrl: string;
  summary: string;
  content: string[];
  author: string;
  readTime: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Kegiatan Belajar' | 'Fasilitas' | 'Ibadah & Karakter' | 'Ekstrakurikuler' | 'Prestasi';
  imageUrl: string;
  description: string;
  date: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  childName: string;
  childGrade: string;
  quote: string;
  avatarUrl: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'PPDB' | 'Kurikulum & Belajar' | 'Biaya' | 'Fasilitas & Layanan';
}

export interface PPDBRegistration {
  id: string;
  registrationNumber: string;
  submissionDate: string;
  studentName: string;
  nik: string;
  nisn?: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthPlace?: string;
  birthDate: string;
  targetClass?: string;
  originSchool: string; // RA / BA / TK
  parentName: string;
  parentJob?: string;
  parentPhone: string;
  email?: string;
  address: string;
  track?: string;
  quranReadingSkill?: string;
  quranSkill?: string;
  status: 'Menunggu Verifikasi' | 'Berkas Diterima' | 'Lulus Seleksi Administrasi' | 'Diterima' | 'Ditolak' | 'Perlu Perbaikan' | string;
  notes?: string;
}
