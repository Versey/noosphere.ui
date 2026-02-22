import React from 'react';
import './mech-logo.scss';

function MechLogo() {
  return (
    <div className="mech-logo" aria-hidden="true">
      <img src="/icons/icon.svg" alt="Mechanicus Logo" />
      <span className="mech-logo__scanline" />
    </div>
  );
}

export default MechLogo;
