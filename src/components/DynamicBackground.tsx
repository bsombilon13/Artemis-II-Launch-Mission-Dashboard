import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface DynamicBackgroundProps {
  lTime: number;
  progress: number;
}

function MovingStars({ speed, progress }: { speed: number, progress: number }) {
  const starsRef = useRef<THREE.Group>(null);

  // Increase star density/factor during deep space travel (0.3 to 0.7)
  const starFactor = useMemo(() => {
    if (progress > 0.3 && progress < 0.7) return 8; // More intense stars in deep space
    return 4;
  }, [progress]);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += speed * 0.001;
      starsRef.current.rotation.x += speed * 0.0005;
    }
  });

  return (
    <group ref={starsRef}>
      <Stars radius={100} depth={50} count={5000} factor={starFactor} saturation={0} fade speed={1} />
    </group>
  );
}

function MeteorShower() {
  const count = 20;
  const meshRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = -20 - Math.random() * 20;
      velocities[i] = 0.5 + Math.random() * 1.5;
    }
    return { positions, velocities };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        // Move across the screen
        positions[i * 3] += particles.velocities[i];
        positions[i * 3 + 1] -= particles.velocities[i] * 0.5;
        
        // Reset if out of bounds
        if (positions[i * 3] > 30 || positions[i * 3 + 1] < -30) {
          positions[i * 3] = -30;
          positions[i * 3 + 1] = 20 + Math.random() * 10;
        }
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffffff"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

function Nebula({ progress }: { progress: number }) {
  const nebulaRef = useRef<THREE.Group>(null);

  // Color shifts based on mission progress
  // 0: Near Earth (Blue/Cyan)
  // 0.5: Deep Space (Purple/Indigo)
  // 1: Near Moon (Red/Orange/Grey)
  const colors = useMemo(() => {
    if (progress < 0.3) return { primary: '#0ea5e9', secondary: '#1e40af' }; // Earth
    if (progress < 0.7) return { primary: '#8b5cf6', secondary: '#4c1d95' }; // Deep Space
    return { primary: '#f97316', secondary: '#7c2d12' }; // Moon
  }, [progress]);

  useFrame((state) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.z += 0.0002;
    }
  });

  return (
    <group ref={nebulaRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sparkles 
          count={50} 
          scale={20} 
          size={2} 
          speed={0.2} 
          opacity={0.1} 
          color={colors.primary} 
        />
      </Float>
      
      {/* Abstract Nebula Glows */}
      <mesh position={[10, 5, -20]}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial 
          color={colors.secondary} 
          transparent 
          opacity={0.05} 
          side={THREE.BackSide} 
        />
      </mesh>
      
      <mesh position={[-15, -10, -25]}>
        <sphereGeometry args={[20, 32, 32]} />
        <meshBasicMaterial 
          color={colors.primary} 
          transparent 
          opacity={0.03} 
          side={THREE.BackSide} 
        />
      </mesh>
    </group>
  );
}

function AtmosphericGlow({ lTime }: { lTime: number }) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      // Pulse based on "telemetry" (simulated by lTime)
      const pulse = Math.sin(state.clock.getElapsedTime() * 2) * 0.02 + 0.05;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
    }
  });

  return (
    <mesh ref={glowRef} position={[0, 0, -10]}>
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial 
        color="#ffffff" 
        transparent 
        opacity={0.05} 
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export function DynamicBackground({ lTime, progress }: DynamicBackgroundProps) {
  // Speed up stars during launch phase (-10 to 120 seconds)
  const starSpeed = useMemo(() => {
    if (lTime < -10) return 0.1;
    if (lTime < 120) return 2.0; // High speed during ascent
    return 0.2; // Cruise speed
  }, [lTime]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={['#050608']} />
        <ambientLight intensity={0.5} />
        
        <MovingStars speed={starSpeed} progress={progress} />
        <Nebula progress={progress} />
        
        {/* Meteor shower during lunar flyby (0.7 to 0.9) */}
        {(progress > 0.7 && progress < 0.9) && <MeteorShower />}
        
        {/* Only show atmospheric glow during launch/re-entry */}
        {(lTime > -60 && lTime < 600) && <AtmosphericGlow lTime={lTime} />}
        
        {/* Subtle vignette/fog */}
        <fog attach="fog" args={['#050608', 10, 50]} />
      </Canvas>
      
      {/* Overlay gradient for UI readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
    </div>
  );
}
