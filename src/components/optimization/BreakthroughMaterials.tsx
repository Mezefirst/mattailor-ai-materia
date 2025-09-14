import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Rocket, 
  Atom, 
  Lightning, 
  Sparkles, 
  Target,
  Beaker,
  TrendingUp,
  Zap,
  FlaskConical,
  Lightbulb,
  Settings
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Element } from '@/components/periodic/PeriodicTable';

interface BreakthroughMaterialsProps {
  selectedElements: Array<{ element: Element; percentage: number }>;
  onBreakthroughGenerated: (composition: Array<{ element: Element; percentage: number }>) => void;
  onOptimizationStart?: () => void;
  onOptimizationEnd?: () => void;
  isOptimizing: boolean;
}

interface BreakthroughConcept {
  name: string;
  description: string;
  baseElements: string[];
  innovativeElements: string[];
  targetApplications: string[];
  keyProperties: string[];
  trl: number; // Technology Readiness Level
  difficulty: 'moderate' | 'challenging' | 'extreme';
}

interface OptimizationTarget {
  property: string;
  weight: number;
  constraints: { min?: number; max?: number; target?: number };
}

const BREAKTHROUGH_CONCEPTS: BreakthroughConcept[] = [
  {
    name: 'Quantum-Enhanced Alloys',
    description: 'Leverage quantum mechanical effects for unprecedented material properties',
    baseElements: ['Ti', 'V', 'Cr', 'Mn', 'Fe'],
    innovativeElements: ['Sc', 'Y', 'La', 'Gd'],
    targetApplications: ['Quantum computing', 'Superconducting systems', 'Precision instruments'],
    keyProperties: ['Ultra-low electrical resistance', 'Magnetic flux pinning', 'Thermal stability'],
    trl: 2,
    difficulty: 'extreme'
  },
  {
    name: 'Biomimetic Smart Alloys',
    description: 'Self-healing and adaptive materials inspired by biological systems',
    baseElements: ['Ti', 'Ni', 'Cu', 'Zn'],
    innovativeElements: ['Mg', 'Ca', 'Sr', 'Ba'],
    targetApplications: ['Medical implants', 'Aerospace structures', 'Automotive safety'],
    keyProperties: ['Self-healing', 'Biocompatibility', 'Shape memory', 'Corrosion resistance'],
    trl: 4,
    difficulty: 'challenging'
  },
  {
    name: 'Ultra-Light Superalloys',
    description: 'Next-generation lightweight materials with superior strength',
    baseElements: ['Al', 'Mg', 'Li', 'Be'],
    innovativeElements: ['Sc', 'Ti', 'V', 'Zr'],
    targetApplications: ['Aerospace structures', 'Electric vehicle frames', 'Spacecraft'],
    keyProperties: ['Ultra-low density', 'High strength-to-weight', 'Fatigue resistance'],
    trl: 5,
    difficulty: 'moderate'
  },
  {
    name: 'Radiation-Immune Alloys',
    description: 'Materials engineered for extreme radiation environments',
    baseElements: ['W', 'Ta', 'Re', 'Os'],
    innovativeElements: ['Ir', 'Pt', 'Au', 'Pb'],
    targetApplications: ['Nuclear reactors', 'Space exploration', 'Medical imaging'],
    keyProperties: ['Radiation resistance', 'High melting point', 'Neutron absorption'],
    trl: 3,
    difficulty: 'extreme'
  },
  {
    name: 'Multifunctional Metamaterials',
    description: 'Engineered materials with programmable properties',
    baseElements: ['Fe', 'Co', 'Ni', 'Cu'],
    innovativeElements: ['Nd', 'Sm', 'Dy', 'Tb'],
    targetApplications: ['Smart structures', 'Electromagnetic shielding', 'Energy harvesting'],
    keyProperties: ['Negative Poisson ratio', 'Tunable electromagnetic response', 'Programmable stiffness'],
    trl: 3,
    difficulty: 'challenging'
  },
  {
    name: 'Cryogenic Superalloys',
    description: 'Materials optimized for extreme low-temperature applications',
    baseElements: ['Ni', 'Co', 'Fe', 'Cr'],
    innovativeElements: ['Ru', 'Rh', 'Pd', 'Ag'],
    targetApplications: ['Liquid hydrogen systems', 'Cryogenic engines', 'Superconducting magnets'],
    keyProperties: ['Cryogenic ductility', 'Low thermal expansion', 'Hydrogen compatibility'],
    trl: 4,
    difficulty: 'challenging'
  }
];

