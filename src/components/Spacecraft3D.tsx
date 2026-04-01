import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, Text, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

const OrionCapsule = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Capsule Body (Cone-like) */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.5, 2, 32]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Heat Shield (Bottom) */}
      <mesh position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
        <meshStandardMaterial color="#4b5563" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Service Module (Cylinder) */}
      <mesh position={[0, -2.1, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 2, 32]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Solar Panels (4 wings) */}
      {[0, 1, 2, 3].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
          <mesh position={[3.5, -2.1, 0]}>
            <boxGeometry args={[4, 0.1, 1]} />
            <meshStandardMaterial color="#1e3a8a" emissive="#1e3a8a" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}

      {/* Windows */}
      <mesh position={[0, 0.5, 1.1]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[0.4, 0.3, 0.1]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={2} />
      </mesh>
    </group>
  );
};

const Earth = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.001;
  });

  return (
    <mesh ref={meshRef} position={[15, -10, -20]}>
      <sphereGeometry args={[8, 64, 64]} />
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

export const Spacecraft3D: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[200px] relative bg-black/20 rounded-lg overflow-hidden border border-white/5">
      <div className="absolute top-3 left-3 z-10">
        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Attitude Control</div>
        <div className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest">Orion MPCV</div>
      </div>

      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={45} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <OrionCapsule />
        </Float>

        <Earth />

        {/* Grid Helper for technical feel */}
        <gridHelper args={[100, 50, 0x444444, 0x222222]} position={[0, -10, 0]} />
      </Canvas>

      <div className="absolute bottom-3 right-3 z-10 flex flex-col items-end gap-1">
        <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Orientation Matrix</div>
        <div className="text-[10px] font-mono text-green-500/80">X: +0.024 Y: -0.112 Z: +0.892</div>
      </div>
    </div>
  );
};
