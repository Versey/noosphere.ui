import React from 'react';
import PropTypes from 'prop-types';

function MindMapToolbar({
  onAddNode,
  onConnectSelected,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  connectFromId,
  selectedCount
}) {
  return (
    <div className="mind-mapper-toolbar">
      <button type="button" onClick={onAddNode}>
        Add Node
      </button>
      <button type="button" disabled={selectedCount < 2} onClick={onConnectSelected}>
        Connect
      </button>
      <button type="button" disabled={!canUndo} onClick={onUndo}>
        Undo
      </button>
      <button type="button" disabled={!canRedo} onClick={onRedo}>
        Redo
      </button>
      <p className="mind-mapper-toolbar__selection">{selectedCount} selected</p>
      <p>
        Drag empty space to select. Hold Space + drag to pan. Press C to connect selected.
        {connectFromId ? ` Connecting from ${connectFromId}: select target node.` : ''}
      </p>
    </div>
  );
}

MindMapToolbar.propTypes = {
  onAddNode: PropTypes.func.isRequired,
  onConnectSelected: PropTypes.func.isRequired,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
  selectedCount: PropTypes.number,
  canUndo: PropTypes.bool,
  canRedo: PropTypes.bool,
  connectFromId: PropTypes.string
};

MindMapToolbar.defaultProps = {
  canUndo: false,
  canRedo: false,
  connectFromId: null,
  selectedCount: 0
};

export default MindMapToolbar;
