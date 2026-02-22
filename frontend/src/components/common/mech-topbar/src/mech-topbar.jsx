import React from 'react';
import PropTypes from 'prop-types';
import MechStatusPill from '../../mech-status-pill';
import MechLogo from '../../mech-logo';
import './mech-topbar.scss';

function MechTopbar({ title, subtitle, mode }) {
  return (
    <header className="mech-topbar">
      <div className="mech-topbar__left">
        <div className="mech-topbar__sigil">
          <MechLogo />
        </div>
      </div>

      <div className="mech-topbar__center">
        <p className="mech-topbar__strap">Blessed be the machine</p>
        <div className="mech-topbar__titles">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="mech-topbar__right">
        <MechStatusPill text={mode} />
      </div>
    </header>
  );
}

MechTopbar.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired
};

export default MechTopbar;
