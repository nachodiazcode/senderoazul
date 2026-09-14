import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { articles } from './content';
import './styles.css';

const navItems = [
  ['/', 'Portada'],
  ['/actualidad', 'Actualidad'],
  ['/datos', 'Partido & data'],
  ['/memoria', 'Memoria'],
  ['/comunidad', 'La tribuna'],
  ['/soy-dt', 'Soy DT'],
];

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

function ArticleLink({ article, children, className = '' }) {
  return <RouteLink to={`/articulo/${article.id}`} className={className}>{children || article.title}</RouteLink>;
}

function Brand() {
  return <RouteLink to="/" className="brand"><img src="/assets/logo-sendero.png" alt="" /><span><small>MÁS QUE UNA PASIÓN</small><b>EL SENDERO <em>AZUL</em></b></span></RouteLink>;
}

function Header({ route }) {
  const [open, setOpen] = useState(false);
  return <><div className="topline"><div className="shell"><span>UN MEDIO INDEPENDIENTE. UN MISMO SENTIMIENTO.</span><span>SANTIAGO, CHILE <b>•</b> EDICIÓN 13 SEP 2026</span></div></div><header className="site-header"><div className="shell header-row"><Brand /><button className="menu-toggle" aria-label="Abrir navegación" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '×' : '☰'}</button><nav className={open ? 'open' : ''} aria-label="Principal">{navItems.map(([path, label]) => <RouteLink key={path} to={path} className={route === path ? 'active' : ''} onClick={() => setOpen(false)}>{label}</RouteLink>)}</nav><RouteLink to="/soy-dt" className="button header-cta">Arma tu once ↗</RouteLink></div></header></>;
}

function Footer() {
  return <footer><div className="shell footer-main"><Brand /><p>Periodismo independiente, memoria y comunidad.<br />El amor por la U es lo que nos reúne.</p><div className="footer-nav"><RouteLink to="/actualidad">Actualidad</RouteLink><RouteLink to="/comunidad">Participa</RouteLink><RouteLink to="/memoria">Memoria azul</RouteLink></div></div><div className="shell footer-bottom"><span>© 2026 El Sendero Azul · Medio independiente de hinchas.</span><span>Preferencias guardadas en tu dispositivo. Sin registro.</span></div></footer>;
}

function SectionTitle({ eyebrow, title, children }) {
  return <div className="section-title"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{children}</div>;
}

function Credit({ article }) {
  return <small className="credit">{article.creditUrl ? <a href={article.creditUrl} target="_blank" rel="noreferrer">{article.credit} ↗</a> : article.credit}</small>;
}

function ScorePanel({ compact = false }) {
  return <div className={compact ? 'score-panel compact' : 'score-panel'}><div className="score-kicker"><span>FINALIZADO</span> FECHA 23 · LA PORTADA</div><div className="score-board"><div><small>LOCAL</small><b>LA SERENA</b></div><strong>0 <i>—</i> 3</strong><div><small>VISITA</small><b>LA U</b></div></div><div className="scorers">47′ Arce <span>•</span> 54′ Hormazábal <span>•</span> 90+4′ Lichnovsky</div><ArticleLink article={articles[0]} className="inline-link">Leer la crónica completa →</ArticleLink></div>;
}

function BookBanner() {
  return <aside className="book-banner" aria-label="Publicidad del libro Mariano Puyol"><img src="/assets/mariano-puyol-libro.png" alt="Portada de Mariano Puyol, Simplemente un Capitán, por Omar Soto Díaz" /><div><span className="eyebrow">PUBLICIDAD · LIBROS AZULES</span><h2>Hay capitanes que se llevan para siempre.</h2><p>Mariano Puyol. Simplemente un Capitán.<br />Una historia azul, escrita por Omar Soto Díaz.</p></div><a className="button gold" href="https://marianopuyolcapitan.cl/" target="_blank" rel="noreferrer">Conocer el libro ↗</a></aside>;
}

