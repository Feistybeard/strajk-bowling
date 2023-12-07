import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Booking from './Booking';
import Confirmation from './Confirmation';

describe('booking testing', () => {
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

  it('should make sure the booking page is rendered', () => {
    expect(screen.queryByText('When, WHAT & Who')).toBeInTheDocument();
  });

  it('should allow filling in all fields', () => {
    const dateInput = screen.getByText(/date/i).nextSibling;
    fireEvent.change(dateInput, { target: { value: '2023-12-31' } });
    expect(dateInput).toHaveValue('2023-12-31');

    const timeInput = screen.getByRole('textbox');
    fireEvent.change(timeInput, { target: { value: '15:00' } });
    expect(timeInput).toHaveValue('15:00');

    const bowlersInput = screen.getByText(/bowlers/i).nextSibling;
    fireEvent.change(bowlersInput, { target: { value: 4 } });
    expect(bowlersInput).toHaveValue(4);

    const lanesInput = screen.getByText(/lanes/i).nextSibling;
    fireEvent.change(lanesInput, { target: { value: 2 } });
    expect(lanesInput).toHaveValue(2);

    const addShoeButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(addShoeButton);
    const shoeSizeInput = screen.getAllByRole('textbox')[1];
    fireEvent.change(shoeSizeInput, { target: { value: 43 } });
    expect(shoeSizeInput).toHaveValue('43');
  });

  it('should not allow booking without filling in all fields', () => {
    const addShoeButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(addShoeButton);

    const submitButton = screen.getByRole('button', { name: 'strIIIIIike!' });
    fireEvent.click(submitButton);
    expect(
      screen.getByText(
        'Fill out all the fields and make sure that people and shoes is the same number.'
      )
    ).toBeInTheDocument();
  });

  it('should not allow booking with less shoes than bowlers', () => {
    const dateInput = screen.getByText(/date/i).nextSibling;
    fireEvent.change(dateInput, { target: { value: '2023-12-31' } });
    expect(dateInput).toHaveValue('2023-12-31');

    const timeInput = screen.getByText(/time/i).nextSibling;
    fireEvent.change(timeInput, { target: { value: '15:00' } });
    expect(timeInput).toHaveValue('15:00');

    const bowlersInput = screen.getByText(/bowlers/i).nextSibling;
    fireEvent.change(bowlersInput, { target: { value: 4 } });
    expect(bowlersInput).toHaveValue(4);

    const lanesInput = screen.getByText(/lanes/i).nextSibling;
    fireEvent.change(lanesInput, { target: { value: 1 } });
    expect(lanesInput).toHaveValue(1);

    const nrOfBowlers = screen.getByText(/bowlers/i).nextSibling.value;
    const addShoeButton = screen.getByRole('button', { name: '+' });
    let nrOfShoes = 0;
    for (let i = 0; i < nrOfBowlers; i++) {
      fireEvent.click(addShoeButton);
      const shoeSizeInput = screen.getAllByRole('textbox')[i + 1];
      fireEvent.change(shoeSizeInput, { target: { value: 43 } });
      expect(shoeSizeInput).toHaveValue('43');
      nrOfShoes++;
    }

    const submitButton = screen.getByRole('button', { name: 'strIIIIIike!' });
    fireEvent.click(submitButton);
    expect(Number(nrOfBowlers)).toBe(nrOfShoes);
  });

  it('should move to confirmation page when booking is successful', async () => {
    const dateInput = screen.getByText(/date/i).nextSibling;
    fireEvent.change(dateInput, { target: { value: '2023-12-31' } });
    expect(dateInput).toHaveValue('2023-12-31');

    const timeInput = screen.getByText(/time/i).nextSibling;
    fireEvent.change(timeInput, { target: { value: '15:00' } });
    expect(timeInput).toHaveValue('15:00');

    const bowlersInput = screen.getByText(/bowlers/i).nextSibling;
    fireEvent.change(bowlersInput, { target: { value: 4 } });
    expect(bowlersInput).toHaveValue(4);

    const lanesInput = screen.getByText(/lanes/i).nextSibling;
    fireEvent.change(lanesInput, { target: { value: 1 } });
    expect(lanesInput).toHaveValue(1);

    const nrOfBowlers = screen.getByText(/bowlers/i).nextSibling.value;
    const addShoeButton = screen.getByRole('button', { name: '+' });
    let nrOfShoes = 0;
    for (let i = 0; i < nrOfBowlers; i++) {
      fireEvent.click(addShoeButton);
      const shoeSizeInput = screen.getAllByRole('textbox')[i + 1];
      fireEvent.change(shoeSizeInput, { target: { value: 43 } });
      expect(shoeSizeInput).toHaveValue('43');
      nrOfShoes++;
    }

    const submitButton = screen.getByRole('button', { name: 'strIIIIIike!' });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.queryByText('See you soon!')).toBeInTheDocument();
    });
  });
});
