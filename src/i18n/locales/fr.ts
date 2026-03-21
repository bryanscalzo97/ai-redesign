export default {
  // ─── Tabs ──────────────────────────────────────────────────────────────────
  tabs: {
    home: "Accueil",
    scanSpace: "Scanner",
    properties: "Propriétés",
    profile: "Profil",
  },

  // ─── Common ────────────────────────────────────────────────────────────────
  common: {
    cancel: "Annuler",
    save: "Enregistrer",
    delete: "Supprimer",
    share: "Partager",
    ok: "OK",
    error: "Erreur",
    done: "Terminé",
    back: "Retour",
    next: "Suivant",
    skip: "Passer",
    retry: "Réessayer",
    create: "Créer",
    generate: "Générer",
    regenerate: "Régénérer",
    loading: "Chargement...",
    saving: "Enregistrement...",
    room: "pièce",
    rooms: "pièces",
    property: "propriété",
    properties: "propriétés",
    before: "Avant",
    after: "Après",
    set: "Définir",
    openSettings: "Ouvrir les Réglages",
    inspiration: "Inspiration",
  },

  // ─── Home ──────────────────────────────────────────────────────────────────
  home: {
    welcomeTitle: "Bienvenue ! Optimisons votre première propriété.",
    welcomeSubtitle:
      "En 2 minutes vous aurez un score, un plan d'action et saurez exactement comment obtenir plus de réservations.",
    step1Label: "Nommez votre propriété",
    step1Desc: "Créez votre première annonce",
    step2Label: "Scannez chaque pièce",
    step2Desc: "Obtenez des scores et suggestions par IA",
    step3Label: "Suivez le plan",
    step3Desc: "Suivez les améliorations et le ROI",
    addFirstProperty: "Ajoutez Votre Première Propriété",
    avgScore: "Score Moyen",
    toDo: "À Faire",
    toInvest: "À Investir",
    yourProperties: "Vos Propriétés",
    seeAll: "Tout voir",
    todo: "à faire",
    mostPotential: "Plus grand potentiel",
    propertiesNotScanned: "{{count}} propriétés non scannées",
    improve: "Améliorer {{name}}",
    mostRoomForImprovement: "Cette propriété a le plus de marge d'amélioration",
    scanFirstRoom: "Scannez Votre Première Pièce",
    scanFirstRoomDesc: "Obtenez des scores et suggestions d'amélioration par IA",
    seasonalRecommendations: "Recommandations Saisonnières",
    addLocationDetails: "Ajoutez la localisation à vos propriétés pour des conseils saisonniers",
    recentRedesigns: "Redesigns Récents",
    topPerformingStyles: "Styles les Plus Performants",
    spaces: "Espaces",
    byGuestType: "Par Type de Client",
    firstPropertyTitle: "Votre Première Propriété",
    firstPropertyMessage: "Quel est le nom de votre propriété ? (ex. Maison de Plage, Appt Centre-Ville)",
    createAndScan: "Créer et Scanner",
  },

  // ─── Project List ──────────────────────────────────────────────────────────
  projectList: {
    newProperty: "Nouvelle Propriété",
    enterPropertyName: "Entrez un nom pour votre propriété",
    noPropertiesYet: "Aucune propriété",
    noPropertiesDesc: "Créez une propriété pour commencer à organiser vos redesigns.",
    noPhotosYet: "Pas encore de photos",
    roomsScanned: "{{count}} {{rooms}} scannées",
  },

  // ─── Project Detail ────────────────────────────────────────────────────────
  projectDetail: {
    actionPlan: "Plan d'Action",
    roiEstimate: "Estimation du ROI",
    nightlyRate: "Tarif par Nuit",
    enterNightlyRate: "Entrez votre tarif moyen par nuit ($)",
    currentOccupancy: "Occupation Actuelle",
    enterOccupancy: "Entrez votre taux d'occupation moyen (%)",
    rate: "Tarif",
    occupancy: "Occupation",
    moreBookings: "Plus de réservations",
    extraPerMonth: "Extra / mois",
    payback: "Retour",
    toInvest: "À investir",
    noRoiData: "Pas assez de données pour estimer le ROI.",
    setRateForRoi: "Définissez votre tarif par nuit pour voir le ROI estimé des améliorations.",
    basedOnRooms: "Basé sur {{count}} {{rooms}} scannées",
    progress: "Progrès",
    budget: "Budget",
    spent: "dépensé",
    total: "total",
    scanNewRoom: "Scanner Nouvelle Pièce",
    listingDescription: "Description de l'Annonce",
    writingDescription: "Rédaction de la description...",
    generateDescription: "Générer la Description",
    analyzeThisRoom: "Analyser Cette Pièce",
    analyzing: "Analyse en cours...",
    analysisComplete: "Analyse Terminée",
    analysisCompleteMsg: "Pièce notée {{score}}/10 avec {{count}} suggestions.",
    rescan: "Re-scanner cette {{room}}",
    backToProperty: "Retour à la propriété",
    noRoomsTitle: "Aucune pièce scannée",
    noRoomsDesc: "Scannez des pièces avec la caméra pour obtenir des scores et un plan d'amélioration.",
    renameProperty: "Renommer la Propriété",
    deleteProperty: "Supprimer la Propriété",
    deleteConfirm: "Cela supprimera définitivement {{name}} et tous ses scans. Cette action est irréversible.",
    deleteEverything: "Tout Supprimer",
    enterNewName: "Entrez un nouveau nom",
    propertyLocation: "Emplacement de la propriété",
    hemisphere: "Hémisphère",
    seasonalTip: "Conseil Saisonnier",
    roomBreakdown: "Détail par Pièce",
    completedOf: "{{completed}} sur {{total}} terminés · ${{spent}} sur ${{budget}}",
  },

  // ─── Camera / Scan ─────────────────────────────────────────────────────────
  camera: {
    cameraAccessNeeded: "Accès caméra nécessaire",
    cameraAccessDesc: "Autorisez l'accès à la caméra pour scanner votre espace et optimiser vos photos.",
    allowCamera: "Autoriser la Caméra",
    cameraAccessSettings: "Accès à la caméra",
    cameraAccessSettingsMsg: "Ouvrez les Réglages pour activer l'accès à la caméra.",
    loadingMessages: [
      "Préparation de votre annonce...",
      "Optimisation pour les réservations...",
      "Stylisation de l'espace...",
      "Choix de la palette parfaite...",
      "Arrangement des meubles pour les photos...",
      "Ajout des touches finales...",
      "Maximisation de l'attrait...",
      "Presque prêt à publier...",
    ],
    roomPhoto: "Photo de la pièce",
    tapToAddPhoto: "Appuyez pour ajouter une photo (caméra ou galerie)",
    roomType: "Type de pièce",
    redesignStyle: "Style de redesign",
    guestType: "Type de client",
    budgetLevel: "Niveau de budget",
    extraInstructions: "Instructions supplémentaires (optionnel)",
    extraInstructionsPlaceholder: "ex. plus de lumière naturelle, couleurs neutres...",
    analyzeAndRedesign: "Analyser et Redesigner",
    yourRoomAnalysis: "Analyse de Votre Pièce",
    analyzingSpace: "Analyse de votre espace...",
    analysisUnavailable: "Analyse indisponible",
    issuesDetected: "Problèmes Détectés",
    recommendedImprovements: "Améliorations Recommandées",
    generatingSuggestions: "Génération des suggestions...",
    actionAdd: "Ajouter",
    actionRemove: "Retirer",
    actionMove: "Déplacer",
    actionReplace: "Remplacer",
    listingDescription: "Description de l'Annonce",
    generatingText: "Génération de la description...",
    generateListingText: "Générer le Texte de l'Annonce",
    saveToProperty: "Enregistrer dans la Propriété",
    chooseProperty: "Choisissez une propriété pour ce redesign",
    newPropertyDots: "Nouvelle Propriété...",
    enterPropertyName: "Entrez un nom pour votre propriété",
    createAndSave: "Créer et Enregistrer",
    savedToProperty: "Enregistré dans la propriété",
    analyzingBeforeSaving: "Analyse de la pièce avant enregistrement...",
    savingToProperty: "Enregistrement dans la propriété...",
    scanNextRoom: "Scanner la Suivante",
    viewDashboard: "Voir le Tableau de Bord",
    scanNudgePartial: "{{count}} pièce{{s}} scannée — scannez {{remaining}} de plus pour votre score complet",
    scanNudgeReady: "{{count}} pièces scannées — votre tableau de bord est prêt !",
    addPhoto: "Ajouter une photo",
    chooseSource: "Choisissez une source",
    cameraLabel: "Caméra",
    gallery: "Galerie",
    permissionRequired: "Permission requise",
    grantPhotoAccess: "Autorisez l'accès à la galerie pour sélectionner une image.",
    grantCameraAccess: "Autorisez l'accès à la caméra pour prendre une photo.",
    retake: "Reprendre",
    failedToSave: "Erreur lors de l'enregistrement du redesign",
  },

  // ─── Redesign Result ───────────────────────────────────────────────────────
  redesignResult: {
    redesigningRoom: "Redesign de votre pièce...",
    mayTakeMoment: "Cela peut prendre un moment",
    generationFailed: "Génération Échouée",
    yourRedesignReady: "Votre Redesign est Prêt !",
    saved: "Enregistré",
    savedToLibrary: "Image enregistrée dans votre photothèque.",
    saveFailed: "Erreur d'enregistrement",
    couldNotSave: "Impossible d'enregistrer l'image.",
    shareFailed: "Erreur de partage",
    couldNotShare: "Impossible de partager l'image.",
    generateAnother: "Générer un Autre",
    startOver: "Recommencer",
  },

  // ─── Redesign Detail ───────────────────────────────────────────────────────
  redesignDetail: {
    noIdProvided: "Aucun ID de redesign fourni",
    redesignNotFound: "Redesign introuvable",
    failedToLoad: "Erreur de chargement du redesign",
    goBack: "Retour",
    shareYourRedesign: "Partagez votre redesign",
    deleteRedesign: "Supprimer le Redesign",
    deleteConfirm: "Êtes-vous sûr ? Cette action est irréversible.",
    failedToDelete: "Erreur lors de la suppression du redesign.",
  },

  // ─── Redesign History ──────────────────────────────────────────────────────
  redesignHistory: {
    allowPhotoAccess: "Autorisez l'accès à vos photos pour voir vos redesigns enregistrés.",
    allowAccess: "Autoriser l'Accès",
    photoAccessRequired: "L'accès aux photos est nécessaire pour voir vos redesigns. Activez-le dans les Réglages.",
    noRedesignsYet: "Aucun redesign",
    savedRedesignsHere: "Vos redesigns enregistrés apparaîtront ici.",
  },

  // ─── Profile ───────────────────────────────────────────────────────────────
  profile: {
    title: "Profil",
    notSignedIn: "Non connecté",
    signInDesc: "Connectez-vous pour accéder à votre compte, abonnement et fonctionnalités personnalisées.",
    signIn: "Se connecter",
    account: "Compte",
    name: "Nom",
    email: "E-mail",
    settings: "Réglages",
    language: "Langue",
    legal: "Mentions légales",
    privacyPolicy: "Politique de Confidentialité",
    termsOfService: "Conditions d'Utilisation",
    logOut: "Se déconnecter",
    logOutConfirm: "Êtes-vous sûr de vouloir vous déconnecter ?",
    data: "Données",
    deleteAllData: "Supprimer Toutes les Données",
    deleteAllDataConfirm: "Cela supprimera définitivement les {{count}} propriétés et leurs scans. Cette action est irréversible.",
    deleteAllDataButton: "Supprimer toutes les données ({{count}} {{properties}})",
    allDataDeleted: "Toutes les données ont été supprimées.",
  },

  // ─── Onboarding ────────────────────────────────────────────────────────────
  onboarding: {
    stepOf: "Étape {{current}} sur {{total}}",
    getStarted: "Commencer",
    steps: [
      {
        title: "Scannez vos espaces",
        subtitle:
          "Prenez des photos de chaque pièce de votre propriété. Notre IA analyse ce que voient les clients et note le potentiel de votre annonce.",
      },
      {
        title: "Obtenez votre plan d'action",
        subtitle:
          "Voyez exactement quoi améliorer, combien ça coûte et quels changements apporteront le plus de réservations.",
      },
      {
        title: "Suivez vos progrès",
        subtitle:
          "Re-scannez après les améliorations pour voir votre score monter. Gérez toutes vos propriétés depuis un seul tableau de bord.",
      },
    ],
  },

  // ─── Not Found ─────────────────────────────────────────────────────────────
  notFound: {
    title: "Oups !",
    message: "Cet écran n'existe pas.",
    goHome: "Aller à l'écran d'accueil !",
  },

  // ─── About ─────────────────────────────────────────────────────────────────
  about: {
    description:
      "Starter Kit est une base d'application mobile soigneusement conçue et hautement personnalisable, construite avec React Native et Expo.\n\nAccélérez votre processus de développement avec une architecture moderne, les meilleures pratiques et une belle interface — pour que vous puissiez vous concentrer sur la création de fonctionnalités qui comptent.\n\nCréé avec amour par l'équipe Code with Beto.",
  },

  // ─── Labels ────────────────────────────────────────────────────────────────
  roomTypes: {
    living: "Salon",
    bedroom: "Chambre",
    kitchen: "Cuisine",
    bathroom: "Salle de Bain",
    dining: "Salle à Manger",
    entryway: "Entrée",
    outdoor: "Extérieur",
    patio: "Terrasse / Balcon",
  },

  redesignStyles: {
    "hotel-boutique": "Hôtel Boutique",
    "cozy-retreat": "Refuge Douillet",
    "resort-style": "Style Resort",
    "urban-lux": "Luxe Urbain",
    "nordic-airbnb": "Nordique Airbnb",
    "instagram-worthy": "Instagrammable",
    "business-ready": "Prêt pour les Affaires",
    "family-friendly": "Familial",
    "budget-refresh": "Rénovation Économique",
    "rustic-charm": "Charme Rustique",
  },

  guestTypes: {
    business: "Affaires",
    couples: "Couples",
    families: "Familles",
    "digital-nomads": "Nomades Numériques",
  },

  budgetLevels: {
    "quick-fixes": "Retouches Rapides",
    refresh: "Rafraîchissement",
    makeover: "Relooking",
    "full-redesign": "Redesign Complet",
  },

  budgetDescriptions: {
    "quick-fixes": "Moins de 50$ — linge de lit, coussins, déco",
    refresh: "50$–200$ — textiles, éclairage, art",
    makeover: "200$–500$ — meubles, peinture, tapis",
    "full-redesign": "500$+ — transformation complète",
  },

  // ─── Region / Season ───────────────────────────────────────────────────────
  regions: {
    beach: "Plage",
    city: "Ville",
    mountain: "Montagne",
    countryside: "Campagne",
    suburban: "Banlieue",
  },

  hemispheres: {
    northern: "Nord",
    southern: "Sud",
  },

  seasons: {
    spring: "Printemps",
    summer: "Été",
    fall: "Automne",
    winter: "Hiver",
  },

  // ─── Seasonal Banner ──────────────────────────────────────────────────────
  seasonalBanner: {
    refreshFor: "Rafraîchir pour {{season}}",
  },

  // ─── Host Insights ────────────────────────────────────────────────────────
  hostInsights: {
    photos: "Les propriétés avec des photos professionnelles obtiennent 40% plus de réservations",
    score: "Les annonces avec un score de 8+ obtiennent 2x plus de vues dans les recherches",
    actionPlan: "Les hôtes qui complètent 3+ améliorations voient 40% plus de réservations",
    description: "Les descriptions détaillées et spécifiques obtiennent 26% plus de réservations",
  },

  // ─── Language names ────────────────────────────────────────────────────────
  languages: {
    en: "Anglais",
    es: "Espagnol",
    pt: "Portugais",
    fr: "Français",
    it: "Italien",
  },
} as const;
