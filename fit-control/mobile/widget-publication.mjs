import {createWidgetSnapshot,readWidgetSnapshot} from './widget-snapshot.mjs';
// Synthetic contract only. Transport replace(text) must be synchronous, atomic,
// and return true only after replacement. No native port is registered.
export function widgetPublication({source,transport,clock}={}){
  const supported=source?.synthetic===true&&transport?.synthetic===true&&typeof source.readDay==='function'&&typeof transport.replace==='function'&&typeof clock==='function';
  let enabled=false,epoch=0,busy=false,mutations=0,published=null;
  function replace(snapshot){try{const text=JSON.stringify(snapshot);return new TextEncoder().encode(text).length<=4096&&transport.replace(text)===true;}catch{return false;}}
  function invalidate(){epoch++;published=null;if(!supported)return false;const ok=replace(createWidgetSnapshot());if(!ok)enabled=false;return ok;}
  function consent(approved=false){enabled=false;const ok=invalidate();enabled=ok&&approved===true;return ok;}
  function read(){if(!enabled)return {state:'hidden'};if(!published)return {state:'unavailable'};try{return readWidgetSnapshot(published,{...clock(),enabled:true});}catch{return {state:'unavailable'};}}
  function observe(){const result=read();if(published&&result.state!=='ready')invalidate();return result;}
  async function refresh(){
    if(!supported||!enabled||busy||mutations)return false;
    if(!invalidate())return false;const token=epoch;busy=true;
    try{
      const before=clock(),date=before.date;
      const data=await source.readDay(date);
      if(token!==epoch||!enabled)return false;
      if(data?.complete!==true||data.date!==date||!Array.isArray(data.entries)||data.entries.some(e=>e.local_date!==date))return false;
      const snapshot=createWidgetSnapshot({enabled:true,entries:data.entries,targets:data.targets,date,timezone:before.timezone,now:before.now});
      const after=clock();if(after.date!==date||readWidgetSnapshot(snapshot,{...after,enabled:true}).state!=='ready')return false;
      if(!replace(snapshot)){invalidate();enabled=false;return false;}
      published=snapshot;return true;
    }catch{return false;}finally{busy=false;}
  }
  // Caller must route every mutation through this guard before any storage action.
  // A failed widget transport never prevents a diary mutation.
  async function duringMutation(work){mutations++;invalidate();try{return await work();}finally{mutations--;}}
  return {consent,invalidate,refresh,read,observe,duringMutation};
}
