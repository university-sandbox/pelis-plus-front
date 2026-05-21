// Booking flow — seat picker
const { useState, useMemo } = React;

// Build a stable 8 row × 14 col theater layout.
// Rows: A..H. Center has aisle gap at columns 7-8. Row D is VIP.
const ROW_LETTERS = ['A','B','C','D','E','F','G','H'];
const COLS = 14;
const VIP_ROW = 'D';
const AISLE_COLS = [7, 8]; // 1-indexed; rendered as .gap

// Deterministic "taken" pattern so the kit is reproducible
const TAKEN = new Set([
  'A3','A4','A11','B2','B3','B12','C5','C10','D5','D10','E1','E14','F3','F4','F11','G7','G8','H6','H9'
]);

function seatId(row, col) { return `${row}${col}`; }
function isVip(row) { return row === VIP_ROW; }
function isAisle(col) { return AISLE_COLS.includes(col); }

function Seat({ id, state, vip, onClick }) {
  if (state === 'gap') return <span className="bf-seat gap"/>;
  const cls = ['bf-seat'];
  if (state === 'taken') cls.push('taken');
  if (state === 'sel') cls.push('sel');
  if (vip) cls.push('vip');
  const aria = vip ? `Butaca ${id} VIP — ${state}` : `Butaca ${id} — ${state}`;
  return (
    <button
      className={cls.join(' ')}
      onClick={() => state !== 'taken' && onClick(id)}
      aria-label={aria}
      title={vip ? `${id} · VIP` : id}
    />
  );
}

function SeatGrid({ selected, onToggle }) {
  return (
    <div className="bf-seat-grid">
      {ROW_LETTERS.flatMap(row => {
        const cells = [<span className="bf-row-label" key={row + 'L'}>{row}</span>];
        for (let col = 1; col <= COLS; col++) {
          const id = seatId(row, col);
          let state = 'open';
          if (isAisle(col)) state = 'gap';
          else if (TAKEN.has(id)) state = 'taken';
          else if (selected.has(id)) state = 'sel';
          cells.push(
            <Seat key={id} id={id} state={state} vip={isVip(row)} onClick={onToggle}/>
          );
        }
        return cells;
      })}
    </div>
  );
}

function Legend() {
  return (
    <div className="bf-legend">
      <span><i style={{ background: 'var(--ink-3)', border: '1px solid var(--border-strong)' }}/>Libre</span>
      <span><i style={{ background: 'var(--ink-5)' }}/>Ocupada</span>
      <span><i style={{ background: 'var(--marquee-400)' }}/>Tu selección</span>
      <span><i style={{ background: 'var(--ink-2)', border: '1px solid var(--amber-400)' }}/>VIP (+S/ 8)</span>
    </div>
  );
}

window.SeatGrid = SeatGrid;
window.Legend = Legend;
window.isVip = isVip;
