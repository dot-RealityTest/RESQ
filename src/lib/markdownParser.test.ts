import test from "node:test";
import assert from "node:assert/strict";
import { parseMarkdownRules } from "./markdownParser.ts";

test("preserves core markdown syntax and normalizes smart quotes", () => {
  const input = `# Heading

## Subheading

Paragraph with “smart quotes”, **bold**, _italic_, ~~strike~~, and \`inline code\`.

> Quoted text

---

- item one
* item two
1. item three

[OpenAI](https://openai.com)
![Alt](https://example.com/image.png)`;

  const output = parseMarkdownRules(input);

  assert.match(output, /^# Heading/m);
  assert.match(output, /^## Subheading/m);
  assert.match(output, /\*\*bold\*\*/);
  assert.match(output, /_italic_/);
  assert.match(output, /~~strike~~/);
  assert.match(output, /`inline code`/);
  assert.match(output, /^> Quoted text/m);
  assert.match(output, /^---$/m);
  assert.match(output, /^- item one$/m);
  assert.match(output, /^\* item two$/m);
  assert.match(output, /^1\. item three$/m);
  assert.match(output, /\[OpenAI\]\(https:\/\/openai\.com\)/);
  assert.match(output, /!\[Alt\]\(https:\/\/example\.com\/image\.png\)/);
  assert.ok(!output.includes("“"));
  assert.ok(!output.includes("”"));
});

test("detects language for unlabeled fenced code blocks", () => {
  const input = [
    "```",
    "npm install",
    "npm run build",
    "```",
  ].join("\n");

  const output = parseMarkdownRules(input);
  assert.equal(output, ["```bash", "npm install", "npm run build", "```"].join("\n"));
});

test("collapses extra blank lines into paragraph breaks", () => {
  const input = `First paragraph.



Second paragraph.`;

  const output = parseMarkdownRules(input);
  assert.equal(output, "First paragraph.\n\nSecond paragraph.");
});
