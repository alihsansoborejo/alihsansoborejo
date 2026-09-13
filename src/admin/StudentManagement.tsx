import React, { useState, useMemo, useRef } from 'react';
import {
  Users,
  UserCheck,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  UploadCloud,
  FileSpreadsheet,
  Edit,
  Trash2,
  Eye,
  Phone,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  X,
  GraduationCap,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { StudentItem } from '../types';
import {
  downloadCSV,
  generateCSV,
  getStudentCSVTemplate,
  parseStudentsFromCSV,
  STUDENT_CSV_HEADERS
} from '../lib/csvHelper';

interface StudentManagementProps {
  students: StudentItem[];
  onAddStudent: (item: Omit<StudentItem, 'id'>) => void;
  onAddStudentsBatch: (items: Omit<StudentItem, 'id'>[], replaceAll?: boolean) => void;
  onUpdateStudent: (id: string, item: Partial<StudentItem>) => void;
  onDeleteStudent: (id: string) => void;
  notify: (msg: string) => void;
}

const GRADE_OPTIONS = [
  'Kelas 1',
  'Kelas 2',
  'Kelas 3',
  'Kelas 4',
  'Kelas 5',
  'Kelas 6',
];

const STATUS_OPTIONS: StudentItem['status'][] = [
  'Aktif',
  'Lulus',
  'Pindah',
  'Mutasi',
];

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  onAddStudent,
  onAddStudentsBatch,
  onUpdateStudent,
  onDeleteStudent,
  notify,
}) => {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [selectedGender, setSelectedGender] = useState<string>('Semua');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
  const [detailStudent, setDetailStudent] = useState<StudentItem | null>(null);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  // Form State
  const initialFormState: Omit<StudentItem, 'id'> = {
    nis: '',
    nisn: '',
    name: '',
    gender: 'Laki-laki',
    grade: 'Kelas 1',
    classRoom: '1',
    birthPlace: 'Temanggung',
    birthDate: '',
    parentName: '',
    parentPhone: '',
    address: '',
    academicYear: '2024/2025',
    status: 'Aktif',
    notes: '',
  };

  const [studentForm, setStudentForm] = useState<Omit<StudentItem, 'id'>>(initialFormState);

  // CSV Import State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedCsvStudents, setParsedCsvStudents] = useState<Omit<StudentItem, 'id'>[]>([]);
  const [csvParseErrors, setCsvParseErrors] = useState<string[]>([]);
  const [csvImportMode, setCsvImportMode] = useState<'append' | 'replace'>('append');
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);
  const [csvDragActive, setCsvDragActive] = useState(false);
  const csvFileInputRef = useRef<HTMLInputElement>(null);

  // Filtered Students Calculation
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.nis && s.nis.toLowerCase().includes(q)) ||
        (s.nisn && s.nisn.toLowerCase().includes(q)) ||
        (s.parentName && s.parentName.toLowerCase().includes(q)) ||
        (s.address && s.address.toLowerCase().includes(q));

      // Grade match
      const matchGrade = selectedGrade === 'Semua' || s.grade === selectedGrade;

      // Status match
      const matchStatus = selectedStatus === 'Semua' || s.status === selectedStatus;

      // Gender match
      const matchGender = selectedGender === 'Semua' || s.gender === selectedGender;

      return matchSearch && matchGrade && matchStatus && matchGender;
    });
  }, [students, searchQuery, selectedGrade, selectedStatus, selectedGender]);

  // Quick statistics
  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === 'Aktif').length;
    const male = students.filter((s) => s.gender === 'Laki-laki' && s.status === 'Aktif').length;
    const female = students.filter((s) => s.gender === 'Perempuan' && s.status === 'Aktif').length;
    const graduated = students.filter((s) => s.status === 'Lulus').length;

    const byGrade: Record<string, number> = {};
    GRADE_OPTIONS.forEach((g) => {
      byGrade[g] = students.filter((s) => s.grade === g && s.status === 'Aktif').length;
    });

    return { total, active, male, female, graduated, byGrade };
  }, [students]);

  // Handlers for Add / Edit
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setStudentForm(initialFormState);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item: StudentItem) => {
    setEditingStudent(item);
    setStudentForm({
      nis: item.nis || '',
      nisn: item.nisn || '',
      name: item.name || '',
      gender: item.gender || 'Laki-laki',
      grade: item.grade || 'Kelas 1',
      classRoom: item.classRoom || '',
      birthPlace: item.birthPlace || '',
      birthDate: item.birthDate || '',
      parentName: item.parentName || '',
      parentPhone: item.parentPhone || '',
      address: item.address || '',
      academicYear: item.academicYear || '2024/2025',
      status: item.status || 'Aktif',
      notes: item.notes || '',
    });
    setIsFormModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name.trim()) {
      alert('Nama lengkap siswa wajib diisi.');
      return;
    }

    if (editingStudent) {
      onUpdateStudent(editingStudent.id, studentForm);
      notify(`Data siswa "${studentForm.name}" berhasil diperbarui!`);
    } else {
      onAddStudent(studentForm);
      notify(`Siswa baru "${studentForm.name}" berhasil ditambahkan!`);
    }

    setIsFormModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Hapus data santri/siswa "${name}"?`)) {
      onDeleteStudent(id);
      notify(`Data siswa "${name}" berhasil dihapus.`);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (students.length === 0) {
      alert('Belum ada data siswa untuk diekspor.');
      return;
    }

    const rows = filteredStudents.map((s) => [
      s.nis,
      s.nisn || '',
      s.name,
      s.gender,
      s.grade,
      s.classRoom || '',
      s.birthPlace || '',
      s.birthDate || '',
      s.parentName || '',
      s.parentPhone || '',
      s.address || '',
      s.academicYear || '2024/2025',
      s.status,
      s.notes || '',
    ]);

    const csvContent = generateCSV(STUDENT_CSV_HEADERS, rows);
    downloadCSV(`data_siswa_mi_al_ihsan_${new Date().toISOString().split('T')[0]}.csv`, csvContent);
    notify(`${filteredStudents.length} data siswa berhasil diekspor ke file CSV!`);
  };

  // CSV Import Helpers
  const handleDownloadTemplate = () => {
    const template = getStudentCSVTemplate();
    downloadCSV('template_data_siswa_mi_al_ihsan.csv', template);
  };

  const processCsvFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      alert('Mohon pilih file dengan format .csv');
      return;
    }

    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const result = parseStudentsFromCSV(text);
        setParsedCsvStudents(result.students);
        setCsvParseErrors(result.errors);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processCsvFile(e.target.files[0]);
    }
  };

  const handleCsvDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setCsvDragActive(true);
    } else if (e.type === 'dragleave') {
      setCsvDragActive(false);
    }
  };

  const handleCsvDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCsvDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processCsvFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmitCsvImport = () => {
    if (parsedCsvStudents.length === 0) {
      alert('Tidak ada data siswa yang valid untuk diimpor.');
      return;
    }

    setIsProcessingCsv(true);
    try {
      onAddStudentsBatch(parsedCsvStudents, csvImportMode === 'replace');
      notify(
        csvImportMode === 'replace'
          ? `Berhasil mengganti data siswa dengan ${parsedCsvStudents.length} siswa dari CSV!`
          : `Berhasil menambahkan ${parsedCsvStudents.length} siswa baru dari file CSV!`
      );
      setIsCsvModalOpen(false);
      setCsvFile(null);
      setParsedCsvStudents([]);
      setCsvParseErrors([]);
    } finally {
      setIsProcessingCsv(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c26] bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Kesiswaan
            </span>
            <span className="text-xs text-gray-500 font-medium">TP 2024/2025</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#072217] mt-1 flex items-center gap-2">
            <span>Manajemen Data Siswa (Santri)</span>
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Kelola data peserta didik per rombel, pencarian NIS/NISN, tambah manual, serta impor massal melalui file CSV/Excel.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Tambah Siswa Manual</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCsvFile(null);
              setParsedCsvStudents([]);
              setCsvParseErrors([]);
              setIsCsvModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-emerald-50 text-[#0b3c26] border border-emerald-300 text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Import CSV Siswa</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all"
            title="Download CSV data siswa yang sedang difilter"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[#f8faf9] border border-gray-200 rounded-xl p-3.5">
          <div className="text-[11px] text-gray-500 font-medium flex items-center justify-between">
            <span>Total Siswa Aktif</span>
            <Users className="w-3.5 h-3.5 text-[#0b3c26]" />
          </div>
          <div className="font-heading text-2xl font-bold text-[#0b3c26] mt-1">
            {stats.active} <span className="text-xs font-normal text-gray-500">Santri</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">Terdaftar resmi di madrasah</div>
        </div>

        <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-3.5">
          <div className="text-[11px] text-blue-700 font-medium flex items-center justify-between">
            <span>Siswa Putra (Laki-laki)</span>
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="font-heading text-2xl font-bold text-blue-900 mt-1">
            {stats.male} <span className="text-xs font-normal text-blue-600">Santri</span>
          </div>
          <div className="text-[10px] text-blue-600/80 mt-0.5">
            {stats.active > 0 ? `${Math.round((stats.male / stats.active) * 100)}% dari total` : '0%'}
          </div>
        </div>

        <div className="bg-pink-50/50 border border-pink-200 rounded-xl p-3.5">
          <div className="text-[11px] text-pink-700 font-medium flex items-center justify-between">
            <span>Siswa Putri (Perempuan)</span>
            <UserCheck className="w-3.5 h-3.5 text-pink-600" />
          </div>
          <div className="font-heading text-2xl font-bold text-pink-900 mt-1">
            {stats.female} <span className="text-xs font-normal text-pink-600">Santri</span>
          </div>
          <div className="text-[10px] text-pink-600/80 mt-0.5">
            {stats.active > 0 ? `${Math.round((stats.female / stats.active) * 100)}% dari total` : '0%'}
          </div>
        </div>

        <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3.5">
          <div className="text-[11px] text-amber-800 font-medium flex items-center justify-between">
            <span>Alumni / Pindah</span>
            <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="font-heading text-2xl font-bold text-amber-900 mt-1">
            {stats.graduated} <span className="text-xs font-normal text-amber-700">Lulus</span>
          </div>
          <div className="text-[10px] text-amber-700/80 mt-0.5">Arsip rekam jejak santri</div>
        </div>
      </div>

      {/* Grade Quick Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-gray-500 font-medium mr-1 text-[11px] shrink-0">Tingkat Kelas:</span>
        <button
          type="button"
          onClick={() => setSelectedGrade('Semua')}
          className={`px-3 py-1 rounded-lg font-semibold transition-all shrink-0 ${
            selectedGrade === 'Semua'
              ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Semua ({students.length})
        </button>
        {GRADE_OPTIONS.map((grade) => (
          <button
            key={grade}
            type="button"
            onClick={() => setSelectedGrade(grade)}
            className={`px-3 py-1 rounded-lg font-semibold transition-all shrink-0 ${
              selectedGrade === grade
                ? 'bg-[#0b3c26] text-[#f3e5ab] shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {grade} ({stats.byGrade[grade] || 0})
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama santri, NIS, NISN, nama orang tua, alamat..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26] focus:border-[#0b3c26]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Gender Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
          >
            <option value="Semua">Semua Gender</option>
            <option value="Laki-laki">Laki-laki (Putra)</option>
            <option value="Perempuan">Perempuan (Putri)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
          >
            <option value="Semua">Semua Status</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                Status: {st}
              </option>
            ))}
          </select>

          {(searchQuery || selectedGrade !== 'Semua' || selectedStatus !== 'Semua' || selectedGender !== 'Semua') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedGrade('Semua');
                setSelectedStatus('Semua');
                setSelectedGender('Semua');
              }}
              className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors whitespace-nowrap"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-3 w-12 text-center">No</th>
                <th className="p-3">NIS & NISN</th>
                <th className="p-3">Nama Santri & Gender</th>
                <th className="p-3">Kelas & Rombel</th>
                <th className="p-3">Tempat, Tanggal Lahir</th>
                <th className="p-3">Orang Tua / Wali</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    <div className="max-w-sm mx-auto">
                      <Users className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                      <div className="font-bold text-gray-700">Tidak ada data siswa yang cocok</div>
                      <p className="text-xs text-gray-400 mt-1">
                        Silakan periksa kata kunci pencarian atau tambahkan data siswa baru melalui form atau import CSV.
                      </p>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={handleOpenAddModal}
                          className="px-3.5 py-1.5 bg-[#0b3c26] text-[#f3e5ab] text-xs font-bold rounded-lg shadow-sm"
                        >
                          + Tambah Siswa Baru
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCsvModalOpen(true)}
                          className="px-3.5 py-1.5 bg-emerald-50 text-[#0b3c26] border border-emerald-200 text-xs font-semibold rounded-lg"
                        >
                          Import CSV
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3 text-center text-gray-400 font-mono text-[11px]">
                      {index + 1}
                    </td>
                    <td className="p-3">
                      <div className="font-mono font-bold text-gray-900">{student.nis || '-'}</div>
                      <div className="font-mono text-[10px] text-gray-400">
                        NISN: {student.nisn || '-'}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-[#072217] text-sm">{student.name}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                            student.gender === 'Laki-laki'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-pink-50 text-pink-700 border border-pink-200'
                          }`}
                        >
                          {student.gender === 'Laki-laki' ? 'L (Putra)' : 'P (Putri)'}
                        </span>
                        {student.academicYear && (
                          <span className="text-[10px] text-gray-400">• TA {student.academicYear}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-emerald-900">{student.grade}</div>
                      {student.classRoom && (
                        <div className="text-[10px] text-gray-500">Rombel: {student.classRoom}</div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="text-gray-800">{student.birthPlace || '-'}</div>
                      <div className="text-[10px] text-gray-500">{student.birthDate || '-'}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-gray-800">{student.parentName || '-'}</div>
                      {student.parentPhone && (
                        <a
                          href={`https://wa.me/${student.parentPhone.replace(/\D/g, '').replace(/^0/, '62')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 hover:underline font-mono mt-0.5"
                          title="Kirim pesan WhatsApp"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{student.parentPhone}</span>
                        </a>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          student.status === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : student.status === 'Lulus'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : student.status === 'Pindah'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setDetailStudent(student)}
                          className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                          title="Lihat Detail Santri"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(student)}
                          className="p-1.5 hover:bg-emerald-50 text-emerald-700 rounded-lg transition-colors"
                          title="Edit Data Siswa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(student.id, student.name)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Hapus Data Siswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <div>
            Menampilkan <strong className="text-gray-800">{filteredStudents.length}</strong> dari{' '}
            <strong className="text-gray-800">{students.length}</strong> total data santri
          </div>
          <div className="text-[11px] text-gray-400">
            * Data tersimpan aman di Cloud SQL dan dapat diekspor sewaktu-waktu.
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. MANUAL ADD / EDIT STUDENT MODAL                        */}
      {/* ======================================================== */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0b3c26] flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#072217]">
                  {editingStudent ? 'Edit Data Siswa / Santri' : 'Tambah Data Siswa Baru (Manual)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Nama Lengkap */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nama Lengkap Siswa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    placeholder="e.g. Ahmad Fauzan Al-Banjari"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                  />
                </div>

                {/* NIS & NISN */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    NIS (Nomor Induk Siswa)
                  </label>
                  <input
                    type="text"
                    value={studentForm.nis}
                    onChange={(e) => setStudentForm({ ...studentForm, nis: e.target.value })}
                    placeholder="e.g. 2024001"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    NISN (Nomor Induk Siswa Nasional)
                  </label>
                  <input
                    type="text"
                    value={studentForm.nisn || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, nisn: e.target.value })}
                    placeholder="e.g. 3128475921"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                  />
                </div>

                {/* Jenis Kelamin */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={studentForm.gender}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        gender: e.target.value as StudentItem['gender'],
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                  >
                    <option value="Laki-laki">Laki-laki (Putra)</option>
                    <option value="Perempuan">Perempuan (Putri)</option>
                  </select>
                </div>

                {/* Kelas */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tingkat Kelas <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={studentForm.grade}
                    onChange={(e) => setStudentForm({ ...studentForm, grade: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                  >
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rombel & Tahun Ajaran */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Rombel / Ruang Kelas
                  </label>
                  <input
                    type="text"
                    value={studentForm.classRoom || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, classRoom: e.target.value })}
                    placeholder="e.g. 1, 1A, atau A"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tahun Ajaran
                  </label>
                  <input
                    type="text"
                    value={studentForm.academicYear || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, academicYear: e.target.value })}
                    placeholder="e.g. 2024/2025"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                  />
                </div>

                {/* Tempat & Tanggal Lahir */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    value={studentForm.birthPlace || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, birthPlace: e.target.value })}
                    placeholder="e.g. Temanggung"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tanggal Lahir (YYYY-MM-DD)
                  </label>
                  <input
                    type="date"
                    value={studentForm.birthDate || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, birthDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                  />
                </div>

                {/* Orang Tua & HP */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nama Orang Tua / Wali
                  </label>
                  <input
                    type="text"
                    value={studentForm.parentName || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, parentName: e.target.value })}
                    placeholder="e.g. Muhammad Sholikin"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    No. WhatsApp / HP Orang Tua
                  </label>
                  <input
                    type="tel"
                    value={studentForm.parentPhone || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, parentPhone: e.target.value })}
                    placeholder="e.g. 085876543210"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                  />
                </div>

                {/* Alamat */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Alamat Domisili Siswa
                  </label>
                  <input
                    type="text"
                    value={studentForm.address || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                    placeholder="e.g. Dusun Krajan, Desa Soborejo, Kec. Pringsurat, Kab. Temanggung"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Status Santri <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={studentForm.status}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        status: e.target.value as StudentItem['status'],
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Catatan */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Catatan / Keterangan Khusus
                  </label>
                  <input
                    type="text"
                    value={studentForm.notes || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, notes: e.target.value })}
                    placeholder="e.g. Lulusan RA Muslimat NU, Hafal Juz 30"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b3c26]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4 text-[#d4af37]" />
                  <span>{editingStudent ? 'Simpan Perubahan' : 'Tambahkan Siswa'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. CSV IMPORT MODAL                                       */}
      {/* ======================================================== */}
      {isCsvModalOpen && (
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
                    Import Data Siswa via CSV / Excel
                  </h3>
                  <p className="text-xs text-gray-500">
                    Unggah puluhan atau ratusan data santri madrasah sekaligus dari file spreadsheet.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {/* Step 1: Download Template */}
              <div className="bg-[#f8faf9] border border-emerald-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-[#0b3c26] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#0b3c26] text-[#f3e5ab] text-[10px] flex items-center justify-center font-bold">1</span>
                    <span>Gunakan Format Template Resmi</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Unduh file template CSV yang sudah dilengkapi header kolom resmi (NIS, NISN, Nama, Gender, Kelas, dll).
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
                  onDragEnter={handleCsvDrag}
                  onDragLeave={handleCsvDrag}
                  onDragOver={handleCsvDrag}
                  onDrop={handleCsvDrop}
                  onClick={() => csvFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    csvDragActive
                      ? 'border-[#0b3c26] bg-emerald-50/60'
                      : csvFile
                      ? 'border-emerald-500 bg-emerald-50/20'
                      : 'border-gray-300 hover:border-[#0b3c26] bg-gray-50/60 hover:bg-gray-50'
                  }`}
                >
                  <input
                    ref={csvFileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleCsvFileChange}
                    className="hidden"
                  />

                  <UploadCloud className="w-10 h-10 mx-auto text-[#0b3c26] mb-2" />

                  {csvFile ? (
                    <div>
                      <div className="text-xs font-bold text-[#072217]">{csvFile.name}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {(csvFile.size / 1024).toFixed(1)} KB • Klik untuk memilih file lain
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs font-bold text-gray-700">
                        Tarik dan letakkan file CSV Anda di sini, atau <span className="text-[#0b3c26] underline">klik untuk mencari</span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        Otomatis membaca format delimiter koma (,) maupun titik koma (;)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Warnings */}
              {csvParseErrors.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Peringatan Data:</span>
                  </div>
                  <ul className="list-disc list-inside pl-1 text-[11px] space-y-0.5">
                    {csvParseErrors.slice(0, 5).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {csvParseErrors.length > 5 && (
                      <li>...dan {csvParseErrors.length - 5} baris lainnya dilewati.</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Parsed Preview */}
              {parsedCsvStudents.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-gray-800">
                        Pratinjau: {parsedCsvStudents.length} Data Santri Siap Disimpan
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCsvFile(null);
                        setParsedCsvStudents([]);
                        setCsvParseErrors([]);
                        if (csvFileInputRef.current) csvFileInputRef.current.value = '';
                      }}
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
                          <th className="p-2.5">NIS</th>
                          <th className="p-2.5">Nama Santri</th>
                          <th className="p-2.5">Gender</th>
                          <th className="p-2.5">Kelas</th>
                          <th className="p-2.5">Orang Tua</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {parsedCsvStudents.slice(0, 10).map((st, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="p-2.5 text-gray-400 font-mono text-[10px]">{idx + 1}</td>
                            <td className="p-2.5 font-mono">{st.nis || '-'}</td>
                            <td className="p-2.5 font-bold text-[#072217]">{st.name}</td>
                            <td className="p-2.5">
                              <span
                                className={`text-[10px] px-1 py-0.2 rounded font-semibold ${
                                  st.gender === 'Laki-laki' ? 'text-blue-700' : 'text-pink-700'
                                }`}
                              >
                                {st.gender === 'Laki-laki' ? 'L' : 'P'}
                              </span>
                            </td>
                            <td className="p-2.5 text-emerald-900 font-semibold">{st.grade}</td>
                            <td className="p-2.5 text-gray-500">{st.parentName || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {parsedCsvStudents.length > 10 && (
                    <div className="text-center text-[11px] text-gray-500">
                      Menampilkan 10 dari {parsedCsvStudents.length} baris santri.
                    </div>
                  )}

                  {/* Mode Option */}
                  <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                    <label className="block text-xs font-bold text-gray-700">
                      Pilihan Metode Penyimpanan:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                          csvImportMode === 'append'
                            ? 'bg-emerald-50/70 border-[#0b3c26] text-[#072217]'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="studentImportMode"
                          value="append"
                          checked={csvImportMode === 'append'}
                          onChange={() => setCsvImportMode('append')}
                          className="mt-0.5 text-[#0b3c26] focus:ring-[#0b3c26]"
                        />
                        <div className="text-xs">
                          <div className="font-bold">Tambahkan ke Data yang Ada</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">
                            {students.length} data siswa saat ini tetap dipertahankan, ditambah {parsedCsvStudents.length} data baru.
                          </div>
                        </div>
                      </label>

                      <label
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                          csvImportMode === 'replace'
                            ? 'bg-amber-50 border-amber-500 text-amber-950'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="studentImportMode"
                          value="replace"
                          checked={csvImportMode === 'replace'}
                          onChange={() => setCsvImportMode('replace')}
                          className="mt-0.5 text-amber-600 focus:ring-amber-500"
                        />
                        <div className="text-xs">
                          <div className="font-bold text-amber-900">Gantikan Seluruh Data</div>
                          <div className="text-[10px] text-amber-700 mt-0.5">
                            Menghapus data siswa lama dan menggantinya dengan {parsedCsvStudents.length} siswa dari file CSV ini.
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsCsvModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSubmitCsvImport}
                disabled={parsedCsvStudents.length === 0 || isProcessingCsv}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  parsedCsvStudents.length === 0 || isProcessingCsv
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab]'
                }`}
              >
                <UploadCloud className="w-4 h-4 text-[#d4af37]" />
                <span>
                  {isProcessingCsv
                    ? 'Memproses...'
                    : `Simpan ${parsedCsvStudents.length > 0 ? `${parsedCsvStudents.length} Data Siswa` : 'Data'}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. STUDENT DETAIL VIEW MODAL                             */}
      {/* ======================================================== */}
      {detailStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0b3c26] flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-[#072217]">
                    Profil Lengkap Santri
                  </h3>
                  <div className="text-[10px] text-gray-400">ID: {detailStudent.id}</div>
                </div>
              </div>
              <button
                onClick={() => setDetailStudent(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs text-gray-700">
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-heading text-base font-bold text-[#072217]">
                    {detailStudent.name}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-900 mt-0.5">
                    <span>{detailStudent.gender}</span>
                    <span>•</span>
                    <span className="font-semibold">{detailStudent.grade}</span>
                    {detailStudent.classRoom && <span>(Rombel {detailStudent.classRoom})</span>}
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    detailStudent.status === 'Aktif'
                      ? 'bg-emerald-200 text-emerald-950'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {detailStudent.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <div className="text-[10px] text-gray-500 font-medium">Nomor Induk Siswa (NIS)</div>
                  <div className="font-mono font-bold text-gray-900 mt-0.5">{detailStudent.nis || '-'}</div>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <div className="text-[10px] text-gray-500 font-medium">NISN</div>
                  <div className="font-mono font-bold text-gray-900 mt-0.5">{detailStudent.nisn || '-'}</div>
                </div>
              </div>

              <div className="p-2.5 bg-gray-50 rounded-lg space-y-1">
                <div className="text-[10px] text-gray-500 font-medium">Tempat, Tanggal Lahir</div>
                <div className="font-medium text-gray-800">
                  {detailStudent.birthPlace || '-'}
                  {detailStudent.birthDate ? `, ${detailStudent.birthDate}` : ''}
                </div>
              </div>

              <div className="p-2.5 bg-gray-50 rounded-lg space-y-1">
                <div className="text-[10px] text-gray-500 font-medium">Orang Tua / Wali & Kontak</div>
                <div className="font-semibold text-gray-900">{detailStudent.parentName || '-'}</div>
                {detailStudent.parentPhone && (
                  <div className="flex items-center gap-2 pt-0.5">
                    <a
                      href={`https://wa.me/${detailStudent.parentPhone.replace(/\D/g, '').replace(/^0/, '62')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Hubungi WhatsApp: {detailStudent.parentPhone}</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="p-2.5 bg-gray-50 rounded-lg space-y-1">
                <div className="text-[10px] text-gray-500 font-medium">Alamat Domisili</div>
                <div className="text-gray-800">{detailStudent.address || '-'}</div>
              </div>

              {detailStudent.notes && (
                <div className="p-2.5 bg-amber-50/60 border border-amber-200/80 rounded-lg space-y-1">
                  <div className="text-[10px] text-amber-800 font-medium">Catatan / Keterangan</div>
                  <div className="text-amber-950">{detailStudent.notes}</div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDetailStudent(null);
                  handleOpenEditModal(detailStudent);
                }}
                className="px-3.5 py-2 bg-[#0b3c26] text-[#f3e5ab] text-xs font-bold rounded-xl hover:bg-[#072217] transition-colors flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Data Siswa</span>
              </button>
              <button
                type="button"
                onClick={() => setDetailStudent(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
