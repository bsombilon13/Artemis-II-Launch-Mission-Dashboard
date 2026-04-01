import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, Text, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface OrionProps {
  velocity: number;
  altitude: number;
  lTime: number;
}

const OrionCapsule: React.FC<OrionProps> = ({ velocity, altitude, lTime }) => {
  const meshRef = useRef<THREE.Group>(null);
  const panelsRef = useRef<THREE.Group[]>([]);
  const windowRef = useRef<THREE.Mesh>(null);

  // Procedural Texture for Capsule Body (Enhanced with panel variations and weathering)
  const capsuleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Base color
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Panel variations
      for (let i = 0; i < 1024; i += 128) {
        for (let j = 0; j < 1024; j += 128) {
          const shade = Math.floor(Math.random() * 15);
          ctx.fillStyle = `rgba(0,0,0,${shade / 255})`;
          ctx.fillRect(i, j, 128, 128);
          
          // Panel borders
          ctx.strokeStyle = 'rgba(156, 163, 175, 0.5)';
          ctx.lineWidth = 2;
          ctx.strokeRect(i, j, 128, 128);
        }
      }

      // Rivets
      ctx.fillStyle = 'rgba(107, 114, 128, 0.6)';
      for (let i = 64; i < 1024; i += 128) {
        for (let j = 64; j < 1024; j += 128) {
          ctx.beginPath();
          ctx.arc(i, j, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(i + 32, j + 32, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Weathering/Noise
      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const size = Math.random() * 2;
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
        ctx.fillRect(x, y, size, size);
      }

      // Technical Markings
      ctx.font = 'bold 40px "JetBrains Mono", monospace';
      ctx.fillStyle = '#1f2937';
      ctx.fillText('NASA', 80, 200);
      ctx.fillText('UNITED STATES', 80, 250);
      
      ctx.save();
      ctx.translate(900, 100);
      ctx.rotate(Math.PI / 2);
      ctx.fillText('ARTEMIS II', 0, 0);
      ctx.restore();

      // Flag (Simplified)
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(800, 800, 120, 20);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(800, 820, 120, 20);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(800, 840, 120, 20);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 16;
    return texture;
  }, []);

  // Procedural Texture for Service Module (Enhanced)
  const serviceModuleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(0, 0, 512, 1024);
      
      // Vertical ribs
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 4;
      for (let i = 0; i < 512; i += 64) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 1024);
        ctx.stroke();
      }

      // Horizontal bands
      ctx.lineWidth = 2;
      for (let j = 0; j < 1024; j += 128) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(512, j);
        ctx.stroke();
      }

      // Access Hatches
      ctx.fillStyle = '#9ca3af';
      ctx.fillRect(200, 400, 100, 150);
      ctx.strokeStyle = '#4b5563';
      ctx.strokeRect(200, 400, 100, 150);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  // Solar Panel Texture (Grid pattern)
  const solarPanelTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 256, 256);
      
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      for (let i = 0; i <= 256; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 256);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(256, i);
        ctx.stroke();
      }
      
      // Add some "cell" highlights
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      for (let i = 0; i < 256; i += 32) {
        for (let j = 0; j < 256; j += 32) {
          if (Math.random() > 0.7) {
            ctx.fillRect(i + 4, j + 4, 24, 24);
          }
        }
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
    return texture;
  }, []);

  // Calculate vibration intensity based on velocity
  const vibrationIntensity = useMemo(() => {
    if (lTime < 0) return 0;
    return Math.min(0.05, (velocity / 40000) * 0.1);
  }, [velocity, lTime]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      
      if (vibrationIntensity > 0) {
        meshRef.current.position.x = (Math.random() - 0.5) * vibrationIntensity;
        meshRef.current.position.y = (Math.random() - 0.5) * vibrationIntensity;
      } else {
        meshRef.current.position.set(0, 0, 0);
      }
    }

    // Pulse window glow (gentle and atmospheric)
    if (windowRef.current) {
      const windowMaterial = windowRef.current.material as THREE.MeshStandardMaterial;
      windowMaterial.emissiveIntensity = 1.0 + Math.sin(time * 1.2) * 0.4;
      // Shift color slightly for a "living" look
      const bluePulse = 0.8 + Math.sin(time * 0.5) * 0.2;
      windowMaterial.emissive.setRGB(0.2 * bluePulse, 0.6 * bluePulse, 1.0 * bluePulse);
    }

    // Animate solar panels (rotation + moving energy flow effect)
    panelsRef.current.forEach((panel, i) => {
      if (panel) {
        panel.rotation.x = Math.sin(time * 0.15 + i) * 0.04;
        const wingMesh = panel.children[0] as THREE.Mesh;
        const wingMaterial = wingMesh.material as THREE.MeshStandardMaterial;
        
        // Moving energy wave effect
        const wave = 0.5 + Math.sin(time * 3 + i * 1.5) * 0.3;
        wingMaterial.emissiveIntensity = wave;
        
        // Shift texture offset to simulate "flow"
        if (wingMaterial.map) {
          wingMaterial.map.offset.x = -time * 0.1;
        }

        // Dynamic emissive color
        const hue = (210 + Math.sin(time * 0.8 + i) * 15) / 360;
        wingMaterial.emissive.setHSL(hue, 0.9, 0.5);
      }
    });
  });

  return (
    <group ref={meshRef}>
      {/* Capsule Body (Cone-like) with detailed texture */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.5, 2, 64]} />
        <meshStandardMaterial 
          map={capsuleTexture}
          color="#ffffff" 
          metalness={0.4} 
          roughness={0.4} 
          envMapIntensity={1.5}
        />
      </mesh>
      
      {/* Capsule Detail Ring */}
      <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.06, 16, 64]} />
        <meshStandardMaterial color="#9ca3af" metalness={1} roughness={0.1} />
      </mesh>
      
      {/* Heat Shield (Bottom) */}
      <mesh position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 64]} />
        <meshStandardMaterial color="#171717" metalness={0.9} roughness={0.5} />
      </mesh>

      {/* Service Module (Cylinder) with detailed texture */}
      <group position={[0, -2.1, 0]}>
        <mesh>
          <cylinderGeometry args={[1.5, 1.5, 2, 64]} />
          <meshStandardMaterial 
            map={serviceModuleTexture}
            color="#ffffff" 
            metalness={0.6} 
            roughness={0.3} 
          />
        </mesh>
        {/* Structural Ribs */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <mesh key={i} rotation={[0, (i * Math.PI) / 4, 0]} position={[0, 0, 0]}>
            <boxGeometry args={[0.04, 2, 3.06]} />
            <meshStandardMaterial color="#9ca3af" metalness={1} roughness={0.1} />
          </mesh>
        ))}
      </group>

      {/* Solar Panels (4 wings) */}
      {[0, 1, 2, 3].map((i) => (
        <group 
          key={i} 
          rotation={[0, (i * Math.PI) / 2, 0]} 
          ref={(el) => (panelsRef.current[i] = el as THREE.Group)}
        >
          <mesh position={[3.5, -2.1, 0]}>
            <boxGeometry args={[4, 0.04, 1.2]} />
            <meshStandardMaterial 
              map={solarPanelTexture}
              color="#ffffff" 
              emissive="#1d4ed8" 
              emissiveIntensity={0.5} 
              metalness={1}
              roughness={0.1}
            />
            {/* Solar Cell Grid Pattern (Simulated with wireframe overlay) */}
            <mesh scale={[1.001, 1.2, 1.001]}>
              <boxGeometry args={[4, 0.04, 1.2]} />
              <meshBasicMaterial color="#60a5fa" wireframe transparent opacity={0.15} />
            </mesh>
          </mesh>
        </group>
      ))}

      {/* Windows with gentle emissive glow */}
      <mesh ref={windowRef} position={[0, 0.5, 1.1]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[0.5, 0.35, 0.1]} />
        <meshStandardMaterial 
          color="#0ea5e9" 
          emissive="#7dd3fc" 
          emissiveIntensity={1.5} 
          metalness={1}
          roughness={0}
        />
      </mesh>
    </group>
  );
};

