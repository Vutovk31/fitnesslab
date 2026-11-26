// Mount the existing diary/editor markup in a mobile shell. No storage fallback.
import {persistentDiary} from './persistent-diary.mjs';
const fields=['name','meal_type','preparation','amount','unit','basis_amount','basis_unit','kcal','protein_g','fat_g','carbs_g','source_kind','source_reference'];
const blank={name:'',meal_type:'breakfast',preparation:'unknown',amount:'',unit:'g',basis_amount:'100',basis_unit:'g',kcal:'',protein_g:'',fat_g:'',carbs_g:'',source_kind:'estimate',source_reference:''};
const meals={breakfast:'Завтрак',lunch:'Обед',snack:'Перекус',dinner:'Ужин',other:'Другое'};
const statuses={confirmed:'Съедено',planned:'План',draft:'Черновик'};
const fmt=n=>n===null?'—':new Intl.NumberFormat('ru-RU',{maximumFractionDigits:1}).format(n);
const decimal=n=>n===null?'':n.toLocaleString('en-US',{useGrouping:false,maximumSignificantDigits:21});
const mounted=new WeakSet();
export function mountDiaryScreen(doc,{store,date,timezone,targets,idFactory,clock,approve}){
  if(mounted.has(doc))throw new Error('Diary already mounted');
  if(typeof approve!=='function')throw new TypeError('Confirmation required');
  const c=persistentDiary({store,date,targets,idFactory,clock});
  const $=id=>{const e=doc.getElementById(id);if(!e)throw new Error('Missing diary element '+id);return e;};
  const day=$('day'),form=$('editor'),groups=$('groups'),error=$('error'),status=$('diary-status');
  const controls=Object.fromEntries(fields.map(k=>{const e=form.elements.namedItem(k);if(!e)throw new Error('Missing field '+k);return [k,e];}));
  const buttons=['save-confirm','save-plan','save-draft','save-edit','cancel','add'].map($);
  let pending=false,editing=null,meta={},dirty=false,blocked=false,uncertain=false,mode='confirmed';
  const goalKeys=['kcal','protein_g','fat_g','carbs_g'],goalForm=$('goals');
  const goalFields=Object.fromEntries(goalKeys.map(k=>[k,$('goal-'+k)]));
  let goalDirty=false,goalBase=null;
  const resetGoals=()=>{goalDirty=false;goalBase=null;};
  function goalValue(raw){const text=raw.trim();if(!text)return null;if(!/^\d+(?:[.,]\d+)?$/.test(text))throw new RangeError('Invalid goal');const n=Number(text.replace(',','.'));if(!Number.isFinite(n)||n<=0)throw new RangeError('Invalid goal');return n;}
  const modes=[...doc.querySelectorAll('[data-mode]')];
  const el=(tag,text)=>{const e=doc.createElement(tag);e.textContent=text;return e;};
  const action=(label,fn,disabled=false)=>{const b=el('button',label);b.type='button';b.disabled=disabled;b.addEventListener('click',fn);return b;};
  function reset(){editing=null;meta={};dirty=false;for(const k of fields)controls[k].value=blank[k];}
  function render(){const s=c.snapshot(),ready=s.phase==='ready'&&!pending&&!s.busy;
    day.value=s.date;day.disabled=pending||uncertain;form.setAttribute('aria-busy',String(pending));
    for(const e of Object.values(controls))e.disabled=!ready;
    for(const b of buttons)b.disabled=!ready||blocked;
    $('cancel').disabled=pending;$('add').disabled=!ready||blocked;
    $('save-edit').hidden=!editing;
    $('save-confirm').hidden=editing?.status==='confirmed';$('save-plan').hidden=editing?.status==='confirmed';$('save-draft').hidden=editing?.status==='confirmed';
    $('editor-heading').textContent=editing?'Редактировать продукт':'Добавить продукт';
    $('portion').textContent='Расчёт после подтверждения записи. Неизвестные значения оставьте пустыми.';
    $('retry-diary').disabled=pending||uncertain;
    goalForm.setAttribute('aria-busy',String(pending));
    for(const k of goalKeys){goalFields[k].disabled=!ready||blocked||!s.durableGoals;if(!goalDirty)goalFields[k].value=s.phase==='ready'?decimal(s.goals[k]):'';}
    $('save-goals').disabled=!ready||blocked||!s.durableGoals;
    $('cancel-goals').disabled=pending||blocked||!s.durableGoals;
    for(const b of modes){b.setAttribute('aria-pressed',String(b.dataset.mode===mode));b.disabled=pending;}
    const v=s.phase==='ready'?s.view:null;groups.replaceChildren();
    const total=t=>t.total===null?'Неизвестно (известно '+fmt(t.known)+')':fmt(t.total);
    $('mode-label').textContent={confirmed:'Съедено',planned:'План',forecast:'Прогноз'}[mode];
    $('energy').textContent=v?total(v.cards.kcal[mode]):'—';
    $('energy-target').textContent=v?'ккал · цель '+fmt(v.cards.kcal.target):'ккал';
    $('remaining').textContent=v?'Остаток по факту: '+fmt(v.cards.kcal.remaining):'';
    $('counts').textContent=v?'Черновики: '+v.draftCount:'';
    const macros=$('macros');macros.replaceChildren();
    if(v)for(const [k,label] of [['protein_g','Белки'],['fat_g','Жиры'],['carbs_g','Углеводы']])macros.append(el('p',label+': '+total(v.cards[k][mode])+' г · остаток: '+fmt(v.cards[k].remaining)+' г'));
    if(v)for(const g of v.groups){const section=el('section','');section.append(el('h3',meals[g.meal]));for(const row of g.rows){const item=el('div','');item.className='entry';item.append(el('span',row.name+' · '+statuses[row.status]+' · '+fmt(row.amount)+' '+row.unit),action('Изменить',()=>edit(row),!ready||blocked),action('Удалить',()=>remove(row),!ready||blocked));section.append(item);}groups.append(section);}
  }
  function edit(row){if(pending||blocked||c.snapshot().phase!=='ready'||(dirty&&!approve('Заменить несохранённую форму?')))return;
    try{const e=c.getEntry(row.id,row.revision);reset();editing={id:e.id,revision:e.revision,status:e.status};meta={timezone:e.timezone,source_retrieved_at:e.food.source.retrieved_at,source_license:e.food.source.license};
      const f={name:e.food.name,meal_type:e.meal_type,preparation:e.food.preparation,amount:decimal(e.amount),unit:e.unit,basis_amount:decimal(e.food.basis_amount),basis_unit:e.food.basis_unit,kcal:decimal(e.food.kcal),protein_g:decimal(e.food.protein_g),fat_g:decimal(e.food.fat_g),carbs_g:decimal(e.food.carbs_g),source_kind:e.food.source.kind,source_reference:e.food.source.reference??''};
      for(const k of fields)controls[k].value=f[k];error.textContent='';render();controls.name.focus();
    }catch{error.textContent='Запись изменилась. Обновите дневник.';}}
  async function load(next){if(pending||uncertain)return false;pending=true;error.textContent='';status.textContent='Загрузка…';render();
    try{const ok=await c.selectDate(next);if(ok)blocked=false;status.textContent=ok?'Дневник загружен.':'Не удалось загрузить. Повторите чтение.';return ok;}
    catch{status.textContent='Некорректная дата.';return false;}
    finally{pending=false;render();}}
  async function write(work,clear,onCommit=()=>{}){if(pending||blocked||c.snapshot().phase!=='ready')return;pending=true;error.textContent='';status.textContent='Сохранение…';render();
    try{const result=await work();if(clear)reset();onCommit();status.textContent=result.refreshed?'Сохранено.':'Сохранено. Обновление не удалось — повторите чтение, не запись.';}
    catch{const code=c.snapshot().error;const conflict=code==='CONFLICT';uncertain=code==='COMMIT_OUTCOME_UNKNOWN';blocked=conflict||uncertain;if(uncertain){error.textContent='Исход сохранения неизвестен. Закройте приложение, откройте заново и проверьте запись до повторного ввода.';status.textContent='Требуется сверка базы.';return;}error.textContent=conflict?'Конфликт версий. Обновите дневник и заново выберите запись.':'Не сохранено. Проверьте поля или повторите позже.';status.textContent='Изменения не подтверждены.';}
    finally{pending=false;render();}}
  goalForm.addEventListener('input',()=>{if(!goalDirty){goalBase=c.snapshot().goalRevision;goalDirty=true;}});
  goalForm.addEventListener('submit',ev=>{ev.preventDefault();if(pending||blocked||!c.snapshot().durableGoals)return;
    return write(()=>c.setGoals(Object.fromEntries(goalKeys.map(k=>[k,goalValue(goalFields[k].value)])),goalDirty?goalBase:c.snapshot().goalRevision),false,resetGoals);});
  $('cancel-goals').addEventListener('click',()=>{if(pending||blocked)return;if(goalDirty&&!approve('Сбросить несохранённые цели?'))return;resetGoals();render();});
  function remove(row){if(pending||blocked||!approve('Удалить запись?'))return;return write(()=>c.remove(row.id,row.revision),editing?.id===row.id);}
  form.addEventListener('input',ev=>{dirty=true;if(ev.target===controls.source_kind||ev.target===controls.source_reference){delete meta.source_retrieved_at;delete meta.source_license;}});
  form.addEventListener('submit',ev=>{ev.preventDefault();if(pending||blocked)return;const intent=ev.submitter?.value;if(!['confirm','plan','save-draft','edit'].includes(intent))return;
    if(editing?.status==='confirmed'&&intent!=='edit')return;
    const f={...meta,local_date:c.snapshot().date,timezone:meta.timezone??timezone};for(const k of fields)f[k]=controls[k].value;
    return write(()=>c.save(f,intent,editing),true);});
  day.addEventListener('change',()=>{const next=day.value;if(pending||uncertain){render();return;}if((dirty||editing)&&!approve('Отменить несохранённую форму?')){render();return;}reset();return load(next);});
  $('retry-diary').addEventListener('click',()=>{if(pending||uncertain)return;if(blocked){if(!approve('Сбросить конфликтующую форму?'))return;reset();resetGoals();}return load(c.snapshot().date);});
  for(const id of ['cancel','add'])$(id).addEventListener('click',()=>{if(pending||(dirty&&!approve('Очистить несохранённую форму?')))return;reset();error.textContent='';render();if(id==='add')controls.name.focus();});
  for(const b of modes)b.addEventListener('click',()=>{if(pending||!['confirmed','planned','forecast'].includes(b.dataset.mode))return;mode=b.dataset.mode;render();});
  mounted.add(doc);reset();render();$('main-content').removeAttribute('inert');$('connection-status').textContent=c.snapshot().durableGoals?'Подключено хранилище. Цели сохраняются локально.':'Подключено хранилище. Редактор целей недоступен.';const ready=load(date);return {ready,snapshot:c.snapshot};
}
