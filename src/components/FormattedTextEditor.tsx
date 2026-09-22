import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  List,
  ListOrdered,
  Quote,
  Smile,
  Sparkles,
  Eye,
  Edit3,
  HelpCircle,
  X,
  Check,
  Search,
  Trophy,
  Award,
  Medal,
  BookOpen,
  GraduationCap,
  Calendar,
  MapPin,
  Heart,
  CheckCircle2,
  Star,
  Clock,
  Shield,
  Target,
  Flame,
  Users,
  School,
  Phone,
  Mail,
  Globe,
  Music
} from 'lucide-react';
import { FormattedText } from './FormattedText';

export interface FormattedTextEditorProps {
  id?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  helperText?: string;
  className?: string;
  minHeight?: string;
  required?: boolean;
}

// Curated Emojis for Madrasah & School Content
const EMOJI_CATEGORIES = [
  {
    name: 'Madrasah & Islami',
    icon: '🕌',
    emojis: ['🕌', '📖', '🤲', '🌙', '🕋', '📿', '✨', '🌿', '🟢', '🤍', '💚', '⭐️', '🌸', '🕊️']
  },
  {
    name: 'Prestasi & Juara',
    icon: '🏆',
    emojis: ['🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎯', '🌟', '⭐', '👑', '👏', '🎉', '🎊', '🚩']
  },
  {
    name: 'Belajar & Sekolah',
    icon: '📚',
    emojis: ['📚', '✏️', '📝', '🎓', '🏫', '🎒', '🎨', '🔬', '💻', '📌', '📋', '📐', '🧪', '💡']
  },
  {
    name: 'Ekskul & Kegiatan',
    icon: '⚽',
    emojis: ['⚽', '🏸', '🥋', '⛺', '🥁', '🎺', '🏃', '🧗', '🏹', '🏊', '🎪', '🎤', '🏕️', '🎯']
  },
  {
    name: 'Ekspresi & Reaksi',
    icon: '😊',
    emojis: ['😊', '👍', '❤️', '🤝', '📢', '📅', '📍', '📞', '✉️', '✅', 'ℹ️', '🔔', '💬', '🙌']
  }
];

// Curated Icons
const POPULAR_ICONS = [
  { key: 'Trophy', label: 'Piala', icon: Trophy },
  { key: 'Award', label: 'Penghargaan', icon: Award },
  { key: 'Medal', label: 'Medali', icon: Medal },
  { key: 'Sparkles', label: 'Unggulan', icon: Sparkles },
  { key: 'BookOpen', label: 'Al-Qur\'an/Buku', icon: BookOpen },
  { key: 'GraduationCap', label: 'Wisuda', icon: GraduationCap },
  { key: 'Calendar', label: 'Jadwal', icon: Calendar },
  { key: 'MapPin', label: 'Lokasi', icon: MapPin },
  { key: 'Star', label: 'Bintang', icon: Star },
  { key: 'CheckCircle', label: 'Centang', icon: CheckCircle2 },
  { key: 'Clock', label: 'Waktu', icon: Clock },
  { key: 'Shield', label: 'Keamanan', icon: Shield },
  { key: 'Target', label: 'Target', icon: Target },
  { key: 'Flame', label: 'Semangat', icon: Flame },
  { key: 'Users', label: 'Santri/Guru', icon: Users },
  { key: 'School', label: 'Madrasah', icon: School },
  { key: 'Heart', label: 'Karakter/Kasih', icon: Heart },
  { key: 'Phone', label: 'Kontak', icon: Phone },
  { key: 'Mail', label: 'Surat', icon: Mail },
  { key: 'Globe', label: 'Website', icon: Globe },
  { key: 'Music', label: 'Rebana/Seni', icon: Music },
];

