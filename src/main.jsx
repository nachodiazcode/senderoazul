import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { articles } from './content';
import { feedUpdatedAt, newsFeed } from './news-feed';
import { auth, googleProvider, isFirebaseConfigured, onAuthStateChanged, signInWithPopup, signOut } from './firebase';
import './styles.css';

const navItems = [
  ['/', 'Inicio'],
  ['/datos', 'Equipos'],
  ['/memoria', 'El Club'],
  ['/actualidad', 'Noticias'],
  ['/comunidad', 'Escuelas'],
  ['/comunidad', 'Abonos'],
  ['/actualidad', 'Tienda'],
  ['/actualidad', 'Prensa'],
  ['/soy-dt', 'Último Minuto'],
];

const teamChoices = [
  { id: 'u-de-chile', name: 'Universidad de Chile', mark: 'U', primary: '#2459d3', navy: '#173c7a', light: '#a9c4ff', accent: '#d94a57' },
  { id: 'colo-colo', name: 'Colo-Colo', mark: 'CC', primary: '#252a32', navy: '#11161d', light: '#d8dde3', accent: '#8f98a5' },
  { id: 'u-catolica', name: 'Universidad Católica', mark: 'UC', primary: '#2b6dcc', navy: '#173d7c', light: '#bad4ff', accent: '#f4f6fa' },
  { id: 'cobresal', name: 'Cobresal', mark: 'CS', primary: '#c96b2b', navy: '#663313', light: '#f0bd8e', accent: '#e7a42e' },
  { id: 'everton', name: 'Everton', mark: 'EV', primary: '#1c4c9b', navy: '#12346e', light: '#a9c8ff', accent: '#f0c62e' },
  { id: 'palestino', name: 'Palestino', mark: 'PA', primary: '#25835d', navy: '#164e39', light: '#a8d8c0', accent: '#d94a48' },
  { id: 'deportes-limache', name: 'Deportes Limache', mark: 'DL', primary: '#4c9d50', navy: '#24572b', light: '#bce2b6', accent: '#e3d85b' },
  { id: 'nublense', name: 'Ñublense', mark: 'ÑU', primary: '#c9343b', navy: '#682025', light: '#f2b1b6', accent: '#171c26' },
  { id: 'deportes-concepcion', name: 'Deportes Concepción', mark: 'DC', primary: '#7b4ab6', navy: '#3d266d', light: '#d6bdf2', accent: '#f3ce54' },
  { id: 'la-serena', name: 'Deportes La Serena', mark: 'LS', primary: '#9b2e52', navy: '#4f1830', light: '#e9b7c8', accent: '#74a9dc' },
  { id: 'coquimbo', name: 'Coquimbo Unido', mark: 'CQ', primary: '#be9830', navy: '#2c2b24', light: '#ead895', accent: '#171a20' },
  { id: 'audax', name: 'Audax Italiano', mark: 'AI', primary: '#2d9a60', navy: '#174c35', light: '#b8e0c5', accent: '#d64545' },
  { id: 'huachipato', name: 'Huachipato', mark: 'HU', primary: '#4a9bd8', navy: '#173e6a', light: '#b8dcf5', accent: '#1d2634' },
  { id: 'ohiggins', name: "O'Higgins", mark: 'OH', primary: '#49a9df', navy: '#1f527b', light: '#b9e1f6', accent: '#e2c73e' },
  { id: 'u-de-concepcion', name: 'Universidad de Concepción', mark: 'UDC', primary: '#1d4aa6', navy: '#112d68', light: '#afc6ff', accent: '#e1be30' },
  { id: 'la-calera', name: 'Unión La Calera', mark: 'ULC', primary: '#b72f3c', navy: '#651b26', light: '#efaab1', accent: '#f5f5f5' },
];

// Las fotos vienen del archivo de recursos compartido para este proyecto.
// Sólo se asignan cuando el nombre y el contenido permiten identificar el club.
const clubMedia = {
  'u-de-chile': { image: '/assets/club-media/u-de-chile.webp', alt: 'Plantel de Universidad de Chile en una imagen de Copa Chile', caption: 'PRIMER EQUIPO' },
  'colo-colo': { image: '/assets/club-media/colo-colo.webp', alt: 'Jugadores jóvenes de Colo-Colo en cancha', caption: 'FORMACIÓN ALBA' },
  'u-catolica': { image: '/assets/club-media/u-catolica.webp', alt: 'Jugadores de Universidad Católica celebrando en cancha', caption: 'PRIMER EQUIPO' },
  cobresal: { image: '/assets/club-media/cobresal.webp', alt: 'Plantel de Cobresal entrenando en El Salvador', caption: 'PLANTEL MINERO' },
  everton: { image: '/assets/club-media/everton.webp', alt: 'Plantel de Everton de Viña del Mar', caption: 'PRIMER EQUIPO' },
  palestino: { image: '/assets/club-media/palestino.webp', alt: 'Palestino en un partido frente a O’Higgins', caption: 'PRIMER EQUIPO' },
  'deportes-limache': { image: '/assets/club-media/deportes-limache.webp', alt: 'Hinchada de Deportes Limache en la tribuna', caption: 'LA HINCHADA' },
  nublense: { image: '/assets/club-media/nublense.webp', alt: 'Jugadores de Ñublense celebrando en cancha', caption: 'PRIMER EQUIPO' },
  'deportes-concepcion': { image: '/assets/club-media/deportes-concepcion.webp', alt: 'Hinchada de Deportes Concepción en Collao', caption: 'LA HINCHADA' },
  audax: { image: '/assets/club-media/audax.webp', alt: 'Jugadores de Audax Italiano en cancha', caption: 'PRIMER EQUIPO' },
};

const leagueStandings2026 = [
  { id: 'colo-colo', played: 23, wins: 17, draws: 3, losses: 3, goalDifference: 26, points: 54, city: 'Macul' },
  { id: 'u-catolica', played: 23, wins: 13, draws: 3, losses: 7, goalDifference: 17, points: 42, city: 'Santiago' },
  { id: 'u-de-chile', played: 23, wins: 12, draws: 6, losses: 5, goalDifference: 16, points: 42, city: 'Santiago' },
  { id: 'everton', played: 23, wins: 10, draws: 6, losses: 7, goalDifference: 12, points: 36, city: 'Viña del Mar' },
  { id: 'palestino', played: 23, wins: 11, draws: 3, losses: 9, goalDifference: 3, points: 36, city: 'La Cisterna' },
  { id: 'deportes-limache', played: 23, wins: 10, draws: 3, losses: 10, goalDifference: 8, points: 33, city: 'Limache' },
  { id: 'nublense', played: 23, wins: 8, draws: 8, losses: 7, goalDifference: -3, points: 32, city: 'Chillán' },
  { id: 'deportes-concepcion', played: 23, wins: 9, draws: 4, losses: 10, goalDifference: -1, points: 31, city: 'Concepción' },
  { id: 'la-serena', played: 23, wins: 7, draws: 9, losses: 7, goalDifference: -4, points: 30, city: 'La Serena' },
  { id: 'coquimbo', played: 23, wins: 8, draws: 5, losses: 10, goalDifference: -1, points: 29, city: 'Coquimbo' },
  { id: 'audax', played: 23, wins: 7, draws: 7, losses: 9, goalDifference: -5, points: 28, city: 'La Florida' },
  { id: 'huachipato', played: 22, wins: 8, draws: 4, losses: 10, goalDifference: -9, points: 28, city: 'Talcahuano' },
  { id: 'ohiggins', played: 23, wins: 8, draws: 3, losses: 12, goalDifference: -8, points: 27, city: 'Rancagua' },
  { id: 'cobresal', played: 23, wins: 7, draws: 3, losses: 13, goalDifference: -10, points: 24, city: 'El Salvador' },
  { id: 'u-de-concepcion', played: 22, wins: 6, draws: 4, losses: 12, goalDifference: -20, points: 22, city: 'Concepción' },
  { id: 'la-calera', played: 23, wins: 4, draws: 5, losses: 14, goalDifference: -21, points: 17, city: 'La Calera' },
].map((club, index) => ({ ...club, position: index + 1 }));

const clubSnapshots = Object.fromEntries(leagueStandings2026.map(({ id, position, points, played, city }) => [id, { position, points, played, city }]));

