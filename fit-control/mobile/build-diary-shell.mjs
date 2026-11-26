// Reuse canonical preview markup/CSS without its in-memory scripts.
import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
export function buildDiaryShell(source){
 const start=source.indexOf('<p class="notice">');
 const end=source.indexOf('<section aria-label="Дневной баланс">',start);
 const cut=source.indexOf('<section class="card" aria-labelledby="voice-heading">',end);
 if(start<0||end<=start||cut<=end)throw new Error('Preview markup changed');
 const goals='<section class="card" aria-labelledby="goals-heading"><h2 id="goals-heading">Мои цели питания</h2><p class="muted">Пустое поле — цель не задана. Укажите собственные значения.</p><form id="goals" novalidate><div class="fields"><label>Калории, ккал<input id="goal-kcal" inputmode="decimal"></label><label>Белки, г<input id="goal-protein_g" inputmode="decimal"></label><label>Жиры, г<input id="goal-fat_g" inputmode="decimal"></label><label>Углеводы, г<input id="goal-carbs_g" inputmode="decimal"></label></div><button id="save-goals" type="submit" class="primary">Сохранить цели</button><button id="cancel-goals" type="button">Сбросить форму</button></form></section>';
 const html=(source.slice(0,start)+'<p class="notice"><strong>Мобильный дневник.</strong> Не вводите реальные данные до приёмки на устройстве.</p><p id="diary-status" role="status"></p><button type="button" id="retry-diary">Обновить дневник</button>\n'+source.slice(end,cut)+goals+'</main></body></html>\n').replace('MOBILE PREVIEW · CYCLE 022','MOBILE DIARY · CYCLE 030').replace('<main id="main-content" tabindex="-1">','<p id="connection-status" role="status" class="notice">Хранилище не подключено.</p><main id="main-content" tabindex="-1" inert>');
 if(html.includes('<script')||!html.includes('id="editor"')||!html.includes('id="day"')||!html.includes(' inert>'))throw new Error('Invalid shell');
 return html;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const out=process.argv[2]??new URL('./diary-shell.html',import.meta.url);
 writeFileSync(out,buildDiaryShell(readFileSync(new URL('../preview/index.html',import.meta.url),'utf8')),'utf8');
}
