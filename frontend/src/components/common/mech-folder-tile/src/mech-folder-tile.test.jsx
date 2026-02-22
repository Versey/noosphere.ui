import React from 'react';
import { render, screen } from '@testing-library/react';
import MechFolderTile from './mech-folder-tile';

describe('MechFolderTile', () => {
  it('renders folder label', () => {
    render(<MechFolderTile label="anomalies" />);
    expect(screen.getByText('anomalies')).toBeInTheDocument();
  });
});
