import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MechPanel from '../../mech-panel';
import './async-feature.scss';

function AsyncFeature({ title, init, children }) {
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    async function runInit() {
      try {
        if (init) {
          await init();
        }
        if (mounted) {
          setStatus('ready');
        }
      } catch (error) {
        if (mounted) {
          setStatus('error');
          setErrorMessage(error?.message || 'Unknown initialization error.');
        }
      }
    }

    runInit();

    return () => {
      mounted = false;
    };
  }, [init]);

  if (status === 'loading') {
    return (
      <MechPanel title={title} className="async-feature">
        <p className="async-feature__state">Synchronizing machine-spirit context...</p>
      </MechPanel>
    );
  }

  if (status === 'error') {
    return (
      <MechPanel title={title} className="async-feature async-feature--error">
        <p className="async-feature__state">Initialization fault: {errorMessage}</p>
      </MechPanel>
    );
  }

  return children;
}

AsyncFeature.propTypes = {
  title: PropTypes.string,
  init: PropTypes.func,
  children: PropTypes.node.isRequired
};

AsyncFeature.defaultProps = {
  title: '',
  init: null
};

export default AsyncFeature;
