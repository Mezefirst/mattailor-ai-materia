// Internationalization utilities and translations
import { useKV } from '@github/spark/hooks';

export type Language = 'en' | 'sv' | 'de' | 'fr' | 'am';

export interface Translation {
    properties: string;
  tabs: {
    overview: string;
    newMaterial: string;
    search: string;
    mlEnhanced: string;
    delete: string;
    sustainability: string;
    externalSearch: string;
    settings: string;
  };
  
    temperature: string
  common: {
    composition: st
    filter: string;
  // Header
    save: string;
  };
    edit: string;
    title: string;
    loading: string;
    recommendation
    success: string;
  
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
  
    };
  header: {
    title: string;
    subtitle: string;
  
  
    descripti
  overview: {
  };
    description: string;
    noMaterials: string;
    selectMaterial: string;
    recommendations: string;
    score: string;
    viewDetails: string;
  };
  
  // New Material
    title: strin
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
    materialsProjectK
    title: string;
    supportedDataSources
    queryPlaceholder: string;
// Translation dat
    examples: {
      title: string;
      marine: string;
      packaging: string;
      alloy: string;
    },
    requirements: {
      mechanical: string;
      environmental: string;
      budget: string;
      application: string;
      
  };
  
  // ML Enhanced
  mlEnhanced: {
    title: string;
    description: string;
    provideFeedback: string;
    predictProperties: string;
    optimizeComposition: string;
    
  
      viewDetai
  properties: {
      description:
    description: string;
      removeElement: 'R
    thermal: string;
      periodicTable: 'P
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
    
  
      title: 'Sustai
  externalSearch: {
      recyclabilit
    description: string;
    searchMatWeb: string;
    searchMaterialsProject: string;
    apiKeyRequired: string;
    configureKeys: string;
      searchBy: 'Sear
    chemicalFormula: string;
    settings: {
  };
  
  // Settings
      materia
    title: string;
    description: string;
    language: string;
    selectLanguage: string;
    apiConfiguration: string;
      mlEnhanced: 
    matwebKey: string;
    materialsProjectKey: string;
    saveConfiguration: string;
    version: string;
    keyFeatures: string;
    supportedDataSources: string;
  };
 

// Translation data
export const translations: Record<Language, Translation> = {
      c
    tabs: {
      overview: 'Overview',
      newMaterial: 'New Material',
      aiRecommendation: 'AI Recommendation',
      mlEnhanced: 'ML Enhanced',
      properties: 'Properties',
      sustainability: 'Sustainability',
      externalSearch: 'External Search',
      settings: 'Settings',
      
    common: {
      search: 'Search',
      filter: 'Filter',
      createMaterial: '
      save: 'Save',
    },
      edit: 'Edit',
      create: 'Create',
      loading: 'Loading...',
        marine: 'Före
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
      
    header: {
    sustainability: {
      subtitle: 'Intelligent Material Discovery',
      
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
      name: 'Name',
      examples: {
        title: 'Example Queries:',
        marine: 'Suggest a corrosion-resistant material for marine use under €30/kg',
        packaging: 'What\'s the best composite for lightweight packaging in cold climates?',
        alloy: 'Simulate a copper-aluminum alloy for electrical conductivity and cost',
      ti
      requirements: {
        mechanical: 'Mechanical Requirements',
        environmental: 'Environmental Constraints',
        budget: 'Budget Constraints',
        application: 'Application Context',
    newM
    },
      selectEleme
      title: 'ML Enhanced Predictions',
      description: 'Machine learning powered material optimization and property prediction',
      provideFeedback: 'Provide Feedback',
      predictProperties: 'Predict Properties',
      optimizeComposition: 'Optimize Composition',
      
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
      simulate: 'Eige
      youngsModulus: 'Elastizitätsmodul
      electricalConductivity: 'Elektrische Leitfähigkeit',
    },
      title: 'Nachhaltigkeitsanalyse',
      lifecycleAssessment: 'Lebenszyk
      recyclability: 'Recyclingfäh
      environmentalImpact: 'Umweltauswirkung',
    },
      
      searchMatWeb: '
      apiKeyRequired: 'API-Schlüssel erf
      searchBy: 'Suchen nach',
      materialClass: 'Materialklasse
    settings: {
      description: 'MatTailor AI-Einstell
      selectLanguage: 'Sprache auswählen',
      about: 'Über',
      materialsProjectKey: 'Materials Proj
      version: 'Version',
      
  },
    tabs: {
      newMaterial: 'Nouveau matériau',
      mlEnhanced: 'ML améli
      sustainability: 'Durabilité',
      settings: 'Paramètres',
    common: {
      filter: 'Filtrer',
      save: 'Sauvegarder',
      edit: 'Modifier',
      loading: 'Chargemen
      success: 'Succès',
      info: 'Info',
      
    
      c
      perfo
      properties: 'Propriét
    header: {
      subtitle: 'Découverte intelligente de 
    overview: {
      description: 'Explorez vo
      selectMaterial: 'Sélectionnez
      score: 'Score',
    },
      
      materia
      addElement: 'A
      percentage: 'Pource
      createMaterial: '
      composition: '
    },
      title: 'Recommand
      queryPlaceholder
      examples: {
        marine: 'Su
        alloy: 'Simulez un
      requirements: {
        environmental: 'Co
        application
    },
      title: 'Préd
      provideFeedback: 'Fo
      optimizeComposition: 'Opti
    properties: {
      description: 'Analyse détaill
      thermal: 'Propriétés ther
      chemical: 'Propriétés chimique
      tensileStrength: 'Résista
      
      corrosi
    sustainability: {
      description: 'Impact environnemental et a
      
      supplyCha
      sustainabilityScore: 'Scor
    externalSearch: {
      description: 'Recherchez des matériaux dans les bases de données MatWeb et Materials Projec
      searchMaterialsProject: 'Rechercher Materials Project',
      configureKeys: 'Configurer les clés 
      chemicalFormula
    },
      
      language: 'L
      apiConfiguration: 'Configurat
      matwebKey: 'Clé API MatWeb',
      saveConfiguration: 'Sauvegard
      keyFeatures: 'Fonctionnalités c
    },
  am: {
      overview: 'አጠቃላይ እይታ',
      aiRecommendation: 'AI ምክር
      properties: 'ባህሪያት',
      externalSearch: 'ውጫዊ ፍለጋ',
    },
      search: 'ፈልግ',
      
      delete: 'ሰርዝ',
      create: 'ይፍጠሩ',
      error: 'ስህተት',
      warning: 'ማስጠንቀቂያ',
      name: 'ስም',
      type: 'ዓይነት
      temperature: 'ሙቀት',
      sustainability: 'ቀጣይነት',
      composition: 'ኮምፖዚሽን',
    },
      ti
    },
      title: 'የቁሳቁስ አጠቃላይ እይታ',
      noMaterials: 'ምንም ቁሳቁሶች አልተገኙም። ለመጀመር 
      recommendations: 'ምክሮች',
      viewDetails: 'ዝርዝሮችን ይመልከቱ',
    newM
      
      selectEleme
      removeElement: 'ንጥረ ነገር ያስወግዱ',
      normalize: 'መደበኛ ማድረግ',
      periodicTable: 'የተወሳሰበ ሠንጠረዥ',
      visualize: 'ኮምፖዚሽንን በማየት ያሳዩ',
    aiRecommendation: {
      
      askAI: 'AI 
        title: 'የምሳሌ ጥያቄዎች:',
        packaging: 'በቀዝቃዛ የአየር ሁኔታ ውስጥ ለቀላል ማሸግ ምርጡ ውህድ ምንድን ነው?',
      },
        mechanical: 'ሜካኒካል መስፈርቶች',
        budget: 'የበጀት ገደቦች',
      },
    mlEnhanced: {
      description: 'በማሽን ትምህርት የሚደገፍ የቁሳቁ
      predictProperties: 'ባህሪያትን ይተነ
    },
      title: 'የቁሳቁስ ባህሪያት',
      mechanical: 'ሜካኒካል ባህሪያት',
      
      simulate: 'ባህሪያ
      youngsModulus: 'የዮንግ ሞዱል',
      electricalConductivity: 'የኤሌክትሪክ አስተላላፊነት',
    },
      title: 'የቀጣይነት ትንተና',
      lifecycleAssessment: 'የህይወት ዑደት ግምገማ
      recyclability: 'እንደገና መጠቀም',
      environmentalImpact: 'የአካባቢ ተጽዕኖ',
    },
      
      searchMatWeb: '
      apiKeyRequired: 'API ቁልፍ ያስፈልጋል
      searchBy: 'በሚመጣው ይፈልጉ',
      materialClass: 'የቁሳቁስ ክፍል',
    settings: {
      description: 'MatTailor AI ቅንብሮችን እ
      selectLanguage: 'ቋንቋ ይምረጡ',
      about: 'ስለ',
      materialsProjectKey: 'Materials P
      version: 'ስሪት',
      
  },

export const languageOptions = [
  { value: 'sv', label: 
  { value: 'fr', label: 'Français',
];
// Hook for using 
  const [language, setLanguage] = use
  const t = translations[language] || translations.en;
  return {
    language,
    languageOptions,
}




































































































      electricalConductivity: 'Elektrische Leitfähigkeit',

    },

      title: 'Nachhaltigkeitsanalyse',





      environmentalImpact: 'Umweltauswirkung',

    },







      searchBy: 'Suchen nach',



    settings: {



      selectLanguage: 'Sprache auswählen',

      about: 'Über',



      version: 'Version',



  },

    tabs: {

      newMaterial: 'Nouveau matériau',



      sustainability: 'Durabilité',

      settings: 'Paramètres',

    common: {

      filter: 'Filtrer',

      save: 'Sauvegarder',

      edit: 'Modifier',



      success: 'Succès',

      info: 'Info',











    header: {



    overview: {





      score: 'Score',

    },













    },





      examples: {





      requirements: {





    },







    properties: {













    sustainability: {









    externalSearch: {



      searchMaterialsProject: 'Rechercher Materials Project',





    },







      matwebKey: 'Clé API MatWeb',





    },

  am: {

      overview: 'አጠቃላይ እይታ',



      properties: 'ባህሪያት',

      externalSearch: 'ውጫዊ ፍለጋ',

    },

      search: 'ፈልግ',



      delete: 'ሰርዝ',

      create: 'ይፍጠሩ',

      error: 'ስህተት',

      warning: 'ማስጠንቀቂያ',

      name: 'ስም',



      temperature: 'ሙቀት',

      sustainability: 'ቀጣይነት',

      composition: 'ኮምፖዚሽን',

    },



    },

      title: 'የቁሳቁስ አጠቃላይ እይታ',



      recommendations: 'ምክሮች',

      viewDetails: 'ዝርዝሮችን ይመልከቱ',







      removeElement: 'ንጥረ ነገር ያስወግዱ',

      normalize: 'መደበኛ ማድረግ',

      periodicTable: 'የተወሳሰበ ሠንጠረዥ',

      visualize: 'ኮምፖዚሽንን በማየት ያሳዩ',

    aiRecommendation: {





        title: 'የምሳሌ ጥያቄዎች:',

        packaging: 'በቀዝቃዛ የአየር ሁኔታ ውስጥ ለቀላል ማሸግ ምርጡ ውህድ ምንድን ነው?',

      },

        mechanical: 'ሜካኒካል መስፈርቶች',

        budget: 'የበጀት ገደቦች',

      },

    mlEnhanced: {





    },

      title: 'የቁሳቁስ ባህሪያት',

      mechanical: 'ሜካኒካል ባህሪያት',





      youngsModulus: 'የዮንግ ሞዱል',

      electricalConductivity: 'የኤሌክትሪክ አስተላላፊነት',

    },

      title: 'የቀጣይነት ትንተና',



      recyclability: 'እንደገና መጠቀም',

      environmentalImpact: 'የአካባቢ ተጽዕኖ',

    },







      searchBy: 'በሚመጣው ይፈልጉ',

      materialClass: 'የቁሳቁስ ክፍል',

    settings: {



      selectLanguage: 'ቋንቋ ይምረጡ',

      about: 'ስለ',



      version: 'ስሪት',



  },



export const languageOptions = [





];





  const t = translations[language] || translations.en;

  return {

    language,

    languageOptions,

}