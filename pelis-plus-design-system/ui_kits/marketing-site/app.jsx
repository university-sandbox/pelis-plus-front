// Marketing site — app shell, view switcher
const { useState } = React;

function App() {
  const [view, setView] = useState({ kind: 'home' });
  const goHome = () => setView({ kind: 'home' });
  const openDetail = (film) => { window.scrollTo({ top: 0 }); setView({ kind: 'detail', film }); };
  const handleBook = (film, showtime) => {
    alert(`Próximo paso: seleccionar butacas para "${film.title}"${showtime ? ' · ' + showtime.time : ''}.\n\n(Continúa en el UI kit de Booking flow.)`);
  };

  if (view.kind === 'detail') {
    return <FilmDetail film={view.film} onBack={goHome} onPickTime={handleBook}/>;
  }
  const featured = FILMS[0];
  const enCartelera = FILMS.filter(f => f.tag !== 'PRÓXIMAMENTE');
  const proximos = FILMS.filter(f => f.tag === 'PRÓXIMAMENTE' || f.tag === 'PREVENTA');
  return (
    <div>
      <Nav active="cartelera" onLogo={goHome}/>
      <Hero film={featured} onBook={(f) => openDetail(f)} onPlay={() => alert('Tráiler · placeholder')}/>
      <Cartelera films={enCartelera} onPick={openDetail}/>
      <ProximosStrip films={proximos}/>
      <Footer/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
