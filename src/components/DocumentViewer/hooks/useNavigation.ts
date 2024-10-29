import { useState, useCallback } from 'react';

interface UseNavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const useNavigation = ({
  currentPage,
  totalPages,
  onPageChange
}: UseNavigationProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const handleExpandToggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleThumbnailClick = useCallback((pageNumber: number) => {
    onPageChange(pageNumber);
  }, [onPageChange]);

  return {
    isExpanded,
    handlePrevPage,
    handleNextPage,
    handleExpandToggle,
    handleThumbnailClick
  };
};