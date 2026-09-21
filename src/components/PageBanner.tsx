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
    <div className="relative bg-gradient-to-r from-[#041a11] via-[#072217] to-[#0b3c26] text-white py-12 sm:py-16 px-4 sm:px-8 border-b-2 border-[#d4af37]/40 overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Breadcrumb & Quick Return */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/70">
            <button
              type="button"
              onClick={onGoHome}
              className="inline-flex items-center gap-1.5 hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Beranda</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[#f3e5ab] font-medium">{title}</span>
          </nav>

          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-1.5 text-xs text-[#f3e5ab] hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full border border-white/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>

        {/* Content Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3e5ab] text-xs font-semibold tracking-wider uppercase mb-3">
              <span className="text-[#d4af37]">{icon}</span>
              <span>{badge}</span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="font-body text-xs sm:text-sm text-white/80 mt-2.5 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Action buttons on the right side if provided */}
          {actions && (
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
