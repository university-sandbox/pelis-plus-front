// Booking flow — steps, sticky bar, snack menu, payment, ticket success
const { useState: bfUseState } = React;

const PRICE_BASE = 24.50;
const PRICE_VIP_EXTRA = 8.00;

function Steps({ step }) {
  const labels = ['Butacas', 'Snacks', 'Pago', 'Listo'];
  return (
    <div className="bf-steps">
      {labels.map((l, i) => (
        <React.Fragment key={l}>
          <div className={`bf-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <span className="num">{i < step ? '✓' : i + 1}</span>
            <span className="label">{l}</span>
          </div>
          {i < labels.length - 1 && <div className="bf-step-sep"/>}
        </React.Fragment>
      ))}
    </div>
  );
}

function StickyBar({ film, time, room, selectedSeats, snacks, step, total, ctaLabel, onContinue, ctaDisabled }) {
  const seatCount = selectedSeats.size;
  const snackCount = Object.values(snacks).reduce((a, b) => a + b, 0);
  return (
    <div className="bf-stickybar">
      <div className="film">
        <div className="poster"/>
        <div>
          <h4>{film.title}</h4>
          <div className="meta">{room} · {time} · {seatCount} butaca{seatCount !== 1 ? 's' : ''}{snackCount > 0 ? ` · ${snackCount} snack${snackCount !== 1 ? 's' : ''}` : ''}</div>
        </div>
      </div>
      <div className="summary"><b>S/ {total.toFixed(2)}</b></div>
      <button className="cta" disabled={ctaDisabled} onClick={onContinue}>
        {ctaLabel} <span style={{ fontSize: 20, lineHeight: 1 }}>→</span>
      </button>
    </div>
  );
}

// ---------- Snack menu ----------
const SNACK_ITEMS = [
  { id: 'combo-grande', name: 'Combo Grande', desc: 'Canchita grande + bebida grande. Sal y mantequilla.', price: 28.00, emoji: '🍿', color: 'linear-gradient(135deg,#F5A524,#7A0830)' },
  { id: 'combo-clasico', name: 'Combo Clásico',  desc: 'Canchita mediana + bebida mediana.', price: 22.00, emoji: '🥤', color: 'linear-gradient(135deg,#FF2E78,#7A0830)' },
  { id: 'nachos',        name: 'Nachos con queso', desc: 'Tortillas tibias, queso amarillo y jalapeños.', price: 18.50, emoji: '🌮', color: 'linear-gradient(135deg,#FFC047,#C77F0C)' },
  { id: 'hot-dog',       name: 'Hot dog PelisPlus', desc: 'Pan brioche tostado, mostaza dijon, pepinillos.', price: 16.00, emoji: '🌭', color: 'linear-gradient(135deg,#FF7AAE,#FF2E78)' },
  { id: 'helado',        name: 'Helado artesanal', desc: 'Chocolate amargo o vainilla bourbon.', price: 14.00, emoji: '🍦', color: 'linear-gradient(135deg,#5CEEFF,#006A7D)' },
  { id: 'agua',          name: 'Agua sin gas',   desc: 'Botella 500 ml.', price: 6.00, emoji: '💧', color: 'linear-gradient(135deg,#00D6F5,#1C1C20)' },
];

function Stepper({ value, onChange }) {
  return (
    <div className="bf-stepper">
      <button onClick={() => onChange(Math.max(0, value - 1))} aria-label="Quitar uno">−</button>
      <span className="count">{value}</span>
      <button onClick={() => onChange(value + 1)} aria-label="Añadir uno">+</button>
    </div>
  );
}

function SnackMenu({ snacks, onChange }) {
  return (
    <div className="bf-snacks">
      {SNACK_ITEMS.map(item => (
        <div className="bf-snack" key={item.id}>
          <div className="pic" style={{ background: item.color, color: 'rgba(255,255,255,0.95)' }}>
            <span style={{ filter: 'grayscale(0.2) brightness(1.1)' }}>{item.emoji}</span>
          </div>
          <div style={{ flex: 1 }}>
            <h4>{item.name}</h4>
            <div className="desc">{item.desc}</div>
            <div className="row">
              <span className="price">S/ {item.price.toFixed(2)}</span>
              <Stepper value={snacks[item.id] || 0} onChange={v => onChange(item.id, v)}/>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Payment ----------
function PaymentForm({ method, onMethod }) {
  return (
    <div>
      <div className="bf-method">
        <button className={method === 'card' ? 'sel' : ''} onClick={() => onMethod('card')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          Tarjeta
        </button>
        <button className={method === 'yape' ? 'sel' : ''} onClick={() => onMethod('yape')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          Yape · Plin
        </button>
        <button className={method === 'apple' ? 'sel' : ''} onClick={() => onMethod('apple')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.94-3.08.5-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.5C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
          Apple Pay
        </button>
      </div>
      {method === 'card' && (
        <>
          <div className="bf-field">
            <label>Número de tarjeta</label>
            <input placeholder="4242 4242 4242 4242"/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div className="bf-field"><label>Vence</label><input placeholder="05/29"/></div>
            <div className="bf-field"><label>CVV</label><input placeholder="123"/></div>
            <div className="bf-field"><label>Postal</label><input placeholder="15074"/></div>
          </div>
          <div className="bf-field"><label>Titular</label><input defaultValue="Ana Morales"/></div>
        </>
      )}
      {method === 'yape' && (
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--ivory-2)' }}>
          <div style={{ width: 140, height: 140, margin: '0 auto 16px', borderRadius: 8, background: 'var(--ivory-1)' }}/>
          <p>Escanea desde Yape o Plin para pagar.</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ivory-3)' }}>Vence en 04:38</p>
        </div>
      )}
      {method === 'apple' && (
        <div style={{ padding: 32, textAlign: 'center' }}>
          <button style={{ background: 'var(--ivory-1)', color: 'var(--ink-0)', border: 0, padding: '16px 32px', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
             Pay
          </button>
        </div>
      )}
    </div>
  );
}

function Summary({ film, room, time, seats, snacks, subtotal, fee, total }) {
  return (
    <div className="bf-card">
      <h3>Resumen</h3>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, lineHeight: 0.95, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>{film.title}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ivory-3)', marginTop: 6 }}>
          {room} · Hoy {time} · IMAX VOSE
        </div>
      </div>
      <ul className="bf-summary">
        <li>Butacas ({seats.length})<b>S/ {(seats.length * PRICE_BASE).toFixed(2)}</b></li>
        {seats.some(s => s.vip) && (
          <li>Recargo VIP<b>S/ {(seats.filter(s => s.vip).length * PRICE_VIP_EXTRA).toFixed(2)}</b></li>
        )}
        {Object.entries(snacks).filter(([,n]) => n > 0).map(([id, n]) => {
          const it = SNACK_ITEMS.find(s => s.id === id);
          return <li key={id}>{it.name} ×{n}<b>S/ {(it.price * n).toFixed(2)}</b></li>;
        })}
        <li>Cargo por servicio<b>S/ {fee.toFixed(2)}</b></li>
      </ul>
      <div className="bf-total">
        <span>Total</span>
        <span className="total-num">S/ {total.toFixed(2)}</span>
      </div>
    </div>
  );
}

function TicketSuccess({ film, room, time, seats }) {
  return (
    <div className="bf-ticket-wrap">
      <h1 className="bf-success">Listo.<br/><em>Te esperamos.</em></h1>
      <p style={{ color: 'var(--ivory-2)', maxWidth: 480, textAlign: 'center', fontSize: 16 }}>
        Tu acceso cierra cinco minutos antes del inicio. Te enviamos el ticket por email y a la app.
      </p>
      <div className="bf-ticket">
        <div className="stub-top">
          <h2>{film.title}</h2>
          <div className="meta">
            <div><div className="lab">Sala</div><div className="val">{room.replace('Sala ', '')}</div></div>
            <div><div className="lab">Función</div><div className="val">{time}</div></div>
            <div><div className="lab">Butacas</div><div className="val">{seats.map(s => s.id).join(' · ')}</div></div>
          </div>
        </div>
        <div className="stub-bottom">
          <div className="qr">
            {/* simple QR-like grid */}
            <svg viewBox="0 0 21 21" width="100%" height="100%">
              <rect width="21" height="21" fill="#F6F1E7"/>
              {Array.from({length: 11}).flatMap((_, y) => Array.from({length: 11}).map((__, x) => (
                ((x*17 + y*7 + x*y) % 3 === 0) ? <rect key={`${x}-${y}`} x={2 + x*1.5} y={2 + y*1.5} width="1.2" height="1.2" fill="#050506"/> : null
              )))}
              <rect x="2" y="2" width="5" height="5" fill="none" stroke="#050506" strokeWidth="1"/>
              <rect x="14" y="2" width="5" height="5" fill="none" stroke="#050506" strokeWidth="1"/>
              <rect x="2" y="14" width="5" height="5" fill="none" stroke="#050506" strokeWidth="1"/>
              <rect x="3.5" y="3.5" width="2" height="2" fill="#050506"/>
              <rect x="15.5" y="3.5" width="2" height="2" fill="#050506"/>
              <rect x="3.5" y="15.5" width="2" height="2" fill="#050506"/>
            </svg>
          </div>
          <div className="id">
            CÓDIGO DE ACCESO
            <b>PLS-2026-05-20-Z47K9</b>
            <span style={{ display: 'block', marginTop: 8 }}>PelisPlus · Miraflores</span>
          </div>
        </div>
      </div>
      <button style={{ background: 'transparent', border: '1px solid var(--ivory-1)', color: 'var(--ivory-1)', padding: '12px 24px', borderRadius: 999, cursor: 'pointer', fontWeight: 600 }}>
        Añadir al wallet
      </button>
    </div>
  );
}

Object.assign(window, {
  Steps, StickyBar, SnackMenu, PaymentForm, Summary, TicketSuccess,
  SNACK_ITEMS, PRICE_BASE, PRICE_VIP_EXTRA,
});
