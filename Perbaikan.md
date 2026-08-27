# Catatan Perbaikan Bug & Maintenance GoKas

## [PRIORITY] Perbaikan Step Validation pada Input Nominal Pengeluaran

- **Location**: `index.html` (L-671: `<input type="number" id="expenseNominal">`)
- **Severity**: Medium (Menghambat user saat memasukkan angka bulat standar seperti Rp 50.000)
- **Status**: Selesai (Fixed)
- **Root Cause**: Kombinasi atribut `min="1"` dan `step="500"` menyebabkan algoritma constraint validation bawaan browser HTML5 menghitung kelipatan valid dari rumus `min + (k * step)` = `1 + 500k` (misal: 1, 501, 1001, ..., 49501, 50001). Akibatnya angka nominal bulat seperti 50.000 dianggap tidak valid oleh browser dan memunculkan pesan validasi: *"Dua nilai valid terdekat adalah 49501 dan 50001"*.
- **Solution**: Mengubah atribut `step="500"` menjadi `step="1"` pada input `expenseNominal` (`min="1" step="1"`), sehingga seluruh nilai bilangan bulat positif rupiah (seperti 50.000, 25.000, 10.000, dsb.) dapat diinput secara valid tanpa offset.
- **Target Deadline**: 8 Agustus 2026 (Immediate Fix)

---

## [PRIORITY] Perbaikan Format Angka Sumbu Y Diagram Arus Kas

- **Location**: `script.js` (L-314: `incomeChart` scale options)
- **Severity**: Low / Visual (Membuat bingung pengguna dengan angka aneh seperti `Rp 0.0008rb`, `Rp 0.0006rb`)
- **Status**: Selesai (Fixed)
- **Root Cause**: Callback sumbu Y sebelumnya membagi nilai mentah `v` dengan `1000` secara statis (`v / 1000 + "rb"`). Ketika nominal kas masih bernilai kecil (seperti 0 atau 1) atau saat Chart.js menghasilkan tick pembagian desimal ($0.2, 0.4, 0.6, 0.8, 1.0$), pembagian desimal tersebut menghasilkan angka aneh `Rp 0.0008rb`.
- **Solution**: Mengganti callback dengan pemformat cerdas bersyarat: `v === 0` menampilkan `Rp 0`, jutaan menampilkan `Rp X jt`, ribuan menampilkan `Rp X rb`, dan nilai rupiah bulat normal menampilkan `Rp X`, serta menambahkan `suggestedMax: 20000` dan `precision: 0`.
- **Target Deadline**: 8 Agustus 2026 (Immediate Fix)

---

## [PRIORITY] Perbaikan Tombol Modal Form & Footer Terpotong (Modal Layout Clipping)

- **Location**: `style.css` (L-447: `.modal-container > form`, `.modal-body`, `.modal-footer`)
- **Severity**: Medium (Tombol "Batal" dan "Simpan Pembayaran" terpotong di bagian bawah pada layar dengan ketinggian terbatas)
- **Status**: Selesai (Fixed)
- **Root Cause**: Elemen `<form>` yang membungkus `.modal-body` dan `.modal-footer` di dalam `.modal-container` secara default bertipe `display: block`. Akibatnya, `<form>` tidak mewarisi flex layout dari container sehingga tinggi total form melebihi batas `max-height: 90vh` dan bagian footer terpotong (*clipped*) oleh aturan `overflow: hidden`.
- **Solution**:
  1. Menambahkan aturan flexbox `display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden;` pada `.modal-container > form` dan `.reset-step-pane.active`.
  2. Menambahkan `min-height: 0; flex: 1; overflow-y: auto;` pada `.modal-body`.
  3. Menambahkan `flex-shrink: 0;` pada `.modal-header` dan `.modal-footer` agar judul di atas dan tombol aksi di bawah selalu terkunci terlihat rapi dan tidak pernah terpotong.
- **Target Deadline**: 10 Agustus 2026 (Immediate Fix)

---

## [PRIORITY] Perbaikan Teks Badge Status Terpotong & Tumpang Tindih (Badge Text Wrapping)

- **Location**: `style.css` (L-373: `.badge`), `index.html` (L-300)
- **Severity**: Low / Visual (Teks badge "BELUM BAYAR" terputus menjadi 2 baris sempit dan tampak tumpang tindih)
- **Status**: Selesai (Fixed)
- **Root Cause**: Elemen `.badge` sebelumnya tidak memiliki properti `white-space: nowrap;` dan lebar kolom tabel status hanya `110px`. Ketika ruang tabel menyempit, browser memotong teks `BELUM BAYAR` menjadi dua baris di dalam elemen flexbox badge sehingga teks terlihat berantakan dan bertumpuk.
- **Solution**:
  1. Menambahkan `white-space: nowrap;`, `line-height: 1.2;`, dan `flex-shrink: 0;` pada `.badge` dan badge-badge lainnya di `style.css`.
  2. Menyesuaikan lebar kolom header Status pada tabel kas di `index.html` dari `110px` menjadi `130px` dengan perataan tengah (`text-center`).
- **Target Deadline**: 10 Agustus 2026 (Immediate Fix)
