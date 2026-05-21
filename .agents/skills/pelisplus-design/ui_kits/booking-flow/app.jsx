// Booking flow — app shell, step state machine
const { useState: bfAppState, useMemo: bfAppMemo } = React;

const FILM = { title: 'Ciudad Eléctrica' };
const ROOM = 'Sala 4';
const TIME = '20:30';

function App() {
  const [step, setStep] = bfAppState(0);
  const [selected, setSelected] = bfAppState(new Set(['E6','E7']));
  const [snacks, setSnacks] = bfAppState({ 'combo-grande': 1 });
  const [method, setMethod] = bfAppState('card');

  function toggleSeat(id) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }
  function setSnack(id, v) {
    setSnacks({ ...snacks, [id]: v });
  }

  const seatList = bfAppMemo(() => Array.from(selected).map(id => ({ id, vip: id.startsWith('D') })), [selected]);
  const seatTotal = seatList.length * PRICE_BASE + seatList.filter(s => s.vip).length * PRICE_VIP_EXTRA;
  const snackTotal = Object.entries(snacks).reduce((sum, [id, n]) => sum + n * (SNACK_ITEMS.find(s => s.id === id)?.price || 0), 0);
  const subtotal = seatTotal + snackTotal;
  const fee = Math.round(subtotal * 0.04 * 100) / 100;
  const total = subtotal + fee;

  const ctaText = ['Continuar a snacks', 'Continuar al pago', 'Confirmar pago', 'Hecho'][step];
  const advance = () => setStep(Math.min(3, step + 1));
  const back = () => setStep(Math.max(0, step - 1));

  return (
    <div className="bf-app">
      <header className="bf-topbar">
        <div className="brand">PELIS<span style={{ color: 'var(--marquee-400)' }}>PLUS</span></div>
        <div style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ivory-3)', letterSpacing: '0.04em', textAlign: 'center' }}>
          {FILM.title.toUpperCase()} · {ROOM.toUpperCase()} · HOY {TIME}
        </div>
        <button className="back" onClick={back} disabled={step === 0} style={step === 0 ? { opacity: 0.4, cursor: 'not-allowed' } : {}}>
          ← Atrás
        </button>
      </header>

      <Steps step={step}/>

      {step === 0 && (
        <main className="bf-page">
          <h1>Elige tus butacas</h1>
          <p className="sub">Toca la butaca para reservar. La fila D es VIP — asientos reclinables, espacio extra.</p>
          <div className="bf-screen-wrap">
            <span className="bf-screen-label">P A N T A L L A</span>
            <div className="bf-screen"/>
            <SeatGrid selected={selected} onToggle={toggleSeat}/>
            <Legend/>
          </div>
        </main>
      )}

      {step === 1 && (
        <main className="bf-page">
          <h1>¿Algo para la sala?</h1>
          <p className="sub">Lo recoges en la barra mostrando tu ticket. O lo añades cuando entres.</p>
          <SnackMenu snacks={snacks} onChange={setSnack}/>
        </main>
      )}

      {step === 2 && (
        <main className="bf-page">
          <h1>Pago</h1>
          <p className="sub">Revisa lo que reservas y elige cómo pagar.</p>
          <div className="bf-pay-row">
            <div className="bf-card">
              <h3>Método de pago</h3>
              <PaymentForm method={method} onMethod={setMethod}/>
            </div>
            <Summary
              film={FILM} room={ROOM} time={TIME}
              seats={seatList} snacks={snacks}
              subtotal={subtotal} fee={fee} total={total}
            />
          </div>
        </main>
      )}

      {step === 3 && (
        <main className="bf-page">
          <TicketSuccess film={FILM} room={ROOM} time={TIME} seats={seatList}/>
        </main>
      )}

      {step < 3 && (
        <StickyBar
          film={FILM} room={ROOM} time={TIME}
          selectedSeats={selected} snacks={snacks}
          step={step}
          total={total}
          ctaLabel={ctaText}
          ctaDisabled={step === 0 && selected.size === 0}
          onContinue={advance}
        />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
