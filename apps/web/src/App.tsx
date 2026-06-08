import { CurrentUserProvider, useCurrentUser } from './context/CurrentUserContext';
import { UserSwitcher } from './components/UserSwitcher';
import { Dashboard } from './routes/Dashboard';

function Shell() {
  const { loading, userId } = useCurrentUser();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: '#202124', minHeight: '100vh' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 24px',
          borderBottom: '1px solid #dadce0',
          background: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <strong style={{ fontSize: 20, color: '#1a73e8' }}>AccessHub</strong>
          <span style={{ color: '#5f6368', fontSize: 13 }}>Internal Developer Platform</span>
        </div>
        <UserSwitcher />
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
        {loading && <p>Loading…</p>}
        {!loading && !userId && <p>Select a user to get started.</p>}
        {!loading && userId && <Dashboard />}
      </main>
    </div>
  );
}

export function App() {
  return (
    <CurrentUserProvider>
      <Shell />
    </CurrentUserProvider>
  );
}
