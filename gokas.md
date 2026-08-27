# Product Requirements Document (PRD)
## Aplikasi Monitoring Uang Kas Kelas

| Atribut | Keterangan |
|---|---|
| Nama Produk | SiKas — Sistem Monitoring Uang Kas Kelas |
| Versi Dokumen | 1.0 |
| Tanggal | 07 Agustus 2026 |
| Jenis Aplikasi | Single Page Application (SPA) — Client-side only |
| Tech Stack | HTML5, CSS3, Vanilla JavaScript (ES6), Chart.js, LocalStorage API |
| Status | Draft untuk pengembangan |

---

## 1. Latar Belakang

Pengelolaan uang kas kelas di sekolah pada umumnya masih dilakukan secara manual menggunakan buku catatan atau spreadsheet sederhana. Cara ini rawan terhadap kesalahan pencatatan, kehilangan data fisik, kesulitan rekap, serta tidak adanya visibilitas real-time terhadap kondisi kas kelas. Bendahara kelas membutuhkan alat bantu digital yang ringan, tidak bergantung pada server/backend, dan dapat langsung digunakan tanpa proses instalasi rumit.

SiKas dirancang sebagai aplikasi web berbasis client-side (HTML, CSS, JavaScript murni) yang menyimpan seluruh data di LocalStorage browser, sehingga dapat dijalankan hanya dengan membuka file `index.html`, cocok digunakan di lingkungan sekolah dengan keterbatasan infrastruktur server.

## 2. Tujuan Produk

1. Memudahkan bendahara kelas mencatat transaksi pembayaran uang kas siswa secara terstruktur.
2. Memberikan visibilitas real-time terhadap kondisi kas kelas (total terkumpul, status pembayaran siswa).
3. Mengurangi kesalahan pencatatan manual melalui validasi input otomatis.
4. Menyediakan laporan yang dapat diekspor (CSV, JSON, PDF) dan dicetak untuk keperluan pertanggungjawaban ke wali kelas/orang tua.
5. Menjamin data tidak hilang melalui mekanisme backup (export) dan restore (import).

## 3. Target Pengguna

| Peran | Kebutuhan Utama |
|---|---|
| Bendahara Kelas (Primary User) | Input, edit, hapus, dan pantau transaksi kas harian |
| Wali Kelas | Melihat laporan/rekap dan hasil cetak |
| Siswa/Orang Tua (tidak langsung) | Menerima laporan hasil export/print sebagai bukti transparansi |

**Catatan:** Aplikasi ini bersifat single-user (tanpa sistem login/role multi-user) karena berjalan sepenuhnya di sisi klien tanpa backend.

## 4. Ruang Lingkup (Scope)

### 4.1 In-Scope
- CRUD data transaksi kas siswa
- Dashboard ringkasan statistik real-time
- Grafik pemasukan kas (Chart.js)
- Pencarian, filter, dan pengurutan data
- Penyimpanan data via LocalStorage
- Export data (CSV, JSON, PDF) dan Import (JSON)
- Cetak laporan (Print)
- Dark mode
- Notifikasi toast, pagination, progress bar, badge status
- Validasi input & konfirmasi hapus

### 4.2 Out-of-Scope
- Autentikasi/login multi-user
- Sinkronisasi data antar-perangkat/cloud
- Backend/database server
- Integrasi payment gateway
- Notifikasi otomatis (email/WhatsApp) ke siswa/orang tua

## 5. Kebutuhan Fungsional (Functional Requirements)

### FR-1 — Manajemen Data Transaksi (CRUD)
| ID | Deskripsi | Prioritas |
|---|---|---|
| FR-1.1 | Sistem dapat menambahkan data transaksi baru dengan ID unik yang digenerate otomatis (mis. timestamp/UUID) | Must |
| FR-1.2 | Sistem menampilkan seluruh data transaksi dalam bentuk tabel | Must |
| FR-1.3 | Sistem dapat mengubah (edit) data transaksi yang sudah ada | Must |
| FR-1.4 | Sistem dapat menghapus data transaksi, disertai dialog konfirmasi | Must |
| FR-1.5 | Setiap data transaksi memuat field: ID, Nama Siswa, Kelas, No. Absen, Nominal, Tanggal Bayar, Status Bayar, Keterangan | Must |