const copaChileSchedule = [
  { date: 'MIÉ 23 SEP', matches: [['Curicó Unido', 'Deportes Concepción', '18:00'], ['Deportes Iquique', 'Deportes Antofagasta', '20:30'], ['Unión La Calera', 'Universidad Católica', '20:30']] },
  { date: 'JUE 24 SEP', matches: [["O’Higgins", 'Deportes Santa Cruz', '18:00'], ['Everton', 'Universidad de Chile', '20:30']] },
];

function standingsClubName(id) {
  return teamChoices.find((team) => team.id === id)?.name || id;
}

function getClubSearchUrl(team) {
  return `https://news.google.com/search?q=${encodeURIComponent(`${team.name} fútbol Chile`)}&hl=es-419&gl=CL&ceid=CL:es-419`;
}

const quiz = [
  { q: '¿En qué año llegó la primera Copa Sudamericana de la U?', options: ['1994', '2011', '2017'], correct: '2011', why: 'La U conquistó su primer título internacional el 14 de diciembre de 2011.' },
  { q: '¿En qué año ganó la U su primer campeonato profesional?', options: ['1938', '1940', '1959'], correct: '1940', why: 'El debut profesional fue en 1938; el primer título llegó en 1940.' },
  { q: '¿Quién dirigía a la U campeona de la Sudamericana?', options: ['Jorge Sampaoli', 'Martín Lasarte', 'Fernando Gago'], correct: 'Jorge Sampaoli', why: 'Jorge Sampaoli estaba al frente del equipo campeón de 2011.' },
];

const dtPlayers = [
  { id: 'castellon', name: 'Gabriel Castellón', short: 'Castellón', role: 'POR', rating: 82, points: 86, note: 'Arco en cero' },
  { id: 'ramirez', name: 'Nicolás Ramírez', short: 'N. Ramírez', role: 'DFC', rating: 78, points: 74, note: 'Cierre y anticipo' },
  { id: 'zaldivia', name: 'Matías Zaldivia', short: 'Zaldivia', role: 'DFC', rating: 80, points: 79, note: 'Liderazgo' },
  { id: 'tamayo', name: 'Bianneider Tamayo', short: 'Tamayo', role: 'DFC', rating: 76, points: 72, note: 'Duelos ganados' },
  { id: 'hormazabal', name: 'Fabián Hormazábal', short: 'Hormazábal', role: 'MED', rating: 84, points: 92, note: 'Gol de taco' },
  { id: 'poblete', name: 'Israel Poblete', short: 'Poblete', role: 'MED', rating: 79, points: 77, note: 'Equilibrio' },
  { id: 'reinhart', name: 'Tobías Reinhart', short: 'Reinhart', role: 'MED', rating: 77, points: 74, note: 'Recorrido' },
  { id: 'guerrero', name: 'Maximiliano Guerrero', short: 'Guerrero', role: 'MED', rating: 83, points: 88, note: 'Asistencia' },
  { id: 'reyna', name: 'Gonzalo Reyna', short: 'Reyna', role: 'DEL', rating: 75, points: 71, note: 'Presión alta' },
  { id: 'vargas', name: 'Eduardo Vargas', short: 'E. Vargas', role: 'DEL', rating: 85, points: 84, note: 'Experiencia' },
  { id: 'arce', name: 'Agustín Arce', short: 'Arce', role: 'DEL', rating: 86, points: 96, note: 'Gol y desborde' },
  { id: 'aranguiz', name: 'Charles Aránguiz', short: 'Aránguiz', role: 'MED', rating: 84, points: 83, note: 'Pase vertical' },
  { id: 'altamirano', name: 'Javier Altamirano', short: 'Altamirano', role: 'MED', rating: 80, points: 78, note: 'Cambio de ritmo' },
  { id: 'fernandez', name: 'Nicolás Fernández', short: 'N. Fernández', role: 'DFC', rating: 78, points: 76, note: 'Velocidad' },
  { id: 'morales', name: 'Marcelo Morales', short: 'Morales', role: 'MED', rating: 77, points: 73, note: 'Proyección' },
  { id: 'lucero', name: 'Juan Martín Lucero', short: 'Lucero', role: 'DEL', rating: 81, points: 80, note: 'Juego aéreo' },
];

const dtSlots = [
  { key: 'POR', label: 'Arquero' },
  { key: 'DFC-1', label: 'Central' },
  { key: 'DFC-2', label: 'Central' },
  { key: 'DFC-3', label: 'Central' },
  { key: 'MED-1', label: 'Volante' },
  { key: 'MED-2', label: 'Volante' },
  { key: 'MED-3', label: 'Volante' },
  { key: 'MED-4', label: 'Volante' },
  { key: 'DEL-1', label: 'Delantero' },
  { key: 'DEL-2', label: 'Delantero' },
  { key: 'DEL-3', label: 'Delantero' },
];

const initialLineup = ['castellon', 'ramirez', 'zaldivia', 'tamayo', 'hormazabal', 'poblete', 'reinhart', 'guerrero', 'reyna', 'vargas', 'arce'];

const getRoute = () => {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return hash.split('?')[0].startsWith('/') ? hash.split('?')[0] : `/${hash.split('?')[0]}`;
};

function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; } catch { return initial; }
  });
  const [error, setError] = useState(false);
  function update(next) {
    setValue(next);
    try { localStorage.setItem(key, JSON.stringify(next)); setError(false); } catch { setError(true); }
  }
  return [value, update, error];
}

function RouteLink({ to, children, className = '', onClick }) {
  return <a href={`#${to}`} className={className} onClick={() => onClick?.()}>{children}</a>;
}

function TeamCrest({ team, className = 'team-crest' }) {
  return <span className={className} aria-hidden="true"><img src={`/assets/clubs/${team.id}.svg`} alt="" decoding="async" /></span>;
}

function ArticleLink({ article, children, className = '' }) {
  return <RouteLink to={`/articulo/${article.id}`} className={className}>{children || article.title}</RouteLink>;
}

function Brand() {
  return <RouteLink to="/" className="brand" aria-label="El Sendero del Soccer · Inicio"><span className="brand-ball" aria-hidden="true">⚽</span><span><small>FÚTBOL · ANÁLISIS · NOTICIAS</small><strong>EL SENDERO <em>DEL SOCCER</em></strong></span></RouteLink>;
}

function TeamPicker({ selectedTeam, onSelect }) {
  return <div className="team-onboarding" role="dialog" aria-modal="true" aria-labelledby="team-picker-title"><div className="team-picker-card"><span className="eyebrow">PERSONALIZA TU EXPERIENCIA</span><h1 id="team-picker-title">¿Cuál es tu<br /><em>equipo favorito?</em></h1><p>Elegiremos los colores del sitio según tu club. Puedes cambiarlo cuando quieras.</p><div className="team-grid">{teamChoices.map((team) => <button key={team.id} className={`team-option ${selectedTeam?.id === team.id ? 'selected' : ''}`} onClick={() => onSelect(team.id)} style={{ '--team-primary': team.primary, '--team-navy': team.navy, '--team-light': team.light, '--team-accent': team.accent }}><TeamCrest team={team} className="team-mark" /><span>{team.name}</span></button>)}</div><small className="team-picker-credit">Escudos de clubes: <a href="https://www.footylogos.com/es/competition/liga-de-primera-chile" target="_blank" rel="noreferrer">FootyLogos.com ↗</a></small></div></div>;
}

function MatchdayStrip({ team }) {
  const activeTeam = team || teamChoices.find((item) => item.id === 'u-de-chile');
  if (activeTeam.id === 'u-de-chile') return <aside className="matchday-strip" aria-label="Próximo partido de Universidad de Chile"><div className="shell matchday-inner"><div className="matchday-live"><span className="live-pulse" />PRÓXIMO PARTIDO</div><div className="matchday-competition">COPA CHILE · OCTAVOS</div><div className="matchday-teams"><TeamCrest team={teamChoices.find((item) => item.id === 'everton')} className="matchday-crest" /><b>EVERTON</b><span>VS</span><TeamCrest team={activeTeam} className="matchday-crest" /><b>LA U</b></div><div className="matchday-meta">JUE 24 SEP · 20:30 <i /> SAUSALITO</div><RouteLink to="/soy-dt" className="matchday-action">ARMA TU ONCE <span>↗</span></RouteLink></div></aside>;
  return <aside className="matchday-strip" aria-label={`Portada personalizada de ${activeTeam.name}`}><div className="shell matchday-inner"><div className="matchday-live"><span className="live-pulse" />MI EQUIPO</div><div className="matchday-competition">PORTADA PERSONALIZADA</div><div className="matchday-teams"><TeamCrest team={activeTeam} className="matchday-crest" /><b>{activeTeam.name}</b></div><div className="matchday-meta">NOTICIAS <i /> TABLA <i /> AGENDA</div><RouteLink to="/actualidad" className="matchday-action">VER NOTICIAS <span>↗</span></RouteLink></div></aside>;
}

