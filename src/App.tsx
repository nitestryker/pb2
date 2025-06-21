import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import { useAppStore } from './store/appStore';
import { Layout } from './components/Layout/Layout';
import { ApiStatusBanner } from './components/Common/ApiStatusBanner';
import { HomePage } from './pages/HomePage';
import { PastePage } from './pages/PastePage';
import { CreatePastePage } from './pages/CreatePastePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectPage } from './pages/ProjectPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminPage } from './pages/AdminPage';
import { SettingsPage } from './pages/SettingsPage';
import { EditProfile } from './pages/EditProfile';
import { ExplorePage } from './pages/ExplorePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { AdminRoute } from './components/Auth/AdminRoute';

function App() {
  const { theme } = useThemeStore();
  const { verifyToken } = useAuthStore();
  const { loadRecentPastes, checkBackendStatus } = useAppStore();

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    // Initialize app with enhanced error handling
    const initializeApp = async () => {
      console.log('🚀 Initializing PasteForge application...');
      
      try {
        // Check backend status first
        console.log('🏥 Checking backend status...');
        await checkBackendStatus();
        
        // Verify authentication token
        console.log('🔐 Verifying authentication...');
        await verifyToken();
        
        // Load recent pastes
        console.log('📋 Loading recent pastes...');
        await loadRecentPastes();
        
        console.log('✅ Application initialized successfully');
        
      } catch (error) {
        console.warn('⚠️ Application initialization completed with warnings:', error);
        // Don't throw - let individual components handle their errors
      }
    };
    
    initializeApp();
  }, [verifyToken, loadRecentPastes, checkBackendStatus]);

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-colors duration-300">
        <Router>
          <Layout>
            {/* API Status Banner */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ApiStatusBanner />
            </div>
            
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/paste/:id" element={<PastePage />} />
              <Route path="/create" element={<CreatePastePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route path="/projects" element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/project/:id" element={
                <ProtectedRoute>
                  <ProjectPage />
                </ProtectedRoute>
              } />
              
              <Route path="/profile/:username" element={<ProfilePage />} />
              
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } />

              <Route path="/edit-profile" element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              } />
            </Routes>
          </Layout>
        </Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'dark:bg-slate-800 dark:text-white',
            duration: 4000,
          }}
        />
      </div>
    </div>
  );
}

export default App;