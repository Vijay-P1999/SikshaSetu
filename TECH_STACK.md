# SikshaSetu - Technical Documentation

## 📚 Tech Stack Overview

### **Frontend Framework**
- **Next.js 16.0.3** (React Framework)
  - Server-side rendering (SSR)
  - Client-side rendering (CSR)
  - File-based routing
  - API routes support
  - Turbopack for fast builds
  - Standalone output mode for Docker

### **UI & Styling**
- **React 19** - UI library
- **Vanilla CSS** - Custom styling with CSS variables
  - Design tokens for theming
  - Dark/Light mode support
  - Responsive design
  - No external CSS frameworks (maximum flexibility)

### **Backend Services**

#### **Firebase (Google)**
1. **Firebase Authentication**
   - Google Sign-In provider
   - User session management
   - Secure token-based auth

2. **Cloud Firestore**
   - NoSQL document database
   - Real-time data sync
   - Collections:
     - `users` - User profiles, roles, scores
     - Scalable and serverless

#### **Google Gemini AI**
- **Model**: `gemini-2.0-flash-exp`
- **Use Cases**:
  - Quiz generation (grade-appropriate)
  - Peer assessment and scoring
  - Personalized recommendations
  - ChatBot for student doubts
  - Content adaptation

### **State Management**
- **React Context API**
  - `AuthContext` - User authentication state
  - `ThemeContext` - Dark/Light mode
  - No external state management library

### **Icons & Assets**
- **Lucide React** - Modern icon library
- **Emojis** - For visual learning (grades 1-2)

### **Development Tools**
- **Node.js 20** - Runtime environment
- **npm** - Package manager
- **ESLint** - Code linting
- **Git** - Version control

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              Client (Browser)                    │
│  ┌──────────────────────────────────────────┐  │
│  │         Next.js Application              │  │
│  │  - React Components                      │  │
│  │  - Client-side routing                   │  │
│  │  - Context providers                     │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│           Firebase Services (Google)             │
│  ┌──────────────┐  ┌────────────────────────┐  │
│  │ Auth         │  │ Cloud Firestore        │  │
│  │ - Google     │  │ - User data            │  │
│  │   Sign-In    │  │ - Scores               │  │
│  └──────────────┘  │ - Progress tracking    │  │
│                     └────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          Google Gemini AI API                    │
│  - Quiz generation                               │
│  - Peer assessment                               │
│  - ChatBot responses                             │
│  - Content personalization                       │
└─────────────────────────────────────────────────┘
```

---

## 🐳 Deployment Architecture

### **Containerization**
- **Docker** - Multi-stage build
  - Stage 1: Dependencies installation
  - Stage 2: Application build
  - Stage 3: Production runtime
  - Alpine Linux base (minimal size)
  - Non-root user for security

### **Cloud Platform**
- **Google Cloud Run**
  - Serverless container platform
  - Auto-scaling (0-10 instances)
  - Pay-per-use pricing
  - HTTPS by default
  - Global CDN

### **Secrets Management**
- **Google Secret Manager**
  - Firebase credentials
  - Gemini API keys
  - Environment variables

---

## 🚀 Deployment Guide

### **Prerequisites**

1. **Google Cloud Account**
   - Create at [cloud.google.com](https://cloud.google.com)
   - Enable billing

2. **Install gcloud CLI**
   ```bash
   # Download from: https://cloud.google.com/sdk/docs/install
   # Verify installation
   gcloud --version
   ```

3. **Install Docker** (optional, for local testing)
   ```bash
   # Download from: https://www.docker.com/get-started
   docker --version
   ```

---

### **Step-by-Step Deployment**

#### **1. Set Up Google Cloud Project**

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project
gcloud projects create sikshasetu-479009 --name="SikshaSetu Production"

# Set the project
gcloud config set project sikshasetu-479009

# Set region (Mumbai, India)
gcloud config set run/region asia-south1

# Enable billing
# Visit: https://console.cloud.google.com/billing
```

#### **2. Enable Required APIs**

```bash
gcloud services enable \
    run.googleapis.com \
    containerregistry.googleapis.com \
    cloudbuild.googleapis.com \
    secretmanager.googleapis.com
```

#### **3. Set Up Environment Variables**

Create `.env.production` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

#### **4. Create Secrets in Google Cloud**

```bash
# Firebase API Key
echo -n "your_firebase_api_key" | gcloud secrets create firebase-api-key --data-file=-

# Gemini API Key
echo -n "your_gemini_api_key" | gcloud secrets create gemini-api-key --data-file=-

# Grant access to Cloud Run
gcloud secrets add-iam-policy-binding firebase-api-key \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

#### **5. Build Docker Image**

```bash
# Build using Google Cloud Build
gcloud builds submit --tag gcr.io/sikshasetu-479009/sikshasetu:latest

