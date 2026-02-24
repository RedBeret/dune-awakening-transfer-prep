import { describe, it, expect } from 'vitest';
import { normalizeSnapshot } from './validators';

describe('validators', () => {
  it('normalizes world fields and sorts', () => {
    const snap = normalizeSnapshot({
      capturedAt: '2026-02-23T19:00:00Z',
      worlds: [
        { name: 'B', region: 'na', players: '2', capacity: '10' },
        { name: 'A', region: 'eu', players: 1, capacity: 10 }
      ]
    });

    expect(snap.worlds[0].name).toBe('A');
    expect(snap.worlds[1].region).toBe('NA');
  });

  it('rejects empty snapshots', () => {
    expect(() => normalizeSnapshot({ capturedAt: '2026-02-23T19:00:00Z', worlds: [] })).toThrow();
  });
});
