import { createAction, createSlice } from '@reduxjs/toolkit';
import { DEFAULT_EDGE_PATTERN, DEFAULT_NODE_COLOR_KEY } from '../../components/mind-mapper/src/helpers/mind-mapper-constants';
import {
  cloneMapState,
  createNode,
  getRelativePosition
} from '../../components/mind-mapper/src/helpers/mind-mapper-utils';
import {
  createNodeProperty,
  reorderNodeProperties
} from '../../components/mind-mapper/src/helpers/mind-mapper-node-properties';

const INITIAL_EDITOR_STATE = {
  nodes: [{ ...createNode('node-1', 340, 220, 'Root Concept'), colorKey: 'steel' }],
  edges: [],
  view: { x: 0, y: 0, scale: 1 },
  selectedNodeId: 'node-1',
  connectFromId: null
};

function createMapDocument(id, name, snapshot) {
  return {
    id,
    name,
    snapshot: cloneMapState(snapshot)
  };
}

function pushHistory(state) {
  state.history.past.push(cloneMapState(state.editorState));
  state.history.future = [];
}

function nextNodeId(state) {
  const id = `node-${state.counters.node}`;
  state.counters.node += 1;
  return id;
}

function nextEdgeId(state) {
  const id = `edge-${state.counters.edge}`;
  state.counters.edge += 1;
  return id;
}

function nextMapId(state) {
  const id = `map-${state.counters.map}`;
  state.counters.map += 1;
  return id;
}

function nextPropertyId(state) {
  const id = `prop-${state.counters.property}`;
  state.counters.property += 1;
  return id;
}

function addUniqueEdge(state, from, to) {
  if (!from || !to || from === to) {
    return;
  }

  const exists = state.editorState.edges.some((edge) => edge.from === from && edge.to === to);
  if (exists) {
    return;
  }

  state.editorState.edges.push({
    id: nextEdgeId(state),
    from,
    to,
    colorKey: DEFAULT_NODE_COLOR_KEY,
    pattern: DEFAULT_EDGE_PATTERN
  });
}

const initialState = {
  editorState: INITIAL_EDITOR_STATE,
  maps: [createMapDocument('map-1', 'Primary Map', INITIAL_EDITOR_STATE)],
  activeMapId: 'map-1',
  isDirty: false,
  history: {
    past: [],
    future: []
  },
  counters: {
    node: 2,
    edge: 1,
    map: 2,
    property: 1
  }
};

