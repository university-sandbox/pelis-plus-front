/**
 * Mock data for ScreeningService.
 * ⚠️ Used only when environment.mock.enabled === true.
 * Returns 4 screenings per movie with varied dates, times, formats.
 */

import { type Screening } from '../models/screening.model';
import { MOCK_VENUES, MOCK_ROOMS } from './venue.mock';

// Generates screenings for any movieId — mock returns same set for any movie
export function buildMockScreenings(movieId: number, movieTitle: string): Screening[] {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  const d0 = fmt(today);
  const d1 = fmt(new Date(today.getTime() + 1 * 86400000));
  const d2 = fmt(new Date(today.getTime() + 2 * 86400000));
  const d3 = fmt(new Date(today.getTime() + 3 * 86400000));

  return [
    {
      id: `sc-${movieId}-1`,
      movieId,
      movieTitle,
      venue: MOCK_VENUES[0],
      room: MOCK_ROOMS[0],
      date: d0,
      time: '15:30',
      format: 'standard',
      price: 22,
      availableSeats: 48,
      totalSeats: 80,
      status: 'active',
    },
    {
      id: `sc-${movieId}-2`,
      movieId,
      movieTitle,
      venue: MOCK_VENUES[0],
      room: MOCK_ROOMS[1],
      date: d0,
      time: '19:00',
      format: 'imax',
      price: 38,
      availableSeats: 72,
      totalSeats: 120,
      status: 'active',
    },
    {
      id: `sc-${movieId}-3`,
      movieId,
      movieTitle,
      venue: MOCK_VENUES[1],
      room: MOCK_ROOMS[2],
      date: d1,
      time: '14:00',
      format: '3d',
      price: 28,
      availableSeats: 35,
      totalSeats: 80,
      status: 'active',
    },
    {
      id: `sc-${movieId}-4`,
      movieId,
      movieTitle,
      venue: MOCK_VENUES[1],
      room: MOCK_ROOMS[2],
      date: d1,
      time: '21:30',
      format: 'standard',
      price: 22,
      availableSeats: 0,
      totalSeats: 80,
      status: 'sold_out',
    },
    {
      id: `sc-${movieId}-5`,
      movieId,
      movieTitle,
      venue: MOCK_VENUES[2],
      room: MOCK_ROOMS[3],
      date: d2,
      time: '16:00',
      format: 'standard',
      price: 22,
      availableSeats: 60,
      totalSeats: 80,
      status: 'active',
    },
    {
      id: `sc-${movieId}-6`,
      movieId,
      movieTitle,
      venue: MOCK_VENUES[0],
      room: MOCK_ROOMS[0],
      date: d3,
      time: '20:00',
      format: '3d',
      price: 28,
      availableSeats: 55,
      totalSeats: 80,
      status: 'active',
    },
  ];
}
