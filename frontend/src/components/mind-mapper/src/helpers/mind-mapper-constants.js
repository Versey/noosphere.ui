export const NODE_WIDTH = 180;
export const NODE_HEIGHT = 72;
export const CANVAS_SIZE = 8000;
export const CANVAS_OFFSET = 4000;
export const MIN_SCALE = 0.35;
export const MAX_SCALE = 2.2;

export const NODE_COLOR_OPTIONS = [
  { key: 'emerald', label: 'Emerald', border: '#0f7b49', fill: 'rgba(0, 36, 22, 0.9)' },
  { key: 'amber', label: 'Amber', border: '#b98f2d', fill: 'rgba(44, 31, 10, 0.9)' },
  { key: 'crimson', label: 'Crimson', border: '#9d2f2f', fill: 'rgba(39, 10, 10, 0.9)' },
  { key: 'steel', label: 'Steel', border: '#4d6f78', fill: 'rgba(9, 25, 29, 0.9)' }
];

export const EDGE_PATTERN_OPTIONS = [
  { key: 'solid', label: 'Solid' },
  { key: 'dotted', label: 'Dotted' },
  { key: 'bold', label: 'Bold' }
];

export const DEFAULT_NODE_COLOR_KEY = 'emerald';
export const DEFAULT_EDGE_PATTERN = 'solid';
