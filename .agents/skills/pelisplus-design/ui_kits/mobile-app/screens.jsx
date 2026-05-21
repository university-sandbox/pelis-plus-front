// Mobile app — screens
const { useState: mUseState } = React;

const MOBILE_FILMS = [
  { id: 'ciudad-electrica', title: 'Ciudad Eléctrica', titleLines:['CIUDAD','ELÉCTRICA'], age: 14, dur: 138, fmt: 'IMAX', poster: 'linear-gradient(135deg,#FF2E78,#7A0830,#00A4BF)' },
  { id: 'la-hora-azul', title: 'La Hora Azul', titleLines:['LA HORA','AZUL'], age: 14, dur: 124, fmt: 'IMAX', poster: 'linear-gradient(135deg,#00D6F5,#006A7D,#050506)' },
  { id: 'el-ultimo-acto', title: 'El Último Acto', titleLines:['EL ÚLTIMO','ACTO'], age: 12, dur: 114, fmt: 'DOLBY', poster: 'linear-gradient(135deg,#F5A524,#7A0830,#1C1C20)' },
  { id: 'vinilo-roto', title: 'Vinilo Roto', titleLines:['VINILO','ROTO'], age: 12, dur: 96, fmt: 'VOSE', poster: 'linear-gradient(135deg,#FF7AAE,#FF2E78,#F5A524)' },
  { id: 'la-tercera-fila', title: 'La Tercera Fila', titleLines:['LA TERCERA','FILA'], age: 16, dur: 108, fmt: 'VOSE', poster: 'linear-gradient(135deg,#7A0830,#1C1C20,#00A4BF)' },
];

const MIcon = {
  film: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>,
  ticket: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  star:   (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 15 8.5l7 .9-5.1 4.7 1.4 7-6.3-3.6L5.7 21l1.4-7L2 9.4l7-.9L12 2Z"/></svg>,
  user:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  pin:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  search: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  bell:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  play:   (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 22,12 6,20"/></svg>,
  chev:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  gift:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
  popcorn:(p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a2 2 0 0 0-2-2 3 3 0 0 0-6 0 3 3 0 0 0-3 0 2 2 0 0 0-2 2c0 1 1 2 2 2L6 21h12l-1-11c1 0 2-1 2-2z"/></svg>,
  seat:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="8" rx="2"/><path d="M6 10V6h12v4M4 18v3M20 18v3"/></svg>,
};

// ---------- Reusable bits ----------
function TopBar({ city = 'Lima · Miraflores' }) {
  return (
    <div className="m-topbar">
      <div className="brand">PELIS<span style={{ color: 'var(--marquee-400)' }}>PLUS</span></div>
      <div className="city"><MIcon.pin width="12" height="12"/> {city}</div>
      <div className="icons">
        <button><MIcon.search width="16" height="16"/></button>
      </div>
    </div>
  );
}

function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'home',    label: 'Cartelera', icon: MIcon.film },
    { id: 'tickets', label: 'Tickets',   icon: MIcon.ticket },
    { id: 'plus',    label: 'PelisPlus Club',  icon: MIcon.star },
    { id: 'me',      label: 'Cuenta',    icon: MIcon.user },
  ];
  return (
    <nav className="m-tabbar">
      {tabs.map(t => (
        <button key={t.id} className={active === t.id ? 'active' : ''} onClick={() => onChange(t.id)}>
          <t.icon width="22" height="22"/>
          {t.label}
        </button>
      ))}
    </nav>
  );
}

