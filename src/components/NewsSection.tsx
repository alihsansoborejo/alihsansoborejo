import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { NewsArticle } from '../types';
import { Calendar, User, ArrowRight, X, Share2, Check } from 'lucide-react';

export const NewsSection: React.FC = () => {
  const { newsList } = useDataContext();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [copied, setCopied] = useState(false);

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

      {newsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((article) => (
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
                    {article.date}
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
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                    {selectedArticle.date}
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
