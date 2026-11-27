import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {prepareEntry} from '../dist/diary-editor.js';
import {SQLiteDiary} from '../mobile/sqlite-diary.mjs';
import {trackedDiaryStore} from '../mobile/recovery-store.mjs';
import {readWidgetSnapshot} from '../mobile/widget-snapshot.mjs';
import {widgetPublication} from '../mobile/widget-publication.mjs';
import {widgetPresentation} from '../mobile/widget-consumer.mjs';
const date='2026-01-01',now=date+'T10:00:00.000Z',timezone='UTC';
const targets={kcal:2000,protein_g:150,fat_g:70,carbs_g:200};
function row(n,intent='confirm',extra={}){
  return prepareEntry({name:'Synthetic widget fixture',local_date:date,timezone,meal_type:'breakfast',preparation:'cooked',amount:'200',unit:'g',basis_amount:'100',basis_unit:'g',kcal:'120',protein_g:'',fat_g:'0',carbs_g:'20',source_kind:'estimate',...extra},intent,{id:`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`,now}).entry;
}
// Test-only real file SQLite, serialized and rollback-capable. Not a native driver.
function driver(path){
  const db=new DatabaseSync(path);let tail=Promise.resolve();
  const tx={get:(s,p)=>db.prepare(s).get(...p),all:(s,p)=>db.prepare(s).all(...p),run:(s,p)=>db.prepare(s).run(...p)};
  return {db,transaction(work){const run=tail.then(async()=>{db.exec('BEGIN IMMEDIATE');try{const value=await work(tx);db.exec('COMMIT');return value;}catch(e){db.exec('ROLLBACK');throw e;}});tail=run.catch(()=>{});return run;},async close(){await tail;db.close();}};
}
async function fixture(t){
  const dir=mkdtempSync(join(tmpdir(),'fc-widget-e2e-')),path=join(dir,'diary.db'),stores=[];
  t.after(async()=>{try{for(const s of stores)await s.close();}finally{rmSync(dir,{recursive:true,force:true});}});
  const open=async()=>{const d=driver(path);try{const s=await SQLiteDiary.open(d);stores.push(s);return {s,d};}catch(e){await d.close();throw e;}};
  return {open,...await open()};
}
function publication(s,readDay=d=>s.readWidgetDay(d)){
  let text='',current={date,now,timezone};
  const app=widgetPublication({source:{synthetic:true,readDay},transport:{synthetic:true,replace(value){text=value;return true;}},clock:()=>({...current})});
  return {app,payload:()=>text,render:(enabled=true)=>widgetPresentation(text,{...current,enabled,unlocked:true,surface:'home'},readWidgetSnapshot)};
}
test('real file SQLite to canonical widget: exact confirmed totals, goals and persistence after reopen',async t=>{
  const {s,open}=await fixture(t);await s.setGoals(targets,0);await s.create(row(1));await s.create(row(2,'plan',{kcal:'999'}));await s.create(row(3,'save-draft',{amount:''}));const dead=await s.create(row(4));await s.remove(dead.id,1,now);await s.create(row(5,'confirm',{local_date:'2026-01-02'}));
  const before=await s.exportBackup(3);await s.close();const {s:reopened}=await open();const p=publication(reopened);
  assert.equal(p.app.consent(true),true);assert.equal(await p.app.refresh(),true);assert.equal(p.render().state,'ready');assert.deepEqual(p.render().nutrients.map(n=>[n.confirmed,n.target,n.remaining]),[[240,2000,1760],[null,150,null],[0,70,70],[40,200,160]]);
  assert.doesNotMatch(p.payload(),/Synthetic widget fixture|00000000|entries|source/);assert.equal(await reopened.exportBackup(3),before);assert.equal((await reopened.getRecovery()).sequence,0);
});
test('tracked mutation invalidates widget before storage and committed journal blocks publication until acknowledgement',async t=>{
  const {s}=await fixture(t);await s.setGoals(targets,0);await s.create(row(1));const p=publication(s),store=trackedDiaryStore(s);p.app.consent(true);await p.app.refresh();assert.equal(p.render().state,'ready');
  const e=await p.app.duringMutation(async()=>{assert.equal(p.render().state,'hidden');assert.equal(await p.app.refresh(),false);return store.create(row(2));});assert.equal(e.status,'confirmed');const journal=await store.getRecovery();assert.equal(journal.status,'committed');assert.equal(await p.app.refresh(),false);assert.equal(p.render().state,'hidden');
  await store.acknowledgeRecovery(journal.sequence,journal.status,true);assert.equal(await p.app.refresh(),true);assert.equal(p.render().nutrients[0].confirmed,480);
  const g=await p.app.duringMutation(()=>store.setGoals({...targets,kcal:2200},1));assert.equal(g.revision,2);assert.equal(await p.app.refresh(),false);const j=await store.getRecovery();await store.acknowledgeRecovery(j.sequence,j.status,true);assert.equal(await p.app.refresh(),true);assert.equal(p.render().nutrients[0].remaining,1720);
});
test('prepared operation and corrupt SQLite row refuse widget result; no implicit journal acknowledgement or repair',async t=>{
  const {s,d}=await fixture(t);const e=await s.create(row(1));const p=publication(s);p.app.consent(true);assert.equal(await p.app.refresh(),true);
  const seq=await s.prepareOperation('create');assert.equal(await p.app.refresh(),false);assert.equal(p.render().state,'hidden');assert.deepEqual(await s.getRecovery(),{sequence:seq,kind:'create',status:'not_applied'});
  await s.acknowledgeRecovery(seq,'not_applied',true);d.db.prepare('UPDATE fc_entries SET revision=2 WHERE id=?').run(e.id);assert.equal(await p.app.refresh(),false);assert.equal(p.render().state,'hidden');assert.equal(d.db.prepare('SELECT revision FROM fc_entries WHERE id=?').get(e.id).revision,2);assert.equal((await s.getRecovery()).status,'none');
});
test('late actual SQLite snapshot cannot publish after revocation',async t=>{
  const {s}=await fixture(t);await s.create(row(1));let release,started;const gate=new Promise(r=>release=r),seen=new Promise(r=>started=r);
  const p=publication(s,async d=>{const value=await s.readWidgetDay(d);started();await gate;return value;});p.app.consent(true);const pending=p.app.refresh();await seen;p.app.consent(false);release();assert.equal(await pending,false);assert.deepEqual(JSON.parse(p.payload()),{version:1,visibility:'hidden'});assert.equal(p.render(false).state,'hidden');assert.equal((await s.list(date)).length,1);
});
