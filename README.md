# SikshaSetu - AI-Powered Learning Platform

## Project Overview
SikshaSetu is an AI-powered tutoring system for foundational learning in Indian government schools, providing personalized support in literacy and numeracy with multilingual capabilities.

## ✅ Implemented Features

### 1. **Authentication & Role Management**
- Google Sign-In integration
- Three-step authentication flow:
  1. User signs in with Google
  2. System checks if user has a role
  3. New users select role (Student/Teacher/Parent)
- Role-based access control with `useRoleProtection` hook
- Automatic redirection based on user role

### 2. **Student Features**
- **Onboarding Process**:
  - Profile setup (name, grade, language, parent email)
  - AI-generated pre-assessment quiz
  - Grade-appropriate questions (visual for grades 1-2)
  - Text-to-speech for younger students
  - Results saved to Firestore
  
- **Learning Modules** (NEP 2020 based):
  - Grade-specific content (Grades 1-10)
  - Text-to-speech for module content
  - Interactive quizzes after each module
  - Mixed question types (MCQ, short answer, paragraph)
  - Pictorial questions for grades 1-2
  
- **AI Assessment**:
  - Peer comparison using Gemini AI
  - Reassessed scores with justification
  - Personalized recommendations
  - Strengths and improvement areas
  
- **Student Dashboard**:
  - Learning path with modules
  - Progress tracking
  - Streak and points display
  - AI ChatBot for doubts

### 3. **Teacher Features**
- **Class Selection**: Switch between multiple classes
- **Student Monitoring**:
  - Total students, average score, at-risk students
  - Comprehensive student table with:
    - Current level (Beginner/Intermediate/Advanced)
    - Score percentage
    - Learning pace (Fast/Moderate/Slow)
    - Pace rating (1-5 stars)
    - Modules completed
    - Progress trend (up/down/stable)
    - Last active time

### 4. **Parent Features**
- **Child Progress Tracking**:
  - Linked via parent email
  - Child's level and stats
  - Modules completed, average score
  - Current streak, time spent
  - Recent activity timeline
  - Upcoming modules preview
- Firestore query to fetch children by parent email

### 5. **AI Integration**
- **Google Gemini API**:
  - Quiz generation (grade-appropriate)
  - Module quiz creation
  - Peer reassessment
  - Personalized recommendations
  - ChatBot for student doubts

### 6. **Firebase Integration**
- **Authentication**: Google Sign-In
- **Firestore Database**:
  - Users collection with roles
  - Student profiles with parent email
  - Assessment results
  - Module scores
  - Completed modules tracking

### 7. **UI/UX Features**
- Dark/Light theme toggle
- Premium design with gradients
- Responsive layouts
- Loading states
- Role-based navigation
- Accessibility features (text-to-speech)

### 8. **Deployment Ready**
- **Docker Support**:
  - Multi-stage Dockerfile
  - Optimized production build
  - .dockerignore for build optimization
  
- **Google Cloud Deployment**:
  - Cloud Run configuration
  - Automated deployment script
  - Secret Manager integration
  - Comprehensive deployment guide

## 🚀 Deployment

### Local Development
```bash
npm install
npm run dev
```

### Production Deployment (Google Cloud)
```bash
# Update PROJECT_ID in deploy.sh
chmod +x deploy.sh
./deploy.sh
```

## 🔐 Security Features
- Role-based access control
- Firestore security rules ready
- Environment variables for secrets
- Google Secret Manager integration
- Non-root Docker container
- HTTPS by default (Cloud Run)

## 🎯 Key Technologies
- **Frontend**: Next.js 16, React, Vanilla CSS
- **Backend**: Firebase (Auth, Firestore)
- **AI**: Google Gemini 2.0 Flash
- **Deployment**: Docker, Google Cloud Run
- **Icons**: Lucide React

## 💰 Cost Estimate (Google Cloud)
- **Free Tier**: 2 million requests/month
- **Estimated**: ₹500-2000/month for moderate usage
- **Pay-per-use**: Only charged when app is running

---

**Built with ❤️ for Indian Government Schools**
