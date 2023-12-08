import { http, HttpResponse } from 'msw';

const calculatePrice = (people, lanes) => {
  return people * 120 + lanes * 100;
};

const booking = {
  when: '2023-12-31-T15:00',
  shoes: ['43', '43'],
  lanes: '1',
  people: '2',
};

const bookingResponse = {
  ...booking,
  id: 'STR4656FOCX',
  price: calculatePrice(booking.lanes, booking.people),
  active: true,
};

const handlers = [
  http.post(
    'https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com',
    async ({ request }) => {
      return HttpResponse.json(bookingResponse);
    }
  ),
];

export { handlers, booking };
