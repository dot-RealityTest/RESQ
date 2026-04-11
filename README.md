# RESQ

RESQ turns messy text into clean Markdown fast.

It is built for the moments when you have something useful trapped inside ugly input: OCR output, copied docs, rough meeting notes, half-structured research, or raw drafts that should be readable already.

## Download

[Download the latest macOS `.dmg`](https://github.com/dot-RealityTest/RESQ/releases/latest/download/RESQ-0.0.0-arm64.dmg)

Prefer browsing the release page first?

[Open the latest release](https://github.com/dot-RealityTest/RESQ/releases/latest)

## Why RESQ

Most text cleanup tools make you do the boring part by hand.

RESQ is designed to rescue structure automatically so you can move from chaos to something usable in one pass. Paste in rough text, let RESQ recover headings, tasks, quotes, metadata, and command blocks, then export the result as clean Markdown, HTML, or PDF.

The goal is simple: spend less time fixing formatting and more time using the content.

## What It Helps With

- OCR output that lost its shape
- Meeting notes that need to become shareable
- Technical notes that should be readable Markdown
- Rough drafts that need structure before polishing
- Copied text from tools that export badly

## What You Get

- Local-first cleanup with no cloud dependency required for the main workflow
- Smart structure rescue for titles, sections, task lists, tables, quotes, and commands
- Live preview before you export
- Export to Markdown, HTML, or PDF
- Optional Ollama enhancement when you want a final local polish pass
- A focused macOS desktop app experience

## How It Feels

1. Paste in messy text.
2. Click `Convert`.
3. Watch RESQ turn it into readable Markdown.
4. Copy it, export it, or send it through one more cleanup pass.

It is fast, local, and built to make ugly text usable again.

## Optional AI Polish

RESQ works on its own.

If you already run Ollama locally, you can use it for a softer cleanup pass after the structure is rescued. That keeps the core workflow deterministic, while still giving you an easy way to refine wording when you want it.

## For Developers

If you want to run or modify RESQ locally:

```bash
npm install
npm run dev
```

Desktop development:

```bash
npm run desktop:dev
```

Validation:

```bash
npm test
npm run lint
npm run build
```

More detail:

- [Feature list](docs/FEATURES.md)
- [How-to guide](docs/HOW_TO.md)
- [Marketing copy](docs/MARKETING_COPY.md)
