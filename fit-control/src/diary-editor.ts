import { portion, type Nutrition, type Unit } from './nutrition.js';
import { validateEntry, type DiaryEntry, type Source } from './storage.js';

export type Form = {
  name: string; local_date: string; timezone: string; meal_type: DiaryEntry['meal_type'];
  preparation: DiaryEntry['food']['preparation']; amount: string; unit: Unit;
  basis_amount: string; basis_unit: Unit; kcal: string; protein_g: string; fat_g: string; carbs_g: string;
  source_kind: Source['kind']; source_reference?: string|null; source_retrieved_at?: string|null; source_license?: string|null;
};
export type Intent = 'save-draft'|'plan'|'confirm'|'edit';
type Active = Exclude<DiaryEntry['status'],'deleted'>;
const confidence = { label:'A', catalog:'B', generic:'C', estimate:'D' } as const;
function decimal(raw: string, optional: boolean): number|null {
  if (typeof raw !== 'string') throw new RangeError('Numeric text required');
  const s = raw.trim();
  if (!s && optional) return null;
  if (!/^\d+(?:[.,]\d+)?$/.test(s)) throw new RangeError('Invalid decimal');
  const n = Number(s.replace(',', '.'));
  if (!Number.isFinite(n) || (n === 0 && /[1-9]/.test(s))) throw new RangeError('Numeric range');
  return n;
}
function required(raw: string): number {
  const n = decimal(raw, false);
  if (n === null || n <= 0) throw new RangeError('Positive amount required');
  return n;
}
function statusFor(intent: Intent, previous?: DiaryEntry): Active {
  if (!['save-draft','plan','confirm','edit'].includes(intent)) throw new RangeError('Invalid intent');
  if (previous?.status === 'deleted') throw new RangeError('Deleted entry cannot be edited');
  if (intent === 'edit') {
    if (!previous) throw new RangeError('Edit requires existing entry');
    return previous.status;
  }
  const target = intent === 'save-draft' ? 'draft' : intent === 'plan' ? 'planned' : 'confirmed';
  if (previous?.status === 'confirmed' && target !== 'confirmed') throw new RangeError('Confirmed entry cannot be demoted');
  return target;
}
/** Pure command preparation. Caller supplies identity/time and explicitly chooses intent; never writes storage. */
export function prepareEntry(form: Form, intent: Intent, context: {id: string; now: string; previous?: DiaryEntry}) {
  const prev = context.previous;
  if (prev) {
    validateEntry(prev);
    if (context.id !== prev.id || context.now < prev.updated_at) throw new RangeError('Invalid edit identity or timestamp');
  }
  const status = statusFor(intent, prev);
  const amount = decimal(form.amount, status === 'draft');
  if (amount !== null && amount <= 0) throw new RangeError('Positive amount required');
  if (!Object.hasOwn(confidence, form.source_kind)) throw new RangeError('Invalid source kind');
  const source: Source = { kind: form.source_kind, confidence: confidence[form.source_kind] };
  if (form.source_reference !== undefined) source.reference = form.source_reference === null ? null : form.source_reference.trim() || null;
  if (form.source_retrieved_at !== undefined) source.retrieved_at = form.source_retrieved_at;
  if (form.source_license !== undefined) source.license = form.source_license === null ? null : form.source_license.trim() || null;
  if ((source.kind === 'label' || source.kind === 'catalog') && !source.reference) throw new RangeError('Source reference required');
  const entry: DiaryEntry = {
    id: context.id, revision: prev?.revision ?? 1, created_at: prev?.created_at ?? context.now,
    updated_at: context.now, local_date: form.local_date, timezone: form.timezone, meal_type: form.meal_type,
    status, amount, unit: form.unit,
    food: { name: form.name.trim(), preparation: form.preparation, basis_amount: required(form.basis_amount),
      basis_unit: form.basis_unit, kcal: decimal(form.kcal,true), protein_g: decimal(form.protein_g,true),
      fat_g: decimal(form.fat_g,true), carbs_g: decimal(form.carbs_g,true), source }
  };
  validateEntry(entry);
  const preview: Nutrition|null = amount === null ? null : portion(entry.food, amount, entry.unit);
  return { operation: prev ? 'update' as const : 'create' as const, expectedRevision: prev?.revision ?? null, entry, preview };
}
