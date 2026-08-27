import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Trophy, Play, ArrowLeft, ArrowRight, CheckCircle2, Flame, X, Star, Moon, Waves } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../services/soundEffects';

export default function SwanGame({ recipient, onComplete }) {
  // Stages: 0: Intro, 1: Moonlit Lake Lotus Harvest, 2: Midnight Mist Ripple Rush, 3: Enchanted Frost Moonstone Awakening, 4: Victory
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [toastMsg, setToastMsg] = useState('');
  const [combo, setCombo] = useState(0);
  const [scorePopups, setScorePopups] = useState([]);

  // Stage 1 & 2 Swan Position (10 - 90%)
  const [swanX, setSwanX] = useState(50);
  const [fallingItems, setFallingItems] = useState([]);
  const [itemsCollected, setItemsCollected] = useState(0);
  const stage1Target = 10;
  const stage2Target = 12;
  const gameLoopRef = useRef(null);
  const spawnTimerRef = useRef(null);

  // Stage 3 Boss / Awakening State
  const [moonstoneHp, setMoonstoneHp] = useState(100);
  const [moonstoneShaking, setMoonstoneShaking] = useState(false);

  const addScorePopup = (text, x = 50, y = 50, color = '#818cf8') => {
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
    clearInterval(gameLoopRef.current);
    clearInterval(spawnTimerRef.current);
  };

  // ----------------------------------------------------
  // STAGE 1: MOONLIT LAKE LOTUS HARVEST
  // ----------------------------------------------------
  const startStage1 = () => {
    setStage(1);
    setFallingItems([]);
    setItemsCollected(0);
    setCombo(0);
    setToastMsg('Stage 1: Moonlit Lake! Collect 10 glowing moonlotuses 🪷 & pearls with Swan!');
    soundFx.playLevelUp();

    spawnTimerRef.current = setInterval(() => {
      const types = [
        { icon: '🪷', pts: 50, label: '+50 LOTUS!' },
        { icon: '💎', pts: 80, label: '+80 PEARL!' },
        { icon: '💧', pts: 40, label: '+40 RIPPLE' },
        { icon: '⭐', pts: 100, label: '+100 STARLIGHT!' }
      ];
      const selected = types[Math.floor(Math.random() * types.length)];
      const newItem = {
        id: Math.random(),
        x: Math.random() * 80 + 10,
        y: 0,
        speed: 1.6,
        ...selected
      };
      setFallingItems((prev) => [...prev.slice(-8), newItem]);
    }, 1000);

    gameLoopRef.current = setInterval(() => {
      setFallingItems((prev) => {
        const nextList = [];
        for (const item of prev) {
          const nextY = item.y + item.speed * 2.2;
          if (nextY >= 78 && nextY <= 92 && Math.abs(item.x - swanX) < 16) {
            soundFx.playScorePoint();
            setScore((s) => s + item.pts);
            setItemsCollected((c) => {
              const updated = c + 1;
              if (updated >= stage1Target) {
                setTimeout(startStage2, 500);
              }
              return updated;
            });
            setCombo((cb) => {
              const newCb = cb + 1;
              if (newCb > 1) {
                soundFx.playComboStreak(newCb);
                addScorePopup(`SWAN COMBO x${newCb}!`, swanX, 75, '#818cf8');
              } else {
                addScorePopup(item.label, swanX, 75, '#c7d2fe');
              }
              return newCb;
            });
            continue;
          }
          if (nextY < 100) {
            nextList.push({ ...item, y: nextY });
          } else {
            setCombo(0);
          }
        }
        return nextList;
      });
    }, 50);
  };

  // Keyboard navigation
  useEffect(() => {
    if (stage !== 1 && stage !== 2) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setSwanX((x) => Math.max(10, x - 12));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setSwanX((x) => Math.min(90, x + 12));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [stage]);

  const handleTouchSteer = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const relX = ((clientX - rect.left) / rect.width) * 100;
    setSwanX(Math.max(10, Math.min(90, relX)));
  };

  // ----------------------------------------------------
  // STAGE 2: MIDNIGHT MIST RIPPLE RUSH
  // ----------------------------------------------------
  const startStage2 = () => {
    clearInterval(gameLoopRef.current);
    clearInterval(spawnTimerRef.current);
    setStage(2);
    setFallingItems([]);
    setItemsCollected(0);
    setToastMsg('🌙⚡ Stage 2: Midnight Mist Rush! Catch silver starlight gems & rainbow lotus blossoms!');
    soundFx.playLevelUp();

    spawnTimerRef.current = setInterval(() => {
      const types = [
        { icon: '🌙', pts: 100, label: 'MOONSTONE +100!' },
        { icon: '🪷', pts: 60, label: '+60' },
        { icon: '✨', pts: 120, label: 'STARBURST +120!' }
      ];
      const selected = types[Math.floor(Math.random() * types.length)];
      const newItem = {
        id: Math.random(),
        x: Math.random() * 80 + 10,
        y: 0,
        speed: 2.1,
        ...selected
      };
      setFallingItems((prev) => [...prev.slice(-8), newItem]);
    }, 800);

    gameLoopRef.current = setInterval(() => {
      setFallingItems((prev) => {
        const nextList = [];
        for (const item of prev) {
          const nextY = item.y + item.speed * 2.3;
          if (nextY >= 78 && nextY <= 92 && Math.abs(item.x - swanX) < 16) {
            soundFx.playPowerUp();
            setScore((s) => s + item.pts);
            setItemsCollected((c) => {
              const updated = c + 1;
              if (updated >= stage2Target) {
                setTimeout(startStage3, 500);
              }
              return updated;
            });
            setCombo((cb) => {
              const newCb = cb + 1;
              soundFx.playComboStreak(newCb);
              addScorePopup(`MIST x${newCb}!`, swanX, 75, '#818cf8');
              return newCb;
            });
            continue;
          }
          if (nextY < 100) {
            nextList.push({ ...item, y: nextY });
          }
        }
        return nextList;
      });
    }, 45);
  };

  // ----------------------------------------------------
  // STAGE 3: ENCHANTED FROST MOONSTONE AWAKENING
  // ----------------------------------------------------
  const startStage3 = () => {
    clearInterval(gameLoopRef.current);
    clearInterval(spawnTimerRef.current);
    setStage(3);
    setMoonstoneHp(100);
    setToastMsg('🔮 FINAL STAGE: Enchanted Frost Moonstone! Tap rapidly to channel moonlit ripples & awaken the seal!');
    soundFx.playBossAlert();
  };

  const handleMoonstoneTap = (e) => {
    if (moonstoneHp <= 0) return;

    soundFx.playBossHit();
    setMoonstoneShaking(true);
    setTimeout(() => setMoonstoneShaking(false), 120);

    const dmg = 8;
    const nextHp = Math.max(0, moonstoneHp - dmg);
    setMoonstoneHp(nextHp);
    setScore((s) => s + 45);

    const rect = e?.currentTarget?.getBoundingClientRect();
    const x = rect ? ((e.clientX - rect.left) / rect.width) * 100 : 50;
    addScorePopup('✨ MOONLIGHT SPARKLE! +45', x || 50, 45, '#818cf8');

    if (nextHp <= 0) {
      triggerVictory();
    }
  };

  // ----------------------------------------------------
  // STAGE 4: VICTORY CEREMONY
  // ----------------------------------------------------
  const triggerVictory = () => {
    setStage(4);
    clearInterval(gameLoopRef.current);
    clearInterval(spawnTimerRef.current);
    soundFx.playGameWin();

    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#818cf8', '#c084fc', '#e0e7ff', '#ffffff', '#fef08a']
    });

    if (onComplete) {
      onComplete(score + 600);
    }
  };

  return (
    <>
      {/* Teaser Card */}
      <div className="mini-game-card game-swan animate-pop">
        <div className="game-card-badge">
          <Sparkles size={14} className="text-indigo-400" />
          <span>Nirvika's Level 3 Quest</span>
        </div>

        <div className="game-card-icon-bubble animate-bounce">
          <span className="game-card-emoji">🦢🪷🌙</span>
        </div>

        <h3 className="game-card-title">Enchanted Moonlit Lake & Lotus Quest! 🦢✨</h3>
        <p className="game-card-desc">
          Glide across serene moonlit waters, gather radiant glowing lotuses & pearls, and awaken the Ancient Frost Moonstone to unlock the Secret Rakhi Letter!
        </p>

        <button
          type="button"
          id="btn-start-swan-game"
          className="btn-launch-game"
          onClick={startQuest}
        >
          <Play size={18} />
          <span>Launch Moonlit Lake Quest 🎮</span>
        </button>
      </div>

      {/* FULL-SCREEN ARCADE MODAL */}
      {stage > 0 &&
        createPortal(
          <div className="modal-backdrop game-modal-overlay animate-fade-in" style={{ zIndex: 99999 }}>
            <div className="game-arcade-frame swan-arcade-theme animate-pop">
              {/* Header HUD */}
              <div className="arcade-hud">
                <div className="hud-left">
                  <span className="hud-stage-pill">
                    Stage <strong>{stage}</strong> / 3: {getStageTitle(stage)}
                  </span>
                  <div className="hud-score-chip">
                    <Trophy size={16} className="text-yellow-400" />
                    <span>Score: <strong>{score}</strong></span>
                  </div>
                </div>

                <div className="hud-right">
                  {combo > 1 && (
                    <div className="hud-combo-chip animate-bounce">
                      <Flame size={16} className="text-indigo-400" />
                      <span>{combo}x SWAN COMBO!</span>
                    </div>
                  )}
                  <button type="button" className="btn-arcade-close" onClick={exitGame} aria-label="Exit Game">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Toast message banner */}
              {toastMsg && (
                <div className="arcade-toast-banner animate-pop">
                  <span>{toastMsg}</span>
                </div>
              )}

              {/* Floating score popups */}
              {scorePopups.map((p) => (
                <span
                  key={p.id}
                  className="floating-score-tag animate-pop"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, color: p.color }}
                >
                  {p.text}
                </span>
              ))}

              {/* ----------------------------------------------------
                  STAGE 1 & 2: MOONLIT LAKE LOTUS CATCHER
                 ---------------------------------------------------- */}
              {(stage === 1 || stage === 2) && (
                <div
                  className="arcade-playfield swan-lake-playfield"
                  onMouseMove={handleTouchSteer}
                  onTouchMove={handleTouchSteer}
                >
                  <div className="playfield-sub-header">
                    <span>
                      Lotuses Harvested: <strong>{itemsCollected}</strong> / {stage === 1 ? stage1Target : stage2Target}
                    </span>
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${(itemsCollected / (stage === 1 ? stage1Target : stage2Target)) * 100}%`,
                          background: 'linear-gradient(90deg, #818cf8, #c084fc)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Falling Items */}
                  {fallingItems.map((item) => (
                    <div
                      key={item.id}
                      className="falling-item-icon animate-spin-slow"
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        position: 'absolute',
                        fontSize: '32px',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none'
                      }}
                    >
                      {item.icon}
                    </div>
                  ))}

                  {/* Player Graceful Swan */}
                  <div
                    className="canopy-basket"
                    style={{
                      left: `${swanX}%`,
                      transform: 'translateX(-50%)',
                      position: 'absolute',
                      bottom: '24px'
                    }}
                  >
                    <div className="basket-monkey-sprite animate-bounce">
                      <span className="basket-emoji">🦢🪷</span>
                    </div>
                  </div>

                  {/* Touch Steering Controls for Mobile */}
                  <div className="touch-steering-row">
                    <button
                      type="button"
                      className="btn-steer"
                      onClick={() => setSwanX((x) => Math.max(10, x - 18))}
                    >
                      <ArrowLeft size={20} />
                      <span>Left</span>
                    </button>
                    <span className="steer-hint">Drag or use buttons</span>
                    <button
                      type="button"
                      className="btn-steer"
                      onClick={() => setSwanX((x) => Math.min(90, x + 18))}
                    >
                      <span>Right</span>
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STAGE 3: FROST MOONSTONE AWAKENING
                 ---------------------------------------------------- */}
              {stage === 3 && (
                <div className="arcade-playfield boss-playfield">
                  <div className="boss-hud-card">
                    <div className="boss-name-row">
                      <span className="boss-name">🔮 Ancient Frost Moonstone</span>
                      <span className="boss-hp-text">{moonstoneHp}% Seal</span>
                    </div>
                    <div className="boss-hp-track">
                      <div
                        className="boss-hp-fill"
                        style={{
                          width: `${moonstoneHp}%`,
                          background: moonstoneHp > 40 ? 'linear-gradient(90deg, #818cf8, #c084fc)' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>

                  <div className="boss-target-stage">
                    <button
                      type="button"
                      id="btn-awaken-moonstone"
                      className={`boss-banana-target ${moonstoneShaking ? 'shake-animation' : 'animate-bounce'}`}
                      onClick={handleMoonstoneTap}
                    >
                      <span className="boss-banana-emoji">🔮🌙</span>
                      <div className="boss-hit-glow" />
                    </button>
                    <p className="boss-tap-instruction">⚡ TAP RAPIDLY TO AWAKEN THE FROST MOONSTONE! ⚡</p>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STAGE 4: VICTORY CEREMONY
                 ---------------------------------------------------- */}
              {stage === 4 && (
                <div className="arcade-playfield victory-playfield animate-pop">
                  <div className="victory-trophy-bubble animate-bounce">
                    <Trophy size={64} className="text-yellow-400" />
                  </div>

                  <h2 className="victory-main-title">MOONLIT SWAN LAKE CONQUERED! 🦢🌙🏆</h2>
                  <p className="victory-subtitle">
                    Nirvika gathered all the glowing lotuses and awakened the Frost Moonstone with <strong>{score} pts</strong>!
                  </p>

                  <div className="victory-reward-card">
                    <CheckCircle2 size={24} className="text-green-400" />
                    <div>
                      <strong>The Secret Rakhi Seal is Ready to Break!</strong>
                      <p>Proceed to Level 4 to read your personalized sister letter ✨</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-arcade-action-huge"
                    onClick={exitGame}
                  >
                    <Sparkles size={20} />
                    <span>Proceed to Secret Letter 💌</span>
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

function getStageTitle(st) {
  switch (st) {
    case 1: return 'Lotus Harvest 🪷';
    case 2: return 'Midnight Mist Rush 🌙';
    case 3: return 'Frost Moonstone Awakening 🔮';
    case 4: return 'Swan Lake Victory 🏆';
    default: return '';
  }
}
