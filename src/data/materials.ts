// Comprehensive Materials Database for MatTailor AI
// Real-world materials with accurate properties

export interface Material {
  id: string;
  name: string;
  category: 'metal' | 'polymer' | 'ceramic' | 'composite' | 'semiconductor' | 'building' | 'insulation' | 'wood' | 'concrete';
  subcategory: string;
  
  // Mechanical Properties
  mechanical: {
    tensileStrength: number; // MPa
    yieldStrength: number; // MPa
    elasticModulus: number; // GPa
    hardness: number; // HV (Vickers)
    density: number; // kg/m³
    poissonRatio: number;
    fatigueLimit?: number; // MPa
    fractureToughness?: number; // MPa√m
  };
  
  // Thermal Properties
  thermal: {
    meltingPoint: number; // °C
    thermalConductivity: number; // W/m·K
    thermalExpansion: number; // 10⁻⁶/K
    specificHeat: number; // J/kg·K
    maxServiceTemp: number; // °C
  };
  
  // Electrical Properties
  electrical: {
    resistivity: number; // Ω·m
    conductivity?: number; // S/m
    dielectricStrength?: number; // kV/mm
    dielectricConstant?: number;
  };
  
  // Chemical Properties
  chemical: {
    corrosionResistance: 'poor' | 'fair' | 'good' | 'excellent';
    oxidationResistance: 'poor' | 'fair' | 'good' | 'excellent';
    chemicalCompatibility: string[];
    phLevel?: { min: number; max: number };
  };
  
  // Manufacturing & Cost
  manufacturing: {
    machinability: 'poor' | 'fair' | 'good' | 'excellent';
    weldability: 'poor' | 'fair' | 'good' | 'excellent';
    formability: 'poor' | 'fair' | 'good' | 'excellent';
    costPerKg: number; // USD/kg
    availability: 'rare' | 'limited' | 'common' | 'abundant';
  };
  
  // Sustainability
  sustainability: {
    recyclability: 'poor' | 'fair' | 'good' | 'excellent';
    carbonFootprint: number; // kg CO2/kg
    sustainabilityScore: number; // 1-10
    eolOptions: string[]; // End of life options
  };
  
  // Applications
  applications: string[];
  advantages: string[];
  limitations: string[];
  
  // Supplier Information
  suppliers: {
    name: string;
    region: string;
    minOrderQty: number; // kg
    leadTime: number; // days
  }[];
}

