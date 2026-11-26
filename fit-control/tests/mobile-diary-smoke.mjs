import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
// Structural checks and mocked DOM interaction only, not actual mobile/browser E2E.
const html=readFileSync(process.argv[2],'utf8');
const scripts=[...html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)].map(m=>m[1]);
assert.equal(scripts.length,4);
const markup=html.split('<script type="module">')[0];
const ids=[...markup.matchAll(/\bid="([\w-]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length);
for(const [,id] of markup.matchAll(/href="#([\w-]+)"/g))assert.ok(ids.includes(id),'Missing anchor '+id);
assert.ok(markup.indexOf('id="diary-heading"')<markup.indexOf('id="voice-heading"'));
assert.match(markup,/viewport-fit=cover/);assert.match(markup,/env\(safe-area-inset-bottom\)/);assert.match(markup,/min-height:48px/);
class E{
 constructor(tag='div'){this.tag=tag;this.children=[];this.handlers={};this.dataset={};this.attrs={};this.value='';this.hidden=false;this.textContent='';this.className='';}
 append(...children){this.children.push(...children);} replaceChildren(){this.children=[];}
 setAttribute(k,v){this.attrs[k]=v;} addEventListener(k,fn){this.handlers[k]=fn;} focus(){globalThis.focused=this;}
 fire(k,event={}){return this.handlers[k]?.({preventDefault(){},...event});}
}
const nodes=new Map(ids.map(id=>[id,new E()]));const get=id=>{assert.ok(nodes.has(id),'Missing HTML element '+id);return nodes.get(id);};
const fields=Object.fromEntries('name meal_type preparation amount unit basis_amount basis_unit kcal protein_g fat_g carbs_g source_kind source_reference'.split(' ').map(k=>[k,new E('input')]));
const form=get('editor');form.elements={namedItem:k=>fields[k]??null};
const modes=['confirmed','planned','forecast'].map(mode=>{const b=new E('button');b.dataset.mode=mode;return b;});
globalThis.document={getElementById:get,createElement:t=>new E(t),querySelectorAll:()=>modes};
globalThis.FormData=class{*[Symbol.iterator](){for(const [k,v] of Object.entries(fields))yield [k,v.value];}};
let approved=true;globalThis.confirm=()=>approved;
await import('data:text/javascript;base64,'+Buffer.from(scripts[0]).toString('base64'));
const energy=()=>get('energy').textContent.replace(/\s/g,'');
const submit=value=>form.fire('submit',{submitter:{value}});
function input(name,amount='150',kcal='120'){get('add').fire('click');assert.equal(globalThis.focused,fields.name);Object.assign(fields.name,{value:name});fields.amount.value=amount;fields.kcal.value=kcal;fields.protein_g.value='10';fields.fat_g.value='4';fields.carbs_g.value='8';form.fire('input');}
function walk(e){return [e,...e.children.flatMap(walk)];}
function action(name,button){const row=walk(get('groups')).find(e=>e.className==='entry'&&e.children[0]?.children[0]?.textContent===name);assert.ok(row,'Missing row '+name);const b=walk(row).find(e=>e.tag==='button'&&e.textContent===button);assert.ok(b,'Missing action '+button);b.fire('click');}
assert.equal(energy(),'378');
input('Synthetic actual');submit('confirm');assert.equal(energy(),'558');
action('Synthetic actual','Изменить');assert.equal(fields.amount.value,'150');fields.amount.value='200';submit('edit');assert.equal(energy(),'618');
input('Synthetic planned','50');submit('plan');assert.equal(energy(),'618');modes[1].fire('click');assert.equal(energy(),'390');
action('Synthetic planned','Съедено');assert.equal(energy(),'330');modes[0].fire('click');assert.equal(energy(),'678');
input('Synthetic invalid','-10');submit('confirm');assert.ok(get('error').textContent);assert.equal(energy(),'678');
input('Synthetic draft','');submit('save-draft');assert.match(get('counts').textContent,/черновики: 1/);assert.equal(energy(),'678');
input('Synthetic unknown','10','');submit('confirm');assert.match(energy(),/неизвестно/);action('Synthetic unknown','Удалить');assert.equal(energy(),'678');
approved=false;action('Synthetic actual','Удалить');assert.equal(energy(),'678');approved=true;action('Synthetic actual','Удалить');assert.equal(energy(),'438');
action('Synthetic planned','Удалить');assert.equal(energy(),'378');
get('day').value='2026-01-01';get('day').fire('change');assert.equal(energy(),'0');
console.log('PASS: mobile markup anchors/order; mocked add/edit/plan/confirm/invalid/draft/unknown/delete/date flows. Native/browser layout NOT_RUN.');
