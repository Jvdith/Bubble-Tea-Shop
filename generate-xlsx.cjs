const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const data = [
    { author: "Elena Rivas", rating: 5, comment: "Me encanta el local!", date: "2026-04-05" },
    { author: "Ricardo Sanz", rating: 3, comment: "Caro pero bueno.", date: "2026-04-04" }
];

const worksheet = XLSX.utils.json_to_sheet(data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Reviews");

const outPath = path.join(__dirname, 'public', 'datos.xlsx');
XLSX.writeFile(workbook, outPath);

console.log('XLSX created at:', outPath);
