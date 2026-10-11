# Facet

Facet is a browser puzzle game about matching cut gems and building pressure. Swap neighboring stones to make runs of three or more. A clear strains the stones beside it; a fully flawed stone breaks with the next clear that touches it and scores double. Longer and crossing runs leave special cuts that can turn a small match into a wide chain.

## Run locally

```bash
npm ci
npm run dev
```

Open the URL Vite prints. The project has no backend and fetches no external assets.

## Production build

```bash
npm run build
npm run preview
```

`dist/` is a static site that can be served from an origin root or a subdirectory. The build bundles the committed art and audio in `public/assets/`; it does not regenerate them. `scripts/` holds the source programs used to author those assets.

## Controls

- **Mouse, pen, or touch:** Press a gem, drag or press onto an adjacent gem, and release to swap. Click the on-screen menu buttons and **PAUSE** control.
- **Arrow Up / Arrow Down:** Change the highlighted menu item.
- **Enter / Space:** Choose the highlighted item.
- **Escape / P:** Pause or resume. Escape also backs out of How to Play and Game Over.
- **M:** Mute or unmute.
- **Backquote:** Toggle the engine diagnostics overlay.

## Checks

```bash
npm run typecheck
npm run lint
npm run format
npm test
```
