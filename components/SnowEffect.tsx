import React, { useEffect, useRef } from 'react';

export const SnowEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId: number;

    // Responsive configuration
    const getParticleCount = (w: number, h: number) => {
      // Limit particles on mobile for performance, more on desktop
      const isMobile = w < 768;
      const area = w * h;
      // Increased density (lower number = more particles) and caps for heavier snow
      const density = isMobile ? 4000 : 2500; 
      return Math.min(isMobile ? 150 : 350, Math.floor(area / density));
    };

    interface Particle {
      x: number;
      y: number;
      radius: number;
      speed: number;
      wind: number;
      opacity: number;
      wobble: number;
      wobbleSpeed: number;
    }

    const particles: Particle[] = [];

    const init = () => {
      const parent = canvas.parentElement;
      if (parent) {
        width = parent.offsetWidth;
        height = parent.offsetHeight;
      } else {
        width = window.innerWidth;
        height = window.innerHeight;
      }

      // Handle High DPI displays for crisp circles
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Initialize particles
      const count = getParticleCount(width, height);
      particles.length = 0;
      
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(true));
      }
    };

    const createParticle = (randomY = false): Particle => {
      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : -10,
        radius: Math.random() * 2 + 0.5, // 0.5px to 2.5px
        speed: Math.random() * 1.5 + 0.5, // Falling speed
        wind: Math.random() * 0.5 - 0.25, // Slight horizontal drift
        opacity: Math.random() * 0.5 + 0.1, // 0.1 to 0.6 opacity
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.05 + 0.01
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();

        // Update position
        p.y += p.speed;
        p.x += p.wind + Math.sin(p.wobble) * 0.3;
        p.wobble += p.wobbleSpeed;

        // Reset if out of bounds
        if (p.y > height) {
          Object.assign(p, createParticle());
        }
        // Wrap around horizontally
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;
      });

      animationId = requestAnimationFrame(draw);
    };

    // Initialize and start animation
    init();
    draw();

    // Handle resize with debounce
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(init, 200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-10 opacity-80 mix-blend-screen"
      aria-hidden="true"
    />
  );
};