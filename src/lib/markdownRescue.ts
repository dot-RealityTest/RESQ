import { hasExplicitMarkdownSyntax, parseMarkdownRules } from "./markdownParser.ts";

const BULLET_PATTERN = /^[-*+•▪◦‣]\s+/;
const ORDERED_PATTERN = /^\d+[.)]\s+/;
const CHECKBOX_PATTERN = /^(?:[-*+•▪◦‣]\s*)?\[(x| )\]\s+/i;
const KEY_VALUE_PATTERN = /^([^:]{1,80}):\s+(.+)$/;
const DASH_KEY_VALUE_PATTERN = /^([^|:]{1,80})\s[-–—]\s(.+)$/;
const HEADING_PATTERN = /^[A-Z0-9][A-Za-z0-9/&()'"\- ]{1,70}$/;
const SECTION_LABEL_PATTERN = /^[A-Za-z][A-Za-z0-9/&()'"\- ]{1,40}:?$/;
const SEQUENCE_LABEL_PATTERN =
  /^(phase|step|part|stage|sprint|milestone|week|day|chapter|section)\s+[A-Za-z0-9]+$/i;
const COMMON_SECTION_LABEL_PATTERN =
  /^(action items?|attendees?|commands?|details?|highlights?|links?|next steps?|notes?|quote|quotes|references?|summary|tasks?)$/i;
const CONTENT_SECTION_KEY_PATTERN =
  /^(action items?|attendees?|commands?|details?|goals?|highlights?|links?|next steps?|notes?|outcomes?|quote|quotes|references?|risks?|summary|tasks?|timeline|updates?)$/i;
const LIST_SECTION_KEY_PATTERN =
  /^(action items?|attendees?|goals?|highlights?|links?|next steps?|references?|risks?|tasks?)$/i;
const QUOTE_SECTION_KEY_PATTERN = /^(quote|quotes)$/i;
const CODE_SECTION_KEY_PATTERN = /^(command|commands)$/i;
const METADATA_KEY_PATTERN =
  /^(assignee|author|category|created|date|deadline|due|owner|priority|project|source|stage|status|tag|tags|team|type|version)$/i;

function looksLikeCommandLine(line: string) {
  const trimmed = line.trim();
  return /^(npm|pnpm|yarn|git|curl|npx|node|cd|ls|cat|cp|mv|rm)\b/.test(trimmed) || trimmed.startsWith("$ ");
}

function normalizeWhitespace(value: string) {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/\t/g, "    ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanInlineText(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;!?])/g, "$1")
    .replace(/([([{])\s+/g, "$1")
    .replace(/\s+([)\]}])/g, "$1")
    .trim();
}

function cleanParagraphLines(lines: string[]) {
  return cleanInlineText(
    lines
      .map((line) => line.trim())
      .filter(Boolean)
      .join(" ")
      .replace(/(\w)- (\w)/g, "$1$2"),
  );
}

function cleanHeading(value: string) {
  return cleanInlineText(value.replace(/[:\-–—]+$/, ""));
}

function toTitleCase(value: string) {
  return value.replace(/\b\w+/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
}

function splitListValue(value: string) {
  const normalized = value
    .split(/\n+/)
    .flatMap((part) => part.split(/\s*(?:,|;)\s*/))
    .map((part) => cleanInlineText(part))
    .filter(Boolean);

  return normalized;
}

function parseLabeledLine(line: string) {
  const match = line.match(KEY_VALUE_PATTERN) ?? line.match(DASH_KEY_VALUE_PATTERN);
  if (!match) {
    return null;
  }

  const key = cleanHeading(match[1]).toLowerCase();
  const value = cleanInlineText(match[2]);
  return value ? { key, value } : null;
}

function isMetadataLine(line: string) {
  const entry = parseLabeledLine(line);
  return Boolean(entry && METADATA_KEY_PATTERN.test(entry.key));
}

function isContentSectionLine(line: string) {
  const entry = parseLabeledLine(line);
  return Boolean(entry && CONTENT_SECTION_KEY_PATTERN.test(entry.key));
}

function isSequenceLabel(line: string) {
  return SEQUENCE_LABEL_PATTERN.test(line.trim());
}

function looksLikeSectionLabel(line: string) {
  const trimmed = line.trim();
  if (!trimmed || !SECTION_LABEL_PATTERN.test(trimmed)) {
    return false;
  }

  if (
    looksLikeCommandLine(trimmed) ||
    BULLET_PATTERN.test(trimmed) ||
    ORDERED_PATTERN.test(trimmed) ||
    CHECKBOX_PATTERN.test(trimmed) ||
    KEY_VALUE_PATTERN.test(trimmed) ||
    DASH_KEY_VALUE_PATTERN.test(trimmed) ||
    trimmed.includes("|")
  ) {
    return false;
  }

  const wordCount = trimmed.split(/\s+/).length;
  return (
    wordCount <= 5 &&
    (COMMON_SECTION_LABEL_PATTERN.test(cleanHeading(trimmed)) ||
      trimmed.endsWith(":") ||
      isSequenceLabel(trimmed))
  );
}

function splitBlocks(raw: string) {
  const sourceLines = raw.split("\n");
  const blocks: string[] = [];
  let current: string[] = [];

  const pushCurrent = () => {
    const block = current.join("\n").trim();
    if (block) {
      blocks.push(block);
    }
    current = [];
  };

  for (const sourceLine of sourceLines) {
    const line = sourceLine.trim();

    if (!line) {
      pushCurrent();
      continue;
    }

    if (current.length > 0) {
      const currentHasOnlyMetadata = current.every(isMetadataLine);
      const currentStartsLabeledSection =
        looksLikeSectionLabel(current[0]) || isSequenceLabel(current[0]);
      const incomingStartsSection =
        looksLikeSectionLabel(line) || isSequenceLabel(line) || isContentSectionLine(line);
      const incomingIsMetadata = isMetadataLine(line);

      if (
        (currentHasOnlyMetadata && !incomingIsMetadata) ||
        (currentStartsLabeledSection && incomingStartsSection) ||
        (incomingStartsSection && !currentStartsLabeledSection && !currentHasOnlyMetadata)
      ) {
        pushCurrent();
      }
    }

    current.push(line);
  }

  pushCurrent();
  return blocks;
}

function isFenceBlock(block: string) {
  return block.startsWith("```") && block.endsWith("```");
}

function isHeadingLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.endsWith(".")) {
    return false;
  }

  const wordCount = trimmed.split(/\s+/).length;
  return wordCount <= 8 && (trimmed.endsWith(":") || HEADING_PATTERN.test(trimmed) || isSequenceLabel(trimmed));
}

function inferTitle(raw: string) {
  const firstLine = raw
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) {
    return "Rescued Notes";
  }

  const cleaned = cleanInlineText(
    firstLine.replace(BULLET_PATTERN, "").replace(ORDERED_PATTERN, ""),
  );

  return cleaned.length > 80 ? "Rescued Notes" : cleaned;
}

