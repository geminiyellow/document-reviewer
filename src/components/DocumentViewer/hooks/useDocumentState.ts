import { useState, useCallback } from 'react';
import { Document } from '../../../types';

interface DocumentPageState {
  [documentId: string]: number;
}

export const useDocumentState = (initialDocuments: Document[]) => {
  const [documents] = useState<Document[]>(initialDocuments);
  const [activeDocId, setActiveDocId] = useState(documents[0].id);
  const [documentPages, setDocumentPages] = useState<DocumentPageState>(() => {
    return documents.reduce((acc, doc) => ({
      ...acc,
      [doc.id]: 0
    }), {});
  });

  const activeDocument = documents.find((doc) => doc.id === activeDocId);
  const currentPageIndex = documentPages[activeDocId] || 0;
  const currentPage = activeDocument?.pages[currentPageIndex];

  const handlePageChange = useCallback((pageIndex: number) => {
    setDocumentPages(prev => ({
      ...prev,
      [activeDocId]: pageIndex
    }));
  }, [activeDocId]);

  const handleDocumentChange = useCallback((docId: string) => {
    setActiveDocId(docId);
    const savedPage = documentPages[docId] || 0;
    const doc = documents.find(d => d.id === docId);
    if (doc && savedPage >= doc.pages.length) {
      handlePageChange(doc.pages.length - 1);
    }
  }, [documents, documentPages, handlePageChange]);

  // 新增: 处理标注点击时的文档和页面切换
  const navigateToAnnotation = useCallback((documentId: string, pageId: string) => {
    const doc = documents.find(d => d.id === documentId);
    if (!doc) return;

    const pageIndex = doc.pages.findIndex(page => page.id === pageId);
    if (pageIndex === -1) return;

    // 先设置页码，再切换文档
    setDocumentPages(prev => ({
      ...prev,
      [documentId]: pageIndex
    }));
    setActiveDocId(documentId);
  }, [documents]);

  return {
    documents,
    activeDocId,
    activeDocument,
    currentPage,
    currentPageIndex,
    handleDocumentChange,
    handlePageChange,
    navigateToAnnotation
  };
};