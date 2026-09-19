import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useDataContext } from '../context/DataContext';

export const FloatingWA: React.FC = () => {
  const { schoolProfile } = useDataContext();
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSendWA = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = schoolProfile.whatsapp.replace(/[^0-9]/g, '');
    const defaultText = msg.trim() || 'Assalamu\'alaikum Panitia PPDB MI Ma\'arif Al Ihsan Soborejo, saya ingin menanyakan informasi pendaftaran calon siswa baru.';
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setMsg('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {isOpen && (
        <div
          id="wa-consultation-popup"
          className="mb-3 bg-white rounded-2xl shadow-2xl border border-[#d4af37]/30 w-72 sm:w-80 overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        >
          {/* WA Header */}
          <div className="bg-gradient-to-r from-[#072217] to-[#0b3c26] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-heading text-xs font-bold text-[#f3e5ab]">
                  Konsultasi MI Al Ihsan
                </h5>
                <span className="text-[10px] text-green-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Panitia PPDB Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* WA Chat Body */}
          <div className="p-4 bg-[#f8faf9] text-xs text-gray-700">
            <div className="bg-white p-3 rounded-xl shadow-xs border border-gray-150 mb-3 leading-relaxed">
              Assalamu'alaikum Bapak/Ibu Wali Calon Santri! Ada yang dapat kami bantu terkait pendaftaran, kurikulum, atau kegiatan di MI Ma'arif Al Ihsan Soborejo?
            </div>

            <form onSubmit={handleSendWA} className="space-y-2">
              <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Ketik pesan Anda di sini..."
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0b3c26]"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim via WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Floating Button */}
      <button
        id="floating-wa-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 bg-gradient-to-r from-[#0b3c26] to-[#072217] text-white p-3 sm:p-3.5 rounded-full shadow-[0_6px_25px_rgba(7,34,23,0.4)] border-2 border-[#d4af37] hover:scale-105 transition-all duration-300 cursor-pointer"
        aria-label="Konsultasi WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 text-[#25D366]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border border-white rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border border-white rounded-full" />
        </div>
        <span className="hidden sm:inline text-xs font-bold text-[#f3e5ab] pr-1">
          Tanya Kami (WA)
        </span>
      </button>
    </div>
  );
};