function Header({ route, favoriteTeam, onChooseTeam }) {
  const [open, setOpen] = useState(false);
  const edition = new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()).replace('.', '').toUpperCase();
  return <><div className="topline"><div className="shell"><span>EL CLUB DE TODOS · MÁS QUE UNA PASIÓN</span><span>SANTIAGO, CHILE <b>•</b> EDICIÓN {edition}</span></div></div><header className="site-header"><div className="shell header-row"><Brand /><button className="menu-toggle" aria-label="Abrir navegación" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '×' : '☰'}</button><nav className={open ? 'open' : ''} aria-label="Principal">{navItems.map(([path, label], index) => <RouteLink key={`${path}-${label}`} to={path} className={`${route === path && index < 5 ? 'active ' : ''}${path === '/soy-dt' ? 'nav-dt' : ''}`} onClick={() => setOpen(false)}>{label}</RouteLink>)}<button className="mobile-team-switch" onClick={() => { setOpen(false); onChooseTeam(); }}>Mi equipo: {favoriteTeam?.name || 'Elegir'}</button></nav><div className="header-actions"><button className="team-switch" onClick={onChooseTeam} aria-label={`Cambiar mi equipo favorito: ${favoriteTeam?.name || 'elegir equipo'}`}><TeamCrest team={favoriteTeam || { id: 'u-de-chile' }} className="header-crest" /><small>{favoriteTeam?.name || 'Mi equipo'}</small></button><RouteLink to="/actualidad" className="header-search" aria-label="Buscar noticias"><span>⌕</span><small>BUSCAR</small></RouteLink></div></div></header><MatchdayStrip team={favoriteTeam} /></>;
}

function Footer({ favoriteTeam }) {
  const showUniversityLinks = favoriteTeam?.id === 'u-de-chile';
  return <footer><div className="shell footer-main"><Brand /><p>Fútbol, análisis, noticias y debate<br />para quienes viven el juego.</p>{showUniversityLinks && <div className="footer-social" aria-label="Redes oficiales de Universidad de Chile"><a href="https://twitter.com/udechile" target="_blank" rel="noreferrer">X</a><a href="https://www.instagram.com/udechileoficial/" target="_blank" rel="noreferrer">IG</a><a href="https://www.youtube.com/user/canaludechileoficial" target="_blank" rel="noreferrer">YT</a><a href="https://www.facebook.com/clubuniversidaddechileoficial/" target="_blank" rel="noreferrer">f</a><a href="https://www.tiktok.com/@udechile?_t=8X3QzIjOj5B&_r=1" target="_blank" rel="noreferrer">♪</a></div>}</div><div className="shell footer-bottom"><span>© 2026 El Sendero del Soccer · Pasión por el juego.</span><span>Sitio editorial independiente. Las marcas pertenecen a sus respectivos titulares.</span><span>Escudos: <a href="https://www.footylogos.com/es/competition/liga-de-primera-chile" target="_blank" rel="noreferrer">FootyLogos.com ↗</a></span></div></footer>;
}

function SectionTitle({ eyebrow, title, children }) {
  return <div className="section-title"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{children}</div>;
}

