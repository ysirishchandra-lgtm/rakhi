import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Crown, Sparkles, Trophy, Play, RotateCcw, ArrowLeft, ArrowRight, CheckCircle2, Flame, Heart, X, Star, Zap, Diamond } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../services/soundEffects';

export default function PeacockGame({ recipient, onComplete }) {
  // Stages: 0: Intro, 1: Celestial Plume Catch, 2: Prism Flight Rush, 3: Moonstone Crown Awakening, 4: Victory
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [toastMsg, setToastMsg] = useState('');
  const [combo, setCombo] = useState(0);
  const [scorePopups, setScorePopups] = useState([]);

  // Stage 1 & 2: Plume Catcher Steering State
  const [peacockX, setPeacockX] = useState(50); // percentage (0 - 100)
  const [plumes, setPlumes] = useState([]);
  const [plumesCaught, setPlumesCaught] = useState(0);
  const stage1Target = 10;
  const stage2Target = 12;
  const stageLoopRef = useRef(null);
  const stageSpawnRef = useRef(null);

  // Stage 3: Celestial Moonstone Crown Awakening Boss State
  const [crownHp, setCrownHp] = useState(100);
  const [crownShaking, setCrownShaking] = useState(false);
  const [crownHits, setCrownHits] = useState(0);

  // Helper: Trigger floating score popup
  const addScorePopup = (text, x = 50, y = 50, color = '#38bdf8') => {
    const id = Date.now() + Math.random();
    setScorePopups((prev) => [...prev.slice(-6), { id, text, x, y, color }]);
    setTimeout(() => {
      setScorePopups((prev) => prev.filter((p) => p.id !== id));
    }, 900);
  };

  const startQuest = () => {
    soundFx.playClick();
    setScore(0);
    setCombo(0);
    startStage1();
  };

  const exitGame = () => {
    soundFx.playClick();
    setStage(0);
    clearInterval(stageLoopRef.current);
    clearInterval(stageSpawnRef.current);
  };

  // Keyboard navigation for desktop
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (stage !== 1 && stage !== 2) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setPeacockX((x) => Math.max(12, x - 12));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setPeacockX((x) => Math.min(88, x + 12));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage]);

  // ----------------------------------------------------
  // STAGE 1: CELESTIAL PLUME CATCH
  // ----------------------------------------------------
  const startStage1 = () => {
    setStage(1);
    setPlumes([]);
    setPlumesCaught(0);
    setCombo(0);
    setToastMsg('Catch 10 sacred white plumes & pearls! Steer White Peacock left/right!');
    soundFx.playLevelUp();

    // Spawner
    stageSpawnRef.current = setInterval(() => {
      const types = [
        { icon: '🪶', pts: 50, speed: 1.6, label: '+50 PLUME!' },
        { icon: '💎', pts: 80, speed: 1.4, label: '+80 CRYSTAL!' },
        { icon: '⚪', pts: 40, speed: 1.8, label: '+40 PEARL' },
        { icon: '✨', pts: 100, speed: 2.0, label: 'GOLDEN SPARKLE!' }
      ];
      const selected = types[Math.floor(Math.random() * types.length)];
      const newPlume = {
        id: Math.random(),
        x: Math.random() * 76 + 12,
        y: 0,
        ...selected
      };
      setPlumes((prev) => [...prev.slice(-8), newPlume]);
    }, 1050);

    // Physics Loop
    stageLoopRef.current = setInterval(() => {
      setPlumes((prev) => {
        const nextList = [];
        for (const p of prev) {
          const nextY = p.y + p.speed * 2.2;
          // Check collision with White Peacock at bottom (y around 78-92%)
          if (nextY >= 76 && nextY <= 92 && Math.abs(p.x - peacockX) < 16) {
            // Caught!
            soundFx.playScorePoint();
            setScore((s) => s + p.pts);
            setPlumesCaught((c) => {
              const nextCount = c + 1;
              if (nextCount >= stage1Target) {
                setTimeout(startStage2, 450);
              }
              return nextCount;
            });
            setCombo((cb) => {
              const newCb = cb + 1;
              if (newCb > 1) {
                soundFx.playComboStreak(newCb);
                addScorePopup(`PLUME STREAK x${newCb}!`, p.x, 78, '#38bdf8');
              } else {
                addScorePopup(p.label, p.x, 78, '#ffffff');
              }
              return newCb;
            });
          } else if (nextY < 100) {
            nextList.push({ ...p, y: nextY });
          }
        }
        return nextList;
      });
    }, 45);
  };

  // ----------------------------------------------------
  // STAGE 2: PRISM FLIGHT RUSH
  // ----------------------------------------------------
  const startStage2 = () => {
    clearInterval(stageLoopRef.current);
    clearInterval(stageSpawnRef.current);

    setStage(2);
    setPlumes([]);
    setPlumesCaught(0);
    setCombo(0);
    setToastMsg('⚡ Stage 2: Prism Flight Rush! Fast falling sapphire diamonds & celestial feathers!');
    soundFx.playLevelUp();

    stageSpawnRef.current = setInterval(() => {
      const types = [
        { icon: '🪶', pts: 70, speed: 2.1, label: '+70 PLUME' },
        { icon: '💎', pts: 120, speed: 2.4, label: '+120 SAPPHIRE!' },
        { icon: '👑', pts: 150, speed: 2.6, label: 'ROYAL CROWN!' },
        { icon: '🌟', pts: 90, speed: 2.2, label: '+90 STAR' }
      ];
      const selected = types[Math.floor(Math.random() * types.length)];
      const newPlume = {
        id: Math.random(),
        x: Math.random() * 76 + 12,
        y: 0,
        ...selected
      };
      setPlumes((prev) => [...prev.slice(-9), newPlume]);
    }, 850);

    stageLoopRef.current = setInterval(() => {
      setPlumes((prev) => {
        const nextList = [];
        for (const p of prev) {
          const nextY = p.y + p.speed * 2.5;
          if (nextY >= 76 && nextY <= 92 && Math.abs(p.x - peacockX) < 16) {
            soundFx.playScorePoint();
            setScore((s) => s + p.pts);
            setPlumesCaught((c) => {
              const nextCount = c + 1;
              if (nextCount >= stage2Target) {
                setTimeout(startStage3, 500);
              }
              return nextCount;
            });
            setCombo((cb) => {
              const newCb = cb + 1;
              if (newCb > 1) {
                soundFx.playComboStreak(newCb);
                addScorePopup(`PRISM COMBO x${newCb}!`, p.x, 78, '#fde047');
              } else {
                addScorePopup(p.label, p.x, 78, '#38bdf8');
              }
              return newCb;
            });
          } else if (nextY < 100) {
            nextList.push({ ...p, y: nextY });
          }
        }
        return nextList;
      });
    }, 40);
  };

  // ----------------------------------------------------
  // STAGE 3: CELESTIAL MOONSTONE CROWN AWAKENING
  // ----------------------------------------------------
  const startStage3 = () => {
    clearInterval(stageLoopRef.current);
    clearInterval(stageSpawnRef.current);

    setStage(3);
    setCrownHp(100);
    setCrownHits(0);
    setToastMsg('👑 FINAL STAGE: CELESTIAL MOONSTONE PRISM! Tap rapidly to awaken the White Peacock Crown & unseal the Vault!');
    soundFx.playBossAlert();
  };

  const handleCrownTap = (e) => {
    if (crownHp <= 0) return;

    soundFx.playBossHit();
    setCrownShaking(true);
    setTimeout(() => setCrownShaking(false), 120);

    const dmg = 8;
    const nextHp = Math.max(0, crownHp - dmg);
    setCrownHp(nextHp);
    setCrownHits((h) => h + 1);
    setScore((s) => s + 50);

    const rect = e?.currentTarget?.getBoundingClientRect();
    const x = rect ? ((e.clientX - rect.left) / rect.width) * 100 : 50;
    addScorePopup('✨ RADIANCE BURST! +50', x || 50, 45, '#38bdf8');

    if (nextHp <= 0) {
      triggerVictory();
    }
  };

  // ----------------------------------------------------
  // STAGE 4: VICTORY CEREMONY
  // ----------------------------------------------------
  const triggerVictory = () => {
    setStage(4);
    clearInterval(stageLoopRef.current);
    clearInterval(stageSpawnRef.current);
    soundFx.playGameWin();

    confetti({
      particleCount: 160,
      spread: 95,
      origin: { y: 0.55 },
      colors: ['#38bdf8', '#10b981', '#ffffff', '#fde047', '#67e8f9']
    });

    if (onComplete) {
      onComplete(score + 650);
    }
  };

  return (
    <>
      {/* Mini-game Card Teaser in Main View */}
      <div className="mini-game-card game-peacock animate-pop">
        <div className="game-card-header">
          <div className="game-badge-chip peacock-chip">
            <Crown size={15} />
            <span>Thanishqa's Level 3 Quest</span>
          </div>
          <span className="game-level-tag">3 Exciting Stages</span>
        </div>

        <h3 className="game-card-title">White Peacock Sanctuary & Plume Quest! 🦚✨</h3>
        <p className="game-card-desc">
          Steer the graceful White Peacock across celestial skies, gather glowing sacred plumes & sapphires, and awaken the Imperial Moonstone Crown!
        </p>

        <button
          id="btn-start-peacock-game"
          type="button"
          className="btn-game-primary peacock-theme-btn"
          onClick={startQuest}
        >
          <Play size={18} />
          <span>{score > 0 ? 'Replay Peacock Quest 🦚' : 'Start Plume Quest 🦚'}</span>
        </button>
      </div>

      {/* Full-Screen Immersive Game Modal Overlay */}
      {stage >= 1 &&
        createPortal(
          <div className="modal-backdrop" onClick={exitGame}>
            <div className="game-modal-card peacock-modal animate-pop" onClick={(e) => e.stopPropagation()}>
              <button className="btn-modal-x" onClick={exitGame} aria-label="Exit Game">
                <X size={20} />
              </button>

              {/* HUD Banner */}
              <div className="game-hud-bar">
                <div className="hud-pill score-pill">
                  <Trophy size={14} className="hud-icon-gold" />
                  <span>Score: <strong>{score}</strong></span>
                </div>

                <div className="hud-pill stage-pill">
                  <Crown size={14} />
                  <span>Stage {stage}/3</span>
                </div>

                {stage <= 2 && (
                  <div className="hud-pill progress-pill">
                    <span>Plumes: <strong>{plumesCaught}/{stage === 1 ? stage1Target : stage2Target}</strong></span>
                  </div>
                )}

                {combo > 1 && (
                  <div className="hud-pill combo-pill animate-bounce">
                    <Flame size={14} />
                    <span>{combo}x Streak!</span>
                  </div>
                )}
              </div>

              {/* Floating Score Popups */}
              <div className="floating-popups-layer">
                {scorePopups.map((p) => (
                  <span
                    key={p.id}
                    className="score-popup-item animate-score-float"
                    style={{ left: `${p.x}%`, top: `${p.y}%`, color: p.color }}
                  >
                    {p.text}
                  </span>
                ))}
              </div>

              {/* Toast Messages */}
              {toastMsg && (
                <div className="game-toast-banner animate-pop">
                  <span>{toastMsg}</span>
                </div>
              )}

              {/* ----------------------------------------------------
                  STAGES 1 & 2: CELESTIAL PLUME CATCHER SKY
                 ---------------------------------------------------- */}
              {(stage === 1 || stage === 2) && (
                <div className="plume-catcher-stage celestial-sky-bg">
                  {/* Sky Clouds & Stars */}
                  <div className="sky-cloud cloud-1">☁️</div>
                  <div className="sky-cloud cloud-2">✨</div>
                  <div className="sky-cloud cloud-3">☁️</div>

                  {/* Falling Plumes, Crystals, Pearls */}
                  {plumes.map((p) => (
                    <div
                      key={p.id}
                      className="falling-plume-item animate-spin-gentle"
                      style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`
                      }}
                    >
                      <span className="plume-icon">{p.icon}</span>
                    </div>
                  ))}

                  {/* Player Basket / White Peacock Sprite */}
                  <div
                    className="basket-player-anchor"
                    style={{
                      left: `${peacockX}%`,
                      transform: 'translateX(-50%)',
                      position: 'absolute',
                      bottom: '24px'
                    }}
                  >
                    <div className="basket-peacock-sprite animate-bounce">
                      <span className="basket-emoji">🦚✨</span>
                    </div>
                  </div>

                  {/* Touch Steering Controls for Mobile */}
                  <div className="touch-steering-row">
                    <button
                      type="button"
                      className="btn-steer"
                      onClick={() => setPeacockX((x) => Math.max(12, x - 18))}
                    >
                      <ArrowLeft size={20} />
                      <span>Left</span>
                    </button>
                    <div className="steering-guide">
                      <span>Drag or Tap Buttons</span>
                    </div>
                    <button
                      type="button"
                      className="btn-steer"
                      onClick={() => setPeacockX((x) => Math.min(88, x + 18))}
                    >
                      <span>Right</span>
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STAGE 3: MOONSTONE CROWN AWAKENING BOSS
                 ---------------------------------------------------- */}
              {stage === 3 && (
                <div className="moonstone-boss-stage animate-pop">
                  <div className="boss-header-bar">
                    <div className="boss-title-tag">
                      <Diamond size={16} />
                      <span>Imperial Moonstone Crown Prism</span>
                    </div>
                    <div className="boss-hp-bar-frame">
                      <div
                        className="boss-hp-fill peacock-hp"
                        style={{ width: `${crownHp}%` }}
                      />
                    </div>
                    <span className="boss-hp-text">{crownHp}% Seal Remaining</span>
                  </div>

                  <div
                    className={`moonstone-target-container ${crownShaking ? 'target-shake' : ''}`}
                    onClick={handleCrownTap}
                  >
                    <div className="moonstone-aura-pulse" />
                    <div className="moonstone-crown-sprite animate-bounce">
                      <span className="crown-grand-emoji">👑💎🦚</span>
                    </div>
                    <div className="tap-burst-prompt">
                      <Zap size={22} className="icon-zap-pulse" />
                      <span>TAP RAPIDLY TO AWAKEN!</span>
                    </div>
                  </div>

                  <div className="boss-subtext">
                    <span>Hits Landed: <strong>{crownHits}</strong></span>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STAGE 4: GRAND VICTORY SCREEN
                 ---------------------------------------------------- */}
              {stage === 4 && (
                <div className="game-victory-view animate-pop">
                  <div className="victory-crown-trophy">
                    <Crown size={72} className="crown-peacock-gold animate-bounce" />
                    <div className="trophy-aura-ring peacock-ring" />
                  </div>

                  <h3 className="victory-title">CELESTIAL WHITE PEACOCK CHAMPION! 🦚👑</h3>
                  <p className="victory-subtitle">
                    Thanishqa gathered all the sacred plumes, illuminated the crystal prism, and awakened the Imperial Crown with <strong>{score} pts</strong>!
                  </p>

                  <div className="victory-unlock-card peacock-unlock-card">
                    <CheckCircle2 size={24} className="unlock-check-icon" />
                    <div>
                      <strong>Level 3 Cleared! Secret Rakhi Seal Broken!</strong>
                      <p>Proceed below to read your royal heartfelt letter and unwrap the White Peacock Rakhi Gift Box 🎁</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-victory-done peacock-theme-btn"
                    onClick={exitGame}
                  >
                    <CheckCircle2 size={18} />
                    <span>Done & Continue Celebration ✨</span>
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
