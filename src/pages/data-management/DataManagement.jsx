import { useState } from 'react';
import { parseCSV, parseXML, parseXLSX, generateXML, downloadFile, downloadXLSX } from '../../services/dataParser';
import Footer from '../../components/footer/Footer';
import Papa from 'papaparse';
import './DataManagement.css';

const DataManagement = () => {
    const [importedData, setImportedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const showMsg = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const extension = file.name.split('.').pop().toLowerCase();
        setLoading(true);
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
                showMsg('error', 'Unsupported format');
                setLoading(false);
                return;
            }

            // Map to internal format
            const sanitized = data.filter(row => row.author || row.comment || row.rating).map(row => ({
                author: row.author || row.autor || 'Anonymous',
                rating: Number(row.rating || row.calificacion || 5),
                comment: row.comment || row.comentario || '',
                date: row.date || row.fecha || new Date().toISOString().split('T')[0]
            }));

            setImportedData(sanitized);
            showMsg('success', `Imported ${sanitized.length} items. You can now edit and export them.`);
        } catch (error) {
            showMsg('error', 'Error parsing file: ' + error.message);
        }
        setLoading(false);
    };

    const handleEditImported = (index, field, value) => {
        const newData = [...importedData];
        newData[index][field] = value;
        setImportedData(newData);
    };

    const handleExport = (format) => {
        if (importedData.length === 0) {
            showMsg('error', 'No data to export. Please import a file first.');
            return;
        }

        const dataToExport = importedData.map(item => ({
            ...item,
            rating: isNaN(Number(item.rating)) ? 5 : Number(item.rating)
        }));

        const fileName = `converted_data.${format}`;

        try {
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
            showMsg('success', `Exported as ${format.toUpperCase()} successfully.`);
        } catch (error) {
            showMsg('error', 'Export failed: ' + error.message);
        }
    };

    const handleClear = () => {
        if (window.confirm('Clear all imported data?')) {
            setImportedData([]);
            showMsg('success', 'Data cleared.');
        }
    };

    return (
        <div className="app-container">
            <main className="admin-main">
                <section className="admin-header">
                    <h1 className="admin-title">File Format Converter</h1>
                    <p>Import a file, edit the contents, and export to any supported format.</p>
                </section>

                <div className="converter-container">
                    {/* STEP 1: IMPORT */}
                    <div className="admin-card">
                        <h2>1. Import Input File</h2>
                        <div className="file-input-wrapper">
                            <input 
                                type="file" 
                                accept=".csv,.xml,.json,.xlsx" 
                                onChange={handleFileUpload}
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="btn-secondary">Choose File (CSV, XML, JSON, XLSX)</label>
                        </div>

                        {message.text && (
                            <div className={`status-message ${message.type}`}>
                                {message.text}
                            </div>
                        )}
                    </div>

                    {/* STEP 2: PREVIEW & EDIT */}
                    {importedData.length > 0 && (
                        <div className="admin-card">
                            <div className="card-header">
                                <h2>2. Preview & Edit Data</h2>
                                <button className="btn-text" onClick={handleClear}>Clear Everything</button>
                            </div>
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
                                                <td><input value={item.author} onChange={(e) => handleEditImported(idx, 'author', e.target.value)} /></td>
                                                <td><input type="number" min="1" max="5" value={item.rating} onChange={(e) => handleEditImported(idx, 'rating', e.target.value)} /></td>
                                                <td><input value={item.comment} onChange={(e) => handleEditImported(idx, 'comment', e.target.value)} /></td>
                                                <td><input value={item.date} onChange={(e) => handleEditImported(idx, 'date', e.target.value)} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: EXPORT */}
                    {importedData.length > 0 && (
                        <div className="admin-card">
                            <h2>3. Export Filtered Data</h2>
                            <p>Choose your desired output format:</p>
                            <div className="export-buttons-grid">
                                <button className="btn-export-final" onClick={() => handleExport('json')}>
                                    <span className="icon">📄</span> Export as JSON
                                </button>
                                <button className="btn-export-final" onClick={() => handleExport('csv')}>
                                    <span className="icon">📊</span> Export as CSV
                                </button>
                                <button className="btn-export-final" onClick={() => handleExport('xml')}>
                                    <span className="icon">📜</span> Export as XML
                                </button>
                                <button className="btn-export-final" onClick={() => handleExport('xlsx')}>
                                    <span className="icon">📉</span> Export as XLSX
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default DataManagement;
