# Interview Preparation Platform

A modern web application built with Next.js and Firebase to help users prepare for technical interviews through AI-powered mock interviews and practice sessions.

## 🚀 Features

- **AI-Powered Mock Interviews**: Practice with an AI agent that simulates real interview scenarios
- **Authentication System**: Secure user authentication with Firebase
- **Responsive Design**: Modern UI built with Tailwind CSS and Radix UI components

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 15.2.3
- **UI Components**: 
  - Tailwind CSS
  - Radix UI
  - Lucide React (Icons)
- **Authentication**: Firebase
- **Form Handling**: 
  - React Hook Form
  - Zod (Schema validation)
- **AI Integration**: 
  - Google AI SDK
  - Vapi AI
- **State Management**: React Hooks
- **Styling**: 
  - Tailwind CSS
  - CSS Animations
  - Class Variance Authority

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (root)/            # Main application routes
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── AuthForm.tsx      # Authentication form
│   ├── InterviewCard.tsx # Interview session card
│   └── Agent.tsx         # AI interview agent
├── firebase/             # Firebase configuration
├── lib/                  # Utility functions
├── public/              # Static assets
└── types/               # TypeScript type definitions
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd interview_prep
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## 🔒 Authentication

The application uses Firebase Authentication for user management. Features include:
- Email/Password authentication
- Password reset functionality
- Secure session management

## 🎨 UI Components

The application uses a combination of custom components and Radix UI primitives:
- Form fields with validation
- Interview cards for session management
- Authentication forms
- Responsive navigation
- Toast notifications

