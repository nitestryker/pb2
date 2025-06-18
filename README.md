# PasteForge

A modern pastebin platform with advanced project management, AI-powered analysis, and collaboration features.

## Environment Configuration

### Development
Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:3001/api
```

### Production
The production environment is configured to use:
```
VITE_API_URL=https://pb2-ahh9.onrender.com/api
```

## Deployment Instructions

### Backend (Render)
The backend is deployed at: `https://pb2-ahh9.onrender.com`

### Frontend (Render)
The frontend automatically uses the correct API URL based on the environment:
- **Development**: Uses Vite proxy or localhost:3001
- **Production**: Uses `https://pb2-ahh9.onrender.com/api`

### Local Development
1. Start the backend: `npm run server`
2. Start the frontend: `npm run dev`
3. Or start both: `npm run dev:full`

## API Configuration

The application automatically detects the environment and uses the appropriate API base URL:

- **Development**: Uses relative paths with Vite proxy or localhost:3001
- **Production**: Uses the full backend URL `https://pb2-ahh9.onrender.com/api`

## Features

- Modern pastebin with syntax highlighting
- Project management and collaboration
- AI-powered code analysis
- Dark/Light theme toggle
- User authentication and profiles
- Admin dashboard
- Real-time notifications

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, PostgreSQL
- **Deployment**: Render
- **State Management**: Zustand
- **UI Components**: Lucide React, Framer Motion