# How to update OMI LANKA

This folder is the **editable source** of your game. Your GitHub repo only holds the 3 *built* files (`worker.js`, `wrangler.jsonc`, `package.json`). Never edit `worker.js` directly: change the files here, rebuild, and upload the new `worker.js`.

Keep this zip somewhere safe (Google Drive, your computer). You need it for every future update.

---

## Way 1: Ask Claude (no tools needed)

1. Start a chat with Claude and upload **omi-lanka-source.zip**.
2. Say what you want changed, e.g. "make the table blue", "add these jokes", "use this logo" (attach images).
3. Claude gives you back a new `worker.js` (and an updated source zip; keep that one from then on).
4. Upload it to GitHub (see **Uploading an update** below).

## Way 2: Do it yourself

**One-time setup**
1. Install **Node.js LTS** from https://nodejs.org.
2. Install **Visual Studio Code** from https://code.visualstudio.com (a free editor).
3. Unzip this project, then in VS Code use **File → Open Folder** and pick it.
4. **Terminal → New Terminal**, then type `npm install` and press Enter.

**Every update**
1. Edit the files (see the map below) and save.
2. In the terminal run `npm run build`.
3. Optional preview: run `npm run dev` and open http://localhost:8787. Press Ctrl+C to stop.
4. Upload the files from the new **upload** folder (see below).

---

## Where things are

Use **Ctrl+F** (Cmd+F on Mac) with the search text shown.

| You want to change | File | Search for |
|---|---|---|
| Main colours (emerald, navy, yellow, orange, coral) | `public/css/app.css` | `--emerald` (first lines) |
| Table felt colour | `public/css/app.css` | `.felt{` |
| Card back design | `public/css/app.css` | `.card.back` |
| Court cards (J, Q, K artwork) | `public/js/app.js` | `function courtSVG` |
| Home screen logo / layout | `public/index.html` | `class="logo"` |
| Welcome messages | `public/js/app.js` | `welcome:[` (one each for Sinhala, Singlish, English) |
| Button and menu text | `public/js/app.js` | the text itself, e.g. `ගේම පටන් ගමු` |
| Funny comments | `public/js/app.js` | `const C={` (each line is `['Sinhala','Singlish','English']`) |
| Reaction labels | `public/js/app.js` | `reacts:{` |
| Avatar drawings and colours | `public/js/app.js` | `const AV={` and `const AVBG=` |
| Bot names | `public/js/app.js` **and** `src/engine.js` | `const BOTS=[` (keep the same number of bots, in the same order, in both files) |
| In-game rules text | `public/js/app.js` | `rulesBody:` |
| Google title and description | `public/index.html` | `<title>` and `name="description"` |
| How-to-play pages | `public/how-to-play/index.html`, `public/en/how-to-play/index.html` | |
| App icons | `public/icons/` | replace with PNGs of the **same name and size** |
| Share preview image (WhatsApp/Facebook) | `public/og-image.png` | replace with a 1200 × 630 PNG |

Icon sizes: `icon-192.png` 192×192, `icon-512.png` 512×512, `icon-maskable-512.png` 512×512 (keep the important part in the middle 80%), `apple-touch-icon.png` 180×180, `favicon-32.png` 32×32.

Text tips: keep the quotes around text (`'like this'`), and don't delete commas or brackets. If the build or the game breaks after an edit, undo it (Ctrl+Z) and try again.

Game rules and scoring live in `src/engine.js` (online games) and `public/js/app.js` (offline bots mode). They must stay identical, so ask Claude for rule changes.

---

## Uploading an update

1. On GitHub, open your repo → **Add file → Upload files**.
2. Click **choose your files** and select **worker.js** from the `upload` folder. Also select `wrangler.jsonc` / `package.json` only if Claude says they changed.
3. Click **Commit changes**. Files with the same name are replaced.
4. Cloudflare redeploys automatically in about a minute (Worker → **Deployments** shows progress).
5. Open your site and refresh. Phones that installed the app pick up the new version on their next visit (the build stamps a new version number automatically).

**Note:** a deploy restarts the game hub, so games in progress end (stats are kept). Upload when few people are playing.

## If something goes wrong

- **Undo instantly:** Cloudflare → your Worker → **Deployments** → pick the previous one → **Rollback**.
- Or on GitHub, upload your previous `worker.js` again.
- Build log or deploy error? Send Claude a screenshot.
