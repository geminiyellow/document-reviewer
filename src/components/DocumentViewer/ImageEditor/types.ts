import { Annotation, Point } from '../../../types';

// 常量定义
export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 5;
export const MIN_ANNOTATION_SIZE = 20;
export const VIEWPORT_MARGIN = 20;
export const HANDLE_SIZE = 8;

// 类型定义
export type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se';

export interface ImageSize {
  width: number;
  height: number;
}

export interface PanZoomState {
  zoom: number;
  pan: Point;
  isPanning: boolean;
}

export interface ImageEditorProps {
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

export interface AnnotationRectProps {
  annotation: Annotation;
  isSelected: boolean;
  zoom: number;
  imageSize: ImageSize;
  onSelect: () => void;
  onResize: (bounds: Annotation['bounds']) => void;
  onMove: (dx: number, dy: number) => void;
}

export interface AnnotationLayerProps {
  annotations: Annotation[];
  selectedAnnotationId: string | null;
  zoom: number;
  imageSize: ImageSize;
  onAnnotationSelect: (id: string | null) => void;
  onAnnotationUpdate: (id: string, bounds: Annotation['bounds']) => void;
}

export interface PreviewRectProps {
  bounds: Annotation['bounds'];
  zoom: number;
}

export interface UsePanZoomProps {
  imageSize: ImageSize;
  containerRef: React.RefObject<SVGSVGElement>;
}

export interface UsePanZoomResult extends PanZoomState {
  setZoom: (value: number | ((prev: number) => number)) => void;
  setPan: (value: Point) => void;
  handlePanStart: (e: React.MouseEvent | MouseEvent) => void;
  handlePanMove: (e: MouseEvent) => void;
  handlePanEnd: () => void;
  initializeView: () => void;
}