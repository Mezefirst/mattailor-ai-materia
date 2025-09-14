import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Atom, Zap, Target, FlaskConical, Lightbulb, TrendUp } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n';

interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  category: string;
}

interface AlloyOptimizerProps {
  selectedElements: Array<{element: Element, percentage: number}>;
  onOptimizedComposition: (elements: Array<{element: Element, percentage: number}>) => void;
  onOptimizationStart: () => void;
  onOptimizationEnd: () => void;
  isOptimizing: boolean;
}

interface OptimizationResult {
  elements: Array<{symbol: string, percentage: number, role: string}>;
  reasoning: string;
  expectedProperties: {
    tensileStrength?: number;
    yieldStrength?: number;
    elongation?: number;
    hardness?: number;
    corrosionResistance?: string;
  };
  processingNotes: string;
  confidence: number;
}

export function AlloyOptimizer({ 
  selectedElements, 
  onOptimizedComposition, 
  onOptimizationStart, 
  onOptimizationEnd,
  isOptimizing 
}: AlloyOptimizerProps) {
  const { t } = useTranslation();
  const [application, setApplication] = useState('');
  const [customRequirements, setCustomRequirements] = useState('');
  const [optimizationHistory, setOptimizationHistory] = useState<OptimizationResult[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [targetProperties, setTargetProperties] = useState({
    tensileStrength: '',
    density: '',
    corrosionResistance: '',
    temperature: '',
    conductivity: ''
  });

  const applications = [
    { value: 'aerospace', label: '✈️ Aerospace', description: 'High strength-to-weight, fatigue resistance' },
    { value: 'automotive', label: '🚗 Automotive', description: 'Formability, weldability, crash performance' },
    { value: 'marine', label: '🚢 Marine', description: 'Corrosion resistance, saltwater environment' },
    { value: 'electronics', label: '📱 Electronics', description: 'Thermal/electrical conductivity' },
    { value: 'medical', label: '🏥 Medical', description: 'Biocompatibility, non-toxic' },
    { value: 'construction', label: '🏗️ Construction', description: 'Weather resistance, cost-effective' },
    { value: 'energy', label: '⚡ Energy', description: 'High temperature, oxidation resistance' },
    { value: 'tooling', label: '🔧 Tooling', description: 'Hardness, wear resistance' },
    { value: 'custom', label: '🎯 Custom', description: 'Specify your own requirements' }
  ];

  const performOptimization = async () => {
    if (selectedElements.length === 0) {
      toast.error('No elements selected for optimization');
      return;
    }

    onOptimizationStart();

    try {
      // Build comprehensive optimization prompt
      let requirementsText = '';
      if (application && application !== 'custom') {
        const appData = applications.find(app => app.value === application);
        requirementsText = `Application: ${appData?.label} - ${appData?.description}`;
      }
      
      if (customRequirements.trim()) {
        requirementsText += `\nCustom Requirements: ${customRequirements}`;
      }

      if (Object.values(targetProperties).some(prop => prop.trim())) {
        requirementsText += '\nTarget Properties:';
        if (targetProperties.tensileStrength) requirementsText += `\n- Tensile Strength: ${targetProperties.tensileStrength} MPa`;
        if (targetProperties.density) requirementsText += `\n- Density: ${targetProperties.density} g/cm³`;
        if (targetProperties.corrosionResistance) requirementsText += `\n- Corrosion Resistance: ${targetProperties.corrosionResistance}`;
        if (targetProperties.temperature) requirementsText += `\n- Service Temperature: ${targetProperties.temperature}°C`;
        if (targetProperties.conductivity) requirementsText += `\n- Conductivity Requirements: ${targetProperties.conductivity}`;
      }

      const prompt = spark.llmPrompt`
      You are an expert metallurgist and materials engineer with deep knowledge of alloy design, phase diagrams, and processing metallurgy. 

      Optimize the composition of an alloy containing these elements: ${selectedElements.map(e => e.element.symbol).join(', ')}
      
      Current composition: ${selectedElements.map(e => `${e.element.symbol}: ${e.percentage}%`).join(', ')}
      
      ${requirementsText}
      
      Apply advanced metallurgical principles:
      
      1. PHASE DIAGRAM ANALYSIS:
         - Consider solubility limits and intermetallic formation
         - Optimize for desired phase fractions (austenite/ferrite/martensite)
         - Avoid brittle intermetallic phases in critical amounts
      
      2. STRENGTHENING MECHANISMS:
         - Solid solution strengthening (size and modulus mismatch)
         - Precipitation hardening potential (coherent precipitates)
         - Grain refinement effects
         - Work hardening capabilities
      
      3. PROCESSING CONSIDERATIONS:
         - Heat treatment response and hardenability
         - Forming and fabrication characteristics
         - Welding compatibility and HAZ effects
         - Machinability and surface finishing
      
      4. SERVICE PERFORMANCE:
         - Mechanical properties at service temperature
         - Environmental resistance (corrosion, oxidation)
         - Fatigue and creep resistance
         - Thermal and electrical properties
      
      5. COST AND AVAILABILITY:
         - Element costs and market availability
         - Processing complexity and energy requirements
         - Recycling compatibility
      
      For each element, determine:
      - Optimal percentage based on solubility limits
      - Primary strengthening contribution
      - Interaction effects with other elements
      - Processing implications
      
      Provide detailed analysis with scientific justification.
      
      Return as JSON:
      {
        "elements": [
          {
            "symbol": "Fe",
            "percentage": 85.2,
            "role": "Primary matrix, provides structural strength through BCC/FCC crystal structure"
          }
        ],
        "reasoning": "Detailed metallurgical explanation of optimization strategy and element interactions",
        "expectedProperties": {
          "tensileStrength": 850,
          "yieldStrength": 720,
          "elongation": 15,
          "hardness": 280,
          "corrosionResistance": "excellent",
          "density": 7.8,
          "meltingPoint": 1450
        },
        "processingNotes": "Heat treatment recommendations, forming guidelines, and manufacturing considerations",
        "phaseAnalysis": "Expected phases and microstructure",
        "limitations": "Potential challenges and service limitations",
        "confidence": 92
      }
      `;

      const result = await spark.llm(prompt, 'gpt-4o', true);
      const optimized: OptimizationResult = JSON.parse(result);
      
      if (optimized.elements && Array.isArray(optimized.elements)) {
        // Map optimized results back to the component format
        const newComposition = selectedElements.map(item => {
          const optimizedElement = optimized.elements.find(e => e.symbol === item.element.symbol);
          return {
            ...item,
            percentage: optimizedElement ? optimizedElement.percentage : item.percentage
          };
        });
        
        // Add to optimization history
        setOptimizationHistory(prev => [optimized, ...prev.slice(0, 4)]); // Keep last 5 results
        
        onOptimizedComposition(newComposition);
        
        // Success notification with details
        toast.success('🎯 AI Optimization Complete!', {
          description: `Confidence: ${optimized.confidence}% - ${optimized.reasoning?.substring(0, 100)}...`,
          duration: 8000
        });
        
        // Show expected properties
        if (optimized.expectedProperties) {
          setTimeout(() => {
            const props = optimized.expectedProperties;
            const propText = [
              props.tensileStrength && `Tensile: ${props.tensileStrength} MPa`,
              props.hardness && `Hardness: ${props.hardness} HV`,
              props.elongation && `Elongation: ${props.elongation}%`
            ].filter(Boolean).join(', ');
            
            toast.info('📊 Expected Properties', {
              description: propText,
              duration: 6000
            });
          }, 1500);
        }
        
        // Show processing notes
        if (optimized.processingNotes) {
          setTimeout(() => {
            toast.info('🔧 Processing Recommendations', {
              description: optimized.processingNotes.substring(0, 150),
              duration: 8000
            });
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Optimization failed:', error);
      toast.error('Optimization failed, using fallback recommendations');
      
      // Enhanced fallback logic would go here
      
    } finally {
      onOptimizationEnd();
    }
  };

  const clearOptimizationHistory = () => {
    setOptimizationHistory([]);
    toast.success('Optimization history cleared');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Atom className="h-5 w-5" />
            {t.aiOptimization.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t.aiOptimization.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Application Selection */}
          <div>
            <Label htmlFor="application">Target Application</Label>
            <Select value={application} onValueChange={setApplication}>
              <SelectTrigger>
                <SelectValue placeholder="Select target application..." />
              </SelectTrigger>
              <SelectContent>
                {applications.map((app) => (
                  <SelectItem key={app.value} value={app.value}>
                    <div className="flex flex-col items-start">
                      <span>{app.label}</span>
                      <span className="text-xs text-muted-foreground">{app.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Requirements */}
          {(application === 'custom' || application) && (
            <div>
              <Label htmlFor="requirements">Specific Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="e.g., High corrosion resistance in chloride environments, operating temperature up to 600°C, minimal magnetic permeability..."
                value={customRequirements}
                onChange={(e) => setCustomRequirements(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Advanced Target Properties */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="p-0 h-auto font-normal"
              >
                <TrendUp className="h-4 w-4 mr-1" />
                Advanced Property Targets {showAdvanced ? '▼' : '▶'}
              </Button>
            </div>
            
            {showAdvanced && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label htmlFor="tensile">Tensile Strength (MPa)</Label>
                  <Input
                    id="tensile"
                    placeholder="e.g., 800"
                    value={targetProperties.tensileStrength}
                    onChange={(e) => setTargetProperties(prev => ({...prev, tensileStrength: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="density">Target Density (g/cm³)</Label>
                  <Input
                    id="density"
                    placeholder="e.g., 2.8"
                    value={targetProperties.density}
                    onChange={(e) => setTargetProperties(prev => ({...prev, density: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="corrosion">Corrosion Environment</Label>
                  <Input
                    id="corrosion"
                    placeholder="e.g., marine, acidic"
                    value={targetProperties.corrosionResistance}
                    onChange={(e) => setTargetProperties(prev => ({...prev, corrosionResistance: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="temperature">Service Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    placeholder="e.g., 300"
                    value={targetProperties.temperature}
                    onChange={(e) => setTargetProperties(prev => ({...prev, temperature: e.target.value}))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Optimization Button */}
          <Button 
            onClick={performOptimization}
            disabled={isOptimizing || selectedElements.length === 0}
            className="w-full"
            size="lg"
          >
            {isOptimizing ? (
              <>
                <Zap className="mr-2 h-5 w-5 animate-pulse" />
                Optimizing Alloy Composition...
              </>
            ) : (
              <>
                <Target className="mr-2 h-5 w-5" />
                Optimize Alloy for {application ? applications.find(a => a.value === application)?.label || 'Application' : 'Best Properties'}
              </>
            )}
          </Button>

          {/* Current Elements Summary */}
          {selectedElements.length > 0 && (
            <div className="p-4 bg-card border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FlaskConical className="h-4 w-4" />
                Current Composition ({selectedElements.length} elements)
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedElements.map((item) => (
                  <Badge key={item.element.symbol} variant="secondary" className="font-mono">
                    {item.element.symbol}: {item.percentage.toFixed(1)}%
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Optimization History */}
      {optimizationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Optimization History
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearOptimizationHistory}>
                Clear History
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {optimizationHistory.map((result, index) => (
                <div key={index} className="p-4 border rounded-lg bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Optimization #{optimizationHistory.length - index}</Badge>
                      <Badge variant={result.confidence >= 90 ? 'default' : result.confidence >= 70 ? 'secondary' : 'destructive'}>
                        {result.confidence}% Confidence
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newComposition = selectedElements.map(item => {
                          const optimizedElement = result.elements.find(e => e.symbol === item.element.symbol);
                          return {
                            ...item,
                            percentage: optimizedElement ? optimizedElement.percentage : item.percentage
                          };
                        });
                        onOptimizedComposition(newComposition);
                        toast.success('Applied optimization result');
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{result.reasoning}</p>
                  
                  {result.expectedProperties && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {result.expectedProperties.tensileStrength && (
                        <div>
                          <span className="text-muted-foreground">Tensile:</span>
                          <span className="ml-1 font-medium">{result.expectedProperties.tensileStrength} MPa</span>
                        </div>
                      )}
                      {result.expectedProperties.hardness && (
                        <div>
                          <span className="text-muted-foreground">Hardness:</span>
                          <span className="ml-1 font-medium">{result.expectedProperties.hardness} HV</span>
                        </div>
                      )}
                      {result.expectedProperties.corrosionResistance && (
                        <div>
                          <span className="text-muted-foreground">Corrosion:</span>
                          <span className="ml-1 font-medium">{result.expectedProperties.corrosionResistance}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}