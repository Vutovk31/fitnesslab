// Mount the existing diary/editor markup in a mobile shell. No storage fallback.
import {persistentDiary} from './persistent-diary.mjs';
import {audioLease} from './audio-lease.mjs';
import {mountRecognitionScreen} from './recognition-screen.mjs';
import {mountCaptureScreen} from './voice-screen.mjs';
import {transcriptForm} from '../preview/transcript.mjs';
import {inspectBackup} from './sqlite-diary.mjs';
import {encryptBackup,decryptBackup,encryptedBackupMaxBytes} from './encrypted-backup.mjs';
const fields=['name','meal_type','preparation','amount','unit','basis_amount','basis_unit','kcal','protein_g','fat_g','carbs_g','source_kind','source_reference'];
const blank={name:'',meal_type:'breakfast',preparation:'unknown',amount:'',unit:'g',basis_amount:'100',basis_unit:'g',kcal:'',protein_g:'',fat_g:'',carbs_g:'',source_kind:'estimate',source_reference:''};
const meals={breakfast:'Завтрак',lunch:'Обед',snack:'Перекус',dinner:'Ужин',other:'Другое'};
const statuses={confirmed:'Съедено',planned:'План',draft:'Черновик'};
const fmt=n=>n===null?'—':new Intl.NumberFormat('ru-RU',{maximumFractionDigits:1}).format(n);
const decimal=n=>n===null?'':n.toLocaleString('en-US',{useGrouping:false,maximumSignificantDigits:21});
const mounted=new WeakSet();
export function mountDiaryScreen(doc,{store,date,timezone,targets,idFactory,clock,approve,filePort,passphrasePort,capturePort,recognitionPort}){
  if(mounted.has(doc))throw new Error('Diary already mounted');
  if(typeof approve!=='function')throw new TypeError('Confirmation required');
  const c=persistentDiary({store,date,targets,idFactory,clock});
  const $=id=>{const e=doc.getElementById(id);if(!e)throw new Error('Missing diary element '+id);return e;};
  // Binary file port: read({maxBytes}) -> Uint8Array|null; write({bytes,filename}) -> true|null.
  // Passphrase port: request({purpose}) -> string|null, never persists or logs input.
  // Native host must bound reads before allocation; no plaintext file fallback.
  const backupEnabled=typeof filePort?.read==='function'&&typeof filePort?.write==='function'&&typeof passphrasePort?.request==='function'&&typeof store.exportBackup==='function'&&typeof store.restoreBackup==='function';
  const backupStatus=$('backup-status');
  backupStatus.textContent=backupEnabled?'Выберите действие.':'Файловый доступ не подключён.';
  const lease=audioLease();
  const voice=mountCaptureScreen(doc,{port:capturePort,approve,lease});
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
  const transcriptText=$('transcript-text'),transcriptLine=$('transcript-line'),transcriptResult=$('transcript-result');
  let transcriptCandidate=null;
  function invalidateTranscript(){transcriptCandidate=null;transcriptResult.textContent='';}
  function clearTranscript(){invalidateTranscript();transcriptText.value='';transcriptLine.value='1';}
  const recognition=mountRecognitionScreen(doc,{port:recognitionPort,approve,lease,onAccept:text=>{clearTranscript();transcriptText.value=text;transcriptText.focus();render();}});
  const recoveryBlocked=()=>c.snapshot().recovery.status!=='none';
  function render(){const s=c.snapshot(),ready=s.phase==='ready'&&!pending&&!s.busy&&s.recovery.status==='none';
    const r=s.recovery,kind={create:'добавление',update:'изменение',remove:'удаление',goals:'цели',restore:'импорт'}[r.kind]??'';
    $('recovery-status').textContent=!s.recoveryEnabled?'Журнал не подключён.':r.status==='none'?'Незавершённых операций нет.':r.status==='unknown'?'Результат неизвестен. Обновите журнал или перезапустите приложение.':(r.status==='committed'?'Операция сохранена: ':'Операция не применена на момент проверки: ')+kind+'. Проверьте дневник и подтвердите результат.';
    $('recovery-ack').disabled=pending||uncertain||s.busy||s.phase!=='ready'||!['committed','not_applied'].includes(r.status);
    const canTranscript=ready&&!blocked&&!uncertain;
    voice.sync(canTranscript);recognition.sync(canTranscript);
    transcriptText.disabled=transcriptLine.disabled=$('transcript-preview').disabled=!canTranscript;
    $('transcript-apply').disabled=!canTranscript||!transcriptCandidate;
    $('transcript-clear').disabled=pending;
    day.value=s.date;day.disabled=pending||uncertain;form.setAttribute('aria-busy',String(pending));
    for(const e of Object.values(controls))e.disabled=!ready;
    for(const b of buttons)b.disabled=!ready||blocked;
    $('cancel').disabled=pending;$('add').disabled=!ready||blocked;
    $('save-edit').hidden=!editing;
    $('save-confirm').hidden=editing?.status==='confirmed';$('save-plan').hidden=editing?.status==='confirmed';$('save-draft').hidden=editing?.status==='confirmed';
    $('editor-heading').textContent=editing?'Редактировать продукт':'Добавить продукт';
    $('portion').textContent='Расчёт после подтверждения записи. Неизвестные значения оставьте пустыми.';
    $('retry-diary').disabled=pending||uncertain;
    for(const id of ['backup-export','backup-import'])$(id).disabled=!ready||blocked||!backupEnabled;
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
  function edit(row){if(pending||blocked||recoveryBlocked()||c.snapshot().phase!=='ready'||(dirty&&!approve('Заменить несохранённую форму?')))return;
    try{const e=c.getEntry(row.id,row.revision);reset();editing={id:e.id,revision:e.revision,status:e.status};meta={timezone:e.timezone,source_retrieved_at:e.food.source.retrieved_at,source_license:e.food.source.license};
      const f={name:e.food.name,meal_type:e.meal_type,preparation:e.food.preparation,amount:decimal(e.amount),unit:e.unit,basis_amount:decimal(e.food.basis_amount),basis_unit:e.food.basis_unit,kcal:decimal(e.food.kcal),protein_g:decimal(e.food.protein_g),fat_g:decimal(e.food.fat_g),carbs_g:decimal(e.food.carbs_g),source_kind:e.food.source.kind,source_reference:e.food.source.reference??''};
      for(const k of fields)controls[k].value=f[k];error.textContent='';render();controls.name.focus();
    }catch{error.textContent='Запись изменилась. Обновите дневник.';}}
  async function load(next){if(pending||uncertain)return false;pending=true;error.textContent='';status.textContent='Загрузка…';render();
    try{const ok=await c.selectDate(next);if(ok)blocked=false;status.textContent=ok?'Дневник загружен.':'Не удалось загрузить. Повторите чтение.';return ok;}
    catch{status.textContent='Некорректная дата.';return false;}
    finally{pending=false;render();}}
  async function write(work,clear,onCommit=()=>{}){if(pending||blocked||recoveryBlocked()||c.snapshot().phase!=='ready')return;pending=true;error.textContent='';status.textContent='Сохранение…';render();
    try{const result=await work();if(clear)reset();onCommit();status.textContent=result.refreshed?'Сохранено.':'Сохранено. Обновление не удалось — повторите чтение, не запись.';}
    catch{const code=c.snapshot().error;const conflict=code==='CONFLICT';uncertain=code==='COMMIT_OUTCOME_UNKNOWN';blocked=conflict||uncertain;if(uncertain){error.textContent='Исход сохранения неизвестен. Закройте приложение, откройте заново и проверьте запись до повторного ввода.';status.textContent='Требуется сверка базы.';return;}error.textContent=conflict?'Конфликт версий. Обновите дневник и заново выберите запись.':'Не сохранено. Проверьте поля или повторите позже.';status.textContent='Изменения не подтверждены.';}
    finally{pending=false;render();}}
  async function backupAction(kind){
    if(pending||blocked||recoveryBlocked()||!backupEnabled||c.snapshot().phase!=='ready')return;
    if(kind==='export'&&approve('Создать зашифрованную копию сохранённых тестовых данных? Без пароля восстановление невозможно.')!==true)return;
    pending=true;backupStatus.textContent='Подготовка…';render();
    let restoring=false;
    try{
      if(kind==='export'){
        const password=await passphrasePort.request({purpose:'export'});
        if(password===null){backupStatus.textContent='Экспорт отменён.';return;}
        const confirmation=await passphrasePort.request({purpose:'confirm-export'});
        if(confirmation===null){backupStatus.textContent='Экспорт отменён.';return;}
        if(typeof password!=='string'||password!==confirmation){backupStatus.textContent='Пароли не совпадают. Экспорт не выполнен.';return;}
        const bytes=await encryptBackup(await store.exportBackup(3),password);
        const saved=await filePort.write({bytes,filename:'FIT_CONTROL_backup.fcbk'});
        if(saved!==true&&saved!==null)throw Error('Unconfirmed file write');
        backupStatus.textContent=saved===true?'Файл сохранён.':'Экспорт отменён.';return;
      }
      const input=await filePort.read({maxBytes:encryptedBackupMaxBytes});
      if(input===null){backupStatus.textContent='Выбор файла отменён.';return;}
      if(!(input instanceof Uint8Array)||input.byteLength<=49||input.byteLength>encryptedBackupMaxBytes)throw Error('Invalid encrypted file');
      const bytes=new Uint8Array(input);
      const password=await passphrasePort.request({purpose:'import'});
      if(password===null){backupStatus.textContent='Восстановление отменено.';return;}
      const text=await decryptBackup(bytes,password);
      const info=inspectBackup(text);
      const summary='Формат v'+info.version+'; записей: '+info.entries+'; удалённых: '+info.deleted+'; цели: '+(info.hasGoals?'есть':'нет')+'. Только пустая база.';
      backupStatus.textContent=summary;
      if(approve(summary+' Восстановить? Несохранённые формы будут очищены только после коммита.')!==true){backupStatus.textContent='Восстановление отменено.';return;}
      restoring=true;
      const result=await c.restoreBackup(text,true);
      reset();resetGoals();clearTranscript();
      backupStatus.textContent=result.refreshed?'Восстановлено.':'Восстановлено. Обновление не удалось — повторите чтение, не импорт.';
    }catch(e){
      if(restoring&&e?.code==='COMMIT_OUTCOME_UNKNOWN'){uncertain=true;blocked=true;backupStatus.textContent='Исход операции неизвестен. Закройте приложение, откройте заново и проверьте базу до повторного импорта.';}
      else if(restoring&&c.snapshot().error==='CONFLICT'){blocked=true;backupStatus.textContent='База не пуста. Восстановление запрещено.';}
      else backupStatus.textContent=kind==='export'?'Сохранение файла не подтверждено.':'Восстановление не выполнено. Проверьте пароль, файл и состояние базы.';
    }finally{pending=false;render();}
  }
  const canPrepareTranscript=()=>!pending&&!blocked&&!uncertain&&!recoveryBlocked()&&c.snapshot().phase==='ready';
  for(const e of [transcriptText,transcriptLine])e.addEventListener('input',()=>{invalidateTranscript();render();});
  $('transcript-clear').addEventListener('click',()=>{if(pending)return;clearTranscript();render();});
  $('transcript-preview').addEventListener('click',()=>{
    if(!canPrepareTranscript())return;
    invalidateTranscript();
    if(approve('Обработать тестовую расшифровку локально, без отправки данных?')!==true){render();return;}
    try{
      if(!/^\d+$/.test(transcriptLine.value))throw Error('Invalid line');
      const text=transcriptText.value,line=transcriptLine.value,date=c.snapshot().date;
      const candidate=transcriptForm(text,Number(line),date,timezone);
      transcriptCandidate={text,line,date,form:candidate};
      transcriptResult.textContent=candidate.name+' · '+(candidate.amount?candidate.amount+' '+({g:'г',ml:'мл',piece:'шт.'}[candidate.unit]):'уточните количество')+' · КБЖУ не определены. Проверьте приём пищи (по умолчанию завтрак).';
    }catch{transcriptResult.textContent='Некорректная строка. Используйте формат «Продукт; 150 г» или укажите название.';}
    render();
  });
  $('transcript-apply').addEventListener('click',()=>{
    if(!canPrepareTranscript()||!transcriptCandidate)return;
    const p=transcriptCandidate;
    if(p.text!==transcriptText.value||p.line!==transcriptLine.value||p.date!==c.snapshot().date){invalidateTranscript();render();return;}
    if(approve('Перенести строку в редактор? '+(dirty||editing?'Текущая несохранённая форма будет заменена. ':'')+'Запись не сохранится без отдельного действия.')!==true)return;
    reset();for(const k of fields)controls[k].value=p.form[k]??'';dirty=true;
    clearTranscript();transcriptResult.textContent='Перенесено в редактор. Уточните данные и выберите действие сохранения.';
    error.textContent='';render();controls.name.focus();
  });
  $('backup-export').addEventListener('click',()=>backupAction('export'));
  $('backup-import').addEventListener('click',()=>backupAction('import'));
  $('recovery-ack').addEventListener('click',async()=>{
    const s=c.snapshot(),r=s.recovery;
    if(pending||uncertain||s.phase!=='ready'||!['committed','not_applied'].includes(r.status)||approve('Подтвердить проверенный результат? Несохранённые формы будут сброшены. Операция не будет повторена.')!==true)return;
    pending=true;render();
    try{const ok=await c.acknowledgeRecovery(r.sequence,r.status,true);reset();resetGoals();clearTranscript();blocked=false;error.textContent='';status.textContent=ok?'Результат подтверждён.':'Результат подтверждён, требуется обновление.';}
    catch{error.textContent='Подтверждение не завершено. Обновите журнал; не повторяйте операцию.';}
    finally{pending=false;render();}
  });
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
  day.addEventListener('change',()=>{const next=day.value;if(pending||uncertain){render();return;}if((dirty||editing)&&!approve('Отменить несохранённую форму?')){render();return;}reset();clearTranscript();return load(next);});
  $('retry-diary').addEventListener('click',()=>{if(pending||uncertain)return;if(blocked){if(!approve('Сбросить конфликтующую форму?'))return;reset();resetGoals();}return load(c.snapshot().date);});
  for(const id of ['cancel','add'])$(id).addEventListener('click',()=>{if(pending||(dirty&&!approve('Очистить несохранённую форму?')))return;reset();error.textContent='';render();if(id==='add')controls.name.focus();});
  for(const b of modes)b.addEventListener('click',()=>{if(pending||!['confirmed','planned','forecast'].includes(b.dataset.mode))return;mode=b.dataset.mode;render();});
  mounted.add(doc);reset();render();$('main-content').removeAttribute('inert');$('connection-status').textContent=c.snapshot().durableGoals?'Подключено хранилище. Цели сохраняются локально.':'Подключено хранилище. Редактор целей недоступен.';const ready=load(date);return {ready,snapshot:c.snapshot,dispose(){recognition.dispose();voice.dispose();clearTranscript();}};
}
