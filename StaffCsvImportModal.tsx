import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  Users
} from 'lucide-react';
import { StaffMember } from '../types';
import {
  getStaffCSVTemplate,
  parseStaffFromCSV,
  downloadCSV
} from '../lib/csvHelper';

interface StaffCsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (staff: Omit<StaffMember, 'id'>[], replaceAll: boolean) => void;
  currentStaffCount: number;
}

export const StaffCsvImportModal: React.FC<StaffCsvImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  currentStaffCount,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Omit<StaffMember, 'id'>[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const template = getStaffCSVTemplate();
    downloadCSV('template_data_gtk_mi_al_ihsan.csv', template);
  };

  const processFile = (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.csv') && selectedFile.type !== 'text/csv') {
      alert('Mohon pilih file dengan format .csv');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const result = parseStaffFromCSV(text);
        setParsedData(result.staff);
        setParseErrors(result.errors);
      }
    };
    reader.readAsText(selectedFile, 'UTF-8');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmitImport = () => {
    if (parsedData.length === 0) {
      alert('Tidak ada data guru/staf yang valid untuk diimpor.');
      return;
    }

    setIsProcessing(true);
    try {
      onImportSuccess(parsedData, importMode === 'replace');
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedData([]);
    setParseErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0b3c26] flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#072217]">
                Import Data GTK (Guru & Staf) via CSV
              </h3>
              <p className="text-xs text-gray-500">
                Unggah banyak data asatidz, guru kelas, dan staf kependidikan sekaligus dari file Excel/CSV.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Step 1: Download Template */}
          <div className="bg-[#f8faf9] border border-emerald-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-[#0b3c26] flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#0b3c26] text-[#f3e5ab] text-[10px] flex items-center justify-center font-bold">1</span>
                <span>Gunakan Format Template Resmi</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Unduh template CSV yang telah disesuaikan dengan kolom data GTK MI Ma'arif Al Ihsan.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-emerald-50 text-[#0b3c26] border border-emerald-300 text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
            >
              <Download className="w-4 h-4 text-[#d4af37]" />
              <span>Unduh Template CSV</span>
            </button>
          </div>

          {/* Step 2: Upload Area */}
          <div>
            <div className="text-xs font-bold text-[#0b3c26] flex items-center gap-1.5 mb-2">
              <span className="w-5 h-5 rounded-full bg-[#0b3c26] text-[#f3e5ab] text-[10px] flex items-center justify-center font-bold">2</span>
              <span>Pilih File CSV dari Komputer / HP</span>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-[#0b3c26] bg-emerald-50/60'
                  : file
                  ? 'border-emerald-500 bg-emerald-50/20'
                  : 'border-gray-300 hover:border-[#0b3c26] bg-gray-50/60 hover:bg-gray-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />

              <UploadCloud className="w-10 h-10 mx-auto text-[#0b3c26] mb-2" />

              {file ? (
                <div>
                  <div className="text-xs font-bold text-[#072217]">{file.name}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB • Klik untuk memilih file lain
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-bold text-gray-700">
                    Tarik dan lepaskan file CSV ke sini, atau <span className="text-[#0b3c26] underline">klik untuk mencari</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">
                    Mendukung pemisah koma (,) dan titik koma (;) standar Excel
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Parse Errors if any */}
          {parseErrors.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Peringatan Pembacaan Baris:</span>
              </div>
              <ul className="list-disc list-inside pl-1 text-[11px] space-y-0.5">
                {parseErrors.slice(0, 5).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
                {parseErrors.length > 5 && (
                  <li>...dan {parseErrors.length - 5} baris lainnya dilewati karena data tidak lengkap.</li>
                )}
              </ul>
            </div>
          )}

          {/* Preview Parsed Data */}
          {parsedData.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-gray-800">
                    Pratinjau Data: {parsedData.length} GTK Siap Diimpor
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] text-red-600 hover:text-red-800 underline"
                >
                  Ganti File
                </button>
              </div>

              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 sticky top-0 border-b border-gray-200">
                    <tr>
                      <th className="p-2.5">No</th>
                      <th className="p-2.5">Nama GTK</th>
                      <th className="p-2.5">Jabatan / Tugas</th>
                      <th className="p-2.5">Kategori</th>
                      <th className="p-2.5">Pendidikan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {parsedData.slice(0, 10).map((st, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-2.5 text-gray-400 font-mono text-[10px]">{idx + 1}</td>
                        <td className="p-2.5 font-bold text-[#072217]">{st.name}</td>
                        <td className="p-2.5 text-emerald-900">{st.role}</td>
                        <td className="p-2.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {st.category}
                          </span>
                        </td>
                        <td className="p-2.5 text-gray-500">{st.education || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedData.length > 10 && (
                <div className="text-center text-[11px] text-gray-500">
                  Menampilkan 10 dari {parsedData.length} baris data guru/staf.
                </div>
              )}

              {/* Import Mode: Append or Replace */}
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Pilihan Metode Impor:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      importMode === 'append'
                        ? 'bg-emerald-50/70 border-[#0b3c26] text-[#072217]'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="staffImportMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="mt-0.5 text-[#0b3c26] focus:ring-[#0b3c26]"
                    />
                    <div className="text-xs">
                      <div className="font-bold">Tambahkan ke Data yang Ada</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {currentStaffCount} data GTK saat ini tetap dipertahankan, ditambah {parsedData.length} data baru.
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      importMode === 'replace'
                        ? 'bg-amber-50 border-amber-500 text-amber-950'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="staffImportMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mt-0.5 text-amber-600 focus:ring-amber-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-amber-900">Gantikan Seluruh Data</div>
                      <div className="text-[10px] text-amber-700 mt-0.5">
                        Menghapus data GTK lama dan menggantinya dengan {parsedData.length} data dari file CSV ini.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmitImport}
            disabled={parsedData.length === 0 || isProcessing}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              parsedData.length === 0 || isProcessing
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab]'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-[#d4af37]" />
            <span>
              {isProcessing
                ? 'Memproses...'
                : `Simpan ${parsedData.length > 0 ? `${parsedData.length} Data GTK` : 'Data'}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
