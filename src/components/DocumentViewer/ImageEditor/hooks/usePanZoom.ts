import { useState, useCallback, useRef, useEffect } from 'react';
import { Point } from '../../../../types';
import { MIN_ZOOM, MAX_ZOOM, UsePanZoomProps, UsePanZoomResult } from '../types';

export const usePanZoom = ({ imageSize, containerRef }: UsePanZoomProps): UsePanZoomResult => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<Point | null>(null);

  const initializeView = useCallback(() => {
    if (containerRef.current && imageSize.width && imageSize.height) {
      const rect = containerRef.current.getBoundingClientRect();
      const scale = Math.min(rect.width / imageSize.width, rect.height / imageSize.height);
      setZoom(scale);
      setPan({
        x: (rect.width - imageSize.width * scale) / 2,
        y: (rect.height - imageSize.height * scale) / 2
      });
    }
  }, [imageSize, containerRef]);

  const handlePanStart = useCallback((e: React.MouseEvent | MouseEvent) => {
    setIsPanning(true);
    panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }, [pan]);

  const handlePanMove = useCallback((e: MouseEvent) => {
    if (isPanning && panStart.current) {
      setPan({
        x: e.clientX - panStart.current.x,
        y: e.clientY - panStart.current.y
      });
    }
  }, [isPanning]);

  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
    panStart.current = null;
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const delta = -e.deltaY / 1000;
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * (1 + delta)));
      
      setPan({
        x: mouseX - (mouseX - pan.x) * (newZoom / zoom),
        y: mouseY - (mouseY - pan.y) * (newZoom / zoom)
      });
      setZoom(newZoom);
    }
  }, [zoom, pan, containerRef]);

  useEffect(() => {
    initializeView();
  }, [initializeView]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel, containerRef]);

  return {
    zoom,
    pan,
    isPanning,
    setZoom,
    setPan,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    initializeView
  };
};