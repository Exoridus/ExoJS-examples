# ExoJS Examples

This repository contains the interactive example browser for ExoJS. It bundles a set of small demos, shows the source code in an in-browser editor, and renders the selected example in a live preview frame.

Live site: https://exoridus.github.io/ExoJS-examples/

The app is built so it can be hosted from a subfolder, and the published `dist/` output is what gets deployed to GitHub Pages.

## What This Project Includes

- A small example explorer UI built with Lit components and Astro
- A live code editor and preview for each example
- Local vendored browser assets for `exojs`, Monaco, and `stats.min.js`
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
npm run preview
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

## Backend Policy

- Normal examples outside `webgpu/` rely on ExoJS default backend selection.
- Routes under `webgpu/` stay explicit about `backend: { type: 'webgpu' }` because backend choice is part of the example’s purpose.
- Advanced backend-specific examples remain explicit and honest; they do not hide behind the default path.

## Examples

### Rendering

- [Sprite](https://exoridus.github.io/ExoJS-examples/#rendering/sprite.js)
- [Spritesheet](https://exoridus.github.io/ExoJS-examples/#rendering/spritesheet.js)
- [Container](https://exoridus.github.io/ExoJS-examples/#rendering/container.js)
- [Blend Modes](https://exoridus.github.io/ExoJS-examples/#rendering/blendmodes.js)
- [Tinted Sprites](https://exoridus.github.io/ExoJS-examples/#rendering/tinted-sprites.js)
- [View Handling](https://exoridus.github.io/ExoJS-examples/#rendering/view-handling.js)
- [Render to Texture](https://exoridus.github.io/ExoJS-examples/#rendering/render-to-texture.js)
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

- [Audio Visualization](https://exoridus.github.io/ExoJS-examples/#extras/audio-visualisation.js)
- [Benchmark](https://exoridus.github.io/ExoJS-examples/#extras/benchmark.js)


### WebGPU

- [Additive Particles](https://exoridus.github.io/ExoJS-examples/#webgpu/additive-particles.js)
- [Multi-Texture Sprite Stress](https://exoridus.github.io/ExoJS-examples/#webgpu/multi-texture-sprite-stress.js)
- [Particle Stress](https://exoridus.github.io/ExoJS-examples/#webgpu/particle-stress.js)
- [Sprite Stress](https://exoridus.github.io/ExoJS-examples/#webgpu/sprite-stress.js)
- [Video Basics](https://exoridus.github.io/ExoJS-examples/#webgpu/video-basics.js)
- [RenderTexture Basics](https://exoridus.github.io/ExoJS-examples/#webgpu/rendertexture-basics.js)
- [Graphics Basics](https://exoridus.github.io/ExoJS-examples/#webgpu/graphics-basics.js)
- [Particle Basics](https://exoridus.github.io/ExoJS-examples/#webgpu/particle-basics.js)
- [Sprite Basics](https://exoridus.github.io/ExoJS-examples/#webgpu/sprite-basics.js)
- [Text Basics](https://exoridus.github.io/ExoJS-examples/#webgpu/text-basics.js)
- [Custom Triangle Renderer](https://exoridus.github.io/ExoJS-examples/#webgpu/custom-triangle-renderer.js)

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
