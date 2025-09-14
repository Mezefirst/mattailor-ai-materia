// Internationalization utilities and translations
import { useKV } from '@github/spark/hooks';

export type Language = 'en' | 'sv' | 'de' | 'fr' | 'am';

export interface Translation {
  tabs: {
    overview: string;
    newMaterial: string;
    aiRecommendation: string;
    mlEnhanced: string;
    properties: string;
    sustainability: string;
    externalSearch: string;
    settings: string;
  };
  
  common: {
    search: string;
    filter: string;
    save: string;
    edit: string;
    delete: string;
    create: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    name: string;
    description: string;
    type: string;
    density: string;
    temperature: string;
    cost: string;
    sustainability: string;
    performance: string;
    composition: string;
    properties: string;
  };
  
  header: {
    title: string;
    subtitle: string;
  };
  
  overview: {
    title: string;
    description: string;
    noMaterials: string;
    selectMaterial: string;
    recommendations: string;
    score: string;
    viewDetails: string;
  };
  
  newMaterial: {
    title: string;
    description: string;
    materialName: string;
    selectElements: string;
    addElement: string;
    removeElement: string;
    percentage: string;
    normalize: string;
    createMaterial: string;
    periodicTable: string;
    composition: string;
    visualize: string;
  };
  
  aiRecommendation: {
    title: string;
    description: string;
    queryPlaceholder: string;
    askAI: string;
    examples: {
      title: string;
      marine: string;
      packaging: string;
      alloy: string;
    };
    requirements: {
      mechanical: string;
      environmental: string;
      budget: string;
      application: string;
    };
  };
  
  aiOptimization: {
    title: string;
    description: string;
    targetApplication: string;
    customRequirements: string;
    advancedTargets: string;
    optimizeButton: string;
    optimizing: string;
    confidence: string;
    expectedProperties: string;
    processingNotes: string;
    optimizationHistory: string;
    clearHistory: string;
    apply: string;
    elementSuggestions: string;
    smartSuggestions: string;
    getSuggestions: string;
    analyzing: string;
    composition: string;
    keyProperties: string;
    advantages: string;
    considerations: string;
    currentElements: string;
    applications: {
      aerospace: string;
      automotive: string;
      marine: string;
      electronics: string;
      medical: string;
      construction: string;
      energy: string;
      tooling: string;
      custom: string;
    };
  };
  
  mlEnhanced: {
    title: string;
    description: string;
    provideFeedback: string;
    predictProperties: string;
    optimizeComposition: string;
  };
  
  properties: {
    title: string;
    description: string;
    mechanical: string;
    thermal: string;
    electrical: string;
    chemical: string;
    simulate: string;
    tensileStrength: string;
    youngsModulus: string;
    thermalConductivity: string;
    electricalConductivity: string;
    corrosionResistance: string;
  };
  
  sustainability: {
    title: string;
    description: string;
    lifecycleAssessment: string;
    carbonFootprint: string;
    recyclability: string;
    supplyChain: string;
    environmentalImpact: string;
    sustainabilityScore: string;
  };
  
  externalSearch: {
    title: string;
    description: string;
    searchMatWeb: string;
    searchMaterialsProject: string;
    apiKeyRequired: string;
    configureKeys: string;
    searchBy: string;
    chemicalFormula: string;
    materialClass: string;
  };
  
  settings: {
    title: string;
    description: string;
    language: string;
    selectLanguage: string;
    apiConfiguration: string;
    matwebKey: string;
    materialsProjectKey: string;
    saveConfiguration: string;
    version: string;
    about: string;
    keyFeatures: string;
    supportedDataSources: string;
  };
}