const Earth: React.FC<{ altitude: number }> = ({ altitude }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Scale Earth based on altitude (simulating distance)
  // Max altitude is around 400,000 km (Lunar distance)
  const earthScale = useMemo(() => {
    const baseScale = 8;
    const factor = Math.max(0.1, 1 - (altitude / 400000));
    return baseScale * factor;
  }, [altitude]);

  const earthPosition = useMemo(() => {
    // Move Earth further away as altitude increases
    const basePos = [15, -10, -20];
    const distanceFactor = 1 + (altitude / 50000);
    return [basePos[0] * distanceFactor, basePos[1] * distanceFactor, basePos[2] * distanceFactor] as [number, number, number];
  }, [altitude]);

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.001;
  });

  return (
    <mesh ref={meshRef} position={earthPosition}>
      <sphereGeometry args={[earthScale, 64, 64]} />
      <meshStandardMaterial 
        color="#3b82f6" 
        emissive="#1e3a8a" 
        emissiveIntensity={0.2} 
        wireframe={true}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
};

interface Spacecraft3DProps {
  lTime?: number;
}

export const Spacecraft3D: React.FC<Spacecraft3DProps> = ({ lTime = 0 }) => {
  // Generate telemetry data based on lTime (matching Telemetry.tsx logic)
  const telemetry = useMemo(() => {
    return {
      velocity: Math.abs(Math.sin(lTime / 100) * 20000 + 15000),
      altitude: Math.abs(Math.cos(lTime / 500) * 300000 + 50000),
    };
  }, [lTime]);

  return (
    <div className="w-full h-full min-h-[200px] relative bg-black/20 rounded-lg overflow-hidden border border-white/5">
      <div className="absolute top-3 left-3 z-10">
        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Attitude Control</div>
        <div className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest">Orion MPCV</div>
      </div>

      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={45} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
          <OrionCapsule velocity={telemetry.velocity} altitude={telemetry.altitude} lTime={lTime} />
        </Float>

        <Earth altitude={telemetry.altitude} />

        {/* Grid Helper for technical feel */}
        <gridHelper args={[100, 50, 0x444444, 0x222222]} position={[0, -10, 0]} />
      </Canvas>

      <div className="absolute bottom-3 right-3 z-10 flex flex-col items-end gap-1">
        <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Orientation Matrix</div>
        <div className="text-[10px] font-mono text-green-500/80">
          V: {telemetry.velocity.toFixed(0)} km/h | A: {telemetry.altitude.toFixed(0)} km
        </div>
      </div>
    </div>
  );
};