function useNewsFeed(limit = 6, clubId = '') {
  const [feed, setFeed] = useState({ items: [], updatedAt: null, state: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setFeed({ items: [], updatedAt: null, state: 'loading' });
    const params = new URLSearchParams({ limit: String(limit) });
    if (clubId) params.set('club', clubId);
    fetch(`/api/news?${params.toString()}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((payload) => setFeed({ items: payload.items || [], updatedAt: payload.updatedAt, state: payload.state || 'curated' }))
      .catch((error) => {
        if (error.name !== 'AbortError') setFeed({ items: newsFeed.filter((item) => !clubId || item.clubIds?.includes(clubId)).slice(0, limit), updatedAt: feedUpdatedAt, state: 'cached' });
      });
    return () => controller.abort();
  }, [limit, clubId]);

  return feed;
}

function SourceMark({ source }) {
  return <span className="source-mark" aria-hidden="true">{source.trim().slice(0, 1)}</span>;
}

function NewsRadar({ team }) {
  const activeTeam = team || teamChoices.find((item) => item.id === 'u-de-chile');
  const { items, updatedAt, state } = useNewsFeed(6, activeTeam.id);
  const lead = items[0];
  const remaining = items.slice(1);
  const sideStories = remaining.slice(0, 3);
  const hiddenStories = Math.max(remaining.length - sideStories.length, 0);
  const updateLabel = updatedAt
    ? new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(updatedAt)).replace('.', '')
    : null;

  return <section className="shell news-radar" aria-labelledby="radar-title">
    <SectionTitle eyebrow="RADAR PERSONALIZADO" title={`Noticias de ${activeTeam.name}.`}>
      <div className="radar-status" role="status"><span className={state === 'loading' ? 'status-dot loading' : 'status-dot'} />{state === 'loading' ? 'Cargando la edición…' : `Edición ${updateLabel} · CLT`}</div>
    </SectionTitle>
    {lead ? <div className={`radar-grid ${remaining.length ? '' : 'radar-grid-solo'}`}>
      <a className="radar-lead" href={lead.sourceUrl} target="_blank" rel="noreferrer">
        <div className="radar-lead-copy"><span className="radar-topic">{lead.topic}</span><h3>{lead.headline}</h3><p>{lead.summary}</p><small><SourceMark source={lead.source} /> {lead.source} · {lead.publishedLabel} <b>↗</b></small></div>
        <div className="radar-lead-art" aria-hidden="true"><span className="radar-art-kicker">EL SENDERO · FUENTES</span><div>{lead.clubIds.slice(0, 3).map((clubId) => { const crestTeam = teamChoices.find((item) => item.id === clubId); return crestTeam ? <TeamCrest key={clubId} team={crestTeam} className="radar-art-crest" /> : null; })}</div><b>90<span>′</span></b></div>
      </a>
      {remaining.length > 0 && <aside className="radar-stream" aria-label="Más titulares del radar"><div className="radar-stream-heading"><div><span>AL DÍA</span><b>Más del radar</b></div><strong>{remaining.length}<small> TITULARES</small></strong></div><div className="radar-stream-list">{sideStories.map((item, index) => <a key={item.id} href={item.sourceUrl} target="_blank" rel="noreferrer" className="radar-item"><i className="radar-item-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</i><span><small>{item.topic} · {item.publishedLabel}</small><b>{item.headline}</b><em>{item.source} ↗</em></span></a>)}</div><div className="radar-stream-footer"><span>{hiddenStories ? `+ ${hiddenStories} titulares más` : `Más sobre ${activeTeam.name}`}</span><a href={getClubSearchUrl(activeTeam)} target="_blank" rel="noreferrer">Buscar actualidad ↗</a></div></aside>}
    </div> : state === 'loading' ? <div className="radar-skeleton" aria-hidden="true"><span /><span /><span /></div> : <div className="team-news-empty"><TeamCrest team={activeTeam} className="empty-crest" /><div><b>Aún no hay notas verificadas de {activeTeam.name} en nuestro catálogo.</b><p>Para no mostrarte noticias de otro club, dejamos este radar listo para las fuentes de tu equipo.</p></div><a href={getClubSearchUrl(activeTeam)} target="_blank" rel="noreferrer">Buscar actualidad ↗</a></div>}
    <div className="radar-note"><span>◉</span><p><b>Tu radar, sin ruido.</b> Resúmenes editoriales con enlace a su fuente; esta edición no es una transmisión en vivo.</p><a href={getClubSearchUrl(activeTeam)} target="_blank" rel="noreferrer">Abrir búsqueda ↗</a></div>
  </section>;
}

function Credit({ article }) {
  return <small className="credit">{article.creditUrl ? <a href={article.creditUrl} target="_blank" rel="noreferrer">{article.credit} ↗</a> : article.credit}</small>;
}

function ScorePanel({ compact = false }) {
  return <div className={compact ? 'score-panel compact' : 'score-panel'}><div className="score-kicker"><span>FINALIZADO</span> FECHA 23 · LA PORTADA</div><div className="score-board"><div><small>LOCAL</small><b>LA SERENA</b></div><strong>0 <i>—</i> 3</strong><div><small>VISITA</small><b>LA U</b></div></div><div className="scorers">47′ Arce <span>•</span> 54′ Hormazábal <span>•</span> 90+4′ Lichnovsky</div><ArticleLink article={articles[0]} className="inline-link">Leer la crónica completa →</ArticleLink></div>;
}

function ClubHero({ team, storyCount }) {
  const snapshot = clubSnapshots[team.id];
  const media = clubMedia[team.id];
  return <section className="club-hero" aria-label={`Portada de ${team.name}`}>
    <div className="shell club-hero-grid">
      <div className={`club-cover ${media ? 'has-photo' : 'crest-cover'}`}>
        {media ? <img className="club-cover-image" src={media.image} alt={media.alt} fetchPriority="high" /> : <div className="club-cover-fallback" aria-hidden="true"><span>EL SENDERO</span><TeamCrest team={team} className="club-cover-fallback-crest" /><b>{team.mark}</b></div>}
        <div className="club-cover-shade" aria-hidden="true" />
        <div className="club-cover-top"><span>EL SENDERO <i>·</i> CLUB</span><span>TEMPORADA 2026</span></div>
        <TeamCrest team={team} className="club-cover-crest" />
        <div className="club-cover-caption"><span>{media?.caption || 'TU CLUB · TU CASA'}</span><b>{snapshot?.city || 'CHILE'}</b></div>
      </div>
      <div className="club-hero-copy">
        <div className="club-hero-overline"><span>AHORA EN TU SENDERO</span><span><i /> {team.name.toUpperCase()}</span></div>
        <div className="club-hero-heading"><span className="eyebrow">TU CARÁTULA DE TEMPORADA</span><h1>{team.name}</h1><p>La portada cambia contigo: sus colores, su gente y las historias de tu club, reunidas en un solo lugar.</p></div>
        <div className="club-hero-metrics" aria-label={`Resumen de ${team.name}`}>
          <span><small>POSICIÓN</small><b>{snapshot?.position ? `${snapshot.position}°` : '—'}</b></span>
          <span><small>PUNTOS</small><b>{snapshot?.points ?? '—'}</b></span>
          <span><small>NOTAS</small><b>{storyCount}</b></span>
        </div>
        <div className="club-hero-actions"><RouteLink to="/actualidad" className="club-hero-link"><span className="club-hero-play" aria-hidden="true">↗</span> Entrar al radar de {team.mark}<b>→</b></RouteLink><span className="club-hero-city">{snapshot?.city || 'Chile'} · Chile</span></div>
      </div>
    </div>
  </section>;
}

function ClubDesk({ team, storyCount }) {
  const snapshot = clubSnapshots[team.id];
  return <section className="shell club-desk" aria-label={`Resumen de ${team.name}`}>
    <SectionTitle eyebrow="TU CLUB, EN FOCO" title={`${team.name}.`}>
      <a className="section-link" href={getClubSearchUrl(team)} target="_blank" rel="noreferrer">Buscar actualidad ↗</a>
    </SectionTitle>
    <div className="club-desk-grid">
      <article className="club-desk-card club-standing-card">
        <span className="club-card-label">TABLA DE REFERENCIA · 2026</span>
        <div className="club-standing-main"><b>{snapshot?.position ? `${snapshot.position}°` : '—'}</b><span>POSICIÓN</span></div>
        <div className="club-standing-meta"><span><b>{snapshot?.points ?? '—'}</b> puntos</span><span><b>{snapshot?.played ?? '—'}</b> PJ</span></div>
        <small>Corte editorial de la tabla mostrada en la portada; no reemplaza una tabla en vivo.</small>
      </article>
      <article className="club-desk-card club-source-card">
        <span className="club-card-label">RADAR DEL CLUB</span>
        <b>{storyCount ? `${storyCount} notas y crónicas vinculadas.` : 'El radar está listo para tu equipo.'}</b>
        <p>{storyCount ? `El radar y el archivo reúnen sólo material relacionado con ${team.name}.` : `Aún no incorporamos notas verificadas de ${team.name}; preferimos decirlo antes que llenarte de contenido ajeno.`}</p>
        <RouteLink to="/actualidad">Abrir el radar →</RouteLink>
      </article>
      <article className="club-desk-card club-identity-card">
        <span className="club-card-label">TU IDENTIDAD</span>
        <div><TeamCrest team={team} className="club-card-mark" /><p>Los colores, el radar y el archivo siguen a <b>{team.name}</b>.</p></div>
        <span className="club-card-city">{snapshot?.city || 'Chile'} · Chile</span>
      </article>
    </div>
  </section>;
}

function BookBanner() {
  return <aside className="book-banner" aria-label="Publicidad del libro Mariano Puyol"><img src="/assets/mariano-puyol-libro.png" alt="Portada de Mariano Puyol, Simplemente un Capitán, por Omar Soto Díaz" /><div><span className="eyebrow">PUBLICIDAD · LIBROS AZULES</span><h2>Hay capitanes que se llevan para siempre.</h2><p>Mariano Puyol. Simplemente un Capitán.<br />Una historia azul, escrita por Omar Soto Díaz.</p></div><a className="button gold" href="https://marianopuyolcapitan.cl/" target="_blank" rel="noreferrer">Conocer el libro ↗</a></aside>;
}

function NewsCard({ article, saved, onSave, featured = false }) {
  return <article className={featured ? 'news-card featured' : 'news-card'}><ArticleLink article={article} className="card-image"><img src={article.image} alt={article.credit} loading="lazy" /></ArticleLink><div className="card-body"><div className="card-meta"><span>{article.category}</span><small>{article.type}</small></div><h3><ArticleLink article={article}>{article.title}</ArticleLink></h3><p>{article.excerpt}</p><div className="card-footer"><small>{article.date}</small><button onClick={() => onSave(article.id)} aria-pressed={saved} aria-label={`${saved ? 'Quitar de guardados' : 'Guardar'}: ${article.title}`}>{saved ? '♥' : '♡'}</button></div></div></article>;
}

function SourceNewsCard({ item }) {
  const taggedTeam = teamChoices.find((team) => item.clubIds?.includes(team.id));
  return <article className="source-news-card"><div className="source-news-top"><span>{item.topic}</span><time>{item.publishedLabel}</time></div><div className="source-news-main">{taggedTeam && <TeamCrest team={taggedTeam} className="source-news-crest" />}<div><h3>{item.headline}</h3><p>{item.summary}</p></div></div><div className="source-news-footer"><span><SourceMark source={item.source} /> Resumen editorial · {item.source}</span><a href={item.sourceUrl} target="_blank" rel="noreferrer">Leer la fuente ↗</a></div></article>;
}

function HomePage({ saved, onSave, favoriteTeam }) {
  const activeTeam = favoriteTeam || teamChoices.find((item) => item.id === 'u-de-chile');
  const clubArticles = useMemo(() => articles.filter((article) => article.clubIds?.includes(activeTeam.id)), [activeTeam.id]);
  const sourceCount = newsFeed.filter((item) => item.clubIds?.includes(activeTeam.id)).length;
  const storyCount = sourceCount + clubArticles.length;
  return <>
    <ClubHero team={activeTeam} storyCount={storyCount} />
    <ClubDesk team={activeTeam} storyCount={storyCount} />
    <NewsRadar team={activeTeam} />
    <section className="shell home-latest">
      <SectionTitle eyebrow="ARCHIVO DEL CLUB" title={`Historias de ${activeTeam.name}.`}><RouteLink to="/actualidad" className="section-link">Ver toda la actualidad →</RouteLink></SectionTitle>
      {clubArticles.length ? <div className="home-news-grid">{clubArticles.slice(0, 3).map((article) => <NewsCard key={article.id} article={article} saved={saved.includes(article.id)} onSave={onSave} />)}</div> : <div className="club-stories-empty"><TeamCrest team={activeTeam} className="empty-crest" /><div><b>Tu portada no se rellena con historias de otros clubes.</b><p>Cuando sumemos contenido verificado de {activeTeam.name}, aparecerá aquí.</p></div><a href={getClubSearchUrl(activeTeam)} target="_blank" rel="noreferrer">Buscar noticias del club ↗</a></div>}
    </section>
    <section className="shell home-split">
      <div className="home-data"><span className="eyebrow">LECTURA CON CONTEXTO</span><h2>El dato sirve cuando habla de <em>{activeTeam.name}.</em></h2><p>La portada conserva sólo lo que se relaciona con tu club: noticias, archivo y un punto de referencia para seguir su temporada.</p><RouteLink to="/actualidad" className="button">Explorar su actualidad →</RouteLink></div>
      <div className="home-tribuna"><span className="eyebrow">TU SENDERO</span><h2>Una experiencia que se pone la camiseta contigo.</h2><p>Cambia de equipo cuando quieras: la identidad y el filtro editorial se actualizan al instante.</p><RouteLink to="/actualidad" className="button light">Abrir el radar →</RouteLink></div>
    </section>
    {activeTeam.id === 'u-de-chile' && <div className="shell"><BookBanner /></div>}
  </>;
}

function NewsPage({ saved, onSave, saveError, favoriteTeam }) {
  const activeTeam = favoriteTeam || teamChoices.find((item) => item.id === 'u-de-chile');
  const { items: sourceItems, updatedAt, state } = useNewsFeed(20, activeTeam.id);
  const clubArticles = useMemo(() => articles.filter((article) => article.clubIds?.includes(activeTeam.id)), [activeTeam.id]);
  const categories = useMemo(() => ['Todo', ...new Set([...sourceItems.map((item) => item.topic), ...clubArticles.map((article) => article.category)])], [sourceItems, clubArticles]);
  const [category, setCategory] = useState('Todo');
  const [query, setQuery] = useState('');
  const [onlySaved, setOnlySaved] = useState(false);
  useEffect(() => { setCategory('Todo'); setQuery(''); setOnlySaved(false); }, [activeTeam.id]);
  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filtered = useMemo(() => clubArticles.filter((article) => (category === 'Todo' || article.category === category) && normalize(`${article.title} ${article.excerpt}`).includes(normalize(query)) && (!onlySaved || saved.includes(article.id))), [clubArticles, category, query, onlySaved, saved]);
  const filteredSource = useMemo(() => sourceItems.filter((item) => (category === 'Todo' || item.topic === category) && normalize(`${item.headline} ${item.summary} ${item.source}`).includes(normalize(query))), [sourceItems, category, query]);
  const savedForTeam = saved.filter((id) => clubArticles.some((article) => article.id === id));
  return <div className="page shell"><div className="page-heading editorial-heading"><span className="eyebrow">ACTUALIDAD DE {activeTeam.mark}</span><h1>Todo sobre<br />{activeTeam.name}.</h1><p>Actualidad deportiva y archivo editorial de tu club. Los datos externos se enlazan a su fuente; los textos de esta página son resúmenes originales.</p></div><div className="news-toolbar"><label className="search-box"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label={`Buscar artículos de ${activeTeam.name}`} placeholder={`Buscar en ${activeTeam.name}…`} /></label><div className="category-filter" role="group" aria-label="Filtrar por categoría">{categories.map((item) => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><button className="saved-button" aria-pressed={onlySaved} onClick={() => setOnlySaved(!onlySaved)}>{onlySaved ? '♥' : '♡'} Mis guardados ({savedForTeam.length})</button></div>{!onlySaved && <section className="source-news-section"><div className="source-news-heading"><div><span className="eyebrow">FUENTES VERIFICABLES</span><h2>Lo más reciente para {activeTeam.name}.</h2></div><small>{state === 'loading' ? 'Actualizando…' : `Edición editorial · corte ${updatedAt ? new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(updatedAt)).toUpperCase() : 'editorial'}`}</small></div>{filteredSource.length ? <div className="source-news-grid">{filteredSource.map((item) => <SourceNewsCard key={item.id} item={item} />)}</div> : <div className="empty-state"><h2>{sourceItems.length ? 'No hay titulares con esos filtros.' : `Todavía no hay resúmenes verificados para ${activeTeam.name}.`}</h2><p>No completamos esta sección con noticias de otros equipos.</p>{!sourceItems.length && <a href={getClubSearchUrl(activeTeam)} target="_blank" rel="noreferrer">Buscar actualidad ↗</a>}</div>}</section>}{(filtered.length > 0 || onlySaved) && <section className="club-archive"><div className="source-news-heading"><div><span className="eyebrow">ARCHIVO PROPIO</span><h2>Historias del Sendero.</h2></div><small>Reportajes y análisis originales</small></div>{filtered.length ? <div className="news-grid">{filtered.map((article, index) => <NewsCard key={article.id} article={article} featured={index === 0 && category === 'Todo' && !query && !onlySaved} saved={saved.includes(article.id)} onSave={onSave} />)}</div> : <div className="empty-state"><h2>No tienes historias guardadas de este equipo.</h2><p>Prueba con otra categoría o quita la búsqueda.</p><button onClick={() => setOnlySaved(false)}>Volver a actualidad</button></div>}</section>}<p className="data-note">Los guardados viven solo en este navegador.{saveError ? ' No pudimos guardar el último cambio.' : ''}</p>{activeTeam.id === 'u-de-chile' && <BookBanner />}</div>;
}

function DataPage({ favoriteTeam }) {
  const activeTeam = favoriteTeam || teamChoices.find((item) => item.id === 'u-de-chile');
  const activeStanding = leagueStandings2026.find((club) => club.id === activeTeam.id);
  return <div className="page shell data-page"><div className="page-heading data-heading"><span className="eyebrow">LIGA DE PRIMERA · CHILE</span><h1>La tabla<br />al día.</h1><p>Posiciones, diferencia de gol y próximos cruces de Copa Chile. Seleccionamos a {activeTeam.name} para ubicarlo de inmediato.</p></div><section className="standings-panel"><div className="standings-heading"><div><span className="eyebrow">CAMPEONATO NACIONAL 2026</span><h2>Tabla de posiciones</h2></div><span className="standings-cut">ESPN · CONSULTA 23 SEP 2026</span></div><div className="standings-scroll"><table className="standings-table"><thead><tr><th scope="col">#</th><th scope="col">Club</th><th scope="col">PJ</th><th scope="col">G</th><th scope="col">E</th><th scope="col">P</th><th scope="col">DG</th><th scope="col">Pts</th></tr></thead><tbody>{leagueStandings2026.map((club) => { const clubTeam = teamChoices.find((team) => team.id === club.id); return <tr key={club.id} className={club.id === activeTeam.id ? 'favorite-row' : ''} aria-current={club.id === activeTeam.id ? 'true' : undefined}><td>{club.position}</td><td><span className="standing-club">{clubTeam && <TeamCrest team={clubTeam} className="standing-crest" />}<b>{standingsClubName(club.id)}</b>{club.id === activeTeam.id && <small>MI EQUIPO</small>}</span></td><td>{club.played}</td><td>{club.wins}</td><td>{club.draws}</td><td>{club.losses}</td><td className={club.goalDifference > 0 ? 'positive-difference' : club.goalDifference < 0 ? 'negative-difference' : ''}>{club.goalDifference > 0 ? '+' : ''}{club.goalDifference}</td><td><b>{club.points}</b></td></tr>; })}</tbody></table></div><div className="standings-footer"><span>{activeTeam.name}: <b>{activeStanding?.position}°</b> · {activeStanding?.points} puntos · {activeStanding?.played} PJ</span><a href="https://www.espn.cl/futbol/liga/_/nombre/chi.1" target="_blank" rel="noreferrer">Ver posiciones actualizadas en ESPN ↗</a></div></section><section className="cup-schedule"><div className="source-news-heading"><div><span className="eyebrow">COPA CHILE · OCTAVOS DE FINAL</span><h2>Lo que viene esta semana.</h2></div><a href="https://www.espn.cl/futbol/chile/nota/_/id/17290575/la-programacion-de-los-partidos-de-ida-de-octavos-de-final-de-la-copa-chile-2026" target="_blank" rel="noreferrer">Programación ESPN ↗</a></div><div className="schedule-days">{copaChileSchedule.map((day) => <article key={day.date} className="schedule-day"><h3>{day.date}<span>IDA · COPA CHILE</span></h3>{day.matches.map(([home, away, time]) => <div className="schedule-match" key={`${home}-${away}`}><span>{home}</span><b>{time}</b><span>{away}</span></div>)}</article>)}</div><p className="data-note">Posiciones: consulta de ESPN Chile del 23/09/2026 (PJ, G-E-P, diferencia y puntos). Horarios de Copa Chile: programación ESPN del 22/09/2026; confirma posibles cambios en la fuente.</p></section></div>;
}

function ManagerPage() {
  const [lineup, setLineup, lineupError] = useStored('sendero-dt-lineup-v1', initialLineup);
  const [jwtToken, setJwtToken, jwtTokenError] = useStored('sendero-jwt-v1', '');
  const [jwtUser, setJwtUser] = useState(null);
  const [authMode, setAuthMode] = useState('register');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authOpen, setAuthOpen] = useState(false);
  const [jwtBusy, setJwtBusy] = useState(false);
  const [jwtMessage, setJwtMessage] = useState('');
  const [dragging, setDragging] = useState(null);
  const [selected, setSelected] = useState(null);
  const [duel, setDuel] = useState(null);
  const [user, setUser] = useState(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const playerById = useMemo(() => Object.fromEntries(dtPlayers.map((player) => [player.id, player])), []);
  const activeLineup = Array.isArray(lineup) && lineup.length === dtSlots.length ? lineup : initialLineup;
  const bench = dtPlayers.filter((player) => !activeLineup.includes(player.id));
  const selectedPlayer = selected?.startsWith('bench:') ? playerById[selected.slice(6)] : selected?.startsWith('lineup:') ? playerById[activeLineup[Number(selected.slice(7))]] : playerById[activeLineup[10]];
  const roleFit = activeLineup.reduce((sum, playerId, index) => {
    const player = playerById[playerId];
    const slotRole = dtSlots[index].key.split('-')[0];
    return sum + (player?.role === slotRole ? 1 : 0);
  }, 0);
  const totalPoints = activeLineup.reduce((sum, playerId) => sum + (playerById[playerId]?.points || 0), 0) + roleFit * 2;
  const rivalPoints = 846;

  useEffect(() => {
    if (import.meta.env.PROD) return undefined;
    if (!auth) return undefined;
    return onAuthStateChanged(auth, (nextUser) => setUser(nextUser), () => setAuthMessage('No pudimos comprobar tu sesión.'));
  }, []);

  useEffect(() => {
    if (import.meta.env.PROD) return undefined;
    if (!jwtToken) return undefined;
    fetch('/api/auth', { headers: { Authorization: `Bearer ${jwtToken}` } })
      .then((response) => { if (!response.ok) throw new Error('expired'); return response.json(); })
      .then((payload) => setJwtUser(payload.user))
      .catch(() => { setJwtToken(''); setJwtUser(null); });
    return undefined;
  }, [jwtToken]);

  async function handleGoogleLogin() {
    if (!auth || !googleProvider) {
      setAuthMessage('Google Login quedará disponible al conectar el proyecto Firebase.');
      return;
    }
    setAuthBusy(true);
    setAuthMessage('');
    try { await signInWithPopup(auth, googleProvider); }
    catch (error) { setAuthMessage(error?.code === 'auth/popup-closed-by-user' ? 'Cerraste la ventana de acceso.' : 'No pudimos iniciar sesión con Google.'); }
    finally { setAuthBusy(false); }
  }

  async function handleLogout() {
    if (!auth) return;
    try { await signOut(auth); } catch { setAuthMessage('No pudimos cerrar tu sesión.'); }
  }

  async function handleJwtSubmit(event) {
    event.preventDefault();
    setJwtBusy(true);
    setJwtMessage('');
    try {
      const response = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: authMode, ...authForm }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No pudimos completar el acceso.');
      setJwtToken(payload.token);
      setJwtUser(payload.user);
      setAuthOpen(false);
      setAuthForm({ name: '', email: '', password: '' });
    } catch (error) {
      setJwtMessage(error.message);
    } finally {
      setJwtBusy(false);
    }
  }

  function handleJwtLogout() {
    setJwtToken('');
    setJwtUser(null);
    setJwtMessage('');
  }

  function placePlayer(index, playerId) {
    if (!playerId || !playerById[playerId]) return;
    const next = [...activeLineup];
    const existingIndex = next.indexOf(playerId);
    if (existingIndex !== -1) {
      [next[index], next[existingIndex]] = [next[existingIndex], next[index]];
    } else {
      next[index] = playerId;
    }
    setLineup(next);
    setSelected(null);
    setDuel(null);
  }

  function handleSlotClick(index) {
    if (selected?.startsWith('bench:')) placePlayer(index, selected.slice(6));
    else if (selected?.startsWith('lineup:')) placePlayer(index, activeLineup[Number(selected.slice(7))]);
    else setSelected(`lineup:${index}`);
  }

  function handleDrop(index) {
    if (!dragging) return;
    if (dragging.startsWith('bench:')) placePlayer(index, dragging.slice(6));
    else if (dragging.startsWith('lineup:')) placePlayer(index, activeLineup[Number(dragging.slice(7))]);
    setDragging(null);
  }

  function resetLineup() {
    setLineup(initialLineup);
    setSelected(null);
    setDuel(null);
  }

  const playerCard = (player, origin, index) => <div className={`dt-player ${selected === `${origin}:${index}` ? 'selected' : ''}`} draggable onDragStart={() => setDragging(`${origin}:${index}`)} onDragEnd={() => setDragging(null)} onClick={(event) => { event.stopPropagation(); setSelected(`${origin}:${index}`); }} role="button" tabIndex="0" onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelected(`${origin}:${index}`); } }}><div className="dt-card-top"><span className="dt-rating">{player.rating}</span><span className="dt-role">{player.role}</span></div><span className="dt-card-mark" aria-hidden="true">S</span><span className="dt-player-name">{player.short}</span><div className="dt-card-stats"><span><b>{player.rating}</b>VAL</span><span><b>{player.points}</b>FOR</span><span><b>{player.role}</b>POS</span></div></div>;

  const activeUser = jwtUser || user;
  const openRegister = () => { setAuthMode('register'); setAuthOpen(true); setJwtMessage(''); };
  const openLogin = () => { setAuthMode('login'); setAuthOpen(true); setJwtMessage(''); };
  const playDuel = () => {
    if (!import.meta.env.PROD && !activeUser) { openRegister(); setJwtMessage('Regístrate para jugar el duelo y guardar tu sesión.'); return; }
    setDuel({ user: totalPoints, rival: rivalPoints });
  };
  return <div className="page manager-page">
    <section className="shell manager-heading">
      <div>
        <span className="eyebrow">SOY DT · COPA CHILE</span>
        <h1>Arma tu once.<br /><em>Defiende la U.</em></h1>
        <p>Elige tu 3–4–3 para el próximo partido ante Everton. Arrastra a cada jugador, ajusta tu idea y compite contra otro hincha.</p>
        <div className="manager-auth">
          {import.meta.env.PROD ? <><span className="auth-avatar">U</span><span><b>Juega sin registrarte</b><small>Tu once se guarda solo en este dispositivo. El duelo es una demostración.</small></span></> : <>{activeUser ? <><span className="auth-avatar">{(activeUser.displayName || activeUser.name || activeUser.email || 'U').slice(0, 1).toUpperCase()}</span><span><b>{activeUser.displayName || activeUser.name || 'Hincha azul'}</b><small>{jwtUser ? activeUser.email : 'Sesión iniciada con Google'}</small></span><button className="auth-link" onClick={jwtUser ? handleJwtLogout : handleLogout}>Salir</button></> : <><span className="google-mark">G</span><span><b>Guarda tu once y compite</b><small>Regístrate gratis en 20 segundos</small></span><button className="auth-button" onClick={openRegister}>Crear cuenta</button><button className="auth-link" onClick={openLogin}>Entrar</button></>}{!isFirebaseConfigured && !activeUser && <small className="auth-note">Registro simple activo · Google opcional.</small>}{authMessage && <small className="auth-message" role="status">{authMessage}</small>}{jwtMessage && <small className="auth-message" role="status">{jwtMessage}</small>}</>}
        </div>
        {!import.meta.env.PROD && authOpen && <form className="jwt-form" onSubmit={handleJwtSubmit}>
          <div className="jwt-tabs"><button type="button" className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>Crear cuenta</button><button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Entrar</button></div>
          {authMode === 'register' && <label>Nombre o apodo<input value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} maxLength="40" autoComplete="name" required /></label>}
          <label>Email<input type="email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} autoComplete="email" required /></label>
          <label>Contraseña<input type="password" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} minLength="6" autoComplete={authMode === 'register' ? 'new-password' : 'current-password'} required /></label>
          <div className="jwt-form-actions"><small>Token de sesión válido por 7 días.</small><button className="auth-button" disabled={jwtBusy}>{jwtBusy ? 'Guardando…' : authMode === 'register' ? 'Registrarme' : 'Entrar'}</button></div>
        </form>}
      </div>
      <div className="manager-heading-art"><img src="/assets/tifo.png" alt="Mosaico azul de la hinchada de Universidad de Chile" /><span>LA PIZARRA<br />ES TUYA</span></div>
    </section>
    <section className="shell manager-layout"><div className="manager-main">
      <div className="manager-toolbar"><div><span className="eyebrow">TU PIZARRA</span><h2>Once titular · 3–4–3</h2></div><div className="manager-score"><small>VALORACIÓN</small><strong>{totalPoints}</strong><span>{roleFit}/11 posiciones naturales</span></div></div>
      <p className="manager-help">Arrastra una carta al campo o selecciónala y toca una posición. Los puntos combinan rendimiento, forma y encaje táctico.</p>
      <div className="football-pitch" aria-label="Campo para armar la formación titular">{dtSlots.map((slot, index) => <div key={slot.key} className={`pitch-slot slot-${index} ${selected === `lineup:${index}` ? 'targeted' : ''}`} onDragOver={(event) => event.preventDefault()} onDrop={() => handleDrop(index)} onClick={() => handleSlotClick(index)}><span className="slot-label">{slot.label}</span>{activeLineup[index] ? playerCard(playerById[activeLineup[index]], 'lineup', index) : <span className="empty-slot">+</span>}</div>)}</div>
      <div className="manager-actions"><button className="button" onClick={playDuel}>Jugar el duelo ↗</button><button className="text-button" onClick={resetLineup}>Restablecer once</button>{lineupError && <small>No pudimos guardar tu once en este dispositivo.</small>}{jwtTokenError && <small>No pudimos guardar tu sesión en este dispositivo.</small>}</div>
    </div><aside className="manager-sidebar">
      <div className="bench-panel"><div className="bench-head"><div><span className="eyebrow">BANCA</span><h3>Opciones para cambiar el partido</h3></div><span>{bench.length} jugadores</span></div><div className="bench-list">{bench.map((player, index) => <div key={player.id} draggable onDragStart={() => setDragging(`bench:${player.id}`)} onDragEnd={() => setDragging(null)} onClick={() => setSelected(`bench:${player.id}`)} className={`bench-player ${selected === `bench:${player.id}` ? 'selected' : ''}`} role="button" tabIndex="0"><span className="bench-number">{String(index + 1).padStart(2, '0')}</span><span><b>{player.name}</b><small>{player.role} · {player.note}</small></span><strong>{player.points}</strong></div>)}</div><p className="bench-tip">Consejo: un jugador fuera de su posición pierde parte del bonus táctico.</p></div>
      <div className="dt-detail"><div className="dt-detail-head"><span className="dt-avatar">{selectedPlayer.short.slice(0, 2).toUpperCase()}</span><div><span className="eyebrow">FICHA DE JUGADOR</span><h3>{selectedPlayer.name}</h3></div><strong>{selectedPlayer.rating}</strong></div><div className="dt-attributes"><span><small>POSICIÓN</small><b>{selectedPlayer.role}</b></span><span><small>FORMA</small><b>{selectedPlayer.points}</b></span><span><small>APORTE</small><b>{selectedPlayer.note}</b></span></div><p>Seleccionado para tu pizarra. Arrástralo para probar otra sociedad.</p></div>
      <div className="duel-panel"><span className="eyebrow">RANKING DE LA FECHA</span><h3>¿Tu lectura supera a la de otro azul?</h3><p>Enfrenta tu valoración contra <b>El Bulla 1902</b>, un rival generado para esta fecha.</p>{duel ? <div className="duel-result"><div><small>TU ONCE</small><strong>{duel.user}</strong></div><span>vs</span><div><small>EL BULLA 1902</small><strong>{duel.rival}</strong></div><b className={duel.user >= duel.rival ? 'win' : 'loss'}>{duel.user >= duel.rival ? '¡Ganaste el duelo! 🔵' : 'El rival se impuso. Ajusta tu pizarra.'}</b></div> : <div className="duel-empty">Juega el duelo cuando sientas que tu once está listo.</div>}</div>
    </aside></section>
    <section className="shell manager-footnote"><span>PROTOTIPO JUGABLE</span><p>Tu once y tu resultado se guardan en este navegador. El ranking entre usuarios queda listo para conectar a una base de datos cuando quieras convertirlo en competencia real.</p></section>
  </div>;
}

function MemoryPage({ saved, onSave }) {
  const memoryArticles = articles.filter((article) => ['Historia', 'Cultura azul'].includes(article.category));
  return <div className="page"><section className="memory-hero shell"><div className="memory-image"><img src="/assets/hinchada.png" alt="Arte editorial de una hinchada azul" /><span>NO ES SOLO<br />FÚTBOL.</span></div><div className="memory-intro"><span className="eyebrow">EL AZUL SE HEREDA</span><h1>Antes de nosotros.<br />Después de nosotros.<br /><em>Siempre la U.</em></h1><p>Un club vive en las historias que te contaron, en la primera camiseta y en ese abrazo que todavía recuerdas.</p></div></section><section className="shell timeline-section"><SectionTitle eyebrow="UN SENDERO DE CASI UN SIGLO" title="Hitos que nos trajeron hasta acá." /><div className="history-timeline"><article><b>1927</b><span>El origen</span><p>Nace el Club Universitario de Deportes, raíz institucional de Universidad de Chile.</p></article><article><b>1940</b><span>Primera estrella</span><p>La U conquista su primer campeonato profesional.</p></article><article><b>1960s</b><span>El Ballet Azul</span><p>Una generación transforma al club en protagonista y símbolo popular.</p></article><article><b>1994</b><span>Volver a celebrar</span><p>Tras 25 años, la U se corona con una generación inolvidable.</p></article><article><b>2011</b><span>América es azul</span><p>La Copa Sudamericana llega de forma invicta y cambia la escala del sueño.</p></article><article><b>2027</b><span>El centenario</span><p>La historia continúa con una comunidad que ya mira hacia sus cien años.</p></article></div><p className="data-note">Fuente histórica: Club Universidad de Chile. El centenario corresponde al cumplimiento de 100 años desde 1927.</p></section><section className="shell memory-reading"><SectionTitle eyebrow="ARCHIVO DEL SENDERO" title="Leer también es recordar." /><div className="news-grid memory-grid">{memoryArticles.map((article) => <NewsCard key={article.id} article={article} saved={saved.includes(article.id)} onSave={onSave} />)}</div></section><div className="shell"><BookBanner /></div></div>;
}

function CommunityPage() {
  const [mvp, setMvp, mvpError] = useStored('sendero-mvp-2026-09-13', '');
  const [answers, setAnswers, quizError] = useStored('sendero-trivia-v1', {});
  const [memories, setMemories, memoriesError] = useStored('sendero-memories-v1', []);
  const [step, setStep] = useState(0);
  const [memory, setMemory] = useState('');
  const [name, setName] = useState('');
  const question = quiz[step];
  const answer = answers[step];
  const score = quiz.filter((item, index) => answers[index] === item.correct).length;
  function addMemory(event) {
    event.preventDefault();
    const clean = memory.trim();
    if (clean.length < 12) return;
    setMemories([{ id: Date.now(), name: name.trim() || 'Hincha azul', text: clean }, ...memories].slice(0, 8));
    setMemory(''); setName('');
  }
  return <div className="community-page"><section className="shell community-heading"><span className="eyebrow">LA TRIBUNA ES TUYA</span><h1>El partido termina.<br /><em>La conversación sigue.</em></h1><p>Un espacio para participar, jugar y guardar los recuerdos que hacen única tu historia con la U.</p></section><section className="shell participation-grid"><article className="participation-card vote-card"><span className="tag">TU FIGURA · LA SERENA 0–3 U</span><h2>¿Quién se lleva tus aplausos?</h2><p>Elige al jugador que más te representó en La Portada.</p><div className="player-options">{[['Agustín Arce', 'Abrió el marcador · 47′'], ['Fabián Hormazábal', 'Definición de taco · 54′'], ['Igor Lichnovsky', 'Salvó y convirtió · 90+4′']].map(([player, description], index) => <button key={player} className={mvp === player ? 'selected' : ''} aria-pressed={mvp === player} onClick={() => setMvp(player)}><span>0{index + 1}</span><span><b>{player}</b><small>{description}</small></span><i>{mvp === player ? '✓' : '+'}</i></button>)}</div><p className="feedback" aria-live="polite">{mvp ? `Tu figura: ${mvp}. Puedes cambiar tu elección.` : 'Tu elección es personal y se guarda en este navegador.'}</p>{mvpError && <small>No pudimos guardar la elección fuera de esta sesión.</small>}</article><article className="participation-card quiz-card"><span className="tag">DESAFÍO AZUL · {step + 1} / {quiz.length}</span><h2>¿Cuánto azul llevas dentro?</h2><p className="question">{question.q}</p><div className="quiz-options">{question.options.map((option) => <button key={`${step}-${option}`} disabled={Boolean(answer)} className={answer && option === question.correct ? 'correct' : answer === option ? 'incorrect' : ''} onClick={() => setAnswers({ ...answers, [step]: option })}>{option}</button>)}</div><div className="quiz-feedback" aria-live="polite">{answer && <p>{answer === question.correct ? '¡Correcto! ' : 'Esta vez no. '}{question.why}</p>}</div><div className="quiz-progress"><span>{score} / {quiz.length} aciertos</span>{step < quiz.length - 1 ? <button disabled={!answer} onClick={() => setStep(step + 1)}>Siguiente →</button> : <button onClick={() => { setAnswers({}); setStep(0); }}>Volver a jugar ↻</button>}</div><small>Preguntas basadas en la historia oficial del club.{quizError ? ' No pudimos guardar tu progreso.' : ''}</small></article></section><section className="shell memory-wall"><div className="wall-intro"><span className="eyebrow">TU HISTORIA AZUL</span><h2>¿Cuál es el recuerdo que te hizo de la U?</h2><p>Escríbelo para conservarlo en este dispositivo. No se publica ni se envía a ningún servidor.</p><form onSubmit={addMemory}><label>Tu nombre o apodo <input value={name} onChange={(event) => setName(event.target.value)} maxLength="30" placeholder="Hincha azul" /></label><label>Tu recuerdo <textarea value={memory} onChange={(event) => setMemory(event.target.value)} minLength="12" maxLength="280" placeholder="Ese día en que…" required /></label><div><small>{memory.length} / 280</small><button className="button" disabled={memory.trim().length < 12}>Guardar mi recuerdo</button></div></form>{memoriesError && <p role="status">No pudimos guardar el recuerdo en este dispositivo.</p>}</div><div className="saved-memories" aria-live="polite"><span className="eyebrow">MI MURO AZUL</span>{memories.length ? memories.map((item) => <blockquote key={item.id}><p>“{item.text}”</p><footer>{item.name}</footer><button onClick={() => setMemories(memories.filter((memoryItem) => memoryItem.id !== item.id))}>Eliminar</button></blockquote>) : <div className="wall-empty"><b>Este muro todavía espera tu primera historia.</b><p>Puede ser un partido, una persona o una camiseta.</p></div>}</div></section></div>;
}

function ArticlePage({ article, saved, onSave, saveError }) {
  const [message, setMessage] = useState('');
  async function share() {
    try { await navigator.clipboard.writeText(window.location.href); setMessage('Enlace copiado. ¡Compártelo con otro azul!'); }
    catch { setMessage('Copia la dirección del navegador para compartir este artículo.'); }
  }
  if (!article) return <div className="page shell empty-state"><h1>No encontramos ese artículo.</h1><RouteLink to="/actualidad">Volver a la actualidad →</RouteLink></div>;
  return <article className="article-page shell"><RouteLink to="/actualidad" className="back-link">← Volver a actualidad</RouteLink><div className="article-heading"><span className="eyebrow">{article.category} / {article.type}</span><h1 tabIndex="-1">{article.title}</h1><p>{article.excerpt}</p><div>REDACCIÓN EL SENDERO DEL SOCCER <span>•</span> {article.date}</div></div><figure><img src={article.image} alt={article.credit} /><figcaption><Credit article={article} /></figcaption></figure><div className="article-content"><div className="article-actions"><button aria-pressed={saved} onClick={() => onSave(article.id)}>{saved ? '♥ Guardado' : '♡ Guardar artículo'}</button><button onClick={share}>Copiar enlace ↗</button></div><p className="feedback" aria-live="polite">{message}{saveError ? ' No pudimos guardar el cambio.' : ''}</p>{article.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<aside className="source-box"><b>Sobre esta publicación</b><p>Texto original de El Sendero del Soccer. {article.type === 'Análisis' ? 'Interpretación editorial basada en los hechos del encuentro.' : 'Información redactada a partir de la fuente indicada.'}</p>{article.source.url ? <a href={article.source.url} target="_blank" rel="noreferrer">{article.source.label} ↗</a> : <span>{article.source.label}</span>}</aside><h2>Sigue por el Sendero</h2>{articles.filter((item) => item.id !== article.id).slice(0, 3).map((item) => <ArticleLink key={item.id} article={item} className="related-link" />)}</div></article>;
}

function App() {
  const [route, setRoute] = useState(getRoute);
  const [saved, setSaved, saveError] = useStored('sendero-saved-v1', []);
  const [favoriteTeamId, setFavoriteTeamId] = useStored('sendero-favorite-team-v1', '');
  const [teamPickerOpen, setTeamPickerOpen] = useState(() => !favoriteTeamId);
  const favoriteTeam = teamChoices.find((team) => team.id === favoriteTeamId);
  const articleId = route.startsWith('/articulo/') ? route.slice('/articulo/'.length) : null;
  const article = articles.find((item) => item.id === articleId);
  useEffect(() => { const handleRoute = () => setRoute(getRoute()); window.addEventListener('hashchange', handleRoute); return () => window.removeEventListener('hashchange', handleRoute); }, []);
  useEffect(() => {
    if (!favoriteTeam) return;
    const root = document.documentElement;
    root.style.setProperty('--navy', favoriteTeam.navy);
    root.style.setProperty('--navy-2', favoriteTeam.navy);
    root.style.setProperty('--blue', favoriteTeam.primary);
    root.style.setProperty('--blue-light', favoriteTeam.light);
    root.style.setProperty('--red', favoriteTeam.accent);
    root.style.setProperty('--gold', favoriteTeam.accent);
    root.style.setProperty('--club-primary', favoriteTeam.primary);
    root.style.setProperty('--club-accent', favoriteTeam.accent);
    root.dataset.favoriteTeam = favoriteTeam.id;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', favoriteTeam.navy);
  }, [favoriteTeam]);
  useEffect(() => {
    const titles = { '/': 'El Sendero del Soccer | Pasión por el juego', '/actualidad': 'Noticias | El Sendero del Soccer', '/datos': 'Partidos | El Sendero del Soccer', '/memoria': 'El Club | El Sendero del Soccer', '/comunidad': 'Comunidad | El Sendero del Soccer', '/soy-dt': 'Último Minuto | El Sendero del Soccer' };
    document.title = article ? `${article.title} | El Sendero del Soccer` : titles[route] || 'El Sendero del Soccer';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route, article]);
  const toggleSave = (id) => setSaved(saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id]);
  let page;
  if (articleId) page = <ArticlePage article={article} saved={saved.includes(articleId)} onSave={toggleSave} saveError={saveError} />;
  else if (route === '/actualidad') page = <NewsPage saved={saved} onSave={toggleSave} saveError={saveError} favoriteTeam={favoriteTeam} />;
  else if (route === '/datos') page = <DataPage favoriteTeam={favoriteTeam} />;
  else if (route === '/memoria') page = <MemoryPage saved={saved} onSave={toggleSave} />;
  else if (route === '/comunidad') page = <CommunityPage />;
  else if (route === '/soy-dt') page = <ManagerPage />;
  else page = <HomePage saved={saved} onSave={toggleSave} favoriteTeam={favoriteTeam} />;
  const chooseTeam = (teamId) => { setFavoriteTeamId(teamId); setTeamPickerOpen(false); };
  return <><a className="skip-link" href="#main">Saltar al contenido</a><Header route={route} favoriteTeam={favoriteTeam} onChooseTeam={() => setTeamPickerOpen(true)} /><main id="main">{page}</main><Footer favoriteTeam={favoriteTeam} />{teamPickerOpen && <TeamPicker selectedTeam={favoriteTeam} onSelect={chooseTeam} />}</>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
