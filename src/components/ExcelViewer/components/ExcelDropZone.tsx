import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface ExcelDropZoneProps {
  onFileAccepted: (file: File) => void;
}

const ExcelDropZone: React.FC<ExcelDropZoneProps> = ({ onFileAccepted }) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx')) {
      alert('Please upload an .xlsx file');
      return;
    }

    onFileAccepted(file);
  }, [onFileAccepted]);

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${
        isDragging ? 'bg-blue-50' : 'bg-gray-50'
      } transition-colors duration-200 z-10`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center p-8 rounded-lg border-2 border-dashed border-gray-300">
        <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-lg text-gray-600">
          Drop Excel file here
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Supports .xlsx format
        </p>
      </div>
    </div>
  );
};

export default ExcelDropZone;