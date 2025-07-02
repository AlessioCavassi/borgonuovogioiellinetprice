import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float } from '@react-three/drei';
import { gsap } from 'gsap';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Dati di esempio - In un'implementazione reale sarebbero caricati da un'API o database
const jewelryData = {
  'br-56904': {
    id: 'br-56904',
    code: 'BR 56904',
    name: 'Bracciale',
    weight: '91,50',
    description: 'BR 25,12 FG VS',
    stones: 'SME NAT. COLOMBIA 47,26',
    price: '247.000,00',
    material: 'Oro bianco 18kt',
    images: [
      '/images/placeholder-jewelry.jpg',
      '/images/placeholder-jewelry-2.jpg',
      '/images/placeholder-jewelry-3.jpg',
    ],
    modelType: 'bracelet',
    details: 'Bracciale in oro bianco con incastonatura di smeraldi colombiani e diamanti di alta qualità.'
  },
  'an-78234': {
    id: 'an-78234',
    code: 'AN 78234',
    name: 'Anello',
    weight: '16,25',
    description: 'AN 4,31 FG VS',
    stones: 'DIAMANTI 8,75',
    price: '87.500,00',
    material: 'Oro rosa 18kt',
    images: [
      '/images/placeholder-jewelry.jpg',
      '/images/placeholder-jewelry-2.jpg',
    ],
    modelType: 'ring',
    details: 'Anello in oro rosa con diamanti taglio brillante di purezza VS e colore F-G.'
  }
};

// Componente placeholder per il modello 3D del gioiello
const JewelModel = ({ rotationSpeed = 0.5, modelType = 'bracelet' }) => {
  // In un'implementazione reale, caricherebbe modelli 3D diversi in base al tipo di gioiello
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatingRange={[-0.1, 0.1]}>
      <mesh castShadow>
        {modelType === 'ring' ? (
          <torusGeometry args={[0.9, 0.3, 16, 50]} />
        ) : modelType === 'necklace' ? (
          <torusGeometry args={[1.5, 0.1, 16, 100]} />
        ) : (
          <dodecahedronGeometry args={[1.2, 0]} />
        )}
        <meshPhysicalMaterial 
          color="#D4AF37"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
};

