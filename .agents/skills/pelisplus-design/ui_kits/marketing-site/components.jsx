// Marketing site — reusable components
// All assume global FILMS, SHOWTIMES, LOCATIONS, DAYS from data.js
// Components are attached to window at the end so app.jsx can read them.

const { useState } = React;

// ---------- Icons (inline lucide SVGs to avoid runtime dep) ----------
const Icon = {
  search: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  pin:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  user:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  play:   (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 22,12 6,20"/></svg>,
  chev:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  arrow:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  back:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  star:   (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 15 8.5l7 .9-5.1 4.7 1.4 7-6.3-3.6L5.7 21l1.4-7L2 9.4l7-.9L12 2Z"/></svg>,
};

// ---------- Nav ----------
function Nav({ active, onLogo, city = "Lima · Miraflores" }) {
  return (
    <nav className="ms-nav">
      <a className="brand" onClick={onLogo} role="button">
        <svg className="brand-mark" viewBox="0 0 200 200">
          <g transform="translate(100 100)" fill="currentColor">
            {[0,60,120,180,240,300].map(r => (
              <g key={r} transform={`rotate(${r})`}><path d="M0,-86 L74,-44 L0,-2 L-74,-44 Z"/></g>
            ))}
            <circle r="22" fill="#FF2E78"/>
          </g>
        </svg>
        <span className="brand-word">PELIS<span style={{ color: 'var(--marquee-400)' }}>PLUS</span></span>
      </a>
      <div className="links">
        <a className={active === "cartelera" ? "active" : ""}>Cartelera</a>
        <a className={active === "proximos" ? "active" : ""}>Próximos estrenos</a>
        <a>Cines</a>
        <a>PelisPlus Club</a>
        <a>Experiencias</a>
      </div>
      <div className="right">
        <div className="city"><Icon.pin width="14" height="14"/> {city} <Icon.chev width="14" height="14"/></div>
        <button className="search-icon" aria-label="Buscar"><Icon.search width="16" height="16"/></button>
        <button className="acct" aria-label="Cuenta"><Icon.user width="16" height="16"/></button>
        <a className="cta">PelisPlus Club</a>
      </div>
    </nav>
  );
}

// ---------- Hero ----------
function Hero({ film, onPlay, onBook }) {
  return (
    <section className="ms-hero">
      <div className="bg"/>
      <div className="poster" style={{ background: film.poster }}/>
      <div className="scrim"/>
      <div className="grain-overlay"/>
      <div className="content">
        <div className="chip-row">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.18em', padding: '5px 10px', border: '1px solid var(--marquee-400)', color: 'var(--marquee-300)', background: 'rgba(255,46,120,0.08)' }}>
            {film.tag}
          </span>
          {film.formats.slice(0,2).map(f => (
            <span key={f} style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', padding: '5px 10px', border: '1px solid var(--ivory-2)', color: 'var(--ivory-1)' }}>{f}</span>
          ))}
        </div>
        <h1 className="title">{film.titleLines.map((l,i)=>(<React.Fragment key={i}>{l}<br/></React.Fragment>))}</h1>
        <p className="quote">«{film.synopsis.split('.')[0]}.»</p>
        <div className="meta">
          <span><b>{Math.floor(film.durationMin/60)}h {film.durationMin%60}m</b></span>
          <span><b>+{film.age}</b> años</span>
          <span>{film.genre}</span>
          <span><Icon.star width="12" height="12" style={{ color: 'var(--amber-300)', verticalAlign: 'middle' }}/> <b style={{ color: 'var(--amber-300)' }}>{film.rating.toFixed(1)}</b></span>
        </div>
        <div className="cta-row">
          <button onClick={() => onBook(film)} style={{ background: 'var(--marquee-400)', color: 'var(--ivory-1)', border: 0, padding: '14px 28px', fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.06em', textTransform: 'uppercase', borderRadius: 4, cursor: 'pointer' }}>
            Reservar entradas
          </button>
          <button onClick={onPlay} style={{ background: 'transparent', color: 'var(--ivory-1)', border: '1px solid var(--ivory-1)', padding: '13px 22px', borderRadius: 999, cursor: 'pointer', fontWeight: 600, display:'inline-flex', alignItems:'center', gap: 8 }}>
            <Icon.play width="14" height="14"/> Ver tráiler
          </button>
        </div>
      </div>
    </section>
  );
}

// ---------- Film card ----------
function FilmCard({ film, onClick }) {
  return (
    <article className="ms-fcard" onClick={() => onClick && onClick(film)}>
      <div className="poster" style={{ background: film.poster }}>
        {film.tag === "ESTRENO" && <span className="chip-top">ESTRENO</span>}
        {film.tag === "PREVENTA" && <span className="chip-top preventa">PREVENTA</span>}
        {film.tag === "PRÓXIMAMENTE" && <span className="chip-top">PRÓXIMAMENTE</span>}
        <span className="rating"><Icon.star width="10" height="10"/> {film.rating.toFixed(1)}</span>
        <div className="poster-title">{film.titleLines.map((l,i)=>(<React.Fragment key={i}>{l}<br/></React.Fragment>))}</div>
      </div>
      <div className="meta">
        <div className="meta-row">
          <span className="age">{film.age}</span>
          <span>{Math.floor(film.durationMin/60)}h {film.durationMin%60}m</span>
          <span>·</span>
          <span className="fmt">{film.formats[0]}</span>
        </div>
        <h3>{film.title}</h3>
        <div style={{ fontSize: 12, color: 'var(--ivory-3)' }}>{film.genre} · {film.director}</div>
      </div>
    </article>
  );
}

// ---------- Cartelera section ----------
function Cartelera({ films, onPick }) {
  const [genre, setGenre] = useState("Todos");
  const genres = ["Todos", "Thriller", "Drama", "Sci-Fi", "Comedia", "Suspenso"];
  return (
    <section className="ms-section">
      <div className="head-row">
        <div>
          <h2>Cartelera de hoy</h2>
          <div className="sub">Veinte películas. Cuatro cines. Una butaca con tu nombre.</div>
        </div>
        <div className="ms-filters">
          {genres.map(g => (
            <button key={g} className={`pill ${g === genre ? 'active' : ''}`} onClick={() => setGenre(g)}>{g}</button>
          ))}
        </div>
      </div>
      <div className="ms-cartelera">
        {films.map(f => <FilmCard key={f.id} film={f} onClick={onPick}/>)}
      </div>
    </section>
  );
}

// ---------- Próximamente strip ----------
function ProximosStrip({ films }) {
  return (
    <section className="ms-section">
      <div className="head-row">
        <div>
          <h2>Próximamente</h2>
          <div className="sub">Lo que llegará a PelisPlus en las semanas que vienen.</div>
        </div>
        <a style={{ color: 'var(--marquee-300)', fontWeight: 600, fontSize: 14 }}>Ver agenda completa <Icon.arrow width="12" height="12" style={{ verticalAlign: 'middle' }}/></a>
      </div>
      <div className="ms-strip">
        {films.map(f => (
          <div key={f.id} className="item">
            <div className="poster" style={{ background: f.poster, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85))' }}/>
              <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 0.95, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                {f.titleLines.join(' ')}
              </div>
            </div>
            <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--ivory-3)' }}>
              ESTRENA 12 · JUN · {f.formats.join(' / ')}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Showtime picker ----------
function ShowtimePicker({ onPickTime }) {
  const [day, setDay] = useState(1); // index in DAYS
  return (
    <div className="ms-showtimes">
      <h3>Horarios — Lima Miraflores</h3>
      <div className="day-strip">
        {DAYS.map((d, i) => (
          <button key={i} className={`day ${i === day ? 'sel' : ''}`} onClick={() => setDay(i)}>
            <span className="dow">{d.dow}</span>
            <span className="dn">{d.n}</span>
          </button>
        ))}
      </div>
      <div className="room-block">
        <div className="label">
          <span className="room">SALA 4</span>
          <span className="badges">
            <span className="fmt-badge" style={{ borderColor: 'var(--amber-400)', color: 'var(--amber-300)' }}>IMAX</span>
            <span className="fmt-badge">DOLBY ATMOS</span>
          </span>
        </div>
        <div className="times">
          {SHOWTIMES.map((s, i) => (
            <button
              key={i}
              className={`time-btn ${s.status === 'sold' ? 'sold' : ''} ${s.premium ? 'premium' : ''}`}
              onClick={() => s.status !== 'sold' && onPickTime && onPickTime(s)}
            >
              <span className="hr">{s.time}</span>
              <span className="lang">{s.format}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="room-block">
        <div className="label">
          <span className="room">SALA 2</span>
          <span className="badges">
            <span className="fmt-badge">DOLBY</span>
          </span>
        </div>
        <div className="times">
          <button className="time-btn"><span className="hr">15:45</span><span className="lang">DOBLADA</span></button>
          <button className="time-btn"><span className="hr">18:30</span><span className="lang">VOSE</span></button>
          <button className="time-btn"><span className="hr">21:15</span><span className="lang">VOSE</span></button>
        </div>
      </div>
    </div>
  );
}

// ---------- Detail page ----------
function FilmDetail({ film, onBack, onPickTime }) {
  return (
    <div>
      <Nav onLogo={onBack}/>
      <section className="ms-detail-back">
        <div className="poster" style={{ background: film.poster }}/>
        <div className="scrim"/>
        <div style={{ position:'absolute', top: 24, left: 40 }}>
          <button onClick={onBack} style={{ background: 'rgba(5,5,6,0.6)', backdropFilter: 'blur(12px)', color: 'var(--ivory-1)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 14px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 8, cursor:'pointer', fontSize: 13 }}>
            <Icon.back width="14" height="14"/> Cartelera
          </button>
        </div>
      </section>
      <main className="ms-detail-body">
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.18em', padding: '5px 10px', border: '1px solid var(--marquee-400)', color: 'var(--marquee-300)' }}>{film.tag}</span>
          {film.formats.map(f => <span key={f} style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', padding: '5px 10px', border: '1px solid var(--ivory-2)' }}>{f}</span>)}
        </div>
        <h1 className="title">{film.titleLines.map((l,i)=>(<React.Fragment key={i}>{l}<br/></React.Fragment>))}</h1>
        <div className="row">
          <div>
            <p className="synopsis">{film.synopsis}</p>
            <p className="synopsis" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', marginTop: 24, color: 'var(--ivory-3)' }}>
              «Una operación de luces y sombras donde Costas vuelve a demostrar por qué se la considera la mejor exploradora del noir contemporáneo.» — Programa PelisPlus
            </p>
          </div>
          <div className="facts">
            <dl>
              <dt>Director</dt><dd>{film.director}</dd>
              <dt>Reparto</dt><dd>{film.cast.join(', ')}</dd>
              <dt>Año</dt><dd>{film.year}</dd>
              <dt>Duración</dt><dd>{Math.floor(film.durationMin/60)}h {film.durationMin%60}m</dd>
              <dt>Clasificación</dt><dd>+{film.age} años</dd>
              <dt>Calificación</dt><dd style={{ color: 'var(--amber-300)' }}>★ {film.rating.toFixed(1)} / 5</dd>
            </dl>
          </div>
        </div>
        <ShowtimePicker onPickTime={(s) => onPickTime && onPickTime(film, s)}/>
      </main>
    </div>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="ms-footer">
      <div className="inner">
        <div className="brand-block">
          <div className="word">PELIS<span style={{ color: 'var(--marquee-400)' }}>PLUS</span></div>
          <div className="tag-line">El cine, como debe verse.</div>
        </div>
        <div>
          <h4>Programación</h4>
          <ul><li>Cartelera</li><li>Próximos estrenos</li><li>Festivales</li><li>Re-estrenos</li></ul>
        </div>
        <div>
          <h4>Cines</h4>
          <ul><li>Lima Centro</li><li>Miraflores</li><li>San Isidro</li><li>Jockey Plaza</li></ul>
        </div>
        <div>
          <h4>PelisPlus</h4>
          <ul><li>PelisPlus Club</li><li>Tarjetas regalo</li><li>Cumpleaños</li><li>Empresas</li></ul>
        </div>
      </div>
      <div className="legal">
        <span>© 2026 PelisPlus. Todos los derechos reservados.</span>
        <span>Términos · Privacidad · Accesibilidad</span>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Hero, FilmCard, Cartelera, ProximosStrip, ShowtimePicker, FilmDetail, Footer, Icon });
