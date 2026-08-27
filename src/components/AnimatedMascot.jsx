import React, { useState, useEffect, useRef } from 'react';
import { soundFx } from '../services/soundEffects';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

export default function AnimatedMascot({ recipient, onInteract }) {
  const [isDancing, setIsDancing] = useState(false);
  const [burstParticles, setBurstParticles] = useState([]);
  const [danceCount, setDanceCount] = useState(0);
  const resetTimerRef = useRef(null);

  const startOrRemixDance = (e) => {
    if (e) e.stopPropagation();

    // Trigger audio rhythm
    soundFx.playCharacterDanceRhythm(recipient.id);

    // Increment dance count for remix effect
    setDanceCount((prev) => prev + 1);
    setIsDancing(true);

    // Spawn character-specific supporting particles
    spawnSupportingParticles(recipient.id);

    if (onInteract) {
      onInteract();
    }

    // Reset after full routine cycle (~5.2s)
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = setTimeout(() => {
      setIsDancing(false);
      setBurstParticles([]);
    }, 5200);
  };

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const spawnSupportingParticles = (id) => {
    let icons = [];
    switch (id) {
      case 'cat':
        icons = ['🐾', '🧶', '✨', '🐾', '💖', '⭐', '🐾', '✨'];
        break;
      case 'duck':
        icons = ['💦', '🫧', '🪶', '💧', '🌊', '🫧', '✨', '💧'];
        break;
      case 'peacock':
        icons = ['🪶', '🦚', '💎', '✨', '👑', '🌟', '🪞', '💫'];
        break;
      case 'chiti':
        icons = ['🧸', '💖', '🍯', '🎀', '🌸', '✨', '💕', '⭐'];
        break;
      case 'hanvika':
        icons = ['🥕', '🐰', '✨', '🌸', '🥕', '⭐', '🎀', '✨'];
        break;
      default:
        icons = ['✨', '⭐', '💖', '🎉'];
    }

    const particles = icons.map((icon, i) => {
      const angle = (i / icons.length) * 2 * Math.PI + (Math.random() * 0.3 - 0.15);
      const dist = 55 + Math.random() * 45;
      return {
        id: Date.now() + i,
        icon,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 15,
        delay: i * 0.09,
        scale: 0.85 + Math.random() * 0.4
      };
    });

    setBurstParticles(particles);
  };

  const getDanceTitle = (id) => {
    switch (id) {
      case 'cat':
        return '🐱 Ashwidha\'s Cat Paw Dance! 🐾';
      case 'duck':
        return '🦆 Grishma\'s Waddle & Splash Dance! 🌊';
      case 'peacock':
        return '🦚 Thanishqa\'s White Peacock Feather Fan Dance! 🪶✨';
      case 'chiti':
        return '🧸 Siri Chaithra\'s Cuddly Teddy Waddle Dance! 💖';
      case 'hanvika':
        return '🐰 Hanvika\'s Bunny Meadow Hop & Carrot Dance! 🥕';
      default:
        return '✨ Character Celebration Dance! 💃';
    }
  };

  return (
    <div
      id={`mascot-${recipient.id}`}
      className={`mascot-character-container mascot-${recipient.id} ${isDancing ? 'is-character-dancing' : 'is-character-idle'}`}
      onClick={startOrRemixDance}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startOrRemixDance(e);
        }
      }}
      role="button"
      tabIndex={0}
      title="Click me to watch me perform an authentic dance routine!"
      aria-label={`Interactive Dancing Mascot: ${recipient.hero?.mascotName || recipient.nickname}`}
    >
      {/* Ambient Halo Aura */}
      <div className={`character-aura-glow ${isDancing ? 'character-aura-dancing' : ''}`} />

      {/* Floating Themed Dance Particles */}
      {isDancing && (
        <div className="character-particles-layer">
          {burstParticles.map((p) => (
            <span
              key={p.id}
              className="dance-burst-particle"
              style={{
                '--tx': `${p.x}px`,
                '--ty': `${p.y}px`,
                '--delay': `${p.delay}s`,
                '--p-scale': p.scale
              }}
            >
              {p.icon}
            </span>
          ))}
        </div>
      )}

      {/* Main Character Stage Box */}
      <div className={`character-stage-frame ${isDancing ? 'dance-stage-active' : ''}`} key={danceCount}>
        {recipient.id === 'cat' && <CatCharacter isDancing={isDancing} />}
        {recipient.id === 'duck' && <DuckCharacter isDancing={isDancing} />}
        {recipient.id === 'peacock' && <WhitePeacockCharacter isDancing={isDancing} />}
        {recipient.id === 'chiti' && <TeddyBearCharacter isDancing={isDancing} />}
        {recipient.id === 'hanvika' && <RabbitCharacter isDancing={isDancing} />}
      </div>

      {/* Character Dance Status Badge */}
      <div className={`character-showcase-badge ${isDancing ? 'badge-dancing-pulse' : ''}`}>
        <span className="badge-mascot-emoji">
          {isDancing ? '💃' : recipient.mascotEmoji}
        </span>
        <span className="badge-mascot-title">
          {isDancing ? getDanceTitle(recipient.id) : (recipient.hero?.mascotName || recipient.nickname)}
        </span>
      </div>

      {/* Interactive Play Dance Action Button */}
      <button
        type="button"
        className={`btn-mascot-dance-trigger ${isDancing ? 'is-dancing-btn' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          startOrRemixDance(e);
        }}
        aria-label={isDancing ? 'Remix Character Dance' : 'Start Character Dance'}
      >
        {isDancing ? (
          <>
            <RotateCcw size={14} className="spin-icon-slow" />
            <span>Remix Dance Moves! 💃</span>
          </>
        ) : (
          <>
            <Play size={14} />
            <span>Tap to Watch Me Dance! ✨</span>
          </>
        )}
      </button>
    </div>
  );
}

/* ==========================================================================
   🐱 1. ASHWIDHA: ORIGINAL ARTICULATED CAT CHARACTER
   ========================================================================== */
function CatCharacter({ isDancing }) {
  return (
    <div className={`mascot-svg-wrapper cat-character-wrapper ${isDancing ? 'cat-dance-active' : 'cat-idle-active'}`}>
      <svg
        viewBox="0 0 200 200"
        width="180"
        height="180"
        className="mascot-svg-canvas"
        aria-label="Cute Cartoon Cat Character"
      >
        <defs>
          <radialGradient id="catFurGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4c1d95" />
            <stop offset="70%" stopColor="#2e1065" />
            <stop offset="100%" stopColor="#1e0a45" />
          </radialGradient>
          <linearGradient id="catChestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f3e8ff" />
            <stop offset="100%" stopColor="#d8b4fe" />
          </linearGradient>
          <radialGradient id="catEyeGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </radialGradient>
          <radialGradient id="catPawPadGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#db2777" />
          </radialGradient>
          <radialGradient id="yarnBallGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="60%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#9d174d" />
          </radialGradient>
        </defs>

        {/* Dynamic Floor Shadow */}
        <ellipse cx="100" cy="180" rx="42" ry="9" fill="rgba(10, 2, 20, 0.4)" className="character-part-shadow cat-shadow" />

        {/* 🧶 Interactive Bouncing Yarn Ball */}
        <g className="cat-part-yarn">
          <circle cx="44" cy="168" r="14" fill="url(#yarnBallGrad)" stroke="#fbcfe8" strokeWidth="1.5" />
          <path d="M36,160 Q44,168 52,160 Q48,176 38,174 Q44,164 48,170" fill="none" stroke="#fbcfe8" strokeWidth="1.2" />
          <path d="M44,182 C55,185 65,182 72,176 C78,170 82,172 88,174" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="2,2" />
        </g>

        {/* 🐾 S-Curve Tail */}
        <g className="cat-part-tail">
          <path
            d="M124,144 C155,142 168,118 158,95 C152,80 162,70 172,74 C180,78 178,92 168,106 C156,124 145,152 120,154 Z"
            fill="url(#catFurGrad)"
            stroke="#a855f7"
            strokeWidth="1.8"
          />
          <path d="M166,74 Q176,72 174,82 Q168,88 162,80 Z" fill="#d8b4fe" />
        </g>

        {/* 🐾 Hind Legs / Back Paws */}
        <g className="cat-part-leg-bl">
          <ellipse cx="76" cy="154" rx="14" ry="18" fill="url(#catFurGrad)" stroke="#a855f7" strokeWidth="1.5" />
          <ellipse cx="74" cy="172" rx="10" ry="6" fill="#4c1d95" stroke="#a855f7" strokeWidth="1.5" />
          <circle cx="71" cy="172" r="1.8" fill="#f472b6" />
          <circle cx="75" cy="173" r="1.8" fill="#f472b6" />
          <circle cx="78" cy="172" r="1.8" fill="#f472b6" />
        </g>

        <g className="cat-part-leg-br">
          <ellipse cx="124" cy="154" rx="14" ry="18" fill="url(#catFurGrad)" stroke="#a855f7" strokeWidth="1.5" />
          <ellipse cx="126" cy="172" rx="10" ry="6" fill="#4c1d95" stroke="#a855f7" strokeWidth="1.5" />
          <circle cx="122" cy="172" r="1.8" fill="#f472b6" />
          <circle cx="126" cy="173" r="1.8" fill="#f472b6" />
          <circle cx="129" cy="172" r="1.8" fill="#f472b6" />
        </g>

        {/* 🐱 Torso / Body */}
        <g className="cat-part-body">
          <path
            d="M74,105 C68,125 68,155 80,165 C92,172 108,172 120,165 C132,155 132,125 126,105 C118,98 82,98 74,105 Z"
            fill="url(#catFurGrad)"
            stroke="#a855f7"
            strokeWidth="2"
          />
          <path
            d="M86,108 C80,122 84,152 100,158 C116,152 120,122 114,108 C108,114 92,114 86,108 Z"
            fill="url(#catChestGrad)"
          />
          <path d="M82,106 Q100,114 118,106" fill="none" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="112" r="4.5" fill="#ffd166" stroke="#ca8a04" strokeWidth="1" />
          <circle cx="100" cy="113" r="1.5" fill="#ca8a04" />
        </g>

        {/* 🐾 Front Left Paw */}
        <g className="cat-part-paw-fl">
          <path
            d="M80,110 Q72,128 72,148 Q72,156 80,156 Q86,156 86,146 Q86,128 84,110 Z"
            fill="url(#catFurGrad)"
            stroke="#a855f7"
            strokeWidth="1.5"
          />
          <ellipse cx="78" cy="152" rx="4.5" ry="3.5" fill="url(#catPawPadGrad)" />
          <circle cx="74" cy="148" r="1.5" fill="#f472b6" />
          <circle cx="78" cy="146" r="1.5" fill="#f472b6" />
          <circle cx="82" cy="148" r="1.5" fill="#f472b6" />
        </g>

        {/* 🐾 Front Right Paw */}
        <g className="cat-part-paw-fr">
          <path
            d="M120,110 Q128,128 128,148 Q128,156 120,156 Q114,156 114,146 Q114,128 116,110 Z"
            fill="url(#catFurGrad)"
            stroke="#a855f7"
            strokeWidth="1.5"
          />
          <ellipse cx="122" cy="152" rx="4.5" ry="3.5" fill="url(#catPawPadGrad)" />
          <circle cx="118" cy="148" r="1.5" fill="#f472b6" />
          <circle cx="122" cy="146" r="1.5" fill="#f472b6" />
          <circle cx="126" cy="148" r="1.5" fill="#f472b6" />
        </g>

        {/* 🐱 Head & Face Group */}
        <g className="cat-part-head">
          <g className="cat-part-ear-l">
            <path d="M68,64 L50,28 L82,46 Z" fill="url(#catFurGrad)" stroke="#a855f7" strokeWidth="2" strokeLinejoin="round" />
            <path d="M66,60 L54,34 L78,48 Z" fill="#f472b6" opacity="0.85" />
            <path d="M64,56 Q58,54 62,48" stroke="#fbcfe8" strokeWidth="1.5" fill="none" />
          </g>

          <g className="cat-part-ear-r">
            <path d="M132,64 L150,28 L118,46 Z" fill="url(#catFurGrad)" stroke="#a855f7" strokeWidth="2" strokeLinejoin="round" />
            <path d="M134,60 L146,34 L122,48 Z" fill="#f472b6" opacity="0.85" />
            <path d="M136,56 Q142,54 138,48" stroke="#fbcfe8" strokeWidth="1.5" fill="none" />
          </g>

          <ellipse cx="100" cy="74" rx="36" ry="30" fill="url(#catFurGrad)" stroke="#a855f7" strokeWidth="2" />
          <path d="M64,74 Q54,78 62,86 Q56,92 68,92" fill="url(#catFurGrad)" />
          <path d="M136,74 Q146,78 138,86 Q144,92 132,92" fill="url(#catFurGrad)" />

          <ellipse cx="74" cy="82" rx="7" ry="4" fill="#f472b6" opacity="0.45" />
          <ellipse cx="126" cy="82" rx="7" ry="4" fill="#f472b6" opacity="0.45" />

          <g className="cat-part-whiskers">
            <line x1="68" y1="80" x2="40" y2="76" stroke="#e9d5ff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="68" y1="84" x2="38" y2="86" stroke="#e9d5ff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="132" y1="80" x2="160" y2="76" stroke="#e9d5ff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="132" y1="84" x2="162" y2="86" stroke="#e9d5ff" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          <g className="cat-part-eyes">
            <g className="cat-eye-single cat-eye-left">
              <ellipse cx="82" cy="70" rx="7" ry="9" fill="url(#catEyeGrad)" stroke="#7e22ce" strokeWidth="1" />
              <ellipse cx="82" cy="70" rx="3" ry="7" fill="#090312" />
              <circle cx="80" cy="66" r="2.5" fill="#ffffff" />
              <circle cx="84" cy="73" r="1.2" fill="#ffffff" />
              <path d="M74,70 Q82,60 90,70 Z" fill="#2e1065" className="cat-eyelid-anim" />
            </g>

            <g className="cat-eye-single cat-eye-right">
              <ellipse cx="118" cy="70" rx="7" ry="9" fill="url(#catEyeGrad)" stroke="#7e22ce" strokeWidth="1" />
              <ellipse cx="118" cy="70" rx="3" ry="7" fill="#090312" />
              <circle cx="116" cy="66" r="2.5" fill="#ffffff" />
              <circle cx="120" cy="73" r="1.2" fill="#ffffff" />
              <path d="M110,70 Q118,60 126,70 Z" fill="#2e1065" className="cat-eyelid-anim" />
            </g>
          </g>

          <g className="cat-part-mouth">
            <polygon points="100,79 96,76 104,76" fill="#f472b6" />
            <path d="M93,82 Q96,86 100,83 Q104,86 107,82" fill="none" stroke="#fbcfe8" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M96,84 Q100,90 104,84 Z" fill="#ec4899" className="cat-open-smile" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/* ==========================================================================
   🦆 2. GRISHMA: ORIGINAL ARTICULATED DUCK CHARACTER
   ========================================================================== */
function DuckCharacter({ isDancing }) {
  return (
    <div className={`mascot-svg-wrapper duck-character-wrapper ${isDancing ? 'duck-dance-active' : 'duck-idle-active'}`}>
      <svg
        viewBox="0 0 200 200"
        width="180"
        height="180"
        className="mascot-svg-canvas"
        aria-label="Cute Cartoon Duck Character"
      >
        <defs>
          <radialGradient id="duckFeatherGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#ca8a04" />
          </radialGradient>
          <linearGradient id="duckBeakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <radialGradient id="waterRippleGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 💦 Water Ripples at Base */}
        <g className="duck-part-ripple">
          <ellipse cx="100" cy="178" rx="55" ry="14" fill="url(#waterRippleGrad)" className="duck-ripple-anim" />
          <ellipse cx="100" cy="178" rx="38" ry="8" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="duck-ripple-pulse" />
        </g>

        {/* 💧 Splash Droplets */}
        <g className="duck-part-splash">
          <circle cx="55" cy="165" r="4" fill="#38bdf8" opacity="0.8" className="splash-drop-1" />
          <circle cx="68" cy="155" r="3" fill="#67e8f9" opacity="0.9" className="splash-drop-2" />
          <circle cx="145" cy="165" r="4" fill="#38bdf8" opacity="0.8" className="splash-drop-3" />
          <circle cx="132" cy="155" r="3" fill="#67e8f9" opacity="0.9" className="splash-drop-4" />
        </g>

        {/* 🦆 Tail Feathers */}
        <g className="duck-part-tail">
          <path
            d="M125,130 Q152,122 158,110 Q146,134 132,142 Z"
            fill="url(#duckFeatherGrad)"
            stroke="#ca8a04"
            strokeWidth="1.8"
          />
          <path d="M130,132 Q156,128 150,118" fill="none" stroke="#ca8a04" strokeWidth="1.2" />
        </g>

        {/* 🦶 Left Orange Webbed Foot */}
        <g className="duck-part-foot-l">
          <line x1="82" y1="152" x2="82" y2="168" stroke="#ea580c" strokeWidth="3.5" strokeLinecap="round" />
          <path
            d="M82,168 L64,175 Q72,171 82,175 Q92,171 100,175 Z"
            fill="url(#duckBeakGrad)"
            stroke="#c2410c"
            strokeWidth="1.5"
          />
        </g>

        {/* 🦶 Right Orange Webbed Foot */}
        <g className="duck-part-foot-r">
          <line x1="118" y1="152" x2="118" y2="168" stroke="#ea580c" strokeWidth="3.5" strokeLinecap="round" />
          <path
            d="M118,168 L100,175 Q108,171 118,175 Q128,171 136,175 Z"
            fill="url(#duckBeakGrad)"
            stroke="#c2410c"
            strokeWidth="1.5"
          />
        </g>

        {/* 🦆 Chubby Body */}
        <g className="duck-part-body">
          <path
            d="M68,105 C56,125 58,155 78,165 C92,172 108,172 122,165 C142,155 144,125 132,105 C122,96 78,96 68,105 Z"
            fill="url(#duckFeatherGrad)"
            stroke="#ca8a04"
            strokeWidth="2"
          />
          <ellipse cx="100" cy="138" rx="22" ry="24" fill="#fef9c3" opacity="0.65" />
        </g>

        {/* 🪶 Left Wing */}
        <g className="duck-part-wing-l">
          <path
            d="M68,108 C50,115 40,132 45,148 C50,154 60,148 64,138 C68,128 72,118 68,108 Z"
            fill="url(#duckFeatherGrad)"
            stroke="#ca8a04"
            strokeWidth="1.8"
          />
          <path d="M52,126 Q46,138 52,145" fill="none" stroke="#ca8a04" strokeWidth="1.2" />
          <path d="M58,120 Q54,132 60,140" fill="none" stroke="#ca8a04" strokeWidth="1.2" />
        </g>

        {/* 🪶 Right Wing */}
        <g className="duck-part-wing-r">
          <path
            d="M132,108 C150,115 160,132 155,148 C150,154 140,148 136,138 C132,128 128,118 132,108 Z"
            fill="url(#duckFeatherGrad)"
            stroke="#ca8a04"
            strokeWidth="1.8"
          />
          <path d="M148,126 Q154,138 148,145" fill="none" stroke="#ca8a04" strokeWidth="1.2" />
          <path d="M142,120 Q146,132 140,140" fill="none" stroke="#ca8a04" strokeWidth="1.2" />
        </g>

        {/* 🦆 Head, Neck & Expressive Beak Group */}
        <g className="duck-part-head">
          <path d="M96,44 Q100,32 108,36 Q102,42 104,46 Z" fill="url(#duckFeatherGrad)" stroke="#ca8a04" strokeWidth="1.2" />
          <circle cx="100" cy="68" r="32" fill="url(#duckFeatherGrad)" stroke="#ca8a04" strokeWidth="2" />
          <ellipse cx="76" cy="74" rx="6" ry="3.5" fill="#f97316" opacity="0.4" />
          <ellipse cx="124" cy="74" rx="6" ry="3.5" fill="#f97316" opacity="0.4" />

          <g className="duck-part-eyes">
            <ellipse cx="85" cy="62" rx="6" ry="8" fill="#083344" />
            <circle cx="83" cy="59" r="2.2" fill="#ffffff" />
            <circle cx="87" cy="65" r="1" fill="#38bdf8" />
            <path d="M78,62 Q85,54 92,62 Z" fill="#eab308" className="duck-eyelid-anim" />

            <ellipse cx="115" cy="62" rx="6" ry="8" fill="#083344" />
            <circle cx="113" cy="59" r="2.2" fill="#ffffff" />
            <circle cx="117" cy="65" r="1" fill="#38bdf8" />
            <path d="M108,62 Q115,54 122,62 Z" fill="#eab308" className="duck-eyelid-anim" />
          </g>

          <g className="duck-part-beak">
            <path d="M86,76 Q100,88 114,76 Z" fill="#c2410c" className="duck-beak-lower" />
            <ellipse cx="100" cy="80" rx="4" ry="2" fill="#f43f5e" className="duck-tongue-anim" />
            <path
              d="M80,72 Q100,64 120,72 Q112,82 100,82 Q88,82 80,72 Z"
              fill="url(#duckBeakGrad)"
              stroke="#c2410c"
              strokeWidth="1.8"
            />
            <circle cx="95" cy="71" r="1" fill="#7c2d12" />
            <circle cx="105" cy="71" r="1" fill="#7c2d12" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/* ==========================================================================
   🦚 3. THANISHQA: ARTICULATED WHITE PEACOCK CHARACTER
   ========================================================================== */
function WhitePeacockCharacter({ isDancing }) {
  return (
    <div className={`mascot-svg-wrapper peacock-character-wrapper ${isDancing ? 'peacock-dance-active' : 'peacock-idle-active'}`}>
      <svg
        viewBox="0 0 200 200"
        width="180"
        height="180"
        className="mascot-svg-canvas"
        aria-label="Graceful White Peacock Character"
      >
        <defs>
          {/* Pearlescent White Plumage Gradient */}
          <linearGradient id="whitePlumeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f0f9ff" />
            <stop offset="85%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>

          {/* Soft White Body Shading */}
          <radialGradient id="peacockBodyGrad" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f8fafc" />
            <stop offset="90%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </radialGradient>

          {/* Glowing Peacock Feather Eye (Ocellus) */}
          <radialGradient id="ocellusGlowGrad" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#67e8f9" />
            <stop offset="65%" stopColor="#0ea5e9" />
            <stop offset="85%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#0369a1" />
          </radialGradient>

          {/* Crest Crystal Gem Gradient */}
          <radialGradient id="crestGemGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </radialGradient>

          {/* Golden Beak Gradient */}
          <linearGradient id="peacockBeakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Sapphire Eyes Gradient */}
          <radialGradient id="peacockEyeGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="55%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>

          {/* Rakhi Silk & Gold Gradient */}
          <linearGradient id="peacockRakhiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
        </defs>

        {/* Ambient Floor Shadow */}
        <ellipse cx="100" cy="180" rx="44" ry="8" fill="rgba(8, 36, 59, 0.45)" className="character-part-shadow peacock-shadow" />

        {/* ================================================================
            🪶 1. MAJESTIC RADIANT FEATHER FAN TRAIN (7 ARTICULATED PLUMES)
           ================================================================ */}
        <g className="peacock-part-fan">
          {/* Plume 1 (Far Left -54 deg) */}
          <g transform="translate(100, 142) rotate(-54)">
            <path d="M0,0 Q-10,-48 0,-92 Q10,-48 0,0" fill="url(#whitePlumeGrad)" stroke="#bae6fd" strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="-90" stroke="#7dd3fc" strokeWidth="1.2" strokeLinecap="round" />
            {/* Ocellus Plume Eye */}
            <ellipse cx="0" cy="-78" rx="8.5" ry="11" fill="url(#ocellusGlowGrad)" stroke="#ffffff" strokeWidth="0.8" />
            <ellipse cx="0" cy="-78" rx="4.5" ry="6.5" fill="#0284c7" />
            <circle cx="-1.5" cy="-80" r="1.5" fill="#ffffff" />
            <circle cx="1.5" cy="-76" r="0.8" fill="#fde047" />
          </g>

          {/* Plume 2 (Left -36 deg) */}
          <g transform="translate(100, 142) rotate(-36)">
            <path d="M0,0 Q-11,-52 0,-102 Q11,-52 0,0" fill="url(#whitePlumeGrad)" stroke="#bae6fd" strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="-100" stroke="#7dd3fc" strokeWidth="1.2" strokeLinecap="round" />
            <ellipse cx="0" cy="-86" rx="9" ry="12" fill="url(#ocellusGlowGrad)" stroke="#ffffff" strokeWidth="0.8" />
            <ellipse cx="0" cy="-86" rx="5" ry="7" fill="#0284c7" />
            <circle cx="-1.5" cy="-88" r="1.6" fill="#ffffff" />
            <circle cx="1.5" cy="-84" r="0.8" fill="#fde047" />
          </g>

          {/* Plume 3 (Left Mid -18 deg) */}
          <g transform="translate(100, 142) rotate(-18)">
            <path d="M0,0 Q-12,-56 0,-110 Q12,-56 0,0" fill="url(#whitePlumeGrad)" stroke="#bae6fd" strokeWidth="1.1" />
            <line x1="0" y1="0" x2="0" y2="-108" stroke="#7dd3fc" strokeWidth="1.3" strokeLinecap="round" />
            <ellipse cx="0" cy="-94" rx="9.5" ry="12.5" fill="url(#ocellusGlowGrad)" stroke="#ffffff" strokeWidth="0.9" />
            <ellipse cx="0" cy="-94" rx="5.2" ry="7.2" fill="#0284c7" />
            <circle cx="-1.8" cy="-96" r="1.8" fill="#ffffff" />
            <circle cx="1.8" cy="-92" r="0.9" fill="#fde047" />
          </g>

          {/* Plume 4 (Crown Center 0 deg) */}
          <g transform="translate(100, 142) rotate(0)">
            <path d="M0,0 Q-13,-58 0,-115 Q13,-58 0,0" fill="url(#whitePlumeGrad)" stroke="#bae6fd" strokeWidth="1.2" />
            <line x1="0" y1="0" x2="0" y2="-113" stroke="#7dd3fc" strokeWidth="1.4" strokeLinecap="round" />
            <ellipse cx="0" cy="-98" rx="10" ry="13" fill="url(#ocellusGlowGrad)" stroke="#ffffff" strokeWidth="1" />
            <ellipse cx="0" cy="-98" rx="5.5" ry="7.5" fill="#0284c7" />
            <circle cx="-2" cy="-100" r="2" fill="#ffffff" />
            <circle cx="2" cy="-96" r="1" fill="#fde047" />
          </g>

          {/* Plume 5 (Right Mid +18 deg) */}
          <g transform="translate(100, 142) rotate(18)">
            <path d="M0,0 Q-12,-56 0,-110 Q12,-56 0,0" fill="url(#whitePlumeGrad)" stroke="#bae6fd" strokeWidth="1.1" />
            <line x1="0" y1="0" x2="0" y2="-108" stroke="#7dd3fc" strokeWidth="1.3" strokeLinecap="round" />
            <ellipse cx="0" cy="-94" rx="9.5" ry="12.5" fill="url(#ocellusGlowGrad)" stroke="#ffffff" strokeWidth="0.9" />
            <ellipse cx="0" cy="-94" rx="5.2" ry="7.2" fill="#0284c7" />
            <circle cx="-1.8" cy="-96" r="1.8" fill="#ffffff" />
            <circle cx="1.8" cy="-92" r="0.9" fill="#fde047" />
          </g>

          {/* Plume 6 (Right +36 deg) */}
          <g transform="translate(100, 142) rotate(36)">
            <path d="M0,0 Q-11,-52 0,-102 Q11,-52 0,0" fill="url(#whitePlumeGrad)" stroke="#bae6fd" strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="-100" stroke="#7dd3fc" strokeWidth="1.2" strokeLinecap="round" />
            <ellipse cx="0" cy="-86" rx="9" ry="12" fill="url(#ocellusGlowGrad)" stroke="#ffffff" strokeWidth="0.8" />
            <ellipse cx="0" cy="-86" rx="5" ry="7" fill="#0284c7" />
            <circle cx="-1.5" cy="-88" r="1.6" fill="#ffffff" />
            <circle cx="1.5" cy="-84" r="0.8" fill="#fde047" />
          </g>

          {/* Plume 7 (Far Right +54 deg) */}
          <g transform="translate(100, 142) rotate(54)">
            <path d="M0,0 Q-10,-48 0,-92 Q10,-48 0,0" fill="url(#whitePlumeGrad)" stroke="#bae6fd" strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="-90" stroke="#7dd3fc" strokeWidth="1.2" strokeLinecap="round" />
            <ellipse cx="0" cy="-78" rx="8.5" ry="11" fill="url(#ocellusGlowGrad)" stroke="#ffffff" strokeWidth="0.8" />
            <ellipse cx="0" cy="-78" rx="4.5" ry="6.5" fill="#0284c7" />
            <circle cx="-1.5" cy="-80" r="1.5" fill="#ffffff" />
            <circle cx="1.5" cy="-76" r="0.8" fill="#fde047" />
          </g>

          {/* Inner Covert Layer Feathers */}
          <path d="M78,140 Q100,118 122,140 Q100,154 78,140 Z" fill="#ffffff" stroke="#bae6fd" strokeWidth="1.2" />
        </g>

        {/* 🦶 Delicate Golden Legs & Feet */}
        <g className="peacock-part-legs">
          <g className="peacock-leg-l">
            <line x1="88" y1="158" x2="86" y2="176" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M80,176 L86,176 L92,176 M86,176 L86,173" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" />
          </g>
          <g className="peacock-leg-r">
            <line x1="112" y1="158" x2="114" y2="176" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M108,176 L114,176 L120,176 M114,176 L114,173" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </g>

        {/* 🕊️ Pearlescent Body & Fluffy Chest */}
        <g className="peacock-part-body">
          <ellipse cx="100" cy="138" rx="25" ry="28" fill="url(#peacockBodyGrad)" stroke="#bae6fd" strokeWidth="1.5" />
          {/* Subtle chest feather contours */}
          <path d="M90,132 Q100,140 110,132" fill="none" stroke="#bae6fd" strokeWidth="1" strokeLinecap="round" />
          <path d="M88,142 Q100,150 112,142" fill="none" stroke="#bae6fd" strokeWidth="1" strokeLinecap="round" />
          <path d="M92,152 Q100,158 108,152" fill="none" stroke="#bae6fd" strokeWidth="1" strokeLinecap="round" />

          {/* 🎀 Royal Rakhi Necklace & Diamond Pendant */}
          <path d="M84,124 Q100,136 116,124" fill="none" stroke="url(#peacockRakhiGrad)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Gold Rakhi Central Jewel */}
          <circle cx="100" cy="132" r="4.5" fill="#facc15" stroke="#dc2626" strokeWidth="1.2" />
          <polygon points="100,128 103,132 100,136 97,132" fill="#38bdf8" />
        </g>

        {/* 🪽 Articulated Left Wing */}
        <g className="peacock-part-wing-l">
          <path
            d="M78,124 C60,130 54,150 62,164 C70,168 82,156 82,138 Z"
            fill="url(#whitePlumeGrad)"
            stroke="#bae6fd"
            strokeWidth="1.4"
          />
          {/* Layered wing feather curves */}
          <path d="M68,138 Q62,152 70,160" fill="none" stroke="#7dd3fc" strokeWidth="1" />
          <path d="M74,134 Q70,148 76,156" fill="none" stroke="#7dd3fc" strokeWidth="1" />
        </g>

        {/* 🪽 Articulated Right Wing */}
        <g className="peacock-part-wing-r">
          <path
            d="M122,124 C140,130 146,150 138,164 C130,168 118,156 118,138 Z"
            fill="url(#whitePlumeGrad)"
            stroke="#bae6fd"
            strokeWidth="1.4"
          />
          <path d="M132,138 Q138,152 130,160" fill="none" stroke="#7dd3fc" strokeWidth="1" />
          <path d="M126,134 Q130,148 124,156" fill="none" stroke="#7dd3fc" strokeWidth="1" />
        </g>

        {/* 👑 Graceful Swan Neck, Cute Head, Crown Crest & Sparkling Eyes */}
        <g className="peacock-part-head">
          {/* Swan Neck */}
          <path
            d="M93,122 C92,102 94,88 96,76 L104,76 C106,88 108,102 107,122 Z"
            fill="url(#whitePlumeGrad)"
            stroke="#bae6fd"
            strokeWidth="1.2"
          />

          {/* Head Base */}
          <ellipse cx="100" cy="72" rx="23" ry="20" fill="url(#whitePlumeGrad)" stroke="#bae6fd" strokeWidth="1.5" />

          {/* 💎 Imperial 4-Plume Crown Crest */}
          <g className="peacock-part-crest">
            {/* Crest Stalk 1 (Left) */}
            <line x1="94" y1="53" x2="86" y2="34" stroke="#0284c7" strokeWidth="1.4" strokeLinecap="round" />
            <ellipse cx="86" cy="32" rx="4" ry="5.5" fill="url(#crestGemGrad)" stroke="#ffffff" strokeWidth="0.8" />
            <circle cx="85" cy="30" r="1.2" fill="#ffffff" />

            {/* Crest Stalk 2 (Mid-Left) */}
            <line x1="98" y1="52" x2="94" y2="28" stroke="#0284c7" strokeWidth="1.4" strokeLinecap="round" />
            <ellipse cx="94" cy="26" rx="4.5" ry="6" fill="url(#crestGemGrad)" stroke="#ffffff" strokeWidth="0.8" />
            <circle cx="93" cy="24" r="1.4" fill="#ffffff" />

            {/* Crest Stalk 3 (Mid-Right) */}
            <line x1="102" y1="52" x2="106" y2="28" stroke="#0284c7" strokeWidth="1.4" strokeLinecap="round" />
            <ellipse cx="106" cy="26" rx="4.5" ry="6" fill="url(#crestGemGrad)" stroke="#ffffff" strokeWidth="0.8" />
            <circle cx="105" cy="24" r="1.4" fill="#ffffff" />

            {/* Crest Stalk 4 (Right) */}
            <line x1="106" y1="53" x2="114" y2="34" stroke="#0284c7" strokeWidth="1.4" strokeLinecap="round" />
            <ellipse cx="114" cy="32" rx="4" ry="5.5" fill="url(#crestGemGrad)" stroke="#ffffff" strokeWidth="0.8" />
            <circle cx="113" cy="30" r="1.2" fill="#ffffff" />
          </g>

          {/* Rosy Glowing Cheeks */}
          <ellipse cx="84" cy="76" rx="4.5" ry="3" fill="#f472b6" opacity="0.55" />
          <ellipse cx="116" cy="76" rx="4.5" ry="3" fill="#f472b6" opacity="0.55" />

          {/* 💎 Big Gorgeous Sapphire Eyes */}
          <g className="peacock-eyes">
            {/* Left Eye */}
            <ellipse cx="89" cy="68" rx="6" ry="7.5" fill="url(#peacockEyeGrad)" />
            <circle cx="87" cy="65.5" r="2.4" fill="#ffffff" />
            <circle cx="91" cy="70.5" r="1.2" fill="#ffffff" />
            <path d="M83,62 Q89,58 95,62" fill="none" stroke="#0284c7" strokeWidth="1.2" strokeLinecap="round" />

            {/* Right Eye */}
            <ellipse cx="111" cy="68" rx="6" ry="7.5" fill="url(#peacockEyeGrad)" />
            <circle cx="109" cy="65.5" r="2.4" fill="#ffffff" />
            <circle cx="113" cy="70.5" r="1.2" fill="#ffffff" />
            <path d="M105,62 Q111,58 117,62" fill="none" stroke="#0284c7" strokeWidth="1.2" strokeLinecap="round" />
          </g>

          {/* 💛 Cute Golden Beak & Friendly Smile */}
          <path
            d="M93,76 Q100,74 107,76 Q100,88 93,76 Z"
            fill="url(#peacockBeakGrad)"
            stroke="#b45309"
            strokeWidth="1"
          />
          <line x1="94" y1="76" x2="106" y2="76" stroke="#b45309" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  );
}

/* ==========================================================================
   🧸 4. SIRI CHAITHRA: ARTICULATED CUDDLY TEDDY BEAR CHARACTER
   ========================================================================== */
function TeddyBearCharacter({ isDancing }) {
  return (
    <div className={`mascot-svg-wrapper teddy-character-wrapper ${isDancing ? 'teddy-dance-active' : 'teddy-idle-active'}`}>
      <svg
        viewBox="0 0 200 200"
        width="180"
        height="180"
        className="mascot-svg-canvas"
        aria-label="Cuddly Animated Teddy Bear Character"
      >
        <defs>
          <radialGradient id="teddyFurGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="70%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>
          <radialGradient id="teddySnoutGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="85%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#fcd34d" />
          </radialGradient>
          <linearGradient id="teddyBowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff3366" />
            <stop offset="50%" stopColor="#ff758c" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>

        {/* Ambient Floor Shadow */}
        <ellipse cx="100" cy="180" rx="44" ry="8" fill="rgba(45, 12, 28, 0.4)" className="character-part-shadow teddy-shadow" />

        {/* 🧸 Plush Feet with Stitched Paw Pads */}
        <g className="teddy-part-foot-l">
          <ellipse cx="78" cy="168" rx="14" ry="10" fill="url(#teddyFurGrad)" stroke="#78350f" strokeWidth="1.2" />
          <ellipse cx="78" cy="168" rx="7" ry="5" fill="url(#teddySnoutGrad)" />
          <circle cx="73" cy="163" r="1.6" fill="url(#teddySnoutGrad)" />
          <circle cx="78" cy="161" r="1.6" fill="url(#teddySnoutGrad)" />
          <circle cx="83" cy="163" r="1.6" fill="url(#teddySnoutGrad)" />
        </g>

        <g className="teddy-part-foot-r">
          <ellipse cx="122" cy="168" rx="14" ry="10" fill="url(#teddyFurGrad)" stroke="#78350f" strokeWidth="1.2" />
          <ellipse cx="122" cy="168" rx="7" ry="5" fill="url(#teddySnoutGrad)" />
          <circle cx="117" cy="163" r="1.6" fill="url(#teddySnoutGrad)" />
          <circle cx="122" cy="161" r="1.6" fill="url(#teddySnoutGrad)" />
          <circle cx="127" cy="163" r="1.6" fill="url(#teddySnoutGrad)" />
        </g>

        {/* 🧸 Soft Round Plush Body */}
        <g className="teddy-part-body">
          <ellipse cx="100" cy="134" rx="30" ry="32" fill="url(#teddyFurGrad)" stroke="#78350f" strokeWidth="1.2" />
          <ellipse cx="100" cy="136" rx="20" ry="22" fill="url(#teddySnoutGrad)" />

          {/* Embroidered Heart Patch */}
          <path
            d="M100,132 C97,126 89,126 89,134 C89,140 100,147 100,147 C100,147 111,140 111,134 C111,126 103,126 100,132 Z"
            fill="#ff3366"
            stroke="#ffffff"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        </g>

        {/* 🖐️ Left Plush Arm (Waving) */}
        <g className="teddy-part-arm-l">
          <ellipse cx="64" cy="120" rx="11" ry="18" fill="url(#teddyFurGrad)" stroke="#78350f" strokeWidth="1.2" transform="rotate(25, 64, 120)" />
          <ellipse cx="60" cy="116" rx="5" ry="6" fill="url(#teddySnoutGrad)" />
        </g>

        {/* 🖐️ Right Plush Arm (Holding Rakhi Heart) */}
        <g className="teddy-part-arm-r">
          <ellipse cx="136" cy="120" rx="11" ry="18" fill="url(#teddyFurGrad)" stroke="#78350f" strokeWidth="1.2" transform="rotate(-25, 136, 120)" />
          <ellipse cx="140" cy="116" rx="5" ry="6" fill="url(#teddySnoutGrad)" />
          {/* Rakhi Band on Wrist */}
          <rect x="133" y="126" width="10" height="3" rx="1" fill="#ffd166" stroke="#ff3366" strokeWidth="0.8" />
          <circle cx="138" cy="127.5" r="2" fill="#ff3366" />
        </g>

        {/* 🎀 Golden Rakhi Neck Ribbon Bow */}
        <g className="teddy-part-bow" transform="translate(100, 102)">
          <path d="M0,0 L-14,-7 L-14,7 Z" fill="url(#teddyBowGrad)" stroke="#ffd166" strokeWidth="1" />
          <path d="M0,0 L14,-7 L14,7 Z" fill="url(#teddyBowGrad)" stroke="#ffd166" strokeWidth="1" />
          <circle cx="0" cy="0" r="4.5" fill="#ffd166" stroke="#ff3366" strokeWidth="1" />
          <circle cx="0" cy="0" r="2" fill="#ff3366" />
        </g>

        {/* 🧸 Round Plush Head, Fuzzy Ears & Sweet Expression */}
        <g className="teddy-part-head">
          {/* Left Ear */}
          <g className="teddy-ear-l">
            <circle cx="66" cy="52" r="16" fill="url(#teddyFurGrad)" stroke="#78350f" strokeWidth="1.2" />
            <circle cx="66" cy="52" r="9" fill="url(#teddySnoutGrad)" />
          </g>

          {/* Right Ear */}
          <g className="teddy-ear-r">
            <circle cx="134" cy="52" r="16" fill="url(#teddyFurGrad)" stroke="#78350f" strokeWidth="1.2" />
            <circle cx="134" cy="52" r="9" fill="url(#teddySnoutGrad)" />
          </g>

          {/* Head Base */}
          <ellipse cx="100" cy="68" rx="36" ry="32" fill="url(#teddyFurGrad)" stroke="#78350f" strokeWidth="1.2" />

          {/* Soft Snout Base */}
          <ellipse cx="100" cy="76" rx="16" ry="12" fill="url(#teddySnoutGrad)" stroke="#d97706" strokeWidth="1" />

          {/* Button Nose & Stitched Smile */}
          <ellipse cx="100" cy="71" rx="5.5" ry="4" fill="#3b1506" />
          <circle cx="98.5" cy="70" r="1" fill="#ffffff" />
          <line x1="100" y1="75" x2="100" y2="79" stroke="#3b1506" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M94,79 Q100,85 106,79" fill="none" stroke="#3b1506" strokeWidth="1.8" strokeLinecap="round" />

          {/* Rosy Blush */}
          <ellipse cx="74" cy="75" rx="6" ry="3.5" fill="#f43f5e" opacity="0.6" />
          <ellipse cx="126" cy="75" rx="6" ry="3.5" fill="#f43f5e" opacity="0.6" />

          {/* Big Starry Catchlight Eyes */}
          <g className="teddy-eyes">
            <circle cx="84" cy="64" r="5.5" fill="#291206" />
            <circle cx="82" cy="62" r="2.2" fill="#ffffff" />
            <circle cx="85.5" cy="65.5" r="1" fill="#ffffff" />

            <circle cx="116" cy="64" r="5.5" fill="#291206" />
            <circle cx="114" cy="62" r="2.2" fill="#ffffff" />
            <circle cx="117.5" cy="65.5" r="1" fill="#ffffff" />
          </g>

          {/* Sibling Blossom Clip on Ear */}
          <g transform="translate(62, 38)">
            <circle cx="0" cy="0" r="3.5" fill="#ffd166" />
            <circle cx="-3" cy="0" r="2.5" fill="#ff758c" opacity="0.9" />
            <circle cx="3" cy="0" r="2.5" fill="#ff758c" opacity="0.9" />
            <circle cx="0" cy="-3" r="2.5" fill="#ff758c" opacity="0.9" />
            <circle cx="0" cy="3" r="2.5" fill="#ff758c" opacity="0.9" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/* ==========================================================================
   🐰 5. HANVIKA: ORIGINAL ARTICULATED RABBIT CHARACTER (Meadow Hop & Carrot)
   ========================================================================== */
function RabbitCharacter({ isDancing }) {
  return (
    <div className={`character-vector-wrapper rabbit-dancer-root ${isDancing ? 'is-rabbit-dancing' : 'is-rabbit-idle'}`}>
      <svg
        viewBox="0 0 200 200"
        className="character-svg-canvas rabbit-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Fur Gradient */}
          <linearGradient id="rabbitFurGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#fff1f2" />
            <stop offset="100%" stopColor="#fce7f3" />
          </linearGradient>

          {/* Belly Patch Gradient */}
          <linearGradient id="rabbitBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ffe4e6" />
          </linearGradient>

          {/* Inner Ear Soft Pink */}
          <linearGradient id="rabbitEarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#fbcfe8" />
          </linearGradient>

          {/* Carrot Gradient */}
          <linearGradient id="rabbitCarrotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff7849" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Carrot Leaves */}
          <linearGradient id="rabbitCarrotLeafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>

          {/* Golden Glow Filter */}
          <filter id="rabbitGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#f472b6" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="100" cy="180" rx="38" ry="8" fill="rgba(0, 0, 0, 0.28)" className="rabbit-ground-shadow" />

        {/* --- 1. Fluffy Tail --- */}
        <g className="rabbit-part-tail">
          <circle cx="146" cy="142" r="14" fill="#ffffff" stroke="#fbcfe8" strokeWidth="1.5" />
          <circle cx="144" cy="140" r="11" fill="url(#rabbitBellyGrad)" />
          <circle cx="148" cy="144" r="5" fill="#ffffff" opacity="0.8" />
        </g>

        {/* --- 2. Left Back Hopping Leg --- */}
        <g className="rabbit-part-leg-l">
          <ellipse cx="76" cy="158" rx="14" ry="18" fill="url(#rabbitFurGrad)" stroke="#fbcfe8" strokeWidth="1.2" transform="rotate(-10 76 158)" />
          <ellipse cx="72" cy="172" rx="13" ry="7" fill="url(#rabbitFurGrad)" stroke="#fbcfe8" strokeWidth="1.2" />
          <ellipse cx="72" cy="172" rx="8" ry="4" fill="#fbcfe8" />
        </g>

        {/* --- 3. Right Back Hopping Leg --- */}
        <g className="rabbit-part-leg-r">
          <ellipse cx="124" cy="158" rx="14" ry="18" fill="url(#rabbitFurGrad)" stroke="#fbcfe8" strokeWidth="1.2" transform="rotate(10 124 158)" />
          <ellipse cx="128" cy="172" rx="13" ry="7" fill="url(#rabbitFurGrad)" stroke="#fbcfe8" strokeWidth="1.2" />
          <ellipse cx="128" cy="172" rx="8" ry="4" fill="#fbcfe8" />
        </g>

        {/* --- 4. Plump Chubby Body --- */}
        <g className="rabbit-part-body">
          {/* Main Body */}
          <ellipse cx="100" cy="132" rx="34" ry="38" fill="url(#rabbitFurGrad)" stroke="#fbcfe8" strokeWidth="1.5" filter="url(#rabbitGlow)" />
          {/* Belly Patch */}
          <ellipse cx="100" cy="136" rx="22" ry="26" fill="url(#rabbitBellyGrad)" />
          {/* Tiny Bow Tie */}
          <g transform="translate(100, 102)">
            <polygon points="-8,-4 0,0 -8,4" fill="#ec4899" />
            <polygon points="8,-4 0,0 8,4" fill="#ec4899" />
            <circle cx="0" cy="0" r="3" fill="#ffd166" />
          </g>
        </g>

        {/* --- 5. Left Arm / Paw (Waving & Tapping) --- */}
        <g className="rabbit-part-arm-l">
          <ellipse cx="68" cy="120" rx="9" ry="15" fill="url(#rabbitFurGrad)" stroke="#fbcfe8" strokeWidth="1.2" transform="rotate(25 68 120)" />
          <circle cx="62" cy="128" r="7" fill="url(#rabbitFurGrad)" />
          <circle cx="62" cy="128" r="4" fill="#fbcfe8" />
        </g>

        {/* --- 6. Right Arm / Paw Holding Golden Carrot --- */}
        <g className="rabbit-part-arm-r">
          <ellipse cx="132" cy="120" rx="9" ry="15" fill="url(#rabbitFurGrad)" stroke="#fbcfe8" strokeWidth="1.2" transform="rotate(-25 132 120)" />
          <circle cx="138" cy="128" r="7" fill="url(#rabbitFurGrad)" />
          
          {/* Fresh Crunchy Carrot */}
          <g className="rabbit-held-carrot" transform="translate(142, 122) rotate(-20)">
            {/* Carrot Leaves */}
            <path d="M0,0 Q-4,-14 -10,-18 Q-2,-12 0,0" fill="url(#rabbitCarrotLeafGrad)" />
            <path d="M0,0 Q0,-18 2,-22 Q4,-14 0,0" fill="url(#rabbitCarrotLeafGrad)" />
            <path d="M0,0 Q6,-14 12,-16 Q4,-10 0,0" fill="url(#rabbitCarrotLeafGrad)" />
            {/* Carrot Body */}
            <polygon points="-6,0 6,0 0,26" fill="url(#rabbitCarrotGrad)" />
            <ellipse cx="0" cy="0" rx="6" ry="2.5" fill="#f97316" />
            <line x1="-3" y1="8" x2="2" y2="8" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
            <line x1="-2" y1="16" x2="3" y2="16" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
          </g>
        </g>

        {/* --- 7. Articulated Head & Features --- */}
        <g className="rabbit-part-head">
          {/* Left Articulated Long Ear */}
          <g className="rabbit-part-ear-l">
            <ellipse cx="80" cy="36" rx="11" ry="32" fill="url(#rabbitFurGrad)" stroke="#fbcfe8" strokeWidth="1.2" transform="rotate(-12 80 36)" />
            <ellipse cx="80" cy="38" rx="6" ry="24" fill="url(#rabbitEarGrad)" transform="rotate(-12 80 38)" />
          </g>

          {/* Right Articulated Long Floppy Ear */}
          <g className="rabbit-part-ear-r">
            <ellipse cx="120" cy="36" rx="11" ry="32" fill="url(#rabbitFurGrad)" stroke="#fbcfe8" strokeWidth="1.2" transform="rotate(12 120 36)" />
            <ellipse cx="120" cy="38" rx="6" ry="24" fill="url(#rabbitEarGrad)" transform="rotate(12 120 38)" />
          </g>

          {/* Head Base */}
          <ellipse cx="100" cy="74" rx="36" ry="30" fill="url(#rabbitFurGrad)" stroke="#fbcfe8" strokeWidth="1.5" filter="url(#rabbitGlow)" />

          {/* Rosy Cheeks */}
          <ellipse cx="74" cy="80" rx="7.5" ry="4.5" fill="#f472b6" opacity="0.65" />
          <ellipse cx="126" cy="80" rx="7.5" ry="4.5" fill="#f472b6" opacity="0.65" />

          {/* Cute Whiskers */}
          <g className="rabbit-part-whiskers" stroke="#d8b4fe" strokeWidth="1.2" strokeLinecap="round">
            <line x1="68" y1="78" x2="48" y2="74" />
            <line x1="68" y1="82" x2="46" y2="84" />
            <line x1="132" y1="78" x2="152" y2="74" />
            <line x1="132" y1="82" x2="154" y2="84" />
          </g>

          {/* Anime Twinkling Eyes */}
          <g className="rabbit-part-eyes">
            <ellipse cx="84" cy="68" rx="6.5" ry="8" fill="#2e0832" />
            <circle cx="82" cy="65" r="2.8" fill="#ffffff" />
            <circle cx="86" cy="71" r="1.3" fill="#f472b6" />
            <path d="M77,68 Q84,58 91,68 Z" fill="#fff1f2" className="rabbit-eyelid-anim" />

            <ellipse cx="116" cy="68" rx="6.5" ry="8" fill="#2e0832" />
            <circle cx="114" cy="65" r="2.8" fill="#ffffff" />
            <circle cx="118" cy="71" r="1.3" fill="#f472b6" />
            <path d="M109,68 Q116,58 123,68 Z" fill="#fff1f2" className="rabbit-eyelid-anim" />
          </g>

          {/* Twitching Nose & Bunny Smile */}
          <g className="rabbit-part-snout">
            <polygon points="96,77 104,77 100,82" fill="#ec4899" />
            <path d="M95,83 Q100,88 100,84 Q100,88 105,83" fill="none" stroke="#2e0832" strokeWidth="1.8" strokeLinecap="round" />
            {/* Cute open smile tongue when dancing */}
            <path d="M97,84 Q100,90 103,84 Z" fill="#f472b6" className="rabbit-open-smile" />
          </g>
        </g>
      </svg>
    </div>
  );
}

