import { useState } from 'react';
import { useServices } from '../hooks/useServices';
import { ServiceCard } from './ServiceCard';
import type { Service } from '../types';

export function ServiceList({ onOpen }: { onOpen: (s: Service) => void }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { services, loading, error } = useServices({
    status: status || undefined,
    search: search || undefined,
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Search services…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #dadce0' }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #dadce0' }}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="deprecated">Deprecated</option>
        </select>
      </div>

      {loading && <p>Loading services…</p>}
      {error && <p style={{ color: '#c5221f' }}>{error}</p>}
      {!loading && !error && services.length === 0 && <p>No services found.</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}
      >
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}
