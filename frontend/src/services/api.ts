import axios from 'axios';

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  ''
).replace(/\/+$/, '');

export const WS_BASE_URL = (
  import.meta.env.VITE_WS_URL ||
  (API_BASE_URL ? API_BASE_URL.replace(/^http/, 'ws') : '')
).replace(/\/+$/, '');

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Intercept requests to inject JWT auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('codevault_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'CREATOR' | 'TEACHER';
  full_name?: string;
  avatar_url?: string;
  phone_number?: string;
  provider?: 'google' | 'github' | 'phone' | 'password' | 'demo';
  created_at: string;
}

export interface Program {
  id: number;
  title: string;
  description?: string;
  language: string;
  category: string;
  folder_id?: number;
  user_id: number;
  author_username?: string;
  is_public: boolean;
  source_code: string;
  content_hash?: string;
  created_at: string;
  updated_at: string;
  versions?: ProgramVersion[];
  test_cases?: TestCase[];
  version_count?: number;
  test_case_count?: number;
}

export interface ProgramVersion {
  id: number;
  program_id: number;
  version_number: number;
  source_code: string;
  content_hash: string;
  commit_message?: string;
  created_at: string;
}

export interface DiffResponse {
  from_version: number;
  to_version: number;
  diff_text: string;
  old_code: string;
  new_code: string;
}

export interface TestCase {
  id: number;
  program_id: number;
  input_data: string;
  expected_output: string;
  is_sample: boolean;
  order_index: number;
}

export interface ExecuteResult {
  status: 'success' | 'error' | 'timeout' | 'compilation_error' | 'tle' | 'mle';
  stdout?: string;
  stderr?: string;
  output: string;
  error?: string;
  execution_time_ms: number;
  executionTime?: number;
  memory?: number; // in KB
  exitCode?: number;
  exit_code?: number;
  error_type?: string;
  cached?: boolean;
}

export interface JudgeCaseResult {
  case_index: number;
  is_sample: boolean;
  input_data: string;
  expected_output: string;
  actual_output: string;
  status: 'Passed' | 'Failed' | 'Time Limit Exceeded' | 'Runtime Error';
  execution_time_ms: number;
  error_message?: string;
}

export interface JudgeSubmitResult {
  submission_id?: number;
  program_id: number;
  passed_count: number;
  total_count: number;
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  results: JudgeCaseResult[];
  created_at: string;
}

export interface Classroom {
  id: number;
  name: string;
  subject?: string;
  description?: string;
  section?: string;
  academic_level?: string;
  teacher_id: number;
  teacher_name?: string;
  invite_code: string;
  joining_enabled: boolean;
  is_teacher?: boolean;
  is_member?: boolean;
  created_at: string;
  updated_at?: string;
  member_count: number;
  resource_count?: number;
  assignment_count: number;
  announcement_count?: number;
}

export interface ClassResource {
  id: number;
  classroom_id: number;
  created_by: number;
  author_name?: string;
  resource_type: 'note' | 'code' | 'document' | 'link';
  title: string;
  description?: string;
  category: string;
  language?: string;
  source_code?: string;
  file_url?: string;
  file_name?: string;
  file_size_bytes?: number;
  created_at: string;
}

export interface ClassAnnouncement {
  id: number;
  classroom_id: number;
  teacher_id: number;
  author_name?: string;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
}

export interface ClassroomMember {
  id: number;
  classroom_id: number;
  student_id: number;
  student_name: string;
  student_username: string;
  student_email?: string;
  role: string;
  joined_at: string;
}

export interface ClassroomAssignment {
  id: number;
  classroom_id: number;
  program_id?: number;
  title: string;
  description?: string;
  instructions?: string;
  starter_code?: string;
  starter_language?: string;
  max_score?: number;
  program_title?: string;
  program_language?: string;
  due_date?: string;
  assigned_at: string;
  my_submission_status: string;
  my_score?: number;
  passed_count: number;
  total_count: number;
}

export interface LeaderboardEntry {
  student_id: number;
  student_name: string;
  student_username: string;
  passed_count: number;
  total_count: number;
  attempts: number;
  verdict: string;
  score?: number;
  last_submitted?: string;
}

export interface AnalyticsStats {
  program_id: number;
  title: string;
  views: number;
  runs: number;
  copies: number;
  last_run_at?: string;
  trend_30_days: { date: string; views: number; runs: number; copies: number }[];
}

export interface AIResponse {
  provider: string;
  model?: string;
  explanation?: string;
  response?: string;
  suggested_code?: string;
  diff_text?: string;
  disclaimer: string;
}

export interface ImportResult {
  imported_count: number;
  folders_created: number;
  skipped_count: number;
  programs: Program[];
}
