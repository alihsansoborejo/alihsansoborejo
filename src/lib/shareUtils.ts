import { ShareContentType, ShareItemData } from '../types';

/**
 * Returns human readable badge/label for a content type
 */
export function getShareLabel(type: ShareContentType): string {
  switch (type) {
    case 'berita':
      return 'Berita & Warta';
    case 'galeri':
      return 'Galeri Foto';
    case 'video':
      return 'Video Kegiatan';
    case 'fasilitas':
      return 'Sarana & Prasarana';
    case 'prestasi':
      return 'Prestasi Santri';
    case 'ekskul':
    case 'ekstrakurikuler':
      return 'Ekstrakurikuler';
    case 'program':
    case 'program-unggulan':
      return 'Program Unggulan';
    case 'guru':
    case 'gtk':
      return 'Profil Pendidik / GTK';
    case 'ppdb':
      return 'PPDB Online';
    case 'profil':
      return 'Profil Madrasah';
    default:
      return 'Konten Madrasah';
  }
}

/**
 * Returns section anchor ID on the page for a content type
 */
export function getSectionId(type: ShareContentType): string {
  switch (type) {
    case 'berita':
      return 'berita';
    case 'galeri':
    case 'video':
    case 'fasilitas':
      return 'galeri';
    case 'prestasi':
      return 'prestasi';
    case 'ekskul':
    case 'ekstrakurikuler':
      return 'ekstrakurikuler';
    case 'program':
    case 'program-unggulan':
      return 'program';
    case 'guru':
    case 'gtk':
      return 'gtk';
    case 'ppdb':
      return 'ppdb';
    case 'profil':
      return 'profil';
    default:
      return '';
  }
}

/**
 * Generate a full, robust deep link URL for any content item
 */
export function createDeepLinkUrl(item: ShareItemData): string {
  if (typeof window === 'undefined') return '';

  const origin = window.location.origin;
  const pathname = window.location.pathname;
  const baseUrl = `${origin}${pathname}`.replace(/\/+$/, '');

  if (item.type === 'ppdb') {
    const tab = item.extraParam || 'form';
    return `${baseUrl}#ppdb?tab=${encodeURIComponent(tab)}`;
  }

  if (item.type === 'video') {
    const id = item.id || '';
    return `${baseUrl}#video?id=${encodeURIComponent(id)}`;
  }

  if (item.type === 'galeri') {
    const id = item.id || '';
    return `${baseUrl}#galeri?id=${encodeURIComponent(id)}`;
  }

  if (item.type === 'fasilitas') {
    const id = item.id || '';
    return `${baseUrl}#fasilitas?id=${encodeURIComponent(id)}`;
  }

  if (item.id) {
    return `${baseUrl}#${item.type}?id=${encodeURIComponent(item.id)}`;
  }

  return `${baseUrl}#${getSectionId(item.type)}`;
}

export interface ParsedDeepLink {
  type: ShareContentType;
  id?: string;
  tab?: string;
  sectionId: string;
}

/**
 * Parses deep link parameters from current window URL hash or search params
 */
