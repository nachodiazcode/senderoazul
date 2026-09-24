# Guía para entender El Sendero del Soccer

Esta guía cuenta cómo está armado el proyecto y dónde mirar para cambiarlo. No necesitas memorizar React: puedes usarla como mapa y avanzar de a poco.

**English version:** [Project guide](PROJECT_GUIDE.en.md).

## La idea en simple

La web se construye en el navegador. React toma componentes, datos e imágenes y los convierte en páginas. Vite ayuda a desarrollar y compilar. Netlify publica la versión compilada. Firebase Authentication se ocupa del acceso a Soy DT y entrega los tokens de sesión (JWT).

```text
Tus datos y textos ──┐
Imágenes en public/ ──┼─> React (src/main.jsx) ─> sitio visible
Estilos CSS ─────────┘
                              │
Noticias versionadas ─> /api/news (Vite local o Netlify Function)
Acceso de Soy DT ──────> Firebase Authentication ─> sesión JWT
```

El sitio es principalmente estático: posiciones, noticias y fixture se guardan como datos dentro del repositorio. Eso permite controlar lo que se publica, pero significa que la información no se actualiza sola.

## Mapa de archivos

| Archivo o carpeta | Para qué sirve |
| --- | --- |
| `src/main.jsx` | Entrada de React y componentes de las páginas: portada, clubes, noticias, datos, historia, comunidad y Soy DT. También contiene el catálogo de clubes, sus colores, perfiles, tabla y Copa Chile. |
| `src/content.js` | Artículos completos: título, bajada, texto, fecha, clubes relacionados, imágenes y atribución de fuentes. |
| `src/news-feed.js` | Catálogo del radar de titulares y filtro/búsqueda que alimenta `/api/news`. Incluye la fecha de actualización del catálogo. |
| `src/firebase.js` | Conecta Firebase Authentication y exporta las funciones de registro, acceso, recuperación de contraseña y cierre de sesión. |
| `src/styles.css` | Diseño, adaptación móvil, animaciones y temas. Variables como `--club-primary`, `--club-accent` y `--navy` reciben los colores del club elegido. |
| `public/assets/` | Imágenes que se sirven desde la web. `clubs/` contiene escudos SVG; `club-media/` contiene portadas y notas de atribución. |
| `netlify/functions/news.js` | Endpoint de noticias en producción. Lee el mismo catálogo de `src/news-feed.js`; no realiza scraping. |
| `vite.config.js` | Configura el servidor local y la copia local de `/api/news`, para desarrollar con el mismo flujo de la web publicada. |
| `netlify.toml` | Comando de compilación, carpeta publicada y redirección de `/api/news` a la función de Netlify. |
| `firebase.json` | Configuración de proveedores y dominios de Firebase Authentication. |
| `.env.example` | Plantilla vacía de configuración Firebase. No contiene contraseñas. |
| `.env.local` | Configuración Firebase del computador. Git la ignora; no se debe subir. |
| `index.html` | Documento inicial del navegador, metadatos y elemento donde React monta la aplicación. |

## Qué ocurre cuando alguien abre la web

1. El navegador carga `index.html` y los archivos compilados por Vite.
2. `src/main.jsx` inicia React y decide qué vista mostrar según la ruta del hash, como `#/datos` o `#/soy-dt`.
3. La preferencia de club se lee desde el almacenamiento local del navegador. Si aún no existe, aparece el selector inicial.
4. Al elegir club, la aplicación guarda esa preferencia, cambia el tema y filtra noticias, artículos y datos relacionados.
5. La portada y Noticias consultan `/api/news`. En desarrollo responde Vite; en producción responde `netlify/functions/news.js`. Si la solicitud falla, la interfaz usa el catálogo local como respaldo.
6. Soy DT observa el inicio de sesión con Firebase. Firebase gestiona las credenciales y emite/renueva el ID token JWT; la app no firma JWT propios.

## Cómo cambiar contenido sin perderse

### Cambiar una noticia del radar

