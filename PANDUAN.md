# Panduan Lengkap: Aplikasi Stok Barang (GitHub + Vercel + Vercel Blob)

Panduan dari nol sampai aplikasi bisa dipakai di HP.

## 1. Gambaran proyek

Aplikasi stok barang berukuran portrait untuk HP.

| Bagian | Teknologi | Fungsi |
|---|---|---|
| Tampilan dan logika | `index.html` (HTML, CSS, JavaScript) | Daftar barang, stok masuk/keluar, riwayat |
| Backend kecil | `api/upload.js` (Vercel Function) | Menerima foto lalu menyimpannya ke Blob |
| Object storage (cloud) | Vercel Blob | Menyimpan file foto, tiap foto punya URL |
| Data stok (teks) | `localStorage` di browser | Nama, jumlah, riwayat (per perangkat) |
| Penyimpan kode | Git + GitHub | Riwayat versi dan backup |
| Hosting | Vercel (paket Hobby, gratis non-komersial) | Menjalankan aplikasi di internet |

Alur kerjanya:

```
HP --foto--> /api/upload (Vercel Function) --put()--> Vercel Blob
HP <--URL foto-- /api/upload
HP simpan nama, jumlah, URL foto di localStorage
```

## 2. Struktur folder

```
stok-barang/
├── index.html        <- aplikasi
├── package.json      <- daftar library (@vercel/blob)
├── .gitignore        <- file yang tidak ikut ke GitHub
├── README.md
├── PANDUAN.md        <- file ini
└── api/
    └── upload.js     <- backend upload (WAJIB di folder api)
```

## 3. Persiapan alat (sekali saja)

1. Install **Git**: git-scm.com
2. Install **VS Code**: code.visualstudio.com
3. Buat akun **GitHub**: github.com
4. Buat akun **Vercel** nanti di langkah 7 (login pakai GitHub)

Di Git Bash:

```bash
git config --global user.name "Nama Kamu"
git config --global user.email "email-akun-github@gmail.com"
```

## 4. Siapkan proyek

1. Buat folder `stok-barang`, taruh semua file sesuai struktur di atas.
2. Buka folder itu di VS Code (File, Open Folder).
3. Coba tampilan di lokal: install ekstensi **Live Server**, klik kanan `index.html`, pilih **Open with Live Server**.

Di lokal, tampilan dan stok sudah jalan, tetapi **upload foto belum bisa** karena `api/upload.js` hanya jalan di Vercel.

Tips tampilan HP: tekan F12 di browser, lalu klik ikon device toolbar.

## 5. Penjelasan kode singkat

**api/upload.js**
- Menerima gambar dari aplikasi (`POST /api/upload?name=...`)
- Menolak file non-gambar dan ukuran di atas 4 MB
- Memanggil `put()` dari `@vercel/blob`, hasilnya URL publik
- Token `BLOB_READ_WRITE_TOKEN` dibaca otomatis dari environment Vercel

**index.html**
- `load()` dan `save()`: baca dan tulis `localStorage`
- `render()`: menggambar daftar, peringatan stok menipis, dan riwayat
- `shrink()`: mengecilkan foto maksimal 800 px sebelum diunggah (hemat kuota)
- `upload()`: mengirim foto ke `/api/upload` dan mengambil URL-nya
- Jika upload gagal, barang tetap disimpan tanpa foto supaya data tidak hilang

## 6. Push ke GitHub

1. Di github.com klik **New repository**, nama `stok-barang`, **Public**, jangan centang Add a README, lalu Create.
2. Di Git Bash (path berspasi harus pakai tanda kutip, drive D: ditulis `/d/`):

```bash
cd "/d/Perkuliahan/Semester 5/TEKNOLOGI CLOUD COMPUTING/stok-barang"
git init
git add .
git commit -m "versi pertama stok barang"
git branch -M main
git remote add origin https://github.com/USERNAME/stok-barang.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub (bukan nama tampilan). Kalau muncul `remote origin already exists`:

```bash
git remote remove origin
```

lalu ulangi `git remote add`. Saat `git push`, login lewat jendela browser yang muncul.

## 7. Deploy ke Vercel

1. Buka vercel.com, **Sign Up**, **Continue with GitHub**, pilih **Hobby**.
2. **Add New**, **Project**, pilih repo `stok-barang` (jika tidak muncul: Adjust GitHub App Permissions).
3. **Framework Preset**: **Other**. Klik **Deploy**.
4. Tunggu selesai, alamat `xxxx.vercel.app` muncul.

## 8. Buat object storage (Vercel Blob)

1. Di dashboard project, buka tab **Storage**.
2. **Create**, pilih **Blob**, beri nama (misalnya `foto-stok`), pilih region terdekat.
3. Jika ada pilihan akses, pilih **Public** (kode ini menyimpan foto dengan akses publik).
4. Hubungkan store ke project `stok-barang`.
5. Cek di **Settings, Environment Variables** bahwa `BLOB_READ_WRITE_TOKEN` sudah ada.
6. Tab **Deployments**, titik tiga pada deployment teratas, **Redeploy**.

## 9. Pakai di HP

1. Buka `xxxx.vercel.app` di Chrome HP.
2. Tab **Tambah**: isi nama, stok awal, batas minimum, pilih foto, **Simpan barang**.
3. Tab **Stok**: tekan **+ Masuk** atau **- Keluar**. Tab **Riwayat** mencatat semua perubahan.
4. Menu titik tiga, **Tambahkan ke layar utama**.

## 10. Bukti object storage di cloud

Dashboard Vercel, **Storage**, buka store Blob-mu. Folder `stok/` berisi file `.jpg` hasil unggahan. Salin URL salah satu file dan buka di perangkat lain; fotonya tampil dari cloud. Screenshot untuk laporan.

## 11. Update setelah ini

```bash
git add .
git commit -m "tambah fitur X"
git push
```

Vercel akan deploy otomatis.

## 12. Masalah umum

| Gejala | Penyebab dan solusi |
|---|---|
| `cd: too many arguments` | Path berspasi tanpa tanda kutip. Pakai `"..."` |
| `remote origin already exists` | `git remote remove origin`, lalu add ulang |
| Upload: "No token found" | Blob belum terhubung ke project atau belum Redeploy |
| Upload: kode 404 | `upload.js` tidak ada di folder `api/` |
| Error soal access atau private | Buat Blob store baru dengan akses Public |
| Foto gagal tapi barang tersimpan | Memang disengaja. Lihat pesan error di bawah tombol Simpan |
| Tidak bisa buka `localhost:8000` | Server belum jalan. Pakai Live Server |

## 13. Catatan

- Vercel Hobby gratis untuk **non-komersial**. Kuota dan syarat bisa berubah, cek halaman pricing Vercel.
- Alamat upload belum diberi password. Jangan sebarkan alamat aplikasi secara luas.
- Data stok (teks) tersimpan per perangkat. Untuk sinkron antar HP, tambahkan database cloud (Supabase atau Neon).

## 14. Ide pengembangan

Ekspor ke CSV, scan barcode, kategori barang, login pengguna, database cloud.
