import { NextRequest, NextResponse } from 'next/server';
import { generateJSON } from '@/lib/openai';



interface CVAnalysis {
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

export async function POST(request: NextRequest) {
  try {
    const { cvText, linkedInURL } = await request.json();

    if (!cvText && !linkedInURL) {
      return NextResponse.json(
        { error: 'CV text or LinkedIn URL is required' },
        { status: 400 }
      );
    }

    const prompt = `
Analyze the following CV/resume and extract structured information:

${cvText || `LinkedIn Profile: ${linkedInURL}`}

Return a JSON object with the following structure:
{
  "skills": ["skill1", "skill2", ...],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start - End",
      "responsibilities": ["responsibility1", "responsibility2", ...]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "School Name",
      "year": "Graduation Year"
    }
  ],
  "strengths": ["strength1", "strength2", ...],
  "recommendedRoles": ["role1", "role2", ...]
}

Extract all relevant information and provide recommendations for suitable job roles based on the candidate's profile.
`;

    const analysis = await generateJSON<CVAnalysis>(prompt);

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Error analyzing CV:', error);
    return NextResponse.json(
      { error: 'Failed to analyze CV' },
      { status: 500 }
    );
  }
}