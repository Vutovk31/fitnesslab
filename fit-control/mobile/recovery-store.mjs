// Native path: every mutation reserves a journal sequence before changing data.
// The outcome is retained until explicit acknowledgement, including normal success.
export function trackedDiaryStore(store){
  for(const name of ['list','getGoals','exportBackup','prepareOperation','getRecovery','acknowledgeRecovery','create','update','remove','setGoals','restoreBackup'])if(typeof store?.[name]!=='function')throw new TypeError('Incomplete recovery store');
  async function tracked(kind,method,args){
    const sequence=await store.prepareOperation(kind);
    try{return await store[method](...args,sequence);}
    catch(e){
      let state;try{state=await store.getRecovery();}catch{}
      if(state?.sequence===sequence&&state.status==='not_applied')throw e;
      throw Object.assign(Error('Operation outcome requires reconciliation'),{code:'COMMIT_OUTCOME_UNKNOWN'});
    }
  }
  return {
    ...(typeof store.findNutrition==='function'&&typeof store.selectNutrition==='function'?{findNutrition:query=>store.findNutrition(query),selectNutrition:(form,key,approved)=>store.selectNutrition(form,key,approved)}:{}),
    list:date=>store.list(date),getGoals:()=>store.getGoals(),exportBackup:version=>store.exportBackup(version),
    getRecovery:()=>store.getRecovery(),acknowledgeRecovery:(sequence,status,approved)=>store.acknowledgeRecovery(sequence,status,approved),
    create:entry=>tracked('create','create',[entry]),update:(entry,revision)=>tracked('update','update',[entry,revision]),
    remove:(id,revision,now)=>tracked('remove','remove',[id,revision,now]),setGoals:(targets,revision)=>tracked('goals','setGoals',[targets,revision]),
    restoreBackup:(text,approved)=>tracked('restore','restoreBackup',[text,approved])
  };
}
