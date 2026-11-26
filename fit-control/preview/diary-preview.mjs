import { diaryView } from '../dist/diary-view.js';
import { prepareEntry } from '../dist/diary-editor.js';

export const targets = Object.freeze({kcal:2100,protein_g:160,fat_g:70,carbs_g:208});
export function localDate(now = new Date()) {
  return [now.getFullYear(), String(now.getMonth()+1).padStart(2,'0'), String(now.getDate()).padStart(2,'0')].join('-');
}
export function makeForm(date, timezone) {
  return {name:'',local_date:date,timezone,meal_type:'breakfast',preparation:'unknown',amount:'',unit:'g',basis_amount:'100',basis_unit:'g',kcal:'',protein_g:'',fat_g:'',carbs_g:'',source_kind:'estimate',source_reference:null,source_retrieved_at:null,source_license:null};
}
export function toForm(e) {
  const f=e.food,s=f.source, str=v=>v===null?'':String(v);
  return {...makeForm(e.local_date,e.timezone),name:f.name,meal_type:e.meal_type,preparation:f.preparation,amount:str(e.amount),unit:e.unit,basis_amount:str(f.basis_amount),basis_unit:f.basis_unit,kcal:str(f.kcal),protein_g:str(f.protein_g),fat_g:str(f.fat_g),carbs_g:str(f.carbs_g),source_kind:s.kind,source_reference:s.reference??null,source_retrieved_at:s.retrieved_at??null,source_license:s.license??null};
}
// Temporary UI state, not a persistence adapter or production store.
export function createPreview({date,timezone,idFactory,clock,seed=true}) {
  let rows=[], goals={...targets};
  function setTargets(input) {
    const next={};
    for(const k of Object.keys(targets)){
      const raw=input[k];
      if(typeof raw!=='string')throw new RangeError('Введите число или оставьте поле пустым');
      const value=raw.trim();
      if(!value){next[k]=null;continue;}
      if(!/^\d+(?:[.,]\d+)?$/.test(value))throw new RangeError('Цель должна быть положительным числом');
      const n=Number(value.replace(',','.'));
      if(!Number.isFinite(n)||n<=0)throw new RangeError('Цель должна быть положительным конечным числом');
      next[k]=n;
    }
    diaryView(rows,date,next);
    backupTextFor(rows,next);
    goals=next;
    return {...goals};
  }
  function getTargets(){return {...goals};}
  const maxBackupBytes=2*1024*1024, maxRecords=1000;
  function exactKeys(value, keys) {
    return value!==null && typeof value==='object' && !Array.isArray(value) && Object.keys(value).length===keys.length && keys.every(k=>Object.hasOwn(value,k));
  }
  function inspectBackup(text) {
    if(typeof text!=='string'||text.length>maxBackupBytes||new TextEncoder().encode(text).length>maxBackupBytes)throw new RangeError('Резервная копия превышает 2 МиБ');
    const b=JSON.parse(text);
    if(!exactKeys(b,['schema_version','product','mode','entries','targets'])||b.schema_version!==1||b.product!=='FIT CONTROL'||b.mode!=='synthetic_preview')throw new RangeError('Несовместимый формат резервной копии');
    if(!Array.isArray(b.entries)||b.entries.length>maxRecords||!exactKeys(b.targets,Object.keys(targets)))throw new RangeError('Некорректные записи или цели');
    // The canonical read model validates every record and rejects duplicate IDs.
    diaryView(b.entries,date,b.targets);
    for(const day of new Set(b.entries.map(e=>e.local_date)))if(day!==date)diaryView(b.entries,day,b.targets);
    return b;
  }
  function backupTextFor(entries,goalValues){
    const payload={schema_version:1,product:'FIT CONTROL',mode:'synthetic_preview',entries,targets:goalValues};
    const pretty=JSON.stringify(payload,null,2);
    if(new TextEncoder().encode(pretty).length<=maxBackupBytes)return pretty;
    const compact=JSON.stringify(payload);
    if(new TextEncoder().encode(compact).length>maxBackupBytes)throw new RangeError('Достигнут лимит резервной копии 2 МиБ; текущие данные сохранены');
    return compact;
  }
  function exportBackup(){
    const text=backupTextFor(rows,goals);
    inspectBackup(text);return text;
  }
  function restoreBackup(text,approved=false){
    if(approved!==true)throw new Error('Требуется явное подтверждение замены');
    const b=inspectBackup(text);backupTextFor(b.entries,b.targets);rows=b.entries;goals=b.targets;
    return rows.length;
  }
  function nextId(){
    for(let i=0;i<=maxRecords;i++){const id=idFactory();if(!rows.some(r=>r.id===id))return id;}
    throw new Error('Не удалось выделить уникальный идентификатор');
  }
  const find=id=>{const e=rows.find(r=>r.id===id);if(!e||e.status==='deleted')throw Error('Запись не найдена');return e;};
  function command(form,intent,id,revision) {
    const previous=id?find(id):undefined;
    if(previous && previous.revision!==revision)throw Error('Запись изменилась. Откройте её заново.');
    return prepareEntry(form,intent,{id:previous?.id??nextId(),now:clock(),previous});
  }
  function apply(form,intent,id,revision) {
    const c=command(form,intent,id,revision);
    if(rows.some(r=>r.id===c.entry.id) && !id)throw Error('Повтор идентификатора');
    const next={...c.entry,revision:id?c.entry.revision+1:1};
    if(!id&&rows.length>=maxRecords)throw new RangeError('Достигнут лимит 1000 записей');
    const candidate=id?rows.map(r=>r.id===id?next:r):[...rows,next];
    // Reject aggregate overflow before changing temporary state.
    diaryView(candidate,next.local_date,goals);
    backupTextFor(candidate,goals);
    rows=candidate;
    return structuredClone(next);
  }
  function remove(id,revision) {
    const e=find(id);if(e.revision!==revision)throw Error('Запись изменилась. Откройте её заново.');
    rows=rows.filter(r=>r.id!==id);
  }
  function view(day){return diaryView(rows,day,goals);}
  function get(id){return structuredClone(find(id));}
  if(seed){
    const base=makeForm(date,timezone);
    apply({...base,name:'Овсяная каша (пример)',amount:'180',kcal:'110',protein_g:'4',fat_g:'3',carbs_g:'17',preparation:'cooked'},'confirm');
    apply({...base,name:'Творог (пример)',amount:'150',kcal:'120',protein_g:'16',fat_g:'5',carbs_g:'3'},'confirm');
    apply({...base,name:'Курица (пример)',meal_type:'lunch',amount:'200',kcal:'165',protein_g:'31',fat_g:'4',carbs_g:'0',preparation:'cooked'},'plan');
  }
  return {command,apply,remove,view,get,setTargets,getTargets,inspectBackup,exportBackup,restoreBackup};
}
