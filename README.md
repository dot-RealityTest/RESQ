# 🆘 RESQ

> **Rescue messy text into clean Markdown — fast.** Turn OCR output, copied docs, and rough notes into structured, readable Markdown in seconds.

[![Download](https://img.shields.io/badge/Download-macOS%20.dmg-0c8ce9?style=for-the-badge&logo=apple)](https://github.com/dot-RealityTest/RESQ/releases/latest/download/RESQ-0.0.0-arm64.dmg)
[![Releases](https://img.shields.io/github/v/release/dot-RealityTest/RESQ?style=for-the-badge&logo=github)](https://github.com/dot-RealityTest/RESQ/releases/latest)
[![Website](https://img.shields.io/badge/Website-akakika.com/resq-38bdf8?style=for-the-badge&logo=vercel)](https://akakika.com/resq/)
[![License](https://img.shields.io/badge/License-Private-blue?style=for-the-badge)](LICENSE)

---

## 🌐 Live

**Website:** [https://akakika.com/resq/](https://akakika.com/resq/)  
**Latest Release:** [Download RESQ for macOS](https://github.com/dot-RealityTest/RESQ/releases/latest/download/RESQ-0.0.0-arm64.dmg)

---

## 💡 The Problem

Messy text slows everything down.

You paste in OCR output and spend twenty minutes fixing headings. You copy notes from another tool and lose the structure. You have useful content, but it's trapped inside formatting chaos.

Manual cleanup is tedious. AI tools are slow and require internet. You just want your text fixed **now**.

---

## ✨ The Solution

**RESQ** fixes that instantly. Paste in rough text, click convert, and get clean Markdown with:

- ✅ Automatic heading detection
- ✅ Task lists recovered from bullet points
- ✅ Code blocks identified and formatted
- ✅ Quotes and metadata preserved
- ✅ Tables reconstructed
- ✅ Logical section breaks added

All **local-first**, **fast**, and **private**.

---

## 🚀 Quick Start

### Download & Install

1. **[Download the latest macOS .dmg](https://github.com/dot-RealityTest/RESQ/releases/latest/download/RESQ-0.0.0-arm64.dmg)**
2. Open the `.dmg` file
3. Drag RESQ to your Applications folder
4. Launch and start rescuing text!

### Or Run Locally

```bash
# Clone the repository
git clone https://github.com/dot-RealityTest/RESQ.git
cd RESQ

# Install dependencies
npm install

# Start development server (web mode)
npm run dev

# Desktop app development (Electron)
npm run desktop:dev

# Build for production
npm run build

# Build desktop distributable
npm run desktop:dist
```

---

## 🎯 What RESQ Does

| Feature | Description |
|---------|-------------|
| **📝 Structure Recovery** | Detects headings, lists, code blocks, quotes, and tables from messy input |
| **⚡ Instant Conversion** | One-click conversion with live preview |
| **📤 Multiple Exports** | Export to Markdown (.md), HTML (.html), or PDF |
| **🔒 Local-First** | All processing happens on your machine — no data leaves your device |
| **🤖 Optional AI Polish** | Send rescued draft to local Ollama for final refinement (optional) |
| **🎨 Clean UI** | Minimal, focused interface designed for speed |

---

## 📋 Perfect For

### OCR Output
- Scanned documents that need to become editable
- Screenshots with text that needs extraction
- PDF-to-text conversions with broken formatting

### Meeting Notes
- Raw transcription dumps from recording tools
- Quick notes that need to be shareable
- Brainstorming sessions that need structure

### Research & Study
- Academic paper excerpts with formatting issues
- Lecture notes copied from multiple sources
- Literature review fragments that need organization

### Technical Work
- Command-line output that needs documentation
- Log files that need to be readable
- API responses that need formatting
- Code snippets mixed with explanations

### Content Creation
- Blog post drafts from voice memos
- Social media content from rough notes
- Email drafts that need polishing

---

## 🎬 How It Works

### 1️⃣ Paste Your Messy Text

Drop in anything: OCR output, copied web content, rough notes, transcription dumps.

### 2️⃣ Click Convert

RESQ analyzes the text structure and rebuilds it as clean Markdown.

### 3️⃣ Review & Edit

Preview the rescued Markdown. Make quick edits if needed.

### 4️⃣ Export or Copy

- **Copy** to clipboard for immediate use
- **Export** as `.md`, `.html`, or `.pdf`
- **Polish** with optional Ollama AI pass

That's it. Less cleanup, more usable output.

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript** — Modern, type-safe UI
- **Vite** — Fast dev server and optimized builds
- **Tailwind CSS v4** — Clean, responsive design
- **Electron** — Cross-platform desktop app
- **Lucide Icons** — Beautiful, consistent iconography
- **React Markdown** — Markdown rendering
- **html2pdf** — PDF export functionality
- **Ollama Integration** — Optional local AI polish

---

## 🔧 For Developers

### Project Structure

```
RESQ/
├── src/
│   ├── components/       # React components
│   ├── lib/
│   │   ├── markdownParser.ts    # Structure detection logic
│   │   ├── markdownRescue.ts    # Main conversion engine
│   │   └── ollama.ts            # Optional AI integration
│   ├── App.tsx
│   └── main.tsx
├── electron/
│   └── main.mjs          # Electron main process
├── docs/
│   ├── FEATURES.md       # Complete feature list
│   ├── HOW_TO.md         # Usage guide
│   └── MARKETING_COPY.md # Marketing materials
├── public/
├── assets/
└── package.json
```

### Key Scripts

```bash
# Development
npm run dev              # Web dev server
npm run desktop:dev      # Electron desktop app

# Building
npm run build            # Build web app
npm run desktop:build    # Build Electron app (unpacked)
npm run desktop:dist     # Build distributable (.dmg, .exe, etc.)

# Quality
npm run lint             # TypeScript type checking
npm test                 # Run unit tests
```

### Testing

```bash
# Run all tests
npm test

# Test specific modules
node --test src/lib/markdownParser.test.ts
node --test src/lib/markdownRescue.test.ts
node --test src/lib/ollama.test.ts
```

---

## 🤖 Optional AI Polish

RESQ works great standalone. If you have **Ollama** running locally:

1. Rescue your text with RESQ
2. Click "Polish with AI"
3. Choose a local model (e.g., `llama3.2`, `mistral`)
4. Get refined phrasing and cleaner flow

**No internet required. No data sent to cloud.** Everything stays local.

---

## 📚 Documentation

- **[Feature List](docs/FEATURES.md)** — Complete list of all features
- **[How-To Guide](docs/HOW_TO.md)** — Step-by-step usage instructions
- **[Marketing Copy](docs/MARKETING_COPY.md)** — Product descriptions and messaging

---

## 🎯 Why RESQ Feels Different

RESQ is not trying to be a giant writing suite.

It's focused on **one job**: taking text that is frustrating to work with and making it useful again.

- **Local-first** → Fast and private
- **Structure rescue** → Does the tedious work automatically
- **No bloat** → Just what you need, nothing extra
- **Optional AI** → Works great without it, better with it if you want

---

## 📥 Downloads

### macOS (Apple Silicon)
- **[Download .dmg](https://github.com/dot-RealityTest/RESQ/releases/latest/download/RESQ-0.0.0-arm64.dmg)** — Latest release

### All Releases
- **[View Release History](https://github.com/dot-RealityTest/RESQ/releases)** — All versions and platforms

---

## 🙋 FAQ

**Q: Is RESQ free?**  
A: Yes, RESQ is completely free to use.

**Q: Does it require internet?**  
A: No! RESQ is local-first. All text processing happens on your machine. Internet is only needed if you optionally use Ollama AI polish (and even then, only if your Ollama instance is remote).

**Q: What formats can I export to?**  
A: Markdown (.md), HTML (.html), and PDF.

**Q: Can I use RESQ on Windows or Linux?**  
A: Currently macOS-only. Windows and Linux builds coming soon.

**Q: What about privacy?**  
A: Your text never leaves your device unless you explicitly choose to use the optional AI polish feature.

---

## 👨‍💻 Author

**KIKA** — Digital craft and macOS systems

- **Website:** https://akakika.com
- **Twitter:** [@Kika_Loren](https://twitter.com/Kika_Loren)
- **GitHub:** https://github.com/dot-RealityTest

---

## 📄 License

**Private** — All rights reserved to KIKA.

---

## 🗺️ Roadmap

- [ ] Windows support
- [ ] Linux support
- [ ] Batch processing (multiple files)
- [ ] Custom conversion rules
- [ ] Plugin system for custom parsers
- [ ] Cloud sync (optional)
- [ ] Mobile app (iOS/Android)

---

**Built with ❄️ by KIKA**  
**Last Updated:** May 2, 2026
