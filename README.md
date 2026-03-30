# LinkedIn Profile MCP Server

A Model Context Protocol (MCP) server for interacting with and optimizing LinkedIn profiles. This server provides tools for reading profile data, updating sections (headline, summary, experience, etc.), and leveraging AI for profile analysis and ATS optimization.

## Features

- **Profile Management**: Read and update headline, summary, experience, education, skills, and more.
- **Content Creation**: Post updates and articles directly to LinkedIn.
- **AI Assistance**: Analyze profile strengths/weaknesses, generate content, and optimize for ATS (Applicant Tracking Systems).
- **Secure Storage**: Uses Keytar for secure local credential storage.

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm
- LinkedIn Developer App credentials (see [Setup OAuth Guide](docs/setup-oauth.md))

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd linkedin-profile-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

### Usage

Start the MCP server:
```bash
npm start
```

The server runs on `stdio` and can be connected to any MCP-compatible client.

### Testing
Run the test suite (uses experimental VM modules):
```bash
npm run test
```

## Documentation

- [Tools Reference](docs/tools-reference.md): Complete list of available tools.
- [Setup OAuth](docs/setup-oauth.md): Guide to configuring LinkedIn API access.
- [Contributing](CONTRIBUTING.md): Guide for developers.
