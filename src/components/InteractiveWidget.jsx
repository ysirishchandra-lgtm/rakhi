import React, { useState } from 'react';
import { Sparkles, Heart, Waves, PawPrint, Crown, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../services/soundEffects';

export default function InteractiveWidget({ recipient, onComplete, isCompleted }) {
  const [count, setCount] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [activeEffects, setActiveEffects] = useState([]);
  const widget = recipient.interactiveWidget;

  const handleAction = (e) => {
    soundFx.playMascot(recipient.id);
    const newCount = count + 1;
    setCount(newCount);

    if (widget?.quotes?.length) {
      setQuoteIndex((prev) => (prev + 1) % widget.quotes.length);
    }

    if (onComplete) {
      onComplete();
    }

    // Spawn floating spawned emoji particles
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    const newEffect = {
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 100,
      y: y - 30,
      symbol: getRandomSymbol(recipient.id)
    };

    setActiveEffects((prev) => [...prev.slice(-10), newEffect]);

    setTimeout(() => {
      setActiveEffects((prev) => prev.filter((eff) => eff.id !== newEffect.id));
    }, 1200);
  };

  const getRandomSymbol = (id) => {
    if (id === 'chiti') {
      const symbols = ['💖', '🌸', '✨', '🎀', '🌟', '🍫', '💕'];
      return symbols[Math.floor(Math.random() * symbols.length)];
    }
    if (id === 'duck') {
      const symbols = ['🦆', '💦', '🐤', '🪶', '🫧', '🌊', '⭐'];
      return symbols[Math.floor(Math.random() * symbols.length)];
    }
    if (id === 'cat') {
      const symbols = ['🐾', '🐱', '🧶', '🐟', '✨', '💖', '⭐'];
      return symbols[Math.floor(Math.random() * symbols.length)];
    }
    if (id === 'peacock') {
      const symbols = ['🪶', '🦚', '💎', '✨', '👑', '🌟', '💫'];
      return symbols[Math.floor(Math.random() * symbols.length)];
    }
    return '✨';
  };

  const getWidgetIcon = (id) => {
    switch (id) {
      case 'chiti':
        return <Heart className="widget-icon" />;
      case 'duck':
        return <Waves className="widget-icon" />;
      case 'cat':
        return <PawPrint className="widget-icon" />;
      case 'peacock':
        return <Crown className="widget-icon" />;
      default:
        return <Sparkles className="widget-icon" />;
    }
  };

  return (
    <div className={`interactive-widget-card widget-${recipient.id} animate-pop`}>
      {/* Floating spawned icons on action */}
      {activeEffects.map((eff) => (
        <span
          key={eff.id}
          className="floating-effect-pop"
          style={{
            position: 'fixed',
            left: `${eff.x}px`,
            top: `${eff.y}px`,
            zIndex: 9999
          }}
        >
          {eff.symbol}
        </span>
      ))}

      <div className="widget-header">
        <div className="widget-title-group">
          {getWidgetIcon(recipient.id)}
          <h3 className="widget-title">{widget.title}</h3>
        </div>
        <span className="widget-stat-pill">
          {widget.statLabel} <strong>{count}</strong>
        </span>
      </div>

      {/* Quote Display */}
      {widget.quotes && widget.quotes.length > 0 && (
        <div className="widget-quote-box">
          <p className="widget-quote-text">{widget.quotes[quoteIndex]}</p>
        </div>
      )}

      {/* Big Enticing Action Button */}
      <button
        id={`btn-widget-${recipient.id}`}
        type="button"
        className="btn-interactive-action"
        onClick={handleAction}
      >
        <Sparkles size={20} />
        <span>{widget.actionLabel}</span>
      </button>
    </div>
  );
}
