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
      className="sticky top-0 z-40 transition-all duration-300 bg-white shadow-sm border-b border-[#d4af37]/30"
    >
      {/* BAGIAN 1: BRAND IDENTITAS LEMBAGA (DI ATAS BARIS TAB) */}
      <div className={`transition-all duration-200 border-b border-gray-100 bg-white/98 backdrop-blur-md ${
        scrolled ? 'py-1 sm:py-1.5' : 'py-1.5 sm:py-2'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center gap-3">
          {/* Brand Logo & Text Hierarchy */}
          <button
            id="brand-logo-link"
            type="button"
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer min-w-0"
            title="Menuju Halaman Beranda"
          >
            {/* Islamic Emblem Crest or Custom Logo */}
            <div className={`relative rounded-xl bg-white border-2 border-[#d4af37] flex items-center justify-center overflow-hidden shadow-[0_2px_10px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-all duration-200 shrink-0 ${
              scrolled ? 'w-9 h-9 sm:w-10 sm:h-10' : 'w-10 h-10 sm:w-11 sm:h-11'
            }`}>
              {schoolProfile.logoUrl ? (
                <img
                  src={schoolProfile.logoUrl}
                  alt="Logo MI Ma'arif Al Ihsan Soborejo"
                  className="w-full h-full object-contain p-0.5"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/logo-maarif.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0b3c26] via-[#072217] to-[#041a11] flex items-center justify-center text-[#d4af37]">
                  <BookOpen className="w-5 h-5 text-[#d4af37]" />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#d4af37] flex items-center justify-center text-[#072217] text-[7px] font-bold">
                    NU
                  </div>
                </div>
              )}
            </div>
            
            {/* Susunan Teks Rapi & Ringkas */}
            <div className="leading-tight">
              {/* Badges Baris Atas */}
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap mb-0.5">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-[#0b3c26] uppercase bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded">
                  LP MA'ARIF NU
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-300/80 px-1.5 py-0.5 rounded-full">
                  SATU ATAP (MI &amp; RA)
                </span>
                <span className="hidden md:inline-block text-[9px] font-medium text-gray-500 bg-gray-50 border border-gray-200 px-1 py-0.5 rounded">
                  NPSN: {schoolProfile.miNpsn || schoolProfile.npsn || '60710665'}
                </span>
              </div>

              {/* Nama Madrasah Rapi & Proporsional */}
              <h1 className="font-heading text-sm sm:text-base md:text-lg font-bold tracking-tight text-[#072217] group-hover:text-[#0b3c26] transition-colors leading-tight">
                {schoolProfile.shortName || "MI & RA AL IHSAN SOBOREJO"}
              </h1>

              {/* Subtitle / Lokasi */}
              <p className="text-[10px] sm:text-[11px] font-medium text-emerald-800 flex items-center gap-1">
                <span>Soborejo, Pringsurat, Kab. Temanggung</span>
              </p>
            </div>
          </button>

          {/* Tombol Aksi di Baris Atas */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              type="button"
              id="nav-btn-share-desktop"
              onClick={() => openShare({
                type: 'profil',
                title: schoolProfile.name || "MI & RA AL IHSAN SOBOREJO",
                description: schoolProfile.vision || 'Website Resmi Satu Atap RA Al Ihsan & MI Ma\'arif Al Ihsan Soborejo, Temanggung.',
                category: 'Madrasah'
              })}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-900/15 hover:border-[#0b3c26] text-gray-700 hover:text-[#0b3c26] bg-white hover:bg-emerald-50/60 text-[11px] font-semibold transition-all cursor-pointer shadow-xs"
              title="Bagikan Tautan Website"
            >
              <Share2 className="w-3 h-3 text-[#d4af37]" />
              <span className="hidden md:inline">Bagikan</span>
            </button>

            <button
              id="nav-btn-ppdb-desktop"
              type="button"
              onClick={onOpenPPDB}
              className="inline-flex items-center gap-1 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b89228] text-[#072217] font-bold text-[11px] sm:text-xs tracking-wider uppercase px-3 py-1.5 sm:py-2 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-[#f3e5ab] cursor-pointer"
            >
              <span className="hidden sm:inline">Daftar</span>
              <span>PPDB</span>
              <ArrowRight className="w-3 h-3 hidden sm:inline" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-1.5 text-[#072217] hover:text-[#0b3c26] hover:bg-emerald-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* BAGIAN 2: BARIS TAB NAVIGASI MANDIRI */}
      <div className="bg-[#072217] text-white border-t border-[#d4af37]/30 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          {/* Desktop Navigation Tabs */}
          <nav className="hidden xl:flex items-center justify-between py-1">
            <ul className="flex items-center gap-1 list-none m-0 p-0 flex-wrap">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <li key={link.id}>
                    <button
                      id={`nav-link-${link.id}`}
                      type="button"
                      onClick={() => handleNavClick(link.id)}
                      className={`font-body text-[11px] font-semibold px-2.5 py-1 rounded transition-all duration-150 uppercase tracking-wider cursor-pointer flex items-center gap-1 ${
                        isActive
                          ? 'bg-[#d4af37] text-[#072217] font-bold shadow-sm ring-1 ring-[#f3e5ab]'
                          : 'text-white/85 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{link.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="text-[10px] text-[#f3e5ab]/90 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
              <span>Satu Atap LP Ma'arif NU</span>
            </div>
          </nav>

          {/* Mobile & Tablet Horizontal Scrollable Tab Bar */}
          <div className="xl:hidden py-1 overflow-x-auto no-scrollbar flex items-center gap-1 text-[11px]">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`mobile-tab-scroll-${link.id}`}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`shrink-0 px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#d4af37] text-[#072217] font-bold shadow-xs'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
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
