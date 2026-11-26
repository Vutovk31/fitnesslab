import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {buildDiaryShell} from './build-diary-shell.mjs';
export function nativeMarkup(source){
  const shell=buildDiaryShell(source);
  if(!shell.endsWith('</body></html>\n')||!shell.includes(' inert>'))throw Error('Invalid native shell');
  return shell.replace('</body></html>','<script type="module" src="./app.js"></script></body></html>');
}
export async function buildNativeWeb(){
  const {build}=await import('esbuild');
  const html=nativeMarkup(readFileSync(new URL('../preview/index.html',import.meta.url),'utf8'));
  const result=await build({entryPoints:[fileURLToPath(new URL('./native-entry.mjs',import.meta.url))],bundle:true,platform:'browser',format:'esm',target:'es2022',write:false,legalComments:'inline',outfile:'app.js'});
  if(result.outputFiles.length!==1)throw Error('Unexpected bundle outputs');
  const out=new URL('./www/',import.meta.url);mkdirSync(out,{recursive:true});
  if(readdirSync(out).some(p=>!['app.js','index.html'].includes(p)))throw Error('Unexpected files in generated web directory');
  writeFileSync(new URL('app.js',out),result.outputFiles[0].contents);writeFileSync(new URL('index.html',out),html,'utf8');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await buildNativeWeb();
