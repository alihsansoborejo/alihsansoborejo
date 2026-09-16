import { VideoPlatform, VideoAspectRatio } from '../types';

export interface ParsedVideoInfo {
  platform: VideoPlatform;
  platformLabel: string;
  videoId: string | null;
  embedUrl: string | null;
  thumbnailUrl: string;
  isDirectVideo: boolean;
  isValid: boolean;
  originalUrl: string;
  isPortrait: boolean;
  defaultAspectRatio: 'landscape' | 'portrait' | 'square';
  aspectRatio: VideoAspectRatio;
}

/**
 * Checks if a video URL is typically a portrait/vertical video (Reel, Shorts, TikTok)
 */
export function isPortraitVideoUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.trim().toLowerCase();
  return (
    lower.includes('/reel/') ||
    lower.includes('/reels/') ||
    lower.includes('/share/r/') ||
    lower.includes('tiktok.com') ||
    lower.includes('/shorts/') ||
    lower.includes('instagram.com/reel/') ||
    lower.includes('instagram.com/reels/') ||
    lower.includes('orientation=portrait') ||
    lower.includes('aspect=portrait') ||
    lower.includes('type=reel')
  );
}

/**
 * Returns container CSS classes and configurations based on video aspect ratio
 */
export function getVideoAspectConfig(aspectRatio: VideoAspectRatio = 'auto', isPortraitDefault: boolean = false) {
  const effectiveAspect =
    aspectRatio === 'auto' || !aspectRatio
      ? isPortraitDefault
        ? 'portrait'
        : 'landscape'
      : aspectRatio;

  switch (effectiveAspect) {
    case 'portrait':
      return {
        effectiveAspect: 'portrait' as const,
        modalMaxWidth: 'max-w-md sm:max-w-lg',
        containerAspectClass: 'aspect-[9/16] max-h-[75vh] sm:max-h-[82vh]',
        badgeLabel: '9:16 Potret / Reel',
        isPortrait: true,
      };
    case 'square':
      return {
        effectiveAspect: 'square' as const,
        modalMaxWidth: 'max-w-xl',
        containerAspectClass: 'aspect-square max-h-[70vh]',
        badgeLabel: '1:1 Persegi',
        isPortrait: false,
      };
    case 'landscape':
    default:
      return {
        effectiveAspect: 'landscape' as const,
        modalMaxWidth: 'max-w-3xl',
        containerAspectClass: 'aspect-video',
        badgeLabel: '16:9 Lanskap',
        isPortrait: false,
      };
  }
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
 * Parses any video URL and determines its platform, embeddable URL, orientation, and default thumbnail
 */
export function parseVideoUrl(
  url: string,
  customThumbnail?: string,
  explicitAspect?: VideoAspectRatio
): ParsedVideoInfo {
  const trimmed = (url || '').trim();
  const urlIsPortrait = isPortraitVideoUrl(trimmed);
  const isPortrait = explicitAspect === 'portrait' ? true : explicitAspect === 'landscape' || explicitAspect === 'square' ? false : urlIsPortrait;
  const defaultAspect: 'landscape' | 'portrait' | 'square' = isPortrait ? 'portrait' : 'landscape';
  const effectiveAspect: VideoAspectRatio = explicitAspect && explicitAspect !== 'auto' ? explicitAspect : defaultAspect;

  // 1. YouTube
  const youtubeId = extractYouTubeId(trimmed);
  if (youtubeId) {
    const isShorts = trimmed.toLowerCase().includes('/shorts/');
    const isYtPortrait = explicitAspect === 'portrait' ? true : explicitAspect === 'landscape' ? false : isShorts;
    const defaultThumb = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    return {
      platform: 'youtube',
      platformLabel: isYtPortrait ? 'YouTube Shorts' : 'YouTube',
      videoId: youtubeId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`,
      thumbnailUrl: customThumbnail && customThumbnail.trim() ? customThumbnail.trim() : defaultThumb,
      isDirectVideo: false,
      isValid: true,
      originalUrl: trimmed,
      isPortrait: isYtPortrait,
      defaultAspectRatio: isYtPortrait ? 'portrait' : 'landscape',
      aspectRatio: effectiveAspect,
    };
  }

  // 2. Facebook (Supports Watch, Reels, Posts, and Vertical Videos)
  if (isFacebookVideo(trimmed)) {
    const isFbPortrait = isPortrait;
    const fbEmbed = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=false&width=auto`;
    return {
      platform: 'facebook',
      platformLabel: isFbPortrait ? 'Facebook Reel / Potret' : 'Facebook Video',
      videoId: null,
      embedUrl: fbEmbed,
      thumbnailUrl: customThumbnail && customThumbnail.trim() ? customThumbnail.trim() : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      isDirectVideo: false,
      isValid: true,
      originalUrl: trimmed,
      isPortrait: isFbPortrait,
      defaultAspectRatio: isFbPortrait ? 'portrait' : 'landscape',
      aspectRatio: effectiveAspect,
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
      isPortrait: isPortrait,
      defaultAspectRatio: defaultAspect,
      aspectRatio: effectiveAspect,
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
      isPortrait: true,
      defaultAspectRatio: 'portrait',
      aspectRatio: effectiveAspect,
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
      isPortrait: isPortrait,
      defaultAspectRatio: defaultAspect,
      aspectRatio: effectiveAspect,
    };
  }

  // 6. Direct Video File
  if (isDirectVideoUrl(trimmed)) {
    return {
      platform: 'direct',
      platformLabel: isPortrait ? 'Video Potret (MP4)' : 'Video Langsung (MP4)',
      videoId: null,
      embedUrl: trimmed,
      thumbnailUrl: customThumbnail && customThumbnail.trim() ? customThumbnail.trim() : 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
      isDirectVideo: true,
      isValid: true,
      originalUrl: trimmed,
      isPortrait: isPortrait,
      defaultAspectRatio: defaultAspect,
      aspectRatio: effectiveAspect,
    };
  }

  // 7. General Web Video / Other
  const isValidUrl = Boolean(trimmed.startsWith('http://') || trimmed.startsWith('https://'));
  return {
    platform: 'other',
    platformLabel: isPortrait ? 'Video Web Potret' : 'Video Web',
    videoId: null,
    embedUrl: isValidUrl ? trimmed : null,
    thumbnailUrl: customThumbnail && customThumbnail.trim() ? customThumbnail.trim() : 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
    isDirectVideo: false,
    isValid: isValidUrl,
    originalUrl: trimmed,
    isPortrait: isPortrait,
    defaultAspectRatio: defaultAspect,
    aspectRatio: effectiveAspect,
  };
}
