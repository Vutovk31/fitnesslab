import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createWidgetSnapshot,readWidgetSnapshot,WIDGET_TTL_MS} from '../mobile/widget-snapshot.mjs';
import {prepareEntry} from '../dist/diary-editor.js';
import {makeForm} from '../preview/diary-preview.mjs';
const date='2026-01-01',now=date+'T10:00:00.000Z',timezone='UTC';
const targets={kcal:2000,protein_g:150,fat_g:70,carbs_g:null};let seq=0;
const row=(extra={},intent='confirm')=>prepareEntry({...makeForm(date,timezone),name:'Synthetic private food',amount:'100',kcal:'120',protein_g:'',fat_g:'0',carbs_g:'20',source_reference:'private fixture',...extra},intent,{id:`00000000-0000-4000-8000-${String(++seq).padStart(12,'0')}`,now}).entry;
const build=(entries=[],extra={})=>createWidgetSnapshot({enabled:true,entries,date,timezone,now,targets,...extra});
const read=(s,extra={})=>readWidgetSnapshot(s,{enabled:true,now,timezone,...extra});
test('default and nonboolean privacy settings hide all data before input validation',()=>{
 for(const enabled of [undefined,false,'true',1,null]){assert.deepEqual(createWidgetSnapshot({enabled,entries:null}),{version:1,visibility:'hidden'});assert.deepEqual(readWidgetSnapshot(build([row()]),{enabled}),{state:'hidden'});}
 assert.deepEqual(read(createWidgetSnapshot()),{state:'hidden'});
});
test('confirmed only, zero vs unknown, missing target, and no diary details',()=>{
 const entries=[row(),row({kcal:'999'},'plan'),row({kcal:'888'},'save-draft'),{...row({kcal:'777'}),status:'deleted',revision:2},row({local_date:'2026-01-02',kcal:'666'})];const before=JSON.stringify(entries),s=build(entries);
 assert.equal(s.has_confirmed,true);assert.deepEqual(s.nutrients.kcal,{confirmed:120,target:2000,remaining:1880});assert.deepEqual(s.nutrients.protein_g,{confirmed:null,target:150,remaining:null});assert.deepEqual(s.nutrients.fat_g,{confirmed:0,target:70,remaining:70});assert.deepEqual(s.nutrients.carbs_g,{confirmed:20,target:null,remaining:null});assert.equal(JSON.stringify(entries),before);assert.doesNotMatch(JSON.stringify(s),/Synthetic|private fixture|00000000|planned|food|source/);assert.equal(read(s).state,'ready');
});
test('empty or planned-only day distinguishable from confirmed zero; over-target remains negative',()=>{
 const empty=build([row({},'plan')]);assert.equal(empty.has_confirmed,false);assert.equal(empty.nutrients.kcal.confirmed,0);const zero=build([row({kcal:'0'})]);assert.equal(zero.has_confirmed,true);assert.equal(zero.nutrients.kcal.confirmed,0);assert.equal(build([row({kcal:'2500'})]).nutrients.kcal.remaining,-500);
});
test('TTL boundary, future timestamp, midnight and timezone change hide nutrition',()=>{
 const s=build([row()]);assert.equal(read(s,{now:new Date(Date.parse(now)+WIDGET_TTL_MS-1).toISOString()}).state,'ready');assert.deepEqual(read(s,{now:new Date(Date.parse(now)+WIDGET_TTL_MS).toISOString()}),{state:'stale'});assert.deepEqual(read(s,{now:'2026-01-01T09:59:59.999Z'}),{state:'unavailable'});assert.deepEqual(read(s,{timezone:'Europe/Moscow'}),{state:'stale'});
 const night=build([],{now:'2026-01-01T23:59:59.000Z'});assert.deepEqual(read(night,{now:'2026-01-02T00:00:00.000Z'}),{state:'stale'});assert.throws(()=>build([],{now:'2026-01-01T22:00:00.000Z',timezone:'Europe/Moscow'}),RangeError);
});
test('invalid producer inputs fail closed, including duplicate IDs and bounds',()=>{
 const a=row();for(const patch of [{date:'2026-02-30'},{timezone:'+03:00'},{timezone:'No/Such_Zone'},{now:'2026-01-01T10:00:00Z'},{targets:{...targets,kcal:0}},{targets:{...targets,extra:1}}])assert.throws(()=>build([],patch),RangeError);
 assert.throws(()=>build([a,a]),RangeError);assert.throws(()=>build(Array(2001).fill(a)),RangeError);assert.throws(()=>build([{...a,food:{...a.food,kcal:-1}}]),RangeError);
});
test('consumer rejects unknown version, extra fields, inconsistent values and invalid clock; detached result',()=>{
 const s=build([row()]);for(const bad of [null,{...s,version:2},{...s,food:'secret'},{...s,has_confirmed:false},{...s,nutrients:{...s.nutrients,kcal:{...s.nutrients.kcal,remaining:1}}},{...s,nutrients:{...s.nutrients,kcal:{...s.nutrients.kcal,confirmed:Infinity}}}])assert.deepEqual(read(bad),{state:'unavailable'});
 assert.deepEqual(read(s,{now:'bad'}),{state:'unavailable'});const r=read(s);r.snapshot.nutrients.kcal.confirmed=999;assert.equal(s.nutrients.kcal.confirmed,120);
});
