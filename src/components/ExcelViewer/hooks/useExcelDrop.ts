import { useState, useCallback } from 'react';

interface UseExcelDropProps {
  onFileAccepted: (file: File) => void;
}

export const useExcelDrop = ({ onFileAccepted }: UseExcelDropProps) => {
  const [isDragging, setIsDragging] = useState(false);

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

  return {
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};