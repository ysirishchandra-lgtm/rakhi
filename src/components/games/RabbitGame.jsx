import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Trophy, Play, RotateCcw, CheckCircle2, Timer, Flame, ShieldAlert, Heart, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../services/soundEffects';

export default function RabbitGame({ recipient, onComplete }) {
  // Stages: 0: Intro, 1: Carrot Meadow, 2: Burrow Rush, 3: Rainbow Bloom, 4: Boss Shadow Wolf, 5: Victory
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [items, setItems] = useState([]);
  const [combo, setCombo] = useState(0);
  const [toastMsg, setToastMsg] = useState('');

  // Boss State (Stage 4)
  const [bossHp, setBossHp] = useState(100);

  const gameTimerRef = useRef(null);
  const spawnTimerRef = useRef(null);

  const startGame = () => {
    soundFx.playClick();
    setScore(0);
    startStage1();
  };

  const exitGame = () => {
    soundFx.playClick();
    setStage(0);
    clearInterval(gameTimerRef.current);
    clearInterval(spawnTimerRef.current);
  };

  // ----------------------------------------------------
  // STAGE 1: SUNNY MEADOW CARROT HOP
  // ----------------------------------------------------
  const startStage1 = () => {
    setStage(1);
    setTimeLeft(20);
    setCombo(0);
    setItems([]);
    setToastMsg('Stage 1: Sunny Meadow! Catch sweet carrots & 4-leaf clovers!');
    soundFx.playLevelUp();
  };

  // ----------------------------------------------------
  // STAGE 2: BURROW RUSH
  // ----------------------------------------------------
  const startStage2 = () => {
    setStage(2);
    setTimeLeft(18);
    setItems([]);
    setToastMsg('⚡ Stage 2: Burrow Rush! Catch fast golden carrots, avoid prickly brambles!');
    soundFx.playLevelUp();
  };

  // ----------------------------------------------------
  // STAGE 3: RAINBOW FLOWER VALLEY
  // ----------------------------------------------------
  const startStage3 = () => {
    setStage(3);
    setTimeLeft(20);
    setItems([]);
    setToastMsg('🌸 Stage 3: Rainbow Bloom! Catch rainbow flowers & mega carrots!');
    soundFx.playLevelUp();
  };

  // ----------------------------------------------------
  // STAGE 4: BOSS SHADOW WOLF
  // ----------------------------------------------------
  const startStage4 = () => {
    setStage(4);
    setTimeLeft(25);
    setBossHp(100);
    setItems([]);
    setToastMsg('🐺 Stage 4: Boss Shadow Wolf! Rapidly fire golden carrots to protect the meadow!');
    soundFx.playLevelUp();
  };

  // ----------------------------------------------------
  // STAGE 5: VICTORY CEREMONY
  // ----------------------------------------------------
  const triggerVictory = () => {
    setStage(5);
    clearInterval(gameTimerRef.current);
    clearInterval(spawnTimerRef.current);
    soundFx.playGameWin();

    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#ec4899', '#f97316', '#facc15', '#f472b6', '#ffffff']
    });

    if (onComplete) {
      onComplete(score + 500);
    }
  };

  // Stage Timer Loop
  useEffect(() => {
    if (stage >= 1 && stage <= 4) {
      gameTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(gameTimerRef.current);
            handleStageTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(gameTimerRef.current);
    }
  }, [stage, score, bossHp]);

  // Handle stage timeout or progress
  const handleStageTimeout = () => {
    if (stage === 1) {
      if (score >= 80) startStage2();
      else startStage1();
    } else if (stage === 2) {
      if (score >= 200) startStage3();
      else startStage2();
    } else if (stage === 3) {
      if (score >= 380) startStage4();
      else startStage3();
    } else if (stage === 4) {
      if (bossHp <= 0) triggerVictory();
      else startStage4();
    }
  };

  // Spawn Items Loop (Stages 1-3)
  useEffect(() => {
    if (stage >= 1 && stage <= 3) {
      const intervalMs = stage === 1 ? 850 : stage === 2 ? 650 : 550;

      spawnTimerRef.current = setInterval(() => {
        const types =
          stage === 1
            ? ['carrot', 'carrot', 'clover', 'strawberry']
            : stage === 2
            ? ['carrot', 'goldenCarrot', 'bramble', 'carrot', 'clover']
            : ['goldenCarrot', 'rainbowFlower', 'bramble', 'megaCarrot', 'strawberry'];

        const randomType = types[Math.floor(Math.random() * types.length)];
        const newItem = {
          id: Date.now() + Math.random(),
          type: randomType,
          x: 10 + Math.random() * 75,
          y: 15 + Math.random() * 70,
          points:
            randomType === 'carrot'
              ? 15
              : randomType === 'goldenCarrot'
              ? 35
              : randomType === 'rainbowFlower'
              ? 50
              : randomType === 'megaCarrot'
              ? 60
              : randomType === 'strawberry'
              ? 25
              : -20
        };

        setItems((prev) => [...prev.slice(-10), newItem]);
      }, intervalMs);

      return () => clearInterval(spawnTimerRef.current);
    }
  }, [stage]);

  const handleCatchItem = (item) => {
    soundFx.playCatch();
    setItems((prev) => prev.filter((i) => i.id !== item.id));

    if (item.type === 'bramble') {
      soundFx.playError();
      setCombo(0);
      setScore((prev) => Math.max(0, prev - 20));
      return;
    }

    const newCombo = combo + 1;
    setCombo(newCombo);
    const multiplier = newCombo >= 5 ? 2 : 1;
    const gained = item.points * multiplier;
    setScore((prev) => prev + gained);

    // Check Stage advance triggers
    if (stage === 1 && score + gained >= 100) {
      clearInterval(gameTimerRef.current);
      clearInterval(spawnTimerRef.current);
      startStage2();
    } else if (stage === 2 && score + gained >= 240) {
      clearInterval(gameTimerRef.current);
      clearInterval(spawnTimerRef.current);
      startStage3();
    } else if (stage === 3 && score + gained >= 420) {
      clearInterval(gameTimerRef.current);
      clearInterval(spawnTimerRef.current);
      startStage4();
    }
  };

  // Boss attack handler (Stage 4)
  const handleBossStrike = () => {
    soundFx.playCatch();
    const damage = 8 + Math.floor(Math.random() * 6);
    const nextHp = Math.max(0, bossHp - damage);
    setBossHp(nextHp);
    setScore((prev) => prev + 25);

    if (nextHp <= 0) {
      triggerVictory();
    }
  };

  const getItemEmoji = (type) => {
    switch (type) {
      case 'carrot': return '🥕';
      case 'goldenCarrot': return '✨🥕';
      case 'clover': return '🍀';
      case 'strawberry': return '🍓';
      case 'rainbowFlower': return '🌸';
      case 'megaCarrot': return '👑🥕';
      case 'bramble': return '🌵';
      default: return '🥕';
    }
  };

  return (
    <div className="mini-game-container rabbit-game-theme animate-pop">
      {/* ----------------------------------------------------
          STAGE 0: INTRO SCREEN
         ---------------------------------------------------- */}
      {stage === 0 && (
        <div className="game-intro-card">
          <div className="game-badge-chip">
            <Sparkles size={14} className="text-pink-400" />
            <span>Hanvika's Special Quest</span>
          </div>

          <h3 className="game-title">Bunny Meadow & Golden Carrot Quest 🐰🥕</h3>
          <p className="game-desc">
            Help the fluffy meadow bunny hop across 4 adventure stages! Catch sweet golden carrots, collect lucky clovers, and conquer the Shadow Wolf to unlock the Golden Rakhi Seal and Secret Letter!
          </p>

          <div className="game-rules-grid">
            <div className="rule-item">
              <span className="rule-icon">🥕</span>
              <span className="rule-text">Catch fresh crunchy carrots (+15 pts)</span>
            </div>
            <div className="rule-item">
              <span className="rule-icon">✨🥕</span>
              <span className="rule-text">Snag rare Golden Carrots (+35 pts)</span>
            </div>
            <div className="rule-item">
              <span className="rule-icon">🌵</span>
              <span className="rule-text">Avoid sharp thorns & brambles (-20 pts)</span>
            </div>
            <div className="rule-item">
              <span className="rule-icon">🐺</span>
              <span className="rule-text">Protect the meadow burrow harvest!</span>
            </div>
          </div>

          <button
            id="btn-start-rabbit-game"
            type="button"
            className="btn-game-launch"
            onClick={startGame}
          >
            <Play size={18} />
            <span>Play Hanvika's Quest Now ✨</span>
          </button>
        </div>
      )}

      {/* ----------------------------------------------------
          STAGES 1 - 5: FULL-SCREEN GAMEPLAY MODAL
         ---------------------------------------------------- */}
      {stage > 0 &&
        createPortal(
          <div className="modal-backdrop game-modal-overlay animate-fade-in" style={{ zIndex: 999999 }}>
            <div className="game-modal-card rabbit-modal-arena animate-pop">
              {/* Exit Modal Button */}
              <button
                type="button"
                className="btn-modal-close"
                onClick={exitGame}
                aria-label="Exit Game"
              >
                <X size={20} />
              </button>

              {/* Game HUD */}
              <div className="game-hud-bar">
                <div className="hud-metric">
                  <Timer size={16} className="text-pink-300" />
                  <span>Time: <strong>{timeLeft}s</strong></span>
                </div>

                <div className="hud-metric">
                  <Trophy size={16} className="text-yellow-400" />
                  <span>Score: <strong>{score}</strong></span>
                </div>

                {combo > 1 && (
                  <div className="hud-metric combo-badge animate-bounce">
                    <Flame size={16} className="text-orange-400" />
                    <span>{combo}x Hop Combo!</span>
                  </div>
                )}
              </div>

              {toastMsg && (
                <div className="game-toast-banner animate-pop">
                  <span>{toastMsg}</span>
                </div>
              )}

              {/* STAGES 1 - 3: CARROT MEADOW CATCH ARENA */}
              {stage >= 1 && stage <= 3 && (
                <div className="rabbit-meadow-arena">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`rabbit-catchable-item ${item.type === 'bramble' ? 'item-bramble' : 'item-good'} animate-pop`}
                      style={{
                        position: 'absolute',
                        left: `${item.x}%`,
                        top: `${item.y}%`
                      }}
                      onClick={() => handleCatchItem(item)}
                    >
                      <span className="catch-item-symbol">{getItemEmoji(item.type)}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* STAGE 4: BOSS SHADOW WOLF */}
              {stage === 4 && (
                <div className="rabbit-boss-arena">
                  <div className="boss-header">
                    <div className="boss-title-row">
                      <span className="boss-name">🐺 Shadow Wolf of the Brambles</span>
                      <span className="boss-hp-text">{bossHp} / 100 HP</span>
                    </div>
                    <div className="boss-hp-track">
                      <div
                        className="boss-hp-fill"
                        style={{
                          width: `${bossHp}%`,
                          background: bossHp > 30 ? 'linear-gradient(90deg, #ec4899, #f97316)' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>

                  <div className="boss-character-box animate-pulse" onClick={handleBossStrike}>
                    <span className="boss-avatar">🐺</span>
                    <span className="boss-action-hint">Tap rapidly to strike with Golden Carrots! 🥕✨</span>
                  </div>
                </div>
              )}

              {/* STAGE 5: VICTORY SCREEN */}
              {stage === 5 && (
                <div className="game-victory-card animate-pop">
                  <div className="victory-crown-box">
                    <Trophy size={48} className="text-yellow-400 animate-bounce" />
                  </div>
                  <h3 className="victory-title">Meadow Champion Victory! 🏆🐰</h3>
                  <p className="victory-desc">
                    Incredible hopping skills, Hanvika! You gathered the harvest, outsmarted the Shadow Wolf, and unlocked the Golden Rakhi Seal!
                  </p>
                  <div className="victory-score-pill">
                    <span>Final Harvest Score: <strong>{score} pts</strong></span>
                  </div>

                  <button
                    type="button"
                    className="btn-game-finish"
                    onClick={exitGame}
                  >
                    <CheckCircle2 size={18} />
                    <span>Claim Victory & Continue Journey ✨</span>
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
