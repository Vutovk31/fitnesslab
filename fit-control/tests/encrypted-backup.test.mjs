import {test} from 'node:test';
import assert from 'node:assert/strict';
import {encryptBackup,decryptBackup,encryptedBackupMaxBytes} from '../mobile/encrypted-backup.mjs';
const pass='Synthetic passphrase 42!';
const text=JSON.stringify({product:'FIT CONTROL',schema_version:3,entries:[],goals:{revision:1,targets:{kcal:1234,protein_g:null,fat_g:null,carbs_g:null}}});
test('authenticated binary roundtrip and randomized salt/nonce',async()=>{
  const a=await encryptBackup(text,pass),b=await encryptBackup(text,pass);
  assert.equal(a.length,Buffer.byteLength(text)+49);assert.deepEqual([...a.slice(0,5)],[70,67,66,75,1]);
  assert.notDeepEqual(a.slice(5,21),b.slice(5,21));assert.notDeepEqual(a.slice(21,33),b.slice(21,33));
  assert.equal(await decryptBackup(a,pass),text);assert.equal(await decryptBackup(b,pass),text);
  assert.equal(Buffer.from(a).includes(Buffer.from(text)),false);
});
test('wrong password and tampering with salt nonce ciphertext or tag rejected',async()=>{
  const a=await encryptBackup(text,pass);await assert.rejects(decryptBackup(a,'Wrong passphrase 42!'),/authentication failed/);
  for(const i of [5,21,33,a.length-1]){const b=a.slice();b[i]^=1;await assert.rejects(decryptBackup(b,pass),/authentication failed/);}
  await assert.rejects(decryptBackup(a.slice(0,-1),pass),/authentication failed/);
});
test('unsupported version malformed input and plaintext downgrade refused',async()=>{
  const a=await encryptBackup(text,pass);a[4]=2;
  for(const x of [a,new Uint8Array(49),new Uint8Array(encryptedBackupMaxBytes+1),text,new TextEncoder().encode(text)])await assert.rejects(decryptBackup(x,pass),RangeError);
  await assert.rejects(encryptBackup('{',pass));
});
test('strict passphrase policy and Unicode exactness',async()=>{
  for(const p of ['',123,'short','x'.repeat(1025),'long passphrase\ud800'])await assert.rejects(encryptBackup(text,p),RangeError);
  const p='Тестовый пароль 123';const a=await encryptBackup(text,p);assert.equal(await decryptBackup(a,p),text);
  await assert.rejects(decryptBackup(a,p+' '),/authentication failed/);
});
test('mutable caller bytes snapshotted before key derivation',async()=>{
  const a=await encryptBackup(text,pass);const p=decryptBackup(a,pass);a.fill(0);assert.equal(await p,text);
});
test('authenticated but invalid inner backup rejected',async()=>{
  const a=await encryptBackup(text,pass),header=a.slice(0,33),c=globalThis.crypto;
  const m=await c.subtle.importKey('raw',new TextEncoder().encode(pass),'PBKDF2',false,['deriveKey']);
  const k=await c.subtle.deriveKey({name:'PBKDF2',salt:header.slice(5,21),iterations:600000,hash:'SHA-256'},m,{name:'AES-GCM',length:256},false,['encrypt']);
  const cipher=new Uint8Array(await c.subtle.encrypt({name:'AES-GCM',iv:header.slice(21),additionalData:header,tagLength:128},k,new TextEncoder().encode('{"bad":true}')));
  const b=new Uint8Array(33+cipher.length);b.set(header);b.set(cipher,33);await assert.rejects(decryptBackup(b,pass),/Unsupported backup/);
});
