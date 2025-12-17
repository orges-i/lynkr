import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface AntigravityInnerProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  waveAmplitude?: number;
  waveSpeed?: number;
}

const AntigravityInner: React.FC<AntigravityInnerProps> = ({
  count = 150,
  magnetRadius = 18,
  ringRadius = 12,
  particleSize = 1.5,
  lerpSpeed = 0.1,
  color = '#FFFFFF',
  autoAnimate = true,
  waveAmplitude = 0.8,
  waveSpeed = 0.5
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport, gl, camera } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      gl.dispose();
      gl.forceContextLoss();
    };
  }, [gl]);

  // Global mouse tracking (on window, not canvas)
  const globalMouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });
  const lastMouseMoveTime = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Convert to Normalized Device Coordinates (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      globalMouse.current = { x, y };
      lastMouseMoveTime.current = Date.now();
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize particles with random positions and unique offsets
  const particles = useMemo(() => {
    const temp = [];
    const width = viewport.width || 50;
    const height = viewport.height || 50;

    for (let i = 0; i < count; i++) {
      // Scatter in 3D box volume
      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      const z = (Math.random() - 0.5) * 20;

      // Unique random offset for organic movement
      const randomOffset = Math.random() * Math.PI * 2;
      const uniqueId = i;

      temp.push({
        cx: x,
        cy: y,
        cz: z,
        randomOffset,
        uniqueId
      });
    }
    return temp;
  }, [count, viewport.width, viewport.height]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const { viewport: v } = state;
    const time = state.clock.getElapsedTime();

    // Map NDC to viewport coordinates based on camera Z-depth
    let targetX = (globalMouse.current.x * v.width) / 2;
    let targetY = (globalMouse.current.y * v.height) / 2;

    // Auto-animate when idle
    if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
      targetX = Math.sin(time * 0.5) * (v.width / 4);
      targetY = Math.cos(time * 0.5 * 2) * (v.height / 4);
    }

    // Smooth lerp for weighted magnet effect
    smoothMouse.current.x += (targetX - smoothMouse.current.x) * lerpSpeed;
    smoothMouse.current.y += (targetY - smoothMouse.current.y) * lerpSpeed;

    const mouseX = smoothMouse.current.x;
    const mouseY = smoothMouse.current.y;

    particles.forEach((particle, i) => {
      const { cx, cy, cz, randomOffset, uniqueId } = particle;

      // Calculate distance to mouse
      const dx = cx - mouseX;
      const dy = cy - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetPos = { x: cx, y: cy, z: cz };

      // Magnetism threshold
      if (dist < magnetRadius) {
        // Calculate angle from mouse to particle
        const angle = Math.atan2(dy, dx);

        // Wave function for organic wobble
        const wave = Math.sin(time * waveSpeed + angle + randomOffset) * waveAmplitude;

        // Jitter for non-perfect circle (reduced for more uniform distribution)
        const jitter = Math.sin(uniqueId * 0.1 + time * 0.3) * 0.2;

        // Current ring radius with wave and jitter
        const currentRadius = ringRadius + wave + jitter;

        // Force particle to ring position
        targetPos.x = mouseX + currentRadius * Math.cos(angle);
        targetPos.y = mouseY + currentRadius * Math.sin(angle);
        targetPos.z = cz + Math.sin(time + uniqueId * 0.1) * 0.5;
      }

      // Lerp to target position
      particle.cx += (targetPos.x - particle.cx) * lerpSpeed;
      particle.cy += (targetPos.y - particle.cy) * lerpSpeed;
      particle.cz += (targetPos.z - particle.cz) * lerpSpeed;

      // Position particle
      dummy.position.set(particle.cx, particle.cy, particle.cz);

      // Look at mouse position
      dummy.lookAt(mouseX, mouseY, particle.cz);

      // Rotate 90 degrees on X-axis so tip points at center
      dummy.rotateX(Math.PI / 2);

      // Scaling based on proximity to ring
      const currentDistToMouse = Math.sqrt(
        Math.pow(particle.cx - mouseX, 2) + Math.pow(particle.cy - mouseY, 2)
      );

      // Distance from ideal ring position
      const distFromRing = Math.abs(currentDistToMouse - ringRadius);

      // Scale: 100% on ring, fade to 0% far away
      let scaleFactor = 1 - (distFromRing / 15);
      scaleFactor = Math.max(0, Math.min(1, scaleFactor));

      const finalScale = scaleFactor * particleSize;
      dummy.scale.set(finalScale, finalScale, finalScale);

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* Thin capsule for "shard" aesthetic */}
      <capsuleGeometry args={[0.07, 0.45, 8, 16]} />
      <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.6} />
    </instancedMesh>
  );
};

const MemoizedAntigravityInner = React.memo(AntigravityInner);

const Antigravity: React.FC<AntigravityInnerProps> = (props) => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 0, 50], fov: 35 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "default",
        }}
        dpr={[1, 1.5]}
      >
        <MemoizedAntigravityInner {...props} />
      </Canvas>
    </div>
  );
};

export default React.memo(Antigravity);