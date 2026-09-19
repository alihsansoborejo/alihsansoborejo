import { 
  SchoolProfile, 
  ProgramItem, 
  ExtracurricularItem, 
  AchievementItem, 
  NewsArticle, 
  GalleryItem, 
  VideoGalleryItem,
  TestimonialItem, 
  FAQItem,
  StaffMember,
  PPDBRegistration,
  StatItem,
  StudentItem,
  HeroSlide
} from '../types';

export const SCHOOL_PROFILE: SchoolProfile = {
  name: "MI Ma'arif & RA Al Ihsan Soborejo",
  shortName: "MI & RA Al Ihsan Soborejo",
  tagline: "Lembaga Pendidikan Satu Atap: Membina Karakter Islami, Mandiri, Cerdas, dan Berprestasi Sejak Usia Dini",
  logoUrl: "/assets/logo-maarif.svg",
  faviconUrl: "/assets/logo-maarif.svg",
  institutionType: "Lembaga Pendidikan Satu Atap (RA - MI)",
  miName: "MI Ma'arif Al Ihsan Soborejo",
  miNpsn: "60713037",
  miNsm: "111233230053",
  miAccreditation: "Terakreditasi Baik",
  raName: "RA Al Ihsan Soborejo",
  raNpsn: "69991234",
  raNsm: "101233230045",
  raAccreditation: "Terakreditasi",
  raHeadName: "SITI ROHMAH, S.Pd.I.",
  raHeadTitle: "Kepala RA Al Ihsan Soborejo",
  npsn: "60713037",
  nsm: "111233230053",
  accreditation: "Terakreditasi Baik (MI) & Terakreditasi (RA)",
  status: "Lembaga Satu Atap / Di Bawah LP Ma'arif NU",
  fullAddress: "Desa Soborejo, Kecamatan Pringsurat, Kabupaten Temanggung, Jawa Tengah 56272",
  address: "Desa Soborejo, Kecamatan Pringsurat",
  village: "Soborejo",
  district: "Pringsurat",
  regency: "Kabupaten Temanggung",
  province: "Jawa Tengah",
  postalCode: "56272",
  email: "alihsansoborejo@gmail.com",
  phone: "(0293) 710-1234",
  whatsapp: "+62 858-7654-3210",
  headmasterName: "MUIN, S.Pd.I.",
  headmasterNip: "-",
  headmasterTitle: "Kepala MI Ma'arif Al Ihsan Soborejo",
  headmasterPhotoUrl: "",
  headmasterPhotoPosition: "top",
  headmasterPhotoScale: 100,
  headmasterPhotoFit: "cover",
  headmasterWelcome: [
    "Assalamu'alaikum Warahmatullahi Wabarakatuh.",
    "Bismillahirrohmanirrohim. Alhamdulillahi rabbil 'alamin, puji syukur senantiasa kita panjatkan ke hadirat Allah SWT, serta sholawat dan salam semoga tercurah kepada junjungan kita Nabi Muhammad SAW, keluarga, sahabat, dan pengikutnya hingga akhir zaman.",
    "Selamat datang di portal informasi resmi Lembaga Pendidikan Satu Atap MI Ma'arif Al Ihsan Soborejo dan RA Al Ihsan Soborejo, Desa Soborejo, Kecamatan Pringsurat, Kabupaten Temanggung. Website ini hadir sebagai wujud transparansi, media silaturahmi, serta pusat informasi bersama bagi seluruh wali santri, calon peserta didik, dan masyarakat luas.",
    "Sebagai kesatuan lembaga pendidikan Islam satu atap di bawah naungan Lembaga Pendidikan Ma'arif NU Kabupaten Temanggung, kami menyelenggarakan jenjang pendidikan usia dini (Raudhatul Athfal / RA Al Ihsan) yang berkesinambungan langsung dengan jenjang madrasah ibtidaiyah (MI Ma'arif Al Ihsan). Sinergi satu atap ini menjamin kesinambungan pendidikan karakter islami, pembiasaan ibadah, dan tahfidz sejak usia emas hingga lulus kelas 6.",
    "Dengan dukungan asatidz dan pendidik yang penuh kasih sayang, kurikulum terpadu yang memadukan Kurikulum Merdeka, Kementerian Agama, dan Muatan Aswaja Ke-NU-an, kami berkomitmen mendampingi putra-putri tercinta bertumbuh menjadi tunas bangsa yang saleh-salehah, mandiri, cerdas, dan membanggakan.",
    "Wassalamu'alaikum Warahmatullahi Wabarakatuh."
  ],
  history: [
    "Lembaga Pendidikan Satu Atap MI Ma'arif Al Ihsan Soborejo dan RA Al Ihsan Soborejo didirikan atas prakarsa para tokoh agama, alim ulama, dan sesepuh masyarakat Desa Soborejo, Kecamatan Pringsurat, Kabupaten Temanggung, yang mendambakan hadirnya sarana pendidikan Islam terpadu yang kokoh di tengah masyarakat.",
    "Bermula dari komitmen membina anak-anak sejak usia dini di Raudhatul Athfal (RA Al Ihsan) dengan stimulasi adab dan kegembiraan belajar, kemudian dilanjutkan secara berkesinambungan di Madrasah Ibtidaiyah (MI Ma'arif Al Ihsan) tanpa perlu cemas menghadapi adaptasi lingkungan sekolah yang baru.",
    "Berakar dari cita-cita luhur mencetak generasi yang tidak hanya mahir membaca dan berhitung, tetapi juga tekun dalam sholat, gemar menghafal Al-Qur'an, berbakti kepada orang tua, serta berpegang teguh pada aqidah Ahlussunnah wal Jama'ah An-Nahdliyyah.",
    "Kini, lembaga satu atap ini terus bertumbuh dengan sarana belajar representatif yang ramah anak, program tahfidz terpadu, pembinaan seni rebana hadroh, serta pelayanan PPDB terpadu satu pintu untuk jenjang RA dan MI."
  ],
  vision: "Terbentuknya Peserta Didik yang Religius, Berakhlaqul Karimah, Cerdas, Mandiri, dan Berprestasi dari Usia Dini hingga Jenjang Ibtidaiyah",
  missions: [
    "Menumbuhkan penghayatan dan kecintaan peserta didik terhadap ajaran Islam Ahlussunnah wal Jama'ah An-Nahdliyyah sejak usia dini.",
    "Melaksanakan pembelajaran aktif, inovatif, dan bermakna yang memadukan pengasuhan ramah anak di RA serta keunggulan akademik di MI.",
    "Membiasakan amaliyah ibadah harian: sholat berjamaah, hafalan doa harian, dan Tahfidzul Qur'an secara berkelanjutan.",
    "Mengembangkan potensi motorik, seni, kognitif, dan kepemimpinan santri melalui program ekstrakurikuler yang beragam.",
    "Menyelenggarakan tata kelola lembaga satu atap yang profesional, akuntabel, dan transparan dengan sinergi aktif bersama wali santri dan masyarakat."
  ],
  goals: [
    "Santri RA lulus dengan kesiapan motorik, adab santun, kemandirian, dan dasar membaca hijaiyah serta alfabet yang matang.",
    "Lulusan RA Al Ihsan secara mulus melanjutkan pendidikan ke jenjang MI Ma'arif Al Ihsan dalam satu lingkungan asri yang akrab.",
    "Siswa MI memperoleh rata-rata nilai US minimal 80 dengan integritas, kejujuran, dan disiplin tinggi.",
    "Lulusan MI Ma'arif 100% melanjutkan ke pondok pesantren atau MTs/SMP favorit.",
    "Santri memiliki pembiasaan sholat fardhu berjamaah dan sholat dhuha serta hafal juz 30 sesuai jenjangnya.",
    "Tingkat kehadiran peserta didik dan asatidz mencapai lebih dari 98% secara konsisten."
  ],
  coreValues: [
    {
      title: "Satu Atap Bersinergi",
      desc: "Kesinambungan pendidikan tanpa putus dari jenjang prasekolah (RA) ke jenjang ibtidaiyah (MI) dalam satu visi dan lingkungan pembinaan.",
      icon: "Sparkles"
    },
    {
      title: "Religius & Aswaja",
      desc: "Ketaatan beribadah, pembiasaan sholat berjamaah, pembacaan sholawat, dan tradisi Islam berhaluan Ahlussunnah wal Jama'ah.",
      icon: "BookOpen"
    },
    {
      title: "Berakhlaqul Karimah",
      desc: "Menjunjung tinggi adab kesantunan, ta'dzim kepada guru dan orang tua, serta budi pekerti luhur dalam keseharian.",
      icon: "Heart"
    },
    {
      title: "Cerdas & Mandiri",
      desc: "Mengasah logika, literasi, numerasi, dan kecakapan motorik anak dengan metode belajar menyenangkan dan ramah anak.",
      icon: "Award"
    },
    {
      title: "Disiplin & Berprestasi",
      desc: "Membina kejujuran, ketertiban, dan daya juang untuk meraih prestasi terbaik di bidang keagamaan, sains, dan kesenian.",
      icon: "Shield"
    }
  ],
  heroTitle: "Lembaga Pendidikan Satu Atap RA & MI Ma'arif Al Ihsan Soborejo",
  heroSubtitle: "Selamat datang di website resmi Lembaga Pendidikan Satu Atap MI Ma'arif Al Ihsan Soborejo dan RA Al Ihsan Soborejo, Kecamatan Pringsurat, Kabupaten Temanggung. Membimbing putra-putri tercinta dengan kasih sayang, memadukan stimulasi usia dini yang menyenangkan dengan pendidikan dasar berkarakter Qur'ani dan berprestasi.",
  heroBadge: "Lembaga Satu Atap • RA & MI Ma'arif NU Soborejo",
  heroBannerUrl: "https://images.unsplash.com/photo-1584697964190-7bb8c5a2cbb5?q=80&w=1920&auto=format&fit=crop",
  heroHighlights: [
    "Jenjang Terpadu RA (PAUD/TK) & MI (SD Islam)",
    "Tahfidz Cilik hingga Juz 30 & Tartil",
    "Kurikulum Merdeka + Kemenag + Muatan Ke-NU-an",
    "Lingkungan Asri, Bersih & Ramah Anak"
  ],
  heroSliderDuration: 5,
  heroSliderAutoPlay: true,
  heroSlides: [
    {
      id: "slide-1",
      badge: "Lembaga Pendidikan Satu Atap • RA & MI Al Ihsan",
      title: "Membina Generasi Qur'ani, Berakhlak Mulia & Cerdas Sejak Usia Dini",
      subtitle: "Sinergi pendidikan berkesinambungan dari Raudhatul Athfal (RA Al Ihsan) hingga Madrasah Ibtidaiyah (MI Ma'arif Al Ihsan). Menjamin tumbuh kembang ananda berlangsung optimal dalam naungan nilai-nilai Ahlussunnah wal Jama'ah.",
      photoUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop",
      photoCaption: "Suasana Belajar Ceria, Nyaman & Islami di Kelas",
      bannerUrl: "https://images.unsplash.com/photo-1584697964190-7bb8c5a2cbb5?q=80&w=1920&auto=format&fit=crop"
    },
    {
      id: "slide-2",
      badge: "Jenjang Raudhatul Athfal (RA) • Usia 4 - 6 Tahun",
      title: "RA Al Ihsan Soborejo: Tumbuh Ceria, Mandiri, dan Cinta Al-Qur'an",
      subtitle: "Sentra bermain ramah anak, pengenalan huruf hijaiyah & doa harian metode ceria, stimulasi motorik halus dan kasar, serta penanaman adab islami sejak usia keemasan.",
      photoUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
      photoCaption: "Aktivitas Kreatif & Pembiasaan Doa di RA Al Ihsan",
      bannerUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1920&auto=format&fit=crop"
    },
    {
      id: "slide-3",
      badge: "Jenjang Madrasah Ibtidaiyah (MI) • Kelas 1 - 6",
      title: "MI Ma'arif Al Ihsan Soborejo: Unggul Akademik & Karakter Aswaja",
      subtitle: "Integrasi Kurikulum Merdeka dan Kurikulum Kemenag, pembiasaan sholat dhuha & dhuhur berjamaah, Tahfidz Juz 30, pramuka sako Ma'arif, dan ekstrakurikuler seni hadroh.",
      photoUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
      photoCaption: "Pembelajaran Bermakna & Prestasi Santri MI Ma'arif",
      bannerUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1920&auto=format&fit=crop"
    },
    {
      id: "slide-4",
      badge: "PPDB Online Satu Pintu • RA & MI Al Ihsan",
      title: "Penerimaan Peserta Didik Baru (PPDB) Telah Dibuka",
      subtitle: "Daftarkan putra-putri tercinta untuk Jenjang RA (Kelompok A & B) maupun Jenjang MI (Kelas 1). Layanan pendaftaran praktis, transparan, dan proses verifikasi yang ramah anak.",
      photoUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
      photoCaption: "PPDB Terpadu RA & MI Al Ihsan Soborejo",
      bannerUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1920&auto=format&fit=crop"
    }
  ]
};

