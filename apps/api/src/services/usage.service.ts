import { usageRepository } from '../repositories/usage.repository';

export interface ServiceUsageSummary {
  serviceId: string;
  total: number;
  failed: number;
  avgLatencyMs: number;
  rateLimited: number;
  rateLimitWarning: boolean;
}

export const usageService = {
  /**
   * Build a per-service usage summary.
   *
   * Workshop note (performance): this loads every usage event and aggregates in
   * memory. With real volume this would be a slow query. A grouped SQL aggregation
   * (see usageRepository.groupedByService) would be far cheaper.
   */
  async summary(): Promise<ServiceUsageSummary[]> {
    const events = await usageRepository.findAll();

    const byService = new Map<string, ServiceUsageSummary>();
    for (const e of events) {
      const s =
        byService.get(e.serviceId) ??
        {
          serviceId: e.serviceId,
          total: 0,
          failed: 0,
          avgLatencyMs: 0,
          rateLimited: 0,
          rateLimitWarning: false,
        };
      s.total += 1;
      if (!e.success) s.failed += 1;
      if (e.statusCode === 429) s.rateLimited += 1;
      s.avgLatencyMs += e.latencyMs;
      byService.set(e.serviceId, s);
    }

    const summaries = [...byService.values()].map((s) => ({
      ...s,
      avgLatencyMs: s.total ? Math.round(s.avgLatencyMs / s.total) : 0,
      rateLimitWarning: s.rateLimited > 5,
    }));

    summaries.sort((a, b) => b.total - a.total);
    return summaries;
  },
};
