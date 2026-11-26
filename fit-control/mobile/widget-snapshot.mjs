import {dayBalance,keys} from '../dist/nutrition.js';
import {validateEntry} from '../dist/storage.js';

// Minimal display contract, not a storage or native widget permission API.
export const WIDGET_TTL_MS=15*60*1000;
const MAX_ROWS=2000,MAX_BYTES=4096;
const hidden=()=>({version:1,visibility:'hidden'});
const exact=(o,fields)=>o!==null&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).length===fields.length&&fields.every(k=>Object.hasOwn(o,k));
const check=(ok)=>{if(!ok)throw RangeError('Invalid widget snapshot');};
const instant=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString()===s;
const value=(x,positive=false)=>x===null||(typeof x==='number'&&Number.isFinite(x)&&(positive?x>0:x>=0));
function localDate(now,zone){
  check(instant(now)&&typeof zone==='string'&&zone.length<=100&&zone.length>0&&!/^[+-]/.test(zone));
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:zone,calendar:'gregory',numberingSystem:'latn',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(now));
  const get=k=>parts.find(p=>p.type===k)?.value;
  const date=get('year').padStart(4,'0')+'-'+get('month')+'-'+get('day');
  dayBalance([],date,null);return date;
}
function validateVisible(s){
  check(exact(s,['version','visibility','date','timezone','generated_at','has_confirmed','nutrients'])&&s.version===1&&s.visibility==='summary'&&typeof s.has_confirmed==='boolean');
  check(s.date===localDate(s.generated_at,s.timezone)&&exact(s.nutrients,keys));
  for(const k of keys){const n=s.nutrients[k];check(exact(n,['confirmed','target','remaining'])&&value(n.confirmed)&&value(n.target,true));
    check(n.remaining===(n.confirmed===null||n.target===null?null:n.target-n.confirmed));
    if(!s.has_confirmed)check(n.confirmed===0);
  }
  check(new TextEncoder().encode(JSON.stringify(s)).length<=MAX_BYTES);
}
export function createWidgetSnapshot({enabled=false,entries,date,timezone,now,targets}={}){
  if(enabled!==true)return hidden();
  check(Array.isArray(entries)&&entries.length<=MAX_ROWS&&date===localDate(now,timezone)&&exact(targets,keys)&&keys.every(k=>value(targets[k],true)));
  entries.forEach(validateEntry);
  const balance=dayBalance(entries,date,targets.kcal);
  const nutrients=Object.fromEntries(keys.map(k=>{const confirmed=balance.confirmed[k].total,target=targets[k];return [k,{confirmed,target,remaining:confirmed===null||target===null?null:target-confirmed}];}));
  const result={version:1,visibility:'summary',date,timezone,generated_at:now,has_confirmed:balance.confirmedCount>0,nutrients};
  validateVisible(result);return result;
}
// Consumer must independently check current privacy setting, date and clock on each render.
// Hidden/stale/unavailable responses contain no nutrition values or previous snapshot.
export function readWidgetSnapshot(snapshot,{enabled=false,now,timezone}={}){
  if(enabled!==true)return {state:'hidden'};
  try{
    if(exact(snapshot,['version','visibility'])&&snapshot.version===1&&snapshot.visibility==='hidden')return {state:'hidden'};
    validateVisible(snapshot);
    const today=localDate(now,timezone),age=Date.parse(now)-Date.parse(snapshot.generated_at);
    if(age<0)return {state:'unavailable'};
    if(snapshot.timezone!==timezone||snapshot.date!==today||age>=WIDGET_TTL_MS)return {state:'stale'};
    return {state:'ready',snapshot:structuredClone(snapshot)};
  }catch{return {state:'unavailable'};}
}
