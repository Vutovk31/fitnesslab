import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {buildPrivacyMode} from './privacy-gate.mjs';
import {buildDiaryShell} from './build-diary-shell.mjs';
export function nativeMarkup(source){
  const shell=buildDiaryShell(source);
  if(!shell.endsWith('</body></html>\n')||!shell.includes(' inert>'))throw Error('Invalid native shell');
  const csp="<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; base-uri 'none'; form-action 'none'; object-src 'none'\">";
  if(!shell.includes('<head>'))throw Error('Missing head');
  return shell.replace('<head>','<head>'+csp).replace('</body></html>','<script type="module" src="./app.js"></script></body></html>');
}
export async function buildNativeWeb(){
  const mode=buildPrivacyMode(process.env.FIT_CONTROL_SYNTHETIC_BUILD);
  const {build}=await import('esbuild');
  const html=nativeMarkup(readFileSync(new URL('../preview/index.html',import.meta.url),'utf8'));
  const result=await build({entryPoints:[fileURLToPath(new URL('./native-entry.mjs',import.meta.url))],bundle:true,define:{__FIT_CONTROL_PRIVACY_MODE__:JSON.stringify(mode)},platform:'browser',format:'esm',target:'es2022',write:false,legalComments:'inline',outfile:'app.js'});
  if(result.outputFiles.length!==1)throw Error('Unexpected bundle outputs');
  const out=new URL('./www/',import.meta.url);mkdirSync(out,{recursive:true});
  if(readdirSync(out).some(p=>!['app.js','index.html'].includes(p)))throw Error('Unexpected files in generated web directory');
  writeFileSync(new URL('app.js',out),result.outputFiles[0].contents);writeFileSync(new URL('index.html',out),html,'utf8');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await buildNativeWeb();
