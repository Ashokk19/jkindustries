import { useRef, useCallback } from 'react';

/**
 * Returns a debounced version of the given callback.
 * Auto-fires after `delay` ms of inactivity.
 */
export function useDebouncedSave(
  saveFn: () => void | Promise<void>,
  delay: number = 800
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      saveFn();
    }, delay);
  }, [saveFn, delay]);

  const cancelPending = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { debouncedSave, cancelPending };
}
