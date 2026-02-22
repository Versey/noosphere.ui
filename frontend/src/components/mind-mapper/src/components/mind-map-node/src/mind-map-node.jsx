import React from 'react';
import PropTypes from 'prop-types';
import { getNodeColor } from '../../../helpers/mind-mapper-utils';
import MindNodeProperties from './components/mind-node-properties';

function MindMapNode({
  node,
  width,
  isSelected,
  isConnectOrigin,
  onMouseDown,
  onContextMenu,
  onClick,
  onTextChange,
  onAddProperty,
  onChangeProperty,
  onRemoveProperty,
  onReorderProperties
}) {
  const color = getNodeColor(node);
  const classes = ['mind-node'];

  if (isSelected) {
    classes.push('mind-node--selected');
  }

  if (isConnectOrigin) {
    classes.push('mind-node--connect-origin');
  }

  return (
    <div
      className={classes.join(' ')}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${width}px`,
        borderColor: color.border,
        background: color.fill
      }}
      onMouseDown={onMouseDown}
      onContextMenu={onContextMenu}
      onClick={onClick}
    >
      <p className="mind-node__id">{node.id}</p>
      <input value={node.text} data-node-interactive="true" onChange={(event) => onTextChange(event.target.value)} />
      <MindNodeProperties
        properties={node.properties || []}
        onAddProperty={onAddProperty}
        onChangeProperty={onChangeProperty}
        onRemoveProperty={onRemoveProperty}
        onReorderProperties={onReorderProperties}
      />
    </div>
  );
}

MindMapNode.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    colorKey: PropTypes.string,
    properties: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
      })
    )
  }).isRequired,
  width: PropTypes.number.isRequired,
  isSelected: PropTypes.bool,
  isConnectOrigin: PropTypes.bool,
  onMouseDown: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onTextChange: PropTypes.func.isRequired,
  onAddProperty: PropTypes.func.isRequired,
  onChangeProperty: PropTypes.func.isRequired,
  onRemoveProperty: PropTypes.func.isRequired,
  onReorderProperties: PropTypes.func.isRequired
};

MindMapNode.defaultProps = {
  isSelected: false,
  isConnectOrigin: false
};

export default MindMapNode;
