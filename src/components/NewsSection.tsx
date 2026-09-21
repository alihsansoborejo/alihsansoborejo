import React, { useState, useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import { useShare } from '../context/ShareContext';
import { NewsArticle } from '../types';
import { Calendar, User, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDisplayDate, parseDateTimestamp } from '../lib/dateUtils';

const extractParagraphs = (item: any): string[] => {
  if (!item) return [];
  if (Array.isArray(item.content)) {
    return item.content.map(String).map((s: string) => s.trim()).filter(Boolean);
  }
  if (typeof item.content === 'string' && item.content.trim()) {
    return item.content.split(/\n\n+/).map((p: string) => p.trim()).filter(Boolean);
  }
  if (item.summary && typeof item.summary === 'string' && item.summary.trim()) {
    return [item.summary.trim()];
  }
  if (item.excerpt && typeof item.excerpt === 'string' && item.excerpt.trim()) {
    return [item.excerpt.trim()];
  }
  return [];
};

export const NewsSection: React.FC = () => {
  const { newsList } = useDataContext();
  const { activeDeepLink, consumeDeepLink, openShare } = useShare();
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Auto expand news article if navigated via deep link
  useEffect(() => {
    if (activeDeepLink && activeDeepLink.type === 'berita' && activeDeepLink.id) {
      const match = newsList.find(
        (a) =>
          a.id === activeDeepLink.id ||
          a.title.toLowerCase().includes(activeDeepLink.id!.toLowerCase())
      );
      if (match) {
        setExpandedIds((prev) => ({ ...prev, [match.id]: true }));
        setHighlightedId(match.id);
        consumeDeepLink();

        // Scroll to card smoothly
        setTimeout(() => {
          const card = document.getElementById(`news-card-${match.id}`) || document.getElementById(`featured-news-${match.id}`);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    }
  }, [activeDeepLink, newsList, consumeDeepLink]);

  // Urutkan berita berdasarkan tanggal terbit terbaru secara otomatis
  const sortedNews = [...newsList].sort((a, b) => {
    return parseDateTimestamp(b.date) - parseDateTimestamp(a.date);
  });

  const toggleExpandArticle = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleShareArticle = (article: NewsArticle, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    openShare({
      type: 'berita',
      id: article.id,
      title: article.title,
      description: article.summary,
      category: article.category,
      imageUrl: article.imageUrl,
    });
  };

  return (
    <section id="berita" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#d4af37] uppercase mb-2 block">
          Kabar Terbaru
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl text-[#072217] font-bold relative inline-block">
          Berita & Artikel
        </h2>
        <div className="w-16 h-1 bg-[#d4af37] mx-auto mt-4 rounded-full" />
        <p className="font-body text-sm text-[#52635c] mt-3">
          Informasi seputar prestasi santri, agenda akademik, inovasi riset, dan dinamika kegiatan madrasah.
        </p>
      </div>

      {sortedNews.length > 0 ? (
        <div className="space-y-12">
          {/* 1. Berita Terbaru (Lebar / Featured Banner) */}
          {sortedNews[0] && (() => {
            const latest = sortedNews[0];
            const paragraphs = extractParagraphs(latest);
            const isExpanded = !!expandedIds[latest.id];

            return (
              <div
                id={`featured-news-${latest.id}`}
                className={`bg-white rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(7,34,23,0.08)] border transition-all duration-300 ${
                  highlightedId === latest.id
                    ? 'ring-4 ring-[#d4af37] border-[#d4af37]'
                    : 'border-[#0b3c26]/10 hover:border-[#d4af37]/40'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Foto Berita Terbaru */}
                  <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-[380px] overflow-hidden bg-slate-900 group">
                    <img
                      src={latest.imageUrl}
                      alt={latest.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                      <span className="bg-[#d4af37] text-[#072217] text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full shadow-md">
                        ★ Berita Terkini
                      </span>
                      <span className="bg-[#072217]/90 backdrop-blur-md text-[#f3e5ab] text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-[#d4af37]/40">
                        {latest.category}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white text-xs flex items-center gap-4">
                      <span className="flex items-center gap-1.5 font-medium text-[#f3e5ab]">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDisplayDate(latest.date)}
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-200">
                        <User className="w-3.5 h-3.5" />
                        {latest.author}
                      </span>
                    </div>
                  </div>

                  {/* Isi Berita Terbaru yang Membentang ke Bawah Tanpa Popup */}
                  <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-br from-white via-emerald-50/15 to-white">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-2">
                        <span>Warta Utama Madrasah</span>
                        <span>•</span>
                        <span>{latest.readTime || '3 Menit'} Baca</span>
                      </div>

                      <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#072217] leading-tight mb-4">
                        {latest.title}
                      </h3>

                      {/* Paragraf / Isi Berita: Membentang Panjang saat diklik */}
                      <div className="font-body text-sm sm:text-base text-gray-700 leading-relaxed space-y-3.5">
                        {paragraphs.length > 0 ? (
                          <>
                            <p className="font-medium text-gray-900 leading-relaxed">
                              {paragraphs[0]}
                            </p>
                            {isExpanded ? (
                              paragraphs.slice(1).map((p, idx) => (
                                <p key={idx} className="leading-relaxed text-gray-800 animate-in fade-in duration-300">
                                  {p}
                                </p>
                              ))
                            ) : (
                              paragraphs.slice(1, 2).map((p, idx) => (
                                <p key={idx} className="line-clamp-2 text-gray-600">
                                  {p}
                                </p>
                              ))
                            )}
                          </>
                        ) : (
                          <p className="leading-relaxed text-gray-700">
                            {latest.summary}
                          </p>
                        )}
                      </div>

                      {/* Informasi Penulis Tambahan saat Dibentangkan */}
                      {isExpanded && (
                        <div className="mt-6 pt-4 border-t border-emerald-900/10 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-950/80 bg-emerald-50/60 p-3.5 rounded-xl animate-in fade-in duration-300">
                          <div>
                            <span>Penulis: <strong>{latest.author}</strong></span>
                            <span className="mx-2">•</span>
                            <span>Kategori: <strong>{latest.category}</strong></span>
                          </div>
                          <span className="text-[11px] text-emerald-700 font-medium italic">
                            Warta Resmi MI &amp; RA Al Ihsan Soborejo
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tombol Bentangkan / Ciutkan Berita */}
                    <div className="pt-6 mt-6 border-t border-emerald-950/10 flex flex-wrap items-center justify-between gap-4">
                      <button
                        id={`toggle-featured-btn-${latest.id}`}
                        type="button"
                        onClick={(e) => toggleExpandArticle(latest.id, e)}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-sm cursor-pointer group ${
                          isExpanded
                            ? 'bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300/80'
                            : 'bg-[#0b3c26] text-[#f3e5ab] hover:bg-[#072217] shadow-md hover:-translate-y-0.5'
                        }`}
                      >
                        <span>{isExpanded ? 'Ciutkan Berita' : 'Baca Selengkapnya'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-amber-900" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#d4af37] group-hover:translate-y-0.5 transition-transform" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleShareArticle(latest, e)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-emerald-50 text-xs text-gray-700 hover:text-[#0b3c26] font-semibold transition-colors cursor-pointer border border-gray-200/80"
                        title="Bagikan Warta Terkini"
                      >
                        <Share2 className="w-4 h-4 text-[#d4af37]" />
                        <span>Bagikan Warta</span>
                      </button>
                    </div>

                    {/* Tombol Sekunder di Ujung Bawah saat Teks Sangat Panjang */}
                    {isExpanded && paragraphs.length > 2 && (
                      <div className="mt-4 pt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => toggleExpandArticle(latest.id, e)}
                          className="text-xs font-semibold text-emerald-800 hover:text-[#0b3c26] inline-flex items-center gap-1 cursor-pointer hover:underline"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Selesai Membaca • Ciutkan Kembali</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 2. Berita-Berita Terdahulu (Grid dengan Teks Membentang ke Bawah) */}
          {sortedNews.length > 1 && (
            <div className="pt-6">
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-200/80">
                <div>
                  <h4 className="font-heading text-xl sm:text-2xl font-bold text-[#072217]">
                    Berita & Kabar Terdahulu
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Arsip warta, liputan acara, dan pengumuman madrasah sebelumnya. Klik "Baca Selengkapnya" untuk membentangkan isi berita langsung di kartu.
                  </p>
                </div>
                <span className="hidden sm:inline-block text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {sortedNews.length - 1} Berita Lainnya
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                {sortedNews.slice(1).map((article) => {
                  const isExpanded = !!expandedIds[article.id];
                  const paragraphs = extractParagraphs(article);

                  return (
                    <article
                      key={article.id}
                      id={`news-card-${article.id}`}
                      className={`group bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(11,60,38,0.12)] border transition-all duration-300 flex flex-col justify-between ${
                        highlightedId === article.id
                          ? 'ring-4 ring-[#d4af37] border-[#d4af37] -translate-y-1 shadow-xl'
                          : isExpanded
                          ? 'border-[#0b3c26]/30 shadow-md ring-1 ring-emerald-600/20'
                          : 'border-black/5 hover:-translate-y-1'
                      }`}
                    >
                      <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-900">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-[#072217]/85 backdrop-blur-md text-[#d4af37] text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-[#d4af37]/30">
                          {article.category}
                        </span>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider block">
                              {formatDisplayDate(article.date)}
                            </span>
                            <span className="text-[11px] text-gray-500 font-medium">
                              {article.readTime || '3 Menit'}
                            </span>
                          </div>

                          <h4 className="font-heading text-lg font-bold text-[#072217] group-hover:text-[#0b3c26] transition-colors leading-snug mb-3">
                            {article.title}
                          </h4>

                          {/* Isi Teks Berita: Membentang Panjang ke Bawah */}
                          <div className="font-body text-xs sm:text-sm text-[#52635c] leading-relaxed mb-5">
                            {isExpanded ? (
                              <div className="space-y-3 text-gray-800 animate-in fade-in duration-300">
                                {paragraphs.length > 0 ? (
                                  paragraphs.map((p, idx) => (
                                    <p key={idx} className={idx === 0 ? "font-medium text-gray-900" : ""}>
                                      {p}
                                    </p>
                                  ))
                                ) : (
                                  <p>{article.summary}</p>
                                )}
                                <div className="pt-2 text-[11px] text-gray-500 border-t border-gray-100 flex items-center justify-between">
                                  <span>Penulis: <strong>{article.author}</strong></span>
                                  <span>Kategori: <strong>{article.category}</strong></span>
                                </div>
                              </div>
                            ) : (
                              <p className="line-clamp-3">
                                {article.summary || (paragraphs[0] ?? '')}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Tombol Bentangkan / Ciutkan Berita di Kartu */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                          <button
                            id={`toggle-news-btn-${article.id}`}
                            type="button"
                            onClick={(e) => toggleExpandArticle(article.id, e)}
                            className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all px-3 py-1.5 rounded-lg cursor-pointer ${
                              isExpanded
                                ? 'bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300/80 shadow-xs'
                                : 'text-[#0b3c26] hover:text-[#d4af37] hover:bg-emerald-50'
                            }`}
                          >
                            <span>{isExpanded ? 'Ciutkan Berita' : 'Baca Selengkapnya'}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-amber-900" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                            )}
                          </button>

                          <button
                            type="button"
                            id={`share-news-btn-${article.id}`}
                            onClick={(e) => handleShareArticle(article, e)}
                            className="p-2 text-gray-400 hover:text-[#0b3c26] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Bagikan Warta"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center max-w-xl mx-auto border border-gray-100 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#0b3c26] flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-7 h-7 text-[#0b3c26]" />
          </div>
          <h4 className="font-heading font-bold text-lg text-[#072217]">Belum Ada Berita Terbaru</h4>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
            Warta kegiatan, pengumuman madrasah, dan liputan prestasi santri akan dipublikasikan secara berkala melalui bagian ini.
          </p>
        </div>
      )}
    </section>
  );
};
