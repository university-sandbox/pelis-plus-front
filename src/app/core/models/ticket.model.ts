export interface Ticket {
  id: string;
  orderId: string;
  bookingCode: string;
  userName: string;
  movie: string;
  moviePosterPath: string | null;
  venue: string;
  room: string;
  date: string;    // yyyy-MM-dd
  time: string;    // HH:mm
  seat: string;    // e.g. 'C4'
  format: string;
  totalPaid: number;
  qrData: string;  // data encoded in QR (booking code or URL)
  issuedAt: string; // ISO datetime
}