export const STAFF_DATA: StaffMember[] = [
  {
    id: "staff-batch-0-1789382017558-1-3jx6n",
    name: "MUIN, S.Pd.I.",
    role: "Kepala Madrasah",
    category: "Pimpinan",
    institution: "MI",
    nipOrNuptk: "3454749650200002",
    education: "S1 PAI & S1 PGMI",
    photoUrl: "https://s.sim.siap-online.com/upload/padamu-ptk/910-00071-91000071130094.1741311176",
    phone: "+62 882-3287-9364",
    subjects: "Kepemimpinan & Aswaja Ke-NU-an",
    order: 1,
    status: "Aktif",
    serviceYears: "Mengabdi sejak 2008 (17 Tahun Pengabdian)",
    quote: "Pendidikan madrasah adalah amanah ilahi dan ladang amal jariyah. Kami mendidik dengan hati, keteladanan akhlak karimah, dan cinta kasih demi mengantar santri meraih ridho Allah SWT.",
    bio: "Memimpin MI Ma'arif Al Ihsan Soborejo dengan visi penguatan karakter Aswaja An-Nahdliyyah, integrasi kurikulum terpadu satu atap bersama RA Al Ihsan, serta penguatan hafalan Al-Qur'an Juz 30 dan kesiapan digital santri.",
    expertise: ["Manajemen Madrasah", "Pendidikan Aswaja Ke-NU-an", "Pengembangan Kurikulum", "Kepemimpinan Pendidikan"]
  },
  {
    id: "staff-batch-1-1789382017558-2-z3ugm",
    name: "FATHURAZAQ, S.Pd.I.",
    role: "Guru Kelas VI",
    category: "Guru Kelas",
    institution: "MI",
    nipOrNuptk: "6344759660200003",
    education: "S1 Pendidikan Agama Islam",
    photoUrl: "https://s.sim.siap-online.com/upload/padamu-ptk/910-00081-91000081120629.1753698299",
    phone: "+62 858-0012-5441",
    subjects: "Guru Kelas VI & Pembina Ujian",
    order: 2,
    status: "Aktif",
    serviceYears: "Mengabdi sejak 2012 (13 Tahun Pengabdian)",
    quote: "Setiap santri lahir dengan fitrah kebaikan dan keistimewaannya masing-masing. Tugas kita adalah menyalakan lentera potensi dan memupuk rasa percaya dirinya.",
    bio: "Guru Kelas VI dengan pengalaman mendalam dalam pembimbingan intensif persiapan kelulusan, pembentukan kemandirian santri, dan penguatan aqidah akhlak tingkat madrasah ibtidaiyah.",
    expertise: ["Pendampingan Asesmen Madrasah", "Literasi Sains", "Bimbingan Ibadah Praktis", "Kepramukaan"]
  },
  {
    id: "staff-batch-2-1789382017558-3-goiy1",
    name: "ATIK LESTIYANI, S.Pd.I.",
    role: "Guru Kelas III",
    category: "Guru Kelas",
    institution: "MI",
    nipOrNuptk: "2138759662300003",
    education: "S1 Pendidikan Guru MI",
    photoUrl: "https://s.sim.siap-online.com/upload/padamu-ptk/910-00081-91000081108784.1508373230",
    phone: "+62 812-7884-1711",
    subjects: "Guru Kelas III & Pembina Seni",
    order: 3,
    status: "Aktif",
    serviceYears: "Mengabdi sejak 2014 (11 Tahun Pengabdian)",
    quote: "Belajar dengan penuh kegembiraan adalah kunci agar ilmu dan adab meresap indah ke dalam sanubari putra-putri kita.",
    bio: "Wali Kelas III yang berdedikasi menciptakan suasana kelas yang interaktif, komunikatif, dan sarat nilai-nilai persaudaraan serta pembiasaan sholat berjamaah sejak dini.",
    expertise: ["Pembelajaran Tematik Terpadu", "Seni Budaya & Prakarya", "Pendidikan Karakter Ramah Anak"]
  },
  {
    id: "staff-batch-3-1789382017558-4-casuh",
    name: "LISTIANAH, S.Pd.I.",
    role: "Guru Kelas I",
    category: "Guru Kelas",
    institution: "MI",
    nipOrNuptk: "6448760662300003",
    education: "S1 Pendidikan Guru MI",
    photoUrl: "https://s.sim.siap-online.com/upload/padamu-ptk/910-00082-91000082141211.1741311004",
    phone: "+62 838-6108-9630",
    subjects: "Guru Kelas I & Transisi PAUD-MI",
    order: 4,
    status: "Aktif",
    serviceYears: "Mengabdi sejak 2013 (12 Tahun Pengabdian)",
    quote: "Kesabaran dan kelembutan adalah bahasa terbaik dalam membimbing langkah pertama santri mengenal huruf, angka, dan adab islami.",
    bio: "Guru Kelas I dengan kepiawaian mendampingi fase transisi santri dari jenjang PAUD/RA ke jenjang madrasah ibtidaiyah dengan pendekatan ramah anak dan penuh kasih sayang.",
    expertise: ["Transisi PAUD ke MI", "Literasi & Numerasi Awal", "Tahfidz Surat Pendek", "Metode Belajar Bernyanyi"]
  },
  {
    id: "staff-batch-4-1789382017558-5-1i92c",
    name: "ENI SUSMIYATI, S.Pd.I.",
    role: "Guru Kelas IV",
    category: "Guru Kelas",
    institution: "MI",
    nipOrNuptk: "20321204177001",
    education: "S1 Pendidikan Guru MI",
    photoUrl: "https://s.sim.siap-online.com/upload/padamu-ptk/203-21204-20321204177001.1508373414",
    phone: "+62 822-2518-8344",
    subjects: "Guru Kelas IV & Koordinator P5RA",
    order: 5,
    status: "Aktif",
    serviceYears: "Mengabdi sejak 2015 (10 Tahun Pengabdian)",
    quote: "Disiplin bukan tentang kekangan, melainkan cara mulia kita menghargai waktu dan mengasah anugerah akal yang Allah titipkan.",
    bio: "Guru Kelas IV yang aktif mengembangkan metode pembelajaran kolaboratif, penguatan proyek Profil Pelajar Pancasila & Rahmatan lil Alamin (P5RA), dan kepekaan sosial santri.",
    expertise: ["Kurikulum Merdeka Madrasah", "P5RA", "Pengembangan Motorik & Bakat", "Pembiasaan Sholat Dhuha"]
  },
  {
    id: "staff-batch-5-1789382017558-6-jszqg",
    name: "MUH MASTUR, S.Pd.I.",
    role: "Guru Mata Pelajaran PAI",
    category: "Guru Bidang Studi",
    institution: "MI",
    nipOrNuptk: "20321204182001",
    education: "S1 Pendidikan Guru MI",
    photoUrl: "https://s.sim.siap-online.com/upload/padamu-ptk/203-21204-20321204182001.1761876489",
    phone: "+62 813-2524-9711",
    subjects: "Pendidikan Agama Islam & Fikih",
    order: 6,
    status: "Aktif",
    serviceYears: "Mengabdi sejak 2016 (9 Tahun Pengabdian)",
    quote: "Menghidupkan sholawat dan seni hadroh adalah salah satu jalan terindah menanamkan mahabbah (cinta) kepada baginda Rasulullah SAW di dada santri.",
    bio: "Guru bidang studi Pendidikan Agama Islam dan pembina utama ekstrakurikuler seni rebana hadroh madrasah yang aktif melatih ketrampilan seni islami dan ketertiban ibadah santri.",
    expertise: ["Pendidikan Agama Islam", "Pembinaan Seni Hadroh & Rebana", "Tartil Al-Qur'an", "Kajian Kitab Fikih Dasar"]
  },
  {
    id: "staff-batch-6-1789382017558-7-b3s04",
    name: "HIDAYATU RIF'ATI ALIYAH, S.Pd.",
    role: "Guru Kelas V",
    category: "Guru Kelas",
    institution: "MI",
    nipOrNuptk: "20321204198001",
    education: "S1 Pendidikan Guru MI",
    photoUrl: "https://s.sim.siap-online.com/upload/padamu-ptk/203-21204-20321204198001.1722833749",
    phone: "+62 858-0126-4725",
    subjects: "Guru Kelas V & Literasi Bahasa",
    order: 7,
    status: "Aktif",
    serviceYears: "Mengabdi sejak 2017 (8 Tahun Pengabdian)",
    quote: "Ilmu yang membawa keberkahan lahir dari adab yang terjaga, ta'dzim kepada kedua orang tua, dan cinta kepada para asatidz.",
    bio: "Guru Kelas V yang fokus pada pembinaan daya nalar kritis santri, penguasaan literasi bahasa, dan pembiasaan sholat dhuha serta tartil Al-Qur'an harian.",
    expertise: ["Pembelajaran Tematik & Sains", "Literasi Bahasa Indonesia", "Pramuka Siaga & Penggalang", "Bimbingan Tahfidz"]
  },
  {
    id: "staff-batch-7-1789382017558-8-273f7",
    name: "ANIK SEPTIYANI",
    role: "Guru Kelas II",
    category: "Guru Kelas",
    institution: "MI",
    nipOrNuptk: "20321204105001",
    education: "Proses Pendidikan S1",
    photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    phone: "+62 813-2920-9651",
    subjects: "Guru Kelas II & Kreativitas Santri",
    order: 8,
    status: "Aktif",
    serviceYears: "Mengabdi sejak 2018 (7 Tahun Pengabdian)",
    quote: "Senyum dan sapaan hangat di gerbang madrasah adalah pembuka pintu kebahagiaan dan motivasi belajar anak sepanjang hari.",
    bio: "Pendidik penuh semangat yang berfokus pada pendampingan belajar santri jenjang awal, kebersihan lingkungan madrasah, dan pembiasaan doa harian bersama.",
    expertise: ["Kreativitas Seni Anak", "Bimbingan Belajar Siswa", "Keputrian & Adab", "Kebersihan & Kesehatan Sekolah"]
  }
];

