# Developer Documentation

## 🛠️ Build System

Luxe Theme uses **Webpack** and **Sass** for asset management.

- **Source Files**: `src/javascript/` and `src/styles/`
- **Compiled Assets**: `assets/`

### Development Commands
- `npm install`: Install dependencies.
- `npm run build`: Build production assets.
- `npm run watch`: Watch for changes and build development assets.
- `npm run dev`: Build and start Shopify CLI watch.

## 🏗️ Architecture

### Sections & Blocks
The theme is built using modular Liquid sections. Most sections support blocks for maximum flexibility in the Theme Editor.

### JavaScript Modularity
Our core logic lives in `assets/luxe-theme.js`. It uses a modular approach where each feature is initialized independently.

### CSS Structure
We use BEM (Block Element Modifier) naming convention for our SCSS to ensure maintainable and conflict-free styling.

## ♿ Accessibility
We aim for WCAG 2.1 AA compliance.
- All interactive elements have appropriate ARIA labels.
- Keyboard navigation is supported via logical tab order and focus states.
- Semantic HTML is used throughout.

## 🚀 Performance Optimization
- **Images**: We use `image_tag` with smart `loading` attributes and `fetchpriority`.
- **CSS**: Critical CSS is inlined in `theme.liquid`.
- **JS**: Scripts are loaded with `defer` to prevent render-blocking.
