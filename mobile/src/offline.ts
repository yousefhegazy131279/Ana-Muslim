import { Capacitor } from '@capacitor/core';
export async function setupOffline(onStatus:(text:string)=>void) {
  if(Capacitor.isNativePlatform()){onStatus('المحتوى كامل محفوظ داخل التطبيق');return;}
  if(!('serviceWorker' in navigator)){onStatus('هذا المتصفح لا يدعم حفظ التطبيق دون إنترنت');return;}
  onStatus('جارٍ حفظ المكتبة كاملة على جهازك…');
  navigator.serviceWorker.addEventListener('message',event=>{const d=event.data;if(d?.type==='CACHE_PROGRESS')onStatus(`جارٍ حفظ المكتبة: ${Math.round(d.done/d.total*100)}٪`);if(d?.type==='CACHE_READY')onStatus('المكتبة كاملة جاهزة دون إنترنت');if(d?.type==='CACHE_ERROR')onStatus('لم يكتمل الحفظ. أبقِ التطبيق مفتوحًا واتصل بالإنترنت ثم أعد المحاولة.');});
  try{const registration=await navigator.serviceWorker.register('./sw.js',{scope:'./'});if(registration.active){registration.active.postMessage({type:'CHECK_CACHE'});}else{navigator.serviceWorker.addEventListener('controllerchange',()=>navigator.serviceWorker.controller?.postMessage({type:'CHECK_CACHE'}));}if(navigator.storage?.persist)await navigator.storage.persist();}catch{onStatus('تعذر حفظ المكتبة. تأكد من اتصالك وأعد فتح التطبيق.');}
}
