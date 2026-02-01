import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF, parseCV } from '@/lib/pdf-parser';

export const runtime = 'nodejs';


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('cv') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from PDF
    const text = await extractTextFromPDF(buffer);

    // Parse CV content
    const parsedCV = parseCV(text);

    return NextResponse.json({
      success: true,
      data: {
        fileName: file.name,
        fileSize: file.size,
        parsedCV,
      },
    });
  } catch (error) {
    console.error('Error uploading CV:', error);
    return NextResponse.json(
      { error: 'Failed to process CV' },
      { status: 500 }
    );
  }
}