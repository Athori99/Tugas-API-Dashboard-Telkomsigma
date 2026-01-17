# Telkomsigma Fullstack Challenge: KONSUMSI API PUBLIK & DASHBOARD ANALITIK


## Pemenuhan Kriteria Tugas

### 1. Konsumsi API Publik & Penyimpanan Data (Poin 1)
- **Sumber API**: Aplikasi mengonsumsi API publik Rick and Morty secara real-time.
- **Penyimpanan**: Data disimpan ke dalam database MySQL lokal.
- **Struktur Data**: Setiap entri memiliki atribut wajib:
  - **Nama/Title**: Nama karakter.
  - **Tanggal**: Diambil dari properti `created` di API.
  - **Kategori**: Menggunakan properti `species` (Contoh: Human, Alien).

### 2. Fitur Sinkronisasi (Poin 2)
- Dilengkapi dengan fungsi `syncService` yang secara otomatis menarik data dari API publik dan menyimpannya ke database untuk menjamin ketersediaan data secara offline.

### 3. Manajemen Data CRUD (Poin 3)
Fitur administrasi data lengkap pada tab "Management Data":
- **Create**: Menambah entri data baru secara manual.
- **Read**: Menampilkan data dalam tabel yang mendukung fitur **Pencarian (Search)** dan **Pengurutan (Sorting)**.
- **Update**: Mengubah informasi Nama, Kategori, atau Tanggal pada data yang sudah ada.
- **Delete**: Menghapus data dari database secara permanen.

### 4. Dashboard Analitik (Poin 4 & 5)
Halaman Dashboard menyajikan informasi ringkasan yang terpisah dari halaman manajemen data:
- **Pie Chart**: Visualisasi distribusi data berdasarkan kategori (Contoh: Berapa banyak jumlah 'Human' dibanding 'Alien').
- **Column Chart**: Agregasi data yang masuk per tanggal untuk memantau tren harian.
- **Periode Terkini**: Menampilkan ringkasan aktivitas dalam 1 bulan terakhir.

### 5. Filter Tanggal Interaktif (Poin 6)
- Tersedia kontrol **Date Range Picker** (Start Date & End Date) pada Dashboard.
- Filter ini bersifat reaktif, di mana perubahan tanggal akan langsung memperbarui seluruh grafik secara bersamaan.

### 6. Nilai Tambah (Poin 7)
- **Summary Cards**: Menampilkan statistik instan (Total Data, Kategori Terbanyak, Data Terbaru).
- **Optimasi Performa**: Menggunakan React `useMemo` untuk efisiensi pengolahan data pada sisi klien.
- **UX/UI Modern**: Menggunakan desain berbasis kartu (Card-Based Layout) dengan warna korporat Telkomsigma.

## 🛠️ Stack Teknologi

- **Backend**: Node.js & Express.js.
- **Database**: MySQL.
- **Frontend**: React.js (Vite), Axios, Chart.js.
- **Styling**: CSS Modern (Responsive & Fluid Width).

## ⚙️ Cara Instalasi & Menjalankan

1. **Persiapan Database**:
   - Buat database MySQL dengan nama `db_tugas_api_dashboard`.
   - Konfigurasi kredensial database pada file `.env` di folder backend.

2. **Backend**:
   Bash
   cd backend
   npm install
   node index.js

3. Frontend:
    Bash
cd frontend
npm install
npm run dev

Aplikasi dapat diakses di http://localhost:5173.


© 2026 | Dikembangkan oleh ALAHIDIN ATHORI untuk Telkomsigma.