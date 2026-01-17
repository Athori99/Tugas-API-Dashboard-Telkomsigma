const mysql = require('mysql2');
require('dotenv').config();

// Membuat pool koneksi untuk efisiensi resource (Poin 2: High Performance)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tugas_api_dashboard',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verifikasi koneksi secara eksplisit saat server dijalankan
pool.getConnection((err, conn) => {
    if (err) {
        console.error('--- KONEKSI DATABASE GAGAL ---');
        console.error('Pesan Error:', err.message);
        console.error('Kode Error:', err.code); // Membantu identifikasi masalah spesifik
        console.log('-------------------------------');
    } else {
        console.log('✅ Berhasil terhubung ke database MySQL (Tugas API Dashboard)');
        conn.release(); // Mengembalikan koneksi ke pool
    }
});

module.exports = pool.promise();