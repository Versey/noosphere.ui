import React from 'react';
import PropTypes from 'prop-types';

function MindMapContextMenu({
  visible,
  menuType,
  x,
  y,
  colorOptions,
  onAddNode,
  onAddParent,
  onAddChild,
  onAddSibling,
  onConnect,
  onDelete,
  onColorChange
}) {
  if (!visible) {
    return null;
  }

  const isNodeMenu = menuType === 'node';

  return (
    <div className="mind-node-menu" style={{ left: `${x}px`, top: `${y}px` }} onClick={(event) => event.stopPropagation()}>
      {!isNodeMenu ? (
        <button type="button" onClick={onAddNode}>
          Add Node
        </button>
      ) : null}

      {isNodeMenu ? (
        <>
          <button type="button" onClick={onAddParent}>
            Add Parent
          </button>
          <button type="button" onClick={onAddChild}>
            Add Child
          </button>
          <button type="button" onClick={onAddSibling}>
            Add Sibling
          </button>
          <button type="button" onClick={onConnect}>
            Connect
          </button>

          <div className="mind-node-menu__colors">
            <p>Node Color</p>
            <div>
              {colorOptions.map((color) => (
                <button key={color.key} type="button" onClick={() => onColorChange(color.key)}>
                  {color.label}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="mind-node-menu__delete" onClick={onDelete}>
            Delete
          </button>
        </>
      ) : null}
    </div>
  );
}

MindMapContextMenu.propTypes = {
  visible: PropTypes.bool.isRequired,
  menuType: PropTypes.oneOf(['node', 'canvas']),
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  colorOptions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  onAddNode: PropTypes.func.isRequired,
  onAddParent: PropTypes.func.isRequired,
  onAddChild: PropTypes.func.isRequired,
  onAddSibling: PropTypes.func.isRequired,
  onConnect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onColorChange: PropTypes.func.isRequired
};

MindMapContextMenu.defaultProps = {
  menuType: 'canvas',
  colorOptions: []
};

export default MindMapContextMenu;