### FR-2 — Dashboard & Statistik
| ID | Deskripsi | Prioritas |
|---|---|---|
| FR-2.1 | Menampilkan total uang kas terkumpul secara real-time | Must |
| FR-2.2 | Menampilkan jumlah siswa sudah bayar & belum bayar | Must |
| FR-2.3 | Menampilkan total transaksi tercatat | Must |
| FR-2.4 | Menampilkan persentase pembayaran (progress bar) | Must |
| FR-2.5 | Menampilkan grafik tren pemasukan kas menggunakan Chart.js | Should |

### FR-3 — Pencarian, Filter, dan Pengurutan
| ID | Deskripsi | Prioritas |
|---|---|---|
| FR-3.1 | Pencarian data berdasarkan nama siswa atau nomor absen (real-time search) | Must |
| FR-3.2 | Filter data berdasarkan status (Sudah Bayar / Belum Bayar / Semua) | Must |
| FR-3.3 | Pengurutan data berdasarkan nama (A-Z/Z-A), tanggal (terbaru/terlama), nominal (tertinggi/terendah) | Should |

### FR-4 — Data Persistence
| ID | Deskripsi | Prioritas |
|---|---|---|
| FR-4.1 | Seluruh data disimpan otomatis ke LocalStorage setiap terjadi perubahan | Must |
| FR-4.2 | Data tetap tersimpan setelah browser ditutup/refresh | Must |

### FR-5 — Export & Import
| ID | Deskripsi | Prioritas |
|---|---|---|
| FR-5.1 | Export data ke format CSV | Must |
| FR-5.2 | Export data ke format JSON (backup) | Must |
| FR-5.3 | Export laporan ke format PDF | Should |
| FR-5.4 | Import data dari file JSON untuk restore backup | Should |
| FR-5.5 | Cetak (print) laporan langsung dari browser | Should |

### FR-6 — Validasi & Keamanan Data
| ID | Deskripsi | Prioritas |
|---|---|---|
| FR-6.1 | Semua field wajib diisi sebelum data dapat disimpan | Must |
| FR-6.2 | Nominal hanya menerima angka positif (tidak boleh negatif/0 atau non-numerik) | Must |
| FR-6.3 | Dialog konfirmasi wajib muncul sebelum proses hapus data dieksekusi | Must |
| FR-6.4 | Pesan error ditampilkan jika validasi gagal | Must |

### FR-7 — UI/UX Interaktif
| ID | Deskripsi | Prioritas |
|---|---|---|
| FR-7.1 | Toast notification muncul setiap proses CRUD berhasil (tambah/edit/hapus) | Must |
| FR-7.2 | Pagination pada tabel data | Must |
| FR-7.3 | Badge warna hijau untuk "Sudah Bayar", merah untuk "Belum Bayar" | Must |
| FR-7.4 | Dark mode toggle dengan preferensi tersimpan | Should |
| FR-7.5 | Sidebar & navbar navigasi antar-section (Dashboard, Data Transaksi, dsb.) | Must |

## 6. Kebutuhan Non-Fungsional (Non-Functional Requirements)

| Kategori | Deskripsi |
|---|---|
| **Performa** | Rendering tabel & dashboard tetap responsif hingga ratusan baris data tanpa lag |
| **Kompatibilitas** | Berjalan baik di Chrome, Firefox, Edge, Safari versi terbaru |
| **Responsivitas** | Tampilan menyesuaikan di desktop, tablet, dan smartphone (mobile-first breakpoints) |
| **Portabilitas** | Dapat dijalankan langsung via `index.html` tanpa server/build tool |
| **Maintainability** | Struktur kode modular (HTML/CSS/JS terpisah), diberi komentar pada fungsi penting |
| **Usability** | Antarmuka intuitif, alur CRUD maksimal 3 klik dari dashboard |
| **Keandalan Data** | Data tidak hilang selama LocalStorage browser tidak dibersihkan manual oleh pengguna |
| **Aksesibilitas** | Kontras warna memadai, elemen interaktif dapat dijangkau dengan keyboard dasar |

