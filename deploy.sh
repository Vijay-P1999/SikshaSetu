#!/bin/bash

# SikshaSetu - Google Cloud Deployment Script
# This script builds and deploys the application to Google Cloud Run

set -e

# Configuration
PROJECT_ID="sikshasetu-479009"
REGION="asia-south1"
SERVICE_NAME="sikshasetu"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 Starting deployment to Google Cloud..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Set the project
echo "📦 Setting GCP project to ${PROJECT_ID}..."
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo "🔧 Enabling required Google Cloud APIs..."
gcloud services enable \
    run.googleapis.com \
    containerregistry.googleapis.com \
    cloudbuild.googleapis.com \
    secretmanager.googleapis.com

# Build the Docker image using Cloud Build
echo "🏗️  Building Docker image..."
gcloud builds submit --tag ${IMAGE_NAME}:latest

# Create secrets if they don't exist
echo "🔐 Setting up secrets..."

# Firebase secrets
gcloud secrets create firebase-config --data-file=- <<EOF
{
  "api-key": "${NEXT_PUBLIC_FIREBASE_API_KEY}",
  "auth-domain": "${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}",
  "project-id": "${NEXT_PUBLIC_FIREBASE_PROJECT_ID}",
  "storage-bucket": "${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}",
  "messaging-sender-id": "${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}",
  "app-id": "${NEXT_PUBLIC_FIREBASE_APP_ID}"
}
EOF

# Gemini API secret
echo -n "${NEXT_PUBLIC_GEMINI_API_KEY}" | gcloud secrets create gemini-config --data-file=-

# Deploy to Cloud Run
echo "🚢 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
    --image ${IMAGE_NAME}:latest \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --port 3000 \
    --memory 2Gi \
    --cpu 2 \
    --min-instances 0 \
    --max-instances 10 \
    --timeout 300 \
    --set-env-vars NODE_ENV=production \
    --set-secrets NEXT_PUBLIC_FIREBASE_API_KEY=firebase-config:latest \
    --set-secrets NEXT_PUBLIC_GEMINI_API_KEY=gemini-config:latest

# Get the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
    --platform managed \
    --region ${REGION} \
    --format 'value(status.url)')

echo ""
echo "✅ Deployment successful!"
echo "🌐 Your application is live at: ${SERVICE_URL}"
echo ""
echo "📊 To view logs:"
echo "   gcloud run services logs read ${SERVICE_NAME} --region ${REGION}"
echo ""
echo "📈 To view metrics:"
echo "   https://console.cloud.google.com/run/detail/${REGION}/${SERVICE_NAME}/metrics?project=${PROJECT_ID}"
