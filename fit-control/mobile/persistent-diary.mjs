import {prepareEntry} from '../dist/diary-editor.js';
import {diaryView} from '../dist/diary-view.js';
import {DiaryConflict} from '../dist/storage.js';

// Controller owns only a read projection. Store remains the source of truth.
// Optional legacy ports are read-only for goals; the native SQLite port persists them.
export function persistentDiary({store,date,targets,idFactory,clock}) {
  for(const name of ['list','create','update','remove'])if(typeof store?.[name]!=='function')throw new TypeError('Unsupported diary store');
  if(typeof idFactory!=='function'||typeof clock!=='function')throw new TypeError('Missing identity or clock');
  let goals=structuredClone(targets);diaryView([],date,goals);
  const durable=typeof store.getGoals==='function'&&typeof store.setGoals==='function';
  if((typeof store.getGoals==='function')!==(typeof store.setGoals==='function'))throw new TypeError('Incomplete goals port');
  const recoveryEnabled=typeof store.getRecovery==='function'&&typeof store.acknowledgeRecovery==='function';
  if((typeof store.getRecovery==='function')!==(typeof store.acknowledgeRecovery==='function'))throw new TypeError('Incomplete recovery port');
  const unknown=()=>({sequence:null,kind:null,status:'unknown'});
  let recovery=recoveryEnabled?unknown():{sequence:0,kind:null,status:'none'};
  async function readRecovery(){
    if(!recoveryEnabled)return recovery;
    try{const r=await store.getRecovery();
      if(r?.status==='none'&&Number.isSafeInteger(r.sequence)&&r.sequence>=0)return structuredClone(r);
      if(['committed','not_applied'].includes(r?.status)&&Number.isSafeInteger(r.sequence)&&r.sequence>0&&['create','update','remove','goals','restore'].includes(r.kind))return structuredClone(r);
    }catch{}
    return unknown();
  }
  let goalRevision=null;
  let rows=[],generation=0,busy=false;
  let state={date,phase:'idle',view:null,error:null};
  const snapshot=()=>structuredClone({...state,busy,goals,goalRevision,durableGoals:durable,recoveryEnabled,recovery});
  async function selectDate(next){
    diaryView([],next,goals);
    const token=++generation;
    const previous=state.date===next?state.view:null;
    state={date:next,phase:'loading',view:previous,error:null};
    try{
      const outcome=await readRecovery();
      if(token!==generation)return false;
      recovery=outcome;
      const data=structuredClone(await store.list(next));
      const prefs=durable?structuredClone(await store.getGoals()):null;
      if(token!==generation)return false;
      if(data.some(e=>e.local_date!==next))throw new Error('Unexpected storage date');
      if(prefs&&(!Number.isSafeInteger(prefs.revision)||prefs.revision<0))throw Error('Invalid goals revision');
      const view=diaryView(data,next,prefs?prefs.targets:goals);
      if(prefs){goals=prefs.targets;goalRevision=prefs.revision;}
      rows=data;state={date:next,phase:'ready',view,error:null};return true;
    }catch{
      if(token===generation){rows=[];state={date:next,phase:'error',view:previous,error:'READ_FAILED'};}
      return false;
    }
  }
  function current(id,revision){
    const e=rows.find(x=>x.id===id);
    if(!e||e.status==='deleted'||e.revision!==revision)throw new DiaryConflict('Revision conflict or deleted entry');
    return structuredClone(e);
  }
  async function mutate(work){
    if(busy||state.phase!=='ready'||recovery.status!=='none')throw new Error('Diary not ready or busy or recovery pending');
    busy=true;state={...state,error:null};
    try{
      let entry;
      try{entry=await work();}catch(e){if(recoveryEnabled)recovery=await readRecovery();state={...state,error:e?.code==='COMMIT_OUTCOME_UNKNOWN'?'COMMIT_OUTCOME_UNKNOWN':e instanceof DiaryConflict?'CONFLICT':'WRITE_FAILED'};throw e;}
      // The storage promise resolves only after commit. A refresh failure cannot
      // turn a committed write into a failed write (which could cause duplicates).
      const refreshed=await selectDate(state.date);
      return {committed:true,entry:structuredClone(entry),refreshed};
    }finally{busy=false;}
  }
  async function save(form,intent,edit=null){
    const input=structuredClone(form),ref=structuredClone(edit);
    return mutate(async()=>{
      if(input.local_date!==state.date)throw new RangeError('Select the form date first');
      const previous=ref===null?undefined:current(ref.id,ref.revision);
      const c=prepareEntry(input,intent,{id:previous?.id??idFactory(),now:clock(),previous});
      return previous?store.update(c.entry,c.expectedRevision):store.create(c.entry);
    });
  }
  async function remove(id,revision){return mutate(async()=>{current(id,revision);return store.remove(id,revision,clock());});}
  function getEntry(id,revision){
    if(busy||state.phase!=='ready')throw new Error('Diary not ready or busy');
    return current(id,revision);
  }
  async function setGoals(targets,expectedRevision){
    const value=structuredClone(targets);
    return mutate(async()=>{
      if(!durable)throw Error('Durable goals unavailable');
      if(expectedRevision!==goalRevision)throw new DiaryConflict('Goal revision conflict');
      diaryView([],state.date,value);
      return store.setGoals(value,expectedRevision);
    });
  }
  async function restoreBackup(text,approved){
    return mutate(()=>store.restoreBackup(text,approved));
  }
  async function acknowledgeRecovery(sequence,status,approved){
    if(!recoveryEnabled||busy||approved!==true||!['committed','not_applied'].includes(status)||recovery.sequence!==sequence||recovery.status!==status)throw Error('Recovery acknowledgement refused');
    busy=true;
    try{await store.acknowledgeRecovery(sequence,status,true);return await selectDate(state.date);}
    catch(e){recovery=await readRecovery();throw e;}
    finally{busy=false;}
  }
  return {snapshot,selectDate,save,remove,getEntry,setGoals,restoreBackup,acknowledgeRecovery};
}
