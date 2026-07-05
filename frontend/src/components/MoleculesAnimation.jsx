import { useEffect, useRef } from 'react';

const ATOM_COLORS = {
  Carbon: {
    base: '#4B5563',      // gray-600
    highlight: '#D1D5DB', // gray-300
    shadow: '#1F2937',    // gray-800
  },
  Oxygen: {
    base: '#EF4444',      // red-500
    highlight: '#FCA5A5', // red-300
    shadow: '#991B1B',    // red-800
  },
  Hydrogen: {
    base: '#E2E8F0',      // slate-200
    highlight: '#FFFFFF', // white
    shadow: '#94A3B8',    // slate-400
  },
  Nitrogen: {
    base: '#3B82F6',      // blue-500
    highlight: '#93C5FD', // blue-300
    shadow: '#1E40AF',    // blue-800
  }
};

const MOLECULE_TEMPLATES = [
  // CO2 (Carbon Dioxide)
  {
    name: 'CO2',
    atoms: [
      { x: 0, y: 0, z: 0, color: ATOM_COLORS.Carbon, radius: 10 },
      { x: -20, y: 0, z: 0, color: ATOM_COLORS.Oxygen, radius: 8 },
      { x: 20, y: 0, z: 0, color: ATOM_COLORS.Oxygen, radius: 8 }
    ],
    bonds: [
      { a: 0, b: 1, order: 2 },
      { a: 0, b: 2, order: 2 }
    ]
  },
  // CH4 (Methane)
  {
    name: 'CH4',
    atoms: [
      { x: 0, y: 0, z: 0, color: ATOM_COLORS.Carbon, radius: 10 },
      { x: 0, y: 15, z: 0, color: ATOM_COLORS.Hydrogen, radius: 5.5 },
      { x: -14, y: -6, z: 7, color: ATOM_COLORS.Hydrogen, radius: 5.5 },
      { x: 14, y: -6, z: 7, color: ATOM_COLORS.Hydrogen, radius: 5.5 },
      { x: 0, y: -6, z: -14, color: ATOM_COLORS.Hydrogen, radius: 5.5 }
    ],
    bonds: [
      { a: 0, b: 1, order: 1 },
      { a: 0, b: 2, order: 1 },
      { a: 0, b: 3, order: 1 },
      { a: 0, b: 4, order: 1 }
    ]
  },
  // CO (Carbon Monoxide)
  {
    name: 'CO',
    atoms: [
      { x: -9, y: 0, z: 0, color: ATOM_COLORS.Carbon, radius: 10 },
      { x: 9, y: 0, z: 0, color: ATOM_COLORS.Oxygen, radius: 8.5 }
    ],
    bonds: [
      { a: 0, b: 1, order: 3 }
    ]
  },
  // H2O (Water Vapor)
  {
    name: 'H2O',
    atoms: [
      { x: 0, y: 4, z: 0, color: ATOM_COLORS.Oxygen, radius: 8.5 },
      { x: -11, y: -7, z: 0, color: ATOM_COLORS.Hydrogen, radius: 5.5 },
      { x: 11, y: -7, z: 0, color: ATOM_COLORS.Hydrogen, radius: 5.5 }
    ],
    bonds: [
      { a: 0, b: 1, order: 1 },
      { a: 0, b: 2, order: 1 }
    ]
  },
  // O2 (Oxygen)
  {
    name: 'O2',
    atoms: [
      { x: -10, y: 0, z: 0, color: ATOM_COLORS.Oxygen, radius: 8.5 },
      { x: 10, y: 0, z: 0, color: ATOM_COLORS.Oxygen, radius: 8.5 }
    ],
    bonds: [
      { a: 0, b: 1, order: 2 }
    ]
  },
  // N2O (Nitrous Oxide)
  {
    name: 'N2O',
    atoms: [
      { x: -15, y: 0, z: 0, color: ATOM_COLORS.Nitrogen, radius: 8.5 },
      { x: 0, y: 0, z: 0, color: ATOM_COLORS.Nitrogen, radius: 8.5 },
      { x: 15, y: 0, z: 0, color: ATOM_COLORS.Oxygen, radius: 8.5 }
    ],
    bonds: [
      { a: 0, b: 1, order: 3 },
      { a: 1, b: 2, order: 1 }
    ]
  }
];

