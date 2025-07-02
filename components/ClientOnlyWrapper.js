import { useEffect, useState } from 'react';

// Componente wrapper che renderizza il suo contenuto solo lato client
// per evitare errori di idratazione con componenti che usano valori casuali
export default function ClientOnlyWrapper({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? children : <div className="min-h-screen bg-nightblue" />;
}
