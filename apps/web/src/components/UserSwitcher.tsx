import { useCurrentUser } from '../context/CurrentUserContext';
import { titleCase } from '../utils/formatters';

/** Seeded user selector. Acts as the simplified "login" for the workshop. */
export function UserSwitcher() {
  const { users, userId, setUserId } = useCurrentUser();

  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
      <span style={{ color: '#5f6368' }}>Acting as</span>
      <select
        value={userId ?? ''}
        onChange={(e) => setUserId(e.target.value)}
        style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #dadce0' }}
      >
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name} — {titleCase(u.role)}
          </option>
        ))}
      </select>
    </label>
  );
}
