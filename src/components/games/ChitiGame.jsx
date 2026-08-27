import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Trophy, Play, RotateCcw, ArrowLeft, ArrowRight, CheckCircle2, Heart, X, Star, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../services/soundEffects';

export default function ChitiGame({ recipient, onComplete }) {
  // Stages: 0: Intro, 1: Honey & Heart Catch, 2: Sibling Memory Garden, 3: Rakhi Craft, 4: Victory
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [toastMsg, setToastMsg] = useState('');
  const [combo, setCombo] = useState(0);
  const [scorePopups, setScorePopups] = useState([]);

  // Stage 1: Honey Catcher State
  const [teddyX, setTeddyX] = useState(50); // percentage (10 - 90)
  const [fallingItems, setFallingItems] = useState([]);
  const [itemsCollected, setItemsCollected] = useState(0);
  const stage1Target = 10;
  const stage1LoopRef = useRef(null);
  const stage1SpawnRef = useRef(null);

  // Stage 2: Sibling Memory Garden State
  const MEMORY_CARDS_DEF = [
    { id: 1, icon: '🧸', name: 'Teddy Bear' },
    { id: 2, icon: '🎀', name: 'Rakhi Ribbon' },
    { id: 3, icon: '🍫', name: 'Chocolate' },
    { id: 4, icon: '📷', name: 'Memory Photo' },
    { id: 5, icon: '🌸', name: 'Blossom' },
    { id: 6, icon: '🍯', name: 'Honey Pot' }
  ];
  const [deck, setDeck] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);

  // Stage 3: Rakhi Craft State
  const [craftStep, setCraftStep] = useState(0);
  const CRAFT_STEPS = [
    { title: 'Weave Golden Silk Threads 🧵', icon: '🧵', desc: 'Spin pure golden and crimson threads with sisterly love!' },
    { title: 'Place Sparkling Center Gem 💎', icon: '💎', desc: 'Embed a sparkling gemstone in the center of the medallion!' },
    { title: 'Attach Cuddly Mini Teddy Charm 🧸', icon: '🧸', desc: 'Fasten the adorable sister teddy charm to protect the bond!' },
    { title: 'Tie Golden Rakhi Ribbon Bow 🎀', icon: '🎀', desc: 'Complete the sacred knot sealed with infinite brotherly protection!' }
  ];

  const addScorePopup = (text, x = 50, y = 50, color = '#ff3366') => {
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
    clearInterval(stage1LoopRef.current);
    clearInterval(stage1SpawnRef.current);
  };

  // ----------------------------------------------------
  // STAGE 1: HONEY & HEART HARVEST
  // ----------------------------------------------------
  const startStage1 = () => {
    setStage(1);
    setFallingItems([]);
    setItemsCollected(0);
    setCombo(0);
    setToastMsg('Catch 10 sweet honey pots 🍯 and sister hearts 💖 with Teddy!');
    soundFx.playLevelUp();

    // Spawner
    stage1SpawnRef.current = setInterval(() => {
      const types = [
        { icon: '🍯', pts: 50, speed: 1.5, label: '+50' },
        { icon: '💖', pts: 80, speed: 1.6, label: 'LOVE! +80' },
        { icon: '🍫', pts: 60, speed: 1.7, label: '+60' },
        { icon: '🌸', pts: 40, speed: 1.4, label: '+40' },
        { icon: '⭐', pts: 100, speed: 2.0, label: 'SPARKLE! +100' }
      ];
      const selected = types[Math.floor(Math.random() * types.length)];
      const newItem = {
        id: Math.random(),
        x: Math.random() * 80 + 10,
        y: 0,
        ...selected
      };
      setFallingItems((prev) => [...prev.slice(-8), newItem]);
    }, 1100);

    // Physics Loop
    stage1LoopRef.current = setInterval(() => {
      setFallingItems((prev) => {
        const nextList = [];
        for (const item of prev) {
          const nextY = item.y + item.speed * 2.2;
          // Check collision with Teddy at bottom
          if (nextY >= 78 && nextY <= 92 && Math.abs(item.x - teddyX) < 16) {
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
                addScorePopup(`SWEET COMBO x${newCb}!`, teddyX, 75, '#ff3366');
              } else {
                addScorePopup(item.label, teddyX, 75, '#f59e0b');
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

  // Keyboard navigation for Stage 1
  useEffect(() => {
    if (stage !== 1) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setTeddyX((x) => Math.max(10, x - 12));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setTeddyX((x) => Math.min(90, x + 12));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [stage]);

  const handleStage1Touch = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const relX = ((clientX - rect.left) / rect.width) * 100;
    setTeddyX(Math.max(10, Math.min(90, relX)));
  };

  // ----------------------------------------------------
  // STAGE 2: SIBLING MEMORY GARDEN
  // ----------------------------------------------------
  const startStage2 = () => {
    clearInterval(stage1LoopRef.current);
    clearInterval(stage1SpawnRef.current);
    setStage(2);
    setToastMsg('Stage 2: Sibling Memory Match! Tap pairs to reveal cherished memories!');
    soundFx.playLevelUp();

    // Create 12 cards (6 pairs) shuffled
    const pairDeck = [];
    MEMORY_CARDS_DEF.forEach((c) => {
      pairDeck.push({ ...c, uid: `${c.id}_a` });
      pairDeck.push({ ...c, uid: `${c.id}_b` });
    });
    // Shuffle
    for (let i = pairDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairDeck[i], pairDeck[j]] = [pairDeck[j], pairDeck[i]];
    }
    setDeck(pairDeck);
    setFlippedIndices([]);
    setMatchedIds([]);
  };

  const handleCardClick = (index) => {
    if (flippedIndices.length >= 2 || flippedIndices.includes(index)) return;
    const card = deck[index];
    if (matchedIds.includes(card.id)) return;

    soundFx.playClick();
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      const card1 = deck[firstIdx];
      const card2 = deck[secondIdx];

      if (card1.id === card2.id) {
        // Matched!
        soundFx.playMatchSuccess();
        setScore((s) => s + 120);
        addScorePopup('PAIR MATCHED! ✨', 50, 45, '#10b981');
        const nextMatched = [...matchedIds, card1.id];
        setMatchedIds(nextMatched);
        setFlippedIndices([]);

        if (nextMatched.length === MEMORY_CARDS_DEF.length) {
          setTimeout(startStage3, 700);
        }
      } else {
        // Not match
        setTimeout(() => {
          setFlippedIndices([]);
        }, 750);
      }
    }
  };

  // ----------------------------------------------------
  // STAGE 3: TEDDY BEAR RAKHI MASTER CRAFT
  // ----------------------------------------------------
  const startStage3 = () => {
    setStage(3);
    setCraftStep(0);
    setToastMsg('Stage 3: Rakhi Master Craft! Tap to assemble your glowing Sister Rakhi!');
    soundFx.playLevelUp();
  };

  const handleCraftStepTap = () => {
    soundFx.playPowerUp();
    setScore((s) => s + 150);
    const nextStep = craftStep + 1;
    setCraftStep(nextStep);

    addScorePopup(`STEP ${nextStep} CRAFTED! 🧵✨`, 50, 45, '#ff3366');

    if (nextStep >= CRAFT_STEPS.length) {
      setTimeout(triggerVictory, 800);
    }
  };

  // ----------------------------------------------------
  // STAGE 4: GRAND SIBLING VICTORY
  // ----------------------------------------------------
  const triggerVictory = () => {
    setStage(4);
    clearInterval(stage1LoopRef.current);
    clearInterval(stage1SpawnRef.current);
    soundFx.playGameWin();

    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#ff3366', '#f59e0b', '#ffd166', '#ff9ebb', '#ffffff']
    });

    if (onComplete) {
      onComplete(score + 600);
    }
  };

  return (
    <>
      {/* Teaser card shown on the stage before launching */}
      <div className="mini-game-card game-chiti animate-pop">
        <div className="game-card-badge">
          <Sparkles size={14} className="text-pink-400" />
          <span>Siri Chaithra's Level 3 Quest</span>
        </div>

        <div className="game-card-icon-bubble animate-bounce">
          <span className="game-card-emoji">🧸🍯💖</span>
        </div>

        <h3 className="game-card-title">Teddy Bear's Honey & Rakhi Sibling Quest! ✨</h3>
        <p className="game-card-desc">
          Harvest sweet honey pots & hearts with Teddy, solve the Sibling Memory Garden, and craft the Ultimate Glowing Sister Rakhi!
        </p>

        <button
          type="button"
          id="btn-start-chiti-game"
          className="btn-launch-game"
          onClick={startQuest}
        >
          <Play size={18} />
          <span>Launch Teddy Bear Quest 🎮</span>
        </button>
      </div>

      {/* FULL-SCREEN ARCADE MODAL */}
      {stage > 0 &&
        createPortal(
          <div className="modal-backdrop game-modal-overlay animate-fade-in" style={{ zIndex: 99999 }}>
            <div className="game-arcade-frame teddy-arcade-theme animate-pop">
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
                      <span>{combo}x COMBO!</span>
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
                  STAGE 1: HONEY & HEART CATCHER
                 ---------------------------------------------------- */}
              {stage === 1 && (
                <div
                  className="arcade-playfield canopy-playfield"
                  onMouseMove={handleStage1Touch}
                  onTouchMove={handleStage1Touch}
                >
                  <div className="playfield-sub-header">
                    <span>Honey & Hearts Harvested: <strong>{itemsCollected}</strong> / {stage1Target}</span>
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${(itemsCollected / stage1Target) * 100}%`, background: 'linear-gradient(90deg, #ff3366, #f59e0b)' }}
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

                  {/* Player Basket / Cuddly Teddy */}
                  <div
                    className="canopy-basket"
                    style={{
                      left: `${teddyX}%`,
                      transform: 'translateX(-50%)',
                      position: 'absolute',
                      bottom: '24px'
                    }}
                  >
                    <div className="basket-monkey-sprite animate-bounce">
                      <span className="basket-emoji">🧸🍯</span>
                    </div>
                  </div>

                  {/* Touch Steering Controls for Mobile */}
                  <div className="touch-steering-row">
                    <button
                      type="button"
                      className="btn-steer"
                      onClick={() => setTeddyX((x) => Math.max(10, x - 18))}
                    >
                      <ArrowLeft size={20} />
                      <span>Left</span>
                    </button>
                    <span className="steer-hint">Drag or use buttons</span>
                    <button
                      type="button"
                      className="btn-steer"
                      onClick={() => setTeddyX((x) => Math.min(90, x + 18))}
                    >
                      <span>Right</span>
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STAGE 2: SIBLING MEMORY GARDEN
                 ---------------------------------------------------- */}
              {stage === 2 && (
                <div className="arcade-playfield memory-playfield">
                  <div className="playfield-sub-header">
                    <span>Pairs Matched: <strong>{matchedIds.length}</strong> / {MEMORY_CARDS_DEF.length}</span>
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${(matchedIds.length / MEMORY_CARDS_DEF.length) * 100}%`, background: 'linear-gradient(90deg, #ff3366, #ec4899)' }}
                      />
                    </div>
                  </div>

                  <div className="memory-card-grid">
                    {deck.map((card, idx) => {
                      const isFlipped = flippedIndices.includes(idx) || matchedIds.includes(card.id);
                      const isMatched = matchedIds.includes(card.id);

                      return (
                        <button
                          key={card.uid}
                          type="button"
                          className={`memory-card ${isFlipped ? 'is-flipped' : ''} ${isMatched ? 'is-matched' : ''}`}
                          onClick={() => handleCardClick(idx)}
                        >
                          <div className="memory-card-inner">
                            <div className="memory-card-front">
                              <span className="card-mystery-icon">🎁</span>
                            </div>
                            <div className="memory-card-back">
                              <span className="card-revealed-icon">{card.icon}</span>
                              <span className="card-revealed-name">{card.name}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STAGE 3: RAKHI CRAFT CHALLENGE
                 ---------------------------------------------------- */}
              {stage === 3 && (
                <div className="arcade-playfield craft-playfield">
                  <div className="craft-showcase-card">
                    <div className="craft-rakhi-preview animate-bounce">
                      <span className="preview-emoji">
                        {craftStep === 0 && '🧵'}
                        {craftStep === 1 && '💎'}
                        {craftStep === 2 && '🧸'}
                        {craftStep >= 3 && '🎀✨'}
                      </span>
                    </div>

                    <h3 className="craft-step-title">
                      {craftStep < CRAFT_STEPS.length ? CRAFT_STEPS[craftStep].title : 'Rakhi Ready! ✨'}
                    </h3>
                    <p className="craft-step-desc">
                      {craftStep < CRAFT_STEPS.length ? CRAFT_STEPS[craftStep].desc : 'Your glowing Sister Rakhi is complete!'}
                    </p>

                    <div className="craft-step-dots">
                      {CRAFT_STEPS.map((st, i) => (
                        <div
                          key={st.title}
                          className={`craft-dot ${i < craftStep ? 'is-done' : i === craftStep ? 'is-current' : ''}`}
                        >
                          <span>{st.icon}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      id="btn-craft-action"
                      className="btn-arcade-action-huge"
                      onClick={handleCraftStepTap}
                    >
                      <Sparkles size={22} />
                      <span>{craftStep < CRAFT_STEPS.length ? 'Craft Next Component ✨' : 'Complete Rakhi! 🏆'}</span>
                    </button>
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

                  <h2 className="victory-main-title">TEDDY SIBLING QUEST COMPLETE! 🧸💖🏆</h2>
                  <p className="victory-subtitle">
                    Siri Chaithra gathered all the honey memories and crafted the supreme Rakhi with <strong>{score} pts</strong>!
                  </p>

                  <div className="victory-reward-card">
                    <CheckCircle2 size={24} className="text-green-400" />
                    <div>
                      <strong>The Secret Rakhi Seal is Ready to Break!</strong>
                      <p>Proceed to Level 4 to read your handwritten brother letter ✨</p>
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
    case 1: return 'Honey & Hearts Harvest 🍯';
    case 2: return 'Memory Garden 🧠';
    case 3: return 'Rakhi Master Craft 🧵';
    case 4: return 'Sibling Victory 🏆';
    default: return '';
  }
}
