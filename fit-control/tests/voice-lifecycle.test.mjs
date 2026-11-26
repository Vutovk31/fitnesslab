import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mountVoice} from '../preview/voice.mjs';

test('restored page resumes polling and every pagehide releases microphone', async()=>{
  const nodes=new Map(), events=new Map(), intervals=new Map();
  let seq=0, requests=0, stops=0;
  class Element {
    constructor(){this.handlers={};this.textContent='';}
    addEventListener(k,f){this.handlers[k]=f;}
    removeAttribute(k){delete this[k];}
    fire(k){return this.handlers[k]();}
  }
  const get=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);};
  const host={navigator:{mediaDevices:{async getUserMedia(){requests++;return {getTracks:()=>[{stop(){stops++;}}]};}}},
    MediaRecorder:class{start(){this.state='recording';}stop(){this.state='inactive';}},
    URL:{createObjectURL(){return 'blob:fixture';},revokeObjectURL(){}},
    setInterval(fn){intervals.set(++seq,fn);return seq;},clearInterval(id){intervals.delete(id);},
    addEventListener(k,fn,options){events.set(k,[...(events.get(k)??[]),{fn,once:!!options?.once}]);}};
  function fire(k){for(const e of [...(events.get(k)??[])]){if(e.once)events.set(k,events.get(k).filter(x=>x!==e));e.fn();}}
  const capture=mountVoice({getElementById:get},host);
  try {
    assert.equal(intervals.size,1);await get('voice-start').fire('click');assert.equal(requests,1);
    fire('pagehide');assert.equal(stops,1);assert.equal(intervals.size,0);
    fire('pageshow');fire('pageshow');assert.equal(intervals.size,1);
    await get('voice-start').fire('click');assert.equal(requests,2);
    fire('pagehide');assert.equal(stops,2);assert.equal(intervals.size,0);assert.equal(capture.snapshot().state,'idle');
  } finally {capture.discard();}
});
