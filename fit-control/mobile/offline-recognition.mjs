// Synthetic-only provider contract. Never grants native permission or proves offline behavior.
const LOCALE='ru-RU', LIMIT=8000, TIMEOUT=120000;
const exact=(o,keys)=>o!==null&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).length===keys.length&&keys.every(k=>Object.hasOwn(o,k));
export function offlineRecognition({provider,schedule=setTimeout,unschedule=clearTimeout}={}){
  const supported=provider?.synthetic===true&&typeof provider.check==='function'&&typeof provider.recognize==='function';
  let foreground=false,disposed=false,inFlight=false,generation=0,controller,timer;
  let state={phase:'idle',text:null,error:null};
  const snapshot=()=>({...state,supported,foreground,inFlight,disposed});
  function clearTimer(){if(timer!==undefined){unschedule(timer);timer=undefined;}}
  function invalidate(error=null){generation++;clearTimer();controller?.abort();state={phase:error?'error':'idle',text:null,error};}
  function setForeground(value){if(disposed)return;foreground=value===true;if(!foreground)invalidate();}
  function cancel(){if(!disposed)invalidate();}
  function dispose(){if(disposed)return;disposed=true;foreground=false;invalidate();}
  async function start(approved=false){
    if(disposed||!foreground||!supported||inFlight||approved!==true)return false;
    const token=++generation;inFlight=true;controller=new AbortController();
    const request=Object.freeze({locale:LOCALE,offlineOnly:true,signal:controller.signal});
    state={phase:'checking',text:null,error:null};
    const current=()=>token===generation&&!disposed&&foreground;
    try{
      timer=schedule(()=>{if(current())invalidate('TIMEOUT');},TIMEOUT);
      const cap=await provider.check(request);
      if(!current())return false;
      if(!exact(cap,['available','offline','locale'])||cap.available!==true||cap.offline!==true||cap.locale!==LOCALE){state={phase:'error',text:null,error:'OFFLINE_UNAVAILABLE'};return false;}
      state={phase:'recognizing',text:null,error:null};
      const result=await provider.recognize(request);
      if(!current())return false;
      if(!exact(result,['text','locale','offline','final'])||result.locale!==LOCALE||result.offline!==true||result.final!==true||typeof result.text!=='string'||result.text.length>LIMIT||!result.text.trim()||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(result.text)){
        state={phase:'error',text:null,error:'INVALID_RESULT'};return false;
      }
      state={phase:'review',text:result.text,error:null};return true;
    }catch{if(current())state={phase:'error',text:null,error:'RECOGNITION_FAILED'};return false;}
    finally{clearTimer();controller=undefined;inFlight=false;}
  }
  // Only a separately confirmed review can release text into a manual editor.
  // No parsing, nutrition lookup, persistence, or audio exposure in this module.
  function accept(approved=false){
    if(disposed||!foreground||inFlight||state.phase!=='review'||approved!==true)return null;
    const text=state.text;invalidate();return text;
  }
  return {snapshot,setForeground,start,cancel,accept,dispose};
}