## 7. Struktur Data (Data Model)

Data transaksi disimpan sebagai array of object pada LocalStorage dengan key `sikas_data`.

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | String | ID unik, digenerate otomatis (timestamp/UUID) |
| `nama` | String | Nama lengkap siswa |
| `kelas` | String | Nama/kode kelas, mis. "IX-A" |
| `noAbsen` | Number | Nomor absen siswa |
| `nominal` | Number | Jumlah uang kas dibayarkan (positif, tanpa desimal negatif) |
| `tanggalBayar` | String (ISO Date) | Tanggal pembayaran |
| `status` | String (enum) | `"Sudah Bayar"` atau `"Belum Bayar"` |
| `keterangan` | String | Catatan tambahan (opsional secara isi, tetap wajib field terisi minimal "-") |
| `createdAt` | String (ISO Datetime) | Timestamp pencatatan data (audit trail) |
| `updatedAt` | String (ISO Datetime) | Timestamp perubahan terakhir |

Contoh struktur JSON:
```json
{
  "id": "TX-1723027200000",
  "nama": "Ayu Lestari",
  "kelas": "IX-A",
  "noAbsen": 5,
  "nominal": 20000,
  "tanggalBayar": "2026-08-07",
  "status": "Sudah Bayar",
  "keterangan": "Kas minggu ke-1",
  "createdAt": "2026-08-07T09:00:00.000Z",
  "updatedAt": "2026-08-07T09:00:00.000Z"
}
```

## 8. Arsitektur & Struktur Proyek

```
sikas/
├── index.html      # Struktur halaman: sidebar, navbar, dashboard, tabel, modal form
├── style.css        # Styling: layout, warna, komponen, dark mode, responsif
└── script.js         # Logika: CRUD, LocalStorage, chart, filter/sort, export/import, validasi
```

**Prinsip arsitektur:**
- Tidak ada dependency backend; seluruh logika berjalan di browser.
- `script.js` disusun modular per fungsi (mis. `renderTable()`, `renderDashboard()`, `saveToStorage()`, `handleExportCSV()`, dsb.) agar mudah dikembangkan.
- Chart.js dimuat via CDN untuk visualisasi grafik pemasukan.
- Library tambahan (opsional) untuk export PDF, misalnya `jsPDF`, dimuat via CDN.

## 9. Desain UI/UX

### 9.1 Palet Warna
| Warna | Kode Hex | Penggunaan |
|---|---|---|
| Biru (Primary) | `#2563EB` | Tombol utama, aksen navbar/sidebar, grafik |
| Hijau (Success) | `#22C55E` | Badge "Sudah Bayar", indikator positif, progress bar |
| Merah (Danger) | — | Badge "Belum Bayar", aksi hapus |
| Putih | `#FFFFFF` | Background kartu, tabel |
| Abu-abu muda | — | Background halaman, border, elemen non-aktif |

### 9.2 Komponen UI Utama
- **Sidebar** — navigasi ke Dashboard, Data Transaksi, dan pengaturan.
- **Navbar** — judul aplikasi, toggle dark mode, info ringkas.
- **Dashboard Cards** — kartu statistik (total kas, sudah bayar, belum bayar, total transaksi, persentase).
- **Grafik** — chart tren pemasukan kas (line/bar chart Chart.js).
- **Tabel Data** — responsif, dengan sorting header, pagination, badge status berwarna.
- **Modal Form** — form tambah/edit data dengan validasi inline.
- **Toast Notification** — notifikasi sukses/gagal di pojok layar.
- **Progress Bar** — visual persentase siswa yang sudah membayar.

