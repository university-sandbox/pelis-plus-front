/**
 * Mock data for SeatService.
 * ⚠️ Used only when environment.mock.enabled === true.
 * Returns a 10-column × 8-row seat grid with ~20% occupied seats.
 */

import { type Seat, type SeatMap } from '../models/seat.model';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Pre-occupied seat IDs for consistent mock behaviour
const OCCUPIED_IDS = new Set([
  'A2', 'A3', 'B5', 'B6', 'C1', 'C8', 'D3', 'D4', 'D7',
  'E2', 'F5', 'F6', 'G4', 'G9', 'H1', 'H10',
]);

// Rows D–E are preferential
const PREFERENTIAL_ROWS = new Set(['D', 'E']);

export function buildMockSeatMap(screeningId: string): SeatMap {
  const seats: Seat[][] = ROWS.map((row) =>
    COLS.map((col) => {
      const id = `${row}${col}`;
      return {
        id,
        row,
        col,
        status: OCCUPIED_IDS.has(id) ? 'occupied' : 'free',
        type: PREFERENTIAL_ROWS.has(row) ? 'preferential' : 'standard',
      } satisfies Seat;
    }),
  );

  return { screeningId, rows: ROWS, cols: COLS, seats };
}
