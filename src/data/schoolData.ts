import { 
  SchoolProfile, 
  ProgramItem, 
  ExtracurricularItem, 
  AchievementItem, 
  NewsArticle, 
  GalleryItem, 
  TestimonialItem, 
  FAQItem,
  StaffMember,
  PPDBRegistration,
  StatItem,
  StudentItem
} from '../types';

export const SCHOOL_PROFILE: SchoolProfile = {
  name: "MI Ma'arif Al Ihsan Soborejo",
  shortName: "MI Al Ihsan Soborejo",
  tagline: "Mencetak Peserta Didik yang Religius, Berakhlaqul Karimah, Cerdas, dan Berprestasi",
  logoUrl: "/assets/logo-maarif.svg",
  npsn: "60713037",
  nsm: "111233230053",
  accreditation: "Terakreditasi Baik",
  status: "Swasta / Di Bawah LP Ma'arif NU",
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
  headmasterTitle: "Kepala Madrasah Ibtidaiyah Ma'arif Al Ihsan Soborejo",
  headmasterPhotoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
  headmasterPhotoPosition: "top",
  headmasterPhotoScale: 100,
  headmasterPhotoFit: "cover",
  headmasterWelcome: [
    "Assalamu'alaikum Warahmatullahi Wabarakatuh.",
    "Bismillahirrohmanirrohim. Alhamdulillahi rabbil 'alamin, puji syukur senantiasa kita panjatkan ke hadirat Allah SWT, serta sholawat dan salam semoga tercurah kepada junjungan kita Nabi Muhammad SAW, keluarga, sahabat, dan pengikutnya hingga akhir zaman.",
    "Selamat datang di portal informasi resmi MI Ma'arif Al Ihsan Soborejo, Desa Soborejo, Kecamatan Pringsurat, Kabupaten Temanggung. Website ini hadir sebagai wujud transparansi, media silaturahmi, serta pusat informasi bagi seluruh orang tua, calon peserta didik, dan masyarakat luas.",
    "Sebagai lembaga pendidikan dasar Islam di bawah naungan Lembaga Pendidikan Ma'arif NU Kabupaten Temanggung, kami berkomitmen teguh menghadirkan pendidikan yang seimbang antara kematangan spiritual, keluhuran akhlak, kecerdasan intelektual, serta keterampilan hidup.",
    "Dengan dukungan tenaga pendidik yang berdedikasi tinggi, kurikulum terpadu yang memadukan Kurikulum Merdeka, Kementerian Agama, dan Muatan Ke-NU-an, kami siap mendampingi putra-putri tercinta bertumbuh menjadi tunas bangsa yang saleh, cerdas, dan membanggakan.",
    "Wassalamu'alaikum Warahmatullahi Wabarakatuh."
  ],
  history: [
    "MI Ma'arif Al Ihsan Soborejo didirikan atas prakarsa para tokoh agama, alim ulama, dan sesepuh masyarakat Desa Soborejo, Kecamatan Pringsurat, Kabupaten Temanggung, yang mendambakan hadirnya sarana pendidikan dasar Islam yang kokoh di tengah masyarakat pedesaan.",
    "Berakar dari cita-cita luhur mencetak generasi yang tidak hanya mahir membaca dan berhitung, tetapi juga tekun dalam sholat, berbakti kepada orang tua, serta memiliki pemahaman aqidah Ahlussunnah wal Jama'ah An-Nahdliyyah.",
    "Seiring berjalannya waktu, madrasah terus berbenah secara fisik maupun mutu akademik: menambah sarana kelas yang representatif, memperkuat program Tahfidzul Qur'an, membina seni hadroh rebana, dan mengintegrasikan pembelajaran interaktif ramah anak."
  ],
  vision: "Terbentuknya Peserta Didik yang Religius, Berakhlaqul Karimah, Cerdas, dan Berprestasi",
  missions: [
    "Menumbuhkan penghayatan siswa terhadap ajaran Agama Islam",
    "Melaksanakan pembelajaran profesional dan bermakna yang menumbuhkan dan mengembangkan siswa bernilai UN di atas rata-rata",
    "Melaksanakan program bimbingan secara efektif sehingga setiap siswa berkembang secara optimal sesuai dengan potensi yang dimiliki",
    "Menumbuhkan dan mengembangkan pembiasaan religius, jujur, disiplin, cerdas, dan peduli lingkungan dan sosial di lingkungan madrasah.",
    "Melaksanakan pengelolaan madrasah dengan manajemen partisipatif dengan melibatkan seluruh warga madrasah dan kelompok kepentingan.",
    "Melaksanakan pembelajaran ekstrakurikuler secara efektif sesuai bakat dan minat"
  ],
  goals: [
    "Dalam Ujian, siswa memperoleh nilai rata-rata US minimal 80 yang diperoleh dengan cara jujur dan disiplin.",
    "Lulusan Madrasah 100 % melanjutkan ke Sekolah/madrasah yang lebih tinggi.",
    "Siswa memiliki kebiasaan salat dhuha dan salat wajib dengan berjamaah.",
    "Tingkat kedisplinan siswa dalam kehadiran ke sekolah mencapai 99%.",
    "Pada tahun pelajaran mendatang kegiatan pembelajaran 99% tepat waktu.",
    "Lulusan Madrasah dapat diterima di SMPN/MTsN Favorit",
    "Meningkatkan hasil ujian 0.5 dari tahun sebelumnya",
    "Menjadi juara kepramukaan tingkat kabupaten"
  ],
  coreValues: [
    {
      title: "Religius",
      desc: "Ketaatan dalam beribadah, pembiasaan sholat dhuha & dhuhur berjamaah, serta pengamalan ajaran Islam berhaluan Aswaja.",
      icon: "BookOpen"
    },
    {
      title: "Berakhlaqul Karimah",
      desc: "Menjunjung tinggi adab kesantunan, ta'dzim kepada orang tua dan guru, serta kepedulian sosial di lingkungan madrasah.",
      icon: "Heart"
    },
    {
      title: "Cerdas",
      desc: "Menguasai literasi, numerasi, dan wawasan ilmu pengetahuan umum serta sains dengan pola pikir kritis dan kreatif.",
      icon: "Award"
    },
    {
      title: "Berprestasi",
      desc: "Semangat tinggi meraih keunggulan akademik maupun non-akademik di tingkat kecamatan, kabupaten, hingga provinsi.",
      icon: "Sparkles"
    },
    {
      title: "Disiplin & Jujur",
      desc: "Integritas tinggi dalam kehadiran, kepatuhan tata tertib, serta kejujuran dalam menuntut ilmu dan ujian.",
      icon: "Shield"
    }
  ],
  heroTitle: "Mencetak Peserta Didik yang Religius, Berakhlaqul Karimah, Cerdas, dan Berprestasi",
  heroSubtitle: "Selamat datang di website resmi MI Ma'arif Al Ihsan Soborejo, Kecamatan Pringsurat, Kabupaten Temanggung. Berkomitmen menyelenggarakan pendidikan dasar Islam yang bermakna dan berkarakter, menumbuhkan penghayatan ajaran agama, keluhuran budi pekerti, serta membina kecerdasan dan prestasi setiap peserta didik secara optimal.",
  heroBadge: "LP Ma'arif NU Temanggung • Soborejo, Pringsurat",
  heroBannerUrl: "https://images.unsplash.com/photo-1584697964190-7bb8c5a2cbb5?q=80&w=1920&auto=format&fit=crop",
  heroHighlights: [
    "Tahfidz Juz 30 & Tartil",
    "Kurikulum Merdeka + Kemenag",
    "Karakter Aswaja An-Nahdliyyah",
    "Lingkungan Asri & Ramah Anak"
  ]
};

