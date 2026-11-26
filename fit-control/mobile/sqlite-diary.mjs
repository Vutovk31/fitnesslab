import {validateEntry, DiaryConflict} from '../dist/storage.js';
import {dayBalance} from '../dist/nutrition.js';
import {matchNutrition,applyNutritionMatch} from './nutrition-matcher.mjs';
import {CATALOG_TABLE,CATALOG_INDEX,buildCatalogProjection,catalogProjection,rebuildCatalogProjection,catalogNameKey} from './catalog-projection.mjs';

// Driver owns an exclusive transaction until callback settles, commits only on
// success, rolls back on failure, serializes callbacks on a connection, and
// resolves only after commit. tx.run returns {changes}, tx.get/all return rows.
// Native driver not included. SQL and values must be passed separately.
const SCHEMA = 'CREATE TABLE fc_entries (id TEXT PRIMARY KEY NOT NULL, revision INTEGER NOT NULL CHECK(revision BETWEEN 1 AND 9007199254740991), local_date TEXT NOT NULL, payload TEXT NOT NULL)';
const INDEX = 'CREATE INDEX fc_entries_date ON fc_entries(local_date)';
const GOALS = 'CREATE TABLE fc_goals (id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL CHECK(revision BETWEEN 1 AND 9007199254740991), payload TEXT NOT NULL)';
const RECOVERY = "CREATE TABLE fc_recovery (id INTEGER PRIMARY KEY CHECK(id=1), seq INTEGER NOT NULL CHECK(seq BETWEEN 1 AND 9007199254740991), kind TEXT NOT NULL CHECK(kind IN ('create','update','remove','goals','restore')), state TEXT NOT NULL CHECK(state IN ('prepared','committed','idle')))";
const KINDS=['create','update','remove','goals','restore'];
const RECOVERY_SELECT='SELECT id,seq,kind,state FROM fc_recovery WHERE id=1';
function recoveryRow(row){
  if(!row)return {seq:0,kind:null,state:'idle'};
  check(row.id===1&&Number.isSafeInteger(row.seq)&&row.seq>0&&KINDS.includes(row.kind)&&['prepared','committed','idle'].includes(row.state),'Corrupt recovery journal');
  return row;
}
function recoveryView(row){return {sequence:row.seq,kind:row.kind,status:row.state==='prepared'?'not_applied':row.state==='committed'?'committed':'none'};}
const GOAL_KEYS=['carbs_g','fat_g','kcal','protein_g'];
const MAX_ROWS=1000, MAX_BYTES=2*1024*1024;
// v3 is a bounded larger JSON snapshot, not a streaming file format.
const LARGE_ROWS=20000, LARGE_BYTES=16*1024*1024, ROW_BYTES=64*1024, PAGE=64;
// Catalog v1 refuses oversized history; never truncate into a false unique match.
const CATALOG_ROWS=2000, CATALOG_BYTES=4*1024*1024;
const utf8=new TextEncoder();
const bytes=text=>utf8.encode(text).length;
const SELECT = 'SELECT id,revision,local_date,payload FROM fc_entries';
function check(ok, message) { if (!ok) throw new RangeError(message); }
function decode(row) {
  const e=JSON.parse(row.payload);validateEntry(e);
  check(e.id===row.id && e.revision===row.revision && e.local_date===row.local_date,'Corrupt storage metadata');
  return e;
}
function validateGoals(value){
  check(value && typeof value==='object' && !Array.isArray(value) && Object.keys(value).sort().join(',')===GOAL_KEYS.join(','),'Invalid goals shape');
  for(const k of GOAL_KEYS)check(value[k]===null||(typeof value[k]==='number'&&Number.isFinite(value[k])&&value[k]>0),'Invalid goal');
  return value;
}
function readGoals(row){
  if(!row)return {revision:0,targets:{kcal:null,protein_g:null,fat_g:null,carbs_g:null}};
  check(row.id===1&&Number.isSafeInteger(row.revision)&&row.revision>0,'Corrupt goals metadata');
  return {revision:row.revision,targets:validateGoals(JSON.parse(row.payload))};
}
async function verifySchema(tx,version){
  const objects=await tx.all("SELECT type,name,sql FROM sqlite_master WHERE name NOT GLOB 'sqlite_*' ORDER BY name",[]);
  const expected=[{type:'table',name:'fc_entries',sql:SCHEMA},{type:'index',name:'fc_entries_date',sql:INDEX}];
  if(version>=2)expected.push({type:'table',name:'fc_goals',sql:GOALS});
  if(version>=3)expected.push({type:'table',name:'fc_recovery',sql:RECOVERY});
  if(version>=4)expected.unshift({type:'index',name:'fc_catalog_lookup',sql:CATALOG_INDEX},{type:'table',name:'fc_catalog_projection',sql:CATALOG_TABLE});
  check(objects.length===expected.length&&expected.every((e,i)=>Object.keys(e).every(k=>objects[i][k]===e[k])),'Unexpected schema objects');
}
function assertChange(result) { if(result?.changes!==1) throw new DiaryConflict('Unexpected write count'); }
function backupGoals(value){
  check(value && typeof value==='object' && !Array.isArray(value) && Object.keys(value).length===2 && Object.hasOwn(value,'revision') && Object.hasOwn(value,'targets'),'Invalid backup goals');
  check(Number.isSafeInteger(value.revision)&&value.revision>=0,'Invalid backup goal revision');
  validateGoals(value.targets);
  check(value.revision!==0||GOAL_KEYS.every(k=>value.targets[k]===null),'Invalid unset goals');
  return value;
}
function backupRows(text) {
  check(typeof text==='string' && text.length<=LARGE_BYTES && bytes(text)<=LARGE_BYTES,'Backup too large or invalid');
  const b=JSON.parse(text);
  check(b && typeof b==='object' && !Array.isArray(b) && b.product==='FIT CONTROL' && [1,2,3].includes(b.schema_version) && Array.isArray(b.entries),'Unsupported backup');
  const large=b.schema_version===3;
  check(b.entries.length<=(large?LARGE_ROWS:MAX_ROWS) && (large||bytes(text)<=MAX_BYTES),'Backup too large');
  const keys=b.schema_version===1?['product','schema_version','entries']:['product','schema_version','entries','goals'];
  check(Object.keys(b).length===keys.length&&keys.every(k=>Object.hasOwn(b,k)),'Unsupported backup fields');
  const goals=b.schema_version===1?readGoals(undefined):backupGoals(b.goals);
  const ids=new Set(), days=new Map();
  for(const e of b.entries){
    if(large)check(bytes(JSON.stringify(e))<=ROW_BYTES,'Backup row too large');
    validateEntry(e);check(e.status!=='deleted'||e.revision>=2,'Invalid tombstone');check(!ids.has(e.id),'Duplicate backup id');ids.add(e.id);
    if(!days.has(e.local_date))days.set(e.local_date,[]);days.get(e.local_date).push(e);
  }
  for(const [date,rows] of days)dayBalance(rows,date,null);
  return {entries:b.entries,goals};
}
export function inspectBackup(text){
  const {entries,goals}=backupRows(text);
  return {version:JSON.parse(text).schema_version,entries:entries.length,deleted:entries.filter(e=>e.status==='deleted').length,hasGoals:goals.revision>0};
}
const INSERT='INSERT INTO fc_entries(id,revision,local_date,payload) VALUES(?,?,?,?)';
const PROJECTION_SELECT='SELECT id,revision,name_key,unit,preparation,status FROM fc_catalog_projection WHERE id=?';
const PROJECTION_FIELDS=['id','revision','name_key','unit','preparation','status'];
async function verifyProjectionRow(tx,e){
  const row=await tx.get(PROJECTION_SELECT,[e.id]),expected=catalogProjection(e);
  check(row&&PROJECTION_FIELDS.every((k,i)=>row[k]===expected[i]),'Catalog projection mismatch');
}
async function insert(tx,e){
  assertChange(await tx.run(INSERT,[e.id,e.revision,e.local_date,JSON.stringify(e)]));
  assertChange(await tx.run('INSERT INTO fc_catalog_projection(id,revision,name_key,unit,preparation,status) VALUES(?,?,?,?,?,?)',catalogProjection(e)));
}
async function verifyProjectionCoverage(tx){
  const missing=await tx.get('SELECT e.id FROM fc_entries e LEFT JOIN fc_catalog_projection p ON p.id=e.id WHERE p.id IS NULL OR p.revision<>e.revision LIMIT 1',[]);
  const orphan=await tx.get('SELECT p.id FROM fc_catalog_projection p LEFT JOIN fc_entries e ON e.id=p.id WHERE e.id IS NULL LIMIT 1',[]);
  check(!missing&&!orphan,'Catalog projection coverage mismatch');
}
async function auditProjection(tx,visit=()=>{}){
    await verifySchema(tx,4);
    check((await tx.get('PRAGMA user_version',[]))?.user_version===4,'Expected schema v4');
    const count=await tx.get('SELECT count(*) AS n FROM (SELECT 1 FROM fc_entries LIMIT ?)',[LARGE_ROWS+1]);
    const projected=await tx.get('SELECT count(*) AS n FROM (SELECT 1 FROM fc_catalog_projection LIMIT ?)',[LARGE_ROWS+1]);
    check(Number.isSafeInteger(count?.n)&&count.n>=0&&count.n<=LARGE_ROWS&&projected?.n===count.n,'Catalog audit count or row limit');
    const stat=await tx.get('SELECT coalesce(sum(length(CAST(payload AS BLOB))),0) AS bytes, coalesce(max(length(CAST(payload AS BLOB))),0) AS largest, coalesce(max(length(CAST(id AS BLOB))),0) AS idBytes, coalesce(max(length(CAST(local_date AS BLOB))),0) AS dateBytes FROM fc_entries',[]);
    check(['bytes','largest','idBytes','dateBytes'].every(k=>Number.isSafeInteger(stat?.[k])&&stat[k]>=0)&&stat.bytes<=LARGE_BYTES&&stat.largest<=ROW_BYTES&&stat.idBytes<=36&&stat.dateBytes<=10,'Catalog audit byte limit');
    const ps=await tx.get('SELECT coalesce(max(length(CAST(id AS BLOB))+length(CAST(name_key AS BLOB))+length(CAST(unit AS BLOB))+length(CAST(preparation AS BLOB))+length(CAST(status AS BLOB))),0) AS bytes FROM fc_catalog_projection',[]);
    check(Number.isSafeInteger(ps?.bytes)&&ps.bytes>=0&&ps.bytes<=ROW_BYTES,'Catalog projection byte limit');
    await verifyProjectionCoverage(tx);
    let seen=0,used=0,cursor='';
    while(seen<count.n){
      const rows=await tx.all(SELECT+' WHERE id>? ORDER BY id LIMIT ?',[cursor,PAGE]);
      check(Array.isArray(rows)&&rows.length===Math.min(PAGE,count.n-seen),'Incomplete audit page');
      for(const row of rows){const e=decode(row);check(e.id>cursor,'Invalid audit order');used+=bytes(row.payload);check(used<=LARGE_BYTES,'Catalog audit byte limit');await verifyProjectionRow(tx,e);visit(e,bytes(row.payload));cursor=e.id;seen++;}
    }
    check(seen===count.n&&used===stat.bytes,'Catalog audit snapshot mismatch');return {rows:seen,payloadBytes:used};
}
export class SQLiteDiary {
  #driver; #closed=false; #closing;
  constructor(driver, token) { if(token!==openToken) throw new TypeError('Use SQLiteDiary.open');this.#driver=driver; }
  static async open(driver) {
    if(typeof driver?.transaction!=='function'||typeof driver?.close!=='function') throw new TypeError('Unsupported transaction driver');
    await driver.transaction(async tx=>{
      const {user_version:v}=await tx.get('PRAGMA user_version',[]);
      if(v===0){
        const tables=await tx.all("SELECT name FROM sqlite_master WHERE name NOT GLOB 'sqlite_*'",[]);
        check(tables.length===0,'Unrecognized database; migration refused');
        await tx.run(SCHEMA,[]);await tx.run(INDEX,[]);
      } else check(v===1||v===2||v===3||v===4,'Unsupported schema version');
      if(v<2){
        await verifySchema(tx,1);await tx.run(GOALS,[]);await tx.run('PRAGMA user_version = 2',[]);
      }
      if(v<3){await verifySchema(tx,2);await tx.run(RECOVERY,[]);await tx.run('PRAGMA user_version = 3',[]);}
      if(v<4){await verifySchema(tx,3);await buildCatalogProjection(tx);await tx.run('PRAGMA user_version = 4',[]);}
      await verifySchema(tx,4);await verifyProjectionCoverage(tx);recoveryRow(await tx.get(RECOVERY_SELECT,[]));
      readGoals(await tx.get('SELECT id,revision,payload FROM fc_goals WHERE id=1',[]));
      await tx.all(SELECT+' LIMIT 0',[]);
    });
    return new SQLiteDiary(driver,openToken);
  }
  // Explicit read-only legacy recovery candidate; never opens/migrates the diary.
  static async inspectLegacyDay(driver,date,approved=false){
    check(approved===true,'Explicit legacy recovery approval required');dayBalance([],date,null);
    return driver.transaction(async tx=>{
      check((await tx.get('PRAGMA user_version',[]))?.user_version===3,'Expected legacy schema v3');
      await verifySchema(tx,3);
      const count=await tx.get('SELECT count(*) AS n FROM (SELECT 1 FROM fc_entries WHERE local_date=? LIMIT ?)',[date,CATALOG_ROWS+1]);
      check(Number.isSafeInteger(count?.n)&&count.n>=0&&count.n<=CATALOG_ROWS,'Legacy day row limit');
      const stat=await tx.get('SELECT coalesce(sum(length(CAST(payload AS BLOB))),0) AS bytes, coalesce(max(length(CAST(payload AS BLOB))),0) AS largest, coalesce(max(length(CAST(id AS BLOB))),0) AS idBytes FROM fc_entries WHERE local_date=?',[date]);
      check(['bytes','largest','idBytes'].every(k=>Number.isSafeInteger(stat?.[k])&&stat[k]>=0)&&stat.bytes<=CATALOG_BYTES&&stat.largest<=ROW_BYTES&&stat.idBytes<=36,'Legacy day byte limit');
      const rows=await tx.all(SELECT+' WHERE local_date=? ORDER BY id',[date]);
      check(rows.length===count.n,'Legacy day count mismatch');let used=0,cursor='';
      const entries=rows.map(row=>{const e=decode(row);used+=bytes(row.payload);check(e.local_date===date&&e.id>cursor&&(e.status!=='deleted'||e.revision>=2),'Invalid legacy day row');cursor=e.id;return e;});
      check(used===stat.bytes,'Legacy day byte mismatch');
      const goalSize=await tx.get('SELECT coalesce(max(length(CAST(payload AS BLOB))),0) AS bytes FROM fc_goals',[]);
      check(Number.isSafeInteger(goalSize?.bytes)&&goalSize.bytes>=0&&goalSize.bytes<=ROW_BYTES,'Legacy goals byte limit');
      return {date,entries,goals:readGoals(await tx.get('SELECT id,revision,payload FROM fc_goals WHERE id=1',[])),recovery:recoveryView(recoveryRow(await tx.get(RECOVERY_SELECT,[])))};
    });
  }
  // Complete day and goals in one transaction; synthetic publication caller only.
  async readWidgetDay(date){
    dayBalance([],date,null);return this.#tx(async tx=>{
      check(recoveryRow(await tx.get(RECOVERY_SELECT,[])).state==='idle','Widget source requires idle journal');
      const count=await tx.get('SELECT count(*) AS n FROM (SELECT 1 FROM fc_entries WHERE local_date=? LIMIT ?)',[date,CATALOG_ROWS+1]);
      check(Number.isSafeInteger(count?.n)&&count.n>=0&&count.n<=CATALOG_ROWS,'Widget day row limit');
      const stat=await tx.get('SELECT coalesce(sum(length(CAST(payload AS BLOB))),0) AS bytes, coalesce(max(length(CAST(payload AS BLOB))),0) AS largest, coalesce(max(length(CAST(id AS BLOB))),0) AS idBytes FROM fc_entries WHERE local_date=?',[date]);
      check(['bytes','largest','idBytes'].every(k=>Number.isSafeInteger(stat?.[k])&&stat[k]>=0)&&stat.bytes<=CATALOG_BYTES&&stat.largest<=ROW_BYTES&&stat.idBytes<=36,'Widget day byte limit');
      const rows=await tx.all(SELECT+' WHERE local_date=? ORDER BY id',[date]);
      check(rows.length===count.n,'Widget day count mismatch');let used=0,cursor='';
      const entries=rows.map(row=>{const e=decode(row);used+=bytes(row.payload);check(e.local_date===date&&e.id>cursor&&(e.status!=='deleted'||e.revision>=2),'Invalid widget day row');cursor=e.id;return e;});
      check(used===stat.bytes,'Widget day byte mismatch');
      const goalSize=await tx.get('SELECT coalesce(max(length(CAST(payload AS BLOB))),0) AS bytes FROM fc_goals',[]);
      check(Number.isSafeInteger(goalSize?.bytes)&&goalSize.bytes>=0&&goalSize.bytes<=ROW_BYTES,'Widget goals byte limit');
      return {complete:true,date,entries,targets:readGoals(await tx.get('SELECT id,revision,payload FROM fc_goals WHERE id=1',[])).targets};
    });
  }
  // Explicit maintenance path; normal open may reject damaged projection coverage.
  static async repairCatalog(driver,approved=false){
    check(approved===true,'Explicit catalog repair approval required');
    return driver.transaction(async tx=>{
      check((await tx.get('PRAGMA user_version',[]))?.user_version===4,'Expected schema v4');await verifySchema(tx,4);
      const journal=recoveryRow(await tx.get(RECOVERY_SELECT,[]));
      check(journal.state==='idle','Recovery acknowledgement required before repair');
      const goalSize=await tx.get('SELECT coalesce(max(length(CAST(payload AS BLOB))),0) AS bytes FROM fc_goals',[]);
      check(Number.isSafeInteger(goalSize?.bytes)&&goalSize.bytes>=0&&goalSize.bytes<=ROW_BYTES,'Repair goals byte limit');
      readGoals(await tx.get('SELECT id,revision,payload FROM fc_goals WHERE id=1',[]));
      const result=await rebuildCatalogProjection(tx),audit=await auditProjection(tx);
      check(result.rows===audit.rows&&result.payloadBytes===audit.payloadBytes,'Repair audit mismatch');
      return audit;
    });
  }
  // Full bounded audit only. Never repair or issue an indexed-read authorization.
  async auditCatalog(){return this.#tx(auditProjection);}
  #tx(work){if(this.#closed)throw new Error('Storage closed');return this.#driver.transaction(work);}
  async close(){if(!this.#closing){this.#closed=true;this.#closing=Promise.resolve().then(()=>this.#driver.close());}return this.#closing;}
  // The journal contains only a sequence, operation kind and outcome, never food or goal payload.
  async prepareOperation(kind){
    check(KINDS.includes(kind),'Invalid operation kind');
    return this.#tx(async tx=>{
      const old=recoveryRow(await tx.get(RECOVERY_SELECT,[]));
      if(old.state!=='idle')throw new DiaryConflict('Recovery acknowledgement required');
      check(old.seq<Number.MAX_SAFE_INTEGER,'Recovery sequence exhausted');const seq=old.seq+1;
      if(old.seq===0)assertChange(await tx.run("INSERT INTO fc_recovery(id,seq,kind,state) VALUES(1,?,?,'prepared')",[seq,kind]));
      else assertChange(await tx.run("UPDATE fc_recovery SET seq=?,kind=?,state='prepared' WHERE id=1 AND seq=? AND state='idle'",[seq,kind,old.seq]));
      return seq;
    });
  }
  async getRecovery(){try{return await this.#tx(async tx=>recoveryView(recoveryRow(await tx.get(RECOVERY_SELECT,[]))));}catch{return {sequence:null,kind:null,status:'unknown'};}}
  async acknowledgeRecovery(sequence,status,approved=false){
    check(approved===true&&Number.isSafeInteger(sequence)&&sequence>0&&['committed','not_applied'].includes(status),'Explicit recovery acknowledgement required');
    return this.#tx(async tx=>{
      const row=recoveryRow(await tx.get(RECOVERY_SELECT,[]));
      if(row.seq!==sequence||recoveryView(row).status!==status)throw new DiaryConflict('Recovery state changed');
      assertChange(await tx.run("UPDATE fc_recovery SET state='idle' WHERE id=1 AND seq=? AND state=?",[sequence,row.state]));
      return true;
    });
  }
  #write(kind,sequence,work){return this.#tx(async tx=>{
    const row=recoveryRow(await tx.get(RECOVERY_SELECT,[]));
    if(sequence===undefined){if(row.state!=='idle')throw new DiaryConflict('Recovery acknowledgement required');}
    else if(!Number.isSafeInteger(sequence)||row.seq!==sequence||row.kind!==kind||row.state!=='prepared')throw new DiaryConflict('Operation token stale or invalid');
    const result=await work(tx);
    if(sequence!==undefined)assertChange(await tx.run("UPDATE fc_recovery SET state='committed' WHERE id=1 AND seq=? AND state='prepared'",[sequence]));
    return result;
  });}
  async create(entry,sequence){
    const e=structuredClone(entry);validateEntry(e);check(e.revision===1&&e.status!=='deleted','Invalid initial entry');
    return this.#write('create',sequence,async tx=>{
      if(await tx.get(SELECT+' WHERE id=?',[e.id]))throw new DiaryConflict('Duplicate id');
      await insert(tx,e);return e;
    });
  }
  async #change(id,expected,transform,kind,sequence){return this.#write(kind,sequence,async tx=>{
    const row=await tx.get(SELECT+' WHERE id=?',[id]);const old=row?decode(row):null;
    if(!old||old.revision!==expected||old.status==='deleted')throw new DiaryConflict('Revision conflict or deleted entry');
    await verifyProjectionRow(tx,old);
    const e=transform(old);validateEntry(e);
    assertChange(await tx.run('UPDATE fc_entries SET revision=?,local_date=?,payload=? WHERE id=? AND revision=?',[e.revision,e.local_date,JSON.stringify(e),id,expected]));
    const [,revision,name,unit,preparation,status]=catalogProjection(e);
    assertChange(await tx.run('UPDATE fc_catalog_projection SET revision=?,name_key=?,unit=?,preparation=?,status=? WHERE id=? AND revision=?',[revision,name,unit,preparation,status,id,expected]));return e;
  });}
  async update(entry,expected,sequence){
    const e=structuredClone(entry);validateEntry(e);
    return this.#change(e.id,expected,old=>{
      check(e.revision===expected&&e.created_at===old.created_at&&e.updated_at>=old.updated_at&&e.status!=='deleted','Invalid update');
      return {...e,revision:old.revision+1};
    },'update',sequence);
  }
  async remove(id,expected,updatedAt,sequence){return this.#change(id,expected,old=>{
    check(typeof updatedAt==='string'&&updatedAt>=old.updated_at,'Invalid deletion timestamp');
    return {...old,revision:old.revision+1,status:'deleted',updated_at:updatedAt};
  },'remove',sequence);}
  async list(date){dayBalance([],date,null);return this.#tx(async tx=>(await tx.all(SELECT+' WHERE local_date=? ORDER BY id',[date])).map(decode));}
  async #catalog(work){
    return this.#tx(async tx=>{
      const count=await tx.get('SELECT count(*) AS n FROM (SELECT 1 FROM fc_entries LIMIT ?)',[CATALOG_ROWS+1]);
      check(Number.isSafeInteger(count?.n)&&count.n>=0&&count.n<=CATALOG_ROWS,'Catalog row limit or invalid count');
      const stat=await tx.get('SELECT coalesce(sum(length(CAST(payload AS BLOB))),0) AS bytes, coalesce(max(length(CAST(payload AS BLOB))),0) AS largest, coalesce(max(length(CAST(id AS BLOB))),0) AS idBytes, coalesce(max(length(CAST(local_date AS BLOB))),0) AS dateBytes FROM fc_entries',[]);
      check(['bytes','largest','idBytes','dateBytes'].every(k=>Number.isSafeInteger(stat?.[k])&&stat[k]>=0)&&stat.bytes<=CATALOG_BYTES&&stat.largest<=ROW_BYTES&&stat.idBytes<=36&&stat.dateBytes<=10,'Catalog byte limit or invalid metadata');
      let cursor='',seen=0,used=0;const entries=[];
      while(seen<count.n){
        const rows=await tx.all(SELECT+' WHERE id>? ORDER BY id LIMIT ?',[cursor,PAGE]);
        check(Array.isArray(rows)&&rows.length===Math.min(PAGE,count.n-seen),'Incomplete catalog page');
        for(const row of rows){
          check(typeof row?.payload==='string'&&row.payload.length<=ROW_BYTES,'Invalid catalog payload');
          const size=bytes(row.payload);used+=size;
          check(size<=ROW_BYTES&&used<=CATALOG_BYTES,'Catalog byte limit');
          const e=decode(row);check(e.id>cursor&&(e.status!=='deleted'||e.revision>=2),'Invalid catalog order or tombstone');
          cursor=e.id;seen++;
          if(e.status==='confirmed'||e.status==='planned')entries.push(e);
        }
      }
      check(seen===count.n&&used===stat.bytes,'Catalog snapshot mismatch');
      return work(entries);
    });
  }
  async findNutrition(query){const q=structuredClone(query);return this.#catalog(entries=>matchNutrition(entries,q));}
  async selectNutrition(form,key,approved=false){
    check(approved===true&&typeof key==='string','Explicit catalog selection required');
    const f=structuredClone(form);return this.#catalog(entries=>applyNutritionMatch(entries,f,key,true));
  }
  // Candidate only: same-transaction audit plus index lookup, no cached trust.
  // The canonical audit supplies expected IDs, so an omitted index hit cannot look unique.
  async #indexedCatalog(query,work){
    matchNutrition([],query);
    const {name,unit,preparation='unknown'}=query,normalized=catalogNameKey(name);
    return this.#tx(async tx=>{
      const expected=[];let used=0;
      await auditProjection(tx,(e,size)=>{
        if(!['confirmed','planned'].includes(e.status)||catalogNameKey(e.food.name)!==normalized||e.unit!==unit||(preparation!=='unknown'&&e.food.preparation!==preparation))return;
        used+=size;check(expected.length<CATALOG_ROWS&&used<=CATALOG_BYTES,'Indexed catalog candidate limit');expected.push(e.id);
      });
      const filter=preparation==='unknown'?'':' AND p.preparation=?';
      const args=[normalized,unit,...(filter?[preparation]:[]),CATALOG_ROWS+1];
      const rows=await tx.all("SELECT e.id,e.revision,e.local_date,e.payload FROM fc_catalog_projection p INDEXED BY fc_catalog_lookup JOIN fc_entries e ON e.id=p.id WHERE p.name_key=? AND p.unit=? AND p.status IN ('confirmed','planned')"+filter+' ORDER BY e.id LIMIT ?',args);
      check(Array.isArray(rows)&&rows.length===expected.length,'Indexed catalog completeness mismatch');
      let actualBytes=0;
      const entries=rows.map((row,i)=>{check(typeof row?.payload==='string'&&row.payload.length<=ROW_BYTES,'Invalid indexed payload');actualBytes+=bytes(row.payload);check(actualBytes<=CATALOG_BYTES,'Indexed catalog candidate limit');const e=decode(row);check(e.id===expected[i],'Indexed catalog identity mismatch');return e;});
      check(actualBytes===used,'Indexed catalog byte mismatch');return work(entries);
    });
  }
  async findNutritionIndexed(query){const q=structuredClone(query);return this.#indexedCatalog(q,entries=>matchNutrition(entries,q));}
  async selectNutritionIndexed(form,key,approved=false){
    check(approved===true&&typeof key==='string','Explicit catalog selection required');
    const f=structuredClone(form);return this.#indexedCatalog(f,entries=>applyNutritionMatch(entries,f,key,true));
  }
  async exportBackup(version=2){
    check(version===2||version===3,'Unsupported export version');
    return this.#tx(async tx=>{
      const large=version===3,limit=large?LARGE_BYTES:MAX_BYTES;
      const stat=await tx.get('SELECT count(*) AS n, coalesce(sum(length(CAST(payload AS BLOB))),0) AS bytes, coalesce(max(length(CAST(payload AS BLOB))),0) AS largest FROM fc_entries',[]);
      const goalSize=await tx.get('SELECT coalesce(sum(length(CAST(payload AS BLOB))),0) AS bytes FROM fc_goals',[]);
      check(stat.n<=(large?LARGE_ROWS:MAX_ROWS) && stat.bytes+goalSize.bytes<=limit,'Backup too large');
      if(large)check(stat.largest<=ROW_BYTES,'Backup row too large');
      const goals=readGoals(await tx.get('SELECT id,revision,payload FROM fc_goals WHERE id=1',[]));
      if(!large){
        const entries=(await tx.all(SELECT+' ORDER BY id',[])).map(decode);
        const text=JSON.stringify({product:'FIT CONTROL',schema_version:2,entries,goals});backupRows(text);return text;
      }
      const parts=['{"product":"FIT CONTROL","schema_version":3,"entries":['];
      const suffix='],"goals":'+JSON.stringify(goals)+'}';
      let used=bytes(parts[0])+bytes(suffix),cursor='',count=0;
      while(count<stat.n){
        const rows=await tx.all(SELECT+' WHERE id>? ORDER BY id LIMIT ?',[cursor,PAGE]);
        check(rows.length>0&&rows.length<=PAGE,'Incomplete backup page');
        for(const row of rows){
          const e=decode(row);check(e.id>cursor,'Invalid backup order');cursor=e.id;
          const part=(count?',':'')+JSON.stringify(e);
          check(bytes(JSON.stringify(e))<=ROW_BYTES,'Backup row too large');
          used+=bytes(part);check(used<=limit,'Backup too large');parts.push(part);count++;
          check(count<=stat.n,'Backup count mismatch');
        }
      }
      parts.push(suffix);const text=parts.join('');backupRows(text);return text;
    });}
  async restoreBackup(text,approved=false,sequence){
    check(approved===true,'Explicit approval required');const {entries,goals}=backupRows(text);
    return this.#write('restore',sequence,async tx=>{
      const {n}=await tx.get('SELECT count(*) AS n FROM fc_entries',[]);
      const prefs=await tx.get('SELECT count(*) AS n FROM fc_goals',[]);
      const projection=await tx.get('SELECT count(*) AS n FROM fc_catalog_projection',[]);
      if(n!==0||prefs.n!==0||projection.n!==0)throw new DiaryConflict('Restore requires empty database');
      for(const e of entries)await insert(tx,e);
      if(goals.revision>0)assertChange(await tx.run('INSERT INTO fc_goals(id,revision,payload) VALUES(1,?,?)',[goals.revision,JSON.stringify(goals.targets)]));
      return {restored:entries.length};
    });
  }
  async getGoals(){return this.#tx(async tx=>readGoals(await tx.get('SELECT id,revision,payload FROM fc_goals WHERE id=1',[])));}
  async setGoals(targets,expectedRevision,sequence){
    const value=validateGoals(structuredClone(targets));check(Number.isSafeInteger(expectedRevision)&&expectedRevision>=0&&expectedRevision<Number.MAX_SAFE_INTEGER,'Invalid goal revision');
    return this.#write('goals',sequence,async tx=>{
      const old=readGoals(await tx.get('SELECT id,revision,payload FROM fc_goals WHERE id=1',[]));
      if(old.revision!==expectedRevision)throw new DiaryConflict('Goal revision conflict');
      const revision=expectedRevision+1,payload=JSON.stringify(value);
      if(expectedRevision===0)assertChange(await tx.run('INSERT INTO fc_goals(id,revision,payload) VALUES(1,?,?)',[revision,payload]));
      else assertChange(await tx.run('UPDATE fc_goals SET revision=?,payload=? WHERE id=1 AND revision=?',[revision,payload,expectedRevision]));
      return {revision,targets:value};
    });
  }
  async balance(date,target){return dayBalance(await this.list(date),date,target);}
}
const openToken=Symbol('open');
