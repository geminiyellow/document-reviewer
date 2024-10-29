import { useState, useCallback } from 'react';
import * as GC from '@grapecity/spread-sheets';
import * as ExcelIO from '@grapecity/spread-excelio';

export const useExcelViewer = () => {
  const [workbook, setWorkbook] = useState<GC.Spread.Sheets.Workbook | null>(null);

  const onWorkbookInitialized = useCallback((spread: GC.Spread.Sheets.Workbook) => {
    setWorkbook(spread);
    
    // Initialize default sheet
    const sheet = spread.getActiveSheet();
    sheet.setRowCount(50);
    sheet.setColumnCount(26);
  }, []);

  const onFileAccepted = useCallback((file: File) => {
    if (!workbook) return;

    const excelIO = new ExcelIO.IO();
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      
      excelIO.open(arrayBuffer, (data) => {
        if (data) {
          try {
            workbook.fromJSON(data);
          } catch (error) {
            console.error('Error loading Excel file:', error);
            alert('Unable to load Excel file. Please check the file format.');
          }
        }
      }, (error) => {
        console.error('Error importing Excel file:', error);
        alert('Error importing Excel file');
      });
    };

    reader.readAsArrayBuffer(file);
  }, [workbook]);

  return {
    workbook,
    onWorkbookInitialized,
    onFileAccepted
  };
};