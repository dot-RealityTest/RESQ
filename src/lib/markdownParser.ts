const HEADER_PATTERN = /^\s{0,3}#{1,6}\s+\S/;
const FENCE_PATTERN = /^\s*```([a-z0-9_+-]+)?\s*$/i;
const BLOCKQUOTE_PATTERN = /^\s*>\s?/;
const RULE_PATTERN = /^\s*(?:---|\*\*\*)\s*$/;
const LIST_PATTERN = /^\s*(?:[-*]\s+|\d+\.\s+)/;
const LINK_PATTERN = /!?\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/;
const INLINE_STYLE_PATTERN = /(\*\*[^*]+\*\*|__[^_]+__|(?<!\*)\*[^*]+\*(?!\*)|(?<!_)_[^_]+_(?!_)|~~[^~]+~~|`[^`]+`)/;

function normalizeQuotes(value: string) {
  return value
    .replace(/[\u201C\u201D\u2033]/g, "\"")
    .replace(/[\u2018\u2019\u2032]/g, "'");
}

function normalizeSource(value: string) {
  return normalizeQuotes(value)
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n");
}

function detectLanguage(lines: string[]) {
  const sample = lines.join("\n");

  if (/^\s*[{[]/.test(sample) && /"\w+"\s*:/.test(sample)) {
    return "json";
  }
  if (/^(npm|pnpm|yarn|git|curl|npx|node|cd|ls|cat|cp|mv|rm)\b/m.test(sample) || /^\$ /m.test(sample)) {
    return "bash";
  }
  if (/<[a-z][\s\S]*>/.test(sample)) {
    return "html";
  }
  if (/\b(const|let|var|function|return|import|export)\b/.test(sample)) {
    return "javascript";
  }

  return "";
}

export function parseMarkdownRules(raw: string) {
  const normalized = normalizeSource(raw);
  if (!normalized.trim()) {
    return "";
  }

  const lines = normalized.split("\n");
  const output: string[] = [];
  let index = 0;
  let previousBlank = false;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();
    const fenceMatch = line.match(FENCE_PATTERN);

    if (fenceMatch) {
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !FENCE_PATTERN.test(lines[index])) {
        codeLines.push(lines[index]);
        index += 1;
      }

      const detectedLanguage = fenceMatch[1] || detectLanguage(codeLines);
      output.push(detectedLanguage ? `\`\`\`${detectedLanguage}` : "```");
      output.push(...codeLines.map(normalizeQuotes));
      output.push("```");
      previousBlank = false;

      if (index < lines.length && FENCE_PATTERN.test(lines[index])) {
        index += 1;
      }
      continue;
    }

    if (!trimmed) {
      if (!previousBlank) {
        output.push("");
      }
      previousBlank = true;
      index += 1;
      continue;
    }

    previousBlank = false;

    if (
      HEADER_PATTERN.test(line) ||
      BLOCKQUOTE_PATTERN.test(line) ||
      RULE_PATTERN.test(trimmed) ||
      LIST_PATTERN.test(line) ||
      LINK_PATTERN.test(line) ||
      INLINE_STYLE_PATTERN.test(line)
    ) {
      output.push(trimmed);
    } else {
      output.push(trimmed);
    }

    index += 1;
  }

  return output.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function hasExplicitMarkdownSyntax(markdown: string) {
  return [
    HEADER_PATTERN,
    FENCE_PATTERN,
    BLOCKQUOTE_PATTERN,
    RULE_PATTERN,
    LIST_PATTERN,
    LINK_PATTERN,
    INLINE_STYLE_PATTERN,
  ].some((pattern) => pattern.test(markdown));
}
