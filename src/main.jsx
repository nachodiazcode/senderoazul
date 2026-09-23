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
  ['/escuelas', 'Escuelas'],
  ['/abonos', 'Abonos'],
  ['/tienda', 'Tienda'],
  ['/prensa', 'Prensa'],
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
  { id: 'coquimbo', name: 'Coquimbo Unido', mark: 'CQ', primary: '#ad7d12', navy: '#191811', light: '#f2d678', accent: '#efbd39' },
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
  'la-serena': {
    image: '/assets/club-media/la-serena.webp',
    alt: 'Jugadores de Deportes La Serena celebran durante un partido ante Deportes Temuco en 2020',
    caption: 'EL GRANATE · 2020',
    credit: 'Foto: Carlos Figueroa',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Deportes_La_Serena_v_Deportes_Temuco_20200124_51.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    licenseLabel: 'CC BY-SA 4.0',
  },
  'u-de-concepcion': {
    image: '/assets/club-media/u-de-concepcion.webp',
    alt: 'Hinchada de Universidad de Concepción en la tribuna durante un partido de 2018',
    caption: 'EL CAMPANIL · SU GENTE',
    credit: 'Foto: Carlos Figueroa',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Palestino_-_Universidad_de_Concepci%C3%B3n,_2018-05-06_-_Hinchada_de_Universidad_de_Concepci%C3%B3n_-_01.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    licenseLabel: 'CC BY-SA 4.0',
  },
  'la-calera': {
    image: '/assets/club-media/la-calera.webp',
    alt: 'Formación de Unión La Calera antes de un partido frente a Universidad de Chile en 2018',
    caption: 'FORMACIÓN CEMENTERA · 2018',
    credit: 'Foto: Carlos Figueroa',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Uni%C3%B3n_La_Calera_-_Universidad_de_Chile,_2018-04-22_-_Formaci%C3%B3n_de_Uni%C3%B3n_La_Calera.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    licenseLabel: 'CC BY-SA 4.0',
  },
  ohiggins: {
    image: '/assets/club-media/ohiggins.webp',
    alt: 'Hinchada de O’Higgins en el Estadio El Teniente, Rancagua',
    caption: 'LA CELESTE · EL TENIENTE',
    credit: 'Foto: Carlos yo (Carlos Figueroa)',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Hinchada_O%27Higgins_O%27Higgins_v_%C3%91ublense_20230728_01.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    licenseLabel: 'CC BY-SA 4.0',
  },
  huachipato: {
    image: '/assets/club-media/huachipato.webp',
    alt: 'Futbolistas de Huachipato compartiendo con su hinchada antes de la final de Copa Chile 2025',
    caption: 'ACERO Y TRIBUNA · 2025',
    credit: 'Foto: Coqqe',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Futbolistas_con_la_barra_acerera.jpg',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    licenseLabel: 'CC0',
  },
  coquimbo: {
    image: '/assets/club-media/coquimbo-unido.webp',
    alt: 'Coquimbo Unido celebra con el trofeo de la Liga de Primera 2025',
    caption: 'CAMPEONES · 2025',
    credit: 'Foto: Cristian Avilés',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Coquimbo_Unido_campe%C3%B3n_2025.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    licenseLabel: 'CC BY-SA 4.0',
  },
};

