import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  saveAllToSupabase,
  loadFromSupabase,
  supabase,
  CLIENT_INSTANCE_ID,
  broadcastSupabaseChange,
  upsertStaffToSupabase,
  deleteStaffFromSupabase,
  deleteNewsFromSupabase,
  deleteItemFromSupabase,
  upsertSchoolProfileToSupabase
} from '../lib/supabase';
import { parseDateTimestamp } from '../lib/dateUtils';
import {
  SchoolProfile,
  ProgramItem,
  ExtracurricularItem,
  AchievementItem,
  NewsArticle,
  FacilityItem,
  GalleryItem,
  VideoGalleryItem,
  TestimonialItem,
  FAQItem,
  PPDBRegistration,
  StaffMember,
  StatItem,
  StudentItem
} from '../types';
import {
  SCHOOL_PROFILE,
  PROGRAMS_DATA,
  EXTRACURRICULARS,
  ACHIEVEMENTS,
  INITIAL_NEWS,
  FACILITIES,
  GALLERY_DATA,
  INITIAL_VIDEOS,
  TESTIMONIALS,
  FAQ_DATA,
  INITIAL_PPDB_REGISTRATIONS,
  STAFF_DATA,
  STATS_DATA,
  INITIAL_STUDENTS
} from '../data/schoolData';

const STORAGE_KEY = 'mi_al_ihsan_data_v4';
const AUTH_KEY = 'mi_al_ihsan_auth_v1';
const ADMIN_API_KEY = 'alihsan2025';

export function getAdminAuthHeaders(): Record<string, string> {
  const token = (typeof localStorage !== 'undefined' && localStorage.getItem('mi_al_ihsan_admin_token')) || ADMIN_API_KEY;
  return {
    'Content-Type': 'application/json',
    'x-admin-secret': token,
    'x-admin-key': token,
    'x-client-role': 'madrasah-admin',
    'Authorization': `Bearer ${token}`,
  };
}

