/**
 * Confetti animation utility for celebrating successful RSVP submissions
 * Uses canvas-based animation with camping-themed colors
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'rect' | 'circle' | 'star';
  opacity: number;
  gravity: number;
}

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  duration?: number;
  colors?: string[];
}

// Camping-themed confetti colors (from CSS variables)
const CONFETTI_COLORS = [
  '#2d5a3d', // forest
  '#3d7a52', // forest-light
  '#87a878', // sage
  '#e07b39', // campfire
  '#f0975a', // campfire-light
  '#f7c948', // golden
  '#d4573b', // ember
  '#f5a962', // sunset
  '#5c4033', // bark
];

const DEFAULT_OPTIONS: Required<ConfettiOptions> = {
  particleCount: 100,
  spread: 70,
  startVelocity: 45,
  duration: 3000,
  colors: CONFETTI_COLORS,
};

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let animationId: number | null = null;

/**
 * Creates and initializes the confetti canvas
 */
function createCanvas(): HTMLCanvasElement {
  const existingCanvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
  if (existingCanvas) {
    return existingCanvas;
  }

  const newCanvas = document.createElement('canvas');
  newCanvas.id = 'confetti-canvas';
  newCanvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: var(--z-confetti, 500);
  `;
  document.body.appendChild(newCanvas);
  return newCanvas;
}

/**
 * Resizes the canvas to match window dimensions
 */
function resizeCanvas(): void {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

/**
 * Creates a single confetti particle
 */
function createParticle(options: Required<ConfettiOptions>): Particle {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight * 0.3;

  const angle = (Math.random() - 0.5) * options.spread * (Math.PI / 180);
  const velocity = options.startVelocity * (0.5 + Math.random() * 0.5);

  const shapes: Particle['shape'][] = ['rect', 'circle', 'star'];

  return {
    x: centerX + (Math.random() - 0.5) * 20,
    y: centerY,
    vx: Math.sin(angle) * velocity,
    vy: -Math.cos(angle) * velocity,
    color: options.colors[Math.floor(Math.random() * options.colors.length)],
    size: 6 + Math.random() * 6,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 15,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    opacity: 1,
    gravity: 0.3 + Math.random() * 0.2,
  };
}

/**
 * Draws a star shape
 */
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
): void {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

/**
 * Draws a single particle
 */
function drawParticle(particle: Particle): void {
  if (!ctx) return;

  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate((particle.rotation * Math.PI) / 180);
  ctx.globalAlpha = particle.opacity;
  ctx.fillStyle = particle.color;

  const halfSize = particle.size / 2;

  switch (particle.shape) {
    case 'rect':
      ctx.fillRect(-halfSize, -halfSize * 0.6, particle.size, particle.size * 0.6);
      break;
    case 'circle':
      ctx.beginPath();
      ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'star':
      drawStar(ctx, 0, 0, 5, halfSize, halfSize * 0.5);
      break;
  }

  ctx.restore();
}

/**
 * Updates particle positions and properties
 */
function updateParticle(particle: Particle, deltaTime: number): void {
  const timeScale = deltaTime / 16.67; // Normalize to ~60fps

  particle.x += particle.vx * timeScale;
  particle.y += particle.vy * timeScale;
  particle.vy += particle.gravity * timeScale;
  particle.vx *= 0.99;
  particle.rotation += particle.rotationSpeed * timeScale;

  // Fade out as particle falls
  if (particle.y > window.innerHeight * 0.6) {
    particle.opacity -= 0.02 * timeScale;
  }
}

/**
 * Main animation loop
 */
function animate(startTime: number, duration: number, lastTime: number): void {
  const currentTime = performance.now();
  const deltaTime = currentTime - lastTime;
  const elapsed = currentTime - startTime;

  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw particles
  particles = particles.filter((particle) => {
    updateParticle(particle, deltaTime);
    drawParticle(particle);
    return particle.opacity > 0 && particle.y < window.innerHeight + 100;
  });

  // Continue animation if there are particles and within duration
  if (particles.length > 0 && elapsed < duration + 2000) {
    animationId = requestAnimationFrame(() => animate(startTime, duration, currentTime));
  } else {
    cleanup();
  }
}

/**
 * Cleans up the confetti canvas
 */
function cleanup(): void {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  if (canvas && canvas.parentNode) {
    canvas.parentNode.removeChild(canvas);
  }
  canvas = null;
  ctx = null;
  particles = [];
}

/**
 * Triggers the confetti animation
 */
export function triggerConfetti(options: ConfettiOptions = {}): void {
  // Stop any existing animation
  cleanup();

  const mergedOptions: Required<ConfettiOptions> = { ...DEFAULT_OPTIONS, ...options };

  // Create canvas
  canvas = createCanvas();
  ctx = canvas.getContext('2d');
  if (!ctx) return;

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Create particles
  particles = [];
  for (let i = 0; i < mergedOptions.particleCount; i++) {
    particles.push(createParticle(mergedOptions));
  }

  // Start animation
  const startTime = performance.now();
  animationId = requestAnimationFrame(() => animate(startTime, mergedOptions.duration, startTime));

  // Cleanup after duration + buffer
  setTimeout(() => {
    window.removeEventListener('resize', resizeCanvas);
    cleanup();
  }, mergedOptions.duration + 3000);
}

/**
 * Stops the confetti animation immediately
 */
export function stopConfetti(): void {
  cleanup();
}
