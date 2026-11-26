import {test} from 'node:test';
import assert from 'node:assert/strict';
import {matchNutrition,applyNutritionMatch} from '../mobile/nutrition-matcher.mjs';
import {prepareEntry} from '../dist/diary-editor.js';
import {makeForm} from '../preview/diary-preview.mjs';
const date='2026-01-01',now=date+'T10:00:00.000Z';
let seq=0;
const id=()=>`00000000-0000-4000-8000-${String(++seq).padStart(12,'0')}`;
const form=(extra={})=>({...makeForm(date,'UTC'),name:'Тестовая каша',amount:'150',preparation:'cooked',kcal:'120',protein_g:'',fat_g:'0',carbs_g:'20',source_kind:'catalog',source_reference:'fixture',source_license:'fixture-license',source_retrieved_at:now,...extra});
const row=(extra={},intent='confirm')=>prepareEntry(form(extra),intent,{id:id(),now}).entry;
test('exact normalized match deduplicates portion, date, meal and status; excludes drafts/deleted',()=>{
 const a=row(),b=row({amount:'200',local_date:'2026-01-02',meal_type:'dinner'},'plan'),d=row({kcal:'999'},'save-draft'),deleted={...row({kcal:'888'}),status:'deleted'};
 const result=matchNutrition([a,b,d,deleted],{name:' ТЕСТОВАЯ КАША ',unit:'g'});assert.equal(result.status,'unique');assert.equal(result.matches.length,1);assert.equal(result.matches[0].variant.kcal,'120');assert.equal(matchNutrition([a],{name:'каша',unit:'g'}).status,'none');
});
test('distinguishes preparation, unit, basis, provenance and nutrient variants',()=>{
 const a=[row(),row({preparation:'raw'}),row({kcal:'121'}),row({source_reference:'other'}),row({basis_amount:'50'}),row({unit:'ml',basis_unit:'ml'})];
 const q={name:'Тестовая каша',unit:'g'};assert.equal(matchNutrition(a,q).status,'ambiguous');assert.equal(matchNutrition(a,q).matches.length,5);assert.equal(matchNutrition(a,{...q,preparation:'cooked'}).matches.length,4);assert.equal(matchNutrition(a,{...q,unit:'ml'}).matches.length,1);
});
test('explicit selection preserves context and provenance, null is not zero, no input mutation',()=>{
 const entries=[row()],current={...makeForm('2026-01-02','Europe/Moscow'),name:'тестовая каша',amount:'200',meal_type:'dinner'};const before=JSON.stringify({entries,current});const m=matchNutrition(entries,current).matches[0];
 assert.throws(()=>applyNutritionMatch(entries,current,m.key,false),RangeError);const f=applyNutritionMatch(entries,current,m.key,true);assert.equal(f.name,current.name);assert.equal(f.amount,'200');assert.equal(f.meal_type,'dinner');assert.equal(f.local_date,'2026-01-02');assert.equal(f.timezone,'Europe/Moscow');assert.equal(f.source_reference,'fixture');assert.equal(f.source_retrieved_at,now);assert.equal(f.source_license,'fixture-license');assert.equal(f.protein_g,'');assert.equal(f.fat_g,'0');const cmd=prepareEntry(f,'confirm',{id:id(),now});assert.equal(cmd.preview.kcal,240);assert.equal(cmd.preview.protein_g,null);assert.equal(cmd.preview.fat_g,0);assert.equal(JSON.stringify({entries,current}),before);
});
test('stale selection cannot apply a different variant or incompatible query',()=>{
 const a=row(),b=row({kcal:'121'}),q=form();const key=matchNutrition([a,b],q).matches.find(m=>m.variant.kcal==='120').key;assert.throws(()=>applyNutritionMatch([b],q,key,true),RangeError);assert.throws(()=>applyNutritionMatch([a],{...q,unit:'ml'},key,true),RangeError);assert.throws(()=>applyNutritionMatch([a],{...q,name:'Другой'},key,true),RangeError);assert.equal(applyNutritionMatch([b,a],q,key,true).kcal,'120');
});
test('malformed and duplicate entries and bounds fail closed; unusable source excluded',()=>{
 const a=row();const bad=structuredClone(a);bad.food.kcal=-1;assert.throws(()=>matchNutrition([bad],form()),RangeError);assert.throws(()=>matchNutrition([a,a],form()),RangeError);assert.throws(()=>matchNutrition(Array(2001).fill(a),form()),RangeError);assert.throws(()=>matchNutrition(Array.from({length:101},(_,i)=>row({kcal:String(i)})),form()),RangeError);const missing=structuredClone(a);delete missing.food.source.reference;const m=matchNutrition([missing],form());assert.equal(m.status,'none');assert.equal(m.unusable,1);assert.throws(()=>matchNutrition([],form({unit:'kg'})),RangeError);
});
test('returned proposals are detached and no selection is implicit',()=>{
 const a=row();const m=matchNutrition([a],form());m.matches[0].variant.kcal='999';assert.equal(a.food.kcal,120);assert.equal(matchNutrition([a],form()).matches[0].variant.kcal,'120');assert.equal(form().kcal,'120');
});
