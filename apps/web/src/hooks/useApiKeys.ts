import { useCallback, useEffect, useState } from 'react';
import { fetchApiKeys } from '../api/keysApi';
import { useCurrentUser } from '../context/CurrentUserContext';
import type { ApiKey } from '../types';

export function useApiKeys() {
  const { userId } = useCurrentUser();
  const [data, setData] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchApiKeys());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load API keys');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    void load();
  }, [userId, load]);

  return { keys: data, loading, error, reload: load };
}
