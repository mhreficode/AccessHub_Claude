import { useCallback, useEffect, useState } from 'react';
import { fetchAccessRequests } from '../api/accessApi';
import { useCurrentUser } from '../context/CurrentUserContext';
import type { AccessRequest } from '../types';

export function useAccessRequests() {
  const { userId } = useCurrentUser();
  const [data, setData] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchAccessRequests());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load access requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    void load();
  }, [userId, load]);

  return { requests: data, loading, error, reload: load };
}
