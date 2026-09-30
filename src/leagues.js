// Tablas editoriales. No se actualizan solas.
// Ascenso: Campeonato Chileno y Cooperativa, corte 26/09/2026.
// Tercera A: CF3, tabla consultada el 27/09/2026.

export const ascensoStandings2026 = [
  { name: 'Cobreloa', city: 'Calama', played: 25, wins: 12, draws: 9, losses: 4, goalsFor: 43, goalsAgainst: 27, goalDifference: 16, points: 45, zone: 'asciende' },
  { name: 'Santiago Wanderers', city: 'Valparaíso', played: 25, wins: 12, draws: 8, losses: 5, goalsFor: 40, goalsAgainst: 26, goalDifference: 14, points: 44, zone: 'liguilla' },
  { name: 'San Luis', city: 'Quillota', played: 24, wins: 11, draws: 8, losses: 5, goalsFor: 38, goalsAgainst: 29, goalDifference: 9, points: 41, zone: 'liguilla' },
  { name: 'Magallanes', city: 'San Bernardo', played: 25, wins: 11, draws: 7, losses: 7, goalsFor: 41, goalsAgainst: 38, goalDifference: 3, points: 40, zone: 'liguilla' },
  { name: 'Deportes Antofagasta', city: 'Antofagasta', played: 25, wins: 10, draws: 8, losses: 7, goalsFor: 42, goalsAgainst: 26, goalDifference: 16, points: 38, zone: 'liguilla' },
  { name: 'Deportes Recoleta', city: 'Recoleta', played: 25, wins: 10, draws: 8, losses: 7, goalsFor: 36, goalsAgainst: 33, goalDifference: 3, points: 38, zone: 'liguilla' },
  { name: 'San Marcos de Arica', city: 'Arica', played: 25, wins: 9, draws: 9, losses: 7, goalsFor: 31, goalsAgainst: 23, goalDifference: 8, points: 36, zone: 'liguilla' },
  { name: 'Unión Española', city: 'Independencia', played: 25, wins: 10, draws: 6, losses: 9, goalsFor: 32, goalsAgainst: 32, goalDifference: 0, points: 36, zone: 'liguilla' },
  { name: 'Deportes Copiapó', city: 'Copiapó', played: 25, wins: 9, draws: 7, losses: 9, goalsFor: 37, goalsAgainst: 39, goalDifference: -2, points: 34, zone: '' },
  { name: 'Deportes Puerto Montt', city: 'Puerto Montt', played: 25, wins: 10, draws: 4, losses: 11, goalsFor: 26, goalsAgainst: 31, goalDifference: -5, points: 34, zone: '' },
  { name: 'Deportes Temuco', city: 'Temuco', played: 25, wins: 8, draws: 8, losses: 9, goalsFor: 40, goalsAgainst: 35, goalDifference: 5, points: 32, zone: '' },
  { name: 'Deportes Iquique', city: 'Iquique', played: 25, wins: 6, draws: 10, losses: 9, goalsFor: 33, goalsAgainst: 30, goalDifference: 3, points: 28, zone: '' },
  { name: 'Curicó Unido', city: 'Curicó', played: 25, wins: 6, draws: 9, losses: 10, goalsFor: 22, goalsAgainst: 38, goalDifference: -16, points: 24, zone: '' },
  { name: 'Deportes Santa Cruz', city: 'Santa Cruz', played: 25, wins: 4, draws: 10, losses: 11, goalsFor: 26, goalsAgainst: 38, goalDifference: -12, points: 22, zone: '' },
  { name: 'Unión San Felipe', city: 'San Felipe', played: 24, wins: 5, draws: 7, losses: 12, goalsFor: 16, goalsAgainst: 41, goalDifference: -25, points: 22, zone: '' },
  { name: 'Rangers', city: 'Talca', played: 25, wins: 4, draws: 6, losses: 15, goalsFor: 23, goalsAgainst: 40, goalDifference: -17, points: 18, zone: 'desciende' },
].map((club, index) => ({ ...club, position: index + 1 }));

export const terceraAStandings2026 = [
  { name: 'Malleco Unido', city: 'Angol', played: 23, wins: 14, draws: 5, losses: 4, goalsFor: 39, goalsAgainst: 25, goalDifference: 14, points: 47, zone: 'asciende' },
  { name: 'Lautaro de Buin', city: 'Buin', played: 22, wins: 13, draws: 4, losses: 5, goalsFor: 34, goalsAgainst: 25, goalDifference: 9, points: 43, spotlight: true },
  { name: 'Quintero Unido', city: 'Quintero', played: 22, wins: 12, draws: 6, losses: 4, goalsFor: 45, goalsAgainst: 24, goalDifference: 21, points: 42 },
  { name: 'Comunal Cabrero', city: 'Cabrero', played: 23, wins: 11, draws: 5, losses: 7, goalsFor: 43, goalsAgainst: 31, goalDifference: 12, points: 38 },
  { name: 'Deportes Rancagua', city: 'Rancagua', played: 23, wins: 11, draws: 5, losses: 7, goalsFor: 41, goalsAgainst: 31, goalDifference: 10, points: 38 },
  { name: 'Naval de Talcahuano', city: 'Talcahuano', played: 23, wins: 11, draws: 5, losses: 7, goalsFor: 35, goalsAgainst: 30, goalDifference: 5, points: 38 },
  { name: 'Aguará FC', city: 'Santiago', played: 23, wins: 8, draws: 10, losses: 5, goalsFor: 31, goalsAgainst: 23, goalDifference: 8, points: 34, zone: '' },
  { name: 'Constitución Unido', city: 'Constitución', played: 23, wins: 9, draws: 4, losses: 10, goalsFor: 38, goalsAgainst: 36, goalDifference: 2, points: 31, zone: '' },
  { name: 'Atlético Oriente', city: 'Santiago', played: 23, wins: 9, draws: 2, losses: 12, goalsFor: 38, goalsAgainst: 43, goalDifference: -5, points: 29, zone: '' },
  { name: 'Rodelindo Román', city: 'Santiago', played: 23, wins: 6, draws: 6, losses: 11, goalsFor: 26, goalsAgainst: 45, goalDifference: -19, points: 24, zone: '', spotlight: true },
  { name: 'Municipal Puente Alto', city: 'Puente Alto', played: 23, wins: 6, draws: 5, losses: 12, goalsFor: 27, goalsAgainst: 43, goalDifference: -16, points: 23 },
  { name: 'Imperial Unido', city: 'Nueva Imperial', played: 23, wins: 6, draws: 3, losses: 14, goalsFor: 26, goalsAgainst: 43, goalDifference: -17, points: 21 },
  { name: 'Chimbarongo FC', city: 'Chimbarongo', played: 23, wins: 5, draws: 5, losses: 13, goalsFor: 26, goalsAgainst: 36, goalDifference: -10, points: 20 },
  { name: 'Futuro FC', city: 'Peñalolén', played: 23, wins: 3, draws: 7, losses: 13, goalsFor: 20, goalsAgainst: 34, goalDifference: -14, points: 16 },
].map((club, index) => ({ ...club, position: index + 1 }));
