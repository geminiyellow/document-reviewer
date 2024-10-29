export interface Document {
  id: string;
  title: string;
  pages: Page[];
}

export interface Page {
  id: string;
  imageUrl: string;
  pageNumber: number;
}

export interface Annotation {
  id: string;
  documentId: string;
  pageId: string;
  content: string;
  timestamp: Date;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Point {
  x: number;
  y: number;
}

export type EditorMode = 'select' | 'create';