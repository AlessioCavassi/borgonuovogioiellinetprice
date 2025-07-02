import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Dati di esempio per le categorie con immagini che riflettono il tema high night life
const categories = [
  {
    id: 'bracelets',
    name: 'Bracciali',
    image: '/images/luxury-bracelet.jpg',
    description: 'Opere d\'arte da indossare al polso, creazioni uniche che combinano design e materiali preziosi.',
    count: 38
  },
  {
    id: 'rings',
    name: 'Anelli',
    image: '/images/luxury-ring.jpg',
    description: 'Simboli di eleganza e raffinatezza, ogni anello racconta una storia di bellezza senza tempo.',
    count: 45
  },
  {
    id: 'necklaces',
    name: 'Collane',
    image: '/images/luxury-necklace.jpg',
    description: 'Dal design sofisticato e contemporaneo, le nostre collane sono protagoniste di ogni occasione.',
    count: 32
  },
  {
    id: 'earrings',
    name: 'Orecchini',
    image: '/images/luxury-earrings.jpg',
    description: 'Dettagli luminosi che incorniciano il viso con eleganza e unicità in ogni occasione.',
    count: 41
  },
  {
    id: 'watches',
    name: 'Orologi',
    image: '/images/luxury-watch.jpg',
    description: 'Meccanismi perfetti racchiusi in design senza tempo, espressione di stile e precisione.',
    count: 23
  }
];

const CategoryCard = ({ category, index }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: index * 0.1
      }
    }
  };

  const imageVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  const overlayVariants = {
    hover: { 
      backgroundColor: 'rgba(11, 20, 37, 0.7)',
      backdropFilter: 'blur(4px)',
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-lg shadow-xl shadow-darkgold/10 group border border-highlight/10"
    >
      <Link href={`/category/${category.id}`}>
        <div className="block h-full">
          <motion.div 
            className="relative w-full h-80 overflow-hidden"
            whileHover="hover"
          >
            {/* Immagine */}
            <motion.div
              variants={imageVariants}
              className="absolute inset-0"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                style={{ objectFit: 'cover' }}
                placeholder="blur" 
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAI/QX97eZwWQAAAABJRU5ErkJggg=="
              />
            </motion.div>
            
            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              className="absolute inset-0 bg-nightblue/40 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm"
            >
              <h3 className="text-3xl font-serif luxury-gold mb-2 text-shadow">{category.name}</h3>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-highlight/80 to-transparent mb-4"></div>
              <p className="text-sm text-accent/90 mb-5 max-w-xs leading-relaxed">{category.description}</p>
              <span className="inline-flex items-center px-5 py-1.5 bg-darkgold/20 border border-highlight/30 backdrop-blur-sm rounded-full">
                <span className="text-sm font-medium text-highlight/90">{category.count} Pezzi</span>
              </span>
              
              <motion.div
                className="absolute bottom-6 right-6 bg-gradient-to-br from-darkgold to-highlight w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-primary/20"
                whileHover={{ scale: 1.1, boxShadow: '0 8px 16px rgba(184, 134, 11, 0.3)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

const JewelryCategories = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {categories.map((category, index) => (
        <CategoryCard key={category.id} category={category} index={index} />
      ))}
    </div>
  );
};

export default JewelryCategories;