function NewsCard({ article, saved, onSave, featured = false }) {
  return <article className={featured ? 'news-card featured' : 'news-card'}><ArticleLink article={article} className="card-image"><img src={article.image} alt={article.credit} loading="lazy" /></ArticleLink><div className="card-body"><div className="card-meta"><span>{article.category}</span><small>{article.type}</small></div><h3><ArticleLink article={article}>{article.title}</ArticleLink></h3><p>{article.excerpt}</p><div className="card-footer"><small>{article.date}</small><button onClick={() => onSave(article.id)} aria-pressed={saved} aria-label={`${saved ? 'Quitar de guardados' : 'Guardar'}: ${article.title}`}>{saved ? '♥' : '♡'}</button></div></div></article>;
}

function HomePage({ saved, onSave }) {
  return <>
    <section className="concept-hero">
      <div className="shell concept-grid">
        <div className="concept-collage">
          <img className="collage-main" src={articles[0].image} alt="Acción entre Universidad de Chile y La Serena, fotografía de archivo" />
          <div className="collage-wash" />
          <div className="collage-score"><small>FINAL · LA PORTADA</small><b>0—3</b><span>TRIUNFO AZUL</span></div>
          <div className="collage-photo"><img src="/assets/hinchada.png" alt="Arte editorial de la hinchada azul" /><span>LA PASIÓN<br />NO SE EXPLICA.</span></div>
          <div className="collage-stamp">U</div>
        </div>
        <div className="concept-copy">
          <div className="color-stripe" />
          <span className="eyebrow">FÚTBOL · MEMORIA · PERTENENCIA</span>
          <h1>La U<br />se vive.</h1>
          <h2>Acá se comparte.</h2>
          <p>{articles[0].excerpt}</p>
          <ArticleLink article={articles[0]} className="concept-link">LEER LA CRÓNICA <span>↗</span></ArticleLink>
          <Credit article={articles[0]} />
        </div>
      </div>
      <div className="shell hero-modules">
        <ScorePanel compact />
        <article className="memory-teaser">
          <img src="/assets/tifo.png" alt="Arte editorial de hinchada azul" />
          <div><span className="eyebrow">MEMORIA AZUL</span><ArticleLink article={articles[3]}><h3>Hay noches que no terminan nunca.</h3></ArticleLink><p>Volver al 2011. Volver a sentirlo.</p></div>
        </article>
        <RouteLink to="/soy-dt" className="community-teaser"><span>SOY DT · COPA CHILE<b>Arma tu once para Everton</b></span><strong>↗</strong></RouteLink>
      </div>
    </section>
    <section className="shell home-latest">
      <SectionTitle eyebrow="PERIODISMO CON CORAZÓN AZUL" title="Lo que nos mueve."><RouteLink to="/actualidad" className="section-link">Ver toda la actualidad →</RouteLink></SectionTitle>
      <div className="home-news-grid">{articles.slice(1, 4).map((article) => <NewsCard key={article.id} article={article} saved={saved.includes(article.id)} onSave={onSave} />)}</div>
    </section>
    <section className="shell home-split">
      <div className="home-data"><span className="eyebrow">PARTIDO & DATA</span><h2>El resultado cuenta.<br />La historia explica.</h2><p>El marcador, los momentos decisivos y una lectura honesta de lo que pasó en La Portada.</p><RouteLink to="/datos" className="button">Explorar el partido →</RouteLink></div>
      <div className="home-tribuna"><span className="eyebrow">PARTICIPA</span><h2>Tu voz también forma parte del Sendero.</h2><p>Elige la figura, demuestra cuánto sabes y deja un recuerdo azul guardado en tu dispositivo.</p><RouteLink to="/comunidad" className="button light">Entrar a la tribuna →</RouteLink></div>
    </section>
    <div className="shell"><BookBanner /></div>
  </>;
}

