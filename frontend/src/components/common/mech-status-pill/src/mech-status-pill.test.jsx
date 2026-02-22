import React from 'react';
import { render, screen } from '@testing-library/react';
import MechStatusPill from './mech-status-pill';

describe('MechStatusPill', () => {
  it('renders text', () => {
    render(<MechStatusPill text="Developer Mode" />);
    expect(screen.getByText('Developer Mode')).toBeInTheDocument();
  });
});
