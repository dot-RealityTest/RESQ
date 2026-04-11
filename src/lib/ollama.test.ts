import test from "node:test";
import assert from "node:assert/strict";
import {
  buildOllamaPrompt,
  buildOllamaRequest,
  formatOllamaModelLabel,
  inferOllamaModelCapabilities,
  normalizeOllamaEndpoint,
  parseOllamaModels,
  parseOllamaResponse,
} from "./ollama.ts";

test("normalizes Ollama endpoints without trailing slashes", () => {
  assert.equal(normalizeOllamaEndpoint("http://127.0.0.1:11434/"), "http://127.0.0.1:11434");
  assert.equal(normalizeOllamaEndpoint("http://localhost:11434"), "http://localhost:11434");
});

test("builds a non-streaming Ollama generate request", () => {
  const request = buildOllamaRequest({
    model: "llama3.1:8b",
    rawInput: "messy text",
    localMarkdown: "# Local draft",
  });

  assert.equal(request.model, "llama3.1:8b");
  assert.equal(request.stream, false);
  assert.match(request.prompt, /messy text/);
  assert.match(request.prompt, /# Local draft/);
});

test("parses the generated response text", () => {
  assert.equal(parseOllamaResponse({ response: "  # Clean markdown  " }), "# Clean markdown");
  assert.throws(() => parseOllamaResponse({ response: "" }), /empty/i);
});

test("prompt asks Ollama for markdown only", () => {
  const prompt = buildOllamaPrompt({
    rawInput: "raw notes",
    localMarkdown: "# Local draft",
  });

  assert.match(prompt, /RETURN ONLY THE FINAL MARKDOWN/i);
  assert.match(prompt, /raw notes/);
  assert.match(prompt, /# Local draft/);
});

test("parses and sorts Ollama model names", () => {
  const models = parseOllamaModels({
    models: [
      { name: "mistral:latest" },
      { name: "llama3.1:8b" },
      { name: "llama3.1:8b" },
      { name: "qwen2.5:14b" },
      {},
    ],
  });

  assert.deepEqual(models, ["llama3.1:8b", "mistral:latest", "qwen2.5:14b"]);
});

test("returns an empty list when Ollama tags payload has no models", () => {
  assert.deepEqual(parseOllamaModels({}), []);
  assert.deepEqual(parseOllamaModels({ models: [] }), []);
});

test("infers capabilities from model names", () => {
  assert.deepEqual(inferOllamaModelCapabilities("nomic-embed-text:latest"), ["embed"]);
  assert.deepEqual(inferOllamaModelCapabilities("qwen3-vl:235b-cloud"), ["vision", "cloud"]);
  assert.deepEqual(inferOllamaModelCapabilities("deepseek-r1:32b"), ["reasoning"]);
  assert.deepEqual(inferOllamaModelCapabilities("glm-ocr:latest"), ["ocr"]);
  assert.deepEqual(inferOllamaModelCapabilities("llama3.1:8b"), ["chat"]);
});

test("formats model labels with inferred capabilities", () => {
  assert.equal(
    formatOllamaModelLabel("qwen3-vl:235b-cloud"),
    "qwen3-vl:235b-cloud · Vision, Cloud",
  );
});
