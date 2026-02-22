import { DEFAULT_NODE_COLOR_KEY, NODE_COLOR_OPTIONS } from './mind-mapper-constants';

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function toWorldPoint(clientX, clientY, rect, view) {
  return {
    x: (clientX - rect.left - view.x) / view.scale,
    y: (clientY - rect.top - view.y) / view.scale
  };
}

export function toCenterPoint(node, nodeWidth, nodeHeight, canvasOffset) {
  return {
    x: node.x + nodeWidth / 2 + canvasOffset,
    y: node.y + nodeHeight / 2 + canvasOffset
  };
}

export function buildNodeMap(nodes) {
  return nodes.reduce((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {});
}

export function getRelatedEdges(edges, nodeId) {
  return edges.filter((edge) => edge.from === nodeId || edge.to === nodeId);
}

export function canStartPan(target) {
  if (!target) {
    return true;
  }

  if (target.closest('.mind-node') || target.closest('.mind-node-menu')) {
    return false;
  }

  return true;
}

export function getRelativePosition(relation, source) {
  const offsets = {
    parent: { x: 0, y: -150 },
    child: { x: 0, y: 150 },
    sibling: { x: 230, y: 0 }
  };

  const offset = offsets[relation] || { x: 0, y: 0 };

  return {
    x: source.x + offset.x,
    y: source.y + offset.y
  };
}

export function isTextInputTarget(target) {
  if (!target) {
    return false;
  }

  if (target.closest('[data-node-interactive="true"]')) {
    return true;
  }

  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON' || target.isContentEditable;
}

export function createNode(id, x, y, text = 'New Node') {
  return {
    id,
    text,
    x,
    y,
    colorKey: DEFAULT_NODE_COLOR_KEY,
    properties: []
  };
}

export function cloneMapState(state) {
  return {
    nodes: state.nodes.map((node) => ({
      ...node,
      properties: (node.properties || []).map((property) => ({ ...property }))
    })),
    edges: state.edges.map((edge) => ({ ...edge })),
    view: { ...state.view },
    selectedNodeId: state.selectedNodeId,
    connectFromId: state.connectFromId
  };
}

export function getNodeColor(node) {
  return NODE_COLOR_OPTIONS.find((color) => color.key === node.colorKey) || NODE_COLOR_OPTIONS[0];
}
