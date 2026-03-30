import { LinkedInProfile, Experience } from '../types.js';

/**
 * Template for updating the LinkedIn headline.
 */
export function updateHeadlineTemplate(profile: LinkedInProfile, goals?: string): string {
  return `Current Headline: "${profile.headline || 'None'}"
User Goals: ${goals || 'Improve professional presence and visibility.'}

Please propose a new, impactful LinkedIn headline (max 220 characters).
Focus on:
- Current role and expertise.
- Key skills or technologies.
- Unique value proposition or major achievement.
- Use "|" or "•" as separators if needed.

Provide the proposed headline and a brief explanation of why it's better.`;
}

/**
 * Template for updating the LinkedIn summary (About section).
 */
export function updateSummaryTemplate(profile: LinkedInProfile, goals?: string): string {
  return `Current Summary: "${profile.summary || 'None'}"
User Goals: ${goals || 'Create a compelling narrative of my career journey.'}

Please propose a new LinkedIn summary (max 2,600 characters).
Structure it as follows:
1. **Hook**: A strong opening sentence that captures attention.
2. **The Story**: A brief narrative of your career path and what drives you.
3. **Key Achievements**: Highlight 3-4 major accomplishments with metrics if possible.
4. **Core Skills**: A list of your top technical and soft skills.
5. **Call to Action**: A professional closing (e.g., "Open to networking", "Let's connect").

Provide the proposed summary and a brief explanation of the improvements.`;
}

/**
 * Template for updating a LinkedIn experience entry.
 */
export function updateExperienceTemplate(experience: Experience, goals?: string): string {
  return `Current Experience:
- Title: ${experience.title}
- Company: ${experience.companyName}
- Description: "${experience.description || 'None'}"

User Goals: ${goals || 'Highlight achievements and impact in this role.'}

Please propose an updated description for this experience (max 2,000 characters).
Focus on:
- Using strong action verbs.
- Quantifying results (e.g., "Increased revenue by 20%", "Managed a team of 10").
- Highlighting specific technologies or methodologies used.
- Using bullet points for readability.

Provide the proposed description and a brief explanation of the changes.`;
}
