import { useCallback, useMemo, useState } from 'react';

export function usePagination({ page = 1, pageSize = 10, total = 0, onChange } = {}) {
  const [current, setCurrent] = useState(page);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  const setPage = useCallback((p) => {
    const next = Math.min(totalPages, Math.max(1, p));
    setCurrent(next);
    onChange?.(next);
  }, [totalPages, onChange]);

  const next = useCallback(() => setPage(current + 1), [current, setPage]);
  const prev = useCallback(() => setPage(current - 1), [current, setPage]);
  const jump = useCallback((p) => setPage(p), [setPage]);

  return { page: current, pageSize, total, totalPages, setPage, next, prev, jump };
}