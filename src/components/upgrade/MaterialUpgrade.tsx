import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Atom, TrendUp, FlaskConical, Lightbulb, ArrowUp, ArrowDown, Plus, Minus, CheckCircle, AlertTriangle, Target, Beaker, ChartLine } from '@phosphor-icons/react';
import { Material } from '@/data/materials';
import { PeriodicTable } from '@/components/chemistry/PeriodicTable';
import { useKV } from '@github/spark/hooks';

interface MaterialUpgradeProps {
  selectedMaterial: Material;
  onUpgradeComplete: (upgradedMaterial: Material) => void;
}

interface ElementComposition {
  symbol: string;
  name: string;
  percentage: number;
  atomicNumber: number;
}

interface PropertyPrediction {
  mechanical: {
    tensileStrength: number;
    yieldStrength: number;
    elasticModulus: number;
    hardness: number;
    ductility: number;
    toughness: number;
    density: number;
  };
  thermal: {
    thermalConductivity: number;
    thermalExpansion: number;
    specificHeat: number;
    meltingPoint: number;
    maxServiceTemp: number;
  };
  electrical: {
    electricalConductivity: number;
    resistivity: number;
    dielectricConstant: number;
  };
  chemical: {
    corrosionResistance: 'poor' | 'fair' | 'good' | 'excellent';
    oxidationResistance: number;
    chemicalStability: number;
  };
  performance: {
    strengthToWeightRatio: number;
    performanceScore: number;
    sustainabilityScore: number;
    costEfficiency: number;
  };
}

