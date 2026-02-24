import { describe, it, expect } from 'vitest';
import { scoreServer, sortAndScoreServers } from './scoring';

describe('scoring', () => {
  it('penalizes non-online servers', () => {
    const prefs = { preferredRegion: 'NA', minCapacity: 0 };
    const online = scoreServer({ name: 'A', region: 'NA', players: 100, capacity: 1000, status: 'Online' }, prefs);
    const maint = scoreServer({ name: 'B', region: 'NA', players: 100, capacity: 1000, status: 'Maintenance' }, prefs);
    expect(online.total).toBeGreaterThan(maint.total);
  });

  it('sorts by descending score', () => {
    const rows = sortAndScoreServers(
      [
        { name: 'A', region: 'NA', players: 100, capacity: 1000, status: 'Online' },
        { name: 'B', region: 'NA', players: 1000, capacity: 1000, status: 'Online' }
      ],
      { preferredRegion: 'NA', minCapacity: 0 }
    );
    expect(rows[0].name).toBe('A');
  });
});