// Identidad breve basada en referencias de los clubes y la ANFP; el resto del tono es copy editorial.
const clubProfiles = {
  'colo-colo': {
    identity: 'CACIQUE · MACUL',
    tagline: 'BLANCO Y NEGRO · CASA MONUMENTAL',
    description: 'La memoria de David Arellano y la energía del Monumental: el Cacique vive en blanco y negro, con Macul como su casa.',
    clubNote: 'Una identidad alba hecha de historia, tribuna y noches grandes en el Estadio Monumental David Arellano.',
    coverCaption: 'CASA ALBA',
    historyTitle: 'Una historia que late en blanco y negro.',
    historyLead: 'La memoria del Cacique vive en su gente, en Macul y en el Estadio Monumental David Arellano, inaugurado en 1989.',
    sourceLabel: 'Colo-Colo · Estadio Monumental',
    sourceUrl: 'https://www.colocolo.cl/historia/fundacion/la-fundacion-del-club-1920-1930/',
    facts: [
      ['1925', 'Nace Colo-Colo', 'David Arellano y un grupo de jugadores fundaron el club en Santiago.'],
      ['MACUL', 'La casa alba', 'El Estadio Monumental David Arellano fue inaugurado en 1989.'],
      ['1991', 'Una noche continental', 'Colo-Colo conquistó la Copa Libertadores, un hito para el fútbol chileno.'],
      ['BLANCO Y NEGRO', 'Colores que hablan', 'La camiseta y el emblema sostienen una identidad reconocible en todo el país.'],
    ],
  },
  'u-catolica': {
    identity: 'LA FRANJA · PRECORDILLERA',
    tagline: 'TRADICIÓN CRUZADA · NUEVA CASA',
    description: 'La franja cruza generaciones. En Claro Arena, la UC abre un nuevo capítulo junto a su gente en San Carlos de Apoquindo.',
    clubNote: 'Blanco y azul, espíritu cruzado y una nueva etapa en Claro Arena.',
    coverCaption: 'LA FRANJA',
    historyTitle: 'La franja, una historia que cruza generaciones.',
    historyLead: 'Universidad Católica nació en 1937 y construyó una identidad cruzada que hoy abre una nueva etapa en Claro Arena.',
    sourceLabel: 'Cruzados · orígenes del club',
    sourceUrl: 'https://cruzados.cl/origenes/',
    facts: [
      ['1937', 'Fundación', 'Universidad Católica fue fundada el 21 de abril.'],
      ['LA FRANJA', 'Seña cruzada', 'El diseño blanco y azul distingue históricamente su camiseta.'],
      ['SAN CARLOS', 'Un hogar en la precordillera', 'El club construyó una relación especial con su estadio en Las Condes.'],
      ['CLARO ARENA', 'Nueva etapa', 'El recinto renovado abre otro capítulo para la comunidad cruzada.'],
    ],
  },
  'la-serena': {
    identity: 'GRANATE · PAPAYEROS',
    tagline: 'ORGULLO SERENENSE · DESDE 1955',
    description: 'El Granate lleva el pulso de su ciudad desde 1955. La Portada es el punto de encuentro de una identidad que mira al norte.',
    clubNote: 'Historia serenense, alma papayera y granate como bandera en La Portada.',
    coverCaption: 'EL GRANATE',
    historyTitle: 'La ciudad se reconoce en granate.',
    historyLead: 'Desde 1955, Deportes La Serena representa a la capital regional. La Portada reúne a los papayeros en el corazón de la ciudad.',
    sourceLabel: 'Deportes La Serena · 65 años de historia',
    sourceUrl: 'https://www.cdlaserena.cl/65-anos-cdls/',
    facts: [
      ['1955', 'Fundación', 'El club fue fundado el 9 de diciembre y comenzó a representar a La Serena.'],
      ['GRANATE', 'Identidad papayera', 'Los colores y el apodo conectan al equipo con la cultura local.'],
      ['LA PORTADA', 'La casa serenense', 'El estadio municipal es el punto de encuentro de su hinchada.'],
      ['NORTE', 'Una voz regional', 'Deportes La Serena representa a la Región de Coquimbo en el fútbol profesional.'],
    ],
  },
  huachipato: {
    identity: 'ACERO · TALCAHUANO',
    tagline: 'FORJADO EN EL PUERTO',
    description: 'Una historia ligada al acero y a Talcahuano. Los Acereros llevan esa raíz industrial a cada jornada en el CAP Acero.',
    clubNote: 'Orgullo acerero nacido junto a la siderúrgica y hecho parte de Talcahuano.',
    coverCaption: 'LOS ACEREROS',
    historyTitle: 'El acero también se hace camiseta.',
    historyLead: 'Huachipato está ligado a la vida siderúrgica de Talcahuano. Su identidad acerera lleva el puerto industrial a la cancha.',
    sourceLabel: 'Huachipato FC · nuestra historia',
    sourceUrl: 'https://cdhuachipato.cl/nosotros/historia/',
    facts: [
      ['1947', 'Fundación', 'La fecha reconocida por el club es el 7 de junio de 1947.'],
      ['TALCAHUANO', 'Raíz industrial', 'La historia del club está vinculada al desarrollo de la siderúrgica Huachipato.'],
      ['ACERO', 'Un apodo con origen', 'Los Acereros toman su nombre de la industria que marcó a la ciudad.'],
      ['CAP ACERO', 'La casa del puerto', 'El estadio en Talcahuano mantiene al club cerca de su origen.'],
      ['AZUL Y NEGRO', 'Colores acereros', 'Una identidad de puerto, trabajo y fútbol acompaña a Huachipato.'],
    ],
  },
  'u-de-concepcion': {
    identity: 'CAMPANIL · CONCEPCIÓN',
    tagline: 'AZUL Y ORO PENQUISTA',
    description: 'Azul y amarillo, raíz universitaria y carácter penquista: el Campanil escribe su propia historia desde Concepción.',
    clubNote: 'El azul y amarillo universitario acompaña al Campanil y a toda la ciudad de Concepción.',
    coverCaption: 'EL CAMPANIL',
    historyTitle: 'Azul y oro, voz universitaria de Concepción.',
    historyLead: 'El Campanil reúne el vínculo universitario con la ciudad penquista; sus colores azul y amarillo también aparecen en los símbolos de la UdeC.',
    sourceLabel: 'Universidad de Concepción · símbolos universitarios',
    sourceUrl: 'https://www.udec.cl/sobre-la-udec/simbolos-universitarios/',
    facts: [
      ['CONCEPCIÓN', 'Raíz universitaria', 'El club representa a la Universidad de Concepción y a la ciudad que lo vio crecer.'],
      ['AZUL Y AMARILLO', 'Colores del Campanil', 'La bandera institucional de la universidad combina ambos colores.'],
      ['EL CAMPANIL', 'Un símbolo penquista', 'El apodo remite a uno de los hitos más reconocibles de la Universidad de Concepción.'],
      ['ESTER ROA', 'Casa en Collao', 'El estadio de Concepción es escenario de sus partidos como local.'],
    ],
  },
  'la-calera': {
    identity: 'CEMENTEROS · LA CALERA',
    tagline: 'ROJO NACIDO DE LA UNIÓN',
    description: 'Una unión de la ciudad dio forma al club. El rojo calerano y el orgullo cementero siguen reuniendo a su gente.',
    clubNote: 'Rojo en la camiseta, espíritu de unión y raíces cementeras en La Calera.',
    coverCaption: 'ORGULLO CALERANO',
    historyTitle: 'Una unión que se hizo club.',
    historyLead: 'Unión La Calera nació de la unión de clubes de la ciudad. Su historia cementera quedó ligada al rojo y al Nicolás Chahuán Nazar.',
    sourceLabel: 'Unión La Calera · historia oficial',
    sourceUrl: 'https://ulc.cl/historia/',
    facts: [
      ['1954', 'Unión calerana', 'Unión La Calera nació el 26 de enero a partir de la fusión de cinco clubes locales.'],
      ['ROJO', 'Identidad cementera', 'El color de su camiseta y el apodo conectan al club con la historia local.'],
      ['NICOLÁS CHAHUÁN', 'Casa en La Calera', 'El estadio lleva el nombre de una figura vinculada a la comunidad calerana.'],
      ['LA CALERA', 'Un equipo de ciudad', 'El club mantiene una fuerte relación con su ciudad y su gente.'],
    ],
  },
  'u-de-chile': {
    identity: 'EL BULLA · SANTIAGO',
    tagline: 'AZUL Y ROJO · UNA HINCHADA QUE NO CAMINA SOLA',
    description: 'La U se reconoce en su azul, su gente y una historia universitaria que se transformó en pasión popular. Este Sendero sigue al club, no al ruido.',
    clubNote: 'Azul y rojo, raíz universitaria y una hinchada que acompaña en cualquier cancha.',
    coverCaption: 'EL BULLA',
    historyTitle: 'Una historia que se canta en azul.',
    historyLead: 'De la vida universitaria a una comunidad que cruza generaciones: la historia de la U se cuenta tanto en la cancha como en la tribuna.',
    sourceLabel: 'Universidad de Chile · historia institucional',
    sourceUrl: 'https://www.udechile.cl/noticias/99-anos-de-historia-azul-este-domingo-universidad-de-chile-celebra-un-nuevo-aniversario',
    facts: [
      ['1927', 'El origen', 'El Club Universitario de Deportes nace como raíz institucional de Universidad de Chile.'],
      ['1940', 'Primera estrella', 'La U consigue su primer campeonato profesional.'],
      ['1960s', 'Ballet Azul', 'Una generación convierte su fútbol en una referencia para el país.'],
      ['1994', 'Regreso a la cima', 'Una nueva generación vuelve a coronarse tras 25 años.'],
      ['2011', 'Noche continental', 'La U gana invicta la Copa Sudamericana y levanta su primer título internacional.'],
      ['2027', 'Cien años', 'El club se acerca a su centenario, con nuevas historias todavía por escribir.'],
    ],
  },
  cobresal: {
    identity: 'MINEROS · EL SALVADOR',
    tagline: 'COBRE, DESIERTO Y ORGULLO ALBIRANJA',
    description: 'Desde El Salvador, Cobresal lleva el pulso minero del desierto a cada partido. El Cobre no es sólo una cancha: es el punto de encuentro de una comunidad.',
    clubNote: 'Raíz minera, vida de altura y orgullo de El Salvador: Cobresal tiene el desierto como casa.',
    coverCaption: 'EL SALVADOR · ATACAMA',
    historyTitle: 'Un club nacido a pulso en el desierto.',
    historyLead: 'Cobresal nació en El Salvador en 1979. Su historia y su estadio crecieron al ritmo de la comunidad minera que lo acompaña.',
    sourceLabel: 'Club Deportes Cobresal · reseña histórica',
    sourceUrl: 'https://cdcobresal.cl/wp-content/uploads/2018/09/Memoria-2011.pdf',
    facts: [
      ['1979', 'Fundación', 'El club fue fundado el 5 de mayo en El Salvador, Región de Atacama.'],
      ['1979', 'El Cobre', 'Ese mismo año comenzó la construcción del estadio que hoy es su casa.'],
      ['1980', 'Fútbol profesional', 'Cobresal inició su camino profesional en abril de 1980.'],
      ['HOY', 'Orgullo minero', 'El equipo representa a una ciudad y una historia estrechamente ligadas a la minería.'],
    ],
  },
  everton: {
    identity: 'RULETEROS · VIÑA DEL MAR',
    tagline: 'ORO Y AZUL · IDENTIDAD VIÑAMARINA',
    description: 'Oro y azul, Viña del Mar y el horizonte de Sausalito: Everton mezcla tradición y ciudad jardín en una identidad que se reconoce desde lejos.',
    clubNote: 'El oro y azul ruletero tiene a Viña del Mar y Sausalito como parte de su paisaje futbolero.',
    coverCaption: 'SAUSALITO · VIÑA',
    historyTitle: 'El oro y azul de la ciudad jardín.',
    historyLead: 'Fundado en 1909, Everton representa a Viña del Mar. Sus colores oro y azul y el Estadio Sausalito forman parte del paisaje ruletero.',
    sourceLabel: 'ANFP · ficha de Everton',
    sourceUrl: 'https://www.anfp.cl/clubes/everton/',
    facts: [
      ['1909', 'Fundación', 'Everton fue fundado el 24 de junio de 1909.'],
      ['ORO', 'Color de identidad', 'El oro y azul son las señas cromáticas del club ruletero.'],
      ['SAUSALITO', 'La casa viñamarina', 'El Estadio Sausalito es el recinto asociado a sus partidos como local.'],
      ['VIÑA DEL MAR', 'La ciudad en la camiseta', 'El club lleva el nombre de la ciudad jardín en el fútbol nacional.'],
    ],
  },
  palestino: {
    identity: 'TRICOLORES · LA CISTERNA',
    tagline: 'PALESTINA EN EL CORAZÓN · CHILE EN LA CANCHA',
    description: 'Palestino convierte el fútbol en un puente entre raíces y generaciones. Su historia, fundada por la comunidad palestina en Chile, se expresa en tres colores y una identidad singular.',
    clubNote: 'Un club social, cultural y deportivo que desde 1920 conecta a una comunidad con el fútbol chileno.',
    coverCaption: 'ORGULLO TRICOLOR',
    historyTitle: 'Una camiseta que lleva una historia.',
    historyLead: 'Desde 1920, Palestino enlaza deporte, memoria y comunidad; su identidad trasciende los noventa minutos.',
    sourceLabel: 'Palestino · historia institucional',
    sourceUrl: 'https://palestino.cl/club/',
    facts: [
      ['1920', 'Nace una comunidad', 'El club fue fundado por la comunidad palestina en Chile.'],
      ['1955', 'Primera estrella', 'Palestino obtuvo su primer campeonato de Primera División.'],
      ['1978', 'Una segunda corona', 'El equipo volvió a ser campeón del torneo nacional.'],
      ['LA CISTERNA', 'Un punto de encuentro', 'La sede del club está en La Cisterna, Santiago.'],
    ],
  },
  'deportes-limache': {
    identity: 'TOMATEROS · LIMACHE',
    tagline: 'ROJO LIMACHINO · UN ASCENSO A PULSO',
    description: 'Deportes Limache llevó a su ciudad hasta la máxima categoría siguiendo el camino peldaño a peldaño. El orgullo tomatero se construye con comunidad, trabajo y ambición.',
    clubNote: 'Fundado en 2012, el club avanzó por las categorías hasta alcanzar la Liga de Primera.',
    coverCaption: 'EL SUEÑO TOMATERO',
    historyTitle: 'De Limache a Primera, paso a paso.',
    historyLead: 'En poco más de una década, Deportes Limache recorrió varias categorías antes de llegar al fútbol de Primera.',
    sourceLabel: 'Deportes Limache · historia oficial',
    sourceUrl: 'https://www.deporteslimache.cl/historia-1.html',
    facts: [
      ['2012', 'Fundación', 'Club de Deportes Limache fue fundado el 8 de noviembre.'],
      ['2013', 'Primer ascenso', 'En su primera temporada competitiva, el equipo ganó la Tercera B y subió a Tercera A.'],
      ['2023', 'Campeón de Segunda', 'La institución consiguió el título de Segunda División Profesional.'],
      ['2024', 'Llegada a Primera', 'Limache ganó la liguilla de ascenso de Primera B y llegó a la categoría máxima.'],
    ],
  },
  nublense: {
    identity: 'DIABLOS ROJOS · CHILLÁN',
    tagline: 'ROJO Y NEGRO · ÑUBLE EN LA TRIBUNA',
    description: 'En Chillán, el rojo tiene casa y nombre propio. Ñublense reúne a Ñuble alrededor de una camiseta intensa y un estadio que honra a uno de sus entrenadores más recordados.',
    clubNote: 'El Estadio Nelson Oyarzún guarda el vínculo de Ñublense con Chillán y con una figura imborrable de su historia.',
    coverCaption: 'EL ROJO DE ÑUBLE',
    historyTitle: 'Chillán late en rojo.',
    historyLead: 'La historia de Ñublense está anclada en Chillán y en el recinto que lleva el nombre de Nelson Oyarzún.',
    sourceLabel: 'Ñublense · historia del estadio Nelson Oyarzún',
    sourceUrl: 'https://www.losdiablosrojos.cl/estadio-nelson-oyarzun/',
    facts: [
      ['CHILLÁN', 'Casa roja', 'Ñublense representa a Chillán y a la Región de Ñuble.'],
      ['1935', 'Un estadio con historia', 'El recinto de Chillán fue inaugurado originalmente el 4 de noviembre de 1935.'],
      ['1978', 'Nelson Oyarzún', 'El estadio tomó el nombre del entrenador ese año, en homenaje a su vínculo con el club.'],
      ['ROJO', 'Una identidad reconocible', 'El club es conocido en la ciudad como el Rojo y también como los Diablos Rojos.'],
    ],
  },
  'deportes-concepcion': {
    identity: 'LEÓN DE COLLAO · CONCEPCIÓN',
    tagline: 'LILA · ORGULLO PENQUISTA',
    description: 'El León de Collao vuelve a rugir con el lila como bandera. Deportes Concepción es una historia de ciudad, fusión y una hinchada que sostuvo vivo el vínculo con su equipo.',
    clubNote: 'Fundado en 1966 por la unión de varios clubes de la ciudad, Deportes Concepción es parte del paisaje futbolero penquista.',
    coverCaption: 'EL LEÓN DE COLLAO',
    historyTitle: 'El lila que representa a Concepción.',
    historyLead: 'El club nació de una unión local y su camiseta lila quedó ligada a la ciudad y al Estadio Ester Roa Rebolledo.',
    sourceLabel: 'Campeonato Chileno · historia de Deportes Concepción',
    sourceUrl: 'https://www.campeonatochileno.cl/aniversario/concepcion-se-tine-de-lila-59-anos-del-leon-de-collao/',
    facts: [
      ['1966', 'Fusión penquista', 'La institución se fundó el 25 de enero, a partir de la fusión de clubes de Concepción.'],
      ['LILA', 'Una camiseta propia', 'El color lila se convirtió en la seña que identifica al León de Collao.'],
      ['COLLAO', 'La casa del León', 'El Estadio Ester Roa Rebolledo es parte de su historia deportiva.'],
      ['2024', 'Regreso a la ruta', 'El equipo ganó la Segunda División y volvió a la Liga de Ascenso.'],
    ],
  },
  audax: {
    identity: 'TANOS · LA FLORIDA',
    tagline: 'VERDE, BLANCO Y ROJO · HERENCIA ITÁLICA',
    description: 'Audax Italiano lleva una raíz itálica al fútbol de La Florida. Su escudo enlaza los colores de Italia con una historia que comenzó como club deportivo y encontró casa en Santiago.',
    clubNote: 'El emblema audino reúne la bandera italiana y una rueda de bicicleta, recuerdo de los orígenes del club.',
    coverCaption: 'FORZA AUDAX',
    historyTitle: 'Herencia itálica, corazón floridano.',
    historyLead: 'Audax Italiano conserva en su escudo símbolos de Italia y del origen deportivo de la institución.',
    sourceLabel: 'Audax Italiano · historia de sus escudos',
    sourceUrl: 'https://audaxitaliano.cl/escudos',
    facts: [
      ['1910', 'Fundación', 'Audax Italiano fue fundado el 30 de noviembre de 1910.'],
      ['ITALIA', 'Los colores del escudo', 'Verde, blanco y rojo remiten a la bandera italiana.'],
      ['BICICLETA', 'Una raíz deportiva', 'La rueda en el emblema recuerda los orígenes ciclistas de la institución.'],
      ['LA FLORIDA', 'Casa audina', 'Desde 1999, el nombre de La Florida acompaña la camiseta del club.'],
    ],
  },
  ohiggins: {
    identity: 'CELESTES · RANCAGUA',
    tagline: 'CELESTE DE PROVINCIA · ORGULLO REGIONAL',
    description: 'O’Higgins representa a Rancagua y a su región con el celeste por delante. El Teniente, la memoria de sus hinchas y la estrella de 2013 forman parte de su paisaje futbolero.',
    clubNote: 'Rancagua, El Teniente y la histórica consagración de 2013 marcan el horizonte celeste.',
    coverCaption: 'EL CAPO DE PROVINCIA',
    historyTitle: 'La provincia también sueña en celeste.',
    historyLead: 'Fundado en 1955 tras la unión de O’Higgins Braden y América, el club alcanzó su primer título nacional en 2013.',
    sourceLabel: 'O’Higgins FC · historia oficial',
    sourceUrl: 'https://www.ohigginsfc.cl/pagina.php?id=18',
    facts: [
      ['1955', 'Nace O’Higgins', 'El club se fundó el 7 de abril tras la fusión de O’Higgins Braden y América de Rancagua.'],
      ['RANCAGUA', 'Orgullo de la región', 'O’Higgins es parte de la identidad deportiva de Rancagua y la Región de O’Higgins.'],
      ['EL TENIENTE', 'Casa celeste', 'El estadio rancagüino es uno de los escenarios centrales de la historia del club.'],
      ['2013', 'Primera estrella', 'El equipo obtuvo su primer título nacional el 10 de diciembre de 2013.'],
      ['MONASTERIO', 'Trabajo formativo', 'El club abrió su Centro Deportivo Monasterio Celeste en esta etapa de su historia.'],
    ],
  },
  coquimbo: {
    identity: 'PIRATAS · PUERTO AURINEGRO',
    tagline: 'NEGRO, AMARILLO Y MAR',
    description: 'El aurinegro del puerto iza la bandera pirata en el Francisco Sánchez Rumoroso. Coquimbo juega con el carácter de su gente.',
    clubNote: 'Amarillo y negro, espíritu pirata y puerto: Coquimbo lleva su identidad a cada rincón del Sánchez Rumoroso.',
    coverCaption: 'TIERRA PIRATA',
    historyTitle: 'El puerto iza la bandera pirata.',
    historyLead: 'Coquimbo Unido expresa el carácter de su ciudad entre amarillo y negro. El Francisco Sánchez Rumoroso es su gran punto de encuentro.',
    sourceLabel: 'Coquimbo Unido · sitio oficial',
    sourceUrl: 'https://www.coquimbounido.cl/club',
    facts: [
      ['1958', 'Fundación', 'La fecha oficial de fundación es el 11 de julio de 1958.'],
      ['PIRATAS', 'Un apodo con identidad', 'La imagen pirata es parte del lenguaje y del imaginario de su hinchada.'],
      ['AURINEGRO', 'Amarillo y negro', 'Los colores tradicionales distinguen a Coquimbo Unido.'],
      ['1991', 'Primera Copa Libertadores', 'Coquimbo Unido alcanzó el subcampeonato nacional y su primera participación en la Libertadores.'],
      ['FRANCISCO SÁNCHEZ RUMOROSO', 'Casa pirata', 'El estadio de Coquimbo es escenario de sus grandes jornadas como local.'],
    ],
  },
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
  return <><div className="topline"><div className="shell"><span>EL CLUB DE TODOS · MÁS QUE UNA PASIÓN</span><span>SANTIAGO, CHILE <b>•</b> EDICIÓN {edition}</span></div></div><header className="site-header"><div className="shell header-row"><Brand /><button className="menu-toggle" aria-label="Abrir navegación" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '×' : '☰'}</button><nav className={open ? 'open' : ''} aria-label="Principal">{navItems.map(([path, label]) => <RouteLink key={`${path}-${label}`} to={path} className={`${route === path ? 'active ' : ''}${path === '/soy-dt' ? 'nav-dt' : ''}`} onClick={() => setOpen(false)}>{label}</RouteLink>)}<button className="mobile-team-switch" onClick={() => { setOpen(false); onChooseTeam(); }}>Mi equipo: {favoriteTeam?.name || 'Elegir'}</button></nav><div className="header-actions"><button className="team-switch" onClick={onChooseTeam} aria-label={`Cambiar mi equipo favorito: ${favoriteTeam?.name || 'elegir equipo'}`}><TeamCrest team={favoriteTeam || { id: 'u-de-chile' }} className="header-crest" /><small>{favoriteTeam?.name || 'Mi equipo'}</small></button><RouteLink to="/actualidad" className="header-search" aria-label="Buscar noticias"><span>⌕</span><small>BUSCAR</small></RouteLink></div></div></header><MatchdayStrip team={favoriteTeam} /></>;
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

