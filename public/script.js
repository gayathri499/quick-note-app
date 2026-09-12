// script.js
// Talks to the Express API asynchronously using fetch().

const API_URL = '/notes';

const titleInput = document.getElementById('titleInput');
const contentInput = document.getElementById('contentInput');
const addBtn = document.getElementById('addBtn');
const formError = document.getElementById('formError');
const notesList = document.getElementById('notesList');
const emptyState = document.getElementById('emptyState');
const noteCount = document.getElementById('noteCount');

// ---------- Load notes on page start ----------
document.addEventListener('DOMContentLoaded', loadNotes);
addBtn.addEventListener('click', createNote);

// Allow Ctrl/Cmd+Enter in the textarea to submit
contentInput.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') createNote();
});

async function loadNotes() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to load notes');
    const notes = await res.json();
    renderNotes(notes);
  } catch (err) {
    console.error(err);
    notesList.innerHTML = `<p class="empty-state">Couldn't load notes. Is the server running?</p>`;
  }
}

async function createNote() {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  formError.textContent = '';

  if (!title) {
    formError.textContent = 'Please enter a title.';
    return;
  }

  addBtn.disabled = true;
  addBtn.textContent = 'Adding...';

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create note');
    }

    titleInput.value = '';
    contentInput.value = '';
    await loadNotes();
  } catch (err) {
    formError.textContent = err.message;
  } finally {
    addBtn.disabled = false;
    addBtn.textContent = 'Add Note';
  }
}

async function deleteNote(id) {
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) card.style.opacity = '0.5';

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete note');
    await loadNotes();
  } catch (err) {
    console.error(err);
    if (card) card.style.opacity = '1';
    alert('Could not delete note. Please try again.');
  }
}

function renderNotes(notes) {
  noteCount.textContent = `${notes.length} note${notes.length === 1 ? '' : 's'}`;

  if (notes.length === 0) {
    notesList.innerHTML = '';
    notesList.appendChild(emptyState);
    return;
  }

  notesList.innerHTML = notes
    .map(
      (note) => `
      <div class="note-card" data-id="${note.id}">
        <button class="note-card__delete" data-delete-id="${note.id}" title="Delete note">✕</button>
        <h3 class="note-card__title">${escapeHtml(note.title)}</h3>
        ${note.content ? `<p class="note-card__content">${escapeHtml(note.content)}</p>` : ''}
        <span class="note-card__date">${formatDate(note.createdAt)}</span>
      </div>
    `
    )
    .join('');

  // Wire up delete buttons
  document.querySelectorAll('[data-delete-id]').forEach((btn) => {
    btn.addEventListener('click', () => deleteNote(btn.getAttribute('data-delete-id')));
  });
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
