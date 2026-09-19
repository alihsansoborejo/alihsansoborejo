import React, { useState, useEffect } from 'react';
import { ShareItemData } from '../types';
import {
  createDeepLinkUrl,
  copyToClipboard,
  buildWhatsAppShareUrl,
  buildFacebookShareUrl,
  buildTwitterShareUrl,
  buildTelegramShareUrl,
  getQrCodeUrl,
  getShareLabel,
  canNativeShare,
  executeNativeShare
} from '../lib/shareUtils';
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  X,
  Smartphone,
  Download,
  Link as LinkIcon,
  MessageCircle,
  Globe,
  Send
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  item: ShareItemData | null;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, item, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [hasNativeShare, setHasNativeShare] = useState(false);

  useEffect(() => {
    if (item && isOpen) {
      const generated = createDeepLinkUrl(item);
      setShareUrl(generated);
      setCopied(false);
      setShowQr(false);
      setHasNativeShare(canNativeShare());
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    const waUrl = buildWhatsAppShareUrl(item.title, shareUrl, item.description);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebook = () => {
    const fbUrl = buildFacebookShareUrl(shareUrl);
    window.open(fbUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleTwitter = () => {
    const twUrl = buildTwitterShareUrl(item.title, shareUrl);
    window.open(twUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleTelegram = () => {
    const tgUrl = buildTelegramShareUrl(item.title, shareUrl);
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    await executeNativeShare({
      title: item.title,
      text: item.description || `Lihat ${item.title} di website resmi MI Ma'arif Al Ihsan Soborejo`,
      url: shareUrl,
    });
  };

  const qrImageUrl = getQrCodeUrl(shareUrl, 300);
  const badgeLabel = getShareLabel(item.type);

  return (
    <div
      id="share-modal-backdrop"
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="share-modal-content"
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#d4af37]/30 relative my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-[#072217] text-white flex items-center justify-between border-b border-[#d4af37]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0b3c26] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-base sm:text-lg font-bold text-[#f3e5ab] leading-tight">
                Bagikan Konten
              </h3>
              <span className="text-[11px] text-emerald-200/80">
                Tautan langsung menuju {badgeLabel}
              </span>
            </div>
          </div>

          <button
            id="share-modal-close-btn"
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Item Preview Card */}
          <div className="bg-[#f8faf9] rounded-2xl p-3.5 border border-emerald-900/10 flex gap-3.5 items-start">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-gray-200 bg-slate-900"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#0b3c26] text-[#d4af37] flex items-center justify-center shrink-0 border border-[#d4af37]/30">
                <LinkIcon className="w-7 h-7" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0b3c26] text-[#f3e5ab] px-2 py-0.5 rounded-md">
                  {badgeLabel}
                </span>
                {item.category && (
                  <span className="text-[10px] text-gray-500 font-medium">
                    • {item.category}
                  </span>
                )}
              </div>
              <h4 className="font-heading font-bold text-xs sm:text-sm text-[#072217] leading-snug line-clamp-2">
                {item.title}
              </h4>
              {item.description && (
                <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>

          {/* Copy Link Input Section */}
          <div>
            <label className="block text-xs font-bold text-[#072217] mb-1.5">
              Salin Tautan Langsung:
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0b3c26] focus:border-transparent select-all"
                />
                <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="button"
                id="copy-share-url-btn"
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0b3c26] text-[#f3e5ab] hover:bg-[#072217]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
            {copied && (
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                Tautan berhasil disalin ke papan klip! Siap dibagikan ke media sosial atau pesan.
              </p>
            )}
          </div>

          {/* Direct Social Channels Grid */}
          <div>
            <span className="block text-xs font-bold text-[#072217] mb-2">
              Kirim Cepat Lewat Aplikasi:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <button
                type="button"
                id="share-wa-btn"
                onClick={handleWhatsApp}
                className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-800 transition-all flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">WhatsApp</span>
                <span className="text-[9px] text-emerald-600/80">Pesan &amp; Grup</span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                id="share-fb-btn"
                onClick={handleFacebook}
                className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-blue-800 transition-all flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Facebook</span>
                <span className="text-[9px] text-blue-600/80">Post / Linimasa</span>
              </button>

              {/* Telegram */}
              <button
                type="button"
                id="share-tg-btn"
                onClick={handleTelegram}
                className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200/80 text-sky-800 transition-all flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Send className="w-5 h-5 ml-0.5" />
                </div>
                <span className="text-xs font-bold">Telegram</span>
                <span className="text-[9px] text-sky-600/80">Kanal / Obrolan</span>
              </button>

              {/* Twitter / X */}
              <button
                type="button"
                id="share-tw-btn"
                onClick={handleTwitter}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 transition-all flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Twitter / X</span>
                <span className="text-[9px] text-slate-500">Postingan</span>
              </button>
            </div>
          </div>

          {/* Native Device Share Sheet (if supported) */}
          {hasNativeShare && (
            <button
              type="button"
              id="native-share-btn"
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-[#0b3c26] border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-[#0b3c26]" />
              <span>Buka Menu Berbagi Bawaan Perangkat (HP)</span>
            </button>
          )}

          {/* QR Code Toggle & Section */}
          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              id="toggle-qr-code-btn"
              onClick={() => setShowQr(!showQr)}
              className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-between transition-colors cursor-pointer border border-gray-200"
            >
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#0b3c26]" />
                <span>{showQr ? 'Sembunyikan Kode QR' : 'Tampilkan Kode QR (Untuk Dicetak / Pindai HP)'}</span>
              </div>
              <span className="text-[10px] text-[#d4af37] font-bold">
                {showQr ? 'Tutup ▲' : 'Buka ▼'}
              </span>
            </button>

            {showQr && (
              <div className="mt-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center animate-in slide-in-from-top-2 duration-200">
                <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-inner mb-3">
                  <img
                    src={qrImageUrl}
                    alt={`QR Code ${item.title}`}
                    className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                  />
                </div>
                <p className="text-xs text-gray-600 mb-3 max-w-xs leading-relaxed">
                  Pindai menggunakan kamera HP untuk langsung membuka <strong>{item.title}</strong> di peramban.
                </p>
                <a
                  href={qrImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={`qrcode-${item.type}-${item.id || 'link'}.png`}
                  className="px-4 py-1.5 bg-[#0b3c26] text-[#f3e5ab] text-xs font-bold rounded-lg hover:bg-[#072217] flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Buka / Unduh Gambar QR</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Tautan langsung memuat konten spesifik saat dibuka</span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
