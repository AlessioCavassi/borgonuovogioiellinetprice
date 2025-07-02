import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import ClientOnlyWrapper from './ClientOnlyWrapper';
import Image from 'next/image';
import MobileTitle from './mobile/MobileTitle';


const Hero = () => {
  const [isClient, setIsClient] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [timeOfDay, setTimeOfDay] = useState(0); // 0-1 rappresenta il ciclo giorno-notte
  const [dayNightState, setDayNightState] = useState('night'); // nuovo stato per il ciclo giorno-notte
  const [particles, setParticles] = useState([]);
  const [buttonParticles, setButtonParticles] = useState([]);
  const [logoParticles, setLogoParticles] = useState([]);
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const parallaxRef = useRef(null);
  const sunMoonRef = useRef(null);
  const controlsStars = useAnimation();
  const controlsLight = useAnimation();
  
  // Funzione per ottenere colori in base al tempo del giorno
  const getDayNightColors = (time) => {
    // Da notte scura (0) a giorno (0.5) a notte di nuovo (1)
    if (time < 0.25) { // Notte verso alba
      setDayNightState('dawn');
      return {
        skyFrom: `rgba(10, 10, 40, ${1 - time * 2})`,
        skyTo: `rgba(0, 0, 0, ${1 - time * 2})`,
        light: `rgba(255, 200, 100, ${time * 4})`,
        filter: `brightness(${0.6 + time})`,
        stars: 1 - time * 3
      };
    } else if (time < 0.5) { // Alba verso mezzogiorno
      return {
        skyFrom: `rgba(135, 206, 250, ${(time - 0.25) * 4})`, 
        skyTo: `rgba(30, 30, 70, ${(time - 0.25) * 4})`,
        light: `rgba(255, 255, 200, ${(time - 0.25) * 4})`,
        filter: `brightness(${0.8 + time})`,
        stars: 0
      };
    } else if (time < 0.75) { // Mezzogiorno verso tramonto
      return {
        skyFrom: `rgba(135, 206, 250, ${1 - (time - 0.5) * 4})`,
        skyTo: `rgba(30, 30, 70, ${1 - (time - 0.5) * 4})`,
        light: `rgba(255, 200, 100, ${1 - (time - 0.5) * 4})`,
        filter: `brightness(${1.3 - (time - 0.5)})`,
        stars: (time - 0.5) * 2
      };
    } else { // Tramonto verso notte
      return {
        skyFrom: `rgba(10, 10, 40, ${(time - 0.75) * 4})`,
        skyTo: `rgba(0, 0, 0, ${(time - 0.75) * 4})`,
        light: `rgba(100, 100, 200, ${(time - 0.75) * 4})`,
        filter: `brightness(${0.8 - (time - 0.75) * 0.2})`,
        stars: 0.5 + (time - 0.75) * 2
      };
    }
  };

  useEffect(() => {
    setIsClient(true);
    
    // Animazione ciclica giorno-notte
    const dayNightCycle = setInterval(() => {
      setTimeOfDay(prev => (prev + 0.002) % 1);
    }, 100);

    // Controllo movimento delle stelle in profondità
    controlsStars.start({
      z: [0, 100, 0],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    });

    const handleMouseMove = (e) => {
      // Calcola la posizione relativa del mouse rispetto al centro dell'elemento
      if (parallaxRef.current) {
        const rect = parallaxRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left - centerX;
        const mouseY = e.clientY - rect.top - centerY;
        
        // Normalizza i valori (da -1 a 1)
        setMousePosition({
          x: mouseX / centerX,
          y: mouseY / centerY
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(dayNightCycle);
    };
  }, []);
  
  const generateParticles = () => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: `particle-${i}`,
      size: Math.random() * 5 + 2,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.3,
      animationDuration: Math.random() * 6 + 4,
      animationDelay: Math.random() * 5
    }));
    
    setParticles(newParticles);
  };
  
  const generateButtonParticles = () => {
    const newButtonParticles = Array.from({ length: 10 }).map((_, i) => ({
      id: `btn-particle-${i}`,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDelay: Math.random() * 2,
      animationDuration: Math.random() * 2 + 1
    }));
    
    setButtonParticles(newButtonParticles);
  };
  
  const generateLogoParticles = () => {
    const newLogoParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: `logo-particle-${i}`,
      size: Math.random() * 4 + 2,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      animateX: [
        Math.random() * 40 - 20, 
        Math.random() * 40 - 20, 
        Math.random() * 40 - 20
      ],
      animateY: [
        Math.random() * 40 - 20, 
        Math.random() * 40 - 20, 
        Math.random() * 40 - 20
      ],
      duration: Math.random() * 10 + 10
    }));
    
    setLogoParticles(newLogoParticles);
  };
  
  useEffect(() => {
    // Timeline per l'animazione di intro con durata maggiore per migliorare leggibilità
    const tl = gsap.timeline();
    
    tl.from(heroRef.current, {
      opacity: 0,
      duration: 1.8,
      ease: "power2.inOut"
    });
    
    // Animazione del testo con timing più lento per migliorare leggibilità
    const heroText = textRef.current.querySelectorAll('.animate-text');
    tl.from(heroText, {
      y: 50,
      opacity: 0,
      stagger: 0.5,  // Più lento per dare tempo di leggere
      duration: 1.2, // Più lungo per una migliore visualizzazione
      ease: "power2.out"
    }, "-=0.5");
    
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background con effetti visivi avanzati per ambiente notturno lussuoso */}
      <div className="absolute inset-0 bg-gradient-to-b from-nightblue via-secondary/80 to-charcoal z-0">
        {/* Overlay radiale per effetto spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-highlight/10 to-transparent opacity-70"></div>
        
        {/* Pattern geometrico dorato per texture */}
        <div className="absolute inset-0 opacity-30" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23B8860B' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        ></div>

        {/* Skyline 3D stratificato con effetto parallasse */}
        <div className="absolute inset-0 z-5 min-h-screen">
          <ClientOnlyWrapper>
            <div ref={parallaxRef} className="absolute inset-0 overflow-hidden">
              {/* Sfondo con gradiente */}
              <div className="absolute inset-0 bg-gradient-to-b from-nightblue/90 via-black/80 to-black"></div>
              
              {/* Sistema solare realistico con movimento da sinistra a destra e illuminazione max a 90° */}
              <motion.div
                ref={sunMoonRef}
                className="absolute z-20"
                style={{
                  // Movimento da sinistra (0°/-180°) a destra (180°), con 0 = -180, 0.5 = 0, 1 = 180
                  left: `${timeOfDay * 100}%`,
                  // Posizione verticale segue un arco con punto più alto al centro (90°)
                  // Modifica: su mobile posizione il sole/luna più in alto per illuminare meglio lo skyline
                  top: `${(isClient && window.innerWidth < 768 ? 60 : 80) - Math.sin(timeOfDay * Math.PI) * 60}%`,
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  // Transizione graduale del colore della luce basata sulla posizione
                  background: (() => {
                    // Colori di base per sole e luna
                    const sunInner = [255, 255, 200];
                    const sunOuter = [255, 200, 100];
                    const moonInner = [210, 210, 255];
                    const moonOuter = [100, 100, 200];
                    
                    // Calcola la transizione graduale tra luna-sole-luna
                    let innerColor, outerColor, innerAlpha = 1, outerAlpha = 0.8;
                    
                    if (timeOfDay < 0.25) { // Da notte a alba (luna → sole)
                      const t = timeOfDay / 0.25; // 0->1
                      innerColor = [
                        moonInner[0] + (sunInner[0] - moonInner[0]) * t,
                        moonInner[1] + (sunInner[1] - moonInner[1]) * t,
                        moonInner[2] + (sunInner[2] - moonInner[2]) * t
                      ];
                      outerColor = [
                        moonOuter[0] + (sunOuter[0] - moonOuter[0]) * t,
                        moonOuter[1] + (sunOuter[1] - moonOuter[1]) * t,
                        moonOuter[2] + (sunOuter[2] - moonOuter[2]) * t
                      ];
                    } 
                    else if (timeOfDay < 0.75) { // Giorno pieno (sole)
                      innerColor = sunInner;
                      outerColor = sunOuter;
                    } 
                    else { // Da tramonto a notte (sole → luna)
                      const t = (timeOfDay - 0.75) / 0.25; // 0->1
                      innerColor = [
                        sunInner[0] + (moonInner[0] - sunInner[0]) * t,
                        sunInner[1] + (moonInner[1] - sunInner[1]) * t,
                        sunInner[2] + (moonInner[2] - sunInner[2]) * t
                      ];
                      outerColor = [
                        sunOuter[0] + (moonOuter[0] - sunOuter[0]) * t,
                        sunOuter[1] + (moonOuter[1] - sunOuter[1]) * t,
                        sunOuter[2] + (moonOuter[2] - sunOuter[2]) * t
                      ];
                    }
                    
                    return `radial-gradient(circle, rgba(${innerColor[0]},${innerColor[1]},${innerColor[2]},${innerAlpha}) 0%, rgba(${outerColor[0]},${outerColor[1]},${outerColor[2]},${outerAlpha}) 70%)`;
                  })(),
                  
                  // Intensità della luce basata sulla posizione angolare: massima a 90° (timeOfDay = 0.5)
                  boxShadow: (() => {
                    // Calcolo della luminosità basata sulla posizione angolare
                    const intensity = Math.sin(timeOfDay * Math.PI);
                    const glowSize = intensity * 50 + 10;
                    const spreadSize = intensity * 20 + 5;
                    
                    // Colori di base per l'illuminazione
                    const sunColor = [255, 200, 100];
                    const moonColor = [210, 210, 255];
                    
                    // Interpolazione graduale tra colore luna e sole
                    let r, g, b, alpha;
                    
                    if (timeOfDay < 0.25) { // Da notte a alba (luna → sole)
                      const t = timeOfDay / 0.25; // 0->1
                      r = moonColor[0] + (sunColor[0] - moonColor[0]) * t;
                      g = moonColor[1] + (sunColor[1] - moonColor[1]) * t;
                      b = moonColor[2] + (sunColor[2] - moonColor[2]) * t;
                      alpha = intensity * (0.7 + t * 0.1); // Aumenta leggermente l'intensità verso il sole
                    } 
                    else if (timeOfDay < 0.75) { // Giorno pieno (sole)
                      r = sunColor[0];
                      g = sunColor[1];
                      b = sunColor[2];
                      alpha = intensity * 0.8;
                    } 
                    else { // Da tramonto a notte (sole → luna)
                      const t = (timeOfDay - 0.75) / 0.25; // 0->1
                      r = sunColor[0] + (moonColor[0] - sunColor[0]) * t;
                      g = sunColor[1] + (moonColor[1] - sunColor[1]) * t;
                      b = sunColor[2] + (moonColor[2] - sunColor[2]) * t;
                      alpha = intensity * (0.8 - t * 0.1); // Diminuisce leggermente verso la luna
                    }
                    
                    return `0 0 ${glowSize}px ${spreadSize}px rgba(${r},${g},${b},${alpha})`;
                  })(),
                  // Luminosità segue una curva sinusoidale: max a 90° (timeOfDay = 0.5), min a 0° e 180° (timeOfDay = 0 o 1)
                  opacity: Math.sin(timeOfDay * Math.PI) * 0.7 + 0.3
                }}
              />

              {/* Contenitore per centrare l'immagine con overlay di sfondo */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                {/* Overlay gradiente sincronizzato con il corpo luminoso */}
                <div 
                  className="absolute inset-0 z-10"
                  style={{
                    background: (() => {
                      // Usa esattamente la stessa logica del corpo luminoso
                      // Posizione della sorgente
                      const lightPosX = timeOfDay * 100;
                      const lightPosY = 80 - Math.sin(timeOfDay * Math.PI) * 60;
                      
                      // Intensità basata sulla posizione angolare
                      const intensity = Math.sin(timeOfDay * Math.PI);
                      
                      // Colori del cielo che seguono la stessa transizione del corpo luminoso
                      let r, g, b, alpha;
                      
                      if (timeOfDay < 0.25) { // Da notte a alba (luna → sole)
                        const t = timeOfDay / 0.25;
                        // Cielo notturno (blu scuro) -> alba (arancio chiaro)
                        r = 0 + (255 - 0) * t;
                        g = 0 + (200 - 0) * t;
                        b = 30 + (100 - 30) * t;
                        alpha = 0.8 - 0.5 * t;
                      } 
                      else if (timeOfDay < 0.5) { // Da alba a mezzogiorno
                        const t = (timeOfDay - 0.25) / 0.25;
                        // Alba (arancio chiaro) -> cielo azzurro
                        r = 255 - (255 - 135) * t;
                        g = 200 + (206 - 200) * t;
                        b = 100 + (250 - 100) * t;
                        alpha = 0.3;
                      }
                      else if (timeOfDay < 0.75) { // Da mezzogiorno a tramonto
                        const t = (timeOfDay - 0.5) / 0.25;
                        // Cielo azzurro -> tramonto (arancio)
                        r = 135 + (255 - 135) * t;
                        g = 206 - (206 - 200) * t;
                        b = 250 - (250 - 100) * t;
                        alpha = 0.3;
                      } 
                      else { // Da tramonto a notte
                        const t = (timeOfDay - 0.75) / 0.25;
                        // Tramonto (arancio) -> cielo notturno (blu scuro)
                        r = 255 - 255 * t;
                        g = 200 - 200 * t;
                        b = 100 - (100 - 30) * t;
                        alpha = 0.3 + 0.5 * t;
                      }
                      
                      return `linear-gradient(to bottom, rgba(${r},${g},${b},${alpha}) 0%, transparent 60%)`;
                    })()
                  }}
                ></div>
                
                {/* Sistema di illuminazione migliorato e effetti volumetrici */}
                
                {/* 1. Luce primaria che illumina direttamente la scena */}
                <div 
                  className="absolute inset-0 z-5 pointer-events-none"
                  style={{
                    background: (() => {
                      // Posizione della sorgente luminosa
                      const lightPosX = timeOfDay * 100; // Percentuale orizzontale (0-100%)
                      const lightPosY = 80 - Math.sin(timeOfDay * Math.PI) * 60; // Percentuale verticale
                      
                      // Intensità della luce basata sulla posizione angolare
                      const intensity = Math.sin(timeOfDay * Math.PI);
                      
                      // Colori della luce (transizione graduale)
                      let r, g, b;
                      
                      if (timeOfDay < 0.25) { // Da notte a alba (luna → sole)
                        const t = timeOfDay / 0.25;
                        r = 210 + (255 - 210) * t;
                        g = 210 + (255 - 210) * t;
                        b = 255 - (255 - 200) * t;
                      } 
                      else if (timeOfDay < 0.75) { // Giorno pieno (sole)
                        r = 255;
                        g = 255;
                        b = 200;
                      } 
                      else { // Da tramonto a notte (sole → luna)
                        const t = (timeOfDay - 0.75) / 0.25;
                        r = 255 - (255 - 210) * t;
                        g = 255 - (255 - 210) * t;
                        b = 200 + (255 - 200) * t;
                      }
                      
                      // Luce più intensa e visibile
                      return `radial-gradient(circle at ${lightPosX}% ${lightPosY}%, rgba(${r},${g},${b},${intensity * 0.4}) 0%, rgba(${r},${g},${b},0) 100%)`;
                    })(),
                    mixBlendMode: 'screen',
                  }}
                />
                
                {/* 2. Raggi di luce volumetrica che emanano dalla sorgente */}
                <div
                  className="absolute inset-0 z-6 pointer-events-none overflow-hidden"
                  style={{
                    opacity: (() => {
                      // Intensità basata sulla posizione angolare
                      const intensity = Math.sin(timeOfDay * Math.PI);
                      return intensity * 0.7;
                    })(),
                  }}
                >
                  {Array.from({ length: 6 }).map((_, index) => {
                    // Angolo di rotazione per ciascun raggio
                    const rotation = index * 60;
                    
                    // Colore basato sul momento del giorno
                    const lightColor = (() => {
                      if (timeOfDay < 0.25) { // Da notte a alba
                        const t = timeOfDay / 0.25;
                        return `rgba(210,210,255,${0.15 + t * 0.1})`;
                      } 
                      else if (timeOfDay < 0.75) { // Giorno
                        return `rgba(255,255,200,0.25)`;
                      } 
                      else { // Tramonto a notte
                        const t = (timeOfDay - 0.75) / 0.25;
                        return `rgba(255,200,100,${0.25 - t * 0.1})`;
                      }
                    })();
                    
                    // Posizione orizzontale e verticale della fonte luminosa
                    const lightPosX = timeOfDay * 100;
                    const lightPosY = 80 - Math.sin(timeOfDay * Math.PI) * 60;
                    
                    return (
                      <div 
                        key={index} 
                        className="absolute origin-bottom-left"
                        style={{
                          left: `${lightPosX}%`,
                          top: `${lightPosY}%`,
                          width: '1px',
                          height: '200%',
                          background: `linear-gradient(to top, ${lightColor} 0%, transparent 100%)`,
                          transform: `rotate(${rotation}deg) scaleX(${Math.sin(timeOfDay * Math.PI) * 20})`,
                          boxShadow: `0 0 10px 2px ${lightColor}`,
                          opacity: Math.sin(timeOfDay * Math.PI) * 0.8,
                        }}
                      />
                    );
                  })}
                </div>
                
                {/* 3. Ombre dinamiche generate dalla sorgente luminosa */}
                <div
                  className="absolute inset-0 z-7 pointer-events-none"
                  style={{
                    background: (() => {
                      // Posizione della sorgente
                      const lightPosX = timeOfDay * 100; // 0-100%
                      
                      // Crea ombre inverse rispetto alla posizione della luce
                      const shadowDir = lightPosX > 50 ? 'to right' : 'to left';
                      const shadowStart = lightPosX > 50 ? 0 : 100;
                      const shadowStartPercentage = Math.abs(lightPosX - shadowStart) / 100;
                      
                      // Intensità dell'ombra basata su posizione angolare e direzione
                      const intensity = Math.sin(timeOfDay * Math.PI);
                      const shadowIntensity = 0.5 + intensity * 0.3;
                      
                      return `linear-gradient(${shadowDir}, rgba(0,0,20,${shadowIntensity * shadowStartPercentage * 0.7}) 0%, transparent ${60 * intensity}%)`;
                    })(),
                    mixBlendMode: 'multiply',
                  }}
                />
                
                {/* Sistema multi-layer per effetto 3D avanzato */}
                <motion.div 
                  className="relative w-full z-0"
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    perspective: '2000px',
                    perspectiveOrigin: 'center center',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Layer 1: Skyline sfondo (lontano, movimento lento) */}
                  <motion.div
                    className="absolute inset-0 z-1 flex items-center justify-center md:items-end"
                    style={{
                      x: isClient ? mousePosition.x * -10 : 0,
                      y: isClient ? mousePosition.y * -5 : 0,
                      filter: 'brightness(0.7) contrast(0.9) blur(2px)',
                      transformStyle: 'preserve-3d',
                      transform: `translateZ(-100px) scale(1.05)`,
                    }}
                  >
                    <img 
                      src="/images/93bf1e09-7df4-40f2-91f1-d7a186cbdaf8.png"
                      alt="Skyline Background Layer"
                      className="h-auto w-full md:w-auto md:max-h-screen object-contain md:object-bottom opacity-80 transform md:translate-y-0 -translate-y-4"
                    />
                    {/* Nebbia distante che separa i layer */}
                    <div className="absolute inset-0 bg-black/30"></div>
                  </motion.div>
                  
                  {/* Layer 2: Skyline medio (movimento medio) */}
                  <motion.div
                    className="absolute inset-0 z-2 flex items-center justify-center md:items-end"
                    style={{
                      x: isClient ? mousePosition.x * -20 : 0,
                      y: isClient ? mousePosition.y * -10 : 0,
                      filter: (() => {
                        // Filtro sincronizzato con la posizione del corpo luminoso
                        const intensity = Math.sin(timeOfDay * Math.PI);
                        let brightness, sepia, contrast;
                        
                        // Usiamo la stessa logica del corpo luminoso
                        if (timeOfDay < 0.25) { // Da notte a alba
                          const t = timeOfDay / 0.25;
                          brightness = 0.8 + t * 0.15;
                          contrast = 1.0;
                          sepia = t * 0.1;
                        }
                        else if (timeOfDay < 0.5) { // Da alba a mezzogiorno
                          const t = (timeOfDay - 0.25) / 0.25;
                          brightness = 0.95 + t * 0.15;
                          contrast = 1.0 + t * 0.05;
                          sepia = 0.1 - t * 0.05;
                        }
                        else if (timeOfDay < 0.75) { // Da mezzogiorno a tramonto
                          const t = (timeOfDay - 0.5) / 0.25;
                          brightness = 1.1 - t * 0.15;
                          contrast = 1.05 - t * 0.05;
                          sepia = 0.05 + t * 0.05;
                        }
                        else { // Da tramonto a notte
                          const t = (timeOfDay - 0.75) / 0.25;
                          brightness = 0.95 - t * 0.15;
                          contrast = 1.0;
                          sepia = 0.1 - t * 0.1;
                        }
                        
                        return `brightness(${brightness}) contrast(${contrast}) ${sepia > 0 ? `sepia(${sepia})` : ''} blur(1px)`;
                      })(),
                      transformStyle: 'preserve-3d',
                      transform: `translateZ(-50px) scale(1.025)`,
                    }}
                  >
                    <img 
                      src="/images/93bf1e09-7df4-40f2-91f1-d7a186cbdaf8.png"
                      alt="Skyline Middle Layer"
                      className="h-auto w-full md:w-auto md:max-h-screen object-contain md:object-bottom opacity-90 transform md:translate-y-0 -translate-y-4"
                    />
                    {/* Leggera foschia tra layer */}
                    <div className="absolute inset-0 bg-black/15"></div>
                  </motion.div>
                  
                  {/* Layer 3: Skyline principale in primo piano (movimento rapido) */}
                  <motion.div
                    className="absolute inset-0 z-3 flex items-center justify-center md:items-end"
                    style={{
                      x: isClient ? mousePosition.x * -30 : 0,
                      y: isClient ? mousePosition.y * -15 : 0,
                      transformStyle: 'preserve-3d',
                      transform: `translateZ(20px)`,
                    }}
                  >
                    <motion.img 
                      src="/images/93bf1e09-7df4-40f2-91f1-d7a186cbdaf8.png"
                      alt="Skyline Front Layer"
                      className="h-auto w-full md:w-auto md:max-h-screen object-contain md:object-bottom relative transform md:translate-y-0 -translate-y-4"
                      style={{
                        filter: (() => {
                          // Filtro sincronizzato con la posizione del corpo luminoso
                          const intensity = Math.sin(timeOfDay * Math.PI);
                          let brightness, sepia, contrast;
                          
                          // Usiamo la stessa logica del corpo luminoso
                          if (timeOfDay < 0.25) { // Da notte a alba
                            const t = timeOfDay / 0.25; // 0->1
                            brightness = 0.85 + t * 0.15;
                            sepia = t * 0.15;
                            contrast = 1.1;
                          }
                          else if (timeOfDay < 0.5) { // Da alba a mezzogiorno
                            const t = (timeOfDay - 0.25) / 0.25; // 0->1
                            brightness = 1.0 + t * 0.2;
                            sepia = 0.15 - t * 0.1;
                            contrast = 1.1 - t * 0.05;
                          }
                          else if (timeOfDay < 0.75) { // Da mezzogiorno a tramonto
                            const t = (timeOfDay - 0.5) / 0.25; // 0->1
                            brightness = 1.2 - t * 0.2;
                            sepia = 0.05 + t * 0.1;
                            contrast = 1.05 + t * 0.05;
                          }
                          else { // Da tramonto a notte
                            const t = (timeOfDay - 0.75) / 0.25; // 0->1
                            brightness = 1.0 - t * 0.15;
                            sepia = 0.15 - t * 0.15;
                            contrast = 1.1;
                          }
                          
                          return `brightness(${brightness}) contrast(${contrast}) ${sepia > 0 ? `sepia(${sepia})` : ''}`;
                        })(),
                      }}
                    />
                  </motion.div>
                  
                  {/* Overlay di nebbia/foschia che aggiunge profondità tra i layer */}
                  <motion.div 
                    className="absolute inset-0 z-4" 
                    style={{
                      background: `radial-gradient(circle at center, transparent 30%, rgba(0,0,5,0.2) 70%, rgba(0,0,10,0.3) 100%)`,
                      opacity: 0.4,
                      transform: isClient ? `translateZ(40px) rotateX(${mousePosition.y * 0.5}deg)` : 'none',
                    }}
                  />
                  
                  {/* Overlay ombre dinamiche per aumentare profondità */}
                  <motion.div 
                    className="absolute inset-0 z-5" 
                    style={{
                      boxShadow: `inset 0 -50px 100px rgba(0,0,0,0.5)`,
                      opacity: Math.sin(timeOfDay * Math.PI) * 0.3 + 0.3,
                      transform: isClient ? `translateZ(60px) rotateX(${mousePosition.y * 0.8}deg)` : 'none',
                    }}
                  />
                  
                  {/* Overlay gradiente dal basso */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </motion.div>
              </div>
              
              {/* Campo stellare 3D con tre livelli di profondità */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Strato di stelle lontane - movimento lento */}
                <motion.div 
                  className="absolute inset-0 z-5"
                  animate={{
                    y: [0, -5, 0],
                    opacity: timeOfDay > 0.25 && timeOfDay < 0.75 ? [0.1, 0.05, 0.1] : [0.6, 0.4, 0.6]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 8,
                    ease: "easeInOut"
                  }}
                  style={{
                    x: isClient ? mousePosition.x * -5 : 0,
                    filter: `blur(${timeOfDay > 0.25 && timeOfDay < 0.75 ? 2 : 0.5}px)`
                  }}
                >
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div 
                      key={`star-distant-${i}`}
                      className="absolute"
                      style={{
                        width: `${0.5 + (i % 2) * 0.5}px`,
                        height: `${0.5 + (i % 2) * 0.5}px`,
                        top: `${(i % 100)}%`,
                        left: `${(i * 1.7) % 100}%`,
                        backgroundColor: i % 7 === 0 ? 'rgba(200, 220, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                        boxShadow: '0 0 2px rgba(255, 255, 255, 0.5)',
                        borderRadius: '50%',
                        opacity: timeOfDay > 0.25 && timeOfDay < 0.75 ? 0.2 : 0.9
                      }}
                    />
                  ))}
                </motion.div>
                
                {/* Strato di stelle intermedie - movimento medio */}
                <motion.div 
                  className="absolute inset-0 z-10"
                  animate={{
                    y: [0, -10, 0],
                    opacity: timeOfDay > 0.25 && timeOfDay < 0.75 ? [0.1, 0.05, 0.1] : [0.8, 0.5, 0.8] 
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 6,
                    ease: "easeInOut"
                  }}
                  style={{
                    x: isClient ? mousePosition.x * -15 : 0,
                    filter: `blur(${timeOfDay > 0.25 && timeOfDay < 0.75 ? 1 : 0}px)`
                  }}
                >
                  {Array.from({ length: 70 }).map((_, i) => (
                    <div 
                      key={`star-mid-${i}`}
                      className="absolute"
                      style={{
                        width: `${1 + (i % 3) * 0.5}px`,
                        height: `${1 + (i % 3) * 0.5}px`,
                        top: `${(i * 1.3) % 100}%`,
                        left: `${(i * 2.1) % 100}%`,
                        backgroundColor: i % 9 === 0 ? 
                          'rgba(200, 255, 255, 0.95)' : 
                          i % 5 === 0 ? 
                          'rgba(255, 255, 200, 0.9)' : 
                          'rgba(255, 255, 255, 0.8)',
                        boxShadow: i % 9 === 0 ? 
                          '0 0 4px rgba(200, 255, 255, 0.9)' : 
                          '0 0 3px rgba(255, 255, 255, 0.7)',
                        borderRadius: '50%',
                        opacity: timeOfDay > 0.25 && timeOfDay < 0.75 ? 0.1 : 0.95
                      }}
                    />
                  ))}
                </motion.div>
                
                {/* Strato di stelle in primo piano - movimento rapido */}
                <motion.div 
                  className="absolute inset-0 z-20"
                  animate={{
                    y: [0, -20, 0],
                    scale: [1, 1.02, 1],
                    opacity: timeOfDay > 0.25 && timeOfDay < 0.75 ? [0, 0, 0] : [1, 0.8, 1]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut"
                  }}
                  style={{
                    x: isClient ? mousePosition.x * -35 : 0,
                  }}
                >
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div 
                      key={`star-front-${i}`}
                      className="absolute"
                      style={{
                        width: `${1.5 + (i % 4) * 0.8}px`,
                        height: `${1.5 + (i % 4) * 0.8}px`,
                        top: `${(i * 3) % 100}%`,
                        left: `${(i * 3.3) % 100}%`,
                        backgroundColor: i % 5 === 0 ? 
                          'rgba(255, 255, 220, 1)' : 
                          'rgba(255, 255, 255, 1)',
                        boxShadow: i % 5 === 0 ? 
                          '0 0 8px 2px rgba(255, 255, 220, 0.9), 0 0 12px rgba(255, 255, 150, 0.5)' : 
                          '0 0 6px 1px rgba(255, 255, 255, 0.9)',
                        borderRadius: '50%',
                        opacity: timeOfDay > 0.25 && timeOfDay < 0.75 ? 0 : 1
                      }}
                    />
                  ))}
                </motion.div>
              </div>
              
              {/* Punti luce in primo piano (finestre e luci città) */}
              <motion.div 
                className="absolute inset-0 z-25"
                style={{
                  x: isClient ? mousePosition.x * -40 : 0,
                  y: isClient ? mousePosition.y * -25 : 0
                }}
              >
                <div className="absolute bottom-0 w-full h-full overflow-hidden pointer-events-none">
                  <div className="absolute inset-0">
                    {/* Punti luce in primo piano - finestre e luci città */}
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div 
                        key={`light-spot-${i}`}
                        className="absolute"
                        style={{
                          width: `${1 + (i % 4) * 0.8}px`,
                          height: `${1 + (i % 4) * 0.8}px`,
                          bottom: `${10 + (i % 25) * 3}%`,
                          left: `${(i * 2) % 100}%`,
                          backgroundColor: i % 5 === 0 ? 
                            timeOfDay < 0.25 || timeOfDay > 0.75 ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 215, 0, 0.3)' : 
                            timeOfDay < 0.25 || timeOfDay > 0.75 ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.2)',
                          boxShadow: i % 5 === 0 ? 
                            timeOfDay < 0.25 || timeOfDay > 0.75 ? '0 0 8px 2px rgba(255, 215, 0, 0.6)' : '0 0 5px rgba(255, 215, 0, 0.2)' : 
                            timeOfDay < 0.25 || timeOfDay > 0.75 ? '0 0 6px rgba(255, 255, 255, 0.6)' : '0 0 3px rgba(255, 255, 255, 0.2)',
                          borderRadius: '50%',
                          opacity: timeOfDay < 0.25 || timeOfDay > 0.75 ? 0.7 + (i % 3) * 0.1 : 0.2 + (i % 3) * 0.1
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
              
              {/* Effetto luci riflesse */}
              <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-highlight/10 to-transparent opacity-40"></div>
            </div>
          </ClientOnlyWrapper>
        </div>
          
        {/* Particelle luminose intense e visibili */}
        <ClientOnlyWrapper>
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((particle) => (
              <div 
                key={particle.id} 
                className="absolute animate-pulse"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  boxShadow: `0 0 15px 5px rgba(221, 167, 79, 0.8)`,
                  borderRadius: '50%',
                  background: '#DDA74F',
                  top: `${particle.top}%`,
                  left: `${particle.left}%`,
                  opacity: particle.opacity,
                  animation: `pulse ${particle.animationDuration}s ease-in-out infinite`,
                  animationDelay: `${particle.animationDelay}s`,
                }}
              ></div>
            ))}
          </div>
        </ClientOnlyWrapper>
          
        {/* Effetto riflessi delle luci della città */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-highlight/15 to-transparent opacity-60"></div>

        {/* Effetto vignette per profondità */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 150px rgba(0,0,0,0.9)'
          }}
        ></div>
      </div>
      
      <div className="relative z-20 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-4">
        {/* Contenitore per mobile con ordine personalizzato */}
        <div className="flex flex-col w-full md:hidden mb-6">
          {/* Solo titolo principale su mobile sopra immagine */}
          <MobileTitle />
        </div>

        {/* Testo e CTA - versione desktop e mobile sotto */}
        <div ref={textRef} className="md:w-1/2 text-center md:text-left mb-12 md:mb-0 hidden md:block">
          <ClientOnlyWrapper>
            <motion.h1 
              className="animate-text text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              <span className="block relative z-10">
                <span className="text-white drop-shadow-[0_5px_15px_rgba(255,255,255,0.5)] relative z-10">Eccellenza in</span>
                <span className="absolute top-0 left-1 text-darkgold/30 blur-[2px] z-0">Eccellenza in</span>
              </span>
              <span className="block mt-2 relative z-10">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-highlight to-primary text-shadow-xl">
                  Ogni Dettaglio
                </span>
                <span className="absolute -inset-2 bg-gradient-to-r from-primary/0 via-highlight/20 to-primary/0 blur-xl -z-10 opacity-50"></span>
              </span>
            </motion.h1>
          </ClientOnlyWrapper>

          <ClientOnlyWrapper>
            <motion.p 
              className="animate-text text-lg md:text-xl mb-10 max-w-xl text-white leading-relaxed hidden md:inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, delay: 1.0 }}
            >
              <span className="backdrop-blur-md px-4 py-3 bg-black/30 border-l-2 border-highlight/80 shadow-[0_0_15px_rgba(221,167,79,0.3)] inline-block rounded-r-md">
                Scopri la collezione esclusiva di Borgonuovo Gioielli 10, 
                dove ogni creazione è un capolavoro di artigianato e raffinatezza.
              </span>
            </motion.p>
          </ClientOnlyWrapper>
          
          <ClientOnlyWrapper>
            <motion.div 
              className="animate-text hidden md:block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <button className="relative overflow-hidden bg-gradient-to-r from-darkgold via-primary to-highlight text-secondary font-semibold py-3 px-10 rounded-md shadow-[0_4px_20px_rgba(184,134,11,0.5)] transition-all duration-300 transform hover:scale-105 group">
                <span className="relative z-10">Esplora la Collezione</span>
                {/* Effetto glow sul bottone */}
                <span className="absolute inset-0 bg-gradient-to-r from-highlight via-primary to-highlight bg-[length:200%_100%] animate-shimmer"></span>
                {/* Effetto particelle sul bottone */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  {buttonParticles.map((particle) => (
                    <span 
                      key={particle.id}
                      className="absolute w-1 h-1 bg-white rounded-full animate-particle"
                      style={{
                        top: `${particle.top}%`,
                        left: `${particle.left}%`,
                        animationDelay: `${particle.animationDelay}s`,
                        animationDuration: `${particle.animationDuration}s`,
                      }}
                    />
                  ))}
                </span>
              </button>
            </motion.div>
          </ClientOnlyWrapper>
        </div>
        
        {/* Area per immagine luxury brand */}
        <motion.div 
          className="md:w-1/2 h[50px] md:h-[100px] relative overflow-hidden rounded-xl md:glass-effect"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.2 }}
        >
          {/* Rimosso il div con gradiente che causava l'ombra */}
          
          {/* Logo luminoso e animazione particelle - visibile solo su desktop */}
          <div className="absolute inset-0 hidden md:flex items-center justify-center overflow-hidden">
            {/* Effetto aura dorata - visibile solo su desktop */}
            <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-primary to-highlight opacity-30 blur-2xl animate-pulse-slow"></div>
            
            {/* Logo brand in evidenza */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 1.5 }}
              className="relative z-10 text-center"
            >
              <div className="text-4xl font-serif font-bold text-white mb-3 drop-shadow-[0_0_8px_rgba(221,167,79,0.85)] filter-none relative hidden md:block" style={{ textShadow: '0 0 7px rgba(221,167,79,0.7), 0 0 10px rgba(221,167,79,0.5)' }}>
                Borgonuovo
                <span className="luxury-gold"> 10</span>
              </div>
              <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent mb-3 hidden md:block"></div>
              <div className="text-sm text-accent tracking-widest hidden md:block">ALTA GIOIELLERIA</div>
            </motion.div>
          </div>
          
          {/* Contenitore per il pulsante sotto l'immagine solo su mobile */}
          <div className="md:hidden w-full mt-32 flex justify-center">
            <a 
              href="/collezione" 
              className="bg-gradient-to-r from-[#B8860B] to-[#DAA520] text-black 
                font-semibold py-3 px-10 rounded-md 
                text-lg"
            >
              Esplora la Collezione
            </a>
          </div>
          
          {/* Particelle dorate fluttuanti */}
          <ClientOnlyWrapper>
            <div className="absolute inset-0">
              {logoParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute rounded-full bg-primary"
                  style={{
                    width: particle.size,
                    height: particle.size,
                    boxShadow: '0 0 10px 2px rgba(221, 167, 79, 0.8)',
                    x: particle.x,
                    y: particle.y,
                  }}
                  animate={{
                    x: particle.animateX,
                    y: particle.animateY,
                    opacity: [0.2, 0.7, 0.2],
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </ClientOnlyWrapper>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ 
          y: [0, 10, 0],
          opacity: [1, 0.5, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;
