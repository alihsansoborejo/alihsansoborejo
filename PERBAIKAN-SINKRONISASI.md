# Perbaikan Sinkronisasi Website MI

Perubahan ini memperbaiki data yang lambat/tidak muncul di perangkat lain.

## File yang diubah

1. `src/context/DataContext.tsx`
   - Polling perubahan memakai kolom `updated_at` Supabase (kecil) setiap 10 detik,
     bukan endpoint `/api/data/version` yang selalu 404 di Vercel.
   - Snapshot penuh (~360 KB) hanya diunduh jika `updated_at` benar-benar berubah.
   - Permintaan refresh digabung (tidak menumpuk saat focus/visibility/realtime).
   - Endpoint `/api/*` yang tidak ada tidak lagi dipanggil terus-menerus.
   - SSE `/api/realtime/stream` berhenti mencoba setelah 3 kegagalan.
   - Kanal realtime Supabase hanya satu (sebelumnya ada dua kanal dengan topik sama).
   - Registrasi PPDB langsung menyegarkan penanda versi agar terlihat di perangkat lain.

2. `src/lib/supabase.ts`
   - Retry + timeout saat Supabase cold start / bangun dari pause (521, PGRST002).
   - Fungsi baru `getRemoteStoreUpdatedAt()` untuk deteksi perubahan murah.
   - Fungsi baru `touchStoreUpdatedAt()` untuk memberi tahu perangkat lain.
   - Snapshot cepat juga menggabungkan data PPDB terbaru dari tabelnya.
   - Kanal realtime tidak lagi didaftarkan dua kali.

3. `src/admin/AdminDashboard.tsx`
   - Unggah gambar prestasi, ekstrakurikuler, galeri, thumbnail video, dan fasilitas
     sekarang dikompres sebelum disimpan (tidak lagi base64 mentah).
   - Ini mencegah payload Supabase membengkak dan localStorage penuh.

4. `src/components/AdminLoginModal.tsx`
   - Tombol "Masuk Cepat (Akses Langsung)" dan kotak info "Status Online Database"
     di bagian bawah jendela login dihapus. Login tinggal lewat Google atau kata sandi.
   - Pesan "kata sandi salah" tidak lagi mencetak kata sandi admin di layar publik.

5. `.github/workflows/supabase-keepalive.yml` (baru)
   - Menulis "heartbeat" (`updated_at`) ke Supabase setiap hari agar project
     Free tidak di-pause. Penulisan (bukan sekadar ping status) dipakai karena
     yang dihitung Supabase adalah aktivitas database yang sebenarnya.

## Langkah pemasangan

1. Buka https://supabase.com/dashboard/project/pfaduokywtymqjajfmoh
   dan klik **Restore project** jika statusnya paused.
2. Timpa file di repo GitHub dengan file dari ZIP ini (folder `src/` dan `.github/`).
3. Vercel akan otomatis redeploy setelah commit. Jika tidak, klik **Redeploy**.
4. Buka website, login admin, lalu tekan tombol sinkronisasi ke Supabase sekali
   agar data terbaru dari perangkat admin terkirim.
5. Pastikan workflow Actions "Supabase Keep-Alive" berjalan (tab Actions).

## Catatan penting

- Data terakhir di Supabase bertanggal 23 September 2026. Jika setelah itu Anda
  pernah mengedit dari perangkat admin tetapi perubahan tidak muncul di perangkat
  lain, buka panel admin di perangkat tersebut dan **Ekspor Backup JSON** sebelum
  redeploy. Setelah Supabase aktif kembali, impor/push data tersebut.
- Gambar lama yang sudah terlanjur tersimpan sebagai base64 besar tetap ada.
  Payload akan mengecil setelah gambar diganti lewat panel admin versi baru.
- Kunci admin masih ditulis di kode (`alihsan2025`, `admin123`, dll.). Sebaiknya
  diganti dan dipindahkan ke autentikasi Supabase agar tidak bisa dibaca publik.
- Workflow keep-alive mengubah `updated_at` sekali sehari. Efeknya hanya satu kali
  refresh singkat di perangkat yang sedang terbuka, tidak mengubah konten.
- GitHub menonaktifkan workflow terjadwal pada repo publik yang tidak ada commit
  selama 60 hari. Lakukan commit kecil sesekali, atau jalankan workflow manual
  dari tab Actions.
