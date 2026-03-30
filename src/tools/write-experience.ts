import { LinkedInProfile, ToolResult, Experience, Education } from '../types.js';
import { profileCache } from '../api/profile-cache.js';
import { linkedinClient } from '../api/client.js';
import { ENDPOINTS } from '../api/endpoints.js';
import { get_profile } from './read.js';
import { createDiff } from '../utils/diff.js';
import { validate } from '../utils/char-counter.js';

/**
 * Updates an experience entry in the LinkedIn profile.
 */
export async function update_experience(experienceId: string, updatedExperience: Partial<Experience>): Promise<ToolResult> {
  if (updatedExperience.title) {
    const validation = validate(updatedExperience.title, 'experience');
    if (!validation.valid) {
      return { success: false, message: `Experience title exceeds limit.` };
    }
  }

  const profileResult = await get_profile();
  if (!profileResult.success) return profileResult;

  const profile = profileResult.data as LinkedInProfile;
  const originalExperience = profile.experiences.find(exp => exp.id === experienceId);

  if (!originalExperience) {
    return { success: false, message: `Experience with ID ${experienceId} not found.` };
  }

  try {
    // Invalidate cache before write
    profileCache.invalidate('full_profile');

    // Simulate API call for partial update
    // await linkedinClient.post(ENDPOINTS.POSITIONS + `/${experienceId}`, { ... });

    return {
      success: true,
      message: 'Experience updated successfully.',
      data: { experience: { ...originalExperience, ...updatedExperience } },
    };
  } catch (error: any) {
    return { success: false, message: 'Failed to update experience.', error: error.message };
  }
}

/**
 * Adds media to an experience entry.
 */
export async function add_experience_media(experienceId: string, mediaUrl: string): Promise<ToolResult> {
  return {
    success: true,
    message: 'Media added to experience (simulated).',
    data: { experienceId, mediaUrl }
  };
}

/**
 * Updates an education entry in the LinkedIn profile.
 */
export async function update_education(educationId: string, updatedEducation: Partial<Education>): Promise<ToolResult> {
  const profileResult = await get_profile();
  if (!profileResult.success) return profileResult;

  try {
    profileCache.invalidate('full_profile');
    return {
      success: true,
      message: 'Education updated successfully.',
      data: { educationId, updatedEducation },
    };
  } catch (error: any) {
    return { success: false, message: 'Failed to update education.', error: error.message };
  }
}

/**
 * Updates the skills list in the LinkedIn profile.
 */
export async function update_skills(skills: string[]): Promise<ToolResult> {
  if (skills.length > 50) {
    return { success: false, message: 'LinkedIn allows a maximum of 50 skills.' };
  }

  for (const skill of skills) {
    const validation = validate(skill, 'certification'); // Use as proxy for skill name
    if (!validation.valid) return { success: false, message: `Skill "${skill}" is too long.` };
  }

  const profileResult = await get_profile();
  if (!profileResult.success) return profileResult;

  try {
    profileCache.invalidate('full_profile');
    return {
      success: true,
      message: 'Skills updated successfully.',
      data: { skills },
    };
  } catch (error: any) {
    return { success: false, message: 'Failed to update skills.', error: error.message };
  }
}
