import React from 'react';
import { render, screen } from '@testing-library/react';
import MechPanel from './mech-panel';

describe('MechPanel', () => {
  it('renders title when provided', () => {
    render(<MechPanel title="Data Archives">content</MechPanel>);
    expect(screen.getByText('Data Archives')).toBeInTheDocument();
  });
});
