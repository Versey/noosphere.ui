import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import MechSidebar from './mech-sidebar';

describe('MechSidebar', () => {
  it('highlights active route item', () => {
    render(
      <MemoryRouter>
        <MechSidebar
          title="Cogitator"
          items={[
            { key: 'main', label: 'Main Interface', path: '/' },
            { key: 'mapper', label: 'Mind Mapper', path: '/mind-mapper' }
          ]}
          activePath="/mind-mapper"
        />
      </MemoryRouter>
    );

    const active = screen.getByText('Mind Mapper').closest('li');
    expect(active).toHaveClass('is-active');
  });
});
