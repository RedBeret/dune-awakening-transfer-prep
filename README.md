# Dune Awakening Transfer Prep

Frontend only React app for GitHub Pages.

It helps with:
- transfer prep checklist
- server chooser and scoring
- local snapshot import/export and deltas

## Why this exists

Most community tools already cover maps, recipes and databases. This one focuses on transfer prep workflow and server picking with a local-first UI.

## Features

- Local checklist with browser persistence
- Server ranking by occupancy, free capacity, region preference and status
- Snapshot import from JSON or CSV
- Snapshot export to JSON or CSV
- Delta view between the latest two snapshots
- PWA-ready build for offline use after first load
- No backend and no scraping at runtime

## File structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── data/
│   │   ├── servers.sample.json
│   │   └── transfer-rules.json
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ChecklistPanel.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── ServerChooserPanel.jsx
│   │   ├── ServerTable.jsx
│   │   ├── SnapshotPanel.jsx
│   │   └── ToastRegion.jsx
│   ├── config/
│   │   └── featureFlags.js
│   ├── data/
│   │   ├── checklistItems.js
│   │   └── fallbackServers.js
│   ├── lib/
│   │   ├── citations.js
│   │   ├── csv.js
│   │   ├── http.js
│   │   ├── logger.js
│   │   ├── metrics.js
│   │   ├── scoring.js
│   │   ├── snapshots.js
│   │   ├── storage.js
│   │   └── validators.js
│   ├── state/
│   │   └── AppContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
└── vite.config.js
```

## Run locally

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```

## Build for GitHub Pages

```bash
npm run build
```

This project uses `VITE_BASE_PATH` for the Vite base path so it can deploy to either:
- `https://<user>.github.io/<repo>/`
- `https://<user>.github.io/` (user site repo)

## Deploy workflow

The included GitHub Actions workflow publishes the `dist/` folder to GitHub Pages.

## Import JSON format

```json
{
  "capturedAt": "2026-02-23T19:00:00Z",
  "source": "manual",
  "worlds": [
    {
      "name": "Harmony",
      "region": "NA",
      "datacenter": "Washington",
      "players": 235,
      "capacity": 1000,
      "status": "Online",
      "type": "Official"
    }
  ]
}
```

## Import CSV format

```csv
capturedAt,source,name,region,datacenter,players,capacity,status,type
2026-02-23T19:00:00Z,manual,Harmony,NA,Washington,235,1000,Online,Official
```

## Engineering notes

- Validation rejects malformed snapshots and unrealistic numbers.
- Snapshot merge is idempotent. Re-importing the same snapshot replaces the existing record.
- `fetchJsonWithRetry` uses timeout and exponential backoff for static data load.
- Logs and metrics are client-side only.
- Feature flags live in `src/config/featureFlags.js`.

## Rollback plan

If a deploy breaks:
1. Revert the last commit in GitHub.
2. Push the revert.
3. GitHub Pages workflow will publish the prior stable version.

## Next upgrades

- Add optional strict region filter toggle
- Add URL-share compressed state
- Add a small Help panel with official source excerpts
- Add import adapters for community server exports
