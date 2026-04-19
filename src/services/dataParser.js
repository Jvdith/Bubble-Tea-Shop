import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import YAML from 'yaml';

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

export const parseTSV = (file) => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            delimiter: '\t',
            complete: (results) => resolve(results.data),
            error: (error) => reject(error)
        });
    });
};

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

export const parseHTML = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const result = [];
    const rows = doc.querySelectorAll('tr');
    
    rows.forEach((row) => {
        if (row.querySelector('th')) return;
        const cols = row.querySelectorAll('td');
        if (cols.length >= 4) {
            result.push({
                author: cols[0].textContent,
                rating: cols[1].textContent,
                comment: cols[2].textContent,
                date: cols[3].textContent
            });
        }
    });

    return result;
};

export const parseYAML = (yamlString) => {
    return YAML.parse(yamlString) || [];
};

export const parseSpreadsheet = (file) => {
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

export const generateHTML = (data) => {
    let html = '<!DOCTYPE html>\n<html>\n<head>\n<title>Exported Data</title>\n</head>\n<body>\n<table>\n';
    html += '  <thead>\n    <tr><th>Author</th><th>Rating</th><th>Comment</th><th>Date</th></tr>\n  </thead>\n  <tbody>\n';
    data.forEach((item) => {
        html += '    <tr>\n';
        html += `      <td>${item.author || ''}</td>\n`;
        html += `      <td>${item.rating || ''}</td>\n`;
        html += `      <td>${item.comment || ''}</td>\n`;
        html += `      <td>${item.date || ''}</td>\n`;
        html += '    </tr>\n';
    });
    html += '  </tbody>\n</table>\n</body>\n</html>';
    return html;
};

export const generateYAML = (data) => {
    return YAML.stringify(data);
};

export const downloadFile = (content, fileName, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
};

export const downloadSpreadsheet = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reviews");
    XLSX.writeFile(workbook, fileName);
};
