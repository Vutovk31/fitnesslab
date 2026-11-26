import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
// All four compiled scripts in one mocked page. No browser or physical media claims.
const html=readFileSync(process.argv[2],'utf8');
const scripts=[...html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)].map(m=>m[1]);
assert.equal(scripts.length,4);
class E {
  constructor(tag='div'){this.tag=tag;this.children=[];this.handlers={};this.dataset={};this.attrs={};this.value='';this.hidden=false;this.textContent='';}
  append(...children){this.children.push(...children);} replaceChildren(){this.children=[];}
  setAttribute(k,v){this.attrs[k]=v;} removeAttribute(k){delete this[k];delete this.attrs[k];}
  addEventListener(k,fn){this.handlers[k]=fn;} focus(){} select(){}
  fire(k,event={}){return this.handlers[k]?.({preventDefault(){},...event});}
}
const ids=[...html.matchAll(/\bid="([\w-]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length);
const nodes=new Map(ids.map(id=>[id,new E()]));
const get=id=>{assert.ok(nodes.has(id),'Missing HTML element: '+id);return nodes.get(id);};
const fields=Object.fromEntries('name meal_type preparation amount unit basis_amount basis_unit kcal protein_g fat_g carbs_g source_kind source_reference'.split(' ').map(k=>[k,new E('input')]));
get('editor').elements={namedItem:k=>fields[k]??null};
const modes=['confirmed','planned','forecast'].map(mode=>{const b=new E('button');b.dataset.mode=mode;return b;});
const events=new Map();
const on=(k,fn)=>events.set(k,[...(events.get(k)??[]),fn]);
globalThis.document={getElementById:get,createElement:t=>new E(t),querySelectorAll:()=>modes,addEventListener:on};
globalThis.FormData=class{*[Symbol.iterator](){for(const [k,v] of Object.entries(fields))yield [k,v.value];}};
globalThis.confirm=()=>true;globalThis.addEventListener=on;
let time=0,seq=0,requests=0,stops=0;const intervals=new Map();
Object.defineProperty(globalThis,'performance',{configurable:true,value:{now:()=>time}});
globalThis.setInterval=fn=>{intervals.set(++seq,fn);return seq;};globalThis.clearInterval=id=>intervals.delete(id);
Object.defineProperty(globalThis,'navigator',{configurable:true,value:{mediaDevices:{async getUserMedia(){requests++;return {getTracks:()=>[{stop(){stops++;}}]};}}}});
globalThis.MediaRecorder=class{constructor(){this.mimeType='audio/webm';this.state='inactive';}start(){this.state='recording';}stop(){this.state='inactive';this.ondataavailable({data:new Blob(['fixture'],{type:this.mimeType})});this.onstop();}};
for(const script of scripts)await import('data:text/javascript;base64,'+Buffer.from(script).toString('base64'));
const energy=()=>get('energy').textContent.replace(/\s/g,'');
assert.equal(energy(),'378');assert.equal(requests,0);assert.equal(intervals.size,1);
await get('voice-start').fire('click');assert.equal(requests,1);get('voice-stop').fire('click');assert.equal(stops,1);assert.equal(get('voice-download').hidden,false);
get('training-name').value='Synthetic exercise';get('training-sets').value='3';get('training-reps').value='10';get('training-load').value='0';get('training-add').fire('click');get('training-export').fire('click');assert.match(get('training-text').value,/"total_repetitions": 30/);
get('timer-rest-value').value='1';get('timer-rest-start').fire('click');assert.equal(intervals.size,2);time=2000;for(const fn of [...intervals.values()])fn();assert.equal(get('timer-rest-status').textContent,'Время вышло');assert.equal(intervals.size,1);
assert.equal(energy(),'378');modes[1].fire('click');assert.equal(energy(),'330');assert.match(get('training-text').value,/"total_repetitions": 30/);
for(const fn of events.get('pagehide')??[])fn();assert.equal(intervals.size,0);assert.equal(get('voice-download').hidden,true);assert.equal(stops,1);
console.log('PARTIAL_DOM_ONLY: all four compiled modules coexist; mocked audio, training, timer, nutrition and cleanup PASS');
