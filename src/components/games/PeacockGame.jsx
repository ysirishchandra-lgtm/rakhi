import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Crown, Sparkles, Trophy, Play, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CheckCircle2, Diamond, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../services/soundEffects';

// 5 Chamber Maps:
// 0: Open, 1: Crystal Wall, 'F': Feather, 'J': Jewel, 'S': Switch, 'E': Exit Portal
const CHAMBER_1 = [
  [0, 0, 'F', 1, 'J'],
  [1, 0, 1, 0, 0],
  ['F', 0, 'E', 0, 1],
  [0, 1, 0, 1, 0],
  ['J', 0, 0, 0, 0]
];

const CHAMBER_2 = [
  [0, 'S', 1, 'F', 0],
  [0, 1, 1, 0, 'J'],
  [0, 0, 0, 1, 'E'],
  [1, 1, 0, 0, 0],
  ['J', 0, 'F', 1, 0]
];

const CHAMBER_3 = [
  [0, 0, 1, 'J', 'F'],
  [1, 0, 0, 0, 1],
  ['F', 1, 'E', 0, 0],
  [0, 0, 1, 1, 0],
  ['J', 0, 0, 'F', 0]
];

const CHAMBER_4 = [
  [0, 'F', 1, 'F', 0],
  [0, 1, 0, 1, 'J'],
  ['F', 0, 'E', 0, 'F'],
  [1, 0, 1, 0, 1],
  ['J', 0, 'F', 0, 0]
];

const CHAMBER_5 = [
  [0, 0, 'J', 1, 0, 'F', 0],
  [0, 1, 0, 0, 0, 1, 0],
  ['J', 0, 1, 1, 0, 0, 'J'],
  [1, 0, 0, 'E', 0, 1, 1],
  ['F', 1, 0, 1, 0, 0, 'F'],
  [0, 0, 0, 0, 1, 0, 0],
  ['J', 0, 'F', 0, 0, 'F', 0]
];

