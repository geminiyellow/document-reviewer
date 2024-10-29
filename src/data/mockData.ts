import { Document } from '../types';

// 595x842 是A4纸在72dpi下的像素尺寸 (210mm x 297mm)
export const SAMPLE_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'Document 1',
    pages: [
      { id: '1-1', pageNumber: 1, imageUrl: 'https://dummyimage.com/595x842/f0f0f0/666666&text=Page+1' },
      { id: '1-2', pageNumber: 2, imageUrl: 'https://dummyimage.com/595x842/f0f0f0/666666&text=Page+2' },
      { id: '1-3', pageNumber: 3, imageUrl: 'https://dummyimage.com/595x842/f0f0f0/666666&text=Page+3' },
      { id: '1-4', pageNumber: 4, imageUrl: 'https://dummyimage.com/595x842/f0f0f0/666666&text=Page+4' },
      { id: '1-5', pageNumber: 5, imageUrl: 'https://dummyimage.com/595x842/f0f0f0/666666&text=Page+5' },
      { id: '1-6', pageNumber: 6, imageUrl: 'https://dummyimage.com/595x842/f0f0f0/666666&text=Page+6' },
      { id: '1-7', pageNumber: 7, imageUrl: 'https://dummyimage.com/595x842/f0f0f0/666666&text=Page+7' },
      { id: '1-8', pageNumber: 8, imageUrl: 'https://dummyimage.com/595x842/f0f0f0/666666&text=Page+8' },
    ],
  },
  {
    id: '2',
    title: 'Document 2',
    pages: [
      { id: '2-1', pageNumber: 1, imageUrl: 'https://dummyimage.com/595x842/f0f0f0/666666&text=Doc2+Page+1' },
      { id: '2-2', pageNumber: 2, imageUrl: 'https://dummyimage.com/595x842/f0f0f0/666666&text=Doc2+Page+2' },
      { id: '2-3', pageNumber: 3, imageUrl: 'https://dummyimage.com/595x842/f0f0f0/666666&text=Doc2+Page+3' },
      { id: '2-4', pageNumber: 4, imageUrl: 'https://dummyimage.com/595x842/f0f0f0/666666&text=Doc2+Page+4' },
      { id: '2-5', pageNumber: 5, imageUrl: 'https://dummyimage.com/595x842/f0f0f0/666666&text=Doc2+Page+5' },
    ],
  },
  {
    id: '3',
    title: 'Document 3',
    pages: [
      { id: '3-1', pageNumber: 1, imageUrl: 'https://dummyimage.com/595x842/f0f0f0/666666&text=Doc3+Page+1' },
      { id: '3-2', pageNumber: 2, imageUrl: 'https://dummyimage.com/595x842/f0f0f0/666666&text=Doc3+Page+2' },
      { id: '3-3', pageNumber: 3, imageUrl: 'https://dummyimage.com/595x842/f0f0f0/666666&text=Doc3+Page+3' },
      { id: '3-4', pageNumber: 4, imageUrl: 'https://dummyimage.com/595x842/f0f0f0/666666&text=Doc3+Page+4' },
    ],
  }
];