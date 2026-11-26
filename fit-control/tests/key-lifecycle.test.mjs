import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assessKeyLifecycle as assess} from '../mobile/key-lifecycle.mjs';
const fresh={platform:'android',policy:'verified',installation:'fresh',namespace:'empty',database:'absent',key:'absent',probe:'not_checked'};
const existing={...fresh,platform:'ios',installation:'ready',namespace:'isolated',database:'encrypted',key:'present'};
test('only confirmed empty installation with strict approval is provisioning candidate',()=>{
  for(const p of ['android','ios']){
    assert.equal(assess({...fresh,platform:p},true).status,'provision_candidate');
    for(const approval of [false,undefined,1,'true'])assert.equal(assess({...fresh,platform:p},approval).reason,'APPROVAL_REQUIRED');
  }
});
test('existing encrypted database needs read-only verification, not provisioning',()=>{
  assert.equal(assess(existing).status,'verify_candidate');
  assert.equal(assess({...existing,probe:'verified'}).status,'open_candidate');
  assert.equal(assess({...existing,probe:'failed'},true).reason,'VERIFICATION_FAILED');
  assert.equal(assess({...existing,key:'absent'},true).reason,'KEY_MISSING');
  assert.equal(assess({...existing,key:'locked'},true).reason,'KEY_LOCKED');
});
test('interrupted setup, orphan key, missing database and plaintext fail closed',()=>{
  for(const o of [{...fresh,installation:'interrupted'}, {...fresh,key:'present'}, {...existing,database:'absent'}, {...existing,database:'plaintext'}, {...fresh,namespace:'other'}, {...fresh,policy:'unverified'}])assert.equal(assess(o,true).status,'blocked');
});
test('malformed observations and unexpected secret field are rejected without reflecting input',()=>{
  for(const o of [null,[],{}, {...fresh,platform:'web'}, {...fresh,key:true}, {...fresh,secret:'fixture-not-a-real-secret'}, {...fresh,get key(){throw Error('private path');}}])assert.deepEqual(assess(o,true),{status:'blocked',reason:'INVALID_OBSERVATION'});
});
test('exhaustive state matrix admits only the three narrow candidate states per platform',()=>{
  let total=0,admitted=0;
  for(const platform of ['android','ios'])for(const policy of ['verified','unverified'])for(const installation of ['fresh','ready','interrupted','unknown'])for(const namespace of ['empty','isolated','other','unknown'])for(const database of ['absent','encrypted','plaintext','unknown'])for(const key of ['absent','present','locked','unknown'])for(const probe of ['not_checked','verified','failed','unknown']){
    const o={platform,policy,installation,namespace,database,key,probe};total++;
    const result=assess(o,true);
    const provision=policy==='verified'&&installation==='fresh'&&namespace==='empty'&&database==='absent'&&key==='absent'&&probe==='not_checked';
    const verify=policy==='verified'&&installation==='ready'&&namespace==='isolated'&&database==='encrypted'&&key==='present'&&probe==='not_checked';
    const open=policy==='verified'&&installation==='ready'&&namespace==='isolated'&&database==='encrypted'&&key==='present'&&probe==='verified';
    assert.equal(result.status,provision?'provision_candidate':verify?'verify_candidate':open?'open_candidate':'blocked');
    if(result.status!=='blocked')admitted++;
  }
  assert.equal(total,4096);assert.equal(admitted,6);
});