export const STATS_DATA: StatItem[] = [];

export const SCHOOL_STATS = [
  { label: "Peserta Didik Aktif", value: "240+", unit: "Siswa-Siswi", desc: "Kelas 1 hingga Kelas 6" },
  { label: "Tenaga Pendidik & Staf", value: "16+", unit: "Ustadz/Ustadzah", desc: "Sarjana & Berkompeten" },
  { label: "Kelulusan & Lanjutan", value: "100%", unit: "Tingkat Kelulusan", desc: "Melanjutkan ke MTs/SMP Favorit" },
  { label: "Program & Ekstrakurikuler", value: "12+", unit: "Cabang Pilihan", desc: "Pengembangan Minat & Bakat" }
];

export const PROGRAMS: ProgramItem[] = [
  {
    id: "ra-tahfidz-cilik",
    title: "Tahfidz Cilik & Doa Harian RA",
    category: "PAUD & Motorik",
    institutionLevel: "RA",
    iconName: "Sparkles",
    shortDesc: "Bimbingan hafalan surat pendek Juz 'Amma, doa yaumiyah, dan hadits adab cilik dengan metode bernyanyi dan visual ceria.",
    fullDesc: "Program khusus bagi peserta didik Raudhatul Athfal (usia 4-6 tahun) untuk menanamkan kecintaan pada kalam ilahi sejak dini. Anak diajak menghafal surat Al-Fatihah hingga An-Nas, doa makan, doa tidur, doa orang tua, serta hadits kasih sayang lewat irama lagu dan gerakan motorik gembira.",
    highlights: [
      "Metode menghafal ceria (Talaqqi & Gerak Lagu)",
      "Pengenalan huruf hijaiyah berharakat secara visual",
      "Hafalan 15+ surat pendek dan doa harian anak",
      "Pentas hafalan cilik dan apresiasi bintang santri"
    ],
    target: "Lulusan RA hafal surat pendek pilihan, doa harian, dan siap membaca Al-Qur'an",
    schedule: "Setiap hari pagi saat lingkaran pembukaan RA (07.30 - 08.15 WIB)"
  },
  {
    id: "ra-sentra-kreatif",
    title: "Sentra Bermain Kreatif & Motorik Ramah Anak",
    category: "PAUD & Motorik",
    institutionLevel: "RA",
    iconName: "Palette",
    shortDesc: "Stimulasi motorik halus, motorik kasar, sentra bahan alam, balok kreatif, dan pengasuhan kemandirian.",
    fullDesc: "Menyediakan lingkungan bermain yang kaya stimulasi sensorik dan motorik. Anak-anak belajar bersosialisasi, melipat, menggunting, meronce, mewarnai, serta bermain peran yang mengasah kecerdasan emosional dan kemandirian sebelum melangkah ke jenjang sekolah dasar / MI.",
    highlights: [
      "Sentra bahan alam & eksperimen warna sederhana",
      "Sentra balok logika & rancang bangun ramah anak",
      "Stimulasi motorik kasar (senam ceria, titian seimbang)",
      "Pembiasaan adab makan mandiri dan merapikan mainan"
    ],
    target: "Kematangan motorik, kemandirian anak, dan kesiapan sosial belajar",
    schedule: "Senin s.d. Kamis (08.15 - 10.00 WIB)"
  },
  {
    id: "tahfidz",
    title: "Tahfidz & Tahsin Al-Qur'an Juz 30",
    category: "Keislaman",
    institutionLevel: "MI",
    iconName: "BookOpenCheck",
    shortDesc: "Program lanjutan membaca Al-Qur'an tartil metode Tilawati serta hafalan Juz 30 (Juz 'Amma) tuntas bertarget.",
    fullDesc: "Program unggulan jenjang Madrasah Ibtidaiyah yang melanjutkan fondasi dari RA, membimbing siswa membaca fasih bertajwid, setoran hafalan harian, dan menuntaskan Juz 30 dilengkapi munaqosyah dan wisuda tahfidz terbuka.",
    highlights: [
      "Halaqoh bimbingan intensif 1 guru : 10-12 siswa",
      "Metode membaca tartil tilawati terstandarisasi",
      "Buku mutaba'ah setoran hafalan terpantau harian",
      "Wisuda Tahfidz Juz 30 & Uji Publik berkala"
    ],
    target: "Lulusan MI hafal tuntas Juz 30 mutqin dan tartil",
    schedule: "Setiap hari sebelum jam pelajaran utama (07.00 - 07.45 WIB)"
  },
  {
    id: "kurikulum-merdeka",
    title: "Kurikulum Terpadu & Literasi Sains",
    category: "Kurikulum",
    institutionLevel: "MI",
    iconName: "GraduationCap",
    shortDesc: "Perpaduan Kurikulum Merdeka Kemendikbudristek, Kemenag, dan Muatan Lokal LP Ma'arif NU yang interaktif.",
    fullDesc: "Pendekatan pembelajaran berpusat pada anak (student-centered) yang mengasah literasi, numerasi, dan kepekaan saintifik sederhana melalui eksperimen lapangan dan pembelajaran berbasis proyek (P5RA - Profil Pelajar Pancasila Rahmatan lil 'Alamin).",
    highlights: [
      "Pembelajaran tematik berbasis proyek aplikatif",
      "Pengenalan dasar komputer & media pembelajaran digital",
      "Pojok baca kelas dan gerakan literasi 15 menit",
      "Muatan lokal Aswaja Ke-NU-an dan Bahasa Jawa halus"
    ],
    target: "Membangun nalar kritis, wawasan luas, dan kecintaan pada ilmu pengetahuan",
    schedule: "Senin s.d. Sabtu sesuai jadwal pelajaran kelas"
  },
  {
    id: "pembiasaan-ibadah",
    title: "Pembiasaan Ibadah Yaumiyah & Sholat Berjamaah",
    category: "Karakter",
    institutionLevel: "Satu Atap",
    iconName: "Sparkles",
    shortDesc: "Praktek langsung sholat dhuha berjamaah, sholat dhuhur berjamaah, hafalan doa harian, dan asmaul husna.",
    fullDesc: "Menanamkan kecintaan pada ibadah bukan hanya sebagai kewajiban teori, melainkan kebiasaan yang melekat sejak dini. Siswa dipandu berwudhu yang sempurna, melafalkan adzan, membaca wirid sesudah sholat, dan membiasakan sholat sunnah dhuha.",
    highlights: [
      "Sholat Dhuha bersama dan doa dhuha terpimpin",
      "Sholat Dhuhur berjamaah di musholla madrasah",
      "Pelatihan imam dan muadzin cilik secara bergantian",
      "Buku jurnal ibadah yaumiyah dipantau bersama orang tua"
    ],
    target: "Membentuk pribadi yang tertib sholat 5 waktu dan gemar berdoa",
    schedule: "Rutinitas harian setiap pagi dan siang waktu dhuhur"
  },
  {
    id: "bilingual-dasar",
    title: "Pengenalan Bahasa Arab & Inggris Cilik",
    category: "Teknologi",
    institutionLevel: "Satu Atap",
    iconName: "Languages",
    shortDesc: "Pembelajaran kosakata dasar bahasa Arab dan Inggris melalui lagu, cerita bergambar, dan percakapan ringan.",
    fullDesc: "Mengenalkan bahasa internasional sejak usia emas sekolah dasar dengan cara menyenangkan (fun learning). Siswa belajar kosakata seputar benda di kelas, anggota tubuh, sapaan Islami, angka, dan kalimat sederhana yang mudah diingat.",
    highlights: [
      "Mufradat harian bahasa Arab seputar aktivitas madrasah",
      "Simple daily English greetings & vocabulary",
      "Media audio visual dan kartu kosakata edukatif (flashcards)",
      "Praktik dialog sederhana antar teman"
    ],
    target: "Membangun kepercayaan diri berkomunikasi dalam bahasa Arab dan Inggris dasar",
    schedule: "Tergabung dalam muatan intrakurikuler dan jam pengayaan"
  }
];

