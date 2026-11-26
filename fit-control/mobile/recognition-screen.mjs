import {offlineRecognition} from './offline-recognition.mjs';
import {audioLease} from './audio-lease.mjs';
// Mock provider only. The UI cannot establish that a real provider is offline.
export function mountRecognitionScreen(doc,{port,approve,onAccept,lease=audioLease()}){
  const $=id=>doc.getElementById(id),start=$('recognition-start'),cancel=$('recognition-cancel'),accept=$('recognition-accept'),status=$('recognition-status'),result=$('recognition-result');
  const owner=Symbol('recognition');let allowed=false,closed=false,foreground=false,unsubscribe,unlease;
  const supported=port?.synthetic===true&&port.provider?.synthetic===true&&typeof port.isForeground==='function'&&typeof port.subscribe==='function';
  const engine=offlineRecognition({provider:supported?port.provider:undefined,schedule:(fn,ms)=>setTimeout(()=>{fn();render();},ms)});
  function inForeground(){try{return supported&&port.isForeground()===true;}catch{return false;}}
  function active(){return !closed&&allowed&&foreground&&inForeground();}
  function paint(){const s=engine.snapshot(),enabled=active()&&s.supported;
    start.disabled=!enabled||s.inFlight||s.phase==='review'||!lease.available();
    cancel.disabled=!enabled||(!s.inFlight&&s.phase==='idle');accept.disabled=!enabled||s.inFlight||s.phase!=='review';
    result.textContent=enabled&&s.phase==='review'?s.text:'';
    status.textContent=!s.supported?'Тестовый поставщик распознавания не подключён.':!enabled?'Распознавание недоступно.':s.inFlight?(s.error==='TIMEOUT'?'Время истекло. Ожидание завершения запроса.':'Ожидание завершения запроса.'):{idle:'Готово к тесту.',review:'Проверьте текст перед переносом.',error:'Локальное распознавание недоступно или завершилось ошибкой.'}[s.phase]??'Подготовка…';
  }
  function render(){const s=engine.snapshot();if(!s.inFlight&&s.phase!=='review')lease.release(owner);paint();}
  function sync(value){allowed=value===true;foreground=inForeground();engine.setForeground(active());render();}
  unlease=lease.subscribe(paint);
  if(supported){try{unsubscribe=port.subscribe(value=>{foreground=value===true&&inForeground();engine.setForeground(active());render();});if(typeof unsubscribe!=='function')throw Error('Invalid subscription');}catch{closed=true;engine.dispose();}}
  start.addEventListener('click',async()=>{if(!active()||start.disabled||approve('Запустить тестовое локальное распознавание без отправки аудио?')!==true||!active()||!lease.claim(owner))return;
    try{const work=engine.start(true);render();await work;}finally{render();}});
  cancel.addEventListener('click',()=>{if(!active())return;engine.cancel();render();});
  accept.addEventListener('click',()=>{if(!active()||accept.disabled||approve('Перенести проверенный текст в поле расшифровки? Текущий текст будет заменён; дневник не изменится.')!==true||!active())return;
    const text=engine.accept(true);if(text!==null)onAccept(text);render();});
  function dispose(){if(closed)return;closed=true;engine.dispose();try{unsubscribe?.();}catch{}unlease?.();render();}
  render();return {sync,dispose};
}
