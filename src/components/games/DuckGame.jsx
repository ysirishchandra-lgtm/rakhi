import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Waves, Trophy, Play, RotateCcw, Sparkles, CheckCircle2, Timer, Flame, ShieldAlert, Crosshair, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../services/soundEffects';

export default function DuckGame({ recipient, onComplete }) {
  // Levels: 0: Intro, 1: Calm Pond, 2: Duck Storm, 3: Crazy Pond, 4: Boss Megabill, 5: Golden Rush, 6: Victory
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [ducks, setDucks] = useState([]);
  const [ripples, setRipples] = useState([]);
  const [combo, setCombo] = useState(0);
  const [toastMsg, setToastMsg] = useState('');

  // Boss Megabill State (Level 4)
  const [bossHp, setBossHp] = useState(100);
  const [bossAttackTimer, setBossAttackTimer] = useState(0);

  const gameTimerRef = useRef(null);
  const spawnTimerRef = useRef(null);

  // Start Duck Arcade
  const startArcade = () => {
    soundFx.playClick();
    setScore(0);
    startLevel1();
  };

  const exitGame = () => {
    soundFx.playClick();
    setLevel(0);
    clearInterval(gameTimerRef.current);
    clearInterval(spawnTimerRef.current);
  };

  // ----------------------------------------------------
  // LEVEL 1: CALM POND
  // ----------------------------------------------------
  const startLevel1 = () => {
    setLevel(1);
    setTimeLeft(22);
    setCombo(0);
    setDucks([]);
    setToastMsg('Level 1: Calm Pond. Tap swimming ducks to catch them!');
    soundFx.playLevelUp();
  };

  // ----------------------------------------------------
  // LEVEL 2: DUCK STORM
  // ----------------------------------------------------
  const startLevel2 = () => {
    setLevel(2);
    setTimeLeft(20);
    setDucks([]);
    setToastMsg('⚡ Level 2: Duck Storm! Ducks are faster, watch out for Golden Ducks!');
    soundFx.playLevelUp();
  };

  // ----------------------------------------------------
  // LEVEL 3: CRAZY POND
  // ----------------------------------------------------
  const startLevel3 = () => {
    setLevel(3);
    setTimeLeft(22);
    setDucks([]);
    setToastMsg('🌊 Level 3: Crazy Pond! Avoid fake wooden ducks and frogs!');
    soundFx.playLevelUp();
  };

  // ----------------------------------------------------
  // LEVEL 4: BOSS MEGABILL
  // ----------------------------------------------------
  const startLevel4 = () => {
    setLevel(4);
    setTimeLeft(30);
    setBossHp(100);
    setDucks([]);
    setToastMsg('👑 LEVEL 4: BOSS MEGABILL EMERGES! Tap boss rapidly to deplete HP!');
    soundFx.playBossAlert();
  };

  // ----------------------------------------------------
  // LEVEL 5: GOLDEN DUCK RUSH
  // ----------------------------------------------------
  const startLevel5 = () => {
    setLevel(5);
    setTimeLeft(15);
    setDucks([]);
    setToastMsg('🌟 LEVEL 5: GOLDEN DUCK RUSH! Catch bonus golden ducks for mega points!');
    soundFx.playFeverMode();
  };

  // Main Game Loop Timer
  useEffect(() => {
    if (level >= 1 && level <= 5) {
      gameTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(gameTimerRef.current);
            handleLevelTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(gameTimerRef.current);
  }, [level]);

  // Duck Spawner Loop
  useEffect(() => {
    if (level >= 1 && level <= 5) {
      const spawnInterval = level === 5 ? 350 : level === 4 ? 650 : level === 3 ? 550 : level === 2 ? 650 : 800;

      spawnTimerRef.current = setInterval(() => {
        spawnDuck();
      }, spawnInterval);
    }

    return () => clearInterval(spawnTimerRef.current);
  }, [level]);

  // Handle Timeout transition
  const handleLevelTimeout = () => {
    if (level === 1) {
      startLevel2();
    } else if (level === 2) {
      startLevel3();
    } else if (level === 3) {
      startLevel4();
    } else if (level === 4) {
      if (bossHp <= 0) {
        startLevel5();
      } else {
        startLevel5();
      }
    } else if (level === 5) {
      triggerVictory();
    }
  };

  // Spawn Duck Logic
  const spawnDuck = () => {
    let type = 'standard';
    const rand = Math.random();

    if (level === 5) {
      type = 'golden';
    } else if (level === 3) {
      if (rand < 0.25) type = 'frog';
      else if (rand < 0.45) type = 'fake';
      else if (rand < 0.65) type = 'golden';
    } else if (level === 2) {
      if (rand < 0.25) type = 'golden';
    }

    const newDuck = {
      id: Date.now() + Math.random(),
      type,
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 65,
      direction: Math.random() > 0.5 ? 1 : -1,
      speed: level === 5 ? 1.5 : level >= 2 ? 1.2 : 0.8
    };

    setDucks((prev) => [...prev.slice(-12), newDuck]);
  };

  // Handle Duck Tap / Catch
  const handleDuckCatch = (duck, e) => {
    if (e) {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const ripple = {
        id: Date.now() + Math.random(),
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      setRipples((prev) => [...prev.slice(-6), ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 700);
    }

    setDucks((prev) => prev.filter((d) => d.id !== duck.id));

    if (duck.type === 'standard') {
      soundFx.playCatch();
      setScore((prev) => prev + 10 * (combo + 1));
      setCombo((prev) => prev + 1);
    } else if (duck.type === 'golden') {
      soundFx.playGoldenCatch();
      setScore((prev) => prev + 35 * (combo + 1));
      setCombo((prev) => prev + 2);
      setToastMsg('✨ Golden Duck Caught! +35 pts!');
    } else if (duck.type === 'frog') {
      soundFx.playNegative();
      setScore((prev) => Math.max(0, prev - 15));
      setCombo(0);
      setToastMsg('🐸 Oops! Slipped on a sneaky frog! -15 pts');
    } else if (duck.type === 'fake') {
      soundFx.playNegative();
      setScore((prev) => Math.max(0, prev - 10));
      setCombo(0);
      setToastMsg('🪵 Clicked a decoy wooden duck! -10 pts');
    }
  };

  // Boss Attack
  const damageBoss = (dmg = 8) => {
    soundFx.playBossHit();
    setBossHp((prev) => {
      const nextHp = Math.max(0, prev - dmg);
      setScore((s) => s + 20);
      if (nextHp <= 0) {
        clearInterval(gameTimerRef.current);
        soundFx.playLevelUp();
        setToastMsg('💥 BOSS MEGABILL DEFEATED! Entering Golden Duck Rush!');
        setTimeout(startLevel5, 1400);
      }
      return nextHp;
    });
  };

  const triggerVictory = () => {
    setLevel(6);
    soundFx.playGameWin();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#06b6d4', '#facc15', '#38bdf8', '#ffffff']
    });
    if (onComplete) {
      onComplete(score + 150);
    }
  };

  return (
    <>
      <div className="duck-game-card">
        <div className="game-intro-view">
          <div className="game-badge-chip duck-badge">
            <Waves size={16} />
            <span>Duck Pond Arcade</span>
          </div>

          <h3 className="game-main-title">Duck Pond Mayhem 🦆💦</h3>
          <p className="game-intro-desc">
            Catch swimming ducks, dodge frogs, and defeat Boss Megabill to claim the <strong>Quack Master Trophy</strong>!
          </p>

          <button
            id="btn-start-duck-arcade"
            type="button"
            className="btn-game-primary duck-theme-btn"
            onClick={startArcade}
          >
            <Play size={20} />
            <span>{score > 0 ? 'Replay Duck Mayhem 🦆' : 'Play Duck Mayhem Now 🦆'}</span>
          </button>
        </div>
      </div>

      {/* Full-Screen Immersive Game Modal Overlay */}
      {level >= 1 &&
        createPortal(
          <div className="modal-backdrop" onClick={exitGame}>
            <div className="game-modal-card animate-pop" onClick={(e) => e.stopPropagation()}>
              <button className="btn-modal-x" onClick={exitGame} aria-label="Close duck arcade">
                <X size={20} />
              </button>

              {/* HUD (Levels 1-5) */}
              {level >= 1 && level <= 5 && (
                <div className="pond-hud">
                  <div className="hud-pill timer-pill">
                    <Timer size={14} />
                    <span>Time: <strong>{timeLeft}s</strong></span>
                  </div>

                  <div className="hud-pill score-pill">
                    <Trophy size={14} />
                    <span>Score: <strong>{score}</strong></span>
                  </div>

                  <div className="hud-pill stage-pill">
                    <span>Level {level}/5: {getDuckLevelTitle(level)}</span>
                  </div>

                  {combo > 1 && (
                    <div className="hud-pill combo-pill animate-pulse">
                      <span>🔥 {combo}x Quack Streak!</span>
                    </div>
                  )}
                </div>
              )}

              {/* Toast */}
              {toastMsg && (
                <div className="pond-toast-bubble animate-pop">
                  <span>{toastMsg}</span>
                </div>
              )}

              {/* ----------------------------------------------------
                  LEVELS 1, 2, 3, 5: ACTIVE POND
                 ---------------------------------------------------- */}
              {((level >= 1 && level <= 3) || level === 5) && (
                <div className="pond-water-surface">
                  {ducks.map((duck) => (
                    <button
                      key={duck.id}
                      className={`pond-floating-duck ${duck.type} animate-pop`}
                      style={{
                        left: `${duck.x}%`,
                        top: `${duck.y}%`,
                        transform: `scale(${duck.direction}, 1)`
                      }}
                      onClick={(e) => handleDuckCatch(duck, e)}
                    >
                      {duck.type === 'frog' && <span className="duck-sprite">🐸</span>}
                      {duck.type === 'fake' && <span className="duck-sprite">🪵</span>}
                      {duck.type === 'golden' && <span className="duck-sprite">🐤✨</span>}
                      {duck.type === 'standard' && <span className="duck-sprite">🦆</span>}
                    </button>
                  ))}
                </div>
              )}

              {/* ----------------------------------------------------
                  LEVEL 4: BOSS MEGABILL ARENA
                 ---------------------------------------------------- */}
              {level === 4 && (
                <div className="boss-pond-arena">
                  <div className="boss-hp-container">
                    <div className="boss-hp-header">
                      <span className="boss-name">👑 MEGABILL THE TITAN DUCK</span>
                      <span className="boss-hp-val">{bossHp}/100 HP</span>
                    </div>
                    <div className="boss-hp-track">
                      <div className="boss-hp-fill" style={{ width: `${bossHp}%` }} />
                    </div>
                  </div>

                  <div className="boss-arena-body">
                    <div className="boss-giant-duck animate-bounce" onClick={() => damageBoss(5)}>
                      <span className="boss-sprite">🦆👑</span>
                      <span className="boss-weakspot-tag">Tap boss to attack!</span>
                    </div>

                    {ducks.map((duck) => (
                      <button
                        key={duck.id}
                        className="pond-floating-duck minion animate-pop"
                        style={{ left: `${duck.x}%`, top: `${duck.y}%` }}
                        onClick={(e) => handleDuckCatch(duck, e)}
                      >
                        <span className="duck-sprite">{duck.type === 'golden' ? '🐤✨' : '🦆'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  LEVEL 6: VICTORY SCREEN
                 ---------------------------------------------------- */}
              {level === 6 && (
                <div className="game-completed-view animate-pop">
                  <div className="trophy-stage">
                    <Trophy size={68} className="trophy-gold animate-bounce" />
                    <div className="trophy-aura" />
                  </div>

                  <h3 className="completed-title">QUACK MASTER SUPREME! 🦆👑</h3>
                  <p className="completed-subtitle">
                    All 5 chaotic ponds and Boss Megabill conquered! Final Score: <strong>{score} pts</strong>!
                  </p>

                  <div className="unlock-banner duck-unlock">
                    <CheckCircle2 size={22} className="unlock-icon" />
                    <div>
                      <strong>The Secret Rakhi Seal is Ready to Break!</strong>
                      <p>Proceed below to read your custom note and unwrap Duck's mystery Rakhi gift box 🎁</p>
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

function getDuckLevelTitle(lvl) {
  switch (lvl) {
    case 1: return 'Calm Pond 🦆';
    case 2: return 'Duck Storm ⚡';
    case 3: return 'Crazy Pond 🌊';
    case 4: return 'Boss Megabill 👑';
    case 5: return 'Golden Rush ⭐';
    default: return '';
  }
}
