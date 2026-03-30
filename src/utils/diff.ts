import { DiffPreview } from '../types.js';

/**
 * Creates a diff preview object for visual confirmation of changes.
 * 
 * @param field The name of the field being changed.
 * @param before The original value of the field.
 * @param after The proposed new value of the field.
 * @returns A DiffPreview object.
 */
export function createDiff(field: string, before: string, after: string): DiffPreview {
  let changeType: 'update' | 'add' | 'remove' = 'update';

  if (!before && after) {
    changeType = 'add';
  } else if (before && !after) {
    changeType = 'remove';
  }

  return {
    field,
    original: before || '',
    proposed: after || '',
    changeType,
  };
}
