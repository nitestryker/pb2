# PasteForge - Modern Pastebin Platform

A comprehensive pastebin application with advanced project management, AI-powered analysis, and collaboration features.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with dark/light themes
- **Code Sharing**: Support for 200+ programming languages with syntax highlighting
- **Project Management**: Organize code into collaborative projects with branches
- **AI-Powered Analysis**: Intelligent code summaries and content recommendations
- **User Authentication**: Secure registration and login system
- **Admin Dashboard**: Comprehensive administration tools
- **Real-time Features**: Live notifications and activity feeds
- **Zero-Knowledge Pastes**: Client-side encryption for sensitive code

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **JWT** authentication
- **bcrypt** for password hashing
- **Helmet** for security headers
- **Rate limiting** for API protection

## 🚀 Deployment

This application is configured for deployment on [Render.com](https://render.com).

### Prerequisites
- GitHub repository connected to Render
- Render account

### Deployment Steps

1. **Fork/Clone this repository** to your GitHub account

2. **Connect to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` configuration

3. **Environment Variables** (automatically configured):
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Auto-generated secure secret
   - `NODE_ENV` - Set to `production`
   - `VITE_API_URL` - API endpoint URL

4. **Deploy**:
   - Render will automatically deploy your application
   - Database will be created and initialized
   - Frontend will be built and served

### Manual Deployment

If you prefer manual setup:

1. **Create PostgreSQL Database**:
   - Go to Render Dashboard
   - Create new PostgreSQL database
   - Note the connection string

2. **Create Web Service**:
   - Create new Web Service
   - Connect your repository
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`
   - Add environment variables

## 🏃‍♂️ Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd pasteforge
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Start development servers**:
   ```bash
   npm run dev:full
   ```

   This starts both the backend API (port 3001) and frontend dev server (port 5173).

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend API server
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build frontend for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User accounts and profiles
- **pastes** - Code snippets and content
- **paste_tags** - Tags for organizing pastes
- **comments** - Comments on pastes
- **projects** - Project management
- **project_collaborators** - Project team members
- **ai_summaries** - AI-generated content analysis

## 🔐 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt
- **Rate Limiting** to prevent abuse
- **CORS Protection** with configurable origins
- **SQL Injection Prevention** with parameterized queries
- **XSS Protection** with Helmet security headers
- **Zero-Knowledge Encryption** for sensitive pastes

## 🎨 UI/UX Features

- **Responsive Design** - Works on all device sizes
- **Dark/Light Themes** - User preference with persistence
- **Smooth Animations** - Framer Motion powered transitions
- **Loading States** - Comprehensive loading indicators
- **Error Handling** - User-friendly error messages
- **Accessibility** - Screen reader friendly

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Pastes
- `GET /api/pastes/recent` - Recent public pastes
- `GET /api/pastes/archive` - Paginated archive
- `GET /api/pastes/:id` - Get single paste
- `POST /api/pastes` - Create new paste
- `GET /api/pastes/:id/related` - Related pastes
- `GET /api/pastes/:id/download` - Download paste

### Users
- `GET /api/users/:username` - User profile
- `GET /api/users/:username/pastes` - User's pastes

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/languages` - Language statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.

---

**Live Demo**: [https://pasteforge.onrender.com](https://pasteforge.onrender.com)

**Admin Login**: admin@pasteforge.com / password