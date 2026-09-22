import React from 'react';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { NavigationTab } from '../types';

interface PageBannerProps {
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
  activeTab: NavigationTab;
  onGoHome: () => void;
  actions?: React.ReactNode;
}

export const PageBanner: React.FC<PageBannerProps> = ({
  title,
  subtitle,
  badge,
  icon,
  onGoHome,
  actions,
}) => {
  return (
    <div className="relative bg-gradient-to-r from-[#041a11] via-[#072217] to-[#0b3c26] text-white py-3.5 sm:py-4 px-4 sm:px-8 border-b border-[#d4af37]/30 overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Breadcrumb & Quick Return */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-white/70">
            <button
              type="button"
              onClick={onGoHome}
              className="inline-flex items-center gap-1 hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              <Home className="w-3 h-3 text-[#d4af37]" />
              <span>Beranda</span>
            </button>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <span className="text-[#f3e5ab] font-medium">{title}</span>
          </nav>

          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-1.5 text-[11px] text-[#f3e5ab] hover:text-white bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-full border border-white/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3 text-[#d4af37]" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>

        {/* Content Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mb-1">
              <span className="text-[#d4af37]">{icon}</span>
              <span>{badge}</span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="font-body text-xs sm:text-xs text-white/80 mt-0.5 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Action buttons on the right side if provided */}
          {actions && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
