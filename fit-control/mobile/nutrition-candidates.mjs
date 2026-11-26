import {transcriptForm} from '../preview/transcript.mjs';

// Candidate extraction only. Never infer food identity, meal status or nutrition.
const NUM='[0-9]+(?:[.,][0-9]+)?';
const WORDS=Object.freeze({один:'1',одна:'1',одно:'1',два:'2',две:'2',три:'3',четыре:'4',пять:'5',шесть:'6',семь:'7',восемь:'8',девять:'9',десять:'10'});
const NUMBER=`(?:${NUM}|${Object.keys(WORDS).join('|')})`;
const UNIT='(?:граммов|грамма|грамм|г|миллилитров|миллилитра|миллилитр|мл|штук|штуки|штука|шт\\.?)';
const prefix=new RegExp(`^(${NUMBER})\\s+(${UNIT})\\s+(.+)$`,'iu');
const suffix=new RegExp(`^(.+?)\\s+(${NUMBER})\\s*(${UNIT})$`,'iu');
const eggs=new RegExp(`^(${NUMBER})\\s+(яйцо|яйца|яиц)$`,'iu');
const conjunction=new RegExp(`\\s+и\\s+(?=(?:${NUMBER}|съел|съела|выпил|выпила)(?:\\s|$))`,'iu');
const unit=u=>/^г/u.test(u)?'г':/^м/u.test(u)?'мл':'шт.';
const number=n=>Object.hasOwn(WORDS,n)?WORDS[n]:n;
const unsafe=/(?:^|\s)(?:не|или|и|около|примерно|приблизительно|почти|до|от|между|половина|половину|пол|пара|пару|без|вместо|съел|съела|выпил|выпила)(?=\s|$)/iu;
const simpleName=s=>s.length<=300&&/^[\p{L}]+(?:[ -][\p{L}]+)*$/u.test(s)&&!unsafe.test(s)&&!new RegExp(`(?:^|\\s)(?:${Object.keys(WORDS).join('|')})(?=\\s|$)`,'iu').test(s);
const unresolved=(raw,reason)=>({raw,status:'unresolved',reason,form:null});
function candidate(raw,date,timezone,structured){
  const s=raw.replace(/^(?:съел|съела|выпил|выпила)\s+/iu,'').trim();
  if(!s)return unresolved(raw,'UNSUPPORTED');
  let name,qty,u;
  if(structured&&s.includes(';')){
    const p=s.split(';').map(x=>x.trim());
    if(p.length!==2||!simpleName(p[0]))return unresolved(raw,'AMBIGUOUS');
    try{const form=transcriptForm(s,1,date,timezone);return {raw,status:'explicit',reason:null,form};}catch{return unresolved(raw,'INVALID_QUANTITY');}
  }
  const p=prefix.exec(s),q=suffix.exec(s),e=eggs.exec(s);
  if(p){[,qty,u,name]=p;}else if(q){[,name,qty,u]=q;}else if(e){[,qty,name]=e;u='шт.';}
  else if(simpleName(s))return {raw,status:'missing_quantity',reason:'QUANTITY_REQUIRED',form:transcriptForm(s,1,date,timezone)};
  else return unresolved(raw,'AMBIGUOUS');
  if(!simpleName(name))return unresolved(raw,'AMBIGUOUS');
  qty=number(qty.toLowerCase());u=unit(u.toLowerCase());
  try{return {raw,status:'explicit',reason:null,form:transcriptForm(`${name}; ${qty} ${u}`,1,date,timezone)};}catch{return unresolved(raw,'INVALID_QUANTITY');}
}
export function nutritionCandidates(text,date,timezone){
  if(typeof text!=='string'||text.length>8000||!text.trim()||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(text))throw RangeError('Invalid transcript');
  // Semicolon format is physical-line based; otherwise commas not between digits and
  // a narrow conjunction pattern delimit fragments. Preserve all unresolved fragments.
  const structured=text.includes(';');
  const lines=text.split(/\r\n|\n|\r/).filter(s=>s.trim());
  const fragments=structured?lines:lines.flatMap(s=>s.split(/,(?!\d)|(?<!\d),/u).flatMap(x=>x.split(conjunction)));
  if(fragments.length>30)throw RangeError('Too many candidates');
  return fragments.map(s=>candidate(s.trim(),date,timezone,structured));
}
