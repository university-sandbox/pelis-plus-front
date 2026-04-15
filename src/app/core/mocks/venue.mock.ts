/**
 * Mock data for VenueService / ScreeningService.
 * ⚠️ Used only when environment.mock.enabled === true.
 */

import { type Venue, type Room } from '../models/screening.model';

export const MOCK_VENUES: Venue[] = [
  { id: 'v1', name: 'PelisPlus Miraflores', address: 'Av. Larco 345', city: 'Lima' },
  { id: 'v2', name: 'PelisPlus San Isidro', address: 'Av. Rivera Navarrete 720', city: 'Lima' },
  { id: 'v3', name: 'PelisPlus Surco', address: 'Av. Primavera 1256', city: 'Lima' },
];

export const MOCK_ROOMS: Room[] = [
  { id: 'r1', venueId: 'v1', name: 'Sala 1', capacity: 80, rows: 8, cols: 10 },
  { id: 'r2', venueId: 'v1', name: 'Sala IMAX', capacity: 120, rows: 10, cols: 12 },
  { id: 'r3', venueId: 'v2', name: 'Sala 1', capacity: 80, rows: 8, cols: 10 },
  { id: 'r4', venueId: 'v3', name: 'Sala 1', capacity: 80, rows: 8, cols: 10 },
];
