import React from 'react';
import PropTypes from 'prop-types';

function MindMapToolbar({
  onAddNode,
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
      <button type="button" disabled={!canUndo} onClick={onUndo}>
        Undo
      </button>
      <button type="button" disabled={!canRedo} onClick={onRedo}>
        Redo
      </button>
      <p className="mind-mapper-toolbar__selection">{selectedCount} selected</p>
      <p>
        Shift + drag to multi-select. Drag empty space to pan. Mouse wheel to zoom.
        {connectFromId ? ` Connecting from ${connectFromId}: select target node.` : ''}
      </p>
    </div>
  );
}

MindMapToolbar.propTypes = {
  onAddNode: PropTypes.func.isRequired,
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
