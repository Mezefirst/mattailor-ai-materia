// Internationalization utilities and translations
import { useKV } from '@github/spark/hooks';

export type Language = 'en' | 'sv' | 'de' | 'fr' | 'am';

export interface Translation {
  // Navigation and tabs
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
  
  // Common UI elements
  common: {
    search: string;
    filter: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
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
  
  // Header
  header: {
    title: string;
    subtitle: string;
  };
  
  // Overview
  overview: {
    title: string;
    description: string;
    noMaterials: string;
    selectMaterial: string;
    recommendations: string;
    score: string;
    viewDetails: string;
  };
  
  // New Material
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
  
  // AI Recommendation
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
  
  // ML Enhanced
  mlEnhanced: {
    title: string;
    description: string;
    provideFeedback: string;
    predictProperties: string;
    optimizeComposition: string;
  };
  
  // Properties
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
  
  // Sustainability
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
  
  // External Search
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
  
  // Settings
  settings: {
    title: string;
    description: string;
    language: string;
    selectLanguage: string;
    apiConfiguration: string;
    about: string;
    matwebKey: string;
    materialsProjectKey: string;
    saveConfiguration: string;
    version: string;
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
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
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
      title: 'External Database Search',
      description: 'Search materials from MatWeb and Materials Project databases',
      searchMatWeb: 'Search MatWeb',
      searchMaterialsProject: 'Search Materials Project',
      apiKeyRequired: 'API key required',
      configureKeys: 'Configure API keys in Settings',
      searchBy: 'Search by',
      chemicalFormula: 'Chemical Formula',
      materialClass: 'Material Class',
    },
    settings: {
      title: 'Settings',
      description: 'Configure MatTailor AI settings and external integrations',
      language: 'Language',
      selectLanguage: 'Select Language',
      apiConfiguration: 'API Configuration',
      about: 'About',
      matwebKey: 'MatWeb API Key',
      materialsProjectKey: 'Materials Project API Key',
      saveConfiguration: 'Save Configuration',
      version: 'Version',
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
      cancel: 'Avbryt',
      save: 'Spara',
      delete: 'Ta bort',
      edit: 'Redigera',
      create: 'Skapa',
      loading: 'Laddar...',
      error: 'Fel',
      success: 'Framgång',
      warning: 'Varning',
      info: 'Information',
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
      description: 'Få intelligenta materialförslag med naturliga språkfrågor',
      queryPlaceholder: 'Beskriv dina materialkrav...',
      askAI: 'Fråga AI',
      examples: {
        title: 'Exempelfrågor:',
        marine: 'Föreslå ett korrosionsbeständigt material för marint bruk under 30€/kg',
        packaging: 'Vad är den bästa kompositen för lätt förpackning i kalla klimat?',
        alloy: 'Simulera en koppar-aluminiumlegering för elektrisk ledningsförmåga och kostnad',
      },
      requirements: {
        mechanical: 'Mekaniska krav',
        environmental: 'Miljöbegränsningar',
        budget: 'Budgetbegränsningar',
        application: 'Applikationskontext',
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
      title: 'Extern databassökning',
      description: 'Sök material från MatWeb och Materials Project databaser',
      searchMatWeb: 'Sök MatWeb',
      searchMaterialsProject: 'Sök Materials Project',
      apiKeyRequired: 'API-nyckel krävs',
      configureKeys: 'Konfigurera API-nycklar i Inställningar',
      searchBy: 'Sök efter',
      chemicalFormula: 'Kemisk formel',
      materialClass: 'Materialklass',
    },
    settings: {
      title: 'Inställningar',
      description: 'Konfigurera MatTailor AI-inställningar och externa integrationer',
      language: 'Språk',
      selectLanguage: 'Välj språk',
      apiConfiguration: 'API-konfiguration',
      about: 'Om',
      matwebKey: 'MatWeb API-nyckel',
      materialsProjectKey: 'Materials Project API-nyckel',
      saveConfiguration: 'Spara konfiguration',
      version: 'Version',
      keyFeatures: 'Nyckelfunktioner',
      supportedDataSources: 'Stödda datakällor',
    },
  },
  de: {
    tabs: {
      overview: 'Übersicht',
      newMaterial: 'Neues Material',
      aiRecommendation: 'KI-Empfehlung',
      mlEnhanced: 'ML-erweitert',
      properties: 'Eigenschaften',
      sustainability: 'Nachhaltigkeit',
      externalSearch: 'Externe Suche',
      settings: 'Einstellungen',
    },
    common: {
      search: 'Suchen',
      filter: 'Filtern',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      create: 'Erstellen',
      loading: 'Laden...',
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
      selectMaterial: 'Wählen Sie ein Material, um Details anzuzeigen',
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
        packaging: 'Was ist der beste Verbundwerkstoff für leichte Verpackungen in kalten Klimazonen?',
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
      title: 'ML-erweiterte Vorhersagen',
      description: 'Maschinelles Lernen-gestützte Materialoptimierung und Eigenschaftsvorhersage',
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
      title: 'Externe Datenbanksuche',
      description: 'Suchen Sie Materialien aus MatWeb und Materials Project Datenbanken',
      searchMatWeb: 'MatWeb durchsuchen',
      searchMaterialsProject: 'Materials Project durchsuchen',
      apiKeyRequired: 'API-Schlüssel erforderlich',
      configureKeys: 'API-Schlüssel in Einstellungen konfigurieren',
      searchBy: 'Suchen nach',
      chemicalFormula: 'Chemische Formel',
      materialClass: 'Materialklasse',
    },
    settings: {
      title: 'Einstellungen',
      description: 'MatTailor AI-Einstellungen und externe Integrationen konfigurieren',
      language: 'Sprache',
      selectLanguage: 'Sprache auswählen',
      apiConfiguration: 'API-Konfiguration',
      about: 'Über',
      matwebKey: 'MatWeb API-Schlüssel',
      materialsProjectKey: 'Materials Project API-Schlüssel',
      saveConfiguration: 'Konfiguration speichern',
      version: 'Version',
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
      cancel: 'Annuler',
      save: 'Sauvegarder',
      delete: 'Supprimer',
      edit: 'Modifier',
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
      selectMaterial: 'Sélectionnez un matériau pour voir les détails',
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
      description: 'Obtenez des suggestions intelligentes de matériaux avec des requêtes en langage naturel',
      queryPlaceholder: 'Décrivez vos exigences matérielles...',
      askAI: 'Demander à l\'IA',
      examples: {
        title: 'Exemples de requêtes :',
        marine: 'Suggérez un matériau résistant à la corrosion pour usage marin sous 30€/kg',
        packaging: 'Quel est le meilleur composite pour un emballage léger en climat froid ?',
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
      description: 'Optimisation des matériaux et prédiction des propriétés par apprentissage automatique',
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
      title: 'Recherche de base de données externe',
      description: 'Recherchez des matériaux dans les bases de données MatWeb et Materials Project',
      searchMatWeb: 'Rechercher MatWeb',
      searchMaterialsProject: 'Rechercher Materials Project',
      apiKeyRequired: 'Clé API requise',
      configureKeys: 'Configurer les clés API dans les Paramètres',
      searchBy: 'Rechercher par',
      chemicalFormula: 'Formule chimique',
      materialClass: 'Classe de matériau',
    },
    settings: {
      title: 'Paramètres',
      description: 'Configurer les paramètres MatTailor AI et les intégrations externes',
      language: 'Langue',
      selectLanguage: 'Sélectionner la langue',
      apiConfiguration: 'Configuration API',
      about: 'À propos',
      matwebKey: 'Clé API MatWeb',
      materialsProjectKey: 'Clé API Materials Project',
      saveConfiguration: 'Sauvegarder la configuration',
      version: 'Version',
      keyFeatures: 'Fonctionnalités clés',
      supportedDataSources: 'Sources de données prises en charge',
    },
  },
  am: {
    tabs: {
      overview: 'አጠቃላይ እይታ',
      newMaterial: 'አዲስ ወረቀት',
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
      cancel: 'ሰርዝ',
      save: 'አስቀምጥ',
      delete: 'ሰርዝ',
      edit: 'አርትዕ',
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
      performance: 'አፈጻጸም',
      composition: 'ኮምፖዚሽን',
      properties: 'ባህሪያት',
    },
    header: {
      title: 'MatTailor AI',
      subtitle: 'ብልህ ቁሳቁስ ግኝት',
    },
    overview: {
      title: 'የቁሳቁስ አጠቃላይ እይታ',
      description: 'የቁሳቁስ ምክሮችዎን እና ንጽጽሮችዎን ይመርምሩ',
      noMaterials: 'ምንም ቁሳቁሶች አልተገኙም። ለመጀመር ቁሳቁሶችን ይፍጠሩ ወይም ይፈልጉ።',
      selectMaterial: 'ዝርዝሮችን ለማየት ቁሳቁስ ይምረጡ',
      recommendations: 'ምክሮች',
      score: 'ነጥብ',
      viewDetails: 'ዝርዝሮችን ይመልከቱ',
    },
    newMaterial: {
      title: 'አዲስ ቁሳቁስ ይፍጠሩ',
      description: 'ንጥረ ነገሮችን እና ስብጥሮችን በመምረጥ ብጁ ቁሳቁሶችን ይንደፉ',
      materialName: 'የቁሳቁስ ስም',
      selectElements: 'ንጥረ ነገሮችን ይምረጡ',
      addElement: 'ንጥረ ነገር ይጨምሩ',
      removeElement: 'ንጥረ ነገር ያስወግዱ',
      percentage: 'መቶኛ',
      normalize: 'መደበኛ ማድረግ',
      createMaterial: 'ቁሳቁስ ይፍጠሩ',
      periodicTable: 'የተወሳሰበ ሠንጠረዥ',
      composition: 'ኮምፖዚሽን',
      visualize: 'ኮምፖዚሽንን በማየት ያሳዩ',
    },
    aiRecommendation: {
      title: 'AI የቁሳቁስ ምክር',
      description: 'በተፈጥሮ ቋንቋ ጥያቄዎች ብልህ የቁሳቁስ ምክሮችን ያግኙ',
      queryPlaceholder: 'የቁሳቁስ መስፈርቶችዎን ይግለጹ...',
      askAI: 'AI ይጠይቁ',
      examples: {
        title: 'የምሳሌ ጥያቄዎች:',
        marine: 'ከ€30/ኪግ በታች ላለ የባህር አጠቃቀም የሚጋልብ ቁሳቁስ ይምከሩ',
        packaging: 'በቀዝቃዛ የአየር ሁኔታ ውስጥ ለቀላል ማሸግ ምርጡ ውህድ ምንድን ነው?',
        alloy: 'ለኤሌክትሪክ ንክኪነት እና ዋጋ የመዳብ-አልሙኒየም ውህድ ይኮርኩ',
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
      description: 'በማሽን ትምህርት የሚደገፍ የቁሳቁስ መተኮር እና የባህሪ ትንበያ',
      provideFeedback: 'አስተያየት ይስጡ',
      predictProperties: 'ባህሪያትን ይተነብዩ',
      optimizeComposition: 'ኮምፖዚሽንን ማሻሻል',
    },
    properties: {
      title: 'የቁሳቁስ ባህሪያት',
      description: 'ዝርዝር የባህሪ ትንተና እና የማስመሰያ ውጤቶች',
      mechanical: 'ሜካኒካል ባህሪያት',
      thermal: 'የሙቀት ባህሪያት',
      electrical: 'የኤሌክትሪክ ባህሪያት',
      chemical: 'የኬሚካል ባህሪያት',
      simulate: 'ባህሪያትን ማስመሰል',
      tensileStrength: 'የመጎተት ጥንካሬ',
      youngsModulus: 'የዮንግ ሞዱል',
      thermalConductivity: 'የሙቀት አስተላላፊነት',
      electricalConductivity: 'የኤሌክትሪክ አስተላላፊነት',
      corrosionResistance: 'የሙስና መቋቋም',
    },
    sustainability: {
      title: 'የቀጣይነት ትንተና',
      description: 'የአካባቢ ተጽዕኖ እና የህይወት ዑደት ግምገማ',
      lifecycleAssessment: 'የህይወት ዑደት ግምገማ',
      carbonFootprint: 'የካርቦን አሻራ',
      recyclability: 'እንደገና መጠቀም',
      supplyChain: 'የአቅርቦት ሰንሰለት',
      environmentalImpact: 'የአካባቢ ተጽዕኖ',
      sustainabilityScore: 'የቀጣይነት ነጥብ',
    },
    externalSearch: {
      title: 'ውጫዊ የመረጃ ቋት ፍለጋ',
      description: 'ከMatWeb እና Materials Project መረጃ ቋቶች ቁሳቁሶችን ይፈልጉ',
      searchMatWeb: 'MatWeb ይፈልጉ',
      searchMaterialsProject: 'Materials Project ይፈልጉ',
      apiKeyRequired: 'API ቁልፍ ያስፈልጋል',
      configureKeys: 'በቅንብሮች ውስጥ API ቁልፎችን ያዋቅሩ',
      searchBy: 'በሚመጣው ይፈልጉ',
      chemicalFormula: 'የኬሚካል ቀመር',
      materialClass: 'የቁሳቁስ ክፍል',
    },
    settings: {
      title: 'ቅንብሮች',
      description: 'MatTailor AI ቅንብሮችን እና ውጫዊ ውህደቶችን ያዋቅሩ',
      language: 'ቋንቋ',
      selectLanguage: 'ቋንቋ ይምረጡ',
      apiConfiguration: 'API ውቅር',
      about: 'ስለ',
      matwebKey: 'MatWeb API ቁልፍ',
      materialsProjectKey: 'Materials Project API ቁልፍ',
      saveConfiguration: 'ውቅር አስቀምጥ',
      version: 'ስሪት',
      keyFeatures: 'ቁልፍ ባህሪያት',
      supportedDataSources: 'የተደገፉ የመረጃ ምንጮች',
    },
  },
};

// Language options for UI
export const languageOptions = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'sv', label: 'Svenska', flag: '🇸🇪' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'am', label: 'አማርኛ', flag: '🇪🇹' },
];

// Hook for using translations
export function useTranslation() {
  const [language, setLanguage] = useKV<Language>('app-language', 'en');
  
  const t = translations[language] || translations.en;
  
  return {
    t,
    language,
    setLanguage,
    languageOptions,
  };
}