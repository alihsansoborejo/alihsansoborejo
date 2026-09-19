import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ShareItemData } from '../types';
import { parseDeepLink, ParsedDeepLink } from '../lib/shareUtils';
import { ShareModal } from '../components/ShareModal';

interface ShareContextType {
  shareItem: ShareItemData | null;
  isShareOpen: boolean;
  openShare: (data: ShareItemData) => void;
  closeShare: () => void;
  activeDeepLink: ParsedDeepLink | null;
  consumeDeepLink: () => void;
}

const ShareContext = createContext<ShareContextType | undefined>(undefined);

export const ShareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shareItem, setShareItem] = useState<ShareItemData | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeDeepLink, setActiveDeepLink] = useState<ParsedDeepLink | null>(null);

  // Check URL on initial mount and hashchange
  const evaluateDeepLink = useCallback(() => {
    const parsed = parseDeepLink();
    if (parsed) {
      setActiveDeepLink(parsed);

      // Smooth scroll to target section if element exists
      if (parsed.sectionId) {
        setTimeout(() => {
          const el = document.getElementById(parsed.sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      }
    }
  }, []);

  useEffect(() => {
    evaluateDeepLink();

    const handleHashChange = () => {
      evaluateDeepLink();
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [evaluateDeepLink]);

  const openShare = useCallback((data: ShareItemData) => {
    setShareItem(data);
    setIsShareOpen(true);
  }, []);

  const closeShare = useCallback(() => {
    setIsShareOpen(false);
  }, []);

  const consumeDeepLink = useCallback(() => {
    setActiveDeepLink(null);
  }, []);

  return (
    <ShareContext.Provider
      value={{
        shareItem,
        isShareOpen,
        openShare,
        closeShare,
        activeDeepLink,
        consumeDeepLink,
      }}
    >
      {children}
      <ShareModal
        isOpen={isShareOpen}
        item={shareItem}
        onClose={closeShare}
      />
    </ShareContext.Provider>
  );
};

export function useShare(): ShareContextType {
  const context = useContext(ShareContext);
  if (!context) {
    throw new Error('useShare must be used within a ShareProvider');
  }
  return context;
}
