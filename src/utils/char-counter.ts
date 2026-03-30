/**
 * LinkedIn character limits for various profile fields.
 */
export const LINKEDIN_LIMITS: Record<string, number> = {
  headline: 220,
  summary: 2600,
  experience_title: 100,
  experience_description: 2000,
  skill_name: 80,
  certification_name: 255,
  project_title: 255,
  project_description: 2000,
};

export interface ValidationResult {
  valid: boolean;
  count: number;
  limit: number;
  remaining: number;
}

/**
 * Validates the character count of a given text against LinkedIn's limits for a specific field.
 * 
 * @param text The text to validate.
 * @param field The field name to check against (e.g., 'headline', 'summary').
 * @returns A validation result object.
 */
export function validate(text: string, field: string): ValidationResult {
  const limit = LINKEDIN_LIMITS[field] || 2000; // Default to 2000 if field not found
  const count = text.length;
  const remaining = limit - count;
  const valid = count <= limit;

  return {
    valid,
    count,
    limit,
    remaining,
  };
}
