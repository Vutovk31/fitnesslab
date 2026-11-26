import {test} from 'node:test';
import assert from 'node:assert/strict';
import {offlineRecognition} from '../mobile/offline-recognition.mjs';
import {transcriptForm} from '../preview/transcript.mjs';
const cap={available:true,offline:true,locale:'ru-RU'};
const result={text:'Тестовая каша; 150 г',locale:'ru-RU',offline:true,final:true};
const deferred=()=>{let resolve;const promise=new Promise(r=>{resolve=r;});return {promise,resolve};};
function fixture(patch={}){
  const calls=[];let expire,clears=0;
  const provider={synthetic:true,async check(r){calls.push(['check',r]);return cap;},async recognize(r){calls.push(['recognize',r]);return result;},...patch};
  const app=offlineRecognition({provider,schedule:(fn,ms)=>{assert.equal(ms,120000);expire=fn;return 1;},unschedule:id=>{assert.equal(id,1);clears++;}});app.setForeground(true);
  return {app,calls,expire:()=>expire(),clears:()=>clears};
}
test('no implicit recognition; strict consent and explicit single-use review handoff',async()=>{
  const f=fixture();assert.equal(await f.app.start('true'),false);assert.equal(f.calls.length,0);assert.equal(await f.app.start(true),true);
  assert.deepEqual(f.calls.map(([k])=>k),['check','recognize']);for(const [,r] of f.calls){assert.equal(r.offlineOnly,true);assert.equal(r.locale,'ru-RU');assert.equal(r.signal.aborted,false);}
  assert.equal(f.app.snapshot().phase,'review');assert.equal(f.app.accept(false),null);assert.equal(f.app.accept(true),result.text);assert.equal(f.app.accept(true),null);assert.equal(f.app.snapshot().text,null);
  const form=transcriptForm(result.text,1,'2026-01-01','UTC');assert.equal(form.amount,'150');assert.equal(form.kcal,'');assert.equal(f.clears(),1);
});
test('unknown or online capability blocks recognition with no fallback',async()=>{
  for(const value of [null,{...cap,offline:false},{...cap,available:false},{...cap,locale:'en-US'},{...cap,extra:true}]){
    let runs=0;const f=fixture({check:async()=>value,recognize:async()=>{runs++;return result;}});assert.equal(await f.app.start(true),false);assert.equal(f.app.snapshot().error,'OFFLINE_UNAVAILABLE');assert.equal(runs,0);assert.equal(f.app.accept(true),null);
  }
  const f=fixture({synthetic:false});assert.equal(await f.app.start(true),false);assert.equal(f.calls.length,0);
});
test('reject nonfinal, online, wrong-language, malformed and oversized results',async()=>{
  for(const value of [null,{...result,final:false},{...result,offline:false},{...result,locale:'en-US'},{...result,text:' '},{...result,text:'x'.repeat(8001)},{...result,text:'a\u0000b'},{...result,extra:42}]){
    const f=fixture({recognize:async()=>value});assert.equal(await f.app.start(true),false);assert.equal(f.app.snapshot().error,'INVALID_RESULT');assert.equal(f.app.accept(true),null);
  }
});
test('background cancels capability check and blocks repeat until old request settles',async()=>{
  const gate=deferred();let signal,runs=0;const f=fixture({check:r=>{signal=r.signal;return gate.promise;},recognize:async()=>{runs++;return result;}});
  const p=f.app.start(true);f.app.setForeground(false);assert.equal(signal.aborted,true);f.app.setForeground(true);assert.equal(await f.app.start(true),false);gate.resolve(cap);assert.equal(await p,false);assert.equal(runs,0);assert.equal(f.app.snapshot().text,null);
});
test('timeout aborts active recognition, late response is ignored, no retry before settlement',async()=>{
  const gate=deferred(),started=deferred();let signal;const f=fixture({recognize:r=>{signal=r.signal;started.resolve();return gate.promise;}});const p=f.app.start(true);await started.promise;f.expire();assert.equal(signal.aborted,true);assert.equal(f.app.snapshot().error,'TIMEOUT');assert.equal(await f.app.start(true),false);gate.resolve(result);assert.equal(await p,false);assert.equal(f.app.accept(true),null);assert.equal(f.app.snapshot().error,'TIMEOUT');assert.equal(f.app.snapshot().inFlight,false);
});
test('cancel, background, dispose invalidate reviewed text; provider errors sanitized',async()=>{
  for(const invalidate of [a=>a.cancel(),a=>a.setForeground(false),a=>a.dispose()]){const f=fixture();await f.app.start(true);invalidate(f.app);assert.equal(f.app.accept(true),null);assert.equal(f.app.snapshot().text,null);}
  const f=fixture({recognize:async()=>{throw Error('private path or transcript');}});assert.equal(await f.app.start(true),false);assert.equal(f.app.snapshot().error,'RECOGNITION_FAILED');assert.equal(f.app.snapshot().text,null);
});
