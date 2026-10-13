import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');const files=[];
async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await walk(file);else files.push(path.relative(dist,file).replaceAll('\\','/'));}}
await walk(dist);const hash=createHash('sha256');let bytes=0;
for(const file of files.sort()){const data=await fs.readFile(path.join(dist,file));hash.update(file).update(data);bytes+=data.length;}
const version=hash.digest('hex').slice(0,16);
const sw=`const CACHE='am-library-${version}';
const FILES=${JSON.stringify(files)};
const BASE=self.registration.scope;
async function tell(message){for(const client of await self.clients.matchAll({includeUncontrolled:true}))client.postMessage(message);}
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);let next=0,done=0;
 try{await Promise.all(Array.from({length:4},async()=>{while(next<FILES.length){const file=FILES[next++];const url=new URL(file,BASE).href;const response=await fetch(url,{cache:'no-cache'});if(!response.ok)throw Error(file);await cache.put(url,response);await tell({type:'CACHE_PROGRESS',done:++done,total:FILES.length});}}));await cache.put(new URL('__complete__',BASE).href,new Response('ready'));await self.skipWaiting();}
 catch(error){await caches.delete(CACHE);await tell({type:'CACHE_ERROR'});throw error;}
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{await self.clients.claim();for(const key of await caches.keys())if(key.startsWith('am-library-')&&key!==CACHE)await caches.delete(key);await tell({type:'CACHE_READY'});})()));
self.addEventListener('message',event=>{if(event.data?.type==='CHECK_CACHE')event.waitUntil((async()=>{const cache=await caches.open(CACHE);const complete=await cache.match(new URL('__complete__',BASE).href);event.source?.postMessage({type:complete?'CACHE_READY':'CACHE_ERROR'});})());});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||!url.href.startsWith(BASE))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);const clean=new URL(url.href);clean.search='';const cached=await cache.match(clean.href);if(cached)return cached;if(event.request.mode==='navigate'){const html=await cache.match(new URL('index.html',BASE).href);if(html)return html;}return fetch(event.request);})());});
`;
await fs.writeFile(path.join(dist,'sw.js'),sw);
await fs.writeFile(path.join(dist,'build-info.json'),JSON.stringify({version,files:files.length,bytes}));
console.log('Offline package:',files.length,'files,',Math.round(bytes/1024/1024*10)/10,'MB');
