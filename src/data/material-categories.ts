// Material Categories with Element Compositions
// Comprehensive database of material categories and their compositions

export interface ElementComposition {
  symbol: string;
  name: string;
  percentage: number;
  atomicNumber: number;
  role: 'base' | 'alloying' | 'trace' | 'dopant';
}

export interface MaterialCategory {
  id: string;
  name: string;
  description: string;
  baseElements: string[];
  typicalComposition: ElementComposition[];
  properties: {
    strength: 'low' | 'medium' | 'high' | 'very-high';
    conductivity: 'insulator' | 'semiconductor' | 'conductor' | 'superconductor';
    corrosionResistance: 'poor' | 'fair' | 'good' | 'excellent';
    temperature: 'low' | 'medium' | 'high' | 'ultra-high';
  };
  applications: string[];
  subcategories: MaterialSubcategory[];
}

export interface MaterialSubcategory {
  id: string;
  name: string;
  composition: ElementComposition[];
  specificProperties: Record<string, any>;
  examples: string[];
}

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  {
    id: 'ferrous-metals',
    name: 'Ferrous Metals',
    description: 'Iron-based alloys with varying carbon content and alloying elements',
    baseElements: ['Fe'],
    typicalComposition: [
      { symbol: 'Fe', name: 'Iron', percentage: 85, atomicNumber: 26, role: 'base' },
      { symbol: 'C', name: 'Carbon', percentage: 0.5, atomicNumber: 6, role: 'alloying' },
      { symbol: 'Mn', name: 'Manganese', percentage: 1.0, atomicNumber: 25, role: 'alloying' },
      { symbol: 'Si', name: 'Silicon', percentage: 0.5, atomicNumber: 14, role: 'alloying' }
    ],
    properties: {
      strength: 'high',
      conductivity: 'conductor',
      corrosionResistance: 'fair',
      temperature: 'high'
    },
    applications: ['construction', 'automotive', 'machinery', 'tools'],
    subcategories: [
      {
        id: 'carbon-steels',
        name: 'Carbon Steels',
        composition: [
          { symbol: 'Fe', name: 'Iron', percentage: 98.5, atomicNumber: 26, role: 'base' },
          { symbol: 'C', name: 'Carbon', percentage: 0.8, atomicNumber: 6, role: 'alloying' },
          { symbol: 'Mn', name: 'Manganese', percentage: 0.7, atomicNumber: 25, role: 'alloying' }
        ],
        specificProperties: { hardness: 'variable', weldability: 'good' },
        examples: ['AISI 1018', 'AISI 1045', 'AISI 1095']
      },
      {
        id: 'stainless-steels',
        name: 'Stainless Steels',
        composition: [
          { symbol: 'Fe', name: 'Iron', percentage: 70, atomicNumber: 26, role: 'base' },
          { symbol: 'Cr', name: 'Chromium', percentage: 18, atomicNumber: 24, role: 'alloying' },
          { symbol: 'Ni', name: 'Nickel', percentage: 10, atomicNumber: 28, role: 'alloying' },
          { symbol: 'C', name: 'Carbon', percentage: 0.08, atomicNumber: 6, role: 'trace' }
        ],
        specificProperties: { corrosionResistance: 'excellent', magnetism: 'variable' },
        examples: ['304', '316L', '410', '17-4 PH']
      },
      {
        id: 'tool-steels',
        name: 'Tool Steels',
        composition: [
          { symbol: 'Fe', name: 'Iron', percentage: 80, atomicNumber: 26, role: 'base' },
          { symbol: 'C', name: 'Carbon', percentage: 1.0, atomicNumber: 6, role: 'alloying' },
          { symbol: 'W', name: 'Tungsten', percentage: 6, atomicNumber: 74, role: 'alloying' },
          { symbol: 'V', name: 'Vanadium', percentage: 2, atomicNumber: 23, role: 'alloying' }
        ],
        specificProperties: { hardness: 'very-high', wearResistance: 'excellent' },
        examples: ['A2', 'D2', 'M2', 'H13']
      }
    ]
  },

  {
    id: 'non-ferrous-metals',
    name: 'Non-Ferrous Metals',
    description: 'Metals and alloys not primarily based on iron',
    baseElements: ['Al', 'Cu', 'Ti', 'Mg', 'Zn', 'Ni'],
    typicalComposition: [
      { symbol: 'Al', name: 'Aluminum', percentage: 95, atomicNumber: 13, role: 'base' },
      { symbol: 'Cu', name: 'Copper', percentage: 2, atomicNumber: 29, role: 'alloying' },
      { symbol: 'Mg', name: 'Magnesium', percentage: 1.5, atomicNumber: 12, role: 'alloying' },
      { symbol: 'Si', name: 'Silicon', percentage: 1.5, atomicNumber: 14, role: 'alloying' }
    ],
    properties: {
      strength: 'medium',
      conductivity: 'conductor',
      corrosionResistance: 'good',
      temperature: 'medium'
    },
    applications: ['aerospace', 'electronics', 'marine', 'packaging'],
    subcategories: [
      {
        id: 'aluminum-alloys',
        name: 'Aluminum Alloys',
        composition: [
          { symbol: 'Al', name: 'Aluminum', percentage: 97, atomicNumber: 13, role: 'base' },
          { symbol: 'Mg', name: 'Magnesium', percentage: 1, atomicNumber: 12, role: 'alloying' },
          { symbol: 'Si', name: 'Silicon', percentage: 0.6, atomicNumber: 14, role: 'alloying' },
          { symbol: 'Cu', name: 'Copper', percentage: 0.3, atomicNumber: 29, role: 'alloying' }
        ],
        specificProperties: { density: 'low', conductivity: 'high' },
        examples: ['6061', '7075', '2024', '5052']
      },
      {
        id: 'copper-alloys',
        name: 'Copper Alloys',
        composition: [
          { symbol: 'Cu', name: 'Copper', percentage: 70, atomicNumber: 29, role: 'base' },
          { symbol: 'Zn', name: 'Zinc', percentage: 30, atomicNumber: 30, role: 'alloying' }
        ],
        specificProperties: { conductivity: 'excellent', antimicrobial: 'yes' },
        examples: ['Brass', 'Bronze', 'Cupronickel', 'Beryllium Copper']
      },
      {
        id: 'titanium-alloys',
        name: 'Titanium Alloys',
        composition: [
          { symbol: 'Ti', name: 'Titanium', percentage: 90, atomicNumber: 22, role: 'base' },
          { symbol: 'Al', name: 'Aluminum', percentage: 6, atomicNumber: 13, role: 'alloying' },
          { symbol: 'V', name: 'Vanadium', percentage: 4, atomicNumber: 23, role: 'alloying' }
        ],
        specificProperties: { biocompatibility: 'excellent', strengthToWeight: 'very-high' },
        examples: ['Ti-6Al-4V', 'Ti-6Al-2Sn-4Zr-2Mo', 'CP Titanium']
      }
    ]
  },

  {
    id: 'ceramics',
    name: 'Ceramics',
    description: 'Inorganic, non-metallic materials with ionic or covalent bonding',
    baseElements: ['Si', 'Al', 'O', 'C', 'N'],
    typicalComposition: [
      { symbol: 'Al', name: 'Aluminum', percentage: 47, atomicNumber: 13, role: 'base' },
      { symbol: 'O', name: 'Oxygen', percentage: 53, atomicNumber: 8, role: 'base' }
    ],
    properties: {
      strength: 'high',
      conductivity: 'insulator',
      corrosionResistance: 'excellent',
      temperature: 'ultra-high'
    },
    applications: ['electronics', 'aerospace', 'medical', 'cutting tools'],
    subcategories: [
      {
        id: 'oxide-ceramics',
        name: 'Oxide Ceramics',
        composition: [
          { symbol: 'Al', name: 'Aluminum', percentage: 47, atomicNumber: 13, role: 'base' },
          { symbol: 'O', name: 'Oxygen', percentage: 53, atomicNumber: 8, role: 'base' }
        ],
        specificProperties: { hardness: 'very-high', chemicalInertness: 'excellent' },
        examples: ['Alumina (Al2O3)', 'Zirconia (ZrO2)', 'Magnesia (MgO)']
      },
      {
        id: 'carbides',
        name: 'Carbides',
        composition: [
          { symbol: 'W', name: 'Tungsten', percentage: 90, atomicNumber: 74, role: 'base' },
          { symbol: 'C', name: 'Carbon', percentage: 10, atomicNumber: 6, role: 'base' }
        ],
        specificProperties: { hardness: 'ultra-high', wearResistance: 'excellent' },
        examples: ['Tungsten Carbide', 'Silicon Carbide', 'Titanium Carbide']
      },
      {
        id: 'nitrides',
        name: 'Nitrides',
        composition: [
          { symbol: 'Si', name: 'Silicon', percentage: 60, atomicNumber: 14, role: 'base' },
          { symbol: 'N', name: 'Nitrogen', percentage: 40, atomicNumber: 7, role: 'base' }
        ],
        specificProperties: { thermalShockResistance: 'excellent', hardness: 'very-high' },
        examples: ['Silicon Nitride', 'Aluminum Nitride', 'Boron Nitride']
      }
    ]
  },

  {
    id: 'polymers',
    name: 'Polymers',
    description: 'Large molecules composed of repeating organic units',
    baseElements: ['C', 'H', 'O', 'N', 'F', 'Cl'],
    typicalComposition: [
      { symbol: 'C', name: 'Carbon', percentage: 85, atomicNumber: 6, role: 'base' },
      { symbol: 'H', name: 'Hydrogen', percentage: 15, atomicNumber: 1, role: 'base' }
    ],
    properties: {
      strength: 'medium',
      conductivity: 'insulator',
      corrosionResistance: 'good',
      temperature: 'medium'
    },
    applications: ['packaging', 'automotive', 'medical', 'electronics'],
    subcategories: [
      {
        id: 'thermoplastics',
        name: 'Thermoplastics',
        composition: [
          { symbol: 'C', name: 'Carbon', percentage: 85, atomicNumber: 6, role: 'base' },
          { symbol: 'H', name: 'Hydrogen', percentage: 15, atomicNumber: 1, role: 'base' }
        ],
        specificProperties: { recyclability: 'excellent', processability: 'good' },
        examples: ['Polyethylene', 'Polypropylene', 'PVC', 'ABS']
      },
      {
        id: 'thermosets',
        name: 'Thermosets',
        composition: [
          { symbol: 'C', name: 'Carbon', percentage: 70, atomicNumber: 6, role: 'base' },
          { symbol: 'H', name: 'Hydrogen', percentage: 8, atomicNumber: 1, role: 'base' },
          { symbol: 'O', name: 'Oxygen', percentage: 22, atomicNumber: 8, role: 'alloying' }
        ],
        specificProperties: { crosslinked: 'yes', temperatureResistance: 'high' },
        examples: ['Epoxy', 'Polyurethane', 'Phenolic', 'Silicone']
      },
      {
        id: 'engineering-plastics',
        name: 'Engineering Plastics',
        composition: [
          { symbol: 'C', name: 'Carbon', percentage: 68, atomicNumber: 6, role: 'base' },
          { symbol: 'H', name: 'Hydrogen', percentage: 6, atomicNumber: 1, role: 'base' },
          { symbol: 'O', name: 'Oxygen', percentage: 26, atomicNumber: 8, role: 'alloying' }
        ],
        specificProperties: { mechanicalProperties: 'high', chemicalResistance: 'excellent' },
        examples: ['PEEK', 'POM', 'PA66', 'PTFE']
      }
    ]
  },

  {
    id: 'composites',
    name: 'Composites',
    description: 'Materials combining two or more constituent materials with different properties',
    baseElements: ['C', 'Si', 'Al'],
    typicalComposition: [
      { symbol: 'C', name: 'Carbon Fiber', percentage: 60, atomicNumber: 6, role: 'base' },
      { symbol: 'C', name: 'Epoxy Resin', percentage: 40, atomicNumber: 6, role: 'alloying' }
    ],
    properties: {
      strength: 'very-high',
      conductivity: 'variable',
      corrosionResistance: 'excellent',
      temperature: 'medium'
    },
    applications: ['aerospace', 'automotive', 'sports equipment', 'wind energy'],
    subcategories: [
      {
        id: 'fiber-reinforced',
        name: 'Fiber Reinforced Composites',
        composition: [
          { symbol: 'C', name: 'Carbon Fiber', percentage: 60, atomicNumber: 6, role: 'base' },
          { symbol: 'C', name: 'Epoxy Matrix', percentage: 40, atomicNumber: 6, role: 'alloying' }
        ],
        specificProperties: { anisotropic: 'yes', designability: 'high' },
        examples: ['CFRP', 'GFRP', 'AFRP', 'Natural Fiber Composites']
      },
      {
        id: 'particulate-composites',
        name: 'Particulate Composites',
        composition: [
          { symbol: 'Al', name: 'Aluminum Matrix', percentage: 70, atomicNumber: 13, role: 'base' },
          { symbol: 'Si', name: 'Silicon Carbide', percentage: 30, atomicNumber: 14, role: 'alloying' }
        ],
        specificProperties: { isotropic: 'yes', stiffness: 'enhanced' },
        examples: ['MMCs', 'Concrete', 'WC-Co', 'Polymer-filled']
      }
    ]
  },

  {
    id: 'semiconductors',
    name: 'Semiconductors',
    description: 'Materials with electrical conductivity between conductors and insulators',
    baseElements: ['Si', 'Ge', 'Ga', 'As', 'In', 'P'],
    typicalComposition: [
      { symbol: 'Si', name: 'Silicon', percentage: 99.99, atomicNumber: 14, role: 'base' },
      { symbol: 'B', name: 'Boron', percentage: 0.005, atomicNumber: 5, role: 'dopant' },
      { symbol: 'P', name: 'Phosphorus', percentage: 0.005, atomicNumber: 15, role: 'dopant' }
    ],
    properties: {
      strength: 'medium',
      conductivity: 'semiconductor',
      corrosionResistance: 'good',
      temperature: 'medium'
    },
    applications: ['electronics', 'solar cells', 'LEDs', 'sensors'],
    subcategories: [
      {
        id: 'elemental-semiconductors',
        name: 'Elemental Semiconductors',
        composition: [
          { symbol: 'Si', name: 'Silicon', percentage: 100, atomicNumber: 14, role: 'base' }
        ],
        specificProperties: { bandgap: '1.12 eV', purity: 'ultra-high' },
        examples: ['Silicon', 'Germanium', 'Diamond']
      },
      {
        id: 'compound-semiconductors',
        name: 'Compound Semiconductors',
        composition: [
          { symbol: 'Ga', name: 'Gallium', percentage: 50, atomicNumber: 31, role: 'base' },
          { symbol: 'As', name: 'Arsenic', percentage: 50, atomicNumber: 33, role: 'base' }
        ],
        specificProperties: { directBandgap: 'yes', mobility: 'high' },
        examples: ['GaAs', 'InP', 'GaN', 'SiC']
      }
    ]
  },

  {
    id: 'biomaterials',
    name: 'Biomaterials',
    description: 'Materials designed to interact with biological systems',
    baseElements: ['Ti', 'Ca', 'P', 'C', 'H', 'O', 'N'],
    typicalComposition: [
      { symbol: 'Ca', name: 'Calcium', percentage: 40, atomicNumber: 20, role: 'base' },
      { symbol: 'P', name: 'Phosphorus', percentage: 18, atomicNumber: 15, role: 'base' },
      { symbol: 'O', name: 'Oxygen', percentage: 42, atomicNumber: 8, role: 'base' }
    ],
    properties: {
      strength: 'medium',
      conductivity: 'insulator',
      corrosionResistance: 'excellent',
      temperature: 'low'
    },
    applications: ['implants', 'prosthetics', 'drug delivery', 'tissue engineering'],
    subcategories: [
      {
        id: 'bioceramics',
        name: 'Bioceramics',
        composition: [
          { symbol: 'Ca', name: 'Calcium', percentage: 40, atomicNumber: 20, role: 'base' },
          { symbol: 'P', name: 'Phosphorus', percentage: 18, atomicNumber: 15, role: 'base' },
          { symbol: 'O', name: 'Oxygen', percentage: 42, atomicNumber: 8, role: 'base' }
        ],
        specificProperties: { bioactivity: 'high', osteoconductivity: 'excellent' },
        examples: ['Hydroxyapatite', 'Bioglass', 'Tricalcium Phosphate']
      },
      {
        id: 'biopolymers',
        name: 'Biopolymers',
        composition: [
          { symbol: 'C', name: 'Carbon', percentage: 45, atomicNumber: 6, role: 'base' },
          { symbol: 'H', name: 'Hydrogen', percentage: 6, atomicNumber: 1, role: 'base' },
          { symbol: 'O', name: 'Oxygen', percentage: 44, atomicNumber: 8, role: 'base' },
          { symbol: 'N', name: 'Nitrogen', percentage: 5, atomicNumber: 7, role: 'alloying' }
        ],
        specificProperties: { biodegradability: 'controllable', biocompatibility: 'excellent' },
        examples: ['Collagen', 'PLA', 'PLGA', 'Chitosan']
      }
    ]
  },

  {
    id: 'nanomaterials',
    name: 'Nanomaterials',
    description: 'Materials with at least one dimension in the nanoscale (1-100 nm)',
    baseElements: ['C', 'Si', 'Au', 'Ag'],
    typicalComposition: [
      { symbol: 'C', name: 'Carbon', percentage: 100, atomicNumber: 6, role: 'base' }
    ],
    properties: {
      strength: 'very-high',
      conductivity: 'variable',
      corrosionResistance: 'excellent',
      temperature: 'high'
    },
    applications: ['electronics', 'medicine', 'energy storage', 'catalysis'],
    subcategories: [
      {
        id: 'carbon-nanostructures',
        name: 'Carbon Nanostructures',
        composition: [
          { symbol: 'C', name: 'Carbon', percentage: 100, atomicNumber: 6, role: 'base' }
        ],
        specificProperties: { surfaceArea: 'ultra-high', aspectRatio: 'very-high' },
        examples: ['Carbon Nanotubes', 'Graphene', 'Fullerenes', 'Carbon Black']
      },
      {
        id: 'metal-nanoparticles',
        name: 'Metal Nanoparticles',
        composition: [
          { symbol: 'Au', name: 'Gold', percentage: 100, atomicNumber: 79, role: 'base' }
        ],
        specificProperties: { plasmonic: 'yes', catalytic: 'enhanced' },
        examples: ['Gold NPs', 'Silver NPs', 'Platinum NPs', 'Iron Oxide NPs']
      }
    ]
  },

  {
    id: 'smart-materials',
    name: 'Smart Materials',
    description: 'Materials that respond to external stimuli with controllable changes in properties',
    baseElements: ['Ni', 'Ti', 'Pb', 'Zr', 'Fe', 'Mn'],
    typicalComposition: [
      { symbol: 'Ni', name: 'Nickel', percentage: 50, atomicNumber: 28, role: 'base' },
      { symbol: 'Ti', name: 'Titanium', percentage: 50, atomicNumber: 22, role: 'base' }
    ],
    properties: {
      strength: 'variable',
      conductivity: 'variable',
      corrosionResistance: 'good',
      temperature: 'medium'
    },
    applications: ['actuators', 'sensors', 'aerospace', 'biomedical'],
    subcategories: [
      {
        id: 'shape-memory-alloys',
        name: 'Shape Memory Alloys',
        composition: [
          { symbol: 'Ni', name: 'Nickel', percentage: 50, atomicNumber: 28, role: 'base' },
          { symbol: 'Ti', name: 'Titanium', percentage: 50, atomicNumber: 22, role: 'base' }
        ],
        specificProperties: { shapeRecovery: 'excellent', superelasticity: 'yes' },
        examples: ['Nitinol', 'Cu-Al-Ni', 'Fe-Mn-Si']
      },
      {
        id: 'piezoelectric-materials',
        name: 'Piezoelectric Materials',
        composition: [
          { symbol: 'Pb', name: 'Lead', percentage: 69, atomicNumber: 82, role: 'base' },
          { symbol: 'Zr', name: 'Zirconium', percentage: 15, atomicNumber: 40, role: 'alloying' },
          { symbol: 'Ti', name: 'Titanium', percentage: 8, atomicNumber: 22, role: 'alloying' },
          { symbol: 'O', name: 'Oxygen', percentage: 8, atomicNumber: 8, role: 'base' }
        ],
        specificProperties: { electromechanicalCoupling: 'high', sensitivity: 'excellent' },
        examples: ['PZT', 'Quartz', 'PVDF', 'BaTiO3']
      }
    ]
  },

  {
    id: 'energy-materials',
    name: 'Energy Materials',
    description: 'Materials designed for energy storage, conversion, and transmission applications',
    baseElements: ['Li', 'Co', 'Ni', 'Mn', 'Fe', 'P'],
    typicalComposition: [
      { symbol: 'Li', name: 'Lithium', percentage: 7, atomicNumber: 3, role: 'base' },
      { symbol: 'Co', name: 'Cobalt', percentage: 60, atomicNumber: 27, role: 'base' },
      { symbol: 'O', name: 'Oxygen', percentage: 33, atomicNumber: 8, role: 'base' }
    ],
    properties: {
      strength: 'medium',
      conductivity: 'conductor',
      corrosionResistance: 'good',
      temperature: 'medium'
    },
    applications: ['batteries', 'solar cells', 'fuel cells', 'supercapacitors'],
    subcategories: [
      {
        id: 'battery-materials',
        name: 'Battery Materials',
        composition: [
          { symbol: 'Li', name: 'Lithium', percentage: 7, atomicNumber: 3, role: 'base' },
          { symbol: 'Co', name: 'Cobalt', percentage: 60, atomicNumber: 27, role: 'base' },
          { symbol: 'O', name: 'Oxygen', percentage: 33, atomicNumber: 8, role: 'base' }
        ],
        specificProperties: { energyDensity: 'high', cyclability: 'excellent' },
        examples: ['LiCoO2', 'LiFePO4', 'NMC', 'LiMn2O4']
      },
      {
        id: 'photovoltaic-materials',
        name: 'Photovoltaic Materials',
        composition: [
          { symbol: 'Si', name: 'Silicon', percentage: 100, atomicNumber: 14, role: 'base' }
        ],
        specificProperties: { bandgap: '1.12 eV', efficiency: 'high' },
        examples: ['c-Si', 'a-Si', 'CdTe', 'CIGS']
      }
    ]
  },

  {
    id: 'refractory-materials',
    name: 'Refractory Materials',
    description: 'Materials that retain strength at very high temperatures',
    baseElements: ['W', 'Mo', 'Ta', 'Re', 'C'],
    typicalComposition: [
      { symbol: 'W', name: 'Tungsten', percentage: 100, atomicNumber: 74, role: 'base' }
    ],
    properties: {
      strength: 'very-high',
      conductivity: 'conductor',
      corrosionResistance: 'excellent',
      temperature: 'ultra-high'
    },
    applications: ['furnace linings', 'rocket nozzles', 'nuclear reactors', 'high-temp tools'],
    subcategories: [
      {
        id: 'tungsten-alloys',
        name: 'Tungsten Alloys',
        composition: [
          { symbol: 'W', name: 'Tungsten', percentage: 95, atomicNumber: 74, role: 'base' },
          { symbol: 'Re', name: 'Rhenium', percentage: 5, atomicNumber: 75, role: 'alloying' }
        ],
        specificProperties: { meltingPoint: '3695K', ductility: 'improved' },
        examples: ['W-Re', 'W-ThO2', 'W-La2O3']
      },
      {
        id: 'carbide-refractories',
        name: 'Carbide Refractories',
        composition: [
          { symbol: 'Ta', name: 'Tantalum', percentage: 80, atomicNumber: 73, role: 'base' },
          { symbol: 'C', name: 'Carbon', percentage: 20, atomicNumber: 6, role: 'base' }
        ],
        specificProperties: { hardness: 'ultra-high', thermalShock: 'excellent' },
        examples: ['TaC', 'HfC', 'NbC', 'ZrC']
      }
    ]
  },

  {
    id: 'magnetic-materials',
    name: 'Magnetic Materials',
    description: 'Materials with significant magnetic properties for electronic and mechanical applications',
    baseElements: ['Fe', 'Ni', 'Co', 'Nd', 'Sm', 'Dy'],
    typicalComposition: [
      { symbol: 'Nd', name: 'Neodymium', percentage: 32, atomicNumber: 60, role: 'base' },
      { symbol: 'Fe', name: 'Iron', percentage: 64, atomicNumber: 26, role: 'base' },
      { symbol: 'B', name: 'Boron', percentage: 4, atomicNumber: 5, role: 'alloying' }
    ],
    properties: {
      strength: 'medium',
      conductivity: 'conductor',
      corrosionResistance: 'fair',
      temperature: 'medium'
    },
    applications: ['permanent magnets', 'transformers', 'motors', 'magnetic storage'],
    subcategories: [
      {
        id: 'permanent-magnets',
        name: 'Permanent Magnets',
        composition: [
          { symbol: 'Nd', name: 'Neodymium', percentage: 32, atomicNumber: 60, role: 'base' },
          { symbol: 'Fe', name: 'Iron', percentage: 64, atomicNumber: 26, role: 'base' },
          { symbol: 'B', name: 'Boron', percentage: 4, atomicNumber: 5, role: 'alloying' }
        ],
        specificProperties: { coercivity: 'very-high', energyProduct: 'maximum' },
        examples: ['NdFeB', 'SmCo', 'Alnico', 'Ferrite']
      },
      {
        id: 'soft-magnets',
        name: 'Soft Magnetic Materials',
        composition: [
          { symbol: 'Fe', name: 'Iron', percentage: 80, atomicNumber: 26, role: 'base' },
          { symbol: 'Si', name: 'Silicon', percentage: 3, atomicNumber: 14, role: 'alloying' },
          { symbol: 'Ni', name: 'Nickel', percentage: 17, atomicNumber: 28, role: 'alloying' }
        ],
        specificProperties: { permeability: 'high', coercivity: 'low' },
        examples: ['Electrical Steel', 'Permalloy', 'Mu-metal', 'Sendust']
      }
    ]
  },

  // === HOUSE UTILITY MATERIALS ===
  
  {
    id: 'plumbing-materials',
    name: 'Plumbing Materials',
    description: 'Materials used for water supply, drainage, and plumbing systems in residential and commercial buildings',
    baseElements: ['Cu', 'C', 'H', 'Cl'],
    typicalComposition: [
      { symbol: 'C', name: 'Carbon', percentage: 45, atomicNumber: 6, role: 'base' },
      { symbol: 'H', name: 'Hydrogen', percentage: 8, atomicNumber: 1, role: 'base' },
      { symbol: 'Cl', name: 'Chlorine', percentage: 47, atomicNumber: 17, role: 'alloying' }
    ],
    properties: {
      strength: 'medium',
      conductivity: 'insulator',
      corrosionResistance: 'excellent',
      temperature: 'medium'
    },
    applications: ['water supply', 'drainage', 'gas lines', 'irrigation'],
    subcategories: [
      {
        id: 'plastic-pipes',
        name: 'Plastic Pipes',
        composition: [
          { symbol: 'C', name: 'Carbon', percentage: 45, atomicNumber: 6, role: 'base' },
          { symbol: 'H', name: 'Hydrogen', percentage: 8, atomicNumber: 1, role: 'base' },
          { symbol: 'Cl', name: 'Chlorine', percentage: 47, atomicNumber: 17, role: 'alloying' }
        ],
        specificProperties: { chemicalResistance: 'excellent', costEffective: 'yes' },
        examples: ['PVC', 'PEX', 'CPVC', 'ABS']
      },
      {
        id: 'metal-pipes',
        name: 'Metal Pipes',
        composition: [
          { symbol: 'Cu', name: 'Copper', percentage: 100, atomicNumber: 29, role: 'base' }
        ],
        specificProperties: { antimicrobial: 'yes', longevity: 'excellent' },
        examples: ['Copper Type K', 'Copper Type L', 'Galvanized Steel', 'Stainless Steel']
      }
    ]
  },

  {
    id: 'electrical-materials',
    name: 'Electrical Materials',
    description: 'Materials used for electrical wiring, conduits, and electrical components in buildings',
    baseElements: ['Cu', 'Al', 'C', 'H'],
    typicalComposition: [
      { symbol: 'Cu', name: 'Copper', percentage: 70, atomicNumber: 29, role: 'base' },
      { symbol: 'C', name: 'Carbon', percentage: 20, atomicNumber: 6, role: 'alloying' },
      { symbol: 'H', name: 'Hydrogen', percentage: 10, atomicNumber: 1, role: 'alloying' }
    ],
    properties: {
      strength: 'medium',
      conductivity: 'conductor',
      corrosionResistance: 'good',
      temperature: 'medium'
    },
    applications: ['building wiring', 'electrical panels', 'conduit systems', 'grounding'],
    subcategories: [
      {
        id: 'building-wire',
        name: 'Building Wire',
        composition: [
          { symbol: 'Cu', name: 'Copper Core', percentage: 70, atomicNumber: 29, role: 'base' },
          { symbol: 'C', name: 'PVC Insulation', percentage: 20, atomicNumber: 6, role: 'alloying' },
          { symbol: 'H', name: 'Hydrogen', percentage: 10, atomicNumber: 1, role: 'alloying' }
        ],
        specificProperties: { flexibility: 'good', fireRating: 'high' },
        examples: ['Romex NM-B', 'THHN/THWN', 'MC Cable', 'BX Cable']
      },
      {
        id: 'electrical-conduit',
        name: 'Electrical Conduit',
        composition: [
          { symbol: 'C', name: 'Carbon', percentage: 85, atomicNumber: 6, role: 'base' },
          { symbol: 'H', name: 'Hydrogen', percentage: 15, atomicNumber: 1, role: 'base' }
        ],
        specificProperties: { durability: 'excellent', UV_resistance: 'good' },
        examples: ['PVC Conduit', 'EMT', 'Rigid Steel', 'Flexible Metal']
      }
    ]
  },

  {
    id: 'insulation-materials',
    name: 'Insulation Materials',
    description: 'Materials used for thermal and acoustic insulation in residential and commercial buildings',
    baseElements: ['Si', 'O', 'C', 'H'],
    typicalComposition: [
      { symbol: 'Si', name: 'Silicon', percentage: 46, atomicNumber: 14, role: 'base' },
      { symbol: 'O', name: 'Oxygen', percentage: 54, atomicNumber: 8, role: 'base' }
    ],
    properties: {
      strength: 'low',
      conductivity: 'insulator',
      corrosionResistance: 'excellent',
      temperature: 'high'
    },
    applications: ['wall insulation', 'attic insulation', 'pipe insulation', 'sound dampening'],
    subcategories: [
      {
        id: 'fibrous-insulation',
        name: 'Fibrous Insulation',
        composition: [
          { symbol: 'Si', name: 'Silicon', percentage: 46, atomicNumber: 14, role: 'base' },
          { symbol: 'O', name: 'Oxygen', percentage: 54, atomicNumber: 8, role: 'base' }
        ],
        specificProperties: { thermalResistance: 'good', fireResistance: 'excellent' },
        examples: ['Fiberglass Batts', 'Mineral Wool', 'Cellulose', 'Natural Fiber']
      },
      {
        id: 'foam-insulation',
        name: 'Foam Insulation',
        composition: [
          { symbol: 'C', name: 'Carbon', percentage: 70, atomicNumber: 6, role: 'base' },
          { symbol: 'H', name: 'Hydrogen', percentage: 10, atomicNumber: 1, role: 'base' },
          { symbol: 'O', name: 'Oxygen', percentage: 15, atomicNumber: 8, role: 'alloying' },
          { symbol: 'N', name: 'Nitrogen', percentage: 5, atomicNumber: 7, role: 'alloying' }
        ],
        specificProperties: { airSealing: 'excellent', moistureBarrier: 'good' },
        examples: ['Spray Foam', 'Rigid Foam', 'Expandable Foam', 'XPS/EPS']
      }
    ]
  },

  {
    id: 'roofing-materials',
    name: 'Roofing Materials',
    description: 'Materials used for roof covering and weather protection systems',
    baseElements: ['C', 'H', 'Fe', 'Al'],
    typicalComposition: [
      { symbol: 'C', name: 'Carbon', percentage: 80, atomicNumber: 6, role: 'base' },
      { symbol: 'H', name: 'Hydrogen', percentage: 15, atomicNumber: 1, role: 'base' },
      { symbol: 'O', name: 'Oxygen', percentage: 5, atomicNumber: 8, role: 'alloying' }
    ],
    properties: {
      strength: 'medium',
      conductivity: 'insulator',
      corrosionResistance: 'good',
      temperature: 'medium'
    },
    applications: ['residential roofing', 'commercial roofing', 'weather barrier', 'solar mounting'],
    subcategories: [
      {
        id: 'composite-shingles',
        name: 'Composite Shingles',
        composition: [
          { symbol: 'C', name: 'Asphalt Base', percentage: 80, atomicNumber: 6, role: 'base' },
          { symbol: 'Si', name: 'Mineral Granules', percentage: 15, atomicNumber: 14, role: 'alloying' },
          { symbol: 'C', name: 'Fiberglass Mat', percentage: 5, atomicNumber: 6, role: 'alloying' }
        ],
        specificProperties: { weatherResistance: 'good', costEffective: 'excellent' },
        examples: ['Asphalt Shingles', 'Architectural Shingles', 'Composite Shingles']
      },
      {
        id: 'metal-roofing',
        name: 'Metal Roofing',
        composition: [
          { symbol: 'Fe', name: 'Iron', percentage: 98, atomicNumber: 26, role: 'base' },
          { symbol: 'Zn', name: 'Zinc Coating', percentage: 2, atomicNumber: 30, role: 'alloying' }
        ],
        specificProperties: { longevity: 'excellent', energyEfficiency: 'high' },
        examples: ['Standing Seam Steel', 'Aluminum Roofing', 'Copper Roofing', 'Corrugated Metal']
      }
    ]
  },

  {
    id: 'flooring-materials',
    name: 'Flooring Materials',
    description: 'Materials used for interior and exterior floor surfaces',
    baseElements: ['C', 'H', 'Si', 'Al'],
    typicalComposition: [
      { symbol: 'C', name: 'Carbon', percentage: 85, atomicNumber: 6, role: 'base' },
      { symbol: 'H', name: 'Hydrogen', percentage: 15, atomicNumber: 1, role: 'base' }
    ],
    properties: {
      strength: 'medium',
      conductivity: 'insulator',
      corrosionResistance: 'good',
      temperature: 'medium'
    },
    applications: ['residential flooring', 'commercial flooring', 'outdoor decking', 'subflooring'],
    subcategories: [
      {
        id: 'vinyl-flooring',
        name: 'Vinyl Flooring',
        composition: [
          { symbol: 'C', name: 'Carbon', percentage: 45, atomicNumber: 6, role: 'base' },
          { symbol: 'H', name: 'Hydrogen', percentage: 8, atomicNumber: 1, role: 'base' },
          { symbol: 'Cl', name: 'Chlorine', percentage: 47, atomicNumber: 17, role: 'alloying' }
        ],
        specificProperties: { waterResistance: 'excellent', installation: 'easy' },
        examples: ['LVP', 'LVT', 'Sheet Vinyl', 'Vinyl Composition Tile']
      },
      {
        id: 'ceramic-flooring',
        name: 'Ceramic Flooring',
        composition: [
          { symbol: 'Al', name: 'Aluminum', percentage: 20, atomicNumber: 13, role: 'base' },
          { symbol: 'Si', name: 'Silicon', percentage: 25, atomicNumber: 14, role: 'base' },
          { symbol: 'O', name: 'Oxygen', percentage: 55, atomicNumber: 8, role: 'base' }
        ],
        specificProperties: { durability: 'excellent', maintenance: 'low' },
        examples: ['Ceramic Tile', 'Porcelain Tile', 'Natural Stone', 'Terrazzo']
      }
    ]
  },

  {
    id: 'structural-materials',
    name: 'Structural Materials',
    description: 'Materials used for load-bearing and structural components in construction',
    baseElements: ['Fe', 'C', 'Ca', 'Si'],
    typicalComposition: [
      { symbol: 'Ca', name: 'Calcium', percentage: 65, atomicNumber: 20, role: 'base' },
      { symbol: 'Si', name: 'Silicon', percentage: 20, atomicNumber: 14, role: 'base' },
      { symbol: 'Al', name: 'Aluminum', percentage: 6, atomicNumber: 13, role: 'alloying' },
      { symbol: 'Fe', name: 'Iron', percentage: 3, atomicNumber: 26, role: 'alloying' },
      { symbol: 'O', name: 'Oxygen', percentage: 6, atomicNumber: 8, role: 'base' }
    ],
    properties: {
      strength: 'very-high',
      conductivity: 'insulator',
      corrosionResistance: 'good',
      temperature: 'high'
    },
    applications: ['foundations', 'structural framing', 'load-bearing walls', 'bridges'],
    subcategories: [
      {
        id: 'concrete-materials',
        name: 'Concrete Materials',
        composition: [
          { symbol: 'Ca', name: 'Cement', percentage: 65, atomicNumber: 20, role: 'base' },
          { symbol: 'Si', name: 'Aggregate', percentage: 30, atomicNumber: 14, role: 'base' },
          { symbol: 'H', name: 'Water', percentage: 5, atomicNumber: 1, role: 'alloying' }
        ],
        specificProperties: { compressiveStrength: 'very-high', durability: 'excellent' },
        examples: ['Ready-Mix Concrete', 'High-Strength Concrete', 'Lightweight Concrete', 'Precast Concrete']
      },
      {
        id: 'structural-steel',
        name: 'Structural Steel',
        composition: [
          { symbol: 'Fe', name: 'Iron', percentage: 98, atomicNumber: 26, role: 'base' },
          { symbol: 'C', name: 'Carbon', percentage: 0.3, atomicNumber: 6, role: 'alloying' },
          { symbol: 'Mn', name: 'Manganese', percentage: 1.2, atomicNumber: 25, role: 'alloying' },
          { symbol: 'Si', name: 'Silicon', percentage: 0.5, atomicNumber: 14, role: 'alloying' }
        ],
        specificProperties: { tensileStrength: 'very-high', weldability: 'excellent' },
        examples: ['A36 Steel', 'A572 Steel', 'A992 Steel', 'HSS Tubing']
      },
      {
        id: 'engineered-lumber',
        name: 'Engineered Lumber',
        composition: [
          { symbol: 'C', name: 'Cellulose', percentage: 40, atomicNumber: 6, role: 'base' },
          { symbol: 'H', name: 'Hydrogen', percentage: 6, atomicNumber: 1, role: 'base' },
          { symbol: 'O', name: 'Oxygen', percentage: 44, atomicNumber: 8, role: 'base' },
          { symbol: 'C', name: 'Adhesive', percentage: 10, atomicNumber: 6, role: 'alloying' }
        ],
        specificProperties: { dimensionalStability: 'excellent', sustainability: 'high' },
        examples: ['Glulam', 'LVL', 'I-Joists', 'OSB']
      }
    ]
  },

  {
    id: 'hvac-materials',
    name: 'HVAC Materials',
    description: 'Materials used for heating, ventilation, and air conditioning systems',
    baseElements: ['Fe', 'Al', 'Cu'],
    typicalComposition: [
      { symbol: 'Fe', name: 'Iron', percentage: 98, atomicNumber: 26, role: 'base' },
      { symbol: 'Zn', name: 'Zinc Coating', percentage: 2, atomicNumber: 30, role: 'alloying' }
    ],
    properties: {
      strength: 'high',
      conductivity: 'conductor',
      corrosionResistance: 'good',
      temperature: 'medium'
    },
    applications: ['ductwork', 'heat exchangers', 'piping systems', 'ventilation'],
    subcategories: [
      {
        id: 'ductwork-materials',
        name: 'Ductwork Materials',
        composition: [
          { symbol: 'Fe', name: 'Steel Base', percentage: 98, atomicNumber: 26, role: 'base' },
          { symbol: 'Zn', name: 'Galvanized Coating', percentage: 2, atomicNumber: 30, role: 'alloying' }
        ],
        specificProperties: { airTightness: 'good', durability: 'high' },
        examples: ['Galvanized Steel', 'Aluminum Ductwork', 'Flexible Duct', 'Fiberglass Duct']
      },
      {
        id: 'refrigeration-lines',
        name: 'Refrigeration Lines',
        composition: [
          { symbol: 'Cu', name: 'Copper', percentage: 100, atomicNumber: 29, role: 'base' }
        ],
        specificProperties: { thermalConductivity: 'excellent', corrosionResistance: 'good' },
        examples: ['Copper Tubing', 'Aluminum Coils', 'Insulated Lines', 'Refrigerant Pipes']
      }
    ]
  }];

