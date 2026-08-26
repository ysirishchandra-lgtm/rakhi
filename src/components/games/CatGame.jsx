import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { PawPrint, Trophy, Play, RotateCcw, ArrowLeft, ArrowRight, ArrowUp, Heart, Sparkles, CheckCircle2, Zap, Clock, Magnet, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../services/soundEffects';

export default function CatGame({ recipient, onComplete }) {
  // Stages: 0: Intro, 1: Rooftop, 2: Moonlight Chase, 3: Cat Burglar, 4: Midnight Storm, 5: Shadow Boss Chase, 6: Victory
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [catLane, setCatLane] = useState(1); // 0: Left, 1: Mid, 2: Right
  const [isJumping, setIsJumping] = useState(false);
  const [items, setItems] = useState([]);
  const [toastMsg, setToastMsg] = useState('');

  // Active Power-ups
  const [hasMagnet, setHasMagnet] = useState(false);
  const [isInvincible, setIsInvincible] = useState(false);
  const [isSlowMo, setIsSlowMo] = useState(false);

  // Stage 5 Boss Survival Timer
  const [survivalTimer, setSurvivalTimer] = useState(20);

  const gameLoopRef = useRef(null);
  const spawnerRef = useRef(null);
  const bossTimerRef = useRef(null);

  // Start Runner
  const startRunner = () => {
    soundFx.playClick();
    setScore(0);
    setLives(3);
    setHasMagnet(false);
    setIsInvincible(false);
    setIsSlowMo(false);
    startStage1();
  };

  const exitGame = () => {
    soundFx.playClick();
    setStage(0);
    clearInterval(gameLoopRef.current);
    clearInterval(spawnerRef.current);
    clearInterval(bossTimerRef.current);
  };

  const startStage1 = () => {
    setStage(1);
    setItems([]);
    setToastMsg('Stage 1: Rooftop Run. Collect rolling yarn balls & dodge flowerpots!');
    soundFx.playLevelUp();
  };

  const startStage2 = () => {
    setStage(2);
    setItems([]);
    setToastMsg('🌙 Stage 2: Moonlight Chase! Faster speed + Yarn Magnet 🧲 power-ups!');
    soundFx.playLevelUp();
  };

  const startStage3 = () => {
    setStage(3);
    setItems([]);
    setToastMsg('💎 Stage 3: Cat Burglar! Snatch Golden Fish + Catnip Invincibility 🌿⚡!');
    soundFx.playLevelUp();
  };

  const startStage4 = () => {
    setStage(4);
    setItems([]);
    setToastMsg('⛈️ Stage 4: Midnight Storm! Rain slick rooftop & lightning bursts!');
    soundFx.playBossAlert();
  };

  const startStage5 = () => {
    setStage(5);
    setItems([]);
    setSurvivalTimer(20);
    setToastMsg('🐾 STAGE 5: SHADOW BEAST CHASE! Survive 20s dodging shadow claws!');
    soundFx.playBossAlert();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (stage < 1 || stage > 5) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveRight();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, catLane, isJumping]);

  const moveLeft = () => {
    if (catLane > 0) {
      soundFx.playClick();
      setCatLane((l) => l - 1);
    }
  };

  const moveRight = () => {
    if (catLane < 2) {
      soundFx.playClick();
      setCatLane((l) => l + 1);
    }
  };

  const jump = () => {
    if (!isJumping) {
      soundFx.playJump();
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
      }, 550);
    }
  };

  // Stage 5 Survival Timer
  useEffect(() => {
    if (stage === 5) {
      bossTimerRef.current = setInterval(() => {
        setSurvivalTimer((t) => {
          if (t <= 1) {
            clearInterval(bossTimerRef.current);
            triggerVictory();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(bossTimerRef.current);
  }, [stage]);

  // Stage Item Spawner Loop
  useEffect(() => {
    if (stage >= 1 && stage <= 5) {
      const interval = stage === 5 ? 400 : stage === 4 ? 500 : stage === 3 ? 600 : 700;

      spawnerRef.current = setInterval(() => {
        spawnItem();
      }, interval);
    }
    return () => clearInterval(spawnerRef.current);
  }, [stage]);

  const spawnItem = () => {
    const lane = Math.floor(Math.random() * 3);
    const rand = Math.random();
    let type = 'yarn';

    if (stage === 1) {
      type = rand < 0.65 ? 'yarn' : 'vase';
    } else if (stage === 2) {
      if (rand < 0.5) type = 'yarn';
      else if (rand < 0.75) type = 'vase';
      else type = 'magnet';
    } else if (stage === 3) {
      if (rand < 0.4) type = 'fish';
      else if (rand < 0.65) type = 'catnip';
      else if (rand < 0.85) type = 'vase';
      else type = 'alarm';
    } else if (stage === 4) {
      if (rand < 0.4) type = 'yarn';
      else if (rand < 0.6) type = 'slowmo';
      else if (rand < 0.8) type = 'vase';
      else type = 'alarm';
    } else if (stage === 5) {
      if (rand < 0.3) type = 'fish';
      else if (rand < 0.5) type = 'catnip';
      else type = 'shadow';
    }

    const newItem = {
      id: Date.now() + Math.random(),
      lane,
      type,
      y: 0,
      speed: isSlowMo ? 1.5 : stage === 5 ? 3.5 : stage >= 3 ? 3.0 : 2.2
    };

    setItems((prev) => [...prev, newItem]);
  };

  // Game Physics Loop
  useEffect(() => {
    if (stage >= 1 && stage <= 5) {
      gameLoopRef.current = setInterval(() => {
        setItems((prev) => {
          const updated = [];
          for (let item of prev) {
            const nextY = item.y + item.speed;

            // Collision check with cat player (y ~ 75-88%)
            if (nextY >= 72 && nextY <= 90) {
              const isColliding = hasMagnet && item.type === 'yarn' ? true : item.lane === catLane;

              if (isColliding) {
                handleCollision(item);
                continue; // Remove item from track
              }
            }

            if (nextY < 105) {
              updated.push({ ...item, y: nextY });
            }
          }
          return updated;
        });
      }, 50);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [stage, catLane, isJumping, hasMagnet, isInvincible, isSlowMo]);

  const handleCollision = (item) => {
    if (item.type === 'yarn') {
      soundFx.playCatch();
      setScore((s) => s + 15);
      checkStageProgress(score + 15);
    } else if (item.type === 'fish') {
      soundFx.playGoldenCatch();
      setScore((s) => s + 50);
      setToastMsg('🐟 Golden Fish snack! +50 pts!');
      checkStageProgress(score + 50);
    } else if (item.type === 'magnet') {
      soundFx.playLevelUp();
      setHasMagnet(true);
      setToastMsg('🧲 Yarn Magnet Active for 6s!');
      setTimeout(() => setHasMagnet(false), 6000);
    } else if (item.type === 'catnip') {
      soundFx.playFeverMode();
      setIsInvincible(true);
      setToastMsg('🌿 Catnip Hyper-Dash for 5s!');
      setTimeout(() => setIsInvincible(false), 5000);
    } else if (item.type === 'slowmo') {
      soundFx.playLevelUp();
      setIsSlowMo(true);
      setToastMsg('⏳ Cat Reflex Slow-Mo for 4s!');
      setTimeout(() => setIsSlowMo(false), 4000);
    } else if (item.type === 'vase' || item.type === 'alarm' || item.type === 'shadow') {
      if (isJumping || isInvincible) {
        soundFx.playJump();
        setScore((s) => s + 20);
        setToastMsg('⚡ Obstacle Cleared Mid-Air! +20 pts!');
      } else {
        soundFx.playNegative();
        setLives((l) => {
          const nextLives = l - 1;
          if (nextLives <= 0) {
            setToastMsg('😿 Cat ran out of lives! Reviving with 1 life...');
            return 1;
          }
          return nextLives;
        });
        setScore((s) => Math.max(0, s - 20));
      }
    }
  };

  const checkStageProgress = (currScore) => {
    if (stage === 1 && currScore >= 120) {
      startStage2();
    } else if (stage === 2 && currScore >= 260) {
      startStage3();
    } else if (stage === 3 && currScore >= 420) {
      startStage4();
    } else if (stage === 4 && currScore >= 600) {
      startStage5();
    }
  };

  const triggerVictory = () => {
    setStage(6);
    soundFx.playGameWin();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#a855f7', '#ec4899', '#c084fc', '#ffffff']
    });
    if (onComplete) {
      onComplete(score + 200);
    }
  };

  return (
    <>
      <div className="cat-game-card">
        <div className="game-intro-view">
          <div className="game-badge-chip cat-badge">
            <PawPrint size={16} />
            <span>Midnight Runner</span>
          </div>

          <h3 className="game-main-title">Midnight Cat Run 🐱🐾</h3>
          <p className="game-intro-desc">
            Leap across rooftops, collect yarn & power-ups, and survive the Shadow Beast to earn the <strong>Midnight Cat Trophy</strong>!
          </p>

          <button
            id="btn-start-cat-runner"
            type="button"
            className="btn-game-primary cat-theme-btn"
            onClick={startRunner}
          >
            <Play size={20} />
            <span>{score > 0 ? 'Replay Cat Run 🐾' : 'Play Midnight Cat Run 🐾'}</span>
          </button>
        </div>
      </div>

      {/* Full-Screen Immersive Game Modal Overlay */}
      {stage >= 1 &&
        createPortal(
          <div className="modal-backdrop" onClick={exitGame}>
            <div className="game-modal-card animate-pop" onClick={(e) => e.stopPropagation()}>
              <button className="btn-modal-x" onClick={exitGame} aria-label="Close cat run">
                <X size={20} />
              </button>

              {/* HUD (Stages 1-5) */}
              {stage >= 1 && stage <= 5 && (
                <div className="runner-hud">
                  <div className="hud-pill lives-pill">
                    <span className="lives-label">Lives:</span>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Heart
                        key={i}
                        size={16}
                        className={i < lives ? 'heart-filled text-pink-400' : 'heart-empty opacity-30'}
                      />
                    ))}
                  </div>

                  <div className="hud-pill score-pill">
                    <Trophy size={14} />
                    <span>Score: <strong>{score}</strong></span>
                  </div>

                  <div className="hud-pill stage-pill">
                    <span>Stage {stage}/5: {getCatStageTitle(stage)}</span>
                  </div>

                  {stage === 5 && (
                    <div className="hud-pill timer-pill animate-pulse">
                      <span>⏱️ Survive: <strong>{survivalTimer}s</strong></span>
                    </div>
                  )}
                </div>
              )}

              {/* Power-up Badges */}
              {(hasMagnet || isInvincible || isSlowMo) && (
                <div className="powerup-active-bar animate-pop">
                  {hasMagnet && <span className="powerup-badge magnet">🧲 Magnet Active</span>}
                  {isInvincible && <span className="powerup-badge invincible">⚡ Invincible Dash</span>}
                  {isSlowMo && <span className="powerup-badge slowmo">⏳ Slow-Mo</span>}
                </div>
              )}

              {/* Toast */}
              {toastMsg && (
                <div className="runner-toast-bubble animate-pop">
                  <span>{toastMsg}</span>
                </div>
              )}

              {/* ----------------------------------------------------
                  STAGES 1 - 5: RUNNER TRACK
                 ---------------------------------------------------- */}
              {stage >= 1 && stage <= 5 && (
                <div className="cat-runner-stage">
                  <div className={`cat-track-surface ${stage === 4 ? 'storm-weather' : ''} ${stage === 5 ? 'shadow-boss-bg' : ''}`}>
                    {stage === 4 && <div className="storm-rain-overlay" />}

                    {stage === 5 && (
                      <div className="shadow-boss-silhouette animate-pulse">
                        <span className="boss-cat-eyes">👀 🐾</span>
                      </div>
                    )}

                    <div className="track-lane lane-0" />
                    <div className="track-lane lane-1" />
                    <div className="track-lane lane-2" />

                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`runner-item item-lane-${item.lane}`}
                        style={{ top: `${item.y}%` }}
                      >
                        {item.type === 'yarn' && <span className="item-sprite">🧶</span>}
                        {item.type === 'fish' && <span className="item-sprite">🐟✨</span>}
                        {item.type === 'magnet' && <span className="item-sprite">🧲</span>}
                        {item.type === 'catnip' && <span className="item-sprite">🌿⚡</span>}
                        {item.type === 'slowmo' && <span className="item-sprite">⏳</span>}
                        {item.type === 'vase' && <span className="item-sprite">🏺</span>}
                        {item.type === 'alarm' && <span className="item-sprite">⏰</span>}
                        {item.type === 'shadow' && <span className="item-sprite">🐾💥</span>}
                      </div>
                    ))}

                    <div
                      className={`cat-player-avatar cat-lane-${catLane} ${isJumping ? 'cat-jumping' : ''} ${isInvincible ? 'cat-invincible-aura' : ''}`}
                    >
                      <div className="cat-player-sprite">
                        <span className="cat-emoji-player">🐱</span>
                        <span className="cat-paws-trail">🐾</span>
                      </div>
                    </div>
                  </div>

                  <div className="runner-touch-controls">
                    <button
                      id="btn-cat-left"
                      className="btn-touch-nav"
                      onClick={moveLeft}
                      disabled={catLane === 0}
                      aria-label="Move Left"
                    >
                      <ArrowLeft size={22} />
                      <span>Left</span>
                    </button>

                    <button
                      id="btn-cat-jump"
                      className="btn-touch-nav btn-touch-jump"
                      onClick={jump}
                      aria-label="Jump"
                    >
                      <ArrowUp size={22} />
                      <span>Jump</span>
                    </button>

                    <button
                      id="btn-cat-right"
                      className="btn-touch-nav"
                      onClick={moveRight}
                      disabled={catLane === 2}
                      aria-label="Move Right"
                    >
                      <ArrowRight size={22} />
                      <span>Right</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STAGE 6: VICTORY SCREEN
                 ---------------------------------------------------- */}
              {stage === 6 && (
                <div className="game-completed-view animate-pop">
                  <div className="trophy-stage">
                    <Trophy size={68} className="trophy-gold animate-bounce" />
                    <div className="trophy-aura" />
                  </div>

                  <h3 className="completed-title">MIDNIGHT CAT CHAMPION! 🐾👑</h3>
                  <p className="completed-subtitle">
                    All 5 rooftop stages and the Shadow Boss survived! Final Score: <strong>{score} pts</strong>!
                  </p>

                  <div className="unlock-banner cat-unlock">
                    <CheckCircle2 size={22} className="unlock-icon" />
                    <div>
                      <strong>The Secret Rakhi Seal is Ready to Break!</strong>
                      <p>Proceed below to read your custom note and unwrap Cat's mystery Rakhi gift box 🎁</p>
                    </div>
                  </div>

                  <button className="btn-game-secondary" onClick={exitGame}>
                    <CheckCircle2 size={16} />
                    <span>Done & Continue ✨</span>
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

function getCatStageTitle(stg) {
  switch (stg) {
    case 1: return 'Rooftop 🧶';
    case 2: return 'Moonlight 🌙';
    case 3: return 'Cat Burglar 💎';
    case 4: return 'Storm ⛈️';
    case 5: return 'Shadow Boss 🐾';
    default: return '';
  }
}