export const PROGRAMS_DATA = PROGRAMS;

export const EXTRACURRICULARS: ExtracurricularItem[] = [
  {
    id: "pramuka-maarif",
    name: "Pramuka Sako Ma'arif NU",
    category: "Kepanduan & Bela Diri",
    iconName: "Compass",
    description: "Kegiatan kepramukaan berbasis nilai-nilai kebangsaan dan keislaman Ma'arif untuk golongan Siaga dan Penggalang.",
    coach: "Kakak Pembina Pramuka Berijazah KMD [DATA BELUM DIISI]",
    schedule: "Jum'at sore (14.00 - 16.00 WIB)",
    achievements: ["Juara Tergiat Jambore Ranting Pringsurat", "Piala Regu Berprestasi Tingkat Siaga"],
    imageUrl: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "hadroh-rebana",
    name: "Seni Rebana & Hadroh As-Syauqi",
    category: "Keagamaan",
    iconName: "Music",
    description: "Pelatihan tabuh rebana klasik dan sholawat banjari untuk memupuk kecintaan mendalam kepada Nabi Muhammad SAW.",
    coach: "Ustadz Pembina Seni Hadroh [DATA BELUM DIISI]",
    schedule: "Sabtu pagi (09.30 - 11.30 WIB)",
    achievements: ["Juara 1 Lomba Hadroh Tingkat Kecamatan", "Tampil dalam Pengajian Akbar Desa Soborejo"],
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "pagar-nusa",
    name: "Pencak Silat Pagar Nusa NU",
    category: "Kepanduan & Bela Diri",
    iconName: "ShieldAlert",
    description: "Seni bela diri warisan para ulama NU yang mengajarkan ketahanan fisik, pembelaan diri, disiplin, dan rendah hati.",
    coach: "Pelatih Resmi IPSI & Pagar Nusa Cabang Temanggung [DATA BELUM DIISI]",
    schedule: "Minggu pagi (07.30 - 09.30 WIB)",
    achievements: ["Pesilat Terbaik Usia Dini Kejurkab Temanggung", "Medali Emas Kategori Seni Tunggal"],
    imageUrl: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "kaligrafi-islam",
    name: "Seni Kaligrafi Islam (Khat)",
    category: "Kesenian",
    iconName: "Palette",
    description: "Asah ketelitian, kesabaran, dan keindahan menulis ayat-ayat suci Al-Qur'an dengan khat Naskhi dan Riq'ah.",
    coach: "Ustadzah Pembina Seni Kaligrafi [DATA BELUM DIISI]",
    schedule: "Kamis sore (14.00 - 15.30 WIB)",
    achievements: ["Juara 1 Lomba Kaligrafi PORSEMA Temanggung", "Pameran Karya Seni Pelajar Madrasah"],
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sains-cilik",
    name: "Klub Matematika & Sains Cilik",
    category: "Olahraga & Sains",
    iconName: "FlaskConical",
    description: "Eksperimen sains sederhana, permainan logika matematika, dan persiapan lomba Kompetisi Sains Madrasah (KSM).",
    coach: "Guru Pembimbing Sains Madrasah [DATA BELUM DIISI]",
    schedule: "Rabu sore (14.00 - 15.30 WIB)",
    achievements: ["Finalis KSM Cabang IPA Terintegrasi Tingkat Kabupaten", "Juara 2 Cerdas Cermat Sains MI"],
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "olahraga-futsal",
    name: "Futsal & Badminton Sehat",
    category: "Olahraga & Sains",
    iconName: "Activity",
    description: "Menjaga kebugaran jasmani, melatih sportivitas, kekompakan tim, dan kegembiraan berolahraga bersama.",
    coach: "Guru Penjasorkes Madrasah [DATA BELUM DIISI]",
    schedule: "Selasa sore (15.00 - 17.00 WIB)",
    achievements: ["Juara 3 Turnamen Futsal Antar MI se-Kawedanan", "Pemain Fairplay Terbaik"],
    imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80"
  }
];

