import React from 'react';
import PropTypes from 'prop-types';
import './mech-folder-tile.scss';

function MechFolderTile({ label }) {
  return (
    <button type="button" className="mech-folder-tile">
      <span className="mech-folder-tile__icon">??</span>
      <span className="mech-folder-tile__label">{label}</span>
    </button>
  );
}

MechFolderTile.propTypes = {
  label: PropTypes.string.isRequired
};

export default MechFolderTile;
