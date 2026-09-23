export const newsFeed = [
  {
    id: 'la-serena-0-3-la-u',
    source: 'Emol',
    sourceUrl: 'https://www.emol.com/',
    headline: 'Así fue el triunfo de Universidad de Chile sobre La Serena por el Torneo Nacional',
    summary: 'La U ganó 3–0 en La Portada y se mantiene en carrera por la clasificación directa a la Copa Libertadores.',
    topic: 'Primer equipo',
    publishedLabel: 'Hace 1 día',
    publishedAt: '2026-09-13T23:10:00-03:00',
    image: '/assets/triunfo-la-portada-2026.jpg',
    clubIds: ['u-de-chile', 'la-serena'],
  },
  {
    id: 'estados-financieros-2026',
    source: 'AS Chile',
    sourceUrl: 'https://chile.as.com/',
    headline: 'La U, Colo Colo y la UC conocieron sus estados financieros de 2026',
    summary: 'Las sociedades anónimas que administran a los tres grandes entregaron sus cifras a la Comisión para el Mercado Financiero.',
    topic: 'Institucional',
    publishedLabel: 'Hace 4 horas',
    publishedAt: '2026-09-14T09:30:00-03:00',
    image: '/assets/hinchada.png',
    clubIds: ['u-de-chile', 'colo-colo', 'u-catolica'],
  },
  {
    id: 'calendario-clasico-universitario',
    source: 'TNT Sports',
    sourceUrl: 'https://tntsports.cl/',
    headline: 'El calendario que viene para la U y la UC con el clásico a la vista',
    summary: 'Azules y cruzados siguen peleando palmo a palmo la clasificación directa a la CONMEBOL Libertadores.',
    topic: 'Agenda',
    publishedLabel: 'Hace 12 horas',
    publishedAt: '2026-09-14T01:20:00-03:00',
    image: '/assets/previa.png',
    clubIds: ['u-de-chile', 'u-catolica'],
  },
  {
    id: 'libertadores-femenina-grupo',
    source: 'Club Universidad de Chile',
    sourceUrl: 'https://www.udechile.cl/',
    headline: 'Copa Libertadores Femenina: revisa el grupo de las Leonas',
    summary: 'El sorteo continental definió a las rivales de Universidad de Chile para la edición 2026 del torneo.',
    topic: 'Fútbol femenino',
    publishedLabel: 'Hace 5 horas',
    publishedAt: '2026-09-14T08:20:00-03:00',
    image: '/assets/tifo.png',
    clubIds: ['u-de-chile'],
  },
  {
    id: 'batalla-chile-2',
    source: 'Al Aire Libre',
    sourceUrl: 'https://www.alairelibre.cl/',
    headline: '42 puntos y US$3 millones en juego: la batalla de la U y la UC por el Chile 2',
    summary: 'Con siete fechas por disputar, ambos equipos llegan igualados a la recta que define el segundo cupo directo.',
    topic: 'Campeonato',
    publishedLabel: 'Hace 12 horas',
    publishedAt: '2026-09-14T01:05:00-03:00',
    image: '/assets/chile2.png',
    clubIds: ['u-de-chile', 'u-catolica'],
  },
  {
    id: 'jugador-otra-velocidad',
    source: 'Bolavip Chile',
    sourceUrl: 'https://chile.bolavip.com/',
    headline: 'Manuel de Tezanos destaca a una de las figuras de Universidad de Chile',
    summary: 'El comentarista puso el foco en el cambio de ritmo y el presente de uno de los nombres azules de la fecha.',
    topic: 'Reacciones',
    publishedLabel: 'Hace 10 horas',
    publishedAt: '2026-09-14T03:15:00-03:00',
    image: '/assets/u-la-serena-accion.jpg',
    clubIds: ['u-de-chile'],
  },
];

export const feedUpdatedAt = '2026-09-14T13:45:00-03:00';

const normalize = (value = '') => String(value ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

export function getNewsPayload(url = 'http://localhost/api/news') {
  const requestUrl = new URL(url, 'http://localhost');
  const topic = requestUrl.searchParams.get('topic');
  const source = requestUrl.searchParams.get('source');
  const club = requestUrl.searchParams.get('club');
  const query = normalize(requestUrl.searchParams.get('q'));
  const requestedLimit = Number(requestUrl.searchParams.get('limit'));
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
    ? Math.min(Math.floor(requestedLimit), 20)
    : 10;

  const items = newsFeed
    .filter((item) => !topic || normalize(item.topic) === normalize(topic))
    .filter((item) => !source || normalize(item.source) === normalize(source))
    .filter((item) => !club || item.clubIds?.includes(club))
    .filter((item) => !query || normalize(`${item.headline} ${item.summary} ${item.source}`).includes(query))
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit);

  return {
    ok: true,
    updatedAt: feedUpdatedAt,
    count: items.length,
    items,
  };
}
