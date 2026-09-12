import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  saveAllToSupabase,
  loadFromSupabase,
  supabase,
  CLIENT_INSTANCE_ID,
  broadcastSupabaseChange,
  upsertStaffToSupabase,
  deleteStaffFromSupabase,
  upsertSchoolProfileToSupabase
} from '../lib/supabase';
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
import {
  SCHOOL_PROFILE,
  PROGRAMS_DATA,
  EXTRACURRICULARS,
  ACHIEVEMENTS,
  INITIAL_NEWS,
  FACILITIES,
  GALLERY_DATA,
  TESTIMONIALS,
  FAQ_DATA,
  INITIAL_PPDB_REGISTRATIONS,
  STAFF_DATA,
  STATS_DATA
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
  statsList: StatItem[];
  programs: ProgramItem[];
  extracurriculars: ExtracurricularItem[];
  achievements: AchievementItem[];
  newsList: NewsArticle[];
  facilities: FacilityItem[];
  gallery: GalleryItem[];
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
  updateStaff: (id: string, item: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;

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
  statsList: STATS_DATA,
  programs: PROGRAMS_DATA,
  extracurriculars: EXTRACURRICULARS,
  achievements: ACHIEVEMENTS,
  newsList: INITIAL_NEWS,
  facilities: FACILITIES,
  gallery: GALLERY_DATA,
  testimonials: TESTIMONIALS,
  faqs: FAQ_DATA,
  ppdbRegistrations: INITIAL_PPDB_REGISTRATIONS,
};

let uniqueCounter = 0;

export const generateUniqueId = (prefix: string): string => {
  uniqueCounter = (uniqueCounter + 1) % 1000000;
  return `${prefix}-${Date.now()}-${uniqueCounter}-${Math.random().toString(36).substring(2, 7)}`;
};

export const ensureUniqueIds = <T extends { id?: string }>(items: T[] | undefined, prefix: string): T[] => {
  if (!Array.isArray(items)) return [];
  const seen = new Set<string>();
  return items.map((item, index) => {
    let id = item.id ? String(item.id).trim() : '';
    if (!id || seen.has(id) || /^[a-z]+-\d{10,}$/.test(id)) {
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
    !rawProfile.headmasterPhotoUrl;

  const schoolProfile = {
    ...DEFAULT_DATA.schoolProfile,
    ...rawProfile,
    headmasterPhotoUrl: isOldDummyPhoto
      ? DEFAULT_DATA.schoolProfile.headmasterPhotoUrl
      : rawProfile.headmasterPhotoUrl,
    headmasterPhotoPosition: rawProfile.headmasterPhotoPosition || 'top',
    headmasterPhotoScale: rawProfile.headmasterPhotoScale ?? 100,
    headmasterPhotoFit: rawProfile.headmasterPhotoFit || 'cover',
  };

  return {
    schoolProfile,
    staffList: ensureUniqueIds(raw.staffList || DEFAULT_DATA.staffList, 'staff'),
    statsList: ensureUniqueIds(raw.statsList !== undefined ? raw.statsList : DEFAULT_DATA.statsList, 'stat'),
    programs: ensureUniqueIds(raw.programs || DEFAULT_DATA.programs, 'prog'),
    extracurriculars: ensureUniqueIds(raw.extracurriculars || DEFAULT_DATA.extracurriculars, 'ekskul'),
    achievements: ensureUniqueIds(raw.achievements || DEFAULT_DATA.achievements, 'ach'),
    newsList: ensureUniqueIds(raw.newsList || DEFAULT_DATA.newsList, 'news'),
    facilities: ensureUniqueIds(raw.facilities || DEFAULT_DATA.facilities, 'fac'),
    gallery: ensureUniqueIds(raw.gallery || DEFAULT_DATA.gallery, 'gal'),
    testimonials: ensureUniqueIds(raw.testimonials || DEFAULT_DATA.testimonials, 'testi'),
    faqs: ensureUniqueIds(raw.faqs || DEFAULT_DATA.faqs, 'faq'),
    ppdbRegistrations: ensureUniqueIds(raw.ppdbRegistrations || DEFAULT_DATA.ppdbRegistrations, 'reg'),
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
  const lastKnownVersionRef = useRef<number>(0);
  const lastLocalEditTimeRef = useRef<number>(0);
  const isSelfPushingRef = useRef<boolean>(false);

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
              staffList: onlineData.staffList && onlineData.staffList.length > 0 ? onlineData.staffList : prev.staffList,
              statsList: onlineData.statsList && onlineData.statsList.length > 0 ? onlineData.statsList : prev.statsList,
              programs: onlineData.programs && onlineData.programs.length > 0 ? onlineData.programs : prev.programs,
              extracurriculars: onlineData.extracurriculars && onlineData.extracurriculars.length > 0 ? onlineData.extracurriculars : prev.extracurriculars,
              achievements: onlineData.achievements && onlineData.achievements.length > 0 ? onlineData.achievements : prev.achievements,
              newsList: onlineData.newsList && onlineData.newsList.length > 0 ? onlineData.newsList : prev.newsList,
              facilities: onlineData.facilities && onlineData.facilities.length > 0 ? onlineData.facilities : prev.facilities,
              gallery: onlineData.gallery && onlineData.gallery.length > 0 ? onlineData.gallery : prev.gallery,
              testimonials: onlineData.testimonials && onlineData.testimonials.length > 0 ? onlineData.testimonials : prev.testimonials,
              faqs: onlineData.faqs && onlineData.faqs.length > 0 ? onlineData.faqs : prev.faqs,
              ppdbRegistrations: onlineData.ppdbRegistrations && onlineData.ppdbRegistrations.length > 0 ? onlineData.ppdbRegistrations : prev.ppdbRegistrations,
            });
            return sanitized;
          });
          setCloudSyncStatus('synced');
          setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
          return;
        }
      }

      // Fallback: Supabase
      const remoteState = await loadFromSupabase();
      if (remoteState && remoteState.schoolProfile) {
        if (Date.now() - lastLocalEditTimeRef.current < 2500) {
          setCloudSyncStatus('synced');
          return;
        }
        isRemoteUpdating.current = true;
        setData(sanitizeAppState(remoteState));
        setCloudSyncStatus('synced');
        setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
      } else {
        setCloudSyncStatus('connected');
      }
    } catch (err) {
      console.warn('Could not refresh from Cloud SQL, trying Supabase fallback:', err);
      try {
        const remoteState = await loadFromSupabase();
        if (remoteState && remoteState.schoolProfile) {
          if (Date.now() - lastLocalEditTimeRef.current < 2500) {
            setCloudSyncStatus('synced');
            return;
          }
          isRemoteUpdating.current = true;
          setData(sanitizeAppState(remoteState));
          setCloudSyncStatus('synced');
          setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
          return;
        }
      } catch (e) {}
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

  // Push all data to Cloud SQL + Supabase
  const pushAllToCloud = useCallback(async (authToken?: string | null): Promise<boolean> => {
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

      const supabasePromise = saveAllToSupabase(data);

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
        return true;
      } else {
        console.warn('Both Cloud SQL and Supabase sync failed');
        setCloudSyncStatus('offline');
        return false;
      }
    } catch (err) {
      console.error('Failed to push to Cloud SQL:', err);
      saveAllToSupabase(data)
        .then((res) => {
          if (res?.success) {
            setCloudSyncStatus('synced');
            setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
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
  }, [data]);

  // Automatic Debounced Cloud Push on local changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isRemoteUpdating.current) {
      isRemoteUpdating.current = false;
      return;
    }

    // Auto debounce push to Cloud SQL + Supabase on every user action
    const timer = setTimeout(() => {
      pushAllToCloud();
    }, 400);

    return () => clearTimeout(timer);
  }, [data, pushAllToCloud]);

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
            if (isSelfPushingRef.current || Date.now() - lastLocalEditTimeRef.current < 2500) {
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
            if (isSelfPushingRef.current || Date.now() - lastLocalEditTimeRef.current < 2500) {
              return;
            }
            pullFromSupabase(true);
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'staff_members' },
          () => {
            if (isSelfPushingRef.current || Date.now() - lastLocalEditTimeRef.current < 2500) {
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

  // Explicit Sync to Supabase
  const syncToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    try {
      setCloudSyncStatus('syncing');
      const res = await saveAllToSupabase(data);
      if (res.success) {
        setCloudSyncStatus('synced');
        setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
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
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => {
      const updated = { ...prev.schoolProfile, ...partial };
      return { ...prev, schoolProfile: updated };
    });
  };

  // Guru dan Tenaga Kependidikan (GTK)
  const addStaff = (item: Omit<StaffMember, 'id'>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    const newItem: StaffMember = { ...item, id: generateUniqueId('staff') };
    setData((prev) => ({ ...prev, staffList: [...prev.staffList, newItem] }));
  };

  const updateStaff = (id: string, updated: Partial<StaffMember>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      staffList: prev.staffList.map((s) => (s.id === id ? { ...s, ...updated } : s)),
    }));
  };

  const deleteStaff = (id: string) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      staffList: prev.staffList.filter((s) => s.id !== id),
    }));
    deleteStaffFromSupabase(id);
    apiRequest(`/api/staff/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Statistik Madrasah
  const setStatsList = (stats: StatItem[]) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    const clean = ensureUniqueIds(stats, 'stat');
    setData((prev) => ({ ...prev, statsList: clean }));
  };

  const addStat = (item: Omit<StatItem, 'id'> & { id?: string }) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    const newItem: StatItem = { ...item, id: item.id && item.id.trim() ? item.id : generateUniqueId('stat') };
    setData((prev) => {
      const filtered = (prev.statsList || []).filter((s) => s.id !== newItem.id);
      return { ...prev, statsList: [...filtered, newItem] };
    });
  };

  const updateStat = (id: string, updated: Partial<StatItem>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      statsList: (prev.statsList || []).map((s) => (s.id === id ? { ...s, ...updated } : s)),
    }));
  };

  const deleteStat = (id: string) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      statsList: (prev.statsList || []).filter((s) => s.id !== id),
    }));
  };

  // Programs
  const addProgram = (item: Omit<ProgramItem, 'id'>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    const newItem: ProgramItem = { ...item, id: generateUniqueId('prog') };
    setData((prev) => ({
      ...prev,
      programs: [newItem, ...prev.programs],
    }));
  };

  const updateProgram = (id: string, updated: Partial<ProgramItem>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      programs: prev.programs.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    }));
  };

  const deleteProgram = (id: string) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      programs: prev.programs.filter((p) => p.id !== id),
    }));
  };

  // Extracurriculars
  const addExtracurricular = (item: Omit<ExtracurricularItem, 'id'>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    const newItem: ExtracurricularItem = { ...item, id: generateUniqueId('ekskul') };
    setData((prev) => ({
      ...prev,
      extracurriculars: [...prev.extracurriculars, newItem],
    }));
  };

  const updateExtracurricular = (id: string, updated: Partial<ExtracurricularItem>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      extracurriculars: prev.extracurriculars.map((e) => (e.id === id ? { ...e, ...updated } : e)),
    }));
  };

  const deleteExtracurricular = (id: string) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      extracurriculars: prev.extracurriculars.filter((e) => e.id !== id),
    }));
  };

  // Achievements
  const addAchievement = (item: Omit<AchievementItem, 'id'>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    const newItem: AchievementItem = { ...item, id: generateUniqueId('ach') };
    setData((prev) => ({
      ...prev,
      achievements: [newItem, ...prev.achievements],
    }));
  };

  const updateAchievement = (id: string, updated: Partial<AchievementItem>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) => (a.id === id ? { ...a, ...updated } : a)),
    }));
  };

  const deleteAchievement = (id: string) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a.id !== id),
    }));
  };

  // News
  const addNews = (item: Omit<NewsArticle, 'id'>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    const newItem: NewsArticle = { ...item, id: generateUniqueId('news') };
    setData((prev) => ({ ...prev, newsList: [newItem, ...prev.newsList] }));
  };

  const updateNews = (id: string, updated: Partial<NewsArticle>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      newsList: prev.newsList.map((n) => (n.id === id ? { ...n, ...updated } : n)),
    }));
  };

  const deleteNews = (id: string) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      newsList: prev.newsList.filter((n) => n.id !== id),
    }));
    apiRequest(`/api/news/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Facilities
  const addFacility = (item: Omit<FacilityItem, 'id'>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    const newItem: FacilityItem = { ...item, id: generateUniqueId('fac') };
    setData((prev) => ({
      ...prev,
      facilities: [...prev.facilities, newItem],
    }));
  };

  const updateFacility = (id: string, updated: Partial<FacilityItem>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.map((f) => (f.id === id ? { ...f, ...updated } : f)),
    }));
  };

  const deleteFacility = (id: string) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f.id !== id),
    }));
  };

  // Gallery
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    const newItem: GalleryItem = { ...item, id: generateUniqueId('gal') };
    setData((prev) => ({
      ...prev,
      gallery: [newItem, ...prev.gallery],
    }));
  };

  const updateGalleryItem = (id: string, updated: Partial<GalleryItem>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.map((g) => (g.id === id ? { ...g, ...updated } : g)),
    }));
  };

  const deleteGalleryItem = (id: string) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((g) => g.id !== id),
    }));
  };

  // Testimonials
  const addTestimonial = (item: Omit<TestimonialItem, 'id'>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    const newItem: TestimonialItem = { ...item, id: generateUniqueId('testi') };
    setData((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, newItem],
    }));
  };

  const updateTestimonial = (id: string, updated: Partial<TestimonialItem>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) => (t.id === id ? { ...t, ...updated } : t)),
    }));
  };

  const deleteTestimonial = (id: string) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== id),
    }));
  };

  // FAQ
  const addFAQ = (item: Omit<FAQItem, 'id'>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    const newItem: FAQItem = { ...item, id: generateUniqueId('faq') };
    setData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, newItem],
    }));
  };

  const updateFAQ = (id: string, updated: Partial<FAQItem>) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f) => (f.id === id ? { ...f, ...updated } : f)),
    }));
  };

  const deleteFAQ = (id: string) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((f) => f.id !== id),
    }));
  };

  // PPDB Registrations (Real-time Cloud SQL Sync)
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

    return code;
  };

  const updatePPDBStatus = async (id: string, status: PPDBRegistration['status'], notes?: string) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
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
  };

  const deletePPDBRegistration = async (id: string) => {
    lastLocalEditTimeRef.current = Date.now();
    setCloudSyncStatus('syncing');
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
        updateStaff,
        deleteStaff,

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