export const MATERIALS_DATABASE: Material[] = [
  {
    id: 'steel-304',
    name: '304 Stainless Steel',
    category: 'metal',
    subcategory: 'stainless steel',
    mechanical: {
      tensileStrength: 621,
      yieldStrength: 290,
      elasticModulus: 200,
      hardness: 201,
      density: 8000,
      poissonRatio: 0.29,
      fatigueLimit: 241,
      fractureToughness: 200
    },
    thermal: {
      meltingPoint: 1400,
      thermalConductivity: 16.2,
      thermalExpansion: 17.3,
      specificHeat: 500,
      maxServiceTemp: 870
    },
    electrical: {
      resistivity: 7.2e-7,
      conductivity: 1.39e6
    },
    chemical: {
      corrosionResistance: 'excellent',
      oxidationResistance: 'excellent',
      chemicalCompatibility: ['water', 'food acids', 'mild chemicals'],
      phLevel: { min: 4, max: 12 }
    },
    manufacturing: {
      machinability: 'fair',
      weldability: 'excellent',
      formability: 'excellent',
      costPerKg: 4.50,
      availability: 'abundant'
    },
    sustainability: {
      recyclability: 'excellent',
      carbonFootprint: 4.2,
      sustainabilityScore: 8,
      eolOptions: ['recycling', 'remelting', 'reuse']
    },
    applications: ['food processing', 'medical devices', 'marine equipment', 'kitchen appliances'],
    advantages: ['excellent corrosion resistance', 'food-safe', 'widely available', 'highly recyclable'],
    limitations: ['susceptible to chloride corrosion', 'work hardening', 'moderate strength'],
    suppliers: [
      { name: 'ArcelorMittal', region: 'Europe', minOrderQty: 1000, leadTime: 14 },
      { name: 'Nippon Steel', region: 'Asia', minOrderQty: 500, leadTime: 21 },
      { name: 'Nucor', region: 'North America', minOrderQty: 750, leadTime: 10 }
    ]
  },
  
  {
    id: 'aluminum-6061',
    name: 'Aluminum 6061-T6',
    category: 'metal',
    subcategory: 'aluminum alloy',
    mechanical: {
      tensileStrength: 310,
      yieldStrength: 276,
      elasticModulus: 68.9,
      hardness: 95,
      density: 2700,
      poissonRatio: 0.33,
      fatigueLimit: 96,
      fractureToughness: 29
    },
    thermal: {
      meltingPoint: 582,
      thermalConductivity: 167,
      thermalExpansion: 23.6,
      specificHeat: 896,
      maxServiceTemp: 200
    },
    electrical: {
      resistivity: 4.0e-8,
      conductivity: 2.5e7
    },
    chemical: {
      corrosionResistance: 'good',
      oxidationResistance: 'excellent',
      chemicalCompatibility: ['atmospheric conditions', 'fresh water'],
      phLevel: { min: 6, max: 9 }
    },
    manufacturing: {
      machinability: 'excellent',
      weldability: 'good',
      formability: 'good',
      costPerKg: 2.10,
      availability: 'abundant'
    },
    sustainability: {
      recyclability: 'excellent',
      carbonFootprint: 1.8,
      sustainabilityScore: 9,
      eolOptions: ['recycling', 'remelting', 'downcycling']
    },
    applications: ['aerospace structures', 'automotive parts', 'marine equipment', 'architectural'],
    advantages: ['lightweight', 'excellent strength-to-weight ratio', 'good corrosion resistance', 'easily machined'],
    limitations: ['limited high-temperature performance', 'galvanic corrosion with steel', 'anodic in seawater'],
    suppliers: [
      { name: 'Alcoa', region: 'North America', minOrderQty: 500, leadTime: 7 },
      { name: 'Norsk Hydro', region: 'Europe', minOrderQty: 1000, leadTime: 14 },
      { name: 'Hongqiao Group', region: 'Asia', minOrderQty: 2000, leadTime: 28 }
    ]
  },

  {
    id: 'titanium-gr2',
    name: 'Titanium Grade 2',
    category: 'metal',
    subcategory: 'titanium',
    mechanical: {
      tensileStrength: 345,
      yieldStrength: 275,
      elasticModulus: 103,
      hardness: 201,
      density: 4510,
      poissonRatio: 0.34,
      fatigueLimit: 130,
      fractureToughness: 75
    },
    thermal: {
      meltingPoint: 1668,
      thermalConductivity: 16.4,
      thermalExpansion: 8.6,
      specificHeat: 523,
      maxServiceTemp: 315
    },
    electrical: {
      resistivity: 4.2e-7,
      conductivity: 2.38e6
    },
    chemical: {
      corrosionResistance: 'excellent',
      oxidationResistance: 'excellent',
      chemicalCompatibility: ['seawater', 'chlorine', 'body fluids'],
      phLevel: { min: 1, max: 14 }
    },
    manufacturing: {
      machinability: 'fair',
      weldability: 'excellent',
      formability: 'good',
      costPerKg: 35.00,
      availability: 'limited'
    },
    sustainability: {
      recyclability: 'excellent',
      carbonFootprint: 12.5,
      sustainabilityScore: 6,
      eolOptions: ['recycling', 'remelting', 'specialized recovery']
    },
    applications: ['aerospace', 'medical implants', 'marine', 'chemical processing'],
    advantages: ['excellent corrosion resistance', 'biocompatible', 'high strength-to-weight ratio', 'non-magnetic'],
    limitations: ['expensive', 'difficult to machine', 'limited availability', 'galling tendency'],
    suppliers: [
      { name: 'TIMET', region: 'North America', minOrderQty: 50, leadTime: 90 },
      { name: 'VSMPO-AVISMA', region: 'Europe', minOrderQty: 100, leadTime: 120 },
      { name: 'Kobe Steel', region: 'Asia', minOrderQty: 25, leadTime: 150 }
    ]
  },

  {
    id: 'carbon-fiber-t700',
    name: 'Carbon Fiber T700/Epoxy',
    category: 'composite',
    subcategory: 'carbon fiber reinforced polymer',
    mechanical: {
      tensileStrength: 2550,
      yieldStrength: 2550,
      elasticModulus: 230,
      hardness: 0, // Not applicable for composites
      density: 1600,
      poissonRatio: 0.27,
      fatigueLimit: 1275,
      fractureToughness: 45
    },
    thermal: {
      meltingPoint: 0, // Degrades rather than melts
      thermalConductivity: 8.0,
      thermalExpansion: -0.5,
      specificHeat: 712,
      maxServiceTemp: 150
    },
    electrical: {
      resistivity: 1.6e-5,
      conductivity: 6.25e4
    },
    chemical: {
      corrosionResistance: 'excellent',
      oxidationResistance: 'good',
      chemicalCompatibility: ['most solvents', 'non-polar chemicals'],
      phLevel: { min: 3, max: 11 }
    },
    manufacturing: {
      machinability: 'fair',
      weldability: 'poor',
      formability: 'good',
      costPerKg: 45.00,
      availability: 'common'
    },
    sustainability: {
      recyclability: 'poor',
      carbonFootprint: 24.0,
      sustainabilityScore: 4,
      eolOptions: ['energy recovery', 'fiber recovery', 'landfill']
    },
    applications: ['aerospace structures', 'automotive body panels', 'sporting goods', 'wind turbine blades'],
    advantages: ['very high strength-to-weight ratio', 'excellent fatigue resistance', 'dimensional stability', 'vibration damping'],
    limitations: ['expensive', 'brittle failure', 'difficult to repair', 'poor recyclability'],
    suppliers: [
      { name: 'Toray Industries', region: 'Asia', minOrderQty: 100, leadTime: 60 },
      { name: 'Hexcel', region: 'North America', minOrderQty: 50, leadTime: 45 },
      { name: 'SGL Carbon', region: 'Europe', minOrderQty: 75, leadTime: 90 }
    ]
  },

  {
    id: 'peek',
    name: 'PEEK (Polyetheretherketone)',
    category: 'polymer',
    subcategory: 'high-performance thermoplastic',
    mechanical: {
      tensileStrength: 100,
      yieldStrength: 90,
      elasticModulus: 3.6,
      hardness: 25, // Shore D
      density: 1320,
      poissonRatio: 0.4,
      fatigueLimit: 50,
      fractureToughness: 4.2
    },
    thermal: {
      meltingPoint: 343,
      thermalConductivity: 0.25,
      thermalExpansion: 47,
      specificHeat: 1340,
      maxServiceTemp: 260
    },
    electrical: {
      resistivity: 1e14,
      dielectricStrength: 23,
      dielectricConstant: 3.2
    },
    chemical: {
      corrosionResistance: 'excellent',
      oxidationResistance: 'excellent',
      chemicalCompatibility: ['acids', 'bases', 'organic solvents'],
      phLevel: { min: 0, max: 14 }
    },
    manufacturing: {
      machinability: 'excellent',
      weldability: 'good',
      formability: 'excellent',
      costPerKg: 85.00,
      availability: 'common'
    },
    sustainability: {
      recyclability: 'good',
      carbonFootprint: 8.5,
      sustainabilityScore: 7,
      eolOptions: ['mechanical recycling', 'chemical recycling', 'energy recovery']
    },
    applications: ['medical implants', 'semiconductor equipment', 'aerospace bearings', 'oil & gas seals'],
    advantages: ['excellent chemical resistance', 'high temperature performance', 'biocompatible', 'good wear resistance'],
    limitations: ['expensive', 'limited UV resistance', 'processing complexity', 'notch sensitive'],
    suppliers: [
      { name: 'Victrex', region: 'Europe', minOrderQty: 25, leadTime: 30 },
      { name: 'Solvay', region: 'Europe', minOrderQty: 50, leadTime: 45 },
      { name: 'Evonik', region: 'North America', minOrderQty: 25, leadTime: 35 }
    ]
  },

  {
    id: 'silicon-carbide',
    name: 'Silicon Carbide (SiC)',
    category: 'ceramic',
    subcategory: 'advanced ceramic',
    mechanical: {
      tensileStrength: 550,
      yieldStrength: 0, // Ceramics don't yield
      elasticModulus: 410,
      hardness: 2800,
      density: 3210,
      poissonRatio: 0.14,
      fractureToughness: 4.6
    },
    thermal: {
      meltingPoint: 2730,
      thermalConductivity: 120,
      thermalExpansion: 4.0,
      specificHeat: 675,
      maxServiceTemp: 1650
    },
    electrical: {
      resistivity: 1e3,
      conductivity: 1e-3,
      dielectricStrength: 15,
      dielectricConstant: 9.7
    },
    chemical: {
      corrosionResistance: 'excellent',
      oxidationResistance: 'excellent',
      chemicalCompatibility: ['acids', 'bases', 'molten metals'],
      phLevel: { min: 0, max: 14 }
    },
    manufacturing: {
      machinability: 'poor',
      weldability: 'poor',
      formability: 'poor',
      costPerKg: 25.00,
      availability: 'limited'
    },
    sustainability: {
      recyclability: 'fair',
      carbonFootprint: 15.0,
      sustainabilityScore: 6,
      eolOptions: ['crushing and reuse', 'abrasive applications', 'landfill']
    },
    applications: ['high-temperature bearings', 'semiconductor equipment', 'armor applications', 'cutting tools'],
    advantages: ['extremely high hardness', 'excellent thermal conductivity', 'chemical inertness', 'high temperature stability'],
    limitations: ['brittle', 'difficult to machine', 'expensive processing', 'thermal shock sensitivity'],
    suppliers: [
      { name: 'Saint-Gobain', region: 'Europe', minOrderQty: 10, leadTime: 60 },
      { name: 'Morgan Advanced Materials', region: 'North America', minOrderQty: 5, leadTime: 90 },
      { name: 'Kyocera', region: 'Asia', minOrderQty: 20, leadTime: 75 }
    ]
  },

  {
    id: 'copper-c101',
    name: 'Oxygen-Free Copper (C101)',
    category: 'metal',
    subcategory: 'pure metal',
    mechanical: {
      tensileStrength: 220,
      yieldStrength: 69,
      elasticModulus: 117,
      hardness: 45,
      density: 8960,
      poissonRatio: 0.34,
      fatigueLimit: 90,
      fractureToughness: 120
    },
    thermal: {
      meltingPoint: 1085,
      thermalConductivity: 401,
      thermalExpansion: 16.5,
      specificHeat: 385,
      maxServiceTemp: 200
    },
    electrical: {
      resistivity: 1.68e-8,
      conductivity: 5.96e7
    },
    chemical: {
      corrosionResistance: 'fair',
      oxidationResistance: 'poor',
      chemicalCompatibility: ['water', 'neutral solutions'],
      phLevel: { min: 6, max: 8 }
    },
    manufacturing: {
      machinability: 'good',
      weldability: 'good',
      formability: 'excellent',
      costPerKg: 9.50,
      availability: 'abundant'
    },
    sustainability: {
      recyclability: 'excellent',
      carbonFootprint: 2.8,
      sustainabilityScore: 8,
      eolOptions: ['recycling', 'remelting', 'direct reuse']
    },
    applications: ['electrical conductors', 'heat exchangers', 'plumbing', 'electronic components'],
    advantages: ['excellent electrical conductivity', 'excellent thermal conductivity', 'good ductility', 'easily recycled'],
    limitations: ['susceptible to corrosion', 'relatively soft', 'expensive', 'antimicrobial properties may be unwanted'],
    suppliers: [
      { name: 'Aurubis', region: 'Europe', minOrderQty: 1000, leadTime: 14 },
      { name: 'Freeport-McMoRan', region: 'North America', minOrderQty: 500, leadTime: 10 },
      { name: 'Jiangxi Copper', region: 'Asia', minOrderQty: 2000, leadTime: 21 }
    ]
  },

  {
    id: 'inconel-718',
    name: 'Inconel 718',
    category: 'metal',
    subcategory: 'superalloy',
    mechanical: {
      tensileStrength: 1275,
      yieldStrength: 1034,
      elasticModulus: 200,
      hardness: 331,
      density: 8190,
      poissonRatio: 0.29,
      fatigueLimit: 586,
      fractureToughness: 110
    },
    thermal: {
      meltingPoint: 1336,
      thermalConductivity: 11.2,
      thermalExpansion: 13.0,
      specificHeat: 435,
      maxServiceTemp: 700
    },
    electrical: {
      resistivity: 1.25e-6,
      conductivity: 8.0e5
    },
    chemical: {
      corrosionResistance: 'excellent',
      oxidationResistance: 'excellent',
      chemicalCompatibility: ['high-temperature gases', 'marine environments'],
      phLevel: { min: 3, max: 12 }
    },
    manufacturing: {
      machinability: 'poor',
      weldability: 'good',
      formability: 'fair',
      costPerKg: 75.00,
      availability: 'limited'
    },
    sustainability: {
      recyclability: 'excellent',
      carbonFootprint: 18.5,
      sustainabilityScore: 5,
      eolOptions: ['recycling', 'remelting', 'specialized recovery']
    },
    applications: ['gas turbine engines', 'rocket motors', 'nuclear reactors', 'high-temperature springs'],
    advantages: ['excellent high-temperature strength', 'oxidation resistance', 'creep resistance', 'good weldability'],
    limitations: ['very expensive', 'difficult to machine', 'work hardening', 'limited availability'],
    suppliers: [
      { name: 'Special Metals Corporation', region: 'North America', minOrderQty: 25, leadTime: 120 },
      { name: 'VDM Metals', region: 'Europe', minOrderQty: 50, leadTime: 150 },
      { name: 'Haynes International', region: 'North America', minOrderQty: 25, leadTime: 180 }
    ]
  },

  // === HOUSE UTILITY MATERIALS ===
  
  // Plumbing Materials
  {
    id: 'pvc-pipe',
    name: 'PVC Pipe (Schedule 40)',
    category: 'polymer',
    subcategory: 'plumbing pipe',
    mechanical: {
      tensileStrength: 52,
      yieldStrength: 45,
      elasticModulus: 2.9,
      hardness: 15, // Shore D
      density: 1400,
      poissonRatio: 0.38,
      fatigueLimit: 20,
      fractureToughness: 3.0
    },
    thermal: {
      meltingPoint: 200,
      thermalConductivity: 0.19,
      thermalExpansion: 70,
      specificHeat: 900,
      maxServiceTemp: 60
    },
    electrical: {
      resistivity: 1e14,
      dielectricStrength: 40,
      dielectricConstant: 3.4
    },
    chemical: {
      corrosionResistance: 'excellent',
      oxidationResistance: 'good',
      chemicalCompatibility: ['water', 'sewage', 'most chemicals'],
      phLevel: { min: 1, max: 14 }
    },
    manufacturing: {
      machinability: 'excellent',
      weldability: 'good',
      formability: 'excellent',
      costPerKg: 1.50,
      availability: 'abundant'
    },
    sustainability: {
      recyclability: 'good',
      carbonFootprint: 2.4,
      sustainabilityScore: 7,
      eolOptions: ['mechanical recycling', 'energy recovery', 'chemical recycling']
    },
    applications: ['water supply lines', 'drainage systems', 'electrical conduit', 'irrigation'],
    advantages: ['low cost', 'easy installation', 'chemical resistance', 'lightweight'],
    limitations: ['UV degradation', 'temperature sensitivity', 'can become brittle', 'not suitable for hot water'],
    suppliers: [
      { name: 'Charlotte Pipe', region: 'North America', minOrderQty: 100, leadTime: 7 },
      { name: 'Georg Fischer', region: 'Europe', minOrderQty: 200, leadTime: 14 },
      { name: 'Sekisui Chemical', region: 'Asia', minOrderQty: 500, leadTime: 21 }
    ]
  },

  {
    id: 'copper-pipe-k',
    name: 'Copper Pipe Type K',
    category: 'metal',
    subcategory: 'plumbing pipe',
    mechanical: {
      tensileStrength: 220,
      yieldStrength: 69,
      elasticModulus: 117,
      hardness: 45,
      density: 8960,
      poissonRatio: 0.34,
      fatigueLimit: 90,
      fractureToughness: 120
    },
    thermal: {
      meltingPoint: 1085,
      thermalConductivity: 401,
      thermalExpansion: 16.5,
      specificHeat: 385,
      maxServiceTemp: 200
    },
    electrical: {
      resistivity: 1.68e-8,
      conductivity: 5.96e7
    },
    chemical: {
      corrosionResistance: 'good',
      oxidationResistance: 'fair',
      chemicalCompatibility: ['potable water', 'heating systems'],
      phLevel: { min: 6.5, max: 8.5 }
    },
    manufacturing: {
      machinability: 'good',
      weldability: 'excellent',
      formability: 'excellent',
      costPerKg: 9.50,
      availability: 'abundant'
    },
    sustainability: {
      recyclability: 'excellent',
      carbonFootprint: 2.8,
      sustainabilityScore: 8,
      eolOptions: ['recycling', 'remelting', 'direct reuse']
    },
    applications: ['hot water lines', 'heating systems', 'gas lines', 'refrigeration'],
    advantages: ['antimicrobial properties', 'long lifespan', 'heat resistance', 'fully recyclable'],
    limitations: ['expensive', 'corrosion in acidic water', 'theft target', 'requires skilled installation'],
    suppliers: [
      { name: 'Mueller Industries', region: 'North America', minOrderQty: 500, leadTime: 10 },
      { name: 'KME', region: 'Europe', minOrderQty: 1000, leadTime: 14 },
      { name: 'Ningbo Jintian Copper', region: 'Asia', minOrderQty: 2000, leadTime: 21 }
    ]
  },

  {
    id: 'pex-pipe',
    name: 'PEX Pipe (Cross-linked Polyethylene)',
    category: 'polymer',
    subcategory: 'plumbing pipe',
    mechanical: {
      tensileStrength: 28,
      yieldStrength: 20,
      elasticModulus: 0.8,
      hardness: 65, // Shore D
      density: 940,
      poissonRatio: 0.4,
      fatigueLimit: 12,
      fractureToughness: 8.0
    },
    thermal: {
      meltingPoint: 135,
      thermalConductivity: 0.4,
      thermalExpansion: 150,
      specificHeat: 2300,
      maxServiceTemp: 95
    },
    electrical: {
      resistivity: 1e16,
      dielectricStrength: 50,
      dielectricConstant: 2.3
    },
    chemical: {
      corrosionResistance: 'excellent',
      oxidationResistance: 'good',
      chemicalCompatibility: ['potable water', 'heating systems', 'chemicals'],
      phLevel: { min: 1, max: 14 }
    },
    manufacturing: {
      machinability: 'excellent',
      weldability: 'poor',
      formability: 'excellent',
      costPerKg: 2.80,
      availability: 'abundant'
    },
    sustainability: {
      recyclability: 'fair',
      carbonFootprint: 1.9,
      sustainabilityScore: 7,
      eolOptions: ['energy recovery', 'mechanical recycling', 'chemical recycling']
    },
    applications: ['radiant heating', 'hot water supply', 'cold water supply', 'snow melting systems'],
    advantages: ['flexible installation', 'freeze resistant', 'corrosion resistant', 'quiet operation'],
    limitations: ['UV sensitive', 'rodent damage', 'fittings can fail', 'permeability to gases'],
    suppliers: [
      { name: 'Uponor', region: 'Europe', minOrderQty: 200, leadTime: 14 },
      { name: 'Rehau', region: 'North America', minOrderQty: 100, leadTime: 7 },
      { name: 'Pipelife', region: 'Europe', minOrderQty: 300, leadTime: 10 }
    ]
  },

  // Electrical Materials
  {
    id: 'romex-wire',
    name: 'Romex NM-B Cable 12 AWG',
    category: 'composite',
    subcategory: 'electrical cable',
    mechanical: {
      tensileStrength: 15,
      yieldStrength: 12,
      elasticModulus: 0.2,
      hardness: 8,
      density: 1200,
      poissonRatio: 0.45,
      fatigueLimit: 6,
      fractureToughness: 2.0
    },
    thermal: {
      meltingPoint: 105,
      thermalConductivity: 0.25,
      thermalExpansion: 200,
      specificHeat: 1400,
      maxServiceTemp: 90
    },
    electrical: {
      resistivity: 1.68e-8, // Copper core
      conductivity: 5.96e7
    },
    chemical: {
      corrosionResistance: 'good',
      oxidationResistance: 'good',
      chemicalCompatibility: ['dry locations', 'indoor use'],
      phLevel: { min: 6, max: 8 }
    },
    manufacturing: {
      machinability: 'good',
      weldability: 'poor',
      formability: 'excellent',
      costPerKg: 8.50,
      availability: 'abundant'
    },
    sustainability: {
      recyclability: 'excellent',
      carbonFootprint: 3.2,
      sustainabilityScore: 8,
      eolOptions: ['copper recovery', 'plastic recycling', 'wire stripping']
    },
    applications: ['residential wiring', 'branch circuits', 'outlets and switches', 'lighting circuits'],
    advantages: ['easy installation', 'code compliant', 'cost effective', 'widely available'],
    limitations: ['indoor use only', 'limited ampacity', 'not suitable for wet locations', 'single use'],
    suppliers: [
      { name: 'Southwire', region: 'North America', minOrderQty: 50, leadTime: 3 },
      { name: 'General Cable', region: 'North America', minOrderQty: 100, leadTime: 5 },
      { name: 'Encore Wire', region: 'North America', minOrderQty: 75, leadTime: 7 }
    ]
  },

  // Insulation Materials
  {
    id: 'fiberglass-batts',
    name: 'Fiberglass Insulation Batts R-13',
    category: 'insulation',
    subcategory: 'thermal insulation',
    mechanical: {
      tensileStrength: 0.05,
      yieldStrength: 0.03,
      elasticModulus: 0.001,
      hardness: 1,
      density: 12,
      poissonRatio: 0.2,
      fatigueLimit: 0.01,
      fractureToughness: 0.1
    },
    thermal: {
      meltingPoint: 1000,
      thermalConductivity: 0.044,
      thermalExpansion: 5,
      specificHeat: 835,
      maxServiceTemp: 230
    },
    electrical: {
      resistivity: 1e12,
      dielectricStrength: 5,
      dielectricConstant: 6.0
    },
    chemical: {
      corrosionResistance: 'excellent',
      oxidationResistance: 'excellent',
      chemicalCompatibility: ['dry environments', 'non-corrosive gases'],
      phLevel: { min: 7, max: 8 }
    },
    manufacturing: {
      machinability: 'good',
      weldability: 'poor',
      formability: 'excellent',
      costPerKg: 1.20,
      availability: 'abundant'
    },
    sustainability: {
      recyclability: 'fair',
      carbonFootprint: 1.8,
      sustainabilityScore: 6,
      eolOptions: ['landfill', 'road base aggregate', 'limited recycling']
    },
    applications: ['wall insulation', 'attic insulation', 'floor insulation', 'sound damping'],
    advantages: ['low cost', 'fire resistant', 'good thermal performance', 'easy installation'],
    limitations: ['skin irritant', 'moisture sensitive', 'settles over time', 'health concerns'],
    suppliers: [
      { name: 'Owens Corning', region: 'North America', minOrderQty: 20, leadTime: 7 },
      { name: 'Johns Manville', region: 'North America', minOrderQty: 30, leadTime: 10 },
      { name: 'Knauf', region: 'Europe', minOrderQty: 50, leadTime: 14 }
    ]
  },

  {
    id: 'spray-foam',
    name: 'Closed-Cell Spray Foam Insulation',
    category: 'polymer',
    subcategory: 'thermal insulation',
    mechanical: {
      tensileStrength: 0.35,
      yieldStrength: 0.25,
      elasticModulus: 0.015,
      hardness: 25,
      density: 32,
      poissonRatio: 0.3,
      fatigueLimit: 0.15,
      fractureToughness: 0.8
    },
    thermal: {
      meltingPoint: 0, // Degrades
      thermalConductivity: 0.024,
      thermalExpansion: 35,
      specificHeat: 1400,
      maxServiceTemp: 120
    },
    electrical: {
      resistivity: 1e13,
      dielectricStrength: 15,
      dielectricConstant: 1.8
    },
    chemical: {
      corrosionResistance: 'good',
      oxidationResistance: 'good',
      chemicalCompatibility: ['dry environments', 'building materials'],
      phLevel: { min: 7, max: 9 }
    },
    manufacturing: {
      machinability: 'fair',
      weldability: 'poor',
      formability: 'excellent',
      costPerKg: 4.50,
      availability: 'common'
    },
    sustainability: {
      recyclability: 'poor',
      carbonFootprint: 3.8,
      sustainabilityScore: 4,
      eolOptions: ['energy recovery', 'landfill', 'chemical breakdown']
    },
    applications: ['continuous insulation', 'air sealing', 'moisture barrier', 'structural strength'],
    advantages: ['excellent R-value', 'air sealing', 'moisture barrier', 'structural enhancement'],
    limitations: ['expensive', 'professional installation', 'off-gassing concerns', 'permanent'],
    suppliers: [
      { name: 'BASF', region: 'North America', minOrderQty: 10, leadTime: 14 },
      { name: 'Dow Chemical', region: 'North America', minOrderQty: 15, leadTime: 10 },
      { name: 'Huntsman', region: 'Europe', minOrderQty: 20, leadTime: 21 }
    ]
  },

  // Roofing Materials
  {
    id: 'asphalt-shingles',
    name: 'Architectural Asphalt Shingles',
    category: 'composite',
    subcategory: 'roofing material',
    mechanical: {
      tensileStrength: 12,
      yieldStrength: 8,
      elasticModulus: 0.5,
      hardness: 20,
      density: 1200,
      poissonRatio: 0.35,
      fatigueLimit: 4,
      fractureToughness: 1.5
    },
    thermal: {
      meltingPoint: 0, // Softens
      thermalConductivity: 0.7,
      thermalExpansion: 150,
      specificHeat: 1000,
      maxServiceTemp: 80
    },
    electrical: {
      resistivity: 1e10,
      dielectricStrength: 3,
      dielectricConstant: 4.0
    },
    chemical: {
      corrosionResistance: 'good',
      oxidationResistance: 'fair',
      chemicalCompatibility: ['weather exposure', 'UV radiation'],
      phLevel: { min: 6, max: 8 }
    },
    manufacturing: {
      machinability: 'good',
      weldability: 'poor',
      formability: 'good',
      costPerKg: 1.80,
      availability: 'abundant'
    },
    sustainability: {
      recyclability: 'fair',
      carbonFootprint: 2.1,
      sustainabilityScore: 5,
      eolOptions: ['road paving', 'roofing aggregate', 'energy recovery']
    },
    applications: ['residential roofing', 'commercial roofing', 'shed roofing', 'weather protection'],
    advantages: ['low cost', 'easy installation', 'wide variety', 'good weather resistance'],
    limitations: ['limited lifespan', 'weather dependent', 'granule loss', 'heat absorption'],
    suppliers: [
      { name: 'GAF', region: 'North America', minOrderQty: 100, leadTime: 7 },
      { name: 'Owens Corning', region: 'North America', minOrderQty: 150, leadTime: 10 },
      { name: 'CertainTeed', region: 'North America', minOrderQty: 200, leadTime: 14 }
    ]
  },

  {
    id: 'metal-roofing',
    name: 'Standing Seam Steel Roofing',
    category: 'metal',
    subcategory: 'roofing material',
    mechanical: {
      tensileStrength: 380,
      yieldStrength: 250,
      elasticModulus: 200,
      hardness: 150,
      density: 7850,
      poissonRatio: 0.3,
      fatigueLimit: 190,
      fractureToughness: 100
    },
    thermal: {
      meltingPoint: 1510,
      thermalConductivity: 50,
      thermalExpansion: 12,
      specificHeat: 490,
      maxServiceTemp: 300
    },
    electrical: {
      resistivity: 1.7e-7,
      conductivity: 5.9e6
    },
    chemical: {
      corrosionResistance: 'good',
      oxidationResistance: 'good',
      chemicalCompatibility: ['weather exposure', 'galvanic coatings'],
      phLevel: { min: 5, max: 9 }
    },
    manufacturing: {
      machinability: 'good',
      weldability: 'excellent',
      formability: 'excellent',
      costPerKg: 3.20,
      availability: 'abundant'
    },
    sustainability: {
      recyclability: 'excellent',
      carbonFootprint: 2.5,
      sustainabilityScore: 9,
      eolOptions: ['steel recycling', 'remelting', 'scrap metal']
    },
    applications: ['residential roofing', 'commercial roofing', 'agricultural buildings', 'industrial facilities'],
    advantages: ['long lifespan', 'energy efficient', 'fully recyclable', 'low maintenance'],
    limitations: ['higher initial cost', 'noise during rain', 'expansion/contraction', 'skilled installation'],
    suppliers: [
      { name: 'McElroy Metal', region: 'North America', minOrderQty: 500, leadTime: 14 },
      { name: 'ATAS International', region: 'North America', minOrderQty: 300, leadTime: 21 },
      { name: 'Berridge Manufacturing', region: 'North America', minOrderQty: 400, leadTime: 28 }
    ]
  },

  // Flooring Materials
  {
    id: 'lvp-flooring',
    name: 'Luxury Vinyl Plank (LVP)',
    category: 'polymer',
    subcategory: 'flooring material',
    mechanical: {
      tensileStrength: 25,
      yieldStrength: 18,
      elasticModulus: 1.2,
      hardness: 80, // Shore D
      density: 1400,
      poissonRatio: 0.4,
      fatigueLimit: 10,
      fractureToughness: 3.5
    },
    thermal: {
      meltingPoint: 180,
      thermalConductivity: 0.17,
      thermalExpansion: 80,
      specificHeat: 1000,
      maxServiceTemp: 60
    },
    electrical: {
      resistivity: 1e12,
      dielectricStrength: 25,
      dielectricConstant: 3.0
    },
    chemical: {
      corrosionResistance: 'excellent',
      oxidationResistance: 'good',
      chemicalCompatibility: ['household cleaners', 'water', 'mild chemicals'],
      phLevel: { min: 3, max: 11 }
    },
    manufacturing: {
      machinability: 'excellent',
      weldability: 'poor',
      formability: 'excellent',
      costPerKg: 3.50,
      availability: 'abundant'
    },
    sustainability: {
      recyclability: 'fair',
      carbonFootprint: 2.8,
      sustainabilityScore: 6,
      eolOptions: ['mechanical recycling', 'energy recovery', 'chemical recycling']
    },
    applications: ['residential flooring', 'commercial flooring', 'bathroom floors', 'kitchen floors'],
    advantages: ['waterproof', 'easy installation', 'durable', 'realistic wood appearance'],
    limitations: ['can dent', 'UV sensitive', 'temperature sensitive', 'synthetic appearance'],
    suppliers: [
      { name: 'Mohawk Industries', region: 'North America', minOrderQty: 50, leadTime: 14 },
      { name: 'Shaw Floors', region: 'North America', minOrderQty: 75, leadTime: 10 },
      { name: 'Tarkett', region: 'Europe', minOrderQty: 100, leadTime: 21 }
    ]
  },

  // Structural Materials
  {
    id: 'concrete-mix',
    name: 'Ready-Mix Concrete 4000 PSI',
    category: 'concrete',
    subcategory: 'structural concrete',
    mechanical: {
      tensileStrength: 4.8,
      yieldStrength: 0, // Brittle material
      elasticModulus: 30,
      hardness: 25,
      density: 2400,
      poissonRatio: 0.2,
      fractureToughness: 1.2
    },
    thermal: {
      meltingPoint: 1200,
      thermalConductivity: 1.7,
      thermalExpansion: 12,
      specificHeat: 880,
      maxServiceTemp: 300
    },
    electrical: {
      resistivity: 1e6,
      conductivity: 1e-6,
      dielectricStrength: 2,
      dielectricConstant: 6.0
    },
    chemical: {
      corrosionResistance: 'good',
      oxidationResistance: 'excellent',
      chemicalCompatibility: ['neutral environments', 'mild acids'],
      phLevel: { min: 12, max: 13 }
    },
    manufacturing: {
      machinability: 'poor',
      weldability: 'poor',
      formability: 'excellent',
      costPerKg: 0.12,
      availability: 'abundant'
    },
    sustainability: {
      recyclability: 'good',
      carbonFootprint: 0.9,
      sustainabilityScore: 7,
      eolOptions: ['aggregate recycling', 'road base', 'fill material']
    },
    applications: ['foundations', 'driveways', 'sidewalks', 'structural elements'],
    advantages: ['high compressive strength', 'fire resistant', 'durable', 'moldable'],
    limitations: ['heavy', 'brittle', 'cracks', 'long cure time'],
    suppliers: [
      { name: 'CEMEX', region: 'North America', minOrderQty: 10000, leadTime: 1 },
      { name: 'LafargeHolcim', region: 'Global', minOrderQty: 15000, leadTime: 1 },
      { name: 'HeidelbergCement', region: 'Europe', minOrderQty: 12000, leadTime: 2 }
    ]
  },

  {
    id: 'lumber-2x4',
    name: 'Douglas Fir 2x4 Lumber',
    category: 'wood',
    subcategory: 'dimensional lumber',
    mechanical: {
      tensileStrength: 50,
      yieldStrength: 35,
      elasticModulus: 13,
      hardness: 4, // Janka
      density: 530,
      poissonRatio: 0.37,
      fatigueLimit: 20,
      fractureToughness: 8.0
    },
    thermal: {
      meltingPoint: 0, // Burns/chars
      thermalConductivity: 0.12,
      thermalExpansion: 3.5,
      specificHeat: 1600,
      maxServiceTemp: 65
    },
    electrical: {
      resistivity: 1e12,
      dielectricStrength: 4,
      dielectricConstant: 2.5
    },
    chemical: {
      corrosionResistance: 'fair',
      oxidationResistance: 'poor',
      chemicalCompatibility: ['dry environments', 'treated preservatives'],
      phLevel: { min: 5, max: 7 }
    },
    manufacturing: {
      machinability: 'excellent',
      weldability: 'poor',
      formability: 'excellent',
      costPerKg: 0.85,
      availability: 'abundant'
    },
    sustainability: {
      recyclability: 'excellent',
      carbonFootprint: -1.8, // Carbon negative
      sustainabilityScore: 10,
      eolOptions: ['reuse', 'biomass fuel', 'paper production', 'composting']
    },
    applications: ['framing', 'studs', 'joists', 'general construction'],
    advantages: ['renewable resource', 'easy to work', 'carbon negative', 'good strength-to-weight'],
    limitations: ['moisture sensitive', 'fire hazard', 'insect susceptible', 'dimensional instability'],
    suppliers: [
      { name: 'Weyerhaeuser', region: 'North America', minOrderQty: 1000, leadTime: 7 },
      { name: 'Georgia-Pacific', region: 'North America', minOrderQty: 500, leadTime: 10 },
      { name: 'West Fraser', region: 'North America', minOrderQty: 750, leadTime: 14 }
    ]
  },

  // HVAC Materials
  {
    id: 'galvanized-ductwork',
    name: 'Galvanized Steel Ductwork',
    category: 'metal',
    subcategory: 'HVAC ductwork',
    mechanical: {
      tensileStrength: 400,
      yieldStrength: 280,
      elasticModulus: 200,
      hardness: 120,
      density: 7850,
      poissonRatio: 0.3,
      fatigueLimit: 200,
      fractureToughness: 80
    },
    thermal: {
      meltingPoint: 1510,
      thermalConductivity: 50,
      thermalExpansion: 12,
      specificHeat: 490,
      maxServiceTemp: 200
    },
    electrical: {
      resistivity: 1.7e-7,
      conductivity: 5.9e6
    },
    chemical: {
      corrosionResistance: 'good',
      oxidationResistance: 'excellent',
      chemicalCompatibility: ['air', 'low humidity environments'],
      phLevel: { min: 6, max: 8 }
    },
    manufacturing: {
      machinability: 'good',
      weldability: 'excellent',
      formability: 'excellent',
      costPerKg: 2.80,
      availability: 'abundant'
    },
    sustainability: {
      recyclability: 'excellent',
      carbonFootprint: 2.1,
      sustainabilityScore: 8,
      eolOptions: ['steel recycling', 'scrap metal', 'reuse']
    },
    applications: ['HVAC ducts', 'ventilation systems', 'return air ducts', 'exhaust systems'],
    advantages: ['corrosion resistant', 'strong', 'cost effective', 'recyclable'],
    limitations: ['thermal bridging', 'condensation issues', 'noise transmission', 'weight'],
    suppliers: [
      { name: 'Sheet Metal Connectors', region: 'North America', minOrderQty: 200, leadTime: 10 },
      { name: 'Lindab', region: 'Europe', minOrderQty: 500, leadTime: 14 },
      { name: 'Imperial Manufacturing', region: 'North America', minOrderQty: 300, leadTime: 7 }
    ]
  }
];

