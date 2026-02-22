import React from 'react';
import PropTypes from 'prop-types';
import './mech-confirm-modal.scss';

function MechConfirmModal({ show, title, message, actions, onAction, onCancel }) {
  if (!show) {
    return null;
  }

  return (
    <div className="mech-modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="mech-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mech-modal__header">
          <h3>{title}</h3>
        </header>
        <section className="mech-modal__body">
          <p>{message}</p>
        </section>
        <footer className="mech-modal__footer">
          {actions.map((action, index) => (
            <button
              key={`${action.label}-${index}`}
              type="button"
              className={`mech-modal__button mech-modal__button--${action.variant || 'primary'}`}
              onClick={() => onAction(index)}
            >
              {action.label}
            </button>
          ))}
        </footer>
      </div>
    </div>
  );
}

MechConfirmModal.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      variant: PropTypes.oneOf(['primary', 'danger', 'secondary'])
    })
  ),
  onAction: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

MechConfirmModal.defaultProps = {
  show: false,
  title: 'Confirm Action',
  message: '',
  actions: [
    { label: 'Cancel', variant: 'secondary' },
    { label: 'Confirm', variant: 'primary' }
  ]
};

export default MechConfirmModal;
