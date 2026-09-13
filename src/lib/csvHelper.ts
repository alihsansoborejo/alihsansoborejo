import { StudentItem, StaffMember } from '../types';

/**
 * Parses raw CSV string into a 2D array of strings.
 * Supports comma (,) and semicolon (;) as delimiters.
 * Handles quoted cells with escaped quotes ("") and line breaks.
 */
export function parseCSV(text: string): string[][] {
  if (!text || !text.trim()) return [];

  // Remove UTF-8 BOM if present
  let cleanText = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  // Detect delimiter from first non-empty line
  const firstLine = cleanText.split(/\r\n|\n|\r/)[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const delimiter = semicolonCount > commaCount ? ';' : ',';

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote
          currentCell += '"';
          i++; // Skip the second quote
        } else {
          // End of quotes
          insideQuotes = false;
        }
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\r') {
        if (nextChar === '\n') {
          i++; // Skip \n
        }
        currentRow.push(currentCell.trim());
        if (currentRow.some((c) => c !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else if (char === '\n') {
        currentRow.push(currentCell.trim());
        if (currentRow.some((c) => c !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
  }

  // Final cell & row
  if (currentCell !== '' || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Formats a 2D array of strings into CSV format.
 * Automatically wraps cells with quotes if they contain commas, semicolons, quotes, or newlines.
 */
export function generateCSV(headers: string[], rows: (string | number | undefined | null)[][]): string {
  const escapeCell = (val: any): string => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes(';') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escapeCell).join(',');
  const rowLines = rows.map((r) => r.map(escapeCell).join(','));

  return [headerLine, ...rowLines].join('\r\n');
}

/**
 * Triggers a browser download of CSV with UTF-8 BOM so Excel opens properly.
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==========================================
// 1. DATA SISWA CSV TEMPLATE & PARSER
// ==========================================

export const STUDENT_CSV_HEADERS = [
  'NIS',
  'NISN',
  'Nama Siswa',
  'Jenis Kelamin (L/P)',
  'Kelas',
  'Rombel',
  'Tempat Lahir',
  'Tanggal Lahir (YYYY-MM-DD)',
  'Nama Orang Tua / Wali',
  'No HP / WA Orang Tua',
  'Alamat Domisili',
  'Tahun Ajaran',
  'Status (Aktif/Lulus/Pindah/Mutasi)',
  'Catatan'
];

export const STUDENT_CSV_SAMPLE_ROWS = [
  [
    '2024001',
    '3128475921',
    'Ahmad Fauzan Al-Banjari',
    'Laki-laki',
    'Kelas 1',
    '1A',
    'Temanggung',
    '2018-04-12',
    'Muhammad Sholikin',
    '085876543210',
    'Dusun Krajan, Desa Soborejo, Kec. Pringsurat',
    '2024/2025',
    'Aktif',
    'Siswa pindahan TK Muslimat NU'
  ],
  [
    '2024002',
    '3128475922',
    'Nur Aisyah Az-Zahra',
    'Perempuan',
    'Kelas 1',
    '1A',
    'Temanggung',
    '2018-06-25',
    'Supriyanto',
    '081234567891',
    'Dusun Karanglo, Desa Soborejo',
    '2024/2025',
    'Aktif',
    'Juara Mewarnai RA'
  ],
  [
    '2023015',
    '3117584910',
    'Muhammad Rifki Pratama',
    'Laki-laki',
    'Kelas 2',
    '2',
    'Magelang',
    '2017-02-14',
    'Agus Triyono',
    '085712345678',
    'Desa Soborejo, Pringsurat',
    '2024/2025',
    'Aktif',
    'Hafal Juz 30'
  ]
];

export function getStudentCSVTemplate(): string {
  return generateCSV(STUDENT_CSV_HEADERS, STUDENT_CSV_SAMPLE_ROWS);
}

export function parseStudentsFromCSV(csvText: string): {
  students: Omit<StudentItem, 'id'>[];
  errors: string[];
} {
  const rows = parseCSV(csvText);
  const students: Omit<StudentItem, 'id'>[] = [];
  const errors: string[] = [];

  if (rows.length <= 1) {
    return { students: [], errors: ['File CSV kosong atau hanya berisi baris header.'] };
  }

  // Row 0 is header
  const headers = rows[0].map((h) => h.toLowerCase());

  // Map header index dynamically or fallback to standard indices
  const findCol = (keywords: string[]): number => {
    return headers.findIndex((h) => keywords.some((k) => h.includes(k)));
  };

  const idxNis = findCol(['nis', 'induk']);
  const idxNisn = findCol(['nisn']);
  const idxName = findCol(['nama', 'name', 'santri', 'siswa']);
  const idxGender = findCol(['jenis kelamin', 'kelamin', 'gender', 'jk', 'l/p']);
  const idxGrade = findCol(['kelas', 'tingkat', 'grade']);
  const idxClassRoom = findCol(['rombel', 'ruang', 'kelas paralel']);
  const idxBirthPlace = findCol(['tempat lahir', 'tempat']);
  const idxBirthDate = findCol(['tanggal lahir', 'tgl lahir', 'birth date']);
  const idxParent = findCol(['orang tua', 'wali', 'ayah', 'ibu', 'parent']);
  const idxPhone = findCol(['hp', 'telepon', 'wa', 'whatsapp', 'phone']);
  const idxAddress = findCol(['alamat', 'domisili', 'desa', 'address']);
  const idxYear = findCol(['tahun', 'ajaran', 'academic']);
  const idxStatus = findCol(['status']);
  const idxNotes = findCol(['catatan', 'keterangan', 'notes']);

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.length === 0 || row.every((c) => !c.trim())) continue;

    const name = (idxName !== -1 ? row[idxName] : row[2]) || '';
    if (!name.trim()) {
      errors.push(`Baris ${r + 1}: Nama siswa tidak boleh kosong.`);
      continue;
    }

    const nis = (idxNis !== -1 ? row[idxNis] : row[0]) || '';
    const nisn = idxNisn !== -1 ? row[idxNisn] : row[1];

    // Gender parsing
    const rawGender = ((idxGender !== -1 ? row[idxGender] : row[3]) || '').toLowerCase();
    let gender: 'Laki-laki' | 'Perempuan' = 'Laki-laki';
    if (rawGender.startsWith('p') || rawGender.includes('wanita') || rawGender.includes('perempuan')) {
      gender = 'Perempuan';
    }

    // Grade parsing
    let rawGrade = (idxGrade !== -1 ? row[idxGrade] : row[4]) || 'Kelas 1';
    let grade = rawGrade.trim();
    if (/^[1-6]$/.test(grade)) {
      grade = `Kelas ${grade}`;
    } else if (!grade.toLowerCase().startsWith('kelas')) {
      const numMatch = grade.match(/[1-6]/);
      grade = numMatch ? `Kelas ${numMatch[0]}` : 'Kelas 1';
    }

    const classRoom = (idxClassRoom !== -1 ? row[idxClassRoom] : row[5]) || undefined;
    const birthPlace = (idxBirthPlace !== -1 ? row[idxBirthPlace] : row[6]) || undefined;
    const birthDate = (idxBirthDate !== -1 ? row[idxBirthDate] : row[7]) || undefined;
    const parentName = (idxParent !== -1 ? row[idxParent] : row[8]) || undefined;
    const parentPhone = (idxPhone !== -1 ? row[idxPhone] : row[9]) || undefined;
    const address = (idxAddress !== -1 ? row[idxAddress] : row[10]) || undefined;
    const academicYear = (idxYear !== -1 ? row[idxYear] : row[11]) || '2024/2025';

    // Status parsing
    const rawStatus = ((idxStatus !== -1 ? row[idxStatus] : row[12]) || '').toLowerCase();
    let status: StudentItem['status'] = 'Aktif';
    if (rawStatus.includes('lulus')) status = 'Lulus';
    else if (rawStatus.includes('pindah')) status = 'Pindah';
    else if (rawStatus.includes('mutasi')) status = 'Mutasi';

    const notes = (idxNotes !== -1 ? row[idxNotes] : row[13]) || undefined;

    students.push({
      nis: nis.trim(),
      nisn: nisn ? nisn.trim() : undefined,
      name: name.trim(),
      gender,
      grade,
      classRoom: classRoom ? classRoom.trim() : undefined,
      birthPlace: birthPlace ? birthPlace.trim() : undefined,
      birthDate: birthDate ? birthDate.trim() : undefined,
      parentName: parentName ? parentName.trim() : undefined,
      parentPhone: parentPhone ? parentPhone.trim() : undefined,
      address: address ? address.trim() : undefined,
      academicYear: academicYear.trim(),
      status,
      notes: notes ? notes.trim() : undefined,
    });
  }

  return { students, errors };
}

// ==========================================
// 2. DATA GTK (GURU & STAF) CSV TEMPLATE & PARSER
// ==========================================

export const STAFF_CSV_HEADERS = [
  'Nama Lengkap & Gelar',
  'Jabatan / Tugas',
  'Kategori (Pimpinan/Guru Kelas/Guru Bidang Studi/Tenaga Kependidikan)',
  'NIP atau NUPTK',
  'Pendidikan Terakhir',
  'Mata Pelajaran / Bidang Studi',
  'No HP / WhatsApp',
  'Status (Aktif/Tugas Belajar/Cuti)',
  'URL Foto (Opsional)'
];

export const STAFF_CSV_SAMPLE_ROWS = [
  [
    'MUIN, S.Pd.I.',
    'Kepala Madrasah',
    'Pimpinan',
    '-',
    'S1 Pendidikan Agama Islam',
    'Manajerial & Keagamaan',
    '085876543210',
    'Aktif',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
  ],
  [
    'SITI MASYITHOH, S.Pd.',
    'Guru Kelas 1 & Koord. Keagamaan',
    'Guru Kelas',
    '-',
    'S1 PGMI',
    'Tematik Kelas 1 & Tahfidz',
    '081234567890',
    'Aktif',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
  ],
  [
    'AHMAD NUR HUDA, S.Pd.',
    'Guru PJOK & Pembina Olahraga',
    'Guru Bidang Studi',
    '-',
    'S1 Pendidikan Jasmani & Rekreasi',
    'PJOK & Ekstrakurikuler Bulutangkis',
    '085712345678',
    'Aktif',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  ],
  [
    'FATMAWATI, A.Md.',
    'Kepala Tata Usaha & Admin Madrasah',
    'Tenaga Kependidikan',
    '-',
    'D3 Administrasi Perkantoran',
    'Administrasi, Dapodik, & Persuratan',
    '089612345678',
    'Aktif',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80'
  ]
];

export function getStaffCSVTemplate(): string {
  return generateCSV(STAFF_CSV_HEADERS, STAFF_CSV_SAMPLE_ROWS);
}

export function parseStaffFromCSV(csvText: string): {
  staff: Omit<StaffMember, 'id'>[];
  errors: string[];
} {
  const rows = parseCSV(csvText);
  const staff: Omit<StaffMember, 'id'>[] = [];
  const errors: string[] = [];

  if (rows.length <= 1) {
    return { staff: [], errors: ['File CSV kosong atau hanya berisi baris header.'] };
  }

  const headers = rows[0].map((h) => h.toLowerCase());

  const findCol = (keywords: string[]): number => {
    return headers.findIndex((h) => keywords.some((k) => h.includes(k)));
  };

  const idxName = findCol(['nama', 'name', 'guru', 'asatidz']);
  const idxRole = findCol(['jabatan', 'role', 'tugas']);
  const idxCategory = findCol(['kategori', 'category', 'divisi']);
  const idxNip = findCol(['nip', 'nuptk', 'pegawai']);
  const idxEducation = findCol(['pendidikan', 'gelar', 'lulusan', 'education']);
  const idxSubjects = findCol(['mata pelajaran', 'bidang studi', 'mapel', 'subject']);
  const idxPhone = findCol(['hp', 'telepon', 'wa', 'whatsapp', 'phone']);
  const idxStatus = findCol(['status']);
  const idxPhoto = findCol(['foto', 'photo', 'url', 'gambar']);

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.length === 0 || row.every((c) => !c.trim())) continue;

    const name = (idxName !== -1 ? row[idxName] : row[0]) || '';
    if (!name.trim()) {
      errors.push(`Baris ${r + 1}: Nama guru / staf tidak boleh kosong.`);
      continue;
    }

    const role = (idxRole !== -1 ? row[idxRole] : row[1]) || 'Guru';

    // Category parsing
    const rawCategory = ((idxCategory !== -1 ? row[idxCategory] : row[2]) || '').toLowerCase();
    let category: StaffMember['category'] = 'Guru Kelas';
    if (rawCategory.includes('pimpin') || rawCategory.includes('kepala')) {
      category = 'Pimpinan';
    } else if (rawCategory.includes('studi') || rawCategory.includes('bidang') || rawCategory.includes('mapel')) {
      category = 'Guru Bidang Studi';
    } else if (rawCategory.includes('tenaga') || rawCategory.includes('tu') || rawCategory.includes('staf') || rawCategory.includes('administrasi')) {
      category = 'Tenaga Kependidikan';
    } else {
      category = 'Guru Kelas';
    }

    const nipOrNuptk = (idxNip !== -1 ? row[idxNip] : row[3]) || '-';
    const education = (idxEducation !== -1 ? row[idxEducation] : row[4]) || '';
    const subjects = (idxSubjects !== -1 ? row[idxSubjects] : row[5]) || '';
    const phone = (idxPhone !== -1 ? row[idxPhone] : row[6]) || '';

    // Status parsing
    const rawStatus = ((idxStatus !== -1 ? row[idxStatus] : row[7]) || '').toLowerCase();
    let status: StaffMember['status'] = 'Aktif';
    if (rawStatus.includes('tugas') || rawStatus.includes('belajar')) {
      status = 'Tugas Belajar';
    } else if (rawStatus.includes('cuti')) {
      status = 'Cuti';
    }

    const photoUrl = (idxPhoto !== -1 ? row[idxPhoto] : row[8]) || undefined;

    staff.push({
      name: name.trim(),
      role: role.trim(),
      category,
      nipOrNuptk: nipOrNuptk.trim() || '-',
      education: education.trim(),
      subjects: subjects.trim(),
      phone: phone.trim(),
      status,
      photoUrl: photoUrl && photoUrl.trim() ? photoUrl.trim() : 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      order: r * 10,
    });
  }

  return { staff, errors };
}
