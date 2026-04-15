export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
}

export interface Room {
  id: string;
  venueId: string;
  name: string;
  capacity: number;
  rows: number;
  cols: number;
}

export type ScreeningFormat = 'standard' | '3d' | 'imax' | 'dbox';
export type ScreeningStatus = 'active' | 'cancelled' | 'sold_out';

export interface Screening {
  id: string;
  movieId: number;
  movieTitle: string;
  venue: Venue;
  room: Room;
  date: string; // ISO date yyyy-MM-dd
  time: string; // HH:mm
  format: ScreeningFormat;
  price: number;
  availableSeats: number;
  totalSeats: number;
  status: ScreeningStatus;
}
