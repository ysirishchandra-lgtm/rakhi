import React, { useState, useEffect } from 'react';
import ParticleCanvas from './ParticleCanvas';
import RecipientHeader from './RecipientHeader';
import AnimatedMascot from './AnimatedMascot';
import InteractiveWidget from './InteractiveWidget';
import LetterCard from './LetterCard';
import GiftTeaserCard from './GiftTeaserCard';

// Dedicated Multi-Level Mini-Games
import ChitiGame from './games/ChitiGame';
import DuckGame from './games/DuckGame';
import CatGame from './games/CatGame';
import PeacockGame from './games/PeacockGame';
import RabbitGame from './games/RabbitGame';

import { Sparkles, Heart, Trophy, CheckCircle, Lock, ArrowRight, ArrowLeft, Star, Gift, Mail, Music } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../services/soundEffects';

export default function RecipientExperience({ recipient, onLogout }) {
  const { theme, hero } = recipient;

  // Level Progression: 1: Mascot Dance, 2: Affinity Feature, 3: Quest Game, 4: Secret Letter, 5: Grand Gift Box
  const [currentLevel, setCurrentLevel] = useState(1);
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(1);

  const [hasDanced, setHasDanced] = useState(false);
  const [hasUsedWidget, setHasUsedWidget] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [isSealBroken, setIsSealBroken] = useState(false);

  // Restore progression from sessionStorage
  useEffect(() => {
    try {
      const savedMax = parseInt(sessionStorage.getItem(`rakhi_2026_max_level_${recipient.id}`) || '1', 10);
      const savedCurr = parseInt(sessionStorage.getItem(`rakhi_2026_curr_level_${recipient.id}`) || '1', 10);
      const savedDanced = sessionStorage.getItem(`rakhi_2026_danced_${recipient.id}`) === 'true';
      const savedWidget = sessionStorage.getItem(`rakhi_2026_widget_${recipient.id}`) === 'true';
      const savedGame = sessionStorage.getItem(`rakhi_2026_game_cleared_${recipient.id}`) === 'true';
      const savedSeal = sessionStorage.getItem(`rakhi_2026_seal_broken_${recipient.id}`) === 'true';

      if (savedDanced) setHasDanced(true);
      if (savedWidget) setHasUsedWidget(true);
      if (savedGame) setIsGameCompleted(true);
      if (savedSeal) setIsSealBroken(true);

      let derivedMax = 1;
      if (savedDanced) derivedMax = Math.max(derivedMax, 2);
      if (savedWidget) derivedMax = Math.max(derivedMax, 3);
      if (savedGame) derivedMax = Math.max(derivedMax, 4);
      if (savedSeal) derivedMax = Math.max(derivedMax, 5);
      derivedMax = Math.max(derivedMax, isNaN(savedMax) ? 1 : savedMax);

      setMaxUnlockedLevel(derivedMax);
      if (savedCurr) {
        setCurrentLevel(Math.min(savedCurr, derivedMax));
      }
    } catch (err) {
      console.warn('Session access error:', err);
    }
  }, [recipient.id]);

  const unlockUpToLevel = (levelNum) => {
    setMaxUnlockedLevel((prev) => {
      const nextMax = Math.max(prev, levelNum);
      try {
        sessionStorage.setItem(`rakhi_2026_max_level_${recipient.id}`, nextMax.toString());
      } catch (e) {}
      return nextMax;
    });
  };

  const goToLevel = (lvl) => {
    const effectiveMax = isSealBroken ? 5 : isGameCompleted ? 4 : hasUsedWidget ? 3 : hasDanced ? 2 : maxUnlockedLevel;
    if (lvl >= 1 && lvl <= 5 && lvl <= effectiveMax) {
      soundFx.playClick();
      setCurrentLevel(lvl);
      try {
        sessionStorage.setItem(`rakhi_2026_curr_level_${recipient.id}`, lvl.toString());
      } catch (e) {}
    } else {
      soundFx.playNegative();
    }
  };

  const advanceToLevel = (targetLvl) => {
    soundFx.playClick();
    unlockUpToLevel(targetLvl);
    setCurrentLevel(targetLvl);
    try {
      sessionStorage.setItem(`rakhi_2026_curr_level_${recipient.id}`, targetLvl.toString());
      sessionStorage.setItem(`rakhi_2026_max_level_${recipient.id}`, targetLvl.toString());
    } catch (e) {}
  };

  // Level 1: Mascot Dance Complete
  const handleMascotDance = () => {
    setHasDanced(true);
    unlockUpToLevel(2);
    try {
      sessionStorage.setItem(`rakhi_2026_danced_${recipient.id}`, 'true');
    } catch (e) {}
  };

  // Level 2: Interactive Feature Complete
  const handleWidgetAction = () => {
    setHasUsedWidget(true);
    unlockUpToLevel(3);
    try {
      sessionStorage.setItem(`rakhi_2026_widget_${recipient.id}`, 'true');
    } catch (e) {}
  };

  // Level 3: Mini-Game Complete
  const handleGameComplete = (score) => {
    setIsGameCompleted(true);
    unlockUpToLevel(4);
    try {
      sessionStorage.setItem(`rakhi_2026_game_cleared_${recipient.id}`, 'true');
    } catch (e) {}
  };

  // Reset this character's progress back to Level 1
  const handleResetProgress = () => {
    soundFx.playClick();
    setCurrentLevel(1);
    setMaxUnlockedLevel(1);
    setHasDanced(false);
    setHasUsedWidget(false);
    setIsGameCompleted(false);
    setIsSealBroken(false);

    try {
      sessionStorage.removeItem(`rakhi_2026_max_level_${recipient.id}`);
      sessionStorage.removeItem(`rakhi_2026_curr_level_${recipient.id}`);
      sessionStorage.removeItem(`rakhi_2026_danced_${recipient.id}`);
      sessionStorage.removeItem(`rakhi_2026_widget_${recipient.id}`);
      sessionStorage.removeItem(`rakhi_2026_game_cleared_${recipient.id}`);
      sessionStorage.removeItem(`rakhi_2026_seal_broken_${recipient.id}`);
      sessionStorage.removeItem(`rakhi_2026_gift_revealed_${recipient.id}`);

      localStorage.removeItem(`rakhi_2026_max_level_${recipient.id}`);
      localStorage.removeItem(`rakhi_2026_curr_level_${recipient.id}`);
      localStorage.removeItem(`rakhi_2026_danced_${recipient.id}`);
      localStorage.removeItem(`rakhi_2026_widget_${recipient.id}`);
      localStorage.removeItem(`rakhi_2026_game_cleared_${recipient.id}`);
      localStorage.removeItem(`rakhi_2026_seal_broken_${recipient.id}`);
      localStorage.removeItem(`rakhi_2026_gift_revealed_${recipient.id}`);
    } catch (e) {}
  };

  // Level 4: Seal Break Complete
  const handleBreakSeal = () => {
    soundFx.playSealBreak();
    setIsSealBroken(true);
    unlockUpToLevel(5);
    try {
      sessionStorage.setItem(`rakhi_2026_seal_broken_${recipient.id}`, 'true');
      sessionStorage.setItem(`rakhi_2026_max_level_${recipient.id}`, '5');
    } catch (e) {}

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: recipient.particles?.colors || ['#ffd166', '#ff3366', '#ffffff']
    });
  };

  const getWidgetEmoji = (id) => {
    switch (id) {
      case 'chiti': return '🧸';
      case 'duck': return '🌊';
      case 'cat': return '🐾';
      case 'peacock': return '🦚';
      case 'hanvika': return '🥕';
      default: return '✨';
    }
  };

  const effectiveMax = isSealBroken ? 5 : isGameCompleted ? 4 : hasUsedWidget ? 3 : hasDanced ? 2 : maxUnlockedLevel;

  const LEVEL_ITEMS = [
    { id: 1, label: 'Level 1', title: 'Mascot Dance', icon: '💃' },
    { id: 2, label: 'Level 2', title: recipient.interactiveWidget.title, icon: getWidgetEmoji(recipient.id) },
    { id: 3, label: 'Level 3', title: 'Quest Game', icon: '🎮' },
    { id: 4, label: 'Level 4', title: 'Secret Letter', icon: '💌' },
    { id: 5, label: 'Level 5', title: 'Grand Gift Box', icon: '🎁' }
  ];

  const renderMiniGame = () => {
    switch (recipient.id) {
      case 'chiti':
        return <ChitiGame recipient={recipient} onComplete={handleGameComplete} />;
      case 'duck':
        return <DuckGame recipient={recipient} onComplete={handleGameComplete} />;
      case 'cat':
        return <CatGame recipient={recipient} onComplete={handleGameComplete} />;
      case 'peacock':
        return <PeacockGame recipient={recipient} onComplete={handleGameComplete} />;
      case 'hanvika':
        return <RabbitGame recipient={recipient} onComplete={handleGameComplete} />;
      default:
        return null;
    }
  };

  return (
    <div
      id={`experience-world-${recipient.id}`}
      className={`recipient-world-wrapper theme-${recipient.id}`}
      style={{
        '--theme-primary': theme.primary,
        '--theme-secondary': theme.secondary,
        '--theme-accent': theme.accent,
        '--theme-bg-gradient': theme.bgGradient,
        '--theme-card-bg': theme.cardBg,
        '--theme-card-border': theme.cardBorder,
        '--theme-glow': theme.glowColor,
        '--theme-text-primary': theme.textPrimary,
        '--theme-text-secondary': theme.textSecondary,
        '--theme-font-heading': theme.fontHeading,
        '--theme-font-accent': theme.fontAccent,
        '--theme-badge-gradient': theme.badgeGradient
      }}
    >
      {/* Ambient Particle Canvas */}
      <ParticleCanvas recipient={recipient} />

      {/* Top Header */}
      <RecipientHeader
        recipient={recipient}
        onLogout={onLogout}
        onResetProgress={handleResetProgress}
      />

      <main className="world-main-container">
        {/* Level Progression Stepper Roadmap */}
        <section className="level-stepper-container animate-fade-in">
          <div className="level-stepper-header">
            <div className="stepper-badge">
              <Star size={14} className="text-yellow-400 animate-spin-slow" />
              <span>Rakhi 2026 Quest Journey</span>
            </div>
            <span className="stepper-stage-count">
              Level <strong>{currentLevel}</strong> of <strong>5</strong>
            </span>
          </div>

          <div className="level-stepper-track">
            {LEVEL_ITEMS.map((item) => {
              const isCurrent = currentLevel === item.id;
              const isUnlocked = item.id <= effectiveMax;
              const isCompleted = item.id < effectiveMax;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`level-step-node ${isCurrent ? 'is-active' : ''} ${isUnlocked ? 'is-unlocked' : 'is-locked'} ${isCompleted ? 'is-completed' : ''}`}
                  onClick={() => goToLevel(item.id)}
                  disabled={!isUnlocked}
                  title={isUnlocked ? `Go to ${item.title}` : `Locked: Complete Level ${item.id - 1} first`}
                  aria-label={`${item.label}: ${item.title}`}
                >
                  <div className="step-icon-bubble">
                    {isCompleted ? <CheckCircle size={16} className="text-green-400" /> : isUnlocked ? item.icon : <Lock size={14} className="text-gray-400" />}
                  </div>
                  <div className="step-meta">
                    <span className="step-label">{item.label}</span>
                    <span className="step-title">{item.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ----------------------------------------------------
            LEVEL 1: MASCOT DANCE SPOTLIGHT
           ---------------------------------------------------- */}
        {currentLevel === 1 && (
          <section className="level-stage-view animate-pop">
            <div className="hero-section">
              <div className="hero-content">
                <div className="hero-tag-pill">
                  <Sparkles size={14} className="hero-sparkle" />
                  <span>{theme.highlightTag}</span>
                </div>

                <h1 className="hero-title">{hero.title}</h1>
                <p className="hero-subtitle">{hero.subtitle}</p>

                <blockquote className="hero-quote">
                  <p>{recipient.welcomeQuote}</p>
                </blockquote>
              </div>

              <div className="hero-mascot-stage">
                <AnimatedMascot recipient={recipient} onInteract={handleMascotDance} />
              </div>
            </div>

            {/* Level 1 Progression Action */}
            <div className="level-advance-card">
              {effectiveMax >= 2 ? (
                <div className="advance-banner animate-pop">
                  <div className="advance-info">
                    <CheckCircle size={20} className="text-green-400" />
                    <span>Level 1 Dance Complete! Level 2 Unlocked!</span>
                  </div>
                  <button
                    type="button"
                    className="btn-next-level"
                    onClick={() => advanceToLevel(2)}
                  >
                    <span>Proceed to Level 2 ✨</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <p className="level-prompt-hint">
                  💡 <strong>Level 1 Objective:</strong> Tap the mascot above to watch their dance routine and unlock Level 2!
                </p>
              )}
            </div>
          </section>
        )}

        {/* ----------------------------------------------------
            LEVEL 2: INTERACTIVE AFFINITY & SPARKLES
           ---------------------------------------------------- */}
        {currentLevel === 2 && (
          <section className="level-stage-view animate-pop">
            <InteractiveWidget
              recipient={recipient}
              onComplete={handleWidgetAction}
              isCompleted={hasUsedWidget}
            />

            {/* Level 2 Progression Action */}
            <div className="level-advance-card">
              {effectiveMax >= 3 ? (
                <div className="advance-banner animate-pop">
                  <div className="advance-info">
                    <CheckCircle size={20} className="text-green-400" />
                    <span>Level 2 Power Unleashed! Level 3 Quest Unlocked!</span>
                  </div>
                  <button
                    type="button"
                    className="btn-next-level"
                    onClick={() => advanceToLevel(3)}
                  >
                    <span>Proceed to Level 3 Quest 🎮</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <p className="level-prompt-hint">
                  💡 <strong>Level 2 Objective:</strong> Tap the action button above to share love sparks and unlock Level 3!
                </p>
              )}
            </div>
          </section>
        )}

        {/* ----------------------------------------------------
            LEVEL 3: ADVENTURE MINI-GAME
           ---------------------------------------------------- */}
        {currentLevel === 3 && (
          <section className="level-stage-view animate-pop">
            {renderMiniGame()}

            {/* Level 3 Progression Action */}
            <div className="level-advance-card">
              {effectiveMax >= 4 ? (
                <div className="advance-banner animate-pop">
                  <div className="advance-info">
                    <Trophy size={20} className="text-yellow-400" />
                    <span>Level 3 Quest Conquered! Secret Letter Ready!</span>
                  </div>
                  <button
                    type="button"
                    className="btn-next-level"
                    onClick={() => advanceToLevel(4)}
                  >
                    <span>Proceed to Level 4 Letter 💌</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <p className="level-prompt-hint">
                  💡 <strong>Level 3 Objective:</strong> Complete the mini-game quest above to unlock the Golden Rakhi Seal and Secret Letter!
                </p>
              )}
            </div>
          </section>
        )}

        {/* ----------------------------------------------------
            LEVEL 4: SACRED SEAL & HEARTFELT LETTER
           ---------------------------------------------------- */}
        {currentLevel === 4 && (
          <section className="level-stage-view animate-pop">
            {!isSealBroken ? (
              <div className="seal-break-card animate-pop">
                <div className="seal-wax-emblem animate-pulse" onClick={handleBreakSeal}>
                  <span className="seal-wax-icon">🔐</span>
                </div>
                <h3 className="seal-break-title">Break the Golden Rakhi Seal ✨</h3>
                <p className="seal-break-desc">
                  You conquered the challenge! Tap below to break the ceremonial golden wax seal and unlock your handwritten brother letter.
                </p>
                <button
                  id="btn-break-wax-seal"
                  className="btn-break-seal-action"
                  onClick={handleBreakSeal}
                >
                  <Sparkles size={18} />
                  <span>Unseal Brother's Letter ✨</span>
                </button>
              </div>
            ) : (
              <>
                <LetterCard recipient={recipient} isUnlocked={true} />

                {/* Level 4 Progression Action */}
                <div className="level-advance-card">
                  <div className="advance-banner animate-pop">
                    <div className="advance-info">
                      <CheckCircle size={20} className="text-green-400" />
                      <span>Letter Unsealed! The Grand Gift Box Awaits!</span>
                    </div>
                    <button
                      type="button"
                      className="btn-next-level"
                      onClick={() => advanceToLevel(5)}
                    >
                      <span>Proceed to Grand Gift Box 🎁</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        )}

        {/* ----------------------------------------------------
            LEVEL 5: GRAND RAKHI 2026 GIFT REVEAL
           ---------------------------------------------------- */}
        {currentLevel === 5 && (
          <section className="level-stage-view animate-pop">
            <GiftTeaserCard recipient={recipient} isUnlocked={true} />
          </section>
        )}

        {/* Level Navigation Arrows Bar */}
        <div className="level-nav-bar">
          <button
            type="button"
            className="btn-nav-level prev"
            onClick={() => goToLevel(currentLevel - 1)}
            disabled={currentLevel === 1}
          >
            <ArrowLeft size={16} />
            <span>Previous Level</span>
          </button>

          <span className="level-nav-indicator">
            Level {currentLevel} of 5
          </span>

          <button
            type="button"
            className="btn-nav-level next"
            onClick={() => goToLevel(currentLevel + 1)}
            disabled={currentLevel >= effectiveMax || currentLevel === 5}
          >
            <span>Next Level</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="world-footer">
        <div className="footer-inner">
          <p>
            Rakhi 2026 Special Edition • Handcrafted with love for <strong>{recipient.name}</strong> 🎀
          </p>
          <button
            type="button"
            className="btn-footer-portal"
            onClick={onLogout}
          >
            Return to Secret Portal ✨
          </button>
        </div>
      </footer>
    </div>
  );
}
