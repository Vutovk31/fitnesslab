// Acceptance-only gate. No flag authorizes production or personal health data.
export const SYNTHETIC_DATABASE='fit_control_synthetic_v1';
export function buildPrivacyMode(value){
  if(value===undefined||value==='0')return 'blocked';
  if(value==='1')return 'synthetic';
  throw Error('Invalid synthetic build flag');
}
export function authorizeSynthetic(mode,approve){
  return mode==='synthetic'&&typeof approve==='function'&&approve('Только тестовые данные. База не зашифрована. Не вводите реальные сведения о здоровье. Продолжить тестирование?')===true;
}
