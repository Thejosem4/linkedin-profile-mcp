import { createDiff } from '../../src/utils/diff.js';
import { validate, LINKEDIN_LIMITS } from '../../src/utils/char-counter.js';

describe('Diff Utility', () => {
  it('should identify an update', () => {
    const diff = createDiff('headline', 'Old Headline', 'New Headline');
    expect(diff.changeType).toBe('update');
    expect(diff.original).toBe('Old Headline');
    expect(diff.proposed).toBe('New Headline');
  });

  it('should identify an addition', () => {
    const diff = createDiff('summary', '', 'New Summary');
    expect(diff.changeType).toBe('add');
    expect(diff.original).toBe('');
    expect(diff.proposed).toBe('New Summary');
  });

  it('should identify a removal', () => {
    const diff = createDiff('location', 'Old Location', '');
    expect(diff.changeType).toBe('remove');
    expect(diff.original).toBe('Old Location');
    expect(diff.proposed).toBe('');
  });
});

describe('Char Counter Utility', () => {
  it('should validate text within limits', () => {
    const text = 'A short headline';
    const result = validate(text, 'headline');
    expect(result.valid).toBe(true);
    expect(result.count).toBe(text.length);
    expect(result.limit).toBe(LINKEDIN_LIMITS.headline);
    expect(result.remaining).toBe(LINKEDIN_LIMITS.headline - text.length);
  });

  it('should invalidate text exceeding limits', () => {
    const longText = 'a'.repeat(LINKEDIN_LIMITS.headline + 1);
    const result = validate(longText, 'headline');
    expect(result.valid).toBe(false);
    expect(result.count).toBe(longText.length);
    expect(result.remaining).toBe(-1);
  });

  it('should use default limit for unknown fields', () => {
    const text = 'Some text';
    const result = validate(text, 'unknown_field');
    expect(result.limit).toBe(2000);
  });
});
