import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TestTube, ChartLine, Thermometer, Lightning, Atom, FlaskConical, Calculator, BarChart3, Lightbulb } from '@phosphor-icons/react';
import { Material } from '@/data/materials';
import { SimulationTools } from '@/components/simulation/SimulationTools';
import { SimulationResults } from '@/services/simulation';

interface PropertiesProps {
  selectedMaterial: Material | null;
  materials: Material[];
}

export function Properties({ selectedMaterial, materials }: PropertiesProps) {
  const [selectedComparison, setSelectedComparison] = useState<string>('');
  const [simulationType, setSimulationType] = useState<string>('mechanical');
  const [activeTab, setActiveTab] = useState('overview');
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);

  // Sample data for charts - enhanced with pressure sensitivity
  const temperatureData = selectedMaterial ? [
    { temp: -100, strength: Math.max(20, selectedMaterial.mechanical.tensileStrength * 1.3), conductivity: selectedMaterial.thermal.thermalConductivity * 0.9 },
    { temp: -50, strength: Math.max(20, selectedMaterial.mechanical.tensileStrength * 1.2), conductivity: selectedMaterial.thermal.thermalConductivity * 0.95 },
    { temp: 0, strength: selectedMaterial.mechanical.tensileStrength, conductivity: selectedMaterial.thermal.thermalConductivity },
    { temp: 100, strength: selectedMaterial.mechanical.tensileStrength * 0.95, conductivity: selectedMaterial.thermal.thermalConductivity * 1.02 },
    { temp: 200, strength: selectedMaterial.mechanical.tensileStrength * 0.88, conductivity: selectedMaterial.thermal.thermalConductivity * 1.05 },
    { temp: 300, strength: selectedMaterial.mechanical.tensileStrength * 0.8, conductivity: selectedMaterial.thermal.thermalConductivity * 1.08 },
    { temp: 500, strength: selectedMaterial.mechanical.tensileStrength * 0.65, conductivity: selectedMaterial.thermal.thermalConductivity * 1.15 },
    { temp: 800, strength: Math.max(10, selectedMaterial.mechanical.tensileStrength * 0.4), conductivity: selectedMaterial.thermal.thermalConductivity * 1.25 },
    { temp: 1000, strength: Math.max(5, selectedMaterial.mechanical.tensileStrength * 0.2), conductivity: selectedMaterial.thermal.thermalConductivity * 1.3 },
  ] : [];

  const pressureData = selectedMaterial ? [
    { pressure: 0.1, strength: selectedMaterial.mechanical.tensileStrength, modulus: selectedMaterial.mechanical.elasticModulus },
    { pressure: 1, strength: selectedMaterial.mechanical.tensileStrength * 1.02, modulus: selectedMaterial.mechanical.elasticModulus * 1.01 },
    { pressure: 10, strength: selectedMaterial.mechanical.tensileStrength * 1.05, modulus: selectedMaterial.mechanical.elasticModulus * 1.02 },
    { pressure: 100, strength: selectedMaterial.mechanical.tensileStrength * 1.15, modulus: selectedMaterial.mechanical.elasticModulus * 1.05 },
    { pressure: 500, strength: selectedMaterial.mechanical.tensileStrength * 1.25, modulus: selectedMaterial.mechanical.elasticModulus * 1.1 },
    { pressure: 1000, strength: selectedMaterial.mechanical.tensileStrength * 1.35, modulus: selectedMaterial.mechanical.elasticModulus * 1.15 },
  ] : [];

  const stressStrainData = selectedMaterial ? [
    { strain: 0, stress: 0 },
    { strain: 0.001, stress: selectedMaterial.mechanical.elasticModulus * 0.001 },
    { strain: 0.002, stress: selectedMaterial.mechanical.elasticModulus * 0.002 },
    { strain: 0.005, stress: selectedMaterial.mechanical.yieldStrength },
    { strain: 0.01, stress: selectedMaterial.mechanical.tensileStrength * 0.9 },
    { strain: 0.02, stress: selectedMaterial.mechanical.tensileStrength * 0.95 },
    { strain: 0.05, stress: selectedMaterial.mechanical.tensileStrength },
  ] : [];

  const handleSimulationComplete = (results: SimulationResults) => {
    setSimulationResults(results);
  };

  const getRadarData = (material: Material) => [
    {
      property: 'Strength',
      value: Math.min(100, (material.mechanical.tensileStrength / 3000) * 100),
      fullMark: 100
    },
    {
      property: 'Lightweight',
      value: Math.max(0, 100 - ((material.mechanical.density / 1000) * 10)),
      fullMark: 100
    },
    {
      property: 'Thermal Cond.',
      value: Math.min(100, (material.thermal.thermalConductivity / 400) * 100),
      fullMark: 100
    },
    {
      property: 'Corr. Resist.',
      value: { poor: 25, fair: 50, good: 75, excellent: 100 }[material.chemical.corrosionResistance],
      fullMark: 100
    },
    {
      property: 'Cost Efficiency',
      value: Math.max(0, 100 - (material.manufacturing.costPerKg / 100 * 100)),
      fullMark: 100
    },
    {
      property: 'Sustainability',
      value: material.sustainability.sustainabilityScore * 10,
      fullMark: 100
    }
  ];

  const calculatePerformanceScore = (material: Material): number => {
    const strengthScore = Math.min(material.mechanical.tensileStrength / 3000 * 100, 100);
    const densityScore = Math.max(100 - (material.mechanical.density / 10000 * 100), 0);
    const thermalScore = Math.min(material.thermal.thermalConductivity / 400 * 100, 100);
    
    return Math.round((strengthScore * 0.4 + densityScore * 0.3 + thermalScore * 0.3));
  };

  const calculateCostScore = (material: Material): number => {
    const maxCost = 100; // USD/kg
    return Math.max(100 - (material.manufacturing.costPerKg / maxCost * 100), 0);
  };

  const comparisonMaterial = materials.find(m => m.id === selectedComparison);

  return (
    <div className="space-y-6">
      {!selectedMaterial ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <TestTube size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Select a material from Overview to view properties and run simulations</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Property Overview
            </TabsTrigger>
            <TabsTrigger value="simulation" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              AI Simulation
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Advanced Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <PropertyOverview 
              selectedMaterial={selectedMaterial} 
              materials={materials}
              selectedComparison={selectedComparison}
              setSelectedComparison={setSelectedComparison}
              temperatureData={temperatureData}
              pressureData={pressureData}
              stressStrainData={stressStrainData}
              getRadarData={getRadarData}
              calculatePerformanceScore={calculatePerformanceScore}
              calculateCostScore={calculateCostScore}
            />
          </TabsContent>

          <TabsContent value="simulation" className="space-y-6">
            <SimulationTools 
              selectedMaterial={selectedMaterial}
              onSimulationComplete={handleSimulationComplete}
            />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <AdvancedAnalysis 
              selectedMaterial={selectedMaterial}
              simulationResults={simulationResults}
              materials={materials}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

// Property Overview Component
function PropertyOverview({ 
  selectedMaterial, 
  materials, 
  selectedComparison, 
  setSelectedComparison, 
  temperatureData, 
  pressureData,
  stressStrainData,
  getRadarData,
  calculatePerformanceScore,
  calculateCostScore 
}: any) {
  const comparisonMaterial = materials.find((m: Material) => m.id === selectedComparison);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Material Properties: {selectedMaterial.name}
          </CardTitle>
          <Badge variant="secondary">{selectedMaterial.category}</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-4">Key Properties</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Lightning className="h-4 w-4 text-performance" />
                    <span className="text-sm">Tensile Strength</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{selectedMaterial.mechanical.tensileStrength} MPa</div>
                    <div className="text-xs text-muted-foreground">
                      {selectedMaterial.mechanical.tensileStrength > 1000 ? 'High' : 
                       selectedMaterial.mechanical.tensileStrength > 500 ? 'Medium' : 'Low'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Atom className="h-4 w-4 text-sustainability" />
                    <span className="text-sm">Density</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{(selectedMaterial.mechanical.density / 1000).toFixed(2)} g/cm³</div>
                    <div className="text-xs text-muted-foreground">
                      {selectedMaterial.mechanical.density < 3000 ? 'Lightweight' : 
                       selectedMaterial.mechanical.density < 6000 ? 'Medium' : 'Heavy'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-cost" />
                    <span className="text-sm">Thermal Conductivity</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{selectedMaterial.thermal.thermalConductivity} W/mK</div>
                    <div className="text-xs text-muted-foreground">
                      {selectedMaterial.thermal.thermalConductivity > 100 ? 'High' : 
                       selectedMaterial.thermal.thermalConductivity > 20 ? 'Medium' : 'Low'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <ChartLine className="h-4 w-4 text-accent" />
                    <span className="text-sm">Max Service Temp</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{selectedMaterial.thermal.maxServiceTemp}°C</div>
                    <div className="text-xs text-muted-foreground">
                      {selectedMaterial.thermal.maxServiceTemp > 800 ? 'High Temp' : 
                       selectedMaterial.thermal.maxServiceTemp > 300 ? 'Medium Temp' : 'Low Temp'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Lightning className="h-4 w-4 text-performance" />
                    <span className="text-sm">Corrosion Resistance</span>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="capitalize">
                      {selectedMaterial.chemical.corrosionResistance}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Performance Radar</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={getRadarData(selectedMaterial)}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="property" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                    <Radar
                      name="Properties"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Temperature Sensitivity Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="temp" 
                    label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    label={{ value: 'Performance', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${typeof value === 'number' ? value.toFixed(1) : value}${name === 'strength' ? ' MPa' : ' W/mK'}`, name === 'strength' ? 'Strength' : 'Conductivity']}
                    labelFormatter={(temp) => `Temperature: ${temp}°C`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="strength" 
                    stroke="hsl(var(--performance))" 
                    strokeWidth={2}
                    name="strength"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="conductivity" 
                    stroke="hsl(var(--cost))" 
                    strokeWidth={2}
                    name="conductivity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>• Strength typically decreases with temperature</p>
              <p>• Thermal conductivity may increase with temperature for metals</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightning className="h-5 w-5" />
              Pressure Sensitivity Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pressureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="pressure" 
                    scale="log"
                    domain={['dataMin', 'dataMax']}
                    label={{ value: 'Pressure (MPa)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    label={{ value: 'Property Value', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${typeof value === 'number' ? value.toFixed(1) : value}${name === 'strength' ? ' MPa' : ' GPa'}`, name === 'strength' ? 'Strength' : 'Modulus']}
                    labelFormatter={(pressure) => `Pressure: ${pressure} MPa`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="strength" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    name="strength"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="modulus" 
                    stroke="hsl(var(--scientific))" 
                    strokeWidth={2}
                    name="modulus"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>• Most materials strengthen under hydrostatic pressure</p>
              <p>• Elastic modulus increases with pressure compression</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stress-Strain Behavior</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stressStrainData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="strain" 
                  label={{ value: 'Strain', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Stress (MPa)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value) => [`${typeof value === 'number' ? value.toFixed(1) : value} MPa`, 'Stress']}
                  labelFormatter={(strain) => `Strain: ${strain}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="stress" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {materials.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Material Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Compare with:</label>
                <Select value={selectedComparison} onValueChange={setSelectedComparison}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select material to compare" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials
                      .filter((m: Material) => m.id !== selectedMaterial.id)
                      .map((material: Material) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name} - {material.category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {comparisonMaterial && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-3">{selectedMaterial.name}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Performance</span>
                        <div className="flex items-center gap-2">
                          <Progress value={calculatePerformanceScore(selectedMaterial)} className="w-20" />
                          <span className="text-sm w-8">{calculatePerformanceScore(selectedMaterial)}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cost</span>
                        <div className="flex items-center gap-2">
                          <Progress value={calculateCostScore(selectedMaterial)} className="w-20" />
                          <span className="text-sm w-8">{Math.round(calculateCostScore(selectedMaterial))}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sustainability</span>
                        <div className="flex items-center gap-2">
                          <Progress value={selectedMaterial.sustainability.sustainabilityScore * 10} className="w-20" />
                          <span className="text-sm w-8">{selectedMaterial.sustainability.sustainabilityScore}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">{comparisonMaterial.name}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Performance</span>
                        <div className="flex items-center gap-2">
                          <Progress value={calculatePerformanceScore(comparisonMaterial)} className="w-20" />
                          <span className="text-sm w-8">{calculatePerformanceScore(comparisonMaterial)}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cost</span>
                        <div className="flex items-center gap-2">
                          <Progress value={calculateCostScore(comparisonMaterial)} className="w-20" />
                          <span className="text-sm w-8">{Math.round(calculateCostScore(comparisonMaterial))}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sustainability</span>
                        <div className="flex items-center gap-2">
                          <Progress value={comparisonMaterial.sustainability.sustainabilityScore * 10} className="w-20" />
                          <span className="text-sm w-8">{comparisonMaterial.sustainability.sustainabilityScore}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

// Advanced Analysis Component
function AdvancedAnalysis({ selectedMaterial, simulationResults, materials }: any) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Advanced Material Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {simulationResults ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Simulation Confidence</div>
                  <div className="text-2xl font-bold">
                    {(simulationResults.confidence * 100).toFixed(1)}%
                  </div>
                  <Progress value={simulationResults.confidence * 100} className="mt-2" />
                </Card>
                
                {simulationResults.predictedProperties.mechanical && (
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Predicted Strength</div>
                    <div className="text-2xl font-bold">
                      {simulationResults.predictedProperties.mechanical.tensileStrength?.toFixed(0)} MPa
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      vs {selectedMaterial.mechanical.tensileStrength} MPa (database)
                    </div>
                  </Card>
                )}
                
                {simulationResults.predictedProperties.thermal && (
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Thermal Conductivity</div>
                    <div className="text-2xl font-bold">
                      {simulationResults.predictedProperties.thermal.thermalConductivity?.toFixed(1)} W/mK
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      vs {selectedMaterial.thermal.thermalConductivity} W/mK (database)
                    </div>
                  </Card>
                )}
                
                {simulationResults.predictedProperties.thermal?.thermalStress && (
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Thermal Stress</div>
                    <div className="text-2xl font-bold">
                      {simulationResults.predictedProperties.thermal.thermalStress.toFixed(0)} MPa
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Temperature-induced stress
                    </div>
                  </Card>
                )}
                
                {simulationResults.predictedProperties.mechanical?.creepRate && (
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Creep Rate</div>
                    <div className="text-2xl font-bold">
                      {simulationResults.predictedProperties.mechanical.creepRate.toExponential(2)}/yr
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Long-term deformation rate
                    </div>
                  </Card>
                )}
                
                {simulationResults.predictedProperties.chemical && (
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Corrosion Rate</div>
                    <div className="text-2xl font-bold">
                      {simulationResults.predictedProperties.chemical.corrosionRate?.toFixed(2)} mm/yr
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Predicted for current conditions
                    </div>
                  </Card>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {simulationResults.recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">AI Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {simulationResults.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Uncertainty Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {simulationResults.uncertaintyBands.mechanical && Object.entries(simulationResults.uncertaintyBands.mechanical).slice(0, 3).map(([property, range]: [string, any]) => (
                        <div key={property} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{property.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-muted-foreground">
                              {range.min.toFixed(1)} - {range.max.toFixed(1)}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: '70%', marginLeft: '15%' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                Run a simulation in the AI Simulation tab to see advanced analysis results.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}