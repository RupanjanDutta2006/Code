import { api } from './api';

export interface ActivityEvent {
  id: number;
  event_id: string;
  actor_uid: string;
  actor_email?: string;
  actor_name?: string;
  action: string;
  category: 'auth' | 'account' | 'profile' | 'classroom' | 'resource' | 'assignment' | 'compiler' | 'program' | 'ai' | 'settings' | 'admin' | string;
  resource_type?: string;
  resource_id?: string;
  classroom_id?: string;
  outcome: 'success' | 'failure' | 'denied';
  source: 'server' | 'verified-client-event' | 'system' | string;
  trust_level: 'server-verified' | 'client-reported' | string;
  request_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ActivityPagination {
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  events: ActivityEvent[];
}

export interface AdminActivityStats {
  total_events: number;
  events_today: number;
  total_users_active: number;
  success_rate_percent: number;
  category_counts: Record<string, number>;
}

export interface ActivityFilterParams {
  category?: string;
  action?: string;
  outcome?: string;
  time_range?: 'today' | '7d' | '30d' | 'all';
  page?: number;
  page_size?: number;
}

export interface AdminActivityFilterParams extends ActivityFilterParams {
  search?: string;
  actor_uid?: string;
  sort_order?: 'desc' | 'asc';
}

/**
 * Fetch activity history for the currently authenticated user.
 */
export const getUserActivity = async (params?: ActivityFilterParams): Promise<ActivityPagination> => {
  const res = await api.get<ActivityPagination>('/api/activity', { params });
  return res.data;
};

/**
 * Safely log a client-side action (e.g. login, code execution, AI prompt interaction).
 * Fails silently to prevent blocking any user action.
 */
export const logClientActivity = async (payload: {
  action: string;
  category?: string;
  resource_type?: string;
  resource_id?: string;
  classroom_id?: string;
  outcome?: 'success' | 'failure' | 'denied';
  metadata?: Record<string, any>;
}): Promise<ActivityEvent | null> => {
  try {
    const res = await api.post<ActivityEvent>('/api/activity/log', payload);
    return res.data;
  } catch (err) {
    // Non-blocking telemetry
    console.debug('Activity logging note:', err);
    return null;
  }
};

/**
 * Fetch global system activity for authorized Administrators.
 */
export const getAdminActivity = async (params?: AdminActivityFilterParams): Promise<ActivityPagination> => {
  const res = await api.get<ActivityPagination>('/api/admin/activity', { params });
  return res.data;
};

/**
 * Fetch summary statistics for the Admin Audit Dashboard.
 */
export const getAdminActivityStats = async (): Promise<AdminActivityStats> => {
  const res = await api.get<AdminActivityStats>('/api/admin/activity/stats');
  return res.data;
};
