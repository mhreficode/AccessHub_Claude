import type { Service } from '../types';
import { StatusBadge } from './StatusBadge';

export function ServiceCard({ service, onOpen }: { service: Service; onOpen: (s: Service) => void }) {
  return (
    <button
      onClick={() => onOpen(service)}
      style={{
        textAlign: 'left',
        border: '1px solid #dadce0',
        borderRadius: 10,
        padding: 16,
        background: '#fff',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontSize: 16 }}>{service.name}</strong>
        <StatusBadge status={service.status} />
      </div>
      <p style={{ margin: 0, color: '#3c4043', fontSize: 14 }}>{service.description}</p>
      <span style={{ color: '#5f6368', fontSize: 12 }}>
        Owner: {service.ownerTeam?.name ?? service.ownerTeamId}
      </span>
    </button>
  );
}