Abre `src/news-feed.js`. Cada noticia tiene identificador, fuente y enlace, título, resumen, categoría, fecha y lista `clubIds`. Mantén el formato de las noticias existentes y usa IDs que coincidan con `teamChoices` en `src/main.jsx`. Cambia `feedUpdatedAt` al actualizar el catálogo.

El texto que muestra el sitio no se descarga automáticamente desde el enlace: se redacta y revisa para este proyecto. Conserva el enlace de origen y no presentes como confirmado algo que la fuente no respalde.

### Cambiar un artículo

Abre `src/content.js`. `body` es una lista de párrafos. `image` apunta a una ruta dentro de `public`, por ejemplo `/assets/hinchada.png`. Completa fuente, crédito y clubes relacionados (`clubIds`) para que el artículo aparezca en las vistas correctas.

### Cambiar un club o su tema

En `src/main.jsx`, `teamChoices` define el ID, nombre, abreviatura y colores. `clubMedia` asigna portada, descripción alternativa y créditos. `clubProfiles` guarda identidad, copy y datos históricos. Usa el mismo ID (por ejemplo `coquimbo`) en todas estas estructuras y en noticias/artículos.

Los escudos viven en `public/assets/clubs/`; las portadas, en `public/assets/club-media/`. Las notas de procedencia y licencia están en los archivos `README.md` de esas carpetas. Añadir una imagen no basta: también hay que asignarla al club en el código.

### Cambiar tabla o Copa Chile

En `src/main.jsx`, `leagueStandings2026` define la tabla mostrada y `copaChileFixtures` contiene los partidos de ida/vuelta. Cada partido guarda fecha ISO (`AAAA-MM-DD`), local, visita, sede y, si ya se disputó, marcador. Al corregir datos, actualiza también la fecha de corte y la nota de fuentes que se muestra en la página. No confundas una hora con un resultado.

### Cambiar estilos o movimiento

Busca las reglas de la vista en `src/styles.css`. Los valores del equipo activo se aplican desde `teamChoices`, así que las secciones reutilizan el aura del club sin duplicar una hoja de estilo por equipo. Si agregas animación, respeta `prefers-reduced-motion` para quienes solicitan movimiento reducido.

## Datos del navegador y cuenta

El hook `useStored` de `src/main.jsx` guarda preferencias y elementos de Soy DT en `localStorage`. Las claves incluyen club favorito, artículos guardados, recuerdos y alineaciones. Es simple y funciona sin servidor, pero los datos viven sólo en ese navegador: no se sincronizan con otros dispositivos.

La autenticación está en Firebase, no en una función casera que almacena contraseñas. Un usuario autenticado puede acceder al flujo de duelo de demostración. Esto todavía no es un sistema de permisos del lado servidor ni guarda alineaciones en la nube.

La configuración cliente de Firebase (`VITE_FIREBASE_*`) se necesita al compilar, pero no es una contraseña. `.env.local` no se comparte. Nunca publiques claves privadas del Admin SDK, contraseñas de prueba ni secretos propios en el código o en variables `VITE_*`: esas variables se incluyen en el navegador.

## Ejecutar y publicar

Necesitas Node.js 22.12 o superior y npm:

```bash
npm ci
npm run dev
```

Para revisar la compilación de producción localmente:

```bash
npm run build
npm run preview
```

Si Vite termina sin errores, `dist/` queda lista para publicar. Netlify publica el sitio; Firebase gestiona el inicio de sesión. Antes de un push, revisa `git status` para confirmar que `.env.local` no aparezca. La contraseña de la cuenta de prueba no forma parte de esta guía ni del repositorio.

## Qué no hace todavía

- No descarga resultados, noticias ni posiciones en tiempo real: el catálogo se actualiza editando el proyecto.
- No usa la API de 365Scores, bet365 ni un scraper de terceros.
- No sincroniza alineaciones, recuerdos o artículos guardados entre distintos equipos.
- No tiene roles de administrador ni un backend que autorice cambios privados.

La interfaz puede parecer dinámica y estar personalizada, pero la mayoría del contenido sigue siendo versionado en el código. Esta diferencia ayuda a saber qué datos hay que revisar al preparar una actualización.
