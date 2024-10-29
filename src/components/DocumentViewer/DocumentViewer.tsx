import React, { useState, useCallback } from 'react';
import DocumentTabs from './DocumentTabs';
import NavigationBar from './NavigationBar';
import AnnotationDrawer from './AnnotationDrawer';
import ImageEditor from './ImageEditor/ImageEditor';
import { SAMPLE_DOCUMENTS } from '../../data/mockData';
import { Bookmark } from 'lucide-react';
import { useDocumentState } from './hooks/useDocumentState';
import { useAnnotationState } from './hooks/useAnnotationState';

const DocumentViewer: React.FC = () => {
  const {
    documents,
    activeDocId,
    activeDocument,
    currentPage,
    currentPageIndex,
    handleDocumentChange,
    handlePageChange,
    navigateToAnnotation
  } = useDocumentState(SAMPLE_DOCUMENTS);

  const {
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
  } = useAnnotationState();

  const [isNavigationExpanded, setIsNavigationExpanded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const handleAnnotationCreateWithContext = useCallback((bounds: Annotation['bounds']) => {
    if (!currentPage) return;
    handleAnnotationCreate(activeDocId, currentPage.id, bounds);
  }, [activeDocId, currentPage, handleAnnotationCreate]);

  const toggleDrawer = useCallback(() => {
    if (mode !== 'create') {
      setIsDrawerOpen(prev => !prev);
    }
  }, [mode]);

  return (
    <div className="h-full flex overflow-hidden">
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isDrawerOpen ? 'w-80' : 'w-0'
        }`}
      >
        <div className={`w-80 h-full overflow-hidden transition-all duration-300 shadow-lg ${
          isDrawerOpen ? '' : '-ml-80'
        }`}>
          <AnnotationDrawer
            documents={documents}
            annotations={annotations}
            onAnnotationClick={(annotation) => handleAnnotationClick(annotation, navigateToAnnotation)}
            onAddClick={() => setMode('create')}
            onAnnotationUpdate={handleAnnotationContentUpdate}
            onAnnotationDelete={handleAnnotationDelete}
            selectedAnnotationId={selectedAnnotationId}
          />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col relative min-w-0">
        <div className="flex items-center h-12 bg-white border-b border-gray-200">
          <div className="flex items-center px-2 h-full border-r border-gray-200">
            <button
              onClick={toggleDrawer}
              disabled={mode === 'create'}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors
                ${mode === 'create' 
                  ? 'opacity-50 cursor-not-allowed text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'}`}
              title={isDrawerOpen ? "Hide annotations" : "Show annotations"}
            >
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
          <DocumentTabs
            tabs={documents.map((doc) => ({ id: doc.id, title: doc.title }))}
            activeTab={activeDocId}
            onTabChange={handleDocumentChange}
          />
        </div>
        
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 relative">
            {currentPage && (
              <ImageEditor
                imageUrl={currentPage.imageUrl}
                annotations={annotations.filter(
                  (ann) => ann.documentId === activeDocId && ann.pageId === currentPage.id
                )}
                selectedAnnotationId={selectedAnnotationId}
                mode={mode}
                onAnnotationSelect={handleAnnotationSelect}
                onAnnotationCreate={handleAnnotationCreateWithContext}
                onAnnotationUpdate={handleAnnotationUpdate}
                navigationExpanded={isNavigationExpanded}
                lastClickedFromList={lastClickedFromList}
              />
            )}
          </div>

          <NavigationBar
            currentPage={currentPageIndex + 1}
            totalPages={activeDocument?.pages.length || 0}
            thumbnails={activeDocument?.pages.map((p) => p.imageUrl) || []}
            onPageChange={(page) => handlePageChange(page - 1)}
            onExpandedChange={setIsNavigationExpanded}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;