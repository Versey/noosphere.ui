import React from 'react';
import PropTypes from 'prop-types';
import './mech-status-pill.scss';

function MechStatusPill({ text }) {
  return <span className="mech-status-pill">{text}</span>;
}

MechStatusPill.propTypes = {
  text: PropTypes.string.isRequired
};

export default MechStatusPill;
