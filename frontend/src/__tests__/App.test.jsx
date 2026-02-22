import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders mechanicus shell title', async () => {
    render(<App />);
    expect(await screen.findByText('Adeptus Mechanicus')).toBeInTheDocument();
  });
});
