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
  INITIAL_NEWS,
  TESTIMONIALS,
  FAQ_DATA,
  INITIAL_PPDB_REGISTRATIONS
} from '../data/schoolData.ts';

// PPDB Operations
export async function getPPDBList() {
  try {
    return await db.select().from(ppdbRegistrations).orderBy(desc(ppdbRegistrations.createdAt));
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
    return await db.select().from(staffMembers).orderBy(asc(staffMembers.orderNum), asc(staffMembers.name));
  } catch (error) {
    console.error('Failed to fetch staff list:', error);
    throw new Error('Gagal mengambil daftar GTK.', { cause: error });
  }
}

export async function upsertStaff(item: {
  id: string;
  name: string;
  role: string;
  category: string;
  nip?: string;
  education?: string;
  subject?: string;
  photoUrl?: string;
  bio?: string;
  orderNum?: number;
}) {
  try {
    const result = await db.insert(staffMembers)
      .values({
        id: item.id,
        name: item.name,
        role: item.role,
        category: item.category,
        nip: item.nip || null,
        education: item.education || null,
        subject: item.subject || null,
        photoUrl: item.photoUrl || null,
        bio: item.bio || null,
        orderNum: item.orderNum ?? 0,
      })
      .onConflictDoUpdate({
        target: staffMembers.id,
        set: {
          name: item.name,
          role: item.role,
          category: item.category,
          nip: item.nip || null,
          education: item.education || null,
          subject: item.subject || null,
          photoUrl: item.photoUrl || null,
          bio: item.bio || null,
          orderNum: item.orderNum ?? 0,
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Failed to upsert staff member:', error);
    throw new Error('Gagal menyimpan data GTK.', { cause: error });
  }
}

export async function deleteStaff(id: string) {
  try {
    await db.delete(staffMembers).where(eq(staffMembers.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete staff member:', error);
    throw new Error('Gagal menghapus data GTK.', { cause: error });
  }
}

// News Operations
export async function getNewsList() {
  try {
    return await db.select().from(newsArticles).orderBy(desc(newsArticles.createdAt));
  } catch (error) {
    console.error('Failed to fetch news list:', error);
    throw new Error('Gagal mengambil daftar berita.', { cause: error });
  }
}

export async function upsertNews(item: {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  imageUrl?: string;
  readTime?: string;
  isPublished?: boolean;
}) {
  try {
    const result = await db.insert(newsArticles)
      .values({
        id: item.id,
        title: item.title,
        slug: item.slug,
        category: item.category,
        excerpt: item.excerpt,
        content: item.content,
        date: item.date,
        author: item.author,
        imageUrl: item.imageUrl || null,
        readTime: item.readTime || '3 menit',
        isPublished: item.isPublished ?? true,
      })
      .onConflictDoUpdate({
        target: newsArticles.id,
        set: {
          title: item.title,
          slug: item.slug,
          category: item.category,
          excerpt: item.excerpt,
          content: item.content,
          date: item.date,
          author: item.author,
          imageUrl: item.imageUrl || null,
          readTime: item.readTime || '3 menit',
          isPublished: item.isPublished ?? true,
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Failed to upsert news article:', error);
    throw new Error('Gagal menyimpan artikel berita.', { cause: error });
  }
}

export async function deleteNews(id: string) {
  try {
    await db.delete(newsArticles).where(eq(newsArticles.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete news article:', error);
    throw new Error('Gagal menghapus berita.', { cause: error });
  }
}

// App Settings Operations
export async function getAppSetting(key: string) {
  try {
    const records = await db.select().from(appSettings).where(eq(appSettings.settingKey, key));
    return records.length > 0 ? records[0].settingValue : null;
  } catch (error) {
    console.error(`Failed to get app setting for ${key}:`, error);
    throw new Error(`Gagal mengambil pengaturan ${key}.`, { cause: error });
  }
}

export async function setAppSetting(key: string, value: any) {
  try {
    const result = await db.insert(appSettings)
      .values({
        settingKey: key,
        settingValue: value,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: appSettings.settingKey,
        set: {
          settingValue: value,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
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
    ] = await Promise.all([
      db.select().from(appSettings),
      db.select().from(staffMembers).orderBy(asc(staffMembers.orderNum)),
      db.select().from(newsArticles).orderBy(desc(newsArticles.createdAt)),
      db.select().from(ppdbRegistrations).orderBy(desc(ppdbRegistrations.createdAt)),
    ]);

    const settingsMap: Record<string, any> = {};
    dbSettings.forEach((row) => {
      settingsMap[row.settingKey] = row.settingValue;
    });

    const activeProfile = settingsMap['school_profile'] || SCHOOL_PROFILE;
    // Ensure logoUrl is present and valid
    if (!activeProfile.logoUrl || activeProfile.logoUrl.includes('wikimedia.org')) {
      activeProfile.logoUrl = '/assets/logo-maarif.svg';
    }

    const mappedStaff = dbStaff.length > 0 ? dbStaff.map((s, idx) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      category: s.category as any,
      nipOrNuptk: s.nip || (s as any).nipOrNuptk || '-',
      education: s.education || '',
      subjects: s.subject || (s as any).subjects || '',
      photoUrl: s.photoUrl || '',
      phone: (s as any).phone || '',
      order: s.orderNum ?? (s as any).order ?? (idx + 1),
      status: 'Aktif' as const,
    })) : STAFF_DATA;

    return {
      schoolProfile: activeProfile,
      statsList: settingsMap['stats_list'] ?? STATS_DATA,
      programs: settingsMap['programs'] || PROGRAMS_DATA,
      extracurriculars: settingsMap['extracurriculars'] || EXTRACURRICULARS,
      achievements: settingsMap['achievements'] || ACHIEVEMENTS,
      facilities: settingsMap['facilities'] || FACILITIES,
      gallery: settingsMap['gallery'] || GALLERY_DATA,
      testimonials: settingsMap['testimonials'] || TESTIMONIALS,
      faqs: settingsMap['faqs'] || FAQ_DATA,
      staffList: mappedStaff,
      newsList: dbNews.length > 0 ? dbNews : INITIAL_NEWS,
      ppdbRegistrations: dbPPDB.length > 0 ? dbPPDB : INITIAL_PPDB_REGISTRATIONS,
    };
  } catch (error) {
    console.error('Failed to get all madrasah online data:', error);
    throw new Error('Gagal memuat data online dari Cloud SQL database.', { cause: error });
  }
}

// Seed initial baseline into Cloud SQL if empty or incomplete
export async function seedInitialDatabaseIfEmpty() {
  try {
    const existingStaff = await db.select().from(staffMembers);
    if (existingStaff.length < STAFF_DATA.length) {
      console.log('Seeding / updating full dewan guru & staf (GTK) into Cloud SQL...');
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
        }).onConflictDoUpdate({
          target: staffMembers.id,
          set: {
            name: s.name,
            role: s.role,
            category: s.category,
            nip: s.nipOrNuptk || null,
            education: s.education || null,
            subject: s.subjects || null,
            photoUrl: s.photoUrl || null,
            orderNum: s.order || 0,
          }
        });
      }
    }

    const existingNews = await db.select().from(newsArticles).limit(1);
    if (existingNews.length === 0) {
      console.log('Seeding initial news articles into Cloud SQL...');
      for (const n of INITIAL_NEWS) {
        await db.insert(newsArticles).values({
          id: n.id,
          title: n.title,
          slug: n.id,
          category: n.category,
          excerpt: n.summary || '',
          content: Array.isArray(n.content) ? n.content.join('\n\n') : String(n.content || ''),
          date: n.date,
          author: n.author,
          imageUrl: n.imageUrl || null,
          readTime: n.readTime || '3 menit',
          isPublished: true,
        }).onConflictDoNothing();
      }
    }

    const existingPPDB = await db.select().from(ppdbRegistrations).limit(1);
    if (existingPPDB.length === 0) {
      console.log('Seeding initial PPDB registrations into Cloud SQL...');
      for (const p of INITIAL_PPDB_REGISTRATIONS) {
        await db.insert(ppdbRegistrations).values({
          id: p.id,
          registrationNumber: p.registrationNumber,
          fullName: p.studentName,
          nisn: p.nisn || null,
          nik: p.nik || null,
          birthPlace: p.birthPlace || null,
          birthDate: p.birthDate || null,
          gender: p.gender,
          parentName: p.parentName,
          parentPhone: p.parentPhone,
          parentAddress: p.address || null,
          previousSchool: p.originSchool || null,
          registrationDate: p.submissionDate,
          status: p.status,
          notes: p.notes || null,
          documentsJson: null,
        }).onConflictDoNothing();
      }
    }

    const existingProfile = (await getAppSetting('school_profile')) as any;
    if (!existingProfile || !existingProfile.logoUrl || String(existingProfile.logoUrl).includes('wikimedia.org')) {
      await setAppSetting('school_profile', {
        ...(existingProfile || SCHOOL_PROFILE),
        logoUrl: (existingProfile?.logoUrl && !String(existingProfile.logoUrl).includes('wikimedia.org')) ? existingProfile.logoUrl : '/assets/logo-maarif.svg'
      });
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
    const existingTestimonials = await getAppSetting('testimonials');
    if (!existingTestimonials) {
      await setAppSetting('testimonials', TESTIMONIALS);
    }
    const existingFAQs = await getAppSetting('faqs');
    if (!existingFAQs) {
      await setAppSetting('faqs', FAQ_DATA);
    }

    console.log('Cloud SQL baseline data ready.');
  } catch (error) {
    console.error('Error seeding initial database data:', error);
  }
}
