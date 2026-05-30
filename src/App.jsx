import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AboutUsPage from './pages/AboutUsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  return (
    <Routes>
      {/* Public Landing & Login (Only accessible when NOT logged in) */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute type="public-only">
            <LandingPage 
              onGoogleSignUp={signInWithGoogle} 
              onAboutClick={() => navigate('/about')}
              onTermsClick={() => navigate('/terms')}
              onPrivacyClick={() => navigate('/privacy')}
            />
          </ProtectedRoute>
        } 
      />

      {/* Profile Onboarding Wizard (Only accessible when logged in but setup is incomplete) */}
      <Route 
        path="/profile-setup" 
        element={
          <ProtectedRoute type="onboarding-only">
            <ProfileSetupPage />
          </ProtectedRoute>
        } 
      />

      {/* Secure Feed & Dashboard (Only accessible when logged in and setup is complete) */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute type="protected">
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Public Pages */}
      <Route path="/about" element={<AboutUsPage onBack={() => navigate('/')} />} />
      <Route path="/terms" element={<TermsPage onBack={() => navigate('/')} />} />
      <Route path="/privacy" element={<PrivacyPage onBack={() => navigate('/')} />} />
      
      {/* Fallback to index / redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
