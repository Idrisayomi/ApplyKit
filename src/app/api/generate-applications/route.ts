import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/openai';

interface ApplicationRequest {
  cvText: string;
  job: {
    company: string;
    role: string;
    description: string;
    requirements: string[];
  };
  candidateInfo: {
    name?: string;
    email?: string;
    skills: string[];
    experience: any[];
  };
}

export async function POST(request: NextRequest) {
  try {
    const { cvText, job, candidateInfo }: ApplicationRequest = await request.json();

    if (!cvText || !job) {
      return NextResponse.json(
        { error: 'CV text and job details are required' },
        { status: 400 }
      );
    }

    // Generate tailored CV
    const cvPrompt = `
Create a tailored CV for the following job application:

Original CV:
${cvText}

Target Job:
- Company: ${job.company}
- Role: ${job.role}
- Description: ${job.description}
- Requirements: ${(job.requirements ?? []).join(', ')}

Instructions:
1. Reorganize the experience section to highlight relevant skills for this role
2. Add keywords from the job requirements naturally throughout
3. Emphasize achievements that match the job description
4. Keep it professional and ATS-friendly
5. Maintain the original information but reframe it to match the role

Format the CV in a clean, professional text format suitable for copying.
`;

    // Generate cover letter
    const coverLetterPrompt = `
Write a compelling cover letter for this job application:

Job Details:
- Company: ${job.company}
- Role: ${job.role}
- Description: ${job.description}

Candidate Skills: ${(candidateInfo?.skills ?? []).join(', ')}
Candidate Experience: ${JSON.stringify(candidateInfo?.experience ?? [])}

Instructions:
1. Express genuine interest in the company and role
2. Highlight 2-3 key achievements that match the job requirements
3. Show knowledge of the company (be professional but don't make specific claims)
4. Keep it concise (250-350 words)
5. Professional but warm tone
6. Strong opening and closing

Format as a professional cover letter ready to be copied or sent.
`;

    // Generate application email
    const emailPrompt = `
Write a professional job application email for:

Job: ${job.role} at ${job.company}
Candidate: ${candidateInfo.name || '[Your Name]'}

Instructions:
1. Subject line that gets attention
2. Brief introduction (2-3 sentences)
3. Mention attached CV and cover letter
4. Express enthusiasm
5. Professional closing
6. Keep it short and impactful (under 150 words)

Format:
Subject: [Subject Line]

[Email Body]
`;

    // Generate all three documents in parallel
    const [tailoredCV, coverLetter, applicationEmail] = await Promise.all([
         generateText(cvPrompt),
         generateText(coverLetterPrompt),
         generateText(emailPrompt),
     ]);


    return NextResponse.json({
      success: true,
      data: {
        cv: tailoredCV,
        coverLetter: coverLetter,
        email: applicationEmail,
        jobId: `${job.company}_${job.role}`.replace(/\s+/g, '_').toLowerCase(),
      },
    });
  } catch (error) {
    console.error('Error generating applications:', error);
    return NextResponse.json(
      { error: 'Failed to generate application materials' },
      { status: 500 }
    );
  }
}