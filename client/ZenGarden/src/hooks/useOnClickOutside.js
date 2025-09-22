import { useEffect } from 'react';

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    function onClick(e) {
      if (!ref?.current) return;
      if (!ref.current.contains(e.target)) handler?.(e);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('touchstart', onClick);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('touchstart', onClick);
    };
  }, [ref, handler]);
}