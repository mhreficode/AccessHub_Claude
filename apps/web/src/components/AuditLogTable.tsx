import { useEffect, useState } from 'react';
import { fetchAuditLog } from '../api/keysApi';
import { useCurrentUser } from '../context/CurrentUserContext';
import { formatDate } from '../utils/formatters';
import type { AuditLog } from '../types';

export function AuditLogTable() {
  const { userId } = useCurrentUser();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!userId) return;
    setLoading(true);
    setError(null);
    fetchAuditLog()
      .then((d) => !cancelled && setLogs(d))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) return <p>Loading audit log…</p>;
  if (error) return <p style={{ color: '#c5221f' }}>{error}</p>;
  if (logs.length === 0) return <p>No audit events.</p>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '2px solid #dadce0' }}>
          <th style={{ padding: 8 }}>When</th>
          <th style={{ padding: 8 }}>Action</th>
          <th style={{ padding: 8 }}>Message</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((l) => (
          <tr key={l.id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: 8 }}>{formatDate(l.createdAt)}</td>
            <td style={{ padding: 8 }}>
              <code>{l.action}</code>
            </td>
            <td style={{ padding: 8 }}>{l.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
