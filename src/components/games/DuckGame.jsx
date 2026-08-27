import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Waves, Trophy, Play, RotateCcw, Sparkles, CheckCircle2, Flame, Heart, X, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../services/soundEffects';

export default function DuckGame({ recipient, onComplete }) {
  // Stages: 0: Intro, 1: Ripple Catch, 2: Whirlpool Rush, 3: Boss Megabill, 4: Victory
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [toastMsg, setToastMsg] = useState('');
  const [combo, setCombo] = useState(0);
  const [scorePopups, setScorePopups] = useState([]);

  // Stage 1 & 2 Ducks Pool
  const [ducks, setDucks] = useState([]);
  const [ducksCaught, setDucksCaught] = useState(0);
  const stage1Target = 10;
  const stage2Target = 12;
  const spawnTimerRef = useRef(null);

  // Stage 3 Boss Megabill
  const [bossHp, setBossHp] = useState(100);
  const [bossShaking, setBossShaking] = useState(false);

  const addScorePopup = (text, x = 50, y = 50, color = '#06b6d4') => {
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
    clearInterval(spawnTimerRef.current);
  };

  // ----------------------------------------------------
  // STAGE 1: POND RIPPLE CATCH
  // ----------------------------------------------------
  const startStage1 = () => {
    setStage(1);
    setDucks([]);
    setDucksCaught(0);
    setCombo(0);
    setToastMsg('Stage 1: Calm Pond! Tap the bobbing yellow ducks to catch them!');
    soundFx.playLevelUp();

    spawnTimerRef.current = setInterval(() => {
      const newDuck = {
        id: Math.random(),
        x: Math.random() * 75 + 12,
        y: Math.random() * 60 + 20,
        icon: Math.random() < 0.25 ? '🐤' : '🦆',
        pts: 50,
        label: '+50 QUACK!'
      };
      setDucks((prev) => [...prev.slice(-6), newDuck]);
    }, 900);
  };

  // ----------------------------------------------------
  // STAGE 2: WHIRLPOOL RUSH
  // ----------------------------------------------------
  const startStage2 = () => {
    clearInterval(spawnTimerRef.current);
    setStage(2);
    setDucks([]);
    setDucksCaught(0);
    setToastMsg('⚡ Stage 2: Whirlpool Rush! Faster Golden Ducks & Rainbow duckies!');
    soundFx.playLevelUp();

    spawnTimerRef.current = setInterval(() => {
      const isGolden = Math.random() < 0.4;
      const newDuck = {
        id: Math.random(),
        x: Math.random() * 78 + 10,
        y: Math.random() * 62 + 18,
        icon: isGolden ? '🌟🦆' : '🦆',
        pts: isGolden ? 100 : 60,
        label: isGolden ? 'GOLDEN +100!' : '+60'
      };
      setDucks((prev) => [...prev.slice(-7), newDuck]);
    }, 750);
  };

  const handleDuckTap = (duck, e) => {
    soundFx.playMascot('duck');
    setScore((s) => s + duck.pts);
    setDucks((prev) => prev.filter((d) => d.id !== duck.id));

    const target = stage === 1 ? stage1Target : stage2Target;
    setDucksCaught((c) => {
      const next = c + 1;
      if (next >= target) {
        if (stage === 1) {
          setTimeout(startStage2, 500);
        } else {
          setTimeout(startStage3, 500);
        }
      }
      return next;
    });

    setCombo((cb) => {
      const newCb = cb + 1;
      if (newCb > 1) {
        soundFx.playComboStreak(newCb);
        addScorePopup(`QUACK COMBO x${newCb}!`, duck.x, duck.y, '#facc15');
      } else {
        addScorePopup(duck.label, duck.x, duck.y, '#06b6d4');
      }
      return newCb;
    });
  };

  // ----------------------------------------------------
  // STAGE 3: BOSS MEGABILL WATER BATTLE
  // ----------------------------------------------------
  const startStage3 = () => {
    clearInterval(spawnTimerRef.current);
    setStage(3);
    setBossHp(100);
    setToastMsg('👑 FINAL BOSS: MEGABILL EMERGES! Tap rapidly to splash and defeat the boss duck!');
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
    addScorePopup('💦 SPLASH! +45', x || 50, 45, '#06b6d4');

    if (nextHp <= 0) {
      triggerVictory();
    }
  };

  // ----------------------------------------------------
  // STAGE 4: VICTORY CEREMONY
  // ----------------------------------------------------
  const triggerVictory = () => {
    setStage(4);
    clearInterval(spawnTimerRef.current);
    soundFx.playGameWin();

    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#06b6d4', '#38bdf8', '#facc15', '#a5f3fc', '#ffffff']
    });

    if (onComplete) {
      onComplete(score + 600);
    }
  };

  return (
    <>
      {/* Teaser card */}
      <div className="mini-game-card game-duck animate-pop">
        <div className="game-card-badge">
          <Sparkles size={14} className="text-cyan-400" />
          <span>Grishma's Level 3 Quest</span>
        </div>

        <div className="game-card-icon-bubble animate-bounce">
          <span className="game-card-emoji">🦆💦🌊</span>
        </div>

        <h3 className="game-card-title">Captain Quackers' Splashtastic Pond Dash! 🌊</h3>
        <p className="game-card-desc">
          Tap bobbing pond ducks, ride the Whirlpool currents, and defeat the legendary Boss Megabill to unlock the Secret Rakhi Letter!
        </p>

        <button
          type="button"
          id="btn-start-duck-game"
          className="btn-launch-game"
          onClick={startQuest}
        >
          <Play size={18} />
          <span>Launch Pond Quest 🎮</span>
        </button>
      </div>

      {/* FULL-SCREEN ARCADE MODAL */}
      {stage > 0 &&
        createPortal(
          <div className="modal-backdrop game-modal-overlay animate-fade-in" style={{ zIndex: 99999 }}>
            <div className="game-arcade-frame duck-arcade-theme animate-pop">
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
                      <Flame size={16} className="text-cyan-400" />
                      <span>{combo}x QUACK COMBO!</span>
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
                  STAGE 1 & 2: POND DUCK TAP ARENA
                 ---------------------------------------------------- */}
              {(stage === 1 || stage === 2) && (
                <div className="arcade-playfield pond-playfield">
                  <div className="playfield-sub-header">
                    <span>
                      Ducks Caught: <strong>{ducksCaught}</strong> / {stage === 1 ? stage1Target : stage2Target}
                    </span>
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${(ducksCaught / (stage === 1 ? stage1Target : stage2Target)) * 100}%`,
                          background: 'linear-gradient(90deg, #06b6d4, #facc15)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Swimming Ducks with Ripple Rings */}
                  <div className="pond-water-surface">
                    {ducks.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        className="swimming-duck-btn animate-pop"
                        style={{ left: `${d.x}%`, top: `${d.y}%` }}
                        onClick={(e) => handleDuckTap(d, e)}
                      >
                        <div className="water-ripple-ring" />
                        <span className="swimming-duck-icon animate-bounce">{d.icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STAGE 3: BOSS MEGABILL WATER BATTLE
                 ---------------------------------------------------- */}
              {stage === 3 && (
                <div className="arcade-playfield boss-playfield">
                  <div className="boss-hud-card">
                    <div className="boss-name-row">
                      <span className="boss-name">👑 Emperor Megabill the 1st</span>
                      <span className="boss-hp-text">{bossHp}% HP</span>
                    </div>
                    <div className="boss-hp-track">
                      <div
                        className="boss-hp-fill"
                        style={{
                          width: `${bossHp}%`,
                          background: bossHp > 40 ? 'linear-gradient(90deg, #06b6d4, #ef4444)' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>

                  <div className="boss-target-stage">
                    <button
                      type="button"
                      id="btn-splash-duck-boss"
                      className={`boss-banana-target ${bossShaking ? 'shake-animation' : 'animate-bounce'}`}
                      onClick={handleBossTap}
                    >
                      <span className="boss-banana-emoji">🦆🌊</span>
                      <div className="boss-hit-glow" />
                    </button>
                    <p className="boss-tap-instruction">⚡ TAP RAPIDLY TO SPLASH & DEFEAT BOSS MEGABILL! ⚡</p>
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

                  <h2 className="victory-main-title">POND DASH CHAMPION! 🦆🌊🏆</h2>
                  <p className="victory-subtitle">
                    Grishma defeated Boss Megabill and conquered the pond with <strong>{score} pts</strong>!
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
    case 1: return 'Calm Pond Catch 🦆';
    case 2: return 'Whirlpool Rush ⚡';
    case 3: return 'Boss Megabill Battle 👑';
    case 4: return 'Pond Champion Victory 🏆';
    default: return '';
  }
}