// Material search and filtering utilities
export const searchMaterials = (query: string, filters?: any): Material[] => {
  let results = MATERIALS_DATABASE;
  
  if (query) {
    const searchTerm = query.toLowerCase();
    results = results.filter(material => 
      material.name.toLowerCase().includes(searchTerm) ||
      material.category.toLowerCase().includes(searchTerm) ||
      material.subcategory.toLowerCase().includes(searchTerm) ||
      material.applications.some(app => app.toLowerCase().includes(searchTerm))
    );
  }
  
  if (filters) {
    if (filters.category) {
      results = results.filter(m => m.category === filters.category);
    }
    if (filters.maxCost) {
      results = results.filter(m => m.manufacturing.costPerKg <= filters.maxCost);
    }
    if (filters.minTensileStrength) {
      results = results.filter(m => m.mechanical.tensileStrength >= filters.minTensileStrength);
    }
    if (filters.maxServiceTemp) {
      results = results.filter(m => m.thermal.maxServiceTemp >= filters.maxServiceTemp);
    }
    if (filters.corrosionResistance) {
      const resistanceLevels = { 'poor': 0, 'fair': 1, 'good': 2, 'excellent': 3 };
      const requiredLevel = resistanceLevels[filters.corrosionResistance];
      results = results.filter(m => resistanceLevels[m.chemical.corrosionResistance] >= requiredLevel);
    }
  }
  
  return results;
};

export const getMaterialById = (id: string): Material | undefined => {
  return MATERIALS_DATABASE.find(material => material.id === id);
};

export const getMaterialsByCategory = (category: string): Material[] => {
  return MATERIALS_DATABASE.filter(material => material.category === category);
};

export const getUniqueCategories = (): string[] => {
  return [...new Set(MATERIALS_DATABASE.map(m => m.category))];
};

export const getUniqueSubcategories = (): string[] => {
  return [...new Set(MATERIALS_DATABASE.map(m => m.subcategory))];
};