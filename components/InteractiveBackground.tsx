"use client";

import { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  baseX: number;
  baseY: number;
  density: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.baseX = this.x;
    this.baseY = this.y;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.2;
    this.speedY = (Math.random() - 0.5) * 0.2;
    this.density = (Math.random() * 30) + 1;
  }

  update(mouse: { x: number; y: number; radius: number }, width: number, height: number) {
    // Slowly drift
    this.baseX += this.speedX;
    this.baseY += this.speedY;

    // Wrap around screen
    if (this.baseX > width) this.baseX = 0;
    if (this.baseX < 0) this.baseX = width;
    if (this.baseY > height) this.baseY = 0;
    if (this.baseY < 0) this.baseY = height;

    // Interaction with mouse
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (distance < maxDistance) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 20; // return to base
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 20; // return to base
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgba(110, 231, 183, 0.5)"; // emerald-300 with opacity
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

class TrailParticle {
  x: number;
  y: number;
  size: number;
  life: number;
  color: string;
  speedX: number;
  speedY: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 1;
    this.life = 1;
    this.color = `rgba(110, 231, 183, 1)`;
    this.speedX = (Math.random() - 0.5) * 1;
    this.speedY = (Math.random() - 0.5) * 1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 0.02; // Fade out speed
    this.size *= 0.95;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(110, 231, 183, ${this.life * 0.5})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particlesArray: Particle[] = [];
    let trailArray: TrailParticle[] = [];

    const mouse = {
      x: -1000, // offscreen start
      y: -1000,
      radius: 120, // interaction radius
    };

    // Smooth lerping mouse for spotlight
    const lerpedMouse = { x: -1000, y: -1000 };

    // Canvas size setup
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener("resize", setCanvasSize);

    // Track mouse
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      
      // Spawn trail occasionally to prevent visual clutter
      if (Math.random() > 0.4) {
        trailArray.push(new TrailParticle(mouse.x, mouse.y));
      }
    };
    
    // Parallax logic (just shifting canvas slightly)
    let canvasOffsetX = 0;
    let canvasOffsetY = 0;

    window.addEventListener("mousemove", handleMouseMove);

    const init = () => {
      particlesArray = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000); // responsive count
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lerp mouse for smooth spotlight lag
      lerpedMouse.x += (mouse.x - lerpedMouse.x) * 0.05;
      lerpedMouse.y += (mouse.y - lerpedMouse.y) * 0.05;

      // Draw Spotlight (Background Glow)
      const gradient = ctx.createRadialGradient(
        lerpedMouse.x, lerpedMouse.y, 0,
        lerpedMouse.x, lerpedMouse.y, 400
      );
      gradient.addColorStop(0, "rgba(34, 197, 94, 0.05)"); // eco-500 very faint
      gradient.addColorStop(1, "transparent");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update stars
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(mouse, canvas.width, canvas.height);
        particlesArray[i].draw(ctx);
      }

      // Draw and update trail
      for (let i = 0; i < trailArray.length; i++) {
        trailArray[i].update();
        trailArray[i].draw(ctx);
        if (trailArray[i].life <= 0 || trailArray[i].size <= 0.1) {
          trailArray.splice(i, 1);
          i--;
        }
      }
      
      // Subtle canvas parallax (move the whole canvas slightly opposite to mouse)
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const targetOffsetX = (mouse.x - centerX) * -0.01;
      const targetOffsetY = (mouse.y - centerY) * -0.01;
      
      canvasOffsetX += (targetOffsetX - canvasOffsetX) * 0.05;
      canvasOffsetY += (targetOffsetY - canvasOffsetY) * 0.05;
      
      canvas.style.transform = `translate(${canvasOffsetX}px, ${canvasOffsetY}px) scale(1.02)`;

      animationFrameId = requestAnimationFrame(animate);
    };

    setCanvasSize();
    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-2] pointer-events-none w-full h-full"
    />
  );
}
