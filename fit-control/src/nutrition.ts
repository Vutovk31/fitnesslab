export const keys = ['kcal', 'protein_g', 'fat_g', 'carbs_g'] as const;
export type Nutrient = typeof keys[number];
export type Nutrition = Record<Nutrient, number | null>;
export type Unit = 'g' | 'ml' | 'piece';
export type Status = 'draft' | 'planned' | 'confirmed' | 'deleted';
export type Food = Nutrition & { basis_amount: number; basis_unit: Unit };
export type Entry = { id: string; local_date: string; status: Status; amount: number | null; unit: Unit; food: Food };
export type Total = { known: number; missing: number; total: number | null };
export type Totals = Record<Nutrient, Total>;
const units: readonly string[] = ['g', 'ml', 'piece'];
const statuses: readonly string[] = ['draft', 'planned', 'confirmed', 'deleted'];
function numberValue(value: unknown, positive = false): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || (positive && value === 0)) throw new RangeError('Invalid numeric value');
}
function dateValue(date: string) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new RangeError('Invalid local date');
  const d = new Date(date + 'T00:00:00Z');
  if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0, 10) !== date) throw new RangeError('Invalid local date');
}
function record<T>(fn: (key: Nutrient) => T): Record<Nutrient, T> {
  return Object.fromEntries(keys.map(k => [k, fn(k)])) as Record<Nutrient, T>;
}
export function portion(food: Food, amount: number, unit: Unit): Nutrition {
  numberValue(food.basis_amount, true);
  numberValue(amount, true);
  if (!units.includes(unit) || !units.includes(food.basis_unit) || unit !== food.basis_unit) throw new RangeError('Unit mismatch');
  return record(k => {
    const value = food[k];
    if (value === null) return null;
    numberValue(value);
    const result = (amount / food.basis_amount) * value;
    numberValue(result);
    return result;
  });
}
function summarize(rows: Nutrition[]): Totals {
  return record(k => {
    let known = 0, missing = 0;
    for (const row of rows) {
      const value = row[k];
      if (value === null) missing++;
      else { known += value; numberValue(known); }
    }
    return { known, missing, total: missing ? null : known };
  });
}
export function dayBalance(entries: readonly Entry[], date: string, targetKcal: number | null) {
  dateValue(date);
  if (targetKcal !== null) numberValue(targetKcal, true);
  const ids = new Set<string>();
  const actual: Nutrition[] = [], planned: Nutrition[] = [];
  for (const e of entries) {
    dateValue(e.local_date);
    if (typeof e.id !== 'string' || !e.id.trim() || ids.has(e.id)) throw new RangeError('Invalid or duplicate entry id');
    ids.add(e.id);
    if (!statuses.includes(e.status)) throw new RangeError('Invalid entry status');
    if (e.local_date !== date || e.status === 'draft' || e.status === 'deleted') continue;
    numberValue(e.amount, true);
    const row = portion(e.food, e.amount, e.unit);
    (e.status === 'confirmed' ? actual : planned).push(row);
  }
  const confirmed = summarize(actual), plan = summarize(planned), forecast = summarize([...actual, ...planned]);
  const remainingKcal = targetKcal === null || confirmed.kcal.total === null ? null : targetKcal - confirmed.kcal.total;
  return { date, confirmed, planned: plan, forecast, remainingKcal, confirmedCount: actual.length, plannedCount: planned.length };
}
