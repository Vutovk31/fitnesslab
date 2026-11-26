import {inspectBackup} from './sqlite-diary.mjs';

// Binary v1: ASCII FCBK, version byte, 16-byte salt, 12-byte nonce,
// then AES-256-GCM ciphertext with 16-byte tag. Entire header is AAD.
// Version fixes PBKDF2-HMAC-SHA256 to 600000 iterations; no attacker-controlled KDF.
const MAGIC=[70,67,66,75,1], HEADER=33, TAG=16, MAX=16*1024*1024;
export const encryptedBackupMaxBytes=HEADER+MAX+TAG;
const encoder=new TextEncoder(),decoder=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true});
function requireCrypto(){
  const c=globalThis.crypto;
  if(!c?.subtle||typeof c.getRandomValues!=='function')throw Error('WebCrypto unavailable');
  return c;
}
async function derive(c,passphrase,salt){
  if(typeof passphrase!=='string'||passphrase.length>1024)throw RangeError('Invalid passphrase');
  const secret=encoder.encode(passphrase);
  try{
    if(secret.length>1024||[...passphrase].length<12||decoder.decode(secret)!==passphrase)throw RangeError('Invalid passphrase');
    const material=await c.subtle.importKey('raw',secret,'PBKDF2',false,['deriveKey']);
    return await c.subtle.deriveKey({name:'PBKDF2',salt,iterations:600000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  }finally{secret.fill(0);}
}
function algorithm(header){return {name:'AES-GCM',iv:header.subarray(21,33),additionalData:header,tagLength:128};}
export async function encryptBackup(text,passphrase){
  inspectBackup(text);
  const c=requireCrypto(),header=new Uint8Array(HEADER);header.set(MAGIC);
  c.getRandomValues(header.subarray(5,21));c.getRandomValues(header.subarray(21,33));
  const key=await derive(c,passphrase,header.subarray(5,21));
  const plaintext=encoder.encode(text);
  try{
    const ciphertext=new Uint8Array(await c.subtle.encrypt(algorithm(header),key,plaintext));
    const envelope=new Uint8Array(HEADER+ciphertext.length);envelope.set(header);envelope.set(ciphertext,HEADER);return envelope;
  }finally{plaintext.fill(0);}
}
export async function decryptBackup(input,passphrase){
  if(!(input instanceof Uint8Array)||input.byteLength<=HEADER+TAG||input.byteLength>encryptedBackupMaxBytes)throw RangeError('Invalid encrypted backup size or type');
  // Copy before any await; a caller cannot swap authenticated bytes during KDF.
  const envelope=new Uint8Array(input),header=envelope.subarray(0,HEADER);
  if(!MAGIC.every((n,i)=>header[i]===n))throw RangeError('Unsupported encrypted backup');
  const c=requireCrypto(),key=await derive(c,passphrase,header.subarray(5,21));
  let plaintext;
  try{plaintext=new Uint8Array(await c.subtle.decrypt(algorithm(header),key,envelope.subarray(HEADER)));}
  catch{throw Error('Backup authentication failed');}
  try{const text=decoder.decode(plaintext);inspectBackup(text);return text;}
  finally{plaintext.fill(0);}
}
