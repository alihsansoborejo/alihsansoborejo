import { VideoPlatform } from '../types';

export interface ParsedVideoInfo {
  platform: VideoPlatform;
  platformLabel: string;
  videoId: string | null;
  embedUrl: string | null;
  thumbnailUrl: string;
  isDirectVideo: boolean;
  isValid: boolean;
  originalUrl: string;
}

/**
 * Extracts YouTube Video ID from various YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
}

/**
 * Extracts Vimeo ID from vimeo URLs:
 * - https://vimeo.com/123456789
 * - https://player.vimeo.com/video/123456789
 */
export function extractVimeoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const match = url.trim().match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+))/);
  return match ? match[1] : null;
}

/**
 * Checks if a URL is a Facebook video or reel
 */
export function isFacebookVideo(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.trim().toLowerCase();
  return (
    lower.includes('facebook.com') ||
    lower.includes('fb.watch') ||
    lower.includes('fb.me')
  );
}

/**
 * Checks if a URL is a Google Drive video preview
 */
export function isGoogleDriveVideo(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.toLowerCase().includes('drive.google.com');
}

/**
 * Extracts Google Drive File ID
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  const matchId = url.match(/id=([a-zA-Z0-9_-]+)/);
  return matchId ? matchId[1] : null;
}

/**
 * Checks if a URL points directly to an HTML5 video file
 */
export function isDirectVideoUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const cleaned = url.trim().split('?')[0].toLowerCase();
  return (
    cleaned.endsWith('.mp4') ||
    cleaned.endsWith('.webm') ||
    cleaned.endsWith('.ogg') ||
    cleaned.endsWith('.mov') ||
    url.startsWith('blob:') ||
    url.startsWith('data:video/')
  );
}

/**
 * Parses any video URL and determines its platform, embeddable URL, and default thumbnail
 */
export function parseVideoUrl(url: string, customThumbnail?: string): ParsedVideoInfo {
  const trimmed = (url || '').trim();

  // 1. YouTube
  const youtubeId = extractYouTubeId(trimmed);
  if (youtubeId) {
    const defaultThumb = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    return {
      platform: 'youtube',
      platformLabel: 'YouTube',
      videoId: youtubeId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`,
      thumbnailUrl: customThumbnail && customThumbnail.trim() ? customThumbnail.trim() : defaultThumb,
      isDirectVideo: false,
      isValid: true,
      originalUrl: trimmed,
    };
  }

  // 2. Facebook
  if (isFacebookVideo(trimmed)) {
    const fbEmbed = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=false&width=auto`;
    return {
      platform: 'facebook',
      platformLabel: 'Facebook',
      videoId: null,
      embedUrl: fbEmbed,
      thumbnailUrl: customThumbnail && customThumbnail.trim() ? customThumbnail.trim() : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      isDirectVideo: false,
      isValid: true,
      originalUrl: trimmed,
    };
  }

  // 3. Vimeo
  const vimeoId = extractVimeoId(trimmed);
  if (vimeoId) {
    return {
      platform: 'vimeo',
      platformLabel: 'Vimeo',
      videoId: vimeoId,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
      thumbnailUrl: customThumbnail && customThumbnail.trim() ? customThumbnail.trim() : 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      isDirectVideo: false,
      isValid: true,
      originalUrl: trimmed,
    };
  }

  // 4. TikTok
  if (trimmed.toLowerCase().includes('tiktok.com')) {
    return {
      platform: 'tiktok',
      platformLabel: 'TikTok',
      videoId: null,
      embedUrl: null,
      thumbnailUrl: customThumbnail && customThumbnail.trim() ? customThumbnail.trim() : 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
      isDirectVideo: false,
      isValid: true,
      originalUrl: trimmed,
    };
  }

  // 5. Google Drive
  if (isGoogleDriveVideo(trimmed)) {
    const driveId = extractGoogleDriveId(trimmed);
    const driveEmbed = driveId ? `https://drive.google.com/file/d/${driveId}/preview` : trimmed;
    return {
      platform: 'gdrive',
      platformLabel: 'Google Drive',
      videoId: driveId,
      embedUrl: driveEmbed,
      thumbnailUrl: customThumbnail && customThumbnail.trim() ? customThumbnail.trim() : 'https://images.unsplash.com/photo-1584697964190-7bb9fa76166e?auto=format&fit=crop&w=800&q=80',
      isDirectVideo: false,
      isValid: true,
      originalUrl: trimmed,
    };
  }

  // 6. Direct Video File
  if (isDirectVideoUrl(trimmed)) {
    return {
      platform: 'direct',
      platformLabel: 'Video Langsung (MP4)',
      videoId: null,
      embedUrl: trimmed,
      thumbnailUrl: customThumbnail && customThumbnail.trim() ? customThumbnail.trim() : 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
      isDirectVideo: true,
      isValid: true,
      originalUrl: trimmed,
    };
  }

  // 7. General Web Video / Other
  const isValidUrl = Boolean(trimmed.startsWith('http://') || trimmed.startsWith('https://'));
  return {
    platform: 'other',
    platformLabel: 'Video Web',
    videoId: null,
    embedUrl: isValidUrl ? trimmed : null,
    thumbnailUrl: customThumbnail && customThumbnail.trim() ? customThumbnail.trim() : 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
    isDirectVideo: false,
    isValid: isValidUrl,
    originalUrl: trimmed,
  };
}
