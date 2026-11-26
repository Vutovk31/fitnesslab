// Foreground countdowns only; no notifications, persistence or diary writes.
export function createCountdown(now=()=>performance.now(), maxSeconds=14400){
  let state='idle', remaining=0, deadline=0;
  function snapshot(){
    if(state==='running'){
      remaining=Math.max(0,Math.min(remaining,deadline-now()));
      if(remaining===0)state='complete';
    }
    return {state,remainingMs:remaining};
  }
  function start(seconds){
    snapshot();if(state==='running'||state==='paused')return false;
    if(!Number.isSafeInteger(seconds)||seconds<1||seconds>maxSeconds)throw new RangeError('Недопустимая длительность');
    remaining=seconds*1000;deadline=now()+remaining;state='running';return true;
  }
  function pause(){snapshot();if(state!=='running')return false;state='paused';return true;}
  function resume(){if(state!=='paused')return false;deadline=now()+remaining;state='running';return true;}
  function reset(){state='idle';remaining=0;deadline=0;}
  return {snapshot,start,pause,resume,reset};
}
export function mountTimers(doc=globalThis.document,host=globalThis){
  const $=id=>doc.getElementById(id), specs=[['rest',1,3600],['activity',60,14400]];
  const labels={idle:'Не запущен',running:'Идёт отсчёт',paused:'Пауза',complete:'Время вышло'};
  let handle=null, suspended=false;
  const controllers=specs.map(([key,factor,max])=>{
    const timer=createCountdown(()=>host.performance.now(),max),field=$('timer-'+key+'-value'),status=$('timer-'+key+'-status');
    const button=action=>$('timer-'+key+'-'+action);
    function draw(){const s=timer.snapshot(),sec=Math.ceil(s.remainingMs/1000);
      $('timer-'+key+'-display').textContent=String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0');
      const label=labels[s.state]+(s.state==='complete'&&key==='activity'?' — время размяться':'');
      if(status.textContent!==label)status.textContent=label;
      field.disabled=button('start').disabled=['running','paused'].includes(s.state);
      button('pause').disabled=s.state!=='running';button('resume').disabled=s.state!=='paused';button('reset').disabled=s.state==='idle';
      return s.state==='running';
    }
    button('start').addEventListener('click',()=>{try{if(!/^\d+$/.test(field.value.trim()))throw new RangeError('Введите целое положительное число');timer.start(Number(field.value)*factor);sync();}catch(e){status.textContent=e.message;}});
    for(const action of ['pause','resume','reset'])button(action).addEventListener('click',()=>{timer[action]();sync();});
    return {timer,draw};
  });
  function stopPolling(){if(handle!==null){host.clearInterval(handle);handle=null;}}
  function sync(){const active=controllers.map(c=>c.draw()).some(Boolean);if(active&&!suspended){if(handle===null)handle=host.setInterval(sync,250);}else stopPolling();}
  host.addEventListener('pagehide',()=>{suspended=true;stopPolling();});
  host.addEventListener('pageshow',()=>{suspended=false;sync();});
  doc.addEventListener?.('visibilitychange',sync);
  sync();return controllers.map(c=>c.timer);
}
