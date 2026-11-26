// Preview only: no persistence, recognition or network transmission.
export function voiceCapture({media, Recorder, onChange=()=>{}, now=()=>Date.now(), limitMs=120000, maxBytes=16*1024*1024, schedule=setTimeout, cancel=clearTimeout}={}) {
  let state='idle', message='', stream, recorder, timer, started=0, elapsed=0, chunks=[], bytes=0, blob=null, generation=0;
  const supported=!!media?.getUserMedia && typeof Recorder==='function';
  function snapshot(){return {state,message,elapsed:state==='recording'?Math.max(0,now()-started):elapsed,blob,supported};}
  function emit(){onChange(snapshot());}
  function release(){if(timer!==undefined){cancel(timer);timer=undefined;}if(stream){for(const t of stream.getTracks())t.stop();stream=undefined;}}
  function fail(text){generation++;state='error';message=text;blob=null;chunks=[];release();recorder=undefined;emit();}
  async function start(){
    if(!supported){fail('Микрофон или MediaRecorder недоступен.');return;}
    if(['requesting','recording','stopping'].includes(state))return;
    const token=++generation;state='requesting';message='Ожидание разрешения микрофона';blob=null;chunks=[];bytes=0;elapsed=0;emit();
    try{
      const acquired=await media.getUserMedia({audio:true,video:false});
      if(token!==generation){for(const t of acquired.getTracks())t.stop();return;}
      stream=acquired;recorder=new Recorder(stream);const current=recorder;
      current.ondataavailable=e=>{if(token!==generation||!['recording','stopping'].includes(state)||!e.data?.size)return;bytes+=e.data.size;if(bytes>maxBytes){fail('Превышен лимит аудио. Запись не сохранена.');return;}chunks.push(e.data);};
      current.onerror=()=>{if(token===generation)fail('Ошибка записи аудио.');};
      current.onstop=()=>{if(token!==generation||!['recording','stopping'].includes(state))return;if(state==='recording')elapsed=Math.max(0,now()-started);release();const type=current.mimeType||chunks[0]?.type||'';blob=bytes?new Blob(chunks,{type}):null;chunks=[];recorder=undefined;state=blob?'ready':'error';message=blob?'Запись готова. Скачайте её вручную.':'Аудио не получено.';emit();};
      for(const t of stream.getTracks())t.addEventListener?.('ended',()=>{if(token===generation&&state==='recording')stop();});
      current.start(1000);started=now();state='recording';message='Идёт запись';timer=schedule(()=>{if(token===generation)stop();},limitMs);emit();
    }catch(e){if(token===generation)fail(e?.name==='NotAllowedError'?'Доступ к микрофону не разрешён.':'Не удалось начать запись.');}
  }
  function stop(){
    if(state==='requesting'){generation++;state='idle';message='Запрос отменён.';emit();return;}
    if(state!=='recording')return;
    elapsed=Math.max(0,now()-started);state='stopping';message='Завершение записи';const token=generation;emit();
    try{recorder.stop();release();if(state==='stopping')timer=schedule(()=>{if(token===generation&&state==='stopping')fail('Не удалось завершить запись.');},5000);}catch{fail('Не удалось остановить запись.');}
  }
  function discard(){generation++;release();try{if(recorder?.state==='recording')recorder.stop();}catch{}recorder=undefined;blob=null;chunks=[];bytes=0;elapsed=0;state='idle';message='Запись удалена из памяти.';emit();}
  return {start,stop,discard,snapshot};
}
export function mountVoice(doc=globalThis.document, host=globalThis){
  const $=id=>doc.getElementById(id), start=$('voice-start'),stop=$('voice-stop'),clear=$('voice-clear'),audio=$('voice-audio'),download=$('voice-download'),status=$('voice-status'),duration=$('voice-duration');
  let url=null, previous=null;
  function render(s){start.disabled=!s.supported||['requesting','recording','stopping'].includes(s.state);stop.disabled=!['requesting','recording'].includes(s.state);clear.disabled=s.state==='idle';status.textContent=s.message||(!s.supported?'Запись недоступна в этом браузере.':'Нажмите «Записать», чтобы разрешить микрофон.');duration.textContent=Math.floor(s.elapsed/1000)+' сек';
    if(s.blob!==previous){if(url)host.URL.revokeObjectURL(url);previous=s.blob;url=s.blob?host.URL.createObjectURL(s.blob):null;if(url){audio.src=url;download.href=url;const type=s.blob.type;download.download='fit-control-audio.'+(type.includes('mp4')?'m4a':type.includes('ogg')?'ogg':type.includes('webm')?'webm':'bin');}else{audio.removeAttribute('src');download.removeAttribute('href');}audio.hidden=download.hidden=!url;}}
  const capture=voiceCapture({media:host.navigator?.mediaDevices,Recorder:host.MediaRecorder,onChange:render});
  start.addEventListener('click',()=>capture.start());stop.addEventListener('click',()=>capture.stop());clear.addEventListener('click',()=>capture.discard());
  let tick=null;
  function startPolling(){if(tick===null)tick=host.setInterval(()=>render(capture.snapshot()),500);}
  function stopPolling(){if(tick!==null){host.clearInterval(tick);tick=null;}}
  host.addEventListener('pagehide',()=>{capture.discard();stopPolling();});
  host.addEventListener('pageshow',()=>{startPolling();render(capture.snapshot());});
  startPolling();render(capture.snapshot());return capture;
}
