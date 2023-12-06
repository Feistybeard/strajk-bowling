import { beforeEach, it, expect } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Route, Routes, MemoryRouter } from 'react-router-dom';
import Booking from '../../views/Booking';
import Confirmation from '../../views/Confirmation';

describe('navigation testing', () => {
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path='/' element={<Booking />} />
          <Route path='/confirmation' element={<Confirmation />} />
        </Routes>
      </MemoryRouter>
    );
  });
  const nav = () => screen.getByRole('navigation');
  const navIcon = () => within(nav()).getByRole('img');

  it('should toggle the menu when the icon is clicked', async () => {
    expect(nav()).not.toHaveClass('show-menu');
    fireEvent.click(navIcon());
    expect(nav()).toHaveClass('show-menu');
    fireEvent.click(navIcon());
    expect(nav()).not.toHaveClass('show-menu');
  });

  it('should navigate to the booking page when the booking link is clicked', async () => {
    expect(nav()).not.toHaveClass('show-menu');
    fireEvent.click(navIcon());
    const bookingLink = screen.getByRole('link', { name: 'Booking' });
    fireEvent.click(bookingLink);
    expect(screen.queryByText('When, WHAT & Who')).toBeInTheDocument();
  });

  it('should navigate to the confirmation page when the confirmation link is clicked', async () => {
    expect(nav()).not.toHaveClass('show-menu');
    fireEvent.click(navIcon());
    const confirmationLink = screen.getByRole('link', { name: 'Confirmation' });
    fireEvent.click(confirmationLink);
    expect(screen.queryByText('Inga bokning gjord!')).toBeInTheDocument();
  });
});
