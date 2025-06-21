import React, { useEffect, useRef } from 'react';
import Noise from '../../utils/perlin';
import './WaveBackground.css';

const WaveBackground = () => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({
    x: -10,
    y: 0,
    lx: 0,
    ly: 0,
    sx: 0,
    sy: 0,
    v: 0,
    vs: 0,
    a: 0,
    set: false,
  });
  const linesRef = useRef([]);
  const pathsRef = useRef([]);
  const noiseRef = useRef(new Noise(Math.random()));
  const boundingRef = useRef({ width: 0, height: 0, left: 0, top: 0 });

  // Set size
  const setSize = () => {
    if (!containerRef.current) return;
    
    const bounding = containerRef.current.getBoundingClientRect();
    boundingRef.current = bounding;

    if (svgRef.current) {
      svgRef.current.style.width = `${bounding.width}px`;
      svgRef.current.style.height = `${bounding.height}px`;
    }
  };

  // Set lines
  const setLines = () => {
    const { width, height } = boundingRef.current;
    
    linesRef.current = [];

    pathsRef.current.forEach((path) => {
      path.remove();
    });
    pathsRef.current = [];

    const xGap = 10;
    const yGap = 32;

    const oWidth = width + 200;
    const oHeight = height + 30;

    const totalLines = Math.ceil(oWidth / xGap);
    const totalPoints = Math.ceil(oHeight / yGap);

    const xStart = (width - xGap * totalLines) / 2;
    const yStart = (height - yGap * totalPoints) / 2;

    for (let i = 0; i <= totalLines; i++) {
      const points = [];

      for (let j = 0; j <= totalPoints; j++) {
        const point = {
          x: xStart + xGap * i,
          y: yStart + yGap * j,
          wave: { x: 0, y: 0 },
          cursor: { x: 0, y: 0, vx: 0, vy: 0 },
        };

        points.push(point);
      }

      // Create path
      const path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      );
      path.classList.add('wave-line');

      if (svgRef.current) {
        svgRef.current.appendChild(path);
      }
      pathsRef.current.push(path);

      // Add points
      linesRef.current.push(points);
    }
  };

  // Update mouse position
  const updateMousePosition = (x, y) => {
    const mouse = mouseRef.current;
    const bounding = boundingRef.current;

    mouse.x = x - bounding.left;
    mouse.y = y - bounding.top + window.scrollY;

    if (!mouse.set) {
      mouse.sx = mouse.x;
      mouse.sy = mouse.y;
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;

      mouse.set = true;
    }
  };

  // Move points
  const movePoints = (time) => {
    const lines = linesRef.current;
    const mouse = mouseRef.current;
    const noise = noiseRef.current;

    lines.forEach((points) => {
      points.forEach((p) => {
        // Wave movement
        const move =
          noise.perlin2(
            (p.x + time * 0.0125) * 0.002,
            (p.y + time * 0.005) * 0.0015
          ) * 12;
        p.wave.x = Math.cos(move) * 32;
        p.wave.y = Math.sin(move) * 16;

        // Mouse effect
        const dx = p.x - mouse.sx;
        const dy = p.y - mouse.sy;
        const d = Math.hypot(dx, dy);
        const l = Math.max(175, mouse.vs);

        if (d < l) {
          const s = 1 - d / l;
          const f = Math.cos(d * 0.001) * s;

          p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065;
          p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065;
        }

        p.cursor.vx += (0 - p.cursor.x) * 0.005; // String tension
        p.cursor.vy += (0 - p.cursor.y) * 0.005;

        p.cursor.vx *= 0.925; // Friction/duration
        p.cursor.vy *= 0.925;

        p.cursor.x += p.cursor.vx * 2; // Strength
        p.cursor.y += p.cursor.vy * 2;

        p.cursor.x = Math.min(100, Math.max(-100, p.cursor.x)); // Clamp movement
        p.cursor.y = Math.min(100, Math.max(-100, p.cursor.y));
      });
    });
  };

  // Get point coordinates with movement added
  const moved = (point, withCursorForce = true) => {
    const coords = {
      x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
      y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
    };

    // Round to 2 decimals
    coords.x = Math.round(coords.x * 10) / 10;
    coords.y = Math.round(coords.y * 10) / 10;

    return coords;
  };

  // Draw lines
  const drawLines = () => {
    const lines = linesRef.current;
    const paths = pathsRef.current;
    
    lines.forEach((points, lIndex) => {
      let p1 = moved(points[0], false);

      let d = `M ${p1.x} ${p1.y}`;

      points.forEach((p1, pIndex) => {
        const isLast = pIndex === points.length - 1;

        p1 = moved(p1, !isLast);

        d += `L ${p1.x} ${p1.y}`;
      });

      if (paths[lIndex]) {
        paths[lIndex].setAttribute('d', d);
      }
    });
  };

  // Animation loop
  const tick = (time) => {
    const mouse = mouseRef.current;

    // Smooth mouse movement
    mouse.sx += (mouse.x - mouse.sx) * 0.1;
    mouse.sy += (mouse.y - mouse.sy) * 0.1;

    // Mouse velocity
    const dx = mouse.x - mouse.lx;
    const dy = mouse.y - mouse.ly;
    const d = Math.hypot(dx, dy);

    mouse.v = d;
    mouse.vs += (d - mouse.vs) * 0.1;
    mouse.vs = Math.min(100, mouse.vs);

    // Mouse last position
    mouse.lx = mouse.x;
    mouse.ly = mouse.y;

    // Mouse angle
    mouse.a = Math.atan2(dy, dx);

    // Update CSS variables
    if (containerRef.current) {
      containerRef.current.style.setProperty('--x', `${mouse.sx}px`);
      containerRef.current.style.setProperty('--y', `${mouse.sy}px`);
    }

    movePoints(time);
    drawLines();
    
    animationRef.current = requestAnimationFrame(tick);
  };

  // Event handlers
  const handleMouseMove = (e) => {
    updateMousePosition(e.pageX, e.pageY);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    updateMousePosition(touch.clientX, touch.clientY);
  };

  const handleResize = () => {
    setSize();
    setLines();
  };

  useEffect(() => {
    // Initialize
    setSize();
    setLines();

    // Start animation
    animationRef.current = requestAnimationFrame(tick);

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    if (containerRef.current) {
      containerRef.current.addEventListener('touchmove', handleTouchMove);
    }

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      if (containerRef.current) {
        containerRef.current.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, []);

  return (
    <div className="wave-background" ref={containerRef}>
      <svg ref={svgRef} className="wave-svg"></svg>
    </div>
  );
};

export default WaveBackground;