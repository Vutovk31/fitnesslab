import { dayBalance, keys, portion, type Nutrition, type Nutrient, type Totals } from './nutrition.js';
import { validateEntry, type DiaryEntry } from './storage.js';

export const mealOrder = ['breakfast', 'lunch', 'snack', 'dinner', 'other'] as const;
type VisibleStatus = Exclude<DiaryEntry['status'], 'deleted'>;
export type DiaryRow = Pick<DiaryEntry, 'id'|'revision'|'amount'|'unit'|'timezone'|'local_date'|'created_at'> & {
  name: string; status: VisibleStatus; confidence: DiaryEntry['food']['source']['confidence'];
  sourceKind: DiaryEntry['food']['source']['kind']; preparation: DiaryEntry['food']['preparation'];
  nutrition: Nutrition | null;
};
export type NutrientCard = { target: number | null; confirmed: Totals[Nutrient]; planned: Totals[Nutrient];
  forecast: Totals[Nutrient]; remaining: number | null; progress: number | null };

/** Read-only projection for the future diary UI. Does not open or write IndexedDB. */
export function diaryView(entries: readonly DiaryEntry[], date: string, targets: Nutrition) {
  for (const k of keys) {
    const t = targets[k];
    if (t !== null && (typeof t !== 'number' || !Number.isFinite(t) || t <= 0)) throw new RangeError('Invalid nutrient target');
  }
  entries.forEach(validateEntry);
  const balance = dayBalance(entries, date, targets.kcal);
  const visible = entries.filter(e => e.local_date === date && e.status !== 'deleted');
  const cards = Object.fromEntries(keys.map(k => {
    const target = targets[k], confirmed = balance.confirmed[k];
    const total = confirmed.total;
    const remaining = target === null || total === null ? null : target - total;
    const progress = target === null || total === null ? null : Math.min(1, total / target);
    return [k, { target, confirmed, planned: balance.planned[k], forecast: balance.forecast[k], remaining, progress }];
  })) as Record<Nutrient, NutrientCard>;
  const groups = mealOrder.map(meal => {
    const items = visible.filter(e => e.meal_type === meal).sort((a,b) =>
      a.created_at < b.created_at ? -1 : a.created_at > b.created_at ? 1 : a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    const totals = dayBalance(items, date, null);
    const rows: DiaryRow[] = items.map(e => ({ id: e.id, revision: e.revision, name: e.food.name,
      status: e.status as VisibleStatus, amount: e.amount, unit: e.unit, local_date: e.local_date,
      timezone: e.timezone, created_at: e.created_at, confidence: e.food.source.confidence,
      sourceKind: e.food.source.kind, preparation: e.food.preparation,
      nutrition: e.amount === null ? null : portion(e.food, e.amount, e.unit) }));
    return { meal, rows, confirmed: totals.confirmed, planned: totals.planned, forecast: totals.forecast,
      confirmedCount: totals.confirmedCount, plannedCount: totals.plannedCount,
      draftCount: rows.filter(r => r.status === 'draft').length };
  });
  return { date, cards, groups, confirmedCount: balance.confirmedCount, plannedCount: balance.plannedCount,
    draftCount: visible.filter(e => e.status === 'draft').length, hasEntries: visible.length > 0 };
}
