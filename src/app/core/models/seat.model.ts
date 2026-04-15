export type SeatStatus = 'free' | 'occupied' | 'selected' | 'reserved';
export type SeatType = 'standard' | 'preferential';

export interface Seat {
  id: string;
  row: string;   // e.g. 'A', 'B', …
  col: number;   // 1-based
  status: SeatStatus;
  type: SeatType;
}

export interface SeatMap {
  screeningId: string;
  rows: string[];   // ['A','B','C', …]
  cols: number[];   // [1,2,3, …]
  seats: Seat[][];  // [row][col-1]
}

export interface SeatReservation {
  seatIds: string[];
  expiresAt: string; // ISO datetime
}
