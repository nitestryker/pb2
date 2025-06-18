# PasteForge

A modern pastebin platform with advanced project management, AI-powered analysis, and collaboration features.

## Environment Configuration

### Development
Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:3001/api
```

### Production
Create a `.env.production` file or set environment variables in your deployment platform:
```
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

## Deployment Instructions

### Backend (Render)
1. Deploy the backend service first
2. Note the backend URL (e.g., `https://your-app-name.onrender.com`)

### Frontend (Render)
1. Set the environment variable `VITE_API_URL` to your backend URL + `/api`
2. Example: `VITE_API_URL=https://your-backend-app.onrender.com/api`
3. Deploy the frontend service

### Local Development
1. Start the backend: `npm run server`
2. Start the frontend: `npm run dev`
3. Or start both: `npm run dev:full`

## API Configuration

The application automatically detects the environment and uses the appropriate API base URL:

- **Development**: Uses relative paths with Vite proxy or localhost:3001
- **Production**: Uses the full backend URL from `VITE_API_URL` environment variable

Make sure to update the `.env.production` file or set the `VITE_API_URL` environment variable in your deployment platform to point to your actual backend URL.