import { describe, it, expect } from 'vitest';
import { csvToSnapshot, snapshotsToCsv } from './csv';

describe('csv import/export', () => {
  it('round trips a snapshot', () => {
    const snap = {
      capturedAt: '2026-02-23T19:00:00Z',
      source: 'test',
      worlds: [
        { name: 'Harmony', region: 'NA', datacenter: 'Washington', players: 123, capacity: 1000, status: 'Online', type: 'Official' }
      ]
    };

    const csv = snapshotsToCsv([snap]);
    const parsed = csvToSnapshot(csv);
    expect(new Date(parsed.capturedAt).toISOString()).toBe(new Date(snap.capturedAt).toISOString());
    expect(parsed.worlds[0].name).toBe('Harmony');
    expect(parsed.worlds[0].players).toBe(123);
  });

  it('fails when required columns are missing', () => {
    expect(() => csvToSnapshot('name,players\nHarmony,1')).toThrow(/capturedat/i);
  });
});
