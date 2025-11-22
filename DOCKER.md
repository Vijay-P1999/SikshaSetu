# Docker Build & Run Instructions

## Local Testing

### Build the Docker image
```bash
docker build -t sikshasetu:latest .
```

### Build with environment variables
```bash
docker build -t sikshasetu:latest \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain \
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project \
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket \
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender \
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id \
  --build-arg NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key \
  .
```

### Run the container
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain \
  -e NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project \
  -e NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket \
  -e NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender \
  -e NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id \
  -e NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key \
  sikshasetu:latest
```

### Run with .env file
```bash
docker run -p 3000:3000 --env-file .env sikshasetu:latest
```

## Google Cloud Build

### Build and push to Container Registry
```bash
gcloud builds submit --tag gcr.io/sikshasetu-479009/sikshasetu:latest
```

### Build with custom config
```bash
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions _IMAGE_NAME=sikshasetu
```

## Troubleshooting

### Build fails at npm run build
- Ensure all dependencies are installed
- Check if .env variables are needed at build time
- Verify next.config.mjs has `output: 'standalone'`

### Container starts but app doesn't work
- Check environment variables are set correctly
- Verify Firebase and Gemini API keys
- Check logs: `docker logs <container_id>`

### Port already in use
```bash
# Use different port
docker run -p 8080:3000 sikshasetu:latest
```

### View container logs
```bash
docker logs <container_id>
docker logs -f <container_id>  # Follow logs
```

### Stop container
```bash
docker stop <container_id>
docker rm <container_id>
```

### Clean up
```bash
# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove everything
docker system prune -a
```
