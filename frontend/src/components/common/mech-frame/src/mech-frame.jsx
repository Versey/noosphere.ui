import React from 'react';
import PropTypes from 'prop-types';
import './mech-frame.scss';

function MechFrame({ children, sidebarCollapsed }) {
  const classes = ['mech-frame'];

  if (sidebarCollapsed) {
    classes.push('mech-frame--sidebar-collapsed');
  }

  return <div className={classes.join(' ')}>{children}</div>;
}

MechFrame.propTypes = {
  children: PropTypes.node.isRequired,
  sidebarCollapsed: PropTypes.bool
};

MechFrame.defaultProps = {
  sidebarCollapsed: false
};

export default MechFrame;