function NewsPage({ saved, onSave, saveError }) {
  const [category, setCategory] = useState('Todo');
  const [query, setQuery] = useState('');
  const [onlySaved, setOnlySaved] = useState(false);
  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filtered = useMemo(() => articles.filter((article) => (category === 'Todo' || article.category === category) && normalize(`${article.title} ${article.excerpt}`).includes(normalize(query)) && (!onlySaved || saved.includes(article.id))), [category, query, onlySaved, saved]);
  return <div className="page shell"><div className="page-heading editorial-heading"><span className="eyebrow">ACTUALIDAD AZUL</span><h1>Historias para leer<br />con la camiseta puesta.</h1><p>Crónicas, análisis, cultura y memoria. Textos propios con fuentes visibles.</p></div><div className="news-toolbar"><label className="search-box"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Buscar artículos" placeholder="Buscar en El Sendero…" /></label><div className="category-filter" role="group" aria-label="Filtrar por categoría">{['Todo', 'Primer equipo', 'Análisis', 'Historia', 'Cultura azul'].map((item) => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><button className="saved-button" aria-pressed={onlySaved} onClick={() => setOnlySaved(!onlySaved)}>{onlySaved ? '♥' : '♡'} Mis guardados ({saved.length})</button></div>{filtered.length ? <div className="news-grid">{filtered.map((article, index) => <NewsCard key={article.id} article={article} featured={index === 0 && category === 'Todo' && !query && !onlySaved} saved={saved.includes(article.id)} onSave={onSave} />)}</div> : <div className="empty-state"><h2>No encontramos artículos con esos filtros.</h2><button onClick={() => { setQuery(''); setCategory('Todo'); setOnlySaved(false); }}>Ver todos los artículos</button></div>}<p className="data-note">Los guardados viven solo en este navegador.{saveError ? ' No pudimos guardar el último cambio.' : ''}</p><BookBanner /></div>;
}

function DataPage() {
  return <div className="page shell"><div className="page-heading data-heading"><span className="eyebrow">PARTIDO & DATA</span><h1>La alegría<br />tiene marcador.</h1><p>Los momentos que explican el 3–0 de la U en La Portada.</p></div><div className="data-hero"><ScorePanel /><div className="data-cards"><article><strong>42</strong><h3>Puntos de la U</h3><p>39 antes del encuentro más los tres puntos del triunfo.</p></article><article><strong>8<small>min</small></strong><h3>Para cambiar la tarde</h3><p>Entre el primer gol de Arce y el segundo de Hormazábal.</p></article><article><strong>3</strong><h3>Goleadores distintos</h3><p>Arce, Hormazábal y Lichnovsky construyeron la victoria.</p></article><article><strong>0</strong><h3>Goles recibidos</h3><p>Castellón, Fernández y Lichnovsky protegieron el arco.</p></article></div></div><section className="match-story"><SectionTitle eyebrow="LA PELÍCULA DEL PARTIDO" title="Noventa minutos en cuatro escenas." /><div className="event-list"><article><span>25′–28′</span><div><b>La U resiste</b><p>Castellón responde y Nicolás Fernández evita una apertura granate.</p></div></article><article><span>47′</span><div><b>Arce rompe el cero</b><p>Recuperación alta, entrada al área y zurdazo cruzado para el 1–0.</p></div></article><article><span>54′</span><div><b>Hormazábal inventa una definición</b><p>Guerrero desborda por la derecha y el lateral convierte de taco.</p></div></article><article><span>79′–90+4′</span><div><b>Lichnovsky en las dos áreas</b><p>Primero salva sobre la línea; después cierra la goleada de cabeza.</p></div></article></div></section><div className="data-disclaimer"><b>Cómo trabajamos estos datos</b><p>Corte: final del partido del 13/09/2026. Minutos y acciones tomados del seguimiento de AS proporcionado a la redacción. No inventamos posesión, remates ni métricas avanzadas que no podamos verificar.</p><ArticleLink article={articles[1]}>Leer el análisis del triunfo →</ArticleLink></div></div>;
}

