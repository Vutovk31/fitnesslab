// Decision-only contract for a future trusted native provider. No key or DB I/O.
// Candidate outcomes are not production authorization or proof of native controls.
const fields=Object.freeze({
  platform:['android','ios'],
  policy:['verified','unverified'],
  installation:['fresh','ready','interrupted','unknown'],
  namespace:['empty','isolated','other','unknown'],
  database:['absent','encrypted','plaintext','unknown'],
  key:['absent','present','locked','unknown'],
  probe:['not_checked','verified','failed','unknown']
});
const blocked=reason=>({status:'blocked',reason});
export function assessKeyLifecycle(observation,approved=false){
  let o;
  try{
    if(!observation||typeof observation!=='object'||Array.isArray(observation)||Object.keys(observation).length!==Object.keys(fields).length)return blocked('INVALID_OBSERVATION');
    o=Object.fromEntries(Object.keys(fields).map(k=>[k,observation[k]]));
    if(!Object.keys(fields).every(k=>Object.hasOwn(observation,k)&&fields[k].includes(o[k])))return blocked('INVALID_OBSERVATION');
  }catch{return blocked('INVALID_OBSERVATION');}
  if(o.policy!=='verified')return blocked('NATIVE_POLICY_UNVERIFIED');
  if(o.installation==='interrupted')return blocked('PROVISIONING_INTERRUPTED');
  if(o.installation==='unknown'||o.namespace==='unknown'||o.database==='unknown'||o.key==='unknown'||o.probe==='unknown')return blocked('STATE_UNKNOWN');
  if(o.database==='plaintext')return blocked('PLAINTEXT_DATABASE');
  if(o.namespace==='other')return blocked('NAMESPACE_NOT_ISOLATED');
  if(o.key==='locked')return blocked('KEY_LOCKED');
  if(o.database==='encrypted'&&o.key==='absent')return blocked('KEY_MISSING');
  if(o.probe==='failed')return blocked('VERIFICATION_FAILED');
  if(o.installation==='fresh'&&o.namespace==='empty'&&o.database==='absent'&&o.key==='absent'&&o.probe==='not_checked'){
    if(approved!==true)return blocked('APPROVAL_REQUIRED');
    return {status:'provision_candidate',reason:'CONFIRMED_EMPTY_INSTALLATION'};
  }
  if(o.installation==='ready'&&o.namespace==='isolated'&&o.database==='encrypted'&&o.key==='present'){
    if(o.probe==='not_checked')return {status:'verify_candidate',reason:'EXISTING_DATABASE_READ_ONLY_PROBE'};
    if(o.probe==='verified')return {status:'open_candidate',reason:'EXISTING_DATABASE_VERIFIED'};
  }
  return blocked('INCONSISTENT_STATE');
}
