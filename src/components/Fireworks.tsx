import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  speed: number;
  size: number;
}

interface Firework {
  id: number;
  x: number;
  y: number;
  particles: Particle[];
}

interface FireworksProps {
  onComplete?: () => void;
}

const COLORS = ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#ff6b6b', '#feca57', '#48dbfb'];

function createParticles(x: number, y: number, fireworkId: number): Particle[] {
  const particles: Particle[] = [];
  const particleCount = 30 + Math.floor(Math.random() * 20);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      id: fireworkId * 100 + i,
      x,
      y,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      angle: (Math.PI * 2 * i) / particleCount + Math.random() * 0.3,
      speed: 2 + Math.random() * 4,
      size: 3 + Math.random() * 3,
    });
  }

  return particles;
}

export function Fireworks({ onComplete }: FireworksProps) {
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Launch fireworks at intervals
    const launchFirework = (id: number) => {
      const x = 20 + Math.random() * 60; // 20-80% of screen width
      const y = 20 + Math.random() * 40; // 20-60% of screen height
      const particles = createParticles(x, y, id);

      setFireworks((prev) => [...prev, { id, x, y, particles }]);

      // Remove this firework after animation
      setTimeout(() => {
        setFireworks((prev) => prev.filter((f) => f.id !== id));
      }, 1500);
    };

    // Launch multiple fireworks
    const timeouts: number[] = [];
    for (let i = 0; i < 8; i++) {
      timeouts.push(window.setTimeout(() => launchFirework(i), i * 400 + Math.random() * 200));
    }

    // Auto-hide after 4 seconds
    const hideTimer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 4000);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  const handleClick = () => {
    setVisible(false);
    onComplete?.();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-auto z-50 overflow-hidden"
      onClick={handleClick}
    >
      {fireworks.map((firework) => (
        <div key={firework.id} className="absolute inset-0">
          {firework.particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full animate-firework-particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                '--angle': `${particle.angle}rad`,
                '--speed': particle.speed,
              } as React.CSSProperties}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
