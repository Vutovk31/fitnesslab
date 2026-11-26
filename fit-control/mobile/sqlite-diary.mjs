import {validateEntry, DiaryConflict} from '../dist/storage.js';
import {dayBalance} from '../dist/nutrition.js';

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
async function insert(tx,e){assertChange(await tx.run(INSERT,[e.id,e.revision,e.local_date,JSON.stringify(e)]));}
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
      } else check(v===1||v===2||v===3,'Unsupported schema version');
      if(v<2){
        await verifySchema(tx,1);await tx.run(GOALS,[]);await tx.run('PRAGMA user_version = 2',[]);
      }
      if(v<3){await verifySchema(tx,2);await tx.run(RECOVERY,[]);await tx.run('PRAGMA user_version = 3',[]);}
      await verifySchema(tx,3);recoveryRow(await tx.get(RECOVERY_SELECT,[]));
      readGoals(await tx.get('SELECT id,revision,payload FROM fc_goals WHERE id=1',[]));
      await tx.all(SELECT+' LIMIT 0',[]);
    });
    return new SQLiteDiary(driver,openToken);
  }
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
    const e=transform(old);validateEntry(e);
    assertChange(await tx.run('UPDATE fc_entries SET revision=?,local_date=?,payload=? WHERE id=? AND revision=?',[e.revision,e.local_date,JSON.stringify(e),id,expected]));return e;
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
      if(n!==0||prefs.n!==0)throw new DiaryConflict('Restore requires empty database');
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
