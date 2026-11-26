import {validateEntry, DiaryConflict} from '../dist/storage.js';
import {dayBalance} from '../dist/nutrition.js';

// Driver owns an exclusive transaction until callback settles, commits only on
// success, rolls back on failure, serializes callbacks on a connection, and
// resolves only after commit. tx.run returns {changes}, tx.get/all return rows.
// Native driver not included. SQL and values must be passed separately.
const SCHEMA = 'CREATE TABLE fc_entries (id TEXT PRIMARY KEY NOT NULL, revision INTEGER NOT NULL CHECK(revision BETWEEN 1 AND 9007199254740991), local_date TEXT NOT NULL, payload TEXT NOT NULL)';
const SELECT = 'SELECT id,revision,local_date,payload FROM fc_entries';
function check(ok, message) { if (!ok) throw new RangeError(message); }
function decode(row) {
  const e=JSON.parse(row.payload);validateEntry(e);
  check(e.id===row.id && e.revision===row.revision && e.local_date===row.local_date,'Corrupt storage metadata');
  return e;
}
function assertChange(result) { if(result?.changes!==1) throw new DiaryConflict('Unexpected write count'); }
export class SQLiteDiary {
  #driver; #closed=false;
  constructor(driver, token) { if(token!==openToken) throw new TypeError('Use SQLiteDiary.open');this.#driver=driver; }
  static async open(driver) {
    if(typeof driver?.transaction!=='function'||typeof driver?.close!=='function') throw new TypeError('Unsupported transaction driver');
    await driver.transaction(async tx=>{
      const {user_version:v}=await tx.get('PRAGMA user_version',[]);
      if(v===0){
        const tables=await tx.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",[]);
        check(tables.length===0,'Unrecognized database; migration refused');
        await tx.run(SCHEMA,[]);await tx.run('CREATE INDEX fc_entries_date ON fc_entries(local_date)',[]);
        await tx.run('PRAGMA user_version = 1',[]);
      } else check(v===1,'Unsupported schema version');
      await tx.all(SELECT+' LIMIT 0',[]);
    });
    return new SQLiteDiary(driver,openToken);
  }
  #tx(work){if(this.#closed)throw new Error('Storage closed');return this.#driver.transaction(work);}
  async close(){if(!this.#closed){this.#closed=true;await this.#driver.close();}}
  async create(entry){
    const e=structuredClone(entry);validateEntry(e);check(e.revision===1&&e.status!=='deleted','Invalid initial entry');
    return this.#tx(async tx=>{
      if(await tx.get(SELECT+' WHERE id=?',[e.id]))throw new DiaryConflict('Duplicate id');
      assertChange(await tx.run('INSERT INTO fc_entries(id,revision,local_date,payload) VALUES(?,?,?,?)',[e.id,e.revision,e.local_date,JSON.stringify(e)]));return e;
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
  async balance(date,target){return dayBalance(await this.list(date),date,target);}
}
const openToken=Symbol('open');
