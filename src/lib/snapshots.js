import { normalizeSnapshot } from './validators';

export function mergeSnapshots(existing, incomingRaw) {
  const incoming = normalizeSnapshot(incomingRaw);
  const list = Array.isArray(existing) ? [...existing] : [];

  const dedupeKey = keyForSnapshot(incoming);
  const idx = list.findIndex((s) => keyForSnapshot(s) === dedupeKey);
  if (idx >= 0) {
    list[idx] = incoming; // idempotent replace
  } else {
    list.push(incoming);
  }

  list.sort((a, b) => new Date(a.capturedAt) - new Date(b.capturedAt));
  return list;
}

function keyForSnapshot(snap) {
  const names = (snap.worlds || []).map((w) => `${w.name}:${w.players}/${w.capacity}`).join('|');
  return `${snap.capturedAt}|${snap.source}|${names}`;
}

export function latestSnapshot(snapshots) {
  if (!Array.isArray(snapshots) || snapshots.length === 0) return null;
  return snapshots[snapshots.length - 1];
}

export function diffSnapshots(prev, curr) {
  if (!prev || !curr) return [];
  const prevMap = new Map(prev.worlds.map((w) => [w.name, w]));
  const currMap = new Map(curr.worlds.map((w) => [w.name, w]));
  const names = new Set([...prevMap.keys(), ...currMap.keys()]);
  const diffs = [];

  for (const name of names) {
    const p = prevMap.get(name);
    const c = currMap.get(name);

    const prevPlayers = p?.players ?? 0;
    const currPlayers = c?.players ?? 0;
    const delta = currPlayers - prevPlayers;

    diffs.push({
      name,
      delta,
      currPlayers,
      currCapacity: c?.capacity ?? p?.capacity ?? 0,
      status: c?.status ?? p?.status ?? 'Unknown'
    });
  }

  return diffs.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta) || a.name.localeCompare(b.name));
}
