# RESQ

RESQ is a local-first text rescue tool that turns messy notes, OCR output, and rough drafts into clean Markdown. It runs as a Vite + React app in the browser and as a packaged Electron desktop app on macOS.

## Why RESQ

- Convert unstructured text into readable Markdown quickly
- Keep the main cleanup flow local and deterministic
- Preview the result before exporting
- Export clean `.md`, `.html`, and `.pdf` files
- Optionally use a local Ollama model for an AI polish pass

## Core Features

- Rules-based Markdown parser for headers, emphasis, quotes, lists, links, images, code, and spacing
- Heuristic structure rescue for titles, sections, metadata tables, task lists, command blocks, quotes, and timelines
- Local-first conversion flow with no cloud dependency required
- Optional Ollama enhancement in a dedicated popup window
- Desktop app shell for a focused writing and cleanup workflow
- Multiple visual themes for editing and preview

For a fuller feature breakdown, see [docs/FEATURES.md](/Users/kika_hub/_KIKA_MAIN/Projects/03_pre-ready/RESQ/docs/FEATURES.md).

## Quick Start

1. Install dependencies:
   `npm install`
2. Start the web app:
   `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000)

## Desktop App

1. Start the Electron app in development:
   `npm run desktop:dev`
2. Build a local packaged app:
   `npm run desktop:build`
3. Build distributables:
   `npm run desktop:dist`

Packaged desktop builds are written to `release/`.

## Validation

- Run tests:
  `npm test`
- Run typecheck:
  `npm run lint`
- Run production build:
  `npm run build`

## Project Structure

- [src/App.tsx](/Users/kika_hub/_KIKA_MAIN/Projects/03_pre-ready/RESQ/src/App.tsx): main UI
- [src/lib/markdownParser.ts](/Users/kika_hub/_KIKA_MAIN/Projects/03_pre-ready/RESQ/src/lib/markdownParser.ts): explicit Markdown parser
- [src/lib/markdownRescue.ts](/Users/kika_hub/_KIKA_MAIN/Projects/03_pre-ready/RESQ/src/lib/markdownRescue.ts): structure rescue heuristics
- [src/lib/ollama.ts](/Users/kika_hub/_KIKA_MAIN/Projects/03_pre-ready/RESQ/src/lib/ollama.ts): Ollama integration
- [electron/main.mjs](/Users/kika_hub/_KIKA_MAIN/Projects/03_pre-ready/RESQ/electron/main.mjs): desktop shell
- [docs/HOW_TO.md](/Users/kika_hub/_KIKA_MAIN/Projects/03_pre-ready/RESQ/docs/HOW_TO.md): usage guide
- [docs/FEATURES.md](/Users/kika_hub/_KIKA_MAIN/Projects/03_pre-ready/RESQ/docs/FEATURES.md): feature list
- [docs/MARKETING_COPY.md](/Users/kika_hub/_KIKA_MAIN/Projects/03_pre-ready/RESQ/docs/MARKETING_COPY.md): landing page and App Store copy

## Notes

- No API keys are required for the core parser and rescue flow
- Ollama is optional and only used when you choose AI enhancement
- The app icon source is [Image 2.png](/Users/kika_hub/_KIKA_MAIN/Projects/03_pre-ready/RESQ/Image%202.png)
