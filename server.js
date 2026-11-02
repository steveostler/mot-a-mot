// Mot à Mot – a tiny Express server.
// Its only job is to send the files in the "public" folder to the browser.
// All of the app's logic runs in the browser (see public/script.js).

const express = require('express');
const path = require('path');

const app = express();

// Render (and most hosts) tell the app which port to use via the PORT
// environment variable. Locally we fall back to 3000.
const PORT = process.env.PORT || 3000;

// Serve index.html, style.css, script.js and decks.js from /public.
app.use(express.static(path.join(__dirname, 'public')));

// Anything else is a page that doesn't exist.
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Mot à Mot is running at http://localhost:${PORT}`);
});
