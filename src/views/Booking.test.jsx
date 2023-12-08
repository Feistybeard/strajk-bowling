import {
  beforeEach,
  describe,
  it,
  expect,
  vi,
  afterAll,
  beforeAll,
  afterEach,
} from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import server from '../msw/server';
import { booking } from '../msw/handlers';
import Booking from './Booking';
import Confirmation from './Confirmation';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function addShoes(nrOfBowlers, data) {
  const addShoeButton = screen.getByRole('button', { name: '+' });
  let nrOfShoes = 0;

  for (let i = 0; i < nrOfBowlers; i++) {
    fireEvent.click(addShoeButton);
    const shoeSizeInput = screen.getAllByRole('textbox')[i + 1];
    fireEvent.change(shoeSizeInput, { target: { value: data.shoes[i] } });
    expect(shoeSizeInput).toHaveValue(data.shoes[0]);
    nrOfShoes++;
  }
  return nrOfShoes;
}

function fillForm(data) {
  const dateInput = screen.getByText(/date/i).nextSibling;
  fireEvent.change(dateInput, {
    target: { value: data.when.split('-').slice(0, 3).join('-') },
  });

  const timeInput = screen.getByText(/time/i).nextSibling;
  fireEvent.change(timeInput, {
    target: { value: data.when.split('T')[1] },
  });

  const bowlersInput = screen.getByText(/bowlers/i).nextSibling;
  fireEvent.change(bowlersInput, { target: { value: data.people } });

  const lanesInput = screen.getByText(/lanes/i).nextSibling;
  fireEvent.change(lanesInput, { target: { value: data.lanes } });
  expect(dateInput).toHaveValue(data.when.split('-').slice(0, 3).join('-'));
  expect(timeInput).toHaveValue(data.when.split('T')[1]);
  expect(bowlersInput).toHaveValue(data.people);
  expect(lanesInput).toHaveValue(data.lanes);
}

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

  it('should make sure the booking page is rendered', async () => {
    expect(screen.queryByText('When, WHAT & Who')).toBeInTheDocument();
  });

  it('should allow filling in all fields', async () => {
    fillForm(booking);
    const addShoeButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(addShoeButton);
    const shoeSizeInput = screen.getAllByRole('textbox')[1];
    fireEvent.change(shoeSizeInput, { target: { value: 43 } });

    expect(shoeSizeInput).toHaveValue('43');
  });

  it('should not allow booking without filling in all fields', async () => {
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

  it('should not allow booking with less shoes than bowlers', async () => {
    fillForm(booking);
    const nrOfBowlers = screen.getByText(/bowlers/i).nextSibling.value;
    const nrOfShoes = addShoes(nrOfBowlers, booking);

    const submitButton = screen.getByRole('button', { name: 'strIIIIIike!' });
    const removeShoeButton = screen.getAllByText('-')[0];
    fireEvent.click(removeShoeButton);
    fireEvent.click(submitButton);

    const error = screen.getAllByRole('article')[1];
    expect(error).toHaveTextContent(
      'Fill out all the fields and make sure that people and shoes is the same number.'
    );
  });

  it('should move to confirmation page when booking is successful', async () => {
    const fetch = vi.spyOn(window, 'fetch');

    fillForm(booking);

    const nrOfBowlers = screen.getByText(/bowlers/i).nextSibling.value;
    addShoes(nrOfBowlers, booking);
    const submitButton = screen.getByRole('button', { name: 'strIIIIIike!' });
    fireEvent.click(submitButton);

    expect(fetch).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText('See you soon!')).toBeInTheDocument();
      expect(screen.getByText('Booking number')).toBeInTheDocument();
      expect(screen.getByText('Total:')).toBeInTheDocument();
    });
  });
});
