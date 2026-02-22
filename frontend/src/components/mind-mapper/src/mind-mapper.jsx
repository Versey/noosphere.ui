import React, { useRef, useState } from 'react';
import AsyncFeature from '../../common/async-feature';
import { MechConfirmModal, MechPanel } from '../../common';
import MindMapContextMenu from './components/mind-map-context-menu';
import MindMapList from './components/mind-map-list';
import MindMapNode from './components/mind-map-node';
import MindMapToolbar from './components/mind-map-toolbar';
import {
  CANVAS_OFFSET,
  CANVAS_SIZE,
  NODE_HEIGHT,
  NODE_WIDTH
} from './helpers/mind-mapper-constants';
import { toCenterPoint } from './helpers/mind-mapper-utils';
import useMindMapper from './hooks/use-mind-mapper';
import './mind-mapper.scss';

const initMindMapper = () => Promise.resolve();

function MindMapper() {
  const [mapListCollapsed, setMapListCollapsed] = useState(false);
  const viewportRef = useRef(null);

  const {
    editorState,
    maps,
    activeMapId,
    isDirty,
    nodesById,
    contextMenu,
    selectedNodeIds,
    selectionState,
    nodeColors,
    confirmation,
    cancelConfirmation,
    addNodeAtViewportCenter,
    addNodeAtPosition,
    addRelativeNode,
    beginConnect,
    connectToNode,
    createMap,
    deleteEdge,
    deleteMap,
    onCanvasContextMenu,
    onCanvasClick,
    onCanvasMouseDown,
    onCanvasWheel,
    onNodeContextMenu,
    onNodeMouseDown,
    onNodePropertyChange,
    onNodeTextChange,
    redo,
    renameMap,
    requestDeleteNode,
    saveActiveMap,
    selectMap,
    setNodeColor,
    addNodeProperty,
    removeNodeProperty,
    reorderProperties,
    undo,
    canUndo,
    canRedo
  } = useMindMapper(viewportRef);

  return (
    <AsyncFeature title="Noosphere Mind Mapping Chamber /" init={initMindMapper}>
      <MechPanel title="Noosphere Mind Mapping Chamber /" className="mind-mapper-panel">
        <div className="mind-mapper-shell">
          <div className={`mind-mapper-body ${mapListCollapsed ? 'mind-mapper-body--list-collapsed' : ''}`.trim()}>
            <MindMapList
              maps={maps}
              activeMapId={activeMapId}
              isDirty={isDirty}
              collapsed={mapListCollapsed}
              onToggleCollapse={() => setMapListCollapsed((prev) => !prev)}
              onSelect={selectMap}
              onCreate={createMap}
              onDelete={deleteMap}
              onRename={renameMap}
              onSave={saveActiveMap}
            />

            <div className="mind-mapper-canvas">
              <MindMapToolbar
                onAddNode={addNodeAtViewportCenter}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                connectFromId={editorState.connectFromId}
                selectedCount={selectedNodeIds.length}
              />

              <div
                ref={viewportRef}
                className="mind-mapper-viewport"
                onMouseDown={onCanvasMouseDown}
                onContextMenu={onCanvasContextMenu}
                onWheel={onCanvasWheel}
                onClick={onCanvasClick}
              >
                <div
                  className="mind-mapper-world"
                  style={{
                    transform: `translate(${editorState.view.x}px, ${editorState.view.y}px) scale(${editorState.view.scale})`
                  }}
                >
                  <svg
                    className="mind-mapper-edges"
                    width={CANVAS_SIZE}
                    height={CANVAS_SIZE}
                    viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
                  >
                    {editorState.edges.map((edge) => {
                      const fromNode = nodesById[edge.from];
                      const toNode = nodesById[edge.to];

                      if (!fromNode || !toNode) {
                        return null;
                      }

                      const fromCenter = toCenterPoint(fromNode, NODE_WIDTH, NODE_HEIGHT, CANVAS_OFFSET);
                      const toCenter = toCenterPoint(toNode, NODE_WIDTH, NODE_HEIGHT, CANVAS_OFFSET);

                      return (
                        <line
                          key={edge.id}
                          className="mind-mapper-edge"
                          x1={fromCenter.x}
                          y1={fromCenter.y}
                          x2={toCenter.x}
                          y2={toCenter.y}
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteEdge(edge.id);
                          }}
                        />
                      );
                    })}
                  </svg>

                  <div className="mind-mapper-nodes">
                    {editorState.nodes.map((node) => (
                      <MindMapNode
                        key={node.id}
                        node={node}
                        width={NODE_WIDTH}
                        isSelected={
                          selectedNodeIds.length > 0
                            ? selectedNodeIds.includes(node.id)
                            : editorState.selectedNodeId === node.id
                        }
                        isConnectOrigin={editorState.connectFromId === node.id}
                        onMouseDown={(event) => onNodeMouseDown(event, node.id)}
                        onContextMenu={(event) => onNodeContextMenu(event, node.id)}
                        onClick={(event) => {
                          event.stopPropagation();
                          connectToNode(node.id);
                        }}
                        onTextChange={(value) => onNodeTextChange(node.id, value)}
                        onAddProperty={() => addNodeProperty(node.id)}
                        onChangeProperty={(propertyId, value) => onNodePropertyChange(node.id, propertyId, value)}
                        onRemoveProperty={(propertyId) => removeNodeProperty(node.id, propertyId)}
                        onReorderProperties={(fromPropertyId, toPropertyId) =>
                          reorderProperties(node.id, fromPropertyId, toPropertyId)
                        }
                      />
                    ))}
                  </div>
                </div>

                {selectionState ? (
                  <div
                    className="mind-mapper-selection-box"
                    style={{
                      left: `${Math.min(selectionState.startClientX, selectionState.endClientX)}px`,
                      top: `${Math.min(selectionState.startClientY, selectionState.endClientY)}px`,
                      width: `${Math.abs(selectionState.endClientX - selectionState.startClientX)}px`,
                      height: `${Math.abs(selectionState.endClientY - selectionState.startClientY)}px`
                    }}
                  />
                ) : null}

                <MindMapContextMenu
                  visible={contextMenu.visible}
                  menuType={contextMenu.menuType}
                  x={contextMenu.x}
                  y={contextMenu.y}
                  colorOptions={nodeColors}
                  onAddNode={() => addNodeAtPosition(contextMenu.worldX, contextMenu.worldY)}
                  onAddParent={() => addRelativeNode('parent', contextMenu.nodeId)}
                  onAddChild={() => addRelativeNode('child', contextMenu.nodeId)}
                  onAddSibling={() => addRelativeNode('sibling', contextMenu.nodeId)}
                  onConnect={() => beginConnect(contextMenu.nodeId)}
                  onDelete={() => requestDeleteNode(contextMenu.nodeId)}
                  onColorChange={(colorKey) => setNodeColor(contextMenu.nodeId, colorKey)}
                />
              </div>
            </div>
          </div>
        </div>
      </MechPanel>

      <MechConfirmModal
        show={confirmation.confirmation.show}
        title={confirmation.confirmation.title}
        message={confirmation.confirmation.message}
        actions={confirmation.confirmation.actions}
        onAction={confirmation.runAction}
        onCancel={cancelConfirmation}
      />
    </AsyncFeature>
  );
}

export default MindMapper;
