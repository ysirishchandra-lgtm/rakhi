import React, { useState } from 'react';
import { Gift, Sparkles, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { soundFx } from '../services/soundEffects';
import GiftRevealModal from './GiftRevealModal';

export default function GiftTeaserCard({ recipient, isUnlocked }) {
  const [showClue, setShowClue] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const gift = recipient.giftTeaser;

  const toggleClue = () => {
    soundFx.playClick();
    setShowClue(!showClue);
  };

  const handleOpenGiftModal = () => {
    soundFx.playClick();
    setShowModal(true);
  };

  return (
    <div className={`gift-teaser-card ${!isUnlocked ? 'is-locked-card' : 'is-unlocked-card'}`}>
      <div className="gift-banner">
        <Gift className="gift-icon" size={28} />
        <div className="gift-info">
          <div className="gift-badge-line">
            <span className="gift-badge">{gift.badge}</span>
            <span className="gift-status">
              {!isUnlocked ? '🔒 Locked for Grand Reveal' : '✨ Unlocked & Ready!'}
            </span>
          </div>
          <h3 className="gift-title">{gift.title}</h3>
        </div>
      </div>

      <p className="gift-description">{gift.description}</p>

      {/* When Unlocked: Action Button to Reveal Grand Gift */}
      {isUnlocked && (
        <div className="gift-unlocked-action-box animate-pop">
          <div className="unlocked-glow-ribbon">
            <Sparkles size={16} />
            <span>Challenge Complete! Golden Seal Broken!</span>
          </div>
          <button
            id={`btn-open-gift-reveal-${recipient.id}`}
            className="btn-open-grand-gift"
            onClick={handleOpenGiftModal}
          >
            <Gift size={20} className="animate-bounce" />
            <span>Unwrap Rakhi 2026 Gift Box ✨</span>
          </button>
        </div>
      )}

      {/* Clue Revealer */}
      <div className="gift-clue-container">
        <button
          id={`btn-gift-clue-${recipient.id}`}
          className="btn-toggle-clue"
          onClick={toggleClue}
        >
          {showClue ? <EyeOff size={16} /> : <Eye size={16} />}
          <span>{showClue ? 'Hide Mystery Clue' : 'Peek at Mystery Clue ✨'}</span>
        </button>

        {showClue && (
          <div className="gift-clue-bubble animate-pop">
            <Sparkles size={16} className="clue-sparkle" />
            <p>{gift.mysteryClue}</p>
          </div>
        )}
      </div>

      {/* Grand Finale Modal */}
      {showModal && (
        <GiftRevealModal
          recipient={recipient}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
