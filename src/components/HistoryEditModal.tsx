import React, { useState, useEffect } from 'react';
import {
  X,
  History,
  Save,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Eye,
  FileText,
} from 'lucide-react';
import { useDataContext } from '../context/DataContext';
import { FormattedTextEditor } from './FormattedTextEditor';
import { FormattedText } from './FormattedText';

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

  const [rawText, setRawText] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Synchronize on open
  useEffect(() => {
    if (isOpen) {
      const items = schoolProfile.history && schoolProfile.history.length > 0
        ? schoolProfile.history
        : DEFAULT_HISTORY_REF;
      setRawText(items.join('\n\n'));
      setSavedSuccess(false);
    }
  }, [isOpen, schoolProfile.history]);

  if (!isOpen) return null;

  const handleResetToDefault = () => {
    if (window.confirm('Muat ulang teks sejarah referensi asli pendirian Soborejo? Teks saat ini di editor akan digantikan.')) {
      setRawText(DEFAULT_HISTORY_REF.join('\n\n'));
    }
  };

  const handleSave = async () => {
    // Split into paragraphs by double newlines or single newlines
    const cleanItems = rawText
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean);

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

  // Compute paragraph count
  const paragraphCount = rawText.split(/\r?\n\s*\r?\n/).filter((p) => p.trim()).length || (rawText.trim() ? 1 : 0);

  return (
    <div
      id="history-edit-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="history-edit-modal-content"
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-gray-200 relative my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#072217] via-[#0b3c26] to-[#072217] p-5 sm:p-6 text-white border-b border-[#d4af37]/30 shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <History className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] block">
                  MANAJEMEN KONTEN PROFIL
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-white leading-tight">
                  Input &amp; Edit Teks Sejarah Singkat
                </h3>
              </div>
            </div>

            <button
              id="btn-close-history-modal"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
              title="Tutup Jendela"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="p-3 sm:px-6 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <FileText className="w-4 h-4 text-[#0b3c26]" />
            <span>Mode Input Bebas (Ketik/Tempel Langsung)</span>
            <span className="text-gray-400">•</span>
            <span className="text-xs text-[#0b3c26] font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {paragraphCount} Paragraf Terdeteksi
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                showLivePreview
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{showLivePreview ? 'Sembunyikan Pratinjau' : 'Tampilkan Pratinjau'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 transition-all cursor-pointer"
              title="Muat teks narasi sejarah default"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              <span>Muat Teks Asli</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Teks sejarah singkat berhasil disimpan dan langsung diperbarui di halaman profil!</span>
            </div>
          )}

          {/* Quick Tip Box */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-900 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#0b3c26] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-[#0b3c26]">Cara Simpel Input Sejarah:</span>
              <p className="text-gray-700 mt-0.5">
                Ketik atau tempel seluruh uraian sejarah secara utuh di bawah. Untuk membuat paragraf baru, cukup tekan <strong>Enter 2x</strong>. Anda dapat menandai kata dengan <strong>Tebal</strong>, <em>Miring</em>, <u>Garis Bawah</u>, serta menyisipkan Emoji dan Ikon Islami/Madrasah.
              </p>
            </div>
          </div>

          {/* Rich Formatted Text Editor */}
          <div>
            <FormattedTextEditor
              id="history-modal-editor"
              value={rawText}
              onChange={setRawText}
              label="Uraian Lengkap Sejarah Pendirian & Perjalanan Madrasah"
              placeholder="Tuliskan kisah pendirian MI Ma'arif & RA Al Ihsan Soborejo di sini... (Pisahkan antar paragraf dengan Enter 2x)"
              rows={9}
              minHeight="220px"
              helperText="Setiap pemisah baris kosong (Enter 2x) akan otomatis ditampilkan sebagai kartu paragraf jejak langkah pada halaman profil."
            />
          </div>

          {/* Realtime Live Preview on Soborejo Card Layout */}
          {showLivePreview && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#072217] uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Pratinjau Tampilan di Halaman Website (Live):</span>
                </span>
                <span className="text-[11px] text-gray-500">
                  {paragraphCount} kartu paragraf
                </span>
              </div>

              <div className="bg-[#052317] p-4 sm:p-6 rounded-2xl border border-emerald-500/30 space-y-3">
                {rawText.trim() ? (
                  rawText
                    .split(/\r?\n\s*\r?\n/)
                    .map((p) => p.trim())
                    .filter(Boolean)
                    .map((hist, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-[#06291b] p-3.5 sm:p-4 rounded-xl border border-emerald-500/20 text-white"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] shrink-0 mt-1.5 shadow-sm" />
                        <div className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-body">
                          <FormattedText text={hist} asParagraphs={false} />
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-xs text-white/50 italic text-center py-4">
                    Belum ada teks sejarah yang dimasukkan.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold transition-all cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            id="btn-save-history-content"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#0b3c26] to-[#072217] hover:from-[#072217] hover:to-[#0b3c26] text-[#f3e5ab] text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#d4af37]" />
            <span>Simpan Perubahan Sejarah</span>
          </button>
        </div>
      </div>
    </div>
  );
};