function MediaCredit({ media }) {
  if (!media?.credit) return null;
  return <small className="media-attribution"><a href={media.creditUrl} target="_blank" rel="noreferrer">{media.credit}</a><span> · </span><a href={media.licenseUrl} target="_blank" rel="noreferrer">{media.licenseLabel || 'Licencia'}</a><span> · imagen adaptada</span></small>;
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
  const profile = clubProfiles[team.id];
  return <section className="club-hero" aria-label={`Portada de ${team.name}`}>
    <div className="shell club-hero-grid">
      <div className={`club-cover ${media ? 'has-photo' : 'crest-cover'}`}>
        {media ? <img className="club-cover-image" src={media.image} alt={media.alt} fetchPriority="high" /> : <div className="club-cover-fallback" aria-hidden="true"><span>EL SENDERO</span><TeamCrest team={team} className="club-cover-fallback-crest" /><b>{team.mark}</b></div>}
        <div className="club-cover-shade" aria-hidden="true" />
        <div className="club-cover-top"><span>EL SENDERO <i>·</i> {profile?.identity || 'CLUB'}</span><span>TEMPORADA 2026</span></div>
        <TeamCrest team={team} className="club-cover-crest" />
        {media?.credit && <div className="club-cover-credit"><span>{media.credit}</span><span>·</span><a href={media.creditUrl} target="_blank" rel="noreferrer">Fuente</a><span>·</span><a href={media.licenseUrl} target="_blank" rel="noreferrer">{media.licenseLabel || 'Licencia'}</a><span>· adaptación WebP</span></div>}
        <div className="club-cover-caption"><span>{media?.caption || profile?.coverCaption || 'TU CLUB · TU CASA'}</span><b>{snapshot?.city || 'CHILE'}</b></div>
      </div>
      <div className="club-hero-copy">
        <div className="club-hero-overline"><span>AHORA EN TU SENDERO</span><span><i /> {team.name.toUpperCase()}</span></div>
        <div className="club-hero-heading"><span className="eyebrow">{profile?.tagline || 'TU CARÁTULA DE TEMPORADA'}</span><h1>{team.name}</h1><p>{profile?.description || 'La portada cambia contigo: sus colores, su gente y las historias de tu club, reunidas en un solo lugar.'}</p></div>
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
  const profile = clubProfiles[team.id];
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
        <div><TeamCrest team={team} className="club-card-mark" /><p>{profile?.clubNote || <>Los colores, el radar y el archivo siguen a <b>{team.name}</b>.</>}</p></div>
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
      {clubArticles.length ? <div className="home-news-grid">{clubArticles.slice(0, 3).map((article) => <NewsCard key={article.id} article={article} saved={saved.includes(article.id)} onSave={onSave} />)}</div> : <div className="club-history-teaser"><img src={clubMedia[activeTeam.id]?.image} alt={clubMedia[activeTeam.id]?.alt || `Imagen de ${activeTeam.name}`} loading="lazy" /><div><span className="eyebrow">IDENTIDAD E HISTORIA · {activeTeam.mark}</span><h3>{clubProfiles[activeTeam.id]?.historyTitle}</h3><p>{clubProfiles[activeTeam.id]?.historyLead}</p><RouteLink to="/memoria">Conocer la historia del club →</RouteLink></div><TeamCrest team={activeTeam} className="empty-crest" /></div>}
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
  const normalizeClub = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’']/g, '').toLowerCase();
  const teamKey = normalizeClub(activeTeam.name);
  const teamCupSchedule = copaChileSchedule.map((day) => ({ ...day, matches: day.matches.filter(([home, away]) => [home, away].some((club) => normalizeClub(club) === teamKey)) })).filter((day) => day.matches.length);
  return <div className="page shell data-page"><div className="page-heading data-heading"><span className="eyebrow">LIGA DE PRIMERA · CHILE</span><h1>La tabla<br />al día.</h1><p>Posiciones, diferencia de gol y próximos cruces de Copa Chile. Seleccionamos a {activeTeam.name} para ubicarlo de inmediato.</p></div><section className="standings-panel"><div className="standings-heading"><div><span className="eyebrow">CAMPEONATO NACIONAL 2026</span><h2>Tabla de posiciones</h2></div><span className="standings-cut">ESPN · CONSULTA 23 SEP 2026</span></div><div className="standings-scroll"><table className="standings-table"><thead><tr><th scope="col">#</th><th scope="col">Club</th><th scope="col">PJ</th><th scope="col">G</th><th scope="col">E</th><th scope="col">P</th><th scope="col">DG</th><th scope="col">Pts</th></tr></thead><tbody>{leagueStandings2026.map((club) => { const clubTeam = teamChoices.find((team) => team.id === club.id); return <tr key={club.id} className={club.id === activeTeam.id ? 'favorite-row' : ''} aria-current={club.id === activeTeam.id ? 'true' : undefined}><td>{club.position}</td><td><span className="standing-club">{clubTeam && <TeamCrest team={clubTeam} className="standing-crest" />}<b>{standingsClubName(club.id)}</b>{club.id === activeTeam.id && <small>MI EQUIPO</small>}</span></td><td>{club.played}</td><td>{club.wins}</td><td>{club.draws}</td><td>{club.losses}</td><td className={club.goalDifference > 0 ? 'positive-difference' : club.goalDifference < 0 ? 'negative-difference' : ''}>{club.goalDifference > 0 ? '+' : ''}{club.goalDifference}</td><td><b>{club.points}</b></td></tr>; })}</tbody></table></div><div className="standings-footer"><span>{activeTeam.name}: <b>{activeStanding?.position}°</b> · {activeStanding?.points} puntos · {activeStanding?.played} PJ</span><a href="https://www.espn.cl/futbol/liga/_/nombre/chi.1" target="_blank" rel="noreferrer">Ver posiciones actualizadas en ESPN ↗</a></div></section><section className="cup-schedule"><div className="source-news-heading"><div><span className="eyebrow">COPA CHILE · OCTAVOS DE FINAL</span><h2>Agenda de {activeTeam.name}.</h2></div><a href="https://www.espn.cl/futbol/chile/nota/_/id/17290575/la-programacion-de-los-partidos-de-ida-de-octavos-de-final-de-la-copa-chile-2026" target="_blank" rel="noreferrer">Programación ESPN ↗</a></div>{teamCupSchedule.length ? <div className="schedule-days">{teamCupSchedule.map((day) => <article key={day.date} className="schedule-day"><h3>{day.date}<span>IDA · COPA CHILE</span></h3>{day.matches.map(([home, away, time]) => <div className="schedule-match" key={`${home}-${away}`}><span>{home}</span><b>{time}</b><span>{away}</span></div>)}</article>)}</div> : <div className="empty-state"><h2>No hay un cruce de {activeTeam.name} en esta programación.</h2><p>Mostramos el calendario sólo cuando su club aparece en la fuente enlazada.</p></div>}<p className="data-note">Posiciones: consulta de ESPN Chile del 23/09/2026 (PJ, G-E-P, diferencia y puntos). Horarios de Copa Chile: programación ESPN del 22/09/2026; confirma posibles cambios en la fuente.</p></section></div>;
}

