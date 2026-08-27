import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { PawPrint, Trophy, Play, RotateCcw, ArrowLeft, ArrowRight, CheckCircle2, Flame, Heart, X, Sparkles, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../services/soundEffects';

export default function CatGame({ recipient, onComplete }) {
  // Stages: 0: Intro, 1: Rooftop Yarn Dash, 2: Catnip Fever, 3: Shadow Mouse Boss, 4: Victory
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [toastMsg, setToastMsg] = useState('');
  const [combo, setCombo] = useState(0);
  const [scorePopups, setScorePopups] = useState([]);

  // Lane: 0: Left, 1: Middle, 2: Right
  const [lane, setLane] = useState(1);
  const [items, setItems] = useState([]);
  const [itemsCollected, setItemsCollected] = useState(0);
  const stage1Target = 10;
  const stage2Target = 12;
  const gameLoopRef = useRef(null);
  const spawnerRef = useRef(null);

  // Stage 3 Boss State
  const [bossHp, setBossHp] = useState(100);
  const [bossShaking, setBossShaking] = useState(false);

  const addScorePopup = (text, x = 50, y = 50, color = '#a855f7') => {
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
    setLane(1);
    startStage1();
  };

  const exitGame = () => {
    soundFx.playClick();
    setStage(0);
    clearInterval(gameLoopRef.current);
    clearInterval(spawnerRef.current);
  };

  // ----------------------------------------------------
  // STAGE 1: ROOFTOP YARN DASH
  // ----------------------------------------------------
  const startStage1 = () => {
    setStage(1);
    setItems([]);
    setItemsCollected(0);
    setCombo(0);
    setToastMsg('Stage 1: Rooftop Run! Shift lanes (Left / Middle / Right) to catch yarn & treats!');
    soundFx.playLevelUp();

    spawnerRef.current = setInterval(() => {
      const types = [
        { icon: '🧶', pts: 50, label: '+50 YARN!' },
        { icon: '🐟', pts: 80, label: '+80 FISH!' },
        { icon: '🥛', pts: 40, label: '+40' },
        { icon: '✨', pts: 100, label: '+100 SPARKLE!' }
      ];
      const selected = types[Math.floor(Math.random() * types.length)];
      const randomLane = Math.floor(Math.random() * 3);
      const newItem = {
        id: Math.random(),
        lane: randomLane,
        y: 0,
        speed: 1.8,
        ...selected
      };
      setItems((prev) => [...prev.slice(-7), newItem]);
    }, 950);

    gameLoopRef.current = setInterval(() => {
      setItems((prev) => {
        const nextList = [];
        for (const item of prev) {
          const nextY = item.y + item.speed * 2.2;
          // Check collision with cat at bottom (y around 78-92) and same lane
          if (nextY >= 75 && nextY <= 92 && item.lane === lane) {
            // Caught!
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
                addScorePopup(`PURR COMBO x${newCb}!`, (lane * 35) + 15, 75, '#ec4899');
              } else {
                addScorePopup(item.label, (lane * 35) + 15, 75, '#c084fc');
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
        setLane((l) => Math.max(0, l - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setLane((l) => Math.min(2, l + 1));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [stage]);

  // ----------------------------------------------------
  // STAGE 2: CATNIP FEVER
  // ----------------------------------------------------
  const startStage2 = () => {
    clearInterval(gameLoopRef.current);
    clearInterval(spawnerRef.current);
    setStage(2);
    setItems([]);
    setItemsCollected(0);
    setToastMsg('🌿⚡ STAGE 2: CATNIP FEVER! Faster golden treats & glowing stars!');
    soundFx.playLevelUp();

    spawnerRef.current = setInterval(() => {
      const types = [
        { icon: '🌿', pts: 100, label: 'CATNIP +100!' },
        { icon: '⭐', pts: 120, label: 'STAR +120!' },
        { icon: '🐟', pts: 80, label: '+80 FISH!' }
      ];
      const selected = types[Math.floor(Math.random() * types.length)];
      const randomLane = Math.floor(Math.random() * 3);
      const newItem = {
        id: Math.random(),
        lane: randomLane,
        y: 0,
        speed: 2.2,
        ...selected
      };
      setItems((prev) => [...prev.slice(-8), newItem]);
    }, 750);

    gameLoopRef.current = setInterval(() => {
      setItems((prev) => {
        const nextList = [];
        for (const item of prev) {
          const nextY = item.y + item.speed * 2.4;
          if (nextY >= 75 && nextY <= 92 && item.lane === lane) {
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
              addScorePopup(`FEVER x${newCb}!`, (lane * 35) + 15, 75, '#ec4899');
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
  // STAGE 3: SHADOW MOUSE BOSS CHASE
  // ----------------------------------------------------
  const startStage3 = () => {
    clearInterval(gameLoopRef.current);
    clearInterval(spawnerRef.current);
    setStage(3);
    setBossHp(100);
    setToastMsg('👑 FINAL BOSS: Glowing Shadow Mouse! Tap rapidly to pounce and capture!');
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
    addScorePopup('🐾 POUNCE! +45', x || 50, 45, '#a855f7');

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
    clearInterval(spawnerRef.current);
    soundFx.playGameWin();

    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#a855f7', '#ec4899', '#c084fc', '#f472b6', '#ffffff']
    });

    if (onComplete) {
      onComplete(score + 600);
    }
  };

  const getLaneX = (l) => {
    if (l === 0) return '20%';
    if (l === 1) return '50%';
    return '80%';
  };

  return (
    <>
      {/* Teaser Card */}
      <div className="mini-game-card game-cat animate-pop">
        <div className="game-card-badge">
          <Sparkles size={14} className="text-purple-400" />
          <span>Ashwidha's Level 3 Quest</span>
        </div>

        <div className="game-card-icon-bubble animate-bounce">
          <span className="game-card-emoji">🐱🧶✨</span>
        </div>

        <h3 className="game-card-title">Midnight Cat Yarn & Rooftop Dash! 🌙</h3>
        <p className="game-card-desc">
          Dash across moonlit rooftops, collect rolling yarn & fish treats, activate Catnip Fever, and capture the Shadow Mouse to unlock the Secret Rakhi Letter!
        </p>

        <button
          type="button"
          id="btn-start-cat-game"
          className="btn-launch-game"
          onClick={startQuest}
        >
          <Play size={18} />
          <span>Launch Rooftop Dash 🎮</span>
        </button>
      </div>

      {/* FULL-SCREEN ARCADE MODAL */}
      {stage > 0 &&
        createPortal(
          <div className="modal-backdrop game-modal-overlay animate-fade-in" style={{ zIndex: 99999 }}>
            <div className="game-arcade-frame cat-arcade-theme animate-pop">
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
                      <Flame size={16} className="text-purple-400" />
                      <span>{combo}x PURR COMBO!</span>
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
                  STAGE 1 & 2: 3-LANE ROOFTOP RUNNER
                 ---------------------------------------------------- */}
              {(stage === 1 || stage === 2) && (
                <div className="arcade-playfield rooftop-playfield">
                  <div className="playfield-sub-header">
                    <span>
                      Treats Harvested: <strong>{itemsCollected}</strong> / {stage === 1 ? stage1Target : stage2Target}
                    </span>
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${(itemsCollected / (stage === 1 ? stage1Target : stage2Target)) * 100}%`,
                          background: 'linear-gradient(90deg, #a855f7, #ec4899)'
                        }}
                      />
                    </div>
                  </div>

                  {/* 3 Rooftop Track Lanes */}
                  <div className="rooftop-tracks-grid">
                    <div className={`rooftop-track-lane ${lane === 0 ? 'lane-highlight' : ''}`} onClick={() => setLane(0)} />
                    <div className={`rooftop-track-lane ${lane === 1 ? 'lane-highlight' : ''}`} onClick={() => setLane(1)} />
                    <div className={`rooftop-track-lane ${lane === 2 ? 'lane-highlight' : ''}`} onClick={() => setLane(2)} />
                  </div>

                  {/* Falling Treats in 3 Lanes */}
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="falling-item-icon animate-bounce"
                      style={{
                        left: getLaneX(item.lane),
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

                  {/* Midnight Cat Player */}
                  <div
                    className="cat-lane-sprite animate-bounce"
                    style={{
                      left: getLaneX(lane),
                      position: 'absolute',
                      bottom: '24px',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <span className="cat-player-icon">🐱🐾</span>
                  </div>

                  {/* 3 Touch Lane Buttons for Mobile */}
                  <div className="lane-steering-row">
                    <button
                      type="button"
                      className={`btn-lane-tap ${lane === 0 ? 'is-active' : ''}`}
                      onClick={() => setLane(0)}
                    >
                      <span>Left Lane</span>
                    </button>
                    <button
                      type="button"
                      className={`btn-lane-tap ${lane === 1 ? 'is-active' : ''}`}
                      onClick={() => setLane(1)}
                    >
                      <span>Middle</span>
                    </button>
                    <button
                      type="button"
                      className={`btn-lane-tap ${lane === 2 ? 'is-active' : ''}`}
                      onClick={() => setLane(2)}
                    >
                      <span>Right Lane</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STAGE 3: SHADOW MOUSE BOSS
                 ---------------------------------------------------- */}
              {stage === 3 && (
                <div className="arcade-playfield boss-playfield">
                  <div className="boss-hud-card">
                    <div className="boss-name-row">
                      <span className="boss-name">👑 Midnight Shadow Mouse</span>
                      <span className="boss-hp-text">{bossHp}% HP</span>
                    </div>
                    <div className="boss-hp-track">
                      <div
                        className="boss-hp-fill"
                        style={{
                          width: `${bossHp}%`,
                          background: bossHp > 40 ? 'linear-gradient(90deg, #a855f7, #ec4899)' : '#ec4899'
                        }}
                      />
                    </div>
                  </div>

                  <div className="boss-target-stage">
                    <button
                      type="button"
                      id="btn-pounce-shadow-mouse"
                      className={`boss-banana-target ${bossShaking ? 'shake-animation' : 'animate-bounce'}`}
                      onClick={handleBossTap}
                    >
                      <span className="boss-banana-emoji">🐭✨</span>
                      <div className="boss-hit-glow" />
                    </button>
                    <p className="boss-tap-instruction">⚡ TAP RAPIDLY TO POUNCE & CAPTURE THE SHADOW MOUSE! ⚡</p>
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

                  <h2 className="victory-main-title">MIDNIGHT CAT DASH COMPLETE! 🐱🐾🏆</h2>
                  <p className="victory-subtitle">
                    Ashwidha conquered the rooftop trails and captured the Shadow Mouse with <strong>{score} pts</strong>!
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
    case 1: return 'Rooftop Yarn Roll 🧶';
    case 2: return 'Catnip Fever 🌿';
    case 3: return 'Shadow Mouse Boss 🐭';
    case 4: return 'Purr-fect Victory 🏆';
    default: return '';
  }
}
