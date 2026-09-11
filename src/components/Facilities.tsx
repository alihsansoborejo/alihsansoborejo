import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { FacilityItem, GalleryItem } from '../types';
import { Building2, Camera, Sparkles, CheckCircle, X, ZoomIn, Calendar, Layers } from 'lucide-react';

export const Facilities: React.FC = () => {
  const { facilities, gallery } = useDataContext();
  const [activeTab, setActiveTab] = useState<'galeri' | 'fasilitas'>('galeri');
  const [selectedFacility, setSelectedFacility] = useState<FacilityItem | null>(null);
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const galleryCategories = ['Semua', 'Ibadah & Karakter', 'Kegiatan Belajar', 'Ekstrakurikuler', 'Fasilitas'];
  const facilityCategories = ['Semua', 'Akademik', 'Spiritual', 'Teknologi', 'Olahraga', 'Kesehatan'];

  const filteredGallery = activeCategory === 'Semua'
    ? gallery
    : gallery.filter(g => g.category.toLowerCase() === activeCategory.toLowerCase());

  const filteredFacilities = activeCategory === 'Semua'
    ? facilities
    : facilities.filter(f => f.category.toLowerCase() === activeCategory.toLowerCase());

  const handleTabChange = (tab: 'galeri' | 'fasilitas') => {
    setActiveTab(tab);
    setActiveCategory('Semua');
  };

  return (
    <section id="galeri" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase font-bold tracking-widest text-[#0b3c26] bg-[#e8f3ee] px-3.5 py-1 rounded-full inline-block mb-3 border border-[#0b3c26]/20">
          DOKUMENTASI & SARANA PRASARANA
        </span>
        <h3 className="font-heading text-2xl sm:text-4xl font-bold text-[#072217] tracking-tight">
          Galeri Kegiatan & Fasilitas Madrasah
        </h3>
        <p className="font-body text-sm sm:text-base text-gray-600 mt-2">
          Potret kehangatan belajar, pembiasaan ibadah harian, dan sarana representatif di lingkungan MI Ma'arif Al Ihsan Soborejo.
        </p>
      </div>

      {/* Main Mode Tabs (Galeri vs Fasilitas) */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1.5 bg-gray-100 rounded-2xl border border-gray-200">
          <button
            id="tab-galeri-btn"
            onClick={() => handleTabChange('galeri')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'galeri'
                ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Galeri Foto Kegiatan</span>
          </button>
          <button
            id="tab-fasilitas-btn"
            onClick={() => handleTabChange('fasilitas')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'fasilitas'
                ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Fasilitas & Ruang Belajar</span>
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {(activeTab === 'galeri' ? galleryCategories : facilityCategories).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all ${
              activeCategory === cat
                ? 'bg-[#d4af37] text-[#072217] font-bold shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Galeri View */}
      {activeTab === 'galeri' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-in fade-in duration-300">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              id={`gallery-card-${item.id}`}
              onClick={() => setSelectedGallery(item)}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-60 overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute top-3 left-3 bg-[#072217]/90 backdrop-blur-md text-[#d4af37] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-[#d4af37]/30">
                  {item.category}
                </div>

                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1 text-[11px] text-[#f3e5ab] mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>
                  <h4 className="font-heading text-base font-bold leading-snug">
                    {item.title}
                  </h4>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fasilitas View */}
      {activeTab === 'fasilitas' && (
        <div id="fasilitas" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-in fade-in duration-300">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              id={`facility-card-${fac.id}`}
              onClick={() => setSelectedFacility(fac)}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={fac.imageUrl}
                  alt={fac.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#072217]/85 backdrop-blur-md text-[#d4af37] text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-[#d4af37]/30">
                  {fac.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-heading text-base sm:text-lg font-bold text-[#072217] mb-2 group-hover:text-[#0b3c26] transition-colors">
                    {fac.name}
                  </h4>
                  <p className="text-xs text-[#52635c] line-clamp-2 mb-4 leading-relaxed">
                    {fac.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#0b3c26] font-semibold">
                  <span>Lihat Spesifikasi Fasilitas</span>
                  <span className="text-[#d4af37] group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal for Gallery */}
      {selectedGallery && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedGallery(null)}
        >
          <div
            className="bg-[#072217] text-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#d4af37]/40 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedGallery(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 text-white hover:bg-black/80 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedGallery.imageUrl}
              alt={selectedGallery.title}
              className="w-full max-h-[420px] object-cover"
            />

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#072217] bg-[#d4af37] px-2.5 py-0.5 rounded-full">
                  {selectedGallery.category}
                </span>
                <span className="text-xs text-white/60">• {selectedGallery.date}</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-[#f3e5ab] mb-2">
                {selectedGallery.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                {selectedGallery.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Facility Detail Modal */}
      {selectedFacility && (
        <div
          id="facility-modal-backdrop"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedFacility(null)}
        >
          <div
            id="facility-modal-content"
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#d4af37]/30 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="facility-modal-close-btn"
              onClick={() => setSelectedFacility(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/50 text-white hover:bg-black/70 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-60 relative">
              <img
                src={selectedFacility.imageUrl}
                alt={selectedFacility.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                    {selectedFacility.category}
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                    {selectedFacility.name}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-5">
                {selectedFacility.description}
              </p>

              <h4 className="text-xs font-bold uppercase tracking-wider text-[#072217] mb-3">
                Spesifikasi & Keunggulan Fasilitas:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {selectedFacility.specifications.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-[#0b3c26] shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              <button
                id="facility-modal-ok-btn"
                onClick={() => setSelectedFacility(null)}
                className="w-full py-2.5 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors"
              >
                Tutup Informasi
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
