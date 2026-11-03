# Rencana Implementasi: Sistem Hak Akses (Viewer & Editor Roles)

Rencana ini bertujuan untuk membatasi hak akses pada aplikasi Sistem Pendukung Keputusan (SPK) Toko Ulos. Secara default, siapapun yang membuka web akan masuk sebagai **Viewer (Hanya Lihat)** tanpa kemampuan mengubah atau menghapus data. Pengakses yang memiliki hak **Editor** dapat mengedit data, mengubah matriks perbandingan AHP, serta mengelola dan membagikan link akses Viewer maupun Editor.

---

## 1. Arsitektur & Logika Hak Akses

### A. State Management Hak Akses (`AccessContext` / Custom Hooks)
- **Role Detection pada Load**:
  - Memeriksa parameter URL (misalnya `?role=editor&key=...` atau `?mode=editor`).
  - Jika token/key valid sesuai dengan PIN/Token rahasia yang tersimpan di `localStorage` (atau default token), sistem mengaktifkan status `Editor`.
  - Jika tidak ada token atau token tidak valid, sistem secara otomatis menetapkan role ke `Viewer`.
- **Fitur Beralih Role & Verifikasi**:
  - Viewer dapat beralih ke Editor dengan memasukkan **PIN / Kata Sandi Editor**.
  - Editor dapat mengubah PIN/Kata Sandi akses sewaktu-waktu.
- **Generator Link Berbagi**:
  - **Link Viewer**: URL bersih tanpa token (contoh: `https://.../` atau `?role=viewer`).
  - **Link Editor**: URL dengan token kunci Editor rahasia (contoh: `https://.../?mode=editor&token=...`).

---

## 2. Perubahan Komponen UI & Proteksi Fitur

### A. Badge Status & Tombol Berbagi di Header (`Header.tsx`)
- Menambahkan **Badge Status Hak Akses**:
  - `Viewer (Hanya Lihat)`: Warna abu-abu / biru lembut dengan ikon gembok terbuka/mata.
  - `Editor`: Warna hijau / biru indigo dengan ikon pensil / mahkota.
- Menambahkan tombol **"Bagikan / Hak Akses"** (Share Button) di Header di samping tombol Export.

### B. Modal Pengelolaan Akses (`ShareAccessModal.tsx`)
- **Salin Link Viewer**: Tombol sekali klik untuk menyalin URL bagi pembaca/viewer.
- **Salin Link Editor**: Tombol menyalin URL khusus dengan token langsung ke mode Editor.
- **Mode Beralih (Switch Role)**: Input PIN untuk beralih dari Viewer ke Editor.
- **Ubah PIN Editor**: Fasilitas bagi Editor untuk memperbarui PIN rahasia.

### C. Proteksi Input & Akses di Seluruh Tab
- **Tab AHP (`MetodeAhpTab.tsx`)**:
  - Menyembunyikan / mendisabled slider & dropdown matriks Saaty jika pengguna adalah `Viewer`.
  - Menyembunyikan tombol "Reset Matriks", "Ubah Bobot AHP", atau aksi modifikasi lainnya.
  - Menampilkan pemberitahuan halus *"Mode Viewer: Matriks perbandingan dikunci dan tidak dapat diubah"*.
- **Tab SAW & Komparasi (`KomparasiTab.tsx`, dll)**:
  - Mengunci seluruh kontrol input, tombol hapus/edit alternatif dan kriteria jika pengguna adalah `Viewer`.

---

## 3. Tahapan Eksekusi

1. **Membuat `AccessContext.tsx`**: Logika deteksi URL, penyimpanan PIN rahasia di `localStorage`, state `isEditor`, dan fungsi utilitas link sharing.
2. **Membuat Komponen `ShareAccessModal.tsx`**: Antarmuka modal berbagi link dan verifikasi PIN.
3. **Pembaruan Header & Sidebar**: Integrasi badge status dan tombol Berbagi.
4. **Penerapan Penguncian UI**: Membungkus kontrol edit di `MetodeAhpTab`, `DataMentah`, dan komponen pendukung dengan cek `isEditor`.
5. **Pengujian Build & Uji Coba**: Menjalankan `compile_applet` dan `lint_applet` untuk memastikan kompatibilitas penuh.

---

## 4. Konfirmasi & Verifikasi Pengguna
- Mohon tinjau rencana di atas. Setelah disetujui, eksekusi pembuatan kode akan segera dilakukan.
