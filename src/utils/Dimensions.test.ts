import { describe, it, expect } from 'vitest';
import { Dimensions } from './Dimensions';
import { DEFAULT_CONFIG } from './defaults';

const dim = new Dimensions(DEFAULT_CONFIG);

// Default config: mezzClear=7.5ft, gfClear=11ft, slabThick=6in

describe('floor heights', () => {
  it('plinthH is 18 in (1.5 ft)', () => {
    expect(dim.plinthH).toBe(18);
  });

  it('mezzClearIn is 90 in (7.5 ft)', () => {
    expect(dim.mezzClearIn).toBe(90);
  });

  it('mezzTop is 96 in (mezzClear + slab)', () => {
    expect(dim.mezzTop).toBe(96); // 90 + 6
  });

  it('ffTop is 138 in (gfClear + slab)', () => {
    expect(dim.ffTop).toBe(138); // 11×12 + 6
  });

  it('mezzToFF is ffTop minus mezzTop', () => {
    expect(dim.mezzToFF).toBe(dim.ffTop - dim.mezzTop); // 138 - 96 = 42
    expect(dim.mezzToFF).toBe(42);
  });

  it('mezzToFF does not double-count the slab', () => {
    // gfClear (11ft=132in) is total plinth-to-underside-of-FF, so
    // the space above the mezzanine slab = 132 - 96 = 36 in (3 ft clear)
    // mezzToFF adds one more slab to reach the top of the FF = 42 in
    expect(dim.mezzToFF).toBeLessThan(dim.gfClearIn);
  });
});

describe('entry steps', () => {
  it('has 3 entry steps', () => {
    expect(dim.entrySteps).toBe(3);
  });

  it('entry riser divides plinthH evenly', () => {
    expect(dim.entryRiser * dim.entrySteps).toBeCloseTo(dim.plinthH);
  });
});

describe('stair flight 1 (plinth → mezzanine)', () => {
  it('step count covers mezzTop height', () => {
    expect(dim.steps1 * dim.actualRiser1).toBeCloseTo(dim.mezzTop);
  });

  it('actual riser is close to target riser', () => {
    expect(Math.abs(dim.actualRiser1 - dim.targetRiser)).toBeLessThan(dim.targetRiser / 2);
  });

  it('L1 is (steps1 - 1) treads wide', () => {
    expect(dim.L1).toBe((dim.steps1 - 1) * dim.targetTread);
  });
});

describe('stair flight 2 (mezzanine → first floor)', () => {
  it('step count covers mezzToFF height', () => {
    expect(dim.steps2 * dim.actualRiser2).toBeCloseTo(dim.mezzToFF);
  });

  it('actual riser is close to target riser', () => {
    expect(Math.abs(dim.actualRiser2 - dim.targetRiser)).toBeLessThan(dim.targetRiser / 2);
  });

  it('L2 is (steps2 - 1) treads wide', () => {
    expect(dim.L2).toBe((dim.steps2 - 1) * dim.targetTread);
  });

  it('flight 2 is shorter than flight 1 (mezzToFF < mezzTop)', () => {
    expect(dim.steps2).toBeLessThan(dim.steps1);
  });
});

describe('edge cases', () => {
  it('steps are at least 1 even with tiny heights', () => {
    const d = new Dimensions({ ...DEFAULT_CONFIG, mezzClear: 0.1, gfClear: 0.5 });
    expect(d.steps1).toBeGreaterThanOrEqual(1);
    expect(d.steps2).toBeGreaterThanOrEqual(1);
  });

  it('headroom is positive with default config', () => {
    expect(dim.headroom).toBeGreaterThan(0);
  });
});