export const ACHIEVEMENTS: AchievementItem[] = [];

export const FACILITIES_DATA = [
  {
    id: "fac-1",
    name: "Ruang Kelas Representatif & Nyaman",
    category: "Akademik",
    description: "Ruang kelas berpencahayaan alami, sirkulasi udara sejuk khas lereng pedesaan Soborejo Pringsurat, dilengkapi pojok baca ramah anak.",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    specifications: ["Kapasitas ideal 24-28 santri", "Papan tulis & media visual peraga", "Pojok baca di setiap kelas", "Suasana asri & nyaman"]
  },
  {
    id: "fac-2",
    name: "Musholla As-Salam Madrasah",
    category: "Spiritual",
    description: "Pusat pembiasaan ibadah sholat dhuha, sholat dhuhur berjamaah, tadarus Al-Qur'an, dan kajian adab ke-NU-an.",
    imageUrl: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80",
    specifications: ["Tempat wudhu bersih terpisah", "Sound system adzan & sholawat", "Koleksi mushaf Al-Qur'an", "Karpet sholat bersih"]
  },
  {
    id: "fac-3",
    name: "Perpustakaan & Pojok Literasi Cilik",
    category: "Akademik",
    description: "Menumbuhkan kegemaran membaca santri dengan koleksi ratusan buku cerita anak Islami, kisah nabi, ensiklopedia sains, dan buku kurikulum.",
    imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    specifications: ["Ratusan buku cerita & ensiklopedia", "Area baca lesehan santai", "Buku referensi pembelajaran", "Sirkulasi buku rapi"]
  },
  {
    id: "fac-4",
    name: "Laboratorium Komputer & Media ANBK",
    category: "Teknologi",
    description: "Sarana pengenalan komputer sejak dini serta persiapan pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK).",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    specifications: ["Perangkat komputer siap pakai", "Jaringan internet terarah", "Proyektor multimedia", "Didampingi ustadz pembimbing"]
  },
  {
    id: "fac-5",
    name: "Halaman Serbaguna & Lapangan Olahraga",
    category: "Olahraga",
    description: "Tempat apel pagi, senam ceria santri, upacara bendera, perkemahan pramuka sako Ma'arif, dan latihan olahraga.",
    imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80",
    specifications: ["Halaman berplester luas", "Tiang bendera & sarana olahraga", "Arena latihan bela diri Pagar Nusa", "Aman bagi anak-anak"]
  },
  {
    id: "fac-6",
    name: "Ruang UKS & Kantin Sehat Madrasah",
    category: "Kesehatan",
    description: "Pelayanan pertolongan pertama kesehatan siswa dan kantin yang menyediakan makanan halal, bersih, dan higienis.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    specifications: ["Obat-obatan dasar P3K lengkap", "Tempat tidur istirahat bersih", "Kemitraan Puskesmas Pringsurat", "Jajanan kantin halal & higienis"]
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [];
export const GALLERY_DATA = GALLERY_ITEMS;

export const INITIAL_VIDEOS: VideoGalleryItem[] = [
  {
    id: 'vid-profil-madrasah',
    title: "Profil MI Ma'arif Al Ihsan Soborejo - Menumbuhkan Karakter Santri Mandiri & Qur'ani",
    category: 'Profil Madrasah',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
    description: "Mengenal lebih dekat suasana belajar islami, pembiasaan sholat berjamaah, dan fasilitas representatif di lingkungan MI Ma'arif Al Ihsan Soborejo, Pringsurat, Temanggung.",
    date: '10 Februari 2026',
    duration: '04:12',
    author: 'Tim Media Madrasah',
    featured: true,
  },
  {
    id: 'vid-tahfidz-santri',
    title: "Muroja'ah Pagi Bersama & Ujian Tahfidz Terbuka Santri Al Ihsan",
    category: 'Ibadah & Karakter',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    description: "Kegiatan rutin pembiasaan muroja'ah hafalan surat-surat pendek dan juz 'Amma sebelum KBM dimulai demi mencetak generasi cinta Al-Qur'an sejak dini.",
    date: '18 Januari 2026',
    duration: '03:45',
    author: 'Koordinator Tahfidz',
    featured: false,
    aspectRatio: 'landscape',
  },
  {
    id: 'vid-fb-reels-santri',
    title: "Reels Santri: Hafalan Doa Harian & Sholawat Bersama di Kelas",
    category: 'Ibadah & Karakter',
    videoUrl: 'https://www.facebook.com/reel/10153231379946729',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    description: "Dokumentasi video vertikal/reels kreasi santri MI Ma'arif Al Ihsan Soborejo dalam pembiasaan doa harian dan hafalan asmaul husna sebelum kegiatan belajar mengajar dimulai.",
    date: '05 Februari 2026',
    duration: '01:00',
    author: 'Tim Media & Humas Madrasah',
    featured: true,
    aspectRatio: 'portrait',
  },
  {
    id: 'vid-hadroh-seni',
    title: 'Penampilan Seni Hadroh Rebana Santri Al Ihsan pada Peringatan Maulid Nabi',
    category: 'Prestasi & Pentas Seni',
    videoUrl: 'https://www.facebook.com/watch/?v=10153231379946729',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    description: "Dokumentasi kepiawaian santri MI Ma'arif Al Ihsan Soborejo dalam melantunkan sholawat diiringi tabuhan rebana khas Nahdlatul Ulama.",
    date: '25 Desember 2025',
    duration: '05:20',
    author: 'Pembina Seni & Budaya',
    featured: false,
    aspectRatio: 'landscape',
  },
  {
    id: 'vid-pramuka-kemah',
    title: 'Keseruan Kemah Bakti & Persami Pramuka Penggalang MI Al Ihsan Soborejo',
    category: 'Ekstrakurikuler',
    videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    description: 'Menumbuhkan jiwa kemandirian, kedisiplinan, kekompakan, dan kecintaan pada alam melalui latihan kepanduan Hizbul Wathan / Gerakan Pramuka.',
    date: '14 November 2025',
    duration: '06:10',
    author: 'Kwartir Ranting Pringsurat',
    featured: false,
    aspectRatio: 'landscape',
  },
];
export const VIDEOS_DATA = INITIAL_VIDEOS;

export const NEWS_ARTICLES: NewsArticle[] = [];
export const NEWS_DATA: NewsArticle[] = [];
export const INITIAL_NEWS = NEWS_DATA;
export const FACILITIES = FACILITIES_DATA;

export const TESTIMONIALS: TestimonialItem[] = [];

export const TESTIMONIALS_DATA = TESTIMONIALS;

export const FAQ_LIST: FAQItem[] = [
  {
    id: "faq-satu-atap",
    question: "Apakah RA Al Ihsan dan MI Ma'arif Al Ihsan berada dalam satu atap?",
    answer: "Ya, betul. RA Al Ihsan Soborejo dan MI Ma'arif Al Ihsan Soborejo adalah lembaga pendidikan satu atap di bawah naungan LP Ma'arif NU di Desa Soborejo, Kec. Pringsurat. Sinergi ini memudahkan orang tua karena putra-putrinya dapat melanjutkan pendidikan dari jenjang prasekolah (RA) ke madrasah ibtidaiyah (MI) dalam lingkungan yang terpadu dan berkesinambungan.",
    category: "Kurikulum & Belajar"
  },
  {
    id: "faq-ra-age",
    question: "Berapa ketentuan usia masuk santri di RA Al Ihsan Soborejo?",
    answer: "Untuk Kelompok A diperuntukkan bagi anak usia 4 sampai 5 tahun. Sedangkan untuk Kelompok B diperuntukkan bagi anak usia 5 sampai 6 tahun. Pendekatan pembelajaran di RA kami menitikberatkan pada bermain sambil belajar, pengenalan adab islami, doa harian, dan stimulasi motorik ramah anak.",
    category: "PPDB"
  },
  {
    id: "faq-1",
    question: "Berapa batas usia minimal calon peserta didik baru kelas 1 MI?",
    answer: "Usia minimal calon peserta didik kelas 1 MI adalah 6 tahun pada tanggal 1 Juli tahun berjalan. Untuk anak berusia 5 tahun 6 bulan s.d. 6 tahun dapat dipertimbangkan apabila memiliki kematangan psikologis dan kesiapan belajar (lulusan RA Al Ihsan atau TK mitra).",
    category: "PPDB"
  },
  {
    id: "faq-transisi",
    question: "Apakah lulusan RA Al Ihsan mendapat prioritas saat masuk MI Ma'arif Al Ihsan?",
    answer: "Tentu saja. Sebagai lembaga satu atap, lulusan RA Al Ihsan Soborejo mendapatkan prioritas penerimaan langsung di MI Ma'arif Al Ihsan Soborejo tanpa biaya pendaftaran ulang ganda serta kemudahan adaptasi lingkungan belajar.",
    category: "PPDB"
  },
  {
    id: "faq-2",
    question: "Apakah siswa yang belum lancar membaca dan mengaji tetap bisa mendaftar?",
    answer: "Tentu saja sangat bisa. Di RA maupun MI Al Ihsan Soborejo, kami menyediakan program bimbingan membaca intensif dan mengaji iqro/tilawati dalam kelompok kecil dengan pendekatan asatidz yang sabar dan menyenangkan.",
    category: "PPDB"
  },
  {
    id: "faq-3",
    question: "Bagaimana integrasi kurikulum di MI Ma'arif Al Ihsan Soborejo?",
    answer: "Madrasah mengintegrasikan Kurikulum Merdeka dari Kemendikbudristek untuk mata pelajaran umum, Kurikulum Kementerian Agama (Kemenag) untuk rumpun PAI (Aqidah Akhlak, Fiqih, Al-Qur'an Hadits, SKI, Bahasa Arab), serta Muatan Lokal Ke-NU-an / Aswaja dari LP Ma'arif NU.",
    category: "Kurikulum & Belajar"
  },
  {
    id: "faq-4",
    question: "Berapa jam belajar peserta didik setiap harinya?",
    answer: "Untuk RA Al Ihsan: 07.30 - 10.30 WIB. Untuk MI Ma'arif Al Ihsan: Dimulai pukul 07.00 WIB (diawali sholat dhuha dan tadarus), kelas 1-2 hingga 11.30 WIB, kelas 3-6 hingga 13.30 WIB setelah sholat dhuhur berjamaah. Khusus hari Jumat pulang pukul 11.00 WIB.",
    category: "Kurikulum & Belajar"
  },
  {
    id: "faq-5",
    question: "Apakah tersedia beasiswa atau keringanan biaya?",
    answer: "Ya, kami berkomitmen agar seluruh anak bangsa dapat mengenyam pendidikan layak. Tersedia Program Indonesia Pintar (PIP) Kemenag, Beasiswa Santri Yatim/Piatu, Beasiswa Prestasi Tahfidz, dan subsidi infaq bagi keluarga yang membutuhkan.",
    category: "Biaya"
  },
  {
    id: "faq-6",
    question: "Bagaimana cara mendaftar PPDB secara online melalui website ini?",
    answer: "Cukup klik tombol 'Daftar PPDB Online' di menu atas, pilih jenjang (RA Al Ihsan atau MI Ma'arif Al Ihsan), lengkapi data calon santri dan kontak orang tua, lalu simpan kode registrasi Anda. Panitia PPDB kami akan segera menghubungi via WhatsApp untuk proses verifikasi berkas.",
    category: "PPDB"
  }
];

export const FAQ_DATA = FAQ_LIST;

export const PRAYER_SCHEDULE = [
  { name: 'Subuh', time: '04:28 WIB' },
  { name: 'Dhuha', time: '06:05 WIB' },
  { name: 'Dzuhur', time: '11:52 WIB' },
  { name: 'Ashar', time: '15:08 WIB' },
  { name: 'Maghrib', time: '17:58 WIB' },
  { name: 'Isya', time: '19:09 WIB' },
];

export const SCHOOL_INFO = {
  name: "MI Ma'arif & RA Al Ihsan Soborejo",
  shortName: "MI & RA Al Ihsan Soborejo",
  institutionType: "Lembaga Pendidikan Satu Atap (RA - MI)",
  slogan: "Membina Generasi yang Religius, Berakhlaqul Karimah, Cerdas, dan Berprestasi Sejak Usia Dini",
  description: "Lembaga Pendidikan Satu Atap (Raudhatul Athfal & Madrasah Ibtidaiyah) di bawah LP Ma'arif NU di Desa Soborejo, Kec. Pringsurat, Kab. Temanggung yang berkomitmen membentuk tunas bangsa yang religius, berakhlak mulia, cerdas, dan berprestasi.",
  address: "Desa Soborejo, Kec. Pringsurat, Kab. Temanggung, Jawa Tengah 56272",
  phone: "(0293) 710-1234",
  whatsapp: "+62 858-7654-3210",
  email: "alihsansoborejo@gmail.com",
  npsn: "60713037",
  nsm: "111233230053",
  raNpsn: "69991234",
  raNsm: "101233230045",
  accreditation: "Terakreditasi Baik (MI) & Terakreditasi (RA)",
  established: "Madrasah Ma'arif Temanggung",
};

export const PPDB_FLOW_STEPS = [
  {
    step: "01",
    title: "Pilih Jenjang & Pendaftaran Online",
    desc: "Mengisi formulir registrasi online untuk pilihan jenjang RA Al Ihsan (Kelompok A/B) atau MI Ma'arif Al Ihsan (Kelas 1) di website ini atau datang ke madrasah."
  },
  {
    step: "02",
    title: "Verifikasi Dokumen & Silaturahmi",
    desc: "Menyerahkan fotokopi KK, Akta Kelahiran, dan Ijazah RA/TK (untuk pendaftar MI). Dilanjutkan silaturahmi ramah anak pengenalan madrasah."
  },
  {
    step: "03",
    title: "Observasi Ceria & Pemetaan Kesiapan",
    desc: "Bukan tes gugur yang menegangkan, melainkan observasi ramah anak mengenai minat, kematangan motorik, dan pengenalan huruf hijaiyah/alfabet."
  },
  {
    step: "04",
    title: "Pengumuman & Pembagian Perlengkapan",
    desc: "Menerima surat bukti penerimaan resmi, pembagian perlengkapan seragam, serta pengarahan Masa Ta'aruf Siswa Madrasah (MATSAMA)."
  }
];

export const INITIAL_PPDB_REGISTRATIONS: PPDBRegistration[] = [];

export const INITIAL_STUDENTS: StudentItem[] = [];


