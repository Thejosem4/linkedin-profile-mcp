# Changelog

All notable changes to linkedin-profile-mcp are documented here.

## [1.0.0] — 2026-03-29

### Added
- MCP server with stdio transport compatible with Claude and Claude Code
- OAuth 2.0 authentication flow with temporary local callback server
- Secure token storage via keytar (OS keychain) with file fallback
- Rate limiter enforcing LinkedIn's 100 requests/day limit via bottleneck
- Local quota tracker persisted in ~/.linkedin-profile-mcp/quota.json
- Profile cache with 5-minute TTL, invalidated on writes
- **Read tools:** get_profile, get_analytics
- **Identity tools:** update_headline, update_summary, update_contact_info, update_pronunciation
- **Experience tools:** update_experience, update_education, update_skills, add_experience_media
- **Credentials tools:** add_certification, add_license
- **Projects tools:** add_project, add_honor_award
- **Content tools:** post_update, post_article
- **Community tools:** draft_recommendation, update_open_to_work
- **Enrichment tools:** add_volunteering, update_languages, add_publication
- **AI assist tools:** analyze_profile, generate_content, ats_optimize
- **Auth tools:** authenticate
- MCP prompt system: optimize_profile, propose_headline, propose_summary
- Hierarchical prompt system: global context + per-tool templates + quality rules
- Prohibited words enforcement (no clichés)
- Character limit validation per section (headline 120, summary 2600, etc.)
- diff_preview before every write operation
- 19 unit tests covering core utilities, auth flow, API client, and read tools

### Fixed
- OAuth callback path handling to support dynamic Redirect URIs
- LinkedIn API field mapping for localized content (firstName, lastName, headline, summary)
- Enabled real API calls for headline and summary updates using PARTIAL_UPDATE
- Registered all missing tools in the MCP server schema and handlers
- Unified express types in package.json
- Integrated full user context (sector, objective, tone) into AI prompts
