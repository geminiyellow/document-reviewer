import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Annotation, Point } from '../../../types';
import { usePanZoom } from './hooks/usePanZoom';
import { useAnnotationEvents } from './hooks/useAnnotationEvents';
import { useAnnotationVisibility } from './hooks/useAnnotationVisibility';
import AnnotationLayer from './components/AnnotationLayer';
import PreviewRect from './components/PreviewRect';
import ZoomControls from './ZoomControls';

interface ImageEditorProps {
  imageUrl: string;
  annotations: Annotation[];
  selectedAnnotationId: string | null;
  mode: 'select' | 'create';
  onAnnotationSelect: (id: string | null) => void;
  onAnnotationCreate: (bounds: Annotation['bounds']) => void;
  onAnnotationUpdate: (id: string, bounds: Annotation['bounds']) => void;
  navigationExpanded: boolean;
  lastClickedFromList?: boolean;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  imageUrl,
  annotations,
  selectedAnnotationId,
  mode,
  onAnnotationSelect,
  onAnnotationCreate,
  onAnnotationUpdate,
  navigationExpanded,
  lastClickedFromList = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const imageRef = useRef<SVGImageElement>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const {
    zoom,
    pan,
    isPanning,
    setZoom,
    setPan,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    initializeView
  } = usePanZoom({ imageSize, containerRef: svgRef });

  const { isAnnotationInView } = useAnnotationVisibility({
    selectedAnnotationId,
    annotations,
    zoom,
    pan,
    setPan,
    containerRef: svgRef,
    lastClickedFromList
  });

  const screenToImageCoordinates = useCallback((screenX: number, screenY: number): Point => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };

    const rect = svg.getBoundingClientRect();
    const x = (screenX - rect.left - pan.x) / zoom;
    const y = (screenY - rect.top - pan.y) / zoom;

    return {
      x: Math.max(0, Math.min(x, imageSize.width)),
      y: Math.max(0, Math.min(y, imageSize.height))
    };
  }, [zoom, pan, imageSize]);

  const {
    dragStart,
    previewRect,
    handleMouseDown: handleAnnotationMouseDown,
    handleAnnotationDraw,
    handleAnnotationComplete,
  } = useAnnotationEvents({
    mode,
    zoom,
    imageSize,
    onAnnotationCreate,
    onAnnotationSelect,
    screenToImageCoordinates,
  });

  useEffect(() => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      setImageSize({ width: image.width, height: image.height });
    };
  }, [imageUrl]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      handlePanStart(e);
    } else if (e.button === 0 && (e.target === svgRef.current || e.target === imageRef.current)) {
      handleAnnotationMouseDown(e);
    }
  }, [handlePanStart, handleAnnotationMouseDown]);

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      handlePanMove(e);
    } else if (dragStart) {
      handleAnnotationDraw(e);
    }
  }, [isPanning, handlePanMove, dragStart, handleAnnotationDraw]);

  const handleGlobalMouseUp = useCallback(() => {
    if (isPanning) {
      handlePanEnd();
    } else {
      handleAnnotationComplete();
    }
  }, [isPanning, handlePanEnd, handleAnnotationComplete]);

  useEffect(() => {
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleGlobalMouseMove, handleGlobalMouseUp]);

  const getCursor = useCallback(() => {
    if (isPanning) return 'grabbing';
    if (mode === 'create') return 'crosshair';
    return 'grab';
  }, [isPanning, mode]);

  return (
    <div className="w-full h-full overflow-hidden">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ cursor: getCursor() }}
        onMouseDown={handleMouseDown}
      >
        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
          <image
            ref={imageRef}
            href={imageUrl}
            x="0"
            y="0"
            width={imageSize.width}
            height={imageSize.height}
            preserveAspectRatio="xMidYMid meet"
          />
          
          <AnnotationLayer
            annotations={annotations}
            selectedAnnotationId={selectedAnnotationId}
            zoom={zoom}
            imageSize={imageSize}
            onAnnotationSelect={onAnnotationSelect}
            onAnnotationUpdate={onAnnotationUpdate}
          />

          {previewRect && (
            <PreviewRect bounds={previewRect} zoom={zoom} />
          )}
        </g>
      </svg>

      <div className="absolute right-2 bottom-2">
        <ZoomControls
          zoom={zoom}
          onZoomIn={() => setZoom(z => Math.min(5, z * 1.2))}
          onZoomOut={() => setZoom(z => Math.max(0.1, z / 1.2))}
          onReset={() => initializeView()}
        />
      </div>
    </div>
  );
};

export default ImageEditor;