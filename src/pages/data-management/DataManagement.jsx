import { useState } from 'react';
import { parseCSV, parseTSV, parseXML, parseHTML, parseYAML, parseSpreadsheet, generateXML, generateHTML, generateYAML, downloadFile, downloadSpreadsheet } from '../../services/dataParser';
import { getReviews, addReview, updateReview } from '../../services/firebaseService';
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
            } else if (extension === 'tsv') {
                data = await parseTSV(file);
            } else if (extension === 'json') {
                const text = await file.text();
                data = JSON.parse(text);
            } else if (extension === 'xml') {
                const text = await file.text();
                data = parseXML(text);
            } else if (extension === 'html') {
                const text = await file.text();
                data = parseHTML(text);
            } else if (extension === 'yaml' || extension === 'yml') {
                const text = await file.text();
                data = parseYAML(text);
            } else if (['xlsx', 'xls', 'ods'].includes(extension)) {
                data = await parseSpreadsheet(file);
            } else {
                showMsg('error', 'Unsupported format');
                setLoading(false);
                return;
            }

            
            const sanitized = data.filter(row => row.author || row.comment || row.rating).map(row => ({
                author: row.author || row.autor || 'Anonymous',
                rating: Number(row.rating || row.calificacion || 5),
                comment: row.comment || row.comentario || '',
                date: row.date || row.fecha || new Date().toISOString().split('T')[0]
            }));

            setImportedData(sanitized);
            showMsg('success', `Imported ${sanitized.length} items. You can now save them to Firebase or export.`);
        } catch (error) {
            showMsg('error', 'Error parsing file: ' + error.message);
        }
        setLoading(false);
    };

    const handleLoadFromFirebase = async () => {
        setLoading(true);
        try {
            const data = await getReviews();
            if (data.length === 0) {
                showMsg('info', 'No reviews found in Firebase.');
            } else {
                setImportedData(data);
                showMsg('success', `Loaded ${data.length} reviews from Firebase.`);
            }
        } catch (error) {
            showMsg('error', 'Error loading from Firebase: ' + error.message);
        }
        setLoading(false);
    };

    const handleSaveToFirebase = async () => {
        if (importedData.length === 0) {
            showMsg('error', 'No data to save.');
            return;
        }
        setLoading(true);
        try {
            let successCount = 0;
            let updateCount = 0;
            for (const item of importedData) {
                if (item.id) {
                    const res = await updateReview(item.id, item);
                    if (res.success) updateCount++;
                } else {
                    const res = await addReview(item);
                    if (res.success) successCount++;
                }
            }
            showMsg('success', `Successfully saved! Added: ${successCount}, Updated: ${updateCount}`);
        } catch (error) {
            showMsg('error', 'Error saving to Firebase: ' + error.message);
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
            showMsg('error', 'No data to export. Please load data first.');
            return;
        }

        const dataToExport = importedData.map(item => ({
            ...item,
            rating: isNaN(Number(item.rating)) ? 5 : Number(item.rating)
        }));

        
        const cleanData = dataToExport.map(({ id, ...rest }) => rest);

        const fileName = `app_data_export.${format}`;

        try {
            if (format === 'json') {
                downloadFile(JSON.stringify(cleanData, null, 2), fileName, 'application/json');
            } else if (format === 'csv') {
                const csv = Papa.unparse(cleanData);
                downloadFile(csv, fileName, 'text/csv');
            } else if (format === 'tsv') {
                const tsv = Papa.unparse(cleanData, { delimiter: '\t' });
                downloadFile(tsv, fileName, 'text/tsv');
            } else if (format === 'xml') {
                const xml = generateXML(cleanData);
                downloadFile(xml, fileName, 'text/xml');
            } else if (format === 'html') {
                const html = generateHTML(cleanData);
                downloadFile(html, fileName, 'text/html');
            } else if (format === 'yaml') {
                const yamlStr = generateYAML(cleanData);
                downloadFile(yamlStr, fileName, 'text/yaml');
            } else if (['xlsx', 'xls', 'ods'].includes(format)) {
                downloadSpreadsheet(cleanData, fileName);
            }
            showMsg('success', `Exported as ${format.toUpperCase()} successfully.`);
        } catch (error) {
            showMsg('error', 'Export failed: ' + error.message);
        }
    };

    const handleClear = () => {
        if (window.confirm('Clear all data from the table?')) {
            setImportedData([]);
            showMsg('success', 'Data cleared from view.');
        }
    };

    return (
        <div className="app-container">
            <main className="admin-main">
                <section className="admin-header">
                    <h1 className="admin-title">Data Management</h1>
                    <p>Import a file, load from Firebase, edit the contents, and export to any supported format or save online.</p>
                </section>

                <div className="converter-container">
                    
                    <div className="admin-card">
                        <h2>1. Select Data Source</h2>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                            <div className="file-input-wrapper" style={{ margin: 0 }}>
                                <input 
                                    type="file" 
                                    accept=".csv,.xml,.json,.xlsx,.xls,.ods,.tsv,.html,.yaml,.yml" 
                                    onChange={handleFileUpload}
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="btn-secondary"> Import Local File</label>
                            </div>
                            <span style={{ fontWeight: 'bold' }}>OR</span>
                            <button className="btn-secondary" onClick={handleLoadFromFirebase} disabled={loading}>
                                 Load from Firebase
                            </button>
                        </div>
                        <p style={{marginTop: '1rem', fontSize: '0.85rem', color: 'gray'}}>
                            <strong>Supported Import Formats:</strong> .JSON, .CSV, .TSV, .XML, .HTML, .YAML, .XLSX, .XLS, .ODS
                        </p>

                        {message.text && (
                            <div className={`status-message ${message.type}`} style={{marginTop:'1.5rem'}}>
                                {message.text}
                            </div>
                        )}
                    </div>

                    
                    {importedData.length > 0 && (
                        <div className="admin-card">
                            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                <h2 style={{margin: 0}}>2. Preview & Edit Data</h2>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button className="btn-primary" onClick={handleSaveToFirebase} disabled={loading}>
                                        Save to Firebase
                                    </button>
                                    <button className="btn-text" onClick={handleClear}>Clear View</button>
                                </div>
                            </div>
                            <div className="table-wrapper" style={{marginTop: '1rem'}}>
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

                    
                    {importedData.length > 0 && (
                        <div className="admin-card">
                            <h2>3. Export Filtered Data</h2>
                            <p>Choose your desired output format for local download:</p>
                            <div className="export-buttons-grid">
                                <button className="btn-export-final" onClick={() => handleExport('json')}>
                                    Export JSON
                                </button>
                                <button className="btn-export-final" onClick={() => handleExport('csv')}>
                                    Export CSV
                                </button>
                                <button className="btn-export-final" onClick={() => handleExport('tsv')}>
                                    Export TSV
                                </button>
                                <button className="btn-export-final" onClick={() => handleExport('xml')}>
                                    Export XML
                                </button>
                                <button className="btn-export-final" onClick={() => handleExport('html')}>
                                    Export HTML
                                </button>
                                <button className="btn-export-final" onClick={() => handleExport('yaml')}>
                                    Export YAML
                                </button>
                                <button className="btn-export-final" onClick={() => handleExport('xlsx')}>
                                    Export XLSX
                                </button>
                                <button className="btn-export-final" onClick={() => handleExport('xls')}>
                                    Export XLS
                                </button>
                                <button className="btn-export-final" onClick={() => handleExport('ods')}>
                                    Export ODS
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
