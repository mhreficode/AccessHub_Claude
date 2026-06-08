import { useEffect, useState } from 'react';
import { fetchService, requestAccess } from '../api/servicesApi';
import { renderMarkdownUnsafe } from '../utils/markdown';
import { StatusBadge } from '../components/StatusBadge';
import type { Service } from '../types';

export function ServiceDetail({ serviceId, onClose }: { serviceId: string; onClose: () => void }) {
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchService(serviceId)
      .then((s) => !cancelled && setService(s))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : 'Failed to load'));
    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  async function onRequest() {
    setSubmitting(true);
    setMessage(null);
    setError(null);
    try {
      await requestAccess(serviceId, reason);
      setMessage('Access requested. An owner will review it.');
      setReason('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 560, maxWidth: '100%', background: '#fff', height: '100%', overflowY: 'auto', padding: 24 }}
      >
        <button onClick={onClose} style={{ float: 'right' }}>
          Close
        </button>

        {error && <p style={{ color: '#c5221f' }}>{error}</p>}
        {!service && !error && <p>Loading…</p>}

        {service && (
          <>
            <h2 style={{ marginTop: 0 }}>
              {service.name} <StatusBadge status={service.status} />
            </h2>
            <p style={{ color: '#3c4043' }}>{service.description}</p>
            <p style={{ fontSize: 13, color: '#5f6368' }}>
              Base URL: <code>{service.baseUrl}</code>
            </p>

            <h3>Documentation</h3>
            {/* SECURITY TODO: docsMarkdown is rendered without sanitization. */}
            <div
              style={{ borderTop: '1px solid #eee', paddingTop: 12 }}
              dangerouslySetInnerHTML={{ __html: renderMarkdownUnsafe(service.docsMarkdown) }}
            />

            <h3>Request access</h3>
            {message && <p style={{ color: '#137333' }}>{message}</p>}
            <textarea
              placeholder="Why do you need access? (at least 10 characters)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #dadce0' }}
            />
            <button disabled={submitting || reason.trim().length < 10} onClick={onRequest}>
              Request access
            </button>
          </>
        )}
      </div>
    </div>
  );
}