function ManagerPage({ favoriteTeam }) {
  const team = favoriteTeam || teamChoices[0];
  if (team.id === 'u-de-chile') return <UniversityManagerPage />;
  return <ClubManagerPage team={team} />;
}

function ClubManagerPage({ team }) {
  const [players, setPlayers, lineupError] = useStored(`sendero-lineup-${team.id}-v1`, Array(11).fill(''));
  const roles = ['ARQ', 'DEF', 'DEF', 'DEF', 'VOL', 'VOL', 'VOL', 'VOL', 'DEL', 'DEL', 'DEL'];
  const media = clubMedia[team.id];
  const safePlayers = Array.isArray(players) && players.length === 11 ? players : Array(11).fill('');
  return <div className="page manager-page club-manager-page"><section className="shell manager-heading"><div><span className="eyebrow">TU PIZARRA · {team.mark}</span><h1>Arma tu once.<br /><em>Con tu club.</em></h1><p>Una pizarra abierta para {team.name}. Completa los nombres que conoces; no mostramos planteles ni valoraciones inventadas.</p><div className="manager-auth"><TeamCrest team={team} className="header-crest" /><span><b>Tu formación se guarda aquí</b><small>Sólo en este dispositivo · 3–4–3</small></span></div></div><div className="manager-heading-art">{media && <img src={media.image} alt={media.alt} />}<span>{team.name.toUpperCase()}<br />TU ONCE, TU LECTURA</span></div></section><section className="shell custom-lineup-section"><div className="custom-lineup-intro"><span className="eyebrow">FORMACIÓN EDITABLE · 3–4–3</span><h2>¿A quién pondrías en cancha?</h2><p>Escribe los nombres según tu propio seguimiento. La pizarra no representa una alineación oficial.</p></div><div className="custom-lineup"><div className="custom-lineup-pitch">{safePlayers.map((player, index) => <label key={index} className={`custom-slot custom-slot-${index}`}><span>{roles[index]} · {String(index + 1).padStart(2, '0')}</span><input value={player} maxLength="38" placeholder={roles[index] === 'ARQ' ? 'Arquero' : 'Nombre del jugador'} aria-label={`${roles[index]} posición ${index + 1}`} onChange={(event) => { const next = [...safePlayers]; next[index] = event.target.value; setPlayers(next); }} /></label>)}</div><aside className="custom-lineup-side"><TeamCrest team={team} className="custom-lineup-crest" /><span className="eyebrow">IDEA DE PARTIDO</span><h3>Elige desde lo que has visto.</h3><p>Completa esta propuesta personal y vuelve a editarla cuando quieras.</p><button className="text-button" onClick={() => setPlayers(Array(11).fill(''))}>Limpiar pizarra ↻</button>{lineupError && <small role="status">No se pudo guardar la pizarra en este dispositivo.</small>}</aside></div></section><section className="shell manager-footnote"><span>ESPACIO PERSONAL</span><p>El Sendero no publica estos nombres ni los presenta como convocatoria oficial. La formación se guarda localmente.</p></section></div>;
}

