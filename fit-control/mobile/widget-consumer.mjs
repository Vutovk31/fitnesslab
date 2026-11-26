// Pure synthetic consumer. The native adapter must supply the canonical readWidgetSnapshot
// validator, a fresh independent consent check and trustworthy surface/lock context.
const MAX_BYTES=4096;
const routes=Object.freeze({
  'fitcontrol://widget/diary':'diary',
  'fitcontrol://widget/add-food':'add-food'
});
const fields=Object.freeze(['kcal','protein_g','fat_g','carbs_g']);
const hidden=state=>({state,link:'fitcontrol://widget/diary'});
const allowed=context=>context?.enabled===true&&context?.unlocked===true&&context?.surface==='home';
const displayValue=v=>v===null?null:typeof v==='number'&&Number.isFinite(v)&&Math.abs(v)<=1e9?v:undefined;
export function widgetPresentation(text,context,readSnapshot){
  if(!allowed(context))return hidden('hidden');
  try{
    if(typeof text!=='string'||text.length>MAX_BYTES||new TextEncoder().encode(text).length>MAX_BYTES||typeof readSnapshot!=='function')return hidden('unavailable');
    const decoded=JSON.parse(text);
    const result=readSnapshot(decoded,{enabled:true,now:context.now,timezone:context.timezone});
    if(result?.state!=='ready')return hidden(['hidden','stale','unavailable'].includes(result?.state)?result.state:'unavailable');
    const s=result.snapshot;
    if(typeof s?.has_confirmed!=='boolean')return hidden('unavailable');
    const nutrients=fields.map(key=>{
      const n=s.nutrients[key],confirmed=displayValue(n.confirmed),target=displayValue(n.target),remaining=displayValue(n.remaining);
      if([confirmed,target,remaining].includes(undefined)||confirmed<0||(target!==null&&target<=0)||remaining!==(confirmed===null||target===null?null:target-confirmed)||(!s.has_confirmed&&confirmed!==0))throw RangeError('Invalid display value');
      return {key,confirmed,target,remaining};
    });
    return {state:s.has_confirmed?'ready':'empty',nutrients,link:'fitcontrol://widget/diary',addLink:'fitcontrol://widget/add-food'};
  }catch{return hidden('unavailable');}
}
// Exact raw string allowlist; links are public navigation hints, never authentication.
// The receiving app supplies its own current access, recovery and editor guards.
export function resolveWidgetLink(link,context){
  if(typeof link!=='string'||!Object.hasOwn(routes,link))return {state:'rejected'};
  if(context?.authenticated!==true||context?.unlocked!==true)return {state:'unlock-required'};
  if(context?.ready!==true||context?.recoveryIdle!==true||context?.editorClean!==true)return {state:'blocked'};
  return {state:'navigate',route:routes[link]};
}
