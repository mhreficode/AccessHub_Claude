import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';

const users = [
  { id: 'u-nina', name: 'Nina Developer', email: 'nina@test.dev', role: 'developer', team: 'Data' },
  { id: 'u-omar', name: 'Omar Owner', email: 'omar@test.dev', role: 'service_owner', team: 'Payments' },
];

const services = [
  {
    id: 'svc-payments',
    name: 'Payments API',
    slug: 'payments-api',
    description: 'Charges and refunds.',
    status: 'active',
    baseUrl: 'https://pay.test',
    docsMarkdown: '# Payments',
    ownerTeamId: 'team-payments',
    ownerTeam: { id: 'team-payments', name: 'Payments Team' },
  },
];

const requests = [
  {
    id: 'req-1',
    serviceId: 'svc-payments',
    requesterUserId: 'u-nina',
    reason: 'Need access for reporting.',
    status: 'pending',
    createdAt: new Date().toISOString(),
    service: { name: 'Payments API' },
    requester: { name: 'Nina Developer' },
  },
];

function mockFetch(url: string) {
  let data: unknown = [];
  if (url.endsWith('/api/users')) data = users;
  else if (url.includes('/api/access-requests')) data = requests;
  else if (url.includes('/api/services')) data = services;
  return Promise.resolve({
    ok: true,
    status: 200,
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response);
}

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL) => mockFetch(String(input))));
});

describe('Dashboard', () => {
  it('renders the service list', async () => {
    render(<App />);
    expect(await screen.findByText('Payments API')).toBeInTheDocument();
  });

  it('hides the approve button for developers', async () => {
    render(<App />);
    // Default acting user is the first one (a developer).
    await screen.findByText('Payments API');
    fireEvent.click(screen.getByText('Access Requests'));
    await screen.findByText('Need access for reporting.');
    expect(screen.queryByText('Approve')).not.toBeInTheDocument();
  });
});
