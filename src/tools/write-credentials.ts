import { profileCache } from '../api/profile-cache.js';
import { ToolResult, LinkedInProfile, Certification } from '../types.js';
import { validate } from '../utils/char-counter.js';
import { createDiff } from '../utils/diff.js';
import { get_profile } from './read.js';

/**
 * Adds a certification to the LinkedIn profile.
 */
export async function add_certification(certification: Omit<Certification, 'id'>): Promise<ToolResult> {
  const validation = validate(certification.name, 'certification_name');
  if (!validation.valid) {
    return {
      success: false,
      message: `Certification name exceeds character limit (${validation.count}/${validation.limit}).`,
    };
  }

  const profileResult = await get_profile();
  if (!profileResult.success) {
    return profileResult;
  }

  const profile = profileResult.data as LinkedInProfile;
  const newCertification: Certification = {
    ...certification,
    id: Math.random().toString(36).substring(2, 9), // Mock ID
  };

  const diff = createDiff('certification', '', newCertification.name);

  try {
    // Simulate update and update cache
    profile.certifications.push(newCertification);
    profileCache.set('full_profile', profile);

    return {
      success: true,
      message: 'Certification added successfully.',
      data: {
        diff,
        certification: newCertification,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to add certification.',
      error: error.message,
    };
  }
}

/**
 * Adds a license to the LinkedIn profile.
 */
export async function add_license(license: Omit<Certification, 'id'>): Promise<ToolResult> {
  const validation = validate(license.name, 'certification_name');
  if (!validation.valid) {
    return {
      success: false,
      message: `License name exceeds character limit (${validation.count}/${validation.limit}).`,
    };
  }

  const profileResult = await get_profile();
  if (!profileResult.success) {
    return profileResult;
  }

  const profile = profileResult.data as LinkedInProfile;
  const newLicense: Certification = {
    ...license,
    id: Math.random().toString(36).substring(2, 9), // Mock ID
  };

  const diff = createDiff('license', '', newLicense.name);

  try {
    // Simulate update and update cache
    profile.certifications.push(newLicense);
    profileCache.set('full_profile', profile);

    return {
      success: true,
      message: 'License added successfully.',
      data: {
        diff,
        license: newLicense,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to add license.',
      error: error.message,
    };
  }
}
