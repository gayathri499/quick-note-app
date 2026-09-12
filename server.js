// server.js
// Quick Note Application — Express backend with a JSON-file data store.

const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'notes.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Helpers: read/write the JSON "database" ----------

async function readNotes() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File doesn't exist yet — start with an empty list.
      await fs.writeFile(DATA_FILE, '[]', 'utf-8');
      return [];
    }
    throw err;
  }
}

async function writeNotes(notes) {
  await fs.writeFile(DATA_FILE, JSON.stringify(notes, null, 2), 'utf-8');
}

// ---------- REST API ----------

// GET /notes — fetch all notes (newest first)
app.get('/notes', async (req, res) => {
  try {
    const notes = await readNotes();
    const sorted = [...notes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(sorted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read notes.' });
  }
});

// POST /notes — create a new note
app.post('/notes', async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const newNote = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: (content || '').trim(),
      createdAt: new Date().toISOString(),
    };

    const notes = await readNotes();
    notes.push(newNote);
    await writeNotes(notes);

    res.status(201).json(newNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create note.' });
  }
});

// DELETE /notes/:id — delete a note by id
app.delete('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const notes = await readNotes();
    const exists = notes.some((n) => n.id === id);

    if (!exists) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    const updated = notes.filter((n) => n.id !== id);
    await writeNotes(updated);

    res.status(200).json({ message: 'Note deleted.', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete note.' });
  }
});

// Fallback: serve the frontend for any other GET route (nice for SPA-style hosting)
app.get('*', (req, res, next) => {
  if (req.method !== 'GET') return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Quick Note Application running on http://localhost:${PORT}`);
});
