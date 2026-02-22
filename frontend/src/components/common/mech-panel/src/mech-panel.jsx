import React from 'react';
import PropTypes from 'prop-types';
import './mech-panel.scss';

function MechPanel({ title, children, className = '' }) {
  return (
    <section className={`mech-panel ${className}`.trim()}>
      {title ? <p className="mech-panel__title">{title}</p> : null}
      {children}
    </section>
  );
}

MechPanel.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
};

MechPanel.defaultProps = {
  title: '',
  children: null,
  className: ''
};

export default MechPanel;
