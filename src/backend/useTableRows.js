import {useCallback,useEffect,useRef,useState} from 'react';
import {requireBackend} from './client';
import {useAuth} from '../auth/AuthContext';
export function useTableRows(table,limit=200) {
  const {user,profile}=useAuth();
  const uid=user?.uid;
  const role=profile?.role;
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const sequence=useRef(0);
  const reload=useCallback(async()=>{
    const request=++sequence.current;
    if(!uid || !role) {setRows([]);setLoading(false);return;}
    try {
      const result=await requireBackend().from(table).select('*').order('created_at',{ascending:false}).limit(limit);
      if(result.error) throw result.error;
      if(request===sequence.current) {setRows(result.data);setError('');}
    } catch(problem) {if(request===sequence.current) setError(problem.message);}
    finally {if(request===sequence.current) setLoading(false);}
  },[table,limit,uid,role]);
  useEffect(()=>{const tracker=sequence;setRows([]);setLoading(true);reload();const timer=setInterval(reload,15000);return()=>{tracker.current++;clearInterval(timer);};},[reload]);
  return {rows,loading,error,reload};
}
