import { profileCache } from '../api/profile-cache.js';
import { ToolResult, LinkedInProfile, Experience, Education } from '../types.js';
import { validate } from '../utils/char-counter.js';
import { createDiff } from '../utils/diff.js';
import { get_profile } from './read.js';

/**
 * Updates an experience entry in the LinkedIn profile.
 */
export async function update_experience(experienceId: string, updatedExperience: Partial<Experience>): Promise<ToolResult> {
  if (updatedExperience.title) {
    const validation = validate(updatedExperience.title, 'experience_title');
    if (!validation.valid) {
      return {
        success: false,
        message: `Experience title exceeds character limit (${validation.count}/${validation.limit}).`,
      };
    }
  }

  if (updatedExperience.description) {
    const validation = validate(updatedExperience.description, 'experience_description');
    if (!validation.valid) {
      return {
        success: false,
        message: `Experience description exceeds character limit (${validation.count}/${validation.limit}).`,
      };
    }
  }

  const profileResult = await get_profile();
  if (!profileResult.success) {
    return profileResult;
  }

  const profile = profileResult.data as LinkedInProfile;
  const experienceIndex = profile.experiences.findIndex(exp => exp.id === experienceId);

  if (experienceIndex === -1) {
    return {
      success: false,
      message: `Experience with ID ${experienceId} not found.`,
    };
  }

  const originalExperience = profile.experiences[experienceIndex];
  const diffs = [];

  if (updatedExperience.title && updatedExperience.title !== originalExperience.title) {
    diffs.push(createDiff('experience_title', originalExperience.title, updatedExperience.title));
  }
  if (updatedExperience.description && updatedExperience.description !== originalExperience.description) {
    diffs.push(createDiff('experience_description', originalExperience.description || '', updatedExperience.description));
  }

  try {
    // Simulate update and update cache
    profile.experiences[experienceIndex] = { ...originalExperience, ...updatedExperience };
    profileCache.set('full_profile', profile);

    return {
      success: true,
      message: 'Experience updated successfully.',
      data: {
        diffs,
        experience: profile.experiences[experienceIndex],
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to update experience.',
      error: error.message,
    };
  }
}

/**
 * Updates an education entry in the LinkedIn profile.
 */
export async function update_education(educationId: string, updatedEducation: Partial<Education>): Promise<ToolResult> {
  const profileResult = await get_profile();
  if (!profileResult.success) {
    return profileResult;
  }

  const profile = profileResult.data as LinkedInProfile;
  const educationIndex = profile.educations.findIndex(edu => edu.id === educationId);

  if (educationIndex === -1) {
    return {
      success: false,
      message: `Education with ID ${educationId} not found.`,
    };
  }

  const originalEducation = profile.educations[educationIndex];
  const diffs = [];

  if (updatedEducation.schoolName && updatedEducation.schoolName !== originalEducation.schoolName) {
    diffs.push(createDiff('school_name', originalEducation.schoolName, updatedEducation.schoolName));
  }
  if (updatedEducation.degree && updatedEducation.degree !== originalEducation.degree) {
    diffs.push(createDiff('degree', originalEducation.degree || '', updatedEducation.degree));
  }

  try {
    // Simulate update and update cache
    profile.educations[educationIndex] = { ...originalEducation, ...updatedEducation };
    profileCache.set('full_profile', profile);

    return {
      success: true,
      message: 'Education updated successfully.',
      data: {
        diffs,
        education: profile.educations[educationIndex],
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to update education.',
      error: error.message,
    };
  }
}

/**
 * Updates the skills list in the LinkedIn profile.
 */
export async function update_skills(skills: string[]): Promise<ToolResult> {
  for (const skill of skills) {
    const validation = validate(skill, 'skill_name');
    if (!validation.valid) {
      return {
        success: false,
        message: `Skill "${skill}" exceeds character limit (${validation.count}/${validation.limit}).`,
      };
    }
  }

  const profileResult = await get_profile();
  if (!profileResult.success) {
    return profileResult;
  }

  const profile = profileResult.data as LinkedInProfile;
  const originalSkills = profile.skills.map(s => s.name).join(', ');
  const newSkills = skills.join(', ');
  const diff = createDiff('skills', originalSkills, newSkills);

  try {
    // Simulate update and update cache
    profile.skills = skills.map(name => ({ name }));
    profileCache.set('full_profile', profile);

    return {
      success: true,
      message: 'Skills updated successfully.',
      data: {
        diff,
        skills: profile.skills,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to update skills.',
      error: error.message,
    };
  }
}
