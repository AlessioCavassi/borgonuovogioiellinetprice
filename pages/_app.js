import '../styles/globals.css';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

function MyApp({ Component, pageProps, router }) {
  return (
    <>
      <Head>
        <title>Borgonuovo Gioielli 10 | Luxury Jewelry</title>
        <meta name="description" content="Borgonuovo Gioielli 10 - Collezione esclusiva di gioielli di lusso" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={router.route}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default MyApp;
