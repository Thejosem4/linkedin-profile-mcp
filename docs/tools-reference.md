# Tools Reference

This document lists all available tools provided by the LinkedIn Profile MCP Server.

## Read Tools

### `get_profile`
Get the full LinkedIn profile of the authenticated user.
- **Input**: `{}`
- **Output**: JSON object containing profile details (headline, summary, experiences, etc.).

### `get_analytics`
Get LinkedIn profile analytics (e.g., profile views).
- **Input**: `{}`
- **Output**: JSON object with analytics data.

## Write Tools

### `update_headline`
Update the LinkedIn headline.
- **Input**: `{ "headline": "string" }`
- **Output**: Success status and diff.

### `update_summary`
Update the LinkedIn summary (About section).
- **Input**: `{ "summary": "string" }`
- **Output**: Success status and diff.

### `update_experience`
Update an experience entry.
- **Input**: `{ "experienceId": "string", "updates": { "title": "string", "description": "string" } }`
- **Output**: Success status and diff.

### `update_education`
Update an education entry.
- **Input**: `{ "educationId": "string", "updates": { "schoolName": "string", "degree": "string" } }`
- **Output**: Success status and diff.

### `update_skills`
Update the skills list.
- **Input**: `{ "skills": ["string"] }`
- **Output**: Success status and diff.

### `add_certification`
Add a certification.
- **Input**: `{ "certification": { "name": "string", "issuingOrganization": "string" } }`
- **Output**: Success status and diff.

### `post_update`
Post a short update to LinkedIn.
- **Input**: `{ "text": "string" }`
- **Output**: Success status and post details.

## AI & Analysis Tools

### `analyze_profile`
Analyze the profile and provide strategic improvements.
- **Input**: `{}`
- **Output**: JSON object with strengths, weaknesses, and recommendations.

### `ats_optimize`
Optimize the profile for ATS by comparing it with a job description.
- **Input**: `{ "jobDescription": "string" }`
- **Output**: Match percentage, missing keywords, and recommendations.
