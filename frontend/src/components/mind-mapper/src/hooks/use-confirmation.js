import { useRef, useState } from 'react';

const DEFAULT_ACTIONS = [
  { label: 'Cancel', variant: 'secondary', role: 'cancel' },
  { label: 'Confirm', variant: 'primary', role: 'confirm' }
];

function useConfirmation() {
  const actionHandlersRef = useRef([]);
  const [confirmation, setConfirmation] = useState({
    show: false,
    title: 'Confirm Action',
    message: '',
    actions: DEFAULT_ACTIONS
  });

  function ask(config) {
    const actions = (config.actions && config.actions.length > 0 ? config.actions : DEFAULT_ACTIONS).map((action) => ({
      label: action.label,
      variant: action.variant || 'primary',
      role: action.role || 'confirm'
    }));

    actionHandlersRef.current = (config.actions || DEFAULT_ACTIONS).map((action) => action.onClick || null);

    setConfirmation({
      show: true,
      title: config.title || 'Confirm Action',
      message: config.message || '',
      actions
    });
  }

  function close() {
    actionHandlersRef.current = [];
    setConfirmation((prev) => ({ ...prev, show: false }));
  }

  function runAction(index) {
    const handler = actionHandlersRef.current[index];
    if (handler) {
      handler();
    }
    close();
  }

  return {
    confirmation,
    ask,
    close,
    runAction
  };
}

export default useConfirmation;
