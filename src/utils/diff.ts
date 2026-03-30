import { profileCache } from '../api/profile-cache.js';
import { DiffPreview } from '../types.js';
import { validate } from './char-counter.js';

/**
 * Creates a preview of changes for a specific field.
 * 
 * @param field The field being updated.
 * @param before The current value.
 * @param after The new value.
 * @returns A DiffPreview object.
 */
export function createDiff(field: string, before: string, after: string): DiffPreview {
  const validation = validate(after, field);
  const warnings: string[] = [];

  if (!validation.valid) {
    warnings.push(`Exceeds LinkedIn character limit for ${field} (${validation.count}/${validation.limit})`);
  }

  return {
    field,
    before: before || '',
    after: after || '',
    charsBefore: (before || '').length,
    charsAfter: (after || '').length,
    charsRemaining: Math.max(0, validation.limit - (after || '').length),
    warnings,
  };
}
