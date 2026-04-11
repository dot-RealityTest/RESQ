# RESQ How-To

## Basic Flow

1. Paste rough notes, OCR output, or semi-structured text into the left panel.
2. Click `Convert`.
3. Review the generated Markdown in the preview panel.
4. Copy or export the result as `.md`, `.html`, or `.pdf`.

## When To Use Ollama

Use the Ollama popup when the local parser gives you a strong first draft but you want a softer polish pass.

Good use cases:

- messy meeting notes that need smoother phrasing
- OCR text with awkward breaks
- rough documentation that needs more readable section flow
- text that already has structure but needs cleanup

## Best Input Patterns

RESQ works especially well with:

- short title on the first line
- section labels like `summary:`, `notes:`, `next steps:`, `quote:`, `commands:`
- metadata lines like `owner:`, `status:`, `priority:`
- plain bullet-like lines stacked one per line
- pipe tables copied from text exports

## Desktop Workflow

1. Run `npm run desktop:dev` while developing.
2. Run `npm run desktop:build` for a local packaged macOS app.
3. Open the packaged app from `release/mac-arm64/RESQ.app`.

## Troubleshooting

### Ollama is not working

- Make sure Ollama is running locally.
- Check the endpoint in the Ollama popup.
- Use `Refresh Models` to reload detected models.
- Use `Test Connection` to verify the local server is reachable.

### Export does not look right

- Click `Convert` again after editing the input.
- Check the preview panel first, because export uses the generated Markdown.
- If needed, use the Ollama quick enhance button for a final cleanup pass.

### Desktop app shows an old icon or old build

- Quit the app fully.
- Rebuild with `npm run desktop:build`.
- Reopen `release/mac-arm64/RESQ.app`.
- If macOS still shows the old icon, give Finder or Dock a moment to refresh its cache.