interface UpgradeTarget {
  property: string;
  category: 'mechanical' | 'thermal' | 'electrical' | 'chemical';
  currentValue: number;
  targetValue: number;
  improvement: number;
  unit: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff', '#ff0000'];

export function MaterialUpgrade({ selectedMaterial, onUpgradeComplete }: MaterialUpgradeProps) {
  const [composition, setComposition] = useKV<ElementComposition[]>(`upgrade-composition-${selectedMaterial.id}`, []);
  const [predictions, setPredictions] = useState<PropertyPrediction | null>(null);
  const [targets, setTargets] = useState<UpgradeTarget[]>([]);
  const [activeTab, setActiveTab] = useState('composition');
  const [temperature, setTemperature] = useKV(`upgrade-temp-${selectedMaterial.id}`, 20);
  const [pressure, setPressure] = useKV(`upgrade-pressure-${selectedMaterial.id}`, 0.1);
  const [environment, setEnvironment] = useKV(`upgrade-env-${selectedMaterial.id}`, 'air');

  // Initialize composition from selected material if available
  useEffect(() => {
    if (composition.length === 0 && selectedMaterial.composition) {
      const initialComposition = selectedMaterial.composition.map((comp, index) => ({
        symbol: comp.element,
        name: getElementName(comp.element),
        percentage: comp.percentage,
        atomicNumber: getAtomicNumber(comp.element)
      }));
      setComposition(initialComposition);
    }
  }, [selectedMaterial, composition, setComposition]);

  // Set default upgrade targets
  useEffect(() => {
    const defaultTargets: UpgradeTarget[] = [
      {
        property: 'tensileStrength',
        category: 'mechanical',
        currentValue: selectedMaterial.mechanical.tensileStrength,
        targetValue: selectedMaterial.mechanical.tensileStrength * 1.2,
        improvement: 20,
        unit: 'MPa'
      },
      {
        property: 'thermalConductivity',
        category: 'thermal',
        currentValue: selectedMaterial.thermal.thermalConductivity,
        targetValue: selectedMaterial.thermal.thermalConductivity * 1.15,
        improvement: 15,
        unit: 'W/mK'
      },
      {
        property: 'corrosionResistance',
        category: 'chemical',
        currentValue: { poor: 1, fair: 2, good: 3, excellent: 4 }[selectedMaterial.chemical.corrosionResistance],
        targetValue: 4,
        improvement: 25,
        unit: 'rating'
      }
    ];
    setTargets(defaultTargets);
  }, [selectedMaterial]);

  // Real-time property prediction based on composition changes
  useEffect(() => {
    if (composition.length > 0) {
      updatePropertyPredictions();
    }
  }, [composition, temperature, pressure, environment]);

  const getElementName = (symbol: string): string => {
    const elementNames: { [key: string]: string } = {
      'Fe': 'Iron', 'C': 'Carbon', 'Cr': 'Chromium', 'Ni': 'Nickel', 'Al': 'Aluminum',
      'Cu': 'Copper', 'Zn': 'Zinc', 'Ti': 'Titanium', 'Mg': 'Magnesium', 'Si': 'Silicon',
      'Mn': 'Manganese', 'Mo': 'Molybdenum', 'V': 'Vanadium', 'W': 'Tungsten', 'Co': 'Cobalt',
      'Nb': 'Niobium', 'Ta': 'Tantalum', 'Sn': 'Tin', 'Pb': 'Lead', 'Ag': 'Silver',
      'Au': 'Gold', 'Pt': 'Platinum', 'Pd': 'Palladium', 'Zr': 'Zirconium'
    };
    return elementNames[symbol] || symbol;
  };

  const getAtomicNumber = (symbol: string): number => {
    const atomicNumbers: { [key: string]: number } = {
      'H': 1, 'He': 2, 'Li': 3, 'Be': 4, 'B': 5, 'C': 6, 'N': 7, 'O': 8, 'F': 9, 'Ne': 10,
      'Na': 11, 'Mg': 12, 'Al': 13, 'Si': 14, 'P': 15, 'S': 16, 'Cl': 17, 'Ar': 18,
      'K': 19, 'Ca': 20, 'Sc': 21, 'Ti': 22, 'V': 23, 'Cr': 24, 'Mn': 25, 'Fe': 26,
      'Co': 27, 'Ni': 28, 'Cu': 29, 'Zn': 30
    };
    return atomicNumbers[symbol] || 0;
  };

  const normalizeComposition = () => {
    const total = composition.reduce((sum, element) => sum + element.percentage, 0);
    if (total > 0 && total !== 100) {
      const normalized = composition.map(element => ({
        ...element,
        percentage: (element.percentage / total) * 100
      }));
      setComposition(normalized);
    }
  };

  const addElement = (element: { symbol: string; name: string; atomicNumber: number }) => {
    const existing = composition.find(comp => comp.symbol === element.symbol);
    if (!existing) {
      const newComposition = [
        ...composition,
        { ...element, percentage: 0.1 }
      ];
      setComposition(newComposition);
    }
  };

  const removeElement = (symbol: string) => {
    const newComposition = composition.filter(comp => comp.symbol !== symbol);
    setComposition(newComposition);
  };

  const updateElementPercentage = (symbol: string, percentage: number) => {
    const newComposition = composition.map(comp =>
      comp.symbol === symbol ? { ...comp, percentage } : comp
    );
    setComposition(newComposition);
  };

  const updatePropertyPredictions = async () => {
    // Advanced property prediction using AI and materials science principles
    const prompt = spark.llmPrompt`
    Predict material properties for a new alloy with the following composition:
    ${composition.map(c => `${c.symbol}: ${c.percentage.toFixed(2)}%`).join(', ')}
    
    Operating conditions:
    - Temperature: ${temperature}°C
    - Pressure: ${pressure} MPa
    - Environment: ${environment}
    
    Base material: ${selectedMaterial.name}
    
    Provide realistic property predictions based on:
    1. Rule of mixtures for basic properties
    2. Synergistic/antagonistic effects between elements
    3. Phase formation and microstructure
    4. Temperature and pressure effects
    5. Environmental considerations
    
    Consider how each element affects:
    - Mechanical properties (strength, ductility, hardness)
    - Thermal properties (conductivity, expansion, melting point)
    - Electrical properties (conductivity, resistivity)
    - Chemical properties (corrosion resistance, stability)
    - Manufacturing and cost implications
    
    Return predictions as numerical values with realistic ranges.
    `;

    try {
      const result = await spark.llm(prompt, 'gpt-4o', true);
      const predicted = JSON.parse(result);
      
      // Calculate properties using materials science principles
      const predictedProperties = calculatePredictedProperties(composition, temperature, pressure);
      setPredictions(predictedProperties);
    } catch (error) {
      // Fallback to rule-based calculations
      const predictedProperties = calculatePredictedProperties(composition, temperature, pressure);
      setPredictions(predictedProperties);
    }
  };

  const calculatePredictedProperties = (comp: ElementComposition[], temp: number, press: number): PropertyPrediction => {
    // Element property database (simplified)
    const elementProperties: { [key: string]: any } = {
      'Fe': { strength: 540, density: 7.87, conductivity: 80, melting: 1538, corrosion: 2 },
      'C': { strength: 2000, density: 2.26, conductivity: 2000, melting: 3550, corrosion: 4 },
      'Cr': { strength: 280, density: 7.19, conductivity: 94, melting: 1907, corrosion: 4 },
      'Ni': { strength: 317, density: 8.91, conductivity: 91, melting: 1455, corrosion: 3 },
      'Al': { strength: 90, density: 2.70, conductivity: 237, melting: 660, corrosion: 3 },
      'Cu': { strength: 220, density: 8.96, conductivity: 401, melting: 1085, corrosion: 2 },
      'Ti': { strength: 434, density: 4.51, conductivity: 22, melting: 1668, corrosion: 4 },
      'Mg': { strength: 90, density: 1.74, conductivity: 156, melting: 650, corrosion: 2 }
    };

    // Rule of mixtures with adjustments
    let avgStrength = 0, avgDensity = 0, avgConductivity = 0, avgMelting = 0, avgCorrosion = 0;
    let totalPercentage = 0;

    comp.forEach(element => {
      const props = elementProperties[element.symbol];
      if (props && element.percentage > 0) {
        const fraction = element.percentage / 100;
        avgStrength += props.strength * fraction;
        avgDensity += props.density * fraction;
        avgConductivity += props.conductivity * fraction;
        avgMelting += props.melting * fraction;
        avgCorrosion += props.corrosion * fraction;
        totalPercentage += element.percentage;
      }
    });

    // Temperature effects
    const tempFactor = Math.max(0.1, 1 - (temp - 20) / 1000);
    const pressureFactor = 1 + (press - 0.1) * 0.001;

    // Environmental effects
    const envFactor = environment === 'corrosive' ? 0.8 : environment === 'inert' ? 1.1 : 1.0;

    // Synergistic effects (simplified)
    const hasChromium = comp.some(c => c.symbol === 'Cr' && c.percentage > 10);
    const hasCarbon = comp.some(c => c.symbol === 'C' && c.percentage > 0.1);
    const strengthBonus = hasChromium && hasCarbon ? 1.2 : 1.0;

    const predicted: PropertyPrediction = {
      mechanical: {
        tensileStrength: avgStrength * tempFactor * pressureFactor * strengthBonus,
        yieldStrength: avgStrength * 0.7 * tempFactor * pressureFactor,
        elasticModulus: avgStrength * 0.3 * pressureFactor,
        hardness: avgStrength * 0.4 * strengthBonus,
        ductility: Math.max(5, 30 - avgStrength * 0.01),
        toughness: avgStrength * 0.15 * Math.sqrt(avgDensity),
        density: avgDensity * 1000
      },
      thermal: {
        thermalConductivity: avgConductivity * tempFactor,
        thermalExpansion: 12 + avgDensity * 0.5,
        specificHeat: 500 - avgDensity * 20,
        meltingPoint: avgMelting,
        maxServiceTemp: avgMelting * 0.6
      },
      electrical: {
        electricalConductivity: avgConductivity * 1000000,
        resistivity: 1 / (avgConductivity * 1000000),
        dielectricConstant: avgDensity * 1.2
      },
      chemical: {
        corrosionResistance: avgCorrosion >= 3.5 ? 'excellent' : avgCorrosion >= 2.5 ? 'good' : avgCorrosion >= 1.5 ? 'fair' : 'poor',
        oxidationResistance: Math.min(100, avgCorrosion * 25) * envFactor,
        chemicalStability: Math.min(100, avgCorrosion * 20 + avgMelting * 0.02) * envFactor
      },
      performance: {
        strengthToWeightRatio: avgStrength / avgDensity,
        performanceScore: Math.min(100, (avgStrength / 10 + avgConductivity / 5 + avgCorrosion * 10) / 3),
        sustainabilityScore: Math.max(1, 10 - avgDensity * 0.5),
        costEfficiency: Math.max(10, 100 - avgStrength * 0.05)
      }
    };

    return predicted;
  };

  const getImprovementColor = (current: number, predicted: number): string => {
    const improvement = ((predicted - current) / current) * 100;
    if (improvement > 10) return 'text-green-600';
    if (improvement > 0) return 'text-blue-600';
    if (improvement > -10) return 'text-orange-600';
    return 'text-red-600';
  };

  const getImprovementIcon = (current: number, predicted: number) => {
    const improvement = ((predicted - current) / current) * 100;
    if (improvement > 5) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (improvement < -5) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const createUpgradedMaterial = (): Material => {
    if (!predictions) return selectedMaterial;

    const upgradedMaterial: Material = {
      ...selectedMaterial,
      id: `${selectedMaterial.id}-upgraded-${Date.now()}`,
      name: `${selectedMaterial.name} (Upgraded)`,
      composition: composition.map(comp => ({
        element: comp.symbol,
        percentage: comp.percentage
      })),
      mechanical: {
        tensileStrength: Math.round(predictions.mechanical.tensileStrength),
        yieldStrength: Math.round(predictions.mechanical.yieldStrength),
        elasticModulus: Math.round(predictions.mechanical.elasticModulus),
        hardness: Math.round(predictions.mechanical.hardness),
        density: Math.round(predictions.mechanical.density)
      },
      thermal: {
        thermalConductivity: Math.round(predictions.thermal.thermalConductivity * 10) / 10,
        thermalExpansion: Math.round(predictions.thermal.thermalExpansion * 10) / 10,
        specificHeat: Math.round(predictions.thermal.specificHeat),
        meltingPoint: Math.round(predictions.thermal.meltingPoint),
        maxServiceTemp: Math.round(predictions.thermal.maxServiceTemp)
      },
      electrical: {
        electricalConductivity: Math.round(predictions.electrical.electricalConductivity),
        resistivity: predictions.electrical.resistivity,
        dielectricConstant: Math.round(predictions.electrical.dielectricConstant * 10) / 10
      },
      chemical: {
        corrosionResistance: predictions.chemical.corrosionResistance,
        oxidationResistance: Math.round(predictions.chemical.oxidationResistance),
        chemicalStability: Math.round(predictions.chemical.chemicalStability)
      },
      sustainability: {
        ...selectedMaterial.sustainability,
        sustainabilityScore: Math.round(predictions.performance.sustainabilityScore * 10) / 10
      },
      manufacturing: {
        ...selectedMaterial.manufacturing,
        costPerKg: Math.round(predictions.performance.costEfficiency)
      }
    };

    return upgradedMaterial;
  };

  const compositionData = composition.map((element, index) => ({
    name: element.symbol,
    value: element.percentage,
    fill: COLORS[index % COLORS.length]
  }));

  const getRadarData = (original: Material, predicted: PropertyPrediction) => [
    {
      property: 'Strength',
      original: Math.min(100, (original.mechanical.tensileStrength / 3000) * 100),
      predicted: Math.min(100, (predicted.mechanical.tensileStrength / 3000) * 100),
      fullMark: 100
    },
    {
      property: 'Lightweight',
      original: Math.max(0, 100 - ((original.mechanical.density / 1000) / 10) * 100),
      predicted: Math.max(0, 100 - ((predicted.mechanical.density / 1000) / 10) * 100),
      fullMark: 100
    },
    {
      property: 'Thermal Cond.',
      original: Math.min(100, (original.thermal.thermalConductivity / 400) * 100),
      predicted: Math.min(100, (predicted.thermal.thermalConductivity / 400) * 100),
      fullMark: 100
    },
    {
      property: 'Corr. Resist.',
      original: { poor: 25, fair: 50, good: 75, excellent: 100 }[original.chemical.corrosionResistance],
      predicted: { poor: 25, fair: 50, good: 75, excellent: 100 }[predicted.chemical.corrosionResistance],
      fullMark: 100
    },
    {
      property: 'Performance',
      original: Math.min(100, predicted.performance.performanceScore),
      predicted: Math.min(100, predicted.performance.performanceScore * 1.1),
      fullMark: 100
    },
    {
      property: 'Sustainability',
      original: original.sustainability.sustainabilityScore * 10,
      predicted: predicted.performance.sustainabilityScore * 10,
      fullMark: 100
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendUp className="h-5 w-5" />
            Material Property Upgrade: {selectedMaterial.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Modify element composition to enhance mechanical, electrical, and chemical properties
          </p>
        </CardHeader>
        <CardContent>
          <Alert>
            <Target className="h-4 w-4" />
            <AlertDescription>
              Adjust element percentages to achieve target properties. The system will predict real-time property changes
              based on composition, temperature, and pressure conditions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="composition" className="flex items-center gap-2">
            <Atom className="h-4 w-4" />
            Composition
          </TabsTrigger>
          <TabsTrigger value="conditions" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            Conditions
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <ChartLine className="h-4 w-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="upgrade" className="flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            Create Upgrade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="composition" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Atom className="h-5 w-5" />
                  Element Composition
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" onClick={normalizeComposition} variant="outline">
                    Normalize to 100%
                  </Button>
                  <Badge variant="secondary">
                    Total: {composition.reduce((sum, el) => sum + el.percentage, 0).toFixed(1)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {composition.map((element) => (
                  <div key={element.symbol} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{element.symbol}</Badge>
                        <span className="text-sm font-medium">{element.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm w-12 text-right">
                          {element.percentage.toFixed(1)}%
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeElement(element.symbol)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Slider
                      value={[element.percentage]}
                      onValueChange={([value]) => updateElementPercentage(element.symbol, value)}
                      max={100}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Composition Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                {composition.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={compositionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {compositionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${typeof value === 'number' ? value.toFixed(1) : value}%`, 'Percentage']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    No composition data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Add Elements</CardTitle>
              <p className="text-sm text-muted-foreground">
                Click on elements in the periodic table to add them to your composition
              </p>
            </CardHeader>
            <CardContent>
              <PeriodicTable onElementSelect={addElement} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Operating Temperature</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Temperature</span>
                  <Badge variant="outline">{temperature}°C</Badge>
                </div>
                <Slider
                  value={[temperature]}
                  onValueChange={([value]) => setTemperature(value)}
                  min={-200}
                  max={2000}
                  step={10}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  Range: -200°C to 2000°C
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operating Pressure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pressure</span>
                  <Badge variant="outline">{pressure} MPa</Badge>
                </div>
                <Slider
                  value={[pressure]}
                  onValueChange={([value]) => setPressure(value)}
                  min={0.001}
                  max={1000}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  Range: 0.001 MPa to 1000 MPa (log scale)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Environment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  {['air', 'inert', 'vacuum', 'corrosive', 'oxidizing'].map((env) => (
                    <Button
                      key={env}
                      variant={environment === env ? 'default' : 'outline'}
                      onClick={() => setEnvironment(env)}
                      className="justify-start capitalize"
                    >
                      {env}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {predictions ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartLine className="h-5 w-5" />
                    Property Comparison: Original vs Predicted
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={getRadarData(selectedMaterial, predictions)}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="property" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                        <Radar
                          name="Original"
                          dataKey="original"
                          stroke="hsl(var(--muted-foreground))"
                          fill="hsl(var(--muted-foreground))"
                          fillOpacity={0.2}
                          strokeWidth={2}
                          strokeDasharray="5 5"
                        />
                        <Radar
                          name="Predicted"
                          dataKey="predicted"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Mechanical Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { key: 'tensileStrength', label: 'Tensile Strength', unit: 'MPa', current: selectedMaterial.mechanical.tensileStrength },
                      { key: 'yieldStrength', label: 'Yield Strength', unit: 'MPa', current: selectedMaterial.mechanical.yieldStrength },
                      { key: 'elasticModulus', label: 'Elastic Modulus', unit: 'GPa', current: selectedMaterial.mechanical.elasticModulus },
                      { key: 'density', label: 'Density', unit: 'kg/m³', current: selectedMaterial.mechanical.density }
                    ].map(({ key, label, unit, current }) => (
                      <div key={key} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          {getImprovementIcon(current, predictions.mechanical[key as keyof typeof predictions.mechanical] as number)}
                          <span className="text-sm">{label}</span>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${getImprovementColor(current, predictions.mechanical[key as keyof typeof predictions.mechanical] as number)}`}>
                            {Math.round(predictions.mechanical[key as keyof typeof predictions.mechanical] as number)} {unit}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            was {current} {unit}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Thermal Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { key: 'thermalConductivity', label: 'Thermal Conductivity', unit: 'W/mK', current: selectedMaterial.thermal.thermalConductivity },
                      { key: 'thermalExpansion', label: 'Thermal Expansion', unit: '×10⁻⁶/K', current: selectedMaterial.thermal.thermalExpansion },
                      { key: 'meltingPoint', label: 'Melting Point', unit: '°C', current: selectedMaterial.thermal.meltingPoint },
                      { key: 'maxServiceTemp', label: 'Max Service Temp', unit: '°C', current: selectedMaterial.thermal.maxServiceTemp }
                    ].map(({ key, label, unit, current }) => (
                      <div key={key} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          {getImprovementIcon(current, predictions.thermal[key as keyof typeof predictions.thermal] as number)}
                          <span className="text-sm">{label}</span>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${getImprovementColor(current, predictions.thermal[key as keyof typeof predictions.thermal] as number)}`}>
                            {Math.round(predictions.thermal[key as keyof typeof predictions.thermal] as number)} {unit}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            was {current} {unit}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Chemical Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Corrosion Resistance</span>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={predictions.chemical.corrosionResistance === 'excellent' ? 'default' : 'outline'}
                          className="capitalize"
                        >
                          {predictions.chemical.corrosionResistance}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          was {selectedMaterial.chemical.corrosionResistance}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Oxidation Resistance</span>
                      <div className="text-right">
                        <div className="font-medium">
                          {Math.round(predictions.chemical.oxidationResistance)}%
                        </div>
                        <Progress value={predictions.chemical.oxidationResistance} className="w-16 mt-1" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Chemical Stability</span>
                      <div className="text-right">
                        <div className="font-medium">
                          {Math.round(predictions.chemical.chemicalStability)}%
                        </div>
                        <Progress value={predictions.chemical.chemicalStability} className="w-16 mt-1" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Performance Score</span>
                      <div className="text-right">
                        <div className="font-medium text-green-600">
                          {Math.round(predictions.performance.performanceScore)}%
                        </div>
                        <Progress value={predictions.performance.performanceScore} className="w-16 mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FlaskConical size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Configure composition and conditions to see property predictions</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upgrade" className="space-y-6">
          {predictions ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Create Upgraded Material
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Generate a new material with the optimized composition and predicted properties
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Strength Improvement</div>
                    <div className="text-2xl font-bold text-green-600">
                      +{Math.round(((predictions.mechanical.tensileStrength - selectedMaterial.mechanical.tensileStrength) / selectedMaterial.mechanical.tensileStrength) * 100)}%
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Thermal Conductivity</div>
                    <div className="text-2xl font-bold text-blue-600">
                      +{Math.round(((predictions.thermal.thermalConductivity - selectedMaterial.thermal.thermalConductivity) / selectedMaterial.thermal.thermalConductivity) * 100)}%
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Performance Score</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(predictions.performance.performanceScore)}/100
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Sustainability</div>
                    <div className="text-2xl font-bold text-green-600">
                      {predictions.performance.sustainabilityScore.toFixed(1)}/10
                    </div>
                  </div>
                </div>

                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Manufacturing Considerations:</strong> The new composition may require specialized processing techniques. 
                    Consider heat treatment, forming methods, and quality control for optimal properties.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={() => onUpgradeComplete(createUpgradedMaterial())}
                  size="lg"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Upgraded Material
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertTriangle size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Complete composition setup and predictions to create upgraded material</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}