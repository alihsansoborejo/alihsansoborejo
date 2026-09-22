import React, { useState, useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import { useShare } from '../context/ShareContext';
import { NewsArticle } from '../types';
import {
  Calendar,
  User,
  Share2,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  BookOpen,
  Sparkles,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { formatDisplayDate, parseDateTimestamp } from '../lib/dateUtils';
import { FormattedText } from './FormattedText';

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
  
  // ID berita yang sedang dibaca selengkapnya di bagian atas (featured reader)
  // null = menampilkan Berita Terbaru dalam mode ringkasan awal
  const [activeReadingId, setActiveReadingId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Urutkan berita berdasarkan tanggal terbit terbaru secara otomatis
  const sortedNews = [...newsList].sort((a, b) => {
    return parseDateTimestamp(b.date) - parseDateTimestamp(a.date);
  });

  const defaultLatestArticle = sortedNews[0] || null;

  // Berita yang aktif sedang ditampilkan di bagian atas
  const currentTopArticle: NewsArticle | null = activeReadingId
    ? sortedNews.find((a) => a.id === activeReadingId) || defaultLatestArticle
    : defaultLatestArticle;

  // Apakah artikel di bagian atas sedang dalam mode dibaca selengkapnya
  const isTopArticleExpanded = activeReadingId !== null;

  // Auto expand news article if navigated via deep link
  useEffect(() => {
    if (activeDeepLink && activeDeepLink.type === 'berita' && activeDeepLink.id) {
      const match = sortedNews.find(
        (a) =>
          a.id === activeDeepLink.id ||
          a.title.toLowerCase().includes(activeDeepLink.id!.toLowerCase())
      );
      if (match) {
        setActiveReadingId(match.id);
        setHighlightedId(match.id);
        consumeDeepLink();

        // Scroll to top reader smoothly
        setTimeout(() => {
          const topReader = document.getElementById('berita-top-reader');
          if (topReader) {
            topReader.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 200);
      }
    }
  }, [activeDeepLink, sortedNews, consumeDeepLink]);

  // Fungsi membaca berita di bagian atas
  const handleReadArticleAtTop = (article: NewsArticle, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveReadingId(article.id);
    setHighlightedId(article.id);

    // Gulir halus langsung ke area baca atas
    setTimeout(() => {
      const topReader = document.getElementById('berita-top-reader');
      if (topReader) {
        topReader.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Fungsi menciutkan berita dan kembali ke posisi semula di daftar bawah
  const handleCollapseArticle = (articleId?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetId = articleId || activeReadingId;
    setActiveReadingId(null);

    // Jika artikel yang diciutkan bukan berita terbaru (berasal dari daftar arsip bawah),
    // kembalikan layar secara mulus ke posisi kartu semula
    if (targetId && defaultLatestArticle && targetId !== defaultLatestArticle.id) {
      setHighlightedId(targetId);
      setTimeout(() => {
        const card = document.getElementById(`news-card-${targetId}`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 120);
    } else {
      // Jika yang diciutkan adalah berita terbaru teratas, scroll ke header berita
      setTimeout(() => {
        const topReader = document.getElementById('berita-top-reader');
        if (topReader) {
          topReader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
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
    <section id="berita" className="pt-3 sm:pt-4 pb-14 sm:pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header Bagian Berita */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#d4af37] uppercase mb-1 block">
          Kabar &amp; Warta Madrasah
        </span>
        <h2 className="font-heading text-xl sm:text-2xl text-[#072217] font-bold relative inline-block">
          Berita &amp; Artikel
        </h2>
        <div className="w-12 h-0.5 bg-[#d4af37] mx-auto mt-2 rounded-full" />
        <p className="font-body text-xs sm:text-sm text-[#52635c] mt-2">
          Informasi seputar prestasi santri, agenda akademik, inovasi riset, dan dinamika kegiatan MI &amp; RA Al Ihsan Soborejo.
        </p>
      </div>

      {sortedNews.length > 0 ? (
        <div className="space-y-10">
          {/* ========================================================================= */}
          {/* 1. BAGIAN ATAS: BERITA UTAMA / ARTIKEL YANG SEDANG DIBACA LENGKAP         */}
          {/* ========================================================================= */}
          {currentTopArticle && (() => {
            const topArticle = currentTopArticle;
            const paragraphs = extractParagraphs(topArticle);
            const isFromArchive = defaultLatestArticle && topArticle.id !== defaultLatestArticle.id;

            return (
              <div
                id="berita-top-reader"
                className={`bg-white rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(7,34,23,0.08)] border transition-all duration-300 scroll-mt-24 ${
                  isTopArticleExpanded
                    ? 'border-[#0b3c26]/40 shadow-xl ring-2 ring-emerald-700/20'
                    : 'border-[#0b3c26]/10 hover:border-[#d4af37]/40'
                }`}
              >
                {/* --------------------------------------------------------------- */}
                {/* KONDISI A: SEDANG DIBACA LENGKAP (Expanded Mode di Bagian Atas) */}
                {/* --------------------------------------------------------------- */}
                {isTopArticleExpanded ? (
                  <div className="flex flex-col animate-in fade-in duration-300">
                    {/* Header Pemberitahuan Status Membaca */}
                    <div className="bg-gradient-to-r from-[#041a11] via-[#072217] to-[#0b3c26] text-white px-5 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#d4af37]/30">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold text-[#f3e5ab]">
                          {isFromArchive
                            ? 'Sedang Membaca Berita dari Arsip'
                            : 'Sedang Membaca Berita Terkini'}
                        </span>
                        {isFromArchive && (
                          <span className="hidden sm:inline-block text-[11px] bg-white/10 px-2 py-0.5 rounded-full text-emerald-200">
                            (Ditampilkan di Bagian Atas)
                          </span>
                        )}
                      </div>

                      {/* Tombol Cepat Ciutkan Berita di Header Atas */}
                      <button
                        type="button"
                        onClick={(e) => handleCollapseArticle(topArticle.id, e)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 hover:text-white border border-amber-400/40 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                        title="Tutup &amp; kembali ke posisi semula"
                      >
                        <ChevronUp className="w-3.5 h-3.5 text-amber-300" />
                        <span>Ciutkan Berita</span>
                        {isFromArchive && <span className="hidden md:inline">(Kembali ke Posisi Semula)</span>}
                      </button>
                    </div>

                    {/* FOTO BERITA BESAR DI BAGIAN ATAS TEKS (Utuh & Tidak Terpotong) */}
                    <div className="relative w-full bg-neutral-950 flex items-center justify-center overflow-hidden border-b border-gray-200">
                      {/* Ambient Backdrop */}
                      <img
                        src={topArticle.imageUrl}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
                      />
                      {/* Foto Utama: object-contain utuh tidak terpotong */}
                      <img
                        src={topArticle.imageUrl}
                        alt={topArticle.title}
                        className="relative z-10 w-full max-h-[500px] sm:max-h-[580px] object-contain mx-auto"
                      />

                      {/* Badge Kategori & Warta Utama */}
                      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
                        <span className="bg-[#d4af37] text-[#072217] text-[11px] sm:text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full shadow-md">
                          {isFromArchive ? '★ Warta Pilihan' : '★ Warta Terkini'}
                        </span>
                        <span className="bg-[#072217]/90 backdrop-blur-md text-[#f3e5ab] text-[11px] sm:text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-[#d4af37]/40">
                          {topArticle.category}
                        </span>
                      </div>

                      {/* Info Bar di Bawah Foto */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 text-white text-xs flex flex-wrap items-center justify-between gap-2 z-20">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 font-medium text-[#f3e5ab]">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDisplayDate(topArticle.date)}
                          </span>
                          <span className="flex items-center gap-1.5 text-gray-200">
                            <User className="w-3.5 h-3.5" />
                            {topArticle.author}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#d4af37] font-semibold">
                          Foto Dokumentasi Resmi
                        </span>
                      </div>
                    </div>

                    {/* TEKS LENGKAP ARTIKEL DI BAWAH FOTO */}
                    <div className="p-6 sm:p-10 lg:p-12 bg-white">
                      <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-2.5">
                          <span>{isFromArchive ? 'Arsip Berita Madrasah' : 'Warta Utama Madrasah'}</span>
                          <span>•</span>
                          <span>{topArticle.readTime || '3 Menit'} Baca</span>
                        </div>

                        <h3 className="font-heading text-xl sm:text-3xl font-bold text-[#072217] leading-tight mb-6">
                          {topArticle.title}
                        </h3>

                        {/* Paragraf / Seluruh Isi Berita */}
                        <div className="font-body text-sm sm:text-base text-gray-800 leading-relaxed space-y-4">
                          {paragraphs.length > 0 ? (
                            paragraphs.map((p, idx) => (
                              <div
                                key={idx}
                                className={idx === 0 ? 'font-medium text-gray-950 leading-relaxed text-base sm:text-lg' : 'leading-relaxed text-gray-800'}
                              >
                                <FormattedText text={p} asParagraphs={false} />
                              </div>
                            ))
                          ) : (
                            <div className="leading-relaxed text-gray-800">
                              <FormattedText text={topArticle.summary} asParagraphs={false} />
                            </div>
                          )}
                        </div>

                        {/* Informasi Penulis Box */}
                        <div className="mt-8 pt-5 border-t border-emerald-900/10 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-emerald-950/90 bg-emerald-50/70 p-4 sm:p-5 rounded-2xl">
                          <div>
                            <span>Penulis: <strong>{topArticle.author}</strong></span>
                            <span className="mx-2">•</span>
                            <span>Kategori: <strong>{topArticle.category}</strong></span>
                          </div>
                          <span className="text-xs text-emerald-800 font-medium italic">
                            Warta Resmi MI &amp; RA Al Ihsan Soborejo
                          </span>
                        </div>

                        {/* Tombol Aksi Bawah */}
                        <div className="pt-6 mt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
                          <button
                            id={`toggle-featured-btn-${topArticle.id}`}
                            type="button"
                            onClick={(e) => handleCollapseArticle(topArticle.id, e)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300 transition-all shadow-xs cursor-pointer"
                          >
                            <ChevronUp className="w-4 h-4 text-amber-900" />
                            <span>Ciutkan Berita</span>
                            {isFromArchive && (
                              <span className="text-xs font-semibold text-amber-800 hidden sm:inline">
                                • Kembali ke Posisi Semula ↓
                              </span>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleShareArticle(topArticle, e)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-emerald-50 text-xs sm:text-sm text-gray-700 hover:text-[#0b3c26] font-semibold transition-colors cursor-pointer border border-gray-200"
                            title="Bagikan Warta"
                          >
                            <Share2 className="w-4 h-4 text-[#d4af37]" />
                            <span>Bagikan Warta</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* --------------------------------------------------------------- */
                  /* KONDISI B: DEFAULT PREVIEW (Ringkasan Berita Terkini)           */
                  /* --------------------------------------------------------------- */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Foto Berita Terbaru - Uncropped via object-contain */}
                    <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-[360px] bg-neutral-950 group flex items-center justify-center overflow-hidden">
                      <img
                        src={topArticle.imageUrl}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                      />
                      <img
                        src={topArticle.imageUrl}
                        alt={topArticle.title}
                        className="relative z-10 max-h-[340px] w-full object-contain group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
                        <span className="bg-[#d4af37] text-[#072217] text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full shadow-md">
                          ★ Berita Terkini
                        </span>
                        <span className="bg-[#072217]/90 backdrop-blur-md text-[#f3e5ab] text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-[#d4af37]/40">
                          {topArticle.category}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 z-20 text-white text-xs flex items-center gap-4">
                        <span className="flex items-center gap-1.5 font-medium text-[#f3e5ab]">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDisplayDate(topArticle.date)}
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-200">
                          <User className="w-3.5 h-3.5" />
                          {topArticle.author}
                        </span>
                      </div>
                    </div>

                    {/* Isi Ringkasan Berita Terkini */}
                    <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-white via-emerald-50/15 to-white">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-2">
                          <span>Warta Utama Madrasah</span>
                          <span>•</span>
                          <span>{topArticle.readTime || '3 Menit'} Baca</span>
                        </div>

                        <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] leading-tight mb-3">
                          {topArticle.title}
                        </h3>

                        {/* Paragraf Cuplikan */}
                        <div className="font-body text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2">
                          {paragraphs.length > 0 ? (
                            <>
                              <div className="font-medium text-gray-900 leading-relaxed">
                                <FormattedText text={paragraphs[0]} asParagraphs={false} />
                              </div>
                              {paragraphs.slice(1, 2).map((p, idx) => (
                                <div key={idx} className="line-clamp-2 text-gray-600">
                                  <FormattedText text={p} asParagraphs={false} />
                                </div>
                              ))}
                            </>
                          ) : (
                            <div className="leading-relaxed text-gray-700 line-clamp-3">
                              <FormattedText text={topArticle.summary} asParagraphs={false} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tombol Lanjutkan Membaca */}
                      <div className="pt-5 mt-5 border-t border-emerald-950/10 flex flex-wrap items-center justify-between gap-3">
                        <button
                          id={`toggle-featured-btn-${topArticle.id}`}
                          type="button"
                          onClick={(e) => handleReadArticleAtTop(topArticle, e)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide bg-[#0b3c26] text-[#f3e5ab] hover:bg-[#072217] shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                        >
                          <BookOpen className="w-4 h-4 text-[#d4af37]" />
                          <span>Baca Selengkapnya</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleShareArticle(topArticle, e)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-emerald-50 text-xs text-gray-700 hover:text-[#0b3c26] font-semibold transition-colors cursor-pointer border border-gray-200/80"
                          title="Bagikan Warta Terkini"
                        >
                          <Share2 className="w-4 h-4 text-[#d4af37]" />
                          <span>Bagikan</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* 2. ARSIP BERITA LAINNYA (Grid Kompak: Semua Berita Otomatis Menciut)     */}
          {/* ========================================================================= */}
          {sortedNews.length > 1 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-gray-200/80">
                <div>
                  <h4 className="font-heading text-lg sm:text-xl font-bold text-[#072217]">
                    Kabar &amp; Berita Lainnya
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Klik <strong>"Baca Selengkapnya"</strong> pada berita mana pun untuk langsung membacanya di bagian atas layar.
                  </p>
                </div>
                <span className="hidden sm:inline-block text-xs font-semibold px-3 py-1 bg-emerald-50 text-[#0b3c26] border border-emerald-200 rounded-full">
                  {sortedNews.length - 1} Berita Lainnya
                </span>
              </div>

              {/* Grid 3-kolom kartu kompak: semua kartu otomatis menciut agar hemat tempat */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {sortedNews.slice(1).map((article) => {
                  const isCurrentlyReadAtTop = activeReadingId === article.id;
                  const paragraphs = extractParagraphs(article);

                  return (
                    <article
                      key={article.id}
                      id={`news-card-${article.id}`}
                      className={`group bg-white rounded-2xl overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_30px_rgba(11,60,38,0.1)] border transition-all duration-300 flex flex-col justify-between scroll-mt-28 ${
                        isCurrentlyReadAtTop
                          ? 'ring-3 ring-[#d4af37] border-[#d4af37] bg-emerald-50/20'
                          : highlightedId === article.id
                          ? 'ring-2 ring-emerald-600 border-emerald-600'
                          : 'border-black/10 hover:border-[#0b3c26]/30'
                      }`}
                    >
                      {/* Foto Berita (Utuh & Tidak Terpotong) */}
                      <div className="relative h-44 sm:h-48 overflow-hidden bg-neutral-950 flex items-center justify-center shrink-0">
                        <img
                          src={article.imageUrl}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover blur-lg opacity-30 scale-110 pointer-events-none"
                        />
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Category Badge */}
                        <span className="absolute top-2.5 left-2.5 z-20 bg-[#072217]/85 backdrop-blur-md text-[#d4af37] text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border border-[#d4af37]/30">
                          {article.category}
                        </span>

                        {/* Indikator Sedang Terbaca di Atas */}
                        {isCurrentlyReadAtTop && (
                          <div className="absolute top-2.5 right-2.5 z-20">
                            <span className="bg-[#d4af37] text-[#072217] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 animate-pulse">
                              <Eye className="w-3 h-3" />
                              <span>Sedang Dibaca di Atas</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Konten Kartu Ringkas (Menciut untuk Menghemat Ruang) */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-wider block">
                              {formatDisplayDate(article.date)}
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium">
                              {article.readTime || '3 Menit'}
                            </span>
                          </div>

                          <h4 className="font-heading text-sm sm:text-base font-bold text-[#072217] group-hover:text-[#0b3c26] transition-colors leading-snug mb-2 line-clamp-2">
                            {article.title}
                          </h4>

                          {/* Cuplikan Singkat Menciut (Maksimal 2-3 baris agar tidak menghabiskan ruang) */}
                          <div className="font-body text-xs text-gray-600 leading-relaxed mb-4 line-clamp-2">
                            <FormattedText
                              text={article.summary || (paragraphs[0] ?? '')}
                              asParagraphs={false}
                            />
                          </div>
                        </div>

                        {/* Tombol Aksi: Klik Baca Selengkapnya Langsung Membaca di Atas */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                          {isCurrentlyReadAtTop ? (
                            <button
                              id={`toggle-news-btn-${article.id}`}
                              type="button"
                              onClick={(e) => handleCollapseArticle(article.id, e)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold transition-all px-3 py-1.5 rounded-lg bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300 shadow-2xs cursor-pointer"
                              title="Ciutkan dan tutup tampilan di atas"
                            >
                              <ChevronUp className="w-3.5 h-3.5 text-amber-900" />
                              <span>Ciutkan Berita</span>
                            </button>
                          ) : (
                            <button
                              id={`toggle-news-btn-${article.id}`}
                              type="button"
                              onClick={(e) => handleReadArticleAtTop(article, e)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold transition-all px-3 py-1.5 rounded-lg bg-emerald-50 text-[#0b3c26] hover:bg-[#0b3c26] hover:text-[#f3e5ab] border border-emerald-200 cursor-pointer group/btn"
                              title="Baca berita ini selengkapnya di bagian atas layar"
                            >
                              <span>Baca Selengkapnya</span>
                              <ArrowUp className="w-3.5 h-3.5 text-[#d4af37] group-hover/btn:-translate-y-0.5 transition-transform" />
                            </button>
                          )}

                          <button
                            type="button"
                            id={`share-news-btn-${article.id}`}
                            onClick={(e) => handleShareArticle(article, e)}
                            className="p-1.5 text-gray-400 hover:text-[#0b3c26] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Bagikan Berita"
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
        <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-auto border border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0b3c26] flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-[#0b3c26]" />
          </div>
          <h4 className="font-heading font-bold text-base text-[#072217]">Belum Ada Berita Terbaru</h4>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Warta kegiatan, pengumuman madrasah, dan liputan prestasi santri akan dipublikasikan secara berkala melalui bagian ini.
          </p>
        </div>
      )}
    </section>
  );
};
