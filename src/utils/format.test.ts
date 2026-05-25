import { describe, it, expect } from 'vitest';
import { formatInches } from './format';

describe('formatInches', () => {
  it('returns inches only when less than 12', () => {
    expect(formatInches(6)).toBe('6"');
    expect(formatInches(11)).toBe('11"');
  });

  it('returns feet only when no remainder', () => {
    expect(formatInches(12)).toBe("1'");
    expect(formatInches(24)).toBe("2'");
  });

  it('returns feet and inches', () => {
    expect(formatInches(13)).toBe("1' 1\"");
    expect(formatInches(18)).toBe("1' 6\"");
  });

  it('formats fractional inches to 1 decimal', () => {
    expect(formatInches(6.5)).toBe('6.5"');
    expect(formatInches(13.5)).toBe("1' 1.5\"");
  });

  it('rolls over 49ft 12in to 50ft', () => {
    expect(formatInches(600)).toBe("50'");
  });

  it('rolls over when rounding pushes inches to 12', () => {
    // 599.95 → rounds to 600.0 → 50' 0"
    expect(formatInches(599.95)).toBe("50'");
  });

  it('handles zero', () => {
    expect(formatInches(0)).toBe('0"');
  });
});
