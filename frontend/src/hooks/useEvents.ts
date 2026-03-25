import { useCallback, useEffect, useRef, useState } from "react";
import type { EventsResponse, PipefyEvent, StatsResponse } from "../types";

const API = "/api";
const MAX_LIVE_EVENTS = 50;

export function useEvents(actionFilter: string) {
  const [events, setEvents] = useState<PipefyEvent[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const sourceRef = useRef<EventSource | null>(null);

  const fetchInitial = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ per_page: "50" });
    if (actionFilter) params.set("action", actionFilter);

    const [eventsRes, statsRes] = await Promise.all([
      fetch(`${API}/events?${params}`),
      fetch(`${API}/stats`),
    ]);

    const eventsData: EventsResponse = await eventsRes.json();
    const statsData: StatsResponse = await statsRes.json();

    setEvents(eventsData.events);
    setStats(statsData);
    setLoading(false);
  }, [actionFilter]);

  useEffect(() => {
    fetchInitial();
  }, [fetchInitial]);

  // SSE só precisa ser aberto uma vez — filtro é aplicado localmente
  useEffect(() => {
    const source = new EventSource(`${API}/events/stream`);
    sourceRef.current = source;

    source.onopen = () => setConnected(true);
    source.onerror = () => setConnected(false);

    source.onmessage = (e) => {
      const data = JSON.parse(e.data);

      // sinal de limpeza vindo do DELETE /api/events
      if (data.__clear) {
        setEvents([]);
        setStats({ total: 0, by_action: {} });
        return;
      }

      const event: PipefyEvent = data;

      setStats((prev) => {
        if (!prev) return prev;
        return {
          total: prev.total + 1,
          by_action: {
            ...prev.by_action,
            [event.action]: (prev.by_action[event.action] ?? 0) + 1,
          },
        };
      });

      setEvents((prev) => {
        // respeita o filtro ativo ao adicionar via SSE
        if (actionFilter && event.action !== actionFilter) return prev;
        return [event, ...prev].slice(0, MAX_LIVE_EVENTS);
      });
    };

    return () => source.close();
  }, [actionFilter]);

  return { events, stats, connected, loading, refetch: fetchInitial };
}
