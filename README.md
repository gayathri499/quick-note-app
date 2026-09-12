# Quick Note Application

A single-page full-stack note-taking web app. Node.js/Express backend with a
RESTful API, vanilla HTML/CSS/JS frontend that talks to it asynchronously via
`fetch()`. Notes are persisted to a local JSON file (`notes.json`).

## Features

- `GET /notes` — list all notes (newest first)
- `POST /notes` — create a note (`{ title, content }`)
- `DELETE /notes/:id` — delete a note by id
- Notes stored in `notes.json` (no database setup required)
- Responsive, clean UI with add/delete, empty state, loading/error handling

## Project structure

```
quick-note-app/
├── server.js          # Express server + REST API
├── notes.json          # JSON "database" (auto-created if missing)
├── package.json
├── render.yaml         # Render deployment config
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
```

## Run locally

```bash
npm install
npm start
```

Then open **http://localhost:3000**.

## API reference

| Method | Endpoint      | Body                          | Response          |
|--------|---------------|--------------------------------|--------------------|
| GET    | `/notes`      | –                               | `200` array of notes |
| POST   | `/notes`      | `{ "title": "...", "content": "..." }` | `201` created note |
| DELETE | `/notes/:id`  | –                               | `200` on success, `404` if not found |

Example note object:

```json
{
  "id": "b1b2c3d4-...-uuid",
  "title": "Groceries",
  "content": "Milk, eggs, bread",
  "createdAt": "2026-09-12T15:04:00.000Z"
}
```

## Deployment

This app writes to a local JSON file, so it needs a host with a **persistent
filesystem** (not a stateless serverless platform like Vercel functions,
where the filesystem resets between invocations).

### Option A — Render (recommended, free tier)

1. Push this repo to GitHub.
2. Go to [render.com](https://render.com) → **New +** → **Web Service** →
   connect your repo.
3. Render will detect `render.yaml` automatically, or set manually:
   - Build command: `npm install`
   - Start command: `npm start`
4. Deploy. You'll get a live URL like `https://quick-note-app.onrender.com`.

### Option B — Railway

1. Push to GitHub, then [railway.app](https://railway.app) → **New Project**
   → **Deploy from GitHub repo**.
2. Railway auto-detects Node.js and runs `npm start`. No extra config needed.

### Option C — Netlify (frontend) + Render (backend)

If you'd rather split it, deploy `public/` as a static site on Netlify and
the Express API on Render, then update `API_URL` in `public/script.js` to
the full Render URL. For the "single deployed app URL" requirement in the
task, Option A or B (single service serving both) is simpler.

## Submission checklist (per the task card)

- [ ] Push this project to a GitHub repository
- [ ] Deploy it (Render/Railway — see above)
- [ ] Submit: **GitHub repo link** + **deployed live app URL**
