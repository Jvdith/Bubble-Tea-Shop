import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Parses CSV file to JSON
 */
export const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data),
            error: (error) => reject(error)
        });
    });
};

/**
 * Parses XML file to JSON
 */
export const parseXML = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const reviews = xmlDoc.querySelectorAll('review');
    const result = [];

    reviews.forEach((review) => {
        result.push({
            author: review.querySelector('author')?.textContent || '',
            rating: review.querySelector('rating')?.textContent || '5',
            comment: review.querySelector('comment')?.textContent || '',
            date: review.querySelector('date')?.textContent || ''
        });
    });

    return result;
};

/**
 * Parses XLSX file to JSON
 */
export const parseXLSX = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                resolve(json);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Generates XML string from JSON data
 */
export const generateXML = (data) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<reviews>\n';
    data.forEach((item) => {
        xml += '  <review>\n';
        xml += `    <author>${item.author || ''}</author>\n`;
        xml += `    <rating>${item.rating || ''}</rating>\n`;
        xml += `    <comment>${item.comment || ''}</comment>\n`;
        xml += `    <date>${item.date || ''}</date>\n`;
        xml += '  </review>\n';
    });
    xml += '</reviews>';
    return xml;
};

/**
 * Triggers a file download
 */
export const downloadFile = (content, fileName, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
};

/**
 * Downloads XLSX file
 */
export const downloadXLSX = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reviews");
    XLSX.writeFile(workbook, fileName);
};
