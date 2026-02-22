import React from 'react';
import { render, screen } from '@testing-library/react';
import MechFrame from './mech-frame';

describe('MechFrame', () => {
  it('renders child content', () => {
    render(
      <MechFrame>
        <span>machine-spirit</span>
      </MechFrame>
    );

    expect(screen.getByText('machine-spirit')).toBeInTheDocument();
  });
});
