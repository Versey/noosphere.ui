import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  EDGE_PATTERN_OPTIONS,
  DEFAULT_NODE_COLOR_KEY,
  MAX_SCALE,
  MIN_SCALE,
  NODE_COLOR_OPTIONS,
  NODE_HEIGHT,
  NODE_WIDTH
} from '../helpers/mind-mapper-constants';
import { buildNodeMap, canStartPan, clamp, getRelatedEdges, isTextInputTarget, toWorldPoint } from '../helpers/mind-mapper-utils';
import useConfirmation from './use-confirmation';
import useWheelScrollLock from './use-wheel-scroll-lock';
import {
  addNode,
  addNodeProperty,
  addRelativeNode,
  beginConnect,
  connectSelectedNodes as connectSelectedNodesAction,
  connectToNode,
  createMap as createMapAction,
  deleteEdge as deleteEdgeAction,
  deleteMap as deleteMapAction,
  deleteNode,
  loadMapById,
  moveNode,
  redo,
  removeNodeProperty,
  renameMap as renameMapAction,
  reorderProperties as reorderPropertiesAction,
  saveActiveMapRequested,
  selectCanRedo,
  selectCanUndo,
  selectMindMapperState,
  updateEdgeStyle as updateEdgeStyleAction,
  setNodeColor as setNodeColorAction,
  setSelectedNodeId,
  setView,
  undo,
  updateNodeProperty,
  updateNodeText
} from '../../../../store/mind-mapper/mind-mapper-slice';

const INITIAL_CONTEXT_MENU = {
  visible: false,
  x: 0,
  y: 0,
  worldX: 0,
  worldY: 0,
  nodeId: null,
  edgeId: null,
  menuType: 'canvas'
};

function normalizeBounds(start, end) {
  return {
    left: Math.min(start.x, end.x),
    right: Math.max(start.x, end.x),
    top: Math.min(start.y, end.y),
    bottom: Math.max(start.y, end.y)
  };
}

function intersectsNode(bounds, node) {
  const nodeLeft = node.x;
  const nodeRight = node.x + NODE_WIDTH;
  const nodeTop = node.y;
  const nodeBottom = node.y + NODE_HEIGHT;

  return !(
    nodeRight < bounds.left ||
    nodeLeft > bounds.right ||
    nodeBottom < bounds.top ||
    nodeTop > bounds.bottom
  );
}

