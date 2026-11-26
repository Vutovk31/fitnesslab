import {validateEntry} from '../dist/storage.js';
import {catalogNameKey as normalize} from './catalog-projection.mjs';

// Exact, bounded, local matching. Returned variants are proposals, never writes.
const MAX_ROWS=2000,MAX_VARIANTS=100;
const units=['g','ml','piece'],preparations=['raw','cooked','unknown'];
const nutrients=['kcal','protein_g','fat_g','carbs_g'];
const decimal=n=>n===null?'':n.toLocaleString('en-US',{useGrouping:false,maximumSignificantDigits:21});
export function matchNutrition(entries,{name,unit,preparation='unknown'}={}){
  if(!Array.isArray(entries)||entries.length>MAX_ROWS)throw RangeError('Catalog input limit');
  if(typeof name!=='string'||!name.trim()||name.length>300||!units.includes(unit)||!preparations.includes(preparation))throw RangeError('Invalid catalog query');
  const needle=normalize(name),ids=new Set(),variants=new Map();let unusable=0;
  for(const e of entries){
    validateEntry(e);
    if(ids.has(e.id))throw RangeError('Duplicate catalog entry');ids.add(e.id);
    if(!['confirmed','planned'].includes(e.status)||normalize(e.food.name)!==needle||e.unit!==unit||e.food.basis_unit!==unit||(preparation!=='unknown'&&e.food.preparation!==preparation))continue;
    const f=e.food,s=f.source;
    if(['label','catalog'].includes(s.kind)&&!s.reference){unusable++;continue;}
    const variant={name:f.name,preparation:f.preparation,unit:e.unit,basis_amount:decimal(f.basis_amount),basis_unit:f.basis_unit,...Object.fromEntries(nutrients.map(k=>[k,decimal(f[k])])),source_kind:s.kind,source_reference:s.reference??null,source_retrieved_at:s.retrieved_at??null,source_license:s.license??null};
    const key=JSON.stringify(variant);
    if(!variants.has(key)){if(variants.size>=MAX_VARIANTS)throw RangeError('Too many catalog variants');variants.set(key,{key,variant});}
  }
  const matches=[...variants.values()].sort((a,b)=>a.key<b.key?-1:a.key>b.key?1:0);
  return {status:matches.length===0?'none':matches.length===1?'unique':'ambiguous',matches,unusable};
}
// Recompute against the supplied current snapshot; an obsolete key cannot select a different variant.
// Caller must explicitly approve replacement of food data and supply a fresh snapshot.
export function applyNutritionMatch(entries,form,key,approved=false){
  if(approved!==true||typeof key!=='string')throw RangeError('Explicit catalog selection required');
  const selected=matchNutrition(entries,form).matches.find(m=>m.key===key);
  if(!selected)throw RangeError('Catalog selection unavailable');
  const {name,...food}=selected.variant;
  return {...form,...food};
}
