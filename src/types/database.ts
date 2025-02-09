export interface Job {
  id: string;
  company_id: string;
  title: string;
  department: string | null;
  description: string;
  requirements: string[];
  location: string;
  type: string;
  salary_range: {
    min: number;
    max: number;
    currency: string;
  } | null;
  status: 'draft' | 'published' | 'closed' | 'archived';
  published_at: string | null;
  closes_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  location: string | null;
  resume_url: string | null;
  experience_years: number | null;
  skills: string[];
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  candidate_id: string;
  status: 'new' | 'reviewing' | 'interviewing' | 'offered' | 'hired' | 'rejected';
  technical_score: number | null;
  communication_score: number | null;
  cultural_score: number | null;
  overall_score: number | null;
  notes: string | null;
  applied_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  recipient: string;
  type: 'email' | 'sms';
  subject: string | null;
  message: string;
  status: string;
  sent_at: string | null;
  created_at: string;
}

export interface JobDistribution {
  id: string;
  job_id: string;
  platform: string;
  external_id: string | null;
  status: 'pending' | 'posted' | 'failed' | 'expired';
  views: number;
  clicks: number;
  applications: number;
  posted_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface APIError extends Error {
  status?: number;
  code?: string;
}