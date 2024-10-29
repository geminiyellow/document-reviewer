import { useCallback, useEffect } from 'react';
import { Annotation } from '../../../../types';
import { VIEWPORT_MARGIN } from '../types';

interface UseAnnotationVisibilityProps {
  selectedAnnotationId: string | null;
  annotations: Annotation[];
  zoom: number;
  pan: { x: number; y: number };
  setPan: (pan: { x: number; y: number }) => void;
  containerRef: React.RefObject<SVGSVGElement>;
  lastClickedFromList?: boolean;
}

export const useAnnotationVisibility = ({
  selectedAnnotationId,
  annotations,
  zoom,
  pan,
  setPan,
  containerRef,
  lastClickedFromList = false,
}: UseAnnotationVisibilityProps) => {
  const isAnnotationInView = useCallback((annotation: Annotation) => {
    if (!containerRef.current) return true;

    const rect = containerRef.current.getBoundingClientRect();
    const annotLeft = annotation.bounds.x * zoom + pan.x;
    const annotTop = annotation.bounds.y * zoom + pan.y;
    const annotRight = (annotation.bounds.x + annotation.bounds.width) * zoom + pan.x;
    const annotBottom = (annotation.bounds.y + annotation.bounds.height) * zoom + pan.y;

    return (
      annotLeft >= -VIEWPORT_MARGIN &&
      annotTop >= -VIEWPORT_MARGIN &&
      annotRight <= rect.width + VIEWPORT_MARGIN &&
      annotBottom <= rect.height + VIEWPORT_MARGIN
    );
  }, [zoom, pan, containerRef]);

  const bringAnnotationIntoView = useCallback((annotation: Annotation) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const annotLeft = annotation.bounds.x * zoom + pan.x;
    const annotTop = annotation.bounds.y * zoom + pan.y;
    const annotRight = (annotation.bounds.x + annotation.bounds.width) * zoom + pan.x;
    const annotBottom = (annotation.bounds.y + annotation.bounds.height) * zoom + pan.y;

    let newPanX = pan.x;
    let newPanY = pan.y;

    if (annotLeft < VIEWPORT_MARGIN) {
      newPanX += VIEWPORT_MARGIN - annotLeft;
    } else if (annotRight > rect.width - VIEWPORT_MARGIN) {
      newPanX -= annotRight - (rect.width - VIEWPORT_MARGIN);
    }

    if (annotTop < VIEWPORT_MARGIN) {
      newPanY += VIEWPORT_MARGIN - annotTop;
    } else if (annotBottom > rect.height - VIEWPORT_MARGIN) {
      newPanY -= annotBottom - (rect.height - VIEWPORT_MARGIN);
    }

    if (newPanX !== pan.x || newPanY !== pan.y) {
      setPan({ x: newPanX, y: newPanY });
    }
  }, [zoom, pan, setPan, containerRef]);

  useEffect(() => {
    if (selectedAnnotationId && lastClickedFromList) {
      const selectedAnnotation = annotations.find(a => a.id === selectedAnnotationId);
      if (selectedAnnotation) {
        bringAnnotationIntoView(selectedAnnotation);
      }
    }
  }, [selectedAnnotationId, annotations, lastClickedFromList, bringAnnotationIntoView]);

  return {
    isAnnotationInView,
    bringAnnotationIntoView
  };
};