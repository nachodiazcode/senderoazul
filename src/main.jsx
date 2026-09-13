import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const stories = [
  {
    id: 1,
    category: 'Primer equipo',
    title: '¡Goleada azul! La U ganó 3–0 de visita ante La Serena',
    excerpt: 'Universidad de Chile se impuso por 3–0 en La Portada. Una alegría de visita para celebrar con toda la hinchada azul.',
    image: '/assets/u-la-serena-accion.jpg',
    imageAlt: 'Jugador de Universidad de Chile rematando ante defensores de La Serena; foto de archivo de septiembre de 2025.',
    imageCredit: 'Foto de archivo · @udechile vía La Tercera · 28/09/2025',
    imageSource: 'https://www.latercera.com/el-deportivo/noticia/en-vivo-la-u-visita-a-la-serena-en-un-duelo-pendiente-de-la-liga-de-primera/',
    time: '13 de septiembre de 2026',
    featured: true,
  },
  {
    id: 2,
    category: 'Análisis',
    title: '¿Cómo puede cambiar la U sin Charles Aránguiz?',
    excerpt: 'Poblete gana terreno y el cuerpo técnico evalúa variantes para mantener equilibrio y profundidad.',
    image: '/assets/formacion.png',
    time: 'Hace 42 min',
  },
  {
    id: 3,
    category: 'Hinchas',
    title: 'El Nacional vuelve a vestirse de azul: postales de una hinchada que no para',
    excerpt: 'Banderas, lienzos y una identidad que transforma cada partido en un espectáculo aparte.',
    image: '/assets/hinchada.png',
    time: 'Hace 1 h',
  },
  {
    id: 4,
    category: 'Historia',
    title: 'Los grandes recibimientos que marcaron generaciones de hinchas azules',
    excerpt: 'Una selección visual de momentos inolvidables desde la galería y la cancha.',
    image: '/assets/tifo.png',
    time: 'Hace 2 h',
  },
  {
    id: 5,
    category: 'Previa',
    title: 'La Serena vs. Universidad de Chile: horario, contexto y claves del partido',
    excerpt: 'Todo lo que necesitas saber antes del duelo del domingo en el estadio La Portada.',
    image: '/assets/previa.png',
    time: 'Hace 3 h',
  },
];

const quickNews = [
  '¡Triunfo azul! Universidad de Chile ganó 3–0 de visita ante La Serena.',
  'Octavio Rivero sigue sumando minutos tras su regreso.',
  'Agustín Arce aparece entre las alternativas ofensivas.',
  'La U mantiene la pelea por puestos de clasificación internacional.',
];

const table = [
  ['1', 'Colo Colo', '53', '+26'],
  ['2', 'U. Católica', '39', '+16'],
  ['3', 'U. de Chile', '39', '+13'],
  ['4', 'Coquimbo Unido', '36', '+10'],
  ['5', 'Palestino', '34', '+8'],
];

