import { motion } from 'framer-motion';
import ClientOnlyWrapper from '../ClientOnlyWrapper';

// Componente titolo ottimizzato per mobile senza l'effetto di testo duplicato
export default function MobileTitle() {
  return (
    <ClientOnlyWrapper>
      <motion.h1 
        className="animate-text text-4xl font-serif font-bold mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <span className="block relative z-10">
          {/* Titolo con effetto ombra CSS invece di duplicare il testo */}
          <span 
            className="text-white relative z-10"
            style={{ 
              textShadow: '0 0 15px rgba(255,255,255,0.5), 1px 1px 2px rgba(221,167,79,0.3)'
            }}
          >
            Eccellenza in
          </span>
        </span>
        <span className="block mt-2 relative z-10">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-highlight to-primary text-shadow-xl">
            Ogni Dettaglio
          </span>
          <span className="absolute -inset-2 bg-gradient-to-r from-primary/0 via-highlight/20 to-primary/0 blur-xl -z-10 opacity-50"></span>
        </span>
      </motion.h1>
    </ClientOnlyWrapper>
  );
}
