import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Heart, Trophy, ArrowRight, RotateCcw, CheckCircle2, Award, Timer, Shield, Flame, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../services/soundEffects';

export default function ChitiGame({ recipient, onComplete }) {
  // Game Levels: 0: Intro, 1: Heart Collector, 2: Memory Room, 3: Rakhi Craft, 4: Sibling Reflex, 5: Heart Rescue, 6: Sacred Oath Ritual, 7: Victory
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [toastMsg, setToastMsg] = useState('');

  // ----------------------------------------------------
  // LEVEL 1: Heart Collector State
  // ----------------------------------------------------
  const [l1Hearts, setL1Hearts] = useState([]);
  const [l1Collected, setL1Collected] = useState(0);
  const [l1Time, setL1Time] = useState(20);
  const l1TimerRef = useRef(null);

  // ----------------------------------------------------
  // LEVEL 2: Sibling Memory Room State
  // ----------------------------------------------------
  const MEMORY_ITEMS = [
    { id: 1, icon: '🍫', name: 'Chocolate' },
    { id: 2, icon: '📺', name: 'TV Remote' },
    { id: 3, icon: '🌸', name: 'Blossom' },
    { id: 4, icon: '📷', name: 'Polaroid' }
  ];
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);

  // ----------------------------------------------------
  // LEVEL 3: Rakhi Craft Challenge State
  // ----------------------------------------------------
  const CRAFT_SEQUENCE = ['silk_thread', 'blossom_gem', 'golden_bead', 'sister_charm', 'ribbon'];
  const [craftedParts, setCraftedParts] = useState([]);

  // ----------------------------------------------------
  // LEVEL 4: Sibling Reflex Challenge State
  // ----------------------------------------------------
  const REFLEX_PROMPTS = [
    {
      situation: 'Brother sneaks the last chocolate bar!',
      correctBtn: 'DEFEND CHOCOLATE 🍫',
      wrongBtn: 'LET IT GO 😇',
      response: '“Snack defended with 10/10 sister reflexes!” 🍫💨'
    },
    {
      situation: 'Mom asks who left the kitchen lights on!',
      correctBtn: 'POINT AT BROTHER 👉',
      wrongBtn: 'CONFESS NOBLY 🛡️',
      response: '“Guilty brother identified instantly! Master tactical deflection!” 😂'
    },
    {
      situation: 'A terrifying spider crawls across the wall!',
      correctBtn: 'BEAT WITH SLIPPER 🩴',
      wrongBtn: 'SCREAM & CRY 😱',
      response: '“Sister courage activated! Spider defeated in one strike!” 🕷️💥'
    },
    {
      situation: 'Brother offers a peace treaty & ice cream!',
      correctBtn: 'ACCEPT WITH TOPPINGS 🍦',
      wrongBtn: 'REFUSE TREATY 🙅‍♀️',
      response: '“Peace restored with double sprinkles! Brother-Sister truce signed!” 💖'
    }
  ];
  const [reflexIndex, setReflexIndex] = useState(0);
  const [reflexTimer, setReflexTimer] = useState(4);
  const reflexIntervalRef = useRef(null);

  // ----------------------------------------------------
  // LEVEL 5: Heart Rescue Maze State
  // ----------------------------------------------------
  const [heartPos, setHeartPos] = useState({ x: 20, y: 50 }); // percentage
  const [clouds, setClouds] = useState([
    { id: 1, x: 45, y: 25, dy: 1.2 },
    { id: 2, x: 70, y: 70, dy: -1.4 }
  ]);
  const mazeLoopRef = useRef(null);

  // ----------------------------------------------------
  // LEVEL 6: Sacred Rakhi Oath State
  // ----------------------------------------------------
  const [oathStepsCompleted, setOathStepsCompleted] = useState({
    diya: false,
    tilak: false,
    knot: false,
    sweet: false
  });

  // Start Quest
  const startQuest = () => {
    soundFx.playClick();
    setScore(0);
    startLevel1();
  };

  // ----------------------------------------------------
  // LEVEL 1: Setup & Loop
  // ----------------------------------------------------
  const startLevel1 = () => {
    setLevel(1);
    setL1Collected(0);
    setL1Time(20);
    setToastMsg('Tap the floating hearts to collect 8 sister energy sparks!');
    soundFx.playLevelUp();

    // Spawn 5 initial hearts
    const items = [];
    for (let i = 0; i < 6; i++) {
      items.push({
        id: Math.random(),
        x: Math.random() * 75 + 10,
        y: Math.random() * 65 + 15,
        isThorn: Math.random() < 0.2
      });
    }
    setL1Hearts(items);
  };

  useEffect(() => {
    if (level !== 1) return;

    l1TimerRef.current = setInterval(() => {
      setL1Time((t) => {
        if (t <= 1) {
          clearInterval(l1TimerRef.current);
          if (l1Collected < 8) {
            soundFx.playError();
            setToastMsg('Time ran out! Try collecting faster!');
            setTimeout(startLevel1, 1200);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(l1TimerRef.current);
  }, [level, l1Collected]);

  const handleL1Tap = (item) => {
    if (item.isThorn) {
      soundFx.playHitObstacle();
      setToastMsg('⚡ Ouch, thorn cloud! -5 pts');
      setScore((s) => Math.max(0, s - 5));
    } else {
      soundFx.playMascot('chiti');
      const newCount = l1Collected + 1;
      setL1Collected(newCount);
      setScore((s) => s + 20);

      if (newCount >= 8) {
        clearInterval(l1TimerRef.current);
        soundFx.playLevelUp();
        setToastMsg('💖 LEVEL 1 CLEARED! Moving to Sibling Memory Room...');
        setTimeout(startLevel2, 1400);
      }
    }

    // Replace item
    setL1Hearts((prev) => [
      ...prev.filter((h) => h.id !== item.id),
      {
        id: Math.random(),
        x: Math.random() * 75 + 10,
        y: Math.random() * 65 + 15,
        isThorn: Math.random() < 0.2
      }
    ]);
  };

  // ----------------------------------------------------
  // LEVEL 2: Memory Room Setup
  // ----------------------------------------------------
  const startLevel2 = () => {
    setLevel(2);
    setFlippedCards([]);
    setMatchedCards([]);
    soundFx.playLevelUp();
    setToastMsg('Flip and match all 4 pairs of sibling memories!');

    const deck = [...MEMORY_ITEMS, ...MEMORY_ITEMS]
      .map((item, idx) => ({ ...item, uniqueId: idx }))
      .sort(() => Math.random() - 0.5);

    setCards(deck);
  };

  const handleCardClick = (card) => {
    if (flippedCards.length === 2 || flippedCards.some((c) => c.uniqueId === card.uniqueId) || matchedCards.includes(card.id)) {
      return;
    }

    soundFx.playClick();
    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      if (newFlipped[0].id === newFlipped[1].id) {
        soundFx.playMatchSuccess();
        setMatchedCards((prev) => [...prev, card.id]);
        setFlippedCards([]);
        setScore((s) => s + 30);

        if (matchedCards.length + 1 === MEMORY_ITEMS.length) {
          soundFx.playLevelUp();
          setToastMsg('🌸 LEVEL 2 CLEARED! Sibling Memories Restored!');
          setTimeout(startLevel3, 1400);
        }
      } else {
        soundFx.playError();
        setTimeout(() => setFlippedCards([]), 900);
      }
    }
  };

  // ----------------------------------------------------
  // LEVEL 3: Rakhi Craft Setup
  // ----------------------------------------------------
  const startLevel3 = () => {
    setLevel(3);
    setCraftedParts([]);
    soundFx.playLevelUp();
    setToastMsg('Assemble the components in order: Silk Thread 🧵 ➔ Blossom Gem 🌸 ➔ Golden Bead ✨ ➔ Sister Charm 💖 ➔ Ribbon 🎀');
  };

  const handleCraftPart = (partKey) => {
    const nextExpected = CRAFT_SEQUENCE[craftedParts.length];
    if (partKey === nextExpected) {
      soundFx.playMascot('chiti');
      const newCrafted = [...craftedParts, partKey];
      setCraftedParts(newCrafted);
      setScore((s) => s + 25);

      if (newCrafted.length === CRAFT_SEQUENCE.length) {
        soundFx.playLevelUp();
        setToastMsg('🎀 LEVEL 3 CLEARED! Royal Sister Rakhi Assembled!');
        setTimeout(startLevel4, 1400);
      }
    } else {
      soundFx.playError();
      setToastMsg('Oops! That component belongs in a different step.');
    }
  };

  // ----------------------------------------------------
  // LEVEL 4: Sibling Reflex Setup
  // ----------------------------------------------------
  const startLevel4 = () => {
    setLevel(4);
    setReflexIndex(0);
    setReflexTimer(4);
    soundFx.playLevelUp();
    setToastMsg('React with quick sister reflexes before time runs out!');
  };

  useEffect(() => {
    if (level !== 4) return;

    reflexIntervalRef.current = setInterval(() => {
      setReflexTimer((t) => {
        if (t <= 1) {
          // Missed reflex
          soundFx.playHitObstacle();
          handleReflexChoice(false);
          return 4;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(reflexIntervalRef.current);
  }, [level, reflexIndex]);

  const handleReflexChoice = (isCorrect) => {
    clearInterval(reflexIntervalRef.current);

    if (isCorrect) {
      soundFx.playMatchSuccess();
      setScore((s) => s + 35);
      setToastMsg(REFLEX_PROMPTS[reflexIndex].response);
    } else {
      soundFx.playError();
      setToastMsg('Too slow or brother got away! Quick on the next one!');
    }

    setTimeout(() => {
      if (reflexIndex + 1 < REFLEX_PROMPTS.length) {
        setReflexIndex((prev) => prev + 1);
        setReflexTimer(4);
      } else {
        soundFx.playLevelUp();
        setToastMsg('⚡ LEVEL 4 CLEARED! Sibling Reflex Master!');
        setTimeout(startLevel5, 1400);
      }
    }, 1200);
  };

  // ----------------------------------------------------
  // LEVEL 5: Heart Rescue Setup
  // ----------------------------------------------------
  const startLevel5 = () => {
    setLevel(5);
    setHeartPos({ x: 15, y: 50 });
    soundFx.playLevelUp();
    setToastMsg('Guide the sacred Lost Heart to the Golden Altar on the right! Avoid storm clouds!');
  };

  // Move clouds & collision
  useEffect(() => {
    if (level !== 5) return;

    mazeLoopRef.current = setInterval(() => {
      setClouds((prev) =>
        prev.map((c) => {
          let ny = c.y + c.dy;
          let ndy = c.dy;
          if (ny <= 15 || ny >= 80) ndy = -c.dy;
          return { ...c, y: ny, dy: ndy };
        })
      );
    }, 40);

    return () => clearInterval(mazeLoopRef.current);
  }, [level]);

  const moveHeart = (dx, dy) => {
    soundFx.playClick();
    const nx = Math.max(10, Math.min(90, heartPos.x + dx));
    const ny = Math.max(15, Math.min(85, heartPos.y + dy));

    // Collision with storm clouds
    const hitCloud = clouds.some(
      (c) => Math.hypot(c.x - nx, c.y - ny) < 14
    );

    if (hitCloud) {
      soundFx.playHitObstacle();
      setToastMsg('⚡ Storm cloud collision! Resetting heart position...');
      setHeartPos({ x: 15, y: 50 });
      return;
    }

    setHeartPos({ x: nx, y: ny });

    // Reach Golden Altar (x >= 82)
    if (nx >= 82) {
      soundFx.playLevelUp();
      setScore((s) => s + 50);
      setToastMsg('💖 LEVEL 5 CLEARED! Heart Delivered to the Altar!');
      setTimeout(startLevel6, 1400);
    }
  };

  // ----------------------------------------------------
  // LEVEL 6: Sacred Rakhi Oath Setup
  // ----------------------------------------------------
  const startLevel6 = () => {
    setLevel(6);
    setOathStepsCompleted({ diya: false, tilak: false, knot: false, sweet: false });
    soundFx.playLevelUp();
    setToastMsg('Complete the 4 sacred Rakhi steps to activate the grand blessing!');
  };

  const handleOathStep = (stepKey) => {
    soundFx.playMascot('chiti');
    const updated = { ...oathStepsCompleted, [stepKey]: true };
    setOathStepsCompleted(updated);
    setScore((s) => s + 25);

    if (updated.diya && updated.tilak && updated.knot && updated.sweet) {
      // Grand finale victory!
      soundFx.playGameWin();
      setLevel(7);

      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#ff3366', '#ff758c', '#ffd166', '#ffffff']
      });

      if (onComplete) {
        onComplete(score + 100);
      }
    }
  };

  const exitGame = () => {
    soundFx.playClick();
    setLevel(0);
  };

  return (
    <>
      <div className="chiti-game-card">
        <div className="game-intro-view">
          <div className="game-badge-chip">
            <Heart size={16} className="text-pink-400" />
            <span>Interactive Quest</span>
          </div>

          <h3 className="game-main-title">Chiti's Rakhi Quest ❤️</h3>
          <p className="game-intro-desc">
            Recover the sacred Lost Rakhi Heart across 6 fun sibling stages to earn the <strong>Sister of the Millennium Trophy</strong>!
          </p>

          <button
            id="btn-start-chiti-quest"
            type="button"
            className="btn-game-primary"
            onClick={startQuest}
          >
            <Sparkles size={20} />
            <span>{score > 0 ? 'Replay Chiti\'s Quest ✨' : 'Play Chiti\'s Quest Now ✨'}</span>
          </button>
        </div>
      </div>

      {/* Full-Screen Immersive Game Modal Overlay */}
      {level >= 1 &&
        createPortal(
          <div className="modal-backdrop" onClick={exitGame}>
            <div className="game-modal-card animate-pop" onClick={(e) => e.stopPropagation()}>
              <button className="btn-modal-x" onClick={exitGame} aria-label="Close quest">
                <X size={20} />
              </button>

              {/* HUD Bar (Visible during active gameplay levels 1-6) */}
              {level >= 1 && level <= 6 && (
                <div className="game-progress-bar-row">
                  <span className="stage-indicator">Level {level} of 6: {getLevelTitle(level)}</span>
                  <div className="game-score-pill">
                    <Trophy size={14} className="trophy-icon" />
                    <span>Score: <strong>{score}</strong></span>
                  </div>
                </div>
              )}

              {/* Toast Notification */}
              {toastMsg && (
                <div className="reaction-bubble animate-pop">
                  <Sparkles size={16} className="reaction-sparkle" />
                  <p>{toastMsg}</p>
                </div>
              )}

              {/* ----------------------------------------------------
                  LEVEL 1: HEART COLLECTOR
                 ---------------------------------------------------- */}
              {level === 1 && (
                <div className="l1-collector-stage">
                  <div className="l1-stats-row">
                    <div className="hud-pill timer-pill">
                      <Timer size={14} />
                      <span>Time: <strong>{l1Time}s</strong></span>
                    </div>
                    <div className="hud-pill">
                      <span>Collected: <strong>{l1Collected}/8 Hearts</strong></span>
                    </div>
                  </div>

                  <div className="l1-interactive-field">
                    {l1Hearts.map((h) => (
                      <button
                        key={h.id}
                        className="l1-floating-heart animate-pop"
                        style={{ left: `${h.x}%`, top: `${h.y}%` }}
                        onClick={() => handleL1Tap(h)}
                      >
                        {h.isThorn ? '⛈️' : '💖'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  LEVEL 2: SIBLING MEMORY ROOM
                 ---------------------------------------------------- */}
              {level === 2 && (
                <div className="l2-memory-stage">
                  <div className="memory-grid">
                    {cards.map((card) => {
                      const isFlipped = flippedCards.some((c) => c.uniqueId === card.uniqueId) || matchedCards.includes(card.id);
                      return (
                        <button
                          key={card.uniqueId}
                          className={`memory-card ${isFlipped ? 'is-revealed' : ''}`}
                          onClick={() => handleCardClick(card)}
                        >
                          <span className="memory-card-front">{isFlipped ? card.icon : '❓'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  LEVEL 3: RAKHI CRAFT CHALLENGE
                 ---------------------------------------------------- */}
              {level === 3 && (
                <div className="l3-craft-stage">
                  <div className="craft-station-display">
                    <span className="craft-label">Rakhi Loom Workbench:</span>
                    <div className="craft-slots-row">
                      {CRAFT_SEQUENCE.map((key, i) => (
                        <div key={key} className={`craft-slot ${craftedParts.length > i ? 'is-filled' : ''}`}>
                          {craftedParts.length > i ? (
                            <span>
                              {key === 'silk_thread' && '🧵'}
                              {key === 'blossom_gem' && '🌸'}
                              {key === 'golden_bead' && '✨'}
                              {key === 'sister_charm' && '💖'}
                              {key === 'ribbon' && '🎀'}
                            </span>
                          ) : (
                            <span className="slot-empty-num">{i + 1}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="craft-parts-palette">
                    <button className="btn-craft-part" onClick={() => handleCraftPart('blossom_gem')}>
                      <span>🌸 Blossom Gem</span>
                    </button>
                    <button className="btn-craft-part" onClick={() => handleCraftPart('silk_thread')}>
                      <span>🧵 Silk Thread</span>
                    </button>
                    <button className="btn-craft-part" onClick={() => handleCraftPart('ribbon')}>
                      <span>🎀 Ribbon</span>
                    </button>
                    <button className="btn-craft-part" onClick={() => handleCraftPart('sister_charm')}>
                      <span>💖 Sister Charm</span>
                    </button>
                    <button className="btn-craft-part" onClick={() => handleCraftPart('golden_bead')}>
                      <span>✨ Golden Bead</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  LEVEL 4: SIBLING REFLEX CHALLENGE
                 ---------------------------------------------------- */}
              {level === 4 && (
                <div className="l4-reflex-stage animate-pop">
                  <div className="reflex-timer-bar">
                    <div className="reflex-timer-fill" style={{ width: `${(reflexTimer / 4) * 100}%` }} />
                  </div>

                  <div className="reflex-scenario-card">
                    <span className="reflex-scenario-icon">⚡</span>
                    <h4 className="reflex-scenario-title">{REFLEX_PROMPTS[reflexIndex].situation}</h4>
                    <span className="reflex-timer-badge">React in: {reflexTimer}s!</span>
                  </div>

                  <div className="reflex-choices-grid">
                    <button
                      className="btn-reflex-action primary"
                      onClick={() => handleReflexChoice(true)}
                    >
                      {REFLEX_PROMPTS[reflexIndex].correctBtn}
                    </button>
                    <button
                      className="btn-reflex-action secondary"
                      onClick={() => handleReflexChoice(false)}
                    >
                      {REFLEX_PROMPTS[reflexIndex].wrongBtn}
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  LEVEL 5: HEART RESCUE (STORM MAZE)
                 ---------------------------------------------------- */}
              {level === 5 && (
                <div className="l5-rescue-stage">
                  <div className="rescue-arena">
                    {/* The Heart */}
                    <div className="rescue-heart-player" style={{ left: `${heartPos.x}%`, top: `${heartPos.y}%` }}>
                      <span>💖</span>
                    </div>

                    {/* Storm Clouds */}
                    {clouds.map((c) => (
                      <div key={c.id} className="rescue-cloud" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
                        <span>⛈️</span>
                      </div>
                    ))}

                    {/* Golden Altar Goal */}
                    <div className="rescue-altar-goal">
                      <span>🏛️✨</span>
                      <span className="altar-label">Altar</span>
                    </div>
                  </div>

                  {/* Touch D-Pad */}
                  <div className="maze-dpad-controls">
                    <button className="dpad-btn" onClick={() => moveHeart(0, -12)}>⬆️</button>
                    <div className="dpad-mid-row">
                      <button className="dpad-btn" onClick={() => moveHeart(-12, 0)}>⬅️</button>
                      <div className="dpad-center-hub">💖</div>
                      <button className="dpad-btn" onClick={() => moveHeart(12, 0)}>➡️</button>
                    </div>
                    <button className="dpad-btn" onClick={() => moveHeart(0, 12)}>⬇️</button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  LEVEL 6: SACRED RAKHI OATH RITUAL
                 ---------------------------------------------------- */}
              {level === 6 && (
                <div className="l6-oath-stage animate-pop">
                  <h4 className="oath-title">The Sacred Rakhi Blessing Altar 🪔</h4>
                  <p className="oath-subtitle">Tap each sacred element in order to complete the ceremony!</p>

                  <div className="oath-altar-grid">
                    <button
                      className={`oath-ritual-card ${oathStepsCompleted.diya ? 'is-complete' : ''}`}
                      onClick={() => handleOathStep('diya')}
                    >
                      <span className="oath-emoji">🪔</span>
                      <span className="oath-text">Light Sacred Diya</span>
                      {oathStepsCompleted.diya && <CheckCircle2 size={16} className="text-green-400" />}
                    </button>

                    <button
                      className={`oath-ritual-card ${oathStepsCompleted.tilak ? 'is-complete' : ''}`}
                      onClick={() => handleOathStep('tilak')}
                      disabled={!oathStepsCompleted.diya}
                    >
                      <span className="oath-emoji">✨</span>
                      <span className="oath-text">Apply Roli Tilak</span>
                      {oathStepsCompleted.tilak && <CheckCircle2 size={16} className="text-green-400" />}
                    </button>

                    <button
                      className={`oath-ritual-card ${oathStepsCompleted.knot ? 'is-complete' : ''}`}
                      onClick={() => handleOathStep('knot')}
                      disabled={!oathStepsCompleted.tilak}
                    >
                      <span className="oath-emoji">🎀</span>
                      <span className="oath-text">Tie Golden Knot</span>
                      {oathStepsCompleted.knot && <CheckCircle2 size={16} className="text-green-400" />}
                    </button>

                    <button
                      className={`oath-ritual-card ${oathStepsCompleted.sweet ? 'is-complete' : ''}`}
                      onClick={() => handleOathStep('sweet')}
                      disabled={!oathStepsCompleted.knot}
                    >
                      <span className="oath-emoji">🍬</span>
                      <span className="oath-text">Offer Sweet Treat</span>
                      {oathStepsCompleted.sweet && <CheckCircle2 size={16} className="text-green-400" />}
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  LEVEL 7: GRAND VICTORY & TROPHY
                 ---------------------------------------------------- */}
              {level === 7 && (
                <div className="game-completed-view animate-pop">
                  <div className="trophy-stage">
                    <Trophy size={68} className="trophy-gold animate-bounce" />
                    <div className="trophy-aura" />
                  </div>

                  <h3 className="completed-title">CHITI — RAKHI QUEST COMPLETE! 💖🏆</h3>
                  <p className="completed-subtitle">
                    All 6 realms conquered with a stellar score of <strong>{score} pts</strong>! Certified <strong>Sister of the Millennium</strong>!
                  </p>

                  <div className="unlock-banner">
                    <CheckCircle2 size={22} className="unlock-icon" />
                    <div>
                      <strong>The Secret Rakhi Seal is Ready to Break!</strong>
                      <p>Proceed below to unseal your handwritten letter and unwrap the Rakhi 2026 gift box ✨</p>
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

function getLevelTitle(lvl) {
  switch (lvl) {
    case 1: return 'Heart Collector 💖';
    case 2: return 'Sibling Memory Room 🧠';
    case 3: return 'Rakhi Craft Challenge 🧵';
    case 4: return 'Sibling Reflex Showdown ⚡';
    case 5: return 'Heart Rescue Maze 🛡️';
    case 6: return 'Sacred Oath Ritual 🪔';
    default: return '';
  }
}
