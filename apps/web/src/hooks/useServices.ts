import { useCallback, useEffect, useState } from 'react';
import { fetchServices } from '../api/servicesApi';
import { useCurrentUser } from '../context/CurrentUserContext';
import type { Service } from '../types';

export function useServices(filters: { status?: string; search?: string } = {}) {
  const { userId } = useCurrentUser();
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { status, search } = filters;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchServices({ status, search }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    let cancelled = false;
    if (!userId) return;
    setLoading(true);
    fetchServices({ status, search })
      .then((d) => !cancelled && setData(d))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [userId, status, search]);

  return { services: data, loading, error, reload: load };
}
