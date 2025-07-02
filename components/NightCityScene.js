import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import { Float } from '@react-three/drei';

// Componente per creare un singolo grattacielo
const Skyscraper = ({ position, height, width, depth, color, windowColor, floors, delay = 0 }) => {
  const buildingRef = useRef();
  const initialY = position[1];
  
  // Animazione di "crescita" del grattacielo
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() - delay;
    if (t > 0) {
      buildingRef.current.scale.y = MathUtils.lerp(
        buildingRef.current.scale.y,
        1,
        Math.min(1, t * 0.5)
      );
      
      // Animazione pulsante delle luci
      if (t > 1) {
        const windows = buildingRef.current.children[1]?.children || [];
        windows.forEach((window, i) => {
          const pulse = Math.sin((t * 0.5) + (i * 0.1)) * 0.2 + 0.8;
          if (window.material) {
            window.material.emissiveIntensity = pulse;
          }
        });
      }
    }
  });

  // Creiamo le finestre del grattacielo
  const windows = useMemo(() => {
    const result = [];
    const floorHeight = height / floors;
    const windowsPerFloor = Math.floor(width / 0.2);
    
    for (let floor = 0; floor < floors; floor++) {
      for (let w = 0; w < windowsPerFloor; w++) {
        // Solo alcune finestre sono "accese" per creare un effetto realistico
        if (Math.random() > 0.3) {
          result.push(
            <mesh 
              key={`window-${floor}-${w}`}
              position={[
                -width/2 + 0.1 + (w * 0.2), 
                -height/2 + (floor * floorHeight) + (floorHeight/2), 
                depth/2 + 0.01
              ]}
            >
              <planeGeometry args={[0.1, floorHeight * 0.5]} />
              <meshStandardMaterial 
                color={windowColor}
                emissive={windowColor}
                emissiveIntensity={Math.random() * 0.5 + 0.5}
              />
            </mesh>
          );
        }
      }
    }
    return result;
  }, [height, width, depth, floors, windowColor]);

  return (
    <group position={position}>
      <group 
        ref={buildingRef} 
        scale={[1, 0.01, 1]} 
        position={[0, -height/2 + initialY, 0]}
      >
        {/* Struttura principale dell'edificio */}
        <mesh>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.3} />
        </mesh>
        
        {/* Finestre illuminate */}
        <group>{windows}</group>
      </group>
    </group>
  );
};

// Componente per una particella luminosa che simula luci in movimento
const MovingLight = ({ color, speed = 1, size = 0.05, trail = 0.5, bounds = [10, 10, 10] }) => {
  const lightRef = useRef();
  const trailRef = useRef();
  const direction = useRef({
    x: (Math.random() - 0.5) * speed,
    y: (Math.random() - 0.5) * speed,
    z: (Math.random() - 0.5) * speed
  });

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Movimento della luce
    if (lightRef.current) {
      lightRef.current.position.x += direction.current.x * 0.01;
      lightRef.current.position.y += direction.current.y * 0.01;
      lightRef.current.position.z += direction.current.z * 0.01;
      
      // Invertire direzione ai bordi
      if (Math.abs(lightRef.current.position.x) > bounds[0]/2) direction.current.x *= -1;
      if (Math.abs(lightRef.current.position.y) > bounds[1]/2) direction.current.y *= -1;
      if (Math.abs(lightRef.current.position.z) > bounds[2]/2) direction.current.z *= -1;
    }
    
    // Animazione della scia
    if (trailRef.current) {
      trailRef.current.scale.x = Math.sin(t) * 0.3 + 0.7;
      trailRef.current.scale.y = Math.sin(t * 1.3) * 0.3 + 0.7;
      trailRef.current.scale.z = Math.sin(t * 0.7) * 0.3 + 0.7;
    }
  });

  return (
    <group ref={lightRef} position={[
      (Math.random() - 0.5) * bounds[0],
      (Math.random() - 0.5) * bounds[1],
      (Math.random() - 0.5) * bounds[2],
    ]}>
      {/* Punto luminoso */}
      <mesh>
        <sphereGeometry args={[size, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Scia luminosa */}
      <mesh ref={trailRef}>
        <sphereGeometry args={[size * trail, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};

// Componente principale che compone la scena notturna
const NightCityScene = () => {
  // Genera una serie di grattacieli con diverse altezze e posizioni
  const skyscrapers = useMemo(() => {
    const buildings = [];
    const buildingCount = 15;
    
    for (let i = 0; i < buildingCount; i++) {
      const width = Math.random() * 0.5 + 0.5;
      const height = Math.random() * 4 + 2;
      const depth = Math.random() * 0.5 + 0.5;
      const posX = (Math.random() - 0.5) * 10;
      const posZ = (Math.random() - 0.5) * 6 - 2; // Push buildings back
      
      // Colori per edifici e finestre
      const buildingColor = 
        Math.random() > 0.7 
          ? `rgb(20, 20, ${Math.floor(Math.random() * 50) + 30})` 
          : `rgb(${Math.floor(Math.random() * 20) + 10}, ${Math.floor(Math.random() * 20) + 10}, ${Math.floor(Math.random() * 20) + 20})`;
      
      const windowColor = 
        Math.random() > 0.3
          ? `rgb(255, ${Math.floor(Math.random() * 100) + 155}, 50)`
          : `rgb(200, 230, 255)`;
      
      buildings.push(
        <Skyscraper 
          key={`building-${i}`}
          position={[posX, 0, posZ]}
          width={width}
          height={height}
          depth={depth}
          color={buildingColor}
          windowColor={windowColor}
          floors={Math.floor(height * 4)}
          delay={i * 0.1}
        />
      );
    }
    
    return buildings;
  }, []);
  
  // Genera particelle luminose in movimento (come auto o luci volanti)
  const movingLights = useMemo(() => {
    const lights = [];
    const lightCount = 30;
    
    // Diversi colori per le luci
    const lightColors = [
      '#ffcc00', // giallo
      '#ff0000', // rosso
      '#ffffff', // bianco
      '#00aaff', // blu
      '#ff00ff', // viola
    ];
    
    for (let i = 0; i < lightCount; i++) {
      const color = lightColors[Math.floor(Math.random() * lightColors.length)];
      const speed = Math.random() * 0.5 + 0.2;
      const size = Math.random() * 0.03 + 0.01;
      
      lights.push(
        <MovingLight
          key={`light-${i}`}
          color={color}
          speed={speed}
          size={size}
          trail={Math.random() + 0.5}
          bounds={[12, 8, 8]}
        />
      );
    }
    
    return lights;
  }, []);
  
  // Gruppo fluttuante per tutta la scena
  return (
    <>
      {/* Terreno/strada base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#050505" roughness={0.8} />
      </mesh>
      
      {/* Effetto foschia/nebbia nella parte bassa della città */}
      <mesh position={[0, 0, -3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#113366" 
          transparent 
          opacity={0.15} 
          emissive="#113366"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Grattacieli */}
      <Float
        speed={0.5}
        rotationIntensity={0.05}
        floatIntensity={0.05}
      >
        <group>{skyscrapers}</group>
      </Float>
      
      {/* Luci in movimento */}
      <group>{movingLights}</group>
    </>
  );
};

export default NightCityScene;
