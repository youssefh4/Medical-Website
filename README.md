# Medical Profile Website

A modern, dynamic web application for patients to store and manage their medical records, including medical conditions and scan images.

## Features

- **User Authentication**: Secure login and registration system
- **Patient Profile**: Manage personal medical information
- **Medical Conditions**: Add, edit, and delete medical conditions with status tracking
- **Medications**: Track medications with dosage, frequency, and prescriber information
- **Medical Scans**: Upload and view medical scan images (X-Ray, MRI, CT Scan, etc.)
- **AI Health Assistant**: Chat with an AI assistant about your medical records (optional OpenAI integration)
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Local Storage**: Data stored in browser localStorage (simple start, can be upgraded to backend)

## Technology Stack

- **Next.js 14+**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern, utility-first CSS framework
- **JWT**: Token-based authentication
- **date-fns**: Date formatting utilities

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd medical-profile-website
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up AI Chat with Gemini or OpenAI:
   - Create a `.env.local` file in the root directory
   - Add your API key (choose one):
     - For Gemini: `GEMINI_API_KEY=your_gemini_api_key_here`
     - For OpenAI: `OPENAI_API_KEY=your_openai_api_key_here`
   - Gemini API is prioritized if both are provided
   - Without an API key, the chat will use rule-based responses

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
medical-profile-website/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── chat/          # AI chat API endpoint
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── profile/           # Patient profile page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard/home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navigation.tsx     # Main navigation bar
│   ├── ProtectedRoute.tsx # Route protection wrapper
│   ├── AIChat.tsx         # AI chat widget component
│   ├── MedicalRecordCard.tsx
│   ├── ConditionForm.tsx
│   ├── MedicationForm.tsx
│   ├── MedicationCard.tsx
│   ├── ScanGallery.tsx
│   └── UploadScan.tsx
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication logic
│   └── storage.ts        # LocalStorage management
├── types/                 # TypeScript type definitions
│   └── medical.ts
└── public/               # Static assets
```

## Usage

1. **Register/Login**: Create an account or sign in with existing credentials
2. **Dashboard**: View overview of your medical records
3. **Profile**: 
   - View and manage personal information (including allergies and emergency contacts)
   - Add/edit/delete medical conditions
   - Track medications with dosage and frequency
   - Upload and view medical scan images
4. **AI Chat**: Click the chat button (bottom right) to ask questions about your medical records

## Security Note

⚠️ **Important**: This application uses localStorage for data storage and simple JWT authentication. For production use with real medical data, you should:

- Implement a proper backend with database
- Use secure password hashing and verification
- Implement proper HIPAA compliance measures
- Use secure cloud storage for medical images
- Add proper encryption for sensitive data

## AI Chat Feature

The website includes an AI health assistant that can:
- Answer questions about your medical conditions
- Provide information about your medications
- Help you understand your medical scans
- Answer general health questions (with appropriate disclaimers)

**Setup Options:**
1. **With Gemini API** (Recommended): Add `GEMINI_API_KEY` to `.env.local` for advanced AI responses using Google's Gemini
2. **With OpenAI API**: Add `OPENAI_API_KEY` to `.env.local` for advanced AI responses using OpenAI's GPT models
3. **Without API Key**: The chat will use rule-based responses based on your medical data

**Note**: The AI assistant provides informational assistance only and cannot replace professional medical advice.

## License

This project is for educational/demonstration purposes.