// ---------- Cartelera (home) ----------
function HomeScreen() {
  const featured = MOBILE_FILMS[0];
  return (
    <div className="m-app">
      <TopBar/>
      <div className="m-hero-card">
        <div className="poster" style={{ background: featured.poster }}/>
        <div className="scrim"/>
        <div className="content">
          <span className="chip">ESTRENO</span>
          <h2>{featured.titleLines.map((l,i)=>(<React.Fragment key={i}>{l}<br/></React.Fragment>))}</h2>
          <div className="meta">{Math.floor(featured.dur/60)}h {featured.dur%60}m · +{featured.age} · {featured.fmt} · ★ 4.7</div>
          <button className="play-cta">Reservar entradas</button>
        </div>
      </div>

      <div className="m-section-head">
        <h3>En cartelera</h3>
        <a>Ver todas</a>
      </div>
      <div className="m-poster-strip">
        {MOBILE_FILMS.slice(1).map(f => (
          <div className="item" key={f.id}>
            <div className="poster" style={{ background: f.poster }}>
              <div className="ttl">{f.titleLines.map((l,i)=>(<React.Fragment key={i}>{l}<br/></React.Fragment>))}</div>
            </div>
            <div className="meta">+{f.age} · {f.fmt}</div>
          </div>
        ))}
      </div>

      <div className="m-section-head">
        <h3>Próximamente</h3>
        <a>Agenda</a>
      </div>
      <div className="m-poster-strip">
        {MOBILE_FILMS.slice(2,5).map(f => (
          <div className="item" key={f.id + '-p'}>
            <div className="poster" style={{ background: f.poster, filter: 'saturate(0.85)' }}>
              <div className="ttl">{f.titleLines.map((l,i)=>(<React.Fragment key={i}>{l}<br/></React.Fragment>))}</div>
            </div>
            <div className="meta">28 · MAY</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Tickets ----------
function TinyQR({ light = false }) {
  return (
    <div className="qr">
      <svg viewBox="0 0 21 21" width="100%" height="100%">
        <rect width="21" height="21" fill="#F6F1E7"/>
        {Array.from({length: 11}).flatMap((_, y) => Array.from({length: 11}).map((__, x) => (
          ((x*13 + y*5 + x*y) % 3 === 0) ? <rect key={`${x}-${y}`} x={2 + x*1.5} y={2 + y*1.5} width="1.2" height="1.2" fill="#050506"/> : null
        )))}
        <rect x="2" y="2" width="5" height="5" fill="none" stroke="#050506" strokeWidth="1"/>
        <rect x="14" y="2" width="5" height="5" fill="none" stroke="#050506" strokeWidth="1"/>
        <rect x="2" y="14" width="5" height="5" fill="none" stroke="#050506" strokeWidth="1"/>
        <rect x="3.5" y="3.5" width="2" height="2" fill="#050506"/>
        <rect x="15.5" y="3.5" width="2" height="2" fill="#050506"/>
        <rect x="3.5" y="15.5" width="2" height="2" fill="#050506"/>
      </svg>
    </div>
  );
}

function Ticket({ film, room, date, seats, id, past }) {
  return (
    <div className={`m-ticket ${past ? 'past' : ''}`}>
      <div className="top">
        <div className="poster" style={{ background: film.poster }}/>
        <div>
          <h4>{film.title}</h4>
          <div className="meta-grid">
            <span className="lab">Cuándo</span><span className="lab">Sala</span>
            <span className="val">{date}</span><span className="val">{room}</span>
            <span className="lab">Butacas</span><span className="lab">Acceso</span>
            <span className="val">{seats}</span><span className="val">QR</span>
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="id">Código de acceso<b>{id}</b></div>
        <TinyQR/>
      </div>
    </div>
  );
}

function TicketsScreen() {
  return (
    <div className="m-app">
      <TopBar/>
      <h1 className="m-page-title">Tus tickets</h1>
      <div className="m-section-head"><h3>Próximas funciones</h3><a>Agenda</a></div>
      <Ticket film={MOBILE_FILMS[0]} room="Sala 4 · IMAX" date="Hoy · 20:30" seats="E6 · E7" id="PLS-2026-05-20-Z47K9"/>
      <Ticket film={MOBILE_FILMS[1]} room="Sala 2 · IMAX" date="Vie 23 · 21:15" seats="C8 · C9" id="PLS-2026-05-23-MQ02A"/>
      <div className="m-section-head" style={{ marginTop: 28 }}><h3>Historial</h3></div>
      <Ticket film={MOBILE_FILMS[2]} room="Sala 6 · Dolby" date="Sáb 17 · 18:00" seats="F4" id="PLS-2026-05-17-K9X11" past/>
    </div>
  );
}

// ---------- PelisPlus Club ----------
function PlusScreen() {
  return (
    <div className="m-app">
      <TopBar/>
      <h1 className="m-page-title">PelisPlus Club</h1>
      <div className="m-loyalty-card">
        <div className="label">CINÉFILA · NIVEL 2</div>
        <div className="name">Ana Morales</div>
        <div className="num">1 248</div>
        <div className="small">Estrellas PelisPlus acumuladas</div>
        <div className="bar"><div className="fill"/></div>
        <div className="next">252 estrellas para alcanzar Nivel 3 · Cinéfila Plus</div>
      </div>

      <div className="m-section-head"><h3>Tus beneficios</h3></div>
      <div className="m-perks">
        <div className="m-perk">
          <div className="icon"><MIcon.ticket width="20" height="20"/></div>
          <div style={{ flex: 1 }}><h4>Una función gratis cada cuatro</h4><p>Después de cuatro entradas pagas, la quinta corre por nuestra cuenta.</p></div>
        </div>
        <div className="m-perk">
          <div className="icon"><MIcon.popcorn width="20" height="20"/></div>
          <div style={{ flex: 1 }}><h4>Canchita gratis los martes</h4><p>Mediana o grande, sin compras mínimas.</p></div>
        </div>
        <div className="m-perk">
          <div className="icon"><MIcon.seat width="20" height="20"/></div>
          <div style={{ flex: 1 }}><h4>Acceso anticipado a preventas</h4><p>48 horas antes que el resto.</p></div>
        </div>
        <div className="m-perk">
          <div className="icon"><MIcon.gift width="20" height="20"/></div>
          <div style={{ flex: 1 }}><h4>Regalo de cumpleaños</h4><p>Dos entradas para tu mes, en cualquier sala.</p></div>
        </div>
      </div>
    </div>
  );
}

// ---------- Cuenta ----------
function ProfileScreen() {
  return (
    <div className="m-app">
      <TopBar/>
      <div className="m-profile-head">
        <div className="m-avatar">A</div>
        <h2>Ana Morales</h2>
        <p className="sub">Cinéfila desde marzo 2024 · 47 funciones</p>
      </div>
      <div className="m-list">
        <h5>Cuenta</h5>
        <div className="group">
          <div className="row"><span className="icon"><MIcon.user width="18" height="18"/></span><span className="label">Datos personales</span><span className="chev"><MIcon.chev width="16" height="16"/></span></div>
          <div className="row"><span className="icon"><MIcon.ticket width="18" height="18"/></span><span className="label">Métodos de pago</span><span className="meta">Visa · 4242</span><span className="chev"><MIcon.chev width="16" height="16"/></span></div>
          <div className="row"><span className="icon"><MIcon.pin width="18" height="18"/></span><span className="label">Cine favorito</span><span className="meta">Miraflores</span><span className="chev"><MIcon.chev width="16" height="16"/></span></div>
        </div>
        <h5>Preferencias</h5>
        <div className="group">
          <div className="row"><span className="icon"><MIcon.bell width="18" height="18"/></span><span className="label">Notificaciones</span><span className="meta">Activadas</span><span className="chev"><MIcon.chev width="16" height="16"/></span></div>
          <div className="row"><span className="icon"><MIcon.film width="18" height="18"/></span><span className="label">Idioma preferido</span><span className="meta">VOSE</span><span className="chev"><MIcon.chev width="16" height="16"/></span></div>
        </div>
        <h5>PelisPlus</h5>
        <div className="group">
          <div className="row"><span className="icon"><MIcon.gift width="18" height="18"/></span><span className="label">Tarjetas regalo</span><span className="chev"><MIcon.chev width="16" height="16"/></span></div>
          <div className="row"><span className="icon"><MIcon.star width="18" height="18"/></span><span className="label">PelisPlus Club · Nivel 2</span><span className="chev"><MIcon.chev width="16" height="16"/></span></div>
        </div>
      </div>
    </div>
  );
}

// ---------- Phone shell ----------
function Phone({ initialTab = 'home' }) {
  const [tab, setTab] = mUseState(initialTab);
  return (
    <IOSDevice dark={true} width={360} height={780}>
      {tab === 'home'    && <HomeScreen/>}
      {tab === 'tickets' && <TicketsScreen/>}
      {tab === 'plus'    && <PlusScreen/>}
      {tab === 'me'      && <ProfileScreen/>}
      <TabBar active={tab} onChange={setTab}/>
    </IOSDevice>
  );
}

Object.assign(window, { Phone, HomeScreen, TicketsScreen, PlusScreen, ProfileScreen, TabBar });
