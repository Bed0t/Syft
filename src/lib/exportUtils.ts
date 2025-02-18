import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface ExportOptions {
  fileName: string;
  format: 'csv' | 'xlsx' | 'json';
  data: any;
}

const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
  return Object.keys(obj).reduce((acc: Record<string, any>, k: string) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
};

const generateCSV = (data: any): string => {
  const flatData = Array.isArray(data) ? data.map(flattenObject) : [flattenObject(data)];
  const headers = Array.from(new Set(flatData.flatMap(obj => Object.keys(obj))));
  const rows = [headers];

  flatData.forEach(obj => {
    const row = headers.map(header => {
      const value = obj[header];
      return typeof value === 'object' ? JSON.stringify(value) : value ?? '';
    });
    rows.push(row);
  });

  return rows.map(row => row.map(cell => 
    typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
  ).join(',')).join('\n');
};

const generateXLSX = (data: any): Blob => {
  const flatData = Array.isArray(data) ? data.map(flattenObject) : [flattenObject(data)];
  const ws = XLSX.utils.json_to_sheet(flatData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

export const exportData = async ({ fileName, format, data }: ExportOptions): Promise<void> => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullFileName = `${fileName}_${timestamp}`;

    switch (format) {
      case 'csv': {
        const csvContent = generateCSV(data);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${fullFileName}.csv`);
        break;
      }
      case 'xlsx': {
        const blob = generateXLSX(data);
        saveAs(blob, `${fullFileName}.xlsx`);
        break;
      }
      case 'json': {
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        saveAs(blob, `${fullFileName}.json`);
        break;
      }
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

export const generateReport = async (data: any, reportType: string): Promise<Blob> => {
  const flatData = Array.isArray(data) ? data.map(flattenObject) : [flattenObject(data)];
  const wb = XLSX.utils.book_new();

  // Create summary sheet
  const summaryData = [
    ['Report Type', reportType],
    ['Generated At', new Date().toLocaleString()],
    ['Total Records', flatData.length.toString()],
    ['', ''], // Empty row for spacing
    ['Summary Statistics', ''],
  ];

  // Add basic statistics if numerical data exists
  const numericalColumns = Object.keys(flatData[0] || {}).filter(key => 
    typeof flatData[0][key] === 'number'
  );

  numericalColumns.forEach(col => {
    const values = flatData.map(row => row[col]).filter(v => typeof v === 'number');
    if (values.length > 0) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const max = Math.max(...values);
      const min = Math.min(...values);
      
      summaryData.push(
        [`${col} (Average)`, avg.toFixed(2)],
        [`${col} (Max)`, max.toString()],
        [`${col} (Min)`, min.toString()],
        ['', '']
      );
    }
  });

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

  // Create detailed data sheet
  const dataSheet = XLSX.utils.json_to_sheet(flatData);
  XLSX.utils.book_append_sheet(wb, dataSheet, 'Data');

  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}; 