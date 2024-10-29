import React, { useState, useCallback } from 'react';
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import { SpreadSheets, Worksheet } from '@grapecity/spread-sheets-react';
import * as GC from '@grapecity/spread-sheets';
import ExcelDropZone from './components/ExcelDropZone';
import { useExcelViewer } from './hooks/useExcelViewer';

// Initialize SpreadJS license
GC.Spread.Sheets.LicenseKey = 'FREE-LIMITED-KEY';

const ExcelViewer: React.FC = () => {
  const [hasFile, setHasFile] = useState(false);
  const { workbook, onWorkbookInitialized, onFileAccepted } = useExcelViewer();

  const handleFileAccepted = (file: File) => {
    onFileAccepted(file);
    setHasFile(true);
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      {!hasFile && (
        <ExcelDropZone onFileAccepted={handleFileAccepted} />
      )}
      <div className="flex-1">
        <SpreadSheets
          workbookInitialized={onWorkbookInitialized}
          hostStyle={{ width: '100%', height: '100%' }}
          backColor="white"
        >
          <Worksheet name="Sheet1" />
        </SpreadSheets>
      </div>
    </div>
  );
};

export default ExcelViewer;