import React from 'react';
import { Point } from '../../../types';
import { AnnotationRectProps, ResizeHandle, MIN_ANNOTATION_SIZE, HANDLE_SIZE } from './types';

const AnnotationRect: React.FC<AnnotationRectProps> = ({
  annotation,
  isSelected,
  zoom,
  imageSize,
  onSelect,
  onResize,
  onMove,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState<Point | null>(null);
  const [resizeHandle, setResizeHandle] = React.useState<ResizeHandle | null>(null);
  const [originalBounds, setOriginalBounds] = React.useState<typeof annotation.bounds | null>(null);

  const handleMouseDown = (e: React.MouseEvent, handle?: ResizeHandle) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setOriginalBounds({ ...annotation.bounds });
    if (handle) {
      setResizeHandle(handle);
    }
    onSelect();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragStart || !originalBounds) return;

    const dx = (e.clientX - dragStart.x) / zoom;
    const dy = (e.clientY - dragStart.y) / zoom;

    if (resizeHandle) {
      const newBounds = { ...originalBounds };
      const minSize = MIN_ANNOTATION_SIZE / zoom;

      switch (resizeHandle) {
        case 'nw': {
          const maxDx = originalBounds.width - minSize;
          const maxDy = originalBounds.height - minSize;
          
          const constrainedDx = Math.min(dx, maxDx);
          const constrainedDy = Math.min(dy, maxDy);
          
          newBounds.x = Math.max(0, originalBounds.x + constrainedDx);
          newBounds.y = Math.max(0, originalBounds.y + constrainedDy);
          newBounds.width = originalBounds.width - (newBounds.x - originalBounds.x);
          newBounds.height = originalBounds.height - (newBounds.y - originalBounds.y);
          break;
        }
        case 'ne': {
          const maxDy = originalBounds.height - minSize;
          const constrainedDy = Math.min(dy, maxDy);
          
          newBounds.y = Math.max(0, originalBounds.y + constrainedDy);
          newBounds.height = originalBounds.height - (newBounds.y - originalBounds.y);
          
          const maxWidth = imageSize.width - originalBounds.x;
          newBounds.width = Math.min(maxWidth, Math.max(minSize, originalBounds.width + dx));
          break;
        }
        case 'sw': {
          const maxDx = originalBounds.width - minSize;
          const constrainedDx = Math.min(dx, maxDx);
          
          newBounds.x = Math.max(0, originalBounds.x + constrainedDx);
          newBounds.width = originalBounds.width - (newBounds.x - originalBounds.x);
          
          const maxHeight = imageSize.height - originalBounds.y;
          newBounds.height = Math.min(maxHeight, Math.max(minSize, originalBounds.height + dy));
          break;
        }
        case 'se': {
          const maxWidth = imageSize.width - originalBounds.x;
          const maxHeight = imageSize.height - originalBounds.y;
          newBounds.width = Math.min(maxWidth, Math.max(minSize, originalBounds.width + dx));
          newBounds.height = Math.min(maxHeight, Math.max(minSize, originalBounds.height + dy));
          break;
        }
      }

      onResize(newBounds);
    } else {
      const newX = Math.max(0, Math.min(originalBounds.x + dx, imageSize.width - originalBounds.width));
      const newY = Math.max(0, Math.min(originalBounds.y + dy, imageSize.height - originalBounds.height));
      
      if (newX !== annotation.bounds.x || newY !== annotation.bounds.y) {
        onMove(newX - originalBounds.x, newY - originalBounds.y);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
    setResizeHandle(null);
    setOriginalBounds(null);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, resizeHandle, originalBounds]);

  const getCursor = () => {
    if (isDragging) return resizeHandle ? `${resizeHandle}-resize` : 'grabbing';
    return 'grab';
  };

  return (
    <g>
      <rect
        x={annotation.bounds.x}
        y={annotation.bounds.y}
        width={annotation.bounds.width}
        height={annotation.bounds.height}
        fill="rgba(59, 130, 246, 0.2)"
        stroke={isSelected ? '#2563eb' : '#60a5fa'}
        strokeWidth={2 / zoom}
        style={{ cursor: getCursor() }}
        onMouseDown={(e) => handleMouseDown(e)}
      />
      
      {isSelected && (
        <>
          {(['nw', 'ne', 'se', 'sw'] as const).map((handle) => {
            const handleX = annotation.bounds.x + (handle.includes('e') ? annotation.bounds.width : 0);
            const handleY = annotation.bounds.y + (handle.includes('s') ? annotation.bounds.height : 0);
            
            return (
              <rect
                key={handle}
                x={handleX - (HANDLE_SIZE / 2) / zoom}
                y={handleY - (HANDLE_SIZE / 2) / zoom}
                width={HANDLE_SIZE / zoom}
                height={HANDLE_SIZE / zoom}
                fill="white"
                stroke="#2563eb"
                strokeWidth={1 / zoom}
                style={{
                  cursor: `${handle}-resize`,
                }}
                onMouseDown={(e) => handleMouseDown(e, handle)}
              />
            );
          })}
        </>
      )}
    </g>
  );
};

export default AnnotationRect;