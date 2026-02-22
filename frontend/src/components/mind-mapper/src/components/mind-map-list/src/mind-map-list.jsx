import React, { useState } from 'react';
import PropTypes from 'prop-types';

function MindMapList({
  maps,
  activeMapId,
  isDirty,
  collapsed,
  onToggleCollapse,
  onSelect,
  onCreate,
  onDelete,
  onRename,
  onSave
}) {
  const [editingMapId, setEditingMapId] = useState(null);
  const [editingName, setEditingName] = useState('');

  function startRename(map) {
    setEditingMapId(map.id);
    setEditingName(map.name);
  }

  function cancelRename() {
    setEditingMapId(null);
    setEditingName('');
  }

  function commitRename(mapId) {
    const nextName = editingName.trim();
    if (nextName) {
      onRename(mapId, nextName);
    }

    cancelRename();
  }

  return (
    <aside className={`mind-map-list ${collapsed ? 'is-collapsed' : ''}`.trim()}>
      <header className="mind-map-list__header">
        {collapsed ? null : <h4>Maps</h4>}
        <div className="mind-map-list__controls">
          <button type="button" onClick={onToggleCollapse}>
            {collapsed ? '>' : '<'}
          </button>
          {collapsed ? null : (
            <>
              <button type="button" onClick={onCreate}>
                New
              </button>
              <button type="button" onClick={onSave} disabled={!isDirty}>
                Save
              </button>
            </>
          )}
        </div>
      </header>

      {collapsed ? null : (
        <div className="mind-map-list__items">
          {maps.map((map) => (
            <div
              key={map.id}
              className={`mind-map-list__item ${map.id === activeMapId ? 'is-active' : ''}`}
              onClick={() => onSelect(map.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onSelect(map.id);
                }
              }}
            >
              {editingMapId === map.id ? (
                <input
                  value={editingName}
                  autoFocus
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) => setEditingName(event.target.value)}
                  onBlur={() => commitRename(map.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      commitRename(map.id);
                    }

                    if (event.key === 'Escape') {
                      event.preventDefault();
                      cancelRename();
                    }
                  }}
                />
              ) : (
                <div className="mind-map-list__item-row">
                  <span className="mind-map-list__name">{map.name}</span>
                  <button
                    type="button"
                    className="mind-map-list__edit"
                    onClick={(event) => {
                      event.stopPropagation();
                      startRename(map);
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}
              <button
                type="button"
                className="mind-map-list__delete"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(map.id);
                }}
              >
                Delete
              </button>
              {map.id === activeMapId && isDirty ? <span className="mind-map-list__dirty">Unsaved</span> : null}
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

MindMapList.propTypes = {
  maps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  activeMapId: PropTypes.string,
  isDirty: PropTypes.bool,
  collapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

MindMapList.defaultProps = {
  activeMapId: null,
  isDirty: false,
  collapsed: false,
  onToggleCollapse: () => {}
};

export default MindMapList;
