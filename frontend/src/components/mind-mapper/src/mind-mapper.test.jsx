import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import MindMapper from './mind-mapper';
import { createAppStore } from '../../../store';

describe('MindMapper', () => {
  it('adds a node from toolbar action', async () => {
    const store = createAppStore();

    render(
      <Provider store={store}>
        <MindMapper />
      </Provider>
    );

    const addNodeButton = await screen.findByRole('button', { name: 'Add Node' });
    fireEvent.click(addNodeButton);

    expect(screen.getAllByDisplayValue(/node/i).length).toBeGreaterThanOrEqual(1);
  });
});
