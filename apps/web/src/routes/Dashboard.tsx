import { useState } from 'react';
import { useCurrentUser } from '../context/CurrentUserContext';
import { canViewAuditLog } from '../utils/permissions';
import { ServiceList } from '../components/ServiceList';
import { AccessRequestsTable } from '../components/AccessRequestsTable';
import { ApiKeysTable } from '../components/ApiKeysTable';
import { UsageSummary } from '../components/UsageSummary';
import { AuditLogTable } from '../components/AuditLogTable';
import { ServiceDetail } from './ServiceDetail';
import type { Service } from '../types';

type Tab = 'services' | 'requests' | 'keys' | 'usage' | 'audit';

const BASE_TABS: { id: Tab; label: string }[] = [
  { id: 'services', label: 'Services' },
  { id: 'requests', label: 'Access Requests' },
  { id: 'keys', label: 'API Keys' },
  { id: 'usage', label: 'Usage' },
];

export function Dashboard() {
  const { user } = useCurrentUser();
  const [tab, setTab] = useState<Tab>('services');
  const [selected, setSelected] = useState<Service | null>(null);

  const tabs = canViewAuditLog(user)
    ? [...BASE_TABS, { id: 'audit' as Tab, label: 'Audit Log' }]
    : BASE_TABS;

  return (
    <div>
      <nav style={{ display: 'flex', gap: 4, borderBottom: '1px solid #dadce0', marginBottom: 16 }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 14px',
              border: 'none',
              borderBottom: tab === t.id ? '2px solid #1a73e8' : '2px solid transparent',
              background: 'none',
              cursor: 'pointer',
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? '#1a73e8' : '#3c4043',
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'services' && <ServiceList onOpen={setSelected} />}
      {tab === 'requests' && <AccessRequestsTable />}
      {tab === 'keys' && <ApiKeysTable />}
      {tab === 'usage' && <UsageSummary />}
      {tab === 'audit' && <AuditLogTable />}

      {selected && <ServiceDetail serviceId={selected.id} onClose={() => setSelected(null)} />}
    </div>
  );
}
