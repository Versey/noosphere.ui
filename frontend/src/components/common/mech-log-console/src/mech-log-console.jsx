import React from 'react';
import PropTypes from 'prop-types';
import './mech-log-console.scss';

function MechLogConsole({ lines }) {
  return (
    <div className="mech-log-console">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

MechLogConsole.propTypes = {
  lines: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default MechLogConsole;
