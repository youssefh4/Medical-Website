## Medical Profile Website

A modern web application for patients to securely manage and share their medical information (conditions, medications, scans, lab results, and more) with healthcare providers.

### Core Features

- **Authentication & Profiles**  
  - Email/password login and registration (Firebase Auth with optional local fallback)  
  - Rich patient profile: full name, date of birth, blood type, allergies, emergency contact, profile photo

- **Medical Records Management**  
  - **Conditions**: add/edit/status tracking (active, resolved, chronic)  
  - **Medications**: dosage, frequency, prescriber, schedules, status (active/completed/discontinued)  
  - **Scans**: upload and view medical imaging (X‑ray, MRI, CT, etc.)  
  - **Lab Results**: upload PDFs or images of lab tests with metadata and notes

- **Secure Sharing (Read‑Only Links)**  
  - Generate time‑limited, revocable share links to a **snapshot** of your medical data  
  - Links are read‑only and designed for doctors/clinics to view without logging in

- **Community & AI Assistant**  
  - Optional community chat with basic moderation rules  
  - Optional AI health assistant (Gemini/OpenAI) for informational guidance (not medical advice)

- **UI / DX**  
  - Next.js App Router, TypeScript, Tailwind CSS  
  - Dark mode support and responsive layout

### Technology Stack

- **Frontend / Framework**: Next.js 14 (App Router), React 18, TypeScript  
- **Styling**: Tailwind CSS  
- **Data & Auth**: Firebase Auth + Firestore (with localStorage fallback for offline/demo)  
- **Other**: `date-fns` for dates

### Running the Project Locally

#### Prerequisites

- Node.js 18+  
- npm (or yarn/pnpm)

#### 1. Install dependencies

```bash
npm install
```

#### 2. Configure environment variables

Create a `.env.local` file in the project root (or use the provided `env.sample` as a template) and set your Firebase + optional AI keys:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional AI integrations
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

#### 3. Start the dev server

```bash
npm run dev
```

Then open `http://localhost:3000`.

#### 4. Build for production

```bash
npm run build
npm start
```

### Deploying to Vercel

- Connect the GitHub repo to Vercel and let it detect **Next.js** automatically.  
- In Vercel **Project → Settings → Environment Variables**, add the same Firebase and AI keys as above.  
- Redeploy after any env var changes so Next.js can pick them up.

### Project Structure (High Level)

```text
app/                # App Router routes
  api/chat/         # AI chat API endpoint
  login/            # Login page
  register/         # Registration page
  profile/          # Patient profile & records
  share/[token]/    # Read-only shared view of records
  community/        # Community chat
components/         # UI components (forms, cards, galleries, navigation, etc.)
lib/                # Firebase setup, auth helpers, storage abstraction
types/medical.ts    # Core domain models (User, Condition, Medication, Scan, LabResult, ShareLink, etc.)
```

### Usage Overview

1. **Create an account / login**  
2. **Complete your profile** with personal info, allergies, and emergency contact  
3. **Add records**: conditions, medications, scans, and lab results  
4. **Generate a share link** from the Profile page to share a read‑only snapshot with a doctor  
5. (Optional) **Enable AI chat** by adding an API key for richer explanations

### Security & Privacy

This project is designed as a **demo/educational** app:

- Data is stored in Firebase and/or browser localStorage depending on configuration.  
- No HIPAA or equivalent compliance is guaranteed.  
- For real patients and production use you **must** add:
  - A hardened backend and stricter access controls  
  - Proper encryption at rest and in transit  
  - Auditing, logging, and regulatory compliance checks

Use this codebase as a learning tool or prototype, not as a final production medical system.

