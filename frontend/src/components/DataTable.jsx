import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

const DataTable = () => {
    // STATE MANAGEMENT
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    // State untuk Sorting & Pagination
    const [sortConfig, setSortConfig] = useState({ key: 'updated_at', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // State untuk Form (Create & Update)
    const [formData, setFormData] = useState({ id: null, title: '', category: '', item_date: '' });
    const [isEditing, setIsEditing] = useState(false);

    // BASE URL - Disesuaikan ke port 5000 sesuai log backend
    const API_URL = 'http://localhost:5000/api/items';

    // API CALLS 
    const fetchData = async () => {
        try {
            // Perbaikan: Menggunakan port 5000 agar tidak ERR_CONNECTION_REFUSED
            const response = await axios.get(API_URL);
            setItems(response.data);
            console.log("Data berhasil dimuat dari server port 5000");
        } catch (error) {
            console.error("Gagal mengambil data. Pastikan Backend di port 5000 menyala:", error);
        }
    };

    useEffect(() => { 
        fetchData(); 
    }, []);

    // LOGIC: SEARCH & SORT
    const processedData = useMemo(() => {
        let filtered = items.filter(item => 
            (item.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (item.category?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        );

        if (sortConfig.key !== null) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [items, searchTerm, sortConfig]);

    // LOGIC: PAGINATION 
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = processedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(processedData.length / itemsPerPage);

    // HANDLERS 
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            title: formData.title,
            category: formData.category,
            item_date: formData.item_date
        };

        try {
            if (isEditing) {
                // Perbaikan: Menggunakan port 5000
                await axios.put(`${API_URL}/${formData.id}`, payload);
                alert("Data berhasil diupdate!");
            } else {
                await axios.post(API_URL, payload);
                alert("Data berhasil ditambah!");
            }
            setFormData({ id: null, title: '', category: '', item_date: '' });
            setIsEditing(false);
            fetchData(); // Refresh tabel secara otomatis
        } catch (error) {
            console.error("Error detail:", error.response?.data || error.message);
            alert("Gagal menyimpan data. Pastikan database MySQL aktif.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Hapus data ini?")) {
            try {
                // Perbaikan: Menggunakan port 5000
                await axios.delete(`${API_URL}/${id}`);
                fetchData(); // Refresh tabel secara otomatis
            } catch (error) {
                console.error("Gagal menghapus:", error);
            }
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#007bff' }}>Telkomsigma - Enterprise Dashboard</h2>

            {/* SEARCH SECTION */}
            <div style={{ marginBottom: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Cari Nama atau Kategori..." 
                    value={searchTerm} 
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
            </div>

            {/* FORM SECTION */}
            <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #ddd' }}>
                <h3 style={{ marginTop: 0 }}>{isEditing ? "🔧 Edit Data" : "➕ Tambah Data Manual"}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input type="text" placeholder="Nama" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    <input type="text" placeholder="Kategori" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    <input type="date" value={formData.item_date} onChange={(e) => setFormData({...formData, item_date: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    <button type="submit" style={{ backgroundColor: isEditing ? '#ffc107' : '#007bff', color: 'white', border: 'none', padding: '8px 20px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
                        {isEditing ? "Update" : "Simpan"}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={() => { setIsEditing(false); setFormData({ id: null, title: '', category: '', item_date: '' }); }} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '8px 20px', cursor: 'pointer', borderRadius: '4px' }}>
                            Batal
                        </button>
                    )}
                </form>
            </div>

            {/* TABLE SECTION */}
            <div style={{ overflowX: 'auto' }}>
                <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
                        <tr>
                            <th onClick={() => setSortConfig({ key: 'title', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })} style={{ cursor: 'pointer' }}>Nama ↕</th>
                            <th onClick={() => setSortConfig({ key: 'category', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })} style={{ cursor: 'pointer' }}>Kategori ↕</th>
                            <th>Tanggal</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td>{item.title}</td>
                                    <td>{item.category}</td>
                                    <td>{item.item_date}</td>
                                    <td>
                                        <button onClick={() => { 
                                            setFormData({
                                                ...item,
                                                item_date: item.item_date ? item.item_date.split('T')[0] : ''
                                            }); 
                                            setIsEditing(true); 
                                        }} style={{ backgroundColor: 'transparent', color: '#ffc107', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' }}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} style={{ backgroundColor: 'transparent', color: '#dc3545', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Data tidak ditemukan</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION SECTION */}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    style={{ padding: '5px 15px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                    Prev
                </button>
                <span style={{ fontWeight: 'bold' }}>Halaman {currentPage} dari {totalPages || 1}</span>
                <button 
                    disabled={currentPage === totalPages || totalPages === 0} 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    style={{ padding: '5px 15px', cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default DataTable;