import { statusColor, titleCase } from '../utils/formatters';

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        color: '#fff',
        backgroundColor: statusColor(status),
      }}
    >
      {titleCase(status)}
    </span>
  );
}
