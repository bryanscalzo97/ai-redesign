export default {
  // ─── Tabs ──────────────────────────────────────────────────────────────────
  tabs: {
    home: "Início",
    scanSpace: "Escanear",
    properties: "Propriedades",
    profile: "Perfil",
  },

  // ─── Common ────────────────────────────────────────────────────────────────
  common: {
    cancel: "Cancelar",
    save: "Salvar",
    delete: "Excluir",
    share: "Compartilhar",
    ok: "OK",
    error: "Erro",
    done: "Pronto",
    back: "Voltar",
    next: "Próximo",
    skip: "Pular",
    retry: "Tentar Novamente",
    create: "Criar",
    generate: "Gerar",
    regenerate: "Regenerar",
    loading: "Carregando...",
    saving: "Salvando...",
    room: "cômodo",
    rooms: "cômodos",
    property: "propriedade",
    properties: "propriedades",
    before: "Antes",
    after: "Depois",
    set: "Definir",
    openSettings: "Abrir Ajustes",
    inspiration: "Inspiração",
  },

  // ─── Home ──────────────────────────────────────────────────────────────────
  home: {
    welcomeTitle: "Bem-vindo! Vamos otimizar sua primeira propriedade.",
    welcomeSubtitle:
      "Em 2 minutos você terá uma pontuação, um plano de ação e saberá exatamente como conseguir mais reservas.",
    step1Label: "Nomeie sua propriedade",
    step1Desc: "Crie seu primeiro anúncio",
    step2Label: "Escaneie cada cômodo",
    step2Desc: "Obtenha pontuações e sugestões com IA",
    step3Label: "Siga o plano",
    step3Desc: "Acompanhe melhorias e ROI",
    addFirstProperty: "Adicione Sua Primeira Propriedade",
    avgScore: "Pontuação Média",
    toDo: "A Fazer",
    toInvest: "A Investir",
    yourProperties: "Suas Propriedades",
    seeAll: "Ver tudo",
    todo: "a fazer",
    mostPotential: "Maior potencial",
    propertiesNotScanned: "{{count}} propriedades ainda não escaneadas",
    improve: "Melhorar {{name}}",
    mostRoomForImprovement: "Esta propriedade tem mais espaço para melhorias",
    scanFirstRoom: "Escaneie Seu Primeiro Cômodo",
    scanFirstRoomDesc: "Obtenha pontuações e sugestões de melhoria com IA",
    seasonalRecommendations: "Recomendações Sazonais",
    addLocationDetails: "Adicione localização às suas propriedades para dicas sazonais",
    recentRedesigns: "Redesigns Recentes",
    topPerformingStyles: "Estilos Mais Populares",
    spaces: "Espaços",
    byGuestType: "Por Tipo de Hóspede",
    firstPropertyTitle: "Sua Primeira Propriedade",
    firstPropertyMessage: "Qual o nome da sua propriedade? (ex. Casa de Praia, Apto Centro)",
    createAndScan: "Criar e Escanear",
  },

  // ─── Project List ──────────────────────────────────────────────────────────
  projectList: {
    newProperty: "Nova Propriedade",
    enterPropertyName: "Digite um nome para sua propriedade",
    noPropertiesYet: "Nenhuma propriedade ainda",
    noPropertiesDesc: "Crie uma propriedade para começar a organizar seus redesigns.",
    noPhotosYet: "Sem fotos ainda",
    roomsScanned: "{{count}} {{rooms}} escaneados",
  },

  // ─── Project Detail ────────────────────────────────────────────────────────
  projectDetail: {
    actionPlan: "Plano de Ação",
    roiEstimate: "Estimativa de ROI",
    nightlyRate: "Diária",
    enterNightlyRate: "Digite sua diária média ($)",
    currentOccupancy: "Ocupação Atual",
    enterOccupancy: "Digite sua taxa média de ocupação (%)",
    rate: "Diária",
    occupancy: "Ocupação",
    moreBookings: "Mais reservas",
    extraPerMonth: "Extra / mês",
    payback: "Retorno",
    toInvest: "A investir",
    noRoiData: "Dados insuficientes para estimar o ROI ainda.",
    setRateForRoi: "Defina sua diária para ver o ROI estimado das melhorias.",
    basedOnRooms: "Baseado em {{count}} {{rooms}} escaneados",
    progress: "Progresso",
    budget: "Orçamento",
    spent: "gasto",
    total: "total",
    scanNewRoom: "Escanear Novo Cômodo",
    listingDescription: "Descrição do Anúncio",
    writingDescription: "Escrevendo descrição...",
    generateDescription: "Gerar Descrição do Anúncio",
    analyzeThisRoom: "Analisar Este Cômodo",
    analyzing: "Analisando...",
    analysisComplete: "Análise Completa",
    analysisCompleteMsg: "Cômodo pontuado {{score}}/10 com {{count}} sugestões.",
    rescan: "Re-escanear este {{room}}",
    backToProperty: "Voltar à propriedade",
    noRoomsTitle: "Nenhum cômodo escaneado",
    noRoomsDesc: "Escaneie cômodos com a câmera para obter pontuações e um plano de melhorias.",
    renameProperty: "Renomear Propriedade",
    deleteProperty: "Excluir Propriedade",
    deleteConfirm: "Isso excluirá permanentemente {{name}} e todos os seus escaneamentos. Não pode ser desfeito.",
    deleteEverything: "Excluir Tudo",
    enterNewName: "Digite um novo nome",
    propertyLocation: "Localização da propriedade",
    hemisphere: "Hemisfério",
    seasonalTip: "Dica Sazonal",
    roomBreakdown: "Detalhamento por Cômodo",
    completedOf: "{{completed}} de {{total}} concluídos · ${{spent}} de ${{budget}}",
  },

  // ─── Camera / Scan ─────────────────────────────────────────────────────────
  camera: {
    cameraAccessNeeded: "Acesso à câmera necessário",
    cameraAccessDesc: "Permita acesso à câmera para escanear seu espaço e otimizar suas fotos.",
    allowCamera: "Permitir Câmera",
    cameraAccessSettings: "Acesso à câmera",
    cameraAccessSettingsMsg: "Abra os Ajustes para ativar o acesso à câmera.",
    loadingMessages: [
      "Preparando seu anúncio...",
      "Otimizando para reservas...",
      "Estilizando o espaço...",
      "Escolhendo a paleta perfeita...",
      "Arrumando móveis para fotos...",
      "Adicionando toques finais...",
      "Maximizando o apelo...",
      "Quase pronto para publicar...",
    ],
    roomPhoto: "Foto do cômodo",
    tapToAddPhoto: "Toque para adicionar foto (câmera ou galeria)",
    roomType: "Tipo de cômodo",
    redesignStyle: "Estilo de redesign",
    guestType: "Tipo de hóspede",
    budgetLevel: "Nível de orçamento",
    extraInstructions: "Instruções extras (opcional)",
    extraInstructionsPlaceholder: "ex. mais luz natural, cores neutras...",
    analyzeAndRedesign: "Analisar e Redesenhar",
    yourRoomAnalysis: "Análise do Seu Cômodo",
    analyzingSpace: "Analisando seu espaço...",
    analysisUnavailable: "Análise indisponível",
    issuesDetected: "Problemas Detectados",
    recommendedImprovements: "Melhorias Recomendadas",
    generatingSuggestions: "Gerando sugestões...",
    actionAdd: "Adicionar",
    actionRemove: "Remover",
    actionMove: "Mover",
    actionReplace: "Substituir",
    listingDescription: "Descrição do Anúncio",
    generatingText: "Gerando descrição...",
    generateListingText: "Gerar Texto do Anúncio",
    saveToProperty: "Salvar na Propriedade",
    chooseProperty: "Escolha uma propriedade para este redesign",
    newPropertyDots: "Nova Propriedade...",
    enterPropertyName: "Digite um nome para sua propriedade",
    createAndSave: "Criar e Salvar",
    savedToProperty: "Salvo na propriedade",
    analyzingBeforeSaving: "Analisando cômodo antes de salvar...",
    savingToProperty: "Salvando na propriedade...",
    scanNextRoom: "Escanear Próximo",
    viewDashboard: "Ver Painel",
    scanNudgePartial: "{{count}} cômodo{{s}} escaneado — escaneie {{remaining}} mais para sua pontuação completa",
    scanNudgeReady: "{{count}} cômodos escaneados — seu painel está pronto!",
    addPhoto: "Adicionar foto",
    chooseSource: "Escolha uma fonte",
    cameraLabel: "Câmera",
    gallery: "Galeria",
    permissionRequired: "Permissão necessária",
    grantPhotoAccess: "Permita acesso à galeria para selecionar uma imagem.",
    grantCameraAccess: "Permita acesso à câmera para tirar uma foto.",
    retake: "Refazer",
    failedToSave: "Erro ao salvar o redesign",
  },

  // ─── Redesign Result ───────────────────────────────────────────────────────
  redesignResult: {
    redesigningRoom: "Redesenhando seu cômodo...",
    mayTakeMoment: "Isso pode levar um momento",
    generationFailed: "Geração Falhou",
    yourRedesignReady: "Seu Redesign está Pronto!",
    saved: "Salvo",
    savedToLibrary: "Imagem salva na sua biblioteca de fotos.",
    saveFailed: "Erro ao salvar",
    couldNotSave: "Não foi possível salvar a imagem.",
    shareFailed: "Erro ao compartilhar",
    couldNotShare: "Não foi possível compartilhar a imagem.",
    generateAnother: "Gerar Outro",
    startOver: "Começar de Novo",
  },

  // ─── Redesign Detail ───────────────────────────────────────────────────────
  redesignDetail: {
    noIdProvided: "ID do redesign não fornecido",
    redesignNotFound: "Redesign não encontrado",
    failedToLoad: "Erro ao carregar o redesign",
    goBack: "Voltar",
    shareYourRedesign: "Compartilhe seu redesign",
    deleteRedesign: "Excluir Redesign",
    deleteConfirm: "Tem certeza? Não pode ser desfeito.",
    failedToDelete: "Erro ao excluir o redesign.",
  },

  // ─── Redesign History ──────────────────────────────────────────────────────
  redesignHistory: {
    allowPhotoAccess: "Permita acesso às suas fotos para ver seus redesigns salvos.",
    allowAccess: "Permitir Acesso",
    photoAccessRequired: "Acesso às fotos necessário para ver seus redesigns. Ative nos Ajustes.",
    noRedesignsYet: "Nenhum redesign ainda",
    savedRedesignsHere: "Seus redesigns salvos aparecerão aqui.",
  },

  // ─── Profile ───────────────────────────────────────────────────────────────
  profile: {
    title: "Perfil",
    notSignedIn: "Sem sessão iniciada",
    signInDesc: "Faça login para acessar sua conta, assinatura e funções personalizadas.",
    signIn: "Entrar",
    account: "Conta",
    name: "Nome",
    email: "E-mail",
    settings: "Ajustes",
    language: "Idioma",
    legal: "Legal",
    privacyPolicy: "Política de Privacidade",
    termsOfService: "Termos de Serviço",
    logOut: "Sair",
    logOutConfirm: "Tem certeza de que deseja sair?",
    data: "Dados",
    deleteAllData: "Excluir Todos os Dados",
    deleteAllDataConfirm: "Isso excluirá permanentemente todas as {{count}} propriedades e seus escaneamentos. Não pode ser desfeito.",
    deleteAllDataButton: "Excluir todos os dados ({{count}} {{properties}})",
    allDataDeleted: "Todos os dados foram excluídos.",
  },

  // ─── Onboarding ────────────────────────────────────────────────────────────
  onboarding: {
    stepOf: "Passo {{current}} de {{total}}",
    getStarted: "Começar",
    steps: [
      {
        title: "Escaneie seus espaços",
        subtitle:
          "Tire fotos de cada cômodo da sua propriedade. Nossa IA analisa o que os hóspedes veem e pontua o potencial do seu anúncio.",
      },
      {
        title: "Obtenha seu plano de ação",
        subtitle:
          "Veja exatamente o que melhorar, quanto custa e quais mudanças trarão mais reservas.",
      },
      {
        title: "Acompanhe seu progresso",
        subtitle:
          "Re-escaneie após as melhorias para ver sua pontuação subir. Gerencie todas as propriedades em um só painel.",
      },
    ],
  },

  // ─── Not Found ─────────────────────────────────────────────────────────────
  notFound: {
    title: "Ops!",
    message: "Esta tela não existe.",
    goHome: "Ir para a tela inicial!",
  },

  // ─── About ─────────────────────────────────────────────────────────────────
  about: {
    description:
      "Starter Kit é uma base de app móvel cuidadosamente projetada e altamente personalizável, construída com React Native e Expo.\n\nAcelere seu processo de desenvolvimento com uma arquitetura moderna, melhores práticas e uma interface bonita — para que você possa focar em construir as funções que importam.\n\nCriado com amor pela equipe Code with Beto.",
  },

  // ─── Labels ────────────────────────────────────────────────────────────────
  roomTypes: {
    living: "Sala de Estar",
    bedroom: "Quarto",
    kitchen: "Cozinha",
    bathroom: "Banheiro",
    dining: "Sala de Jantar",
    entryway: "Entrada",
    outdoor: "Área Externa",
    patio: "Varanda / Sacada",
  },

  redesignStyles: {
    "hotel-boutique": "Hotel Boutique",
    "cozy-retreat": "Refúgio Aconchegante",
    "resort-style": "Estilo Resort",
    "urban-lux": "Luxo Urbano",
    "nordic-airbnb": "Nórdico Airbnb",
    "instagram-worthy": "Para Instagram",
    "business-ready": "Pronto para Negócios",
    "family-friendly": "Familiar",
    "budget-refresh": "Renovação Econômica",
    "rustic-charm": "Charme Rústico",
  },

  guestTypes: {
    business: "Negócios",
    couples: "Casais",
    families: "Famílias",
    "digital-nomads": "Nômades Digitais",
  },

  budgetLevels: {
    "quick-fixes": "Ajustes Rápidos",
    refresh: "Renovação",
    makeover: "Reforma",
    "full-redesign": "Redesign Completo",
  },

  budgetDescriptions: {
    "quick-fixes": "Menos de $50 — roupa de cama, almofadas, decoração",
    refresh: "$50–200 — têxteis, iluminação, arte",
    makeover: "$200–500 — móveis, pintura, tapetes",
    "full-redesign": "$500+ — transformação completa",
  },

  // ─── Region / Season ───────────────────────────────────────────────────────
  regions: {
    beach: "Praia",
    city: "Cidade",
    mountain: "Montanha",
    countryside: "Campo",
    suburban: "Suburbano",
  },

  hemispheres: {
    northern: "Norte",
    southern: "Sul",
  },

  seasons: {
    spring: "Primavera",
    summer: "Verão",
    fall: "Outono",
    winter: "Inverno",
  },

  // ─── Seasonal Banner ──────────────────────────────────────────────────────
  seasonalBanner: {
    refreshFor: "Renovar para {{season}}",
  },

  // ─── Host Insights ────────────────────────────────────────────────────────
  hostInsights: {
    photos: "Propriedades com fotos profissionais recebem 40% mais reservas",
    score: "Anúncios com pontuação 8+ recebem 2x mais visualizações nas buscas",
    actionPlan: "Anfitriões que completam 3+ melhorias veem 40% mais reservas",
    description: "Descrições detalhadas e específicas recebem 26% mais reservas",
  },

  // ─── Language names ────────────────────────────────────────────────────────
  languages: {
    en: "Inglês",
    es: "Espanhol",
    pt: "Português",
    fr: "Francês",
    it: "Italiano",
  },
} as const;
