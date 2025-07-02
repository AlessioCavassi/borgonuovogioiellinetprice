# Borgonuovo Gioielli 10 - Sito Vetrina

Un sito web moderno e cinematografico per lo showroom Borgonuovo Gioielli 10, con animazioni 3D e una presentazione innovativa dei prodotti.

## Caratteristiche

- Design elegante e lussuoso
- Animazioni e transizioni fluide con GSAP
- Visualizzazione 3D dei gioielli con Three.js
- Layout responsive e ottimizzato per dispositivi mobili
- Visualizzazione dettagliata di ogni gioiello con informazioni specifiche
- Effetti visivi moderni e cinematografici

## Tecnologie utilizzate

- **Next.js**: Framework React per applicazioni web
- **Three.js** e **React Three Fiber**: Per la visualizzazione 3D
- **GSAP**: Per animazioni avanzate
- **Framer Motion**: Per micro-interazioni ed effetti di movimento
- **Tailwind CSS**: Per lo styling e il design responsive

## Struttura del progetto

- `/components`: Componenti React riutilizzabili
- `/pages`: Pagine del sito
- `/public/images`: File immagine per i gioielli
- `/styles`: Fogli di stile CSS
- `/models`: Modelli 3D per i gioielli (da aggiungere)

## Come iniziare

1. Clona la repository
```bash
git clone https://github.com/AlessioCavassi/borgonuovogioiellinetprice.git
cd borgonuovogioiellinetprice
```

2. Installa le dipendenze
```bash
npm install
```

3. Avvia il server di sviluppo
```bash
npm run dev
```

4. Apri il browser e naviga a `http://localhost:3000`

## Gestione dei gioielli

Per aggiungere nuovi gioielli al catalogo, è necessario:

1. Aggiungere le immagini alla cartella `/public/images`
2. Aggiungere i dati del gioiello al database o al file di configurazione

## Personalizzazione

Il sito può essere facilmente personalizzato modificando:

- I colori principali in `tailwind.config.js`
- Gli stili globali in `styles/globals.css`
- Le animazioni nei rispettivi componenti

## Implementazioni future

- Integrare un CMS per la gestione dei contenuti
- Migliorare i modelli 3D per rappresentazioni più realistiche dei gioielli
- Aggiungere filtri di ricerca e categorizzazione avanzata
- Implementare funzioni di prenotazione per appuntamenti in showroom