const INNOVATION_STRATEGIES = [
  'Atomic-scale engineering',
  'Quantum coherence effects',
  'Biomimetic principles',
  'Entropy maximization',
  'Phase transformation control',
  'Grain boundary engineering',
  'Defect engineering',
  'Compositional gradients',
  'Multi-scale architecture',
  'Synergistic element interactions'
];

export function BreakthroughMaterials({ 
  selectedElements, 
  onBreakthroughGenerated, 
  onOptimizationStart, 
  onOptimizationEnd,
  isOptimizing 
}: BreakthroughMaterialsProps) {
  const [selectedConcept, setSelectedConcept] = useState<string>('');
  const [customTargets, setCustomTargets] = useState<OptimizationTarget[]>([
    { property: 'strength', weight: 30, constraints: { min: 1000 } },
    { property: 'density', weight: 25, constraints: { max: 5.0 } },
    { property: 'corrosion_resistance', weight: 20, constraints: { min: 8 } },
    { property: 'cost_efficiency', weight: 15, constraints: { min: 7 } },
    { property: 'sustainability', weight: 10, constraints: { min: 8 } }
  ]);
  const [innovationLevel, setInnovationLevel] = useState(75);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<any>(null);

  const generateBreakthroughFromConcept = async (conceptName: string) => {
    const concept = BREAKTHROUGH_CONCEPTS.find(c => c.name === conceptName);
    if (!concept) {
      toast.error('Concept not found');
      return;
    }

    setIsGenerating(true);
    onOptimizationStart?.();

    try {
      const prompt = spark.llmPrompt`
      You are a visionary materials scientist working on breakthrough ${concept.name} materials in ${new Date().getFullYear() + 2}.
      
      Concept: ${concept.description}
      Base Elements: ${concept.baseElements.join(', ')}
      Innovative Elements: ${concept.innovativeElements.join(', ')}
      Target Applications: ${concept.targetApplications.join(', ')}
      Key Properties: ${concept.keyProperties.join(', ')}
      Technology Readiness Level: ${concept.trl}/9
      Difficulty: ${concept.difficulty}
      
      Advanced Design Criteria:
      1. Leverage cutting-edge materials science principles
      2. Incorporate multi-scale design approaches (atomic to macro)
      3. Exploit quantum mechanical effects where applicable
      4. Consider processing-structure-property relationships
      5. Optimize for multiple conflicting objectives simultaneously
      6. Ensure scalable manufacturing feasibility
      7. Address sustainability and lifecycle considerations
      
      Innovation Strategies to Consider:
      ${INNOVATION_STRATEGIES.map(strategy => `- ${strategy}`).join('\n')}
      
      Breakthrough Requirements:
      - Must achieve properties 2-5x better than current best-in-class
      - Combine at least 2 traditionally incompatible properties
      - Enable entirely new applications or performance regimes
      - Demonstrate scientific or technological breakthrough potential
      
      For ${concept.name}:
      - Focus on ${concept.keyProperties.join(' + ')}
      - Target ${concept.targetApplications[0]} as primary application
      - Consider ${concept.difficulty} difficulty level challenges
      - Aim for TRL advancement from ${concept.trl} to ${concept.trl + 2}
      
      Generate a revolutionary composition with:
      1. Optimized element selection and percentages
      2. Novel processing requirements
      3. Expected breakthrough properties
      4. Scientific innovation rationale
      5. Manufacturing pathway
      6. Risk assessment and mitigation
      
      Return as JSON:
      {
        "name": "Descriptive breakthrough material name",
        "elements": [{"symbol": "Ti", "percentage": 25.3, "role": "primary strengthening phase", "innovation": "quantum coherence stabilization"}, ...],
        "breakthroughProperties": {
          "property1": {"value": 2500, "unit": "MPa", "improvement": "5x current best"},
          "property2": {"value": 1.8, "unit": "g/cm³", "improvement": "50% lighter"}
        },
        "innovationPrinciples": ["principle1", "principle2"],
        "processingInnovations": ["novel technique1", "breakthrough method2"],
        "performanceMultipliers": {"strength": 5.2, "weight": 0.5, "durability": 8.0},
        "manufacturingPathway": "detailed manufacturing approach",
        "technologyReadiness": 4,
        "riskAssessment": "major technical challenges and mitigation strategies",
        "confidence": 78
      }
      `;

      const result = await spark.llm(prompt, 'gpt-4o', true);
      const breakthrough = JSON.parse(result);
      
      if (breakthrough.elements && Array.isArray(breakthrough.elements)) {
        const composition = breakthrough.elements.map((e: any) => ({
          element: {
            symbol: e.symbol,
            name: e.symbol,
            atomicNumber: 0,
            category: 'metal' as const
          },
          percentage: e.percentage
        }));
        
        onBreakthroughGenerated(composition);
        setLastGenerated(breakthrough);
        
        toast.success(`🚀 Breakthrough: ${breakthrough.name}`, {
          description: `Revolutionary ${concept.name.toLowerCase()} material generated`,
          duration: 8000
        });
        
        // Show performance improvements
        setTimeout(() => {
          const improvements = Object.entries(breakthrough.performanceMultipliers || {})
            .map(([prop, mult]: [string, any]) => `${prop}: ${mult}x`)
            .join(' • ');
          toast.info('Performance Multipliers', {
            description: improvements || 'Significant property improvements achieved',
            duration: 6000
          });
        }, 2000);
        
        // Show innovation principles
        setTimeout(() => {
          toast.info('Innovation Principles', {
            description: breakthrough.innovationPrinciples?.join(' • ') || 'Advanced materials science principles applied',
            duration: 7000
          });
        }, 4000);
      }
    } catch (error) {
      console.error('Breakthrough generation failed:', error);
      toast.error('Breakthrough generation failed', {
        description: 'Using advanced fallback composition'
      });
      
      // Generate fallback breakthrough composition
      const allElements = [...concept.baseElements, ...concept.innovativeElements.slice(0, 2)];
      const composition = allElements.map(symbol => ({
        element: {
          symbol,
          name: symbol,
          atomicNumber: 0,
          category: 'metal' as const
        },
        percentage: 100 / allElements.length
      }));
      
      onBreakthroughGenerated(composition);
    } finally {
      setIsGenerating(false);
      onOptimizationEnd?.();
    }
  };

  const generateCustomBreakthrough = async () => {
    setIsGenerating(true);
    onOptimizationStart?.();

    try {
      const weightsStr = customTargets
        .map(t => `${t.property}: ${t.weight}% weight`)
        .join(', ');
      
      const constraintsStr = customTargets
        .map(t => {
          const constraintParts = [];
          if (t.constraints.min) constraintParts.push(`min: ${t.constraints.min}`);
          if (t.constraints.max) constraintParts.push(`max: ${t.constraints.max}`);
          if (t.constraints.target) constraintParts.push(`target: ${t.constraints.target}`);
          return `${t.property}: ${constraintParts.join(', ')}`;
        })
        .join(' | ');

      const prompt = spark.llmPrompt`
      Design a completely revolutionary breakthrough material that pushes the boundaries of what's possible in ${new Date().getFullYear() + 3}.
      
      Innovation Level: ${innovationLevel}% (where 100% = impossible with current science)
      
      Multi-Objective Optimization:
      Weights: ${weightsStr}
      Constraints: ${constraintsStr}
      
      Current Element Selection Context:
      ${selectedElements.length > 0 ? 
        `Existing elements: ${selectedElements.map(e => `${e.element.symbol} (${e.percentage.toFixed(1)}%)`).join(', ')}` :
        'Starting from blank slate - recommend revolutionary element combinations'
      }
      
      Revolutionary Design Requirements:
      1. Achieve performance levels previously thought impossible
      2. Solve fundamental materials science challenges
      3. Enable breakthrough technologies in multiple fields
      4. Demonstrate novel physical phenomena or effects
      5. Combine incompatible properties through innovative mechanisms
      6. Push the limits of atomic-scale engineering
      7. Consider quantum effects, emergent properties, and phase transitions
      
      Advanced Innovation Areas:
      - Negative thermal expansion + high strength
      - Self-healing + ultra-light weight
      - Superconducting + structural integrity
      - Transparent + ultra-strong
      - Programmable properties + durability
      - Bio-integrated + high performance
      - Multi-phase + single-crystal behavior
      - Quantum coherent + macroscopic scale
      
      Revolutionary Elements to Consider:
      - Rare earth elements for unique electronic properties
      - Actinides for nuclear applications (if safe)
      - Light elements for ultra-low density
      - Refractory elements for extreme conditions  
      - Noble metals for stability and functionality
      - Metalloids for semiconductor properties
      - Radioactive isotopes for energy applications (theoretical)
      
      Generate the most ambitious yet scientifically grounded breakthrough composition:
      
      Return as JSON:
      {
        "name": "Revolutionary material name",
        "elements": [{"symbol": "Element", "percentage": X.X, "role": "specific function", "breakthrough": "novel mechanism"}, ...],
        "revolutionaryProperties": {
          "impossibleCombination1": "description of breakthrough",
          "impossibleCombination2": "description of breakthrough"
        },
        "physicalPhenomena": ["novel effect1", "unprecedented behavior2"],
        "breakthroughMechanisms": ["atomic-scale innovation", "quantum effect"],
        "performanceLeaps": {"property": "10x improvement description"},
        "enabledTechnologies": ["technology1", "technology2"],
        "scientificNovelty": "fundamental breakthrough description",
        "feasibilityAnalysis": "realistic path to development",
        "confidence": 65
      }
      
      Be as ambitious as the innovation level allows while maintaining scientific plausibility.
      `;

      const result = await spark.llm(prompt, 'gpt-4o', true);
      const breakthrough = JSON.parse(result);
      
      if (breakthrough.elements && Array.isArray(breakthrough.elements)) {
        const composition = breakthrough.elements.map((e: any) => ({
          element: {
            symbol: e.symbol,
            name: e.symbol,
            atomicNumber: 0,
            category: 'metal' as const
          },
          percentage: e.percentage
        }));
        
        onBreakthroughGenerated(composition);
        setLastGenerated(breakthrough);
        
        toast.success(`🌟 Revolutionary: ${breakthrough.name}`, {
          description: breakthrough.scientificNovelty || 'Breakthrough material with revolutionary properties',
          duration: 10000
        });
        
        // Show enabled technologies
        setTimeout(() => {
          toast.info('Enabled Technologies', {
            description: breakthrough.enabledTechnologies?.join(' • ') || 'Next-generation applications possible',
            duration: 8000
          });
        }, 2500);
      }
    } catch (error) {
      console.error('Custom breakthrough generation failed:', error);
      toast.error('Revolutionary generation failed', {
        description: 'Generating advanced alternative composition'
      });
      
      // Generate a highly innovative fallback
      const revolutionaryElements = ['Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni'];
      const composition = revolutionaryElements.slice(0, 6).map(symbol => ({
        element: {
          symbol,
          name: symbol,
          atomicNumber: 0,
          category: 'metal' as const
        },
        percentage: 100 / 6
      }));
      
      onBreakthroughGenerated(composition);
    } finally {
      setIsGenerating(false);
      onOptimizationEnd?.();
    }
  };

  const updateTargetWeight = (index: number, weight: number) => {
    setCustomTargets(prev => prev.map((target, i) => 
      i === index ? { ...target, weight } : target
    ));
  };

  const getTRLColor = (trl: number) => {
    if (trl <= 3) return 'text-red-600';
    if (trl <= 6) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'moderate': return 'text-green-600';
      case 'challenging': return 'text-yellow-600';
      case 'extreme': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-blue-600" />
          Breakthrough Materials Laboratory
          <Badge variant="outline" className="bg-blue-100 text-blue-700">
            🔬 Revolutionary Science
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Push the boundaries of materials science with revolutionary compositions and breakthrough property combinations.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="concepts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="concepts">Breakthrough Concepts</TabsTrigger>
            <TabsTrigger value="custom">Custom Revolution</TabsTrigger>
            <TabsTrigger value="results">Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="concepts" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {BREAKTHROUGH_CONCEPTS.map((concept) => (
                <Card key={concept.name} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">{concept.name}</h5>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getTRLColor(concept.trl)}>
                          TRL {concept.trl}
                        </Badge>
                        <Badge variant="secondary" className={getDifficultyColor(concept.difficulty)}>
                          {concept.difficulty}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{concept.description}</p>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium">Base Elements:</p>
                        <div className="flex flex-wrap gap-1">
                          {concept.baseElements.map(el => (
                            <Badge key={el} variant="outline" className="text-xs font-mono">{el}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium">Innovation Elements:</p>
                        <div className="flex flex-wrap gap-1">
                          {concept.innovativeElements.map(el => (
                            <Badge key={el} variant="secondary" className="text-xs font-mono">{el}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium">Key Properties:</p>
                        <div className="flex flex-wrap gap-1">
                          {concept.keyProperties.slice(0, 2).map(prop => (
                            <span key={prop} className="text-xs text-green-600">• {prop}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => generateBreakthroughFromConcept(concept.name)}
                      disabled={isGenerating || isOptimizing}
                      className="w-full"
                      variant={concept.difficulty === 'extreme' ? 'default' : 'outline'}
                    >
                      <Sparkles className="mr-2 h-3 w-3" />
                      Generate Breakthrough
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Innovation Level: {innovationLevel}%</label>
                <Slider
                  value={[innovationLevel]}
                  onValueChange={([value]) => setInnovationLevel(value)}
                  min={50}
                  max={95}
                  step={5}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {innovationLevel >= 90 ? '🌟 Theoretical breakthrough' : 
                   innovationLevel >= 80 ? '🚀 Revolutionary advance' :
                   innovationLevel >= 70 ? '⚡ Major innovation' : '💡 Significant improvement'}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Multi-Objective Optimization
                </h4>
                <div className="space-y-3">
                  {customTargets.map((target, index) => (
                    <div key={target.property} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm capitalize">{target.property.replace('_', ' ')}</p>
                        <p className="text-xs text-muted-foreground">
                          {target.constraints.min && `Min: ${target.constraints.min}`}
                          {target.constraints.max && ` Max: ${target.constraints.max}`}
                          {target.constraints.target && ` Target: ${target.constraints.target}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[target.weight]}
                          onValueChange={([value]) => updateTargetWeight(index, value)}
                          min={5}
                          max={50}
                          step={5}
                          className="w-20"
                        />
                        <span className="text-sm font-medium w-8">{target.weight}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={generateCustomBreakthrough}
                disabled={isGenerating || isOptimizing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Lightning className="mr-2 h-4 w-4 animate-pulse" />
                    Generating Revolutionary Material...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate Revolutionary Breakthrough
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            {lastGenerated ? (
              <div className="space-y-4">
                <Alert className="border-blue-200 bg-blue-50/50">
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">{lastGenerated.name}</p>
                      <p className="text-sm">{lastGenerated.scientificNovelty || 'Revolutionary breakthrough material'}</p>
                      {lastGenerated.confidence && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs">Confidence:</span>
                          <Progress value={lastGenerated.confidence} className="w-20 h-2" />
                          <span className="text-xs">{lastGenerated.confidence}%</span>
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
                
                {lastGenerated.revolutionaryProperties && (
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Revolutionary Properties</h4>
                    <div className="space-y-2">
                      {Object.entries(lastGenerated.revolutionaryProperties).map(([prop, desc]: [string, any]) => (
                        <div key={prop} className="flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          <div>
                            <p className="font-medium text-sm capitalize">{prop.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="text-xs text-muted-foreground">{desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
                
                {lastGenerated.enabledTechnologies && (
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Enabled Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {lastGenerated.enabledTechnologies.map((tech: string) => (
                        <Badge key={tech} variant="outline">{tech}</Badge>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            ) : (
              <Alert>
                <FlaskConical className="h-4 w-4" />
                <AlertDescription>
                  Generate a breakthrough material to see detailed analysis and properties.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}