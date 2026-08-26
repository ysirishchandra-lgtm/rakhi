import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas({ recipient }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const type = recipient?.particles?.type || 'chiti';
    const colors = recipient?.particles?.colors || ['#ff3366', '#ffd166', '#ffffff'];
    const density = recipient?.particles?.density || 30;

    // Particle pool
    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 20;
        this.size = Math.random() * 14 + 10;
        this.speedY = -(Math.random() * 0.8 + 0.4) * (recipient?.particles?.speed || 1);
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.03;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.pulse = Math.random() * Math.PI;
        this.pulseSpeed = 0.03 + Math.random() * 0.02;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.shapeKind = Math.floor(Math.random() * 4);
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.pulse) * 0.4;
        this.rotation += this.rotSpeed;
        this.pulse += this.pulseSpeed;

        if (this.y < -40 || this.x < -40 || this.x > width + 40) {
          this.reset(false);
        }
      }

      draw(c) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);
        c.globalAlpha = Math.max(0.1, Math.min(1, this.opacity + Math.sin(this.pulse) * 0.2));

        if (type === 'chiti') {
          this.drawChitiShape(c);
        } else if (type === 'duck') {
          this.drawDuckShape(c);
        } else if (type === 'cat') {
          this.drawCatShape(c);
        } else if (type === 'peacock') {
          this.drawPeacockShape(c);
        }

        c.restore();
      }

      // ❤️ CHITI: Hearts, Petals, Stars, Sparkles
      drawChitiShape(c) {
        c.fillStyle = this.color;
        const s = this.size * 0.6;

        if (this.shapeKind === 0) {
          // Heart
          c.beginPath();
          c.moveTo(0, -s * 0.4);
          c.bezierCurveTo(-s * 0.8, -s, -s * 1.2, 0, 0, s);
          c.bezierCurveTo(s * 1.2, 0, s * 0.8, -s, 0, -s * 0.4);
          c.fill();
        } else if (this.shapeKind === 1) {
          // Flower Petal
          c.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const px = Math.cos(angle) * s * 0.7;
            const py = Math.sin(angle) * s * 0.7;
            c.arc(px, py, s * 0.35, 0, Math.PI * 2);
          }
          c.fill();
          c.fillStyle = '#fff';
          c.beginPath();
          c.arc(0, 0, s * 0.2, 0, Math.PI * 2);
          c.fill();
        } else {
          // Sparkle 4-point star
          c.beginPath();
          for (let i = 0; i < 8; i++) {
            const r = i % 2 === 0 ? s * 0.8 : s * 0.25;
            const a = (i * Math.PI) / 4;
            const px = Math.cos(a) * r;
            const py = Math.sin(a) * r;
            if (i === 0) c.moveTo(px, py);
            else c.lineTo(px, py);
          }
          c.closePath();
          c.fill();
        }
      }

      // 🦆 DUCK: Bubbles, Swaying Feathers, Water Droplets, Little Duckling
      drawDuckShape(c) {
        const s = this.size * 0.7;

        if (this.shapeKind === 0 || this.shapeKind === 1) {
          // Translucent Water Bubble with specular reflection
          c.strokeStyle = this.color;
          c.lineWidth = 1.5;
          c.fillStyle = 'rgba(255, 255, 255, 0.08)';
          c.beginPath();
          c.arc(0, 0, s, 0, Math.PI * 2);
          c.fill();
          c.stroke();

          // Highlight crescent
          c.fillStyle = 'rgba(255, 255, 255, 0.6)';
          c.beginPath();
          c.arc(-s * 0.35, -s * 0.35, s * 0.25, 0, Math.PI * 2);
          c.fill();
        } else if (this.shapeKind === 2) {
          // Yellow Duck Feather
          c.fillStyle = '#facc15';
          c.beginPath();
          c.moveTo(0, -s * 1.2);
          c.quadraticCurveTo(s * 0.5, 0, 0, s * 1.2);
          c.quadraticCurveTo(-s * 0.5, 0, 0, -s * 1.2);
          c.fill();
          c.strokeStyle = '#ffffff';
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(0, -s * 1.1);
          c.lineTo(0, s * 1.1);
          c.stroke();
        } else {
          // Water Ripple Ring
          c.strokeStyle = this.color;
          c.lineWidth = 1.2;
          c.beginPath();
          c.ellipse(0, 0, s * 1.2, s * 0.6, 0, 0, Math.PI * 2);
          c.stroke();
        }
      }

      // 🐱 CAT: Paw Prints, Yarn Balls, Fish Cracker, Playful Stars
      drawCatShape(c) {
        const s = this.size * 0.65;

        if (this.shapeKind === 0 || this.shapeKind === 1) {
          // Cute Paw Print (Main pad + 4 beans)
          c.fillStyle = this.color;
          // Main palm
          c.beginPath();
          c.ellipse(0, s * 0.2, s * 0.55, s * 0.45, 0, 0, Math.PI * 2);
          c.fill();

          // 4 toe beans
          const toeOffsets = [
            { x: -s * 0.55, y: -s * 0.3 },
            { x: -s * 0.2, y: -s * 0.55 },
            { x: s * 0.2, y: -s * 0.55 },
            { x: s * 0.55, y: -s * 0.3 }
          ];
          toeOffsets.forEach((t) => {
            c.beginPath();
            c.arc(t.x, t.y, s * 0.18, 0, Math.PI * 2);
            c.fill();
          });
        } else if (this.shapeKind === 2) {
          // Yarn Ball with swirl
          c.fillStyle = this.color;
          c.beginPath();
          c.arc(0, 0, s * 0.7, 0, Math.PI * 2);
          c.fill();

          // Thread lines
          c.strokeStyle = '#ffffff';
          c.lineWidth = 1.2;
          c.beginPath();
          c.arc(0, 0, s * 0.4, 0, Math.PI * 1.5);
          c.stroke();

          // Trailing string
          c.beginPath();
          c.moveTo(s * 0.4, s * 0.4);
          c.quadraticCurveTo(s * 0.9, s * 0.9, s * 1.4, s * 0.6);
          c.stroke();
        } else {
          // Fish cracker symbol
          c.fillStyle = this.color;
          c.beginPath();
          c.ellipse(-s * 0.2, 0, s * 0.6, s * 0.35, 0, 0, Math.PI * 2);
          c.fill();
          // Tail
          c.beginPath();
          c.moveTo(s * 0.3, 0);
          c.lineTo(s * 0.8, -s * 0.4);
          c.lineTo(s * 0.8, s * 0.4);
          c.closePath();
          c.fill();
        }
      }

      // 🦚 WHITE PEACOCK: Feathers, Crystals, Starbursts
      drawPeacockShape(c) {
        const s = this.size * 0.7;

        if (this.shapeKind === 0 || this.shapeKind === 1) {
          // Royal Peacock Plume with eye
          c.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          c.lineWidth = 1.2;
          c.beginPath();
          c.moveTo(0, s * 1.3);
          c.quadraticCurveTo(-s * 0.3, 0, 0, -s * 1.3);
          c.stroke();

          // Feather eye outer
          c.fillStyle = 'rgba(16, 185, 129, 0.4)';
          c.beginPath();
          c.ellipse(0, -s * 0.5, s * 0.6, s * 0.8, 0, 0, Math.PI * 2);
          c.fill();

          // Feather eye inner sapphire
          c.fillStyle = '#0284c7';
          c.beginPath();
          c.ellipse(0, -s * 0.5, s * 0.35, s * 0.5, 0, 0, Math.PI * 2);
          c.fill();

          // White center glint
          c.fillStyle = '#ffffff';
          c.beginPath();
          c.arc(0, -s * 0.5, s * 0.15, 0, Math.PI * 2);
          c.fill();
        } else if (this.shapeKind === 2) {
          // Brilliant Diamond Crystal
          c.fillStyle = this.color;
          c.beginPath();
          c.moveTo(0, -s);
          c.lineTo(s * 0.7, 0);
          c.lineTo(0, s);
          c.lineTo(-s * 0.7, 0);
          c.closePath();
          c.fill();
          c.strokeStyle = '#ffffff';
          c.lineWidth = 1;
          c.stroke();
        } else {
          // Celestial Starlight Cross
          c.fillStyle = '#ffffff';
          c.beginPath();
          for (let i = 0; i < 8; i++) {
            const r = i % 2 === 0 ? s * 1.1 : s * 0.2;
            const a = (i * Math.PI) / 4;
            const px = Math.cos(a) * r;
            const py = Math.sin(a) * r;
            if (i === 0) c.moveTo(px, py);
            else c.lineTo(px, py);
          }
          c.closePath();
          c.fill();
        }
      }
    }

    const particles = Array.from({ length: density }, () => new Particle());

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [recipient]);

  return (
    <canvas
      ref={canvasRef}
      id="ambient-particle-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
}
