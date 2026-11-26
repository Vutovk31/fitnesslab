import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {SQLiteDiary} from '../mobile/sqlite-diary.mjs';
import {DiaryConflict} from '../dist/storage.js';
const date='2026-01-01',now='2026-01-01T10:00:00.000Z';
const make=(extra={})=>({id:randomUUID(),revision:1,local_date:date,timezone:'Europe/Moscow',created_at:now,updated_at:now,status:'confirmed',meal_type:'breakfast',amount:150,unit:'g',food:{name:"Synthetic ' ? ;",preparation:'cooked',basis_amount:100,basis_unit:'g',kcal:120,protein_g:10,fat_g:4,carbs_g:8,source:{confidence:'D',kind:'estimate'}},...extra});
// Test-only driver, real SQLite file. Serial queue per connection; no native claim.
function driver(path){const db=new DatabaseSync(path);let tail=Promise.resolve();let fail=false;
 const tx={get:(s,p)=>db.prepare(s).get(...p),all:(s,p)=>db.prepare(s).all(...p),run:(s,p)=>db.prepare(s).run(...p)};
 return {db,failNext(){fail=true;},transaction(work){const run=tail.then(async()=>{db.exec('BEGIN IMMEDIATE');try{const result=await work(tx);if(fail){fail=false;throw Error('Injected precommit failure');}db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}});tail=run.catch(()=>{});return run;},async close(){await tail;db.close();}};
}
async function setup(t){const dir=mkdtempSync(join(tmpdir(),'fc-sqlite-')),path=join(dir,'diary.db');const connections=[];const open=async()=>{const d=driver(path);connections.push(d);return {d,s:await SQLiteDiary.open(d)};};t.after(()=>{for(const d of connections)try{d.db.close();}catch{}rmSync(dir,{recursive:true,force:true});});return {path,open,...await open()};}
test('real SQLite persists and preserves source after reopen',async t=>{const {s,open}=await setup(t);const e=make();await s.create(e);assert.equal((await s.balance(date,500)).remainingKcal,320);await s.close();const {s:b}=await open();assert.deepEqual(await b.list(date),[e]);});
test('duplicate rejected; parameterized food text remains literal',async t=>{const {s}=await setup(t);const e=make();await s.create(e);await assert.rejects(s.create(e),DiaryConflict);assert.deepEqual(await s.list(date),[e]);});
test('snapshot copied before async write',async t=>{const {s}=await setup(t);const e=make();const p=s.create(e);e.food.kcal=999;await p;assert.equal((await s.list(date))[0].food.kcal,120);});
test('plan draft and unknown remain distinct',async t=>{const {s}=await setup(t);const e=make();e.food.kcal=null;await s.create(e);await s.create(make({status:'planned',amount:50}));await s.create(make({status:'draft',amount:null}));const b=await s.balance(date,500);assert.equal(b.confirmed.kcal.total,null);assert.equal(b.planned.kcal.total,60);assert.equal(b.remainingKcal,null);});
test('two connections stale revision rejected; date move works',async t=>{const {s,open}=await setup(t);const {s:b}=await open();const e=await s.create(make());const next=await s.update({...e,amount:200,local_date:'2026-01-02'},1);assert.equal(next.revision,2);await assert.rejects(b.update(e,1),DiaryConflict);assert.equal((await b.list(date)).length,0);assert.deepEqual(await b.list('2026-01-02'),[next]);});
test('precommit failure rolls back actual SQL',async t=>{const {s,d}=await setup(t);const e=await s.create(make());d.failNext();await assert.rejects(s.update({...e,amount:200},1),/Injected/);assert.deepEqual(await s.list(date),[e]);});
test('tombstone prevents resurrection',async t=>{const {s}=await setup(t);const e=await s.create(make());const dead=await s.remove(e.id,1,now);assert.equal(dead.status,'deleted');assert.equal(dead.revision,2);await assert.rejects(s.create(e),DiaryConflict);await assert.rejects(s.update({...dead,status:'confirmed'},2),DiaryConflict);assert.equal((await s.balance(date,500)).confirmed.kcal.total,0);});
test('invalid record and invalid transitions fail closed',async t=>{const {s}=await setup(t);await assert.rejects(s.create(make({amount:-1})),RangeError);const e=await s.create(make());await assert.rejects(s.update({...e,status:'deleted'},1),RangeError);await assert.rejects(s.remove(e.id,1,'invalid'),RangeError);assert.deepEqual(await s.list(date),[e]);});
test('corrupted metadata is rejected',async t=>{const {s,d}=await setup(t);const e=await s.create(make());d.db.prepare('UPDATE fc_entries SET revision=2 WHERE id=?').run(e.id);await assert.rejects(s.list(date),/Corrupt/);});
test('unsupported schema and driver rejected; closed fails',async t=>{const {s,d}=await setup(t);await assert.rejects(SQLiteDiary.open({}),TypeError);d.db.exec('PRAGMA user_version=99');await assert.rejects(SQLiteDiary.open(d),/Unsupported schema/);assert.equal(d.db.prepare('PRAGMA user_version').get().user_version,99);await s.close();await assert.rejects(s.list(date),/Storage closed/);});
test('unknown nonempty v0 database not overwritten',async t=>{const {path}=await setup(t);const d=driver(path+'-other');t.after(()=>d.close());d.db.exec('CREATE TABLE other(x)');await assert.rejects(SQLiteDiary.open(d),/Unrecognized database/);assert.equal(d.db.prepare('PRAGMA user_version').get().user_version,0);});
