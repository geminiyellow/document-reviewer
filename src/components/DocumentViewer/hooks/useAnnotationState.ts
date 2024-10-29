import { useState, useCallback } from 'react';
import { Annotation, EditorMode } from '../../../types';

export const useAnnotationState = () => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [mode, setMode] = useState<EditorMode>('select');
  const [lastClickedFromList, setLastClickedFromList] = useState(false);

  const handleAnnotationCreate = useCallback((documentId: string, pageId: string, bounds: Annotation['bounds']) => {
    const newAnnotation: Annotation = {
      id: `annotation-${Date.now()}`,
      documentId,
      pageId,
      content: `New Annotation`,
      timestamp: new Date(),
      bounds,
    };

    setAnnotations((prev) => [...prev, newAnnotation]);
    setSelectedAnnotationId(newAnnotation.id);
    setMode('select');
  }, []);

  const handleAnnotationUpdate = useCallback((id: string, bounds: Annotation['bounds']) => {
    setAnnotations((prev) =>
      prev.map((ann) => (ann.id === id ? { ...ann, bounds } : ann))
    );
  }, []);

  const handleAnnotationContentUpdate = useCallback((id: string, content: string) => {
    setAnnotations((prev) =>
      prev.map((ann) => (ann.id === id ? { ...ann, content } : ann))
    );
  }, []);

  const handleAnnotationDelete = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((ann) => ann.id !== id));
    if (selectedAnnotationId === id) {
      setSelectedAnnotationId(null);
    }
  }, [selectedAnnotationId]);

  const handleAnnotationClick = useCallback((annotation: Annotation, onNavigate: (documentId: string, pageId: string) => void) => {
    // 先设置导航，再设置选中状态
    onNavigate(annotation.documentId, annotation.pageId);
    setSelectedAnnotationId(annotation.id);
    setLastClickedFromList(true);
  }, []);

  const handleAnnotationSelect = useCallback((id: string | null) => {
    setSelectedAnnotationId(id);
    setLastClickedFromList(false);
  }, []);

  return {
    annotations,
    selectedAnnotationId,
    mode,
    lastClickedFromList,
    handleAnnotationCreate,
    handleAnnotationUpdate,
    handleAnnotationContentUpdate,
    handleAnnotationDelete,
    handleAnnotationClick,
    handleAnnotationSelect,
    setMode
  };
};