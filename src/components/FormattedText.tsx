import React from 'react';
import {
  Trophy,
  Award,
  Medal,
  Sparkles,
  BookOpen,
  GraduationCap,
  Calendar,
  MapPin,
  Heart,
  CheckCircle2,
  Check,
  Star,
  Clock,
  Shield,
  Target,
  Flame,
  Users,
  Building,
  School,
  Phone,
  Mail,
  Globe,
  Compass,
  Music,
  Activity,
  Lightbulb,
  Bell,
  Info
} from 'lucide-react';

interface FormattedTextProps {
  text?: string | null;
  className?: string;
  asParagraphs?: boolean;
}

// Map of supported icon names to Lucide icons
const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  trophy: Trophy,
  award: Award,
  medal: Medal,
  sparkles: Sparkles,
  book: BookOpen,
  bookopen: BookOpen,
  graduationcap: GraduationCap,
  calendar: Calendar,
  mappin: MapPin,
  heart: Heart,
  check: Check,
  checkcircle: CheckCircle2,
  star: Star,
  clock: Clock,
  shield: Shield,
  target: Target,
  flame: Flame,
  users: Users,
  building: Building,
  school: School,
  phone: Phone,
  mail: Mail,
  globe: Globe,
  compass: Compass,
  music: Music,
  activity: Activity,
  lightbulb: Lightbulb,
  bell: Bell,
  info: Info,
};

/**
 * Parses inline formatting:
 * - **bold** or <b>bold</b> or <strong>bold</strong>
 * - *italic* or _italic_ or <i>italic</i> or <em>italic</em>
 * - <u>underline</u> or __underline__
 * - ~~strikethrough~~ or <del>strikethrough</del>
 * - ==highlight== or <mark>highlight</mark>
 * - [icon:IconName]
 */
