# Document Annotation System

A professional document annotation system built with React and TypeScript that allows users to view, annotate, and manage multiple documents simultaneously.

## Features

### Document Management
- [x] Multi-document support with tabbed interface
- [x] Document pagination with thumbnail navigation
- [x] A4 format support with proper aspect ratio
- [x] Horizontal scrolling for thumbnails with preserved aspect ratio
- [x] Per-document page state preservation

### Image Viewer
- [x] Pan/zoom functionality
  - [x] Mouse wheel zoom (with Ctrl/Cmd key)
  - [x] Alt + drag or middle mouse button for panning
  - [x] Zoom controls with percentage display
  - [x] Reset view button
- [x] Automatic initial view fitting
- [x] Proper cursor indicators for different modes

### Annotation Features
- [x] Rectangle annotation creation
  - [x] Draw mode with preview
  - [x] Minimum size enforcement
  - [x] Boundary constraints
- [x] Annotation manipulation
  - [x] Selection and deselection
  - [x] Drag to move
  - [x] Resize from corners
  - [x] Boundary constraints during resize
- [x] Annotation list
  - [x] Toggle drawer visibility
  - [x] Document/page context display
  - [x] Edit annotation content
  - [x] Delete annotations
  - [x] Auto-scroll to annotation on selection

### Layout
- [x] Responsive split pane
  - [x] Minimum width enforcement
  - [x] Toggle mode for small screens
  - [x] Drawer integration
- [x] Material Design inspired UI
- [x] Shadow and border styling
- [x] Proper scrolling behavior

### Navigation
- [x] Page controls (prev/next)
- [x] Expandable thumbnail view
- [x] Current page indicator
- [x] Document tabs with tooltips

## Architecture

### Component Structure
- `DocumentViewer`: Main container component
- `ImageEditor`: Handles image display and annotation interaction
- `AnnotationDrawer`: Manages annotation list and editing
- `NavigationBar`: Controls page navigation and thumbnails
- `SplitPane`: Handles layout management

### State Management
- `useDocumentState`: Document and page state management
- `useAnnotationState`: Annotation data and operations
- `usePanZoom`: Image viewer pan and zoom functionality
- `useAnnotationEvents`: Annotation creation and interaction
- `useAnnotationVisibility`: Viewport management for annotations

### Types and Constants
- Centralized type definitions
- Shared constants for measurements and limits
- Proper TypeScript integration

## Planned Features
- [ ] Annotation styles customization
- [ ] Additional annotation shapes (circle, polygon, etc.)
- [ ] Annotation comments and replies
- [ ] Search functionality
- [ ] Keyboard shortcuts
- [ ] Undo/redo support
- [ ] Export/import annotations
- [ ] Print support
- [ ] Mobile touch support

## Technical Details

### Key Constants
- Minimum annotation size: 20px
- Zoom range: 0.1x to 5x
- A4 aspect ratio: 1:√2
- Minimum pane widths:
  - Image Editor: 600px
  - Excel Viewer: 400px

### Performance Considerations
- Efficient rendering with React components
- Proper event cleanup
- Optimized pan/zoom calculations
- Throttled window resize handling

## Development

### Project Structure
```
src/
  ├── components/
  │   ├── DocumentViewer/
  │   │   ├── hooks/
  │   │   ├── ImageEditor/
  │   │   │   ├── components/
  │   │   │   ├── hooks/
  │   │   │   └── types.ts
  │   │   ├── DocumentViewer.tsx
  │   │   ├── NavigationBar.tsx
  │   │   └── AnnotationDrawer.tsx
  │   └── Layout/
  │       └── SplitPane.tsx
  ├── types/
  ├── data/
  └── utils/
```

### Code Organization
- Modular component structure
- Separated business logic in hooks
- Centralized type definitions
- Mock data management