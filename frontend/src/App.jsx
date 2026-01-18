import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from './components/DataTable';
import Dashboard from './components/Dashboard';
import './App.css';

// Standarisasi BASE_URL ke Port 5000 sesuai konfigurasi Backend
const API_BASE_URL = 'http://localhost:5000/api';

// --- TAMBAHAN STYLE UNTUK KESAN ENTERPRISE ---
const cardStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    border: '1px solid #e9ecef',
    transition: 'transform 0.2s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
};

function App() {
    const [items, setItems] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);

    // --- LOGIKA ANALITIK TAMBAHAN ---
    const getMostFrequentCategory = (data) => {
        if (!data || data.length === 0) return "-";
        const counts = data.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    };

    // READ: Mengambil data dari MySQL
    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/items`);
            setItems(res.data);
            console.log("Data berhasil dimuat dari server port 5000"); //
        } catch (error) {
            console.error("Gagal mengambil data:", error.message);
        }
    };

    // SYNC: Fungsi untuk memicu sinkronisasi API Rick and Morty
    const handleSync = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/sync`);
            alert(res.data.message + " pada: " + res.data.last_sync);
            await fetchData(); 
        } catch (error) {
            console.error("Gagal sinkronisasi:", error.message);
            alert("Gagal Sinkronisasi: Periksa koneksi internet atau server backend."); //
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
                        {/* --- BAGIAN STAT CARDS BARU --- */}
                        <div className="dashboard-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                            <div style={cardStyle} className="stat-card">
                                <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: '600', letterSpacing: '0.5px' }}>TOTAL DATA</span>
                                <h2 style={{ fontSize: '32px', margin: '10px 0', color: '#007bff' }}>{items.length}</h2>
                                <div style={{ fontSize: '12px', color: '#28a745' }}>● MySQL Connected</div>
                            </div>
                            
                            <div style={cardStyle} className="stat-card">
                                <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: '600', letterSpacing: '0.5px' }}>KATEGORI TERBANYAK</span>
                                <h2 style={{ fontSize: '32px', margin: '10px 0', color: '#343a40' }}>{getMostFrequentCategory(items)}</h2>
                                <div style={{ fontSize: '12px', color: '#007bff' }}>● Real-time Analysis</div>
                            </div>

                            <div style={cardStyle} className="stat-card">
                                <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: '600', letterSpacing: '0.5px' }}>STATUS SERVER</span>
                                <h2 style={{ fontSize: '32px', margin: '10px 0', color: '#28a745' }}>Active</h2>
                                <div style={{ fontSize: '12px', color: '#6c757d' }}>● Port 5000</div>
                            </div>
                        </div>

                        <h2 className="section-title">Visualisasi Tren Data</h2>
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