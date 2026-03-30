import { profileCache } from '../api/profile-cache.js';
import { ToolResult, LinkedInProfile, Project } from '../types.js';
import { validate } from '../utils/char-counter.js';
import { createDiff } from '../utils/diff.js';
import { get_profile } from './read.js';

/**
 * Adds a project to the LinkedIn profile.
 */
export async function add_project(project: Omit<Project, 'id'>): Promise<ToolResult> {
  const titleValidation = validate(project.title, 'project_title');
  if (!titleValidation.valid) {
    return {
      success: false,
      message: `Project title exceeds character limit (${titleValidation.count}/${titleValidation.limit}).`,
    };
  }

  if (project.description) {
    const descValidation = validate(project.description, 'project_description');
    if (!descValidation.valid) {
      return {
        success: false,
        message: `Project description exceeds character limit (${descValidation.count}/${descValidation.limit}).`,
      };
    }
  }

  const profileResult = await get_profile();
  if (!profileResult.success) {
    return profileResult;
  }

  const profile = profileResult.data as LinkedInProfile;
  const newProject: Project = {
    ...project,
    id: Math.random().toString(36).substring(2, 9), // Mock ID
  };

  const diff = createDiff('project', '', newProject.title);

  try {
    // Simulate update and update cache
    profile.projects.push(newProject);
    profileCache.set('full_profile', profile);

    return {
      success: true,
      message: 'Project added successfully.',
      data: {
        diff,
        project: newProject,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to add project.',
      error: error.message,
    };
  }
}

/**
 * Adds an honor or award to the LinkedIn profile.
 */
export async function add_honor_award(honorAward: { title: string; issuer?: string; description?: string }): Promise<ToolResult> {
  const validation = validate(honorAward.title, 'project_title'); // Use project_title limit as proxy
  if (!validation.valid) {
    return {
      success: false,
      message: `Honor/Award title exceeds character limit (${validation.count}/${validation.limit}).`,
    };
  }

  const profileResult = await get_profile();
  if (!profileResult.success) {
    return profileResult;
  }

  const profile = profileResult.data as LinkedInProfile;
  const newHonorAward = {
    ...honorAward,
    id: Math.random().toString(36).substring(2, 9), // Mock ID
  };

  const diff = createDiff('honor_award', '', newHonorAward.title);

  try {
    // Since honorAwards is not in the LinkedInProfile interface, we'll add it dynamically
    if (!(profile as any).honorAwards) {
      (profile as any).honorAwards = [];
    }
    (profile as any).honorAwards.push(newHonorAward);
    profileCache.set('full_profile', profile);

    return {
      success: true,
      message: 'Honor/Award added successfully.',
      data: {
        diff,
        honorAward: newHonorAward,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to add honor/award.',
      error: error.message,
    };
  }
}