// Utility functions for material categories
export const getCategoryById = (id: string): MaterialCategory | undefined => {
  return MATERIAL_CATEGORIES.find(category => category.id === id);
};

export const getSubcategoryById = (categoryId: string, subcategoryId: string): MaterialSubcategory | undefined => {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};

export const getAllElements = (): string[] => {
  const elements = new Set<string>();
  
  MATERIAL_CATEGORIES.forEach(category => {
    category.typicalComposition.forEach(comp => {
      elements.add(comp.symbol);
    });
    
    category.subcategories.forEach(sub => {
      sub.composition.forEach(comp => {
        elements.add(comp.symbol);
      });
    });
  });
  
  return Array.from(elements).sort();
};

export const searchCategoriesByElement = (element: string): MaterialCategory[] => {
  return MATERIAL_CATEGORIES.filter(category =>
    category.baseElements.includes(element) ||
    category.typicalComposition.some(comp => comp.symbol === element) ||
    category.subcategories.some(sub =>
      sub.composition.some(comp => comp.symbol === element)
    )
  );
};

export const getCompositionPresets = (categoryId: string): ElementComposition[][] => {
  const category = getCategoryById(categoryId);
  if (!category) return [];
  
  const presets = [category.typicalComposition];
  category.subcategories.forEach(sub => {
    presets.push(sub.composition);
  });
  
  return presets;
};

// Material tailoring utilities
export const normalizeComposition = (composition: ElementComposition[]): ElementComposition[] => {
  const total = composition.reduce((sum, comp) => sum + comp.percentage, 0);
  
  if (total === 0) return composition;
  
  return composition.map(comp => ({
    ...comp,
    percentage: (comp.percentage / total) * 100
  }));
};

export const addElement = (
  composition: ElementComposition[],
  element: ElementComposition
): ElementComposition[] => {
  const existing = composition.find(comp => comp.symbol === element.symbol);
  
  if (existing) {
    return composition.map(comp =>
      comp.symbol === element.symbol
        ? { ...comp, percentage: comp.percentage + element.percentage }
        : comp
    );
  }
  
  return [...composition, element];
};

export const removeElement = (
  composition: ElementComposition[],
  symbol: string
): ElementComposition[] => {
  return composition.filter(comp => comp.symbol !== symbol);
};

export const updateElementPercentage = (
  composition: ElementComposition[],
  symbol: string,
  percentage: number
): ElementComposition[] => {
  return composition.map(comp =>
    comp.symbol === symbol
      ? { ...comp, percentage }
      : comp
  );
};