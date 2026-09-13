import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { NewsArticle } from '../types';
import { Calendar, User, ArrowRight, X, Share2, Check } from 'lucide-react';
import { formatDisplayDate, parseDateTimestamp } from '../lib/dateUtils';

export const NewsSection: React.FC = () => {
  const { newsList } = useDataContext();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [copied, setCopied] = useState(false);

  // Urutkan berita berdasarkan tanggal terbit terbaru secara otomatis
  const sortedNews = [...newsList].sort((a, b) => {
    return parseDateTimestamp(b.date) - parseDateTimestamp(a.date);
  });

  const handleShare = (article: NewsArticle) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}#berita`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
            const fullContent = (latest.content && latest.content.length > 0)
              ? latest.content.join('\n\n')
              : latest.summary;
            const isLongArticle = fullContent.length > 400 || (latest.content && latest.content.length > 2);

            return (
              <div
                id={`featured-news-${latest.id}`}
                className="bg-white rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(7,34,23,0.08)] border border-[#0b3c26]/10 hover:border-[#d4af37]/40 transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Foto Berita Terbaru */}
                  <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-[440px] overflow-hidden bg-slate-900 group">
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

                  {/* Isi Berita Terbaru yang Lebar dan Nyaman Dibaca */}
                  <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-white via-emerald-50/20 to-white">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-2">
                        <span>Warta Utama Madrasah</span>
                        <span>•</span>
                        <span>{latest.readTime || '3 Menit'} Baca</span>
                      </div>

                      <h3 className="font-heading text-2xl sm:text-3xl lg:text-3xl font-bold text-[#072217] leading-tight mb-4">
                        {latest.title}
                      </h3>

                      {/* Paragraf / Isi Berita */}
                      <div className="font-body text-sm sm:text-base text-gray-700 leading-relaxed space-y-3">
                        {latest.content && latest.content.length > 0 ? (
                          <>
                            <p className="font-medium text-gray-900 leading-relaxed">
                              {latest.content[0]}
                            </p>
                            {latest.content.slice(1, 3).map((p, idx) => (
                              <p key={idx} className="line-clamp-3">
                                {p}
                              </p>
                            ))}
                          </>
                        ) : (
                          <p className="leading-relaxed">
                            {latest.summary}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Tombol Baca Selengkapnya & Aksi */}
                    <div className="pt-6 mt-6 border-t border-emerald-950/10 flex flex-wrap items-center justify-between gap-4">
                      {isLongArticle ? (
                        <button
                          id={`read-featured-btn-${latest.id}`}
                          onClick={() => setSelectedArticle(latest)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b3c26] text-[#f3e5ab] hover:bg-[#072217] font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-md group"
                        >
                          <span>Baca Selengkapnya</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ) : (
                        <button
                          id={`read-featured-btn-${latest.id}`}
                          onClick={() => setSelectedArticle(latest)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b3c26]/10 text-[#0b3c26] hover:bg-[#0b3c26] hover:text-[#f3e5ab] font-semibold text-xs sm:text-sm tracking-wide transition-all group"
                        >
                          <span>Buka Detail Berita</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}

                      <button
                        onClick={() => handleShare(latest)}
                        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0b3c26] font-medium transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-semibold">Tautan Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-4 h-4 text-[#d4af37]" />
                            <span>Bagikan Warta</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 2. Berita-Berita Terdahulu (Grid Standar) */}
          {sortedNews.length > 1 && (
            <div className="pt-6">
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-200/80">
                <div>
                  <h4 className="font-heading text-xl sm:text-2xl font-bold text-[#072217]">
                    Berita & Kabar Terdahulu
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Arsip warta, liputan acara, dan pengumuman madrasah sebelumnya.
                  </p>
                </div>
                <span className="hidden sm:inline-block text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {sortedNews.length - 1} Berita Lainnya
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedNews.slice(1).map((article) => (
                  <article
                    key={article.id}
                    id={`news-card-${article.id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(11,60,38,0.15)] border border-black/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="relative h-52 overflow-hidden">
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
                        <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider block mb-2">
                          {formatDisplayDate(article.date)}
                        </span>

                        <h4 className="font-heading text-lg font-bold text-[#072217] group-hover:text-[#0b3c26] transition-colors leading-snug mb-3">
                          {article.title}
                        </h4>

                        <p className="font-body text-xs sm:text-sm text-[#52635c] leading-relaxed mb-5 line-clamp-3">
                          {article.summary}
                        </p>
                      </div>

                      <button
                        id={`read-news-btn-${article.id}`}
                        onClick={() => setSelectedArticle(article)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0b3c26] hover:text-[#d4af37] transition-colors"
                      >
                        <span>Baca Selengkapnya</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </article>
                ))}
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

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div
          id="news-reader-modal-backdrop"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            id="news-reader-modal-content"
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#d4af37]/30 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="news-reader-close-btn"
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white hover:bg-black/80 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-72 w-full relative">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37] bg-[#072217]/80 px-2.5 py-0.5 rounded-full">
                    {selectedArticle.category}
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mt-2 leading-tight">
                    {selectedArticle.title}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-medium text-gray-700">
                    <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                    {formatDisplayDate(selectedArticle.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#d4af37]" />
                    {selectedArticle.author}
                  </span>
                </div>

                <button
                  id="news-share-btn"
                  onClick={() => handleShare(selectedArticle)}
                  className="flex items-center gap-1 text-xs text-[#0b3c26] hover:text-[#d4af37] font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600 font-semibold">Tautan Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Bagikan</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4 font-body text-sm text-gray-700 leading-relaxed">
                {selectedArticle.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                <button
                  id="news-close-footer-btn"
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2.5 bg-[#0b3c26] text-white hover:bg-[#13583a] rounded-xl text-xs font-semibold uppercase tracking-wider"
                >
                  Tutup Berita
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
