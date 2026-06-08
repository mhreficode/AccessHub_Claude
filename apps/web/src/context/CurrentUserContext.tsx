import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { apiFetch, setActiveUserId } from '../api/client';

interface CurrentUserContextValue {
  users: User[];
  userId: string | null;
  user: User | null;
  setUserId: (id: string) => void;
  loading: boolean;
}

const CurrentUserContext = createContext<CurrentUserContextValue | undefined>(undefined);

const STORAGE_KEY = 'accesshub.userId';

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserIdState] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiFetch<User[]>('/api/users')
      .then((list) => {
        if (cancelled) return;
        setUsers(list);
        if (!userId && list.length > 0) {
          setUserIdState(list[0].id);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setActiveUserId(userId);
    if (userId) localStorage.setItem(STORAGE_KEY, userId);
  }, [userId]);

  const value = useMemo<CurrentUserContextValue>(() => {
    const user = users.find((u) => u.id === userId) ?? null;
    return {
      users,
      userId,
      user,
      setUserId: setUserIdState,
      loading,
    };
  }, [users, userId, loading]);

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUser(): CurrentUserContextValue {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) throw new Error('useCurrentUser must be used within CurrentUserProvider');
  return ctx;
}
