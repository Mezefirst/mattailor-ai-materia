import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Atom, FlaskConical, Zap, Target, TrendingUp, Lightbulb, Beaker, Gauge } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Element } from '@/components/periodic/PeriodicTable';

interface HighEntropyAlloysProps {
  selectedElements: Array<{ element: Element; percentage: number }>;
  onHEAGenerated: (composition: Array<{ element: Element; percentage: number }>) => void;
  onOptimizationStart?: () => void;
  onOptimizationEnd?: () => void;
  isOptimizing: boolean;
}

interface HEAPreset {
  name: string;
  description: string;
  elements: string[];
  properties: string[];
  applications: string[];
  category: 'mechanical' | 'thermal' | 'electrical' | 'magnetic' | 'corrosion';
}

interface HEAConfiguration {
  entropyLevel: 'medium' | 'high' | 'ultra-high';
  targetProperty: 'strength' | 'ductility' | 'thermal' | 'electrical' | 'corrosion' | 'wear';
  complexity: 'simple' | 'advanced' | 'breakthrough';
  elementCount: number;
}

const HEA_PRESETS: HEAPreset[] = [
  {
    name: 'CoCrFeMnNi (Cantor Alloy)',
    description: 'The original equiatomic high-entropy alloy with excellent mechanical properties',
    elements: ['Co', 'Cr', 'Fe', 'Mn', 'Ni'],
    properties: ['High strength', 'Excellent ductility', 'Good toughness', 'Phase stability'],
    applications: ['Structural components', 'Cryogenic applications', 'Nuclear materials'],
    category: 'mechanical'
  },
  {
    name: 'AlCoCrFeNi',
    description: 'Al-containing HEA with enhanced strength and reduced density',
    elements: ['Al', 'Co', 'Cr', 'Fe', 'Ni'],
    properties: ['High strength', 'Low density', 'Good oxidation resistance'],
    applications: ['Aerospace structures', 'High-temperature components'],
    category: 'mechanical'
  },
  {
    name: 'CoCrFeNiTi',
    description: 'Ti-enhanced HEA for superior strength and biocompatibility',
    elements: ['Co', 'Cr', 'Fe', 'Ni', 'Ti'],
    properties: ['Ultra-high strength', 'Biocompatible', 'Corrosion resistant'],
    applications: ['Medical implants', 'Aerospace fasteners', 'Tool materials'],
    category: 'mechanical'
  },
  {
    name: 'CoCrCuFeNi',
    description: 'Cu-containing HEA with enhanced electrical conductivity',
    elements: ['Co', 'Cr', 'Cu', 'Fe', 'Ni'],
    properties: ['Good electrical conductivity', 'Antimicrobial', 'Moderate strength'],
    applications: ['Electrical contacts', 'Antimicrobial surfaces', 'Electronics'],
    category: 'electrical'
  },
  {
    name: 'AlCrFeCoNiTi',
    description: 'Six-element ultra-high entropy alloy for extreme applications',
    elements: ['Al', 'Cr', 'Fe', 'Co', 'Ni', 'Ti'],
    properties: ['Ultra-high entropy', 'Exceptional phase stability', 'Multi-functional'],
    applications: ['Extreme environments', 'Nuclear applications', 'Space exploration'],
    category: 'thermal'
  },
  {
    name: 'MoNbTaW (Refractory HEA)',
    description: 'Refractory high-entropy alloy for ultra-high temperature applications',
    elements: ['Mo', 'Nb', 'Ta', 'W'],
    properties: ['Ultra-high melting point', 'Exceptional creep resistance', 'Thermal stability'],
    applications: ['Jet engine components', 'Nuclear reactors', 'Rocket nozzles'],
    category: 'thermal'
  },
  {
    name: 'AlCoCrFeNiV',
    description: 'Vanadium-enhanced HEA with superior wear resistance',
    elements: ['Al', 'Co', 'Cr', 'Fe', 'Ni', 'V'],
    properties: ['Excellent wear resistance', 'High hardness', 'Thermal stability'],
    applications: ['Cutting tools', 'Wear-resistant coatings', 'Die materials'],
    category: 'mechanical'
  }
];

