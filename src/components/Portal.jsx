import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Lock, Unlock, HelpCircle, ArrowRight, ArrowLeft, ShieldAlert, User, RotateCcw } from 'lucide-react';
import { RECIPIENT_LIST, RECIPIENTS, resetAllProgression } from '../config/recipients';
import { soundFx } from '../services/soundEffects';

export default function Portal({ onLoginSuccess }) {
  // Step 1: Name Input state
  const [nameInput, setNameInput] = useState('');
  const [nameError, setNameError] = useState('');
  const [isNameShaking, setIsNameShaking] = useState(false);

  // Step 2: Selected persona state
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordShaking, setIsPasswordShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Find recipient persona from typed text (Robust matching for all 5 personas)
  const matchRecipientByName = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    // 1. Thanishqa (White Peacock) - Checked first to avoid collision with 'hani'
    if (
      q.includes('thanish') ||
      q.includes('tanish') ||
      q.includes('thani') ||
      q.includes('tani') ||
      q.includes('peacock') ||
      q.includes('peaky')
    ) {
      return RECIPIENTS.peacock;
    }

    // 2. Hanvika (Rabbit)
    if (
      q.includes('hanvika') ||
      q.includes('hanvi') ||
      q === 'hani' ||
      q === 'hanu' ||
      q.includes('rabbit') ||
      q.includes('bunny')
    ) {
      return RECIPIENTS.hanvika;
    }

    // 3. Grishma (Duck)
    if (q.includes('grish') || q.includes('duck') || q.includes('quack')) {
      return RECIPIENTS.duck;
    }

    // 4. Siri Chaithra (Chiti)
    if (
      q.includes('siri') ||
      q.includes('chiti') ||
      q.includes('chits') ||
      q.includes('chithi') ||
      q.includes('chaithra') ||
      q.includes('sister')
    ) {
      return RECIPIENTS.chiti;
    }

    // 5. Ashwidha (Cat)
    if (q.includes('ash') || q.includes('cat') || q.includes('kitty') || q.includes('meow')) {
      return RECIPIENTS.cat;
    }

    // 6. Direct exact / substring fallback
    const exact = RECIPIENT_LIST.find(
      (r) =>
        r.name.toLowerCase() === q ||
        r.nickname.toLowerCase() === q ||
        r.id.toLowerCase() === q
    );
    if (exact) return exact;

    const found = RECIPIENT_LIST.find(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.nickname.toLowerCase().includes(q)
    );

    return found || null;
  };

  // Step 1: Submit Name Form
  const handleNameSubmit = (e) => {
    e.preventDefault();
    const matched = matchRecipientByName(nameInput);

    if (matched) {
      soundFx.playClick();
      setSelectedRecipient(matched);
      setNameError('');
      setPassword('');
      setPasswordError('');
      setShowHint(false);
    } else {
      soundFx.playError();
      setNameError('Name not recognized! Please write a valid member name to enter ✨');
      setIsNameShaking(true);
      setTimeout(() => setIsNameShaking(false), 500);
    }
  };

  const handleBackToNameStep = () => {
    soundFx.playClick();
    setSelectedRecipient(null);
    setPassword('');
    setPasswordError('');
    setShowHint(false);
  };

  // Step 2: Submit Password Form
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (isUnlocking || !selectedRecipient) return;

    const trimmed = password.trim().toLowerCase();

    if (!trimmed) {
      soundFx.playError();
      setPasswordError('Please enter your secret password to unlock your surprise!');
      triggerPasswordShake();
      return;
    }

    // Check selected persona password
    let isMatch = false;
    if (trimmed === selectedRecipient.password.toLowerCase()) {
      isMatch = true;
    } else if (selectedRecipient.id === 'chiti' && (trimmed === 'brother' || trimmed === 'chits')) {
      isMatch = true;
    } else if (selectedRecipient.id === 'hanvika' && (trimmed === 'bunny' || trimmed === 'rabbit' || trimmed === 'carrot')) {
      isMatch = true;
    }

    if (isMatch) {
      // Success!
      soundFx.playUnlock();
      setIsUnlocking(true);
      setPasswordError('');

      confetti({
        particleCount: 140,
        spread: 85,
        origin: { y: 0.55 },
        colors: selectedRecipient.particles?.colors || ['#ffd166', '#ff3366', '#ffffff']
      });

      setTimeout(() => {
        onLoginSuccess(selectedRecipient);
      }, 700);
    } else {
      // Error
      soundFx.playError();
      setPasswordError(`Incorrect password! Try again or check the riddle below ✨`);
      triggerPasswordShake();
    }
  };

  const triggerPasswordShake = () => {
    setIsPasswordShaking(true);
    setTimeout(() => setIsPasswordShaking(false), 500);
  };

  return (
    <div className="portal-page-wrapper">
      {/* Ambient lighting */}
      <div
        className="portal-ambient-glow"
        style={{
          background: selectedRecipient
            ? `radial-gradient(circle at 50% 30%, ${selectedRecipient.theme.glowColor} 0%, transparent 70%)`
            : `radial-gradient(circle at 50% 30%, rgba(168, 85, 247, 0.25) 0%, transparent 70%)`
        }}
      />

      <div className="portal-container">
        {/* ====================================================================
            STEP 1: ENTER NAME SCREEN (A Box to Write Name)
            ==================================================================== */}
        {!selectedRecipient ? (
          <div className="portal-step-selection animate-fade-in">
            <header className="portal-header">
              <div className="portal-badge-pill">
                <Sparkles size={14} className="sparkle-spin" />
                <span>Rakhi 2026 Secret Gift Portal</span>
              </div>
              <h1 className="portal-main-title">Who is Entering? 🎀</h1>
              <p className="portal-subtitle">
                Enter your name in the box below to open your personalized digital Rakhi celebration!
              </p>
            </header>

            {/* Name Input Box Card */}
            <div className={`portal-auth-card ${isNameShaking ? 'shake-animation' : ''}`}>
              <form onSubmit={handleNameSubmit} className="portal-form">
                <div className="portal-field-label-row">
                  <span className="field-label-title">✨ Enter Your Name:</span>
                </div>

                <div className="input-group-wrapper">
                  <div className="input-icon-prefix">
                    <User size={20} />
                  </div>
                  <input
                    id="portal-name-input"
                    type="text"
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      if (nameError) setNameError('');
                    }}
                    placeholder="write your name to enter"
                    className="portal-input"
                    autoComplete="off"
                    autoCapitalize="words"
                    spellCheck="false"
                    autoFocus
                  />
                  <button
                    type="submit"
                    id="btn-portal-name-submit"
                    className="btn-portal-submit"
                  >
                    <span>Continue</span>
                    <ArrowRight size={18} />
                  </button>
                </div>

                {nameError && (
                  <div className="portal-error-banner animate-pop">
                    <ShieldAlert size={16} />
                    <span>{nameError}</span>
                  </div>
                )}
              </form>

              {/* Reset All Levels Action */}
              <div className="portal-reset-row">
                <button
                  type="button"
                  id="btn-portal-reset-all"
                  className="btn-portal-reset-all"
                  onClick={() => {
                    soundFx.playClick();
                    resetAllProgression();
                    setNameError('✓ All member levels have been reset to Level 1! ✨');
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Reset All Members' Levels</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ====================================================================
             STEP 2: DEDICATED GREETING & PASSWORD SCREEN ("Hi [Name]...")
             ==================================================================== */
          <div className="portal-step-greeting animate-pop">
            {/* Back Button */}
            <button
              type="button"
              className="btn-portal-back"
              onClick={handleBackToNameStep}
              aria-label="Back to name entry"
            >
              <ArrowLeft size={16} />
              <span>Change Name</span>
            </button>

            {/* Dedicated Greeting Header */}
            <div className="greeting-header">
              <div
                className="greeting-avatar-bubble animate-bounce"
                style={{
                  background: selectedRecipient.theme.badgeGradient,
                  boxShadow: `0 0 30px ${selectedRecipient.theme.glowColor}`
                }}
              >
                <span className="greeting-emoji">{selectedRecipient.emoji}</span>
              </div>

              <h1 className="greeting-title">
                Hi {selectedRecipient.name} ({selectedRecipient.nickname})! ✨
              </h1>
              <p className="greeting-subtitle">
                Welcome to your secret Rakhi 2026 realm! 🎀
              </p>
            </div>

            {/* Secret Password Card */}
            <div
              className={`portal-auth-card greeting-auth-card ${isPasswordShaking ? 'shake-animation' : ''} ${isUnlocking ? 'unlock-success-glow' : ''}`}
              style={{
                borderColor: selectedRecipient.theme.cardBorder,
                boxShadow: `0 16px 40px rgba(0, 0, 0, 0.5), 0 0 25px ${selectedRecipient.theme.glowColor}`
              }}
            >
              <div className="portal-auth-header">
                <span className="auth-surprise-prompt">
                  🎁 Enter your password for the surprise:
                </span>
              </div>

              <form onSubmit={handlePasswordSubmit} className="portal-form">
                <div className="input-group-wrapper">
                  <div className="input-icon-prefix">
                    {isUnlocking ? <Unlock className="icon-unlock animate-bounce" size={20} /> : <Lock size={20} />}
                  </div>
                  <input
                    id="portal-password-input"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder={`Enter ${selectedRecipient.nickname}'s secret password...`}
                    className="portal-input"
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    disabled={isUnlocking}
                    autoFocus
                  />
                  <button
                    type="submit"
                    id="btn-portal-unlock"
                    className="btn-portal-submit"
                    disabled={isUnlocking}
                    style={{
                      background: selectedRecipient.theme.badgeGradient
                    }}
                  >
                    {isUnlocking ? (
                      <span>Unlocking...</span>
                    ) : (
                      <>
                        <span>Unlock Surprise ✨</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {passwordError && (
                  <div id="portal-error-message" className="portal-error-banner animate-pop">
                    <ShieldAlert size={16} />
                    <span>{passwordError}</span>
                  </div>
                )}

                {/* Hint Section */}
                <div className="portal-hint-section">
                  <button
                    type="button"
                    id="btn-portal-hint"
                    className="btn-hint-toggle"
                    onClick={() => {
                      soundFx.playClick();
                      setShowHint(!showHint);
                    }}
                  >
                    <HelpCircle size={15} />
                    <span>{showHint ? 'Hide Riddle' : `Need a riddle for ${selectedRecipient.nickname}?`}</span>
                  </button>

                  {showHint && (
                    <div id="portal-hint-box" className="portal-hint-box animate-pop">
                      <Sparkles size={14} className="hint-sparkle" />
                      <p>{selectedRecipient.hint}</p>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
