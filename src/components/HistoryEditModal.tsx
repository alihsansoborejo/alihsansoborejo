import React, { useState, useEffect } from 'react';
import {
  X,
  History,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  FileText,
  List,
  Eye,
} from 'lucide-react';
import { useDataContext } from '../context/DataContext';

interface HistoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_HISTORY_REF = [
  "Lembaga Pendidikan Satu Atap MI Ma'arif Al Ihsan Soborejo dan RA Al Ihsan Soborejo didirikan atas prakarsa para tokoh agama, alim ulama, dan sesepuh masyarakat Desa Soborejo, Kecamatan Pringsurat, Kabupaten Temanggung, yang mendambakan hadirnya sarana pendidikan Islam terpadu yang kokoh di tengah masyarakat.",
  "Bermula dari komitmen membina anak-anak sejak usia dini di Raudhatul Athfal (RA Al Ihsan) dengan stimulasi adab dan kegembiraan belajar, kemudian dilanjutkan secara berkesinambungan di Madrasah Ibtidaiyah (MI Ma'arif Al Ihsan) tanpa perlu cemas menghadapi adaptasi lingkungan sekolah yang baru.",
  "Berakar dari cita-cita luhur mencetak generasi yang tidak hanya mahir membaca dan berhitung, tetapi juga tekun dalam sholat, gemar menghafal Al-Qur'an, berbakti kepada orang tua, serta berpegang teguh pada aqidah Ahlussunnah wal Jama'ah An-Nahdliyyah.",
  "Kini, lembaga satu atap ini terus bertumbuh dengan sarana belajar representatif yang ramah anak, program tahfidz terpadu, pembinaan seni rebana hadroh, serta pelayanan PPDB terpadu satu pintu untuk jenjang RA dan MI."
];

