import React, { useState } from 'react';
import { Bookmark, Plus, Edit2, Trash2 } from 'lucide-react';
import { Annotation } from '../../types';

interface AnnotationDrawerProps {
  annotations: Annotation[];
  documents: Array<{ id: string; title: string }>;
  onAnnotationClick: (annotation: Annotation) => void;
  onAddClick: () => void;
  onAnnotationUpdate: (id: string, content: string) => void;
  onAnnotationDelete: (id: string) => void;
  selectedAnnotationId: string | null;
}

const AnnotationDrawer: React.FC<AnnotationDrawerProps> = ({
  annotations,
  documents,
  onAnnotationClick,
  onAddClick,
  onAnnotationUpdate,
  onAnnotationDelete,
  selectedAnnotationId,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleEdit = (annotation: Annotation) => {
    setEditingId(annotation.id);
    setEditContent(annotation.content);
  };

  const handleSave = () => {
    if (editingId && editContent.trim()) {
      onAnnotationUpdate(editingId, editContent);
      setEditingId(null);
    }
  };

  const getDocumentTitle = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    return document ? document.title : 'Unknown Document';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center">
          <Bookmark className="w-5 h-5 mr-2" />
          Annotations
        </h2>
        <button
          onClick={onAddClick}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Add annotation"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            className={`p-4 border-b border-gray-100 ${
              selectedAnnotationId === annotation.id ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
          >
            {editingId === annotation.id ? (
              <div className="space-y-2">
                <textarea
                  className="w-full p-2 border rounded"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  autoFocus
                />
                <div className="flex justify-end space-x-2">
                  <button
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div onClick={() => onAnnotationClick(annotation)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{annotation.content}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {getDocumentTitle(annotation.documentId)} - Page {annotation.pageId}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      className="p-1 hover:bg-gray-200 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(annotation);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-200 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAnnotationDelete(annotation.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnotationDrawer;