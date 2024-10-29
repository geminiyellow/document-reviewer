import React from 'react';
import { GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSplitPane } from './hooks/useSplitPane';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultSplit?: number;
  drawerWidth?: number;
  isDrawerOpen?: boolean;
}

const MIN_LEFT_WIDTH = 300;
const MIN_RIGHT_WIDTH = 300;
const RESIZE_HANDLE_WIDTH = 8;

const SplitPane: React.FC<SplitPaneProps> = ({
  left,
  right,
  defaultSplit = 50,
  drawerWidth = 320,
  isDrawerOpen = false,
}) => {
  const {
    split,
    isDragging,
    showLeft,
    hasEnoughSpace,
    isInResistanceZone,
    isSnapped,
    containerRef,
    handleMouseDown,
    toggleView
  } = useSplitPane({
    defaultSplit,
    drawerWidth,
    isDrawerOpen,
    minLeftWidth: MIN_LEFT_WIDTH,
    minRightWidth: MIN_RIGHT_WIDTH
  });

  // 只在以下情况使用动画：
  // 1. 折叠状态 (isSnapped)
  // 2. 空间不足时 (!hasEnoughSpace)
  // 3. 在阻力区域内 (isInResistanceZone)
  // 4. 非拖动状态 (!isDragging)
  const shouldAnimate = isSnapped || !hasEnoughSpace || isInResistanceZone || !isDragging;

  return (
    <div 
      ref={containerRef}
      className="flex h-screen relative"
    >
      {isDrawerOpen && (
        <div style={{ width: drawerWidth }} className="h-full flex-shrink-0 bg-white border-r border-gray-200">
          {/* Drawer content */}
        </div>
      )}
      
      <div 
        style={{ 
          width: hasEnoughSpace && !isSnapped ? `${split}%` : (showLeft ? '100%' : '0%'),
          transition: shouldAnimate ? 'width 300ms ease-in-out' : 'none'
        }} 
        className="h-full overflow-hidden"
      >
        {left}
      </div>

      <div
        className={`w-[${RESIZE_HANDLE_WIDTH}px] flex items-center justify-center transition-colors duration-300 relative z-10 ${
          isDragging ? 'bg-blue-200' : 
          isInResistanceZone ? 'bg-blue-100' : 
          isSnapped ? 'bg-gray-200 hover:bg-gray-300' :
          'bg-gray-100 hover:bg-blue-50'
        }`}
        onMouseDown={handleMouseDown}
        onClick={toggleView}
        style={{ cursor: isSnapped ? 'pointer' : 'col-resize' }}
      >
        {isSnapped ? (
          <div className="p-1">
            {showLeft ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </div>
        ) : (
          <div className="p-1">
            <GripVertical className={`w-4 h-4 ${isInResistanceZone ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
        )}
      </div>

      <div 
        style={{ 
          width: hasEnoughSpace && !isSnapped ? `${100 - split}%` : (showLeft ? '0%' : '100%'),
          transition: shouldAnimate ? 'width 300ms ease-in-out' : 'none'
        }}
        className="h-full overflow-hidden"
      >
        {right}
      </div>
    </div>
  );
};

export default SplitPane;