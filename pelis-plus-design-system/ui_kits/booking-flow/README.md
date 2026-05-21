# Booking flow — UI kit

Four-step click-thru: **Butacas → Snacks → Pago → Listo**.

## Screens

1. **Butacas** — Sala grid with libre / ocupada / VIP / selección states. Sticky purchase bar at bottom.
2. **Snacks** — Combo + à-la-carte menu, qty stepper.
3. **Pago** — Payment method, summary, totals.
4. **Listo** — Animated success state with QR ticket.

## Files

- `index.html` — App shell, step routing
- `app.jsx` — Step state machine
- `seats.jsx` — `<SeatGrid>` with the full state library (libre / sel / taken / VIP / gap)
- `flow.jsx` — `<Steps>`, `<StickyBar>`, `<SnackMenu>`, `<PaymentForm>`, `<TicketSuccess>`
- `styles.css` — Booking-specific styles
