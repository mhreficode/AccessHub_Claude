import { useEffect, useState } from 'react';
import { fetchUsageSummary } from '../api/keysApi';
import { useCurrentUser } from '../context/CurrentUserContext';
import type { UsageSummaryRow } from '../types';

export function useUsage() {
  const { userId } = useCurrentUser();
  const [data, setData] = useState<UsageSummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!userId) return;
    setLoading(true);
    setError(null);
    fetchUsageSummary()
      .then((d) => !cancelled && setData(d))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { usage: data, loading, error };
}
