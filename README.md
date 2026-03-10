# ExoJS Examples

This repository contains the interactive example browser for ExoJS. It bundles a set of small demos, shows the source code in an in-browser editor, and renders the selected example in a live preview frame.

Live site: https://exoridus.github.io/ExoJS-examples/

The app is built so it can be hosted from a subfolder, and the published `dist/` output is what gets deployed to GitHub Pages.

## What This Project Includes

- A small example explorer UI built with Lit and MobX
- A live code editor and preview for each example
- Local vendored runtime assets such as `exo.bundle.js` and `stats.min.js`
- Smoke tests that verify the built `dist/` app opens correctly and loads the preview without runtime errors

## Local Development

Install dependencies:

```bash
npm install
```

Start the development build watcher:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the built `dist/` output locally:

```bash
npm run preview:dist
```

Run the smoke tests against the built site:

```bash
npm run test:dist
```

## Example URLs

Each example can be opened directly with a hash route in this format:

```text
https://exoridus.github.io/ExoJS-examples/#category/example-name.js
```

## Examples

### Rendering

- [Sprite](https://exoridus.github.io/ExoJS-examples/#rendering/sprite.js)
- [Spritesheet](https://exoridus.github.io/ExoJS-examples/#rendering/spritesheet.js)
- [Container](https://exoridus.github.io/ExoJS-examples/#rendering/container.js)
- [Blendmodes](https://exoridus.github.io/ExoJS-examples/#rendering/blendmodes.js)
- [Tinted Sprites](https://exoridus.github.io/ExoJS-examples/#rendering/tinted-sprites.js)
- [View Handling](https://exoridus.github.io/ExoJS-examples/#rendering/view-handling.js)
- [Render To Texture](https://exoridus.github.io/ExoJS-examples/#rendering/render-to-texture.js)
- [Display Text](https://exoridus.github.io/ExoJS-examples/#rendering/display-text.js)
- [Display Video](https://exoridus.github.io/ExoJS-examples/#rendering/display-video.js)
- [Display SVG](https://exoridus.github.io/ExoJS-examples/#rendering/display-svg.js)

### Input

- [Gamepad](https://exoridus.github.io/ExoJS-examples/#input/gamepad.js)

### Collision Detection

- [Rectangles](https://exoridus.github.io/ExoJS-examples/#collision-detection/rectangles.js)

### Particle System

- [Bonfire](https://exoridus.github.io/ExoJS-examples/#particle-system/bonfire.js)
- [Fireworks](https://exoridus.github.io/ExoJS-examples/#particle-system/fireworks.js)

### Extras

- [Audio Visualisation](https://exoridus.github.io/ExoJS-examples/#extras/audio-visualisation.js)
- [Benchmark](https://exoridus.github.io/ExoJS-examples/#extras/benchmark.js)

## Repository Structure

- `public/` contains the example sources, static assets, and preview HTML
- `src/` contains the example browser UI
- `dist/` contains the built deployable site
- `scripts/` contains vendor and asset sync helpers
- `tests/` contains the Playwright-backed smoke tests for the built app

## Deployment

GitHub Pages is published from the built `dist/` folder using:

```bash
npm run deploy
```

Repository: https://github.com/Exoridus/ExoJS-examples
