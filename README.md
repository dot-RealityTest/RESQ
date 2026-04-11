# RESQ

Rescue messy text into clean Markdown.

RESQ is for the moment when your notes, OCR output, copied docs, or rough draft clearly contain something valuable, but the formatting is too broken to use. Instead of manually rebuilding structure line by line, RESQ turns the mess into readable Markdown in one fast, local-first flow.

## Get RESQ

[Download the latest macOS `.dmg`](https://github.com/dot-RealityTest/RESQ/releases/latest/download/RESQ-0.0.0-arm64.dmg)

[Open the latest release](https://github.com/dot-RealityTest/RESQ/releases/latest)

[Visit the website](https://akakika.com/resq/)

## Why People Want It

Messy text slows everything down.

You paste in OCR output and spend twenty minutes fixing headings. You copy notes from another tool and lose the structure. You have useful content, but it is trapped inside formatting chaos.

RESQ fixes that. Paste in rough text, click convert, and get a cleaner Markdown draft with sections, tasks, quotes, metadata, and code blocks recovered automatically.

## What RESQ Does

- Turns rough notes into readable Markdown fast
- Recovers structure from OCR scraps and copy-pasted text
- Lets you preview the result before exporting
- Exports to Markdown, HTML, or PDF
- Keeps the core workflow local and fast
- Adds optional Ollama polish when you want a final refinement pass

## Perfect For

- OCR output that needs to become usable
- Meeting notes that should be shareable in minutes
- Research dumps that need structure
- Technical notes with commands, snippets, and lists
- Raw text exports that are too ugly to work with directly

## The Experience

1. Paste your messy text.
2. Click `Convert`.
3. Review the rescued Markdown.
4. Copy it, export it, or polish it further.

That is the whole point of RESQ: less cleanup, more usable output.

## Why It Feels Different

RESQ is not trying to be a giant writing suite.

It is focused on one job: taking text that is frustrating to work with and making it useful again. The local-first approach keeps it fast and private, and the structure rescue layer does the tedious work most people normally do by hand.

## Optional AI Polish

RESQ works great on its own.

If you already use Ollama locally, you can send the rescued draft through one more polish pass for softer phrasing and cleaner flow without turning the core app into an AI-dependent workflow.

## For Developers

Run locally:

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
