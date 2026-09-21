import { db } from './index.ts';
import {
  ppdbRegistrations,
  staffMembers,
  newsArticles,
  appSettings
} from './schema.ts';
import { eq, desc, asc } from 'drizzle-orm';
import {
  SCHOOL_PROFILE,
  STAFF_DATA,
  STATS_DATA,
  PROGRAMS_DATA,
  EXTRACURRICULARS,
  ACHIEVEMENTS,
  FACILITIES,
  GALLERY_DATA,
  INITIAL_VIDEOS,
  INITIAL_NEWS,
  TESTIMONIALS,
  FAQ_DATA,
  INITIAL_PPDB_REGISTRATIONS,
  INITIAL_STUDENTS
} from '../data/schoolData.ts';
import { parseDateTimestamp } from '../lib/dateUtils.ts';

/**
 * Execute DB operation with automatic retry on transient pool/connection timeouts
 */
async function runWithRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1200): Promise<T> {
  let lastError: any;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const msg = (err?.message || '') + ' ' + (err?.cause?.message || '');
      const isConnectionIssue =
        msg.includes('timeout') ||
        msg.includes('connect') ||
        msg.includes('terminated') ||
        msg.includes('ECONNRESET') ||
        msg.includes('connection');

      if (isConnectionIssue && attempt < retries) {
        console.warn(`[DB Retry] Cloud SQL connection note (attempt ${attempt}/${retries}): ${err?.message || 'Retrying...'}`);
        await new Promise((res) => setTimeout(res, delayMs * attempt));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// PPDB Operations
export async function getPPDBList() {
  try {
    return await runWithRetry(async () => {
      return await db.select().from(ppdbRegistrations).orderBy(desc(ppdbRegistrations.createdAt));
    });
  } catch (error) {
    console.error('Failed to query PPDB registrations:', error);
    throw new Error('Gagal mengambil data PPDB dari database.', { cause: error });
  }
}

export async function insertPPDB(data: {
  id: string;
  registrationNumber: string;
  fullName: string;
  nisn?: string;
  nik?: string;
  birthPlace?: string;
  birthDate?: string;
  gender: string;
  parentName: string;
  parentPhone: string;
  parentAddress?: string;
  previousSchool?: string;
  registrationDate: string;
  status?: string;
  notes?: string;
  documentsJson?: any;
}) {
  try {
    const result = await db.insert(ppdbRegistrations).values({
      id: data.id,
      registrationNumber: data.registrationNumber,
      fullName: data.fullName,
      nisn: data.nisn || null,
      nik: data.nik || null,
      birthPlace: data.birthPlace || null,
      birthDate: data.birthDate || null,
      gender: data.gender,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
      parentAddress: data.parentAddress || null,
      previousSchool: data.previousSchool || null,
      registrationDate: data.registrationDate,
      status: data.status || 'menunggu_verifikasi',
      notes: data.notes || null,
      documentsJson: data.documentsJson || null,
    }).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to insert PPDB registration:', error);
    throw new Error('Gagal menyimpan pendaftaran PPDB.', { cause: error });
  }
}

export async function updatePPDB(id: string, updates: Partial<{
  status: string;
  notes: string;
}>) {
  try {
    const result = await db.update(ppdbRegistrations)
      .set(updates)
      .where(eq(ppdbRegistrations.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Failed to update PPDB status:', error);
    throw new Error('Gagal memperbarui status PPDB.', { cause: error });
  }
}

export async function deletePPDB(id: string) {
  try {
    await db.delete(ppdbRegistrations).where(eq(ppdbRegistrations.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete PPDB:', error);
    throw new Error('Gagal menghapus pendaftaran PPDB.', { cause: error });
  }
}

// Staff Operations
export async function getStaffList() {
  try {
    return await runWithRetry(async () => {
      return await db.select().from(staffMembers).orderBy(asc(staffMembers.orderNum), asc(staffMembers.name));
    });
  } catch (error) {
    console.error('Failed to fetch staff list:', error);
    throw new Error('Gagal mengambil daftar GTK.', { cause: error });
  }
}

export async function upsertStaff(item: {
  id?: string;
  name: string;
  role: string;
  category?: string;
  nip?: string;
  nipOrNuptk?: string;
  education?: string;
  subject?: string;
  subjects?: string;
  photoUrl?: string;
  bio?: string;
  orderNum?: number;
  order?: number;
}) {
  try {
    return await runWithRetry(async () => {
      const idVal = item.id && String(item.id).trim() ? String(item.id).trim() : `staff-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const nameVal = (item.name || '').trim() || 'Tanpa Nama';
      const roleVal = (item.role || '').trim() || 'Guru';
      const categoryVal = (item.category || '').trim() || 'Guru Kelas';
      const nipVal = (item.nip || item.nipOrNuptk || '').trim() || null;
      const subjectVal = (item.subject || item.subjects || '').trim() || null;
      const rawOrder = item.orderNum ?? item.order ?? 0;
      const orderNumVal = typeof rawOrder === 'number' && !isNaN(rawOrder) ? Math.round(rawOrder) : (parseInt(String(rawOrder), 10) || 0);

      const result = await db.insert(staffMembers)
        .values({
          id: idVal,
          name: nameVal,
          role: roleVal,
          category: categoryVal,
          nip: nipVal,
          education: item.education || null,
          subject: subjectVal,
          photoUrl: item.photoUrl || null,
          bio: item.bio || null,
          orderNum: orderNumVal,
        })
        .onConflictDoUpdate({
          target: staffMembers.id,
          set: {
            name: nameVal,
            role: roleVal,
            category: categoryVal,
            nip: nipVal,
            education: item.education || null,
            subject: subjectVal,
            photoUrl: item.photoUrl || null,
            bio: item.bio || null,
            orderNum: orderNumVal,
          },
        })
        .returning();
      return result[0];
    });
  } catch (error) {
    console.error('Failed to upsert staff member:', error);
    throw new Error('Gagal menyimpan data GTK.', { cause: error });
  }
}

export async function deleteStaff(id: string) {
  try {
    return await runWithRetry(async () => {
      await db.delete(staffMembers).where(eq(staffMembers.id, id));
      return { success: true };
    });
  } catch (error) {
    console.error('Failed to delete staff member:', error);
    throw new Error('Gagal menghapus data GTK.', { cause: error });
  }
}

// News Operations
export async function getNewsList() {
  try {
    return await runWithRetry(async () => {
      const list = await db.select().from(newsArticles);
      return list.sort((a, b) => {
        const timeA = parseDateTimestamp(a.date);
        const timeB = parseDateTimestamp(b.date);
        if (timeB !== timeA) return timeB - timeA;
        const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return createdB - createdA;
      });
    });
  } catch (error) {
    console.error('Failed to fetch news list:', error);
    throw new Error('Gagal mengambil daftar berita.', { cause: error });
  }
}

export async function upsertNews(item: {
  id: string;
  title: string;
  slug?: string;
  category: string;
  excerpt?: string;
  summary?: string;
  content: string | string[];
  date: string;
  author: string;
  imageUrl?: string;
  readTime?: string;
  isPublished?: boolean;
}) {
  try {
    return await runWithRetry(async () => {
      const slugVal = item.slug || (item.title ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `berita-${item.id}`);
      const excerptVal = item.excerpt || item.summary || (typeof item.content === 'string' ? item.content.slice(0, 150) : '') || '';
      const contentVal = Array.isArray(item.content) ? item.content.join('\n\n') : (item.content || '');

      const result = await db.insert(newsArticles)
        .values({
          id: item.id,
          title: item.title,
          slug: slugVal,
          category: item.category || 'Berita Madrasah',
          excerpt: excerptVal,
          content: contentVal,
          date: item.date || new Date().toLocaleDateString('id-ID'),
          author: item.author || 'Admin Madrasah',
          imageUrl: item.imageUrl || null,
          readTime: item.readTime || '3 menit',
          isPublished: item.isPublished ?? true,
        })
        .onConflictDoUpdate({
          target: newsArticles.id,
          set: {
            title: item.title,
            slug: slugVal,
            category: item.category || 'Berita Madrasah',
            excerpt: excerptVal,
            content: contentVal,
            date: item.date || new Date().toLocaleDateString('id-ID'),
            author: item.author || 'Admin Madrasah',
            imageUrl: item.imageUrl || null,
            readTime: item.readTime || '3 menit',
            isPublished: item.isPublished ?? true,
          },
        })
        .returning();
      return result[0];
    });
  } catch (error) {
    console.error('Failed to upsert news article:', error);
    throw new Error('Gagal menyimpan artikel berita.', { cause: error });
  }
}

export async function deleteNews(id: string) {
  try {
    return await runWithRetry(async () => {
      await db.delete(newsArticles).where(eq(newsArticles.id, id));
      return { success: true };
    });
  } catch (error) {
    console.error('Failed to delete news article:', error);
    throw new Error('Gagal menghapus berita.', { cause: error });
  }
}

// App Settings Operations
export async function getAppSetting(key: string) {
  try {
    return await runWithRetry(async () => {
      const records = await db.select().from(appSettings).where(eq(appSettings.settingKey, key));
      return records.length > 0 ? records[0].settingValue : null;
    });
  } catch (error) {
    console.error(`Failed to get app setting for ${key}:`, error);
    throw new Error(`Gagal mengambil pengaturan ${key}.`, { cause: error });
  }
}

export async function setAppSetting(key: string, value: any) {
  try {
    // Ensure value is never null or undefined for NOT NULL jsonb column
    let safeValue: any = value;
    const isListKey = key.endsWith('_list') || [
      'student_list', 'stats_list', 'programs', 'extracurriculars',
      'achievements', 'facilities', 'gallery', 'video_gallery',
      'testimonials', 'faqs'
    ].includes(key);

    if (safeValue === undefined || safeValue === null) {
      safeValue = isListKey ? [] : {};
    } else {
      // Ensure serializable JSON without undefined, symbols or circular references
      try {
        safeValue = JSON.parse(JSON.stringify(safeValue));
      } catch {
        safeValue = Array.isArray(value) ? [] : {};
      }
    }

    return await runWithRetry(async () => {
      const result = await db.insert(appSettings)
        .values({
          settingKey: key,
          settingValue: safeValue,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: appSettings.settingKey,
          set: {
            settingValue: safeValue,
            updatedAt: new Date(),
          },
        })
        .returning();
      return result[0];
    });
  } catch (error) {
    console.error(`Failed to set app setting for ${key}:`, error);
    throw new Error(`Gagal menyimpan pengaturan ${key}.`, { cause: error });
  }
}

// Master Data Aggregator for Online Sync
export async function getAllMadrasahOnlineData() {
  try {
    const [
      dbSettings,
      dbStaff,
      dbNews,
      dbPPDB
    ] = await runWithRetry(async () => {
      return await Promise.all([
        db.select().from(appSettings),
        db.select().from(staffMembers).orderBy(asc(staffMembers.orderNum)),
        db.select().from(newsArticles).orderBy(desc(newsArticles.createdAt)),
        db.select().from(ppdbRegistrations).orderBy(desc(ppdbRegistrations.createdAt)),
      ]);
    });

    const settingsMap: Record<string, any> = {};
    dbSettings.forEach((row) => {
      settingsMap[row.settingKey] = row.settingValue;
    });

    const activeProfile = settingsMap['school_profile'] || SCHOOL_PROFILE;
    // Ensure logoUrl is present and valid
    if (!activeProfile.logoUrl || activeProfile.logoUrl.includes('wikimedia.org')) {
      activeProfile.logoUrl = '/assets/logo-maarif.svg';
    }

    const DUMMY_STAFF_IDS = ['staff-1', 'staff-2', 'staff-1789528823190-1-64pi7', 'staff-1789529008391-2-hk1tr'];
    const filteredDbStaff = dbStaff.filter((s) => !DUMMY_STAFF_IDS.includes(s.id));
    const mappedStaff = filteredDbStaff.length > 0 ? filteredDbStaff.map((s, idx) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      category: s.category as any,
      institution: (s as any).institution || (
        s.role?.toLowerCase().includes('kelompok') ||
        s.role?.toLowerCase().includes('raudhatul') ||
        s.role?.toLowerCase().includes('ra ') ||
        s.category?.toLowerCase().includes('ra')
          ? 'RA'
          : 'MI'
      ),
      nipOrNuptk: s.nip || (s as any).nipOrNuptk || '-',
      education: s.education || '',
      subjects: s.subject || (s as any).subjects || '',
      photoUrl: s.photoUrl || '',
      phone: (s as any).phone || '',
      order: s.orderNum ?? (s as any).order ?? (idx + 1),
      status: 'Aktif' as const,
    })) : STAFF_DATA;

    const mappedNews = dbNews.length > 0 ? dbNews.map((n) => {
      let contentArr: string[] = [];
      if (Array.isArray(n.content)) {
        contentArr = n.content.map(String).filter(Boolean);
      } else if (typeof n.content === 'string' && n.content.trim()) {
        contentArr = n.content.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
      }

      const summaryText = n.excerpt || (n as any).summary || (contentArr[0] ? contentArr[0].slice(0, 160) : '') || '';
      if (contentArr.length === 0 && summaryText) {
        contentArr = [summaryText];
      }

      return {
        id: n.id,
        title: n.title,
        category: (n.category as any) || 'Berita Madrasah',
        summary: summaryText,
        content: contentArr,
        imageUrl: n.imageUrl || '',
        author: n.author || 'Admin Madrasah',
        date: n.date || new Date().toISOString().split('T')[0],
        readTime: n.readTime || '3 menit',
      };
    }).sort((a, b) => {
      const timeA = parseDateTimestamp(a.date);
      const timeB = parseDateTimestamp(b.date);
      return timeB - timeA;
    }) : [];

    return {
      schoolProfile: activeProfile,
      statsList: settingsMap['stats_list'] ?? [],
      programs: settingsMap['programs'] || PROGRAMS_DATA,
      extracurriculars: settingsMap['extracurriculars'] || EXTRACURRICULARS,
      achievements: settingsMap['achievements'] || [],
      facilities: settingsMap['facilities'] || FACILITIES,
      gallery: settingsMap['gallery'] || [],
      videoGallery: settingsMap['video_gallery'] || INITIAL_VIDEOS,
      testimonials: settingsMap['testimonials'] || [],
      faqs: settingsMap['faqs'] || FAQ_DATA,
      staffList: mappedStaff,
      studentList: settingsMap['student_list'] || [],
      newsList: mappedNews,
      ppdbRegistrations: dbPPDB,
    };
  } catch (error) {
    console.warn('Failed to get all madrasah online data from Cloud SQL, using initial baseline fallback:', error);
    return {
      schoolProfile: SCHOOL_PROFILE,
      statsList: STATS_DATA,
      programs: PROGRAMS_DATA,
      extracurriculars: EXTRACURRICULARS,
      achievements: ACHIEVEMENTS,
      facilities: FACILITIES,
      gallery: GALLERY_DATA,
      videoGallery: INITIAL_VIDEOS,
      testimonials: TESTIMONIALS,
      faqs: FAQ_DATA,
      staffList: STAFF_DATA,
      studentList: INITIAL_STUDENTS,
      newsList: INITIAL_NEWS,
      ppdbRegistrations: INITIAL_PPDB_REGISTRATIONS,
    };
  }
}

// Seed initial baseline into Cloud SQL only if tables are completely empty
export async function seedInitialDatabaseIfEmpty() {
  try {
    const existingStaff = await db.select().from(staffMembers).limit(1);
    if (existingStaff.length === 0) {
      console.log('Seeding initial headmaster into Cloud SQL...');
      for (const s of STAFF_DATA) {
        await db.insert(staffMembers).values({
          id: s.id,
          name: s.name,
          role: s.role,
          category: s.category,
          nip: s.nipOrNuptk || null,
          education: s.education || null,
          subject: s.subjects || null,
          photoUrl: s.photoUrl || null,
          bio: null,
          orderNum: s.order || 0,
        }).onConflictDoNothing();
      }
    }

    const existingProfile = (await getAppSetting('school_profile')) as any;
    if (!existingProfile) {
      await setAppSetting('school_profile', SCHOOL_PROFILE);
    }
    const existingStats = await getAppSetting('stats_list');
    if (!existingStats) {
      await setAppSetting('stats_list', STATS_DATA);
    }
    const existingPrograms = await getAppSetting('programs');
    if (!existingPrograms) {
      await setAppSetting('programs', PROGRAMS_DATA);
    }
    const existingExtracurriculars = await getAppSetting('extracurriculars');
    if (!existingExtracurriculars) {
      await setAppSetting('extracurriculars', EXTRACURRICULARS);
    }
    const existingAchievements = await getAppSetting('achievements');
    if (!existingAchievements) {
      await setAppSetting('achievements', ACHIEVEMENTS);
    }
    const existingFacilities = await getAppSetting('facilities');
    if (!existingFacilities) {
      await setAppSetting('facilities', FACILITIES);
    }
    const existingGallery = await getAppSetting('gallery');
    if (!existingGallery) {
      await setAppSetting('gallery', GALLERY_DATA);
    }
    const existingVideos = await getAppSetting('video_gallery');
    if (!existingVideos) {
      await setAppSetting('video_gallery', INITIAL_VIDEOS);
    }
    const existingTestimonials = await getAppSetting('testimonials');
    if (!existingTestimonials) {
      await setAppSetting('testimonials', TESTIMONIALS);
    }
    const existingFAQs = await getAppSetting('faqs');
    if (!existingFAQs) {
      await setAppSetting('faqs', FAQ_DATA);
    }
    const existingStudents = await getAppSetting('student_list');
    if (!existingStudents) {
      await setAppSetting('student_list', INITIAL_STUDENTS);
    }

    console.log('Cloud SQL baseline data check completed.');
  } catch (error) {
    console.error('Error seeding initial database data:', error);
  }
}
