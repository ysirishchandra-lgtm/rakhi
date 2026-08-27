import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { Sparkles, Lock, Unlock, HelpCircle, ArrowRight, ArrowLeft, ShieldAlert, User, X, Smile, Star, Zap } from 'lucide-react';
import { RECIPIENT_LIST, RECIPIENTS } from '../config/recipients';
import { soundFx } from '../services/soundEffects';

export default function Portal({ onLoginSuccess }) {
  // Big Rakhi Interactive Warp Intro state
  const [showCinematicIntro, setShowCinematicIntro] = useState(true);
  const [isWarping, setIsWarping] = useState(false);
  const [warpPercent, setWarpPercent] = useState(0);

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

  // Step 2: Character Universe Warp Animation state
  const [isCharacterWarping, setIsCharacterWarping] = useState(false);
  const [characterWarpPercent, setCharacterWarpPercent] = useState(0);

  // Pressing the Big Rakhi triggers the loading warp animation
  const handlePressRakhi = () => {
    if (isWarping) return;

    setIsWarping(true);
    soundFx.playPowerUp();

    // Confetti celebration blast
    confetti({
      particleCount: 180,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ffd166', '#ff3366', '#f59e0b', '#ec4899', '#ffffff']
    });

    // Rapid loading progress from 0% to 100%
    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      setWarpPercent(Math.min(100, progress));
      if (progress >= 100) {
        clearInterval(interval);
        soundFx.playGameWin();
        setTimeout(() => {
          setShowCinematicIntro(false);
          setIsWarping(false);
        }, 500);
      }
    }, 45);
  };

  const handleSkipIntro = () => {
    soundFx.playUnlock();
    setShowCinematicIntro(false);
  };

  // Strict Name Matching for the 7 Allowed Recipients
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
      'chits', 'chithi', 'sister', 'teddy'
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

    // 6. Nirvika (Swan)
    const nirvikaExact = [
      'nirvika', 'nirvi', 'nirvu', 'swan', 'swany'
    ];
    if (nirvikaExact.includes(q)) {
      return RECIPIENTS.nirvika;
    }

    // 7. Krishvi (Butterfly)
    const krishviExact = [
      'krishvi', 'krish', 'krishu', 'butterfly', 'butter'
    ];
    if (krishviExact.includes(q)) {
      return RECIPIENTS.krishvi;
    }

    // Direct match against exact recipient fields
    const direct = RECIPIENT_LIST.find(
      (r) => r.name.toLowerCase() === q || r.nickname.toLowerCase() === q || r.id.toLowerCase() === q
    );
    if (direct) return direct;

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
    if (isCharacterWarping || !selectedRecipient) return;

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
    } else if (trimmed === 'brother') {
      isMatch = true;
    } else if (selectedRecipient.id === 'peacock' && (trimmed === 'peacock' || trimmed === 'white peacock' || trimmed === 'whitepeacock' || trimmed === 'peacoc')) {
      isMatch = true;
    } else if (selectedRecipient.id === 'chiti' && (trimmed === 'teddy' || trimmed === 'chits')) {
      isMatch = true;
    } else if (selectedRecipient.id === 'hanvika' && (trimmed === 'bunny' || trimmed === 'rabbit' || trimmed === 'carrot')) {
      isMatch = true;
    } else if (selectedRecipient.id === 'duck' && (trimmed === 'quack' || trimmed === 'duck')) {
      isMatch = true;
    } else if (selectedRecipient.id === 'cat' && (trimmed === 'meow' || trimmed === 'cat' || trimmed === 'kitty')) {
      isMatch = true;
    } else if (selectedRecipient.id === 'nirvika' && (trimmed === 'swan' || trimmed === 'lake')) {
      isMatch = true;
    } else if (selectedRecipient.id === 'krishvi' && (trimmed === 'butterfly' || trimmed === 'garden')) {
      isMatch = true;
    }

    if (isMatch) {
      // Success! Trigger Character Universe Teleport Warp Animation!
      soundFx.playPowerUp();
      setIsCharacterWarping(true);
      setPasswordError('');

      confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.5 },
        colors: selectedRecipient.particles?.colors || ['#ffd166', '#ff3366', '#ffffff']
      });

      let prog = 0;
      const interval = setInterval(() => {
        prog += 4;
        setCharacterWarpPercent(Math.min(100, prog));
        if (prog >= 100) {
          clearInterval(interval);
          soundFx.playGameWin();
          setTimeout(() => {
            onLoginSuccess(selectedRecipient);
          }, 450);
        }
      }, 40);
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

      {/* ====================================================================
          CHARACTER UNIVERSE WARP & LOADING OVERLAY (ON PASSWORD SUCCESS)
          ==================================================================== */}
      {isCharacterWarping && selectedRecipient && (
        <div
          className="character-warp-overlay animate-fade-in"
          style={{
            background: selectedRecipient.theme.bgGradient
          }}
        >
          {/* Warp Tunnel Speed Rays */}
          <div className="warp-tunnel-rays">
            <div className="ray ray-1" />
            <div className="ray ray-2" />
            <div className="ray ray-3" />
            <div className="ray ray-4" />
            <div className="ray ray-5" />
          </div>

          <div className="character-warp-stage animate-pop">
            {/* Mascot Avatar Bubble */}
            <div
              className="character-warp-avatar-orb animate-bounce"
              style={{
                background: selectedRecipient.theme.badgeGradient,
                boxShadow: `0 0 60px ${selectedRecipient.theme.glowColor}, 0 0 100px rgba(255, 209, 102, 0.5)`
              }}
            >
              <span className="character-warp-emoji">{selectedRecipient.emoji}</span>
            </div>

            {/* Circular Progress Loader */}
            <div className="character-warp-loader-box">
              <svg viewBox="0 0 200 200" className="character-warp-svg">
                <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="8" />
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke={selectedRecipient.theme.primary}
                  strokeWidth="8"
                  strokeDasharray="534"
                  strokeDashoffset={534 - (534 * characterWarpPercent) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
              </svg>
              <div className="character-warp-text-readout">
                <Zap size={22} className="text-yellow-400 animate-bounce" />
                <span className="character-warp-percent-val">{characterWarpPercent}%</span>
                <span className="character-warp-sublabel">Teleporting...</span>
              </div>
            </div>

            <h2 className="character-warp-title">
              Opening {selectedRecipient.name}'s Realm ✨
            </h2>
            <p className="character-warp-desc">
              Awakening {selectedRecipient.nickname}'s personalized world, mascot & handwritten letter...
            </p>
          </div>
        </div>
      )}

      {/* ====================================================================
          BEAUTIFUL BIG RAKHI & WARP INTRO EXPERIENCE
          ==================================================================== */}
      {showCinematicIntro ? (
        <div className={`cinematic-intro-overlay ${isWarping ? 'is-warp-animating' : ''} animate-fade-in`}>
          {/* Skip Intro Button */}
          <button
            type="button"
            className="btn-skip-intro"
            onClick={handleSkipIntro}
            aria-label="Skip intro"
          >
            <span>Skip Intro</span>
            <ArrowRight size={14} />
          </button>

          {/* Ambient Warp Speed Rays */}
          {isWarping && (
            <div className="warp-tunnel-rays">
              <div className="ray ray-1" />
              <div className="ray ray-2" />
              <div className="ray ray-3" />
              <div className="ray ray-4" />
              <div className="ray ray-5" />
            </div>
          )}

          <div className="cinematic-stage">
            {/* Header Badge */}
            <div className="big-rakhi-badge animate-bounce">
              <Sparkles size={14} className="sparkle-spin" />
              <span>Raksha Bandhan 2026</span>
            </div>

            {/* Main Title */}
            <h1 className="big-rakhi-main-title">
              Happy Raksha Bandhan ❤️
            </h1>

            {/* ============================================================
                GRAND ORNATE BIG RAKHI EMBLEM (TAP TO WARP INTO REALM)
                ============================================================ */}
            <div
              className={`big-rakhi-hero-wrapper ${isWarping ? 'rakhi-is-charging' : 'rakhi-is-breathing'}`}
              onClick={handlePressRakhi}
              role="button"
              tabIndex={0}
              title="Tap the Sacred Rakhi to Enter!"
              aria-label="Interactive Sacred Rakhi"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePressRakhi();
                }
              }}
            >
              {/* Radial Energy Halos */}
              <div className="rakhi-outer-halo" />
              <div className="rakhi-inner-glow" />

              {/* Master Ornate Rakhi Vector */}
              <svg viewBox="0 0 460 300" className="grand-rakhi-svg">
                <defs>
                  {/* Golden Gradient */}
                  <linearGradient id="goldFiligree" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="25%" stopColor="#fde047" />
                    <stop offset="60%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                  {/* Ruby Red Gradient */}
                  <radialGradient id="rubyGem" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#ff4d6d" />
                    <stop offset="50%" stopColor="#e11d48" />
                    <stop offset="100%" stopColor="#881337" />
                  </radialGradient>
                  {/* Silk Ribbon Thread Gradient */}
                  <linearGradient id="silkRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="30%" stopColor="#ff3366" />
                    <stop offset="50%" stopColor="#ffd166" />
                    <stop offset="70%" stopColor="#ff3366" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                  {/* Glow Filter */}
                  <filter id="rakhiShimmerGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#ffd166" floodOpacity="0.85" />
                  </filter>
                </defs>

                {/* Extended Silk Threads (Left & Right) */}
                <g className="rakhi-threads-layer">
                  {/* Left Braided Silk Thread */}
                  <path
                    d="M15,150 C70,120 120,180 180,150"
                    fill="none"
                    stroke="url(#silkRibbon)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15,150 C70,170 120,120 180,150"
                    fill="none"
                    stroke="#ffd166"
                    strokeWidth="2.5"
                    strokeDasharray="4,6"
                  />
                  {/* Left Golden Tassel Beads */}
                  <circle cx="50" cy="140" r="4.5" fill="#fde047" stroke="#b45309" strokeWidth="1" />
                  <circle cx="95" cy="158" r="5.5" fill="#ff3366" />
                  <circle cx="140" cy="144" r="4.5" fill="#fde047" />

                  {/* Right Braided Silk Thread */}
                  <path
                    d="M280,150 C340,120 390,180 445,150"
                    fill="none"
                    stroke="url(#silkRibbon)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M280,150 C340,170 390,120 445,150"
                    fill="none"
                    stroke="#ffd166"
                    strokeWidth="2.5"
                    strokeDasharray="4,6"
                  />
                  {/* Right Golden Tassel Beads */}
                  <circle cx="320" cy="144" r="4.5" fill="#fde047" />
                  <circle cx="365" cy="158" r="5.5" fill="#ff3366" />
                  <circle cx="410" cy="140" r="4.5" fill="#fde047" stroke="#b45309" strokeWidth="1" />
                </g>

                {/* Center Big Mandala Core */}
                <g className="rakhi-mandala-center" transform="translate(230, 150)">
                  {/* Outer Golden Radiance Spikes */}
                  <g className="mandala-sunburst animate-spin-slow">
                    {[...Array(16)].map((_, i) => (
                      <path
                        key={i}
                        d="M0,-86 L7,-68 L-7,-68 Z"
                        fill="url(#goldFiligree)"
                        transform={`rotate(${i * 22.5})`}
                      />
                    ))}
                  </g>

                  {/* Outer Golden Ring */}
                  <circle cx="0" cy="0" r="70" fill="#18062b" stroke="url(#goldFiligree)" strokeWidth="4" filter="url(#rakhiShimmerGlow)" />

                  {/* Orbiting Golden & Pearl Beads */}
                  <g className="mandala-beads">
                    {[...Array(12)].map((_, i) => {
                      const angle = (i * 30 * Math.PI) / 180;
                      const bx = Math.cos(angle) * 58;
                      const by = Math.sin(angle) * 58;
                      return (
                        <circle
                          key={i}
                          cx={bx}
                          cy={by}
                          r="4"
                          fill={i % 2 === 0 ? '#ffffff' : '#fde047'}
                          stroke="#b45309"
                          strokeWidth="0.8"
                        />
                      );
                    })}
                  </g>

                  {/* Red Velvet / Ruby Petal Layer */}
                  <circle cx="0" cy="0" r="48" fill="url(#rubyGem)" stroke="url(#goldFiligree)" strokeWidth="2.5" />

                  {/* Inner Lotus Petal Filigree */}
                  <g className="mandala-lotus-petals">
                    {[...Array(8)].map((_, i) => (
                      <path
                        key={i}
                        d="M0,-42 Q8,-24 0,-10 Q-8,-24 0,-42 Z"
                        fill="#ffd166"
                        opacity="0.85"
                        transform={`rotate(${i * 45})`}
                      />
                    ))}
                  </g>

                  {/* Central Ruby Jewel Medallion */}
                  <circle cx="0" cy="0" r="24" fill="url(#rubyGem)" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="0" cy="0" r="16" fill="url(#goldFiligree)" />

                  {/* Central Heart Icon */}
                  <text
                    x="0"
                    y="7"
                    textAnchor="middle"
                    fontSize="18"
                    className="rakhi-core-heart"
                  >
                    ❤️
                  </text>
                </g>
              </svg>

              {/* Progress Loading Ring during Warp */}
              {isWarping && (
                <div className="rakhi-warp-loader-overlay animate-pop">
                  <svg viewBox="0 0 200 200" className="warp-progress-svg">
                    <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255, 209, 102, 0.2)" strokeWidth="8" />
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      fill="none"
                      stroke="url(#goldFiligree)"
                      strokeWidth="8"
                      strokeDasharray="534"
                      strokeDashoffset={534 - (534 * warpPercent) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <div className="warp-progress-text">
                    <Zap size={20} className="text-yellow-400 animate-bounce" />
                    <span className="percent-val">{warpPercent}%</span>
                    <span className="loading-label">Awakening Universe...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Callout Button */}
            <div className="big-rakhi-cta-section">
              <button
                type="button"
                id="btn-press-big-rakhi"
                className={`btn-press-rakhi ${isWarping ? 'is-pressed' : ''}`}
                onClick={handlePressRakhi}
              >
                <Sparkles size={20} />
                <span>{isWarping ? 'AWAKENING REALM...' : 'PRESS RAKHI TO ENTER ✨'}</span>
                <ArrowRight size={20} />
              </button>
              <p className="rakhi-tap-instruction">
                ✨ Tap the sacred Rakhi above or press the button to enter the digital universe ✨
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="portal-container">
          {/* ====================================================================
              STEP 1: ENTER NAME SCREEN (MYSTERIOUS & ULTRA LUXURIOUS)
              ==================================================================== */}
          {!selectedRecipient ? (
            <div className="portal-step-selection animate-fade-in">
              <header className="portal-header">
                <div className="portal-badge-pill animate-bounce">
                  <Sparkles size={14} className="sparkle-spin" />
                  <span>Rakhi 2026 • Secret Gift Realm</span>
                </div>
                <h1 className="portal-main-title">Who is Entering? 🎀</h1>
                <p className="portal-subtitle">
                  Enter your name to unlock your personalized digital Rakhi universe.
                </p>
              </header>

              {/* Luxury Name Input Box Card */}
              <div className={`portal-auth-card luxury-portal-card ${isNameShaking ? 'shake-animation' : ''}`}>
                <div className="card-ambient-highlight" />
                
                <form onSubmit={handleNameSubmit} className="portal-form">
                  <div className="portal-field-label-row">
                    <span className="field-label-title">✨ Enter Your Name:</span>
                    <span className="field-label-badge">Secret Access</span>
                  </div>

                  <div className="input-group-wrapper luxury-input-wrapper">
                    <div className="input-icon-prefix">
                      <User size={22} />
                    </div>
                    <input
                      id="portal-name-input"
                      type="text"
                      value={nameInput}
                      onChange={(e) => {
                        setNameInput(e.target.value);
                        if (nameError) setNameError('');
                      }}
                      placeholder="Type your name to enter..."
                      className="portal-input luxury-input"
                      autoComplete="off"
                      autoCapitalize="words"
                      spellCheck="false"
                      autoFocus
                    />
                    <button
                      type="submit"
                      id="btn-portal-name-submit"
                      className="btn-portal-submit luxury-btn-submit"
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

                {/* Secret Security Seal Badge */}
                <div className="portal-security-seal">
                  <div className="seal-dot" />
                  <span>Handcrafted with infinite brotherly love • 2026</span>
                  <div className="seal-dot" />
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
                <span>Change Sister</span>
              </button>

              {/* Dedicated Greeting Header */}
              <div className="greeting-header">
                <div
                  className="greeting-avatar-bubble animate-bounce"
                  style={{
                    background: selectedRecipient.theme.badgeGradient,
                    boxShadow: `0 0 35px ${selectedRecipient.theme.glowColor}`
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
                className={`portal-auth-card luxury-portal-card greeting-auth-card ${isPasswordShaking ? 'shake-animation' : ''}`}
                style={{
                  borderColor: selectedRecipient.theme.cardBorder,
                  boxShadow: `0 24px 64px rgba(0, 0, 0, 0.75), 0 0 35px ${selectedRecipient.theme.glowColor}`
                }}
              >
                <div className="card-ambient-highlight" />

                <form onSubmit={handlePasswordSubmit} className="portal-form">
                  <div className="portal-field-label-row">
                    <span className="field-label-title">🎁 Enter Secret Password:</span>
                    <span
                      className="field-label-badge"
                      style={{
                        background: `${selectedRecipient.theme.primary}25`,
                        borderColor: selectedRecipient.theme.primary,
                        color: selectedRecipient.theme.textPrimary
                      }}
                    >
                      {selectedRecipient.nickname} Realm
                    </span>
                  </div>

                  <div className="input-group-wrapper luxury-input-wrapper">
                    <div className="input-icon-prefix">
                      <Lock size={22} />
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
                      className="portal-input luxury-input"
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                      disabled={isCharacterWarping}
                      autoFocus
                    />
                    <button
                      type="submit"
                      id="btn-portal-unlock"
                      className="btn-portal-submit luxury-btn-submit"
                      disabled={isCharacterWarping}
                      style={{
                        background: selectedRecipient.theme.badgeGradient
                      }}
                    >
                      <span>Unlock Realm ✨</span>
                      <ArrowRight size={18} />
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
      )}

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
                no found..be happy! Please check the spelling of your name and try again ✨
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
