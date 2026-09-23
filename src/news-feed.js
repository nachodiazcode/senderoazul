export const newsFeed = [
  {
    id: 'copa-chile-octavos-septiembre',
    source: 'ESPN Chile',
    sourceUrl: 'https://www.espn.cl/futbol/chile/nota/_/id/17290575/la-programacion-de-los-partidos-de-ida-de-octavos-de-final-de-la-copa-chile-2026',
    headline: 'La Copa Chile entra en octavos con duelos decisivos entre semana',
    summary: 'La ida comenzó el martes. Este miércoles destacan Católica–La Calera y el jueves Everton recibe a Universidad de Chile en Sausalito.',
    topic: 'Agenda',
    publishedLabel: '22 SEP 2026',
    publishedAt: '2026-09-22T13:02:00-03:00',
    clubIds: ['audax', 'colo-colo', 'u-catolica', 'la-calera', 'everton', 'u-de-chile', 'coquimbo', 'nublense', 'ohiggins', 'deportes-concepcion'],
  },
  {
    id: 'tabla-liga-primera-2026-sep15',
    source: 'ESPN Chile',
    sourceUrl: 'https://www.espn.cl/futbol/chile/nota/_/id/16246027/tabla-de-posiciones-campeonato-nacional-liga-de-primera-chile',
    headline: 'Colo-Colo lidera; Universidad Católica y la U comparten el segundo lugar',
    summary: 'El corte de ESPN publicado el 15 de septiembre deja al Cacique con 54 puntos y a los dos clubes universitarios con 42 cada uno.',
    topic: 'Campeonato',
    publishedLabel: '15 SEP 2026',
    publishedAt: '2026-09-15T10:59:00-03:00',
    clubIds: ['colo-colo', 'u-catolica', 'u-de-chile', 'everton', 'palestino', 'deportes-limache', 'nublense', 'deportes-concepcion', 'la-serena', 'coquimbo', 'audax', 'ohiggins', 'huachipato', 'cobresal', 'u-de-concepcion', 'la-calera'],
  },
  {
    id: 'la-serena-universidad-chile-fecha-23',
    source: 'ESPN Chile',
    sourceUrl: 'https://www.espn.cl/futbol/chile/nota/_/id/17233571/deportes-la-serena-vs-universidad-de-chile-fecha-23-liga-de-primera-2026-equipo-fecha-y-hora',
    headline: 'La U resolvió en el complemento su visita a La Serena',
    summary: 'Tres goles después del descanso sellaron el 3–0 azul en la fecha 23. El triunfo mantuvo a Universidad de Chile igualada con la UC en puntos.',
    topic: 'Primer equipo',
    publishedLabel: '13 SEP 2026',
    publishedAt: '2026-09-13T23:28:00-03:00',
    clubIds: ['u-de-chile', 'la-serena'],
  },
  {
    id: 'colo-colo-deportes-concepcion-1-1',
    source: 'ESPN Chile',
    sourceUrl: 'https://www.espn.cl/futbol/chile/nota/_/id/16162861/liga-de-primera-2026-campeonato-chileno-fixture-dia-hora-resultados-partidos',
    headline: 'Colo-Colo y Deportes Concepción repartieron puntos en Macul',
    summary: 'El 1–1 de la fecha 23 dejó al Cacique como líder y al León de Collao con un punto en su visita al Monumental.',
    topic: 'Campeonato',
    publishedLabel: '13 SEP 2026',
    publishedAt: '2026-09-13T23:28:00-03:00',
    clubIds: ['colo-colo', 'deportes-concepcion'],
  },
  {
    id: 'palestino-universidad-catolica-fecha-23',
    source: 'ESPN Chile',
    sourceUrl: 'https://www.espn.cl/futbol/liga/_/nombre/chi.1',
    headline: 'La UC se acerca al líder tras una victoria sobre Palestino',
    summary: 'Universidad Católica ganó en La Cisterna con un doblete de Fernando Zampedri y quedó como escolta de Colo-Colo.',
    topic: 'Primer equipo',
    publishedLabel: '13 SEP 2026',
    publishedAt: '2026-09-13T22:00:00-03:00',
    clubIds: ['u-catolica', 'palestino'],
  },
  {
    id: 'aranguiz-en-evaluacion-copa-chile',
    source: 'ESPN Chile',
    sourceUrl: 'https://www.espn.cl/futbol/liga/_/nombre/chi.1',
    headline: 'Aránguiz seguía en evaluación para el cruce de Copa Chile',
    summary: 'El estado del mediocampista era revisado en la previa del duelo de Universidad de Chile ante Everton por los octavos.',
    topic: 'Equipo',
    publishedLabel: '21 SEP 2026',
    publishedAt: '2026-09-21T12:00:00-03:00',
    clubIds: ['u-de-chile'],
  },
];

export const feedUpdatedAt = '2026-09-22T13:02:00-03:00';

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
