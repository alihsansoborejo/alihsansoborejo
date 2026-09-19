import React, { useState, useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import { useShare } from '../context/ShareContext';
import { Users, GraduationCap, Award, BookOpen, ShieldCheck, Phone, Sparkles, UserCheck, Share2 } from 'lucide-react';

export const StaffSection: React.FC = () => {
  const { staffList, isAdmin, setViewMode } = useDataContext();
  const { activeDeepLink, consumeDeepLink, openShare } = useShare();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedInstitution, setSelectedInstitution] = useState<'Semua' | 'RA' | 'MI' | 'Satu Atap'>('Semua');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Auto-respond to deep links
  useEffect(() => {
    if (activeDeepLink && (activeDeepLink.type === 'gtk' || activeDeepLink.type === 'guru') && activeDeepLink.id) {
      const match = staffList.find(
        (s) =>
          s.id === activeDeepLink.id ||
          s.name.toLowerCase().includes(activeDeepLink.id!.toLowerCase())
      );
      if (match) {
        setSelectedCategory('Semua');
        setSelectedInstitution('Semua');
        setHighlightedId(match.id);
        consumeDeepLink();

        setTimeout(() => {
          const el = document.getElementById(`staff-card-${match.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    }
  }, [activeDeepLink, staffList, consumeDeepLink]);

  const categories = ['Semua', 'Pimpinan', 'Guru Kelas', 'Guru Bidang Studi', 'Tenaga Kependidikan'];

  const filteredStaff = staffList.filter((item) => {
    const matchesCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesInst =
      selectedInstitution === 'Semua' ||
      item.institution === selectedInstitution ||
      (!item.institution && selectedInstitution === 'MI');
    return matchesCat && matchesInst;
  }).sort((a, b) => (a.order || 99) - (b.order || 99));

  return (
    <section id="gtk" className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0b3c26]/10 text-[#0b3c26] text-xs font-bold tracking-widest uppercase mb-3 border border-[#0b3c26]/20">
          <Users className="w-3.5 h-3.5" />
          <span>GURU &amp; TENAGA KEPENDIDIKAN (GTK) SATU ATAP</span>
        </div>
        <h3 className="font-heading text-2xl sm:text-4xl font-bold text-[#072217] tracking-tight">
          Pendidik Berdedikasi, Pembimbing Hati
        </h3>
        <p className="font-body text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
          Dewan asatidz dan asatidzah RA Al Ihsan &amp; MI Ma'arif Al Ihsan Soborejo yang membina, mengajar, dan mendampingi santri dengan ketulusan hati dan keteladanan akhlak.
        </p>
      </div>

      {/* Institution Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {(['Semua', 'RA', 'MI', 'Satu Atap'] as const).map((inst) => (
          <button
            key={inst}
            onClick={() => setSelectedInstitution(inst)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
              selectedInstitution === inst
                ? inst === 'RA'
                  ? 'bg-amber-600 text-white shadow-md'
                  : inst === 'MI'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-[#072217] text-[#f3e5ab] shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {inst === 'Semua'
              ? 'Semua Lembaga'
              : inst === 'RA'
              ? 'Unit RA Al Ihsan'
              : inst === 'MI'
              ? 'Unit MI Ma\'arif'
              : 'Lintas Lembaga (Satu Atap)'}
          </button>
        ))}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
              selectedCategory === cat
                ? 'bg-[#0b3c26] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Staff */}
      {filteredStaff.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              id={`staff-card-${staff.id}`}
              className={`bg-white rounded-2xl overflow-hidden border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                highlightedId === staff.id
                  ? 'ring-4 ring-[#d4af37] border-[#d4af37] shadow-2xl scale-[1.02]'
                  : 'border-gray-100'
              }`}
            >
              {/* Image & Tags */}
              <div className="relative h-60 bg-gradient-to-t from-[#072217]/80 via-transparent to-transparent overflow-hidden flex items-center justify-center">
                {staff.photoUrl ? (
                  <img
                    src={staff.photoUrl}
                    alt={staff.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#0b3c26] to-[#072217] flex flex-col items-center justify-center text-white/80 p-4">
                    <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-[#d4af37]/40 flex items-center justify-center mb-2 shadow-inner">
                      <GraduationCap className="w-10 h-10 text-[#d4af37]" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-100/90 tracking-wide text-center px-2">{staff.role}</span>
                  </div>
                )}
                
                {/* Institution Badge (Top Left) */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm shadow text-white ${
                    staff.institution === 'RA'
                      ? 'bg-amber-600/95'
                      : staff.institution === 'MI'
                      ? 'bg-emerald-700/95'
                      : 'bg-teal-800/95'
                  }`}>
                    {staff.institution === 'RA' ? 'RA' : staff.institution === 'MI' ? 'MI' : 'Satu Atap'}
                  </span>
                </div>

                {/* Category Tag (Top Right) */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#0b3c26]/90 text-white backdrop-blur-sm shadow">
                    {staff.category}
                  </span>
                </div>

                {staff.status && (
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-600/90 text-white backdrop-blur-sm flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      <span>{staff.status}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Body Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-heading font-bold text-base text-[#072217] group-hover:text-[#0b3c26] transition-colors leading-snug">
                    {staff.name}
                  </h4>
                  <p className="text-xs font-semibold text-[#d4af37] bg-[#072217] inline-block px-2 py-0.5 rounded mt-1.5">
                    {staff.role}
                  </p>

                  <div className="mt-3.5 space-y-1.5 text-xs text-gray-600">
                    {staff.education && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-[#0b3c26] shrink-0" />
                        <span>Kualifikasi: <strong>{staff.education}</strong></span>
                      </div>
                    )}
                    {staff.nipOrNuptk && staff.nipOrNuptk !== '-' && (
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0b3c26] shrink-0" />
                        <span>NIP/NUPTK: {staff.nipOrNuptk}</span>
                      </div>
                    )}
                    {staff.subjects && (
                      <div className="flex items-start gap-2 pt-1 border-t border-gray-100 text-gray-500">
                        <BookOpen className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-tight">{staff.subjects}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  {staff.phone ? (
                    <a
                      href={`https://wa.me/${staff.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1.5"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Kontak</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-gray-400">GTK MI Ma'arif</span>
                  )}

                  <button
                    type="button"
                    onClick={() => openShare({
                      type: 'gtk',
                      id: staff.id,
                      title: `${staff.name} - ${staff.role}`,
                      description: `Profil Guru/Tenaga Kependidikan MI Ma'arif Al Ihsan Soborejo. ${staff.education ? 'Pendidikan: ' + staff.education + '.' : ''} ${staff.subjects ? 'Mata Pelajaran: ' + staff.subjects + '.' : ''}`,
                      category: staff.category,
                      imageUrl: staff.photoUrl,
                    })}
                    className="p-1.5 text-gray-400 hover:text-[#0b3c26] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-semibold text-[11px]"
                    title="Bagikan Profil Guru Ini"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Bagikan</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 max-w-lg mx-auto p-8">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="font-heading font-bold text-gray-800">Belum Ada Data GTK</h4>
          <p className="text-xs text-gray-500 mt-1">
            Data dewan guru dan tenaga kependidikan untuk kategori ini belum ditambahkan.
          </p>
          {isAdmin && (
            <button
              onClick={() => setViewMode('admin')}
              className="mt-4 px-4 py-2 bg-[#0b3c26] text-white text-xs font-semibold rounded-lg hover:bg-[#072217] transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Kelola GTK di Dashboard Admin</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
};
