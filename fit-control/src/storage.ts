import { dayBalance, portion, type Entry, type Food } from './nutrition.js';
export type Source = { confidence: 'A'|'B'|'C'|'D'; kind: 'label'|'catalog'|'generic'|'estimate'; reference?: string|null; retrieved_at?: string|null; license?: string|null };
export type DiaryEntry = Entry & { revision: number; timezone: string; created_at: string; updated_at: string; meal_type: 'breakfast'|'lunch'|'snack'|'dinner'|'other'; food: Food & { name: string; preparation: 'raw'|'cooked'|'unknown'; source: Source } };
export class DiaryConflict extends Error {}
const store = 'entries';
const version = 1;
function check(ok: unknown, message: string): asserts ok { if (!ok) throw new RangeError(message); }
function shape(v: unknown, required: string[], optional: string[] = []) {
  check(v !== null && typeof v === 'object' && !Array.isArray(v), 'Invalid object');
  const ks = Object.keys(v);
  check(required.every(k => Object.hasOwn(v, k)) && ks.every(k => required.includes(k) || optional.includes(k)), 'Invalid fields');
}
function instant(v: unknown): v is string {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString() === v;
}
export function validateEntry(e: DiaryEntry): void {
  shape(e, ['id','revision','local_date','timezone','created_at','updated_at','status','meal_type','food','amount','unit']);
  check(typeof e.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(e.id) && e.id === e.id.toLowerCase(), 'Invalid UUID');
  check(Number.isSafeInteger(e.revision) && e.revision > 0, 'Invalid revision');
  check(instant(e.created_at) && instant(e.updated_at) && e.updated_at >= e.created_at, 'Invalid timestamps');
  check(typeof e.timezone === 'string' && e.timezone.length > 0 && !/^[+-]/.test(e.timezone), 'Invalid timezone');
  new Intl.DateTimeFormat('en', { timeZone: e.timezone });
  check(['breakfast','lunch','snack','dinner','other'].includes(e.meal_type), 'Invalid meal');
  check(['draft','planned','confirmed','deleted'].includes(e.status), 'Invalid status');
  shape(e.food, ['name','basis_amount','basis_unit','kcal','protein_g','fat_g','carbs_g','source','preparation']);
  check(typeof e.food.name === 'string' && e.food.name.trim().length > 0 && e.food.name.length <= 300, 'Invalid food name');
  check(['raw','cooked','unknown'].includes(e.food.preparation), 'Invalid preparation');
  const s = e.food.source;
  shape(s, ['confidence','kind'], ['reference','retrieved_at','license']);
  check(({label:'A',catalog:'B',generic:'C',estimate:'D'} as const)[s.kind] === s.confidence && ['A','B','C','D'].includes(s.confidence), 'Invalid source');
  for (const k of ['reference','license'] as const) if (Object.hasOwn(s,k)) check(s[k] === null || (typeof s[k] === 'string' && s[k]!.trim().length > 0), 'Invalid source metadata');
  if (Object.hasOwn(s,'retrieved_at')) check(s.retrieved_at === null || instant(s.retrieved_at), 'Invalid source date');
  check(e.amount !== null || e.status === 'draft' || e.status === 'deleted', 'Amount required');
  portion(e.food, e.amount === null ? e.food.basis_amount : e.amount, e.unit);
  dayBalance([], e.local_date, null);
}
export class DiaryStore {
  private constructor(private readonly db: IDBDatabase) { db.onversionchange = () => db.close(); }
  static open(name = 'fit-control-diary'): Promise<DiaryStore> {
    return new Promise((resolve, reject) => {
      const r = indexedDB.open(name, version);
      let blocked = false;
      r.onupgradeneeded = ev => {
        if (ev.oldVersion === 0) r.result.createObjectStore(store, { keyPath: 'id' }).createIndex('local_date', 'local_date');
      };
      r.onerror = () => reject(r.error);
      r.onblocked = () => { blocked = true; reject(new Error('Database upgrade blocked')); };
      r.onsuccess = () => { if (blocked) r.result.close(); else resolve(new DiaryStore(r.result)); };
    });
  }
  close(): void { this.db.close(); }
  private change(id: string, transform: (old: DiaryEntry|undefined) => DiaryEntry): Promise<DiaryEntry> {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readwrite');
      const os = tx.objectStore(store);
      let result: DiaryEntry; let failure: unknown;
      tx.oncomplete = () => resolve(result);
      tx.onabort = () => reject(failure ?? tx.error ?? new Error('Transaction aborted'));
      const r = os.get(id);
      r.onsuccess = () => {
        try {
          const old = r.result as DiaryEntry|undefined;
          if (old !== undefined) validateEntry(old);
          result = transform(old);
          validateEntry(result);
          if (old === undefined) os.add(result); else os.put(result);
        } catch (err) { failure = err; tx.abort(); }
      };
    });
  }
  create(entry: DiaryEntry): Promise<DiaryEntry> {
    const e = structuredClone(entry);
    return this.change(e.id, old => {
      if (old !== undefined) throw new DiaryConflict('Duplicate id');
      check(e.revision === 1 && e.status !== 'deleted', 'Invalid initial entry');
      return e;
    });
  }
  update(entry: DiaryEntry, expectedRevision: number): Promise<DiaryEntry> {
    const e = structuredClone(entry);
    return this.change(e.id, old => {
      if (!old || old.revision !== expectedRevision || old.status === 'deleted') throw new DiaryConflict('Revision conflict or deleted entry');
      check(e.revision === expectedRevision && e.created_at === old.created_at && e.updated_at >= old.updated_at && e.status !== 'deleted', 'Invalid update');
      return { ...e, revision: old.revision + 1 };
    });
  }
  remove(id: string, expectedRevision: number, updatedAt: string): Promise<DiaryEntry> {
    return this.change(id, old => {
      if (!old || old.revision !== expectedRevision || old.status === 'deleted') throw new DiaryConflict('Revision conflict or deleted entry');
      check(instant(updatedAt) && updatedAt >= old.updated_at, 'Invalid deletion timestamp');
      return { ...old, revision: old.revision + 1, status: 'deleted', updated_at: updatedAt };
    });
  }
  list(date: string): Promise<DiaryEntry[]> {
    dayBalance([], date, null);
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readonly');
      const r = tx.objectStore(store).index('local_date').getAll(date);
      tx.onabort = () => reject(tx.error ?? new Error('Read aborted'));
      tx.oncomplete = () => {
        try { const rows = r.result as DiaryEntry[]; rows.forEach(validateEntry); resolve(rows); }
        catch (err) { reject(err); }
      };
    });
  }
  async balance(date: string, targetKcal: number|null) { return dayBalance(await this.list(date), date, targetKcal); }
}
