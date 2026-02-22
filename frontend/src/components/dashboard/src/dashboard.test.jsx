import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './dashboard';

describe('Dashboard', () => {
  it('renders dashboard welcome text', async () => {
    render(<Dashboard />);
    expect(await screen.findByText('Welcome to the Adeptus Mechanicus Cogitator Terminal')).toBeInTheDocument();
  });
});
