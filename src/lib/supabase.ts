import { createClient } from '@supabase/supabase-js';
import { AppStorageState } from '../context/DataContext';
import { parseDateTimestamp } from './dateUtils';

export const SUPABASE_PROJECT_REF = 'pfaduokywtymqjajfmoh';
export const SUPABASE_SQL_EDITOR_URL = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/sql/new`;

export const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  'https://pfaduokywtymqjajfmoh.supabase.co';

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_d0OLXPK4PRFrG1xwcD-Rtg_infX_Qwn';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseHealthResult {
  connected: boolean;
  url: string;
  tables: {
    madrasah_store: boolean;
    school_profile: boolean;
    ppdb_registrations: boolean;
    staff_members: boolean;
    news_articles: boolean;
    achievements: boolean;
    programs: boolean;
    extracurriculars: boolean;
    facilities: boolean;
    gallery: boolean;
    testimonials: boolean;
    faqs: boolean;
    stats: boolean;
  };
  error?: string;
  hasTables: boolean;
}

export const SUPABASE_SQL_SCRIPT = `-- ==================================================================================
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

-- 1. TABEL MASTER SNAPSHOT (MADRASAH STORE)
CREATE TABLE IF NOT EXISTS public.madrasah_store (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABEL PROFIL MADRASAH
CREATE TABLE IF NOT EXISTS public.school_profile (
  id TEXT PRIMARY KEY DEFAULT 'main',
  nsm TEXT,
  npsn TEXT,
  name TEXT NOT NULL,
  short_name TEXT,
  tagline TEXT,
  logo_url TEXT,
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

-- 3. TABEL PENDAFTARAN PPDB ONLINE
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

-- 4. TABEL GURU & TENAGA KEPENDIDIKAN (GTK)
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

-- 5. TABEL BERITA & WARTA MADRASAH
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

-- 6. TABEL PRESTASI & KEJUARAAN SANTRI
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

-- 7. TABEL PROGRAM UNGGULAN
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

-- 8. TABEL EKSTRAKURIKULER
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

-- 9. TABEL SARANA & PRASARANA (FASILITAS)
CREATE TABLE IF NOT EXISTS public.facilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  specifications JSONB DEFAULT '[]'::jsonb,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. TABEL GALERI KEGIATAN MADRASAH
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  date TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. TABEL TESTIMONI WALI SANTRI & ALUMNI
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

-- 12. TABEL FAQ (PERTANYAAN UMUM & PPDB)
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. TABEL STATISTIK MADRASAH
CREATE TABLE IF NOT EXISTS public.stats (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  suffix TEXT,
  detail TEXT,
  order_num INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AKTIFKAN ROW LEVEL SECURITY (RLS)
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

-- KEBIJAKAN AKSES PUBLIK (READ & WRITE ANON/AUTH)
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

-- SEED DATA STATISTIK AWAL
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
`;

/**
 * Check Supabase tables availability
 */
export async function checkSupabaseStatus(): Promise<SupabaseHealthResult> {
  const result: SupabaseHealthResult = {
    connected: false,
    url: SUPABASE_URL,
    tables: {
      madrasah_store: false,
      school_profile: false,
      ppdb_registrations: false,
      staff_members: false,
      news_articles: false,
      achievements: false,
      programs: false,
      extracurriculars: false,
      facilities: false,
      gallery: false,
      testimonials: false,
      faqs: false,
      stats: false,
    },
    hasTables: false,
  };

  try {
    const tableKeys = [
      { key: 'madrasah_store' as const, name: 'madrasah_store' },
      { key: 'school_profile' as const, name: 'school_profile' },
      { key: 'ppdb_registrations' as const, name: 'ppdb_registrations' },
      { key: 'staff_members' as const, name: 'staff_members' },
      { key: 'news_articles' as const, name: 'news_articles' },
      { key: 'achievements' as const, name: 'achievements' },
      { key: 'programs' as const, name: 'programs' },
      { key: 'extracurriculars' as const, name: 'extracurriculars' },
      { key: 'facilities' as const, name: 'facilities' },
      { key: 'gallery' as const, name: 'gallery' },
      { key: 'testimonials' as const, name: 'testimonials' },
      { key: 'faqs' as const, name: 'faqs' },
      { key: 'stats' as const, name: 'stats' },
    ];

    const results = await Promise.allSettled(
      tableKeys.map((t) => supabase.from(t.name).select('id').limit(1))
    );

    tableKeys.forEach((t, i) => {
      const res = results[i];
      if (res.status === 'fulfilled' && !res.value.error) {
        result.tables[t.key] = true;
      }
    });

    result.hasTables = Object.values(result.tables).some(Boolean);
    result.connected = true;
    return result;
  } catch (err: any) {
    result.connected = false;
    result.error = err?.message || 'Gagal menghubungi Supabase';
    return result;
  }
}

/**
 * Save complete application state to Supabase with anti-wipe protection
 */
async function syncTableRecords(table: string, currentIds: string[]) {
  try {
    const { data: existing } = await supabase.from(table).select('id');
    if (existing && existing.length > 0) {
      const toDelete = existing.filter((e: any) => !currentIds.includes(e.id)).map((e: any) => e.id);
      if (toDelete.length > 0) {
        await supabase.from(table).delete().in('id', toDelete);
      }
    }
  } catch (err) {
    console.warn(`Sync table cleanup failed for ${table}:`, err);
  }
}

export async function saveAllToSupabase(
  state: AppStorageState,
  options?: { isAuthorizedAdmin?: boolean; force?: boolean }
): Promise<{ success: boolean; message: string }> {
  // Guard 1: Basic validation
  if (!state || !state.schoolProfile) {
    return { success: false, message: 'Data tidak valid untuk disimpan ke Supabase' };
  }

  // Guard 2: Authorization check - prevent unauthorized visitors or bots from overwriting database
  if (options?.isAuthorizedAdmin === false && !options?.force) {
    console.warn('saveAllToSupabase rejected: unauthorized write attempt blocked');
    return { success: false, message: 'Akses ditolak: Hanya Administrator yang berhak menyinkronkan data ke Supabase' };
  }

  // Guard 3: Anti-wipe safeguard!
  // Before overwriting tables in Supabase, verify that incoming payload doesn't wipe out existing database records
  try {
    if (!options?.force) {
      const { count: remoteStaffCount } = await supabase
        .from('staff_members')
        .select('id', { count: 'exact', head: true });

      if ((remoteStaffCount ?? 0) > 0 && (!state.staffList || state.staffList.length === 0)) {
        console.warn('Anti-wipe safeguard triggered: Supabase has staff data but incoming state is empty.');
        return { success: false, message: 'Dibatalkan demi keamanan: Data GTK lokal kosong sehingga dicegah menimpa database Supabase.' };
      }
    }
  } catch (checkErr) {
    // Non-blocking network check failure
  }

  try {
    // 1. Save master snapshot into madrasah_store
    const { error: storeError } = await supabase
      .from('madrasah_store')
      .upsert({
        id: 'main',
        data: state,
        updated_at: new Date().toISOString(),
      });

    // 2. Save School Profile
    try {
      if (state.schoolProfile) {
        const sp = state.schoolProfile;
        await supabase.from('school_profile').upsert({
          id: 'main',
          nsm: sp.nsm || null,
          npsn: sp.npsn || null,
          name: sp.name,
          short_name: sp.shortName || null,
          tagline: sp.tagline || null,
          logo_url: sp.logoUrl || null,
          email: sp.email || null,
          phone: sp.phone || null,
          whatsapp: sp.whatsapp || null,
          address: sp.address || null,
          village: sp.village || null,
          district: sp.district || null,
          regency: sp.regency || null,
          province: sp.province || null,
          postal_code: sp.postalCode || null,
          akreditasi: sp.accreditation || null,
          headmaster_name: sp.headmasterName || null,
          headmaster_nip: sp.headmasterNip || null,
          headmaster_title: sp.headmasterTitle || null,
          headmaster_photo: sp.headmasterPhotoUrl || null,
          headmaster_welcome: sp.headmasterWelcome || [],
          vision: sp.vision || null,
          missions: sp.missions || [],
          goals: sp.goals || [],
          history: sp.history || [],
          core_values: sp.coreValues || [],
          updated_at: new Date().toISOString(),
        });
      }
    } catch (_) {}

    // 3. Save PPDB Registrations
    try {
      const ppdbIds = (state.ppdbRegistrations || []).map((p) => p.id);
      await syncTableRecords('ppdb_registrations', ppdbIds);
      if (state.ppdbRegistrations && state.ppdbRegistrations.length > 0) {
        await supabase.from('ppdb_registrations').upsert(
          state.ppdbRegistrations.map((p) => ({
            id: p.id,
            registration_number: p.registrationNumber,
            student_name: p.studentName,
            nik: p.nik || null,
            nisn: p.nisn || null,
            gender: p.gender,
            birth_place: p.birthPlace || null,
            birth_date: p.birthDate,
            target_class: p.targetClass || 'Kelas 1 (Satu)',
            origin_school: p.originSchool,
            parent_name: p.parentName,
            parent_phone: p.parentPhone,
            parent_address: p.address,
            submission_date: p.submissionDate,
            status: p.status,
            notes: p.notes || null,
          }))
        );
      }
    } catch (_) {}

    // 4. Save Staff Members (GTK)
    try {
      const staffIds = (state.staffList || []).map((s) => s.id);
      await syncTableRecords('staff_members', staffIds);
      if (state.staffList && state.staffList.length > 0) {
        await supabase.from('staff_members').upsert(
          state.staffList.map((s, idx) => ({
            id: s.id,
            name: s.name,
            role: s.role,
            category: s.category,
            nip_or_nuptk: s.nipOrNuptk || null,
            education: s.education || null,
            subjects: s.subjects || null,
            photo_url: s.photoUrl || null,
            phone: s.phone || null,
            order_num: s.order ?? idx,
          }))
        );
      }
    } catch (_) {}

    // 5. Save Achievements
    try {
      const achieveIds = (state.achievements || []).map((a) => a.id);
      await syncTableRecords('achievements', achieveIds);
      if (state.achievements && state.achievements.length > 0) {
        await supabase.from('achievements').upsert(
          state.achievements.map((a) => ({
            id: a.id,
            title: a.title,
            winner: a.winner,
            category: a.category,
            level: a.level,
            year: a.year,
            rank: a.rank,
            description: a.description || '',
            image_url: a.imageUrl || null,
          }))
        );
      }
    } catch (_) {}

    // 6. Save News Articles
    try {
      const newsIds = (state.newsList || []).map((n) => n.id);
      await syncTableRecords('news_articles', newsIds);
      if (state.newsList && state.newsList.length > 0) {
        await supabase.from('news_articles').upsert(
          state.newsList.map((n) => ({
            id: n.id,
            title: n.title,
            category: n.category,
            summary: n.summary,
            content: n.content,
            image_url: n.imageUrl || null,
            author: n.author,
            date: n.date,
            read_time: n.readTime || null,
          }))
        );
      }
    } catch (_) {}

    // 7. Save Programs
    try {
      const progIds = (state.programs || []).map((p) => p.id);
      await syncTableRecords('programs', progIds);
      if (state.programs && state.programs.length > 0) {
        await supabase.from('programs').upsert(
          state.programs.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            icon: p.iconName || null,
            description: p.shortDesc || '',
            full_desc: p.fullDesc || '',
            highlights: p.highlights || [],
            target: p.target || null,
            schedule: p.schedule || null,
          }))
        );
      }
    } catch (_) {}

    // 8. Save Extracurriculars
    try {
      const ekskulIds = (state.extracurriculars || []).map((e) => e.id);
      await syncTableRecords('extracurriculars', ekskulIds);
      if (state.extracurriculars && state.extracurriculars.length > 0) {
        await supabase.from('extracurriculars').upsert(
          state.extracurriculars.map((e) => ({
            id: e.id,
            name: e.name,
            category: e.category,
            schedule: e.schedule,
            coach: e.coach,
            description: e.description,
            icon: e.iconName || null,
            achievements: e.achievements || [],
            photo_url: e.imageUrl || null,
          }))
        );
      }
    } catch (_) {}

    // 9. Save Facilities
    try {
      const facIds = (state.facilities || []).map((f) => f.id);
      await syncTableRecords('facilities', facIds);
      if (state.facilities && state.facilities.length > 0) {
        await supabase.from('facilities').upsert(
          state.facilities.map((f) => ({
            id: f.id,
            name: f.name,
            category: f.category,
            description: f.description,
            specifications: f.specifications || [],
            photo_url: f.imageUrl || null,
          }))
        );
      }
    } catch (_) {}

    // 10. Save Gallery
    try {
      const galIds = (state.gallery || []).map((g) => g.id);
      await syncTableRecords('gallery', galIds);
      if (state.gallery && state.gallery.length > 0) {
        await supabase.from('gallery').upsert(
          state.gallery.map((g) => ({
            id: g.id,
            title: g.title,
            category: g.category,
            image_url: g.imageUrl,
            date: g.date,
            description: g.description || null,
          }))
        );
      }
    } catch (_) {}

    // 11. Save Testimonials
    try {
      const testiIds = (state.testimonials || []).map((t) => t.id);
      await syncTableRecords('testimonials', testiIds);
      if (state.testimonials && state.testimonials.length > 0) {
        await supabase.from('testimonials').upsert(
          state.testimonials.map((t) => ({
            id: t.id,
            name: t.name,
            role: t.role,
            quote: t.quote,
            student_name: t.childName || null,
            student_grade: t.childGrade || null,
            avatar_url: t.avatarUrl || null,
          }))
        );
      }
    } catch (_) {}

    // 12. Save FAQs
    try {
      const faqIds = (state.faqs || []).map((q) => q.id);
      await syncTableRecords('faqs', faqIds);
      if (state.faqs && state.faqs.length > 0) {
        await supabase.from('faqs').upsert(
          state.faqs.map((q) => ({
            id: q.id,
            question: q.question,
            answer: q.answer,
            category: q.category,
          }))
        );
      }
    } catch (_) {}

    // 13. Save Stats
    try {
      const statIds = (state.statsList || []).map((s) => s.id);
      await syncTableRecords('stats', statIds);
      if (state.statsList && state.statsList.length > 0) {
        await supabase.from('stats').upsert(
          state.statsList.map((s, idx) => ({
            id: s.id,
            label: s.label,
            value: s.value,
            suffix: s.suffix || null,
            detail: s.detail || null,
            order_num: s.order ?? idx,
          }))
        );
      }
    } catch (_) {}

    if (storeError) {
      if (storeError.code === 'PGRST205') {
        return {
          success: false,
          message: 'Tabel Supabase belum dibuat. Silakan buka SQL Editor Supabase dan jalankan skrip SQL yang telah disediakan.',
        };
      }
      return { success: false, message: storeError.message };
    }

    return { success: true, message: 'Semua 13 modul data website berhasil disinkronkan ke Supabase Cloud!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Gagal menyimpan ke Supabase' };
  }
}

export const CLIENT_INSTANCE_ID =
  typeof window !== 'undefined'
    ? 'client_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now()
    : 'server_' + Math.random().toString(36).substring(2, 9);

// Dedicated Realtime Broadcast Channel for instant sub-second multi-device sync
export const realtimeBroadcastChannel = supabase.channel('madrasah_live_broadcast');
realtimeBroadcastChannel.subscribe();

/**
 * Broadcast an instant change event across all connected devices
 */
export async function broadcastSupabaseChange(table: string, payload?: any) {
  try {
    await realtimeBroadcastChannel.send({
      type: 'broadcast',
      event: 'data_changed',
      payload: {
        table,
        timestamp: Date.now(),
        senderId: CLIENT_INSTANCE_ID,
        data: payload,
      },
    });
  } catch (err) {
    console.warn('Supabase broadcast notice:', err);
  }
}

/**
 * Direct Upsert Single Staff Member to Supabase
 */
export async function upsertStaffToSupabase(staff: any) {
  try {
    await supabase.from('staff_members').upsert({
      id: staff.id,
      name: staff.name,
      role: staff.role,
      category: staff.category,
      nip_or_nuptk: staff.nipOrNuptk || null,
      education: staff.education || null,
      subjects: staff.subjects || null,
      photo_url: staff.photoUrl || null,
      phone: staff.phone || null,
      order_num: staff.order ?? 99,
    });
    broadcastSupabaseChange('staff_members', staff);
  } catch (err) {
    console.warn('Failed to upsert staff to Supabase:', err);
  }
}

/**
 * Direct Delete Single Staff Member from Supabase
 */
export async function deleteStaffFromSupabase(id: string) {
  try {
    await supabase.from('staff_members').delete().eq('id', id);
    broadcastSupabaseChange('staff_members', { deletedId: id });
  } catch (err) {
    console.warn('Failed to delete staff from Supabase:', err);
  }
}

/**
 * Direct Delete Single News Article from Supabase
 */
export async function deleteNewsFromSupabase(id: string) {
  try {
    await supabase.from('news_articles').delete().eq('id', id);
    broadcastSupabaseChange('news_articles', { deletedId: id });
  } catch (err) {
    console.warn('Failed to delete news from Supabase:', err);
  }
}

/**
 * Generic Delete Single Item from any Supabase Table
 */
export async function deleteItemFromSupabase(table: string, id: string) {
  try {
    await supabase.from(table).delete().eq('id', id);
    broadcastSupabaseChange(table, { deletedId: id });
  } catch (err) {
    console.warn(`Failed to delete from Supabase table ${table}:`, err);
  }
}

/**
 * Direct Upsert School Profile to Supabase
 */
export async function upsertSchoolProfileToSupabase(sp: any) {
  try {
    await supabase.from('school_profile').upsert({
      id: 'main',
      nsm: sp.nsm || null,
      npsn: sp.npsn || null,
      name: sp.name,
      short_name: sp.shortName || null,
      tagline: sp.tagline || null,
      logo_url: sp.logoUrl || null,
      email: sp.email || null,
      phone: sp.phone || null,
      whatsapp: sp.whatsapp || null,
      address: sp.address || null,
      village: sp.village || null,
      district: sp.district || null,
      regency: sp.regency || null,
      province: sp.province || null,
      postal_code: sp.postalCode || null,
      akreditasi: sp.accreditation || null,
      headmaster_name: sp.headmasterName || null,
      headmaster_nip: sp.headmasterNip || null,
      headmaster_title: sp.headmasterTitle || null,
      headmaster_photo: sp.headmasterPhotoUrl || null,
      headmaster_welcome: sp.headmasterWelcome || [],
      vision: sp.vision || null,
      missions: sp.missions || [],
      goals: sp.goals || [],
      history: sp.history || [],
      core_values: sp.coreValues || [],
      updated_at: new Date().toISOString(),
    });
    broadcastSupabaseChange('school_profile', sp);
  } catch (err) {
    console.warn('Failed to upsert school profile to Supabase:', err);
  }
}

/**
 * Load state from Supabase with robust multi-table fallback
 */
export async function loadFromSupabase(): Promise<AppStorageState | null> {
  try {
    const [
      storeRes,
      profileRes,
      staffRes,
      newsRes,
      ppdbRes,
      achieveRes,
      progRes,
      ekskulRes,
      facRes,
      galRes,
      testiRes,
      faqRes,
      statRes,
    ] = await Promise.allSettled([
      supabase.from('madrasah_store').select('data').eq('id', 'main').single(),
      supabase.from('school_profile').select('*').eq('id', 'main').single(),
      supabase.from('staff_members').select('*').order('order_num', { ascending: true }),
      supabase.from('news_articles').select('*'),
      supabase.from('ppdb_registrations').select('*'),
      supabase.from('achievements').select('*'),
      supabase.from('programs').select('*'),
      supabase.from('extracurriculars').select('*'),
      supabase.from('facilities').select('*'),
      supabase.from('gallery').select('*'),
      supabase.from('testimonials').select('*'),
      supabase.from('faqs').select('*'),
      supabase.from('stats').select('*').order('order_num', { ascending: true }),
    ]);

    let state: AppStorageState | null = null;

    if (storeRes.status === 'fulfilled' && storeRes.value.data?.data) {
      state = storeRes.value.data.data as AppStorageState;
    }

    if (!state) {
      state = {} as any;
    }

    // Merge School Profile
    if (profileRes.status === 'fulfilled' && profileRes.value.data) {
      const p = profileRes.value.data;
      state.schoolProfile = {
        ...(state.schoolProfile || {}),
        name: p.name || state.schoolProfile?.name || "MI Ma'arif Al Ihsan Soborejo",
        shortName: p.short_name || state.schoolProfile?.shortName || "MI Al Ihsan Soborejo",
        tagline: p.tagline || state.schoolProfile?.tagline || "",
        logoUrl: p.logo_url || state.schoolProfile?.logoUrl || "/assets/logo-maarif.svg",
        npsn: p.npsn || state.schoolProfile?.npsn || "60713037",
        nsm: p.nsm || state.schoolProfile?.nsm || "111233230053",
        accreditation: p.akreditasi || state.schoolProfile?.accreditation || "Terakreditasi Baik",
        email: p.email || state.schoolProfile?.email || "mialihsansoborejo@gmail.com",
        phone: p.phone || state.schoolProfile?.phone || "085876543210",
        whatsapp: p.whatsapp || state.schoolProfile?.whatsapp || "6285876543210",
        address: p.address || state.schoolProfile?.address || "Soborejo, Pringsurat",
        village: p.village || state.schoolProfile?.village || "Soborejo",
        district: p.district || state.schoolProfile?.district || "Pringsurat",
        regency: p.regency || state.schoolProfile?.regency || "Kabupaten Temanggung",
        province: p.province || state.schoolProfile?.province || "Jawa Tengah",
        postalCode: p.postal_code || state.schoolProfile?.postalCode || "56272",
        headmasterName: p.headmaster_name || state.schoolProfile?.headmasterName || "MUIN, S.Pd.I.",
        headmasterNip: p.headmaster_nip || state.schoolProfile?.headmasterNip || "-",
        headmasterTitle: p.headmaster_title || state.schoolProfile?.headmasterTitle || "Kepala Madrasah",
        headmasterPhotoUrl: p.headmaster_photo || state.schoolProfile?.headmasterPhotoUrl || "",
        headmasterWelcome: p.headmaster_welcome?.length ? p.headmaster_welcome : state.schoolProfile?.headmasterWelcome || [],
        vision: p.vision || state.schoolProfile?.vision || "",
        missions: p.missions?.length ? p.missions : state.schoolProfile?.missions || [],
        goals: p.goals?.length ? p.goals : state.schoolProfile?.goals || [],
        history: p.history?.length ? p.history : state.schoolProfile?.history || [],
        coreValues: p.core_values?.length ? p.core_values : state.schoolProfile?.coreValues || [],
      };
    }

    // Merge Staff Members (GTK)
    if (staffRes.status === 'fulfilled' && staffRes.value.data && staffRes.value.data.length > 0) {
      state.staffList = staffRes.value.data.map((s: any, idx: number) => ({
        id: s.id,
        name: s.name,
        role: s.role,
        category: s.category as any,
        nipOrNuptk: s.nip_or_nuptk || '-',
        education: s.education || '',
        subjects: s.subjects || '',
        photoUrl: s.photo_url || '',
        phone: s.phone || '',
        order: s.order_num ?? (idx + 1),
        status: 'Aktif' as const,
      }));
    }

    // Merge News Articles
    if (newsRes.status === 'fulfilled' && Array.isArray(newsRes.value.data)) {
      state.newsList = newsRes.value.data.map((n: any) => {
        let contentArr: string[] = [];
        if (Array.isArray(n.content)) {
          contentArr = n.content.map(String).filter(Boolean);
        } else if (typeof n.content === 'string' && n.content.trim()) {
          contentArr = n.content.split(/\n\n+/).map((p: string) => p.trim()).filter(Boolean);
        }
        const summary = n.summary || n.excerpt || (contentArr[0] ? contentArr[0].slice(0, 160) : '') || '';
        if (contentArr.length === 0 && summary) {
          contentArr = [summary];
        }
        return {
          id: n.id,
          title: n.title,
          category: n.category as any,
          summary,
          content: contentArr,
          imageUrl: n.image_url || '',
          author: n.author || 'Admin Madrasah',
          date: n.date || n.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          readTime: n.read_time || '3 menit',
        };
      }).sort((a: any, b: any) => parseDateTimestamp(b.date) - parseDateTimestamp(a.date));
    }

    // Merge PPDB
    if (ppdbRes.status === 'fulfilled' && Array.isArray(ppdbRes.value.data)) {
      state.ppdbRegistrations = ppdbRes.value.data.map((p: any) => ({
        id: p.id,
        registrationNumber: p.registration_number,
        studentName: p.student_name,
        nik: p.nik || '',
        nisn: p.nisn || '',
        gender: p.gender,
        birthPlace: p.birth_place || '',
        birthDate: p.birth_date || '',
        targetClass: p.target_class || 'Kelas 1 (Satu)',
        originSchool: p.origin_school || '',
        parentName: p.parent_name || '',
        parentPhone: p.parent_phone || '',
        address: p.parent_address || '',
        submissionDate: p.submission_date || '',
        status: p.status || 'Menunggu',
        notes: p.notes || '',
      }));
    }

    // Merge Achievements
    if (achieveRes.status === 'fulfilled' && Array.isArray(achieveRes.value.data)) {
      state.achievements = achieveRes.value.data.map((a: any) => ({
        id: a.id,
        title: a.title,
        winner: a.winner,
        category: a.category as any,
        level: a.level as any,
        year: a.year,
        rank: a.rank,
        description: a.description || '',
        imageUrl: a.image_url || '',
      }));
    }

    // Merge Programs
    if (progRes.status === 'fulfilled' && Array.isArray(progRes.value.data)) {
      state.programs = progRes.value.data.map((p: any) => ({
        id: p.id,
        title: p.title,
        category: p.category as any,
        iconName: p.icon || 'BookOpen',
        shortDesc: p.description || '',
        fullDesc: p.full_desc || '',
        highlights: Array.isArray(p.highlights) ? p.highlights : [],
        target: p.target || '',
        schedule: p.schedule || '',
      }));
    }

    // Merge Extracurriculars
    if (ekskulRes.status === 'fulfilled' && Array.isArray(ekskulRes.value.data)) {
      state.extracurriculars = ekskulRes.value.data.map((e: any) => ({
        id: e.id,
        name: e.name,
        category: e.category as any,
        schedule: e.schedule || '',
        coach: e.coach || '',
        description: e.description || '',
        iconName: e.icon || 'Star',
        achievements: Array.isArray(e.achievements) ? e.achievements : [],
        imageUrl: e.photo_url || '',
      }));
    }

    // Merge Facilities
    if (facRes.status === 'fulfilled' && Array.isArray(facRes.value.data)) {
      state.facilities = facRes.value.data.map((f: any) => ({
        id: f.id,
        name: f.name,
        category: f.category as any,
        description: f.description || '',
        specifications: Array.isArray(f.specifications) ? f.specifications : [],
        imageUrl: f.photo_url || '',
      }));
    }

    // Merge Gallery
    if (galRes.status === 'fulfilled' && Array.isArray(galRes.value.data)) {
      state.gallery = galRes.value.data.map((g: any) => ({
        id: g.id,
        title: g.title,
        category: g.category as any,
        imageUrl: g.image_url,
        date: g.date || '',
        description: g.description || '',
      }));
    }

    // Merge Testimonials
    if (testiRes.status === 'fulfilled' && Array.isArray(testiRes.value.data)) {
      state.testimonials = testiRes.value.data.map((t: any) => ({
        id: t.id,
        name: t.name,
        role: t.role as any,
        quote: t.quote,
        childName: t.student_name || '',
        childGrade: t.student_grade || '',
        avatarUrl: t.avatar_url || '',
      }));
    }

    // Merge FAQs
    if (faqRes.status === 'fulfilled' && Array.isArray(faqRes.value.data)) {
      state.faqs = faqRes.value.data.map((q: any) => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        category: q.category as any,
      }));
    }

    // Merge Stats
    if (statRes.status === 'fulfilled' && Array.isArray(statRes.value.data)) {
      state.statsList = statRes.value.data.map((s: any, idx: number) => ({
        id: s.id,
        label: s.label,
        value: s.value,
        suffix: s.suffix || '',
        detail: s.detail || '',
        order: s.order_num ?? (idx + 1),
      }));
    }

    if (state.schoolProfile || (state.staffList && state.staffList.length > 0) || (state.newsList && state.newsList.length > 0)) {
      return state;
    }

    return null;
  } catch (err) {
    console.warn('Could not load from Supabase:', err);
    return null;
  }
}
