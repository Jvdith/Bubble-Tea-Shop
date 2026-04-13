import { useState, useEffect } from 'react';
import { getReviews, saveBulkReviews } from '../../services/firebaseService';
import { parseCSV, parseXML, parseXLSX, generateXML, downloadFile, downloadXLSX } from '../../services/dataParser';
import Footer from '../../components/footer/Footer';
import './DataManagement.css';

const DataManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [importedData, setImportedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCurrentReviews();
    }, []);

    const fetchCurrentReviews = async () => {
        setLoading(true);
        const data = await getReviews();
        setReviews(data);
        setLoading(false);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const extension = file.name.split('.').pop().toLowerCase();
        try {
            let data = [];
            if (extension === 'csv') {
                data = await parseCSV(file);
            } else if (extension === 'json') {
                const text = await file.text();
                data = JSON.parse(text);
            } else if (extension === 'xml') {
                const text = await file.text();
                data = parseXML(text);
            } else if (extension === 'xlsx') {
                data = await parseXLSX(file);
            } else {
                setMessage('Unsupported format');
                return;
            }
            setImportedData(data);
            setMessage(`Imported ${data.length} items. You can edit them in the table before saving.`);
        } catch (error) {
            setMessage('Error parsing file: ' + error.message);
        }
    };

    const handleEditImported = (index, field, value) => {
        const newData = [...importedData];
        newData[index][field] = value;
        setImportedData(newData);
    };

    const handleSaveToFirebase = async () => {
        if (importedData.length === 0) return;
        setLoading(true);
        const result = await saveBulkReviews(importedData);
        if (result.success) {
            setMessage(`Successfully saved ${result.count} reviews to Firebase!`);
            setImportedData([]);
            fetchCurrentReviews();
        } else {
            setMessage('Error saving to Firebase: ' + result.error);
        }
        setLoading(false);
    };

    const handleExport = (format) => {
        const dataToExport = reviews.map(({ id, ...rest }) => rest); // Exclude Firebase IDs
        const fileName = `reviews_export.${format}`;

        if (format === 'json') {
            downloadFile(JSON.stringify(dataToExport, null, 2), fileName, 'application/json');
        } else if (format === 'csv') {
            const csv = Papa.unparse(dataToExport);
            downloadFile(csv, fileName, 'text/csv');
        } else if (format === 'xml') {
            const xml = generateXML(dataToExport);
            downloadFile(xml, fileName, 'text/xml');
        } else if (format === 'xlsx') {
            downloadXLSX(dataToExport, fileName);
        }
    };

    return (
        <div className="app-container">
            <main className="admin-main">
                <section className="admin-header">
                    <h1 className="admin-title">Data Management</h1>
                    <p>Import or export reviews in CSV, XML, JSON, or XLSX format.</p>
                </section>

                <div className="admin-panels">
                    {/* IMPORT PANEL */}
                    <div className="admin-card">
                        <h2>1. Import Data</h2>
                        <div className="file-input-wrapper">
                            <input 
                                type="file" 
                                accept=".csv,.xml,.json,.xlsx" 
                                onChange={handleFileUpload}
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="btn-secondary">Choose File</label>
                        </div>
                        {message && <p className="status-message">{message}</p>}

                        {importedData.length > 0 && (
                            <div className="imported-preview">
                                <h3>Preview & Edit (Before Upload)</h3>
                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Author</th>
                                                <th>Rating</th>
                                                <th>Comment</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {importedData.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td><input value={item.author || ''} onChange={(e) => handleEditImported(idx, 'author', e.target.value)} /></td>
                                                    <td><input type="number" min="1" max="5" value={item.rating || 5} onChange={(e) => handleEditImported(idx, 'rating', e.target.value)} /></td>
                                                    <td><input value={item.comment || ''} onChange={(e) => handleEditImported(idx, 'comment', e.target.value)} /></td>
                                                    <td><input value={item.date || ''} onChange={(e) => handleEditImported(idx, 'date', e.target.value)} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <button className="btn-primary" onClick={handleSaveToFirebase} disabled={loading}>
                                    {loading ? 'Saving...' : 'Save all to Firebase'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* EXPORT PANEL */}
                    <div className="admin-card">
                        <h2>2. Export Current Data</h2>
                        <p>Currently storage: {reviews.length} reviews</p>
                        <div className="export-buttons">
                            <button className="btn-export" onClick={() => handleExport('json')}>Download JSON</button>
                            <button className="btn-export" onClick={() => handleExport('csv')}>Download CSV</button>
                            <button className="btn-export" onClick={() => handleExport('xml')}>Download XML</button>
                            <button className="btn-export" onClick={() => handleExport('xlsx')}>Download XLSX</button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default DataManagement;
