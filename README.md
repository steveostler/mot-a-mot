# Mot à Mot

A French vocabulary flashcard app for intermediate learners. You see a word in English and type it in French. Accents are forgiven, articles count, and progress is saved in your browser.

## Run it on your computer

You need [Node.js](https://nodejs.org) (version 18 or newer) installed.

```bash
npm install     # downloads Express (only needed the first time)
npm start       # starts the server
```

Then open http://localhost:3000 in your browser. Press `Ctrl + C` in the terminal to stop the server.

## Put it on GitHub

**Option A: GitHub Desktop (easiest)**
1. Open GitHub Desktop → **File → Add Local Repository** → choose this folder.
2. When it says this isn't a repository yet, click **create a repository**.
3. Click **Publish repository**. You can leave it public or make it private; Render works with both.

**Option B: the terminal**
1. Create a new, empty repository on github.com called `mot-a-mot`.
2. In this folder, run:
   ```bash
   git init
   git add .
   git commit -m "First version of Mot à Mot"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/mot-a-mot.git
   git push -u origin main
   ```

## Deploy on Render (free)

1. Sign in at [render.com](https://render.com) with your GitHub account.
2. Click **New → Web Service** and pick your `mot-a-mot` repository.
3. Use these settings:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. Click **Deploy Web Service**. After a minute or two, you'll get a link like `https://mot-a-mot.onrender.com`.

From then on, every time you push a change to GitHub, Render redeploys the site automatically.

> Free Render services go to sleep after about 15 minutes without visitors. The next visit wakes it up, which can take up to a minute. After that it's fast again.

## Project files

| File | What it does |
|------|--------------|
| `package.json` | Project details, the one dependency (Express) and the `npm start` command |
| `server.js` | A small Express server that sends the files in `public/` to the browser |
| `public/index.html` | The page structure: deck list, practice screen and results screen |
| `public/style.css` | The look: colours, fonts, layout and mobile styles |
| `public/decks.js` | All 120 flashcards. Edit this file to change or add words |
| `public/script.js` | The app logic: answer checking, sessions and saved progress |

## Adding or changing words

Open `public/decks.js`. Each card looks like this:

```js
{ en: 'the traffic jam', fr: ["l'embouteillage", 'le bouchon'], note: "l'embouteillage is masculine" },
```

- `en`: the English prompt. Keep it unique within its deck.
- `fr`: every French answer you'll accept. The first one is shown as the main answer.
- `note` (optional): extra info shown after answering, e.g. the gender of an *l'* noun.

If a French answer contains an apostrophe, wrap it in double quotes, like `"l'ail"`.
