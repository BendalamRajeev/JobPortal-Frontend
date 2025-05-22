
// User types
export type UserRole = 'jobseeker' | 'employer' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  name?: string;
  company?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Job types
export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  skills: string[];
  employerId: string;
  companyName?: string;
  createdAt: Date;
  salary?: string;
  jobType?: string; // full-time, part-time, contract, etc.
}

export interface JobFilters {
  search?: string;
  location?: string;
  skills?: string[];
  jobType?: string;
}

// Application types
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  resumeUrl: string;
  status: ApplicationStatus;
  appliedAt: Date;
  coverLetter?: string;
  applicantName?: string; // For displaying in employer dashboard
  jobTitle?: string; // For displaying in jobseeker dashboard
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