function splitTitleFromBody(raw: string) {
  const lines = raw.split("\n");
  const firstContentIndex = lines.findIndex((line) => line.trim().length > 0);
  if (firstContentIndex === -1) {
    return { title: "Rescued Notes", body: "" };
  }

  const firstLine = lines[firstContentIndex].trim();
  const secondContentIndex = lines.findIndex(
    (line, index) => index > firstContentIndex && line.trim().length > 0,
  );
  const secondLine = secondContentIndex === -1 ? "" : lines[secondContentIndex].trim();
  const looksStructuredAfterTitle =
    !secondLine ||
    isHeadingLine(secondLine) ||
    looksLikeSectionLabel(secondLine) ||
    BULLET_PATTERN.test(secondLine) ||
    ORDERED_PATTERN.test(secondLine) ||
    CHECKBOX_PATTERN.test(secondLine) ||
    KEY_VALUE_PATTERN.test(secondLine) ||
    DASH_KEY_VALUE_PATTERN.test(secondLine) ||
    secondLine.includes("|") ||
    looksLikeCommandLine(secondLine) ||
    secondLine.split(/\s+/).length <= 6;

  const isProbableTitle =
    firstLine.length <= 80 &&
    !firstLine.endsWith(":") &&
    !/[.!?]$/.test(firstLine) &&
    !looksLikeCommandLine(firstLine) &&
    !KEY_VALUE_PATTERN.test(firstLine) &&
    !DASH_KEY_VALUE_PATTERN.test(firstLine) &&
    !BULLET_PATTERN.test(firstLine) &&
    !ORDERED_PATTERN.test(firstLine) &&
    !CHECKBOX_PATTERN.test(firstLine) &&
    !firstLine.includes("|") &&
    looksStructuredAfterTitle;

  if (!isProbableTitle) {
    return { title: inferTitle(raw), body: raw };
  }

  const bodyLines = lines.filter((_, index) => index !== firstContentIndex);
  return {
    title: cleanHeading(firstLine),
    body: normalizeWhitespace(bodyLines.join("\n")),
  };
}

