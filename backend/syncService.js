const axios = require('axios');
const db = require('./db');

const syncRickAndMorty = async () => {
    try {
        console.log("Memulai sinkronisasi data...");

        // 1. Konsumsi REST API Publik dengan Konfigurasi Timeout
        // Menambahkan timeout 10 detik untuk mencegah error ECONNRESET yang menggantung
        const response = await axios.get('https://rickandmortyapi.com/api/character', {
            timeout: 10000, 
            headers: { 'Accept-Encoding': 'gzip,deflate,compress' } // Memaksa kompresi untuk stabilitas koneksi
        });
        
        const characters = response.data.results;

        // Looping untuk memproses data satu per satu
        for (const char of characters) {
            // 2. Transformasi data agar sesuai kolom (Title, Category, Tanggal)
            const external_id = `rm-${char.id}`;
            const title = char.name;
            const category = char.species; 
            
            // Sanitasi Tanggal agar sesuai standar database MySQL
            const item_date = char.created ? char.created.split('T')[0] : new Date().toISOString().split('T')[0];

            // 3. Logika UPSERT untuk Integritas Data
            await db.query(`
                INSERT INTO items (external_id, title, category, item_date, last_sync_time)
                VALUES (?, ?, ?, ?, NOW())
                ON DUPLICATE KEY UPDATE 
                    title = VALUES(title),
                    category = VALUES(category),
                    item_date = VALUES(item_date),
                    last_sync_time = NOW()
            `, [external_id, title, category, item_date]);
        }

        console.log("Sinkronisasi Berhasil!");
        
        return { 
            success: true, 
            last_sync: new Date().toLocaleString('id-ID'),
            total_items: characters.length 
        };

    } catch (error) {
        // Log error spesifik untuk mempermudah debugging
        if (error.code === 'ECONNRESET') {
            console.error("Gagal Sinkronisasi: Koneksi diputus oleh server eksternal (Network Issue).");
        } else {
            console.error("Gagal Sinkronisasi:", error.message);
        }
        throw error; 
    }
};

module.exports = { syncRickAndMorty };