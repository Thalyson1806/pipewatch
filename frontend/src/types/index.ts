export interface PipefyEvent {
  id: number;
  action: string;
  card_id: string | null;
  card_title: string | null;
  pipe_id: string | null;
  pipe_name: string | null;
  phase_name: string | null;
  received_at: string;
}

export interface StatsResponse {
  total: number;
  by_action: Record<string, number>;
}

export interface EventsResponse {
  events: PipefyEvent[];
  total: number;
  pages: number;
  page: number;
}
