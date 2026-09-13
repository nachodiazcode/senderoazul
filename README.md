# El Sendero Azul

Prototipo de un sitio editorial deportivo dedicado a Universidad de Chile, desarrollado con React y Vite para `senderoazul.cl`.

## Funcionalidades

- Portada responsive con noticias destacadas.
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
src/styles.css   Estilos y diseño responsive
index.html       Documento de entrada
vite.config.js   Configuración de Vite
```

## Alcance

Los artículos, resultados y posiciones son datos de demostración definidos en el frontend. El proyecto no incluye backend ni integración con un CMS o servicio de newsletter. Para publicar contenido actualizado, se requiere conectar una fuente de datos y los servicios correspondientes.
