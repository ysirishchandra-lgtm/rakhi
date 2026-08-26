import React, { useState } from 'react';
import { Mail, MailOpen, Lock, Sparkles, Heart, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../services/soundEffects';

export default function LetterCard({ recipient, isUnlocked }) {
  const [isOpen, setIsOpen] = useState(false);
  const letter = recipient.letterPreview;

  const toggleLetter = () => {
    if (!isUnlocked) {
      soundFx.playError();
      return;
    }
    soundFx.playClick();
    setIsOpen(!isOpen);
  };

  return (
    <div className={`letter-card ${isOpen ? 'is-open' : 'is-sealed'} ${!isUnlocked ? 'is-locked-card' : 'is-unlocked-card'}`}>
      <div className="letter-header-row" onClick={toggleLetter}>
        <div className="letter-title-wrapper">
          {isOpen ? (
            <MailOpen className="mail-icon" />
          ) : !isUnlocked ? (
            <Lock className="mail-icon opacity-60" />
          ) : (
            <Mail className="mail-icon" />
          )}
          <div>
            <h3 className="letter-title">{letter.title}</h3>
            <span className="letter-tag">{letter.tag}</span>
          </div>
        </div>

        <button
          id={`btn-letter-toggle-${recipient.id}`}
          className={`btn-letter-toggle ${!isUnlocked ? 'btn-locked-state' : ''}`}
          aria-label={isOpen ? 'Fold letter' : 'Open letter'}
          onClick={(e) => {
            e.stopPropagation();
            toggleLetter();
          }}
        >
          {!isUnlocked ? (
            <>
              <Lock size={13} />
              <span>Complete Game to Unlock</span>
            </>
          ) : isOpen ? (
            'Fold Note'
          ) : (
            <>
              <Sparkles size={13} />
              <span>Read Note ✨</span>
            </>
          )}
        </button>
      </div>

      {/* Sealed notice when locked */}
      {!isUnlocked && (
        <div className="locked-card-notice">
          <p>🔒 <em>This handwritten message is sealed with golden wax. Win the challenge above to break the seal!</em></p>
        </div>
      )}

      {/* Unfolded Letter Content */}
      {isUnlocked && isOpen && (
        <div className="letter-content-body animate-unfold">
          <div className="letter-paper">
            <p className="letter-text">{letter.teaserText}</p>
            <div className="letter-signature-row">
              <span className="letter-signature">{letter.signature}</span>
              <Heart size={18} className="heart-pulse text-pink-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
