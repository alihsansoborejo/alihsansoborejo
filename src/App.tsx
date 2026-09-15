import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useDataContext } from './context/DataContext';
import { AdminBar } from './components/AdminBar';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './admin/AdminDashboard';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { PrincipalWelcome } from './components/PrincipalWelcome';
import { Programs } from './components/Programs';
import { ExtracurricularSection } from './components/ExtracurricularSection';
import { AchievementsSection } from './components/AchievementsSection';
import { Facilities } from './components/Facilities';
import { PPDBSection } from './components/PPDBSection';
import { NewsSection } from './components/NewsSection';
import { StaffSection } from './components/StaffSection';
import { Testimonials } from './components/Testimonials';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { PPDBModal } from './components/PPDBModal';
import { FloatingWA } from './components/FloatingWA';
import { CheckCircle2 } from 'lucide-react';

function AppContent() {
  const { viewMode, schoolProfile } = useDataContext();
  const [isPPDBOpen, setIsPPDBOpen] = useState(false);
  const [ppdbInitialTab, setPpdbInitialTab] = useState<'form' | 'status' | 'alur'>('form');
  const [preselectedProgram, setPreselectedProgram] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync favicon with schoolProfile.faviconUrl or fallback to logoUrl
  useEffect(() => {
    const activeFavicon = schoolProfile?.faviconUrl || schoolProfile?.logoUrl || '/assets/logo-maarif.svg';
    const favLink = document.getElementById('app-favicon') as HTMLLinkElement | null;
    if (favLink) {
      favLink.href = activeFavicon;
      if (activeFavicon.includes('.svg') || activeFavicon.startsWith('data:image/svg')) {
        favLink.type = 'image/svg+xml';
      } else if (activeFavicon.includes('.png') || activeFavicon.startsWith('data:image/png')) {
        favLink.type = 'image/png';
      } else if (activeFavicon.includes('.ico') || activeFavicon.includes('x-icon')) {
        favLink.type = 'image/x-icon';
      }
    }

    const appleLink = document.getElementById('app-apple-icon') as HTMLLinkElement | null;
    if (appleLink) {
      appleLink.href = activeFavicon;
    }
  }, [schoolProfile?.faviconUrl, schoolProfile?.logoUrl]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOpenPPDB = (tab: 'form' | 'status' | 'alur' = 'form', programTitle?: string) => {
    setPpdbInitialTab(tab);
    setPreselectedProgram(programTitle);
    setIsPPDBOpen(true);
  };

  const handleExploreProfile = () => {
    const el = document.getElementById('profil');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadBrochure = () => {
    showToast('Brosur Resmi PPDB & Panduan MI Ma\'arif Al Ihsan Soborejo (Format PDF) berhasil diunduh!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9] text-[#1d2925] font-body selection:bg-[#d4af37] selection:text-[#072217]">
      {/* Admin Mode Top Ribbon (Visible whenever admin is logged in) */}
      <AdminBar />

      {viewMode === 'admin' ? (
        /* Full Administrative CMS View */
        <AdminDashboard />
      ) : (
        /* Public School Website View */
        <>
          {/* 1. Top Bar Information with Temanggung & Prayer Schedule */}
          <TopBar />

          {/* 2. Header Navigation */}
          <Navbar onOpenPPDB={() => handleOpenPPDB('form')} />

          {/* 3. Hero Section */}
          <Hero
            onOpenPPDB={() => handleOpenPPDB('form')}
            onExploreProfile={handleExploreProfile}
            onDownloadBrochure={handleDownloadBrochure}
            onOpenStatusCheck={() => handleOpenPPDB('status')}
          />

          {/* 4. Floating Key Stats */}
          <Stats />

          {/* 5. Berita, Agenda, & Warta Terkini Madrasah (Diposisikan di atas agar langsung terlihat pengunjung) */}
          <NewsSection />

          {/* 6. Sambutan Kepala Madrasah, Visi-Misi, & Tujuan Lembaga */}
          <PrincipalWelcome />

          {/* 7. Profil Dewan Guru & Tenaga Kependidikan (GTK) */}
          <StaffSection />

          {/* 8. Program Unggulan Madrasah */}
          <Programs onRegisterProgram={(title) => handleOpenPPDB('form', title)} />

          {/* 9. Ekstrakurikuler & Pengembangan Bakat Santri */}
          <ExtracurricularSection />

          {/* 10. Prestasi Santri & Madrasah */}
          <AchievementsSection />

          {/* 11. Galeri Foto Dokumentasi & Sarana Prasarana */}
          <Facilities />

          {/* 12. PPDB Online Overview & Action Hub */}
          <PPDBSection
            onOpenPPDBForm={() => handleOpenPPDB('form')}
            onOpenStatusCheck={() => handleOpenPPDB('status')}
            onDownloadBrochure={handleDownloadBrochure}
          />

          {/* 13. Testimoni Wali Murid & Komite */}
          <Testimonials />

          {/* 14. Tanya Jawab Umum (FAQ) */}
          <FAQSection />

          {/* 15. Footer */}
          <Footer onOpenPPDB={() => handleOpenPPDB('form')} />

          {/* PPDB Registration & Status Modal */}
          <PPDBModal
            isOpen={isPPDBOpen}
            onClose={() => setIsPPDBOpen(false)}
            initialTab={ppdbInitialTab}
            preselectedProgram={preselectedProgram}
          />

          {/* Floating WhatsApp Contact */}
          <FloatingWA />
        </>
      )}

      {/* Admin Login Dialog Modal */}
      <AdminLoginModal />

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div
          id="app-toast-notification"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#072217] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#d4af37] flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-300 max-w-md text-xs sm:text-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