export const STAFF_DATA: StaffMember[] = [
  {
    id: "staff-1",
    name: "MUIN, S.Pd.I.",
    role: "Kepala Madrasah",
    category: "Pimpinan",
    nipOrNuptk: "-",
    education: "S.Pd.I",
    photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    phone: "085876543210",
    subjects: "Manajerial & Supervisi Pendidikan",
    order: 1,
    status: "Aktif"
  },
  {
    id: "staff-2",
    name: "Siti Fatimah, S.Pd.",
    role: "Guru Kelas 1",
    category: "Guru Kelas",
    nipOrNuptk: "-",
    education: "S.Pd.",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    phone: "",
    subjects: "Tematik Terpadu & Calistung Ramah Anak",
    order: 2,
    status: "Aktif"
  },
  {
    id: "staff-3",
    name: "Ahmad Fauzi, S.Pd.I.",
    role: "Guru Kelas 2",
    category: "Guru Kelas",
    nipOrNuptk: "-",
    education: "S.Pd.I",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    phone: "",
    subjects: "Tematik Terpadu & Pembiasaan Sholat",
    order: 3,
    status: "Aktif"
  },
  {
    id: "staff-4",
    name: "Nur Hidayah, S.Pd.",
    role: "Guru Kelas 3",
    category: "Guru Kelas",
    nipOrNuptk: "-",
    education: "S.Pd.",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    phone: "",
    subjects: "Tematik Terpadu & Literasi Dasar",
    order: 4,
    status: "Aktif"
  },
  {
    id: "staff-5",
    name: "Muhammad Ridwan, S.Pd.",
    role: "Guru Kelas 4",
    category: "Guru Kelas",
    nipOrNuptk: "-",
    education: "S.Pd.",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    phone: "",
    subjects: "Tematik Terpadu & Eksplorasi Sains",
    order: 5,
    status: "Aktif"
  },
  {
    id: "staff-6",
    name: "Umi Kulsum, S.Pd.I.",
    role: "Guru Kelas 5",
    category: "Guru Kelas",
    nipOrNuptk: "-",
    education: "S.Pd.I",
    photoUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80",
    phone: "",
    subjects: "Tematik Terpadu & Keputrian / Aswaja",
    order: 6,
    status: "Aktif"
  },
  {
    id: "staff-7",
    name: "Budi Santoso, S.Pd.",
    role: "Guru Kelas 6",
    category: "Guru Kelas",
    nipOrNuptk: "-",
    education: "S.Pd.",
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80",
    phone: "",
    subjects: "Tematik Terpadu & Pemantapan Ujian Madrasah",
    order: 7,
    status: "Aktif"
  },
  {
    id: "staff-8",
    name: "Ustadz Hasan Basri, S.Pd.I.",
    role: "Guru PAI & Pembina Tahfidz",
    category: "Guru Bidang Studi",
    nipOrNuptk: "-",
    education: "S.Pd.I",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    phone: "",
    subjects: "Al-Qur'an Hadits, Aqidah Akhlak, Fiqih, Tahfidz",
    order: 8,
    status: "Aktif"
  },
  {
    id: "staff-9",
    name: "Ustadzah Siti Khadijah, S.Pd.I.",
    role: "Guru Bahasa Arab & SKI",
    category: "Guru Bidang Studi",
    nipOrNuptk: "-",
    education: "S.Pd.I",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    phone: "",
    subjects: "Bahasa Arab & Sejarah Kebudayaan Islam",
    order: 9,
    status: "Aktif"
  },
  {
    id: "staff-10",
    name: "Slamet Riyadi, S.Pd.",
    role: "Guru PJOK / Olahraga",
    category: "Guru Bidang Studi",
    nipOrNuptk: "-",
    education: "S.Pd.",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    phone: "",
    subjects: "Pendidikan Jasmani, Olahraga & Kesehatan (PJOK)",
    order: 10,
    status: "Aktif"
  },
  {
    id: "staff-12",
    name: "Agus Supriyadi, S.Kom.",
    role: "Operator Madrasah & Data EMIS",
    category: "Tenaga Kependidikan",
    nipOrNuptk: "-",
    education: "S.Kom.",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    phone: "",
    subjects: "Pendataan EMIS, SIMPATIKA, VervalPD & Asesmen Nasional",
    order: 11,
    status: "Aktif"
  },
  {
    id: "staff-13",
    name: "Sri Wahyuni, A.Md.",
    role: "Bendahara & Administrasi TU",
    category: "Tenaga Kependidikan",
    nipOrNuptk: "-",
    education: "A.Md.",
    photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
    phone: "",
    subjects: "Administrasi Persuratan & Keuangan Madrasah",
    order: 12,
    status: "Aktif"
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
    id: "tahfidz",
    title: "Tahfidz & Tahsin Al-Qur'an",
    category: "Keislaman",
    iconName: "BookOpenCheck",
    shortDesc: "Program bimbingan membaca Al-Qur'an dengan metode tartil Tilawati/Iqro serta hafalan Juz 30 (Juz 'Amma) bertarget.",
    fullDesc: "Program unggulan yang dirancang untuk membimbing siswa-siswi sejak dini agar mampu membaca Al-Qur'an secara fasih, benar sesuai kaidah tajwid, dan menuntaskan hafalan surat-surat pendek pada Juz 30. Dilengkapi wisuda tahfidz tahunan sebagai apresiasi.",
    highlights: [
      "Bimbingan halaqoh kecil 1 guru : 10-12 siswa",
      "Metode membaca tartil terstandarisasi",
      "Setoran mutaba'ah hafalan harian dan pekanan",
      "Wisuda Tahfidz Juz 30 & Uji Publik berkala"
    ],
    target: "Lulusan hafal minimal Juz 30 secara mutqin dan tartil",
    schedule: "Setiap hari sebelum jam pelajaran utama (07.00 - 07.45 WIB)"
  },
  {
    id: "kurikulum-merdeka",
    title: "Kurikulum Terpadu & Literasi Sains",
    category: "Kurikulum",
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

export const NEWS_ARTICLES: NewsArticle[] = [];
export const NEWS_DATA: NewsArticle[] = [];
export const INITIAL_NEWS = NEWS_DATA;
export const FACILITIES = FACILITIES_DATA;

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "testi-1",
    name: "Wali Murid Santri Kelas 4",
    role: "Wali Murid MI Ma'arif Al Ihsan",
    childName: "Santri Al Ihsan",
    childGrade: "Kelas 4",
    quote: "Alhamdulillah, sejak sekolah di MI Ma'arif Al Ihsan Soborejo, anak saya terbiasa sholat dhuha dan sholat berjamaah tanpa harus disuruh. Ustadz dan ustadzahnya sangat telaten mendidik akhlakul karimah.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "testi-2",
    name: "Ibu Wali Santri Kelas 1",
    role: "Wali Murid Kelas 1",
    childName: "Santriwati Cilik",
    childGrade: "Kelas 1",
    quote: "Awalnya khawatir anak cemas masuk madrasah, ternyata para guru di MI Al Ihsan Soborejo menyambut dengan suasana ramah anak yang menyenangkan. Anak selalu bersemangat ke sekolah.",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "testi-3",
    name: "Tokoh Masyarakat & Komite Madrasah",
    role: "Komite & Tokoh Agama Desa Soborejo",
    childName: "Warga Desa Soborejo",
    childGrade: "Alumni & Masyarakat",
    quote: "MI Ma'arif Al Ihsan Soborejo adalah amanah kebanggaan warga Desa Soborejo. Pendidikan karakter Ahlussunnah wal Jama'ah terbukti membimbing anak-anak menjadi generasi yang sholih, cerdas, dan santun.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
  }
];

