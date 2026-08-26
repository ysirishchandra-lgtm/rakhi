import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, LogOut, RotateCcw, Sparkles } from 'lucide-react';
import { soundFx } from '../services/soundEffects';

export default function RecipientHeader({ recipient, onLogout, onResetProgress }) {
  const [muted, setMuted] = useState(soundFx.isMuted());

  useEffect(() => {
    setMuted(soundFx.isMuted());
  }, []);

  const handleToggleAudio = () => {
    const isNowMuted = soundFx.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      soundFx.playClick();
    }
  };

  const handleLogoutClick = () => {
    soundFx.playClick();
    onLogout();
  };

  const handleResetClick = () => {
    soundFx.playClick();
    if (onResetProgress) {
      onResetProgress();
    }
  };

  return (
    <header className="recipient-top-nav">
      <div className="nav-container">
        {/* Recipient Brand & Nickname Badge */}
        <div className="nav-brand-group">
          <span className="nav-mascot-icon">{recipient.emoji}</span>
          <div className="nav-titles">
            <h2 className="nav-name">{recipient.name}</h2>
            <span className="nav-role-badge" style={{ background: recipient.theme.badgeGradient }}>
              {recipient.nickname} • {recipient.relation}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="nav-actions-group">
          {/* Audio Toggle */}
          <button
            id="btn-toggle-audio"
            type="button"
            className={`btn-nav-control ${muted ? 'is-muted' : 'is-active'}`}
            onClick={handleToggleAudio}
            title={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            aria-label={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span className="control-label">{muted ? 'Muted' : 'Audio On'}</span>
          </button>

          {/* Reset Journey Levels */}
          <button
            id="btn-reset-levels"
            type="button"
            className="btn-nav-control"
            onClick={handleResetClick}
            title="Reset this world's levels back to Level 1"
            aria-label="Reset Level Progress"
          >
            <RotateCcw size={16} />
            <span className="control-label">Reset Levels</span>
          </button>

          {/* Switch World / Logout */}
          <button
            id="btn-switch-world"
            type="button"
            className="btn-nav-control btn-switch-portal"
            onClick={handleLogoutClick}
            title="Switch to another persona portal"
            aria-label="Switch World Portal"
          >
            <LogOut size={16} />
            <span className="control-label">Switch World</span>
          </button>
        </div>
      </div>
    </header>
  );
}
