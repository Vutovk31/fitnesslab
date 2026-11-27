import {test} from 'node:test';
import assert from 'node:assert/strict';
import {prepareEntry} from '../dist/diary-editor.js';
import {readWidgetSnapshot} from '../mobile/widget-snapshot.mjs';
import {widgetPublication} from '../mobile/widget-publication.mjs';
import {widgetPresentation,resolveWidgetLink} from '../mobile/widget-consumer.mjs';
const date='2026-01-01',now=date+'T10:00:00.000Z',timezone='UTC';
const targets={kcal:2000,protein_g:150,fat_g:70,carbs_g:200};
const nav={authenticated:true,unlocked:true,ready:true,recoveryIdle:true,editorClean:true};
const row=(id,intent='confirm')=>prepareEntry({name:'Synthetic fixture',local_date:date,timezone,meal_type:'breakfast',preparation:'cooked',amount:'200',unit:'g',basis_amount:'100',basis_unit:'g',kcal:'120',protein_g:'',fat_g:'0',carbs_g:'20',source_kind:'estimate'},intent,{id,now}).entry;
const entries=[row('00000000-0000-4000-8000-000000000001'),row('00000000-0000-4000-8000-000000000002','plan')];
function fixture(readDay=async()=>({complete:true,date,entries:structuredClone(entries),targets})){
  let current={date,now,timezone},payload='',fail=false;
  const controller=widgetPublication({source:{synthetic:true,readDay},transport:{synthetic:true,replace(text){if(fail)return false;payload=text;return true;}},clock:()=>({...current})});
  return {controller,payload:()=>payload,fail:v=>fail=v,time:v=>current={...current,...v},render:(enabled=true,extra={})=>widgetPresentation(payload,{...current,enabled,unlocked:true,surface:'home',...extra},readWidgetSnapshot)};
}
test('canonical domain to publication to consumer: confirmed-only values and safe routes',async()=>{
  const f=fixture();assert.equal(f.render(false).state,'hidden');assert.equal(f.controller.consent(true),true);assert.equal(await f.controller.refresh(),true);
  const rendered=f.render();assert.equal(rendered.state,'ready');assert.deepEqual(rendered.nutrients.map(n=>[n.confirmed,n.target,n.remaining]),[[240,2000,1760],[null,150,null],[0,70,70],[40,200,160]]);
  assert.doesNotMatch(f.payload(),/Synthetic fixture|00000000|source|entries/);assert.deepEqual(resolveWidgetLink(rendered.addLink,nav),{state:'navigate',route:'add-food'});assert.equal(resolveWidgetLink(rendered.addLink+'?amount=200',nav).state,'rejected');assert.equal(resolveWidgetLink(rendered.addLink,{...nav,editorClean:false}).state,'blocked');
});
test('canonical render hides lock surface, revoked consent and stale snapshot',async()=>{
  const f=fixture();f.controller.consent(true);await f.controller.refresh();assert.equal(f.render(true,{surface:'lock'}).state,'hidden');f.time({now:date+'T10:15:00.000Z'});assert.equal(f.render().state,'stale');assert.equal('nutrients' in f.render(),false);f.controller.observe();assert.equal(f.render().state,'hidden');f.controller.consent(false);assert.deepEqual(f.render(false),{state:'hidden',link:'fitcontrol://widget/diary'});
});
test('late canonical read cannot publish after consent revocation',async()=>{
  let release;const f=fixture(()=>new Promise(r=>release=r));f.controller.consent(true);const pending=f.controller.refresh();f.controller.consent(false);release({complete:true,date,entries,targets});assert.equal(await pending,false);assert.equal(f.render(false).state,'hidden');assert.equal(JSON.parse(f.payload()).visibility,'hidden');
});
test('failed transport revocation requires independent current consent; cached snapshot is not erased',async()=>{
  const f=fixture();f.controller.consent(true);await f.controller.refresh();f.fail(true);assert.equal(f.controller.consent(false),false);assert.equal(f.render(false).state,'hidden');assert.equal(JSON.parse(f.payload()).visibility,'summary');assert.equal(f.render(true).state,'ready');
});
test('canonical validator rejects tampered snapshot and unsupported schema',async()=>{
  const f=fixture();f.controller.consent(true);await f.controller.refresh();const context={enabled:true,unlocked:true,surface:'home',now,timezone};const snapshot=JSON.parse(f.payload());for(const bad of [{...snapshot,version:2},{...snapshot,secret:'synthetic'},{...snapshot,nutrients:{...snapshot.nutrients,kcal:{confirmed:240,target:2000,remaining:0}}}])assert.deepEqual(widgetPresentation(JSON.stringify(bad),context,readWidgetSnapshot),{state:'unavailable',link:'fitcontrol://widget/diary'});
});
