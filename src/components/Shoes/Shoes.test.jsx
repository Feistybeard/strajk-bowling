import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Booking from '../../views/Booking';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('shoes testing', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path='/' element={<Booking />} />
        </Routes>
      </MemoryRouter>
    );
  });

  it('should allow adding new shoe', () => {
    const addShoeButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(addShoeButton);
    const shoeSizeInput = screen.getAllByRole('textbox')[1];

    expect(shoeSizeInput).toBeVisible();
  });

  it('should allow setting shoe size', () => {
    const addShoeButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(addShoeButton);
    const shoeSizeInput = screen.getAllByRole('textbox')[1];

    fireEvent.change(shoeSizeInput, { target: { value: '43' } });
    expect(shoeSizeInput).toHaveValue('43');
  });

  it('should allow removing shoe', () => {
    const addShoeButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(addShoeButton);
    const removeShoeButton = screen.getByRole('button', { name: '-' });
    const shoeSizeInput = screen.getAllByRole('textbox')[1];

    fireEvent.click(removeShoeButton);
    expect(shoeSizeInput).not.toBeInTheDocument();
    expect(removeShoeButton).not.toBeInTheDocument();
  });
});
