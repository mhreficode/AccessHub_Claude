import { useUsage } from '../hooks/useUsage';

export function UsageSummary() {
  const { usage, loading, error } = useUsage();

  if (loading) return <p>Loading usage…</p>;
  if (error) return <p style={{ color: '#c5221f' }}>{error}</p>;
  if (usage.length === 0) return <p>No usage data.</p>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '2px solid #dadce0' }}>
          <th style={{ padding: 8 }}>Service</th>
          <th style={{ padding: 8 }}>Requests</th>
          <th style={{ padding: 8 }}>Failed</th>
          <th style={{ padding: 8 }}>Avg latency</th>
          <th style={{ padding: 8 }}>Rate limited</th>
        </tr>
      </thead>
      <tbody>
        {usage.map((row) => (
          <tr key={row.serviceId} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: 8 }}>
              {row.serviceId}
              {row.rateLimitWarning && (
                <span style={{ color: '#b06000', marginLeft: 8 }}>⚠ rate limit</span>
              )}
            </td>
            <td style={{ padding: 8 }}>{row.total}</td>
            <td style={{ padding: 8, color: row.failed > 0 ? '#c5221f' : undefined }}>
              {row.failed}
            </td>
            <td style={{ padding: 8 }}>{row.avgLatencyMs} ms</td>
            <td style={{ padding: 8 }}>{row.rateLimited}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
