-- ==================================================================================
-- DATABASE SCHEMA LENGKAP: MI MA'ARIF AL IHSAN SOBOREJO DI SUPABASE (POSTGRESQL)
-- Project Ref: pfaduokywtymqjajfmoh
-- URL: https://pfaduokywtymqjajfmoh.supabase.co
--
-- CARA PENGGUNAAN:
-- 1. Buka Supabase Console: https://supabase.com/dashboard/project/pfaduokywtymqjajfmoh/sql/new
-- 2. Tempel (Paste) seluruh isi skrip ini ke dalam SQL Editor
-- 3. Klik tombol "Run" (atau tekan Ctrl+Enter / Cmd+Enter)
-- 4. Semua tabel (13 tabel), keamanan RLS, dan data awal madrasah akan terpasang!
-- ==================================================================================

-- ----------------------------------------------------------------------------------
-- 1. TABEL MASTER SNAPSHOT (MADRASAH STORE)
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.madrasah_store (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------------
-- 2. TABEL PROFIL MADRASAH
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.school_profile (
  id TEXT PRIMARY KEY DEFAULT 'main',
  nsm TEXT,
  npsn TEXT,
  name TEXT NOT NULL,
  short_name TEXT,
  tagline TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  address TEXT,
  village TEXT,
  district TEXT,
  regency TEXT,
  province TEXT,
  postal_code TEXT,
  akreditasi TEXT,
  headmaster_name TEXT,
  headmaster_nip TEXT,
  headmaster_title TEXT,
  headmaster_photo TEXT,
  headmaster_welcome JSONB DEFAULT '[]'::jsonb,
  vision TEXT,
  missions JSONB DEFAULT '[]'::jsonb,
  goals JSONB DEFAULT '[]'::jsonb,
  history JSONB DEFAULT '[]'::jsonb,
  core_values JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.school_profile ADD COLUMN IF NOT EXISTS favicon_url TEXT;

-- ----------------------------------------------------------------------------------
-- 3. TABEL PENDAFTARAN PPDB ONLINE
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ppdb_registrations (
  id TEXT PRIMARY KEY,
  registration_number TEXT UNIQUE,
  student_name TEXT NOT NULL,
  nik TEXT,
  nisn TEXT,
  gender TEXT,
  birth_place TEXT,
  birth_date TEXT,
  target_class TEXT DEFAULT 'Kelas 1 (Satu)',
  origin_school TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  parent_address TEXT,
  submission_date TEXT,
  status TEXT DEFAULT 'Menunggu Verifikasi',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------------
-- 4. TABEL GURU & TENAGA KEPENDIDIKAN (GTK)
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  category TEXT NOT NULL,
  nip_or_nuptk TEXT,
  education TEXT,
  subjects TEXT,
  photo_url TEXT,
  phone TEXT,
  order_num INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Data Resmi Guru & Tenaga Kependidikan (GTK) MI Ma'arif Al Ihsan Soborejo (8 Asatidz Resmi)
INSERT INTO public.staff_members (id, name, role, category, nip_or_nuptk, education, subjects, photo_url, phone, order_num)
VALUES
  ('staff-batch-0-1789382017558-1-3jx6n', 'MUIN, S.Pd.I.', 'Kepala Madrasah', 'Pimpinan', '3454749650200002', 'S1 Tarbiyah', 'Manajerial & Kebijakan Madrasah', 'https://s.sim.siap-online.com/upload/padamu-ptk/910-00071-91000071130094.1741311176', '+62 813-2876-5432', 1),
  ('staff-batch-1-1789382017558-2-z3ugm', 'FATHURAZAQ, S.Pd.I.', 'Guru Kelas VI', 'Guru Kelas', '6344759660200003', 'S1 PGMI', 'Guru Kelas', 'https://s.sim.siap-online.com/upload/padamu-ptk/910-00081-91000081120629.1753698299', '+62 857-4321-9876', 2),
  ('staff-batch-2-1789382017558-3-goiy1', 'ATIK LESTIYANI, S.Pd.I.', 'Guru Kelas III', 'Guru Kelas', '2138759662300003', 'S1 Tarbiyah', 'Guru Kelas', 'https://s.sim.siap-online.com/upload/padamu-ptk/910-00081-91000081108784.1508373230', '+62 821-3456-7890', 3),
  ('staff-batch-3-1789382017558-4-casuh', 'LISTIANAH, S.Pd.I.', 'Guru Kelas I', 'Guru Kelas', '6448760662300003', 'S1 Tarbiyah', 'Guru Kelas', 'https://s.sim.siap-online.com/upload/padamu-ptk/910-00082-91000082141211.1741311004', '+62 858-6543-2109', 4),
  ('staff-batch-4-1789382017558-5-1i92c', 'ENI SUSMIYATI, S.Pd.I.', 'Guru Kelas IV', 'Guru Kelas', '20321204177001', 'S1 Tarbiyah', 'Guru Kelas', 'https://s.sim.siap-online.com/upload/padamu-ptk/203-21204-20321204177001.1508373414', '+62 812-3456-7890', 5),
  ('staff-batch-5-1789382017558-6-jszqg', 'MUH MASTUR, S.Pd.I.', 'Guru Mata Pelajaran', 'Guru Bidang Studi', '20321204182001', 'S1 Pendidikan Agama Islam', 'Pendidikan Agama Islam (PAI)', 'https://s.sim.siap-online.com/upload/padamu-ptk/203-21204-20321204182001.1761876489', '+62 813-9876-5432', 6),
  ('staff-batch-6-1789382017558-7-b3s04', 'HIDAYATU RIF''ATI ALIYAH, S.Pd.', 'Guru Kelas V', 'Guru Kelas', '20321204198001', 'S1 PGSD/PGMI', 'Guru Kelas', 'https://s.sim.siap-online.com/upload/padamu-ptk/203-21204-20321204198001.1722833749', '+62 857-1234-5678', 7),
  ('staff-batch-7-1789382017558-8-273f7', 'ANIK SEPTIYANI', 'Guru Kelas III', 'Guru Kelas', '20321204105001', 'Proses Pendidikan S1', 'Guru Kelas', '/assets/staff-anik.jpg', '+62 813-2920-9651', 8)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------------
-- 5. TABEL BERITA & WARTA MADRASAH
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.news_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT,
  content JSONB,
  image_url TEXT,
  author TEXT,
  date TEXT,
  read_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------------
-- 6. TABEL PRESTASI & KEJUARAAN SANTRI
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  winner TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  year TEXT NOT NULL,
  rank TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------------
-- 7. TABEL PROGRAM UNGGULAN
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.programs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  full_desc TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  target TEXT,
  schedule TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------------
-- 8. TABEL EKSTRAKURIKULER
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.extracurriculars (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  schedule TEXT,
  coach TEXT,
  description TEXT,
  icon TEXT,
  achievements JSONB DEFAULT '[]'::jsonb,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------------
-- 9. TABEL SARANA & PRASARANA (FASILITAS)
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.facilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  specifications JSONB DEFAULT '[]'::jsonb,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------------
-- 10. TABEL GALERI KEGIATAN MADRASAH
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  date TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------------
-- 11. TABEL TESTIMONI WALI SANTRI & ALUMNI
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  quote TEXT NOT NULL,
  student_name TEXT,
  student_grade TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------------
-- 12. TABEL FAQ (PERTANYAAN UMUM & PPDB)
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------------
-- 13. TABEL STATISTIK MADRASAH
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stats (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  suffix TEXT,
  detail TEXT,
  order_num INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================================================
-- AKTIFKAN ROW LEVEL SECURITY (RLS) UNTUK SEMUA TABEL
-- ==================================================================================
ALTER TABLE public.madrasah_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppdb_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracurriculars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

-- ==================================================================================
-- KEBIJAKAN AKSES PUBLIK (BACA, SIMPAN, UBAH, HAPUS SECARA REAL-TIME)
-- ==================================================================================
DROP POLICY IF EXISTS "Public Full Access madrasah_store" ON public.madrasah_store;
CREATE POLICY "Public Full Access madrasah_store" ON public.madrasah_store FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access school_profile" ON public.school_profile;
CREATE POLICY "Public Full Access school_profile" ON public.school_profile FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access ppdb_registrations" ON public.ppdb_registrations;
CREATE POLICY "Public Full Access ppdb_registrations" ON public.ppdb_registrations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access staff_members" ON public.staff_members;
CREATE POLICY "Public Full Access staff_members" ON public.staff_members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access news_articles" ON public.news_articles;
CREATE POLICY "Public Full Access news_articles" ON public.news_articles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access achievements" ON public.achievements;
CREATE POLICY "Public Full Access achievements" ON public.achievements FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access programs" ON public.programs;
CREATE POLICY "Public Full Access programs" ON public.programs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access extracurriculars" ON public.extracurriculars;
CREATE POLICY "Public Full Access extracurriculars" ON public.extracurriculars FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access facilities" ON public.facilities;
CREATE POLICY "Public Full Access facilities" ON public.facilities FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access gallery" ON public.gallery;
CREATE POLICY "Public Full Access gallery" ON public.gallery FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access testimonials" ON public.testimonials;
CREATE POLICY "Public Full Access testimonials" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access faqs" ON public.faqs;
CREATE POLICY "Public Full Access faqs" ON public.faqs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access stats" ON public.stats;
CREATE POLICY "Public Full Access stats" ON public.stats FOR ALL USING (true) WITH CHECK (true);

-- ==================================================================================
-- DATA AWAL STATISTIK REFERENSI MADRASAH (CONTOH SEED)
-- ==================================================================================
INSERT INTO public.stats (id, value, suffix, label, detail, order_num)
VALUES
  ('stat-active-students', '150', '+', 'Peserta Didik Aktif', 'Santri putra dan putri terdaftar resmi di EMIS Kemenag TP 2024/2025', 1),
  ('stat-teachers-staff', '12', 'GTK', 'Guru & Tenaga Kependidikan', 'Pendidik sarjana kualifikasi linier dan kompeten di bidangnya', 2),
  ('stat-study-groups', '6', 'Rombel', 'Rombongan Belajar', 'Kelas 1 hingga Kelas 6 dengan ruang kelas representative', 3),
  ('stat-graduation-rate', '100', '%', 'Tingkat Kelulusan', 'Alumni melanjutkan ke MTs/SMP favorit dan pondok pesantren', 4)
ON CONFLICT (id) DO UPDATE SET
  value = EXCLUDED.value,
  suffix = EXCLUDED.suffix,
  label = EXCLUDED.label,
  detail = EXCLUDED.detail;
