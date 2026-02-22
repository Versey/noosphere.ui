import React, { useState } from 'react';
import PropTypes from 'prop-types';

function MindNodeProperties({ properties, onAddProperty, onChangeProperty, onRemoveProperty, onReorderProperties }) {
  const [dragPropertyId, setDragPropertyId] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  function onDropProperty(targetPropertyId) {
    if (!dragPropertyId || dragPropertyId === targetPropertyId) {
      return;
    }

    onReorderProperties(dragPropertyId, targetPropertyId);
  }

  return (
    <div
      className={`mind-node__properties ${isCollapsed ? 'is-collapsed' : ''}`.trim()}
      data-node-interactive="true"
    >
      <div className="mind-node__properties-header">
        <p>Sub Elements {properties.length ? `(${properties.length})` : ''}</p>
        <div className="mind-node__properties-actions">
          <button type="button" data-node-interactive="true" onClick={() => setIsCollapsed((prev) => !prev)}>
            {isCollapsed ? '>' : 'v'}
          </button>
          <button type="button" data-node-interactive="true" onClick={onAddProperty}>
            +
          </button>
        </div>
      </div>

      <div className={`mind-node__property-list ${isCollapsed ? 'is-hidden' : ''}`.trim()}>
        {properties.map((property) => (
          <div
            key={property.id}
            className="mind-node__property-row"
            draggable
            data-node-interactive="true"
            onDragStart={() => setDragPropertyId(property.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => onDropProperty(property.id)}
            onDragEnd={() => setDragPropertyId(null)}
          >
            <input
              value={property.text}
              data-node-interactive="true"
              onChange={(event) => onChangeProperty(property.id, event.target.value)}
            />
            <button
              type="button"
              className="mind-node__property-remove"
              data-node-interactive="true"
              onClick={() => onRemoveProperty(property.id)}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

MindNodeProperties.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })
  ),
  onAddProperty: PropTypes.func.isRequired,
  onChangeProperty: PropTypes.func.isRequired,
  onRemoveProperty: PropTypes.func.isRequired,
  onReorderProperties: PropTypes.func.isRequired
};

MindNodeProperties.defaultProps = {
  properties: []
};

export default MindNodeProperties;