function rotateX(y, z, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    y: y * cos - z * sin,
    z: y * sin + z * cos
  };
}

function rotateY(x, z, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: x * cos + z * sin,
    z: -x * sin + z * cos
  };
}

function rotateZ(x, y, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos
  };
}

function rotatePoint(p, rx, ry, rz) {
  let { x, y, z } = p;
  
  // Rotate around X
  if (rx !== 0) {
    const rxVal = rotateX(y, z, rx);
    y = rxVal.y;
    z = rxVal.z;
  }
  
  // Rotate around Y
  if (ry !== 0) {
    const ryVal = rotateY(x, z, ry);
    x = ryVal.x;
    z = ryVal.z;
  }
  
  // Rotate around Z
  if (rz !== 0) {
    const rzVal = rotateZ(x, y, rz);
    x = rzVal.x;
    y = rzVal.y;
  }
  
  return { x, y, z };
}

export default function MoleculesAnimation({ theme }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const moleculesRef = useRef([]);
  const dimsRef = useRef({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle Resize
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      dimsRef.current = { width: rect.width, height: rect.height };
      
      // Initialize molecules if not already done, or scale them
      if (moleculesRef.current.length === 0) {
        initializeMolecules(rect.width, rect.height);
      }
    };

    const initializeMolecules = (w, h) => {
      const isMobile = w < 768;
      const count = isMobile ? 8 : 16;
      const list = [];
      
      for (let i = 0; i < count; i++) {
        const template = MOLECULE_TEMPLATES[i % MOLECULE_TEMPLATES.length];
        
        // Deep copy atoms/bonds
        const atoms = template.atoms.map(a => ({ ...a }));
        const bonds = template.bonds.map(b => ({ ...b }));
        
        const vx = (Math.random() - 0.5) * 0.4;
        const vy = (Math.random() - 0.5) * 0.4;
        const vz = (Math.random() - 0.5) * 0.3;

        list.push({
          name: template.name,
          atoms,
          bonds,
          // Spawning coordinates relative to screen center
          x: (Math.random() - 0.5) * w,
          y: (Math.random() - 0.5) * h,
          z: (Math.random() - 0.5) * 150,
          
          vx,
          vy,
          vz,
          
          rx: Math.random() * Math.PI * 2,
          ry: Math.random() * Math.PI * 2,
          rz: Math.random() * Math.PI * 2,
          
          rvx: (Math.random() - 0.5) * 0.012,
          rvy: (Math.random() - 0.5) * 0.012,
          rvz: (Math.random() - 0.5) * 0.012,
          
          // Target baseline drift
          targetVx: vx,
          targetVy: vy,
          targetVz: vz,
          targetRvx: (Math.random() - 0.5) * 0.008,
          targetRvy: (Math.random() - 0.5) * 0.008,
          targetRvz: (Math.random() - 0.5) * 0.008,
        });
      }
      moleculesRef.current = list;
    };

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Track cursor coordinates globally on the window
  useEffect(() => {
    const handleMouseMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      
      mouseRef.current.x = clientX - rect.left;
      mouseRef.current.y = clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Animation Loop
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      const { width, height } = dimsRef.current;
      const dpr = window.devicePixelRatio || 1;
      
      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // Adjust overall opacity for ambient look
      ctx.globalAlpha = theme === 'dark' ? 0.42 : 0.28;

      const focalLength = 350;
      const mx = mouseRef.current.x - width / 2;
      const my = mouseRef.current.y - height / 2;
      const mouseActive = mouseRef.current.active;
      const repelRadius = 160;

      // Update positions and velocities
      moleculesRef.current.forEach(m => {
        // Update rotations
        m.rx += m.rvx;
        m.ry += m.rvy;
        m.rz += m.rvz;

        // Base floating drift
        m.x += m.vx;
        m.y += m.vy;
        m.z += m.vz;

        // Project center for cursor interaction calculation
        const scale = focalLength / (focalLength + m.z);
        const projX = m.x * scale;
        const projY = m.y * scale;

        // Flee cursor logic
        if (mouseActive) {
          const dx = projX - mx;
          const dy = projY - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < repelRadius) {
            const force = (1 - dist / repelRadius); // 0 to 1
            const repelStrength = force * force * 1.6;
            const angle = Math.atan2(dy, dx);
            
            // Push molecule away in 2D
            m.vx += Math.cos(angle) * repelStrength;
            m.vy += Math.sin(angle) * repelStrength;
            
            // Random depth deflection (extra 3D feel!)
            m.vz += (Math.random() - 0.5) * repelStrength * 0.8;
            
            // Boost rotation when repelled (makes them tumble dynamically!)
            m.rvx += (Math.random() - 0.5) * force * 0.05;
            m.rvy += (Math.random() - 0.5) * force * 0.05;
            m.rvz += (Math.random() - 0.5) * force * 0.05;
          }
        }

        // Return slowly to baseline velocities (damping)
        m.vx += (m.targetVx - m.vx) * 0.04;
        m.vy += (m.targetVy - m.vy) * 0.04;
        m.vz += (m.targetVz - m.vz) * 0.04;
        m.rvx += (m.targetRvx - m.rvx) * 0.04;
        m.rvy += (m.targetRvy - m.rvy) * 0.04;
        m.rvz += (m.targetRvz - m.rvz) * 0.04;

        // Speed Limit Clamping
        const speed = Math.sqrt(m.vx * m.vx + m.vy * m.vy + m.vz * m.vz);
        const maxSpeed = 7;
        if (speed > maxSpeed) {
          m.vx = (m.vx / speed) * maxSpeed;
          m.vy = (m.vy / speed) * maxSpeed;
          m.vz = (m.vz / speed) * maxSpeed;
        }

        // Soft restoring force boundary check (Floating inside aquarium)
        const boundX = width / 2 + 60;
        if (m.x > boundX) m.vx -= 0.04;
        else if (m.x < -boundX) m.vx += 0.04;

        const boundY = height / 2 + 60;
        if (m.y > boundY) m.vy -= 0.04;
        else if (m.y < -boundY) m.vy += 0.04;

        const boundZ = 160;
        if (m.z > boundZ) m.vz -= 0.04;
        else if (m.z < -boundZ) m.vz += 0.04;
      });

      // Prepare list of drawable atoms & bonds
      const drawList = [];

      moleculesRef.current.forEach((m, moleculeIdx) => {
        // Rotate local coordinate of each atom
        const rotatedAtoms = m.atoms.map(atom => {
          const rot = rotatePoint(atom, m.rx, m.ry, m.rz);
          return {
            ...atom,
            ax: m.x + rot.x,
            ay: m.y + rot.y,
            az: m.z + rot.z
          };
        });

        // Project rotated atoms to 2D
        const projectedAtoms = rotatedAtoms.map(atom => {
          const scale = focalLength / (focalLength + atom.az);
          return {
            ...atom,
            projX: width / 2 + atom.ax * scale,
            projY: height / 2 + atom.ay * scale,
            projR: Math.max(1, atom.radius * scale),
            scale
          };
        });

        // Add Atoms to Draw List
        projectedAtoms.forEach((atom, atomIdx) => {
          drawList.push({
            type: 'atom',
            x: atom.projX,
            y: atom.projY,
            r: atom.projR,
            color: atom.color,
            z: atom.az,
            scale: atom.scale,
            id: `${moleculeIdx}-a-${atomIdx}`
          });
        });

        // Add Bonds to Draw List
        m.bonds.forEach((bond, bondIdx) => {
          const atomA = projectedAtoms[bond.a];
          const atomB = projectedAtoms[bond.b];
          if (!atomA || !atomB) return;

          drawList.push({
            type: 'bond',
            x1: atomA.projX,
            y1: atomA.projY,
            x2: atomB.projX,
            y2: atomB.projY,
            colorA: atomA.color,
            colorB: atomB.color,
            z: (atomA.az + atomB.az) / 2,
            order: bond.order,
            scale: (atomA.scale + atomB.scale) / 2,
            id: `${moleculeIdx}-b-${bondIdx}`
          });
        });
      });

      // Painter's Algorithm Depth Sort (Draw furthest elements first)
      drawList.sort((a, b) => b.z - a.z);

      // Render Everything
      drawList.forEach(item => {
        if (item.type === 'atom') {
          // Draw Atom
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
          
          // Radial Gradient for 3D Sphere Effect
          const highlightX = item.x - item.r * 0.3;
          const highlightY = item.y - item.r * 0.3;
          const grad = ctx.createRadialGradient(
            highlightX, highlightY, item.r * 0.08,
            item.x, item.y, item.r
          );
          grad.addColorStop(0, item.color.highlight);
          grad.addColorStop(0.4, item.color.base);
          grad.addColorStop(1, item.color.shadow);
          
          ctx.fillStyle = grad;
          ctx.fill();
        } else if (item.type === 'bond') {
          // Draw Bond Line(s)
          const baseWidth = 3;
          const lineWidth = Math.max(0.5, baseWidth * item.scale);
          
          // Linear Gradient matching atom colors
          const grad = ctx.createLinearGradient(item.x1, item.y1, item.x2, item.y2);
          grad.addColorStop(0, item.colorA.base);
          grad.addColorStop(1, item.colorB.base);
          ctx.strokeStyle = grad;
          ctx.lineCap = 'round';

          if (item.order === 1) {
            ctx.beginPath();
            ctx.moveTo(item.x1, item.y1);
            ctx.lineTo(item.x2, item.y2);
            ctx.lineWidth = lineWidth;
            ctx.stroke();
          } else if (item.order === 2) {
            // Double Bond: Render two parallel lines offset by perpendicular vector
            const dx = item.x2 - item.x1;
            const dy = item.y2 - item.y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            
            if (len > 0) {
              const px = -dy / len;
              const py = dx / len;
              const offset = 2.5 * item.scale;
              
              ctx.lineWidth = lineWidth * 0.8;

              // Line 1
              ctx.beginPath();
              ctx.moveTo(item.x1 + px * offset, item.y1 + py * offset);
              ctx.lineTo(item.x2 + px * offset, item.y2 + py * offset);
              ctx.stroke();

              // Line 2
              ctx.beginPath();
              ctx.moveTo(item.x1 - px * offset, item.y1 - py * offset);
              ctx.lineTo(item.x2 - px * offset, item.y2 - py * offset);
              ctx.stroke();
            }
          } else if (item.order === 3) {
            // Triple Bond: Render three lines
            const dx = item.x2 - item.x1;
            const dy = item.y2 - item.y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            
            if (len > 0) {
              const px = -dy / len;
              const py = dx / len;
              const offset = 3.5 * item.scale;
              
              ctx.lineWidth = lineWidth * 0.7;

              // Line 1 (Center)
              ctx.beginPath();
              ctx.moveTo(item.x1, item.y1);
              ctx.lineTo(item.x2, item.y2);
              ctx.stroke();

              // Line 2 (+offset)
              ctx.beginPath();
              ctx.moveTo(item.x1 + px * offset, item.y1 + py * offset);
              ctx.lineTo(item.x2 + px * offset, item.y2 + py * offset);
              ctx.stroke();

              // Line 3 (-offset)
              ctx.beginPath();
              ctx.moveTo(item.x1 - px * offset, item.y1 - py * offset);
              ctx.lineTo(item.x2 - px * offset, item.y2 - py * offset);
              ctx.stroke();
            }
          }
        }
      });

      ctx.restore();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'block'
      }}
    />
  );
}
