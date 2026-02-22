import React from 'react';
import PropTypes from 'prop-types';
import './mech-command-input.scss';

function MechCommandInput({ prompt = '[Tech-Priest Ascendant] $' }) {
  return (
    <label className="mech-command-input">
      <span>{prompt}</span>
      <input type="text" placeholder="Enter command..." />
    </label>
  );
}

MechCommandInput.propTypes = {
  prompt: PropTypes.string
};

MechCommandInput.defaultProps = {
  prompt: '[Tech-Priest Ascendant] $'
};

export default MechCommandInput;
