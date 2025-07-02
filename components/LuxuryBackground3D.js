import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import NightCityScene from './NightCityScene';
import { Vector3 } from 'three';

// Camera controller con movimento fluido che segue il mouse
const CameraController = ({ mousePosition }) => {
  const { camera } = useThree();
  const targetPosition = useRef(new Vector3(0, 0, 5));
  
  useFrame(() => {
    if (mousePosition.current) {
      // Movimento subtile della telecamera basata sul mouse
      targetPosition.current.x = (mousePosition.current.x - 0.5) * 2;
      targetPosition.current.y = (mousePosition.current.y - 0.5) * 1;
      
      // Interpolazione fluida per un movimento dolce della telecamera
      camera.position.x += (targetPosition.current.x - camera.position.x) * 0.03;
      camera.position.y += (targetPosition.current.y - camera.position.y) * 0.03;
      
      // La telecamera guarda sempre verso il centro della scena
      camera.lookAt(0, 0, 0);
    }
  });
  
  return null;
};

// Effetti visivi post-processing
const VisualEffects = () => {
  return (
    <EffectComposer>
      {/* Bloom effect per luci brillanti */}
      <Bloom 
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={0.4}
      />
      {/* Effetto noise per aggiungere texture film grain */}
      <Noise opacity={0.015} />
      {/* Vignette effect per un look cinematografico */}
      <Vignette eskil={false} offset={0.1} darkness={0.7} />
    </EffectComposer>
  );
};

// Componente principale che renderizza la scena 3D luxury
const LuxuryBackground3D = () => {
  const mousePosition = useRef({ x: 0.5, y: 0.5 });
  
  // Tracciamento della posizione del mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosition.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas shadows>
        {/* Camera setup */}
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={60} />
        <CameraController mousePosition={mousePosition} />
        
        {/* Illuminazione */}
        <hemisphereLight intensity={0.05} groundColor="#000000" />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.2}
          color="#ffffff"
          castShadow
        />
        <pointLight position={[0, 5, 0]} intensity={0.1} color="#5e75cc" />
        
        {/* Ambiente */}
        <Environment preset="night" />
        
        {/* La città notturna con caricamento sospeso */}
        <Suspense fallback={null}>
          <NightCityScene />
        </Suspense>
        
        {/* Effetti visivi post-processing */}
        <VisualEffects />
      </Canvas>
      
      {/* Overlay per una maggiore profondità */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"
        style={{ pointerEvents: 'none' }} 
      />
      
      {/* Vignetting effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)',
          borderRadius: '2px'
        }}
      />
    </div>
  );
};

export default LuxuryBackground3D;