function looksLikeCode(lines: string[]) {
  if (lines.some((line) => line.startsWith("```"))) {
    return true;
  }

  let score = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    if (looksLikeCommandLine(trimmed)) {
      score += 2;
    }
    if (/(const|let|var|function|return|import|export|class)\b/.test(trimmed)) {
      score += 2;
    }
    if (/=>|[{}`;]/.test(trimmed)) {
      score += 1;
    }
    if (/^<[^>]+>/.test(trimmed)) {
      score += 2;
    }
  }

  return score >= 3;
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

function renderCodeBlock(lines: string[]) {
  const language = detectLanguage(lines);
  const fence = language ? `\`\`\`${language}` : "```";
  return `${fence}\n${lines.join("\n")}\n\`\`\``;
}

function splitPipeRow(line: string) {
  return line
    .split("|")
    .map((cell) => cleanInlineText(cell))
    .filter((cell, index, cells) => {
      const isEdgeCell = (index === 0 || index === cells.length - 1) && cell === "";
      return !isEdgeCell;
    });
}

function looksLikePipeTable(lines: string[]) {
  if (lines.length < 2) {
    return false;
  }

  const widths = lines.map((line) => splitPipeRow(line).length);
  const firstWidth = widths[0];

  return firstWidth >= 2 && widths.every((width) => width === firstWidth);
}

function renderPipeTable(lines: string[]) {
  const rows = lines.map(splitPipeRow);
  const [header, ...bodyRows] = rows;
  const secondRow = bodyRows[0];
  const hasDivider = secondRow?.every((cell) => /^:?-{3,}:?$/.test(cell));
  const contentRows = hasDivider ? bodyRows.slice(1) : bodyRows;
  const divider = header.map(() => "---");

  return [
    `| ${header.join(" | ")} |`,
    `| ${divider.join(" | ")} |`,
    ...contentRows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

function looksLikeKeyValueTable(lines: string[]) {
  if (lines.length < 2) {
    return false;
  }

  return lines.every((line) => KEY_VALUE_PATTERN.test(line.trim()) || DASH_KEY_VALUE_PATTERN.test(line.trim()));
}

function renderKeyValueTable(lines: string[]) {
  const rows = lines
    .map((line) => line.match(KEY_VALUE_PATTERN) ?? line.match(DASH_KEY_VALUE_PATTERN))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => [cleanInlineText(match[1]), cleanInlineText(match[2])]);

  const body = rows.map(([key, value]) => `| ${key} | ${value} |`).join("\n");
  return ["| Field | Value |", "| --- | --- |", body].join("\n");
}

function looksLikeLabeledSections(lines: string[]) {
  if (lines.length === 0) {
    return false;
  }

  const entries = lines.map(parseLabeledLine);
  return entries.every((entry) => entry && CONTENT_SECTION_KEY_PATTERN.test(entry.key));
}

function renderLabeledSections(lines: string[]) {
  return lines
    .map((line) => parseLabeledLine(line))
    .filter((entry): entry is { key: string; value: string } => Boolean(entry))
    .map(({ key, value }) => {
      const heading = `## ${toTitleCase(key)}`;

      if (QUOTE_SECTION_KEY_PATTERN.test(key)) {
        return `${heading}\n\n> ${cleanInlineText(value.replace(/^["“]|["”]$/g, ""))}`;
      }

      if (CODE_SECTION_KEY_PATTERN.test(key)) {
        return `${heading}\n\n${renderCodeBlock([value])}`;
      }

      if (LIST_SECTION_KEY_PATTERN.test(key)) {
        const items = splitListValue(value);
        const content =
          items.length > 1
            ? items.map((item) => `- ${item}`).join("\n")
            : `- ${value}`;
        return `${heading}\n\n${content}`;
      }

      return `${heading}\n\n${value}`;
    })
    .join("\n\n");
}

function looksLikeTaskList(lines: string[]) {
  return lines.length > 0 && lines.every((line) => {
    const trimmed = line.trim();
    return (
      CHECKBOX_PATTERN.test(trimmed) ||
      /^(todo|done|completed|pending|in progress)\s*[:\-]\s+/i.test(trimmed)
    );
  });
}

function renderTaskList(lines: string[]) {
  return lines
    .map((line) => {
      const trimmed = line.trim();
      const checkboxMatch = trimmed.match(CHECKBOX_PATTERN);
      if (checkboxMatch) {
        return `- [${checkboxMatch[1].toLowerCase() === "x" ? "x" : " "}] ${cleanInlineText(
          trimmed.replace(CHECKBOX_PATTERN, ""),
        )}`;
      }

      const statusMatch = trimmed.match(/^(todo|done|completed|pending|in progress)\s*[:\-]\s+(.+)$/i);
      if (!statusMatch) {
        return `- [ ] ${cleanInlineText(trimmed)}`;
      }

      const [, status, content] = statusMatch;
      const checked = /^(done|completed)$/i.test(status) ? "x" : " ";
      return `- [${checked}] ${cleanInlineText(content)}`;
    })
    .join("\n");
}

function looksLikeBulletList(lines: string[]) {
  return lines.length > 0 && lines.every((line) => BULLET_PATTERN.test(line.trim()));
}

function renderBulletList(lines: string[]) {
  return lines
    .map((line) => `- ${cleanInlineText(line.trim().replace(BULLET_PATTERN, ""))}`)
    .join("\n");
}

function looksLikePlainList(lines: string[]) {
  if (lines.length < 2) {
    return false;
  }

  return lines.every((line) => {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed.includes("|") ||
      looksLikeCommandLine(trimmed) ||
      KEY_VALUE_PATTERN.test(trimmed) ||
      DASH_KEY_VALUE_PATTERN.test(trimmed) ||
      BULLET_PATTERN.test(trimmed) ||
      ORDERED_PATTERN.test(trimmed) ||
      CHECKBOX_PATTERN.test(trimmed)
    ) {
      return false;
    }

    return trimmed.split(/\s+/).length <= 6 && !/[.!?]$/.test(trimmed);
  });
}

function renderPlainList(lines: string[]) {
  return lines.map((line) => `- ${cleanInlineText(line)}`).join("\n");
}

function looksLikeOrderedList(lines: string[]) {
  return lines.length > 0 && lines.every((line) => ORDERED_PATTERN.test(line.trim()));
}

function renderOrderedList(lines: string[]) {
  return lines
    .map((line, index) => `${index + 1}. ${cleanInlineText(line.trim().replace(ORDERED_PATTERN, ""))}`)
    .join("\n");
}

function looksLikeQuote(lines: string[]) {
  return lines.length > 0 && lines.every((line) => {
    const trimmed = line.trim();
    return trimmed.startsWith(">") || /^["“].+["”]$/.test(trimmed);
  });
}

function renderQuote(lines: string[]) {
  return lines
    .map((line) => {
      const trimmed = line.trim().replace(/^>\s?/, "");
      return `> ${cleanInlineText(trimmed.replace(/^["“]|["”]$/g, ""))}`;
    })
    .join("\n");
}

function renderParagraph(lines: string[]) {
  return cleanParagraphLines(lines);
}

function renderBlock(block: string) {
  if (isFenceBlock(block)) {
    return block;
  }

  const lines = block.split("\n").map((line) => line.replace(/\s+$/g, ""));
  const compactLines = lines.map((line) => line.trim()).filter(Boolean);

  if (compactLines.length === 0) {
    return "";
  }

  const [firstLine, ...restLines] = compactLines;
  if (restLines.length > 0 && isHeadingLine(firstLine)) {
    const nested =
      isSequenceLabel(firstLine) &&
      restLines.every((line) => {
        const trimmed = line.trim();
        return (
          Boolean(trimmed) &&
          !looksLikeSectionLabel(trimmed) &&
          !KEY_VALUE_PATTERN.test(trimmed) &&
          !DASH_KEY_VALUE_PATTERN.test(trimmed) &&
          !looksLikeCommandLine(trimmed)
        );
      })
        ? renderPlainList(restLines)
        : renderBlock(restLines.join("\n"));
    return nested
      ? `## ${toTitleCase(cleanHeading(firstLine))}\n\n${nested}`
      : `## ${toTitleCase(cleanHeading(firstLine))}`;
  }

  if (
    restLines.length > 0 &&
    looksLikeSectionLabel(firstLine) &&
    (looksLikeQuote(restLines) ||
      looksLikeTaskList(restLines) ||
      looksLikeBulletList(restLines) ||
      looksLikePlainList(restLines) ||
      looksLikeOrderedList(restLines) ||
      looksLikeKeyValueTable(restLines) ||
      looksLikePipeTable(restLines) ||
      looksLikeCode(restLines) ||
      COMMON_SECTION_LABEL_PATTERN.test(cleanHeading(firstLine)))
  ) {
    const nested = renderBlock(restLines.join("\n"));
    return nested ? `## ${toTitleCase(cleanHeading(firstLine))}\n\n${nested}` : `## ${toTitleCase(cleanHeading(firstLine))}`;
  }

  const labeledEntry = parseLabeledLine(firstLine);
  if (labeledEntry && restLines.length > 0 && CONTENT_SECTION_KEY_PATTERN.test(labeledEntry.key)) {
    const nested = renderBlock([labeledEntry.value, ...restLines].join("\n"));
    return nested ? `## ${toTitleCase(labeledEntry.key)}\n\n${nested}` : `## ${toTitleCase(labeledEntry.key)}`;
  }

  if (looksLikeLabeledSections(compactLines)) {
    return renderLabeledSections(compactLines);
  }

  if (looksLikeTaskList(compactLines)) {
    return renderTaskList(compactLines);
  }

  if (looksLikeKeyValueTable(compactLines)) {
    return renderKeyValueTable(compactLines);
  }

  if (looksLikePipeTable(compactLines)) {
    return renderPipeTable(compactLines);
  }

  if (looksLikeBulletList(compactLines)) {
    return renderBulletList(compactLines);
  }

  if (looksLikePlainList(compactLines)) {
    return renderPlainList(compactLines);
  }

  if (looksLikeOrderedList(compactLines)) {
    return renderOrderedList(compactLines);
  }

  if (looksLikeQuote(compactLines)) {
    return renderQuote(compactLines);
  }

  if (looksLikeCode(lines)) {
    return renderCodeBlock(lines);
  }

  if (compactLines.length === 1 && isHeadingLine(compactLines[0])) {
    return `## ${toTitleCase(cleanHeading(compactLines[0]))}`;
  }

  return renderParagraph(lines);
}

export function generateMarkdownFromRawText(raw: string) {
  const parsed = parseMarkdownRules(raw);
  if (!parsed) {
    return "# Rescued Notes\n";
  }

  if (hasExplicitMarkdownSyntax(parsed)) {
    return parsed.endsWith("\n") ? parsed : `${parsed}\n`;
  }

  const normalized = normalizeWhitespace(parsed);

  const { title, body } = splitTitleFromBody(normalized);
  const blocks = body ? splitBlocks(body) : [];
  const renderedBlocks = blocks.map(renderBlock).filter(Boolean);

  return [`# ${title}`, ...renderedBlocks].join("\n\n").trimEnd() + "\n";
}

export function buildMarkdownFilename(markdown: string) {
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1] ?? "rescued-content";
  const slug = heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "rescued-content"}.md`;
}
