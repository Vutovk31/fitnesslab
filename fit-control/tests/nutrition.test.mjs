import { test } from 'node:test';
import assert from 'node:assert/strict';
import { portion, dayBalance } from '../dist/nutrition.js';
const food = { basis_amount: 100, basis_unit: 'g', kcal: 120, protein_g: 10, fat_g: 4, carbs_g: 8 };
const date = '2026-01-01';
const entry = (id, status = 'confirmed', overrides = {}) => ({ id, status, local_date: date, amount: 200, unit: 'g', food, ...overrides });
test('grams, declared energy has priority over macro formula', () => assert.deepEqual(portion(food, 150, 'g'), { kcal: 180, protein_g: 15, fat_g: 6, carbs_g: 12 }));
test('milliliters', () => assert.equal(portion({ ...food, basis_unit: 'ml' }, 250, 'ml').kcal, 300));
test('pieces and fractional portions', () => assert.equal(portion({ ...food, basis_unit: 'piece', basis_amount: 1 }, 0.5, 'piece').kcal, 60));
test('null differs from zero; no derived energy', () => assert.deepEqual(portion({ ...food, kcal: null, fat_g: 0 }, 100, 'g'), { kcal: null, protein_g: 10, fat_g: 0, carbs_g: 8 }));
test('no premature rounding', () => assert.ok(Math.abs(portion(food, 1, 'g').kcal - 1.2) < 1e-12));
test('no implicit unit conversion', () => assert.throws(() => portion(food, 100, 'ml'), RangeError));
for (const v of [0, -1, NaN, Infinity, null, '100']) test('reject amount ' + String(v), () => assert.throws(() => portion(food, v, 'g'), RangeError));
test('invalid basis', () => assert.throws(() => portion({ ...food, basis_amount: 0 }, 100, 'g'), RangeError));
test('invalid nutrient', () => assert.throws(() => portion({ ...food, protein_g: -1 }, 100, 'g'), RangeError));
test('missing nutrient field rejected', () => assert.throws(() => portion({ ...food, fat_g: undefined }, 100, 'g'), RangeError));
test('overflow rejected', () => assert.throws(() => portion({ ...food, kcal: Number.MAX_VALUE }, 200, 'g'), RangeError));
test('confirmed, planned, forecast, draft, deleted and other date', () => {
  const r = dayBalance([entry('a'), entry('b', 'planned'), entry('c', 'draft', { amount: null }), entry('d', 'deleted'), entry('e', 'confirmed', { local_date: '2026-01-02' })], date, 500);
  assert.equal(r.confirmed.kcal.total, 240); assert.equal(r.planned.kcal.total, 240); assert.equal(r.forecast.kcal.total, 480); assert.equal(r.remainingKcal, 260); assert.equal(r.confirmedCount, 1); assert.equal(r.plannedCount, 1);
});
test('partial total exposes known subtotal and missing count', () => {
  const r = dayBalance([entry('a'), entry('b', 'confirmed', { food: { ...food, kcal: null } })], date, 500);
  assert.deepEqual(r.confirmed.kcal, { known: 240, missing: 1, total: null }); assert.equal(r.remainingKcal, null); assert.equal(r.confirmed.protein_g.total, 40);
});
test('planned unknown does not invalidate actual', () => {
  const r = dayBalance([entry('a'), entry('b', 'planned', { food: { ...food, kcal: null } })], date, 100);
  assert.equal(r.remainingKcal, -140); assert.equal(r.forecast.kcal.total, null);
});
test('empty day and missing target', () => { const r = dayBalance([], date, null); assert.equal(r.confirmed.kcal.total, 0); assert.equal(r.confirmedCount, 0); assert.equal(r.remainingKcal, null); });
test('duplicate id rejected', () => assert.throws(() => dayBalance([entry('a'), entry('a')], date, 500), RangeError));
test('unknown status rejected', () => assert.throws(() => dayBalance([entry('a', 'bad')], date, 500), RangeError));
test('confirmed missing amount rejected', () => assert.throws(() => dayBalance([entry('a', 'confirmed', { amount: null })], date, 500), RangeError));
test('invalid calendar date rejected', () => assert.throws(() => dayBalance([], '2026-02-30', 500), RangeError));
test('invalid target rejected', () => assert.throws(() => dayBalance([], date, -1), RangeError));
test('aggregate overflow rejected', () => assert.throws(() => dayBalance([entry('a', 'confirmed', { amount: 100, food: { ...food, kcal: Number.MAX_VALUE } }), entry('b', 'confirmed', { amount: 100, food: { ...food, kcal: Number.MAX_VALUE } })], date, 500), RangeError));
