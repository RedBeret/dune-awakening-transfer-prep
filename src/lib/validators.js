const REGION_SET = new Set(['NA', 'EU', 'OCE', 'SA', 'ASIA', 'Unknown']);
const STATUS_SET = new Set(['Online', 'Offline', 'Maintenance']);

function toInt(value, fieldName) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${fieldName}: expected number`);
  }
  return Math.trunc(parsed);
}

export function normalizeWorld(input) {
  if (!input || typeof input !== 'object') throw new Error('World must be an object');

  const name = String(input.name || '').trim();
  if (!name) throw new Error('World name is required');

  const regionRaw = String(input.region || 'Unknown').trim().toUpperCase();
  const region = REGION_SET.has(regionRaw) ? regionRaw : 'Unknown';

  const datacenter = String(input.datacenter || 'Unknown').trim() || 'Unknown';
  const players = Math.max(0, toInt(input.players ?? 0, 'players'));
  const capacity = Math.max(1, toInt(input.capacity ?? 1, 'capacity'));
  const statusRaw = String(input.status || 'Online').trim();
  const normalizedStatus = STATUS_SET.has(statusRaw) ? statusRaw : 'Online';
  const type = String(input.type || 'Official').trim() || 'Official';

  if (players > capacity * 10) {
    throw new Error(`World ${name} has unrealistic player count`);
  }

  return {
    name,
    region,
    datacenter,
    players,
    capacity,
    status: normalizedStatus,
    type
  };
}

export function normalizeSnapshot(input) {
  if (!input || typeof input !== 'object') throw new Error('Snapshot must be an object');
  const capturedAt = new Date(input.capturedAt || Date.now());
  if (Number.isNaN(capturedAt.getTime())) throw new Error('Invalid capturedAt timestamp');

  const source = String(input.source || 'manual').trim() || 'manual';
  const worldsInput = Array.isArray(input.worlds) ? input.worlds : input;
  if (!Array.isArray(worldsInput)) throw new Error('Snapshot worlds must be an array');

  const worlds = worldsInput.map(normalizeWorld).sort((a, b) => a.name.localeCompare(b.name));
  if (worlds.length === 0) throw new Error('Snapshot contains no worlds');

  return {
    capturedAt: capturedAt.toISOString(),
    source,
    worlds
  };
}

export function validateChecklistMap(value, validIds) {
  const out = {};
  if (!value || typeof value !== 'object') return out;

  for (const id of validIds) {
    out[id] = Boolean(value[id]);
  }

  return out;
}