function ManagerPage() {
  const [lineup, setLineup, lineupError] = useStored('sendero-dt-lineup-v1', initialLineup);
  const [dragging, setDragging] = useState(null);
  const [selected, setSelected] = useState(null);
  const [duel, setDuel] = useState(null);
  const playerById = useMemo(() => Object.fromEntries(dtPlayers.map((player) => [player.id, player])), []);
  const activeLineup = Array.isArray(lineup) && lineup.length === dtSlots.length ? lineup : initialLineup;
  const bench = dtPlayers.filter((player) => !activeLineup.includes(player.id));
  const roleFit = activeLineup.reduce((sum, playerId, index) => {
    const player = playerById[playerId];
    const slotRole = dtSlots[index].key.split('-')[0];
    return sum + (player?.role === slotRole ? 1 : 0);
  }, 0);
  const totalPoints = activeLineup.reduce((sum, playerId) => sum + (playerById[playerId]?.points || 0), 0) + roleFit * 2;
  const rivalPoints = 846;

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

  const playerCard = (player, origin, index) => <div className={`dt-player ${selected === `${origin}:${index}` ? 'selected' : ''}`} draggable onDragStart={() => setDragging(`${origin}:${index}`)} onDragEnd={() => setDragging(null)} onClick={(event) => { event.stopPropagation(); setSelected(`${origin}:${index}`); }} role="button" tabIndex="0" onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelected(`${origin}:${index}`); } }}><span className="dt-rating">{player.rating}</span><span className="dt-player-name">{player.short}</span><small>{player.role} · {player.note}</small></div>;

  return <div className="page manager-page"><section className="shell manager-heading"><div><span className="eyebrow">SOY DT · COPA CHILE</span><h1>Arma tu once.<br /><em>Defiende la U.</em></h1><p>Elige tu 3–4–3 para el próximo partido ante Everton. Arrastra a cada jugador, ajusta tu idea y compite contra otro hincha.</p></div><div className="manager-heading-art"><img src="/assets/formacion-3-4-3-analisis.png" alt="Pizarra táctica azul con formación 3-4-3" /><span>LA PIZARRA<br />ES TUYA</span></div></section><section className="shell manager-layout"><div className="manager-main"><div className="manager-toolbar"><div><span className="eyebrow">TU PIZARRA</span><h2>Once titular · 3–4–3</h2></div><div className="manager-score"><small>VALORACIÓN</small><strong>{totalPoints}</strong><span>{roleFit}/11 posiciones naturales</span></div></div><p className="manager-help">Arrastra una carta al campo o selecciónala y toca una posición. Los puntos combinan rendimiento, forma y encaje táctico.</p><div className="football-pitch" aria-label="Campo para armar la formación titular">{dtSlots.map((slot, index) => <div key={slot.key} className={`pitch-slot slot-${index} ${selected === `lineup:${index}` ? 'targeted' : ''}`} onDragOver={(event) => event.preventDefault()} onDrop={() => handleDrop(index)} onClick={() => handleSlotClick(index)}><span className="slot-label">{slot.label}</span>{activeLineup[index] ? playerCard(playerById[activeLineup[index]], 'lineup', index) : <span className="empty-slot">+</span>}</div>)}</div><div className="manager-actions"><button className="button" onClick={() => setDuel({ user: totalPoints, rival: rivalPoints })}>Jugar el duelo ↗</button><button className="text-button" onClick={resetLineup}>Restablecer once</button>{lineupError && <small>No pudimos guardar tu once en este dispositivo.</small>}</div></div><aside className="manager-sidebar"><div className="bench-panel"><div className="bench-head"><div><span className="eyebrow">BANCA</span><h3>Opciones para cambiar el partido</h3></div><span>{bench.length} jugadores</span></div><div className="bench-list">{bench.map((player, index) => <div key={player.id} draggable onDragStart={() => setDragging(`bench:${player.id}`)} onDragEnd={() => setDragging(null)} onClick={() => setSelected(`bench:${player.id}`)} className={`bench-player ${selected === `bench:${player.id}` ? 'selected' : ''}`} role="button" tabIndex="0"><span className="bench-number">{String(index + 1).padStart(2, '0')}</span><span><b>{player.name}</b><small>{player.role} · {player.note}</small></span><strong>{player.points}</strong></div>)}</div><p className="bench-tip">Consejo: un jugador fuera de su posición pierde parte del bonus táctico.</p></div><div className="duel-panel"><span className="eyebrow">RANKING DE LA FECHA</span><h3>¿Tu lectura supera a la de otro azul?</h3><p>Enfrenta tu valoración contra <b>El Bulla 1902</b>, un rival generado para esta fecha.</p>{duel ? <div className="duel-result"><div><small>TU ONCE</small><strong>{duel.user}</strong></div><span>vs</span><div><small>EL BULLA 1902</small><strong>{duel.rival}</strong></div><b className={duel.user >= duel.rival ? 'win' : 'loss'}>{duel.user >= duel.rival ? '¡Ganaste el duelo! 🔵' : 'El rival se impuso. Ajusta tu pizarra.'}</b></div> : <div className="duel-empty">Juega el duelo cuando sientas que tu once está listo.</div>}</div></aside></section><section className="shell manager-footnote"><span>PROTOTIPO JUGABLE</span><p>Tu once y tu resultado se guardan en este navegador. El ranking entre usuarios queda listo para conectar a una base de datos cuando quieras convertirlo en competencia real.</p></section></div>;
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
  return <article className="article-page shell"><RouteLink to="/actualidad" className="back-link">← Volver a actualidad</RouteLink><div className="article-heading"><span className="eyebrow">{article.category} / {article.type}</span><h1 tabIndex="-1">{article.title}</h1><p>{article.excerpt}</p><div>REDACCIÓN EL SENDERO AZUL <span>•</span> {article.date}</div></div><figure><img src={article.image} alt={article.credit} /><figcaption><Credit article={article} /></figcaption></figure><div className="article-content"><div className="article-actions"><button aria-pressed={saved} onClick={() => onSave(article.id)}>{saved ? '♥ Guardado' : '♡ Guardar artículo'}</button><button onClick={share}>Copiar enlace ↗</button></div><p className="feedback" aria-live="polite">{message}{saveError ? ' No pudimos guardar el cambio.' : ''}</p>{article.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<aside className="source-box"><b>Sobre esta publicación</b><p>Texto original de El Sendero Azul. {article.type === 'Análisis' ? 'Interpretación editorial basada en los hechos del encuentro.' : 'Información redactada a partir de la fuente indicada.'}</p>{article.source.url ? <a href={article.source.url} target="_blank" rel="noreferrer">{article.source.label} ↗</a> : <span>{article.source.label}</span>}</aside><h2>Sigue por el Sendero</h2>{articles.filter((item) => item.id !== article.id).slice(0, 3).map((item) => <ArticleLink key={item.id} article={item} className="related-link" />)}</div></article>;
}