export async function apiRequest(url: string, options: RequestInit = {}) {
  const headers = {
    ...getAdminAuthHeaders(),
    ...(options.headers as Record<string, string> || {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

export interface AppStorageState {
  schoolProfile: SchoolProfile;
  staffList: StaffMember[];
  studentList: StudentItem[];
  statsList: StatItem[];
  programs: ProgramItem[];
  extracurriculars: ExtracurricularItem[];
  achievements: AchievementItem[];
  newsList: NewsArticle[];
  facilities: FacilityItem[];
  gallery: GalleryItem[];
  videoGallery: VideoGalleryItem[];
  testimonials: TestimonialItem[];
  faqs: FAQItem[];
  ppdbRegistrations: PPDBRegistration[];
}

export type CloudSyncStatus = 'connected' | 'syncing' | 'synced' | 'offline' | 'error';

interface DataContextType {
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;

  staffList: StaffMember[];
  addStaff: (item: Omit<StaffMember, 'id'>) => void;
  addStaffBatch: (items: Omit<StaffMember, 'id'>[], replaceAll?: boolean) => void;
  updateStaff: (id: string, item: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;

  studentList: StudentItem[];
  addStudent: (item: Omit<StudentItem, 'id'>) => void;
  addStudentsBatch: (items: Omit<StudentItem, 'id'>[], replaceAll?: boolean) => void;
  updateStudent: (id: string, item: Partial<StudentItem>) => void;
  deleteStudent: (id: string) => void;

  statsList: StatItem[];
  setStatsList: (stats: StatItem[]) => void;
  addStat: (item: Omit<StatItem, 'id'> & { id?: string }) => void;
  updateStat: (id: string, item: Partial<StatItem>) => void;
  deleteStat: (id: string) => void;

  programs: ProgramItem[];
  addProgram: (item: Omit<ProgramItem, 'id'>) => void;
  updateProgram: (id: string, item: Partial<ProgramItem>) => void;
  deleteProgram: (id: string) => void;

  extracurriculars: ExtracurricularItem[];
  addExtracurricular: (item: Omit<ExtracurricularItem, 'id'>) => void;
  updateExtracurricular: (id: string, item: Partial<ExtracurricularItem>) => void;
  deleteExtracurricular: (id: string) => void;

  achievements: AchievementItem[];
  addAchievement: (item: Omit<AchievementItem, 'id'>) => void;
  updateAchievement: (id: string, item: Partial<AchievementItem>) => void;
  deleteAchievement: (id: string) => void;

  newsList: NewsArticle[];
  addNews: (item: Omit<NewsArticle, 'id'>) => void;
  updateNews: (id: string, item: Partial<NewsArticle>) => void;
  deleteNews: (id: string) => void;

  facilities: FacilityItem[];
  addFacility: (item: Omit<FacilityItem, 'id'>) => void;
  updateFacility: (id: string, item: Partial<FacilityItem>) => void;
  deleteFacility: (id: string) => void;

  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;

  videoGallery: VideoGalleryItem[];
  addVideoItem: (item: Omit<VideoGalleryItem, 'id'>) => void;
  updateVideoItem: (id: string, item: Partial<VideoGalleryItem>) => void;
  deleteVideoItem: (id: string) => void;

  testimonials: TestimonialItem[];
  addTestimonial: (item: Omit<TestimonialItem, 'id'>) => void;
  updateTestimonial: (id: string, item: Partial<TestimonialItem>) => void;
  deleteTestimonial: (id: string) => void;

  faqs: FAQItem[];
  addFAQ: (item: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, item: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;

  ppdbRegistrations: PPDBRegistration[];
  addPPDBRegistration: (reg: Omit<PPDBRegistration, 'id' | 'submissionDate'>) => Promise<string>;
  updatePPDBStatus: (id: string, status: PPDBRegistration['status'], notes?: string) => Promise<void>;
  deletePPDBRegistration: (id: string) => Promise<void>;

  // Admin Auth & Mode
  isAdmin: boolean;
  viewMode: 'public' | 'admin';
  setViewMode: (mode: 'public' | 'admin') => void;
  loginAdmin: (secret: string) => boolean;
  logoutAdmin: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;

  // Cloud Database Status & Actions
  cloudSyncStatus: CloudSyncStatus;
  lastSyncedAt: string | null;
  refreshFromCloud: () => Promise<void>;
  pushAllToCloud: (authToken?: string | null) => Promise<boolean>;
  syncToSupabase: () => Promise<{ success: boolean; message: string }>;
  pullFromSupabase: () => Promise<boolean>;

  // Backup & Reset
  resetToDefaultData: () => void;
  exportBackupJSON: () => void;
  importBackupJSON: (jsonString: string) => boolean;
}

const DataContext = createContext<DataContextType | null>(null);

const DEFAULT_DATA: AppStorageState = {
  schoolProfile: SCHOOL_PROFILE,
  staffList: STAFF_DATA,
  studentList: INITIAL_STUDENTS,
  statsList: STATS_DATA,
  programs: PROGRAMS_DATA,
  extracurriculars: EXTRACURRICULARS,
  achievements: ACHIEVEMENTS,
  newsList: INITIAL_NEWS,
  facilities: FACILITIES,
  gallery: GALLERY_DATA,
  videoGallery: INITIAL_VIDEOS,
  testimonials: TESTIMONIALS,
  faqs: FAQ_DATA,
  ppdbRegistrations: INITIAL_PPDB_REGISTRATIONS,
};

let uniqueCounter = 0;

export const generateUniqueId = (prefix: string): string => {
  uniqueCounter = (uniqueCounter + 1) % 1000000;
  return `${prefix}-${Date.now()}-${uniqueCounter}-${Math.random().toString(36).substring(2, 7)}`;
};

export const sortNewsByDateDesc = (list: NewsArticle[]): NewsArticle[] => {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const timeA = parseDateTimestamp(a.date);
    const timeB = parseDateTimestamp(b.date);
    if (timeB !== timeA) {
      return timeB - timeA;
    }
    return (b.id || '').localeCompare(a.id || '');
  });
};

export const ensureUniqueIds = <T extends { id?: string }>(items: T[] | undefined, prefix: string): T[] => {
  if (!Array.isArray(items)) return [];
  const seen = new Set<string>();
  return items.map((item, index) => {
    let id = item.id ? String(item.id).trim() : '';
    if (!id || seen.has(id)) {
      uniqueCounter = (uniqueCounter + 1) % 1000000;
      id = `${prefix}-${Date.now()}-${uniqueCounter}-${index}-${Math.random().toString(36).substring(2, 7)}`;
    }
    seen.add(id);
    return { ...item, id };
  });
};

export const sanitizeAppState = (raw: any): AppStorageState => {
  if (!raw) return DEFAULT_DATA;
  const rawProfile = raw.schoolProfile || {};
  const isOldDummyPhoto =
    rawProfile.headmasterPhotoUrl ===
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80' ||
    rawProfile.headmasterPhotoUrl ===
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80';

  const schoolProfile = {
    ...DEFAULT_DATA.schoolProfile,
    ...rawProfile,
    headmasterPhotoUrl: isOldDummyPhoto
      ? ''
      : (rawProfile.headmasterPhotoUrl || ''),
    headmasterPhotoPosition: rawProfile.headmasterPhotoPosition || 'top',
    headmasterPhotoScale: rawProfile.headmasterPhotoScale ?? 100,
    headmasterPhotoFit: rawProfile.headmasterPhotoFit || 'cover',
    faviconUrl: rawProfile.faviconUrl !== undefined ? rawProfile.faviconUrl : (rawProfile.logoUrl || DEFAULT_DATA.schoolProfile.faviconUrl || '/assets/logo-maarif.svg'),
    heroSliderDuration: typeof rawProfile.heroSliderDuration === 'number' && rawProfile.heroSliderDuration >= 2
      ? rawProfile.heroSliderDuration
      : (DEFAULT_DATA.schoolProfile.heroSliderDuration || 5),
    heroSliderAutoPlay: rawProfile.heroSliderAutoPlay !== undefined
      ? Boolean(rawProfile.heroSliderAutoPlay)
      : (DEFAULT_DATA.schoolProfile.heroSliderAutoPlay ?? true),
    heroSlides: Array.isArray(rawProfile.heroSlides) && rawProfile.heroSlides.length > 0
      ? rawProfile.heroSlides.map((slide: any, idx: number) => {
          const defaultSlide = DEFAULT_DATA.schoolProfile.heroSlides?.[idx] || DEFAULT_DATA.schoolProfile.heroSlides?.[0];
          return {
            ...slide,
            id: slide.id || `slide-${idx + 1}`,
            photoUrl: slide.photoUrl !== undefined ? slide.photoUrl : (defaultSlide?.photoUrl || ''),
            photoCaption: slide.photoCaption !== undefined ? slide.photoCaption : (defaultSlide?.photoCaption || ''),
          };
        })
      : (DEFAULT_DATA.schoolProfile.heroSlides || []),
  };

  const sanitizedNewsList = (raw.newsList && Array.isArray(raw.newsList) ? raw.newsList : (DEFAULT_DATA.newsList || [])).map((n: any) => {
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
      ...n,
      summary,
      content: contentArr,
      author: n.author || 'Admin Madrasah',
      readTime: n.readTime || '3 menit',
    };
  });

  return {
    schoolProfile,
    staffList: ensureUniqueIds(Array.isArray(raw.staffList) ? raw.staffList : DEFAULT_DATA.staffList, 'staff'),
    studentList: ensureUniqueIds(Array.isArray(raw.studentList) ? raw.studentList : DEFAULT_DATA.studentList, 'std'),
    statsList: ensureUniqueIds(Array.isArray(raw.statsList) ? raw.statsList : DEFAULT_DATA.statsList, 'stat'),
    programs: ensureUniqueIds(Array.isArray(raw.programs) ? raw.programs : DEFAULT_DATA.programs, 'prog'),
    extracurriculars: ensureUniqueIds(Array.isArray(raw.extracurriculars) ? raw.extracurriculars : DEFAULT_DATA.extracurriculars, 'ekskul'),
    achievements: ensureUniqueIds(Array.isArray(raw.achievements) ? raw.achievements : DEFAULT_DATA.achievements, 'ach'),
    newsList: sortNewsByDateDesc(ensureUniqueIds(sanitizedNewsList, 'news')),
    facilities: ensureUniqueIds(Array.isArray(raw.facilities) ? raw.facilities : DEFAULT_DATA.facilities, 'fac'),
    gallery: ensureUniqueIds(Array.isArray(raw.gallery) ? raw.gallery : DEFAULT_DATA.gallery, 'gal'),
    videoGallery: ensureUniqueIds(Array.isArray(raw.videoGallery) ? raw.videoGallery : (DEFAULT_DATA.videoGallery || []), 'vid'),
    testimonials: ensureUniqueIds(Array.isArray(raw.testimonials) ? raw.testimonials : DEFAULT_DATA.testimonials, 'testi'),
    faqs: ensureUniqueIds(Array.isArray(raw.faqs) ? raw.faqs : DEFAULT_DATA.faqs, 'faq'),
    ppdbRegistrations: ensureUniqueIds(Array.isArray(raw.ppdbRegistrations) ? raw.ppdbRegistrations : DEFAULT_DATA.ppdbRegistrations, 'reg'),
  };
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppStorageState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return sanitizeAppState(parsed);
      }
    } catch (e) {
      console.error('Error loading local school data:', e);
    }
    return sanitizeAppState(DEFAULT_DATA);
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('connected');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Sync to local storage for instant responsiveness
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [data]);

  const isInitialMount = useRef(true);
  const isRemoteUpdating = useRef(false);
  const isCloudLoadedRef = useRef(false);
  const hasUserEditedRef = useRef(false);
  const lastKnownVersionRef = useRef<number>(0);
  const lastLocalEditTimeRef = useRef<number>(0);
  const isSelfPushingRef = useRef<boolean>(false);

  // Mark local user modification so auto-sync knows an intentional edit occurred
  const markLocalEdit = useCallback(() => {
    lastLocalEditTimeRef.current = Date.now();
    hasUserEditedRef.current = true;
    setCloudSyncStatus('syncing');
  }, []);

  // Fetch online data from Cloud SQL on initial load or on real-time event
  const refreshFromCloud = useCallback(async (silent: boolean = false) => {
    try {
      if (!silent) setCloudSyncStatus('syncing');
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const onlineData = json.data;
          if (json.version) {
            lastKnownVersionRef.current = json.version;
          }

          // If user edited locally very recently, do not overwrite in-progress edits
          if (Date.now() - lastLocalEditTimeRef.current < 2500) {
            setCloudSyncStatus('synced');
            isCloudLoadedRef.current = true;
            return;
          }

          isRemoteUpdating.current = true;
          setData((prev) => {
            const rawProfile = { ...prev.schoolProfile, ...(onlineData.schoolProfile || {}) };
            if (!rawProfile.logoUrl || rawProfile.logoUrl.includes('wikimedia.org')) {
              rawProfile.logoUrl = '/assets/logo-maarif.svg';
            }

            const sanitized = sanitizeAppState({
              schoolProfile: rawProfile,
              staffList: Array.isArray(onlineData.staffList) ? onlineData.staffList : prev.staffList,
              studentList: Array.isArray(onlineData.studentList) ? onlineData.studentList : prev.studentList,
              statsList: Array.isArray(onlineData.statsList) ? onlineData.statsList : prev.statsList,
              programs: Array.isArray(onlineData.programs) ? onlineData.programs : prev.programs,
              extracurriculars: Array.isArray(onlineData.extracurriculars) ? onlineData.extracurriculars : prev.extracurriculars,
              achievements: Array.isArray(onlineData.achievements) ? onlineData.achievements : prev.achievements,
              newsList: Array.isArray(onlineData.newsList) ? onlineData.newsList : prev.newsList,
              facilities: Array.isArray(onlineData.facilities) ? onlineData.facilities : prev.facilities,
              gallery: Array.isArray(onlineData.gallery) ? onlineData.gallery : prev.gallery,
              testimonials: Array.isArray(onlineData.testimonials) ? onlineData.testimonials : prev.testimonials,
              faqs: Array.isArray(onlineData.faqs) ? onlineData.faqs : prev.faqs,
              ppdbRegistrations: Array.isArray(onlineData.ppdbRegistrations) ? onlineData.ppdbRegistrations : prev.ppdbRegistrations,
            });
            return sanitized;
          });
          isCloudLoadedRef.current = true;
          setCloudSyncStatus('synced');
          setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
          return;
        }
      }

      // Fallback: Supabase
      const remoteState = await loadFromSupabase();
      if (remoteState && remoteState.schoolProfile) {
        if (Date.now() - lastLocalEditTimeRef.current < 2500) {
          isCloudLoadedRef.current = true;
          setCloudSyncStatus('synced');
          return;
        }
        isRemoteUpdating.current = true;
        setData(sanitizeAppState(remoteState));
        isCloudLoadedRef.current = true;
        setCloudSyncStatus('synced');
        setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
      } else {
        isCloudLoadedRef.current = true;
        setCloudSyncStatus('connected');
      }
    } catch (err) {
      console.warn('Could not refresh from Cloud SQL, trying Supabase fallback:', err);
      try {
        const remoteState = await loadFromSupabase();
        if (remoteState && remoteState.schoolProfile) {
          if (Date.now() - lastLocalEditTimeRef.current < 2500) {
            isCloudLoadedRef.current = true;
            setCloudSyncStatus('synced');
            return;
          }
          isRemoteUpdating.current = true;
          setData(sanitizeAppState(remoteState));
          isCloudLoadedRef.current = true;
          setCloudSyncStatus('synced');
          setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
          return;
        }
      } catch (e) {}
      isCloudLoadedRef.current = true;
      if (Date.now() - lastLocalEditTimeRef.current > 3000) {
        setCloudSyncStatus('offline');
      } else {
        setCloudSyncStatus('synced');
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshFromCloud();
  }, [refreshFromCloud]);

  // Auth methods
  const loginAdmin = (secret: string): boolean => {
    const clean = secret.trim().toLowerCase();
    if (clean === 'admin123' || clean === 'alihsan2025' || clean === 'soborejo' || clean === 'admin') {
      setIsAdmin(true);
      try {
        localStorage.setItem(AUTH_KEY, 'true');
        localStorage.setItem('mi_al_ihsan_admin_token', clean);
      } catch (e) {}
      setViewMode('admin');
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setViewMode('public');
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem('mi_al_ihsan_admin_token');
    } catch (e) {}
  };

  // Push all data to Cloud SQL + Supabase with strict anti-overwrite safeguards
  const pushAllToCloud = useCallback(async (authToken?: string | null, force: boolean = false): Promise<boolean> => {
    // 1. Only admins can push data to Cloud SQL / Supabase
    if (!isAdmin && !authToken && !force) {
      return false;
    }

    // 2. Never push unhydrated state before cloud data has loaded
    if (!isCloudLoadedRef.current && !force) {
      console.warn('Sync aborted: Cloud data has not completed initial hydration.');
      return false;
    }

    // 3. Never push if no user edits were made in this session
    if (!hasUserEditedRef.current && !force) {
      return false;
    }

    try {
      setCloudSyncStatus('syncing');
      isSelfPushingRef.current = true;

      const payload = {
        schoolProfile: data.schoolProfile,
        statsList: data.statsList,
        programs: data.programs,
        extracurriculars: data.extracurriculars,
        achievements: data.achievements,
        facilities: data.facilities,
        gallery: data.gallery,
        testimonials: data.testimonials,
        faqs: data.faqs,
        staffList: data.staffList,
        studentList: data.studentList,
        newsList: data.newsList,
      };

      const cloudSqlPromise = apiRequest('/api/sync-all', {
        method: 'POST',
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        body: JSON.stringify(payload)
      }).then(async (res) => {
        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          throw new Error(`Cloud SQL returned ${res.status}: ${errText}`);
        }
        return res;
      });

      const supabasePromise = saveAllToSupabase(data, {
        isAuthorizedAdmin: true,
        force,
      });

      const [cloudSqlRes, supabaseRes] = await Promise.allSettled([
        cloudSqlPromise,
        supabasePromise,
      ]);

      const cloudSqlSuccess = cloudSqlRes.status === 'fulfilled';
      const supabaseSuccess = supabaseRes.status === 'fulfilled' && (supabaseRes.value as any)?.success !== false;

      // Broadcast across tabs in the same browser
      try {
        const bc = new BroadcastChannel('madrasah_live_channel');
        bc.postMessage({ type: 'data_updated', data, timestamp: Date.now() });
        bc.close();
      } catch (e) {}

      if (cloudSqlSuccess || supabaseSuccess) {
        setCloudSyncStatus('synced');
        setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
        hasUserEditedRef.current = false;
        return true;
      } else {
        console.warn('Both Cloud SQL and Supabase sync failed');
        setCloudSyncStatus('offline');
        return false;
      }
    } catch (err) {
      console.error('Failed to push to Cloud SQL:', err);
      saveAllToSupabase(data, { isAuthorizedAdmin: true, force })
        .then((res) => {
          if (res?.success) {
            setCloudSyncStatus('synced');
            setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
            hasUserEditedRef.current = false;
          } else {
            setCloudSyncStatus('offline');
          }
        })
        .catch(() => {
          setCloudSyncStatus('offline');
        });
      return false;
    } finally {
      setTimeout(() => {
        isSelfPushingRef.current = false;
      }, 2500);
    }
  }, [data, isAdmin]);

  // Automatic Debounced Cloud Push ONLY on real admin edits
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isRemoteUpdating.current) {
      isRemoteUpdating.current = false;
      return;
    }

    // STRICT DEFENSE AGAINST ACCIDENTAL OVERWRITES:
    // 1. Never push if user is not authenticated admin
    if (!isAdmin) {
      return;
    }

    // 2. Never push before initial cloud data has loaded
    if (!isCloudLoadedRef.current) {
      return;
    }

    // 3. Never push unless an admin actually performed a mutation in this session
    if (!hasUserEditedRef.current) {
      return;
    }

    // Auto debounce push to Cloud SQL + Supabase on verified admin edits
    const timer = setTimeout(() => {
      pushAllToCloud();
    }, 600);

    return () => clearTimeout(timer);
  }, [data, isAdmin, pushAllToCloud]);

  // 1. Realtime SSE Connection to /api/realtime/stream
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/realtime/stream');

        eventSource.onopen = () => {
          setCloudSyncStatus((prev) => (prev === 'syncing' ? 'syncing' : 'connected'));
        };

        eventSource.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            if (parsed.type === 'data_changed') {
              if (isSelfPushingRef.current || Date.now() - lastLocalEditTimeRef.current < 2500) {
                return;
              }
              // Silently refresh data from cloud if change came from another device/source
              refreshFromCloud(true);
            }
          } catch (e) {}
        };

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Reconnect after 5 seconds
          clearTimeout(reconnectTimeout);
          reconnectTimeout = setTimeout(connectSSE, 5000);
        };
      } catch (e) {
        console.warn('SSE not initialized, relying on fallback real-time channels.');
      }
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      clearTimeout(reconnectTimeout);
    };
  }, [refreshFromCloud]);

  // Synchronize browser favicon and apple-touch-icon dynamically with schoolProfile
  useEffect(() => {
    const favicon = (
      data.schoolProfile?.faviconUrl?.trim() ||
      data.schoolProfile?.logoUrl?.trim() ||
      '/assets/logo-maarif.svg'
    );
    if (!favicon || typeof document === 'undefined') return;

    try {
      // 1. Update/Inject link[rel~='icon']
      let iconLink = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!iconLink) {
        iconLink = document.createElement('link');
        iconLink.rel = 'icon';
        document.head.appendChild(iconLink);
      }
      if (favicon.endsWith('.svg') || favicon.startsWith('data:image/svg+xml')) {
        iconLink.type = 'image/svg+xml';
      } else if (favicon.endsWith('.ico') || favicon.startsWith('data:image/x-icon')) {
        iconLink.type = 'image/x-icon';
      } else if (favicon.endsWith('.png') || favicon.startsWith('data:image/png')) {
        iconLink.type = 'image/png';
      } else {
        iconLink.removeAttribute('type');
      }
      iconLink.href = favicon;

      // 2. Update/Inject link[rel='apple-touch-icon']
      let appleLink = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
      if (!appleLink) {
        appleLink = document.createElement('link');
        appleLink.rel = 'apple-touch-icon';
        document.head.appendChild(appleLink);
      }
      appleLink.href = favicon;
    } catch (e) {
      console.warn('Favicon synchronization error:', e);
    }
  }, [data.schoolProfile?.faviconUrl, data.schoolProfile?.logoUrl]);

  // 2. BroadcastChannel for instant zero-latency cross-tab sync in the same browser
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('madrasah_live_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'data_updated' && event.data.data) {
          if (isSelfPushingRef.current || Date.now() - lastLocalEditTimeRef.current < 2500) {
            return;
          }
          isRemoteUpdating.current = true;
          setData(sanitizeAppState(event.data.data));
          setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
        }
      };
    } catch (e) {}

    return () => {
      if (channel) channel.close();
    };
  }, []);

  // 3. Smart Polling + Window Focus + Online triggers
  useEffect(() => {
    const handleFocus = () => {
      // Check version or refresh when user switches tab or unlocks screen
      refreshFromCloud(true);
    };

    const handleOnline = () => {
      setCloudSyncStatus('syncing');
      refreshFromCloud(true);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);

    // Periodic background sync check every 12 seconds
    const interval = setInterval(() => {
      fetch('/api/data/version')
        .then((res) => res.json())
        .then((ver) => {
          if (ver && ver.version && ver.version > lastKnownVersionRef.current) {
            lastKnownVersionRef.current = ver.version;
            refreshFromCloud(true);
          }
        })
        .catch(() => {});
    }, 12000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
      clearInterval(interval);
    };
  }, [refreshFromCloud]);

  // 4. Supabase Realtime Channel: Broadcast & Postgres Changes for sub-second cross-device sync
  useEffect(() => {
    let broadcastSub: any = null;
    let dbSub: any = null;

    try {
      // Fast Realtime Broadcast channel (works on all devices without publication setup)
      broadcastSub = supabase
        .channel('madrasah_live_broadcast')
        .on('broadcast', { event: 'data_changed' }, async (eventPayload: any) => {
          const sender = eventPayload?.payload?.senderId;
          if (sender === CLIENT_INSTANCE_ID) {
            return;
          }
          if (isSelfPushingRef.current || Date.now() - lastLocalEditTimeRef.current < 5000) {
            return;
          }
          console.log('[Supabase Realtime] Multi-device update detected:', eventPayload);
          const remoteState = await loadFromSupabase();
          if (remoteState && remoteState.schoolProfile) {
            isRemoteUpdating.current = true;
            setData((prev) => sanitizeAppState({ ...prev, ...remoteState }));
            setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
          }
        })
        .subscribe();

      // Postgres changes channel for database-level events
      dbSub = supabase
        .channel('madrasah_realtime_db')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'madrasah_store' },
          (payload) => {
            if (isSelfPushingRef.current || Date.now() - lastLocalEditTimeRef.current < 5000) {
              return;
            }
            if (payload?.new && (payload.new as any).data) {
              const remoteData = (payload.new as any).data;
              isRemoteUpdating.current = true;
              setData((prev) => sanitizeAppState({ ...prev, ...remoteData }));
              setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
            } else {
              pullFromSupabase(true);
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'school_profile' },
          () => {
            if (isSelfPushingRef.current || Date.now() - lastLocalEditTimeRef.current < 5000) {
              return;
            }
            pullFromSupabase(true);
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'staff_members' },
          () => {
            if (isSelfPushingRef.current || Date.now() - lastLocalEditTimeRef.current < 5000) {
              return;
            }
            pullFromSupabase(true);
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'news_articles' },
          () => {
            if (isSelfPushingRef.current || Date.now() - lastLocalEditTimeRef.current < 5000) {
              return;
            }
            pullFromSupabase(true);
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Realtime subscription error:', e);
    }

    return () => {
      if (broadcastSub) supabase.removeChannel(broadcastSub);
      if (dbSub) supabase.removeChannel(dbSub);
    };
  }, []);

  // Explicit Sync to Supabase (Authorized Admin Only)
  const syncToSupabase = async (force: boolean = false): Promise<{ success: boolean; message: string }> => {
    try {
      if (!isAdmin && !force) {
        return { success: false, message: 'Akses ditolak: Hanya Administrator yang dapat menyinkronkan data ke Supabase' };
      }
      setCloudSyncStatus('syncing');
      const res = await saveAllToSupabase(data, { isAuthorizedAdmin: true, force });
      if (res.success) {
        setCloudSyncStatus('synced');
        setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
        hasUserEditedRef.current = false;
      }
      return res;
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal menyimpan ke Supabase' };
    }
  };

  // Pull data from Supabase
  const pullFromSupabase = async (silent: boolean = false): Promise<boolean> => {
    try {
      if (!silent) setCloudSyncStatus('syncing');
      const remoteState = await loadFromSupabase();
      if (remoteState && remoteState.schoolProfile) {
        const cleanState = sanitizeAppState(remoteState);
        isRemoteUpdating.current = true;
        setData(cleanState);
        isCloudLoadedRef.current = true;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanState));
        } catch (e) {}
        setCloudSyncStatus('synced');
        setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to pull from Supabase:', err);
      return false;
    }
  };

  // School Profile
  const updateSchoolProfile = (partial: Partial<SchoolProfile>) => {
    markLocalEdit();
    setData((prev) => {
      const updated = { ...prev.schoolProfile, ...partial };
      return { ...prev, schoolProfile: updated };
    });
  };

  // Guru dan Tenaga Kependidikan (GTK)
  const addStaff = (item: Omit<StaffMember, 'id'>) => {
    markLocalEdit();
    const newItem: StaffMember = { ...item, id: generateUniqueId('staff') };
    setData((prev) => ({ ...prev, staffList: [...prev.staffList, newItem] }));
  };

  const addStaffBatch = (items: Omit<StaffMember, 'id'>[], replaceAll: boolean = false) => {
    markLocalEdit();
    const newItems: StaffMember[] = items.map((item, idx) => ({
      ...item,
      id: generateUniqueId(`staff-batch-${idx}`),
    }));
    setData((prev) => ({
      ...prev,
      staffList: replaceAll ? newItems : [...prev.staffList, ...newItems],
    }));
  };

  const updateStaff = (id: string, updated: Partial<StaffMember>) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      staffList: prev.staffList.map((s) => (s.id === id ? { ...s, ...updated } : s)),
    }));
  };

  const deleteStaff = (id: string) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      staffList: prev.staffList.filter((s) => s.id !== id),
    }));
    deleteStaffFromSupabase(id);
    apiRequest(`/api/staff/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Manajemen Siswa (Santri)
  const addStudent = (item: Omit<StudentItem, 'id'>) => {
    markLocalEdit();
    const newItem: StudentItem = { ...item, id: generateUniqueId('std') };
    setData((prev) => ({
      ...prev,
      studentList: [newItem, ...(prev.studentList || [])],
    }));
  };

  const addStudentsBatch = (items: Omit<StudentItem, 'id'>[], replaceAll: boolean = false) => {
    markLocalEdit();
    const newItems: StudentItem[] = items.map((item, idx) => ({
      ...item,
      id: generateUniqueId(`std-batch-${idx}`),
    }));
    setData((prev) => ({
      ...prev,
      studentList: replaceAll ? newItems : [...newItems, ...(prev.studentList || [])],
    }));
  };

  const updateStudent = (id: string, updated: Partial<StudentItem>) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      studentList: (prev.studentList || []).map((s) => (s.id === id ? { ...s, ...updated } : s)),
    }));
  };

  const deleteStudent = (id: string) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      studentList: (prev.studentList || []).filter((s) => s.id !== id),
    }));
  };

  // Statistik Madrasah
  const setStatsList = (stats: StatItem[]) => {
    markLocalEdit();
    const clean = ensureUniqueIds(stats, 'stat');
    setData((prev) => ({ ...prev, statsList: clean }));
  };

  const addStat = (item: Omit<StatItem, 'id'> & { id?: string }) => {
    markLocalEdit();
    const newItem: StatItem = { ...item, id: item.id && item.id.trim() ? item.id : generateUniqueId('stat') };
    setData((prev) => {
      const filtered = (prev.statsList || []).filter((s) => s.id !== newItem.id);
      return { ...prev, statsList: [...filtered, newItem] };
    });
  };

  const updateStat = (id: string, updated: Partial<StatItem>) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      statsList: (prev.statsList || []).map((s) => (s.id === id ? { ...s, ...updated } : s)),
    }));
  };

  const deleteStat = (id: string) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      statsList: (prev.statsList || []).filter((s) => s.id !== id),
    }));
    deleteItemFromSupabase('stats', id);
  };

  // Programs
  const addProgram = (item: Omit<ProgramItem, 'id'>) => {
    markLocalEdit();
    const newItem: ProgramItem = { ...item, id: generateUniqueId('prog') };
    setData((prev) => ({
      ...prev,
      programs: [newItem, ...prev.programs],
    }));
  };

  const updateProgram = (id: string, updated: Partial<ProgramItem>) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      programs: prev.programs.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    }));
  };

  const deleteProgram = (id: string) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      programs: prev.programs.filter((p) => p.id !== id),
    }));
    deleteItemFromSupabase('programs', id);
  };

  // Extracurriculars
  const addExtracurricular = (item: Omit<ExtracurricularItem, 'id'>) => {
    markLocalEdit();
    const newItem: ExtracurricularItem = { ...item, id: generateUniqueId('ekskul') };
    setData((prev) => ({
      ...prev,
      extracurriculars: [...prev.extracurriculars, newItem],
    }));
  };

  const updateExtracurricular = (id: string, updated: Partial<ExtracurricularItem>) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      extracurriculars: prev.extracurriculars.map((e) => (e.id === id ? { ...e, ...updated } : e)),
    }));
  };

  const deleteExtracurricular = (id: string) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      extracurriculars: prev.extracurriculars.filter((e) => e.id !== id),
    }));
    deleteItemFromSupabase('extracurriculars', id);
  };

  // Achievements
  const addAchievement = (item: Omit<AchievementItem, 'id'>) => {
    markLocalEdit();
    const newItem: AchievementItem = { ...item, id: generateUniqueId('ach') };
    setData((prev) => ({
      ...prev,
      achievements: [newItem, ...prev.achievements],
    }));
  };

  const updateAchievement = (id: string, updated: Partial<AchievementItem>) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) => (a.id === id ? { ...a, ...updated } : a)),
    }));
  };

  const deleteAchievement = (id: string) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a.id !== id),
    }));
    deleteItemFromSupabase('achievements', id);
  };

  // News
  const addNews = (item: Omit<NewsArticle, 'id'>) => {
    markLocalEdit();
    const newItem: NewsArticle = { ...item, id: generateUniqueId('news') };
    
    setData((prev) => {
      let updatedGallery = [...prev.gallery];
      let updatedAchievements = [...prev.achievements];

      // 1. Seluruh foto yang terpasang di berita otomatis masuk ke Galeri (jika belum ada)
      if (newItem.imageUrl && newItem.imageUrl.trim()) {
        const photoExists = updatedGallery.some((g) => g.imageUrl === newItem.imageUrl);
        if (!photoExists) {
          const galleryCategory: GalleryItem['category'] =
            newItem.category === 'Prestasi' ? 'Prestasi' : 'Kegiatan Belajar';
          
          const newGalleryItem: GalleryItem = {
            id: generateUniqueId('gal'),
            title: newItem.title,
            category: galleryCategory,
            imageUrl: newItem.imageUrl,
            description: newItem.summary || newItem.title,
            date: newItem.date || new Date().toISOString().split('T')[0],
          };
          updatedGallery = [newGalleryItem, ...updatedGallery];
        }
      }

      // 2. Jika kategori berita adalah "Prestasi", otomatis masuk juga ke bagian Prestasi
      if (newItem.category === 'Prestasi') {
        const achExists = updatedAchievements.some(
          (a) => a.title.toLowerCase() === newItem.title.toLowerCase() || (newItem.imageUrl && a.imageUrl === newItem.imageUrl)
        );
        if (!achExists) {
          const newAch: AchievementItem = {
            id: generateUniqueId('ach'),
            title: newItem.title,
            winner: newItem.author && newItem.author !== 'Admin Madrasah' ? newItem.author : 'Santri Berprestasi MI Ma\'arif Al Ihsan',
            category: 'Akademik & Sains',
            level: 'Kabupaten Temanggung',
            year: newItem.date ? newItem.date.split('-')[0] : new Date().getFullYear().toString(),
            rank: 'Juara',
            description: newItem.summary || newItem.title,
            imageUrl: newItem.imageUrl,
          };
          updatedAchievements = [newAch, ...updatedAchievements];
        }
      }

      return {
        ...prev,
        newsList: sortNewsByDateDesc([newItem, ...prev.newsList]),
        gallery: updatedGallery,
        achievements: updatedAchievements,
      };
    });
  };

  const updateNews = (id: string, updated: Partial<NewsArticle>) => {
    markLocalEdit();
    setData((prev) => {
      const existingNews = prev.newsList.find((n) => n.id === id);
      const mergedNews: NewsArticle | undefined = existingNews ? { ...existingNews, ...updated } : undefined;
      
      let updatedGallery = [...prev.gallery];
      let updatedAchievements = [...prev.achievements];

      if (mergedNews) {
        // Otomatis masukkan foto ke galeri jika ada foto baru dan belum tercatat
        if (mergedNews.imageUrl && mergedNews.imageUrl.trim()) {
          const photoExists = updatedGallery.some((g) => g.imageUrl === mergedNews.imageUrl);
          if (!photoExists) {
            const galleryCategory: GalleryItem['category'] =
              mergedNews.category === 'Prestasi' ? 'Prestasi' : 'Kegiatan Belajar';

            const newGalleryItem: GalleryItem = {
              id: generateUniqueId('gal'),
              title: mergedNews.title,
              category: galleryCategory,
              imageUrl: mergedNews.imageUrl,
              description: mergedNews.summary || mergedNews.title,
              date: mergedNews.date || new Date().toISOString().split('T')[0],
            };
            updatedGallery = [newGalleryItem, ...updatedGallery];
          }
        }

        // Jika kategori menjadi 'Prestasi', pastikan masuk ke prestasi
        if (mergedNews.category === 'Prestasi') {
          const achExists = updatedAchievements.some(
            (a) => a.title.toLowerCase() === mergedNews.title.toLowerCase() || (mergedNews.imageUrl && a.imageUrl === mergedNews.imageUrl)
          );
          if (!achExists) {
            const newAch: AchievementItem = {
              id: generateUniqueId('ach'),
              title: mergedNews.title,
              winner: mergedNews.author && mergedNews.author !== 'Admin Madrasah' ? mergedNews.author : 'Santri Berprestasi MI Ma\'arif Al Ihsan',
              category: 'Akademik & Sains',
              level: 'Kabupaten Temanggung',
              year: mergedNews.date ? mergedNews.date.split('-')[0] : new Date().getFullYear().toString(),
              rank: 'Juara',
              description: mergedNews.summary || mergedNews.title,
              imageUrl: mergedNews.imageUrl,
            };
            updatedAchievements = [newAch, ...updatedAchievements];
          }
        }
      }

      return {
        ...prev,
        newsList: sortNewsByDateDesc(prev.newsList.map((n) => (n.id === id ? { ...n, ...updated } : n))),
        gallery: updatedGallery,
        achievements: updatedAchievements,
      };
    });
  };

  const deleteNews = (id: string) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      newsList: prev.newsList.filter((n) => n.id !== id),
    }));
    deleteNewsFromSupabase(id);
    apiRequest(`/api/news/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Facilities
  const addFacility = (item: Omit<FacilityItem, 'id'>) => {
    markLocalEdit();
    const newItem: FacilityItem = { ...item, id: generateUniqueId('fac') };
    setData((prev) => ({
      ...prev,
      facilities: [...prev.facilities, newItem],
    }));
  };

  const updateFacility = (id: string, updated: Partial<FacilityItem>) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.map((f) => (f.id === id ? { ...f, ...updated } : f)),
    }));
  };

  const deleteFacility = (id: string) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f.id !== id),
    }));
    deleteItemFromSupabase('facilities', id);
  };

  // Gallery
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    markLocalEdit();
    const newItem: GalleryItem = { ...item, id: generateUniqueId('gal') };
    setData((prev) => ({
      ...prev,
      gallery: [newItem, ...prev.gallery],
    }));
  };

  const updateGalleryItem = (id: string, updated: Partial<GalleryItem>) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.map((g) => (g.id === id ? { ...g, ...updated } : g)),
    }));
  };

  const deleteGalleryItem = (id: string) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((g) => g.id !== id),
    }));
    deleteItemFromSupabase('gallery', id);
  };

  // Video Gallery
  const addVideoItem = (item: Omit<VideoGalleryItem, 'id'>) => {
    markLocalEdit();
    const newItem: VideoGalleryItem = { ...item, id: generateUniqueId('vid') };
    setData((prev) => ({
      ...prev,
      videoGallery: [newItem, ...(prev.videoGallery || [])],
    }));
  };

  const updateVideoItem = (id: string, updated: Partial<VideoGalleryItem>) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      videoGallery: (prev.videoGallery || []).map((v) => (v.id === id ? { ...v, ...updated } : v)),
    }));
  };

  const deleteVideoItem = (id: string) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      videoGallery: (prev.videoGallery || []).filter((v) => v.id !== id),
    }));
  };

  // Testimonials
  const addTestimonial = (item: Omit<TestimonialItem, 'id'>) => {
    markLocalEdit();
    const newItem: TestimonialItem = { ...item, id: generateUniqueId('testi') };
    setData((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, newItem],
    }));
  };

  const updateTestimonial = (id: string, updated: Partial<TestimonialItem>) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) => (t.id === id ? { ...t, ...updated } : t)),
    }));
  };

  const deleteTestimonial = (id: string) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== id),
    }));
    deleteItemFromSupabase('testimonials', id);
  };

  // FAQ
  const addFAQ = (item: Omit<FAQItem, 'id'>) => {
    markLocalEdit();
    const newItem: FAQItem = { ...item, id: generateUniqueId('faq') };
    setData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, newItem],
    }));
  };

  const updateFAQ = (id: string, updated: Partial<FAQItem>) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f) => (f.id === id ? { ...f, ...updated } : f)),
    }));
  };

  const deleteFAQ = (id: string) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((f) => f.id !== id),
    }));
    deleteItemFromSupabase('faqs', id);
  };

  // PPDB Registrations (Real-time Cloud SQL + Supabase Sync)
  const addPPDBRegistration = async (reg: Omit<PPDBRegistration, 'id' | 'submissionDate'>): Promise<string> => {
    lastLocalEditTimeRef.current = Date.now();
    const today = new Date().toISOString().split('T')[0];
    const rand = Math.floor(1000 + Math.random() * 9000);
    const code = reg.registrationNumber || `REG-MIAS-${new Date().getFullYear()}-${rand}`;
    const newReg: PPDBRegistration = {
      ...reg,
      id: generateUniqueId('reg'),
      registrationNumber: code,
      submissionDate: today,
    };

    // Update local state immediately
    setData((prev) => ({
      ...prev,
      ppdbRegistrations: [newReg, ...prev.ppdbRegistrations],
    }));

    // Save directly to Cloud SQL online database
    try {
      await apiRequest('/api/ppdb/register', {
        method: 'POST',
        body: JSON.stringify({
          id: newReg.id,
          registrationNumber: newReg.registrationNumber,
          fullName: newReg.studentName,
          nisn: newReg.nisn,
          nik: newReg.nik,
          birthPlace: newReg.birthPlace,
          birthDate: newReg.birthDate,
          gender: newReg.gender,
          parentName: newReg.parentName,
          parentPhone: newReg.parentPhone,
          parentAddress: newReg.address,
          previousSchool: newReg.originSchool,
          registrationDate: newReg.submissionDate,
          status: newReg.status,
          notes: newReg.notes,
        })
      });
      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
    } catch (err) {
      console.error('Failed to post PPDB online to Cloud SQL:', err);
    }

    // Save individual registration to Supabase without touching other tables
    try {
      await supabase.from('ppdb_registrations').upsert({
        id: newReg.id,
        registration_number: newReg.registrationNumber,
        student_name: newReg.studentName,
        nik: newReg.nik || null,
        nisn: newReg.nisn || null,
        gender: newReg.gender,
        birth_place: newReg.birthPlace || null,
        birth_date: newReg.birthDate,
        target_class: newReg.targetClass || 'Kelas 1 (Satu)',
        origin_school: newReg.originSchool,
        parent_name: newReg.parentName,
        parent_phone: newReg.parentPhone,
        parent_address: newReg.address,
        submission_date: newReg.submissionDate,
        status: newReg.status,
        notes: newReg.notes || null,
      });
    } catch (_) {}

    return code;
  };

  const updatePPDBStatus = async (id: string, status: PPDBRegistration['status'], notes?: string) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      ppdbRegistrations: prev.ppdbRegistrations.map((r) =>
        r.id === id ? { ...r, status, ...(notes !== undefined ? { notes } : {}) } : r
      ),
    }));

    try {
      await apiRequest('/api/ppdb/update-status', {
        method: 'POST',
        body: JSON.stringify({ id, status, notes })
      });
      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
    } catch (err) {
      console.error('Failed to update PPDB status online:', err);
    }

    try {
      await supabase.from('ppdb_registrations').update({
        status,
        ...(notes !== undefined ? { notes } : {}),
      }).eq('id', id);
    } catch (_) {}
  };

  const deletePPDBRegistration = async (id: string) => {
    markLocalEdit();
    setData((prev) => ({
      ...prev,
      ppdbRegistrations: prev.ppdbRegistrations.filter((r) => r.id !== id),
    }));

    try {
      await apiRequest(`/api/ppdb/${id}`, { method: 'DELETE' });
      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
    } catch (err) {
      console.error('Failed to delete PPDB online:', err);
    }

    try {
      await supabase.from('ppdb_registrations').delete().eq('id', id);
    } catch (_) {}
  };

  // Backup & Reset
  const resetToDefaultData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang seluruh data website ke data awal bawaan?')) {
      setData(DEFAULT_DATA);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
      } catch (e) {}
      pushAllToCloud();
    }
  };

  const exportBackupJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-mi-alihsan-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackupJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.schoolProfile) {
        const cleanState = sanitizeAppState(parsed);
        setData(cleanState);
        pushAllToCloud();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        schoolProfile: data.schoolProfile,
        updateSchoolProfile,

        staffList: data.staffList,
        addStaff,
        addStaffBatch,
        updateStaff,
        deleteStaff,

        studentList: data.studentList || [],
        addStudent,
        addStudentsBatch,
        updateStudent,
        deleteStudent,

        statsList: data.statsList,
        setStatsList,
        addStat,
        updateStat,
        deleteStat,

        programs: data.programs,
        addProgram,
        updateProgram,
        deleteProgram,

        extracurriculars: data.extracurriculars,
        addExtracurricular,
        updateExtracurricular,
        deleteExtracurricular,

        achievements: data.achievements,
        addAchievement,
        updateAchievement,
        deleteAchievement,

        newsList: data.newsList,
        addNews,
        updateNews,
        deleteNews,

        facilities: data.facilities,
        addFacility,
        updateFacility,
        deleteFacility,

        gallery: data.gallery,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,

        videoGallery: data.videoGallery || [],
        addVideoItem,
        updateVideoItem,
        deleteVideoItem,

        testimonials: data.testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,

        faqs: data.faqs,
        addFAQ,
        updateFAQ,
        deleteFAQ,

        ppdbRegistrations: data.ppdbRegistrations,
        addPPDBRegistration,
        updatePPDBStatus,
        deletePPDBRegistration,

        isAdmin,
        viewMode,
        setViewMode,
        loginAdmin,
        logoutAdmin,
        isLoginModalOpen,
        setIsLoginModalOpen,

        cloudSyncStatus,
        lastSyncedAt,
        refreshFromCloud,
        pushAllToCloud,
        syncToSupabase,
        pullFromSupabase,

        resetToDefaultData,
        exportBackupJSON,
        importBackupJSON,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const useDataContext = useData;
