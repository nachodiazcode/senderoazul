# Understanding El Sendero del Soccer

This guide explains how the project is put together and where to look when you want to change something. You do not need to memorize React—use it as a map and learn one piece at a time.

**Versión en español:** [Guía del proyecto](GUIA_DEL_PROYECTO.md).

## The big picture

The website is assembled in the browser. React turns components, data, and images into pages. Vite helps run the development server and build the site. Netlify publishes the built version. Firebase Authentication handles sign-in for Soy DT and issues the session tokens (JWTs).

```text
Your text and data ───┐
Images in public/ ────┼─> React (src/main.jsx) ─> visible website
CSS styles ──────────┘
                              │
Versioned news ──────> /api/news (Vite locally or a Netlify Function)
Soy DT sign-in ──────> Firebase Authentication ─> JWT session
```

This is mostly a static site: standings, news, and cup fixtures are stored in the repository as data. That gives the project control over what it publishes, but the information does not update by itself.

## File map

| File or folder | What it does |
| --- | --- |
| `src/main.jsx` | React entry point and page components: home, club pages, news, data, history, community, and Soy DT. It also contains the club catalog, colors, profiles, standings, and Copa Chile fixtures. |
| `src/content.js` | Full editorial articles: title, summary, body, date, related clubs, images, and source credits. |
| `src/news-feed.js` | Curated headline catalog and filters/search used by `/api/news`. It includes the catalog update timestamp. |
| `src/firebase.js` | Connects Firebase Authentication and exports sign-up, sign-in, password reset, and sign-out functions. |
| `src/styles.css` | Layout, responsive behavior, animation, and themes. Variables such as `--club-primary`, `--club-accent`, and `--navy` receive the selected club's colors. |
| `public/assets/` | Images served by the site. `clubs/` contains SVG crests; `club-media/` contains club cover images and attribution notes. |
| `netlify/functions/news.js` | Production news endpoint. It reads the same catalog from `src/news-feed.js`; it does not scrape websites. |
| `vite.config.js` | Configures the local development server and local `/api/news` endpoint so the development workflow resembles the published site. |
| `netlify.toml` | Build command, published folder, and redirect from `/api/news` to the Netlify Function. |
| `firebase.json` | Firebase Authentication provider and authorized-domain configuration. |
| `.env.example` | Empty Firebase configuration template. It contains no passwords. |
| `.env.local` | Firebase configuration for this computer. Git ignores it; do not commit it. |
| `index.html` | Initial browser document, metadata, and the element where React mounts the app. |

## What happens when someone opens the site

1. The browser loads `index.html` and the files built by Vite.
2. `src/main.jsx` starts React and selects a view from the hash route, such as `#/datos` or `#/soy-dt`.
3. The selected club is read from the browser's local storage. If there is no saved choice yet, the club picker appears.
4. Choosing a club saves that preference, changes the theme, and filters related news, articles, and data.
5. Home and News request `/api/news`. Vite serves it during development; `netlify/functions/news.js` serves it in production. If the request fails, the interface falls back to the local catalog.
6. Soy DT listens for Firebase's sign-in state. Firebase manages credentials and issues/refreshes the ID token JWT; the app does not sign its own JWTs.

## How to update content

### Update a news item

Open `src/news-feed.js`. Each item has an ID, source and link, headline, summary, category, date, and a `clubIds` list. Keep the existing shape and use club IDs that match `teamChoices` in `src/main.jsx`. Update `feedUpdatedAt` when you refresh the catalog.

The displayed text is not automatically downloaded from the linked site: it is written and reviewed for this project. Keep the source link and do not present claims as confirmed unless the source supports them.

### Update an article

Open `src/content.js`. `body` is a list of paragraphs. `image` points to a path inside `public`, for example `/assets/hinchada.png`. Include source, credit, and related clubs (`clubIds`) so the article appears in the right places.

### Update a club or its theme

In `src/main.jsx`, `teamChoices` defines the ID, name, short label, and colors. `clubMedia` assigns the cover image, alt text, and credits. `clubProfiles` contains identity, copy, and historical details. Reuse the same ID (for example, `coquimbo`) in all these structures and in related news/articles.

Crests are in `public/assets/clubs/`; cover images are in `public/assets/club-media/`. Their source and license notes are in the `README.md` files inside those folders. Adding an image file alone is not enough: it must also be assigned to the club in the code.

### Update standings or Copa Chile

In `src/main.jsx`, `leagueStandings2026` defines the displayed standings and `copaChileFixtures` contains the home-and-away fixtures. Each fixture stores an ISO date (`YYYY-MM-DD`), home team, away team, venue, and—once played—the score. When correcting data, also update the displayed cutoff date and source note. Do not mistake a kickoff time for a result.

### Update styling or motion

Find the relevant rules in `src/styles.css`. The active club's values come from `teamChoices`, allowing sections to share the club's atmosphere without maintaining a separate stylesheet for every team. If you add animation, respect `prefers-reduced-motion` for users who request reduced motion.

## Browser data and accounts

The `useStored` hook in `src/main.jsx` saves preferences and Soy DT items in `localStorage`. Keys cover the favorite club, saved articles, memories, and lineups. This is simple and needs no server, but the data stays in that browser and is not synced across devices.

Soy DT 2.0 lets users switch between 3–4–3, 4–3–3, and 4–4–2. On the Universidad de Chile board, players are reassigned by position when the formation changes. For other clubs, typed names are saved separately for each team and formation. Demo ratings are not presented as official statistics.

Authentication is handled by Firebase, not by a custom function storing passwords. A signed-in user can access the demo duel flow. This is not yet a server-side authorization system, and it does not save lineups to the cloud.

Firebase client configuration (`VITE_FIREBASE_*`) is needed at build time, but it is not a password. Do not share `.env.local`. Never publish Firebase Admin SDK private keys, test passwords, or custom secrets in the code or in `VITE_*` variables—those variables are included in the browser bundle.

## Run and publish

You need Node.js 22.12 or later and npm:

```bash
npm ci
npm run dev
```

To review a production build locally:

```bash
npm run build
npm run preview
```

If Vite finishes without errors, `dist/` is ready to publish. Netlify hosts the site; Firebase handles sign-in. Before pushing, check `git status` and make sure `.env.local` is not listed. The test account password is not part of this guide or the repository.

## What the project does not do yet

- It does not fetch live results, news, or standings; the catalog is updated by editing the project.
- It does not use the 365Scores API, bet365, or a third-party scraper.
- It does not sync lineups, memories, or saved articles between devices.
- It does not have admin roles or a backend that authorizes private changes.

The interface can feel dynamic and personalized while most of its content is still versioned in code. Keeping that distinction in mind makes it easier to know which data needs review before an update.