function parseInline(line: string): React.ReactNode[] {
  if (!line) return [];

  // Regex to match inline tokens
  // Matches:
  // 1. [icon:Name]
  // 2. <u>...</u> or __...__
  // 3. **...** or <b>...</b> or <strong>...</strong>
  // 4. *...* or <i>...</i> or <em>...</em> or _..._
  // 5. ~~...~~ or <del>...</del>
  // 6. ==...== or <mark>...</mark>
  const tokenRegex = /(\[icon:[a-zA-Z0-9_-]+\]|<u>[\s\S]*?<\/u>|__[\s\S]*?__|<b>[\s\S]*?<\/b>|<strong>[\s\S]*?<\/strong>|\*\*[\s\S]*?\*\*|<i>[\s\S]*?<\/i>|<em>[\s\S]*?<\/em>|\*[\s\S]*?\*|_[\s\S]*?_|~~[\s\S]*?~~|<del>[\s\S]*?<\/del>|==[\s\S]*?==|<mark>[\s\S]*?<\/mark>)/gi;

  const parts = line.split(tokenRegex);
  const result: React.ReactNode[] = [];

  parts.forEach((part, index) => {
    if (!part) return;

    // Check [icon:Name]
    const iconMatch = part.match(/^\[icon:([a-zA-Z0-9_-]+)\]$/i);
    if (iconMatch) {
      const iconKey = iconMatch[1].toLowerCase();
      const IconComponent = ICON_MAP[iconKey];
      if (IconComponent) {
        result.push(
          <span key={`icon-${index}`} className="inline-flex items-center align-middle mx-1 text-[#d4af37]">
            <IconComponent className="w-4 h-4 inline-block" />
          </span>
        );
        return;
      }
    }

    // Check Underline: <u>...</u> or __...__
    if ((part.startsWith('<u>') && part.endsWith('</u>')) || (part.startsWith('__') && part.endsWith('__') && part.length >= 4)) {
      const inner = part.startsWith('<u>') ? part.slice(3, -4) : part.slice(2, -2);
      result.push(
        <span key={`u-${index}`} className="underline decoration-[#d4af37] decoration-2 underline-offset-2 font-medium">
          {parseInline(inner)}
        </span>
      );
      return;
    }

    // Check Bold: **...** or <b>...</b> or <strong>...</strong>
    if (
      (part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
      (part.startsWith('<b>') && part.endsWith('</b>')) ||
      (part.startsWith('<strong>') && part.endsWith('</strong>'))
    ) {
      let inner = part;
      if (part.startsWith('**')) inner = part.slice(2, -2);
      else if (part.startsWith('<b>')) inner = part.slice(3, -4);
      else if (part.startsWith('<strong>')) inner = part.slice(8, -9);

      result.push(
        <strong key={`b-${index}`} className="font-bold text-inherit">
          {parseInline(inner)}
        </strong>
      );
      return;
    }

    // Check Italic: *...* or <i>...</i> or <em>...</em> or _..._
    if (
      (part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
      (part.startsWith('_') && part.endsWith('_') && part.length >= 2) ||
      (part.startsWith('<i>') && part.endsWith('</i>')) ||
      (part.startsWith('<em>') && part.endsWith('</em>'))
    ) {
      let inner = part;
      if (part.startsWith('*')) inner = part.slice(1, -1);
      else if (part.startsWith('_')) inner = part.slice(1, -1);
      else if (part.startsWith('<i>')) inner = part.slice(3, -4);
      else if (part.startsWith('<em>')) inner = part.slice(4, -5);

      result.push(
        <em key={`i-${index}`} className="italic text-inherit">
          {parseInline(inner)}
        </em>
      );
      return;
    }

    // Check Strikethrough: ~~...~~ or <del>...</del>
    if (
      (part.startsWith('~~') && part.endsWith('~~') && part.length >= 4) ||
      (part.startsWith('<del>') && part.endsWith('</del>'))
    ) {
      const inner = part.startsWith('~~') ? part.slice(2, -2) : part.slice(5, -6);
      result.push(
        <del key={`del-${index}`} className="line-through opacity-75">
          {parseInline(inner)}
        </del>
      );
      return;
    }

    // Check Highlight: ==...== or <mark>...</mark>
    if (
      (part.startsWith('==') && part.endsWith('==') && part.length >= 4) ||
      (part.startsWith('<mark>') && part.endsWith('</mark>'))
    ) {
      const inner = part.startsWith('==') ? part.slice(2, -2) : part.slice(6, -7);
      result.push(
        <mark key={`mark-${index}`} className="bg-amber-100/90 text-amber-950 px-1 py-0.5 rounded border border-amber-300/60 font-semibold">
          {parseInline(inner)}
        </mark>
      );
      return;
    }

    // Plain text
    result.push(part);
  });

  return result;
}

export const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  className = '',
  asParagraphs = true,
}) => {
  if (!text) return null;

  // If text is not containing any formatting syntax or newlines, render directly
  const hasFormatting = /[\*_~<=\[]|\n/.test(text);

  if (!hasFormatting) {
    return <span className={className}>{text}</span>;
  }

  // Split by double newlines or single newlines for block processing
  const paragraphs = text
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return null;
  }

  if (!asParagraphs || paragraphs.length === 1) {
    return (
      <span className={className}>
        {paragraphs.map((para, pIdx) => {
          const lines = para.split(/\r?\n/);
          return (
            <React.Fragment key={pIdx}>
              {pIdx > 0 && <span className="block my-2" />}
              {lines.map((line, lIdx) => {
                // Check if line is bullet list
                const isBullet = /^[-*•]\s+/.test(line);
                const cleanLine = isBullet ? line.replace(/^[-*•]\s+/, '') : line;

                return (
                  <React.Fragment key={lIdx}>
                    {lIdx > 0 && <br />}
                    {isBullet ? (
                      <span className="inline-flex items-start gap-1.5 pl-2">
                        <span className="text-[#d4af37] font-bold select-none">•</span>
                        <span>{parseInline(cleanLine)}</span>
                      </span>
                    ) : (
                      parseInline(line)
                    )}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        })}
      </span>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {paragraphs.map((para, pIdx) => {
        const lines = para.split(/\r?\n/);
        return (
          <p key={pIdx} className="leading-relaxed">
            {lines.map((line, lIdx) => {
              const isBullet = /^[-*•]\s+/.test(line);
              const cleanLine = isBullet ? line.replace(/^[-*•]\s+/, '') : line;

              return (
                <React.Fragment key={lIdx}>
                  {lIdx > 0 && <br />}
                  {isBullet ? (
                    <span className="inline-flex items-start gap-1.5 pl-2">
                      <span className="text-[#d4af37] font-bold select-none">•</span>
                      <span>{parseInline(cleanLine)}</span>
                    </span>
                  ) : (
                    parseInline(line)
                  )}
                </React.Fragment>
              );
            })}
          </p>
        );
      })}
    </div>
  );
};
