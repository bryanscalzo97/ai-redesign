export default {
  // ─── Tabs ──────────────────────────────────────────────────────────────────
  tabs: {
    home: "Home",
    scanSpace: "Scan Space",
    properties: "Properties",
    profile: "Profile",
  },

  // ─── Common ────────────────────────────────────────────────────────────────
  common: {
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    share: "Share",
    ok: "OK",
    error: "Error",
    done: "Done",
    back: "Back",
    next: "Next",
    skip: "Skip",
    retry: "Try Again",
    create: "Create",
    generate: "Generate",
    regenerate: "Regenerate",
    loading: "Loading...",
    saving: "Saving...",
    room: "room",
    rooms: "rooms",
    property: "property",
    properties: "properties",
    before: "Before",
    after: "After",
    set: "Set",
    openSettings: "Open Settings",
    inspiration: "Inspiration",
  },

  // ─── Home ──────────────────────────────────────────────────────────────────
  home: {
    welcomeTitle: "Welcome! Let's optimize your first property.",
    welcomeSubtitle:
      "In 2 minutes you'll have a score, an action plan, and know exactly how to get more bookings.",
    step1Label: "Name your property",
    step1Desc: "Create your first listing",
    step2Label: "Scan every room",
    step2Desc: "Get AI scores and suggestions",
    step3Label: "Follow the plan",
    step3Desc: "Track improvements and ROI",
    addFirstProperty: "Add Your First Property",
    avgScore: "Avg Score",
    toDo: "To Do",
    toInvest: "To Invest",
    yourProperties: "Your Properties",
    seeAll: "See all",
    todo: "to do",
    mostPotential: "Most potential",
    propertiesNotScanned: "{{count}} properties not yet scanned",
    improve: "Improve {{name}}",
    mostRoomForImprovement: "This property has the most room for improvement",
    scanFirstRoom: "Scan Your First Room",
    scanFirstRoomDesc: "Get AI-powered scores and improvement suggestions",
    seasonalRecommendations: "Seasonal Recommendations",
    addLocationDetails: "Add location details to your properties for seasonal tips",
    recentRedesigns: "Recent Redesigns",
    topPerformingStyles: "Top Performing Styles",
    spaces: "Spaces",
    byGuestType: "By Guest Type",
    firstPropertyTitle: "Your First Property",
    firstPropertyMessage: "What's the name of your property? (e.g. Beach House, Downtown Apt)",
    createAndScan: "Create & Scan",
  },

  // ─── Project List ──────────────────────────────────────────────────────────
  projectList: {
    newProperty: "New Property",
    enterPropertyName: "Enter a name for your property listing",
    noPropertiesYet: "No properties yet",
    noPropertiesDesc: "Create a property to start organizing your redesigns.",
    noPhotosYet: "No photos yet",
    roomsScanned: "{{count}} {{rooms}} scanned",
  },

  // ─── Project Detail ────────────────────────────────────────────────────────
  projectDetail: {
    actionPlan: "Action Plan",
    roiEstimate: "ROI Estimate",
    nightlyRate: "Nightly Rate",
    enterNightlyRate: "Enter your average nightly rate ($)",
    currentOccupancy: "Current Occupancy",
    enterOccupancy: "Enter your average occupancy rate (%)",
    rate: "Rate",
    occupancy: "Occupancy",
    moreBookings: "More bookings",
    extraPerMonth: "Extra / month",
    payback: "Payback",
    toInvest: "To invest",
    noRoiData: "Not enough data to estimate ROI yet.",
    setRateForRoi: "Set your nightly rate to see estimated ROI for improvements.",
    basedOnRooms: "Based on {{count}} {{rooms}} scanned",
    progress: "Progress",
    budget: "Budget",
    spent: "spent",
    total: "total",
    scanNewRoom: "Scan New Room",
    listingDescription: "Listing Description",
    writingDescription: "Writing listing description...",
    generateDescription: "Generate Listing Description",
    analyzeThisRoom: "Analyze This Room",
    analyzing: "Analyzing...",
    analysisComplete: "Analysis Complete",
    analysisCompleteMsg: "Room scored {{score}}/10 with {{count}} suggestions.",
    rescan: "Re-scan this {{room}}",
    backToProperty: "Back to property",
    noRoomsTitle: "No rooms scanned yet",
    noRoomsDesc: "Scan rooms with the camera to get scores and an improvement plan.",
    renameProperty: "Rename Property",
    deleteProperty: "Delete Property",
    deleteConfirm: "This will permanently delete {{name}} and all its room scans. This cannot be undone.",
    deleteEverything: "Delete Everything",
    enterNewName: "Enter a new name",
    propertyLocation: "Property location",
    hemisphere: "Hemisphere",
    seasonalTip: "Seasonal Tip",
    roomBreakdown: "Room Breakdown",
    completedOf: "{{completed}} of {{total}} completed · ${{spent}} of ${{budget}}",
  },

  // ─── Camera / Scan ─────────────────────────────────────────────────────────
  camera: {
    cameraAccessNeeded: "Camera access needed",
    cameraAccessDesc: "Allow camera access to scan your space and optimize your listing photos.",
    allowCamera: "Allow Camera",
    cameraAccessSettings: "Camera access",
    cameraAccessSettingsMsg: "Open Settings to enable camera access.",
    loadingMessages: [
      "Staging your listing...",
      "Optimizing for bookings...",
      "Styling the space...",
      "Picking the perfect palette...",
      "Arranging furniture for photos...",
      "Adding finishing touches...",
      "Maximizing guest appeal...",
      "Almost ready to list...",
    ],
    roomPhoto: "Room photo",
    tapToAddPhoto: "Tap to add photo (camera or gallery)",
    roomType: "Room type",
    redesignStyle: "Redesign style",
    guestType: "Guest type",
    budgetLevel: "Budget level",
    extraInstructions: "Extra instructions (optional)",
    extraInstructionsPlaceholder: "e.g. more natural light, neutral colors...",
    analyzeAndRedesign: "Analyze & Redesign",
    yourRoomAnalysis: "Your Room Analysis",
    analyzingSpace: "Analyzing your space...",
    analysisUnavailable: "Analysis unavailable",
    issuesDetected: "Issues Detected",
    recommendedImprovements: "Recommended Improvements",
    generatingSuggestions: "Generating suggestions...",
    actionAdd: "Add",
    actionRemove: "Remove",
    actionMove: "Move",
    actionReplace: "Replace",
    listingDescription: "Listing Description",
    generatingText: "Generating description...",
    generateListingText: "Generate Listing Text",
    saveToProperty: "Save to Property",
    chooseProperty: "Choose a property for this redesign",
    newPropertyDots: "New Property...",
    enterPropertyName: "Enter a name for your property",
    createAndSave: "Create & Save",
    savedToProperty: "Saved to property",
    analyzingBeforeSaving: "Analyzing room before saving...",
    savingToProperty: "Saving to property...",
    scanNextRoom: "Scan Next Room",
    viewDashboard: "View Dashboard",
    scanNudgePartial: "{{count}} room{{s}} scanned — scan {{remaining}} more to get your full property score",
    scanNudgeReady: "{{count}} rooms scanned — your property dashboard is ready!",
    addPhoto: "Add photo",
    chooseSource: "Choose a source",
    cameraLabel: "Camera",
    gallery: "Gallery",
    permissionRequired: "Permission required",
    grantPhotoAccess: "Please grant photo library access to select an image.",
    grantCameraAccess: "Please grant camera access to take a photo.",
    retake: "Retake",
    failedToSave: "Failed to save redesign",
  },

  // ─── Redesign Result ───────────────────────────────────────────────────────
  redesignResult: {
    redesigningRoom: "Redesigning your room...",
    mayTakeMoment: "This may take a moment",
    generationFailed: "Generation Failed",
    yourRedesignReady: "Your Redesign is Ready!",
    saved: "Saved",
    savedToLibrary: "Image saved to your photo library.",
    saveFailed: "Save failed",
    couldNotSave: "Could not save the image.",
    shareFailed: "Share failed",
    couldNotShare: "Could not share the image.",
    generateAnother: "Generate Another",
    startOver: "Start Over",
  },

  // ─── Redesign Detail ───────────────────────────────────────────────────────
  redesignDetail: {
    noIdProvided: "No redesign ID provided",
    redesignNotFound: "Redesign not found",
    failedToLoad: "Failed to load redesign",
    goBack: "Go Back",
    shareYourRedesign: "Share your redesign",
    deleteRedesign: "Delete Redesign",
    deleteConfirm: "Are you sure? This cannot be undone.",
    failedToDelete: "Failed to delete the redesign.",
  },

  // ─── Redesign History ──────────────────────────────────────────────────────
  redesignHistory: {
    allowPhotoAccess: "Allow access to your photos to see your saved redesigns.",
    allowAccess: "Allow Access",
    photoAccessRequired: "Photo access is required to view your redesigns. Please enable it in Settings.",
    noRedesignsYet: "No redesigns yet",
    savedRedesignsHere: "Your saved redesigns will appear here.",
  },

  // ─── Profile ───────────────────────────────────────────────────────────────
  profile: {
    title: "Profile",
    notSignedIn: "Not signed in",
    signInDesc: "Sign in to access your account details, subscription info, and personalized features.",
    signIn: "Sign in",
    account: "Account",
    name: "Name",
    email: "Email",
    settings: "Settings",
    language: "Language",
    legal: "Legal",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    logOut: "Log out",
    logOutConfirm: "Are you sure you want to log out?",
    data: "Data",
    deleteAllData: "Delete All Data",
    deleteAllDataConfirm: "This will permanently delete all {{count}} properties and their room scans. This cannot be undone.",
    deleteAllDataButton: "Delete all data ({{count}} {{properties}})",
    allDataDeleted: "All data has been deleted.",
  },

  // ─── Onboarding ────────────────────────────────────────────────────────────
  onboarding: {
    stepOf: "Step {{current}} of {{total}}",
    getStarted: "Get started",
    steps: [
      {
        title: "Scan your spaces",
        subtitle:
          "Take photos of every room in your property. Our AI analyzes what guests see and scores your listing potential.",
      },
      {
        title: "Get your action plan",
        subtitle:
          "See exactly what to improve, how much it costs, and which changes will get you the most bookings.",
      },
      {
        title: "Track your progress",
        subtitle:
          "Re-scan after improvements to watch your score climb. Manage all your properties from one dashboard.",
      },
    ],
  },

  // ─── Not Found ─────────────────────────────────────────────────────────────
  notFound: {
    title: "Oops!",
    message: "This screen does not exist.",
    goHome: "Go to home screen!",
  },

  // ─── About ─────────────────────────────────────────────────────────────────
  about: {
    description:
      "Starter Kit is a thoughtfully crafted, highly customizable mobile app foundation built with React Native and Expo.\n\nAccelerate your development process with a modern architecture, best practices, and a beautiful UI out of the box—so you can focus on building features that matter.\n\nCreated with love by Code with Beto Team.",
  },

  // ─── Labels (types/redesign.ts) ────────────────────────────────────────────
  roomTypes: {
    living: "Living Area",
    bedroom: "Guest Bedroom",
    kitchen: "Kitchen",
    bathroom: "Bathroom",
    dining: "Dining Room",
    entryway: "Entryway",
    outdoor: "Outdoor",
    patio: "Patio / Balcony",
  },

  redesignStyles: {
    "hotel-boutique": "Hotel Boutique",
    "cozy-retreat": "Cozy Retreat",
    "resort-style": "Resort Style",
    "urban-lux": "Urban Lux",
    "nordic-airbnb": "Nordic Airbnb",
    "instagram-worthy": "Instagram-Worthy",
    "business-ready": "Business Ready",
    "family-friendly": "Family Friendly",
    "budget-refresh": "Budget Refresh",
    "rustic-charm": "Rustic Charm",
  },

  guestTypes: {
    business: "Business",
    couples: "Couples",
    families: "Families",
    "digital-nomads": "Digital Nomads",
  },

  budgetLevels: {
    "quick-fixes": "Quick Fixes",
    refresh: "Refresh",
    makeover: "Makeover",
    "full-redesign": "Full Redesign",
  },

  budgetDescriptions: {
    "quick-fixes": "Under $50 — bedding, pillows, small decor",
    refresh: "$50–200 — new textiles, lighting, art",
    makeover: "$200–500 — furniture swaps, paint, rugs",
    "full-redesign": "$500+ — complete transformation",
  },

  // ─── Region / Season ───────────────────────────────────────────────────────
  regions: {
    beach: "Beach",
    city: "City",
    mountain: "Mountain",
    countryside: "Countryside",
    suburban: "Suburban",
  },

  hemispheres: {
    northern: "Northern",
    southern: "Southern",
  },

  seasons: {
    spring: "Spring",
    summer: "Summer",
    fall: "Fall",
    winter: "Winter",
  },

  // ─── Seasonal Banner ──────────────────────────────────────────────────────
  seasonalBanner: {
    refreshFor: "Refresh for {{season}}",
  },

  // ─── Host Insights ────────────────────────────────────────────────────────
  hostInsights: {
    photos: "Properties with professional photos get 40% more bookings",
    score: "Listings scoring 8+ get 2x more views in search results",
    actionPlan: "Hosts who complete 3+ improvements see a 40% increase in booking rate",
    description: "Detailed, specific descriptions get 26% more bookings",
  },

  // ─── Language names (for the picker) ───────────────────────────────────────
  languages: {
    en: "English",
    es: "Spanish",
    pt: "Portuguese",
    fr: "French",
    it: "Italian",
  },
} as const;
