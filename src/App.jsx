import React, { useState, useEffect } from 'react';
import Portal from './components/Portal';
import RecipientExperience from './components/RecipientExperience';
import { RECIPIENTS, resetAllProgression } from './config/recipients';
import { soundFx } from './services/soundEffects';
import './App.css';

export default function App() {
  const [currentRecipient, setCurrentRecipient] = useState(null);

  // Clear all previous level progress on fresh load as requested
  useEffect(() => {
    resetAllProgression();

    const handleFirstInteraction = () => {
      soundFx.startBgm();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
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
