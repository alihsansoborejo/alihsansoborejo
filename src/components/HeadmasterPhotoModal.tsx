import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { compressImage } from '../lib/imageCompressor';
import {
  X,
  Upload,
  Camera,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  Trash2,
  Image as ImageIcon,
  ZoomIn,
  MoveVertical
} from 'lucide-react';

interface HeadmasterPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_PHOTOS = [
  {
    id: 'formal-ustadz',
    title: 'Ustadz / Pendidik Resmi',
    desc: 'Pose formal berkacamata & kemeja rapi',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    position: 'top' as const,
    fit: 'cover' as const,
    scale: 100,
  },
  {
    id: 'formal-leader',
    title: 'Pimpinan Madrasah Elegan',
    desc: 'Jas formal pimpinan lembaga',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    position: 'top' as const,
    fit: 'cover' as const,
    scale: 100,
  },
  {
    id: 'warm-mentor',
    title: 'Tokoh Pengasuh Ramah',
    desc: 'Sosok figur pendidik hangat bersahaja',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    position: 'top' as const,
    fit: 'cover' as const,
    scale: 100,
  }
];

export const HeadmasterPhotoModal: React.FC<HeadmasterPhotoModalProps> = ({ isOpen, onClose }) => {
  const { schoolProfile, updateSchoolProfile, pushAllToCloud } = useDataContext();

  const [photoUrl, setPhotoUrl] = useState<string>(
    schoolProfile.headmasterPhotoUrl || ''
  );
  const [position, setPosition] = useState<'top' | 'center' | 'bottom'>(
    schoolProfile.headmasterPhotoPosition || 'top'
  );
  const [scale, setScale] = useState<number>(schoolProfile.headmasterPhotoScale || 100);
  const [fit, setFit] = useState<'cover' | 'contain'>(schoolProfile.headmasterPhotoFit || 'cover');
  const [isUploading, setIsUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMsg(null);
      // Compress to optimal web size (max 1000x1200, 85% JPEG)
      const compressed = await compressImage(file, 1000, 1200, 0.85);
      setPhotoUrl(compressed);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal memproses file foto');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      updateSchoolProfile({
        headmasterPhotoUrl: photoUrl,
        headmasterPhotoPosition: position,
        headmasterPhotoScale: scale,
        headmasterPhotoFit: fit,
      });

      // Save to cloud in background
      pushAllToCloud().catch(() => {});

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg('Gagal menyimpan foto: ' + (err?.message || 'Terjadi kesalahan'));
    }
  };

  const handleReset = () => {
    const defaultPreset = PRESET_PHOTOS[0];
    setPhotoUrl(defaultPreset.url);
    setPosition(defaultPreset.position);
    setScale(defaultPreset.scale);
    setFit(defaultPreset.fit);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#072217] via-[#0b3c26] to-[#041a11] text-white flex items-center justify-between border-b border-[#d4af37]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Atur & Sesuaikan Foto Kepala Madrasah
              </h3>
              <p className="text-[11px] text-[#d4af37]/90">
                Sesuaikan foto Bapak {schoolProfile.headmasterName} pada sambutan beranda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[80vh] overflow-y-auto">
          {/* Left Column: Live Card Preview */}
          <div className="md:col-span-5 flex flex-col items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              Pratinjau Bingkai Sambutan
            </span>

            {/* The luxury frame replicating PrincipalWelcome */}
            <div className="w-full max-w-[260px] rounded-2xl overflow-hidden border-2 border-[#d4af37] shadow-xl bg-[#072217] relative">
              <div className="h-[280px] w-full overflow-hidden relative flex items-center justify-center bg-[#041a11]">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={schoolProfile.headmasterName}
                    style={{
                      transform: `scale(${scale / 100})`,
                      transformOrigin: position === 'top' ? 'top center' : position === 'bottom' ? 'bottom center' : 'center center',
                    }}
                    className={`w-full h-full transition-transform duration-200 ${
                      fit === 'contain' ? 'object-contain' : 'object-cover'
                    } ${
                      position === 'top'
                        ? 'object-top'
                        : position === 'bottom'
                        ? 'object-bottom'
                        : 'object-center'
                    }`}
                  />
                ) : (
                  <div className="text-center p-4 text-white/60">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 text-[#d4af37]/60" />
                    <span className="text-xs">Belum ada foto</span>
                  </div>
                )}
              </div>

              {/* Headmaster Label Plate */}
              <div className="p-3 bg-[#072217] border-t border-[#d4af37]/30 text-center">
                <div className="font-heading text-[#d4af37] font-bold text-xs truncate">
                  {schoolProfile.headmasterName}
                </div>
                <div className="text-[10px] text-white/80 truncate mt-0.5">
                  {schoolProfile.headmasterTitle}
                </div>
              </div>
            </div>

            {/* Hint */}
            <p className="text-[10px] text-gray-500 text-center mt-3 leading-relaxed">
              Tampilan di atas adalah hasil langsung yang akan dilihat pengunjung di halaman depan.
            </p>
          </div>

          {/* Right Column: Adjustment Controls */}
          <div className="md:col-span-7 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorMsg}
              </div>
            )}

            {/* 1. Sumber Foto: Upload / URL */}
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <label className="block text-xs font-bold text-gray-800 mb-2">
                1. Ganti Foto (Pilih dari HP/Laptop atau URL)
              </label>

              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-semibold rounded-lg shadow-sm transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Mengompres...' : 'Unggah Foto dari Perangkat'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="inline-flex items-center gap-1 px-2.5 py-2 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Kosongkan</span>
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-gray-500">
                  Atau tempelkan tautan langsung gambar (URL):
                </label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg font-mono focus:ring-1 focus:ring-[#0b3c26]"
                />
              </div>
            </div>

            {/* 2. Pilihan Preset Referensi */}
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <label className="block text-xs font-bold text-gray-800 mb-2">
                2. Pilihan Referensi Foto Formal Islami
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_PHOTOS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setPhotoUrl(preset.url);
                      setPosition(preset.position);
                      setFit(preset.fit);
                      setScale(preset.scale);
                    }}
                    className={`p-2 rounded-lg border text-left transition-all flex flex-col items-center ${
                      photoUrl === preset.url
                        ? 'border-[#0b3c26] bg-[#e8f3ee] ring-1 ring-[#0b3c26]'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-12 h-14 object-cover object-top rounded border border-gray-300 mb-1.5"
                    />
                    <span className="text-[10px] font-bold text-[#072217] text-center line-clamp-1">
                      {preset.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Pengaturan Posisi, Skala & Fit */}
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-3">
              <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#0b3c26]" />
                <span>3. Penyesuaian Posisi & Perbesaran (Zoom)</span>
              </label>

              {/* Posisi Vertikal */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <MoveVertical className="w-3 h-3 text-gray-500" />
                    Fokus Posisi Vertikal
                  </span>
                  <span className="text-[10px] font-bold text-[#0b3c26]">
                    {position === 'top' ? 'Atas (Kepala/Peci)' : position === 'center' ? 'Tengah' : 'Bawah'}
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPosition('top')}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      position === 'top'
                        ? 'bg-[#0b3c26] text-white border-[#0b3c26]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    ⬆️ Atas (Kepala)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosition('center')}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      position === 'center'
                        ? 'bg-[#0b3c26] text-white border-[#0b3c26]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    ⏺️ Tengah
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosition('bottom')}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      position === 'bottom'
                        ? 'bg-[#0b3c26] text-white border-[#0b3c26]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    ⬇️ Bawah
                  </button>
                </div>
              </div>

              {/* Skala / Zoom Slider */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <ZoomIn className="w-3 h-3 text-gray-500" />
                    Perbesaran Foto (Zoom)
                  </span>
                  <span className="text-[10px] font-bold text-[#0b3c26] font-mono">{scale}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="160"
                  step="5"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0b3c26]"
                />
                <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
                  <span>80% (Mengecil)</span>
                  <span>100% (Normal)</span>
                  <span>160% (Dekat)</span>
                </div>
              </div>

              {/* Model Tampilan: Cover vs Contain */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Mode Bingkai Foto
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFit('cover')}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                      fit === 'cover'
                        ? 'bg-[#0b3c26] text-white border-[#0b3c26]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Penuh (Cover Bingkai)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFit('contain')}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                      fit === 'contain'
                        ? 'bg-[#0b3c26] text-white border-[#0b3c26]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Utuh (Contain Tanpa Terpotong)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kembalikan Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Terapkan & Simpan Foto</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
