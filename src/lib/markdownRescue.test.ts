import test from "node:test";
import assert from "node:assert/strict";
import { generateMarkdownFromRawText } from "./markdownRescue.ts";

test("turns content-style labeled lines into structured sections", () => {
  const input = `meeting notes
summary: ship desktop build this week
attendees: Alex, Sam, Noor
action items: fix export, polish parser
quote: "Keep it readable."`;

  const output = generateMarkdownFromRawText(input);

  assert.match(output, /^# meeting notes/m);
  assert.match(output, /^## Summary$/m);
  assert.match(output, /ship desktop build this week/);
  assert.match(output, /^## Attendees$/m);
  assert.match(output, /^- Alex$/m);
  assert.match(output, /^- Sam$/m);
  assert.match(output, /^- Noor$/m);
  assert.match(output, /^## Action Items$/m);
  assert.match(output, /^- fix export$/m);
  assert.match(output, /^- polish parser$/m);
  assert.match(output, /^## Quote$/m);
  assert.match(output, /^> Keep it readable\.$/m);
});

test("keeps metadata together and promotes later labeled content into a section", () => {
  const input = `release plan
owner: product team
status: in progress
next steps:
ship desktop app
write release notes
announce update`;

  const output = generateMarkdownFromRawText(input);

  assert.match(output, /^# release plan/m);
  assert.match(output, /^\| Field \| Value \|$/m);
  assert.match(output, /^\| owner \| product team \|$/m);
  assert.match(output, /^\| status \| in progress \|$/m);
  assert.match(output, /^## Next Steps$/m);
  assert.match(output, /^- ship desktop app$/m);
  assert.match(output, /^- write release notes$/m);
  assert.match(output, /^- announce update$/m);
});

test("promotes sequence labels into subsection headings with nested lists", () => {
  const input = `roadmap
phase 1
parser cleanup
heuristics tuning
phase 2
ollama popup polish`;

  const output = generateMarkdownFromRawText(input);

  assert.match(output, /^# roadmap/m);
  assert.match(output, /^## Phase 1$/m);
  assert.match(output, /^- parser cleanup$/m);
  assert.match(output, /^- heuristics tuning$/m);
  assert.match(output, /^## Phase 2$/m);
  assert.match(output, /^- ollama popup polish$/m);
});
