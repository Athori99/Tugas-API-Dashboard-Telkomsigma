import React, { useState, useMemo } from 'react';
import axios from 'axios'; // Import axios untuk integrasi REST API
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = ({ data }) => {
    const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSyncing, setIsSyncing] = useState(false); // State untuk feedback loading

    // --- FUNGSI BARU: SINKRONISASI API (REST API Integration) ---
    const handleSync = async () => {
        setIsSyncing(true);
        try {
            // Mengambil data dari API eksternal sesuai kualifikasi REST API
            const response = await axios.get('https://rickandmortyapi.com/api/character');
            const characters = response.data.results;

            // Mengirim data ke backend untuk disimpan dengan logika Upsert di MySQL
            const syncResponse = await axios.post('http://localhost:5000/api/sync', characters);

            if (syncResponse.data.success) {
                alert("Sinkronisasi Berhasil! Integritas data terjaga.");
                window.location.reload(); // Memperbarui tampilan secara responsif
            }
        } catch (error) {
            console.error("Gagal sinkronisasi:", error);
            alert("Terjadi kesalahan pada integrasi sistem eksternal.");
        } finally {
            setIsSyncing(false);
        }
    };

    // OPTIMASI PERFORMA: useMemo tetap dipertahankan untuk menjamin High Performance
    const filteredData = useMemo(() => {
        return data.filter(item => {
            const itemDate = new Date(item.item_date).getTime();
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).setHours(23, 59, 59, 999);
            return itemDate >= start && itemDate <= end;
        });
    }, [data, startDate, endDate]);

    const summary = useMemo(() => {
        if (filteredData.length === 0) return { total: 0, topCategory: '-', latest: '-' };
        const counts = {};
        filteredData.forEach(item => counts[item.category] = (counts[item.category] || 0) + 1);
        const topCat = Object.entries(counts).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
        const latestEntry = [...filteredData].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
        return { total: filteredData.length, topCategory: topCat, latest: latestEntry ? latestEntry.title : '-' };
    }, [filteredData]);

    const colors = { primary: '#0056b3', secondary: '#00a1ff', accent: '#4bc0c0', bg: '#f8f9fa' };

    return (
        <div>
            {/* 1. SECTION RINGKASAN DATA */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={cardSummaryStyle}>
                    <p style={labelStyle}>Total Data</p>
                    <h2 style={valueStyle}>{summary.total}</h2>
                </div>
                <div style={cardSummaryStyle}>
                    <p style={labelStyle}>Kategori Terbanyak</p>
                    <h2 style={valueStyle}>{summary.topCategory}</h2>
                </div>
                <div style={cardSummaryStyle}>
                    <p style={labelStyle}>Data Terbaru</p>
                    <h2 style={{ ...valueStyle, fontSize: '18px' }}>{summary.latest}</h2>
                </div>
            </div>

            {/* 2. FILTER TANGGAL & TOMBOL SYNC (Penambahan Baru) */}
            <div style={filterBoxStyle}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flex: 1 }}>
                    <span style={{ fontWeight: 'bold' }}>📅 Range Analitik:</span>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
                    <span>sampai</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
                </div>
                
                {/* Tombol Sinkronisasi untuk menunjukkan kemampuan integrasi sistem integral */}
                <button 
                    onClick={handleSync} 
                    disabled={isSyncing}
                    style={syncButtonStyle}
                >
                    {isSyncing ? '⏳ Syncing...' : '🔄 Sinkronisasi API'}
                </button>
            </div>

            {/* 3. CHARTS */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px' }}>
                <div style={chartCardStyle}>
                    <h4 style={{ textAlign: 'center' }}>Proporsi Kategori</h4>
                    <Pie data={{
                        labels: Object.keys(filteredData.reduce((acc, curr) => {
                            acc[curr.category] = (acc[curr.category] || 0) + 1;
                            return acc;
                        }, {})),
                        datasets: [{ 
                            data: Object.values(filteredData.reduce((acc, curr) => {
                                acc[curr.category] = (acc[curr.category] || 0) + 1;
                                return acc;
                            }, {})),
                            backgroundColor: [colors.primary, colors.secondary, colors.accent, '#ffce56', '#9966ff'] 
                        }]
                    }} />
                </div>

                <div style={{ ...chartCardStyle, flex: 1 }}>
                    <h4 style={{ textAlign: 'center' }}>Tren Pemasukan Data</h4>
                    <Bar data={{
                        labels: Array.from(new Set(filteredData.map(d => new Date(d.item_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })))),
                        datasets: [{ 
                            label: 'Jumlah', 
                            data: Object.values(filteredData.reduce((acc, curr) => {
                                const d = new Date(curr.item_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                                acc[d] = (acc[d] || 0) + 1;
                                return acc;
                            }, {})),
                            backgroundColor: colors.primary 
                        }]
                    }} />
                </div>
            </div>
        </div>
    );
};

// Objek Gaya CSS (Styling)
const cardSummaryStyle = { flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '5px solid #0056b3' };
const labelStyle = { margin: 0, color: '#666', fontSize: '14px' };
const valueStyle = { margin: '10px 0 0 0', color: '#333' };
const filterBoxStyle = { backgroundColor: '#e9ecef', padding: '15px', borderRadius: '8px', marginBottom: '25px', display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'space-between' };
const inputStyle = { padding: '5px 10px', borderRadius: '4px', border: '1px solid #ccc' };
const chartCardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', minWidth: '350px' };

// Gaya baru untuk tombol sinkronisasi sesuai brand Telkomsigma
const syncButtonStyle = {
    backgroundColor: '#dc3545', // Warna merah khas brand Telkomsigma
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s'
};

export default Dashboard;