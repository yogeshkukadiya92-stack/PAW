import { useCallback, useEffect, useRef, useState } from 'react';
import { api, ApiError, diffState, mergePending, type Snapshot, type WorkspaceData } from './api';

export function useWorkspace(initial: Snapshot) {
  const [data, setData] = useState(initial.data);
  const [saveStatus, setSaveStatus] = useState<'saved'|'saving'|'error'>('saved');
  const [saveError, setSaveError] = useState('');
  const acknowledged = useRef(initial);
  const current = useRef(data);
  current.current = data;
  const busy = useRef(false);
  const mounted = useRef(true);
  const failed = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const flush = useCallback(async () => {
    if (busy.current || failed.current) return;
    let changes = diffState(acknowledged.current.data, current.current);
    if (!Object.keys(changes).length) { if (mounted.current) {setSaveStatus('saved');setSaveError('');} return; }
    busy.current = true;
    if (mounted.current) setSaveStatus('saving');
    try {
      // Serialize saves, including changes made while a prior request was in flight.
      while (Object.keys(changes).length) {
        const submitted = current.current;
        const result = await api<Snapshot>('/state','PATCH',{revision:acknowledged.current.revision,changes});
        const pending = diffState(submitted,current.current);
        acknowledged.current = result;
        const merged = mergePending(result.data,pending);
        current.current = merged;
        if (mounted.current) setData(merged);
        changes = diffState(result.data,merged);
      }
      if (mounted.current) { setSaveStatus('saved'); setSaveError(''); }
    } catch (error) {
      failed.current = true;
      if (mounted.current) {
        setSaveStatus('error');
        setSaveError(error instanceof ApiError && error.status === 409 ? 'Another person updated these records. Reload the latest data before continuing.' : error instanceof Error ? error.message : 'Changes could not be saved.');
      }
    } finally { busy.current = false; }
  }, []);
  useEffect(() => {
    if (!Object.keys(diffState(acknowledged.current.data,data)).length) return;
    if (!failed.current) setSaveStatus('saving');
    const timeout = setTimeout(() => void flush(),250);
    return () => clearTimeout(timeout);
  },[data,flush]);
  useEffect(() => {
    const interval = setInterval(async () => {
      if (document.visibilityState === 'hidden' || busy.current || failed.current || Object.keys(diffState(acknowledged.current.data,current.current)).length) return;
      try {
        const fresh = await api<Snapshot>('/state');
        if (!mounted.current || busy.current || Object.keys(diffState(acknowledged.current.data,current.current)).length) return;
        setSaveError(''); setSaveStatus('saved');
        if (fresh.revision !== acknowledged.current.revision) {
          acknowledged.current = fresh; current.current = fresh.data; setData(fresh.data);
        }
      } catch (error) {
        if (mounted.current) { setSaveStatus('error'); setSaveError(error instanceof Error ? error.message : 'Unable to refresh records.'); }
      }
    },10000);
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (Object.keys(diffState(acknowledged.current.data,current.current)).length) { event.preventDefault(); event.returnValue=''; }
    };
    window.addEventListener('beforeunload',beforeUnload);
    return () => { clearInterval(interval); window.removeEventListener('beforeunload',beforeUnload); };
  },[]);
  const retry = async () => { failed.current = false; setSaveError(''); await flush(); };
  const reload = async () => {
    const fresh = await api<Snapshot>('/state');
    acknowledged.current=fresh; current.current=fresh.data; setData(fresh.data); failed.current=false; setSaveError(''); setSaveStatus('saved');
  };
  return {data,setData,saveStatus,saveError,retry,reload};
}
