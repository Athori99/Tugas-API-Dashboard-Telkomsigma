const express = require('express');
const cors = require('cors');
const db = require('./db'); 
const { syncRickAndMorty } = require('./syncService'); 
require('dotenv').config();

const app = express();

// PENTING: Gunakan PORT 5000 agar sesuai dengan request dari Frontend
const PORT = process.env.PORT || 5000;

// --- KONFIGURASI MIDDLEWARE ---

// PERBAIKAN CORS: Izinkan origin dari frontend Vite Anda
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
})); 

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- LOGGING MIDDLEWARE ---
// Membantu monitoring aktivitas sistem secara real-time di terminal
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// --- DATABASE CONNECTION CHECK ---
// Menampilkan pesan sukses terhubung ke database di terminal
db.getConnection()
    .then(() => console.log("Berhasil terhubung ke database MySQL (Tugas API Dashboard)"))
    .catch(err => console.error("Gagal terhubung ke database:", err.message));

// 1. ENDPOINT SINKRONISASI (INTEGRASI REST API)
app.post('/api/sync', async (req, res) => {
    try {
        const result = await syncRickAndMorty();
        res.json({ 
            success: true, 
            message: "Sync Data Berhasil", 
            last_sync: result.last_sync 
        });
    } catch (error) {
        console.error("SYNC ERROR:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Gagal Sinkronisasi", 
            error: error.message 
        });
    }
});

// 2. FITUR CRUD (CREATE, READ, UPDATE, DELETE)

// READ: Mengambil data untuk Dashboard
app.get('/api/items', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM items ORDER BY updated_at DESC');
        res.json(rows);
    } catch (error) {
        console.error("FETCH ERROR:", error.message);
        res.status(500).json({ message: "Gagal mengambil data", error: error.message });
    }
});

// CREATE: Tambah data manual
app.post('/api/items', async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body kosong" });
        }

        let { title, category, item_date } = req.body;
        
        // Sanitasi tanggal agar sesuai format MySQL YYYY-MM-DD
        if (item_date) item_date = item_date.split('T')[0];

        if (!title || !category || !item_date) {
            return res.status(400).json({ message: "Data tidak lengkap" });
        }

        const external_id = `manual-${Date.now()}`; 
        await db.query(
            'INSERT INTO items (external_id, title, category, item_date, last_sync_time) VALUES (?, ?, ?, ?, NOW())',
            [external_id, title, category, item_date]
        );
        
        res.json({ message: "Data berhasil ditambah" });
    } catch (error) {
        console.error("CREATE ERROR:", error.message); 
        res.status(500).json({ message: "Gagal menyimpan data", error: error.message });
    }
});

// UPDATE: Fitur Edit data
app.put('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let { title, category, item_date } = req.body;
        
        if (item_date) item_date = item_date.split('T')[0];

        if (!title || !category || !item_date) {
            return res.status(400).json({ message: "Data update tidak lengkap" });
        }

        await db.query(
            'UPDATE items SET title = ?, category = ?, item_date = ?, last_sync_time = NOW() WHERE id = ?',
            [title, category, item_date, id]
        );
        res.json({ message: "Data berhasil diubah" });
    } catch (error) {
        console.error("UPDATE ERROR:", error.message);
        res.status(500).json({ message: "Gagal mengubah data", error: error.message });
    }
});

// DELETE: Fitur Hapus data
app.delete('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM items WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Data tidak ditemukan" });
        }

        res.json({ message: "Data berhasil dihapus" });
    } catch (error) {
        console.error("DELETE ERROR:", error.message);
        res.status(500).json({ message: "Gagal menghapus data" });
    }
});

// HANDLING 404
app.use((req, res) => {
    res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
    console.log(`Menunggu request dari frontend...`);
});