// Translation data
export const translations: Record<Language, Translation> = {
  en: {
    tabs: {
      overview: 'Overview',
      newMaterial: 'New Material',
      aiRecommendation: 'AI Recommendation',
      mlEnhanced: 'ML Enhanced',
      properties: 'Properties',
      sustainability: 'Sustainability',
      externalSearch: 'External Search',
      settings: 'Settings',
    },
    
    common: {
      search: 'Search',
      filter: 'Filter',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      create: 'Create',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      name: 'Name',
      description: 'Description',
      type: 'Type',
      density: 'Density',
      temperature: 'Temperature',
      cost: 'Cost',
      sustainability: 'Sustainability',
      performance: 'Performance',
      composition: 'Composition',
      properties: 'Properties',
    },
    
    header: {
      title: 'MatTailor AI',
      subtitle: 'Intelligent Material Discovery',
    },
    
    overview: {
      title: 'Material Overview',
      description: 'Explore your material recommendations and comparisons',
      noMaterials: 'No materials found. Create or search for materials to get started.',
      selectMaterial: 'Select a material to view details',
      recommendations: 'Recommendations',
      score: 'Score',
      viewDetails: 'View Details',
    },
    
    newMaterial: {
      title: 'Create New Material',
      description: 'Design custom materials by selecting elements and compositions',
      materialName: 'Material Name',
      selectElements: 'Select Elements',
      addElement: 'Add Element',
      removeElement: 'Remove Element',
      percentage: 'Percentage',
      normalize: 'Normalize',
      createMaterial: 'Create Material',
      periodicTable: 'Periodic Table',
      composition: 'Composition',
      visualize: 'Visualize Composition',
    },
    
    aiRecommendation: {
      title: 'AI Material Recommendation',
      description: 'Get intelligent material suggestions using natural language queries',
      queryPlaceholder: 'Describe your material requirements...',
      askAI: 'Ask AI',
      examples: {
        title: 'Example Queries:',
        marine: 'Suggest a corrosion-resistant material for marine use under €30/kg',
        packaging: 'What\'s the best composite for lightweight packaging in cold climates?',
        alloy: 'Simulate a copper-aluminum alloy for electrical conductivity and cost',
      },
      requirements: {
        mechanical: 'Mechanical Requirements',
        environmental: 'Environmental Constraints',
        budget: 'Budget Constraints',
        application: 'Application Context',
      },
    },
    
    aiOptimization: {
      title: 'AI-Powered Alloy Optimization',
      description: 'Leverage advanced metallurgical AI to optimize element ratios for specific applications and properties',
      targetApplication: 'Target Application',
      customRequirements: 'Specific Requirements',
      advancedTargets: 'Advanced Property Targets',
      optimizeButton: 'Optimize Alloy for',
      optimizing: 'Optimizing Alloy Composition...',
      confidence: 'Confidence',
      expectedProperties: 'Expected Properties',
      processingNotes: 'Processing Recommendations',
      optimizationHistory: 'Optimization History',
      clearHistory: 'Clear History',
      apply: 'Apply',
      elementSuggestions: 'Smart Element Suggestions',
      smartSuggestions: 'Get AI-powered recommendations for optimal element combinations based on application requirements',
      getSuggestions: 'Get Suggestions',
      analyzing: 'Analyzing...',
      composition: 'Composition',
      keyProperties: 'Key Properties',
      advantages: 'Advantages',
      considerations: 'Considerations',
      currentElements: 'Current Elements',
      applications: {
        aerospace: '✈️ Aerospace',
        automotive: '🚗 Automotive',
        marine: '🚢 Marine',
        electronics: '📱 Electronics',
        medical: '🏥 Medical',
        construction: '🏗️ Construction',
        energy: '⚡ Energy',
        tooling: '🔧 Tooling',
        custom: '🎯 Custom',
      },
    },
    
    mlEnhanced: {
      title: 'ML Enhanced Predictions',
      description: 'Machine learning powered material optimization and property prediction',
      provideFeedback: 'Provide Feedback',
      predictProperties: 'Predict Properties',
      optimizeComposition: 'Optimize Composition',
    },
    
    properties: {
      title: 'Material Properties',
      description: 'Detailed property analysis and simulation results',
      mechanical: 'Mechanical Properties',
      thermal: 'Thermal Properties',
      electrical: 'Electrical Properties',
      chemical: 'Chemical Properties',
      simulate: 'Simulate Properties',
      tensileStrength: 'Tensile Strength',
      youngsModulus: 'Young\'s Modulus',
      thermalConductivity: 'Thermal Conductivity',
      electricalConductivity: 'Electrical Conductivity',
      corrosionResistance: 'Corrosion Resistance',
    },
    
    sustainability: {
      title: 'Sustainability Analysis',
      description: 'Environmental impact and lifecycle assessment',
      lifecycleAssessment: 'Lifecycle Assessment',
      carbonFootprint: 'Carbon Footprint',
      recyclability: 'Recyclability',
      supplyChain: 'Supply Chain',
      environmentalImpact: 'Environmental Impact',
      sustainabilityScore: 'Sustainability Score',
    },
    
    externalSearch: {
      title: 'External Material Search',
      description: 'Search materials from MatWeb and Materials Project databases',
      searchMatWeb: 'Search MatWeb',
      searchMaterialsProject: 'Search Materials Project',
      apiKeyRequired: 'API Key Required',
      configureKeys: 'Configure API Keys',
      searchBy: 'Search By',
      chemicalFormula: 'Chemical Formula',
      materialClass: 'Material Class',
    },
    
    settings: {
      title: 'Settings',
      description: 'Configure MatTailor AI settings and preferences',
      language: 'Language',
      selectLanguage: 'Select Language',
      apiConfiguration: 'API Configuration',
      matwebKey: 'MatWeb API Key',
      materialsProjectKey: 'Materials Project API Key',
      saveConfiguration: 'Save Configuration',
      version: 'Version',
      about: 'About',
      keyFeatures: 'Key Features',
      supportedDataSources: 'Supported Data Sources',
    },
  },
  
  sv: {
    tabs: {
      overview: 'Översikt',
      newMaterial: 'Nytt Material',
      aiRecommendation: 'AI-rekommendation',
      mlEnhanced: 'ML-förbättrad',
      properties: 'Egenskaper',
      sustainability: 'Hållbarhet',
      externalSearch: 'Extern sökning',
      settings: 'Inställningar',
    },
    
    common: {
      search: 'Sök',
      filter: 'Filtrera',
      save: 'Spara',
      edit: 'Redigera',
      delete: 'Ta bort',
      create: 'Skapa',
      loading: 'Laddar...',
      error: 'Fel',
      success: 'Framgång',
      warning: 'Varning',
      info: 'Info',
      name: 'Namn',
      description: 'Beskrivning',
      type: 'Typ',
      density: 'Densitet',
      temperature: 'Temperatur',
      cost: 'Kostnad',
      sustainability: 'Hållbarhet',
      performance: 'Prestanda',
      composition: 'Sammansättning',
      properties: 'Egenskaper',
    },
    
    header: {
      title: 'MatTailor AI',
      subtitle: 'Intelligent materialupptäckt',
    },
    
    overview: {
      title: 'Materialöversikt',
      description: 'Utforska dina materialrekommendationer och jämförelser',
      noMaterials: 'Inga material hittades. Skapa eller sök efter material för att komma igång.',
      selectMaterial: 'Välj ett material för att visa detaljer',
      recommendations: 'Rekommendationer',
      score: 'Poäng',
      viewDetails: 'Visa detaljer',
    },
    
    newMaterial: {
      title: 'Skapa nytt material',
      description: 'Designa anpassade material genom att välja element och sammansättningar',
      materialName: 'Materialnamn',
      selectElements: 'Välj element',
      addElement: 'Lägg till element',
      removeElement: 'Ta bort element',
      percentage: 'Procent',
      normalize: 'Normalisera',
      createMaterial: 'Skapa material',
      periodicTable: 'Periodiska systemet',
      composition: 'Sammansättning',
      visualize: 'Visualisera sammansättning',
    },
    
    aiRecommendation: {
      title: 'AI-materialrekommendation',
      description: 'Få intelligenta materialförslag med hjälp av naturliga språkfrågor',
      queryPlaceholder: 'Beskriv dina materialkrav...',
      askAI: 'Fråga AI',
      examples: {
        title: 'Exempelfrågor:',
        marine: 'Föreslå ett korrosionsbeständigt material för marin användning under 30€/kg',
        packaging: 'Vilket är den bästa kompositen för lätt förpackning i kalla klimat?',
        alloy: 'Simulera en koppar-aluminiumlegering för elektrisk ledningsförmåga och kostnad',
      },
      requirements: {
        mechanical: 'Mekaniska krav',
        environmental: 'Miljöbegränsningar',
        budget: 'Budgetbegränsningar',
        application: 'Tillämpningskontext',
      },
    },
    
    mlEnhanced: {
      title: 'ML-förbättrade förutsägelser',
      description: 'Maskininlärningsdriven materialoptimering och egenskapsförutsägelse',
      provideFeedback: 'Ge feedback',
      predictProperties: 'Förutsäg egenskaper',
      optimizeComposition: 'Optimera sammansättning',
    },
    
    properties: {
      title: 'Materialegenskaper',
      description: 'Detaljerad egenskapsanalys och simuleringsresultat',
      mechanical: 'Mekaniska egenskaper',
      thermal: 'Termiska egenskaper',
      electrical: 'Elektriska egenskaper',
      chemical: 'Kemiska egenskaper',
      simulate: 'Simulera egenskaper',
      tensileStrength: 'Draghållfasthet',
      youngsModulus: 'Youngs modul',
      thermalConductivity: 'Värmeledningsförmåga',
      electricalConductivity: 'Elektrisk ledningsförmåga',
      corrosionResistance: 'Korrosionsbeständighet',
    },
    
    sustainability: {
      title: 'Hållbarhetsanalys',
      description: 'Miljöpåverkan och livscykelanalys',
      lifecycleAssessment: 'Livscykelanalys',
      carbonFootprint: 'Koldioxidavtryck',
      recyclability: 'Återvinningsbarhet',
      supplyChain: 'Leveranskedja',
      environmentalImpact: 'Miljöpåverkan',
      sustainabilityScore: 'Hållbarhetspoäng',
    },
    
    externalSearch: {
      title: 'Extern materialsökning',
      description: 'Sök material från MatWeb och Materials Project databaser',
      searchMatWeb: 'Sök MatWeb',
      searchMaterialsProject: 'Sök Materials Project',
      apiKeyRequired: 'API-nyckel krävs',
      configureKeys: 'Konfigurera API-nycklar',
      searchBy: 'Sök efter',
      chemicalFormula: 'Kemisk formel',
      materialClass: 'Materialklass',
    },
    
    settings: {
      title: 'Inställningar',
      description: 'Konfigurera MatTailor AI-inställningar och preferenser',
      language: 'Språk',
      selectLanguage: 'Välj språk',
      apiConfiguration: 'API-konfiguration',
      matwebKey: 'MatWeb API-nyckel',
      materialsProjectKey: 'Materials Project API-nyckel',
      saveConfiguration: 'Spara konfiguration',
      version: 'Version',
      about: 'Om',
      keyFeatures: 'Nyckelfunktioner',
      supportedDataSources: 'Stödda datakällor',
    },
  },
  
  de: {
    tabs: {
      overview: 'Übersicht',
      newMaterial: 'Neues Material',
      aiRecommendation: 'KI-Empfehlung',
      mlEnhanced: 'ML-verstärkt',
      properties: 'Eigenschaften',
      sustainability: 'Nachhaltigkeit',
      externalSearch: 'Externe Suche',
      settings: 'Einstellungen',
    },
    
    common: {
      search: 'Suchen',
      filter: 'Filtern',
      save: 'Speichern',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      create: 'Erstellen',
      loading: 'Lädt...',
      error: 'Fehler',
      success: 'Erfolg',
      warning: 'Warnung',
      info: 'Info',
      name: 'Name',
      description: 'Beschreibung',
      type: 'Typ',
      density: 'Dichte',
      temperature: 'Temperatur',
      cost: 'Kosten',
      sustainability: 'Nachhaltigkeit',
      performance: 'Leistung',
      composition: 'Zusammensetzung',
      properties: 'Eigenschaften',
    },
    
    header: {
      title: 'MatTailor AI',
      subtitle: 'Intelligente Materialentdeckung',
    },
    
    overview: {
      title: 'Materialübersicht',
      description: 'Erkunden Sie Ihre Materialempfehlungen und Vergleiche',
      noMaterials: 'Keine Materialien gefunden. Erstellen oder suchen Sie Materialien, um zu beginnen.',
      selectMaterial: 'Wählen Sie ein Material aus, um Details anzuzeigen',
      recommendations: 'Empfehlungen',
      score: 'Bewertung',
      viewDetails: 'Details anzeigen',
    },
    
    newMaterial: {
      title: 'Neues Material erstellen',
      description: 'Entwerfen Sie benutzerdefinierte Materialien durch Auswahl von Elementen und Zusammensetzungen',
      materialName: 'Materialname',
      selectElements: 'Elemente auswählen',
      addElement: 'Element hinzufügen',
      removeElement: 'Element entfernen',
      percentage: 'Prozent',
      normalize: 'Normalisieren',
      createMaterial: 'Material erstellen',
      periodicTable: 'Periodensystem',
      composition: 'Zusammensetzung',
      visualize: 'Zusammensetzung visualisieren',
    },
    
    aiRecommendation: {
      title: 'KI-Materialempfehlung',
      description: 'Erhalten Sie intelligente Materialvorschläge mit natürlichen Sprachanfragen',
      queryPlaceholder: 'Beschreiben Sie Ihre Materialanforderungen...',
      askAI: 'KI fragen',
      examples: {
        title: 'Beispielanfragen:',
        marine: 'Schlagen Sie ein korrosionsbeständiges Material für den Meeresbereich unter 30€/kg vor',
        packaging: 'Was ist der beste Verbundstoff für leichte Verpackungen in kalten Klimazonen?',
        alloy: 'Simulieren Sie eine Kupfer-Aluminium-Legierung für elektrische Leitfähigkeit und Kosten',
      },
      requirements: {
        mechanical: 'Mechanische Anforderungen',
        environmental: 'Umweltbeschränkungen',
        budget: 'Budgetbeschränkungen',
        application: 'Anwendungskontext',
      },
    },
    
    mlEnhanced: {
      title: 'ML-verstärkte Vorhersagen',
      description: 'Maschinelles Lernen basierte Materialoptimierung und Eigenschaftsvorhersage',
      provideFeedback: 'Feedback geben',
      predictProperties: 'Eigenschaften vorhersagen',
      optimizeComposition: 'Zusammensetzung optimieren',
    },
    
    properties: {
      title: 'Materialeigenschaften',
      description: 'Detaillierte Eigenschaftsanalyse und Simulationsergebnisse',
      mechanical: 'Mechanische Eigenschaften',
      thermal: 'Thermische Eigenschaften',
      electrical: 'Elektrische Eigenschaften',
      chemical: 'Chemische Eigenschaften',
      simulate: 'Eigenschaften simulieren',
      tensileStrength: 'Zugfestigkeit',
      youngsModulus: 'Elastizitätsmodul',
      thermalConductivity: 'Wärmeleitfähigkeit',
      electricalConductivity: 'Elektrische Leitfähigkeit',
      corrosionResistance: 'Korrosionsbeständigkeit',
    },
    
    sustainability: {
      title: 'Nachhaltigkeitsanalyse',
      description: 'Umweltauswirkungen und Lebenszyklusanalyse',
      lifecycleAssessment: 'Lebenszyklusanalyse',
      carbonFootprint: 'CO2-Fußabdruck',
      recyclability: 'Recyclingfähigkeit',
      supplyChain: 'Lieferkette',
      environmentalImpact: 'Umweltauswirkung',
      sustainabilityScore: 'Nachhaltigkeitsbewertung',
    },
    
    externalSearch: {
      title: 'Externe Materialsuche',
      description: 'Materialien aus MatWeb und Materials Project Datenbanken durchsuchen',
      searchMatWeb: 'MatWeb durchsuchen',
      searchMaterialsProject: 'Materials Project durchsuchen',
      apiKeyRequired: 'API-Schlüssel erforderlich',
      configureKeys: 'API-Schlüssel konfigurieren',
      searchBy: 'Suchen nach',
      chemicalFormula: 'Chemische Formel',
      materialClass: 'Materialklasse',
    },
    
    settings: {
      title: 'Einstellungen',
      description: 'MatTailor AI-Einstellungen und Präferenzen konfigurieren',
      language: 'Sprache',
      selectLanguage: 'Sprache auswählen',
      apiConfiguration: 'API-Konfiguration',
      matwebKey: 'MatWeb API-Schlüssel',
      materialsProjectKey: 'Materials Project API-Schlüssel',
      saveConfiguration: 'Konfiguration speichern',
      version: 'Version',
      about: 'Über',
      keyFeatures: 'Hauptfunktionen',
      supportedDataSources: 'Unterstützte Datenquellen',
    },
  },
  
  fr: {
    tabs: {
      overview: 'Aperçu',
      newMaterial: 'Nouveau matériau',
      aiRecommendation: 'Recommandation IA',
      mlEnhanced: 'ML amélioré',
      properties: 'Propriétés',
      sustainability: 'Durabilité',
      externalSearch: 'Recherche externe',
      settings: 'Paramètres',
    },
    
    common: {
      search: 'Rechercher',
      filter: 'Filtrer',
      save: 'Sauvegarder',
      edit: 'Modifier',
      delete: 'Supprimer',
      create: 'Créer',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      warning: 'Avertissement',
      info: 'Info',
      name: 'Nom',
      description: 'Description',
      type: 'Type',
      density: 'Densité',
      temperature: 'Température',
      cost: 'Coût',
      sustainability: 'Durabilité',
      performance: 'Performance',
      composition: 'Composition',
      properties: 'Propriétés',
    },
    
    header: {
      title: 'MatTailor AI',
      subtitle: 'Découverte intelligente de matériaux',
    },
    
    overview: {
      title: 'Aperçu des matériaux',
      description: 'Explorez vos recommandations et comparaisons de matériaux',
      noMaterials: 'Aucun matériau trouvé. Créez ou recherchez des matériaux pour commencer.',
      selectMaterial: 'Sélectionnez un matériau pour afficher les détails',
      recommendations: 'Recommandations',
      score: 'Score',
      viewDetails: 'Voir les détails',
    },
    
    newMaterial: {
      title: 'Créer un nouveau matériau',
      description: 'Concevez des matériaux personnalisés en sélectionnant des éléments et des compositions',
      materialName: 'Nom du matériau',
      selectElements: 'Sélectionner les éléments',
      addElement: 'Ajouter un élément',
      removeElement: 'Supprimer l\'élément',
      percentage: 'Pourcentage',
      normalize: 'Normaliser',
      createMaterial: 'Créer le matériau',
      periodicTable: 'Tableau périodique',
      composition: 'Composition',
      visualize: 'Visualiser la composition',
    },
    
    aiRecommendation: {
      title: 'Recommandation de matériau IA',
      description: 'Obtenez des suggestions de matériaux intelligentes en utilisant des requêtes en langage naturel',
      queryPlaceholder: 'Décrivez vos exigences de matériau...',
      askAI: 'Demander à l\'IA',
      examples: {
        title: 'Exemples de requêtes:',
        marine: 'Suggérez un matériau résistant à la corrosion pour usage marin sous 30€/kg',
        packaging: 'Quel est le meilleur composite pour un emballage léger en climat froid?',
        alloy: 'Simulez un alliage cuivre-aluminium pour la conductivité électrique et le coût',
      },
      requirements: {
        mechanical: 'Exigences mécaniques',
        environmental: 'Contraintes environnementales',
        budget: 'Contraintes budgétaires',
        application: 'Contexte d\'application',
      },
    },
    
    mlEnhanced: {
      title: 'Prédictions ML améliorées',
      description: 'Optimisation des matériaux et prédiction des propriétés alimentées par l\'apprentissage automatique',
      provideFeedback: 'Fournir des commentaires',
      predictProperties: 'Prédire les propriétés',
      optimizeComposition: 'Optimiser la composition',
    },
    
    properties: {
      title: 'Propriétés des matériaux',
      description: 'Analyse détaillée des propriétés et résultats de simulation',
      mechanical: 'Propriétés mécaniques',
      thermal: 'Propriétés thermiques',
      electrical: 'Propriétés électriques',
      chemical: 'Propriétés chimiques',
      simulate: 'Simuler les propriétés',
      tensileStrength: 'Résistance à la traction',
      youngsModulus: 'Module de Young',
      thermalConductivity: 'Conductivité thermique',
      electricalConductivity: 'Conductivité électrique',
      corrosionResistance: 'Résistance à la corrosion',
    },
    
    sustainability: {
      title: 'Analyse de durabilité',
      description: 'Impact environnemental et analyse du cycle de vie',
      lifecycleAssessment: 'Analyse du cycle de vie',
      carbonFootprint: 'Empreinte carbone',
      recyclability: 'Recyclabilité',
      supplyChain: 'Chaîne d\'approvisionnement',
      environmentalImpact: 'Impact environnemental',
      sustainabilityScore: 'Score de durabilité',
    },
    
    externalSearch: {
      title: 'Recherche de matériaux externe',
      description: 'Recherchez des matériaux dans les bases de données MatWeb et Materials Project',
      searchMatWeb: 'Rechercher MatWeb',
      searchMaterialsProject: 'Rechercher Materials Project',
      apiKeyRequired: 'Clé API requise',
      configureKeys: 'Configurer les clés API',
      searchBy: 'Rechercher par',
      chemicalFormula: 'Formule chimique',
      materialClass: 'Classe de matériau',
    },
    
    settings: {
      title: 'Paramètres',
      description: 'Configurez les paramètres et préférences de MatTailor AI',
      language: 'Langue',
      selectLanguage: 'Sélectionner la langue',
      apiConfiguration: 'Configuration API',
      matwebKey: 'Clé API MatWeb',
      materialsProjectKey: 'Clé API Materials Project',
      saveConfiguration: 'Sauvegarder la configuration',
      version: 'Version',
      about: 'À propos',
      keyFeatures: 'Fonctionnalités clés',
      supportedDataSources: 'Sources de données prises en charge',
    },
  },
  
  am: {
    tabs: {
      overview: 'አጠቃላይ እይታ',
      newMaterial: 'አዲስ ቁሳቁስ',
      aiRecommendation: 'AI ምክር',
      mlEnhanced: 'ML የተሻሻለ',
      properties: 'ባህሪያት',
      sustainability: 'ቀጣይነት',
      externalSearch: 'ውጫዊ ፍለጋ',
      settings: 'ቅንብሮች',
    },
    
    common: {
      search: 'ፈልግ',
      filter: 'ማጣሪያ',
      save: 'አስቀምጥ',
      edit: 'አርትዕ',
      delete: 'ሰርዝ',
      create: 'ይፍጠሩ',
      loading: 'በመጫን ላይ...',
      error: 'ስህተት',
      success: 'ስኬት',
      warning: 'ማስጠንቀቂያ',
      info: 'መረጃ',
      name: 'ስም',
      description: 'መግለጫ',
      type: 'ዓይነት',
      density: 'ጥግግት',
      temperature: 'ሙቀት',
      cost: 'ዋጋ',
      sustainability: 'ቀጣይነት',
      performance: 'አፈፃፀም',
      composition: 'ኮምፖዚሽን',
      properties: 'ባህሪያት',
    },
    
    header: {
      title: 'MatTailor AI',
      subtitle: 'ብልህ ቁሳቁስ ዲስከቨሪ',
    },
    
    overview: {
      title: 'የቁሳቁስ አጠቃላይ እይታ',
      description: 'የቁሳቁስ ምክሮችዎን እና ንፅፅሮችዎን ያግኙ',
      noMaterials: 'ምንም ቁሳቁሶች አልተገኙም። ለመጀመር ቁሳቁሶችን ይፍጠሩ ወይም ይፈልጉ።',
      selectMaterial: 'ዝርዝሮችን ለማየት ቁሳቁስ ይምረጡ',
      recommendations: 'ምክሮች',
      score: 'ውጤት',
      viewDetails: 'ዝርዝሮችን ይመልከቱ',
    },
    
    newMaterial: {
      title: 'አዲስ ቁሳቁስ ይፍጠሩ',
      description: 'ንጥረ ነገሮችን እና ኮምፖዚሽንዎችን በመምረጥ ብጁ ቁሳቁሶችን ይንደፉ',
      materialName: 'የቁሳቁስ ስም',
      selectElements: 'ንጥረ ነገሮችን ይምረጡ',
      addElement: 'ንጥረ ነገር ይጨምሩ',
      removeElement: 'ንጥረ ነገር ያስወግዱ',
      percentage: 'መቶኛ',
      normalize: 'መደበኛ ማድረግ',
      createMaterial: 'ቁሳቁስ ይፍጠሩ',
      periodicTable: 'የተወሳሰበ ሰንጠረዥ',
      composition: 'ኮምፖዚሽን',
      visualize: 'ኮምፖዚሽንን በማየት ያሳዩ',
    },
    
    aiRecommendation: {
      title: 'AI ቁሳቁስ ምክር',
      description: 'የተፈጥሮ ቋንቋ ጥያቄዎችን በመጠቀም ብልህ የቁሳቁስ ምክሮችን ያግኙ',
      queryPlaceholder: 'የቁሳቁስ መስፈርቶችዎን ይግለፁ...',
      askAI: 'AI ይጠይቁ',
      examples: {
        title: 'የምሳሌ ጥያቄዎች:',
        marine: 'ከ30€/kg በታች ላለ የባህር ላይ አጠቃቀም የሚረዝ ቁሳቁስ ምከር',
        packaging: 'በቀዝቃዛ የአየር ሁኔታ ውስጥ ለቀላል ማሸግ ምርጡ ውህድ ምንድን ነው?',
        alloy: 'ለኤሌክትሪክ አመላላሽነት እና ዋጋ የመዳብ-አሉሚኒየም ውህድ ምሳሌ',
      },
      requirements: {
        mechanical: 'ሜካኒካል መስፈርቶች',
        environmental: 'የአካባቢ ገደቦች',
        budget: 'የበጀት ገደቦች',
        application: 'የመተግበሪያ አውድ',
      },
    },
    
    mlEnhanced: {
      title: 'ML የተሻሻሉ ትንበያዎች',
      description: 'በማሽን ትምህርት የሚደገፍ የቁሳቁስ ማሻሻያ እና የባህሪ ትንበያ',
      provideFeedback: 'ግብረመልስ ይስጡ',
      predictProperties: 'ባህሪያትን ይተንብዩ',
      optimizeComposition: 'ኮምፖዚሽንን ማሻሻል',
    },
    
    properties: {
      title: 'የቁሳቁስ ባህሪያት',
      description: 'ዝርዝር የባህሪ ትንታኔ እና የማስመሰል ውጤቶች',
      mechanical: 'ሜካኒካል ባህሪያት',
      thermal: 'የሙቀት ባህሪያት',
      electrical: 'የኤሌክትሪክ ባህሪያት',
      chemical: 'የኬሚካል ባህሪያት',
      simulate: 'ባህሪያትን ማስመሰል',
      tensileStrength: 'የመሸከም ጥንካሬ',
      youngsModulus: 'የዮንግ ሞዱል',
      thermalConductivity: 'የሙቀት አመላላሽነት',
      electricalConductivity: 'የኤሌክትሪክ አመላላሽነት',
      corrosionResistance: 'የእኩይ ተፅዕኖ መከላከያ',
    },
    
    sustainability: {
      title: 'የቀጣይነት ትንተና',
      description: 'የአካባቢ ተጽዕኖ እና የህይወት ዑደት ግምገማ',
      lifecycleAssessment: 'የህይወት ዑደት ግምገማ',
      carbonFootprint: 'የካርቦን አሻራ',
      recyclability: 'እንደገና መጠቀም',
      supplyChain: 'የአቅርቦት ሰንሰለት',
      environmentalImpact: 'የአካባቢ ተጽዕኖ',
      sustainabilityScore: 'የቀጣይነት ውጤት',
    },
    
    externalSearch: {
      title: 'ውጫዊ የቁሳቁስ ፍለጋ',
      description: 'ከMatWeb እና Materials Project ዳታቤዝ ቁሳቁሶችን ይፈልጉ',
      searchMatWeb: 'MatWeb ይፈልጉ',
      searchMaterialsProject: 'Materials Project ይፈልጉ',
      apiKeyRequired: 'API ቁልፍ ያስፈልጋል',
      configureKeys: 'API ቁልፎችን ያዋቅሩ',
      searchBy: 'በሚከተለው ይፈልጉ',
      chemicalFormula: 'የኬሚካል ቀመር',
      materialClass: 'የቁሳቁስ ክፍል',
    },
    
    settings: {
      title: 'ቅንብሮች',
      description: 'MatTailor AI ቅንብሮችን እና ምርጫዎችን ያዋቅሩ',
      language: 'ቋንቋ',
      selectLanguage: 'ቋንቋ ይምረጡ',
      apiConfiguration: 'API ውቅረት',
      matwebKey: 'MatWeb API ቁልፍ',
      materialsProjectKey: 'Materials Project API ቁልፍ',
      saveConfiguration: 'ውቅረትን አስቀምጥ',
      version: 'ስሪት',
      about: 'ስለ',
      keyFeatures: 'ቁልፍ ባህሪያት',
      supportedDataSources: 'የሚደገፉ የውሂብ ምንጮች',
    },
  },
};

export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'sv', label: 'Svenska' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' },
  { value: 'am', label: 'አማርኛ' },
];

// Hook for using translations
export function useTranslation() {
  const [language, setLanguage] = useKV('language', 'en');
  const t = translations[language] || translations.en;
  
  return {
    t,
    language,
    setLanguage,
    languageOptions,
  };
}