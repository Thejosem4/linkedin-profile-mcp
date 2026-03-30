---
design_depth: standard
task_complexity: complex
date: 2026-03-29
topic: linkedin-profile-mcp
---

# Design Document: LinkedIn Profile MCP

## 1. Problem Statement
The `linkedin-profile-mcp` project addresses the challenge of manual, non-optimized LinkedIn profile management. Current processes are fragmented, time-consuming, and often lack the strategic keyword optimization required for modern recruitment and branding. By creating a dedicated MCP server, we empower Claude to act as an expert consultant with direct read/write access to the LinkedIn API, enabling seamless profile audits, AI-driven content generation, and structured updates—all verified by the user through a `diff_preview` mechanism.

## 2. Requirements

### Functional Requirements
- **Read Operations**: Complete profile retrieval, search-keyword extraction, and profile analytics (views/searches).
- **Write Operations**: Modular tools for Identity (headline, summary, contact), Experience (positions, media, education), Skills, Credentials (certs, licenses), Projects, Content (articles, posts), Community (recommendations, open-to-work), and Enrichment (volunteering, languages, publications).
- **AI-Assist Layer**: Automated profile diagnosis (`analyze_profile`), content generation (`generate_content`), and ATS gap analysis (`ats_optimize`).
- **Confirmation Flow**: Mandatory `diff_preview` for all write operations before applying changes.

### Non-Functional Requirements
- **Security**: OAuth 2.0 authentication with secure storage via `keytar` in the **User Home** directory—*protects sensitive user tokens across sessions*.
- **Quality Control**: Automated "prohibited words" (cliché) detection with user-visible warnings—*ensures professional, high-impact profile content*.
- **Rate Management**: A local quota tracker and `bottleneck` queue to manage LinkedIn's 100 req/day limit—*prevents API lockouts and provides transparency to the user*.

### Constraints
- **Character Limits**: Strict adherence to LinkedIn's per-section limits (e.g., Headline: 120, Summary: 2600)—*ensures compatibility with the LinkedIn platform*.
- **API Availability**: Limited to the `rw_me` and `ugcPosts` scopes for personal profile management.

## 3. Approach

### Selected Approach: Modular Tool-per-Section
This approach implements a granular, per-section tool structure, aligning Claude's reasoning directly with the LinkedIn profile's modular architecture. Every section—identity, experience, skills, and credentials—is managed by a dedicated MCP tool with its own specialized prompt template and Zod schema.

**Key Decisions**:
- **Modular Toolset**: 40+ specialized tools instead of a monolithic updater—*enables Claude to reason about specific profile sections with focused context*.
- **Shared Core Utils**: Centralized `diff-generator`, `char-counter`, and `quota-manager`—*ensures consistent validation and safety across all tools*.

**Alternatives Considered**:
- **Generic Resource-Based Tooling**: Rejected due to higher complexity for Claude to reason about generic payloads and harder specialization of prompt templates—*modular tools provide a more natural and robust interface for an AI assistant*.

**Decision Matrix Summary**:
- **Approach 1 (Modular)**: **4.7** (Weighted Total)
- **Approach 2 (Generic)**: **3.6** (Weighted Total)

## 4. Architecture

### Component Layers
- **MCP Server (Node.js/TypeScript)**: The core entry point that registers the toolset with Claude and orchestrates the other layers.
- **Auth Module**: Manages the OAuth 2.0 flow with a **Local Callback** server on `localhost:3000`. Securely stores tokens in the **User Home** directory via `keytar`.
- **API Client (Axios + Bottleneck)**: A robust LinkedIn v2 client with a `bottleneck` queue to strictly adhere to the 100 req/day limit and handle 429 errors gracefully.
- **Prompt System**: A hierarchical prompt architecture featuring a **Global System Prompt**, **Tool-Specific Templates**, and **Quality Rules** (including prohibited words detection).
- **Utility Layer**: Core services for `diff-generator`, `char-counter`, and `quota-manager`.

### Data Flow
1. **Read**: Claude calls `get_profile` to establish current context.
2. **AI Assist**: Claude uses `analyze_profile` or `generate_content` to propose improvements.
3. **Write Proposal**: Claude calls a specific write tool (e.g., `update_headline`) which generates a **DiffPreview**.
4. **User Confirmation**: The user reviews the `diff_preview` through Claude's interface.
5. **Execution**: Upon user approval, the `apply` operation executes the API call, updating the **Local Quota**.

## 5. Agent Team
- **Architect**: Overall system design and project scaffolding (Phase 1).
- **API_Designer**: Specializing in LinkedIn REST v2 contracts, OAuth 2.0 flow, and the local callback server (Phase 1 & 2).
- **Coder**: Implementation of the 40+ modular tools and the core services layer (Phase 2, 3, 4).
- **Tester**: Comprehensive unit and integration testing using `Jest` and API mocks (Phase 5).
- **Technical_Writer**: Detailed documentation, setup guides, and the tool reference (Phase 6).
- **Code_Reviewer**: Final code quality audit and security check (Phase 6).

## 6. Risk Assessment
- **Risk 1: LinkedIn API Write Scopes Approval (High)**: Denial of `rw_me` or `ugcPosts` scopes. Mitigation: Clear setup guide, "Dry-Run" mode, and Playwright contingency.
- **Risk 2: LinkedIn Rate Limits (Medium)**: Exceeding 100 req/day. Mitigation: `bottleneck` queue and Local Quota Tracker.
- **Risk 3: LinkedIn API Breaking Changes (Medium)**: Centralized endpoints in `endpoints.ts` and robust testing with mock responses.
- **Risk 4: Sensitive Token Exposure (Low)**: Mitigation: `keytar` storage and strict `.gitignore`.

## 7. Success Criteria
- **Successful 6-Phase Execution**: Completion of the modular toolset, authentication module, and AI-assist layer.
- **Stable Authentication Flow**: Functional OAuth 2.0 flow with the **Local Callback** server.
- **Robust Tool Implementation**: 100% of the 40+ modular tools generate correct `diff_preview` outputs.
- **Effective Rate Limiting**: The **Local Quota Tracker** successfully prevents exceeding 100 req/day.
- **High Test Quality**: Achievement of 70% or higher test coverage with API mocks.
- **Clear Onboarding Path**: Fully documented `README.md` and setup guides.
- **Quality-Driven Output**: No clichés in generated content with clear user warnings.
