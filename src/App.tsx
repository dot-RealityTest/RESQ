import { useEffect, useState } from "react";
import { Download, ExternalLink, FileCode2, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SiteConfig {
  downloadLabel: string;
  downloadMeta: string;
  downloadUrl: string;
}

const defaultSiteConfig: SiteConfig = {
  downloadLabel: "Download for macOS",
  downloadMeta: "Hosted from GitHub Releases",
  downloadUrl: "https://github.com/dot-RealityTest/apps/releases",
};

const landingSource = `# RESQ

RESQ is a local-first text rescue tool that turns messy notes, OCR output, and rough drafts into clean Markdown.

## Why RESQ

- Convert unstructured text into readable Markdown quickly
- Keep the main cleanup flow local and deterministic
- Preview the result before exporting
- Export clean \`.md\`, \`.html\`, and \`.pdf\` files
- Optionally use a local Ollama model for an AI polish pass

## Core Features

- Rules-based Markdown parser for headers, emphasis, quotes, lists, links, images, code, and spacing
- Heuristic structure rescue for titles, sections, metadata tables, task lists, command blocks, quotes, and timelines
- Local-first conversion flow with no cloud dependency required
- Optional Ollama enhancement in a dedicated popup window
- Desktop app shell for a focused writing and cleanup workflow

## Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

## Desktop Build

- Build distributables with \`npm run desktop:dist\`
- Packaged desktop builds are written to \`release/\`
- Current local artifact: \`RESQ-0.0.0-arm64.dmg\`
`;

export default function App() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);

  useEffect(() => {
    let isMounted = true;

    fetch("./site-config.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load site config: ${response.status}`);
        }

        return response.json() as Promise<Partial<SiteConfig>>;
      })
      .then((config) => {
        if (!isMounted) {
          return;
        }

        setSiteConfig({
          downloadLabel: config.downloadLabel || defaultSiteConfig.downloadLabel,
          downloadMeta: config.downloadMeta || defaultSiteConfig.downloadMeta,
          downloadUrl: config.downloadUrl || defaultSiteConfig.downloadUrl,
        });
      })
      .catch(() => {
        if (isMounted) {
          setSiteConfig(defaultSiteConfig);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="page-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="topbar">
        <div className="brand-block">
          <img
            className="brand-icon"
            src="/icon.png"
            alt="RESQ app icon"
            width="48"
            height="48"
          />
          <div className="brand-copy">
            <p className="brand-name">RESQ</p>
            <p className="brand-tagline">
              Local-first Markdown rescue for messy notes, OCR, and copied docs.
            </p>
          </div>
        </div>

        <div className="topbar-actions">
          <nav className="nav-links" aria-label="Primary">
            <a href="#source">Input</a>
            <a href="#preview">Preview</a>
          </nav>
          <a
            className="download-link topbar-download"
            href={siteConfig.downloadUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Download size={14} aria-hidden="true" />
            {siteConfig.downloadLabel}
          </a>
        </div>
      </header>

      <main className="workspace" id="main-content">
        <section
          className="panel panel-source"
          id="source"
          aria-labelledby="source-heading"
        >
          <div className="panel-header">
            <div className="panel-label">
              <FileText size={14} aria-hidden="true" />
              <span id="source-heading">Raw Input</span>
            </div>
            <p className="panel-meta">Local-first markdown rescue</p>
          </div>

          <div className="workspace-note">
            <p className="workspace-title">Rescue messy text into clean Markdown.</p>
            <p className="workspace-copy">
              Paste rough notes, OCR scraps, or copied docs. RESQ keeps the
              cleanup flow local, previews the result, and exports a clean draft.
            </p>
            <p className="download-meta" id="download">
              {siteConfig.downloadMeta}
            </p>
            <a
              className="download-link inline-download"
              href={siteConfig.downloadUrl}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={16} aria-hidden="true" />
              {siteConfig.downloadLabel}
            </a>
          </div>

          <textarea
            className="source-block source-editor"
            defaultValue={landingSource}
            readOnly
            spellCheck={false}
            aria-label="RESQ source markdown"
          />
        </section>

        <section
          className="panel panel-preview"
          id="preview"
          aria-labelledby="preview-heading"
        >
          <div className="panel-header">
            <div className="panel-label">
              <FileCode2 size={14} aria-hidden="true" />
              <span id="preview-heading">Rendered Preview</span>
            </div>
          </div>

          <article className="markdown-preview">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{landingSource}</ReactMarkdown>
          </article>
        </section>
      </main>
    </div>
  );
}
