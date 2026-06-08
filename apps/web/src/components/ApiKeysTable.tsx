import { useState } from 'react';
import { useApiKeys } from '../hooks/useApiKeys';
import { useCurrentUser } from '../context/CurrentUserContext';
import { canRevokeKey } from '../utils/permissions';
import { revokeApiKey } from '../api/keysApi';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../utils/formatters';

export function ApiKeysTable() {
  const { user } = useCurrentUser();
  const { keys, loading, error, reload } = useApiKeys();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function onRevoke(id: string) {
    setBusyId(id);
    try {
      await revokeApiKey(id);
      await reload();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p>Loading API keys…</p>;
  if (error) return <p style={{ color: '#c5221f' }}>{error}</p>;
  if (keys.length === 0) return <p>No API keys.</p>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '2px solid #dadce0' }}>
          <th style={{ padding: 8 }}>Label</th>
          <th style={{ padding: 8 }}>Service</th>
          <th style={{ padding: 8 }}>Key</th>
          <th style={{ padding: 8 }}>Status</th>
          <th style={{ padding: 8 }}>Created</th>
          <th style={{ padding: 8 }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {keys.map((k) => (
          <tr key={k.id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: 8 }}>{k.label}</td>
            <td style={{ padding: 8 }}>{k.serviceName ?? k.serviceId}</td>
            <td style={{ padding: 8 }}>
              <code>{k.maskedKey}</code>
            </td>
            <td style={{ padding: 8 }}>
              <StatusBadge status={k.status} />
            </td>
            <td style={{ padding: 8 }}>{formatDate(k.createdAt)}</td>
            <td style={{ padding: 8 }}>
              {k.status === 'active' && canRevokeKey(user, k) ? (
                <button disabled={busyId === k.id} onClick={() => onRevoke(k.id)}>
                  Revoke
                </button>
              ) : (
                <span style={{ color: '#5f6368' }}>—</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
