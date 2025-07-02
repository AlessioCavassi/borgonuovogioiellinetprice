import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Dati di esempio per i gioielli in evidenza
// In una implementazione reale, questi dati verrebbero caricati da un'API o da un file di dati
const featuredJewelryData = [
  {
    id: 'br-56904',
    code: 'BR 56904',
    name: 'Bracciale',
    weight: '91,50',
    description: 'BR 25,12 FG VS',
    stones: 'SME NAT. COLOMBIA 47,26',
    price: '247.000,00',
    image: '/images/jewelry-bracelet.jpg' // Usando l'immagine fornita
  },
  {
    id: 'an-78234',
    code: 'AN 78234',
    name: 'Anello',
    weight: '16,25',
    description: 'AN 4,31 FG VS',
    stones: 'DIAMANTI 8,75',
    price: '87.500,00',
    image: '/images/jewelry-ring.jpg' // Usando l'immagine fornita
  },
  {
    id: 'co-32145',
    code: 'CO 32145',
    name: 'Collana',
    weight: '45,80',
    description: 'CO 18,25 FG VS',
    stones: 'RUBINO BIRMANIA 12,50',
    price: '135.000,00',
    image: '/images/jewelry-necklace.jpg' // Usando l'immagine fornita
  },
  {
    id: 'or-65432',
    code: 'OR 65432',
    name: 'Orecchini',
    weight: '24,30',
    description: 'OR 6,85 FG VS',
    stones: 'ZAFFIRI 4,55',
    price: '95.800,00',
    image: '/images/jewelry-earrings.jpg' // Usando l'immagine fornita
  }
];

const JewelCard = ({ jewel, index }) => {
  // Riferimento per l'hover effect
  const cardRef = useRef(null);
  
  // Gestione dell'effetto parallax al movimento del mouse
  useEffect(() => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    
    const handleMouseMove = (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      const xPercent = x / width - 0.5;
      const yPercent = y / height - 0.5;
      
      const rotateX = yPercent * 10; // Rotazione massima di 10 gradi
      const rotateY = xPercent * -10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Effetto dinamico sul bordo luminoso
      const highlightElements = card.querySelectorAll('.dynamic-highlight');
      if (highlightElements.length > 0) {
        highlightElements.forEach(el => {
          el.style.opacity = Math.max(0.4, 0.8 - Math.abs(xPercent) - Math.abs(yPercent));
        });
      }
    };
    
    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      
      // Reset dell'effetto luminoso
      const highlightElements = card.querySelectorAll('.dynamic-highlight');
      if (highlightElements.length > 0) {
        highlightElements.forEach(el => {
          el.style.opacity = 0.4;
        });
      }
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="jewel-card bg-nightblue/40 rounded-lg overflow-hidden transition-all duration-300 parallax border border-highlight/10 relative"
      style={{ transition: 'transform 0.3s ease' }}
    >
      {/* Highlights dinamici sui bordi */}
      <div className="absolute inset-0 opacity-0 dynamic-highlight">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-highlight/50 to-primary/30 rounded-lg blur-xl"></div>
      </div>
      <div className="relative aspect-square overflow-hidden jewel-shine">
        {/* Placeholder per l'immagine - andrà sostituito con immagini reali */}
        <Image
          src={jewel.image}
          alt={`${jewel.name} ${jewel.code}`}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-700 hover:scale-110"
          placeholder="blur" 
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAI/QX97eZwWQAAAABJRU5ErkJggg=="
        />
        
        {/* Overlay con codice gioiello */}
        <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full text-sm">
          {jewel.code}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-serif luxury-gold mb-2">{jewel.name}</h3>
        <p className="text-sm opacity-80 mb-1">Peso: {jewel.weight} gr</p>
        <p className="text-sm opacity-80 mb-1">{jewel.description}</p>
        <p className="text-sm opacity-80 mb-3">{jewel.stones}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-semibold luxury-gold">€ {jewel.price}</p>
          <Link href={`/jewelry/${jewel.id}`}>
            <button className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-secondary px-4 py-2 rounded-md text-sm transition-all duration-300">
              Dettagli
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedJewels = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {featuredJewelryData.map((jewel, index) => (
        <JewelCard key={jewel.id} jewel={jewel} index={index} />
      ))}
    </div>
  );
};

export default FeaturedJewels;
