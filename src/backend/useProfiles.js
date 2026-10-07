import { useEffect, useState } from 'react';
import { requireBackend } from './client';
export function useProfiles() {
  const [profiles,setProfiles] = useState([]);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const {data,error} = await requireBackend().from('profiles').select('id,data');
        if (error) throw error;
        if (active) setProfiles(data.map(row => ({...row.data,id:row.id,status:row.data.disabled ? 'Disabled' : row.data.status || 'Active'})));
      } catch (error) { if (active) window.dispatchEvent(new CustomEvent('claimcare:data',{detail:{error:error.message}})); }
    }
    load(); const timer = setInterval(load,15000);
    return () => { active=false; clearInterval(timer); };
  }, []);
  return [profiles,setProfiles];
}
