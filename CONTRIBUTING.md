# Contributing to LinkedIn Profile MCP

We welcome contributions! This guide will help you add new tools or improve the AI logic.

## Development Setup

1. Clone the repository and install dependencies (`npm install`).
2. Ensure you have a `.env` file with valid LinkedIn API credentials for testing.
3. Run tests using `npm run test`.

## Adding a New Tool

1. **Create the Tool Logic**: Add a new file or function in `src/tools/`. Ensure it returns a `Promise<ToolResult>`.
2. **Export the Tool**: Export your new function in `src/tools/index.ts`.
3. **Register the Tool**: Open `src/index.ts` and:
   - Add the tool definition to the `ListToolsRequestSchema` handler.
   - Add a `case` statement in the `CallToolRequestSchema` handler to execute your function.
4. **Update Documentation**: Add the new tool to `docs/tools-reference.md`.

## Improving AI Logic

The AI assistance tools are located in `src/tools/ai-assist.ts` and use prompts from `src/prompts/`.
- To improve the analysis, modify `analyze_profile` or the underlying prompt templates.
- To improve ATS optimization, update the keyword extraction logic in `src/utils/keyword-extractor.ts`.

## Code Style

- Use TypeScript.
- Prefer explicit types for function parameters and return values.
- Document functions using JSDoc comments.
- Ensure all tests pass before submitting a pull request.
