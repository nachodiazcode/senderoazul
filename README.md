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

La API de noticias queda disponible durante el desarrollo en:

```text
GET /api/news
GET /api/news?limit=3
GET /api/news?topic=Agenda
GET /api/news?q=Libertadores
```

En local la sirve un middleware de Vite y en producción una Netlify Function. El acceso de Soy DT usa Firebase Authentication (email/contraseña y Google); Firebase emite y renueva el ID token JWT y mantiene la sesión en el SDK. Las cuentas no dependen de la memoria de una función serverless. El once sigue guardándose en el navegador actual; todavía no se sincroniza entre dispositivos.

### Configurar Firebase Authentication

1. Copia `.env.example` a `.env.local` y completa las seis variables `VITE_FIREBASE_*` desde la configuración de tu app web en Firebase.
2. En Firebase Console → Authentication → Proveedores, activa **Correo electrónico/contraseña** y **Google**.
3. En Authentication → Configuración → Dominios autorizados, incluye `localhost` y `elsenderodelsoccer.netlify.app` (más el dominio propio si lo conectas).
4. Agrega esas mismas seis variables como variables de entorno del sitio en Netlify y vuelve a desplegar.

La configuración web de Firebase se incluye en el cliente y no es una clave privada. No agregues credenciales de Admin SDK ni secretos JWT propios a variables `VITE_*`. Correo/contraseña y Google están disponibles en el plan Spark sin costo, sujetos a los límites vigentes de Firebase.

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
src/firebase.js  Inicio de Firebase Authentication
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