const mindMapperSlice = createSlice({
  name: 'mindMapper',
  initialState,
  reducers: {
    saveActiveMap(state) {
      const activeMap = state.maps.find((map) => map.id === state.activeMapId);
      if (!activeMap) {
        return;
      }

      activeMap.snapshot = cloneMapState(state.editorState);
      state.isDirty = false;
    },
    loadMapById(state, action) {
      const targetMap = state.maps.find((map) => map.id === action.payload);
      if (!targetMap) {
        return;
      }

      state.activeMapId = targetMap.id;
      state.editorState = cloneMapState(targetMap.snapshot);
      state.isDirty = false;
      state.history.past = [];
      state.history.future = [];
    },
    createMap(state) {
      const mapId = nextMapId(state);
      const mapName = `Map ${mapId.split('-')[1]}`;
      const rootNodeId = nextNodeId(state);
      const freshState = {
        ...INITIAL_EDITOR_STATE,
        nodes: [{ ...createNode(rootNodeId, 340, 220, 'Root Concept'), colorKey: 'steel' }],
        selectedNodeId: null,
        connectFromId: null
      };

      state.maps.push(createMapDocument(mapId, mapName, freshState));
      state.activeMapId = mapId;
      state.editorState = freshState;
      state.isDirty = false;
      state.history.past = [];
      state.history.future = [];
    },
    renameMap(state, action) {
      const { mapId, nextName } = action.payload;
      const targetMap = state.maps.find((map) => map.id === mapId);
      if (!targetMap) {
        return;
      }

      targetMap.name = nextName;
    },
    deleteMap(state, action) {
      const mapId = action.payload;
      const nextMaps = state.maps.filter((map) => map.id !== mapId);

      if (nextMaps.length === 0) {
        state.maps = [createMapDocument('map-1', 'Primary Map', INITIAL_EDITOR_STATE)];
        state.activeMapId = 'map-1';
        state.editorState = cloneMapState(INITIAL_EDITOR_STATE);
        state.isDirty = false;
        state.history.past = [];
        state.history.future = [];
        state.counters = {
          node: 2,
          edge: 1,
          map: 2,
          property: 1
        };
        return;
      }

      state.maps = nextMaps;
      if (state.activeMapId === mapId) {
        state.activeMapId = nextMaps[0].id;
        state.editorState = cloneMapState(nextMaps[0].snapshot);
        state.isDirty = false;
        state.history.past = [];
        state.history.future = [];
      }
    },
    addNode(state, action) {
      const { x, y, text = 'New Node' } = action.payload;
      pushHistory(state);
      const createdId = nextNodeId(state);
      state.editorState.nodes.push(createNode(createdId, x, y, text));
      state.editorState.selectedNodeId = createdId;
      state.isDirty = true;
    },
    addRelativeNode(state, action) {
      const { relation, sourceId } = action.payload;
      const sourceNode = state.editorState.nodes.find((node) => node.id === sourceId);
      if (!sourceNode) {
        return;
      }

      pushHistory(state);

      const createdId = nextNodeId(state);
      const nextPos = getRelativePosition(relation, sourceNode);
      state.editorState.nodes.push(createNode(createdId, nextPos.x, nextPos.y, `${relation} node`));

      const incomingEdges = state.editorState.edges.filter((edge) => edge.to === sourceId);

      if (relation === 'child') {
        addUniqueEdge(state, sourceId, createdId);
      }

      if (relation === 'sibling') {
        if (incomingEdges.length === 0) {
          addUniqueEdge(state, sourceId, createdId);
        } else {
          incomingEdges.forEach((edge) => addUniqueEdge(state, edge.from, createdId));
        }
      }

      if (relation === 'parent') {
        state.editorState.edges = state.editorState.edges.filter((edge) => edge.to !== sourceId);
        incomingEdges.forEach((edge) => addUniqueEdge(state, edge.from, createdId));
        addUniqueEdge(state, createdId, sourceId);
      }

      state.editorState.selectedNodeId = createdId;
      state.isDirty = true;
    },
    beginConnect(state, action) {
      const sourceId = action.payload;
      state.editorState.connectFromId = sourceId;
      state.editorState.selectedNodeId = sourceId;
    },
    connectToNode(state, action) {
      const targetId = action.payload;
      const sourceId = state.editorState.connectFromId;

      if (!sourceId || sourceId === targetId) {
        state.editorState.selectedNodeId = targetId;
        return;
      }

      pushHistory(state);
      addUniqueEdge(state, sourceId, targetId);
      state.editorState.connectFromId = null;
      state.editorState.selectedNodeId = targetId;
      state.isDirty = true;
    },
    connectSelectedNodes(state, action) {
      const nodeIds = (action.payload || []).filter(Boolean);
      if (nodeIds.length < 2) {
        return;
      }

      const existingIds = new Set(state.editorState.nodes.map((node) => node.id));
      const validIds = nodeIds.filter((id) => existingIds.has(id));
      if (validIds.length < 2) {
        return;
      }

      pushHistory(state);
      const sourceId = validIds[0];
      validIds.slice(1).forEach((targetId) => {
        addUniqueEdge(state, sourceId, targetId);
      });
      state.editorState.connectFromId = null;
      state.editorState.selectedNodeId = sourceId;
      state.isDirty = true;
    },
    setNodeColor(state, action) {
      const { nodeId, colorKey } = action.payload;
      const targetNode = state.editorState.nodes.find((node) => node.id === nodeId);
      if (!targetNode) {
        return;
      }

      targetNode.colorKey = colorKey || DEFAULT_NODE_COLOR_KEY;
      state.isDirty = true;
    },
    deleteNode(state, action) {
      const nodeId = action.payload;
      state.editorState.nodes = state.editorState.nodes.filter((node) => node.id !== nodeId);
      state.editorState.edges = state.editorState.edges.filter((edge) => edge.from !== nodeId && edge.to !== nodeId);
      if (state.editorState.selectedNodeId === nodeId) {
        state.editorState.selectedNodeId = null;
      }
      if (state.editorState.connectFromId === nodeId) {
        state.editorState.connectFromId = null;
      }
      state.isDirty = true;
    },
    deleteEdge(state, action) {
      const edgeId = action.payload;
      state.editorState.edges = state.editorState.edges.filter((edge) => edge.id !== edgeId);
      state.isDirty = true;
    },
    updateEdgeStyle(state, action) {
      const { edgeId, colorKey, pattern } = action.payload;
      const targetEdge = state.editorState.edges.find((edge) => edge.id === edgeId);
      if (!targetEdge) {
        return;
      }

      if (colorKey) {
        targetEdge.colorKey = colorKey;
      }

      if (pattern) {
        targetEdge.pattern = pattern;
      }

      state.isDirty = true;
    },
    updateNodeText(state, action) {
      const { nodeId, value } = action.payload;
      const targetNode = state.editorState.nodes.find((node) => node.id === nodeId);
      if (!targetNode) {
        return;
      }

      targetNode.text = value;
      state.isDirty = true;
    },
    addNodeProperty(state, action) {
      const nodeId = action.payload;
      const targetNode = state.editorState.nodes.find((node) => node.id === nodeId);
      if (!targetNode) {
        return;
      }

      pushHistory(state);
      targetNode.properties = targetNode.properties || [];
      targetNode.properties.push(createNodeProperty(nextPropertyId(state)));
      state.isDirty = true;
    },
    updateNodeProperty(state, action) {
      const { nodeId, propertyId, value } = action.payload;
      const targetNode = state.editorState.nodes.find((node) => node.id === nodeId);
      if (!targetNode) {
        return;
      }

      targetNode.properties = (targetNode.properties || []).map((property) =>
        property.id === propertyId ? { ...property, text: value } : property
      );
      state.isDirty = true;
    },
    removeNodeProperty(state, action) {
      const { nodeId, propertyId } = action.payload;
      const targetNode = state.editorState.nodes.find((node) => node.id === nodeId);
      if (!targetNode) {
        return;
      }

      targetNode.properties = (targetNode.properties || []).filter((property) => property.id !== propertyId);
      state.isDirty = true;
    },
    reorderProperties(state, action) {
      const { nodeId, fromPropertyId, toPropertyId } = action.payload;
      const targetNode = state.editorState.nodes.find((node) => node.id === nodeId);
      if (!targetNode) {
        return;
      }

      targetNode.properties = reorderNodeProperties(
        targetNode.properties || [],
        fromPropertyId,
        toPropertyId
      );
      state.isDirty = true;
    },
    setSelectedNodeId(state, action) {
      state.editorState.selectedNodeId = action.payload;
    },
    setView(state, action) {
      state.editorState.view = action.payload;
    },
    moveNode(state, action) {
      const { nodeId, x, y } = action.payload;
      const targetNode = state.editorState.nodes.find((node) => node.id === nodeId);
      if (!targetNode) {
        return;
      }

      targetNode.x = x;
      targetNode.y = y;
      state.isDirty = true;
    },
    undo(state) {
      if (state.history.past.length === 0) {
        return;
      }

      const previousState = state.history.past[state.history.past.length - 1];
      state.history.future.push(cloneMapState(state.editorState));
      state.history.past = state.history.past.slice(0, -1);
      state.editorState = cloneMapState(previousState);
      state.isDirty = true;
    },
    redo(state) {
      if (state.history.future.length === 0) {
        return;
      }

      const nextState = state.history.future[state.history.future.length - 1];
      state.history.past.push(cloneMapState(state.editorState));
      state.history.future = state.history.future.slice(0, -1);
      state.editorState = cloneMapState(nextState);
      state.isDirty = true;
    }
  }
});

export const saveActiveMapRequested = createAction('mindMapper/saveActiveMapRequested');

export const {
  saveActiveMap,
  loadMapById,
  createMap,
  renameMap,
  deleteMap,
  addNode,
  addRelativeNode,
  beginConnect,
  connectToNode,
  connectSelectedNodes,
  setNodeColor,
  deleteNode,
  deleteEdge,
  updateEdgeStyle,
  updateNodeText,
  addNodeProperty,
  updateNodeProperty,
  removeNodeProperty,
  reorderProperties,
  setSelectedNodeId,
  setView,
  moveNode,
  undo,
  redo
} = mindMapperSlice.actions;

export const selectMindMapperState = (state) => state.mindMapper;
export const selectCanUndo = (state) => state.mindMapper.history.past.length > 0;
export const selectCanRedo = (state) => state.mindMapper.history.future.length > 0;

export default mindMapperSlice.reducer;
