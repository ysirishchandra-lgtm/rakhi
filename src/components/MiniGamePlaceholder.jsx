import React, { useState } from 'react';
import { Gamepad2, Lock, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { soundFx } from '../services/soundEffects';

export default function MiniGamePlaceholder({ recipient }) {
  const [showTeaserModal, setShowTeaserModal] = useState(false);
  const game = recipient.gamePlaceholder;

  const handlePreviewClick = () => {
    soundFx.playClick();
    setShowTeaserModal(true);
  };

  return (
    <div id={`game-placeholder-${recipient.id}`} className="game-placeholder-card">
      <div className="game-placeholder-glow" />

      <div className="game-header-bar">
        <div className="game-badge">
          <Gamepad2 size={16} />
          <span>{game.badge}</span>
        </div>
        <div className="game-lock-status">
          <Lock size={14} />
          <span>Reserved for Phase 2</span>
        </div>
      </div>

      <div className="game-body">
        <h3 className="game-title">{game.title}</h3>
        <p className="game-tagline">{game.tagline}</p>
        <p className="game-teaser-desc">{game.teaser}</p>

        {/* Preview Features List */}
        <div className="game-features-grid">
          {game.previewItems?.map((item, idx) => (
            <div key={idx} className="game-feature-chip">
              <CheckCircle2 size={14} className="feature-check" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Action button */}
        <button
          id={`btn-game-preview-${recipient.id}`}
          className="btn-game-teaser"
          onClick={handlePreviewClick}
        >
          <Sparkles size={16} />
          <span>Peek at Game Blueprints</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Modal Teaser Info */}
      {showTeaserModal && (
        <div className="modal-backdrop" onClick={() => setShowTeaserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-emoji">{recipient.emoji}</span>
              <h4>{game.title}</h4>
            </div>
            <p className="modal-desc">
              🎮 <strong>Architecture Ready!</strong> This dedicated mini-game container has been cleanly isolated for <strong>{recipient.name} ({recipient.nickname})</strong>.
            </p>
            <div className="modal-callout">
              <p>✨ In the next step, this placeholder will be upgraded with full interactive gameplay, audio cues, scoring, and personalized easter eggs!</p>
            </div>
            <button className="btn-modal-close" onClick={() => setShowTeaserModal(false)}>
              Got it, excited! ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
