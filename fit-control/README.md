# FIT CONTROL core — P0-02A

Isolated TypeScript workspace; do not run npm at legacy repo root. No runtime dependencies, no backend, no personal data. Prerequisites: Node 22 (verified 22.16.0), npm 10 (verified 10.9.2), TypeScript compiler 5.8.3 on PATH (external build tool, not installed by npm ci).

```sh
cd fit-control
npm ci --offline --ignore-scripts --no-audit --no-fund
npm run typecheck
npm test
```

Use portion(food, amount, unit) and dayBalance(entries, localDate, targetKcal). Values per explicit basis are scaled without display rounding. No implicit g/ml/piece conversions; use a source with the matching basis. Null nutrient is unknown; known subtotal and missing count are returned separately. Confirmed and planned totals are independent; forecast combines them; remaining uses confirmed only. Empty diary means zero logged intake, not proof of zero actual intake. Duplicate IDs rejected. Date is stored local calendar date, not derived from current timezone. Caller supplies latest entry revision; full source provenance, storage, import validation, UI, offline shell and native widgets belong to later tasks. JS number arithmetic is approximate; no fixed-point guarantee at extreme magnitudes.
