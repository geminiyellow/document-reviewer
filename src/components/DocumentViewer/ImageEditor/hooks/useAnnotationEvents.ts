import { useState, useCallback } from 'react';
import { Annotation, Point } from '../../../../types';
import { MIN_ANNOTATION_SIZE } from '../types';

interface UseAnnotationEventsProps {
  mode: 'select' | 'create';
  zoom: number;
  imageSize: { width: number; height: number };
  onAnnotationCreate: (bounds: Annotation['bounds']) => void;
  onAnnotationSelect: (id: string | null) => void;
  screenToImageCoordinates: (screenX: number, screenY: number) => Point;
}

interface UseAnnotationEventsResult {
  dragStart: Point | null;
  previewRect: Annotation['bounds'] | null;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleAnnotationDraw: (e: MouseEvent) => void;
  handleAnnotationComplete: () => void;
  setDragStart: (point: Point | null) => void;
  setPreviewRect: (rect: Annotation['bounds'] | null) => void;
}

export const useAnnotationEvents = ({
  mode,
  zoom,
  imageSize,
  onAnnotationCreate,
  onAnnotationSelect,
  screenToImageCoordinates,
}: UseAnnotationEventsProps): UseAnnotationEventsResult => {
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [previewRect, setPreviewRect] = useState<Annotation['bounds'] | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && mode === 'create') {
      const pos = screenToImageCoordinates(e.clientX, e.clientY);
      setDragStart(pos);
      setPreviewRect({
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0
      });
    } else if (e.button === 0 && mode === 'select') {
      onAnnotationSelect(null);
    }
  }, [mode, screenToImageCoordinates, onAnnotationSelect]);

  const handleAnnotationDraw = useCallback((e: MouseEvent) => {
    if (!dragStart || mode !== 'create') return;

    const currentPos = screenToImageCoordinates(e.clientX, e.clientY);
    
    const width = Math.abs(currentPos.x - dragStart.x);
    const height = Math.abs(currentPos.y - dragStart.y);
    
    const newRect = {
      x: Math.min(currentPos.x, dragStart.x),
      y: Math.min(currentPos.y, dragStart.y),
      width,
      height
    };

    // 确保标注不会超出图片边界
    newRect.x = Math.max(0, Math.min(newRect.x, imageSize.width - newRect.width));
    newRect.y = Math.max(0, Math.min(newRect.y, imageSize.height - newRect.height));

    setPreviewRect(newRect);
  }, [dragStart, mode, screenToImageCoordinates, imageSize]);

  const handleAnnotationComplete = useCallback(() => {
    if (dragStart && mode === 'create' && previewRect) {
      if (previewRect.width >= MIN_ANNOTATION_SIZE / zoom && 
          previewRect.height >= MIN_ANNOTATION_SIZE / zoom) {
        onAnnotationCreate(previewRect);
      }
      setDragStart(null);
      setPreviewRect(null);
    }
  }, [dragStart, mode, previewRect, zoom, onAnnotationCreate]);

  return {
    dragStart,
    previewRect,
    handleMouseDown,
    handleAnnotationDraw,
    handleAnnotationComplete,
    setDragStart,
    setPreviewRect,
  };
};