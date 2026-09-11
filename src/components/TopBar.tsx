import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Calendar, ChevronDown, Lock } from 'lucide-react';
import { PRAYER_SCHEDULE } from '../data/schoolData';
import { useDataContext } from '../context/DataContext';

export const TopBar: React.FC = () => {
  const [showPrayers, setShowPrayers] = useState(false);
  const { schoolProfile, isAdmin, setIsLoginModalOpen, setViewMode } = useDataContext();

  const handleAdminClick = () => {
    if (isAdmin) {
      setViewMode('admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div id="top-bar-container" className="bg-[#072217] text-[#f3e5ab] text-xs sm:text-sm py-2 px-4 sm:px-8 border-b border-[#d4af37]/20 relative z-30 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs sm:text-xs">
          <a
            id="topbar-email-link"
            href={`mailto:${schoolProfile.email}`}
            className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{schoolProfile.email}</span>
          </a>
          <a
            id="topbar-phone-link"
            href={`tel:${schoolProfile.phone.replace(/[^0-9]/g, '')}`}
            className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{schoolProfile.phone}</span>
          </a>
          <div className="hidden lg:flex items-center gap-1.5 text-white/80">
            <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Soborejo, Pringsurat, Temanggung</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 text-white/85">
            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>PPDB Baru Dibuka</span>
          </div>

          <div className="relative">
            <button
              id="topbar-prayer-toggle"
              onClick={() => setShowPrayers(!showPrayers)}
              className="flex items-center gap-1.5 bg-[#0b3c26] hover:bg-[#13583a] text-[#f3e5ab] px-2.5 py-1 rounded-full border border-[#d4af37]/30 transition-colors"
              title="Jadwal Sholat Temanggung & Sekitarnya"
            >
              <Clock className="w-3 h-3 text-[#d4af37]" />
              <span className="font-medium">Jadwal Sholat</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showPrayers ? 'rotate-180' : ''}`} />
            </button>

            {showPrayers && (
              <div
                id="topbar-prayer-dropdown"
                className="absolute right-0 mt-2 w-56 bg-[#072217] border border-[#d4af37]/40 rounded-xl shadow-2xl p-3 z-50 text-white animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-wider mb-2 border-b border-[#d4af37]/20 pb-1">
                  Waktu Sholat (Temanggung)
                </div>
                <div className="space-y-1.5">
                  {PRAYER_SCHEDULE.map((item) => (
                    <div key={item.name} className="flex justify-between text-xs py-0.5">
                      <span className="text-gray-300">{item.name}</span>
                      <span className="font-semibold text-[#f3e5ab]">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin Login / Portal Access */}
          <button
            id="topbar-admin-portal-btn"
            onClick={handleAdminClick}
            className="flex items-center gap-1 bg-[#d4af37]/20 hover:bg-[#d4af37] hover:text-[#072217] text-[#f3e5ab] px-2.5 py-1 rounded-full border border-[#d4af37]/50 font-semibold transition-all"
            title="Kelola seluruh konten website madrasah"
          >
            <Lock className="w-3 h-3 text-[#d4af37]" />
            <span>{isAdmin ? 'Panel Admin' : 'Masuk Pengelola'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

