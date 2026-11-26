// One local owner until the underlying request settles. UI listeners never acquire.
export function audioLease(){
  let owner=null;const listeners=new Set();
  const notify=()=>{for(const f of [...listeners])f();};
  return {available:()=>owner===null,claim(token){if(owner!==null)return false;owner=token;notify();return true;},release(token){if(owner===token){owner=null;notify();}},subscribe(f){listeners.add(f);return ()=>listeners.delete(f);}};
}
