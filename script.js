// ===========================================================
// Mot à Mot – app logic
// The page has three screens (home, practice, summary).
// This file switches between them, checks answers and saves progress.
// DECKS comes from decks.js, which loads before this file.
// ===========================================================

// ---------- Settings ----------
const MASTERY_STREAK = 3;                      // correct answers in a row to master a card
const STORAGE_KEY = 'motamot-progress-v1';     // name of the saved record in localStorage
const ACCENTS = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ç', 'î', 'ï', 'ô', 'û', 'ù', 'œ'];

// ---------- Grab the page elements we need ----------
const el = (id) => document.getElementById(id);

const views = {
  home: el('home-view'),
  practice: el('practice-view'),
  summary: el('summary-view')
};

const deckGrid = el('deck-grid');
const answerInput = el('answer');
const answerForm = el('answer-form');
const accentRow = el('accent-row');
const feedbackBox = el('feedback');
const checkBtn = el('check-btn');
const dontKnowBtn = el('dont-know-btn');

// ===========================================================
// Saved progress (stored in the browser with localStorage)
// Shape: { travel: { best: 17, streaks: { "the platform": 2, ... } }, ... }
// ===========================================================

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    // Private browsing or blocked storage: carry on without saving.
    return {};
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    // Ignore – the app still works, it just won't remember next time.
  }
}

let progress = loadProgress();

// Returns the saved record for one deck, creating it if needed.
function getDeckProgress(deckId) {
  if (!progress[deckId]) {
    progress[deckId] = { best: 0, streaks: {} };
  }
  return progress[deckId];
}

function countMastered(deck) {
  const saved = progress[deck.id];
  if (!saved) return 0;
  return deck.cards.filter((card) => (saved.streaks[card.en] || 0) >= MASTERY_STREAK).length;
}

// ===========================================================
// Answer checking
// ===========================================================