export const FormattedTextEditor: React.FC<FormattedTextEditorProps> = ({
  id,
  value,
  onChange,
  placeholder = 'Ketik narasi di sini...',
  rows = 5,
  label,
  helperText,
  className = '',
  minHeight = '140px',
  required = false,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState('');
  const [showHelpGuide, setShowHelpGuide] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const iconPickerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (iconPickerRef.current && !iconPickerRef.current.contains(e.target as Node)) {
        setShowIconPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Insert or wrap text at the current cursor/selection
  const wrapSelection = (prefix: string, suffix: string = prefix, defaultPlaceholder = 'teks') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const currentVal = value || '';

    const selected = currentVal.substring(start, end);
    const contentToWrap = selected.length > 0 ? selected : defaultPlaceholder;

    const newVal = currentVal.substring(0, start) + prefix + contentToWrap + suffix + currentVal.substring(end);
    onChange(newVal);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      if (selected.length > 0) {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + contentToWrap.length);
      } else {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + contentToWrap.length);
      }
    }, 10);
  };

  // Insert prefix on each line or at line start
  const insertLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const currentVal = value || '';

    // Find the start of the current line
    const lastNewline = currentVal.lastIndexOf('\n', start - 1);
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

    const newVal = currentVal.substring(0, lineStart) + prefix + currentVal.substring(lineStart);
    onChange(newVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 10);
  };

  // Insert raw text/emoji/icon at cursor position
  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange((value || '') + text);
      return;
    }

    const start = textarea.selectionStart ?? (value || '').length;
    const end = textarea.selectionEnd ?? (value || '').length;
    const currentVal = value || '';

    const newVal = currentVal.substring(0, start) + text + currentVal.substring(end);
    onChange(newVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 10);
  };

  // Keyboard shortcuts (Ctrl/Cmd + B, I, U)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    if (modifier) {
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        wrapSelection('**', '**', 'teks tebal');
      } else if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        wrapSelection('*', '*', 'teks miring');
      } else if (e.key.toLowerCase() === 'u') {
        e.preventDefault();
        wrapSelection('<u>', '</u>', 'teks garis bawah');
      }
    }
  };

  // Filter emojis based on search
  const filteredEmojiCategories = EMOJI_CATEGORIES.map((cat) => {
    if (!emojiSearch.trim()) return cat;
    const s = emojiSearch.toLowerCase();
    const matched = cat.emojis.filter(() => cat.name.toLowerCase().includes(s) || cat.icon.includes(s));
    return { ...cat, emojis: matched.length > 0 ? matched : cat.emojis };
  });

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {label && (
          <label htmlFor={id} className="block text-xs font-bold text-gray-700">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}

        <div className="flex items-center gap-1 ml-auto">
          {/* View Mode Buttons */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-white text-[#0b3c26] shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Edit3 className="w-3 h-3 text-[#0b3c26]" />
              <span>Tulis</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white text-[#0b3c26] shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-3 h-3 text-[#d4af37]" />
              <span>Pratinjau Hasil</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowHelpGuide(!showHelpGuide)}
            className="p-1 rounded-lg text-gray-400 hover:text-[#0b3c26] hover:bg-gray-100 transition-colors cursor-pointer"
            title="Panduan Format Teks & Pintasan"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Box */}
      <div className="bg-white rounded-xl border border-gray-300 focus-within:border-[#0b3c26] focus-within:ring-2 focus-within:ring-[#0b3c26]/20 shadow-2xs transition-all overflow-hidden relative">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-1.5 bg-gray-50/90 border-b border-gray-200 flex-wrap relative z-10 text-xs">
          {/* Bold */}
          <button
            type="button"
            onClick={() => wrapSelection('**', '**', 'teks tebal')}
            className="p-1.5 rounded hover:bg-white hover:shadow-2xs text-gray-700 hover:text-[#0b3c26] transition-all cursor-pointer font-bold"
            title="Tebal (Bold) - Ctrl+B"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => wrapSelection('*', '*', 'teks miring')}
            className="p-1.5 rounded hover:bg-white hover:shadow-2xs text-gray-700 hover:text-[#0b3c26] transition-all cursor-pointer"
            title="Miring (Italic) - Ctrl+I"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => wrapSelection('<u>', '</u>', 'teks garis bawah')}
            className="p-1.5 rounded hover:bg-white hover:shadow-2xs text-gray-700 hover:text-[#0b3c26] transition-all cursor-pointer"
            title="Garis Bawah (Underline) - Ctrl+U"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onClick={() => wrapSelection('~~', '~~', 'teks dicoret')}
            className="p-1.5 rounded hover:bg-white hover:shadow-2xs text-gray-700 hover:text-[#0b3c26] transition-all cursor-pointer"
            title="Coret (Strikethrough)"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          {/* Highlight */}
          <button
            type="button"
            onClick={() => wrapSelection('==', '==', 'teks disorot')}
            className="p-1.5 rounded hover:bg-white hover:shadow-2xs text-gray-700 hover:text-[#d4af37] transition-all cursor-pointer"
            title="Sorot Kuning (Highlight)"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-gray-300 mx-0.5" />

          {/* Bullet List */}
          <button
            type="button"
            onClick={() => insertLinePrefix('• ')}
            className="p-1.5 rounded hover:bg-white hover:shadow-2xs text-gray-700 hover:text-[#0b3c26] transition-all cursor-pointer"
            title="Daftar Butir (Bullet)"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          {/* Numbered List */}
          <button
            type="button"
            onClick={() => insertLinePrefix('1. ')}
            className="p-1.5 rounded hover:bg-white hover:shadow-2xs text-gray-700 hover:text-[#0b3c26] transition-all cursor-pointer"
            title="Daftar Angka (Numbered)"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          {/* Quote */}
          <button
            type="button"
            onClick={() => insertLinePrefix('> ')}
            className="p-1.5 rounded hover:bg-white hover:shadow-2xs text-gray-700 hover:text-[#0b3c26] transition-all cursor-pointer"
            title="Kutipan (Quote)"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-gray-300 mx-0.5" />

          {/* Emoji Picker Button */}
          <div className="relative" ref={emojiPickerRef}>
            <button
              type="button"
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowIconPicker(false);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                showEmojiPicker
                  ? 'bg-[#0b3c26] text-[#f3e5ab]'
                  : 'hover:bg-white text-gray-700 hover:text-[#0b3c26]'
              }`}
              title="Sisipkan Emoji"
            >
              <Smile className="w-3.5 h-3.5 text-amber-500" />
              <span>Emoji</span>
            </button>

            {/* Emoji Dropdown Popover */}
            {showEmojiPicker && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-amber-500" />
                    Pilih Emoji Madrasah &amp; Konten
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(false)}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* Emoji Search */}
                <div className="relative mb-2">
                  <Search className="w-3 h-3 text-gray-400 absolute left-2 top-2" />
                  <input
                    type="text"
                    value={emojiSearch}
                    onChange={(e) => setEmojiSearch(e.target.value)}
                    placeholder="Cari kategori emoji..."
                    className="w-full pl-7 pr-2 py-1 text-[11px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0b3c26]"
                  />
                </div>

                {/* Emoji Grid */}
                <div className="max-h-52 overflow-y-auto space-y-2.5 pr-1 text-base">
                  {filteredEmojiCategories.map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        {cat.icon} {cat.name}
                      </span>
                      <div className="grid grid-cols-7 gap-1">
                        {cat.emojis.map((emoji, eIdx) => (
                          <button
                            key={eIdx}
                            type="button"
                            onClick={() => {
                              insertAtCursor(emoji + ' ');
                              setShowEmojiPicker(false);
                            }}
                            className="w-8 h-8 rounded-lg hover:bg-amber-50 hover:scale-120 transition-transform flex items-center justify-center cursor-pointer text-lg select-none"
                            title={emoji}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Icon Picker Button */}
          <div className="relative" ref={iconPickerRef}>
            <button
              type="button"
              onClick={() => {
                setShowIconPicker(!showIconPicker);
                setShowEmojiPicker(false);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                showIconPicker
                  ? 'bg-[#0b3c26] text-[#f3e5ab]'
                  : 'hover:bg-white text-gray-700 hover:text-[#0b3c26]'
              }`}
              title="Sisipkan Ikon Grafis"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Ikon</span>
            </button>

            {/* Icon Dropdown Popover */}
            {showIconPicker && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                    Pilih Ikon Madrasah Soborejo
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowIconPicker(false)}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-[10px] text-gray-500 mb-2">
                  Klik ikon untuk menyisipkan kode ikon. Ikon akan otomatis tampil grafis indah pada website.
                </p>

                <div className="grid grid-cols-4 gap-1.5 max-h-56 overflow-y-auto pr-1">
                  {POPULAR_ICONS.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          insertAtCursor(`[icon:${item.key}] `);
                          setShowIconPicker(false);
                        }}
                        className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-100 hover:border-[#0b3c26] hover:bg-emerald-50/60 transition-all cursor-pointer group text-center"
                        title={item.label}
                      >
                        <IconComp className="w-4 h-4 text-[#0b3c26] group-hover:scale-110 transition-transform mb-1" />
                        <span className="text-[9px] text-gray-600 group-hover:text-[#0b3c26] font-medium truncate w-full">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Formatting Help Guide Banner */}
        {showHelpGuide && (
          <div className="bg-emerald-50/80 p-3 border-b border-emerald-100 text-[11px] text-emerald-950 flex items-start justify-between gap-3 animate-in fade-in duration-150">
            <div className="space-y-1">
              <span className="font-bold flex items-center gap-1 text-[#0b3c26]">
                <HelpCircle className="w-3.5 h-3.5" /> Panduan Format Cepat:
              </span>
              <p>
                • <strong>Tebal:</strong> <code className="bg-white px-1 py-0.5 rounded text-[10px]">**teks**</code> atau tombol <strong>B</strong> (Ctrl+B)
              </p>
              <p>
                • <em>Miring:</em> <code className="bg-white px-1 py-0.5 rounded text-[10px]">*teks*</code> atau tombol <em>I</em> (Ctrl+I)
              </p>
              <p>
                • <u>Garis Bawah:</u> <code className="bg-white px-1 py-0.5 rounded text-[10px]">&lt;u&gt;teks&lt;/u&gt;</code> atau tombol <u>U</u> (Ctrl+U)
              </p>
              <p>
                • Sorot: <code className="bg-white px-1 py-0.5 rounded text-[10px]">==teks==</code> | Paragraf baru: tekan <strong>Enter 2x</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowHelpGuide(false)}
              className="text-emerald-700 hover:text-emerald-950 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Area: Either Textarea or Live Preview */}
        {activeTab === 'edit' ? (
          <textarea
            ref={textareaRef}
            id={id}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            required={required}
            style={{ minHeight }}
            className="w-full p-3 text-xs sm:text-sm text-gray-800 focus:outline-none leading-relaxed font-sans resize-y block border-0"
          />
        ) : (
          <div
            style={{ minHeight }}
            className="p-4 bg-gray-50/50 text-xs sm:text-sm text-gray-800 overflow-y-auto leading-relaxed"
          >
            {value && value.trim().length > 0 ? (
              <div className="prose prose-sm max-w-none">
                <FormattedText text={value} />
              </div>
            ) : (
              <p className="text-gray-400 italic text-xs">
                (Belum ada teks. Klik tab "Tulis" untuk memasukkan konten)
              </p>
            )}
          </div>
        )}

        {/* Footer Stats / Quick Info */}
        <div className="px-3 py-1.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center gap-2">
            <span>
              {(value || '').trim() ? (value || '').trim().split(/\s+/).length : 0} kata
            </span>
            <span>•</span>
            <span>{(value || '').length} karakter</span>
            <span>•</span>
            <span>
              {(value || '').split(/\n\s*\n/).filter((p) => p.trim()).length || ((value || '').trim() ? 1 : 0)} paragraf
            </span>
          </div>

          <span className="hidden sm:inline text-gray-400">
            Mendukung Bold, Italic, Underline, Emoji &amp; Ikon
          </span>
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] text-gray-500 leading-tight">
          {helperText}
        </p>
      )}
    </div>
  );
};