function useMindMapper(viewportRef) {
  const dispatch = useDispatch();
  const confirmation = useConfirmation();
  const { editorState, maps, activeMapId, isDirty } = useSelector(selectMindMapperState);
  const canUndo = useSelector(selectCanUndo);
  const canRedo = useSelector(selectCanRedo);
  const [dragState, setDragState] = useState(null);
  const [panState, setPanState] = useState(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [selectedNodeIds, setSelectedNodeIds] = useState([]);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [selectionState, setSelectionState] = useState(null);
  const [suppressCanvasClick, setSuppressCanvasClick] = useState(false);
  const [contextMenu, setContextMenu] = useState(INITIAL_CONTEXT_MENU);
  const pointerGestureRef = useRef({ startX: 0, startY: 0, moved: false });

  useWheelScrollLock(viewportRef);

  const nodesById = useMemo(() => buildNodeMap(editorState.nodes), [editorState.nodes]);

  function closeContextMenu() {
    setContextMenu(INITIAL_CONTEXT_MENU);
  }

  function saveActiveMap() {
    dispatch(saveActiveMapRequested());
  }

  function loadMap(targetMapId) {
    dispatch(loadMapById(targetMapId));
    closeContextMenu();
  }

  function askSaveBeforeContinue(onContinue) {
    if (!isDirty) {
      onContinue();
      return;
    }

    confirmation.ask({
      title: 'Unsaved Changes',
      message: 'Save current map before continuing?',
      actions: [
        {
          label: 'Save and Continue',
          variant: 'primary',
          onClick: () => {
            saveActiveMap();
            onContinue();
          }
        },
        {
          label: "Don't Save",
          variant: 'secondary',
          onClick: onContinue
        },
        {
          label: 'Cancel',
          variant: 'secondary',
          onClick: () => {}
        }
      ]
    });
  }

  function selectMap(mapId) {
    if (mapId === activeMapId) {
      return;
    }

    askSaveBeforeContinue(() => loadMap(mapId));
  }

  function createMap() {
    askSaveBeforeContinue(() => {
      dispatch(createMapAction());
      closeContextMenu();
    });
  }

  function renameMap(mapId, nextName) {
    dispatch(renameMapAction({ mapId, nextName }));
  }

  function deleteMap(mapId) {
    const target = maps.find((map) => map.id === mapId);
    if (!target) {
      return;
    }

    confirmation.ask({
      title: 'Delete Map',
      message: `Delete map "${target.name}"?`,
      actions: [
        {
          label: 'Delete',
          variant: 'danger',
          onClick: () => dispatch(deleteMapAction(mapId))
        },
        {
          label: 'Cancel',
          variant: 'secondary',
          onClick: () => {}
        }
      ]
    });
  }

  function addNodeAtViewportCenter() {
    if (!viewportRef.current) {
      return;
    }

    const rect = viewportRef.current.getBoundingClientRect();
    const centerWorld = {
      x: (rect.width / 2 - editorState.view.x) / editorState.view.scale,
      y: (rect.height / 2 - editorState.view.y) / editorState.view.scale
    };

    dispatch(addNode({ x: centerWorld.x - NODE_WIDTH / 2, y: centerWorld.y - NODE_HEIGHT / 2, text: 'New Node' }));
    closeContextMenu();
  }

  function addNodeAtPosition(worldX, worldY) {
    dispatch(addNode({ x: worldX - NODE_WIDTH / 2, y: worldY - NODE_HEIGHT / 2, text: 'New Node' }));
    closeContextMenu();
  }

  function addRelativeNodeByType(relation, sourceId) {
    dispatch(addRelativeNode({ relation, sourceId }));
    closeContextMenu();
  }

  function beginConnectFromNode(sourceId) {
    dispatch(beginConnect(sourceId));
    closeContextMenu();
  }

  function connectToNodeById(targetId) {
    if (!editorState.connectFromId) {
      return;
    }

    dispatch(connectToNode(targetId));
  }

  function connectSelectedNodes() {
    if (selectedNodeIds.length < 2) {
      return;
    }

    dispatch(connectSelectedNodesAction(selectedNodeIds));
    closeContextMenu();
  }

  function setNodeColor(nodeId, colorKey) {
    dispatch(setNodeColorAction({ nodeId, colorKey: colorKey || DEFAULT_NODE_COLOR_KEY }));
    closeContextMenu();
  }

  function performDeleteNode(nodeId) {
    dispatch(deleteNode(nodeId));
    closeContextMenu();
  }

  function requestDeleteNode(nodeId) {
    if (!nodeId) {
      return;
    }

    const relatedEdges = getRelatedEdges(editorState.edges, nodeId);
    if (relatedEdges.length === 0) {
      performDeleteNode(nodeId);
      return;
    }

    confirmation.ask({
      title: 'Delete Node',
      message: 'This node has connected links. Delete this node and all connected links?',
      actions: [
        {
          label: 'Delete',
          variant: 'danger',
          onClick: () => performDeleteNode(nodeId)
        },
        {
          label: 'Cancel',
          variant: 'secondary',
          onClick: () => {}
        }
      ]
    });
  }

  function requestDeleteSelectedNodes() {
    if (selectedNodeIds.length === 0) {
      requestDeleteNode(editorState.selectedNodeId);
      return;
    }

    if (selectedNodeIds.length === 1) {
      requestDeleteNode(selectedNodeIds[0]);
      return;
    }

    const relatedEdges = editorState.edges.filter(
      (edge) => selectedNodeIds.includes(edge.from) || selectedNodeIds.includes(edge.to)
    );

    const deleteAll = () => {
      selectedNodeIds.forEach((nodeId) => dispatch(deleteNode(nodeId)));
      setSelectedNodeIds([]);
      dispatch(setSelectedNodeId(null));
      closeContextMenu();
    };

    if (relatedEdges.length === 0) {
      deleteAll();
      return;
    }

    confirmation.ask({
      title: 'Delete Nodes',
      message: 'Selected nodes have connected links. Delete selected nodes and affected links?',
      actions: [
        { label: 'Delete', variant: 'danger', onClick: deleteAll },
        { label: 'Cancel', variant: 'secondary', onClick: () => {} }
      ]
    });
  }

  function onNodeMouseDown(event, nodeId) {
    if (event.button !== 0 || isTextInputTarget(event.target) || !viewportRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    pointerGestureRef.current = { startX: event.clientX, startY: event.clientY, moved: false };
    setSelectedEdgeId(null);

    if (event.shiftKey) {
      setSelectedNodeIds((previous) => {
        const exists = previous.includes(nodeId);
        const next = exists ? previous.filter((id) => id !== nodeId) : [...previous, nodeId];
        dispatch(setSelectedNodeId(next[0] || null));
        return next;
      });
      closeContextMenu();
      return;
    }

    const node = nodesById[nodeId];
    if (!node) {
      return;
    }

    const rect = viewportRef.current.getBoundingClientRect();
    const pointer = toWorldPoint(event.clientX, event.clientY, rect, editorState.view);
    const isGroupDrag = selectedNodeIds.length > 1 && selectedNodeIds.includes(nodeId);

    if (isGroupDrag) {
      setDragState({
        mode: 'group',
        anchorNodeId: nodeId,
        anchorOffsetX: pointer.x - node.x,
        anchorOffsetY: pointer.y - node.y,
        initialPositions: selectedNodeIds.reduce((acc, currentId) => {
          const target = nodesById[currentId];
          if (target) {
            acc[currentId] = { x: target.x, y: target.y };
          }
          return acc;
        }, {})
      });
    } else {
      setDragState({
        mode: 'single',
        nodeId,
        offsetX: pointer.x - node.x,
        offsetY: pointer.y - node.y
      });
      setSelectedNodeIds([nodeId]);
    }

    dispatch(setSelectedNodeId(nodeId));
    closeContextMenu();
  }

  function onCanvasMouseDown(event) {
    if (event.button !== 0 || !canStartPan(event.target)) {
      return;
    }

    pointerGestureRef.current = { startX: event.clientX, startY: event.clientY, moved: false };
    setSelectedEdgeId(null);

    if (!isSpacePressed && viewportRef.current) {
      const rect = viewportRef.current.getBoundingClientRect();
      const world = toWorldPoint(event.clientX, event.clientY, rect, editorState.view);

      setSelectionState({
        startClientX: event.clientX - rect.left,
        startClientY: event.clientY - rect.top,
        endClientX: event.clientX - rect.left,
        endClientY: event.clientY - rect.top,
        startWorldX: world.x,
        startWorldY: world.y,
        endWorldX: world.x,
        endWorldY: world.y
      });

      setSelectedNodeIds([]);
      dispatch(setSelectedNodeId(null));
      closeContextMenu();
      return;
    }

    setPanState({
      startX: event.clientX,
      startY: event.clientY,
      originX: editorState.view.x,
      originY: editorState.view.y
    });

    closeContextMenu();
  }

  function onCanvasWheel(event) {
    if (!viewportRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const rect = viewportRef.current.getBoundingClientRect();
    const world = toWorldPoint(event.clientX, event.clientY, rect, editorState.view);
    const scaleStep = event.deltaY < 0 ? 1.1 : 0.9;
    const nextScale = clamp(editorState.view.scale * scaleStep, MIN_SCALE, MAX_SCALE);

    dispatch(
      setView({
        scale: nextScale,
        x: event.clientX - rect.left - world.x * nextScale,
        y: event.clientY - rect.top - world.y * nextScale
      })
    );
  }

  function onCanvasContextMenu(event) {
    event.preventDefault();

    if (!viewportRef.current || event.target.closest('.mind-node') || event.target.closest('.mind-node-menu')) {
      return;
    }

    const rect = viewportRef.current.getBoundingClientRect();
    const world = toWorldPoint(event.clientX, event.clientY, rect, editorState.view);

    setContextMenu({
      visible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      worldX: world.x,
      worldY: world.y,
      nodeId: null,
      edgeId: null,
      menuType: 'canvas'
    });
  }

  function onNodeContextMenu(event, nodeId) {
    event.preventDefault();

    if (!viewportRef.current) {
      return;
    }

    const rect = viewportRef.current.getBoundingClientRect();
    const world = toWorldPoint(event.clientX, event.clientY, rect, editorState.view);
    setSelectedEdgeId(null);

    setContextMenu({
      visible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      worldX: world.x,
      worldY: world.y,
      nodeId,
      edgeId: null,
      menuType: 'node'
    });

    dispatch(setSelectedNodeId(nodeId));
    setSelectedNodeIds([nodeId]);
  }

  function onNodeTextChange(nodeId, value) {
    dispatch(updateNodeText({ nodeId, value }));
  }

  function onEdgeClick(event, edgeId) {
    event.preventDefault();
    event.stopPropagation();
    setSelectedEdgeId(edgeId);
    closeContextMenu();
  }

  function onEdgeContextMenu(event, edgeId) {
    event.preventDefault();
    event.stopPropagation();

    if (!viewportRef.current) {
      return;
    }

    const rect = viewportRef.current.getBoundingClientRect();
    const world = toWorldPoint(event.clientX, event.clientY, rect, editorState.view);
    setSelectedEdgeId(edgeId);
    setSelectedNodeIds([]);
    dispatch(setSelectedNodeId(null));

    setContextMenu({
      visible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      worldX: world.x,
      worldY: world.y,
      nodeId: null,
      edgeId,
      menuType: 'edge'
    });
  }

  function onCanvasClick() {
    if (suppressCanvasClick) {
      setSuppressCanvasClick(false);
      return;
    }

    closeContextMenu();
    setSelectedEdgeId(null);
    dispatch(setSelectedNodeId(null));
    setSelectedNodeIds([]);
  }

  function deleteEdge(edgeId) {
    dispatch(deleteEdgeAction(edgeId));
    if (selectedEdgeId === edgeId) {
      setSelectedEdgeId(null);
    }
    closeContextMenu();
  }

  function deleteSelectedEdge() {
    if (!selectedEdgeId) {
      return;
    }

    deleteEdge(selectedEdgeId);
  }

  function setEdgeColor(edgeId, colorKey) {
    if (!edgeId) {
      return;
    }

    dispatch(updateEdgeStyleAction({ edgeId, colorKey }));
    closeContextMenu();
  }

  function setEdgePattern(edgeId, pattern) {
    if (!edgeId) {
      return;
    }

    dispatch(updateEdgeStyleAction({ edgeId, pattern }));
    closeContextMenu();
  }

  function onNodePropertyChange(nodeId, propertyId, value) {
    dispatch(updateNodeProperty({ nodeId, propertyId, value }));
  }

  function addNodePropertyToNode(nodeId) {
    dispatch(addNodeProperty(nodeId));
  }

  function removeNodePropertyFromNode(nodeId, propertyId) {
    dispatch(removeNodeProperty({ nodeId, propertyId }));
  }

  function reorderNodeProperties(nodeId, fromPropertyId, toPropertyId) {
    dispatch(reorderPropertiesAction({ nodeId, fromPropertyId, toPropertyId }));
  }

  function undoAction() {
    dispatch(undo());
    closeContextMenu();
  }

  function redoAction() {
    dispatch(redo());
    closeContextMenu();
  }

  useEffect(() => {
    function stopInteractions() {
      const hadDragGesture = pointerGestureRef.current.moved && (dragState || panState || selectionState);
      if (hadDragGesture) {
        setSuppressCanvasClick(true);
      }

      setDragState(null);
      setPanState(null);
      setSelectionState(null);
      pointerGestureRef.current = { startX: 0, startY: 0, moved: false };
    }

    window.addEventListener('mouseup', stopInteractions);
    return () => {
      window.removeEventListener('mouseup', stopInteractions);
    };
  }, [dragState, panState, selectionState]);

  useEffect(() => {
    function onMouseMove(event) {
      const movementX = Math.abs(event.clientX - pointerGestureRef.current.startX);
      const movementY = Math.abs(event.clientY - pointerGestureRef.current.startY);
      if (movementX > 3 || movementY > 3) {
        pointerGestureRef.current.moved = true;
      }

      if (dragState && viewportRef.current) {
        const rect = viewportRef.current.getBoundingClientRect();
        const world = toWorldPoint(event.clientX, event.clientY, rect, editorState.view);

        if (dragState.mode === 'group') {
          const anchorStart = dragState.initialPositions[dragState.anchorNodeId];
          if (anchorStart) {
            const anchorTargetX = world.x - dragState.anchorOffsetX;
            const anchorTargetY = world.y - dragState.anchorOffsetY;
            const deltaX = anchorTargetX - anchorStart.x;
            const deltaY = anchorTargetY - anchorStart.y;

            Object.entries(dragState.initialPositions).forEach(([nodeId, position]) => {
              dispatch(
                moveNode({
                  nodeId,
                  x: position.x + deltaX,
                  y: position.y + deltaY
                })
              );
            });
          }
        } else {
          dispatch(
            moveNode({
              nodeId: dragState.nodeId,
              x: world.x - dragState.offsetX,
              y: world.y - dragState.offsetY
            })
          );
        }
      }

      if (panState) {
        dispatch(
          setView({
            ...editorState.view,
            x: panState.originX + (event.clientX - panState.startX),
            y: panState.originY + (event.clientY - panState.startY)
          })
        );
      }

      if (selectionState && viewportRef.current) {
        const rect = viewportRef.current.getBoundingClientRect();
        const world = toWorldPoint(event.clientX, event.clientY, rect, editorState.view);

        const nextSelection = {
          ...selectionState,
          endClientX: event.clientX - rect.left,
          endClientY: event.clientY - rect.top,
          endWorldX: world.x,
          endWorldY: world.y
        };

        const bounds = normalizeBounds(
          { x: nextSelection.startWorldX, y: nextSelection.startWorldY },
          { x: nextSelection.endWorldX, y: nextSelection.endWorldY }
        );

        const selectedIds = editorState.nodes
          .filter((node) => intersectsNode(bounds, node))
          .map((node) => node.id);

        setSelectionState(nextSelection);
        setSelectedNodeIds(selectedIds);
        dispatch(setSelectedNodeId(selectedIds[0] || null));
      }
    }

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [dispatch, dragState, panState, selectionState, editorState.nodes, editorState.view, viewportRef]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key !== ' ' || isTextInputTarget(event.target)) {
        return;
      }

      event.preventDefault();
      setIsSpacePressed(true);
    }

    function onKeyUp(event) {
      if (event.key !== ' ') {
        return;
      }

      setIsSpacePressed(false);
      setPanState(null);
    }

    function onBlur() {
      setIsSpacePressed(false);
      setPanState(null);
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event) {
      if (isTextInputTarget(event.target)) {
        return;
      }

      if (event.ctrlKey && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        undoAction();
        return;
      }

      if (event.ctrlKey && event.key.toLowerCase() === 'r') {
        event.preventDefault();
        redoAction();
        return;
      }

      if (event.key === 'Delete') {
        event.preventDefault();
        if (selectedEdgeId) {
          deleteSelectedEdge();
          return;
        }

        requestDeleteSelectedNodes();
        return;
      }

      if (!event.ctrlKey && !event.altKey && !event.metaKey && event.key.toLowerCase() === 'c') {
        event.preventDefault();
        connectSelectedNodes();
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        setSelectedEdgeId(null);
        setSelectedNodeIds([]);
        setSelectionState(null);
        dispatch(setSelectedNodeId(null));
        closeContextMenu();
        return;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedNodeIds, selectedEdgeId, editorState.selectedNodeId, editorState.edges, editorState.connectFromId]);

  useEffect(() => {
    setSelectionState(null);
    setSelectedNodeIds([]);
    setSelectedEdgeId(null);
  }, [activeMapId]);

  function cancelConfirmation() {
    confirmation.close();
  }

  return {
    editorState,
    maps,
    activeMapId,
    isDirty,
    nodesById,
    contextMenu,
    isSpacePressed,
    selectedNodeIds,
    selectedEdgeId,
    selectionState,
    nodeColors: NODE_COLOR_OPTIONS,
    edgePatterns: EDGE_PATTERN_OPTIONS,
    confirmation,
    cancelConfirmation,
    addNodeAtViewportCenter,
    addNodeAtPosition,
    addRelativeNode: addRelativeNodeByType,
    beginConnect: beginConnectFromNode,
    closeContextMenu,
    connectToNode: connectToNodeById,
    connectSelectedNodes,
    createMap,
    deleteEdge,
    deleteMap,
    onCanvasContextMenu,
    onCanvasMouseDown,
    onCanvasWheel,
    onNodeContextMenu,
    onEdgeClick,
    onEdgeContextMenu,
    onNodePropertyChange,
    onNodeMouseDown,
    onNodeTextChange,
    onCanvasClick,
    redo: redoAction,
    renameMap,
    requestDeleteNode,
    deleteSelectedEdge,
    saveActiveMap,
    selectMap,
    setNodeColor,
    setEdgeColor,
    setEdgePattern,
    addNodeProperty: addNodePropertyToNode,
    removeNodeProperty: removeNodePropertyFromNode,
    reorderProperties: reorderNodeProperties,
    setSelectedNodeId: (nodeId) => {
      dispatch(setSelectedNodeId(nodeId));
      if (nodeId) {
        setSelectedNodeIds([nodeId]);
      } else {
        setSelectedNodeIds([]);
      }
    },
    undo: undoAction,
    canUndo,
    canRedo
  };
}

export default useMindMapper;
