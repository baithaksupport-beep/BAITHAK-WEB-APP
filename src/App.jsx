import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  if (currentPage === 'register') {
    return <RegistrationPage onBack={() => setCurrentPage('landing')} />;
  }

  return <LandingPage onGoogleSignUp={() => setCurrentPage('register')} />;
}

export default App;

