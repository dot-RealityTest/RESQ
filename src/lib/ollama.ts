interface OllamaPromptInput {
  rawInput: string;
  localMarkdown: string;
}

interface OllamaRequestInput extends OllamaPromptInput {
  model: string;
}

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream: false;
}

interface OllamaGenerateResponse {
  response?: string;
  error?: string;
}

interface OllamaTag {
  name?: string;
}

interface OllamaTagsResponse {
  models?: OllamaTag[];
}

export type OllamaModelCapability =
  | "chat"
  | "cloud"
  | "embed"
  | "ocr"
  | "reasoning"
  | "vision";

export function normalizeOllamaEndpoint(endpoint: string) {
  return endpoint.trim().replace(/\/+$/, "");
}

export function buildOllamaPrompt({ rawInput, localMarkdown }: OllamaPromptInput) {
  return [
    "You are RESQ running locally with Ollama.",
    "Transform the provided text into clean GitHub Flavored Markdown.",
    "Preserve meaning, keep useful structure, and improve readability.",
    "Prefer headings, lists, tables, quotes, and fenced code blocks when appropriate.",
    "RETURN ONLY THE FINAL MARKDOWN.",
    "",
    "RAW INPUT:",
    rawInput.trim(),
    "",
    "LOCAL DRAFT:",
    localMarkdown.trim(),
  ].join("\n");
}

export function buildOllamaRequest({ model, rawInput, localMarkdown }: OllamaRequestInput): OllamaGenerateRequest {
  return {
    model: model.trim(),
    prompt: buildOllamaPrompt({ rawInput, localMarkdown }),
    stream: false,
  };
}

export function parseOllamaResponse(payload: OllamaGenerateResponse) {
  const text = payload.response?.trim();
  if (!text) {
    throw new Error(payload.error || "Ollama returned an empty response.");
  }

  return text;
}

export function parseOllamaModels(payload: OllamaTagsResponse) {
  const models = (payload.models ?? [])
    .map((model) => model.name?.trim())
    .filter((name): name is string => Boolean(name));

  return [...new Set(models)].sort((left, right) => left.localeCompare(right));
}

export function inferOllamaModelCapabilities(modelName: string): OllamaModelCapability[] {
  const name = modelName.toLowerCase();
  const capabilities: OllamaModelCapability[] = [];

  if (name.includes("embed")) {
    capabilities.push("embed");
  }
  if (name.includes("vision") || name.includes("-vl") || name.includes("vl:")) {
    capabilities.push("vision");
  }
  if (name.includes("ocr")) {
    capabilities.push("ocr");
  }
  if (name.includes("thinking") || /(?:^|[^a-z0-9])r1(?:[^a-z0-9]|$)/.test(name)) {
    capabilities.push("reasoning");
  }
  if (name.includes(":cloud") || name.includes("-cloud")) {
    capabilities.push("cloud");
  }
  if (capabilities.length === 0) {
    capabilities.push("chat");
  }

  return capabilities;
}

function formatCapability(capability: OllamaModelCapability) {
  switch (capability) {
    case "chat":
      return "Chat";
    case "cloud":
      return "Cloud";
    case "embed":
      return "Embed";
    case "ocr":
      return "OCR";
    case "reasoning":
      return "Reasoning";
    case "vision":
      return "Vision";
  }
}

export function formatOllamaModelLabel(modelName: string) {
  const labels = inferOllamaModelCapabilities(modelName).map(formatCapability);
  return `${modelName} · ${labels.join(", ")}`;
}

export async function enhanceMarkdownWithOllama({
  endpoint,
  model,
  rawInput,
  localMarkdown,
}: {
  endpoint: string;
  model: string;
  rawInput: string;
  localMarkdown: string;
}) {
  const baseUrl = normalizeOllamaEndpoint(endpoint);
  const response = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      buildOllamaRequest({
        model,
        rawInput,
        localMarkdown,
      }),
    ),
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as OllamaGenerateResponse;
  return parseOllamaResponse(payload);
}

export async function listOllamaModels(endpoint: string) {
  const baseUrl = normalizeOllamaEndpoint(endpoint);
  const response = await fetch(`${baseUrl}/api/tags`);

  if (!response.ok) {
    throw new Error(`Could not load Ollama models (status ${response.status}).`);
  }

  const payload = (await response.json()) as OllamaTagsResponse;
  return parseOllamaModels(payload);
}
