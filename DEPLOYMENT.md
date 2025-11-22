# SikshaSetu - Google Cloud Deployment Guide

This guide will help you deploy SikshaSetu to Google Cloud Platform.

## Prerequisites

1. **Google Cloud Account**: Create one at [cloud.google.com](https://cloud.google.com)
2. **gcloud CLI**: Install from [cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
3. **Docker**: Install from [docker.com](https://www.docker.com/get-started)

## Quick Start

### 1. Set Up Google Cloud Project

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create sikshasetu-prod --name="SikshaSetu Production"

# Set the project
gcloud config set project sikshasetu-prod

# Enable billing (required for Cloud Run)
# Visit: https://console.cloud.google.com/billing
```

### 2. Configure Environment Variables

Create a `.env.production` file with your credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Deploy Using Automated Script

```bash
# Make the script executable
chmod +x deploy.sh

# Update PROJECT_ID in deploy.sh
# Edit deploy.sh and replace "your-gcp-project-id" with your actual project ID

# Run deployment
./deploy.sh
```

### 4. Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Set your project ID
export PROJECT_ID="sikshasetu-prod"
export REGION="asia-south1"

# Build the Docker image
gcloud builds submit --tag gcr.io/${PROJECT_ID}/sikshasetu

# Deploy to Cloud Run
gcloud run deploy sikshasetu \
  --image gcr.io/${PROJECT_ID}/sikshasetu \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 3000 \
  --memory 2Gi \
  --cpu 2
```

## Configuration Options

### Scaling

Adjust in `cloudrun.yaml`:
- `minScale`: Minimum instances (0 for cost savings)
- `maxScale`: Maximum instances (default: 10)
- `containerConcurrency`: Requests per instance (default: 80)

### Resources

- **CPU**: 1-2 vCPUs recommended
- **Memory**: 512Mi-2Gi recommended
- **Timeout**: 300 seconds (5 minutes)

### Secrets Management

Secrets are stored in Google Secret Manager:

```bash
# Create a secret
echo -n "your-secret-value" | gcloud secrets create secret-name --data-file=-

# Update a secret
echo -n "new-value" | gcloud secrets versions add secret-name --data-file=-

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding secret-name \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## Monitoring & Logs

### View Logs
```bash
gcloud run services logs read sikshasetu --region asia-south1 --limit 50
```

### View Metrics
Visit: https://console.cloud.google.com/run

### Set Up Alerts
1. Go to Cloud Console → Monitoring → Alerting
2. Create policies for:
   - High error rates
   - High latency
   - Low availability

## Cost Optimization

1. **Use minimum instances = 0**: Only pay when app is used
2. **Set appropriate memory/CPU**: Start with 512Mi/1 CPU
3. **Enable request-based billing**: Only pay for actual requests
4. **Use Cloud CDN**: Cache static assets

### Estimated Costs (India Region)

- **Free tier**: 2 million requests/month
- **After free tier**: ~₹0.30 per million requests
- **Memory**: ~₹0.15 per GB-hour
- **CPU**: ~₹1.50 per vCPU-hour

## Troubleshooting

### Build Fails
```bash
# Check build logs
gcloud builds log --region=asia-south1

# Verify Dockerfile syntax
docker build -t test .
```

### Deployment Fails
```bash
# Check service status
gcloud run services describe sikshasetu --region asia-south1

# View recent logs
gcloud run services logs tail sikshasetu --region asia-south1
```

### App Not Loading
1. Check if service is public: `--allow-unauthenticated`
2. Verify environment variables are set
3. Check Firebase/Gemini API keys are valid
4. Review application logs

## CI/CD Integration

### GitHub Actions

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
      
      - name: Deploy to Cloud Run
        run: |
          gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/sikshasetu
          gcloud run deploy sikshasetu --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/sikshasetu --region asia-south1
```

## Custom Domain

1. **Verify domain ownership**
2. **Map domain in Cloud Run**:
   ```bash
   gcloud run domain-mappings create \
     --service sikshasetu \
     --domain www.sikshasetu.com \
     --region asia-south1
   ```
3. **Update DNS records** as instructed

## Support

For issues:
- Check logs: `gcloud run services logs read sikshasetu`
- Cloud Run docs: https://cloud.google.com/run/docs
- Firebase docs: https://firebase.google.com/docs

## Security Best Practices

1. ✅ Use Secret Manager for sensitive data
2. ✅ Enable HTTPS (automatic with Cloud Run)
3. ✅ Set up Firebase Security Rules
4. ✅ Implement rate limiting
5. ✅ Regular security updates
6. ✅ Monitor for suspicious activity
