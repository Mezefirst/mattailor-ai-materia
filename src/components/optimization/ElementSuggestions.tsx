import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Lightbulb, Plus, ChartBar, Atom, FlaskConical, Sparkle, Target, TrendUp, ChartLine } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n';

interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  category: string;
}

interface ElementSuggestionsProps {
  currentElements: Array<{element: Element, percentage: number}>;
  onElementsAdded: (elements: Element[]) => void;
}

interface AlloyRecommendation {
  name: string;
  application: string;
  elements: Array<{symbol: string, percentage: number, role: string}>;
  properties: string[];
  advantages: string[];
  challenges: string[];
  novelty?: number; // 0-100 scale for how novel/experimental the alloy is
  confidence?: number; // AI confidence in the recommendation
  potentialScore?: number; // Predicted performance potential
}

interface ExperimentalAlloy {
  id: string;
  name: string;
  elements: Array<{symbol: string, percentage: number}>;
  targetProperties: string[];
  estimatedScore: number;
  noveltyLevel: number;
  riskLevel: number;
  reasoning: string;
}

export function ElementSuggestions({ currentElements, onElementsAdded }: ElementSuggestionsProps) {
  const { t } = useTranslation();
  const [selectedApplication, setSelectedApplication] = useState('');
  const [suggestions, setSuggestions] = useState<AlloyRecommendation[]>([]);
  const [experimentalAlloys, setExperimentalAlloys] = useState<ExperimentalAlloy[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [discoveryMode, setDiscoveryMode] = useState('conventional'); // conventional, experimental, breakthrough
  const [noveltyThreshold, setNoveltyThreshold] = useState([50]); // 0-100 scale
  const [riskTolerance, setRiskTolerance] = useState([30]); // 0-100 scale
  const [targetProperties, setTargetProperties] = useState<string[]>([]);
  const [enableAIExploration, setEnableAIExploration] = useState(true);

  const applications = [
    'aerospace', 'automotive', 'marine', 'electronics', 'medical', 
    'construction', 'energy', 'tooling', 'packaging', 'defense'
  ];

  const propertyTargets = [
    'high_strength', 'low_weight', 'corrosion_resistance', 'high_temperature',
    'electrical_conductivity', 'thermal_conductivity', 'magnetic_properties',
    'biocompatibility', 'radiation_resistance', 'wear_resistance'
  ];

  // Comprehensive alloy database with real-world compositions
  const knownAlloys: AlloyRecommendation[] = [
    {
      name: "Ti-6Al-4V (Grade 5)",
      application: "aerospace",
      elements: [
        { symbol: "Ti", percentage: 90.0, role: "Primary matrix, high strength-to-weight" },
        { symbol: "Al", percentage: 6.0, role: "Alpha stabilizer, reduces density" },
        { symbol: "V", percentage: 4.0, role: "Beta stabilizer, improves ductility" }
      ],
      properties: ["High strength-to-weight ratio", "Excellent corrosion resistance", "Good fatigue strength"],
      advantages: ["Lightweight", "Biocompatible", "Heat treatable"],
      challenges: ["Expensive", "Difficult to machine", "Requires controlled atmosphere processing"],
      novelty: 10,
      confidence: 95,
      potentialScore: 85
    },
    {
      name: "304 Stainless Steel",
      application: "general",
      elements: [
        { symbol: "Fe", percentage: 70.0, role: "Primary matrix" },
        { symbol: "Cr", percentage: 18.0, role: "Corrosion resistance" },
        { symbol: "Ni", percentage: 8.0, role: "Austenite stabilizer" },
        { symbol: "Mn", percentage: 2.0, role: "Deoxidizer, strengthening" },
        { symbol: "Si", percentage: 1.0, role: "Deoxidizer" },
        { symbol: "C", percentage: 0.08, role: "Strengthening" }
      ],
      properties: ["Excellent corrosion resistance", "Good formability", "Non-magnetic when annealed"],
      advantages: ["Widely available", "Good weldability", "Food grade safe"],
      challenges: ["Work hardens rapidly", "Lower strength than martensitic grades"],
      novelty: 10,
      confidence: 95,
      potentialScore: 75
    },
    {
      name: "6061-T6 Aluminum",
      application: "automotive",
      elements: [
        { symbol: "Al", percentage: 97.9, role: "Primary matrix" },
        { symbol: "Mg", percentage: 1.0, role: "Strengthening through Mg2Si precipitation" },
        { symbol: "Si", percentage: 0.6, role: "Forms strengthening precipitates with Mg" },
        { symbol: "Cu", percentage: 0.3, role: "Solid solution strengthening" },
        { symbol: "Cr", percentage: 0.2, role: "Grain refinement" }
      ],
      properties: ["Good strength-to-weight", "Excellent corrosion resistance", "Good machinability"],
      advantages: ["Heat treatable", "Good weldability", "Recyclable"],
      challenges: ["Lower strength than steel", "Galvanic corrosion with dissimilar metals"],
      novelty: 10,
      confidence: 95,
      potentialScore: 70
    }
  ];

  const generateAdvancedSuggestions = async () => {
    if (!selectedApplication && discoveryMode === 'conventional') {
      toast.error('Please select an application or switch to experimental mode');
      return;
    }

    setIsGenerating(true);

    try {
      const currentSymbols = currentElements.map(e => e.element.symbol);
      
      const prompt = spark.llmPrompt`
      You are a leading materials scientist and metallurgist with expertise in alloy design and discovery. 
      
      Current elements: ${currentSymbols.join(', ')}
      Target application: ${selectedApplication || 'general exploration'}
      Discovery mode: ${discoveryMode}
      Novelty threshold: ${noveltyThreshold[0]}% (0=conventional, 100=highly experimental)
      Risk tolerance: ${riskTolerance[0]}% (0=conservative, 100=high-risk)
      Target properties: ${targetProperties.join(', ')}
      
      Based on the discovery mode, generate alloy recommendations:
      
      ${discoveryMode === 'conventional' ? `
      CONVENTIONAL MODE: Focus on proven alloy systems with modifications
      - Suggest improvements to existing alloy families
      - Minor element substitutions for cost/availability
      - Composition optimizations within known limits
      ` : ''}
      
      ${discoveryMode === 'experimental' ? `
      EXPERIMENTAL MODE: Explore novel but feasible combinations
      - Unconventional element pairings with theoretical basis
      - New compositions in known alloy systems
      - Promising but untested element combinations
      ` : ''}
      
      ${discoveryMode === 'breakthrough' ? `
      BREAKTHROUGH MODE: Push boundaries of materials science
      - Revolutionary element combinations
      - Exploit emerging materials science principles
      - High-entropy alloys and complex compositions
      - Biomimetic and nature-inspired designs
      ` : ''}
      
      Consider these advanced principles:
      1. High-entropy alloy design principles
      2. Electronic structure and orbital hybridization
      3. Thermodynamic stability and phase diagrams
      4. Kinetic factors and processing windows
      5. Size effects and grain boundary engineering
      6. Quantum mechanical effects in nanostructures
      7. Machine learning predictions from materials databases
      
      For each recommendation, provide:
      - Detailed scientific reasoning
      - Expected synergistic effects between elements
      - Processing challenges and solutions
      - Property predictions with confidence levels
      - Innovation potential and commercial viability
      
      Return as JSON:
      {
        "alloyRecommendations": [
          {
            "name": "Novel HEA-Ti-Al-V-Cr-Mo",
            "type": "${discoveryMode}",
            "elements": [{"symbol": "Ti", "percentage": 25, "role": "High strength matrix"}, ...],
            "targetProperties": ["high strength", "low density"],
            "expectedBenefits": ["50% stronger than Ti-6Al-4V", "20% lighter"],
            "scientificBasis": "Solid solution strengthening + precipitation hardening",
            "processingNotes": "Requires vacuum induction melting",
            "novelty": 75,
            "confidence": 68,
            "potentialScore": 92,
            "estimatedCost": "high",
            "developmentTime": "2-3 years"
          }
        ],
        "experimentalConcepts": [
          {
            "id": "exp_001",
            "name": "Bio-inspired Composite",
            "elements": [{"symbol": "Ti", "percentage": 40}, {"symbol": "Nb", "percentage": 30}, ...],
            "reasoning": "Mimics bone structure for medical implants",
            "targetProperties": ["biocompatibility", "bone-like modulus"],
            "noveltyLevel": 85,
            "riskLevel": 60,
            "estimatedScore": 78
          }
        ]
      }
      `;

      const result = await spark.llm(prompt, 'gpt-4o', true);
      const aiResponse = JSON.parse(result);
      
      // Process regular alloy recommendations
      if (aiResponse.alloyRecommendations) {
        const enhancedSuggestions = aiResponse.alloyRecommendations.map((rec: any) => ({
          name: rec.name,
          application: selectedApplication || 'experimental',
          elements: rec.elements,
          properties: rec.targetProperties || [],
          advantages: rec.expectedBenefits || [],
          challenges: rec.processingNotes ? [rec.processingNotes] : [],
          novelty: rec.novelty || 50,
          confidence: rec.confidence || 70,
          potentialScore: rec.potentialScore || 75
        }));
        setSuggestions(enhancedSuggestions);
      }
      
      // Process experimental concepts
      if (aiResponse.experimentalConcepts) {
        setExperimentalAlloys(aiResponse.experimentalConcepts);
      }
      
      // Filter existing alloys by application and discovery mode
      const relevantAlloys = knownAlloys
        .filter(alloy => {
          if (discoveryMode === 'breakthrough') return false; // Only show novel suggestions
          if (discoveryMode === 'experimental') return alloy.application === selectedApplication;
          return alloy.application === selectedApplication || alloy.application === 'general';
        })
        .map(alloy => ({
          ...alloy,
          novelty: 10, // Known alloys have low novelty
          confidence: 95, // High confidence in proven alloys
          potentialScore: 70 // Moderate potential as they're already developed
        }));

      // Combine based on discovery mode
      const finalSuggestions = discoveryMode === 'breakthrough' 
        ? enhancedSuggestions 
        : [...relevantAlloys, ...enhancedSuggestions].slice(0, 8);
      
      setSuggestions(finalSuggestions);
      
      const modeDescription = {
        conventional: 'proven alloy improvements',
        experimental: 'novel but feasible combinations', 
        breakthrough: 'cutting-edge revolutionary alloys'
      };
      
      toast.success(`Generated ${finalSuggestions.length} ${modeDescription[discoveryMode as keyof typeof modeDescription]}`, {
        description: `Discovery mode: ${discoveryMode.toUpperCase()} | Novelty: ${noveltyThreshold[0]}%`,
        duration: 5000
      });

    } catch (error) {
      console.error('Failed to generate advanced suggestions:', error);
      
      // Enhanced fallback based on discovery mode
      let fallbackSuggestions = knownAlloys;
      
      if (discoveryMode === 'experimental') {
        // Add some experimental variations of known alloys
        fallbackSuggestions = [
          ...knownAlloys,
          {
            name: "Modified Ti-6Al-4V with Nb",
            application: "aerospace",
            elements: [
              { symbol: "Ti", percentage: 87.0, role: "Primary matrix" },
              { symbol: "Al", percentage: 6.0, role: "Alpha stabilizer" },
              { symbol: "V", percentage: 4.0, role: "Beta stabilizer" },
              { symbol: "Nb", percentage: 3.0, role: "Enhanced biocompatibility" }
            ],
            properties: ["Enhanced biocompatibility", "Lower elastic modulus"],
            advantages: ["Better bone integration", "Reduced stress shielding"],
            challenges: ["Higher cost", "Limited supply chain"],
            novelty: 65,
            confidence: 72
          }
        ];
      } else if (discoveryMode === 'breakthrough') {
        // Add highly experimental concepts
        fallbackSuggestions = [
          {
            name: "High-Entropy Aerospace Alloy",
            application: "aerospace",
            elements: [
              { symbol: "Ti", percentage: 20.0, role: "Lightweight matrix" },
              { symbol: "Al", percentage: 20.0, role: "Density reduction" },
              { symbol: "V", percentage: 20.0, role: "Strength enhancement" },
              { symbol: "Nb", percentage: 20.0, role: "High-temp stability" },
              { symbol: "Ta", percentage: 20.0, role: "Corrosion resistance" }
            ],
            properties: ["Ultra-high strength", "Excellent high-temp properties"],
            advantages: ["Revolutionary strength-to-weight", "Multi-functional"],
            challenges: ["Extremely experimental", "Unknown processing routes"],
            novelty: 95,
            confidence: 45
          }
        ];
      }
      
      const filteredFallback = fallbackSuggestions.filter(alloy => 
        alloy.application === selectedApplication || alloy.application === 'general'
      );
      
      setSuggestions(filteredFallback);
      toast.success(`Showing ${filteredFallback.length} fallback suggestions for ${discoveryMode} mode`);
    } finally {
      setIsGenerating(false);
    }
  };

  const exploreUnconventionalCombinations = async () => {
    setIsGenerating(true);
    
    try {
      const prompt = spark.llmPrompt`
      You are a visionary materials scientist exploring unconventional element combinations for breakthrough alloys.
      
      Current base elements: ${currentElements.map(e => e.element.symbol).join(', ')}
      
      Generate 5 highly unconventional alloy concepts that push the boundaries of materials science:
      
      1. Consider elements rarely used together
      2. Explore bio-inspired combinations from nature
      3. Think about quantum effects and electronic structures
      4. Consider processing routes that enable new combinations
      5. Predict synergistic effects between unlikely element pairs
      
      Focus on combinations that might seem impossible but could work with advanced processing:
      - Refractory elements with lightweight metals
      - Reactive elements stabilized in unique matrices
      - Elements with complementary electronic structures
      - Biomimetic compositions inspired by natural materials
      
      Return as JSON:
      {
        "unconventionalAlloys": [
          {
            "name": "Bio-Inspired Titanium-Calcium Composite",
            "concept": "Mimics bone structure with controlled Ca distribution",
            "elements": [{"symbol": "Ti", "percentage": 85}, {"symbol": "Ca", "percentage": 10}, {"symbol": "P", "percentage": 5}],
            "inspiration": "Natural bone composition for medical implants",
            "expectedProperties": ["Bone-like elastic modulus", "Enhanced biointegration"],
            "processingChallenge": "Controlled atmosphere to prevent Ca oxidation",
            "noveltyScore": 95,
            "feasibilityScore": 60,
            "breakthroughPotential": 90
          }
        ]
      }
      `;
      
      const result = await spark.llm(prompt, 'gpt-4o', true);
      const unconventional = JSON.parse(result);
      
      if (unconventional.unconventionalAlloys) {
        const experimentalConcepts = unconventional.unconventionalAlloys.map((alloy: any, index: number) => ({
          id: `unconventional_${index}`,
          name: alloy.name,
          elements: alloy.elements,
          reasoning: alloy.concept + '. ' + alloy.inspiration,
          targetProperties: alloy.expectedProperties || [],
          noveltyLevel: alloy.noveltyScore || 90,
          riskLevel: 100 - (alloy.feasibilityScore || 50),
          estimatedScore: alloy.breakthroughPotential || 85
        }));
        
        setExperimentalAlloys(prev => [...prev, ...experimentalConcepts]);
        
        toast.success(`Discovered ${experimentalConcepts.length} unconventional alloy concepts!`, {
          description: 'These are highly experimental but potentially breakthrough combinations',
          duration: 6000
        });
      }
    } catch (error) {
      console.error('Failed to explore unconventional combinations:', error);
      toast.error('Failed to generate unconventional combinations');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBiomimeticAlloys = async () => {
    setIsGenerating(true);
    
    try {
      const prompt = spark.llmPrompt`
      As a biomimetic materials scientist, design alloys inspired by natural structures and compositions.
      
      Current elements: ${currentElements.map(e => e.element.symbol).join(', ')}
      
      Create alloy designs inspired by:
      1. Bone - hierarchical structure with calcium phosphate and collagen
      2. Shells - nacre structure with aragonite tablets and protein matrix
      3. Wood - cellulose fibers in lignin matrix with hierarchical structure
      4. Spider silk - protein chains with specific secondary structures
      5. Teeth - enamel hydroxyapatite with organic matrix
      6. Bamboo - gradient structure from outside to inside
      
      For each bio-inspired design:
      - Identify the natural structure/composition being mimicked
      - Propose metallic analogs for organic components
      - Design processing routes to achieve hierarchical structures
      - Predict unique properties from bio-inspired design
      
      Return as JSON:
      {
        "biomimeticAlloys": [
          {
            "name": "Nacre-Inspired Ti-Al Composite",
            "biologicalInspiration": "Abalone shell nacre structure",
            "elements": [{"symbol": "Ti", "percentage": 70}, {"symbol": "Al", "percentage": 25}, {"symbol": "C", "percentage": 5}],
            "structuralDesign": "Alternating Ti-rich and Al-rich layers with carbon interfaces",
            "processingRoute": "Layer-by-layer additive manufacturing",
            "expectedProperties": ["Ultra-high toughness", "Crack deflection", "Lightweight"],
            "noveltyScore": 85,
            "biomimeticScore": 95
          }
        ]
      }
      `;
      
      const result = await spark.llm(prompt, 'gpt-4o', true);
      const biomimetic = JSON.parse(result);
      
      if (biomimetic.biomimeticAlloys) {
        const bioInspiredConcepts = biomimetic.biomimeticAlloys.map((alloy: any, index: number) => ({
          id: `biomimetic_${index}`,
          name: alloy.name,
          elements: alloy.elements,
          reasoning: `Bio-inspired by ${alloy.biologicalInspiration}. ${alloy.structuralDesign}`,
          targetProperties: alloy.expectedProperties || [],
          noveltyLevel: alloy.noveltyScore || 80,
          riskLevel: 70, // Moderate risk as bio-inspiration provides guidance
          estimatedScore: alloy.biomimeticScore || 85
        }));
        
        setExperimentalAlloys(prev => [...prev, ...bioInspiredConcepts]);
        
        toast.success(`Generated ${bioInspiredConcepts.length} bio-inspired alloy concepts!`, {
          description: 'Nature-inspired designs with unique structural properties',
          duration: 6000
        });
      }
    } catch (error) {
      console.error('Failed to generate biomimetic alloys:', error);
      toast.error('Failed to generate bio-inspired alloys');
    } finally {
      setIsGenerating(false);
    }
  };

  const applySuggestion = (suggestion: AlloyRecommendation) => {
    // Convert suggestion elements to the format expected by the parent component
    const elementsToAdd = suggestion.elements
      .filter(e => !currentElements.some(curr => curr.element.symbol === e.symbol))
      .map(e => ({
        symbol: e.symbol,
        name: e.symbol, // Simplified - would need full element data
        atomicNumber: 0, // Would need to be looked up
        category: 'metal' as const
      }));

    if (elementsToAdd.length > 0) {
      onElementsAdded(elementsToAdd);
      toast.success(`Added ${elementsToAdd.length} new elements from ${suggestion.name}`, {
        description: 'Adjust percentages to match the recommended composition'
      });
    } else {
      toast.info('All elements from this alloy are already in your composition', {
        description: 'You can adjust percentages to match the recommended ratios'
      });
    }
  };

  const applyExperimentalAlloy = (alloy: ExperimentalAlloy) => {
    const elementsToAdd = alloy.elements
      .filter(e => !currentElements.some(curr => curr.element.symbol === e.symbol))
      .map(e => ({
        symbol: e.symbol,
        name: e.symbol,
        atomicNumber: 0,
        category: 'metal' as const
      }));

    if (elementsToAdd.length > 0) {
      onElementsAdded(elementsToAdd);
      toast.success(`Applied experimental alloy: ${alloy.name}`, {
        description: `⚠ High novelty (${alloy.noveltyLevel}%) and risk (${alloy.riskLevel}%) - proceed with caution`,
        duration: 6000
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkle className="h-5 w-5" />
          Advanced Alloy Discovery Lab
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Discover new alloy combinations using AI-powered exploration, biomimetic design, and breakthrough materials science
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="discovery" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discovery">Smart Discovery</TabsTrigger>
            <TabsTrigger value="experimental">Experimental Zone</TabsTrigger>
            <TabsTrigger value="results">Results & Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="discovery" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Discovery Mode:
                </Label>
                <Select value={discoveryMode} onValueChange={setDiscoveryMode}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conventional">🔧 Conventional - Proven improvements</SelectItem>
                    <SelectItem value="experimental">🧪 Experimental - Novel combinations</SelectItem>
                    <SelectItem value="breakthrough">🚀 Breakthrough - Revolutionary alloys</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Target Application</Label>
                  <Select value={selectedApplication} onValueChange={setSelectedApplication}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select application..." />
                    </SelectTrigger>
                    <SelectContent>
                      {applications.map((app) => (
                        <SelectItem key={app} value={app}>
                          {app.charAt(0).toUpperCase() + app.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="ai-exploration"
                    checked={enableAIExploration}
                    onCheckedChange={setEnableAIExploration}
                  />
                  <Label htmlFor="ai-exploration">Enable AI Exploration</Label>
                </div>
              </div>

              {discoveryMode !== 'conventional' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Novelty Threshold: {noveltyThreshold[0]}%</Label>
                    <Slider
                      value={noveltyThreshold}
                      onValueChange={setNoveltyThreshold}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Higher values explore more unconventional combinations
                    </p>
                  </div>

                  <div>
                    <Label>Risk Tolerance: {riskTolerance[0]}%</Label>
                    <Slider
                      value={riskTolerance}
                      onValueChange={setRiskTolerance}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Higher values accept more experimental approaches
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <Button 
                  onClick={generateAdvancedSuggestions}
                  disabled={isGenerating}
                  className="flex-1 min-w-fit"
                >
                  {isGenerating ? (
                    <>
                      <ChartBar className="mr-2 h-4 w-4 animate-pulse" />
                      Discovering...
                    </>
                  ) : (
                    <>
                      <Atom className="mr-2 h-4 w-4" />
                      Discover Alloys
                    </>
                  )}
                </Button>
                
                {discoveryMode !== 'conventional' && (
                  <>
                    <Button 
                      onClick={exploreUnconventionalCombinations}
                      disabled={isGenerating}
                      variant="outline"
                    >
                      <FlaskConical className="mr-2 h-4 w-4" />
                      Unconventional
                    </Button>
                    
                    <Button 
                      onClick={generateBiomimeticAlloys}
                      disabled={isGenerating}
                      variant="outline"
                    >
                      <Sparkle className="mr-2 h-4 w-4" />
                      Bio-inspired
                    </Button>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="experimental" className="space-y-4 mt-4">
            {experimentalAlloys.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <FlaskConical className="h-4 w-4" />
                  Experimental Alloy Concepts ({experimentalAlloys.length})
                </h4>
                {experimentalAlloys.map((alloy) => (
                  <div key={alloy.id} className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-medium">{alloy.name}</h5>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Novelty: {alloy.noveltyLevel}%
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Risk: {alloy.riskLevel}%
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Score: {alloy.estimatedScore}%
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyExperimentalAlloy(alloy)}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Try This
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <h6 className="text-sm font-medium">Composition:</h6>
                        <div className="flex flex-wrap gap-1">
                          {alloy.elements.map((elem, i) => (
                            <Badge key={i} variant="secondary" className="text-xs font-mono">
                              {elem.symbol}: {elem.percentage}%
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h6 className="text-sm font-medium">Scientific Reasoning:</h6>
                        <p className="text-xs text-muted-foreground">{alloy.reasoning}</p>
                      </div>

                      {alloy.targetProperties.length > 0 && (
                        <div>
                          <h6 className="text-sm font-medium">Target Properties:</h6>
                          <p className="text-xs text-green-600">
                            {alloy.targetProperties.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No experimental alloys generated yet</p>
                <p className="text-sm">Use the Discovery tab to generate experimental concepts</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-4 mt-4">
            {suggestions.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Recommended Alloy Compositions ({suggestions.length})</h4>
                  <Badge variant="outline">
                    Mode: {discoveryMode}
                  </Badge>
                </div>
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-medium">{suggestion.name}</h5>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {suggestion.application}
                          </Badge>
                          {suggestion.novelty && (
                            <Badge 
                              variant={suggestion.novelty > 70 ? "destructive" : suggestion.novelty > 40 ? "secondary" : "default"}
                              className="text-xs"
                            >
                              Novelty: {suggestion.novelty}%
                            </Badge>
                          )}
                          {suggestion.confidence && (
                            <Badge variant="outline" className="text-xs">
                              Confidence: {suggestion.confidence}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applySuggestion(suggestion)}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Apply
                      </Button>
                    </div>

                    <div className="grid gap-3 mb-3">
                      <div>
                        <h6 className="text-sm font-medium mb-1">Composition:</h6>
                        <div className="flex flex-wrap gap-1">
                          {suggestion.elements.map((elem, i) => (
                            <Badge key={i} variant="secondary" className="text-xs font-mono">
                              {elem.symbol}: {elem.percentage}%
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {suggestion.properties && suggestion.properties.length > 0 && (
                        <div>
                          <h6 className="text-sm font-medium mb-1">Key Properties:</h6>
                          <p className="text-xs text-muted-foreground">
                            {suggestion.properties.slice(0, 3).join(', ')}
                          </p>
                        </div>
                      )}

                      {suggestion.advantages && suggestion.advantages.length > 0 && (
                        <div>
                          <h6 className="text-sm font-medium mb-1">Advantages:</h6>
                          <p className="text-xs text-green-600">
                            ✓ {suggestion.advantages.slice(0, 2).join(', ')}
                          </p>
                        </div>
                      )}

                      {suggestion.challenges && suggestion.challenges.length > 0 && (
                        <div>
                          <h6 className="text-sm font-medium mb-1">Considerations:</h6>
                          <p className="text-xs text-amber-600">
                            ⚠ {suggestion.challenges.slice(0, 2).join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ChartLine className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No alloy suggestions generated yet</p>
                <p className="text-sm">Use the Discovery tab to generate recommendations</p>
              </div>
            )}

            {currentElements.length > 0 && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <h6 className="text-sm font-medium mb-2">Current Elements:</h6>
                <div className="flex flex-wrap gap-1">
                  {currentElements.map((elem) => (
                    <Badge key={elem.element.symbol} variant="outline" className="text-xs">
                      {elem.element.symbol}: {elem.percentage}%
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}