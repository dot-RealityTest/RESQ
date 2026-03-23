/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GoogleGenAI } from "@google/genai";
import { 
  Zap, 
  Moon, 
  Sun, 
  Terminal, 
  Palette, 
  Cloud, 
  Settings, 
  CheckCircle2, 
  Quote,
  Layout,
  Monitor,
  Heart,
  ExternalLink,
  Code2,
  Table as TableIcon,
  Loader2,
  Copy,
  Download,
  FileText,
  FileCode,
  FileDown
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Custom Icon wrapper for consistent geometric style
 */
const GeometricIcon = ({ icon: Icon, className, size = 18 }: { icon: any, className?: string, size?: number }) => (
  <Icon 
    size={size} 
    strokeWidth={2} 
    strokeLinecap="butt" 
    strokeLinejoin="miter" 
    className={cn("flex-shrink-0", className)} 
  />
);

type ThemeType = 'minimal-dark' | 'minimal-light' | 'ukiyo-e' | 'tech' | 'cyberpunk' | 'utilitarian' | 'kawaii';

interface ThemeStyles {
  container: string;
  header: string;
  editorBg: string;
  previewBg: string;
  button: string;
  card: string;
  text: string;
  accent: string;
  border: string;
  label: string;
  font: string;
}

const THEMES: Record<ThemeType, ThemeStyles> = {
  'minimal-dark': {
    container: 'bg-black text-white min-h-screen font-sans',
    header: 'border-b border-white/10 px-6 py-4 flex justify-between items-center',
    editorBg: 'bg-black border-r border-white/10',
    previewBg: 'bg-black',
    button: 'bg-white text-black hover:bg-gray-200 transition-colors px-6 py-2 rounded-md font-medium flex items-center gap-2',
    card: 'border border-white/20 p-6 rounded-lg',
    text: 'text-white/90',
    accent: 'text-white',
    border: 'border-white/10',
    label: 'text-xs uppercase tracking-widest text-white/50 font-bold mb-4',
    font: 'font-sans'
  },
  'minimal-light': {
    container: 'bg-white text-black min-h-screen font-sans',
    header: 'border-b border-black/5 px-6 py-4 flex justify-between items-center',
    editorBg: 'bg-white border-r border-black/5',
    previewBg: 'bg-white',
    button: 'bg-black text-white hover:bg-gray-800 transition-colors px-6 py-2 rounded-md font-medium flex items-center gap-2',
    card: 'border border-black/10 p-6 rounded-lg bg-gray-50/50',
    text: 'text-black/80',
    accent: 'text-black',
    border: 'border-black/5',
    label: 'text-xs uppercase tracking-widest text-black/40 font-bold mb-4',
    font: 'font-sans'
  },
  'ukiyo-e': {
    container: 'bg-[#1A2B4C] text-[#F5F5F0] min-h-screen font-serif relative overflow-hidden',
    header: 'border-b-4 border-[#C82333] px-6 py-4 flex justify-between items-center bg-[#1A2B4C] z-30 relative',
    editorBg: 'bg-[#1A2B4C] border-r-2 border-[#C82333]/30 relative bg-sakura/5',
    previewBg: 'bg-[#C82333]/5 backdrop-blur-sm bg-sakura/5',
    button: 'bg-[#C82333] text-white hover:bg-[#A01C29] transition-all px-6 py-2 rounded-sm font-serif italic flex items-center gap-2 shadow-lg',
    card: 'bg-[#1A2B4C]/80 border-2 border-[#C82333] p-6 rounded-sm relative overflow-hidden',
    text: 'text-[#F5F5F0]/90 leading-relaxed',
    accent: 'text-[#E9C46A] font-bold',
    border: 'border-[#C82333]/30',
    label: 'text-sm uppercase tracking-widest text-[#C82333] font-black mb-4 bg-[#E9C46A] px-2 py-0.5 inline-block',
    font: 'font-serif'
  },
  'tech': {
    container: 'bg-[#1E272E] text-[#D2DAE2] min-h-screen font-mono',
    header: 'bg-[#2F3640] border-b border-[#485460] px-6 py-4 flex justify-between items-center',
    editorBg: 'bg-[#1E272E] border-r border-[#485460]',
    previewBg: 'bg-[#2F3640]/50',
    button: 'bg-[#3498DB] text-white hover:bg-[#2980B9] transition-colors px-6 py-2 rounded-sm font-mono flex items-center gap-2 uppercase text-sm tracking-tighter',
    card: 'bg-[#1E272E] border border-[#3498DB]/30 p-6 rounded-sm',
    text: 'text-[#D2DAE2]/80',
    accent: 'text-[#3498DB]',
    border: 'border-[#485460]',
    label: 'text-xs text-[#3498DB] font-bold mb-4 flex items-center gap-2 before:content-["_"] before:w-2 before:h-2 before:bg-[#3498DB]',
    font: 'font-mono'
  },
  'cyberpunk': {
    container: 'bg-[#FFFF00] text-black min-h-screen font-sans font-black',
    header: 'bg-black text-[#FFFF00] px-6 py-4 flex justify-between items-center',
    editorBg: 'bg-[#1A1A1A] text-[#FFFF00] border-r-4 border-black',
    previewBg: 'bg-[#FFFF00]',
    button: 'bg-black text-[#FFFF00] hover:bg-gray-900 transition-all px-8 py-3 rounded-none font-black uppercase flex items-center gap-2 skew-x-[-10deg]',
    card: 'bg-transparent border-4 border-black p-6 rounded-none relative after:absolute after:bottom-[-8px] after:right-[-8px] after:w-full after:h-full after:bg-black after:z-[-1]',
    text: 'text-black',
    accent: 'text-black underline decoration-4',
    border: 'border-black',
    label: 'bg-black text-[#FFFF00] px-4 py-1 inline-block uppercase text-sm mb-4',
    font: 'font-sans'
  },
  'utilitarian': {
    container: 'bg-[#B2B2B2] text-[#1A1A1A] min-h-screen font-sans',
    header: 'bg-[#999999] border-b-2 border-[#666666] px-6 py-4 flex justify-between items-center',
    editorBg: 'bg-[#CCCCCC] border-r-2 border-[#666666]',
    previewBg: 'bg-[#B2B2B2]',
    button: 'bg-[#666666] text-white hover:bg-[#444444] transition-colors px-6 py-2 rounded-none font-bold flex items-center gap-2 uppercase text-sm',
    card: 'bg-[#999999] border-2 border-[#666666] p-6 rounded-none',
    text: 'text-[#1A1A1A]',
    accent: 'text-black font-black',
    border: 'border-[#666666]',
    label: 'bg-[#666666] text-white px-3 py-0.5 inline-block uppercase text-xs mb-4',
    font: 'font-sans'
  },
  'kawaii': {
    container: 'bg-[#FCE4EC] text-[#880E4F] min-h-screen font-sans',
    header: 'bg-[#F8BBD0] px-6 py-4 flex justify-between items-center rounded-b-[40px] shadow-sm',
    editorBg: 'bg-white/60 backdrop-blur-md border-r-4 border-[#F48FB1] rounded-l-[40px] m-4',
    previewBg: 'bg-[#E1BEE7]/60 backdrop-blur-md rounded-r-[40px] m-4',
    button: 'bg-[#F06292] text-white hover:bg-[#EC407A] transition-all px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-[0_4px_0_0_#C2185B] active:translate-y-1 active:shadow-none',
    card: 'bg-white/80 border-4 border-[#F48FB1] p-6 rounded-[30px] shadow-inner relative',
    text: 'text-[#880E4F]/80',
    accent: 'text-[#AD1457] font-black',
    border: 'border-[#F48FB1]/30',
    label: 'text-sm font-black text-[#F06292] mb-4 flex items-center gap-2',
    font: 'font-sans'
  }
};

const DEFAULT_MARKDOWN = `# The Digital Archivist

The Digital Archivist is a markdown who hias information act the nate science and create experience, ranovalue, and whow concept by specialty laxim development comrains.

### CORE PRINCIPLES

* Regantration and delirmine the values
* Accertibility and preventiing data set
* Conside and enhanzing data ends

Quote sants:

> "The Digital Archivist is a renrousemente that the allows, ceprecening, and ming experience of rivaiering reijanetts are more."

---

### DATA STRUCTURES

| Feature | Status | Priority |
| :--- | :--- | :--- |
| Markdown Rendering | ✅ Active | High |
| Theme Engine | ✅ Active | High |
| Clipboard Rescue | ✅ Active | Medium |
| Image Support | ⏳ Pending | Low |

\`\`\`javascript
// Example code block
const rescueContent = (data) => {
  console.log("Rescuing:", data);
  return true;
};
\`\`\`

Check out our [documentation](https://example.com) for more details.
`;

export default function App() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [themeKey, setThemeKey] = useState<ThemeType>('minimal-dark');
  const [copied, setCopied] = useState(false);
  const [isRescuing, setIsRescuing] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const theme = THEMES[themeKey];

  const toggleTheme = () => {
    const keys = Object.keys(THEMES) as ThemeType[];
    const currentIndex = keys.indexOf(themeKey);
    const nextIndex = (currentIndex + 1) % keys.length;
    setThemeKey(keys[nextIndex]);
  };

  const handleRescue = async () => {
    if (isRescuing) return;
    
    setIsRescuing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a world-class Markdown Architect. Your mission is to "rescue" messy, unstructured, or poorly formatted raw text and transform it into high-fidelity, professional GitHub Flavored Markdown (GFM).

        PRIORITIZATION & HEURISTICS:
        1. STRUCTURED DATA -> TABLES: If you detect any list of items with multiple attributes (e.g., name, status, date, value), you MUST convert them into a clean Markdown table.
        2. TECHNICAL SNIPPETS -> CODE BLOCKS: If you detect code, commands, logs, or technical configuration, wrap them in fenced code blocks with the correct language identifier (e.g., \`\`\`bash, \`\`\`json, \`\`\`javascript).
        3. HIERARCHY -> HEADERS: Analyze the content to determine a logical hierarchy. Use # for the main title and ##/### for sub-sections.
        4. ACTION ITEMS -> TASK LISTS: If you see a list of "to-dos" or status items, use GFM task lists (- [ ] or - [x]).
        5. QUOTES -> BLOCKQUOTES: Use > for any attributed quotes or significant callouts.
        6. EMPHASIS: Use **bold** for key terms and *italics* for secondary emphasis.
        
        CRITICAL CONSTRAINTS:
        - DO NOT change the core meaning or omit information.
        - DO NOT add any conversational filler, intro, or outro.
        - RETURN ONLY THE RAW MARKDOWN CONTENT.
        - Fix all messy line breaks and ensure consistent spacing.

        MESSY RAW TEXT TO RESCUE:
        ---
        ${markdown}
        ---`,
      });

      if (response.text) {
        setMarkdown(response.text.trim());
      }
    } catch (err) {
      console.error('AI Rescue failed: ', err);
    } finally {
      setIsRescuing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const exportToMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rescued-content.md';
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportToHtml = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Rescued Content</title>
          <style>
            body { font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; }
            pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
            code { font-family: monospace; background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #f8f8f8; }
            blockquote { border-left: 4px solid #ddd; padding-left: 20px; color: #666; font-style: italic; }
          </style>
        </head>
        <body>
          ${document.querySelector('.prose')?.innerHTML || ''}
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rescued-content.html';
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportToPdf = () => {
    const element = document.querySelector('.prose') as HTMLElement;
    if (!element) return;
    
    const opt = {
      margin: 1,
      filename: 'rescued-content.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
    };
    
    // @ts-ignore - html2pdf types can be tricky
    html2pdf().set(opt).from(element).save();
    setShowExportMenu(false);
  };

  return (
    <div className={cn(theme.container, "flex flex-col h-screen transition-colors duration-500")}>
      {/* Header */}
      <header className={cn(theme.header, "h-16")}>
        <div className="flex items-center h-full">
          <button 
            onClick={handleRescue}
            disabled={isRescuing}
            className={cn(
              "flex items-center group transition-all h-full",
              isRescuing && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex flex-col items-start">
              <h1 className="text-sm font-black tracking-tighter uppercase leading-none">
                {isRescuing ? 'Rescuing...' : 'Markdown Rescue'}
              </h1>
              <span className="text-[8px] font-bold opacity-40 uppercase tracking-widest mt-1">
                {isRescuing ? 'Processing raw text' : 'Click to rescue content'}
              </span>
            </div>
          </button>
        </div>
        
        <div className="flex items-center gap-4 h-full">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRescue}
              disabled={isRescuing}
              className={cn(
                "p-2 transition-all border",
                isRescuing 
                  ? "bg-yellow-500 border-yellow-500 text-white animate-pulse" 
                  : themeKey === 'minimal-dark' ? "border-white/10 hover:bg-white/10" :
                    themeKey === 'minimal-light' ? "border-black/10 hover:bg-black/5" :
                    themeKey === 'ukiyo-e' ? "border-[#C82333]/30 text-[#C82333]" :
                    themeKey === 'tech' ? "border-[#3498DB]/30 text-[#3498DB]" :
                    themeKey === 'cyberpunk' ? "bg-black text-[#FFFF00] border-none" :
                    themeKey === 'utilitarian' ? "border-[#666666]/30" :
                    "bg-[#F06292]/20 text-[#F06292] border-none rounded-full"
              )}
              title="Rescue Content (AI Format)"
            >
              {isRescuing ? <GeometricIcon icon={Loader2} size={16} className="animate-spin" /> : <GeometricIcon icon={Zap} size={16} />}
            </button>

            <button 
              onClick={handleCopy}
              className={cn(
                "p-2 transition-all border",
                copied 
                  ? "bg-green-500 border-green-500 text-white" 
                  : themeKey === 'minimal-dark' ? "border-white/10 hover:bg-white/10" :
                    themeKey === 'minimal-light' ? "border-black/10 hover:bg-black/5" :
                    themeKey === 'ukiyo-e' ? "border-[#C82333]/30 text-[#C82333]" :
                    themeKey === 'tech' ? "border-[#3498DB]/30 text-[#3498DB]" :
                    themeKey === 'cyberpunk' ? "bg-black text-[#FFFF00] border-none" :
                    themeKey === 'utilitarian' ? "border-[#666666]/30" :
                    "bg-[#F06292]/20 text-[#F06292] border-none rounded-full"
              )}
              title="Copy to Clipboard"
            >
              {copied ? <GeometricIcon icon={CheckCircle2} size={16} /> : <GeometricIcon icon={Copy} size={16} />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className={cn(
                  "p-2 transition-all border flex items-center gap-2 text-[10px] font-bold uppercase",
                  themeKey === 'minimal-dark' ? "border-white/10 hover:bg-white/10" :
                    themeKey === 'minimal-light' ? "border-black/10 hover:bg-black/5" :
                    themeKey === 'ukiyo-e' ? "border-[#C82333]/30 text-[#C82333]" :
                    themeKey === 'tech' ? "border-[#3498DB]/30 text-[#3498DB]" :
                    themeKey === 'cyberpunk' ? "bg-black text-[#FFFF00] border-none" :
                    themeKey === 'utilitarian' ? "border-[#666666]/30" :
                    "bg-[#F06292]/20 text-[#F06292] border-none rounded-full"
                )}
                title="Export Content"
              >
                <GeometricIcon icon={Download} size={16} />
              </button>

              {showExportMenu && (
                <div className={cn(
                  "absolute top-full right-0 mt-2 w-48 shadow-xl border z-50 overflow-hidden",
                  themeKey === 'minimal-dark' ? "bg-[#111] border-white/10" :
                    themeKey === 'minimal-light' ? "bg-white border-black/10" :
                    themeKey === 'ukiyo-e' ? "bg-[#1A2B4C] border-[#C82333]" :
                    themeKey === 'tech' ? "bg-[#2F3640] border-[#485460]" :
                    themeKey === 'cyberpunk' ? "bg-black border-4 border-[#FFFF00]" :
                    themeKey === 'utilitarian' ? "bg-[#999999] border-2 border-[#666666]" :
                    "bg-white border-4 border-[#F48FB1] rounded-[20px]"
                )}>
                  <button 
                    onClick={exportToMd}
                    className={cn(
                      "w-full px-4 py-3 text-left text-xs font-bold uppercase flex items-center gap-3 transition-colors",
                      themeKey === 'minimal-dark' ? "hover:bg-white/10" : "hover:bg-black/5"
                    )}
                  >
                    <GeometricIcon icon={FileText} size={14} />
                    Markdown (.md)
                  </button>
                  <button 
                    onClick={exportToHtml}
                    className={cn(
                      "w-full px-4 py-3 text-left text-xs font-bold uppercase flex items-center gap-3 transition-colors border-t",
                      theme.border,
                      themeKey === 'minimal-dark' ? "hover:bg-white/10" : "hover:bg-black/5"
                    )}
                  >
                    <GeometricIcon icon={FileCode} size={14} />
                    HTML (.html)
                  </button>
                  <button 
                    onClick={exportToPdf}
                    className={cn(
                      "w-full px-4 py-3 text-left text-xs font-bold uppercase flex items-center gap-3 transition-colors border-t",
                      theme.border,
                      themeKey === 'minimal-dark' ? "hover:bg-white/10" : "hover:bg-black/5"
                    )}
                  >
                    <GeometricIcon icon={FileDown} size={14} />
                    PDF (.pdf)
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={toggleTheme}
              className={cn(
                "p-2 transition-all border",
                themeKey === 'minimal-dark' ? "border-white/10 hover:bg-white/10" :
                  themeKey === 'minimal-light' ? "border-black/10 hover:bg-black/5" :
                  themeKey === 'ukiyo-e' ? "border-[#C82333]/30 text-[#C82333]" :
                  themeKey === 'tech' ? "border-[#3498DB]/30 text-[#3498DB]" :
                  themeKey === 'cyberpunk' ? "bg-black text-[#FFFF00] border-none" :
                  themeKey === 'utilitarian' ? "border-[#666666]/30" :
                  "bg-[#F06292]/20 text-[#F06292] border-none rounded-full"
              )}
              title={`Switch Theme (Current: ${themeKey.replace('-', ' ')})`}
            >
              <GeometricIcon icon={Palette} size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Background Decorative Elements for Ukiyo-e */}
        {themeKey === 'ukiyo-e' && (
          <>
            <div className="absolute bottom-0 left-0 w-full h-32 opacity-20 pointer-events-none z-0">
              <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-[#E9C46A]">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".5"></path>
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5V0Z" opacity=".25"></path>
              </svg>
            </div>
            <div className="absolute top-20 right-10 text-6xl opacity-10 pointer-events-none font-serif rotate-12">
              靖著
            </div>
          </>
        )}

        {/* Kawaii Decorations */}
        {themeKey === 'kawaii' && (
          <>
            <div className="absolute top-10 right-20 text-pink-300 animate-bounce">
              <GeometricIcon icon={Cloud} size={64} />
            </div>
            <div className="absolute bottom-20 left-10 text-pink-200">
              <GeometricIcon icon={Heart} size={48} />
            </div>
          </>
        )}

        {/* Editor Section */}
        <section className={cn(theme.editorBg, "w-1/2 flex flex-col p-6 z-10")}>
          <div className={theme.label}>
            {themeKey === 'tech' && <GeometricIcon icon={Terminal} size={12} className="inline mr-1" />}
            Raw Input
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className={cn(
              "flex-1 w-full bg-transparent resize-none outline-none",
              theme.font,
              themeKey === 'tech' ? "caret-[#3498DB]" : ""
            )}
            spellCheck={false}
          />
        </section>

        {/* Preview Section */}
        <section className={cn(theme.previewBg, "w-1/2 flex flex-col p-6 overflow-y-auto z-10")}>
          <div className={theme.label}>
            {themeKey === 'tech' && <GeometricIcon icon={Monitor} size={12} className="inline mr-1" />}
            Markdown Preview
          </div>
          
          <div className={cn("prose max-w-none", theme.font, theme.text)}>
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className={cn("text-4xl font-black mb-6", theme.accent)}>{children}</h1>,
                h2: ({ children }) => <h2 className={cn("text-2xl font-bold mb-4 mt-8", theme.accent)}>{children}</h2>,
                h3: ({ children }) => (
                  <div className={cn(theme.card, "mb-6")}>
                    <h3 className={cn("text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2", theme.accent)}>
                      {children}
                    </h3>
                  </div>
                ),
                p: ({ children }) => <p className="mb-4 leading-relaxed opacity-90">{children}</p>,
                ul: ({ children }) => <ul className="space-y-3 mb-6">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 space-y-3 mb-6">{children}</ol>,
                li: ({ children }) => (
                  <li className="flex items-start gap-3">
                    <GeometricIcon icon={CheckCircle2} size={20} className={cn("mt-0.5", theme.accent)} />
                    <span>{children}</span>
                  </li>
                ),
                blockquote: ({ children }) => (
                  <div className="relative pl-8 py-4 my-8 italic border-l-4 border-current opacity-80">
                    <GeometricIcon icon={Quote} size={24} className="absolute left-0 top-0 opacity-20" />
                    <div className="text-lg">{children}</div>
                  </div>
                ),
                code: ({ node, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isBlock = node?.position?.start.line !== node?.position?.end.line || match;
                  
                  return isBlock ? (
                    <div className={cn("relative my-6 rounded-lg overflow-hidden border", theme.border)}>
                      <div className={cn("flex items-center justify-between px-4 py-2 text-xs font-mono bg-black/5 border-b", theme.border)}>
                        <span className="flex items-center gap-2">
                          <GeometricIcon icon={Code2} size={12} />
                          {match ? match[1] : 'code'}
                        </span>
                      </div>
                      <pre className="p-4 overflow-x-auto bg-black/5 font-mono text-sm leading-relaxed">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <code className={cn("px-1.5 py-0.5 rounded-md bg-black/5 font-mono text-sm", theme.accent)} {...props}>
                      {children}
                    </code>
                  );
                },
                a: ({ children, href }) => (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={cn("inline-flex items-center gap-1 underline decoration-2 underline-offset-4 hover:opacity-70 transition-opacity", theme.accent)}
                  >
                    {children}
                    <GeometricIcon icon={ExternalLink} size={12} />
                  </a>
                ),
                hr: () => <hr className={cn("my-12 border-t-2 border-dashed", theme.border)} />,
                table: ({ children }) => (
                  <div className={cn("my-8 overflow-hidden rounded-lg border", theme.border)}>
                    <table className="w-full border-collapse text-sm">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-black/5">{children}</thead>,
                th: ({ children }) => <th className={cn("px-4 py-3 text-left font-black uppercase tracking-wider border-b", theme.border)}>{children}</th>,
                td: ({ children }) => <td className={cn("px-4 py-3 border-b last:border-b-0", theme.border)}>{children}</td>,
                img: ({ src, alt }) => (
                  <div className="my-8 rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src={src} 
                      alt={alt} 
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ),
                strong: ({ children }) => <strong className={cn("font-black", theme.accent)}>{children}</strong>,
                em: ({ children }) => <em className="italic opacity-100">{children}</em>,
                del: ({ children }) => <del className="opacity-50 line-through">{children}</del>,
              }}
            >
              {markdown}
            </Markdown>
          </div>
        </section>
      </main>
    </div>
  );
}
