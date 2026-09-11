import React, { createContext, useContext, useState, useEffect } from 'react';
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
  NEWS_DATA,
  FACILITIES_DATA,
  GALLERY_ITEMS,
  TESTIMONIALS,
  FAQ_DATA,
  INITIAL_PPDB_REGISTRATIONS,
  STAFF_DATA,
  STATS_DATA
} from '../data/schoolData';

const STORAGE_KEY = 'mi_al_ihsan_data_v4';
const AUTH_KEY = 'mi_al_ihsan_auth_v1';

interface AppStorageState {
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

interface DataContextType {
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;

  staffList: StaffMember[];
  addStaff: (item: Omit<StaffMember, 'id'>) => void;
  updateStaff: (id: string, item: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;

  statsList: StatItem[];
  addStat: (item: Omit<StatItem, 'id'>) => void;
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
  addPPDBRegistration: (reg: Omit<PPDBRegistration, 'id' | 'submissionDate'>) => string;
  updatePPDBStatus: (id: string, status: PPDBRegistration['status'], notes?: string) => void;
  deletePPDBRegistration: (id: string) => void;

  // Admin Auth & Mode
  isAdmin: boolean;
  viewMode: 'public' | 'admin';
  setViewMode: (mode: 'public' | 'admin') => void;
  loginAdmin: (secret: string) => boolean;
  logoutAdmin: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;

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
  newsList: NEWS_DATA,
  facilities: FACILITIES_DATA,
  gallery: GALLERY_ITEMS,
  testimonials: TESTIMONIALS,
  faqs: FAQ_DATA,
  ppdbRegistrations: INITIAL_PPDB_REGISTRATIONS,
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppStorageState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          schoolProfile: { ...DEFAULT_DATA.schoolProfile, ...(parsed.schoolProfile || {}) },
          staffList: parsed.staffList || DEFAULT_DATA.staffList,
          statsList: parsed.statsList || DEFAULT_DATA.statsList,
          programs: parsed.programs || DEFAULT_DATA.programs,
          extracurriculars: parsed.extracurriculars || DEFAULT_DATA.extracurriculars,
          achievements: parsed.achievements || DEFAULT_DATA.achievements,
          newsList: parsed.newsList || DEFAULT_DATA.newsList,
          facilities: parsed.facilities || DEFAULT_DATA.facilities,
          gallery: parsed.gallery || DEFAULT_DATA.gallery,
          testimonials: parsed.testimonials || DEFAULT_DATA.testimonials,
          faqs: parsed.faqs || DEFAULT_DATA.faqs,
          ppdbRegistrations: parsed.ppdbRegistrations || DEFAULT_DATA.ppdbRegistrations,
        };
      }
    } catch (e) {
      console.error('Error loading saved school data:', e);
    }
    return DEFAULT_DATA;
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

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [data]);

  // Auth methods
  const loginAdmin = (secret: string): boolean => {
    const clean = secret.trim().toLowerCase();
    // Default passcodes
    if (clean === 'admin123' || clean === 'alihsan2025' || clean === 'soborejo' || clean === 'admin') {
      setIsAdmin(true);
      try {
        localStorage.setItem(AUTH_KEY, 'true');
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
    } catch (e) {}
  };

  // School Profile
  const updateSchoolProfile = (partial: Partial<SchoolProfile>) => {
    setData((prev) => ({
      ...prev,
      schoolProfile: { ...prev.schoolProfile, ...partial },
    }));
  };

  // Guru dan Tenaga Kependidikan (GTK)
  const addStaff = (item: Omit<StaffMember, 'id'>) => {
    const newItem: StaffMember = { ...item, id: `staff-${Date.now()}` };
    setData((prev) => ({ ...prev, staffList: [...prev.staffList, newItem] }));
  };

  const updateStaff = (id: string, updated: Partial<StaffMember>) => {
    setData((prev) => ({
      ...prev,
      staffList: prev.staffList.map((s) => (s.id === id ? { ...s, ...updated } : s)),
    }));
  };

  const deleteStaff = (id: string) => {
    setData((prev) => ({
      ...prev,
      staffList: prev.staffList.filter((s) => s.id !== id),
    }));
  };

  // Statistik Madrasah
  const addStat = (item: Omit<StatItem, 'id'>) => {
    const newItem: StatItem = { ...item, id: `stat-${Date.now()}` };
    setData((prev) => ({
      ...prev,
      statsList: [...(prev.statsList || []), newItem],
    }));
  };

  const updateStat = (id: string, updated: Partial<StatItem>) => {
    setData((prev) => ({
      ...prev,
      statsList: (prev.statsList || []).map((s) => (s.id === id ? { ...s, ...updated } : s)),
    }));
  };

  const deleteStat = (id: string) => {
    setData((prev) => ({
      ...prev,
      statsList: (prev.statsList || []).filter((s) => s.id !== id),
    }));
  };

  // Programs
  const addProgram = (item: Omit<ProgramItem, 'id'>) => {
    const newItem: ProgramItem = { ...item, id: `prog-${Date.now()}` };
    setData((prev) => ({ ...prev, programs: [newItem, ...prev.programs] }));
  };

  const updateProgram = (id: string, updated: Partial<ProgramItem>) => {
    setData((prev) => ({
      ...prev,
      programs: prev.programs.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    }));
  };

  const deleteProgram = (id: string) => {
    setData((prev) => ({
      ...prev,
      programs: prev.programs.filter((p) => p.id !== id),
    }));
  };

  // Extracurriculars
  const addExtracurricular = (item: Omit<ExtracurricularItem, 'id'>) => {
    const newItem: ExtracurricularItem = { ...item, id: `ekskul-${Date.now()}` };
    setData((prev) => ({ ...prev, extracurriculars: [...prev.extracurriculars, newItem] }));
  };

  const updateExtracurricular = (id: string, updated: Partial<ExtracurricularItem>) => {
    setData((prev) => ({
      ...prev,
      extracurriculars: prev.extracurriculars.map((e) => (e.id === id ? { ...e, ...updated } : e)),
    }));
  };

  const deleteExtracurricular = (id: string) => {
    setData((prev) => ({
      ...prev,
      extracurriculars: prev.extracurriculars.filter((e) => e.id !== id),
    }));
  };

  // Achievements
  const addAchievement = (item: Omit<AchievementItem, 'id'>) => {
    const newItem: AchievementItem = { ...item, id: `ach-${Date.now()}` };
    setData((prev) => ({ ...prev, achievements: [newItem, ...prev.achievements] }));
  };

  const updateAchievement = (id: string, updated: Partial<AchievementItem>) => {
    setData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) => (a.id === id ? { ...a, ...updated } : a)),
    }));
  };

  const deleteAchievement = (id: string) => {
    setData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a.id !== id),
    }));
  };

  // News
  const addNews = (item: Omit<NewsArticle, 'id'>) => {
    const newItem: NewsArticle = { ...item, id: `news-${Date.now()}` };
    setData((prev) => ({ ...prev, newsList: [newItem, ...prev.newsList] }));
  };

  const updateNews = (id: string, updated: Partial<NewsArticle>) => {
    setData((prev) => ({
      ...prev,
      newsList: prev.newsList.map((n) => (n.id === id ? { ...n, ...updated } : n)),
    }));
  };

  const deleteNews = (id: string) => {
    setData((prev) => ({
      ...prev,
      newsList: prev.newsList.filter((n) => n.id !== id),
    }));
  };

  // Facilities
  const addFacility = (item: Omit<FacilityItem, 'id'>) => {
    const newItem: FacilityItem = { ...item, id: `fac-${Date.now()}` };
    setData((prev) => ({ ...prev, facilities: [...prev.facilities, newItem] }));
  };

  const updateFacility = (id: string, updated: Partial<FacilityItem>) => {
    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.map((f) => (f.id === id ? { ...f, ...updated } : f)),
    }));
  };

  const deleteFacility = (id: string) => {
    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f.id !== id),
    }));
  };

  // Gallery
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = { ...item, id: `gal-${Date.now()}` };
    setData((prev) => ({ ...prev, gallery: [newItem, ...prev.gallery] }));
  };

  const deleteGalleryItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((g) => g.id !== id),
    }));
  };

  // Testimonials
  const addTestimonial = (item: Omit<TestimonialItem, 'id'>) => {
    const newItem: TestimonialItem = { ...item, id: `testi-${Date.now()}` };
    setData((prev) => ({ ...prev, testimonials: [...prev.testimonials, newItem] }));
  };

  const updateTestimonial = (id: string, updated: Partial<TestimonialItem>) => {
    setData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) => (t.id === id ? { ...t, ...updated } : t)),
    }));
  };

  const deleteTestimonial = (id: string) => {
    setData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== id),
    }));
  };

  // FAQ
  const addFAQ = (item: Omit<FAQItem, 'id'>) => {
    const newItem: FAQItem = { ...item, id: `faq-${Date.now()}` };
    setData((prev) => ({ ...prev, faqs: [...prev.faqs, newItem] }));
  };

  const updateFAQ = (id: string, updated: Partial<FAQItem>) => {
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f) => (f.id === id ? { ...f, ...updated } : f)),
    }));
  };

  const deleteFAQ = (id: string) => {
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((f) => f.id !== id),
    }));
  };

  // PPDB Registrations
  const addPPDBRegistration = (reg: Omit<PPDBRegistration, 'id' | 'submissionDate'>): string => {
    const today = new Date().toISOString().split('T')[0];
    const rand = Math.floor(1000 + Math.random() * 9000);
    const code = reg.registrationNumber || `REG-MIAS-2025-${rand}`;
    const newReg: PPDBRegistration = {
      ...reg,
      id: `reg-${Date.now()}`,
      registrationNumber: code,
      submissionDate: today,
    };
    setData((prev) => ({
      ...prev,
      ppdbRegistrations: [newReg, ...prev.ppdbRegistrations],
    }));
    return code;
  };

  const updatePPDBStatus = (id: string, status: PPDBRegistration['status'], notes?: string) => {
    setData((prev) => ({
      ...prev,
      ppdbRegistrations: prev.ppdbRegistrations.map((r) =>
        r.id === id ? { ...r, status, ...(notes !== undefined ? { notes } : {}) } : r
      ),
    }));
  };

  const deletePPDBRegistration = (id: string) => {
    setData((prev) => ({
      ...prev,
      ppdbRegistrations: prev.ppdbRegistrations.filter((r) => r.id !== id),
    }));
  };

  // Backup & Reset
  const resetToDefaultData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang seluruh data website ke data awal bawaan?')) {
      setData(DEFAULT_DATA);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
      } catch (e) {}
    }
  };

  const exportBackupJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-mi-al-ihsan-soborejo-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackupJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.schoolProfile && parsed.newsList) {
        setData(parsed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        return true;
      }
    } catch (e) {
      console.error('Failed to import backup:', e);
    }
    return false;
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

        statsList: data.statsList || [],
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

        resetToDefaultData,
        exportBackupJSON,
        importBackupJSON,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
