import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TestTube, ChartLine, Thermometer, Lightning, Atom, FlaskConical } from '@phosphor-icons/react';

interface Material {
  id: string;
  name: string;
  type: string;
  performanceScore: number;
  costScore: number;
  sustainabilityScore: number;
  overallScore: number;
  properties: {
    tensileStrength: number;
    density: number;
    thermalConductivity: number;
    electricalConductivity: number;
  };
  suppliers: Array<{
    name: string;
    region: string;
    price: number;
    availability: string;
  }>;
}

interface PropertiesProps {
  selectedMaterial: Material | null;
  materials: Material[];
}

const temperatureData = [
  { temp: -50, strength: 120, conductivity: 95 },
  { temp: 0, strength: 100, conductivity: 100 },
  { temp: 100, strength: 95, conductivity: 102 },
  { temp: 200, strength: 88, conductivity: 105 },
  { temp: 300, strength: 80, conductivity: 108 },
  { temp: 500, strength: 65, conductivity: 115 },
  { temp: 800, strength: 40, conductivity: 125 },
];

const stressStrainData = [
  { strain: 0, stress: 0 },
  { strain: 0.001, stress: 200 },
  { strain: 0.002, stress: 400 },
  { strain: 0.005, stress: 500 },
  { strain: 0.01, stress: 550 },
  { strain: 0.02, stress: 580 },
  { strain: 0.05, stress: 600 },
];

export function Properties({ selectedMaterial, materials }: PropertiesProps) {
  const [selectedComparison, setSelectedComparison] = useState<string>('');
  const [simulationType, setSimulationType] = useState<string>('mechanical');

  const getRadarData = (material: Material) => [
    {
      property: 'Strength',
      value: Math.min(100, (material.properties.tensileStrength / 1000) * 100),
      fullMark: 100
    },
    {
      property: 'Lightweight',
      value: Math.max(0, 100 - (material.properties.density * 15)),
      fullMark: 100
    },
    {
      property: 'Thermal Cond.',
      value: Math.min(100, (material.properties.thermalConductivity / 200) * 100),
      fullMark: 100
    },
    {
      property: 'Electrical Cond.',
      value: Math.min(100, (material.properties.electricalConductivity / 60) * 100),
      fullMark: 100
    },
    {
      property: 'Cost Efficiency',
      value: material.costScore,
      fullMark: 100
    },
    {
      property: 'Sustainability',
      value: material.sustainabilityScore,
      fullMark: 100
    }
  ];

  const comparisonMaterial = materials.find(m => m.id === selectedComparison);

  return (
    <div className="space-y-6">
      {!selectedMaterial ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <TestTube size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Select a material from Overview to view properties</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Material Properties: {selectedMaterial.name}
              </CardTitle>
              <Badge variant="secondary">{selectedMaterial.type}</Badge>
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
                        <div className="font-medium">{selectedMaterial.properties.tensileStrength} MPa</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedMaterial.properties.tensileStrength > 500 ? 'High' : 
                           selectedMaterial.properties.tensileStrength > 200 ? 'Medium' : 'Low'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Atom className="h-4 w-4 text-sustainability" />
                        <span className="text-sm">Density</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{selectedMaterial.properties.density} g/cm³</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedMaterial.properties.density < 3 ? 'Lightweight' : 
                           selectedMaterial.properties.density < 6 ? 'Medium' : 'Heavy'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-cost" />
                        <span className="text-sm">Thermal Conductivity</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{selectedMaterial.properties.thermalConductivity} W/mK</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedMaterial.properties.thermalConductivity > 100 ? 'High' : 
                           selectedMaterial.properties.thermalConductivity > 20 ? 'Medium' : 'Low'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <ChartLine className="h-4 w-4 text-accent" />
                        <span className="text-sm">Electrical Conductivity</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{selectedMaterial.properties.electricalConductivity} MS/m</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedMaterial.properties.electricalConductivity > 30 ? 'High' : 
                           selectedMaterial.properties.electricalConductivity > 1 ? 'Medium' : 'Low'}
                        </div>
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
                <CardTitle>Temperature Performance</CardTitle>
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
                        label={{ value: 'Relative Performance (%)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value, name) => [`${value}%`, name === 'strength' ? 'Strength' : 'Conductivity']}
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stress-Strain Curve</CardTitle>
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
                        formatter={(value) => [`${value} MPa`, 'Stress']}
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
          </div>

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
                          .filter(m => m.id !== selectedMaterial.id)
                          .map((material) => (
                            <SelectItem key={material.id} value={material.id}>
                              {material.name} - {material.type}
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
                              <Progress value={selectedMaterial.performanceScore} className="w-20" />
                              <span className="text-sm w-8">{selectedMaterial.performanceScore}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Cost</span>
                            <div className="flex items-center gap-2">
                              <Progress value={selectedMaterial.costScore} className="w-20" />
                              <span className="text-sm w-8">{selectedMaterial.costScore}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Sustainability</span>
                            <div className="flex items-center gap-2">
                              <Progress value={selectedMaterial.sustainabilityScore} className="w-20" />
                              <span className="text-sm w-8">{selectedMaterial.sustainabilityScore}%</span>
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
                              <Progress value={comparisonMaterial.performanceScore} className="w-20" />
                              <span className="text-sm w-8">{comparisonMaterial.performanceScore}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Cost</span>
                            <div className="flex items-center gap-2">
                              <Progress value={comparisonMaterial.costScore} className="w-20" />
                              <span className="text-sm w-8">{comparisonMaterial.costScore}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Sustainability</span>
                            <div className="flex items-center gap-2">
                              <Progress value={comparisonMaterial.sustainabilityScore} className="w-20" />
                              <span className="text-sm w-8">{comparisonMaterial.sustainabilityScore}%</span>
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
      )}
    </div>
  );
}