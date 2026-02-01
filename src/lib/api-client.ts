/**
 * API Client for ApplyKit Backend
 * Handles all communication with the backend API routes
 */

export interface CVAnalysis {
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    responsibilities: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  strengths: string[];
  recommendedRoles: string[];
}

export interface Job {
  id: string;
  company: string;
  role: string;
  location: string;
  jobType: string;
  description: string;
  requirements: string[];
  fitScore: number;
  responseProb: number;
  matchReason: string;
}

export interface GeneratedApplication {
  cv: string;
  coverLetter: string;
  email: string;
  jobId: string;
}

/**
 * Upload and parse CV PDF file
 */
export async function uploadCV(file: File) {
  const formData = new FormData();
  formData.append('cv', file);

  const response = await fetch('/api/upload-cv', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload CV');
  }

  return response.json();
}

/**
 * Analyze CV content using Gemini AI
 */
export async function analyzeCV(cvText: string, linkedInURL?: string): Promise<CVAnalysis> {
  const response = await fetch('/api/analyze-cv', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cvText, linkedInURL }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze CV');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Search for matching jobs based on CV analysis
 */
export async function searchJobs(
  cvAnalysis: CVAnalysis,
  targetRole: string,
  seniority: string
): Promise<Job[]> {
  const response = await fetch('/api/search-jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cvAnalysis, targetRole, seniority }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to search jobs');
  }

  const result = await response.json();
  return result.data.jobs;
}

/**
 * Generate tailored application materials for a specific job
 */
export async function generateApplication(
  cvText: string,
  job: {
    company: string;
    role: string;
    description: string;
    requirements: string[];
  },
  candidateInfo: {
    name?: string;
    email?: string;
    skills: string[];
    experience: any[];
  }
): Promise<GeneratedApplication> {
  const response = await fetch('/api/generate-applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cvText, job, candidateInfo }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate application');
  }

  const result = await response.json();
  return result.data;
}