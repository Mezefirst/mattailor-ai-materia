import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wrench, 
  Plane, 
  Car, 
  Heart, 
  Zap, 
  Building, 
  Boat,
  Rocket,
  Atom,
  FlaskConical,
  Lightbulb,
  Target,
  TrendingUp
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Element } from '@/components/periodic/PeriodicTable';

interface MaterialCategoriesProps {
  onCategoryGenerated: (composition: Array<{ element: Element; percentage: number }>) => void;
  onOptimizationStart?: () => void;
  onOptimizationEnd?: () => void;
  isOptimizing: boolean;
}

interface MaterialCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  baseElements: string[];
  alloyingElements: string[];
  keyProperties: string[];
  applications: string[];
  designPrinciples: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert';
  examples: string[];
}

const MATERIAL_CATEGORIES: MaterialCategory[] = [
  {
    id: 'structural-steels',
    name: 'Structural Steels',
    description: 'Iron-based alloys optimized for construction and heavy engineering',
    icon: <Building className="h-5 w-5" />,
    baseElements: ['Fe'],
    alloyingElements: ['C', 'Mn', 'Si', 'Cr', 'Ni', 'Mo'],
    keyProperties: ['High strength', 'Weldability', 'Formability', 'Cost-effective'],
    applications: ['Buildings', 'Bridges', 'Infrastructure', 'Pressure vessels'],
    designPrinciples: ['Carbon control for strength-ductility balance', 'Microalloying for grain refinement'],
    difficulty: 'basic',
    examples: ['A36 Steel', 'HSLA Steel', 'API 5L']
  },
  {
    id: 'aerospace-alloys',
    name: 'Aerospace Alloys',
    description: 'Lightweight, high-strength materials for aviation and space applications',
    icon: <Plane className="h-5 w-5" />,
    baseElements: ['Al', 'Ti', 'Ni'],
    alloyingElements: ['Cu', 'Mg', 'Zn', 'Li', 'V', 'Cr', 'Co', 'Fe'],
    keyProperties: ['High strength-to-weight', 'Fatigue resistance', 'Corrosion resistance', 'Temperature stability'],
    applications: ['Aircraft structures', 'Engine components', 'Spacecraft', 'Satellites'],
    designPrinciples: ['Precipitation hardening', 'Solution strengthening', 'Grain boundary engineering'],
    difficulty: 'advanced',
    examples: ['7075-T6 Al', 'Ti-6Al-4V', 'Inconel 718']
  },
  {
    id: 'automotive-alloys',
    name: 'Automotive Alloys',
    description: 'Materials optimized for automotive performance, efficiency, and safety',
    icon: <Car className="h-5 w-5" />,
    baseElements: ['Fe', 'Al', 'Mg'],
    alloyingElements: ['C', 'Mn', 'Si', 'Cr', 'V', 'Nb', 'Ti'],
    keyProperties: ['Formability', 'Crashworthiness', 'Corrosion resistance', 'Recyclability'],
    applications: ['Body panels', 'Engine blocks', 'Wheels', 'Safety structures'],
    designPrinciples: ['TRIP/TWIP effects', 'Bake hardening', 'Weight reduction'],
    difficulty: 'intermediate',
    examples: ['HSLA 340', 'DP 980', 'A356 Al']
  },
  {
    id: 'biomedical-alloys',
    name: 'Biomedical Alloys',
    description: 'Biocompatible materials for medical implants and devices',
    icon: <Heart className="h-5 w-5" />,
    baseElements: ['Ti', 'Co', 'Ta', 'Nb'],
    alloyingElements: ['Al', 'V', 'Cr', 'Mo', 'Zr', 'W'],
    keyProperties: ['Biocompatibility', 'Corrosion resistance', 'Low elastic modulus', 'Non-toxicity'],
    applications: ['Joint replacements', 'Dental implants', 'Stents', 'Surgical instruments'],
    designPrinciples: ['Eliminate toxic elements', 'Match bone modulus', 'Osseointegration'],
    difficulty: 'expert',
    examples: ['Ti-6Al-4V ELI', 'CoCrMo', 'Ti-Nb-Ta-Zr']
  },
  {
    id: 'marine-alloys',
    name: 'Marine Alloys',
    description: 'Corrosion-resistant materials for marine and offshore applications',
    icon: <Boat className="h-5 w-5" />,
    baseElements: ['Al', 'Cu', 'Ni', 'Ti'],
    alloyingElements: ['Mg', 'Mn', 'Zn', 'Cr', 'Mo', 'Sn'],
    keyProperties: ['Seawater corrosion resistance', 'Stress corrosion cracking resistance', 'Biofouling resistance'],
    applications: ['Ship hulls', 'Propellers', 'Offshore platforms', 'Desalination plants'],
    designPrinciples: ['Galvanic compatibility', 'Passive film stability', 'Chloride resistance'],
    difficulty: 'advanced',
    examples: ['5083-H321 Al', 'CuNi 90/10', 'Super Duplex SS']
  },
  {
    id: 'electronic-alloys',
    name: 'Electronic Alloys',
    description: 'Materials with tailored electrical and thermal properties for electronics',
    icon: <Zap className="h-5 w-5" />,
    baseElements: ['Cu', 'Ag', 'Au', 'Al'],
    alloyingElements: ['Be', 'Sn', 'Pb', 'In', 'Bi', 'Sb'],
    keyProperties: ['High conductivity', 'Controlled thermal expansion', 'Solderability', 'Reliability'],
    applications: ['Connectors', 'Heat sinks', 'Solder joints', 'Circuit boards'],
    designPrinciples: ['Minimize electrical resistance', 'Thermal management', 'Interconnect reliability'],
    difficulty: 'intermediate',
    examples: ['C17200 BeCu', 'SAC305 Solder', 'Kovar']
  },
  {
    id: 'tool-steels',
    name: 'Tool Steels',
    description: 'Hardened steels for cutting, forming, and manufacturing tools',
    icon: <Wrench className="h-5 w-5" />,
    baseElements: ['Fe'],
    alloyingElements: ['C', 'Cr', 'Mo', 'W', 'V', 'Co', 'Si'],
    keyProperties: ['High hardness', 'Wear resistance', 'Toughness', 'Heat resistance'],
    applications: ['Cutting tools', 'Dies', 'Molds', 'Punches'],
    designPrinciples: ['Carbide formation', 'Retained austenite control', 'Secondary hardening'],
    difficulty: 'advanced',
    examples: ['M2 HSS', 'H13 Hot Work', 'D2 Cold Work']
  },
  {
    id: 'superalloys',
    name: 'Superalloys',
    description: 'High-temperature materials for extreme environment applications',
    icon: <Rocket className="h-5 w-5" />,
    baseElements: ['Ni', 'Co', 'Fe'],
    alloyingElements: ['Cr', 'Al', 'Ti', 'Mo', 'W', 'Ta', 'Re', 'Ru'],
    keyProperties: ['High-temperature strength', 'Creep resistance', 'Oxidation resistance', 'Thermal shock resistance'],
    applications: ['Gas turbines', 'Jet engines', 'Nuclear reactors', 'Industrial furnaces'],
    designPrinciples: ['γ\' precipitation hardening', 'Grain boundary strengthening', 'Solid solution strengthening'],
    difficulty: 'expert',
    examples: ['Inconel 718', 'CMSX-4', 'Hastelloy X']
  }
];

