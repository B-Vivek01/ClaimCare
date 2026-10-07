import { useCallback, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import { updateDoc } from './profiles';
import { createSerialWriter } from '../data/serialWriter';
export function useProfileSetting(field, fallback) {
  const { user, profile } = useAuth();
  const uid=user?.uid;
  const value = profile?.[field] ?? fallback;
  const state = useRef({key:null,pending:0,value,write:null});
  const key = `${user?.uid}:${field}`;
  if (state.current.key !== key) {
    const current = {key,pending:0,value,write:null};
    current.write = createSerialWriter(() => current.value, async next => {
      if (state.current !== current || !user) throw new Error('Your account changed. Please retry.');
      await updateDoc({id:user.uid},{[field]:next});
    }, next => {current.value=next;});
    state.current=current;
  } else if (!state.current.pending) state.current.value=value;
  const setValue = useCallback(async update => {
    const current=state.current;
    current.pending++;
    window.dispatchEvent(new CustomEvent('claimcare:data',{detail:{pending:1}}));
    try {
      if (!uid) throw new Error('Please sign in first.');
      return await current.write(update);
    } catch (error) { window.dispatchEvent(new CustomEvent('claimcare:data',{detail:{error:error.message}})); return false; }
    finally {current.pending--;window.dispatchEvent(new CustomEvent('claimcare:data',{detail:{pending:-1}}));}
  }, [uid]);
  return [value,setValue];
}
