import { extractText } from 'unpdf';
/* import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';

// 🔴 CRITICAL: disable PDF.js worker for Node / Next.js API routes
pdfjs.GlobalWorkerOptions.workerSrc = undefined; */

/**
 * Extract text content from a PDF buffer.
 * Uses unpdf (serverless PDF.js) to avoid worker path issues in Next.js.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const { text } = await extractText(new Uint8Array(buffer), {
      mergePages: true,
    });
    return text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Parse CV text and extract structured information
 */
export function parseCV(text: string) {
  const lines = text.split('\n').filter(line => line.trim());

  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/[\d\s\-\+\(\)]{10,}/);

  const skillsSection = extractSection(text, [
    'skills',
    'technical skills',
    'competencies',
  ]);

  const experienceSection = extractSection(text, [
    'experience',
    'work experience',
    'employment',
  ]);

  const educationSection = extractSection(text, [
    'education',
    'academic',
    'qualifications',
  ]);

  return {
    rawText: text,
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0].trim() : null,
    skills: skillsSection,
    experience: experienceSection,
    education: educationSection,
  };
}

/**
 * Helper function to extract sections from CV text
 */
function extractSection(text: string, headers: string[]): string {
  const lowerText = text.toLowerCase();

  for (const header of headers) {
    const headerIndex = lowerText.indexOf(header);
    if (headerIndex !== -1) {
      const nextHeaderIndex = findNextSection(
        lowerText,
        headerIndex + header.length
      );
      return text.substring(headerIndex, nextHeaderIndex).trim();
    }
  }

  return '';
}

/**
 * Find the start of the next section
 */
function findNextSection(text: string, startFrom: number): number {
  const commonHeaders = [
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'awards',
    'publications',
    'languages',
    'interests',
    'references',
  ];

  let minIndex = text.length;

  for (const header of commonHeaders) {
    const index = text.indexOf(header, startFrom);
    if (index !== -1 && index < minIndex) {
      minIndex = index;
    }
  }

  return minIndex;
}
