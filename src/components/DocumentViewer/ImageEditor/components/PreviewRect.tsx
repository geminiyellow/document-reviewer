import React from 'react';
import { PreviewRectProps } from '../types';

const PreviewRect: React.FC<PreviewRectProps> = ({ bounds, zoom }) => {
  return (
    <rect
      x={bounds.x}
      y={bounds.y}
      width={bounds.width}
      height={bounds.height}
      fill="rgba(59, 130, 246, 0.2)"
      stroke="#60a5fa"
      strokeWidth={2 / zoom}
      strokeDasharray={`${4 / zoom},${4 / zoom}`}
    />
  );
};

export default PreviewRect;