import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MechConfirmModal from './mech-confirm-modal';

describe('MechConfirmModal', () => {
  it('runs selected action', () => {
    const onAction = jest.fn();
    const onCancel = jest.fn();

    render(
      <MechConfirmModal
        show
        title="Confirm"
        message="Proceed"
        actions={[{ label: 'Cancel', variant: 'secondary' }, { label: 'Go', variant: 'primary' }]}
        onAction={onAction}
        onCancel={onCancel}
      />
    );

    fireEvent.click(screen.getByText('Go'));
    expect(onAction).toHaveBeenCalledWith(1);
  });
});
