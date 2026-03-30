import { profileCache } from '../api/profile-cache.js';
import { ToolResult, LinkedInProfile } from '../types.js';
import { validate } from '../utils/char-counter.js';
import { createDiff } from '../utils/diff.js';
import { get_profile } from './read.js';
import { linkedinClient } from '../api/client.js';
import { ENDPOINTS } from '../api/endpoints.js';

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
    // Perform partial update using POST with PATCH override (X-RestLi-Method: PARTIAL_UPDATE)
    await linkedinClient.post(ENDPOINTS.ME, {
      patch: {
        $set: {
          headline: {
            localized: {
              'en_US': newHeadline
            }
          }
        }
      }
    }, {
      headers: {
        'X-RestLi-Method': 'PARTIAL_UPDATE'
      }
    });
    
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
    // Perform partial update for summary
    await linkedinClient.post(ENDPOINTS.ME, {
      patch: {
        $set: {
          summary: {
            localized: {
              'en_US': newSummary
            }
          }
        }
      }
    }, {
      headers: {
        'X-RestLi-Method': 'PARTIAL_UPDATE'
      }
    });

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

/**
 * Updates profile pronunciation.
 */
export async function update_pronunciation(pronunciation: string): Promise<ToolResult> {
  return {
    success: true,
    message: 'Pronunciation updated (simulated).',
    data: { pronunciation }
  };
}

/**
 * Updates contact information.
 */
export async function update_contact_info(contactInfo: any): Promise<ToolResult> {
  return {
    success: true,
    message: 'Contact information updated (simulated).',
    data: { contactInfo }
  };
}
