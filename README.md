# Noosphere UI

Mechanicus-themed mind-mapping application inspired by MindMup.

The project is split into:
- `frontend`: React + Webpack + SCSS + Redux Toolkit + Redux Saga + ESLint + Jest
- `backend`: Node + Express + ESLint + Jest

## Vision

Noosphere UI is a stylized terminal experience for building idea graphs:
- multi-map workspace
- node-and-edge based mind maps
- keyboard-accelerated editing
- thematic 40k/Mechanicus interface

## Mind Mapper Screenshot

![Noosphere Mind Mapper Example](docs/images/mind-mapper-example.png)

## Current Features

### Mind Mapper
- Create, rename, delete, and save multiple maps
- Add nodes and connect nodes (parent/child/sibling/manual links)
- Drag nodes to reposition
- Right-click node context menu actions
- Delete nodes and links (with confirmation for connected deletes)
- Node color variants
- Node sub-elements (properties): add, edit, remove, reorder, collapse
- Undo/redo (`Ctrl+Z`, `Ctrl+R`) for graph edits
- Pan/zoom canvas (drag empty space + mouse wheel)
- Multi-select:
  - `Shift + click` to add/remove node from selection
  - `Shift + drag` on empty canvas for box selection
  - drag any selected node to move the whole group
  - clear selection via `Esc` or empty-space click

### UX/Theme
- Terminal/chassis inspired shell and paneling
- Scanline-style visual treatment
- PWA-ready structure (manifest + service worker)

## Example Mind Map (Current UI)

Use this as a baseline scenario (matching your screenshot layout):

1. Create/open `Primary Map`.
2. Keep `Root Concept` as the center anchor.
3. Add a `parent node` and connect from `Root Concept` to it.
4. Add a `child node` and connect from `Root Concept` to it.
5. Add sub-elements (node properties) inside each node for notes.
6. Use map list on the left to switch maps and save changes.

Example structure:

```text
Root Concept -> parent node
Root Concept -> child node
```

## Project Structure

```text
noosphere.ui/
  frontend/
    src/
      components/
      routes/
      services/
      store/
    public/
  backend/
    src/
```

## Run Locally

### 1) Frontend

```bash
cd frontend
npm install
npm run start
```

Frontend dev server: `http://localhost:8080` (webpack-dev-server default)

### 2) Backend

```bash
cd backend
npm install
npm run dev
```

Backend default: `http://localhost:4000` (check `backend/src/server.js` if customized)

## Scripts

### Frontend (`frontend/package.json`)
- `npm run start` - development server
- `npm run build` - production build
- `npm run lint` - lint source
- `npm run test` - run tests

### Backend (`backend/package.json`)
- `npm run dev` - run with nodemon
- `npm run start` - run with node
- `npm run lint` - lint backend
- `npm run test` - run tests

## Planned Next Steps

- Persist maps to cloud database (instead of local-only persistence)
- Authentication and user-scoped maps
- Collaboration/share model
- Richer edge semantics and layout tools
