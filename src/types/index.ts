export enum ViewState {
  LANDING = 'LANDING',
  UPLOAD = 'UPLOAD',
  ROLE_SELECTION = 'ROLE_SELECTION',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS',
}

export type SeniorityLevel = 'Junior' | 'Mid' | 'Senior' | 'Lead';

export interface UserData {
  cvFile: File | null;
  cvLink: string;
  role: string;
  seniority: SeniorityLevel;
}

export interface JobMatch {
  id: string;
  company: string;
  role: string;
  fitScore: number;
  responseProb: number;
  logoUrl?: string;
  generatedAssets: {
    cv: string;
    coverLetter: string;
    email: string;
  };
}
