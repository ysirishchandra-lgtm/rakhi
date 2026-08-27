import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { Sparkles, Lock, Unlock, HelpCircle, ArrowRight, ArrowLeft, ShieldAlert, User, RotateCcw, X, Smile } from 'lucide-react';
import { RECIPIENT_LIST, RECIPIENTS, resetAllProgression } from '../config/recipients';
import { soundFx } from '../services/soundEffects';

export default function Portal({ onLoginSuccess }) {
  // Step 1: Name Input state
  const [nameInput, setNameInput] = useState('');
  const [nameError, setNameError] = useState('');
  const [isNameShaking, setIsNameShaking] = useState(false);
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);

  // Step 2: Selected persona state
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordShaking, setIsPasswordShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Strict Name Matching for the 5 Allowed Recipients (Exact Names Only)
  const matchRecipientByName = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    // 1. Thanishqa (White Peacock)
    const thanishqaExact = [
      'thanishqa', 'thanishka', 'tanishqa', 'tanishka',
      'thanish', 'tanish', 'thani', 'tani',
      'white peacock', 'peacock', 'peacoc', 'peaky'
    ];
    if (thanishqaExact.includes(q)) {
      return RECIPIENTS.peacock;
    }

    // 2. Hanvika (Rabbit)
    const hanvikaExact = [
      'hanvika', 'hanvi', 'hani', 'hanu',
      'rabbit', 'bunny'
    ];
    if (hanvikaExact.includes(q)) {
      return RECIPIENTS.hanvika;
    }

    // 3. Grishma (Duck)
    const grishmaExact = [
      'grishma', 'grish', 'duck', 'ducky', 'quack'
    ];
    if (grishmaExact.includes(q)) {
      return RECIPIENTS.duck;
    }

    // 4. Siri Chaithra (Chiti)
    const siriExact = [
      'siri chaithra', 'siri', 'chaithra', 'chiti',
      'chits', 'chithi', 'sister'
    ];
    if (siriExact.includes(q)) {
      return RECIPIENTS.chiti;
    }

    // 5. Ashwidha (Cat)
    const ashwidhaExact = [
      'ashwidha', 'ashwi', 'ash', 'cat', 'kitty', 'meow'
    ];
    if (ashwidhaExact.includes(q)) {
      return RECIPIENTS.cat;
    }

    // Direct match against exact recipient fields
    const direct = RECIPIENT_LIST.find(
      (r) => r.name.toLowerCase() === q || r.nickname.toLowerCase() === q || r.id.toLowerCase() === q
    );
    if (direct) return direct;

    // Any other name strictly returns null
    return null;
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
      setShowNotFoundModal(false);
    } else {
      // Unrecognized name ➔ print "no found..be happy" and show popup modal
      soundFx.playJump();
      setNameError('no found..be happy');
      setShowNotFoundModal(true);
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
    setNameError('');
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
    } else if (selectedRecipient.id === 'peacock' && (trimmed === 'peacock' || trimmed === 'white peacock' || trimmed === 'whitepeacock' || trimmed === 'peacoc')) {
      isMatch = true;
    } else if (selectedRecipient.id === 'chiti' && (trimmed === 'brother' || trimmed === 'chits')) {
      isMatch = true;
    } else if (selectedRecipient.id === 'hanvika' && (trimmed === 'brother' || trimmed === 'bunny' || trimmed === 'rabbit' || trimmed === 'carrot')) {
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

                {/* Inline Message */}
                {nameError && (
                  <div className="portal-error-banner animate-pop">
                    <Smile size={16} />
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

      {/* ====================================================================
          NO FOUND POPUP MODAL ("no found..be happy")
          ==================================================================== */}
      {showNotFoundModal &&
        createPortal(
          <div className="modal-backdrop not-found-modal-overlay animate-fade-in" style={{ zIndex: 999999 }}>
            <div className="not-found-modal-card animate-pop">
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowNotFoundModal(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="not-found-icon-bubble animate-bounce">
                <span className="not-found-emoji">😊</span>
              </div>

              <h3 className="not-found-title">no found..be happy 😊✨</h3>
              <p className="not-found-desc">
                no found..be happy! This secret realm is dedicated to 5 special friends: <strong>Hanvika</strong>, <strong>Grishma</strong>, <strong>Siri Chaithra (Chiti)</strong>, <strong>Ashwidha</strong>, and <strong>Thanishqa</strong>!
              </p>

              <button
                type="button"
                className="btn-not-found-action"
                onClick={() => {
                  soundFx.playClick();
                  setShowNotFoundModal(false);
                }}
              >
                <Sparkles size={16} />
                <span>Try Again ✨</span>
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
