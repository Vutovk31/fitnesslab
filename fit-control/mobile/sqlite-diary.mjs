import {validateEntry, DiaryConflict} from '../dist/storage.js';
import {dayBalance} from '../dist/nutrition.js';

// Driver owns an exclusive transaction until callback settles, commits only on
// success, rolls back on failure, serializes callbacks on a connection, and
// resolves only after commit. tx.run returns {changes}, tx.get/all return rows.
// Native driver not included. SQL and values must be passed separately.
const SCHEMA = 'CREATE TABLE fc_entries (id TEXT PRIMARY KEY NOT NULL, revision INTEGER NOT NULL CHECK(revision BETWEEN 1 AND 9007199254740991), local_date TEXT NOT NULL, payload TEXT NOT NULL)';
const INDEX = 'CREATE INDEX fc_entries_date ON fc_entries(local_date)';
const GOALS = 'CREATE TABLE fc_goals (id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL CHECK(revision BETWEEN 1 AND 9007199254740991), payload TEXT NOT NULL)';
const GOAL_KEYS=['carbs_g','fat_g','kcal','protein_g'];
const MAX_ROWS=1000, MAX_BYTES=2*1024*1024;
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
  if(version===2)expected.push({type:'table',name:'fc_goals',sql:GOALS});
  check(objects.length===expected.length&&expected.every((e,i)=>Object.keys(e).every(k=>objects[i][k]===e[k])),'Unexpected schema objects');
}
function assertChange(result) { if(result?.changes!==1) throw new DiaryConflict('Unexpected write count'); }
function backupRows(text) {
  check(typeof text==='string' && text.length<=MAX_BYTES && new TextEncoder().encode(text).length<=MAX_BYTES,'Backup too large or invalid');
  const b=JSON.parse(text);
  check(b && typeof b==='object' && Object.keys(b).sort().join(',')==='entries,product,schema_version' && b.product==='FIT CONTROL' && b.schema_version===1 && Array.isArray(b.entries) && b.entries.length<=MAX_ROWS,'Unsupported backup');
  const ids=new Set(), days=new Map();
  for(const e of b.entries){
    validateEntry(e);check(e.status!=='deleted'||e.revision>=2,'Invalid tombstone');check(!ids.has(e.id),'Duplicate backup id');ids.add(e.id);
    if(!days.has(e.local_date))days.set(e.local_date,[]);days.get(e.local_date).push(e);
  }
  for(const [date,rows] of days)dayBalance(rows,date,null);
  return b.entries;
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
      } else check(v===1||v===2,'Unsupported schema version');
      if(v!==2){
        await verifySchema(tx,1);await tx.run(GOALS,[]);await tx.run('PRAGMA user_version = 2',[]);
      }
      await verifySchema(tx,2);
      readGoals(await tx.get('SELECT id,revision,payload FROM fc_goals WHERE id=1',[]));
      await tx.all(SELECT+' LIMIT 0',[]);
    });
    return new SQLiteDiary(driver,openToken);
  }
  #tx(work){if(this.#closed)throw new Error('Storage closed');return this.#driver.transaction(work);}
  async close(){if(!this.#closing){this.#closed=true;this.#closing=Promise.resolve().then(()=>this.#driver.close());}return this.#closing;}
  async create(entry){
    const e=structuredClone(entry);validateEntry(e);check(e.revision===1&&e.status!=='deleted','Invalid initial entry');
    return this.#tx(async tx=>{
      if(await tx.get(SELECT+' WHERE id=?',[e.id]))throw new DiaryConflict('Duplicate id');
      await insert(tx,e);return e;
    });
  }
  async #change(id,expected,transform){return this.#tx(async tx=>{
    const row=await tx.get(SELECT+' WHERE id=?',[id]);const old=row?decode(row):null;
    if(!old||old.revision!==expected||old.status==='deleted')throw new DiaryConflict('Revision conflict or deleted entry');
    const e=transform(old);validateEntry(e);
    assertChange(await tx.run('UPDATE fc_entries SET revision=?,local_date=?,payload=? WHERE id=? AND revision=?',[e.revision,e.local_date,JSON.stringify(e),id,expected]));return e;
  });}
  async update(entry,expected){
    const e=structuredClone(entry);validateEntry(e);
    return this.#change(e.id,expected,old=>{
      check(e.revision===expected&&e.created_at===old.created_at&&e.updated_at>=old.updated_at&&e.status!=='deleted','Invalid update');
      return {...e,revision:old.revision+1};
    });
  }
  async remove(id,expected,updatedAt){return this.#change(id,expected,old=>{
    check(typeof updatedAt==='string'&&updatedAt>=old.updated_at,'Invalid deletion timestamp');
    return {...old,revision:old.revision+1,status:'deleted',updated_at:updatedAt};
  });}
  async list(date){dayBalance([],date,null);return this.#tx(async tx=>(await tx.all(SELECT+' WHERE local_date=? ORDER BY id',[date])).map(decode));}
  async exportBackup(){return this.#tx(async tx=>{
    const stat=await tx.get('SELECT count(*) AS n, coalesce(sum(length(CAST(payload AS BLOB))),0) AS bytes FROM fc_entries',[]);
    check(stat.n<=MAX_ROWS && stat.bytes<=MAX_BYTES,'Backup too large');
    const entries=(await tx.all(SELECT+' ORDER BY id',[])).map(decode);
    const text=JSON.stringify({product:'FIT CONTROL',schema_version:1,entries});backupRows(text);return text;
  });}
  async restoreBackup(text,approved=false){
    check(approved===true,'Explicit approval required');const entries=backupRows(text);
    return this.#tx(async tx=>{
      const {n}=await tx.get('SELECT count(*) AS n FROM fc_entries',[]);
      if(n!==0)throw new DiaryConflict('Restore requires empty database');
      for(const e of entries)await insert(tx,e);
      return {restored:entries.length};
    });
  }
  async getGoals(){return this.#tx(async tx=>readGoals(await tx.get('SELECT id,revision,payload FROM fc_goals WHERE id=1',[])));}
  async setGoals(targets,expectedRevision){
    const value=validateGoals(structuredClone(targets));check(Number.isSafeInteger(expectedRevision)&&expectedRevision>=0&&expectedRevision<Number.MAX_SAFE_INTEGER,'Invalid goal revision');
    return this.#tx(async tx=>{
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
