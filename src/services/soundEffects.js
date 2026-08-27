/**
 * Procedural Web Audio Sound Engine for Rakhi 2026.
 * Zero external audio files required. Produces rich, cute, high-quality audio
 * synthesized directly in the browser for UI, Mascots, and all 5 Mini-Games.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  isMuted() {
    return this.muted;
  }

  setMuted(mute) {
    this.muted = mute;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // Soft UI click
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Error buzz
  playError() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(140, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  playNegative() {
    this.playError();
  }

  // Portal Unlock Fanfare
  playUnlock() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.18, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.6);
    });
  }

  // Level Up / Stage Clear
  playLevelUp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  // Game Victory Fanfare
  playGameWin() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const chords = [
      { f: 523.25, t: 0 },     // C5
      { f: 659.25, t: 0.1 },   // E5
      { f: 783.99, t: 0.2 },   // G5
      { f: 1046.50, t: 0.35 }, // C6
      { f: 1318.51, t: 0.5 },  // E6
      { f: 1567.98, t: 0.65 }  // G6
    ];
    const now = this.ctx.currentTime;

    chords.forEach((c) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + c.t;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(c.f, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.2, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 0.8);
    });
  }

  // Score point sound
  playScorePoint() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Combo Streak chime
  playComboStreak(streak = 1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const baseFreq = Math.min(523.25 + streak * 65, 1500);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Jump boing
  playJump() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.16);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // Power Up pickup
  playPowerUp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(640, now + 0.1);
    osc.frequency.linearRampToValueAtTime(960, now + 0.2);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Boss alert
  playBossAlert() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [220, 196, 220, 261.63].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.12;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.2);
    });
  }

  // Fever Mode
  playFeverMode() {
    this.playPowerUp();
  }

  // Boss hit impact
  playBossHit() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Memory card match
  playMatchSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [659.25, 987.77].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  // Obstacle Bonk
  playHitObstacle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(70, now + 0.18);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Wax Seal Breaking sound
  playSealBreak() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [400, 800, 1200].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.04;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  // Gift Unbox Ribbon Shimmer
  playUnboxShimmer() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [659.25, 783.99, 987.77, 1318.51, 1567.98, 2093.00];

    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.6);
    });
  }

  // Mascot Tap Sounds
  playMascot(recipientId) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    switch (recipientId) {
      case 'chiti': {
        // 🧸 Cuddly Teddy Squeak & Hug Sparkle
        const squeakOsc = this.ctx.createOscillator();
        const squeakGain = this.ctx.createGain();
        squeakOsc.type = 'sine';
        squeakOsc.frequency.setValueAtTime(550, now);
        squeakOsc.frequency.exponentialRampToValueAtTime(950, now + 0.1);
        squeakOsc.frequency.exponentialRampToValueAtTime(700, now + 0.25);

        squeakGain.gain.setValueAtTime(0.16, now);
        squeakGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        squeakOsc.connect(squeakGain);
        squeakGain.connect(this.ctx.destination);
        squeakOsc.start(now);
        squeakOsc.stop(now + 0.28);

        // Chime trailing
        [880, 1174.66, 1479.98].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + 0.12 + i * 0.06;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.35);
        });
        break;
      }

      case 'duck': {
        // 🦆 Duck: Quack
        const quackOsc = this.ctx.createOscillator();
        const quackGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        quackOsc.type = 'sawtooth';
        quackOsc.frequency.setValueAtTime(360, now);
        quackOsc.frequency.linearRampToValueAtTime(260, now + 0.18);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, now);
        filter.Q.setValueAtTime(4.0, now);

        quackGain.gain.setValueAtTime(0.2, now);
        quackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        quackOsc.connect(filter);
        filter.connect(quackGain);
        quackGain.connect(this.ctx.destination);

        quackOsc.start(now);
        quackOsc.stop(now + 0.22);
        break;
      }

      case 'cat': {
        // 🐱 Cat: Meow
        const meowOsc = this.ctx.createOscillator();
        const meowGain = this.ctx.createGain();

        meowOsc.type = 'sine';
        meowOsc.frequency.setValueAtTime(420, now);
        meowOsc.frequency.exponentialRampToValueAtTime(740, now + 0.14);
        meowOsc.frequency.exponentialRampToValueAtTime(520, now + 0.38);

        meowGain.gain.setValueAtTime(0.01, now);
        meowGain.gain.linearRampToValueAtTime(0.18, now + 0.08);
        meowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

        meowOsc.connect(meowGain);
        meowGain.connect(this.ctx.destination);

        meowOsc.start(now);
        meowOsc.stop(now + 0.42);
        break;
      }

      case 'peacock': {
        // 🦚 White Peacock: Ethereal Royal Harp & Crystal Bell Chime
        const harpNotes = [
          { f: 659.25, t: 0, d: 0.18 }, // E5
          { f: 880.00, t: 0.08, d: 0.20 }, // A5
          { f: 1046.50, t: 0.16, d: 0.22 }, // C6
          { f: 1318.51, t: 0.24, d: 0.28 }, // E6
          { f: 1760.00, t: 0.32, d: 0.35 }  // A6
        ];
        harpNotes.forEach((note) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + note.t;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(note.f, t);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.18, t + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, t + note.d * 1.8);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + note.d * 1.8);
        });
        break;
      }

      case 'hanvika': {
        // 🐰 Bunny Meadow Hop
        const boingOsc = this.ctx.createOscillator();
        const boingGain = this.ctx.createGain();
        boingOsc.type = 'sine';
        boingOsc.frequency.setValueAtTime(320, now);
        boingOsc.frequency.exponentialRampToValueAtTime(780, now + 0.16);

        boingGain.gain.setValueAtTime(0.18, now);
        boingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        boingOsc.connect(boingGain);
        boingGain.connect(this.ctx.destination);
        boingOsc.start(now);
        boingOsc.stop(now + 0.2);
        break;
      }

      default:
        this.playClick();
    }
  }

  // 💃 CHARACTER DANCE RHYTHMS (Procedural Web Audio)
  playCharacterDanceRhythm(recipientId) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    switch (recipientId) {
      case 'cat': {
        // 🐱 Cat: Playful bouncing melody + cute meow pitch bends
        const bassNotes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63];
        bassNotes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + idx * 0.14;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.22);
        });

        // Meow accent
        const meowOsc = this.ctx.createOscillator();
        const meowGain = this.ctx.createGain();
        const meowTime = now + 0.88;
        meowOsc.type = 'sine';
        meowOsc.frequency.setValueAtTime(440, meowTime);
        meowOsc.frequency.exponentialRampToValueAtTime(880, meowTime + 0.16);
        meowOsc.frequency.exponentialRampToValueAtTime(659.25, meowTime + 0.38);

        meowGain.gain.setValueAtTime(0, meowTime);
        meowGain.gain.linearRampToValueAtTime(0.2, meowTime + 0.06);
        meowGain.gain.exponentialRampToValueAtTime(0.001, meowTime + 0.42);

        meowOsc.connect(meowGain);
        meowGain.connect(this.ctx.destination);
        meowOsc.start(meowTime);
        meowOsc.stop(meowTime + 0.42);
        break;
      }

      case 'duck': {
        // 🦆 Duck: Funny rhythmic quacks & splashes
        const quackSteps = [
          { t: 0.0, freq: 380, end: 270 },
          { t: 0.22, freq: 440, end: 310 },
          { t: 0.44, freq: 380, end: 270 },
          { t: 0.66, freq: 520, end: 360 },
          { t: 0.92, freq: 580, end: 400 }
        ];

        quackSteps.forEach((q) => {
          const qOsc = this.ctx.createOscillator();
          const qGain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();
          const t = now + q.t;

          qOsc.type = 'sawtooth';
          qOsc.frequency.setValueAtTime(q.freq, t);
          qOsc.frequency.linearRampToValueAtTime(q.end, t + 0.16);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(850, t);
          filter.Q.setValueAtTime(3.8, t);

          qGain.gain.setValueAtTime(0, t);
          qGain.gain.linearRampToValueAtTime(0.22, t + 0.02);
          qGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

          qOsc.connect(filter);
          filter.connect(qGain);
          qGain.connect(this.ctx.destination);

          qOsc.start(t);
          qOsc.stop(t + 0.18);
        });
        break;
      }

      case 'peacock': {
        // 🦚 White Peacock: Majestic Radiant Fanfare & Crystal Bells Melody
        const peacockMelody = [
          { f: 523.25, t: 0, d: 0.15 },    // C5
          { f: 659.25, t: 0.14, d: 0.15 }, // E5
          { f: 783.99, t: 0.28, d: 0.15 }, // G5
          { f: 1046.50, t: 0.42, d: 0.2 }, // C6
          { f: 1174.66, t: 0.58, d: 0.2 }, // D6
          { f: 1318.51, t: 0.74, d: 0.35 },// E6
          { f: 1567.98, t: 0.92, d: 0.45 } // G6
        ];

        peacockMelody.forEach((item) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + item.t;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(item.f, t);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + item.d * 2.2);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + item.d * 2.2);
        });

        // Sparkle shimmer overtone chimes
        [1760.00, 2093.00, 2637.00].forEach((f, idx) => {
          const cOsc = this.ctx.createOscillator();
          const cGain = this.ctx.createGain();
          const ct = now + 0.95 + idx * 0.09;

          cOsc.type = 'triangle';
          cOsc.frequency.setValueAtTime(f, ct);

          cGain.gain.setValueAtTime(0.12, ct);
          cGain.gain.exponentialRampToValueAtTime(0.001, ct + 0.35);

          cOsc.connect(cGain);
          cGain.connect(this.ctx.destination);
          cOsc.start(ct);
          cOsc.stop(ct + 0.35);
        });
        break;
      }

      case 'chiti': {
        // 🧸 Teddy Bear & Chiti: Warm joyful cuddle melody + soft glockenspiel
        const celebrationMelody = [
          { f: 523.25, d: 0.12 }, // C5
          { f: 659.25, d: 0.12 }, // E5
          { f: 783.99, d: 0.12 }, // G5
          { f: 1046.50, d: 0.20 }, // C6
          { f: 880.00, d: 0.12 },  // A5
          { f: 1046.50, d: 0.14 }, // C6
          { f: 1318.51, d: 0.35 }  // E6
        ];

        let elapsed = 0;
        celebrationMelody.forEach((note) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + elapsed;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(note.f, t);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.2, t + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, t + note.d * 2.5);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(t);
          osc.stop(t + note.d * 2.5);

          elapsed += note.d;
        });

        // High sparkle cascade
        [1567.98, 1975.53, 2349.32, 3135.96].forEach((f, i) => {
          const sOsc = this.ctx.createOscillator();
          const sGain = this.ctx.createGain();
          const st = now + elapsed + i * 0.06;
          sOsc.type = 'triangle';
          sOsc.frequency.setValueAtTime(f, st);
          sGain.gain.setValueAtTime(0.12, st);
          sGain.gain.exponentialRampToValueAtTime(0.001, st + 0.35);
          sOsc.connect(sGain);
          sGain.connect(this.ctx.destination);
          sOsc.start(st);
          sOsc.stop(st + 0.35);
        });
        break;
      }

      case 'hanvika': {
        // 🐰 Hanvika: Meadow hop xylophone
        const hopMelody = [
          { f: 587.33, d: 0.10 },
          { f: 739.99, d: 0.10 },
          { f: 880.00, d: 0.10 },
          { f: 1174.66, d: 0.18 },
          { f: 987.77, d: 0.10 },
          { f: 1174.66, d: 0.12 },
          { f: 1479.98, d: 0.30 }
        ];

        let elapsed = 0;
        hopMelody.forEach((note) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + elapsed;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note.f, t);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.22, t + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, t + note.d * 2.2);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(t);
          osc.stop(t + note.d * 2.2);

          elapsed += note.d;
        });
        break;
      }

      default:
        this.playMascot(recipientId);
    }
  }

  playDjDrop(recipientId) {
    this.playCharacterDanceRhythm(recipientId);
  }
}

export const soundFx = new SoundEngine();
