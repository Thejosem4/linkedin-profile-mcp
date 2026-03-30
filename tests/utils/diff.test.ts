import { createDiff } from '../../src/utils/diff.js';

describe('Diff Utility', () => {
  it('should create an update diff object', () => {
    const diff = createDiff('headline', 'Old Headline', 'New Headline');

    expect(diff.field).toBe('headline');
    expect(diff.before).toBe('Old Headline');
    expect(diff.after).toBe('New Headline');
    expect(diff.charsBefore).toBe(12);
    expect(diff.charsAfter).toBe(12);
  });

  it('should handle adding new fields', () => {
    const diff = createDiff('summary', '', 'New Summary');

    expect(diff.field).toBe('summary');
    expect(diff.before).toBe('');
    expect(diff.after).toBe('New Summary');
  });

  it('should handle removing fields', () => {
    const diff = createDiff('location', 'Old Location', '');

    expect(diff.field).toBe('location');
    expect(diff.before).toBe('Old Location');
    expect(diff.after).toBe('');
  });

  it('should provide warnings for long text', () => {
    const longHeadline = 'A'.repeat(250);
    const diff = createDiff('headline', 'Old', longHeadline);

    expect(diff.warnings.length).toBeGreaterThan(0);
    expect(diff.warnings[0]).toContain('limit');
  });
});
