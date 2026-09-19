import React, { useState, useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import { useShare } from '../context/ShareContext';
import { ExtracurricularItem } from '../types';
import {
  Compass,
  Music,
  ShieldAlert,
  Palette,
  FlaskConical,
  Activity,
  Calendar,
  UserCheck,
  Award,
  ArrowRight,
  Share2,
  X
} from 'lucide-react';

export const ExtracurricularSection: React.FC = () => {
  const { extracurriculars } = useDataContext();
  const { activeDeepLink, consumeDeepLink, openShare } = useShare();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeItem, setActiveItem] = useState<ExtracurricularItem | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Auto-respond to deep links
  useEffect(() => {
    if (activeDeepLink && (activeDeepLink.type === 'ekskul' || activeDeepLink.type === 'ekstrakurikuler') && activeDeepLink.id) {
      const match = extracurriculars.find(
        (item) =>
          item.id === activeDeepLink.id ||
          item.name.toLowerCase().includes(activeDeepLink.id!.toLowerCase())
      );
      if (match) {
        setActiveItem(match);
        setHighlightedId(match.id);
        consumeDeepLink();

        setTimeout(() => {
          const card = document.getElementById(`ekskul-card-${match.id}`);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    }
  }, [activeDeepLink, extracurriculars, consumeDeepLink]);

  const categories = ['Semua', 'Keagamaan', 'Kepanduan & Bela Diri', 'Kesenian', 'Olahraga & Sains'];

  const filteredItems = selectedCategory === 'Semua' 
    ? extracurriculars 
    : extracurriculars.filter(item => item.category === selectedCategory);

  const handleShareEkskul = (item: ExtracurricularItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    openShare({
      type: 'ekskul',
      id: item.id,
      title: `Ekstrakurikuler ${item.name}`,
      description: `${item.description} Jadwal: ${item.schedule}. Pembina: ${item.coach}.`,
      category: item.category,
      imageUrl: item.imageUrl,
    });
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'Music': return <Music className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'Palette': return <Palette className="w-5 h-5" />;
      case 'FlaskConical': return <FlaskConical className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <section id="ekstrakurikuler" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto bg-slate-50/60 rounded-3xl my-10 border border-emerald-900/10">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase font-bold tracking-widest text-[#0b3c26] bg-[#e8f3ee] px-3.5 py-1 rounded-full inline-block mb-3 border border-[#0b3c26]/20">
          PENGEMBANGAN MINAT & BAKAT
        </span>
        <h3 className="font-heading text-2xl sm:text-4xl font-bold text-[#072217] tracking-tight">
          Ekstrakurikuler & Kreativitas Santri
        </h3>
        <p className="font-body text-sm sm:text-base text-gray-600 mt-2">
          Mengasah kemandirian, sportivitas, kepemimpinan, dan kecintaan pada warisan budaya Islam Ahlussunnah wal Jama'ah.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-md border border-[#d4af37]/40'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Extracurricular Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            id={`ekskul-card-${item.id}`}
            className={`group bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
              highlightedId === item.id
                ? 'ring-4 ring-[#d4af37] border-[#d4af37] -translate-y-1.5 shadow-2xl'
                : 'border-gray-200/80 hover:-translate-y-1.5'
            }`}
          >
            <div>
              {/* Image with Tag */}
              <div className="relative h-48 overflow-hidden bg-emerald-950">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3 bg-[#072217]/90 text-[#d4af37] border border-[#d4af37]/30 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                  {getIcon(item.iconName)}
                  <span>{item.category}</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-heading text-lg font-bold drop-shadow-sm">
                    {item.name}
                  </h4>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3.5">
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#0b3c26] shrink-0" />
                    <span className="font-medium text-gray-500">Jadwal:</span>
                    <span className="font-semibold text-gray-800">{item.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-[#0b3c26] shrink-0" />
                    <span className="font-medium text-gray-500">Pembina:</span>
                    <span className="text-gray-800 truncate">{item.coach}</span>
                  </div>
                </div>

                {/* Achievements badge */}
                {item.achievements.length > 0 && (
                  <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 text-[11px] text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1 text-amber-800">
                      <Award className="w-3 h-3 text-[#d4af37]" />
                      <span>Prestasi & Rekam Jejak:</span>
                    </div>
                    <ul className="list-disc list-inside pl-1 text-gray-700">
                      {item.achievements.map((ach, idx) => (
                        <li key={idx}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveItem(item)}
                className="flex-1 py-2.5 bg-emerald-50 hover:bg-[#0b3c26] text-[#0b3c26] hover:text-[#f3e5ab] font-bold text-xs rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Lihat Informasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => handleShareEkskul(item, e)}
                className="p-2.5 bg-gray-100 hover:bg-emerald-100/60 text-gray-500 hover:text-[#0b3c26] rounded-xl transition-colors cursor-pointer"
                title="Bagikan Ekstrakurikuler Ini"
              >
                <Share2 className="w-4 h-4 text-[#d4af37]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail Ekskul */}
      {activeItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#d4af37]/30 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-[#e8f3ee] px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {activeItem.category}
                </span>
                <h4 className="font-heading text-xl font-bold text-[#072217] mt-1.5">
                  {activeItem.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={activeItem.imageUrl}
              alt={activeItem.name}
              className="w-full h-48 object-cover rounded-2xl mb-4"
            />

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
              {activeItem.description}
            </p>

            <div className="bg-gray-50 rounded-2xl p-3.5 space-y-2 text-xs mb-4 border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Jadwal Latihan:</span>
                <span className="font-semibold text-gray-800">{activeItem.schedule}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Pelatih / Pembina:</span>
                <span className="font-semibold text-gray-800">{activeItem.coach}</span>
              </div>
            </div>

            {activeItem.achievements.length > 0 && (
              <div className="mb-4">
                <div className="font-bold text-xs text-gray-800 mb-2">Prestasi &amp; Rekam Jejak:</div>
                <div className="space-y-1.5">
                  {activeItem.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 bg-amber-50/80 p-2 rounded-xl border border-amber-200/50">
                      <Award className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleShareEkskul(activeItem)}
                className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#0b3c26] border border-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Bagikan Ekskul</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="flex-1 py-2.5 bg-[#0b3c26] text-[#f3e5ab] font-bold text-xs rounded-xl hover:bg-[#072217] transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