function UniversityManagerPage() {
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

function MemoryPage({ saved, onSave, favoriteTeam }) {
  const team = favoriteTeam || teamChoices[0];
  const profile = clubProfiles[team.id];
  const media = clubMedia[team.id];
  const memoryArticles = articles.filter((article) => ['Historia', 'Cultura azul'].includes(article.category) && article.clubIds?.includes(team.id));
  return <div className="page"><section className="memory-hero shell"><div className="memory-art-wrap"><div className="memory-image"><img src={media?.image} alt={media?.alt || `Imagen de ${team.name}`} /><span>{profile.identity.split(' · ')[0]}<br />EN LA PIEL</span></div><MediaCredit media={media} /></div><div className="memory-intro"><span className="eyebrow">HISTORIA · {team.name.toUpperCase()}</span><h1>{profile.historyTitle}</h1><p>{profile.historyLead}</p><a className="inline-link" href={profile.sourceUrl} target="_blank" rel="noreferrer">{profile.sourceLabel} ↗</a></div></section><section className="shell timeline-section"><SectionTitle eyebrow={`HISTORIA DE ${team.mark}`} title="Hitos que le dieron forma." /><div className="history-timeline">{profile.facts.map(([year, title, description]) => <article key={`${year}-${title}`}><b>{year}</b><span>{title}</span><p>{description}</p></article>)}</div><p className="data-note">Reseña breve preparada por El Sendero. Consulta la <a href={profile.sourceUrl} target="_blank" rel="noreferrer">fuente institucional o histórica: {profile.sourceLabel} ↗</a>.</p></section><section className="shell memory-reading"><SectionTitle eyebrow={`ARCHIVO DE ${team.mark}`} title={`Leer más de ${team.name}.`} />{memoryArticles.length ? <div className="news-grid memory-grid">{memoryArticles.map((article) => <NewsCard key={article.id} article={article} saved={saved.includes(article.id)} onSave={onSave} />)}</div> : <div className="club-history-teaser"><TeamCrest team={team} className="empty-crest" /><div><span className="eyebrow">DEL ARCHIVO DEL CLUB</span><h3>{profile.historyTitle}</h3><p>{profile.historyLead}</p><a href={profile.sourceUrl} target="_blank" rel="noreferrer">Seguir leyendo en {profile.sourceLabel} ↗</a></div></div>}</section>{team.id === 'u-de-chile' && <div className="shell"><BookBanner /></div>}</div>;
}

function CommunityPage({ favoriteTeam }) {
  const team = favoriteTeam || teamChoices[0];
  const profile = clubProfiles[team.id];
  const [favorite, setFavorite, favoriteError] = useStored(`sendero-tribuna-${team.id}-v1`, '');
  const [memories, setMemories, memoriesError] = useStored(`sendero-memories-${team.id}-v1`, []);
  const [memory, setMemory] = useState('');
  const [name, setName] = useState('');
  const waysToSupport = [
    ['La camiseta', `Los colores de ${team.name}`],
    ['La gente', 'La hinchada y sus generaciones'],
    ['La ciudad', `El vínculo con ${clubSnapshots[team.id]?.city || 'su ciudad'}`],
  ];
  function addMemory(event) {
    event.preventDefault();
    const clean = memory.trim();
    if (clean.length < 12) return;
    setMemories([{ id: Date.now(), name: name.trim() || `Hincha de ${team.mark}`, text: clean }, ...memories].slice(0, 8));
    setMemory(''); setName('');
  }
  return <div className="community-page"><section className="shell community-heading"><span className="eyebrow">LA TRIBUNA · {team.mark}</span><h1>El partido termina.<br /><em>La conversación sigue.</em></h1><p>Un espacio de {team.name} para elegir lo que te representa y guardar recuerdos en tu dispositivo.</p></section><section className="shell participation-grid"><article className="participation-card vote-card"><span className="tag">IDENTIDAD {team.mark} · ELECCIÓN PERSONAL</span><h2>¿Qué te conecta más con el club?</h2><p>No es una encuesta pública: tu elección queda guardada sólo en este navegador.</p><div className="player-options">{waysToSupport.map(([label, description], index) => <button key={label} className={favorite === label ? 'selected' : ''} aria-pressed={favorite === label} onClick={() => setFavorite(label)}><span>0{index + 1}</span><span><b>{label}</b><small>{description}</small></span><i>{favorite === label ? '✓' : '+'}</i></button>)}</div><p className="feedback" aria-live="polite">{favorite ? `Elegiste: ${favorite}. Puedes cambiarlo cuando quieras.` : `¿Qué significa ser parte de ${team.name} para ti?`}</p>{favoriteError && <small>No se pudo guardar la elección en este navegador.</small>}</article><article className="participation-card quiz-card"><span className="tag">CUADERNO DEL HINCHA</span><h2>{profile.historyTitle}</h2><p className="question">{profile.historyLead}</p><a className="button" href={profile.sourceUrl} target="_blank" rel="noreferrer">Conocer su historia ↗</a><p className="quiz-feedback">{profile.facts[0][0]} · {profile.facts[0][1]}</p><small>Ficha resumida por El Sendero · {profile.sourceLabel}</small></article></section><section className="shell memory-wall"><div className="wall-intro"><span className="eyebrow">MI HISTORIA · {team.mark}</span><h2>¿Cuál es tu recuerdo de {team.name}?</h2><p>Guárdalo en este dispositivo. No se publica ni se envía a un servidor.</p><form onSubmit={addMemory}><label>Tu nombre o apodo <input value={name} onChange={(event) => setName(event.target.value)} maxLength="30" placeholder={`Hincha de ${team.mark}`} /></label><label>Tu recuerdo <textarea value={memory} onChange={(event) => setMemory(event.target.value)} minLength="12" maxLength="280" placeholder="Ese partido, esa camiseta o esa persona…" required /></label><div><small>{memory.length} / 280</small><button className="button" disabled={memory.trim().length < 12}>Guardar mi recuerdo</button></div></form>{memoriesError && <p role="status">No pudimos guardar el recuerdo en este dispositivo.</p>}</div><div className="saved-memories" aria-live="polite"><span className="eyebrow">MIS RECUERDOS · {team.mark}</span>{memories.length ? memories.map((item) => <blockquote key={item.id}><p>“{item.text}”</p><footer>{item.name}</footer><button onClick={() => setMemories(memories.filter((memoryItem) => memoryItem.id !== item.id))}>Eliminar</button></blockquote>) : <div className="wall-empty"><b>Este muro todavía espera tu primera historia.</b><p>Un partido, una persona, una camiseta: tu club también vive en lo que recuerdas.</p></div>}</div></section></div>;
}

function ClubSectionPage({ route, favoriteTeam }) {
  const team = favoriteTeam || teamChoices[0];
  const profile = clubProfiles[team.id];
  const media = clubMedia[team.id];
  const topic = {
    '/escuelas': {
      label: 'ESCUELAS', title: 'El fútbol empieza en comunidad.',
      copy: `La identidad de ${team.name} también se transmite entre generaciones. Aquí reunimos una ficha de su historia y un acceso para revisar la información formativa vigente publicada por el club.`,
      search: `${team.name} fútbol formativo escuela oficial`, action: 'Buscar fútbol formativo oficial', note: 'Revisa edades, cupos y fechas directamente con la institución; esta guía no representa una inscripción.'
    },
    '/abonos': {
      label: 'ABONOS', title: 'Tu lugar en la tribuna.',
      copy: `El estadio, la ciudad y los colores hacen especial cada regreso a casa. Consulta directamente los canales de ${team.name} para ver disponibilidad y condiciones de abonos.`,
      search: `${team.name} abonos entradas 2026 sitio oficial`, action: 'Consultar abonos y entradas', note: 'No mostramos precios ni disponibilidad porque cambian durante la temporada. Confirma siempre en el canal oficial.'
    },
    '/tienda': {
      label: 'TIENDA', title: 'Colores para llevar.',
      copy: `La camiseta acompaña la historia de ${team.name}. Encuentra la tienda o distribución oficial y confirma modelo, tallas y autenticidad antes de comprar.`,
      search: `${team.name} tienda oficial camisetas`, action: 'Buscar la tienda oficial', note: 'El Sendero no vende productos. Comprueba que el vendedor esté reconocido por el club.'
    },
    '/prensa': {
      label: 'PRENSA', title: 'El club, contado desde su fuente.',
      copy: `Sigue la cobertura y los comunicados de ${team.name}. Nuestra guía enlaza la información institucional y una búsqueda de noticias centrada en tu equipo.`,
      search: `${team.name} fútbol Chile`, action: 'Abrir noticias del club', note: 'Las notas externas abren en sus propios sitios; los resúmenes del Sendero se identifican y enlazan a su fuente.'
    },
  }[route];
  const destination = route === '/prensa' ? getClubSearchUrl(team) : `https://www.google.com/search?q=${encodeURIComponent(topic.search)}`;
  return <div className="page shell club-guide-page"><section className="club-guide-hero"><div className="club-guide-art"><img src={media.image} alt={media.alt} /><span>{topic.label} · {team.mark}</span><MediaCredit media={media} /></div><div className="club-guide-copy"><span className="eyebrow">{topic.label} · {profile.identity}</span><h1>{topic.title}</h1><p>{topic.copy}</p><a className="button" href={destination} target="_blank" rel="noreferrer">{topic.action} ↗</a>{route === '/escuelas' && <RouteLink className="club-guide-community-link" to="/comunidad">Compartir un recuerdo de la tribuna →</RouteLink>}</div></section><section className="club-guide-info"><div><span className="eyebrow">UNA GUÍA DE EL SENDERO</span><h2>{profile.historyTitle}</h2><p>{profile.historyLead}</p><a href={profile.sourceUrl} target="_blank" rel="noreferrer">{profile.sourceLabel} ↗</a></div><div className="club-guide-facts">{profile.facts.slice(0, 3).map(([year, title, description]) => <article key={`${year}-${title}`}><b>{year}</b><span><strong>{title}</strong><small>{description}</small></span></article>)}</div></section><p className="data-note club-guide-note">{topic.note}</p></div>;
}

function ArticlePage({ article, saved, onSave, saveError, favoriteTeam }) {
  const [message, setMessage] = useState('');
  async function share() {
    try { await navigator.clipboard.writeText(window.location.href); setMessage('Enlace copiado. ¡Compártelo con otro hincha!'); }
    catch { setMessage('Copia la dirección del navegador para compartir este artículo.'); }
  }
  if (!article) return <div className="page shell empty-state"><h1>No encontramos ese artículo.</h1><RouteLink to="/actualidad">Volver a la actualidad →</RouteLink></div>;
  const related = articles.filter((item) => item.id !== article.id && (!favoriteTeam || item.clubIds?.includes(favoriteTeam.id))).slice(0, 3);
  return <article className="article-page shell"><RouteLink to="/actualidad" className="back-link">← Volver a actualidad</RouteLink><div className="article-heading"><span className="eyebrow">{article.category} / {article.type}</span><h1 tabIndex="-1">{article.title}</h1><p>{article.excerpt}</p><div>REDACCIÓN EL SENDERO DEL SOCCER <span>•</span> {article.date}</div></div><figure><img src={article.image} alt={article.credit} /><figcaption><Credit article={article} /></figcaption></figure><div className="article-content"><div className="article-actions"><button aria-pressed={saved} onClick={() => onSave(article.id)}>{saved ? '♥ Guardado' : '♡ Guardar artículo'}</button><button onClick={share}>Copiar enlace ↗</button></div><p className="feedback" aria-live="polite">{message}{saveError ? ' No pudimos guardar el cambio.' : ''}</p>{article.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<aside className="source-box"><b>Sobre esta publicación</b><p>Texto original de El Sendero del Soccer. {article.type === 'Análisis' ? 'Interpretación editorial basada en los hechos del encuentro.' : 'Información redactada a partir de la fuente indicada.'}</p>{article.source.url ? <a href={article.source.url} target="_blank" rel="noreferrer">{article.source.label} ↗</a> : <span>{article.source.label}</span>}</aside>{related.length > 0 && <><h2>Sigue por el Sendero</h2>{related.map((item) => <ArticleLink key={item.id} article={item} className="related-link" />)}</>}</div></article>;
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
    const titles = { '/': 'El Sendero del Soccer | Pasión por el juego', '/actualidad': 'Noticias | El Sendero del Soccer', '/datos': 'Partidos | El Sendero del Soccer', '/memoria': 'El Club | El Sendero del Soccer', '/comunidad': 'Comunidad | El Sendero del Soccer', '/escuelas': 'Escuelas | El Sendero del Soccer', '/abonos': 'Abonos | El Sendero del Soccer', '/tienda': 'Tienda | El Sendero del Soccer', '/prensa': 'Prensa | El Sendero del Soccer', '/soy-dt': 'Último Minuto | El Sendero del Soccer' };
    document.title = article ? `${article.title} | El Sendero del Soccer` : titles[route] || 'El Sendero del Soccer';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route, article]);
  const toggleSave = (id) => setSaved(saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id]);
  let page;
  if (articleId) page = <ArticlePage article={article} saved={saved.includes(articleId)} onSave={toggleSave} saveError={saveError} favoriteTeam={favoriteTeam} />;
  else if (route === '/actualidad') page = <NewsPage saved={saved} onSave={toggleSave} saveError={saveError} favoriteTeam={favoriteTeam} />;
  else if (route === '/datos') page = <DataPage favoriteTeam={favoriteTeam} />;
  else if (route === '/memoria') page = <MemoryPage key={favoriteTeam?.id} saved={saved} onSave={toggleSave} favoriteTeam={favoriteTeam} />;
  else if (route === '/comunidad') page = <CommunityPage key={favoriteTeam?.id} favoriteTeam={favoriteTeam} />;
  else if (['/escuelas', '/abonos', '/tienda', '/prensa'].includes(route)) page = <ClubSectionPage route={route} favoriteTeam={favoriteTeam} />;
  else if (route === '/soy-dt') page = <ManagerPage key={favoriteTeam?.id} favoriteTeam={favoriteTeam} />;
  else page = <HomePage saved={saved} onSave={toggleSave} favoriteTeam={favoriteTeam} />;
  const chooseTeam = (teamId) => { setFavoriteTeamId(teamId); setTeamPickerOpen(false); };
  return <><a className="skip-link" href="#main">Saltar al contenido</a><Header route={route} favoriteTeam={favoriteTeam} onChooseTeam={() => setTeamPickerOpen(true)} /><main id="main">{page}</main><Footer favoriteTeam={favoriteTeam} />{teamPickerOpen && <TeamPicker selectedTeam={favoriteTeam} onSelect={chooseTeam} />}</>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