// Componente principale per la pagina di dettaglio del gioiello
export default function JewelryDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [jewel, setJewel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showModel, setShowModel] = useState(false);
  
  const mainRef = useRef(null);
  const imageContainerRef = useRef(null);
  const descriptionRef = useRef(null);
  
  // Simulazione di chiamata API per recuperare i dati del gioiello
  useEffect(() => {
    if (!id) return;
    
    // Simula caricamento
    setLoading(true);
    
    // In un'implementazione reale, qui ci sarebbe una chiamata API
    setTimeout(() => {
      const jewel = jewelryData[id];
      if (jewel) {
        setJewel(jewel);
      } else {
        // Gioiello non trovato, reindirizza alla pagina principale
        router.push('/');
      }
      setLoading(false);
    }, 800); // Simulazione del tempo di caricamento
  }, [id, router]);
  
  // Animazioni quando il componente viene montato
  useEffect(() => {
    if (!loading && jewel && mainRef.current) {
      // Animazioni GSAP quando il contenuto è caricato
      const tl = gsap.timeline();
      
      tl.fromTo(
        '.jewel-title', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        0.3
      );
      
      tl.fromTo(
        '.jewel-detail', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'power3.out' },
        0.5
      );
      
      tl.fromTo(
        '.jewel-controls', 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.6 },
        1
      );
      
      // Animazione per la visualizzazione delle immagini
      if (imageContainerRef.current) {
        gsap.fromTo(
          imageContainerRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
        );
      }
    }
  }, [loading, jewel]);
  
  // Funzione per cambiare l'immagine attiva
  const handleImageChange = (index) => {
    if (index === activeImageIndex) return;
    
    gsap.to(imageContainerRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      onComplete: () => {
        setActiveImageIndex(index);
        gsap.to(imageContainerRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)'
        });
      }
    });
  };
  
  // Toggle per la visualizzazione del modello 3D o dell'immagine
  const toggleModelView = () => {
    gsap.to(imageContainerRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      onComplete: () => {
        setShowModel(!showModel);
        gsap.to(imageContainerRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.5
        });
      }
    });
  };
  
  // Rendering dello stato di caricamento
  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-accent text-lg">Caricamento in corso...</p>
        </div>
      </div>
    );
  }
  
  // Rendering del contenuto quando il gioiello è caricato
  if (!jewel) return null;

  return (
    <div ref={mainRef} className="min-h-screen bg-secondary text-accent">
      <Head>
        <title>{`${jewel.name} ${jewel.code} | Borgonuovo Gioielli 10`}</title>
        <meta name="description" content={`${jewel.name} ${jewel.description} - Borgonuovo Gioielli 10`} />
      </Head>

      <Header />
      
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center text-sm">
            <li className="inline-flex items-center">
              <Link href="/" className="text-accent/70 hover:text-primary transition-colors">
                Home
              </Link>
              <svg className="w-4 h-4 mx-2 text-accent/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="inline-flex items-center">
              <Link href="/collection" className="text-accent/70 hover:text-primary transition-colors">
                Collezione
              </Link>
              <svg className="w-4 h-4 mx-2 text-accent/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-primary">{jewel.name}</li>
          </ol>
        </nav>
        
        {/* Contenuto principale */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Colonna immagine / modello 3D */}
          <div className="relative">
            <div ref={imageContainerRef} className="w-full aspect-square relative bg-black/30 rounded-lg overflow-hidden">
              {showModel ? (
                // Vista 3D
                <div className="w-full h-full">
                  <Canvas shadows>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
                    <JewelModel modelType={jewel.modelType} />
                    <Environment preset="city" />
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
                  </Canvas>
                </div>
              ) : (
                // Vista immagine
                <Image
                  src={jewel.images[activeImageIndex]}
                  alt={`${jewel.name} ${jewel.code}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                  priority={true}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAI/QX97eZwWQAAAABJRU5ErkJggg=="
                />
              )}
              
              {/* Badge con codice gioiello */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-sm font-medium">{jewel.code}</span>
              </div>
              
              {/* Controlli */}
              <div className="jewel-controls absolute bottom-4 right-4 flex space-x-2">
                <button
                  onClick={toggleModelView}
                  className="bg-black/60 backdrop-blur-sm hover:bg-primary/80 text-white p-3 rounded-full transition-colors duration-300"
                  title={showModel ? 'Visualizza immagine' : 'Visualizza modello 3D'}
                >
                  {showModel ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* Thumbnails */}
            {!showModel && jewel.images.length > 1 && (
              <div className="mt-4 flex justify-center space-x-4">
                {jewel.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index)}
                    className={`relative w-16 h-16 rounded-md overflow-hidden ${activeImageIndex === index ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100 transition-opacity'}`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Colonna dettagli */}
          <div className="space-y-8" ref={descriptionRef}>
            <div>
              <h1 className="jewel-title text-4xl md:text-5xl font-serif luxury-gold mb-2">
                {jewel.name} <span className="text-accent text-3xl">{jewel.code}</span>
              </h1>
              <p className="jewel-detail text-lg opacity-80 mb-6">{jewel.details}</p>
            </div>
            
            <div className="space-y-4">
              <div className="jewel-detail flex justify-between py-3 border-b border-gray-700">
                <span className="text-accent/70">Peso</span>
                <span className="font-medium">{jewel.weight} gr</span>
              </div>
              
              <div className="jewel-detail flex justify-between py-3 border-b border-gray-700">
                <span className="text-accent/70">Descrizione</span>
                <span className="font-medium">{jewel.description}</span>
              </div>
              
              <div className="jewel-detail flex justify-between py-3 border-b border-gray-700">
                <span className="text-accent/70">Pietre</span>
                <span className="font-medium">{jewel.stones}</span>
              </div>
              
              <div className="jewel-detail flex justify-between py-3 border-b border-gray-700">
                <span className="text-accent/70">Materiale</span>
                <span className="font-medium">{jewel.material}</span>
              </div>
            </div>
            
            {/* Prezzo e CTA */}
            <div className="jewel-detail pt-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-accent/70 text-sm">Prezzo Netto</p>
                  <p className="text-3xl md:text-4xl luxury-gold font-serif">€ {jewel.price}</p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-primary hover:bg-primary/90 text-secondary font-semibold py-3 px-6 rounded-md shadow-lg transition-all duration-300 transform hover:scale-105">
                    Richiedi Informazioni
                  </button>
                </div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4">
                <p className="text-sm text-accent/70">
                  Per ulteriori dettagli su questo gioiello o per fissare un appuntamento per visionarlo, contattaci allo <span className="text-primary">+39 02 123 4567</span> o visita il nostro showroom in Via Borgonuovo 10, Milano.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sezione gioielli correlati */}
        <section className="mt-24">
          <h2 className="text-3xl font-serif luxury-gold mb-8 text-center">Potrebbe interessarti anche</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Qui si possono mappare altri gioielli correlati */}
            {/* Per ora mettiamo solo un placeholder */}
            <div className="bg-black/30 rounded-lg overflow-hidden h-64 flex items-center justify-center">
              <p className="text-accent/50">Gioielli correlati</p>
            </div>
            <div className="bg-black/30 rounded-lg overflow-hidden h-64 flex items-center justify-center">
              <p className="text-accent/50">Gioielli correlati</p>
            </div>
            <div className="bg-black/30 rounded-lg overflow-hidden h-64 flex items-center justify-center">
              <p className="text-accent/50">Gioielli correlati</p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