### 9.3 Prinsip Visual
Rounded corners, shadow lembut pada kartu dan modal, transisi/animasi halus (hover, buka-tutup modal), tampilan bersih ala admin dashboard modern.

## 10. User Flow Utama

1. **Tambah Transaksi:** Bendahara klik "Tambah Data" → isi form → validasi → simpan → toast sukses → tabel & dashboard ter-update otomatis.
2. **Edit Transaksi:** Klik ikon edit pada baris tabel → form terisi otomatis (pre-filled) → ubah data → simpan → toast sukses.
3. **Hapus Transaksi:** Klik ikon hapus → dialog konfirmasi muncul → jika disetujui, data terhapus → toast sukses.
4. **Cari/Filter/Urutkan:** Bendahara mengetik nama/no. absen pada search box dan/atau memilih filter status dan opsi sorting → tabel ter-update secara real-time.
5. **Export/Import:** Bendahara memilih format export (CSV/JSON/PDF) → file terunduh; atau memilih file JSON untuk di-import → data lama tergantikan/ditambahkan sesuai konfirmasi.
6. **Cetak Laporan:** Klik tombol Print → browser print dialog menampilkan laporan yang telah diformat rapi.

## 11. Kriteria Penerimaan (Acceptance Criteria)

- [ ] Data yang ditambahkan langsung muncul di tabel dan dashboard tanpa reload halaman.
- [ ] Data tetap ada setelah browser ditutup dan dibuka kembali.
- [ ] Nominal tidak dapat diisi angka negatif atau non-numerik; sistem menampilkan pesan error.
- [ ] Semua field wajib diisi; sistem menolak submit form jika ada field kosong.
- [ ] Penghapusan data hanya terjadi setelah konfirmasi eksplisit dari pengguna.
- [ ] Grafik pemasukan menampilkan data yang sesuai dengan data transaksi terkini.
- [ ] Pencarian, filter, dan sorting berfungsi secara kombinasi (dapat digunakan bersamaan).
- [ ] File export (CSV/JSON/PDF) dapat dibuka kembali dan berisi data yang sesuai.
- [ ] Data hasil import JSON berhasil menggantikan/menambah data pada aplikasi.
- [ ] Tampilan tetap rapi dan fungsional pada lebar layar mobile (±360px), tablet, dan desktop.
- [ ] Dark mode dapat diaktifkan/nonaktifkan dan preferensinya tetap tersimpan.
- [ ] Aplikasi dapat langsung berjalan hanya dengan membuka `index.html` di browser.

## 12. Batasan & Asumsi

- Data bersifat lokal per-browser/per-perangkat; tidak ada sinkronisasi lintas perangkat.
- Kapasitas penyimpanan mengikuti batas LocalStorage browser (umumnya ±5MB), cukup untuk ribuan baris data teks.
- Tidak ada mekanisme login sehingga siapa pun yang mengakses file dapat mengubah data — aplikasi diasumsikan digunakan oleh satu bendahara pada satu perangkat/browser tepercaya.
- Fitur export PDF bergantung pada library eksternal (CDN); memerlukan koneksi internet saat pertama kali dimuat.

## 13. Roadmap Pengembangan Lanjutan (Future Enhancement)

| Fase | Rencana Pengembangan |
|---|---|
| v1.1 | Multi-kelas dalam satu aplikasi (dropdown pilih kelas aktif) |
| v1.2 | Rekap bulanan otomatis & grafik perbandingan antar-bulan |
| v2.0 | Migrasi ke backend ringan (mis. Firebase/Supabase) untuk sinkronisasi multi-perangkat |
| v2.1 | Sistem login sederhana untuk bendahara & wali kelas (role-based) |
| v2.2 | Notifikasi pengingat pembayaran (in-app reminder) |

---

*Dokumen ini menjadi acuan pengembangan teknis pada tahap implementasi (index.html, style.css, script.js) sesuai spesifikasi yang telah disepakati.*