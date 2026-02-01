import { NextRequest, NextResponse } from 'next/server';
import { generateJSON } from '@/lib/openai';

interface JobSearchResult {
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

interface JobSearchRequest {
  cvAnalysis: any;
  targetRole: string;
  seniority: string;
}

export async function POST(request: NextRequest) {
  try {
    const { cvAnalysis, targetRole, seniority }: JobSearchRequest = await request.json();

    if (!cvAnalysis || !targetRole) {
      return NextResponse.json(
        { error: 'CV analysis and target role are required' },
        { status: 400 }
      );
    }

    const prompt = `
You are a job matching AI. Based on the candidate's profile and their target role, generate a list of suitable job opportunities.

Candidate Profile:
- Skills: ${cvAnalysis.skills?.join(', ')}
- Experience: ${JSON.stringify(cvAnalysis.experience)}
- Strengths: ${cvAnalysis.strengths?.join(', ')}

Target Role: ${targetRole}
Seniority Level: ${seniority}

Generate 5-10 realistic job opportunities that would be a good fit. For each job, calculate:
1. Fit Score (0-100): How well the candidate matches the job requirements
2. Response Probability (0-100): Likelihood of getting a response based on profile match

Return a JSON array with this structure:
[
  {
    "id": "unique_id",
    "company": "Company Name",
    "role": "Job Title",
    "location": "City, Country or Remote",
    "jobType": "Full-time/Contract/Remote",
    "description": "Brief job description",
    "requirements": ["requirement1", "requirement2", ...],
    "fitScore": 85,
    "responseProb": 78,
    "matchReason": "Why this is a good match for the candidate"
  }
]

Make the companies and roles realistic and varied. Prioritize:
- Remote-first opportunities
- Companies known for high response rates
- Roles that align with ${seniority} level experience
`;

    const raw = await generateJSON<JobSearchResult[] | { jobs: JobSearchResult[] }>(prompt);
    // Gemini may return a raw array or an object with a jobs key
    const jobs = Array.isArray(raw) ? raw : (raw?.jobs ?? []);

    // Sort by fit score
    const sortedJobs = [...jobs].sort((a, b) => b.fitScore - a.fitScore);

    return NextResponse.json({
      success: true,
      data: {
        jobs: sortedJobs,
        totalMatches: sortedJobs.length,
      },
    });
  } catch (error) {
    console.error('Error searching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to search for jobs' },
      { status: 500 }
    );
  }
}