export default function PeacockGame({ recipient, onComplete }) {
  // Chamber Levels: 0: Intro, 1: Emerald Garden, 2: Crystal Hall, 3: Mirror Chamber, 4: Feather Temple, 5: Royal Vault, 6: Victory
  const [chamber, setChamber] = useState(0);
  const [playerPos, setPlayerPos] = useState({ r: 0, c: 0 });
  const [score, setScore] = useState(0);
  const [feathers, setFeathers] = useState(0);
  const [jewels, setJewels] = useState(0);
  const [collectedInChamber, setCollectedInChamber] = useState(new Set());
  const [steps, setSteps] = useState(0);
  const [switchActive, setSwitchActive] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const currentMap =
    chamber === 1
      ? CHAMBER_1
      : chamber === 2
      ? CHAMBER_2
      : chamber === 3
      ? CHAMBER_3
      : chamber === 4
      ? CHAMBER_4
      : chamber === 5
      ? CHAMBER_5
      : CHAMBER_1;

  const startLabyrinth = () => {
    soundFx.playClick();
    setScore(0);
    setFeathers(0);
    setJewels(0);
    setSteps(0);
    startChamber1();
  };

  const exitGame = () => {
    soundFx.playClick();
    setChamber(0);
  };

  const startChamber1 = () => {
    setChamber(1);
    setPlayerPos({ r: 0, c: 0 });
    setCollectedInChamber(new Set());
    setToastMsg('Chamber 1: Emerald Garden. Collect 🪶 Plumes & navigate to the Crown Vault 👑!');
    soundFx.playLevelUp();
  };

  const startChamber2 = () => {
    setChamber(2);
    setPlayerPos({ r: 0, c: 0 });
    setCollectedInChamber(new Set());
    setSwitchActive(false);
    setToastMsg('Chamber 2: Crystal Hall. Step on the Switch 🔘 to unlock the Exit!');
    soundFx.playLevelUp();
  };

  const startChamber3 = () => {
    setChamber(3);
    setPlayerPos({ r: 0, c: 0 });
    setCollectedInChamber(new Set());
    setToastMsg('Chamber 3: Mirror Chamber. Gather sparkling Jewels 💎 for bonus score!');
    soundFx.playLevelUp();
  };

  const startChamber4 = () => {
    setChamber(4);
    setPlayerPos({ r: 0, c: 0 });
    setCollectedInChamber(new Set());
    setToastMsg('Chamber 4: Feather Temple. Labyrinth paths are narrower!');
    soundFx.playLevelUp();
  };

  const startChamber5 = () => {
    setChamber(5);
    setPlayerPos({ r: 0, c: 0 });
    setCollectedInChamber(new Set());
    setToastMsg('👑 CHAMBER 5: ROYAL VAULT! 7x7 grand maze to uncover the Royal Crown!');
    soundFx.playBossAlert();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (chamber < 1 || chamber > 5) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') move(0, -1);
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') move(0, 1);
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') move(-1, 0);
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') move(1, 0);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chamber, playerPos, collectedInChamber, switchActive]);

  const move = (dx, dy) => {
    const nextR = playerPos.r + dy;
    const nextC = playerPos.c + dx;

    const rows = currentMap.length;
    const cols = currentMap[0].length;

    if (nextR < 0 || nextR >= rows || nextC < 0 || nextC >= cols) return;

    const targetCell = currentMap[nextR][nextC];

    // Wall collision
    if (targetCell === 1) {
      soundFx.playNegative();
      return;
    }

    // Switch requirement for chamber 2
    if (chamber === 2 && targetCell === 'E' && !switchActive) {
      soundFx.playNegative();
      setToastMsg('🔒 Crown Vault locked! Step on the switch 🔘 first!');
      return;
    }

    soundFx.playStep();
    setSteps((s) => s + 1);
    setPlayerPos({ r: nextR, c: nextC });

    const cellKey = `${nextR}-${nextC}`;
    if (!collectedInChamber.has(cellKey)) {
      if (targetCell === 'F') {
        soundFx.playCatch();
        setFeathers((f) => f + 1);
        setScore((s) => s + 25);
        setCollectedInChamber((prev) => new Set([...prev, cellKey]));
        setToastMsg('🪶 Sacred Plume Collected! +25 pts');
      } else if (targetCell === 'J') {
        soundFx.playGoldenCatch();
        setJewels((j) => j + 1);
        setScore((s) => s + 50);
        setCollectedInChamber((prev) => new Set([...prev, cellKey]));
        setToastMsg('💎 Crystal Jewel Discovered! +50 pts');
      } else if (targetCell === 'S') {
        soundFx.playLevelUp();
        setSwitchActive(true);
        setCollectedInChamber((prev) => new Set([...prev, cellKey]));
        setToastMsg('🔘 Crystal Switch Activated! Exit Unlocked!');
      }
    }

    // Exit portal reach
    if (targetCell === 'E') {
      soundFx.playLevelUp();
      if (chamber === 1) startChamber2();
      else if (chamber === 2) startChamber3();
      else if (chamber === 3) startChamber4();
      else if (chamber === 4) startChamber5();
      else if (chamber === 5) triggerVictory();
    }
  };

  const triggerVictory = () => {
    setChamber(6);
    soundFx.playGameWin();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#10b981', '#38bdf8', '#ffd166', '#ffffff']
    });
    if (onComplete) {
      onComplete(score + 250);
    }
  };

  return (
    <>
      <div className="peacock-game-card">
        <div className="game-intro-view">
          <div className="game-badge-chip peacock-badge">
            <Crown size={16} />
            <span>Mystery Labyrinth</span>
          </div>

          <h3 className="game-main-title">Royal Feather Labyrinth 🦚✨</h3>
          <p className="game-intro-desc">
            Explore 5 celestial chambers, gather sacred peacock plumes, and unseal the Imperial Crown Vault to win the <strong>Royal Trophy</strong>!
          </p>

          <button
            id="btn-start-peacock-quest"
            type="button"
            className="btn-game-primary peacock-theme-btn"
            onClick={startLabyrinth}
          >
            <Sparkles size={20} />
            <span>{score > 0 ? 'Replay Labyrinth 🦚' : 'Enter the Labyrinth 🦚'}</span>
          </button>
        </div>
      </div>

      {/* Full-Screen Immersive Game Modal Overlay */}
      {chamber >= 1 &&
        createPortal(
          <div className="modal-backdrop" onClick={exitGame}>
            <div className="game-modal-card animate-pop" onClick={(e) => e.stopPropagation()}>
              <button className="btn-modal-x" onClick={exitGame} aria-label="Close labyrinth">
                <X size={20} />
              </button>

              {/* HUD (Chambers 1-5) */}
              {chamber >= 1 && chamber <= 5 && (
                <div className="maze-hud">
                  <div className="hud-pill feather-pill">
                    <span>🪶 Plumes: <strong>{feathers}</strong></span>
                  </div>

                  <div className="hud-pill jewel-pill">
                    <Diamond size={14} />
                    <span>Jewels: <strong>{jewels}</strong></span>
                  </div>

                  <div className="hud-pill stage-pill">
                    <span>Chamber {chamber}/5: {getChamberTitle(chamber)}</span>
                  </div>

                  <div className="hud-pill steps-pill">
                    <span>Steps: <strong>{steps}</strong></span>
                  </div>
                </div>
              )}

              {/* Toast */}
              {toastMsg && (
                <div className="maze-toast-bubble animate-pop">
                  <span>{toastMsg}</span>
                </div>
              )}

              {/* ----------------------------------------------------
                  CHAMBERS 1 - 5: ACTIVE MAZE GRID
                 ---------------------------------------------------- */}
              {chamber >= 1 && chamber <= 5 && (
                <div className="peacock-maze-stage">
                  <div className="maze-grid-container" style={{ maxWidth: chamber === 5 ? '360px' : '300px' }}>
                    {currentMap.map((row, r) => (
                      <div key={r} className="maze-grid-row">
                        {row.map((cell, c) => {
                          const isPlayerHere = playerPos.r === r && playerPos.c === c;
                          const isWall = cell === 1;
                          const isExit = cell === 'E';
                          const cellKey = `${r}-${c}`;
                          const isCollected = collectedInChamber.has(cellKey);

                          return (
                            <div
                              key={c}
                              className={`maze-cell ${isWall ? 'cell-wall' : 'cell-path'} ${isExit ? 'cell-exit' : ''} ${isPlayerHere ? 'cell-player' : ''}`}
                            >
                              {isWall && <span className="wall-crystal">💎</span>}

                              {!isWall && !isCollected && cell === 'F' && (
                                <span className="maze-item feather-item animate-pulse">🪶</span>
                              )}
                              {!isWall && !isCollected && cell === 'J' && (
                                <span className="maze-item jewel-item animate-pulse">💎</span>
                              )}
                              {!isWall && !isCollected && cell === 'S' && (
                                <span className="maze-item switch-item animate-bounce">🔘</span>
                              )}
                              {isExit && (
                                <span className="maze-vault vault-glowing animate-bounce">
                                  👑
                                </span>
                              )}

                              {isPlayerHere && (
                                <div className="player-peacock-icon animate-pop">
                                  <span>🦚</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Touch D-Pad */}
                  <div className="maze-dpad-controls">
                    <button className="dpad-btn dpad-up" onClick={() => move(0, -1)} aria-label="Up">
                      <ArrowUp size={22} />
                    </button>
                    <div className="dpad-mid-row">
                      <button className="dpad-btn dpad-left" onClick={() => move(-1, 0)} aria-label="Left">
                        <ArrowLeft size={22} />
                      </button>
                      <div className="dpad-center-hub">
                        <Crown size={16} />
                      </div>
                      <button className="dpad-btn dpad-right" onClick={() => move(1, 0)} aria-label="Right">
                        <ArrowRight size={22} />
                      </button>
                    </div>
                    <button className="dpad-btn dpad-down" onClick={() => move(0, 1)} aria-label="Down">
                      <ArrowDown size={22} />
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  CHAMBER 6: GRAND VICTORY SCREEN
                 ---------------------------------------------------- */}
              {chamber === 6 && (
                <div className="game-completed-view animate-pop">
                  <div className="trophy-stage">
                    <Crown size={68} className="crown-gold animate-bounce" />
                    <div className="trophy-aura peacock-aura" />
                  </div>

                  <h3 className="completed-title">ROYAL PEACOCK CHAMPION! 🦚👑</h3>
                  <p className="completed-subtitle">
                    All 5 celestial chambers deciphered in <strong>{steps} steps</strong>! Final Score: <strong>{score} pts</strong>!
                  </p>

                  <div className="unlock-banner peacock-unlock">
                    <CheckCircle2 size={22} className="unlock-icon" />
                    <div>
                      <strong>The Secret Rakhi Seal is Ready to Break!</strong>
                      <p>Proceed below to read your royal letter and unwrap the White Peacock Rakhi 2026 gift box 🎁</p>
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

function getChamberTitle(ch) {
  switch (ch) {
    case 1: return 'Emerald Garden 🪶';
    case 2: return 'Crystal Hall 💎';
    case 3: return 'Mirror Chamber 🪞';
    case 4: return 'Feather Temple ✨';
    case 5: return 'Grand Vault 👑';
    default: return '';
  }
}
