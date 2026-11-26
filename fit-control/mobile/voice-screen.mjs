import {audioLease} from './audio-lease.mjs';
import {voiceCapture} from '../preview/voice.mjs';
// Injected test-only media/lifecycle port. No raw audio leaves the capture engine.
export function mountCaptureScreen(doc,{port,approve,lease=audioLease()}){
  const $=id=>doc.getElementById(id),start=$('capture-start'),stop=$('capture-stop'),clear=$('capture-clear'),status=$('capture-status');
  const owner=Symbol('capture');
  let allowed=false,closed=false,foreground=false,unsubscribe,requestInFlight=false;
  const supported=port?.synthetic===true&&typeof port.media?.getUserMedia==='function'&&typeof port.Recorder==='function'&&typeof port.isForeground==='function'&&typeof port.subscribe==='function';
  function paint(s){
    const enabled=supported&&!closed&&foreground&&allowed;
    start.disabled=!enabled||!lease.available()||requestInFlight||['requesting','recording','stopping'].includes(s.state);
    stop.disabled=!enabled||!['requesting','recording'].includes(s.state);
    clear.disabled=!enabled||s.state==='idle';
    status.textContent=!supported?'Тестовый адаптер записи не подключён.':!enabled?'Запись недоступна.':s.state==='ready'?'Тестовая запись в памяти: '+s.blob.size+' байт. Распознавание не подключено.':s.message||'Начните тестовую запись.';
  }
  function render(s){if(!requestInFlight&&!['requesting','recording','stopping'].includes(s.state))lease.release(owner);paint(s);}
  const capture=voiceCapture({media:supported?port.media:undefined,Recorder:supported?port.Recorder:undefined,onChange:render});
  const unlease=lease.subscribe(()=>paint(capture.snapshot()));
  function inForeground(){try{return supported&&port.isForeground()===true;}catch{return false;}}
  function sync(value){allowed=value===true;foreground=inForeground();if(!allowed||!foreground){if(capture.snapshot().state!=='idle')capture.discard();}render(capture.snapshot());}
  function active(){return !closed&&allowed&&foreground&&inForeground();}
  if(supported){try{unsubscribe=port.subscribe(value=>{foreground=value===true&&inForeground();if(!foreground)capture.discard();render(capture.snapshot());});if(typeof unsubscribe!=='function')throw Error('Invalid subscription');}catch{closed=true;}}
  start.addEventListener('click',async()=>{if(!active()||start.disabled)return;if(approve('Начать тестовую запись? Аудио останется только в памяти, без отправки и распознавания.')!==true)return;if(!active()||!lease.claim(owner))return;requestInFlight=true;render(capture.snapshot());try{await capture.start();}finally{requestInFlight=false;render(capture.snapshot());}});
  stop.addEventListener('click',()=>{if(active())capture.stop();});
  clear.addEventListener('click',()=>{if(active())capture.discard();});
  function dispose(){if(closed)return;closed=true;capture.discard();try{unsubscribe?.();}catch{}finally{unlease();render(capture.snapshot());}}
  render(capture.snapshot());return {sync,dispose};
}
