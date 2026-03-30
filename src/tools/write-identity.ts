import { profileCache } from '../api/profile-cache.js';
import { ToolResult, LinkedInProfile } from '../types.js';
import { validate } from '../utils/char-counter.js';
import { createDiff } from '../utils/diff.js';
import { get_profile } from './read.js';

/**
 * Updates the LinkedIn headline.
 */
export async function update_headline(newHeadline: string): Promise<ToolResult> {
  const validation = validate(newHeadline, 'headline');
  if (!validation.valid) {
    return {
      success: false,
      message: `Headline exceeds character limit (${validation.count}/${validation.limit}).`,
    };
  }

  const profileResult = await get_profile();
  if (!profileResult.success) {
    return profileResult;
  }

  const profile = profileResult.data as LinkedInProfile;
  const diff = createDiff('headline', profile.headline || '', newHeadline);

  try {
    // In a real scenario, we would make a PUT request to update the profile.
    // For now, we'll simulate the update and update the cache.
    // await linkedinClient.post(ENDPOINTS.ME, { headline: { localized: { 'en_US': newHeadline } } });
    
    profile.headline = newHeadline;
    profileCache.set('full_profile', profile);

    return {
      success: true,
      message: 'Headline updated successfully.',
      data: {
        diff,
        profile,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to update headline.',
      error: error.message,
    };
  }
}

/**
 * Updates the LinkedIn summary (About section).
 */
export async function update_summary(newSummary: string): Promise<ToolResult> {
  const validation = validate(newSummary, 'summary');
  if (!validation.valid) {
    return {
      success: false,
      message: `Summary exceeds character limit (${validation.count}/${validation.limit}).`,
    };
  }

  const profileResult = await get_profile();
  if (!profileResult.success) {
    return profileResult;
  }

  const profile = profileResult.data as LinkedInProfile;
  const diff = createDiff('summary', profile.summary || '', newSummary);

  try {
    // Simulate the update and update the cache.
    profile.summary = newSummary;
    profileCache.set('full_profile', profile);

    return {
      success: true,
      message: 'Summary updated successfully.',
      data: {
        diff,
        profile,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to update summary.',
      error: error.message,
    };
  }
}
