import React from 'react';
import { render, screen } from '@testing-library/react';
import MechLogConsole from './mech-log-console';

describe('MechLogConsole', () => {
  it('renders log lines', () => {
    render(<MechLogConsole lines={['line one', 'line two']} />);
    expect(screen.getByText('line one')).toBeInTheDocument();
    expect(screen.getByText('line two')).toBeInTheDocument();
  });
});
