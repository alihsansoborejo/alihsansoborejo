import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen, ArrowRight, Shield, Lock, Share2 } from 'lucide-react';
import { useDataContext } from '../context/DataContext';
import { useShare } from '../context/ShareContext';
import { NavigationTab } from '../types';

interface NavbarProps {
  onOpenPPDB: () => void;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPPDB, activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { schoolProfile, isAdmin, setIsLoginModalOpen, setViewMode } = useDataContext();
  const { openShare } = useShare();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: NavigationTab; label: string }[] = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'berita', label: 'Berita' },
    { id: 'profil', label: 'Profil' },
    { id: 'gtk', label: 'GTK' },
    { id: 'program', label: 'Program' },
    { id: 'ekstrakurikuler', label: 'Ekstrakurikuler' },
    { id: 'prestasi', label: 'Prestasi' },
    { id: 'galeri', label: 'Galeri' },
    { id: 'ppdb', label: 'PPDB' },
    { id: 'kontak', label: 'Kontak' },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setIsOpen(false);
    onTabChange(tab);
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/98 backdrop-blur-md shadow-md border-b border-[#d4af37]/30 py-2.5 sm:py-3'
          : 'bg-white/95 backdrop-blur-md border-b border-[#d4af37]/20 py-3 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center">
        {/* Brand Logo & Title */}
        <button
          id="brand-logo-link"
          type="button"
          onClick={() => handleNavClick('beranda')}
          className="flex items-center gap-3 group text-left cursor-pointer"
          title="Menuju Halaman Beranda"
        >
          {/* Islamic Emblem Crest or Custom Logo */}
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border-2 border-[#d4af37] flex items-center justify-center overflow-hidden shadow-[0_2px_12px_rgba(212,175,55,0.35)] group-hover:scale-105 transition-all duration-300 shrink-0">
            {schoolProfile.logoUrl ? (
              <img
                src={schoolProfile.logoUrl}
                alt="Logo MI Ma'arif Al Ihsan Soborejo"
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/logo-maarif.svg';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#0b3c26] via-[#072217] to-[#041a11] flex items-center justify-center text-[#d4af37]">
                <BookOpen className="w-5 h-5 text-[#d4af37]" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#d4af37] flex items-center justify-center text-[#072217] text-[8px] font-bold">
                  NU
                </div>
              </div>
            )}
          </div>
          
          <div className="leading-tight">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold tracking-widest text-[#0b3c26] uppercase bg-[#e8f3ee] px-1.5 py-0.5 rounded">
                LP MA'ARIF NU
              </span>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300/80 px-1.5 py-0.5 rounded-full">
                SATU ATAP (MI &amp; RA)
              </span>
            </div>
            <h1 className="font-heading text-sm sm:text-base md:text-lg font-bold tracking-tight text-[#072217] group-hover:text-[#0b3c26] transition-colors">
              {schoolProfile.shortName || "MI & RA AL IHSAN SOBOREJO"}
            </h1>
            <p className="text-[11px] font-medium text-emerald-800">
              Soborejo, Pringsurat, Temanggung
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-4">
          <ul className="flex items-center gap-1.5 lg:gap-2 list-none m-0 p-0">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <li key={link.id}>
                  <button
                    id={`nav-link-${link.id}`}
                    type="button"
                    onClick={() => handleNavClick(link.id)}
                    className={`font-body text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 uppercase tracking-wider cursor-pointer ${
                      isActive
                        ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-sm font-bold ring-1 ring-[#d4af37]/60'
                        : 'text-gray-700 hover:text-[#0b3c26] hover:bg-emerald-50/80'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="h-6 w-[1px] bg-gray-200 ml-1" />

          <button
            type="button"
            id="nav-btn-share-desktop"
            onClick={() => openShare({
              type: 'profil',
              title: schoolProfile.name || "MI & RA AL IHSAN SOBOREJO",
              description: schoolProfile.vision || 'Website Resmi Satu Atap RA Al Ihsan & MI Ma\'arif Al Ihsan Soborejo, Temanggung.',
              category: 'Madrasah'
            })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-900/20 hover:border-[#0b3c26] text-gray-700 hover:text-[#0b3c26] bg-white hover:bg-emerald-50/50 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            title="Bagikan Tautan Website"
          >
            <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Bagikan</span>
          </button>

          <button
            id="nav-btn-ppdb-desktop"
            type="button"
            onClick={onOpenPPDB}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b89228] text-[#072217] font-bold text-xs tracking-wider uppercase px-4 py-2 rounded-full shadow-[0_4px_15px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_22px_rgba(212,175,55,0.55)] hover:-translate-y-0.5 transition-all duration-300 border border-[#f3e5ab] cursor-pointer"
          >
            <span>Daftar PPDB</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Mobile / Tablet Buttons */}
        <div className="flex items-center gap-1.5 xl:hidden">
          <button
            type="button"
            id="nav-btn-share-mobile"
            onClick={() => openShare({
              type: 'profil',
              title: schoolProfile.name || "MI & RA AL IHSAN SOBOREJO",
              description: schoolProfile.vision || 'Website Resmi Satu Atap RA Al Ihsan & MI Ma\'arif Al Ihsan Soborejo, Temanggung.',
              category: 'Madrasah'
            })}
            className="p-2 text-gray-600 hover:text-[#0b3c26] rounded-lg transition-colors cursor-pointer"
            title="Bagikan Website"
            aria-label="Bagikan Website"
          >
            <Share2 className="w-4 h-4 text-[#d4af37]" />
          </button>

          <button
            id="nav-btn-ppdb-mobile-small"
            type="button"
            onClick={onOpenPPDB}
            className="bg-gradient-to-r from-[#d4af37] to-[#b89228] text-[#072217] font-bold text-[11px] tracking-wider uppercase px-3 py-1.5 rounded-full shadow-sm cursor-pointer"
          >
            PPDB
          </button>
          <button
            id="mobile-menu-toggle-btn"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[#072217] hover:text-[#0b3c26] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div
          id="mobile-menu-drawer"
          className="xl:hidden bg-white/98 border-t border-[#d4af37]/20 px-4 sm:px-6 py-4 shadow-2xl animate-in slide-in-from-top-3 duration-200"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">
            Pilih Halaman:
          </div>
          <ul className="grid grid-cols-2 gap-2 list-none m-0 p-0">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <li key={link.id}>
                  <button
                    id={`mobile-nav-${link.id}`}
                    type="button"
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full text-left py-2.5 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-[#0b3c26] text-[#f3e5ab] font-bold shadow-xs border border-[#d4af37]/40'
                        : 'text-[#072217] hover:bg-emerald-50 hover:text-[#0b3c26] bg-gray-50/70'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
            <button
              id="mobile-nav-ppdb-btn"
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenPPDB();
              }}
              className="w-full py-3 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b89228] text-[#072217] font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>DAFTAR PPDB ONLINE SEKARANG</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="mobile-nav-admin-btn"
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (isAdmin) {
                  setViewMode('admin');
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              className="w-full py-2 bg-[#072217] text-[#f3e5ab] font-semibold text-xs tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{isAdmin ? 'Masuk ke Panel Admin (CMS)' : 'Login Pengelola Madrasah'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
