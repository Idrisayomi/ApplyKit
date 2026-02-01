# ApplyKit Backend Documentation

## Overview
Backend API routes for CV analysis, job matching, and application generation using Google's Gemini AI.

## Setup

### 1. Install Dependencies
```bash
npm install pdf-parse @google/generative-ai
```

### 2. Environment Variables
Create a `.env.local` file in your project root:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your Gemini API key from: https://aistudio.google.com/app/apikey

### 3. Folder Structure
```
app/
├── api/
│   ├── upload-cv/route.ts          # Handle CV file uploads
│   ├── analyze-cv/route.ts         # Analyze CV with Gemini
│   ├── search-jobs/route.ts        # Find matching jobs
│   └── generate-applications/route.ts  # Generate tailored materials
lib/
├── gemini.ts                       # Gemini API client
├── pdf-parser.ts                   # PDF text extraction
└── linkedin-scrapper.ts            # LinkedIn URL handling
```

## API Endpoints

### 1. Upload CV
**POST** `/api/upload-cv`

Upload and parse a CV PDF file.

**Request:**
- Content-Type: `multipart/form-data`
- Body: FormData with `cv` field containing PDF file

**Response:**
```json
{
  "success": true,
  "data": {
    "fileName": "resume.pdf",
    "fileSize": 123456,
    "parsedCV": {
      "rawText": "...",
      "email": "user@example.com",
      "skills": "...",
      "experience": "...",
      "education": "..."
    }
  }
}
```

### 2. Analyze CV
**POST** `/api/analyze-cv`

Analyze CV content using Gemini AI.

**Request:**
```json
{
  "cvText": "Full CV text content...",
  "linkedInURL": "https://linkedin.com/in/username" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "skills": ["React", "TypeScript", "Node.js"],
    "experience": [...],
    "education": [...],
    "strengths": [...],
    "recommendedRoles": [...]
  }
}
```

### 3. Search Jobs
**POST** `/api/search-jobs`

Find matching job opportunities.

**Request:**
```json
{
  "cvAnalysis": { ... },
  "targetRole": "Frontend Engineer",
  "seniority": "Mid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "...",
        "company": "TechCorp",
        "role": "Senior Frontend Engineer",
        "fitScore": 94,
        "responseProb": 88,
        "description": "...",
        "requirements": [...],
        "matchReason": "..."
      }
    ],
    "totalMatches": 10
  }
}
```

### 4. Generate Applications
**POST** `/api/generate-applications`

Generate tailored CV, cover letter, and email for a specific job.

**Request:**
```json
{
  "cvText": "Original CV content...",
  "job": {
    "company": "TechCorp",
    "role": "Senior Frontend Engineer",
    "description": "...",
    "requirements": [...]
  },
  "candidateInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "skills": [...],
    "experience": [...]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cv": "Tailored CV content...",
    "coverLetter": "Cover letter content...",
    "email": "Application email content...",
    "jobId": "techcorp_senior_frontend_engineer"
  }
}
```

## Error Handling

All endpoints return errors in this format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad Request (missing or invalid data)
- `500` - Internal Server Error (API or processing failure)

## Notes

1. **PDF Parsing**: Only PDF files are supported for CV uploads (max 10MB)
2. **LinkedIn URLs**: Currently stores URLs for reference. Direct scraping requires LinkedIn API access or third-party services
3. **Rate Limiting**: Consider implementing rate limiting for production
4. **File Storage**: CV files are processed in-memory. For production, consider cloud storage (AWS S3, etc.)
5. **Gemini Models**: 
   - `gemini-1.5-flash` - Fast, cost-effective
   - `gemini-1.5-pro` - Higher quality, more expensive

## Next Steps

1. Add your Gemini API key to `.env.local`
2. Test each endpoint with Postman or similar tool
3. Integrate the API calls into your frontend components
4. Add error handling and loading states
5. Consider adding authentication for production use