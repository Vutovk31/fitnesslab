import {nutritionCandidates} from './nutrition-candidates.mjs';
// Review-only queue; transferred is not a durable save receipt.
export function mountCandidateReview(doc,{approve,context,transfer}){
  const $=id=>doc.getElementById(id),parse=$('candidate-parse'),list=$('candidate-list'),index=$('candidate-index'),amount=$('candidate-amount'),unit=$('candidate-unit'),meal=$('candidate-meal'),apply=$('candidate-apply'),status=$('candidate-status');
  let batch=null,selected=null,enabled=false;
  const labels={g:'г',ml:'мл',piece:'шт.'};
  function fresh(){const c=context();return batch&&batch.text===c.text&&batch.date===c.date;}
  function resetSelection(){selected=null;index.value='';amount.value='';unit.value='';meal.value='';}
  function clear(){batch=null;resetSelection();status.textContent='';list.textContent='';}
  function render(allowed){enabled=allowed===true;if(batch&&!fresh())clear();parse.disabled=!enabled;index.disabled=!enabled||!batch;amount.disabled=unit.disabled=meal.disabled=apply.disabled=!enabled||!selected;
    list.textContent=batch?batch.rows.map((r,i)=>(i+1)+'. '+r.raw+' — '+(r.used?'перенесено (не подтверждение сохранения)':r.status==='unresolved'?'уточните вручную':r.status==='missing_quantity'?'количество неизвестно':r.form.amount+' '+labels[r.form.unit])+'; КБЖУ неизвестны').join('\n'):'';
  }
  parse.addEventListener('click',()=>{if(!enabled||!context().allowed)return;const c=context();if(approve('Обработать тестовый текст локально? Повторный разбор может дублировать уже перенесённые позиции.')!==true)return;clear();try{batch={text:c.text,date:c.date,rows:nutritionCandidates(c.text,c.date,c.timezone)};status.textContent='Проверьте исходные фрагменты и смысл всей фразы. Выберите номер позиции.';}catch{status.textContent='Не удалось разобрать текст.';}render(enabled);});
  index.addEventListener('input',()=>{if(!enabled||!fresh()||!context().allowed)return;const n=/^\d+$/.test(index.value)?Number(index.value):0,r=batch.rows[n-1];selected=r?.form&&!r.used?r:null;amount.value=selected?.form.amount??'';unit.value=selected?.status==='explicit'?selected.form.unit:'';meal.value='';status.textContent=selected?'Проверьте количество и единицу, выберите приём пищи.':'Выберите неперенесённую позицию с понятным названием.';render(enabled);});
  apply.addEventListener('click',()=>{if(!enabled||!fresh()||!context().allowed||!selected||selected.used)return;const r=selected,n=Number(index.value);if(batch.rows[n-1]!==r)return;const q=amount.value.trim(),u=unit.value,m=meal.value;if(!/^\d+(?:[.,]\d+)?$/.test(q)||!Number.isFinite(Number(q.replace(',','.')))||Number(q.replace(',','.'))<=0||!Object.hasOwn(labels,u)||!['breakfast','lunch','snack','dinner','other'].includes(m)){status.textContent='Укажите положительное количество, единицу и приём пищи.';return;}
    const f={...r.form,amount:q,unit:u,basis_unit:u,basis_amount:u==='piece'?'1':'100',meal_type:m};
    if(transfer(f)!==true)return;r.used=true;resetSelection();status.textContent='Перенесено в редактор. Сохраните отдельно; остальные позиции остаются в списке.';render(enabled);
  });
  return {render,clear};
}
