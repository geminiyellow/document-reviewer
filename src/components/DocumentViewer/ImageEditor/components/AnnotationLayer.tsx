import React, { useCallback } from 'react';
import { AnnotationLayerProps } from '../types';
import AnnotationRect from '../AnnotationRect';

const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
  annotations,
  selectedAnnotationId,
  zoom,
  imageSize,
  onAnnotationSelect,
  onAnnotationUpdate,
}) => {
  const handleMove = useCallback((annotationId: string, dx: number, dy: number) => {
    const annotation = annotations.find(a => a.id === annotationId);
    if (!annotation) return;

    const newBounds = {
      ...annotation.bounds,
      x: Math.max(0, Math.min(annotation.bounds.x + dx, imageSize.width - annotation.bounds.width)),
      y: Math.max(0, Math.min(annotation.bounds.y + dy, imageSize.height - annotation.bounds.height)),
    };
    onAnnotationUpdate(annotationId, newBounds);
  }, [annotations, imageSize, onAnnotationUpdate]);

  return (
    <>
      {annotations.map((annotation) => (
        <AnnotationRect
          key={annotation.id}
          annotation={annotation}
          isSelected={annotation.id === selectedAnnotationId}
          zoom={zoom}
          imageSize={imageSize}
          onSelect={() => onAnnotationSelect(annotation.id)}
          onResize={(bounds) => onAnnotationUpdate(annotation.id, bounds)}
          onMove={(dx, dy) => handleMove(annotation.id, dx, dy)}
        />
      ))}
    </>
  );
};

export default AnnotationLayer;