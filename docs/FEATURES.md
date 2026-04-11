# RESQ Feature List

## User Features

- Local-first conversion from messy text to Markdown
- Live rendered preview with GitHub Flavored Markdown support
- Markdown, HTML, and PDF export
- One-click copy to clipboard
- Optional Ollama enhancement for AI-assisted cleanup
- Separate Ollama popup so the main UI stays simple
- Quick enhance button for fast AI cleanup
- Desktop app packaging for macOS
- Multiple UI themes

## Parsing Features

- Header detection from explicit Markdown
- Bold, italic, strikethrough, inline code, links, and images
- Fenced code block handling with language detection
- Blockquote and rule handling
- Ordered and unordered list handling
- Smart quote normalization
- Paragraph spacing cleanup

## Structure Rescue Features

- Title inference from the first meaningful line
- Section detection from labels like `summary`, `notes`, `next steps`, and `quote`
- Metadata grouping into Markdown tables
- Task list detection from `todo`, `done`, and checkbox-style lines
- Sequence grouping for labels like `phase 1`, `phase 2`, `step 1`
- Command block promotion into fenced code
- Pipe-table normalization
- Quote extraction and blockquote formatting

## Desktop Features

- Electron wrapper around the existing Vite app
- Packaged local app build for macOS
- Custom app icon based on `Image 2.png`
- External-link safety handling in the desktop shell