export function MaterialCategories({ 
  onCategoryGenerated, 
  onOptimizationStart, 
  onOptimizationEnd,
  isOptimizing 
}: MaterialCategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customRequirements, setCustomRequirements] = useState<string>('');

  const generateCategoryAlloy = async (categoryId: string, customization?: string) => {
    const category = MATERIAL_CATEGORIES.find(c => c.id === categoryId);
    if (!category) {
      toast.error('Category not found');
      return;
    }

    setIsGenerating(true);
    onOptimizationStart?.();

    try {
      const prompt = spark.llmPrompt`
      You are an expert metallurgist specializing in ${category.name.toLowerCase()}. Design an optimized alloy composition for this category.
      
      Category: ${category.name}
      Description: ${category.description}
      Base Elements: ${category.baseElements.join(', ')}
      Alloying Elements: ${category.alloyingElements.join(', ')}
      Key Properties: ${category.keyProperties.join(', ')}
      Applications: ${category.applications.join(', ')}
      Design Principles: ${category.designPrinciples.join(', ')}
      Difficulty Level: ${category.difficulty}
      Industry Examples: ${category.examples.join(', ')}
      
      ${customization ? `Additional Requirements: ${customization}` : ''}
      
      Design Optimization Approach:
      1. Select optimal base element(s) for the primary matrix
      2. Choose alloying elements for specific property enhancement
      3. Balance composition for optimal microstructure
      4. Consider processing requirements and heat treatment
      5. Optimize for the target applications and service conditions
      6. Ensure cost-effectiveness and manufacturability
      
      Advanced Metallurgy Considerations:
      - Phase stability and transformation kinetics
      - Precipitation hardening mechanisms
      - Grain size control and recrystallization
      - Segregation and homogenization requirements
      - Thermal expansion and thermal cycling
      - Corrosion mechanisms and passivation
      - Mechanical property optimization
      
      Category-Specific Requirements:
      ${category.id === 'structural-steels' ? 
        '- Optimize C content for strength-ductility balance\n- Add microalloying elements for grain refinement\n- Control S and P for weldability' :
      category.id === 'aerospace-alloys' ?
        '- Maximize strength-to-weight ratio\n- Ensure excellent fatigue resistance\n- Optimize for service temperature range' :
      category.id === 'biomedical-alloys' ?
        '- Eliminate toxic elements (V, Al in some cases)\n- Match elastic modulus to bone (≈20 GPa)\n- Optimize surface characteristics' :
      category.id === 'marine-alloys' ?
        '- Maximize pitting and crevice corrosion resistance\n- Consider galvanic compatibility\n- Optimize for seawater environments' :
      'Apply standard optimization principles for this category'
      }
      
      Generate an industry-competitive composition:
      
      Return as JSON:
      {
        "name": "Descriptive alloy designation",
        "elements": [{"symbol": "Fe", "percentage": 85.5, "role": "matrix former", "contribution": "structural integrity"}, ...],
        "targetProperties": {
          "tensileStrength": 750,
          "yieldStrength": 650,
          "elongation": 18,
          "hardness": 250
        },
        "microstructure": "Expected phases and microstructural features",
        "heatTreatment": "Recommended thermal processing",
        "applications": ["specific application1", "specific application2"],
        "advantages": ["key advantage1", "key advantage2"],
        "processingNotes": "Manufacturing and fabrication guidance",
        "confidence": 94
      }
      
      Ensure the composition follows industry standards and metallurgical principles for ${category.name.toLowerCase()}.
      `;

      const result = await spark.llm(prompt, 'gpt-4o', true);
      const alloyDesign = JSON.parse(result);
      
      if (alloyDesign.elements && Array.isArray(alloyDesign.elements)) {
        const composition = alloyDesign.elements.map((e: any) => ({
          element: {
            symbol: e.symbol,
            name: e.symbol,
            atomicNumber: 0,
            category: 'metal' as const
          },
          percentage: e.percentage
        }));
        
        onCategoryGenerated(composition);
        
        toast.success(`🔧 Generated ${category.name}: ${alloyDesign.name}`, {
          description: alloyDesign.microstructure || `Optimized ${category.name.toLowerCase()} composition`,
          duration: 8000
        });
        
        // Show target properties
        if (alloyDesign.targetProperties) {
          setTimeout(() => {
            const properties = Object.entries(alloyDesign.targetProperties)
              .slice(0, 2)
              .map(([prop, value]) => `${prop}: ${value}`)
              .join(', ');
            toast.info('Target Properties', {
              description: properties,
              duration: 6000
            });
          }, 2000);
        }
        
        // Show processing notes
        if (alloyDesign.heatTreatment) {
          setTimeout(() => {
            toast.info('Heat Treatment', {
              description: alloyDesign.heatTreatment,
              duration: 7000
            });
          }, 4000);
        }
      }
    } catch (error) {
      console.error('Category generation failed:', error);
      
      // Generate fallback composition based on category
      const fallbackComposition = generateFallbackComposition(category);
      onCategoryGenerated(fallbackComposition);
      
      toast.success(`Generated ${category.name} (fallback mode)`, {
        description: 'Using industry-standard composition principles'
      });
    } finally {
      setIsGenerating(false);
      onOptimizationEnd?.();
    }
  };

  const generateFallbackComposition = (category: MaterialCategory): Array<{ element: Element; percentage: number }> => {
    const compositions: { [key: string]: Array<{ symbol: string; percentage: number }> } = {
      'structural-steels': [
        { symbol: 'Fe', percentage: 97.0 },
        { symbol: 'C', percentage: 0.25 },
        { symbol: 'Mn', percentage: 1.5 },
        { symbol: 'Si', percentage: 0.3 },
        { symbol: 'Cr', percentage: 0.5 },
        { symbol: 'Mo', percentage: 0.2 },
        { symbol: 'V', percentage: 0.05 },
        { symbol: 'Nb', percentage: 0.03 }
      ],
      'aerospace-alloys': [
        { symbol: 'Al', percentage: 90.0 },
        { symbol: 'Zn', percentage: 5.5 },
        { symbol: 'Mg', percentage: 2.5 },
        { symbol: 'Cu', percentage: 1.5 },
        { symbol: 'Cr', percentage: 0.2 },
        { symbol: 'Zr', percentage: 0.1 }
      ],
      'biomedical-alloys': [
        { symbol: 'Ti', percentage: 90.0 },
        { symbol: 'Al', percentage: 6.0 },
        { symbol: 'V', percentage: 4.0 }
      ],
      'superalloys': [
        { symbol: 'Ni', percentage: 58.0 },
        { symbol: 'Cr', percentage: 19.0 },
        { symbol: 'Fe', percentage: 18.0 },
        { symbol: 'Nb', percentage: 5.0 }
      ]
    };

    const defaultComposition = compositions[category.id] || [
      { symbol: category.baseElements[0], percentage: 95.0 },
      { symbol: category.alloyingElements[0], percentage: 3.0 },
      { symbol: category.alloyingElements[1], percentage: 2.0 }
    ];

    return defaultComposition.map(item => ({
      element: {
        symbol: item.symbol,
        name: item.symbol,
        atomicNumber: 0,
        category: 'metal' as const
      },
      percentage: item.percentage
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'text-green-600';
      case 'intermediate': return 'text-blue-600';
      case 'advanced': return 'text-yellow-600';
      case 'expert': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-yellow-100 text-yellow-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-orange-600" />
          Material Categories Laboratory
          <Badge variant="outline" className="bg-orange-100 text-orange-700">
            🏭 Industry Standard
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate specialized alloy compositions optimized for specific industry applications and performance requirements.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Quick Category Selection */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {MATERIAL_CATEGORIES.slice(0, 6).map((category) => (
            <Card key={category.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <h5 className="font-medium text-sm">{category.name}</h5>
                  </div>
                  <Badge className={getDifficultyBadge(category.difficulty)}>
                    {category.difficulty}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground">{category.description}</p>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium">Base Elements:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.baseElements.map(el => (
                        <Badge key={el} variant="outline" className="text-xs font-mono">{el}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium">Key Properties:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.keyProperties.slice(0, 2).map(prop => (
                        <span key={prop} className="text-xs text-blue-600">• {prop}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => generateCategoryAlloy(category.id)}
                  disabled={isGenerating || isOptimizing}
                  className="w-full"
                  variant="outline"
                >
                  <Target className="mr-2 h-3 w-3" />
                  Generate {category.name}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Advanced Categories */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Atom className="h-4 w-4" />
            Advanced Categories
          </h4>
          
          <div className="grid gap-3 md:grid-cols-2">
            {MATERIAL_CATEGORIES.slice(6).map((category) => (
              <Card key={category.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <h5 className="font-medium">{category.name}</h5>
                    </div>
                    <Badge className={getDifficultyBadge(category.difficulty)}>
                      {category.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium">Applications:</p>
                      <div className="flex flex-wrap gap-1">
                        {category.applications.slice(0, 2).map(app => (
                          <span key={app} className="text-xs text-green-600">• {app}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium">Design Principles:</p>
                      <div className="text-xs text-muted-foreground">
                        {category.designPrinciples[0]}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium">Examples:</p>
                      <div className="flex flex-wrap gap-1">
                        {category.examples.slice(0, 2).map(example => (
                          <Badge key={example} variant="secondary" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => generateCategoryAlloy(category.id)}
                    disabled={isGenerating || isOptimizing}
                    className="w-full"
                    variant={category.difficulty === 'expert' ? 'default' : 'outline'}
                  >
                    {isGenerating ? (
                      <>
                        <Atom className="mr-2 h-3 w-3 animate-pulse" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-3 w-3" />
                        Generate Specialized Alloy
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Industry Applications Alert */}
        <Alert className="border-orange-200 bg-orange-50/50">
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium text-sm">🏭 Industry-Standard Materials</p>
              <p className="text-xs">
                These categories represent proven materials used across industries. Each composition is optimized 
                for specific applications using established metallurgical principles and industry best practices.
              </p>
              <p className="text-xs">
                <strong>Difficulty levels:</strong> Basic (standard compositions) → Expert (advanced superalloys and specialized materials)
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}