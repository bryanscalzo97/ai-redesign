export default {
  // ─── Tabs ──────────────────────────────────────────────────────────────────
  tabs: {
    home: "Home",
    scanSpace: "Scansiona",
    properties: "Proprietà",
    profile: "Profilo",
  },

  // ─── Common ────────────────────────────────────────────────────────────────
  common: {
    cancel: "Annulla",
    save: "Salva",
    delete: "Elimina",
    share: "Condividi",
    ok: "OK",
    error: "Errore",
    done: "Fatto",
    back: "Indietro",
    next: "Avanti",
    skip: "Salta",
    retry: "Riprova",
    create: "Crea",
    generate: "Genera",
    regenerate: "Rigenera",
    loading: "Caricamento...",
    saving: "Salvataggio...",
    room: "stanza",
    rooms: "stanze",
    property: "proprietà",
    properties: "proprietà",
    before: "Prima",
    after: "Dopo",
    set: "Imposta",
    openSettings: "Apri Impostazioni",
    inspiration: "Ispirazione",
  },

  // ─── Home ──────────────────────────────────────────────────────────────────
  home: {
    welcomeTitle: "Benvenuto! Ottimizziamo la tua prima proprietà.",
    welcomeSubtitle:
      "In 2 minuti avrai un punteggio, un piano d'azione e saprai esattamente come ottenere più prenotazioni.",
    step1Label: "Dai un nome alla tua proprietà",
    step1Desc: "Crea il tuo primo annuncio",
    step2Label: "Scansiona ogni stanza",
    step2Desc: "Ottieni punteggi e suggerimenti con l'IA",
    step3Label: "Segui il piano",
    step3Desc: "Monitora i miglioramenti e il ROI",
    addFirstProperty: "Aggiungi la Tua Prima Proprietà",
    avgScore: "Punteggio Medio",
    toDo: "Da Fare",
    toInvest: "Da Investire",
    yourProperties: "Le Tue Proprietà",
    seeAll: "Vedi tutto",
    todo: "da fare",
    mostPotential: "Maggiore potenziale",
    propertiesNotScanned: "{{count}} proprietà non ancora scansionate",
    improve: "Migliora {{name}}",
    mostRoomForImprovement: "Questa proprietà ha il maggiore margine di miglioramento",
    scanFirstRoom: "Scansiona la Tua Prima Stanza",
    scanFirstRoomDesc: "Ottieni punteggi e suggerimenti di miglioramento con l'IA",
    seasonalRecommendations: "Raccomandazioni Stagionali",
    addLocationDetails: "Aggiungi la posizione alle tue proprietà per consigli stagionali",
    recentRedesigns: "Redesign Recenti",
    topPerformingStyles: "Stili Più Performanti",
    spaces: "Spazi",
    byGuestType: "Per Tipo di Ospite",
    firstPropertyTitle: "La Tua Prima Proprietà",
    firstPropertyMessage: "Come si chiama la tua proprietà? (es. Casa al Mare, Appartamento Centro)",
    createAndScan: "Crea e Scansiona",
  },

  // ─── Project List ──────────────────────────────────────────────────────────
  projectList: {
    newProperty: "Nuova Proprietà",
    enterPropertyName: "Inserisci un nome per la tua proprietà",
    noPropertiesYet: "Nessuna proprietà",
    noPropertiesDesc: "Crea una proprietà per iniziare a organizzare i tuoi redesign.",
    noPhotosYet: "Nessuna foto ancora",
    roomsScanned: "{{count}} {{rooms}} scansionate",
  },

  // ─── Project Detail ────────────────────────────────────────────────────────
  projectDetail: {
    actionPlan: "Piano d'Azione",
    roiEstimate: "Stima del ROI",
    nightlyRate: "Tariffa a Notte",
    enterNightlyRate: "Inserisci la tua tariffa media a notte ($)",
    currentOccupancy: "Occupazione Attuale",
    enterOccupancy: "Inserisci il tuo tasso medio di occupazione (%)",
    rate: "Tariffa",
    occupancy: "Occupazione",
    moreBookings: "Più prenotazioni",
    extraPerMonth: "Extra / mese",
    payback: "Rientro",
    toInvest: "Da investire",
    noRoiData: "Dati insufficienti per stimare il ROI.",
    setRateForRoi: "Imposta la tariffa a notte per vedere il ROI stimato dei miglioramenti.",
    basedOnRooms: "Basato su {{count}} {{rooms}} scansionate",
    progress: "Progresso",
    budget: "Budget",
    spent: "speso",
    total: "totale",
    scanNewRoom: "Scansiona Nuova Stanza",
    listingDescription: "Descrizione dell'Annuncio",
    writingDescription: "Scrittura della descrizione...",
    generateDescription: "Genera Descrizione dell'Annuncio",
    analyzeThisRoom: "Analizza Questa Stanza",
    analyzing: "Analisi in corso...",
    analysisComplete: "Analisi Completata",
    analysisCompleteMsg: "Stanza valutata {{score}}/10 con {{count}} suggerimenti.",
    rescan: "Ri-scansiona questa {{room}}",
    backToProperty: "Torna alla proprietà",
    noRoomsTitle: "Nessuna stanza scansionata",
    noRoomsDesc: "Scansiona le stanze con la fotocamera per ottenere punteggi e un piano di miglioramento.",
    renameProperty: "Rinomina Proprietà",
    deleteProperty: "Elimina Proprietà",
    deleteConfirm: "Questo eliminerà permanentemente {{name}} e tutte le sue scansioni. Non può essere annullato.",
    deleteEverything: "Elimina Tutto",
    enterNewName: "Inserisci un nuovo nome",
    propertyLocation: "Posizione della proprietà",
    hemisphere: "Emisfero",
    seasonalTip: "Consiglio Stagionale",
    roomBreakdown: "Dettaglio per Stanza",
    completedOf: "{{completed}} di {{total}} completati · ${{spent}} di ${{budget}}",
  },

  // ─── Camera / Scan ─────────────────────────────────────────────────────────
  camera: {
    cameraAccessNeeded: "Accesso alla fotocamera necessario",
    cameraAccessDesc: "Consenti l'accesso alla fotocamera per scansionare il tuo spazio e ottimizzare le tue foto.",
    allowCamera: "Consenti Fotocamera",
    cameraAccessSettings: "Accesso alla fotocamera",
    cameraAccessSettingsMsg: "Apri le Impostazioni per attivare l'accesso alla fotocamera.",
    loadingMessages: [
      "Preparazione del tuo annuncio...",
      "Ottimizzazione per le prenotazioni...",
      "Stilizzazione dello spazio...",
      "Scelta della palette perfetta...",
      "Disposizione dei mobili per le foto...",
      "Aggiunta dei tocchi finali...",
      "Massimizzazione dell'attrattiva...",
      "Quasi pronto per pubblicare...",
    ],
    roomPhoto: "Foto della stanza",
    tapToAddPhoto: "Tocca per aggiungere una foto (fotocamera o galleria)",
    roomType: "Tipo di stanza",
    redesignStyle: "Stile di redesign",
    guestType: "Tipo di ospite",
    budgetLevel: "Livello di budget",
    extraInstructions: "Istruzioni aggiuntive (opzionale)",
    extraInstructionsPlaceholder: "es. più luce naturale, colori neutri...",
    analyzeAndRedesign: "Analizza e Ridisegna",
    yourRoomAnalysis: "Analisi della Tua Stanza",
    analyzingSpace: "Analisi del tuo spazio...",
    analysisUnavailable: "Analisi non disponibile",
    issuesDetected: "Problemi Rilevati",
    recommendedImprovements: "Miglioramenti Consigliati",
    generatingSuggestions: "Generazione suggerimenti...",
    actionAdd: "Aggiungere",
    actionRemove: "Rimuovere",
    actionMove: "Spostare",
    actionReplace: "Sostituire",
    listingDescription: "Descrizione dell'Annuncio",
    generatingText: "Generazione della descrizione...",
    generateListingText: "Genera Testo dell'Annuncio",
    saveToProperty: "Salva nella Proprietà",
    chooseProperty: "Scegli una proprietà per questo redesign",
    newPropertyDots: "Nuova Proprietà...",
    enterPropertyName: "Inserisci un nome per la tua proprietà",
    createAndSave: "Crea e Salva",
    savedToProperty: "Salvato nella proprietà",
    analyzingBeforeSaving: "Analisi della stanza prima del salvataggio...",
    savingToProperty: "Salvataggio nella proprietà...",
    scanNextRoom: "Scansiona la Prossima",
    viewDashboard: "Vedi Pannello",
    scanNudgePartial: "{{count}} stanza{{s}} scansionata — scansiona {{remaining}} in più per il punteggio completo",
    scanNudgeReady: "{{count}} stanze scansionate — il tuo pannello è pronto!",
    addPhoto: "Aggiungi foto",
    chooseSource: "Scegli una fonte",
    cameraLabel: "Fotocamera",
    gallery: "Galleria",
    permissionRequired: "Permesso necessario",
    grantPhotoAccess: "Consenti l'accesso alla galleria per selezionare un'immagine.",
    grantCameraAccess: "Consenti l'accesso alla fotocamera per scattare una foto.",
    retake: "Ripeti",
    failedToSave: "Errore nel salvataggio del redesign",
  },

  // ─── Redesign Result ───────────────────────────────────────────────────────
  redesignResult: {
    redesigningRoom: "Ridisegnando la tua stanza...",
    mayTakeMoment: "Potrebbe richiedere un momento",
    generationFailed: "Generazione Fallita",
    yourRedesignReady: "Il Tuo Redesign è Pronto!",
    saved: "Salvato",
    savedToLibrary: "Immagine salvata nella tua libreria foto.",
    saveFailed: "Errore di salvataggio",
    couldNotSave: "Impossibile salvare l'immagine.",
    shareFailed: "Errore di condivisione",
    couldNotShare: "Impossibile condividere l'immagine.",
    generateAnother: "Genera un Altro",
    startOver: "Ricomincia",
  },

  // ─── Redesign Detail ───────────────────────────────────────────────────────
  redesignDetail: {
    noIdProvided: "Nessun ID redesign fornito",
    redesignNotFound: "Redesign non trovato",
    failedToLoad: "Errore nel caricamento del redesign",
    goBack: "Indietro",
    shareYourRedesign: "Condividi il tuo redesign",
    deleteRedesign: "Elimina Redesign",
    deleteConfirm: "Sei sicuro? Non può essere annullato.",
    failedToDelete: "Errore nell'eliminazione del redesign.",
  },

  // ─── Redesign History ──────────────────────────────────────────────────────
  redesignHistory: {
    allowPhotoAccess: "Consenti l'accesso alle tue foto per vedere i tuoi redesign salvati.",
    allowAccess: "Consenti Accesso",
    photoAccessRequired: "L'accesso alle foto è necessario per vedere i tuoi redesign. Attivalo nelle Impostazioni.",
    noRedesignsYet: "Nessun redesign",
    savedRedesignsHere: "I tuoi redesign salvati appariranno qui.",
  },

  // ─── Profile ───────────────────────────────────────────────────────────────
  profile: {
    title: "Profilo",
    notSignedIn: "Non connesso",
    signInDesc: "Accedi per accedere al tuo account, abbonamento e funzionalità personalizzate.",
    signIn: "Accedi",
    account: "Account",
    name: "Nome",
    email: "E-mail",
    settings: "Impostazioni",
    language: "Lingua",
    legal: "Legale",
    privacyPolicy: "Informativa sulla Privacy",
    termsOfService: "Termini di Servizio",
    logOut: "Esci",
    logOutConfirm: "Sei sicuro di voler uscire?",
    data: "Dati",
    deleteAllData: "Elimina Tutti i Dati",
    deleteAllDataConfirm: "Questo eliminerà permanentemente tutte le {{count}} proprietà e le loro scansioni. Non può essere annullato.",
    deleteAllDataButton: "Elimina tutti i dati ({{count}} {{properties}})",
    allDataDeleted: "Tutti i dati sono stati eliminati.",
  },

  // ─── Onboarding ────────────────────────────────────────────────────────────
  onboarding: {
    stepOf: "Passo {{current}} di {{total}}",
    getStarted: "Inizia",
    steps: [
      {
        title: "Scansiona i tuoi spazi",
        subtitle:
          "Scatta foto di ogni stanza della tua proprietà. La nostra IA analizza ciò che vedono gli ospiti e valuta il potenziale del tuo annuncio.",
      },
      {
        title: "Ottieni il tuo piano d'azione",
        subtitle:
          "Vedi esattamente cosa migliorare, quanto costa e quali cambiamenti porteranno più prenotazioni.",
      },
      {
        title: "Monitora i tuoi progressi",
        subtitle:
          "Ri-scansiona dopo i miglioramenti per vedere il tuo punteggio salire. Gestisci tutte le proprietà da un unico pannello.",
      },
    ],
  },

  // ─── Not Found ─────────────────────────────────────────────────────────────
  notFound: {
    title: "Ops!",
    message: "Questa schermata non esiste.",
    goHome: "Vai alla schermata principale!",
  },

  // ─── About ─────────────────────────────────────────────────────────────────
  about: {
    description:
      "Starter Kit è una base per app mobile progettata con cura e altamente personalizzabile, costruita con React Native ed Expo.\n\nAccelera il tuo processo di sviluppo con un'architettura moderna, le migliori pratiche e una bella interfaccia — così puoi concentrarti sulla creazione di funzionalità che contano.\n\nCreato con amore dal team Code with Beto.",
  },

  // ─── Labels ────────────────────────────────────────────────────────────────
  roomTypes: {
    living: "Soggiorno",
    bedroom: "Camera da Letto",
    kitchen: "Cucina",
    bathroom: "Bagno",
    dining: "Sala da Pranzo",
    entryway: "Ingresso",
    outdoor: "Esterno",
    patio: "Terrazza / Balcone",
  },

  redesignStyles: {
    "hotel-boutique": "Hotel Boutique",
    "cozy-retreat": "Rifugio Accogliente",
    "resort-style": "Stile Resort",
    "urban-lux": "Lusso Urbano",
    "nordic-airbnb": "Nordico Airbnb",
    "instagram-worthy": "Da Instagram",
    "business-ready": "Pronto per il Business",
    "family-friendly": "Familiare",
    "budget-refresh": "Rinnovo Economico",
    "rustic-charm": "Fascino Rustico",
  },

  guestTypes: {
    business: "Business",
    couples: "Coppie",
    families: "Famiglie",
    "digital-nomads": "Nomadi Digitali",
  },

  budgetLevels: {
    "quick-fixes": "Ritocchi Rapidi",
    refresh: "Rinnovo",
    makeover: "Restyling",
    "full-redesign": "Redesign Completo",
  },

  budgetDescriptions: {
    "quick-fixes": "Meno di $50 — biancheria, cuscini, decorazioni",
    refresh: "$50–200 — tessili, illuminazione, arte",
    makeover: "$200–500 — mobili, pittura, tappeti",
    "full-redesign": "$500+ — trasformazione completa",
  },

  // ─── Region / Season ───────────────────────────────────────────────────────
  regions: {
    beach: "Spiaggia",
    city: "Città",
    mountain: "Montagna",
    countryside: "Campagna",
    suburban: "Periferia",
  },

  hemispheres: {
    northern: "Nord",
    southern: "Sud",
  },

  seasons: {
    spring: "Primavera",
    summer: "Estate",
    fall: "Autunno",
    winter: "Inverno",
  },

  // ─── Seasonal Banner ──────────────────────────────────────────────────────
  seasonalBanner: {
    refreshFor: "Rinnova per {{season}}",
  },

  // ─── Host Insights ────────────────────────────────────────────────────────
  hostInsights: {
    photos: "Le proprietà con foto professionali ottengono il 40% in più di prenotazioni",
    score: "Gli annunci con punteggio 8+ ottengono 2x più visualizzazioni nelle ricerche",
    actionPlan: "Gli host che completano 3+ miglioramenti vedono un aumento del 40% nelle prenotazioni",
    description: "Le descrizioni dettagliate e specifiche ottengono il 26% in più di prenotazioni",
  },

  // ─── Language names ────────────────────────────────────────────────────────
  languages: {
    en: "Inglese",
    es: "Spagnolo",
    pt: "Portoghese",
    fr: "Francese",
    it: "Italiano",
  },
} as const;
