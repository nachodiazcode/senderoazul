# El Sendero del Soccer

Prototipo de un sitio editorial deportivo dedicado a Universidad de Chile, desarrollado con React y Vite para `senderoazul.cl`.

## Funcionalidades

- Portada responsive con noticias destacadas.
- Radar de titulares externos alimentado por una API ligera.
- Buscador en vivo y filtros por categoría.
- Ticker de noticias y módulo del próximo partido.
- Tabla de posiciones de demostración.
- Secciones de videos, historia e identidad del club.
- Bloque visual de newsletter y recursos gráficos locales.

## Desarrollo local

Requiere Node.js 22.12 o superior y npm.

```bash
npm ci
npm run dev
```

Abre la dirección que indique Vite en la terminal.

La API queda disponible durante el desarrollo en:

```text
GET /api/news
GET /api/news?limit=3
GET /api/news?topic=Agenda
GET /api/news?q=Libertadores

POST /api/auth
{"action":"register","name":"Tu apodo","email":"tu@email.cl","password":"minimo-6"}

POST /api/auth
{"action":"login","email":"tu@email.cl","password":"minimo-6"}

GET /api/auth (con `Authorization: Bearer <token>`)
```

En local la sirve un middleware de Vite; en producción, una Netlify Function. Ambas rutas usan el catálogo versionado de `src/news-feed.js`, por lo que la interfaz conserva un respaldo local si la función no responde.

El registro de Soy DT firma tokens JWT HS256 y guarda usuarios en memoria para desarrollo local. En el despliegue de producción, el formulario y la función de registro están desactivados: el once y el duelo de demostración funcionan sin cuenta en el navegador. Antes de habilitar cuentas reales hay que implementar persistencia y configurar un secreto seguro.

## Compilación y vista previa

```bash
npm run build
npm run preview
```

La compilación genera el directorio `dist/`, listo para un hosting estático. `npm run preview` permite revisar esa compilación localmente.

## Estructura

```text
public/assets/   Imágenes y recursos gráficos
src/main.jsx     Componentes, contenido y filtros
src/news-feed.js Catálogo y filtros del radar informativo
server/auth-api.js  Registro, login y validación JWT
src/styles.css   Estilos y diseño responsive
netlify/functions/news.js  Endpoint de noticias para producción
index.html       Documento de entrada
vite.config.js   Configuración de Vite
```

## Alcance

Los artículos, resultados y posiciones son datos editoriales versionados. La API incluida es una primera capa de lectura y no extrae contenido automáticamente de Google ni de los medios: para actualizaciones automáticas todavía se requiere conectar un proveedor de noticias o un CMS con derechos de uso adecuados.

## Despliegue en Netlify

Sitio publicado: https://senderoazul.netlify.app

La configuración de compilación está en `netlify.toml`. Para publicar una actualización con la CLI de Netlify autenticada y el proyecto vinculado:

```bash
npm ci
npm run build
netlify deploy --prod --dir dist --no-build
```

El despliegue inicial se realizó desde la CLI; los pushes a GitHub no generan despliegues automáticos hasta configurar la integración del repositorio en Netlify.
