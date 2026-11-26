import {Capacitor} from '@capacitor/core';
import {CapacitorSQLite,SQLiteConnection} from '@capacitor-community/sqlite';
import {startNativeDiary} from './native-bootstrap.mjs';
const now=new Date();
const date=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
const status=document.getElementById('connection-status');
if(typeof globalThis.structuredClone!=='function'||typeof globalThis.crypto?.randomUUID!=='function'||typeof Object.hasOwn!=='function'){
  status.textContent='Среда не поддерживает обязательные функции. Запуск заблокирован.';
}else{
  startNativeDiary({capacitor:Capacitor,makeManager:()=>new SQLiteConnection(CapacitorSQLite),doc:document,privacyMode:__FIT_CONTROL_PRIVACY_MODE__,config:{date,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC',targets:{kcal:null,protein_g:null,fat_g:null,carbs_g:null},idFactory:()=>crypto.randomUUID(),clock:()=>new Date().toISOString(),approve:message=>window.confirm(message)}}).catch(()=>{document.getElementById('main-content').setAttribute('inert','');status.textContent='Запуск заблокирован.';});
}
