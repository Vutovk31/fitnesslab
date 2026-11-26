// Candidate adapter for @capacitor-community/sqlite 8.1.1 connection API.
// Native execution is not verified. Connection must be exclusively owned.
const owners=new WeakSet();
const uncertain=()=>Object.assign(new Error('Transaction outcome unknown; reopen and reconcile before retry'),{code:'COMMIT_OUTCOME_UNKNOWN'});
export function nativeSQLiteDriver(connection,closeConnection){
  for(const method of ['beginTransaction','commitTransaction','rollbackTransaction','isTransactionActive','query','run','execute'])if(typeof connection?.[method]!=='function')throw new TypeError('Unsupported native SQLite connection');
  if(typeof closeConnection!=='function'||owners.has(connection))throw new Error('Exclusive connection required');
  owners.add(connection);
  let tail=Promise.resolve(),closing,poisoned=false;
  const active=async()=>{const r=await connection.isTransactionActive();if(typeof r?.result!=='boolean')throw Error('Invalid transaction status');return r.result;};
  function transaction(work){
    if(closing||poisoned)return Promise.reject(Error('Native driver unavailable'));
    if(typeof work!=='function')return Promise.reject(TypeError('Transaction callback required'));
    const job=tail.then(async()=>{
      if(poisoned)throw Error('Native driver unavailable');
      let live=true,pending=null,failed=false;
      const call=fn=>{
        if(!live||pending)throw Error('Transaction scope or overlapping command');
        const p=Promise.resolve().then(fn);pending=p;
        return p.then(v=>{pending=null;return v;},e=>{pending=null;failed=true;throw e;});
      };
      const all=(sql,values)=>call(async()=>{const r=await connection.query(sql,values);if(!Array.isArray(r?.values))throw Error('Invalid SQLite rows');return r.values;});
      const tx={all,get:async(sql,values)=>(await all(sql,values))[0],run:(sql,values)=>call(async()=>{
        const r=values.length?await connection.run(sql,values,false,'no'):await connection.execute(sql,false);
        const changes=r?.changes?.changes;if(!Number.isSafeInteger(changes)||changes<0)throw Error('Invalid SQLite write count');return {changes};
      })};
      try{if(await active())throw Error('Existing transaction');await connection.beginTransaction();if(!await active())throw Error('Transaction did not begin');}
      catch{poisoned=true;throw uncertain();}
      let result;
      try{result=await work(tx);if(pending){await pending;throw Error('Unawaited transaction command');}if(failed)throw Error('Transaction command failed');live=false;}
      catch(e){live=false;try{if(pending)await pending.catch(()=>{});if(!await active())throw Error('Transaction lost');await connection.rollbackTransaction();if(await active())throw Error('Rollback not confirmed');}catch{poisoned=true;throw uncertain();}throw e;}
      try{await connection.commitTransaction();if(await active())throw Error('Commit not confirmed');}
      catch{poisoned=true;throw uncertain();}
      return result;
    });
    tail=job.catch(()=>{});return job;
  }
  function close(){if(!closing)closing=tail.then(closeConnection);return closing;}
  return {transaction,close};
}
