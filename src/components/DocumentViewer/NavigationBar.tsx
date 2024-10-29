import React from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigation } from './hooks/useNavigation';

// A4纸的宽高比 1:√2
const A4_RATIO = 1 / Math.sqrt(2);
const THUMBNAIL_CONTAINER_HEIGHT = 160; // 容器总高度
const THUMBNAIL_CONTAINER_PADDING = 16; // 内边距 (p-4 = 16px)
const SCROLLBAR_HEIGHT = 12; // 滚动条高度
const AVAILABLE_HEIGHT = THUMBNAIL_CONTAINER_HEIGHT - (THUMBNAIL_CONTAINER_PADDING * 2) - SCROLLBAR_HEIGHT; // 可用高度
const THUMBNAIL_HEIGHT = AVAILABLE_HEIGHT; // 缩略图高度等于可用高度
const THUMBNAIL_WIDTH = THUMBNAIL_HEIGHT * A4_RATIO; // 根据A4比例计算宽度

interface NavigationBarProps {
  currentPage: number;
  totalPages: number;
  thumbnails: string[];
  onPageChange: (page: number) => void;
  onExpandedChange: (expanded: boolean) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  currentPage,
  totalPages,
  thumbnails,
  onPageChange,
  onExpandedChange,
}) => {
  const {
    isExpanded,
    handlePrevPage,
    handleNextPage,
    handleExpandToggle,
    handleThumbnailClick
  } = useNavigation({
    currentPage,
    totalPages,
    onPageChange
  });

  React.useEffect(() => {
    onExpandedChange(isExpanded);
  }, [isExpanded, onExpandedChange]);

  return (
    <div className="bg-white border-t border-gray-200 flex-shrink-0">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm">
            {currentPage} / {totalPages}
          </span>
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          className="p-1 hover:bg-gray-100 rounded"
          onClick={handleExpandToggle}
        >
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronUp className="w-5 h-5" />
          )}
        </button>
      </div>
      {isExpanded && (
        <div className="border-t border-gray-200">
          <div 
            className="relative"
            style={{ height: `${THUMBNAIL_CONTAINER_HEIGHT}px` }}
          >
            <div className="absolute inset-0 overflow-x-auto">
              <div className="p-4 pb-[28px] flex gap-2 h-full">
                {thumbnails.map((thumbnail, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer relative flex-shrink-0 ${
                      currentPage === index + 1 ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{
                      width: `${THUMBNAIL_WIDTH}px`,
                      height: `${THUMBNAIL_HEIGHT}px`,
                    }}
                    onClick={() => handleThumbnailClick(index + 1)}
                  >
                    <img
                      src={thumbnail}
                      alt={`Page ${index + 1}`}
                      className="w-full h-full object-contain bg-gray-50"
                    />
                    <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1">
                      {index + 1}/{totalPages}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationBar;