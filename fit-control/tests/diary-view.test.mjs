import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diaryView, mealOrder } from '../dist/diary-view.js';
const date = '2026-01-01', now = '2026-01-01T10:00:00.000Z';
const targets = { kcal: 500, protein_g: 50, fat_g: 20, carbs_g: 60 };
const entry = (i, overrides = {}) => ({ id: `00000000-0000-4000-8000-${String(i).padStart(12,'0')}`, revision: 1, local_date: date,
  timezone: 'Europe/Moscow', created_at: now, updated_at: now, status: 'confirmed', meal_type: 'breakfast', amount: 150, unit: 'g',
  food: { name: 'Synthetic food', preparation: 'cooked', basis_amount: 100, basis_unit: 'g', kcal: 120, protein_g: 10, fat_g: 4, carbs_g: 8,
    source: { confidence: 'D', kind: 'estimate', reference: 'synthetic fixture' } }, ...overrides });
const view = (rows, t=targets) => diaryView(rows, date, t);
test('empty day: explicit no entries and five fixed meal groups', () => { const v=view([]); assert.equal(v.hasEntries,false); assert.deepEqual(v.groups.map(g=>g.meal),mealOrder); assert.equal(v.cards.kcal.confirmed.total,0); assert.equal(v.cards.kcal.remaining,500); });
test('confirmed portion uses original engine', () => { const v=view([entry(1)]); assert.equal(v.cards.kcal.confirmed.total,180); assert.equal(v.cards.protein_g.remaining,35); assert.equal(v.cards.kcal.progress,.36); assert.equal(v.groups[0].rows[0].nutrition.kcal,180); });
test('planned, confirmed and forecast remain distinct', () => { const v=view([entry(1),entry(2,{status:'planned',meal_type:'lunch'})]); assert.equal(v.cards.kcal.confirmed.total,180); assert.equal(v.cards.kcal.planned.total,180); assert.equal(v.cards.kcal.forecast.total,360); assert.equal(v.cards.kcal.remaining,320); assert.equal(v.groups[1].plannedCount,1); });
test('draft with quantity has preview but never contributes', () => { const v=view([entry(1,{status:'draft'})]); assert.equal(v.draftCount,1); assert.equal(v.groups[0].rows[0].nutrition.kcal,180); assert.equal(v.cards.kcal.forecast.total,0); });
test('draft without amount is not invented', () => { const v=view([entry(1,{status:'draft',amount:null})]); assert.equal(v.groups[0].rows[0].nutrition,null); assert.equal(v.confirmedCount,0); });
test('deleted and other date excluded from visible groups', () => { const v=view([entry(1,{status:'deleted'}),entry(2,{local_date:'2026-01-02'})]); assert.equal(v.hasEntries,false); assert.equal(v.groups.flatMap(g=>g.rows).length,0); });
test('unknown confirmed nutrient shows known subtotal and no remaining/progress', () => { const a=entry(1); a.food.kcal=null; const v=view([a,entry(2)]); assert.deepEqual(v.cards.kcal.confirmed,{known:180,missing:1,total:null}); assert.equal(v.cards.kcal.remaining,null); assert.equal(v.cards.kcal.progress,null); assert.equal(v.cards.protein_g.confirmed.total,30); });
test('unknown planned energy does not contaminate actual', () => { const a=entry(2,{status:'planned'}); a.food.kcal=null; const v=view([entry(1),a]); assert.equal(v.cards.kcal.remaining,320); assert.equal(v.cards.kcal.forecast.total,null); });
test('zero nutrient retained, no target remains unknown', () => { const a=entry(1); a.food.fat_g=0; const v=view([a],{...targets,fat_g:null}); assert.equal(v.cards.fat_g.confirmed.total,0); assert.equal(v.cards.fat_g.remaining,null); });
test('over target signed remainder and clamped visual progress', () => { const v=view([entry(1,{amount:500})]); assert.equal(v.cards.kcal.remaining,-100); assert.equal(v.cards.kcal.progress,1); });
test('stable sorting, no mutation, independent output', () => { const a=entry(2), b=entry(1); const rows=[a,b]; const copy=structuredClone(rows); const v=view(rows); assert.deepEqual(rows,copy); assert.deepEqual(v.groups[0].rows.map(x=>x.id),[b.id,a.id]); v.groups[0].rows[0].nutrition.kcal=999; assert.deepEqual(rows,copy); });
test('metadata and revision for editing retained', () => { const v=view([entry(1,{revision:3,timezone:'Asia/Tokyo'})]); const r=v.groups[0].rows[0]; assert.equal(r.revision,3); assert.equal(r.timezone,'Asia/Tokyo'); assert.equal(r.local_date,date); assert.equal(r.confidence,'D'); assert.equal(r.sourceKind,'estimate'); assert.equal(r.preparation,'cooked'); });
test('invalid or missing targets rejected', () => { for(const t of [0,-1,NaN,Infinity,undefined,'50']) assert.throws(()=>view([],{...targets,protein_g:t}),RangeError); });
test('duplicate ids rejected across dates', () => assert.throws(()=>view([entry(1),entry(1,{local_date:'2026-01-02'})]),RangeError));
test('invalid entry and calendar date fail closed', () => { assert.throws(()=>view([entry(1,{meal_type:'bad'})]),RangeError); assert.throws(()=>diaryView([], '2026-02-30',targets),RangeError); });
