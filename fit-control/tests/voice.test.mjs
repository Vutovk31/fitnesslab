import {test} from 'node:test';
import assert from 'node:assert/strict';
import {voiceCapture} from '../preview/voice.mjs';
function setup(extra={}){
  let requests=0,stops=0,instance,now=0,scheduled;
  const track={stop(){stops++;}},stream={getTracks:()=>[track]};
  class Recorder{constructor(){instance=this;this.state='inactive';this.mimeType='audio/webm';}start(){this.state='recording';}stop(){this.state='inactive';this.onstop?.();}data(s='abc'){this.ondataavailable?.({data:new Blob([s],{type:this.mimeType})});}}
  const c=voiceCapture({media:{async getUserMedia(){requests++;return stream;}},Recorder,now:()=>now,schedule:fn=>{scheduled=fn;return 1;},cancel:()=>{},...extra});
  return {c,stream,counts:()=>[requests,stops],rec:()=>instance,advance:n=>now=n,timeout:()=>scheduled()};
}
test('no implicit capture; explicit start and stop returns blob',async()=>{const a=setup();assert.deepEqual(a.counts(),[0,0]);await a.c.start();assert.equal(a.c.snapshot().state,'recording');a.rec().data();a.advance(1400);a.c.stop();assert.equal(a.c.snapshot().state,'ready');assert.equal(a.c.snapshot().elapsed,1400);assert.equal(await a.c.snapshot().blob.text(),'abc');assert.deepEqual(a.counts(),[1,1]);});
test('unsupported is explicit',async()=>{const c=voiceCapture({});await c.start();assert.equal(c.snapshot().state,'error');assert.equal(c.snapshot().supported,false);});
test('permission denial',async()=>{const a=setup({media:{async getUserMedia(){throw Object.assign(new Error(),{name:'NotAllowedError'});}}});await a.c.start();assert.match(a.c.snapshot().message,/не разрешён/);});
test('cancel pending request releases late stream',async()=>{let resolve;const a=setup({media:{getUserMedia:()=>new Promise(r=>resolve=r)}});const p=a.c.start();a.c.stop();resolve(a.stream);await p;assert.equal(a.c.snapshot().state,'idle');assert.equal(a.counts()[1],1);});
test('repeated start does not open second microphone',async()=>{const a=setup();await a.c.start();await a.c.start();assert.equal(a.counts()[0],1);a.c.discard();assert.equal(a.counts()[1],1);});
test('duration limit stops and releases',async()=>{const a=setup();await a.c.start();a.rec().data();a.advance(120000);a.timeout();assert.equal(a.c.snapshot().state,'ready');assert.equal(a.counts()[1],1);});
test('size limit fails closed',async()=>{const a=setup({maxBytes:2});await a.c.start();a.rec().data();assert.equal(a.c.snapshot().state,'error');assert.equal(a.c.snapshot().blob,null);assert.equal(a.counts()[1],1);});
test('empty recording not downloadable',async()=>{const a=setup();await a.c.start();a.c.stop();assert.equal(a.c.snapshot().state,'error');assert.equal(a.c.snapshot().blob,null);});
test('discard releases and ignores stale recorder events',async()=>{const a=setup();await a.c.start();const r=a.rec();a.c.discard();r.data();r.onstop();assert.equal(a.c.snapshot().state,'idle');assert.equal(a.c.snapshot().blob,null);assert.equal(a.counts()[1],1);});
test('constructor failure releases acquired tracks',async()=>{const a=setup({Recorder:class{constructor(){throw Error('failure');}}});await a.c.start();assert.equal(a.c.snapshot().state,'error');assert.equal(a.counts()[1],1);});
test('recorder error releases microphone',async()=>{const a=setup();await a.c.start();a.rec().onerror();assert.equal(a.c.snapshot().state,'error');assert.equal(a.counts()[1],1);});
