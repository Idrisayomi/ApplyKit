# ApplyKit

> AI-powered job application assistant that automates CV tailoring, cover letter writing, and application email generation.



## 🚀 Overview

ApplyKit is an AI-powered web application that streamlines the job application process. Upload your CV once, specify your target role, and let AI generate tailored application materials for multiple job opportunities automatically.

**Live Demo:** [applykit.vercel.app](https://applykit.vercel.app) *(replace with your actual URL)*

## ✨ Features

- **📄 CV Upload & Parsing** - Upload PDF resumes and extract structured information
- **🤖 AI-Powered Job Matching** - Find relevant job opportunities based on your skills and experience
- **✍️ Tailored CV Generation** - Auto-customize your CV for each specific job role
- **💌 Cover Letter Writing** - Generate professional, personalized cover letters
- **📧 Application Email Drafting** - Create ready-to-send application emails
- **📋 Copy & Export** - Easy copy-to-clipboard for all generated materials
- **🎨 Modern UI** - Clean, animated interface with smooth transitions

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework for production
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library

### Backend & AI
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Serverless backend
- **[OpenAI API](https://openai.com/api/)** - GPT-4 for content generation
- **[unpdf](https://github.com/unjs/unpdf)** - PDF text extraction

### Deployment
- **[Vercel](https://vercel.com/)** - Hosting and continuous deployment

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/idrisayomi/applykit.git
cd applykit
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How It Works

### Step 1: Upload Your CV
- Upload your resume as a PDF (max 10MB)
- The app extracts text and parses your information (name, email, skills, experience)

### Step 2: Specify Target Role
- Enter the job title you're looking for (e.g., "Frontend Developer")
- Select your seniority level (Junior, Mid, Senior, Lead)

### Step 3: AI Processing
The app performs three key operations:

1. **CV Analysis** - OpenAI analyzes your CV to extract:
   - Technical skills
   - Work experience
   - Education
   - Key strengths
   - Recommended roles

2. **Job Matching** - AI generates relevant job opportunities:
   - Calculates fit score (how well you match)
   - Estimates response probability
   - Provides match reasoning

3. **Application Generation** - For each job, AI creates:
   - Tailored CV with relevant keywords
   - Personalized cover letter
   - Professional application email

### Step 4: Review & Apply
- Browse matched job opportunities
- Click any job to view generated materials
- Copy or download application documents
- Send applications directly to companies

## 📁 Project Structure

```
applykit/
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── upload-cv/     # CV upload endpoint
│   │   │   ├── analyze-cv/    # CV analysis endpoint
│   │   │   ├── search-jobs/   # Job matching endpoint
│   │   │   └── generate-applications/  # Application generation
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main page component
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── Button.tsx         # Reusable button component
│   │   ├── Input.tsx          # Reusable input component
│   │   └── ConfirmationModal.tsx  # Modal component
│   ├── views/
│   │   ├── LandingView.tsx    # Landing page
│   │   ├── UploadCVView.tsx   # CV upload screen
│   │   ├── RoleSelectionView.tsx  # Role selection screen
│   │   ├── ProcessingView.tsx # AI processing screen
│   │   └── ResultsView.tsx    # Results & applications
│   ├── lib/
│   │   ├── openai.ts          # OpenAI API client
│   │   ├── pdf-parser.ts      # PDF text extraction
│   │   ├── api-client.ts      # Frontend API client
│   │   └── linkedin-scraper.ts  # LinkedIn URL handling
│   └── types/
│       └── index.ts           # TypeScript type definitions
├── public/                    # Static assets
├── .env.local                 # Environment variables (not in repo)
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## 🔧 API Routes

### `POST /api/upload-cv`
Upload and parse CV PDF file.

**Request:** `multipart/form-data` with CV file  
**Response:** Parsed CV data (text, email, phone, skills, etc.)

### `POST /api/analyze-cv`
Analyze CV content using OpenAI.

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
  "skills": ["React", "TypeScript", ...],
  "experience": [...],
  "education": [...],
  "strengths": [...],
  "recommendedRoles": [...]
}
```

### `POST /api/search-jobs`
Find matching job opportunities.

**Request:**
```json
{
  "cvAnalysis": { ... },
  "targetRole": "Frontend Developer",
  "seniority": "Mid"
}
```

**Response:**
```json
{
  "jobs": [
    {
      "company": "TechCorp",
      "role": "Senior Frontend Engineer",
      "fitScore": 94,
      "responseProb": 88,
      "description": "...",
      "requirements": [...],
      "matchReason": "..."
    }
  ]
}
```

### `POST /api/generate-applications`
Generate tailored application materials.

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
    "phone": "+234 XXX XXX XXXX",
    "skills": [...],
    "experience": [...]
  }
}
```

**Response:**
```json
{
  "cv": "Tailored CV content...",
  "coverLetter": "Cover letter content...",
  "email": "Application email content...",
  "jobId": "techcorp_senior_frontend_engineer"
}
```

## 🎨 Design System

### Color Palette
- **Brand (Cyan):** `#0ea5e9` - Primary actions, links, highlights
- **Background:** `#0f172a` - Dark slate background
- **Surface:** `#1e293b` - Card backgrounds
- **Text:** `#f8fafc` - Primary text
- **Muted:** `#64748b` - Secondary text

### Typography
- **Headings:** Geist Sans (Bold)
- **Body:** Geist Sans (Regular)
- **Code:** Geist Mono

## 🚢 Deployment

This project is deployed on [Vercel](https://apply-kit-git-main-akintunde-idris-projects.vercel.app/).

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/applykit)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables:
   - `OPENAI_API_KEY`
4. Deploy!

Vercel will automatically deploy on every push to your main branch.

## ⚙️ Configuration

### OpenAI Models
The app uses different OpenAI models for different tasks:

- **CV Analysis:** `gpt-4` (better accuracy)
- **Job Search:** `gpt-4` (complex reasoning)
- **Application Generation:** `gpt-3.5-turbo` (faster, cost-effective)

You can modify these in `src/lib/openai.ts`.

### PDF Upload Limits
- Maximum file size: 10MB
- Supported format: PDF only

Modify in `src/app/api/upload-cv/route.ts`.

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your app URL (for metadata) | No |

## 🐛 Known Limitations

- LinkedIn URL scraping is not implemented (marked as "Coming Soon")
- Applications are generated on-demand (not batch processed)
- No user authentication (MVP version)
- No application history persistence (localStorage only)
- OpenAI API costs apply per generation

## 🗺️ Roadmap

- [ ] User authentication & dashboard
- [ ] Application tracking system
- [ ] Email integration for direct sending
- [ ] LinkedIn profile scraping
- [ ] Multiple CV templates
- [ ] Interview preparation assistant
- [ ] Browser extension

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [OpenAI](https://openai.com/) for the GPT API
- [Vercel](https://vercel.com/) for hosting
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Framer Motion](https://www.framer.com/motion/) for animations

## 📧 Contact

Akintunde Idris - [@HarlomaWAGMI](https://twitter.com/HarlomaWAGMI) - idrisayomide006@gmail.com

Project Link: [https://github.com/idrisayomi/applykit]
---

**Made with ❤️ by [Akintunde Idris]**