const ELEMENT_POOLS = {
  '3d-transition': ['Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn'],
  '4d-transition': ['Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd'],
  '5d-transition': ['Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg'],
  'light-metals': ['Al', 'Mg', 'Li', 'Be'],
  'refractory': ['Ti', 'V', 'Cr', 'Zr', 'Nb', 'Mo', 'Hf', 'Ta', 'W', 'Re'],
  'noble': ['Cu', 'Ag', 'Au', 'Pd', 'Pt', 'Rh', 'Ir'],
  'ferromagnetic': ['Fe', 'Co', 'Ni'],
  'rare-earth': ['Y', 'La', 'Ce', 'Pr', 'Nd', 'Gd', 'Dy', 'Er']
};

export function HighEntropyAlloys({ 
  selectedElements, 
  onHEAGenerated, 
  onOptimizationStart, 
  onOptimizationEnd,
  isOptimizing 
}: HighEntropyAlloysProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [heaConfig, setHeaConfig] = useState<HEAConfiguration>({
    entropyLevel: 'high',
    targetProperty: 'strength',
    complexity: 'advanced',
    elementCount: 5
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [customElementPools, setCustomElementPools] = useState<string[]>(['3d-transition']);
  const [entropyScore, setEntropyScore] = useState<number | null>(null);

  const calculateConfigurationEntropy = (elements: Array<{ element: Element; percentage: number }>) => {
    if (elements.length < 4) return 0;
    
    // Calculate configurational entropy using Boltzmann's equation
    // S_conf = -R * Σ(xi * ln(xi))
    const R = 8.314; // Gas constant
    let entropy = 0;
    
    for (const item of elements) {
      const xi = item.percentage / 100;
      if (xi > 0) {
        entropy -= xi * Math.log(xi);
      }
    }
    
    entropy *= R;
    
    // Normalize to 0-100 scale for display
    const maxEntropy = R * Math.log(elements.length); // Maximum entropy for equal composition
    return (entropy / maxEntropy) * 100;
  };

  const generateHEAFromPreset = async (presetName: string) => {
    const preset = HEA_PRESETS.find(p => p.name === presetName);
    if (!preset) {
      toast.error('Preset not found');
      return;
    }

    setIsGenerating(true);
    onOptimizationStart?.();

    try {
      // Generate equal atomic percentages for the preset elements
      const equalPercentage = 100 / preset.elements.length;
      const composition = preset.elements.map(symbol => ({
        element: {
          symbol,
          name: symbol, // Simplified - would need full element data
          atomicNumber: 0, // Would need to be looked up
          category: 'metal' as const
        },
        percentage: equalPercentage
      }));

      // Add some intelligent variation for better properties
      const optimizedComposition = await optimizeHEAComposition(composition, preset.category);
      
      onHEAGenerated(optimizedComposition);
      
      const entropy = calculateConfigurationEntropy(optimizedComposition);
      setEntropyScore(entropy);
      
      toast.success(`Generated ${preset.name}`, {
        description: `${preset.elements.length}-element HEA with ${entropy.toFixed(1)}% configurational entropy`,
        duration: 5000
      });
    } catch (error) {
      console.error('HEA generation failed:', error);
      toast.error('Failed to generate HEA', {
        description: 'Using basic equal-atomic composition'
      });
      
      // Fallback to equal atomic composition
      const equalPercentage = 100 / preset.elements.length;
      const fallbackComposition = preset.elements.map(symbol => ({
        element: {
          symbol,
          name: symbol,
          atomicNumber: 0,
          category: 'metal' as const
        },
        percentage: equalPercentage
      }));
      
      onHEAGenerated(fallbackComposition);
    } finally {
      setIsGenerating(false);
      onOptimizationEnd?.();
    }
  };

  const optimizeHEAComposition = async (
    composition: Array<{ element: Element; percentage: number }>,
    targetCategory: string
  ) => {
    const prompt = spark.llmPrompt`
    You are a world-class materials scientist specializing in high-entropy alloys (HEAs). 
    Optimize this HEA composition for maximum ${targetCategory} performance while maintaining high configurational entropy.
    
    Current composition: ${composition.map(c => `${c.element.symbol}: ${c.percentage.toFixed(1)}%`).join(', ')}
    
    HEA Design Principles:
    1. Maintain configurational entropy ≥ 1.5R for true HEA behavior
    2. Consider atomic size differences (δ ≤ 6.6% for single-phase)
    3. Balance enthalpy of mixing for phase stability
    4. Optimize valence electron concentration (VEC) for desired phases
    5. Consider electronegativity differences for bond strength
    
    Optimization Rules:
    - For mechanical properties: Balance FCC/BCC phases, optimize grain refinement
    - For thermal properties: Maximize phonon scattering, optimize thermal stability
    - For electrical properties: Control electron scattering mechanisms
    - For corrosion resistance: Ensure passive film stability
    
    Element-specific considerations:
    - Al: Promotes BCC, reduces density, increases strength but may reduce ductility
    - Cr: Excellent corrosion resistance, promotes BCC at high concentrations
    - Fe, Co, Ni: Form stable FCC phase, good ductility and toughness
    - Ti: Lightweight, high strength, but can form brittle intermetallics
    - Cu: Good conductivity but may cause phase separation
    - Mn: Stabilizes FCC, but can form brittle σ-phase
    
    Return optimized composition as JSON:
    {
      "elements": [{"symbol": "Fe", "percentage": 22.5, "role": "structural stability"}, ...],
      "reasoning": "Optimization strategy and phase predictions",
      "expectedPhases": ["FCC", "BCC"],
      "configurationalEntropy": 1.8,
      "designStrategy": "Balanced approach for strength-ductility combination",
      "processingRecommendations": "Homogenization and aging treatments"
    }
    
    Ensure percentages sum to exactly 100% and maintain true HEA criteria.
    `;

    try {
      const result = await spark.llm(prompt, 'gpt-4o', true);
      const optimization = JSON.parse(result);
      
      if (optimization.elements && Array.isArray(optimization.elements)) {
        return composition.map(item => {
          const optimizedElement = optimization.elements.find((e: any) => e.symbol === item.element.symbol);
          return {
            ...item,
            percentage: optimizedElement ? optimizedElement.percentage : item.percentage
          };
        });
      }
    } catch (error) {
      console.error('HEA optimization failed:', error);
    }
    
    return composition; // Return original if optimization fails
  };

  const generateBreakthroughHEA = async () => {
    setIsGenerating(true);
    onOptimizationStart?.();

    try {
      const prompt = spark.llmPrompt`
      Generate a breakthrough high-entropy alloy composition for the ${new Date().getFullYear() + 1} era. 
      Create something that pushes the boundaries of materials science.
      
      Requirements:
      - ${heaConfig.elementCount} elements minimum
      - ${heaConfig.entropyLevel} entropy level
      - Optimized for ${heaConfig.targetProperty}
      - ${heaConfig.complexity} complexity level
      
      Available element pools: ${customElementPools.join(', ')}
      Element pools: ${Object.keys(ELEMENT_POOLS).map(key => `${key}: [${ELEMENT_POOLS[key as keyof typeof ELEMENT_POOLS].join(', ')}]`).join(' | ')}
      
      Breakthrough Strategies:
      1. Multi-principal element approach with unconventional combinations
      2. Exploit atomic size and electronegativity differences
      3. Target specific crystallographic phases (FCC, BCC, HCP combinations)
      4. Consider metastable phases and precipitation strengthening
      5. Incorporate light elements for density reduction
      6. Use refractory elements for high-temperature applications
      7. Add magnetic elements for functional properties
      8. Include biocompatible elements for medical applications
      
      Innovation Areas:
      - Additive manufacturing compatibility
      - Self-healing properties through element diffusion
      - Multi-functional behavior (structural + functional)
      - Extreme environment resistance
      - Sustainable/recyclable compositions
      - Bio-inspired element selections
      
      Return as JSON:
      {
        "name": "Breakthrough alloy name",
        "elements": [{"symbol": "Ti", "percentage": 18.2, "role": "strength and biocompatibility"}, ...],
        "innovationConcept": "Core breakthrough principle",
        "targetProperties": ["ultra-high strength", "self-healing", "etc"],
        "configurationalEntropy": 2.1,
        "expectedPhases": ["FCC", "BCC"],
        "uniqueFeatures": ["feature1", "feature2"],
        "applications": ["application1", "application2"],
        "sustainability": "environmental impact assessment",
        "confidence": 87
      }
      
      Be creative but scientifically grounded. Push boundaries while maintaining feasibility.
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
        
        onHEAGenerated(composition);
        
        const entropy = calculateConfigurationEntropy(composition);
        setEntropyScore(entropy);
        
        toast.success(`🚀 Breakthrough HEA: ${breakthrough.name}`, {
          description: breakthrough.innovationConcept || 'Next-generation high-entropy alloy generated',
          duration: 8000
        });
        
        // Show additional insights
        setTimeout(() => {
          toast.info('Innovation Features', {
            description: breakthrough.uniqueFeatures?.join(' • ') || 'Advanced multi-functional properties',
            duration: 6000
          });
        }, 1500);
        
        setTimeout(() => {
          toast.info('Target Applications', {
            description: breakthrough.applications?.join(' • ') || 'Next-generation engineering applications',
            duration: 6000
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Breakthrough HEA generation failed:', error);
      toast.error('Breakthrough generation failed', {
        description: 'Using advanced fallback strategy'
      });
      
      // Advanced fallback based on configuration
      const fallbackElements = getBreakthroughElements(heaConfig);
      const composition = fallbackElements.map(symbol => ({
        element: {
          symbol,
          name: symbol,
          atomicNumber: 0,
          category: 'metal' as const
        },
        percentage: 100 / fallbackElements.length
      }));
      
      onHEAGenerated(composition);
      setEntropyScore(calculateConfigurationEntropy(composition));
    } finally {
      setIsGenerating(false);
      onOptimizationEnd?.();
    }
  };

  const getBreakthroughElements = (config: HEAConfiguration): string[] => {
    const pools = config.complexity === 'breakthrough' 
      ? ['3d-transition', '4d-transition', 'light-metals', 'refractory']
      : config.complexity === 'advanced'
      ? ['3d-transition', 'light-metals', 'refractory']
      : ['3d-transition'];

    let elements: string[] = [];
    
    // Add elements based on target property
    switch (config.targetProperty) {
      case 'strength':
        elements = ['Ti', 'Cr', 'Fe', 'Co', 'Ni', 'V', 'Nb'];
        break;
      case 'thermal':
        elements = ['Mo', 'W', 'Ta', 'Nb', 'Re', 'Hf'];
        break;
      case 'electrical':
        elements = ['Cu', 'Ag', 'Au', 'Al', 'Ni'];
        break;
      case 'corrosion':
        elements = ['Cr', 'Ni', 'Mo', 'Al', 'Ti'];
        break;
      default:
        elements = ['Fe', 'Co', 'Ni', 'Cr', 'Al', 'Ti'];
    }
    
    return elements.slice(0, config.elementCount);
  };

  // Calculate entropy score for current selection
  React.useEffect(() => {
    if (selectedElements.length >= 4) {
      const entropy = calculateConfigurationEntropy(selectedElements);
      setEntropyScore(entropy);
    } else {
      setEntropyScore(null);
    }
  }, [selectedElements]);

  const getEntropyLevel = (score: number | null) => {
    if (!score) return { level: 'Low', color: 'text-muted-foreground', description: 'Below HEA threshold' };
    if (score < 60) return { level: 'Medium', color: 'text-yellow-600', description: 'Medium entropy alloy' };
    if (score < 80) return { level: 'High', color: 'text-blue-600', description: 'High-entropy alloy' };
    return { level: 'Ultra-High', color: 'text-green-600', description: 'Ultra-high entropy alloy' };
  };

  const entropyInfo = getEntropyLevel(entropyScore);

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          High-Entropy Alloy Laboratory
          <Badge variant="outline" className="bg-purple-100 text-purple-700">
            🧪 Breakthrough Materials
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Explore multi-principal element alloys with unprecedented property combinations through configurational entropy maximization.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Current Composition Entropy Analysis */}
        {selectedElements.length > 0 && (
          <Alert className="border-purple-200 bg-purple-50/50">
            <Gauge className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Current Composition Analysis:</span>
                  <p className="text-xs mt-1">
                    {selectedElements.length} elements • 
                    {entropyScore ? (
                      <>
                        <span className={`font-medium ${entropyInfo.color}`}> {entropyInfo.level} Entropy</span>
                        <span className="text-muted-foreground"> ({entropyScore.toFixed(1)}%)</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground"> Need ≥4 elements for HEA</span>
                    )}
                  </p>
                </div>
                {entropyScore && (
                  <div className="flex items-center gap-2">
                    <Progress value={entropyScore} className="w-20 h-2" />
                    <Badge variant={entropyScore >= 60 ? 'default' : 'secondary'} className="text-xs">
                      {entropyScore >= 80 ? '🌟 Ultra-HEA' : entropyScore >= 60 ? '⚡ HEA' : '📊 MEA'}
                    </Badge>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* HEA Configuration */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              HEA Configuration
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Target Property</label>
                <Select 
                  value={heaConfig.targetProperty} 
                  onValueChange={(value: any) => setHeaConfig(prev => ({ ...prev, targetProperty: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength">🔩 Ultra-High Strength</SelectItem>
                    <SelectItem value="ductility">🔀 Superior Ductility</SelectItem>
                    <SelectItem value="thermal">🔥 Thermal Resistance</SelectItem>
                    <SelectItem value="electrical">⚡ Electrical Properties</SelectItem>
                    <SelectItem value="corrosion">🛡️ Corrosion Resistance</SelectItem>
                    <SelectItem value="wear">⚙️ Wear Resistance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Complexity Level</label>
                <Select 
                  value={heaConfig.complexity} 
                  onValueChange={(value: any) => setHeaConfig(prev => ({ ...prev, complexity: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">🟢 Simple (4-5 elements)</SelectItem>
                    <SelectItem value="advanced">🟡 Advanced (5-7 elements)</SelectItem>
                    <SelectItem value="breakthrough">🔴 Breakthrough (6-10 elements)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Element Count: {heaConfig.elementCount}</label>
                <Slider
                  value={[heaConfig.elementCount]}
                  onValueChange={([value]) => setHeaConfig(prev => ({ ...prev, elementCount: value }))}
                  min={4}
                  max={10}
                  step={1}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Atom className="h-4 w-4" />
              Element Pools
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(ELEMENT_POOLS).map(([pool, elements]) => (
                <Button
                  key={pool}
                  variant={customElementPools.includes(pool) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCustomElementPools(prev => 
                      prev.includes(pool) 
                        ? prev.filter(p => p !== pool)
                        : [...prev, pool]
                    );
                  }}
                  className="h-auto p-2 text-left justify-start"
                >
                  <div>
                    <div className="font-medium">{pool.replace('-', ' ')}</div>
                    <div className="text-xs opacity-75">{elements.slice(0, 3).join(', ')} +{elements.length - 3}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="grid gap-3 md:grid-cols-2">
          <Button
            onClick={generateBreakthroughHEA}
            disabled={isGenerating || isOptimizing}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                Generating Breakthrough...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Generate Breakthrough HEA
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              // Quick generation of Cantor alloy
              const cantorElements = ['Co', 'Cr', 'Fe', 'Mn', 'Ni'].map(symbol => ({
                element: { symbol, name: symbol, atomicNumber: 0, category: 'metal' as const },
                percentage: 20
              }));
              onHEAGenerated(cantorElements);
              setEntropyScore(calculateConfigurationEntropy(cantorElements));
              toast.success('Applied Cantor Alloy (CoCrFeMnNi)', {
                description: 'The classic equiatomic high-entropy alloy'
              });
            }}
            disabled={isGenerating || isOptimizing}
          >
            <FlaskConical className="mr-2 h-4 w-4" />
            Quick Cantor Alloy
          </Button>
        </div>

        {/* HEA Presets */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            Established HEA Systems
          </h4>
          <div className="grid gap-3 md:grid-cols-2">
            {HEA_PRESETS.map((preset) => (
              <Card key={preset.name} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-sm">{preset.name}</h5>
                    <Badge variant="outline" className="text-xs">
                      {preset.elements.length} elements
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{preset.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {preset.elements.map((element) => (
                      <Badge key={element} variant="secondary" className="text-xs font-mono">
                        {element}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 text-xs">
                    {preset.properties.slice(0, 2).map((prop) => (
                      <span key={prop} className="text-green-600">• {prop}</span>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateHEAFromPreset(preset.name)}
                    disabled={isGenerating || isOptimizing}
                    className="w-full mt-2"
                  >
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Apply & Optimize
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* HEA Science Insights */}
        <Alert className="border-blue-200 bg-blue-50/50">
          <Zap className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium text-sm">🧪 High-Entropy Alloy Science:</p>
              <div className="text-xs space-y-1">
                <p><strong>Configurational Entropy:</strong> S ≥ 1.5R for true HEA behavior (≥60% score)</p>
                <p><strong>Core Effects:</strong> Severe lattice distortion, sluggish diffusion, high-entropy stabilization, cocktail effect</p>
                <p><strong>Phase Prediction:</strong> VEC &lt; 6.87 (BCC), VEC &gt; 8.0 (FCC), δ &lt; 6.6% (single phase)</p>
                <p><strong>Property Advantages:</strong> Exceptional strength-ductility balance, thermal stability, radiation resistance</p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}