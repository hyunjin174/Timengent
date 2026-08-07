import { useEffect, useState } from 'react';

/** Re-renders the caller on an interval so relative-time text (e.g. "3초 전") stays live. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
