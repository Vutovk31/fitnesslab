import {nativeSQLiteDriver} from './native-sqlite-driver.mjs';
import {SQLiteDiary} from './sqlite-diary.mjs';
import {trackedDiaryStore} from './recovery-store.mjs';
import {mountDiaryScreen} from './diary-screen.mjs';
import {SYNTHETIC_DATABASE as database,authorizeSynthetic} from './privacy-gate.mjs';
const attempted=new WeakSet();
// Native-only synthetic acceptance candidate. No automatic fallback or retry.
export async function startNativeDiary({capacitor,makeManager,doc,config,privacyMode,mount=mountDiaryScreen}){
  const main=doc.getElementById('main-content'),status=doc.getElementById('connection-status');
  if(!main||!status||attempted.has(doc))throw Error('Invalid or previously started shell');
  attempted.add(doc);main.setAttribute('inert','');
  let manager,owned=false,store,stage='PLATFORM';
  try{
    if(capacitor?.isNativePlatform()!==true||!['android','ios'].includes(capacitor.getPlatform())||capacitor.isPluginAvailable('CapacitorSQLite')!==true)throw Error('Unsupported platform');
    stage='PRIVACY';if(!authorizeSynthetic(privacyMode,config?.approve))throw Error('Synthetic acceptance not authorized');
    stage='CONNECTION';manager=makeManager();
    for(const k of ['isConnection','createConnection','closeConnection'])if(typeof manager?.[k]!=='function')throw Error('Unsupported manager');
    const exists=await manager.isConnection(database,false);
    if(exists?.result!==false)throw Error('Connection already exists or unknown');
    // No plugin upgrade registrations: SQLiteDiary owns user_version and migrations.
    const connection=await manager.createConnection(database,false,'no-encryption',1,false);owned=true;
    await connection.open();if((await connection.isDBOpen())?.result!==true)throw Error('Open not confirmed');
    const driver=nativeSQLiteDriver(connection,()=>manager.closeConnection(database,false));
    stage='SCHEMA';store=await SQLiteDiary.open(driver);
    const {targets}=await store.getGoals();
    stage='UI';const ui=mount(doc,{...config,targets,store:trackedDiaryStore(store),filePort:undefined,passphrasePort:undefined});
    if(await ui.ready!==true)throw Error('Initial read failed');
    let closing;
    return {status:'ready',close(){if(!closing){main.setAttribute('inert','');status.textContent='Хранилище закрывается.';closing=store.close();}return closing;}};
  }catch{
    main.setAttribute('inert','');let cleanup='NOT_ACQUIRED';
    if(owned){try{if(store)await store.close();else await manager.closeConnection(database,false);cleanup='CLOSED';}catch{cleanup='UNKNOWN';}}
    status.textContent='Запуск заблокирован ('+stage+'). Закройте приложение и проверьте конфигурацию. Не вводите данные.';
    return {status:'blocked',stage,cleanup};
  }
}
