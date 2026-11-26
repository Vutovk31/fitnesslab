import {validateEntry} from '../dist/storage.js';
// Migration slice only: caller must own a rollback-capable exclusive transaction
// and verify exact v3 schema. Not called by SQLiteDiary.open or runtime writes.
export const catalogNameKey=s=>s.trim().normalize('NFC').toLocaleLowerCase('ru-RU');
export const CATALOG_TABLE="CREATE TABLE fc_catalog_projection (id TEXT PRIMARY KEY NOT NULL, revision INTEGER NOT NULL, name_key TEXT NOT NULL, unit TEXT NOT NULL, preparation TEXT NOT NULL, status TEXT NOT NULL)";
export const CATALOG_INDEX='CREATE INDEX fc_catalog_lookup ON fc_catalog_projection(name_key,unit,status,preparation,id)';
const PAGE=64,MAX_ROWS=20000,MAX_BYTES=16*1024*1024,ROW_BYTES=64*1024;
const bytes=s=>new TextEncoder().encode(s).length;
const check=(ok,message)=>{if(!ok)throw RangeError(message);};
export function catalogProjection(entry){
  validateEntry(entry);check(entry.status!=='deleted'||entry.revision>=2,'Invalid tombstone');
  return [entry.id,entry.revision,catalogNameKey(entry.food.name),entry.unit,entry.food.preparation,entry.status];
}
export async function buildCatalogProjection(tx){
  check((await tx.get('PRAGMA user_version',[]))?.user_version===3,'Expected schema v3');
  const {n}=await tx.get('SELECT count(*) AS n FROM (SELECT 1 FROM fc_entries LIMIT ?)',[MAX_ROWS+1]);
  check(Number.isSafeInteger(n)&&n>=0&&n<=MAX_ROWS,'Projection row limit');
  const stat=await tx.get('SELECT coalesce(sum(length(CAST(payload AS BLOB))),0) AS bytes, coalesce(max(length(CAST(payload AS BLOB))),0) AS largest, coalesce(max(length(CAST(id AS BLOB))),0) AS idBytes, coalesce(max(length(CAST(local_date AS BLOB))),0) AS dateBytes FROM fc_entries',[]);
  check(['bytes','largest','idBytes','dateBytes'].every(k=>Number.isSafeInteger(stat?.[k])&&stat[k]>=0)&&stat.bytes<=MAX_BYTES&&stat.largest<=ROW_BYTES&&stat.idBytes<=36&&stat.dateBytes<=10,'Projection byte limit');
  await tx.run(CATALOG_TABLE,[]);await tx.run(CATALOG_INDEX,[]);
  let cursor='',seen=0,used=0;
  while(seen<n){
    const rows=await tx.all('SELECT id,revision,local_date,payload FROM fc_entries WHERE id>? ORDER BY id LIMIT ?',[cursor,PAGE]);
    check(Array.isArray(rows)&&rows.length===Math.min(PAGE,n-seen),'Incomplete projection page');
    for(const row of rows){
      check(typeof row?.payload==='string'&&row.payload.length<=ROW_BYTES,'Invalid projection payload');
      const size=bytes(row.payload);used+=size;check(size<=ROW_BYTES&&used<=MAX_BYTES,'Projection byte limit');
      const e=JSON.parse(row.payload),p=catalogProjection(e);
      check(e.id===row.id&&e.revision===row.revision&&e.local_date===row.local_date&&e.id>cursor,'Corrupt projection metadata');
      const result=await tx.run('INSERT INTO fc_catalog_projection(id,revision,name_key,unit,preparation,status) VALUES(?,?,?,?,?,?)',p);
      check(result?.changes===1,'Projection insert failed');cursor=e.id;seen++;
    }
  }
  const count=await tx.get('SELECT count(*) AS n FROM fc_catalog_projection',[]);
  check(count?.n===n&&seen===n&&used===stat.bytes,'Projection snapshot mismatch');
  // Do not advance user_version until transactional write maintenance is integrated.
  return {rows:seen,payloadBytes:used};
}
