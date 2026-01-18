# Enterprise Dashboard - API Integration & Data Management
**Tugas Seleksi Full Stack Developer - Telkomsigma**

Aplikasi Dashboard Enterprise yang mengintegrasikan REST API eksternal (Rick and Morty API) dengan database internal MySQL secara integral. Aplikasi ini dirancang untuk menunjukkan kemampuan manajemen data CRUD, sinkronisasi API, dan visualisasi analitik data.

## 🚀 Fitur Utama
* **API Synchronization**: Sinkronisasi data otomatis dari API eksternal ke database MySQL dengan logika *Upsert* (Insert or Update).
* **Real-time Analytics**: Dashboard visual yang menampilkan tren data dan proporsi kategori secara dinamis.
* **Management Data (CRUD)**: Fitur lengkap untuk Menambah, Melihat, Mengubah, dan Menghapus data secara manual.
* **Resilient Backend**: Penanganan error jaringan (ECONNRESET) dan kebijakan keamanan CORS yang terintegrasi.
* **Responsive UI**: Antarmuka modern yang dibangun dengan React dan Bootstrap.

## 🛠️ Stack Teknologi
* **Frontend**: React.js, Axios, Chart.js/Recharts.
* **Backend**: Node.js, Express.js.
* **Database**: MySQL (MariaDB).
* **API Source**: Rick and Morty Public API.

## 📋 Prasyarat Sistem
* Node.js (versi 14 atau terbaru)
* XAMPP / MySQL Server
* Web Browser (Chrome/Edge)

## ⚙️ Instalasi & Konfigurasi

### 1. Database
* Nyalakan MySQL di XAMPP.
* Buat database baru melalui phpMyAdmin dengan nama: `tugas_api_dashboard`.
* Import struktur tabel (jika ada file SQL) atau biarkan sistem melakukan migrasi awal.

### 2. Backend
* Masuk ke folder backend.
* Buat file `.env` dan sesuaikan konfigurasinya:
    ```env
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=tugas_api_dashboard
    ```
* Jalankan perintah:
    ```bash
    npm install
    node index.js
    ```

### 3. Frontend
* Masuk ke folder frontend.
* Jalankan perintah:
    ```bash
    npm install
    npm run dev
    ```
* Akses aplikasi melalui `http://localhost:5173`.

## 🛡️ Penanganan Kendala (Troubleshooting)
Selama pengembangan, beberapa kendala teknis telah diatasi secara integral:
* **Port Conflict**: Memindahkan backend ke port 5000 untuk menghindari tabrakan dengan port pengembangan frontend.
* **Network Resilience**: Implementasi timeout dan error handling pada Axios untuk menangani kegagalan koneksi API eksternal.
* **CORS Policy**: Pengaturan middleware CORS untuk mengizinkan komunikasi lintas asal antara frontend dan backend secara aman.

---
**Kontak & Portofolio**
* **Nama**: [Nama Anda]
* **Posisi**: Candidate Full Stack Developer - Telkomsigma