function Icon({ children }) {
  return <span className="icon" aria-hidden="true">{children}</span>;
}

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todo');
  const [menuOpen, setMenuOpen] = useState(false);

  const categories = ['Todo', ...new Set(stories.map((story) => story.category))];
  const visibleStories = useMemo(() => stories.filter((story) => {
    const matchesCategory = category === 'Todo' || story.category === category;
    const haystack = `${story.title} ${story.excerpt} ${story.category}`.toLowerCase();
    return matchesCategory && haystack.includes(query.toLowerCase());
  }), [query, category]);

  const featured = visibleStories.find((story) => story.featured) || visibleStories[0];
  const secondary = visibleStories.filter((story) => story.id !== featured?.id);

  return (
    <div className="app-shell">
      <div className="score-strip">
        <div className="container score-inner">
          <span className="live-pill">FINALIZADO</span>
          <strong>TRIUNFO AZUL</strong>
          <span>La Serena</span><span className="score-vs">0 – 3</span><span>U. de Chile</span>
          <span className="score-date">Dom. 13 Sep · 15:00</span>
          <span className="score-place">La Portada</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-main">
          <a className="brand" href="#inicio" aria-label="El Sendero Azul, inicio">
            <img src="/assets/logo-sendero.png" alt="Logo El Sendero Azul" />
            <div>
              <span className="brand-kicker">MÁS QUE UNA PASIÓN</span>
              <span className="brand-name">EL SENDERO <b>AZUL</b></span>
            </div>
          </a>
          <button className="menu-button" onClick={() => setMenuOpen((v) => !v)} aria-label="Abrir menú">☰</button>
          <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
            <a href="#noticias">Noticias</a>
            <a href="#partidos">Partidos</a>
            <a href="#tabla">Tabla</a>
            <a href="#videos">Videos</a>
            <a href="#historia">Historia</a>
          </nav>
          <div className="header-actions">
            <label className="search-box">
              <span>⌕</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar en El Sendero…" />
            </label>
            <button className="cta">Suscríbete</button>
          </div>
        </div>
      </header>

      <div className="breaking">
        <div className="container breaking-inner">
          <span className="breaking-label">ÚLTIMO</span>
          <div className="ticker"><span>{quickNews.join('  ·  ')}</span></div>
        </div>
      </div>

      <main id="inicio">
        <section className="hero-section" id="noticias">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">ACTUALIDAD AZUL</span>
                <h1>Todo lo que pasa alrededor de la U</h1>
              </div>
              <div className="category-tabs" role="tablist">
                {categories.map((item) => (
                  <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>
                ))}
              </div>
            </div>

            {featured ? (
              <div className="news-layout">
                <article className="hero-card">
                  <img src={featured.image} alt={featured.imageAlt || ''} />
                  <div className="hero-gradient" />
                  <div className="hero-copy">
                    <span className="story-tag">{featured.category}</span>
                    <h2>{featured.title}</h2>
                    <p>{featured.excerpt}</p>
                    <div className="story-meta"><span>{featured.time}</span><span>·</span><span>Nacho Díaz</span></div>
                    {featured.imageCredit && <a className="photo-credit" href={featured.imageSource} target="_blank" rel="noopener noreferrer">{featured.imageCredit}</a>}
                  </div>
                </article>

                <div className="side-stories">
                  {secondary.slice(0, 3).map((story) => (
                    <article className="side-story" key={story.id}>
                      <img src={story.image} alt={story.imageAlt || ''} />
                      <div>
                        <span className="small-tag">{story.category}</span>
                        <h3>{story.title}</h3>
                        <span className="story-time">{story.time}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : <div className="empty-state">No encontramos noticias con ese filtro.</div>}
          </div>
        </section>

        <section className="match-section" id="partidos">
          <div className="container match-grid">
            <div className="match-card">
              <div className="match-title-row">
                <div><span className="eyebrow light">FECHA 23 · LIGA DE PRIMERA</span><h2>¡Triunfo de visita!</h2></div>
                <span className="match-status">FINALIZADO</span>
              </div>
              <div className="teams">
                <div className="team"><div className="crest rival">LS</div><strong>La Serena</strong><span>Local</span></div>
                <div className="kickoff"><span>DOM 13 SEP</span><b>0 – 3</b><small>Estadio La Portada</small></div>
                <div className="team"><img src="/assets/logo-sendero.png" alt="" /><strong>U. de Chile</strong><span>Visita</span></div>
              </div>
              <div className="match-footer">
                <span>La U ganó 3–0 en La Portada. ¡Vamos los azules!</span>
                <a href="#noticias">Ver noticia →</a>
              </div>
            </div>

            <aside className="coach-card">
              <img src="/assets/nacho.png" alt="Conductor de El Sendero Azul" />
              <div className="coach-overlay" />
              <div className="coach-copy"><span>EL SENDERO AZUL</span><h3>Opinión, identidad y fútbol</h3><p>Un espacio hecho por hinchas para conversar de la U sin corbata.</p></div>
            </aside>
          </div>
        </section>

        <section className="content-section">
          <div className="container content-grid">
            <div>
              <div className="section-title-row"><h2>Últimas noticias</h2><a href="#noticias">Ver todas →</a></div>
              <div className="latest-list">
                {stories.map((story, index) => (
                  <article className="latest-item" key={story.id}>
                    <span className="latest-number">0{index + 1}</span>
                    <img src={story.image} alt={story.imageAlt || ''} />
                    <div><span className="small-tag">{story.category}</span><h3>{story.title}</h3><p>{story.excerpt}</p><span className="story-time">{story.time}</span></div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="sidebar">
              <div className="panel" id="tabla">
                <div className="panel-head"><h3>Tabla 2026</h3><span>PTS</span></div>
                {table.map(([pos, team, pts, diff]) => (
                  <div className={team === 'U. de Chile' ? 'table-row highlight' : 'table-row'} key={team}>
                    <span>{pos}</span><strong>{team}</strong><small>{diff}</small><b>{pts}</b>
                  </div>
                ))}
                <button className="panel-link">Ver tabla completa</button>
              </div>

              <div className="panel popular-panel">
                <div className="panel-head"><h3>Lo más leído</h3></div>
                {quickNews.map((item, idx) => <a href="#noticias" key={item}><span>{idx + 1}</span>{item}</a>)}
              </div>
            </aside>
          </div>
        </section>

        <section className="video-section" id="videos">
          <div className="container">
            <div className="section-title-row inverse"><div><span className="eyebrow light">EL SENDERO TV</span><h2>Videos y análisis</h2></div><button className="ghost-btn">Ir a YouTube ↗</button></div>
            <div className="video-grid">
              {[['/assets/chile2.png','La pelea por el Chile 2'],['/assets/formacion.png','La formación que prepara la U'],['/assets/previa.png','La previa: La Serena vs. la U']].map(([img,title]) => (
                <article className="video-card" key={title}><div className="video-thumb"><img src={img} alt=""/><span className="play">▶</span></div><h3>{title}</h3><p>Debate · Análisis · Comunidad</p></article>
              ))}
            </div>
          </div>
        </section>

        <section className="history-section" id="historia">
          <div className="container history-card">
            <div><span className="eyebrow">IDENTIDAD</span><h2>La U es fútbol, historia y pueblo</h2><p>Un archivo visual y editorial para recordar partidos, figuras, campañas e historias que construyen la cultura azul.</p><button className="dark-btn">Explorar historia →</button></div>
            <img src="/assets/tifo.png" alt="Hinchas de Universidad de Chile en el estadio" />
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-grid">
          <div className="footer-brand"><img src="/assets/logo-sendero.png" alt=""/><div><strong>EL SENDERO AZUL</strong><span>Fútbol · Comunidad · Identidad</span></div></div>
          <div><b>Secciones</b><a href="#noticias">Noticias</a><a href="#partidos">Partidos</a><a href="#tabla">Tabla</a></div>
          <div><b>Canal</b><a href="#videos">Videos</a><a href="#historia">Historia</a><a href="#inicio">Nosotros</a></div>
          <div className="newsletter"><b>Newsletter azul</b><p>Recibe lo importante de la U, sin ruido.</p><div><input placeholder="tu@email.cl"/><button>→</button></div></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 El Sendero Azul</span><span>Sitio editorial independiente de hinchas.</span></div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
