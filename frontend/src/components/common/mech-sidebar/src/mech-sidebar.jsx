import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import './mech-sidebar.scss';

function MechSidebar({ title, items, activePath, collapsed, onToggleCollapse }) {
  return (
    <aside className={`mech-sidebar ${collapsed ? 'is-collapsed' : ''}`.trim()}>
      <div className="mech-sidebar__header">
        {collapsed ? null : (
          <div className="mech-sidebar__title-wrap">
            <p className="mech-sidebar__title">{title}</p>
            <p className="mech-sidebar__subtitle">Cogitator Channel</p>
          </div>
        )}
        <button type="button" className="mech-sidebar__toggle" onClick={onToggleCollapse}>
          {collapsed ? '>' : '<'}
        </button>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.key || item.label} className={item.path === activePath ? 'is-active' : ''}>
            <NavLink to={item.path} title={item.label}>{collapsed ? item.label.slice(0, 1) : item.label}</NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

MechSidebar.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired
    })
  ).isRequired,
  activePath: PropTypes.string,
  collapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func
};

MechSidebar.defaultProps = {
  activePath: '',
  collapsed: false,
  onToggleCollapse: () => {}
};

export default MechSidebar;