# Or build locally and push
docker build -t gcr.io/sikshasetu-479009/sikshasetu:latest .
docker push gcr.io/sikshasetu-479009/sikshasetu:latest
```

#### **6. Deploy to Cloud Run**

```bash
gcloud run deploy sikshasetu \
  --image gcr.io/sikshasetu-479009/sikshasetu:latest \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 2Gi \
  --cpu 2 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --set-env-vars NODE_ENV=production \
  --set-env-vars NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  --set-env-vars NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain \
  --set-env-vars NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project \
  --set-env-vars NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket \
  --set-env-vars NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender \
  --set-env-vars NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id \
  --set-env-vars NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
```

#### **7. Automated Deployment (Recommended)**

```bash
# Update PROJECT_ID in deploy.sh
nano deploy.sh

# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

---

## 📊 Monitoring & Logs

### **View Logs**
```bash
# Real-time logs
gcloud run services logs tail sikshasetu --region asia-south1

# Last 50 log entries
gcloud run services logs read sikshasetu --region asia-south1 --limit 50
```

### **View Metrics**
```bash
# Service details
gcloud run services describe sikshasetu --region asia-south1

# Or visit Cloud Console
# https://console.cloud.google.com/run
```

### **Set Up Alerts**
1. Go to Cloud Console → Monitoring → Alerting
2. Create alert policies for:
   - High error rates (>5%)
   - High latency (>2 seconds)
   - Low availability (<99%)

---

## 💰 Cost Estimation

### **Google Cloud Run Pricing (India Region)**

**Free Tier (per month)**:
- 2 million requests
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds

**After Free Tier**:
- **Requests**: ₹0.30 per million
- **Memory**: ₹0.15 per GB-hour
- **CPU**: ₹1.50 per vCPU-hour
- **Networking**: ₹0.80 per GB (egress)

**Example Monthly Cost** (1000 students, moderate usage):
- Requests: ~500K/month → Free
- Memory (2GB): ~₹500
- CPU (2 vCPU): ~₹1000
- **Total**: ~₹1500-2000/month

### **Firebase Pricing**
- **Spark Plan (Free)**:
  - 50K reads/day
  - 20K writes/day
  - 1GB storage
  
- **Blaze Plan (Pay-as-you-go)**:
  - ₹0.036 per 100K reads
  - ₹0.108 per 100K writes
  - ₹0.18 per GB storage

### **Gemini API Pricing**
- **Free tier**: 15 requests/minute
- **Paid**: Based on tokens used
- Estimated: ₹500-1000/month for moderate usage

---

## 🔒 Security Best Practices

### **1. Environment Variables**
- ✅ Never commit `.env` files
- ✅ Use Google Secret Manager
- ✅ Rotate keys regularly

### **2. Firebase Security Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

### **3. Docker Security**
- ✅ Non-root user
- ✅ Minimal base image (Alpine)
- ✅ Multi-stage build
- ✅ No sensitive data in image

### **4. HTTPS**
- ✅ Automatic with Cloud Run
- ✅ TLS 1.2+ enforced
- ✅ Valid SSL certificates

---

## 🔄 CI/CD Integration

### **GitHub Actions Example**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      
      - name: Build and Deploy
        run: |
          gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/sikshasetu
          gcloud run deploy sikshasetu \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/sikshasetu \
            --region asia-south1 \
            --platform managed
```

---

## 🛠️ Troubleshooting

### **Build Fails**
```bash
# Check build logs
gcloud builds log --region=asia-south1

# Verify Dockerfile
docker build -t test .
```

### **Deployment Fails**
```bash
# Check service status
gcloud run services describe sikshasetu --region asia-south1

# View error logs
gcloud run services logs tail sikshasetu --region asia-south1
```

### **App Not Loading**
1. Check if service is public: `--allow-unauthenticated`
2. Verify environment variables
3. Check Firebase/Gemini API keys
4. Review application logs

### **Performance Issues**
1. Increase memory/CPU allocation
2. Enable Cloud CDN
3. Optimize images and assets
4. Use caching strategies

---

## 📞 Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **Cloud Run Docs**: https://cloud.google.com/run/docs
- **Gemini API Docs**: https://ai.google.dev/docs

---

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Firebase project set up
- [ ] Gemini API key obtained
- [ ] Google Cloud project created
- [ ] Billing enabled
- [ ] APIs enabled
- [ ] Secrets created
- [ ] Docker image built
- [ ] Service deployed
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up
- [ ] Alerts configured
- [ ] Backup strategy in place

---

**Built with ❤️ for Indian Government Schools**
