import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Trophy, Play, RotateCcw, ArrowLeft, ArrowRight, CheckCircle2, Flame, Heart, X, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../services/soundEffects';

export default function RabbitGame({ recipient, onComplete }) {
  // Stages: 0: Intro, 1: Carrot Harvest, 2: Rainbow Clover Bloom, 3: Shadow Wolf Tame, 4: Victory
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [toastMsg, setToastMsg] = useState('');
  const [combo, setCombo] = useState(0);
  const [scorePopups, setScorePopups] = useState([]);

  // Stage 1 & 2 Bunny Position (10 - 90%)
  const [bunnyX, setBunnyX] = useState(50);
  const [carrots, setCarrots] = useState([]);
  const [carrotsCaught, setCarrotsCaught] = useState(0);
  const stage1Target = 10;
  const stage2Target = 12;
  const gameLoopRef = useRef(null);
  const spawnTimerRef = useRef(null);

  // Stage 3 Boss State
  const [bossHp, setBossHp] = useState(100);
  const [bossShaking, setBossShaking] = useState(false);

  const addScorePopup = (text, x = 50, y = 50, color = '#ec4899') => {
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
  // STAGE 1: SUNNY MEADOW CARROT HARVEST
  // ----------------------------------------------------
  const startStage1 = () => {
    setStage(1);
    setCarrots([]);
    setCarrotsCaught(0);
    setCombo(0);
    setToastMsg('Stage 1: Sunny Meadow! Catch 10 crunchy golden carrots & meadow flowers with Bunny!');
    soundFx.playLevelUp();

    spawnTimerRef.current = setInterval(() => {
      const types = [
        { icon: '🥕', pts: 50, label: '+50 CARROT!' },
        { icon: '🌸', pts: 40, label: '+40 FLOWER!' },
        { icon: '🍓', pts: 70, label: '+70' },
        { icon: '⭐', pts: 100, label: '+100 GOLDEN!' }
      ];
      const selected = types[Math.floor(Math.random() * types.length)];
      const newItem = {
        id: Math.random(),
        x: Math.random() * 80 + 10,
        y: 0,
        speed: 1.6,
        ...selected
      };
      setCarrots((prev) => [...prev.slice(-8), newItem]);
    }, 1000);

    gameLoopRef.current = setInterval(() => {
      setCarrots((prev) => {
        const nextList = [];
        for (const item of prev) {
          const nextY = item.y + item.speed * 2.2;
          if (nextY >= 78 && nextY <= 92 && Math.abs(item.x - bunnyX) < 16) {
            soundFx.playScorePoint();
            setScore((s) => s + item.pts);
            setCarrotsCaught((c) => {
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
                addScorePopup(`HOP COMBO x${newCb}!`, bunnyX, 75, '#ec4899');
              } else {
                addScorePopup(item.label, bunnyX, 75, '#f97316');
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
        setBunnyX((x) => Math.max(10, x - 12));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBunnyX((x) => Math.min(90, x + 12));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [stage]);

  const handleTouchSteer = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const relX = ((clientX - rect.left) / rect.width) * 100;
    setBunnyX(Math.max(10, Math.min(90, relX)));
  };

  // ----------------------------------------------------
  // STAGE 2: RAINBOW CLOVER BLOOM
  // ----------------------------------------------------
  const startStage2 = () => {
    clearInterval(gameLoopRef.current);
    clearInterval(spawnTimerRef.current);
    setStage(2);
    setCarrots([]);
    setCarrotsCaught(0);
    setToastMsg('🌸⚡ Stage 2: Rainbow Clover Bloom! Catch 4-leaf clovers & mega carrots!');
    soundFx.playLevelUp();

    spawnTimerRef.current = setInterval(() => {
      const types = [
        { icon: '🍀', pts: 100, label: 'LUCKY +100!' },
        { icon: '🥕', pts: 60, label: '+60' },
        { icon: '🌈', pts: 120, label: 'RAINBOW +120!' }
      ];
      const selected = types[Math.floor(Math.random() * types.length)];
      const newItem = {
        id: Math.random(),
        x: Math.random() * 80 + 10,
        y: 0,
        speed: 2.1,
        ...selected
      };
      setCarrots((prev) => [...prev.slice(-8), newItem]);
    }, 800);

    gameLoopRef.current = setInterval(() => {
      setCarrots((prev) => {
        const nextList = [];
        for (const item of prev) {
          const nextY = item.y + item.speed * 2.3;
          if (nextY >= 78 && nextY <= 92 && Math.abs(item.x - bunnyX) < 16) {
            soundFx.playPowerUp();
            setScore((s) => s + item.pts);
            setCarrotsCaught((c) => {
              const updated = c + 1;
              if (updated >= stage2Target) {
                setTimeout(startStage3, 500);
              }
              return updated;
            });
            setCombo((cb) => {
              const newCb = cb + 1;
              soundFx.playComboStreak(newCb);
              addScorePopup(`MEADOW x${newCb}!`, bunnyX, 75, '#ec4899');
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
  // STAGE 3: SHADOW WOLF TAME BOSS
  // ----------------------------------------------------
  const startStage3 = () => {
    clearInterval(gameLoopRef.current);
    clearInterval(spawnTimerRef.current);
    setStage(3);
    setBossHp(100);
    setToastMsg('🐺 FINAL BOSS: Shadow Wolf! Tap rapidly to fire carrot sparkles & tame the wolf!');
    soundFx.playBossAlert();
  };

  const handleBossTap = (e) => {
    if (bossHp <= 0) return;

    soundFx.playBossHit();
    setBossShaking(true);
    setTimeout(() => setBossShaking(false), 120);

    const dmg = 8;
    const nextHp = Math.max(0, bossHp - dmg);
    setBossHp(nextHp);
    setScore((s) => s + 45);

    const rect = e?.currentTarget?.getBoundingClientRect();
    const x = rect ? ((e.clientX - rect.left) / rect.width) * 100 : 50;
    addScorePopup('✨ SPARKLE! +45', x || 50, 45, '#ec4899');

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
      colors: ['#ec4899', '#f97316', '#facc15', '#f472b6', '#ffffff']
    });

    if (onComplete) {
      onComplete(score + 600);
    }
  };

  return (
    <>
      {/* Teaser Card */}
      <div className="mini-game-card game-rabbit animate-pop">
        <div className="game-card-badge">
          <Sparkles size={14} className="text-pink-400" />
          <span>Hanvika's Level 3 Quest</span>
        </div>

        <div className="game-card-icon-bubble animate-bounce">
          <span className="game-card-emoji">🐰🥕🌸</span>
        </div>

        <h3 className="game-card-title">Fluffy Bunny Meadow Carrot Rush! 🥕✨</h3>
        <p className="game-card-desc">
          Harvest sweet golden carrots, catch blooming lucky 4-leaf clovers, and tame the Shadow Wolf with carrot sparkles to unlock the Secret Rakhi Letter!
        </p>

        <button
          type="button"
          id="btn-start-rabbit-game"
          className="btn-launch-game"
          onClick={startQuest}
        >
          <Play size={18} />
          <span>Launch Meadow Quest 🎮</span>
        </button>
      </div>

      {/* FULL-SCREEN ARCADE MODAL */}
      {stage > 0 &&
        createPortal(
          <div className="modal-backdrop game-modal-overlay animate-fade-in" style={{ zIndex: 99999 }}>
            <div className="game-arcade-frame rabbit-arcade-theme animate-pop">
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
                      <Flame size={16} className="text-pink-400" />
                      <span>{combo}x HOP COMBO!</span>
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
                  STAGE 1 & 2: MEADOW CARROT CATCHER
                 ---------------------------------------------------- */}
              {(stage === 1 || stage === 2) && (
                <div
                  className="arcade-playfield meadow-playfield"
                  onMouseMove={handleTouchSteer}
                  onTouchMove={handleTouchSteer}
                >
                  <div className="playfield-sub-header">
                    <span>
                      Carrots Harvested: <strong>{carrotsCaught}</strong> / {stage === 1 ? stage1Target : stage2Target}
                    </span>
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${(carrotsCaught / (stage === 1 ? stage1Target : stage2Target)) * 100}%`,
                          background: 'linear-gradient(90deg, #ec4899, #f97316)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Falling Items */}
                  {carrots.map((item) => (
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

                  {/* Player Fluffy Bunny */}
                  <div
                    className="canopy-basket"
                    style={{
                      left: `${bunnyX}%`,
                      transform: 'translateX(-50%)',
                      position: 'absolute',
                      bottom: '24px'
                    }}
                  >
                    <div className="basket-monkey-sprite animate-bounce">
                      <span className="basket-emoji">🐰🧺</span>
                    </div>
                  </div>

                  {/* Touch Steering Controls for Mobile */}
                  <div className="touch-steering-row">
                    <button
                      type="button"
                      className="btn-steer"
                      onClick={() => setBunnyX((x) => Math.max(10, x - 18))}
                    >
                      <ArrowLeft size={20} />
                      <span>Left</span>
                    </button>
                    <span className="steer-hint">Drag or use buttons</span>
                    <button
                      type="button"
                      className="btn-steer"
                      onClick={() => setBunnyX((x) => Math.min(90, x + 18))}
                    >
                      <span>Right</span>
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STAGE 3: SHADOW WOLF TAME BOSS
                 ---------------------------------------------------- */}
              {stage === 3 && (
                <div className="arcade-playfield boss-playfield">
                  <div className="boss-hud-card">
                    <div className="boss-name-row">
                      <span className="boss-name">🐺 Shadow Bramble Wolf</span>
                      <span className="boss-hp-text">{bossHp}% HP</span>
                    </div>
                    <div className="boss-hp-track">
                      <div
                        className="boss-hp-fill"
                        style={{
                          width: `${bossHp}%`,
                          background: bossHp > 40 ? 'linear-gradient(90deg, #ec4899, #f97316)' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>

                  <div className="boss-target-stage">
                    <button
                      type="button"
                      id="btn-tame-wolf-boss"
                      className={`boss-banana-target ${bossShaking ? 'shake-animation' : 'animate-bounce'}`}
                      onClick={handleBossTap}
                    >
                      <span className="boss-banana-emoji">🐺✨</span>
                      <div className="boss-hit-glow" />
                    </button>
                    <p className="boss-tap-instruction">⚡ TAP RAPIDLY TO FIRE CARROT SPARKLES & TAME WOLF! ⚡</p>
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

                  <h2 className="victory-main-title">MEADOW QUEST CONQUERED! 🐰🌸🏆</h2>
                  <p className="victory-subtitle">
                    Hanvika harvested all the lucky clovers and tamed the Shadow Wolf with <strong>{score} pts</strong>!
                  </p>

                  <div className="victory-reward-card">
                    <CheckCircle2 size={24} className="text-green-400" />
                    <div>
                      <strong>The Secret Rakhi Seal is Ready to Break!</strong>
                      <p>Proceed to Level 4 to read your personalized friendship letter ✨</p>
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
    case 1: return 'Carrot Harvest 🥕';
    case 2: return 'Rainbow Clover Bloom 🌸';
    case 3: return 'Shadow Wolf Taming 🐺';
    case 4: return 'Meadow Victory 🏆';
    default: return '';
  }
}
