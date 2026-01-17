import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from './components/DataTable';
import Dashboard from './components/Dashboard';
import './App.css';

// Standarisasi BASE_URL ke Port 5000 sesuai konfigurasi Backend
const API_BASE_URL = 'http://localhost:5000/api';

function App() {
    const [items, setItems] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);

    // READ: Mengambil data dari MySQL
    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/items`);
            setItems(res.data);
        } catch (error) {
            console.error("Gagal mengambil data:", error.message); // Penanganan error detail
        }
    };

    // SYNC: Fungsi untuk memicu sinkronisasi API Rick and Morty
    const handleSync = async () => {
        setLoading(true);
        try {
            // Memanggil endpoint sinkronisasi integral
            const res = await axios.post(`${API_BASE_URL}/sync`);
            alert(res.data.message + " pada: " + res.data.last_sync);
            await fetchData(); // Refresh data setelah sinkronisasi berhasil
        } catch (error) {
            console.error("Gagal sinkronisasi:", error.message);
            // Memberikan feedback jika terjadi ECONNRESET atau masalah jaringan
            alert("Gagal Sinkronisasi: Periksa koneksi internet atau server backend.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="app-container">
            <header className="main-header">
                <div className="header-content">
                    <div className="logo-section">
                        <h1>Telkomsigma - Enterprise Dashboard</h1>
                        <p>Visualisasi & Manajemen Data API</p>
                    </div>
                    <nav className="nav-tabs">
                        <button 
                            className={activeTab === 'dashboard' ? 'tab-btn active' : 'tab-btn'}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            📊 Dashboard
                        </button>
                        <button 
                            className={activeTab === 'management' ? 'tab-btn active' : 'tab-btn'}
                            onClick={() => setActiveTab('management')}
                        >
                            ⚙️ Management Data
                        </button>
                        {/* Tombol Sync Global yang memudahkan operasional */}
                        <button 
                            className="sync-btn" 
                            onClick={handleSync} 
                            disabled={loading}
                        >
                            {loading ? '⏳ Syncing...' : '🔄 Sinkronisasi API'}
                        </button>
                    </nav>
                </div>
            </header>

            <main className="main-content">
                {activeTab === 'dashboard' ? (
                    <div className="fade-in">
                        <h2 className="section-title">Ringkasan Data Analitik</h2>
                        <Dashboard data={items} />
                    </div>
                ) : (
                    <div className="fade-in">
                        <h2 className="section-title">Manajemen Data CRUD</h2>
                        <DataTable items={items} onRefresh={fetchData} />
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;