export const HistoryEditModal: React.FC<HistoryEditModalProps> = ({ isOpen, onClose }) => {
  const { schoolProfile, updateSchoolProfile, pushAllToCloud } = useDataContext();

  const [historyItems, setHistoryItems] = useState<string[]>([]);
  const [editMode, setEditMode] = useState<'paragraphs' | 'rawText'>('paragraphs');
  const [rawText, setRawText] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Synchronize on open or change
  useEffect(() => {
    if (isOpen) {
      const items = schoolProfile.history && schoolProfile.history.length > 0
        ? [...schoolProfile.history]
        : [...DEFAULT_HISTORY_REF];
      setHistoryItems(items);
      setRawText(items.join('\n\n'));
      setSavedSuccess(false);
    }
  }, [isOpen, schoolProfile.history]);

  if (!isOpen) return null;

  const handleParagraphChange = (index: number, val: string) => {
    const updated = [...historyItems];
    updated[index] = val;
    setHistoryItems(updated);
    setRawText(updated.join('\n\n'));
  };

  const handleAddParagraph = () => {
    const updated = [...historyItems, ''];
    setHistoryItems(updated);
    setRawText(updated.join('\n\n'));
  };

  const handleDeleteParagraph = (index: number) => {
    if (historyItems.length <= 1) {
      const updated = [''];
      setHistoryItems(updated);
      setRawText('');
      return;
    }
    const updated = historyItems.filter((_, i) => i !== index);
    setHistoryItems(updated);
    setRawText(updated.join('\n\n'));
  };

  const handleMoveParagraph = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= historyItems.length) return;

    const updated = [...historyItems];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setHistoryItems(updated);
    setRawText(updated.join('\n\n'));
  };

  const handleRawTextChange = (val: string) => {
    setRawText(val);
    const parsed = val
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    setHistoryItems(parsed.length > 0 ? parsed : ['']);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Muat ulang teks sejarah referensi asli pendirian Soborejo? Teks saat ini akan digantikan.')) {
      setHistoryItems([...DEFAULT_HISTORY_REF]);
      setRawText(DEFAULT_HISTORY_REF.join('\n\n'));
    }
  };

  const handleSave = async () => {
    // Filter out empty items
    const cleanItems = (editMode === 'rawText'
      ? rawText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
      : historyItems.map((p) => p.trim()).filter(Boolean));

    const finalItems = cleanItems.length > 0 ? cleanItems : DEFAULT_HISTORY_REF;

    updateSchoolProfile({
      history: finalItems,
    });

    if (pushAllToCloud) {
      try {
        await pushAllToCloud();
      } catch (err) {
        console.warn('Cloud sync skipped or offline:', err);
      }
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#d4af37]/40 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Header */}
        <div className="bg-gradient-to-r from-[#072217] via-[#0b3c26] to-[#072217] text-white p-5 sm:p-6 rounded-t-3xl relative overflow-hidden border-b border-[#d4af37]/30">
          <div className="absolute top-0 right-0 w-60 h-60 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-sm">
                <History className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] block">
                  MANAJEMEN KONTEN PROFIL
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-white leading-tight">
                  Ubah Teks Sejarah Singkat Madrasah
                </h3>
              </div>
            </div>

            <button
              id="btn-close-history-modal"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all"
              title="Tutup Jendela"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Controls Bar */}
        <div className="p-4 sm:px-6 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Mode Switch */}
          <div className="flex items-center gap-1.5 bg-gray-200/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setEditMode('paragraphs');
                setRawText(historyItems.join('\n\n'));
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                editMode === 'paragraphs'
                  ? 'bg-white text-[#0b3c26] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Per Paragraf ({historyItems.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEditMode('rawText');
                setRawText(historyItems.join('\n\n'));
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                editMode === 'rawText'
                  ? 'bg-white text-[#0b3c26] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Editor Teks Utuh</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium border transition-all ${
                showPreview
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
              title="Tampilkan / Sembunyikan Pratinjau Tampilan"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPreview ? 'Sembunyikan Pratinjau' : 'Tampilkan Pratinjau'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 transition-all"
              title="Muat teks narasi sejarah default"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              <span>Muat Teks Asli</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Teks sejarah singkat berhasil disimpan dan diperbarui di halaman profil!</span>
            </div>
          )}

          {/* Notification Info */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Petunjuk Pengisian Sejarah Singkat:</p>
              <p className="text-amber-800/90 mt-0.5 leading-relaxed">
                Tuliskan kronologi pendirian madrasah, latar belakang nama Al Ihsan, prakarsa sesepuh/ulama Desa Soborejo, fase penggabungan Satu Atap bersama RA Al Ihsan, hingga perkembangan sarana dan prestasi masa kini.
              </p>
            </div>
          </div>

          {/* EDIT MODE: Per Paragraf */}
          {editMode === 'paragraphs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Daftar Paragraf / Milestone Sejarah ({historyItems.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddParagraph}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b3c26] text-[#f3e5ab] text-xs font-bold hover:bg-[#072217] transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Paragraf Baru</span>
                </button>
              </div>

              <div className="space-y-3.5">
                {historyItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:border-emerald-300 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#0b3c26] text-white text-[11px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-gray-700">
                          Paragraf #{idx + 1}
                        </span>
                      </div>

                      {/* Reorder and Delete Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveParagraph(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Geser ke atas"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveParagraph(idx, 'down')}
                          disabled={idx === historyItems.length - 1}
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Geser ke bawah"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteParagraph(idx)}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                          title="Hapus paragraf ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      value={item}
                      onChange={(e) => handleParagraphChange(idx, e.target.value)}
                      placeholder={`Tuliskan uraian sejarah untuk paragraf #${idx + 1}...`}
                      className="w-full p-3 text-xs sm:text-sm text-gray-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0b3c26] focus:border-transparent leading-relaxed"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleAddParagraph}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-dashed border-[#0b3c26]/40 hover:border-[#0b3c26] text-[#0b3c26] text-xs font-bold hover:bg-emerald-50 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Paragraf Sejarah Berikutnya</span>
                </button>
              </div>
            </div>
          )}

          {/* EDIT MODE: Raw Full Textarea */}
          {editMode === 'rawText' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Narasi Sejarah Utuh (Pisahkan tiap paragraf dengan Enter 2 kali)
                </label>
                <span className="text-[11px] text-gray-500">
                  {rawText.split(/\n\s*\n/).filter(Boolean).length} Paragraf terdeteksi
                </span>
              </div>
              <textarea
                rows={12}
                value={rawText}
                onChange={(e) => handleRawTextChange(e.target.value)}
                placeholder="Tuliskan narasi lengkap sejarah madrasah di sini. Beri baris kosong antar paragraf..."
                className="w-full p-4 text-xs sm:text-sm text-gray-800 font-body border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#0b3c26] focus:border-transparent leading-relaxed"
              />
              <p className="text-[11px] text-gray-500 italic">
                Tips: Setiap kali Anda menekan Enter dua kali (membuat baris kosong), sistem secara otomatis membaginya menjadi kartu butir sejarah tersendiri.
              </p>
            </div>
          )}

          {/* Live Preview (Exact Frontpage Styling) */}
          {showPreview && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span className="text-xs uppercase font-bold tracking-wider text-gray-700">
                  Pratinjau Langsung Tampilan Halaman Depan:
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#072217] via-[#0b3c26] to-[#072217] border border-[#d4af37]/30 shadow-inner space-y-4 text-white">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
                    JEJAK LANGKAH &amp; KIPRAH
                  </span>
                  <h4 className="font-heading text-lg sm:text-xl text-white font-bold mt-0.5">
                    Sejarah Singkat MI Ma'arif Al Ihsan Soborejo
                  </h4>
                  <p className="text-[11px] text-emerald-200">
                    Berdiri di Desa Soborejo, Kecamatan Pringsurat, Kabupaten Temanggung, Jawa Tengah.
                  </p>
                </div>

                <div className="space-y-3 font-body text-xs sm:text-sm text-white leading-relaxed">
                  {historyItems.filter(Boolean).map((hist, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3.5 bg-[#052317]/90 p-3.5 sm:p-4 rounded-2xl border border-emerald-500/30 shadow-md"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] shrink-0 mt-1.5 shadow-sm" />
                      <p className="text-white text-xs sm:text-sm leading-relaxed">{hist}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-all"
            >
              Batal
            </button>

            <button
              type="button"
              id="btn-save-history-content"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0b3c26] to-[#072217] hover:from-[#d4af37] hover:to-[#c59e2b] text-[#f3e5ab] hover:text-[#072217] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Sejarah</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
