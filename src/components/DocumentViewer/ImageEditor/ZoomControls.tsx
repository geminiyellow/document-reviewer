import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`flex items-center bg-white rounded-full shadow-lg transition-all duration-300 h-10 ${
        isExpanded ? 'px-2' : 'w-10'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {isExpanded ? (
        <>
          <button
            onClick={onZoomOut}
            className="p-1.5 hover:bg-gray-100 rounded-full"
            title="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="px-2 min-w-[4rem] text-center text-sm">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            className="p-1.5 hover:bg-gray-100 rounded-full"
            title="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={onReset}
            className="p-1.5 hover:bg-gray-100 rounded-full"
            title="Reset zoom"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </>
      ) : (
        <div className="w-10 h-10 flex items-center justify-center text-sm font-medium">
          {Math.round(zoom * 100)}%
        </div>
      )}
    </div>
  );
};

export default ZoomControls;