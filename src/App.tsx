import React from 'react';
import SplitPane from './components/Layout/SplitPane';
import DocumentViewer from './components/DocumentViewer/DocumentViewer';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <SplitPane
        left={<DocumentViewer />}
        right={<div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Right Panel Content</p>
        </div>}
        defaultSplit={60}
      />
    </ErrorBoundary>
  );
}

export default App;