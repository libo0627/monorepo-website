import { describe, expect, it } from 'vitest';
import { formatDateTime } from './format';

describe('formatDateTime', () => {
  it('格式化 ISO 字符串', () => {
    const result = formatDateTime('2026-01-01T00:00:00.000Z');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  });

  it('非法输入返回占位符', () => {
    expect(formatDateTime('not-a-date')).toBe('-');
  });
});