// Tidy up text so small differences don't matter:
// lower case, curly apostrophes → straight, no punctuation, single spaces.
function tidy(text) {
  return text
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/\s*'\s*/g, "'")          // "l' école" → "l'école"
    .replace(/[.,!?;:"«»()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Remove accents (é → e, ç → c, œ → oe) and treat hyphens as spaces.
// Used for the forgiving comparison.
function relaxed(text) {
  return tidy(text)
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Remove a leading article, so we can spot "gare" or "le gare" for "la gare".
const ARTICLE = /^(?:(?:le|la|les|un|une|des)\s+|l')/;

function withoutArticle(text) {
  return text.replace(ARTICLE, '');
}

// Compares what the learner typed with a card's accepted answers.
// Returns { result, match } where result is one of:
//   'correct' – exactly right
//   'accent'  – right apart from accents / hyphens (still counts as correct)
//   'article' – right word, wrong or missing article (counts as wrong)
//   'wrong'   – not right
function checkAnswer(typed, card) {
  const typedTidy = tidy(typed);
  const typedRelaxed = relaxed(typed);

  for (const answer of card.fr) {
    if (tidy(answer) === typedTidy) return { result: 'correct', match: answer };
  }

  for (const answer of card.fr) {
    if (relaxed(answer) === typedRelaxed) return { result: 'accent', match: answer };
  }

  for (const answer of card.fr) {
    const answerRelaxed = relaxed(answer);
    const hasArticle = ARTICLE.test(answerRelaxed);
    if (hasArticle && withoutArticle(answerRelaxed) === withoutArticle(typedRelaxed)) {
      return { result: 'article', match: answer };
    }
  }

  return { result: 'wrong', match: card.fr[0] };
}

// ===========================================================
// Screens
// ===========================================================

function showView(name) {
  Object.entries(views).forEach(([key, view]) => {
    view.hidden = key !== name;
  });
  window.scrollTo(0, 0);
}

// ---------- Home screen ----------

function renderHome() {
  deckGrid.innerHTML = '';

  DECKS.forEach((deck) => {
    const total = deck.cards.length;
    const mastered = countMastered(deck);
    const best = progress[deck.id] ? progress[deck.id].best : 0;
    const percent = Math.round((mastered / total) * 100);

    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'deck-tile';
    tile.setAttribute('aria-label', `${deck.title}: ${mastered} of ${total} mastered. Start practising.`);
    tile.innerHTML = `
      <p class="deck-french"></p>
      <p class="deck-english"></p>
      <div class="progress-track">
        <div class="progress-fill ${mastered === total ? 'complete' : ''}" style="width: ${percent}%"></div>
      </div>
      <div class="deck-stats">
        <span><strong>${mastered}/${total}</strong> mastered</span>
        <span>Best: <strong>${best ? `${best}/${total}` : '–'}</strong></span>
      </div>
      <span class="deck-cta">${mastered || best ? 'Continue' : 'Start'} →</span>
    `;
    tile.querySelector('.deck-french').textContent = deck.french;
    tile.querySelector('.deck-english').textContent = deck.title;
    tile.addEventListener('click', () => startDeck(deck.id));

    deckGrid.appendChild(tile);
  });

  showView('home');
}

// ---------- Practice session ----------

let session = null;

// Shuffle a list into random order (Fisher–Yates shuffle).
function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startDeck(deckId) {
  const deck = DECKS.find((d) => d.id === deckId);

  session = {
    deck,
    queue: shuffle(deck.cards), // cards still to answer; missed cards go back on the end
    total: deck.cards.length,
    seen: new Set(),            // cards already attempted once
    finished: 0,                // cards answered correctly (on any attempt)
    firstTryCorrect: 0,         // the score
    missed: [],                 // cards wrong on the first try
    current: null,
    isFirstAttempt: true,
    answered: false             // true while feedback is showing
  };

  el('deck-label').textContent = deck.title;
  showView('practice');
  showNextCard();
}

function showNextCard() {
  if (session.queue.length === 0) {
    finishSession();
    return;
  }

  session.current = session.queue.shift();
  session.isFirstAttempt = !session.seen.has(session.current.en);
  session.answered = false;

  // Card text and counter
  el('prompt').textContent = session.current.en;
  el('review-tag').hidden = session.isFirstAttempt;

  if (session.isFirstAttempt) {
    el('counter').textContent = `Card ${session.seen.size + 1} of ${session.total}`;
  } else {
    el('counter').textContent = `Reviewing missed cards · ${session.queue.length + 1} left`;
  }

  updateSessionBar();

  // Replay the card's entrance animation
  const card = el('flashcard');
  card.style.animation = 'none';
  void card.offsetWidth;
  card.style.animation = '';

  // Reset the answer area
  answerInput.value = '';
  answerInput.readOnly = false;
  answerInput.className = '';
  feedbackBox.hidden = true;
  feedbackBox.innerHTML = '';
  checkBtn.textContent = 'Check';
  dontKnowBtn.disabled = false;
  setAccentButtonsEnabled(true);
  answerInput.focus();
}

function updateSessionBar() {
  const percent = (session.finished / session.total) * 100;
  el('session-bar').style.width = `${percent}%`;
}

// Called by the Check button / Enter key.
function handleSubmit(event) {
  event.preventDefault();

  // Feedback is showing, so Enter / the button means "next card".
  if (session.answered) {
    showNextCard();
    return;
  }

  if (tidy(answerInput.value) === '') {
    // Nothing typed: give the box a little shake.
    answerInput.classList.remove('shake');
    void answerInput.offsetWidth;
    answerInput.classList.add('shake');
    answerInput.focus();
    return;
  }

  const outcome = checkAnswer(answerInput.value, session.current);
  recordAnswer(outcome.result === 'correct' || outcome.result === 'accent');
  showFeedback(outcome, answerInput.value);
}

function handleDontKnow() {
  if (session.answered) return;
  recordAnswer(false);
  showFeedback({ result: 'dontknow', match: session.current.fr[0] }, '');
}

// Updates the score, the queue and the saved streak for the current card.
function recordAnswer(isCorrect) {
  const card = session.current;
  const saved = getDeckProgress(session.deck.id);

  if (session.isFirstAttempt) {
    session.seen.add(card.en);

    if (isCorrect) {
      session.firstTryCorrect++;
      saved.streaks[card.en] = (saved.streaks[card.en] || 0) + 1;
    } else {
      session.missed.push(card);
    }
  }

  // Any wrong answer resets the streak for that card.
  if (!isCorrect) {
    saved.streaks[card.en] = 0;
    session.queue.push(card); // try it again at the end
  } else {
    session.finished++;
  }

  saveProgress();
  updateSessionBar();
}

// Builds the coloured message under the answer box.
function showFeedback(outcome, typed) {
  const card = session.current;
  const lines = {
    correct:  { style: 'correct', title: 'Correct!' },
    accent:   { style: 'accent',  title: 'Correct! Just watch the spelling:' },
    article:  { style: 'wrong',   title: 'Almost! Check the article:' },
    wrong:    { style: 'wrong',   title: 'Not quite. The answer is:' },
    dontknow: { style: 'wrong',   title: 'The answer is:' }
  }[outcome.result];

  // Extra details: other accepted answers, gender notes, what was typed.
  const extras = [];
  const others = card.fr.filter((answer) => answer !== outcome.match);
  if (others.length) extras.push(`Also accepted: ${others.join(', ')}`);
  if (card.note) extras.push(card.note);
  if (outcome.result === 'wrong' && typed) extras.push(`You wrote: ${typed.trim()}`);

  feedbackBox.className = `feedback ${lines.style}`;
  feedbackBox.innerHTML = '';
  addLine(feedbackBox, 'fb-title', lines.title);
  addLine(feedbackBox, 'fb-answer', outcome.match);
  extras.forEach((text) => addLine(feedbackBox, 'fb-extra', text));
  feedbackBox.hidden = false;

  // Lock the answer and switch the button to "Next".
  session.answered = true;
  answerInput.readOnly = true;
  answerInput.className = lines.style;
  dontKnowBtn.disabled = true;
  setAccentButtonsEnabled(false);
  checkBtn.textContent = session.queue.length === 0 ? 'See results →' : 'Next →';
  checkBtn.focus();
}

// Adds a <p> with safe text (textContent never runs HTML).
function addLine(parent, className, text) {
  const p = document.createElement('p');
  p.className = className;
  p.textContent = text;
  parent.appendChild(p);
}

// ---------- Summary screen ----------

function finishSession() {
  const { deck, total, firstTryCorrect, missed } = session;
  const saved = getDeckProgress(deck.id);
  const isNewBest = firstTryCorrect > saved.best;

  if (isNewBest) {
    saved.best = firstTryCorrect;
    saveProgress();
  }

  const percent = firstTryCorrect / total;
  let title = 'Courage !';
  if (percent === 1) title = 'Parfait !';
  else if (percent >= 0.8) title = 'Excellent !';
  else if (percent >= 0.6) title = 'Bien joué !';
  else if (percent >= 0.4) title = 'Pas mal !';

  const mastered = countMastered(deck);

  el('summary-deck').textContent = deck.title;
  el('summary-title').textContent = title;
  el('score').textContent = `${firstTryCorrect}/${total}`;
  el('score-detail').textContent =
    `correct on the first try${isNewBest && saved.best > 0 ? ' · new best!' : ''} · ` +
    `${mastered}/${total} cards mastered`;

  const list = el('missed-list');
  list.innerHTML = '';
  missed.forEach((card) => {
    const li = document.createElement('li');
    const en = document.createElement('span');
    const fr = document.createElement('span');
    en.className = 'en';
    fr.className = 'fr';
    en.textContent = card.en;
    fr.textContent = card.fr[0];
    li.append(en, fr);
    list.appendChild(li);
  });
  el('missed-wrap').hidden = missed.length === 0;

  showView('summary');
  el('again-btn').focus();
}

// ===========================================================
// Accent buttons
// ===========================================================

function buildAccentButtons() {
  ACCENTS.forEach((letter) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'accent-btn';
    btn.textContent = letter;
    btn.setAttribute('aria-label', `Insert ${letter}`);

    // Stop the button from stealing focus, so the cursor stays in the box.
    btn.addEventListener('mousedown', (event) => event.preventDefault());
    btn.addEventListener('click', () => insertAtCursor(letter));

    accentRow.appendChild(btn);
  });
}

function insertAtCursor(text) {
  if (answerInput.readOnly) return;
  const start = answerInput.selectionStart ?? answerInput.value.length;
  const end = answerInput.selectionEnd ?? answerInput.value.length;
  answerInput.setRangeText(text, start, end, 'end');
  answerInput.focus();
}

function setAccentButtonsEnabled(enabled) {
  accentRow.querySelectorAll('button').forEach((btn) => {
    btn.disabled = !enabled;
  });
}

// ===========================================================
// Wire everything up
// ===========================================================

answerForm.addEventListener('submit', handleSubmit);
dontKnowBtn.addEventListener('click', handleDontKnow);

el('quit-btn').addEventListener('click', renderHome);
el('home-btn').addEventListener('click', renderHome);
el('again-btn').addEventListener('click', () => startDeck(session.deck.id));

el('logo-link').addEventListener('click', (event) => {
  event.preventDefault();
  renderHome();
});

el('reset-btn').addEventListener('click', () => {
  if (confirm('Reset all progress? Your mastered cards and best scores will be cleared.')) {
    progress = {};
    saveProgress();
    renderHome();
  }
});

buildAccentButtons();
renderHome();
