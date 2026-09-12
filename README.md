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

