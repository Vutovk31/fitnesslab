import {test} from 'node:test';
import assert from 'node:assert/strict';
import {nutritionCandidates} from '../mobile/nutrition-candidates.mjs';
import {prepareEntry} from '../dist/diary-editor.js';
const date='2026-01-01',zone='UTC';
const parse=s=>nutritionCandidates(s,date,zone);
test('bounded Russian multi-food example preserves names and missing coffee volume',()=>{
 const a=parse('Съел 200 граммов курицы, 150 граммов риса, три яйца и выпил кофе');
 assert.deepEqual(a.map(r=>[r.status,r.form.name,r.form.amount,r.form.unit]),[['explicit','курицы','200','g'],['explicit','риса','150','g'],['explicit','яйца','3','piece'],['missing_quantity','кофе','','g']]);
 for(const r of a)for(const k of ['kcal','protein_g','fat_g','carbs_g'])assert.equal(r.form[k],'');
});
test('canonical structured lines, decimal comma and piece basis',()=>{
 const a=parse('Каша; 150 г\r\n\r\nМолоко; 0,5 мл\nЯйцо; 1 шт.');
 assert.deepEqual(a.map(r=>[r.status,r.form.amount,r.form.basis_amount]),[['explicit','150','100'],['explicit','0,5','100'],['explicit','1','1']]);
 assert.equal(parse('0,5 мл молока, рис 150 г')[0].form.amount,'0,5');
});
test('unsupported, approximate, alternative, negative or joint amount never gets a form',()=>{
 for(const s of ['около 150 г каши','рис и курица 150 г','не съел 150 г каши','рис или гречка 150 г','Каша; 1 кг','Каша; 0 г','Каша; -1 г','150 г риса 200 г','200 г риса или курицы','1e3 г каши','пол яблока','рис; 1 г; 2 г']){
  const r=parse(s);assert.equal(r.length,1,s);assert.equal(r[0].status,'unresolved',s);assert.equal(r[0].form,null,s);assert.equal(r[0].raw,s);
 }
});
test('unresolved fragments retained rather than silently dropped',()=>{
 const a=parse('150 г каши, около 200 г риса, кофе');assert.deepEqual(a.map(r=>r.status),['explicit','unresolved','missing_quantity']);
 assert.equal(a[1].raw,'около 200 г риса');
});
test('bounds, empty input and control characters reject',()=>{
 for(const s of ['',null,'x'.repeat(8001),'a\u0000b',Array(31).fill('рис').join(', ')])assert.throws(()=>parse(s),RangeError);
 assert.equal(parse('x'.repeat(301))[0].status,'unresolved');
});
test('existing editor accepts explicit quantity and keeps unknown nutrition; missing cannot confirm',()=>{
 const ctx={id:'00000000-0000-4000-8000-000000000001',now:date+'T10:00:00.000Z'};
 const a=parse('три яйца, кофе');const cmd=prepareEntry(a[0].form,'confirm',ctx);assert.equal(cmd.entry.amount,3);assert.equal(cmd.entry.food.kcal,null);assert.equal(cmd.preview.kcal,null);assert.throws(()=>prepareEntry(a[1].form,'confirm',ctx),RangeError);
});