export const TESTIMONIALS_DATA = TESTIMONIALS;

export const FAQ_LIST: FAQItem[] = [
  {
    id: "faq-1",
    question: "Berapa batas usia minimal calon peserta didik baru kelas 1?",
    answer: "Usia minimal calon peserta didik kelas 1 adalah 6 tahun pada tanggal 1 Juli tahun berjalan. Untuk anak berusia 5 tahun 6 bulan s.d. 6 tahun dapat dipertimbangkan apabila memiliki kematangan psikologis dan kesiapan belajar (disertai rekomendasi tertulis dari RA/TK asal atau psikolog).",
    category: "PPDB"
  },
  {
    id: "faq-2",
    question: "Apakah siswa yang belum lancar membaca dan mengaji tetap bisa mendaftar?",
    answer: "Tentu saja sangat bisa. Di MI Ma'arif Al Ihsan Soborejo, kami menyediakan program bimbingan membaca intensif dan bimbingan mengaji iqro/tilawati sejak hari pertama sekolah dalam kelompok kecil dengan pendekatan yang sabar dan menyenangkan.",
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
    answer: "Kegiatan dimulai pukul 07.00 WIB diawali sholat dhuha dan tadarus Al-Qur'an. Pembelajaran kelas 1-2 berlangsung hingga pukul 11.30 WIB. Untuk kelas 3-6 berlangsung hingga pukul 13.30 WIB setelah sholat dhuhur berjamaah. Khusus hari Jumat pulang pukul 11.00 WIB.",
    category: "Kurikulum & Belajar"
  },
  {
    id: "faq-5",
    question: "Apakah tersedia beasiswa atau keringanan biaya?",
    answer: "Ya, kami berkomitmen agar seluruh anak bangsa dapat mengenyam pendidikan layak. Tersedia Program Indonesia Pintar (PIP) Kemenag, Beasiswa Santri Yatim/Piatu, Beasiswa Prestasi Tahfidz, dan subsidi infaq dari donatur madrasah bagi yang berhak.",
    category: "Biaya"
  },
  {
    id: "faq-6",
    question: "Bagaimana cara mendaftar secara online melalui website ini?",
    answer: "Cukup klik tombol 'Daftar PPDB Online' di menu atas, isi data diri calon siswa dan nomor kontak orang tua pada formulir online, lalu simpan kode registrasi Anda. Tim panitia kami akan segera menghubungi via WhatsApp untuk proses verifikasi sederhana.",
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
  name: "MI Ma'arif Al Ihsan Soborejo",
  shortName: "MI Al Ihsan Soborejo",
  slogan: "Membentuk Generasi yang Religius, Berakhlaqul Karimah, Cerdas, dan Berprestasi",
  description: "Lembaga pendidikan dasar Islam di bawah LP Ma'arif NU di Desa Soborejo, Kec. Pringsurat, Kab. Temanggung yang berkomitmen membentuk tunas bangsa yang religius, berakhlak mulia, cerdas, dan berprestasi.",
  address: "Desa Soborejo, Kec. Pringsurat, Kab. Temanggung, Jawa Tengah 56272",
  phone: "(0293) 710-1234",
  whatsapp: "+62 858-7654-3210",
  email: "alihsansoborejo@gmail.com",
  npsn: "60713037",
  nsm: "111233230053",
  accreditation: "Terakreditasi Baik",
  established: "Madrasah Ma'arif Temanggung",
};

export const PPDB_FLOW_STEPS = [
  {
    step: "01",
    title: "Pendaftaran Online / Langsung",
    desc: "Mengisi formulir registrasi online di website ini atau datang langsung ke ruang sekretariat PPDB MI Al Ihsan Soborejo."
  },
  {
    step: "02",
    title: "Verifikasi Dokumen & Silaturahmi",
    desc: "Menyerahkan fotokopi KK, Akta Kelahiran, dan Ijazah RA/TK. Dilanjutkan silaturahmi ringan pengenalan madrasah bersama calon siswa."
  },
  {
    step: "03",
    title: "Pemetaan Kesiapan Belajar",
    desc: "Bukan tes seleksi gugur, melainkan pemetaan ramah anak mengenai minat, kemampuan dasar motorik, dan pengenalan huruf hijaiyah/alfabet."
  },
  {
    step: "04",
    title: "Pengumuman & Daftar Ulang",
    desc: "Menerima surat tanda bukti penerimaan, pembagian paket seragam madrasah, dan pengarahan Masa Ta'aruf Siswa Madrasah (MATSAMA)."
  }
];

export const INITIAL_PPDB_REGISTRATIONS: PPDBRegistration[] = [];

export const INITIAL_STUDENTS: StudentItem[] = [
  {
    id: 'std-2024-001',
    nis: '2024001',
    nisn: '3128475921',
    name: 'Ahmad Fauzan Al-Banjari',
    gender: 'Laki-laki',
    grade: 'Kelas 1',
    classRoom: '1',
    birthPlace: 'Temanggung',
    birthDate: '2018-04-12',
    parentName: 'Muhammad Sholikin',
    parentPhone: '085876543210',
    address: 'Dusun Krajan, Desa Soborejo, Pringsurat',
    academicYear: '2024/2025',
    status: 'Aktif',
    notes: 'Lulusan RA Muslimat NU Soborejo',
  },
  {
    id: 'std-2024-002',
    nis: '2024002',
    nisn: '3128475922',
    name: 'Nur Aisyah Az-Zahra',
    gender: 'Perempuan',
    grade: 'Kelas 1',
    classRoom: '1',
    birthPlace: 'Temanggung',
    birthDate: '2018-06-25',
    parentName: 'Supriyanto',
    parentPhone: '081234567891',
    address: 'Dusun Karanglo, Desa Soborejo',
    academicYear: '2024/2025',
    status: 'Aktif',
    notes: 'Juara Mewarnai Tingkat RA',
  },
  {
    id: 'std-2023-015',
    nis: '2023015',
    nisn: '3117584910',
    name: 'Muhammad Rifki Pratama',
    gender: 'Laki-laki',
    grade: 'Kelas 2',
    classRoom: '2',
    birthPlace: 'Magelang',
    birthDate: '2017-02-14',
    parentName: 'Agus Triyono',
    parentPhone: '085712345678',
    address: 'Desa Soborejo RT 02 RW 01, Pringsurat',
    academicYear: '2024/2025',
    status: 'Aktif',
    notes: 'Hafal Juz 30',
  },
  {
    id: 'std-2023-016',
    nis: '2023016',
    nisn: '3117584911',
    name: 'Zahra Amelia Putri',
    gender: 'Perempuan',
    grade: 'Kelas 2',
    classRoom: '2',
    birthPlace: 'Temanggung',
    birthDate: '2017-08-19',
    parentName: 'Budi Santoso',
    parentPhone: '085298765432',
    address: 'Dusun Krajan, Desa Soborejo',
    academicYear: '2024/2025',
    status: 'Aktif',
  },
  {
    id: 'std-2022-020',
    nis: '2022020',
    nisn: '3106748291',
    name: 'Fathir Ahmad Kurniawan',
    gender: 'Laki-laki',
    grade: 'Kelas 3',
    classRoom: '3',
    birthPlace: 'Temanggung',
    birthDate: '2016-01-30',
    parentName: 'Kurniawan Prasetyo',
    parentPhone: '081345678901',
    address: 'Dusun Jetis, Desa Soborejo',
    academicYear: '2024/2025',
    status: 'Aktif',
    notes: 'Anggota Regu Pramuka Siaga',
  },
  {
    id: 'std-2021-008',
    nis: '2021008',
    nisn: '3095847362',
    name: 'Salma Khairunnisa',
    gender: 'Perempuan',
    grade: 'Kelas 4',
    classRoom: '4',
    birthPlace: 'Semarang',
    birthDate: '2015-05-11',
    parentName: 'H. Anwar Rosyid',
    parentPhone: '085811223344',
    address: 'Dusun Karanglo, Desa Soborejo',
    academicYear: '2024/2025',
    status: 'Aktif',
    notes: 'Juara 2 MTQ Pelajar Kecamatan Pringsurat',
  },
  {
    id: 'std-2020-012',
    nis: '2020012',
    nisn: '3084759201',
    name: 'Ilyas Maulana Malik',
    gender: 'Laki-laki',
    grade: 'Kelas 5',
    classRoom: '5',
    birthPlace: 'Temanggung',
    birthDate: '2014-09-04',
    parentName: 'Mansur Hidayat',
    parentPhone: '082133445566',
    address: 'Dusun Krajan, Desa Soborejo',
    academicYear: '2024/2025',
    status: 'Aktif',
    notes: 'Vokalis Tim Rebana Hadroh Al-Ihsan',
  },
  {
    id: 'std-2019-005',
    nis: '2019005',
    nisn: '3073849102',
    name: 'Rahmat Hidayatullah',
    gender: 'Laki-laki',
    grade: 'Kelas 6',
    classRoom: '6',
    birthPlace: 'Temanggung',
    birthDate: '2013-11-20',
    parentName: 'Drs. H. Mulyadi',
    parentPhone: '081298765432',
    address: 'Desa Soborejo, Pringsurat',
    academicYear: '2024/2025',
    status: 'Aktif',
    notes: 'Ketua Regu Pramuka Penggalang',
  },
];


