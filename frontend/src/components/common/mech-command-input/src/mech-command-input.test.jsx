import React from 'react';
import { render, screen } from '@testing-library/react';
import MechCommandInput from './mech-command-input';

describe('MechCommandInput', () => {
  it('renders placeholder text', () => {
    render(<MechCommandInput />);
    expect(screen.getByPlaceholderText('Enter command...')).toBeInTheDocument();
  });
});
