import { useState } from 'react';
import { useAccessRequests } from '../hooks/useAccessRequests';
import { useCurrentUser } from '../context/CurrentUserContext';
import { canApproveRequests } from '../utils/permissions';
import { approveRequest, rejectRequest } from '../api/accessApi';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../utils/formatters';

export function AccessRequestsTable() {
  const { user } = useCurrentUser();
  const { requests, loading, error, reload } = useAccessRequests();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [issuedKey, setIssuedKey] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // NOTE: this only controls whether the buttons render. The backend must also
  // enforce who can approve/reject.
  const showActions = canApproveRequests(user);

  async function onApprove(id: string) {
    setBusyId(id);
    setActionError(null);
    try {
      const result = await approveRequest(id);
      setIssuedKey(result.rawKey);
      await reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Approve failed');
    } finally {
      setBusyId(null);
    }
  }

  async function onReject(id: string) {
    setBusyId(id);
    setActionError(null);
    try {
      await rejectRequest(id, 'Rejected from dashboard');
      await reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Reject failed');
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p>Loading access requests…</p>;
  if (error) return <p style={{ color: '#c5221f' }}>{error}</p>;
  if (requests.length === 0) return <p>No access requests.</p>;

  return (
    <div>
      {issuedKey && (
        <div style={{ background: '#e6f4ea', padding: 12, borderRadius: 8, marginBottom: 12 }}>
          New API key (copy it now, it is shown only once): <code>{issuedKey}</code>
        </div>
      )}
      {actionError && <p style={{ color: '#c5221f' }}>{actionError}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #dadce0' }}>
            <th style={{ padding: 8 }}>Service</th>
            <th style={{ padding: 8 }}>Requester</th>
            <th style={{ padding: 8 }}>Reason</th>
            <th style={{ padding: 8 }}>Status</th>
            <th style={{ padding: 8 }}>Requested</th>
            {showActions && <th style={{ padding: 8 }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>{r.service?.name ?? r.serviceId}</td>
              <td style={{ padding: 8 }}>{r.requester?.name ?? r.requesterUserId}</td>
              <td style={{ padding: 8 }}>{r.reason}</td>
              <td style={{ padding: 8 }}>
                <StatusBadge status={r.status} />
              </td>
              <td style={{ padding: 8 }}>{formatDate(r.createdAt)}</td>
              {showActions && (
                <td style={{ padding: 8 }}>
                  {r.status === 'pending' ? (
                    <span style={{ display: 'flex', gap: 6 }}>
                      <button disabled={busyId === r.id} onClick={() => onApprove(r.id)}>
                        Approve
                      </button>
                      <button disabled={busyId === r.id} onClick={() => onReject(r.id)}>
                        Reject
                      </button>
                    </span>
                  ) : (
                    <span style={{ color: '#5f6368' }}>—</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
