import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Componente background lussuoso con particelle e sfondo animato
const LuxurySceneBackground = () => {
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [lightBeams, setLightBeams] = useState([]);
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    // Genera gli elementi visivi solo lato client
    setParticles(generateParticles(25));
    setLightBeams(generateLightBeams(8));
    setBuildings(generateBuildings(20));
    
    // Gestione del movimento delle particelle basato sulla posizione del mouse
    const handleMouseMove = (event) => {
      if (!containerRef.current) return;
      
      const { clientX, clientY } = event;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      // Aggiorna la posizione delle particelle
      const particleElements = containerRef.current.querySelectorAll('.particle');
      particleElements.forEach((particle) => {
        const speed = parseFloat(particle.getAttribute('data-speed'));
        const offsetX = (x - rect.width / 2) * speed;
        const offsetY = (y - rect.height / 2) * speed;
        
        particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
      
      // Aggiorna il gradiente per creare un effetto di profondità
      const gradientElement = containerRef.current.querySelector('.dynamic-gradient');
      if (gradientElement) {
        const gradientX = ((x / rect.width) * 100).toFixed(2);
        const gradientY = ((y / rect.height) * 100).toFixed(2);
        gradientElement.style.background = `radial-gradient(
          circle at ${gradientX}% ${gradientY}%, 
          rgba(221, 167, 79, 0.15) 0%, 
          rgba(11, 20, 37, 0) 50%
        )`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Genera arrays per i diversi tipi di elementi visivi
  const generateParticles = (count) => {
    return Array.from({ length: count }).map((_, index) => ({
      id: `particle-${index}`,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: Math.random() * 0.05 + 0.01,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 5,
      blur: Math.random() > 0.7 ? Math.random() * 5 + 2 : 0
    }));
  };
  
  const generateLightBeams = (count) => {
    return Array.from({ length: count }).map((_, index) => ({
      id: `beam-${index}`,
      rotation: Math.random() * 180,
      x: Math.random() * 100,
      y: Math.random() * 100,
      width: Math.random() * 1 + 0.2,
      opacity: Math.random() * 0.15 + 0.05,
      delay: Math.random() * 3
    }));
  };
  
  const generateBuildings = (count) => {
    return Array.from({ length: count }).map((_, index) => {
      // Decide building type (0: regular, 1: tapered, 2: complex top)
      const buildingType = Math.floor(Math.random() * 3);
      // Generate more consistent but still varied sizes
      const baseHeight = Math.random() * 30 + 20;
      const baseWidth = Math.random() * 4 + 2;
      
      return {
        id: `building-${index}`,
        x: Math.random() * 100,
        height: baseHeight,
        width: baseWidth,
        speed: Math.random() * 0.03 + 0.01,
        type: buildingType,
        // Texture/material styling
        material: Math.floor(Math.random() * 3), // 0: glass, 1: concrete, 2: mixed
        // Window properties for more structured patterns
        windows: {
          columns: Math.floor(Math.random() * 3) + 2,
          rows: Math.floor(Math.random() * 10) + 10,
          pattern: Math.floor(Math.random() * 3), // 0: grid, 1: alternating, 2: random but aligned
          lightRatio: Math.random() * 0.3 + 0.1 // 10-40% of windows are lit
        },
        // Architectural details
        hasAntenna: Math.random() > 0.7,
        hasSetbacks: Math.random() > 0.6,
        setbacksCount: Math.floor(Math.random() * 3) + 1,
        hasCrownLight: Math.random() > 0.5,
        // Additional decorative elements
        accent: {
          color: Math.random() > 0.7 ? 'rgba(221, 167, 79, 0.7)' : 'rgba(255, 255, 255, 0.6)',
          intensity: Math.random() * 0.4 + 0.1
        }
      };
    });
  };

  // Placeholder vuoto per il rendering iniziale lato server
  const serverPlaceholder = <div className="min-h-screen bg-nightblue" />;

  // Non renderizzare nulla di dinamico se siamo ancora lato server
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    return serverPlaceholder;
  }
  
  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden bg-gradient-to-b from-black via-nightblue to-black z-0"
      style={{ perspective: '1000px' }}
    >
      {/* Sfondo base con texture di rumore */}
      <div 
        className="absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          backgroundSize: '200px 200px'
        }}
      />
      
      {/* Gradiente dinamico che segue il mouse */}
      <div className="absolute inset-0 dynamic-gradient" />

      {/* Skyline della città in background */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3">
        {buildings.map((building) => {
          // Building base styles based on material type
          const baseMaterialStyles = {
            0: { // Glass-dominant
              background: 'linear-gradient(to bottom, rgba(7, 15, 30, 0.95), rgba(0, 0, 0, 0.99))',
              boxShadow: '0 0 15px rgba(0, 0, 0, 0.9)'
            },
            1: { // Concrete-dominant
              background: 'linear-gradient(to bottom, rgba(20, 20, 25, 0.98), rgba(10, 10, 15, 0.99))',
              boxShadow: '0 0 8px rgba(0, 0, 0, 0.8)'
            },
            2: { // Mixed materials
              background: 'linear-gradient(to bottom, rgba(15, 18, 28, 0.97), rgba(5, 8, 12, 0.99))',
              boxShadow: '0 0 12px rgba(0, 0, 0, 0.85)'
            }
          }[building.material];
          
          // Generate windows based on pattern
          const renderWindows = () => {
            const windows = [];
            const { columns, rows, pattern, lightRatio } = building.windows;
            const columnWidth = 100 / columns;
            const rowHeight = 100 / rows;
            
            for (let row = 0; row < rows; row++) {
              for (let col = 0; col < columns; col++) {
                let shouldRenderWindow = false;
                
                // Different window patterns
                switch (pattern) {
                  case 0: // Grid pattern
                    shouldRenderWindow = true;
                    break;
                  case 1: // Alternating pattern
                    shouldRenderWindow = (row + col) % 2 === 0;
                    break;
                  case 2: // Random but aligned
                    shouldRenderWindow = Math.random() > 0.3;
                    break;
                }
                
                if (shouldRenderWindow) {
                  // Decide if window is lit
                  const isLit = Math.random() < lightRatio;
                  
                  windows.push(
                    <div
                      key={`window-${building.id}-${row}-${col}`}
                      className={`absolute ${isLit ? 'bg-primary/70' : 'bg-white/10'}`}
                      style={{
                        width: `${columnWidth * 0.7}%`,
                        height: `${rowHeight * 0.7}%`,
                        left: `${col * columnWidth + columnWidth * 0.15}%`,
                        top: `${row * rowHeight + rowHeight * 0.15}%`,
                        opacity: isLit ? (Math.random() * 0.5 + 0.5) : (Math.random() * 0.2 + 0.05),
                        boxShadow: isLit ? `0 0 ${Math.random() * 5 + 2}px rgba(221, 167, 79, ${Math.random() * 0.6 + 0.4})` : 'none'
                      }}
                    />
                  );
                }
              }
            }
            
            return windows;
          };
          
          // Render architectural details
          const renderDetails = () => {
            const details = [];
            
            // Antenna or spire at the top
            if (building.hasAntenna) {
              details.push(
                <div
                  key={`antenna-${building.id}`}
                  className="absolute bg-black"
                  style={{
                    width: '6%',
                    height: '25%',
                    bottom: '100%',
                    left: '47%',
                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)'
                  }}
                />
              );
              
              // Add blinking light at the top
              details.push(
                <div
                  key={`antenna-light-${building.id}`}
                  className="absolute rounded-full animate-pulse"
                  style={{
                    width: '4px',
                    height: '4px',
                    bottom: '125%',
                    left: '48.5%',
                    backgroundColor: 'red',
                    boxShadow: '0 0 8px red',
                    animationDuration: `${Math.random() + 1}s`
                  }}
                />
              );
            }
            
            // Crown light for building top
            if (building.hasCrownLight) {
              details.push(
                <div
                  key={`crown-${building.id}`}
                  className="absolute"
                  style={{
                    width: '100%',
                    height: '5%',
                    bottom: '95%',
                    background: `linear-gradient(to bottom, ${building.accent.color} 0%, transparent 100%)`,
                    opacity: building.accent.intensity,
                    boxShadow: `0 0 15px ${building.accent.color}`
                  }}
                />
              );
            }
            
            return details;
          };
          
          // Handle different building shapes
          const getBuildingShape = () => {
            const type = building.type;
            let buildingStyle = {
              position: 'absolute',
              bottom: 0,
              left: `${building.x}%`,
              width: `${building.width}%`,
              height: `${building.height}%`,
              ...baseMaterialStyles
            };
            
            // Add shape variations
            switch (type) {
              case 1: // Tapered top
                buildingStyle = {
                  ...buildingStyle,
                  clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)'
                };
                break;
              case 2: // Complex top
                const setbacks = [];
                if (building.hasSetbacks) {
                  for (let i = 1; i <= building.setbacksCount; i++) {
                    const setbackHeight = 100 - (i * (100 / (building.setbacksCount + 1)));
                    const setbackWidth = 100 - (i * 15);
                    setbacks.push(
                      <div
                        key={`setback-${building.id}-${i}`}
                        className="absolute"
                        style={{
                          width: `${setbackWidth}%`,
                          height: `${100 - setbackHeight}%`,
                          bottom: `${setbackHeight}%`,
                          left: `${(100 - setbackWidth) / 2}%`,
                          ...baseMaterialStyles
                        }}
                      />
                    );
                  }
                }
                return (
                  <div
                    key={building.id}
                    data-speed={building.speed}
                    style={buildingStyle}
                  >
                    {renderWindows()}
                    {setbacks}
                    {renderDetails()}
                  </div>
                );
              default:
                break;
            }
            
            return (
              <div
                key={building.id}
                data-speed={building.speed}
                style={buildingStyle}
              >
                {renderWindows()}
                {renderDetails()}
              </div>
            );
          };
          
          return getBuildingShape();
        })}
      </div>

      {/* Fasci di luce che simulano luci della città */}
      {lightBeams.map((beam) => (
        <motion.div
          key={beam.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: beam.opacity }}
          transition={{ delay: beam.delay, duration: 2 }}
          className="absolute bg-gradient-to-t from-primary/0 via-primary/20 to-primary/0"
          style={{
            left: `${beam.x}%`,
            top: `${beam.y}%`,
            width: `${beam.width}%`,
            height: '50%',
            transform: `rotate(${beam.rotation}deg)`,
            transformOrigin: 'bottom'
          }}
        />
      ))}
      
      {/* Particelle dorate che fluttuano */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full particle"
          data-speed={particle.speed}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ 
            delay: particle.delay,
            duration: 1.5, 
            repeat: Infinity, 
            repeatType: 'reverse',
            repeatDelay: particle.duration
          }}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: 'radial-gradient(circle, rgba(221, 167, 79, 0.8) 0%, rgba(184, 134, 11, 0.3) 50%, rgba(184, 134, 11, 0) 100%)',
            boxShadow: '0 0 10px rgba(221, 167, 79, 0.8)',
            filter: particle.blur ? `blur(${particle.blur}px)` : 'none'
          }}
        />
      ))}

      {/* Overlay vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 150px rgba(0, 0, 0, 0.7)' }}
      />
      
      {/* Overlay orizzontale per far risaltare il contenuto centrale */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70 pointer-events-none" />
    </div>
  );
};

export default LuxurySceneBackground;
