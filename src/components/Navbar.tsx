import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen, ArrowRight, Shield, Lock } from 'lucide-react';
import { useDataContext } from '../context/DataContext';

interface NavbarProps {
  onOpenPPDB: () => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPPDB, activeSection = 'beranda' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { schoolProfile, isAdmin, setIsLoginModalOpen, setViewMode } = useDataContext();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Berita', href: '#berita' },
    { label: 'Profil', href: '#profil' },
    { label: 'GTK', href: '#gtk' },
    { label: 'Program', href: '#program' },
    { label: 'Ekstrakurikuler', href: '#ekstrakurikuler' },
    { label: 'Prestasi', href: '#prestasi' },
    { label: 'Galeri', href: '#galeri' },
    { label: 'PPDB', href: '#ppdb' },
    { label: 'Kontak', href: '#kontak' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-[#d4af37]/30 py-2.5 sm:py-3'
          : 'bg-white/90 backdrop-blur-md border-b border-[#d4af37]/20 py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center">
        {/* Brand Logo & Title */}
        <a
          id="brand-logo-link"
          href="#beranda"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#beranda');
          }}
          className="flex items-center gap-3 group"
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
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-widest text-[#0b3c26] uppercase bg-[#e8f3ee] px-1.5 py-0.5 rounded">
                LP MA'ARIF NU
              </span>
              <span className="text-[10px] font-medium text-gray-500 hidden sm:inline">
                • PRINGSURAT
              </span>
            </div>
            <h1 className="font-heading text-sm sm:text-base md:text-lg font-bold tracking-tight text-[#072217] group-hover:text-[#0b3c26] transition-colors">
              MI MA'ARIF AL IHSAN
            </h1>
            <p className="text-[11px] font-medium text-emerald-800">
              Soborejo, Temanggung
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-5">
          <ul className="flex items-center gap-4 lg:gap-5 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  id={`nav-link-${link.label.toLowerCase()}`}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="font-body text-xs font-semibold text-gray-700 hover:text-[#0b3c26] relative py-1 transition-colors uppercase tracking-wider after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#d4af37] after:to-[#0b3c26] hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            id="nav-btn-ppdb-desktop"
            onClick={onOpenPPDB}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b89228] text-[#072217] font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-full shadow-[0_4px_15px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_22px_rgba(212,175,55,0.55)] hover:-translate-y-0.5 transition-all duration-300 border border-[#f3e5ab]"
          >
            <span>PPDB Online</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Mobile / Tablet Buttons */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            id="nav-btn-ppdb-mobile-small"
            onClick={onOpenPPDB}
            className="bg-gradient-to-r from-[#d4af37] to-[#b89228] text-[#072217] font-bold text-[11px] tracking-wider uppercase px-3 py-1.5 rounded-full shadow-sm"
          >
            PPDB
          </button>
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[#072217] hover:text-[#0b3c26] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
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
          className="xl:hidden bg-white/98 border-t border-[#d4af37]/20 px-6 py-5 shadow-2xl animate-in slide-in-from-top-3 duration-200"
        >
          <ul className="grid grid-cols-2 gap-2 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  id={`mobile-nav-${link.label.toLowerCase()}`}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="block py-2 px-3 text-sm font-medium text-[#072217] hover:bg-emerald-50 hover:text-[#0b3c26] rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
            <button
              id="mobile-nav-ppdb-btn"
              onClick={() => {
                setIsOpen(false);
                onOpenPPDB();
              }}
              className="w-full py-3 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b89228] text-[#072217] font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 shadow-md"
            >
              <span>DAFTAR PPDB ONLINE SEKARANG</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="mobile-nav-admin-btn"
              onClick={() => {
                setIsOpen(false);
                if (isAdmin) {
                  setViewMode('admin');
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              className="w-full py-2 bg-[#072217] text-[#f3e5ab] font-semibold text-xs tracking-wider rounded-xl flex items-center justify-center gap-2"
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
