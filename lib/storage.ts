export const dayKey=()=>{const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`};
export function loadCounts(key:string):Record<string,number>{try{const raw=JSON.parse(localStorage.getItem(key)||'{}');if(!raw||typeof raw!=='object'||Array.isArray(raw))return {};return Object.fromEntries(Object.entries(raw).filter(([,v])=>typeof v==='number'&&Number.isInteger(v)&&v>=0)) as Record<string,number>}catch{return {}}}
export function saveCounts(key:string,value:Record<string,number>){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
