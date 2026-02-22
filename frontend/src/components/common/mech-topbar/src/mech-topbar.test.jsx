import React from 'react';
import { render, screen } from '@testing-library/react';
import MechTopbar from './mech-topbar';

describe('MechTopbar', () => {
  it('renders title and mode', () => {
    render(<MechTopbar title="Adeptus Mechanicus" subtitle="Noosphere Terminal" mode="Tech-Priest" />);

    expect(screen.getByText('Adeptus Mechanicus')).toBeInTheDocument();
    expect(screen.getByText('Tech-Priest')).toBeInTheDocument();
  });
});