function App() {
  const [route, setRoute] = useState(getRoute);
  const [saved, setSaved, saveError] = useStored('sendero-saved-v1', []);
  const articleId = route.startsWith('/articulo/') ? route.slice('/articulo/'.length) : null;
  const article = articles.find((item) => item.id === articleId);
  useEffect(() => { const handleRoute = () => setRoute(getRoute()); window.addEventListener('hashchange', handleRoute); return () => window.removeEventListener('hashchange', handleRoute); }, []);
  useEffect(() => {
    const titles = { '/': 'El Sendero Azul | La casa del hincha', '/actualidad': 'Actualidad | El Sendero Azul', '/datos': 'Partido & data | El Sendero Azul', '/memoria': 'Memoria azul | El Sendero Azul', '/comunidad': 'La tribuna | El Sendero Azul', '/soy-dt': 'Soy DT | El Sendero Azul' };
    document.title = article ? `${article.title} | El Sendero Azul` : titles[route] || 'El Sendero Azul';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route, article]);
  const toggleSave = (id) => setSaved(saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id]);
  let page;
  if (articleId) page = <ArticlePage article={article} saved={saved.includes(articleId)} onSave={toggleSave} saveError={saveError} />;
  else if (route === '/actualidad') page = <NewsPage saved={saved} onSave={toggleSave} saveError={saveError} />;
  else if (route === '/datos') page = <DataPage />;
  else if (route === '/memoria') page = <MemoryPage saved={saved} onSave={toggleSave} />;
  else if (route === '/comunidad') page = <CommunityPage />;
  else if (route === '/soy-dt') page = <ManagerPage />;
  else page = <HomePage saved={saved} onSave={toggleSave} />;
  return <><a className="skip-link" href="#main">Saltar al contenido</a><Header route={route} /><main id="main">{page}</main><Footer /></>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
