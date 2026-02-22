import React from 'react';
import { render, screen } from '@testing-library/react';
import AsyncFeature from './async-feature';

describe('AsyncFeature', () => {
  it('renders loading state before init resolves', () => {
    render(
      <AsyncFeature title="Init" init={() => new Promise(() => {})}>
        <div>ready</div>
      </AsyncFeature>
    );

    expect(screen.getByText('Synchronizing machine-spirit context...')).toBeInTheDocument();
  });
});
