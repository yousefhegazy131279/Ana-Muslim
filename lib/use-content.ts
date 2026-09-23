'use client';
import { useEffect, useState } from 'react';
import { supabase } from './supabase';
export function useContent<T>(table:string,initial:T[]){const [data,setData]=useState(initial);const [warning,setWarning]=useState('');useEffect(()=>{if(!supabase)return;let active=true;(async()=>{try{const {data:rows,error}=await supabase!.from(table).select('*').order('id').limit(1000);if(error)throw error;if(active&&rows?.length)setData(rows as T[])}catch{if(active)setWarning('تعذّر تحديث المحتوى. يمكنك متابعة القراءة من النسخة المحفوظة.')}})();return()=>{active=false}},[table]);return {data,warning};}
