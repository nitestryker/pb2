import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CreatePastePage from './pages/CreatePastePage';
import ViewPastePage from './pages/ViewPastePage';
import ArchivePage from './pages/ArchivePage';
import UserProfilePage from './pages/UserProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
        <Router>
          <Header />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreatePastePage />} />
              <Route path="/paste/:id" element={<ViewPastePage />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="/user/:username" element={<UserProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {user?.isAdmin && (
                <Route path="/admin" element={<AdminDashboard />} />
              )}
            </Routes>
          </main>
          <Footer />
        </Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: theme === 'dark' ? 'dark-toast' : '',
          }}
        />
      </div>
    </div>
  );
}

export default App;