import { normalizeSnapshot } from './validators';

function splitCsvLine(line) {
  const out = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      out.push(current);
      current = '';
      continue;
    }

    current += ch;
  }

  out.push(current);
  return out.map((v) => v.trim());
}

export function snapshotsToCsv(snapshots) {
  const lines = ['capturedAt,source,name,region,datacenter,players,capacity,status,type'];
  for (const snap of snapshots) {
    for (const w of snap.worlds) {
      const row = [
        snap.capturedAt,
        snap.source,
        w.name,
        w.region,
        w.datacenter,
        String(w.players),
        String(w.capacity),
        w.status,
        w.type
      ];
      lines.push(row.map(csvEscape).join(','));
    }
  }
  return lines.join('\n');
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[,"\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

export function csvToSnapshot(csvText, defaultSource = 'csv-import') {
  if (!csvText || typeof csvText !== 'string') throw new Error('CSV text is empty');
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) throw new Error('CSV must include header and at least one data row');

  const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const required = ['capturedat', 'name', 'players', 'capacity'];
  for (const r of required) {
    if (!header.includes(r)) {
      throw new Error(`CSV missing required column: ${r}`);
    }
  }

  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const rows = [];

  for (let i = 1; i < lines.length; i += 1) {
    const cols = splitCsvLine(lines[i]);
    rows.push({
      capturedAt: cols[idx.capturedat],
      source: cols[idx.source] || defaultSource,
      world: {
        name: cols[idx.name],
        region: cols[idx.region] || 'Unknown',
        datacenter: cols[idx.datacenter] || 'Unknown',
        players: cols[idx.players],
        capacity: cols[idx.capacity],
        status: cols[idx.status] || 'Online',
        type: cols[idx.type] || 'Official'
      }
    });
  }

  const groups = new Map();
  for (const row of rows) {
    const key = row.capturedAt;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  if (groups.size !== 1) {
    throw new Error('CSV import expects a single snapshot timestamp per file');
  }

  const [capturedAt, groupedRows] = [...groups.entries()][0];
  return normalizeSnapshot({
    capturedAt,
    source: groupedRows[0]?.source || defaultSource,
    worlds: groupedRows.map((r) => r.world)
  });
}
