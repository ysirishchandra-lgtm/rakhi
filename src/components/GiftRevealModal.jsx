import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Gift, Sparkles, Heart, X, CheckCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../services/soundEffects';

export default function GiftRevealModal({ recipient, onClose }) {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenGift = () => {
    soundFx.playUnboxShimmer();
    setIsOpened(true);

    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.55 },
      colors: recipient.particles?.colors || ['#ffd166', '#ff3366', '#38bdf8', '#ffffff']
    });
  };

  const modalContent = (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="gift-modal-card animate-pop" onClick={(e) => e.stopPropagation()}>
        <button className="btn-modal-x" onClick={onClose} aria-label="Close gift reveal">
          <X size={20} />
        </button>

        {!isOpened ? (
          /* Unopened Gift State */
          <div className="gift-unopened-stage">
            <div className="gift-box-wrapper animate-bounce" onClick={handleOpenGift}>
              <div className="gift-box-cube">
                <span className="gift-box-emoji">🎁</span>
              </div>
              <div className="gift-box-aura" />
            </div>

            <h3 className="gift-modal-title">Your Rakhi 2026 Gift is Ready!</h3>
            <p className="gift-modal-subtitle">
              You've proven your skills in the mini-game! Tap the glowing gift box to untie the golden ribbon and reveal your surprise.
            </p>

            <button
              id="btn-open-gift-box"
              className="btn-game-primary"
              onClick={handleOpenGift}
            >
              <Sparkles size={18} />
              <span>Untie Ribbon & Unwrap ✨</span>
            </button>
          </div>
        ) : (
          /* Revealed Gift State */
          <div className="gift-opened-stage animate-pop">
            <div className="rakhi-band-display">
              <div className="rakhi-thread-line" />
              <div className="rakhi-center-emblem">
                <span className="rakhi-mascot-charm">{recipient.emoji}</span>
                <span className="rakhi-year-tag">2026</span>
              </div>
              <div className="rakhi-thread-line" />
            </div>

            <div className="gift-badge-chip">
              <Sparkles size={14} />
              <span>Official Digital Rakhi 2026 Band</span>
            </div>

            <h3 className="gift-revealed-title">
              Happy Raksha Bandhan, {recipient.nickname}! 🎀
            </h3>

            <div className="gift-message-scroll">
              <p className="gift-blessing-text">
                {recipient.giftTeaser?.revealMessage || recipient.welcomeQuote}
              </p>
              <p className="gift-sign-off">
                — With love, blessings & lifelong friendship ✨
              </p>
            </div>

            <button className="btn-game-secondary" onClick={onClose}>
              <CheckCircle size={16} />
              <span>Cherish This Memory 💖</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
