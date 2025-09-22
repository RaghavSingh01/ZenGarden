import { useEffect, useRef, useState } from 'react';
import http from '../services/http.js';

export function useFetch(url, { params, enabled = true, transform } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState(null);
  const urlRef = useRef(url);
  const paramsRef = useRef(params);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!enabled || !urlRef.current) return;
      setLoading(true);
      setError(null);
      try {
        const res = await http.get(urlRef.current, { params: paramsRef.current });
        const payload = res.data;
        setData(transform ? transform(payload) : payload);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [enabled, url, params, transform]);

  return { data, loading, error };
}