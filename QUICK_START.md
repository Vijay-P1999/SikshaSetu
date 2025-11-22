# SikshaSetu - Quick Deployment Guide

## 🚀 5-Minute Deployment

### Prerequisites
- Google Cloud account with billing enabled
- gcloud CLI installed
- Project ID: `sikshasetu-479009`

### Quick Steps

```bash
# 1. Login and set project
gcloud auth login
gcloud config set project sikshasetu-479009
gcloud config set run/region asia-south1

# 2. Enable APIs
gcloud services enable run.googleapis.com containerregistry.googleapis.com cloudbuild.googleapis.com

# 3. Build image
gcloud builds submit --tag gcr.io/sikshasetu-479009/sikshasetu

# 4. Deploy
gcloud run deploy sikshasetu \
  --image gcr.io/sikshasetu-479009/sikshasetu \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --set-env-vars NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  --set-env-vars NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain \
  --set-env-vars NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project \
  --set-env-vars NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket \
  --set-env-vars NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender \
  --set-env-vars NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id \
  --set-env-vars NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key

# 5. Get URL
gcloud run services describe sikshasetu --format='value(status.url)'
```

## 📋 Environment Variables Needed

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_GEMINI_API_KEY=
```

## 🔍 Common Commands

```bash
# View logs
gcloud run services logs tail sikshasetu

# Update service
gcloud run services update sikshasetu --memory 4Gi

# Delete service
gcloud run services delete sikshasetu

# List services
gcloud run services list
```

## 💡 Tech Stack Summary

| Component | Technology |
|-----------|-----------|
| **Frontend** | Next.js 16 + React 19 |
| **Styling** | Vanilla CSS |
| **Auth** | Firebase Authentication |
| **Database** | Cloud Firestore |
| **AI** | Google Gemini 2.0 |
| **Deployment** | Docker + Cloud Run |
| **Region** | asia-south1 (Mumbai) |

## 📊 Cost Estimate

- **Free tier**: 2M requests/month
- **Moderate usage**: ₹1500-2000/month
- **High usage**: ₹3000-5000/month

## 🎯 Key Features

✅ Role-based access (Student/Teacher/Parent)
✅ AI-powered quizzes (5-10 questions)
✅ 30+ learning modules (Grades 1-10)
✅ Peer assessment with Gemini AI
✅ Text-to-speech for younger students
✅ Dark/Light theme
✅ Multilingual support (English/Hindi)
✅ NEP 2020 aligned content

## 📞 Quick Links

- **Firebase Console**: https://console.firebase.google.com
- **Cloud Console**: https://console.cloud.google.com
- **Gemini API**: https://ai.google.dev
- **Documentation**: See TECH_STACK.md

---

**For detailed documentation, see `TECH_STACK.md`**