export function parseDeepLink(): ParsedDeepLink | null {
  if (typeof window === 'undefined') return null;

  const hash = window.location.hash || '';
  const search = window.location.search || '';

  // 1. Check Hash e.g. "#berita?id=123" or "#ppdb?tab=status" or "#video?id=456"
  if (hash.startsWith('#')) {
    const hashWithoutPound = hash.slice(1);
    const [rawSection, rawQuery] = hashWithoutPound.split('?');
    const queryParams = new URLSearchParams(rawQuery || '');

    const normalizedSection = rawSection.toLowerCase();

    // Direct match for recognized types
    const validTypes: Record<string, ShareContentType> = {
      'berita': 'berita',
      'galeri': 'galeri',
      'foto': 'galeri',
      'video': 'video',
      'fasilitas': 'fasilitas',
      'sarpras': 'fasilitas',
      'prestasi': 'prestasi',
      'ekskul': 'ekskul',
      'ekstrakurikuler': 'ekskul',
      'program': 'program',
      'program-unggulan': 'program',
      'guru': 'guru',
      'gtk': 'guru',
      'staff': 'guru',
      'ppdb': 'ppdb',
      'profil': 'profil',
    };

    // Check if section is a dash format like "#berita-news-1"
    for (const [key, type] of Object.entries(validTypes)) {
      if (normalizedSection === key) {
        return {
          type,
          id: queryParams.get('id') || queryParams.get('itemId') || undefined,
          tab: queryParams.get('tab') || undefined,
          sectionId: getSectionId(type),
        };
      }
      if (normalizedSection.startsWith(`${key}-`)) {
        const extractedId = normalizedSection.slice(key.length + 1);
        return {
          type,
          id: extractedId,
          tab: queryParams.get('tab') || undefined,
          sectionId: getSectionId(type),
        };
      }
    }
  }

  // 2. Check Search Params fallback e.g. "?berita=123" or "?type=berita&id=123"
  if (search) {
    const params = new URLSearchParams(search);
    const content = params.get('content') || params.get('type');
    if (content) {
      const type = content.toLowerCase() as ShareContentType;
      return {
        type,
        id: params.get('id') || undefined,
        tab: params.get('tab') || undefined,
        sectionId: getSectionId(type),
      };
    }

    const shortParams: Array<{ param: string; type: ShareContentType }> = [
      { param: 'berita', type: 'berita' },
      { param: 'galeri', type: 'galeri' },
      { param: 'video', type: 'video' },
      { param: 'fasilitas', type: 'fasilitas' },
      { param: 'prestasi', type: 'prestasi' },
      { param: 'ekskul', type: 'ekskul' },
      { param: 'program', type: 'program' },
      { param: 'guru', type: 'guru' },
      { param: 'ppdb', type: 'ppdb' },
    ];

    for (const item of shortParams) {
      const val = params.get(item.param);
      if (val) {
        return {
          type: item.type,
          id: val !== 'true' ? val : undefined,
          tab: params.get('tab') || (item.type === 'ppdb' && val !== 'true' ? val : undefined),
          sectionId: getSectionId(item.type),
        };
      }
    }
  }

  return null;
}

/**
 * Copy text to clipboard safely with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }

  // Fallback using textarea
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch {
    return false;
  }
}

/**
 * Generate formatted WhatsApp share URL
 */
export function buildWhatsAppShareUrl(title: string, url: string, description?: string): string {
  let message = `*${title}*\nMI Ma'arif Al Ihsan Soborejo (Lembaga Pendidikan Satu Atap RA-MI)\n\n`;
  if (description) {
    const cleanDesc = description.replace(/\s+/g, ' ').trim();
    message += `${cleanDesc.slice(0, 140)}${cleanDesc.length > 140 ? '...' : ''}\n\n`;
  }
  message += `🔗 Buka tautan langsung di:\n${url}`;

  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}

/**
 * Generate Facebook share dialog URL
 */
export function buildFacebookShareUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

/**
 * Generate Twitter / X share URL
 */
export function buildTwitterShareUrl(title: string, url: string): string {
  const text = `${title} | MI Ma'arif Al Ihsan Soborejo`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

/**
 * Generate Telegram share URL
 */
export function buildTelegramShareUrl(title: string, url: string): string {
  const text = `${title} - MI Ma'arif Al Ihsan Soborejo`;
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

/**
 * QR code image URL for scanning
 */
export function getQrCodeUrl(url: string, size = 260): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&color=072217&bgcolor=ffffff&qzone=2`;
}

/**
 * Check if Web Share API is available and can share the given URL
 */
export function canNativeShare(data?: { title?: string; text?: string; url?: string }): boolean {
  if (typeof navigator === 'undefined' || !navigator.share) return false;
  if (!data) return true;
  if (navigator.canShare) {
    try {
      return navigator.canShare(data);
    } catch {
      return true;
    }
  }
  return true;
}

/**
 * Trigger native mobile share sheet
 */
export async function executeNativeShare(data: { title: string; text?: string; url: string }): Promise<boolean> {
  if (!canNativeShare(data)) return false;
  try {
    await navigator.share(data);
    return true;
  } catch (err: any) {
    // User cancelled or share failed
    if (err.name !== 'AbortError') {
      console.warn('Native share failed:', err);
    }
    return false;
  }
}
