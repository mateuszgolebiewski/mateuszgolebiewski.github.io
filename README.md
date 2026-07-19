# mateuszgolebiewski.github.io

A CV/portfolio site styled as an interactive terminal emulator (Catppuccin Mocha theme). Plain HTML/CSS/JS, no build step, no dependencies.

## Local development

Either works:

- Open `index.html` directly in a browser (double-click it).
- Or serve it locally: `python3 -m http.server 8000` from this directory, then visit `http://localhost:8000/`.

## Commands

Type `help` in the terminal for the full list. Highlights: `about`/`whoami`, `experience` (and `experience <n>` / `experience <slug>`), `education`, `certifications`/`certs`, `skills`, `contact`, `resume`/`download`, `clear`.

## Known simplification

The input model is append-only — there's no mid-line cursor repositioning (Left/Right/Home/End don't move a visual caret within the typed text). This is a deliberate scope cut for a CV-toy terminal; real caret-position-aware rendering would need much more code for a rarely-used feature.

## Deployment (GitHub Pages)

```
git init
git add .
git commit -m "Initial commit: terminal CV site"
git branch -M main
```

Create the GitHub repo named exactly `mateuszgolebiewski.github.io` (via the web UI, without auto-initializing a README/gitignore/license), then:

```
git remote add origin https://github.com/mateuszgolebiewski/mateuszgolebiewski.github.io.git
git push -u origin main
```

Or with the GitHub CLI in one step: `gh repo create mateuszgolebiewski.github.io --public --source=. --remote=origin --push`.

GitHub Pages auto-serves a `username.github.io` repo from `main` root — confirm under **Settings → Pages** that it shows "Deploy from a branch: main / (root)". No GitHub Actions workflow is needed since there's no build step.

The site will be live at `https://mateuszgolebiewski.github.io/` a minute or two after pushing.
