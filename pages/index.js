import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import FeaturedJewels from '../components/FeaturedJewels';
import JewelryCategories from '../components/JewelryCategories';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function Home() {
  const mainRef = useRef(null);
  
  useEffect(() => {
    // Registra il plugin ScrollTrigger
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Animazione di parallax e rivelazione degli elementi al scroll
    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => {
      gsap.fromTo(section, 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          }
        }
      );
    });

    // Effetto di floating per elementi con la classe .floating
    const floatingElements = document.querySelectorAll('.floating');
    floatingElements.forEach((el, i) => {
      gsap.to(el, {
        y: '20px',
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.2,
      });
    });

    return () => {
      // Pulizia delle animazioni quando il componente viene smontato
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf('.floating');
    };
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-secondary text-accent">
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section con video o animazione 3D */}
        <Hero />
        
        {/* Sezione gioielli in evidenza */}
        <section className="section py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif luxury-gold mb-4">Collezione Esclusiva</h2>
            <p className="text-lg max-w-2xl mx-auto">
              Gioielli unici che rappresentano l'eccellenza dell'artigianato italiano e la perfezione dei materiali più preziosi
            </p>
          </motion.div>
          
          <FeaturedJewels />
        </section>
        
        {/* Categorie di gioielli */}
        <section className="section py-20 bg-black/30 backdrop-blur-sm">
          <div className="px-4 md:px-8 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif luxury-gold mb-4">Collezioni</h2>
              <p className="text-lg max-w-2xl mx-auto">
                Esplora le nostre diverse collezioni, ognuna con il suo carattere distintivo
              </p>
            </motion.div>
            
            <JewelryCategories />
          </div>
        </section>
        
        {/* Sezione About/Story con parallax */}
        <section className="section relative py-32 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            {/* Background pattern o immagine con parallax */}
            <div className="absolute inset-0 bg-[url('/images/bg-pattern.png')] bg-repeat opacity-10"></div>
          </div>
          
          <div className="relative z-10 px-4 md:px-8 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-serif luxury-gold mb-6">La Nostra Storia</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
              <p className="text-lg mb-8">
                Borgonuovo Gioielli 10 rappresenta l'eccellenza nel mondo della gioielleria di lusso. 
                Ogni creazione è frutto di una tradizione artigianale che si tramanda da generazioni,
                combinata con un design contemporaneo e innovativo.
              </p>
              <p className="text-lg mb-8">
                Le nostre creazioni nascono dalla selezione dei materiali più preziosi e rari,
                lavorati con maestria per creare gioielli che sono vere opere d'arte da indossare.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
