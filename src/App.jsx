import React, { useState, useEffect } from 'react';
import Portal from './components/Portal';
import RecipientExperience from './components/RecipientExperience';
import { RECIPIENTS, resetAllProgression } from './config/recipients';
import './App.css';

export default function App() {
  const [currentRecipient, setCurrentRecipient] = useState(null);

  // Clear all previous level progress on fresh load as requested
  useEffect(() => {
    resetAllProgression();
  }, []);

  const handleLoginSuccess = (recipient) => {
    setCurrentRecipient(recipient);
    try {
      sessionStorage.setItem('rakhi_2026_recipient_id', recipient.id);
    } catch (err) {
      console.warn('Could not save session:', err);
    }
  };

  const handleLogout = () => {
    setCurrentRecipient(null);
    try {
      sessionStorage.removeItem('rakhi_2026_recipient_id');
    } catch (err) {
      console.warn('Could not clear session:', err);
    }
  };

  return (
    <div className="app-root-container">
      {currentRecipient ? (
        <RecipientExperience
          recipient={currentRecipient}
          onLogout={handleLogout}
        />
      ) : (
        <Portal onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
