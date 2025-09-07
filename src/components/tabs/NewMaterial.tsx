import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TestTube, Atom, Lightning, FlaskConical } from '@phosphor-icons/react';
import { toast } from 'sonner';

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

interface NewMaterialProps {
  onMaterialCreated: (material: Material) => void;
}

const elements = [
  { symbol: 'Fe', name: 'Iron', category: 'Metal' },
  { symbol: 'Al', name: 'Aluminum', category: 'Metal' },
  { symbol: 'Cu', name: 'Copper', category: 'Metal' },
  { symbol: 'Ti', name: 'Titanium', category: 'Metal' },
  { symbol: 'C', name: 'Carbon', category: 'Nonmetal' },
  { symbol: 'Si', name: 'Silicon', category: 'Nonmetal' },
  { symbol: 'Ni', name: 'Nickel', category: 'Metal' },
  { symbol: 'Cr', name: 'Chromium', category: 'Metal' },
];

export function NewMaterial({ onMaterialCreated }: NewMaterialProps) {
  const [materialName, setMaterialName] = useState('');
  const [selectedElements, setSelectedElements] = useState<Array<{element: typeof elements[0], percentage: number}>>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  const addElement = (element: typeof elements[0]) => {
    if (selectedElements.find(e => e.element.symbol === element.symbol)) {
      toast.error('Element already added');
      return;
    }
    
    const remaining = 100 - selectedElements.reduce((sum, e) => sum + e.percentage, 0);
    if (remaining <= 0) {
      toast.error('Total composition cannot exceed 100%');
      return;
    }
    
    setSelectedElements(prev => [...prev, { element, percentage: Math.min(remaining, 20) }]);
  };

  const updatePercentage = (index: number, percentage: number) => {
    setSelectedElements(prev => prev.map((item, i) => 
      i === index ? { ...item, percentage } : item
    ));
  };

  const removeElement = (index: number) => {
    setSelectedElements(prev => prev.filter((_, i) => i !== index));
  };

  const totalPercentage = selectedElements.reduce((sum, e) => sum + e.percentage, 0);

  const simulateProperties = async () => {
    if (selectedElements.length === 0) {
      toast.error('Please add at least one element');
      return;
    }
    
    if (Math.abs(totalPercentage - 100) > 0.1) {
      toast.error('Total composition must equal 100%');
      return;
    }

    setIsSimulating(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock property calculations based on composition
    const hasIron = selectedElements.find(e => e.element.symbol === 'Fe');
    const hasCarbon = selectedElements.find(e => e.element.symbol === 'C');
    const hasAluminum = selectedElements.find(e => e.element.symbol === 'Al');
    
    const properties = {
      tensileStrength: hasIron ? 400 + (hasCarbon?.percentage || 0) * 10 : hasAluminum ? 300 : 250,
      density: hasIron ? 7.8 - (hasAluminum?.percentage || 0) * 0.05 : hasAluminum ? 2.7 : 5.0,
      thermalConductivity: hasAluminum ? 200 - (hasIron?.percentage || 0) * 1.5 : 80,
      electricalConductivity: selectedElements.find(e => e.element.symbol === 'Cu') ? 60 : hasAluminum ? 38 : 10,
    };
    
    const performanceScore = Math.min(95, Math.max(60, properties.tensileStrength / 10 + Math.random() * 10));
    const costScore = Math.min(95, Math.max(40, 100 - (properties.density * 8) + Math.random() * 15));
    const sustainabilityScore = Math.min(95, Math.max(50, hasAluminum ? 85 : 70 + Math.random() * 10));
    
    setSimulationResults({
      properties,
      performanceScore,
      costScore,
      sustainabilityScore,
      overallScore: (performanceScore + costScore + sustainabilityScore) / 3,
      confidence: Math.min(95, 70 + selectedElements.length * 5),
    });
    
    setIsSimulating(false);
    toast.success('Material properties simulated successfully');
  };

  const createMaterial = () => {
    if (!materialName.trim()) {
      toast.error('Please enter a material name');
      return;
    }
    
    if (!simulationResults) {
      toast.error('Please simulate properties first');
      return;
    }

    const newMaterial: Material = {
      id: Date.now().toString(),
      name: materialName,
      type: 'Custom Alloy',
      performanceScore: Math.round(simulationResults.performanceScore),
      costScore: Math.round(simulationResults.costScore),
      sustainabilityScore: Math.round(simulationResults.sustainabilityScore),
      overallScore: Math.round(simulationResults.overallScore),
      properties: {
        tensileStrength: Math.round(simulationResults.properties.tensileStrength),
        density: Number(simulationResults.properties.density.toFixed(2)),
        thermalConductivity: Math.round(simulationResults.properties.thermalConductivity),
        electricalConductivity: Math.round(simulationResults.properties.electricalConductivity),
      },
      suppliers: [
        {
          name: 'Advanced Materials Co.',
          region: 'Europe',
          price: Math.round(15 + Math.random() * 20),
          availability: 'Custom Order',
        },
      ],
    };

    onMaterialCreated(newMaterial);
    toast.success(`Material "${materialName}" created successfully`);
    
    // Reset form
    setMaterialName('');
    setSelectedElements([]);
    setSimulationResults(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Design Custom Material
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="material-name">Material Name</Label>
            <Input
              id="material-name"
              placeholder="e.g. High-Strength Steel Alloy"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
            />
          </div>

          <div>
            <Label>Element Selection</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {elements.map((element) => (
                <Button
                  key={element.symbol}
                  variant="outline"
                  size="sm"
                  onClick={() => addElement(element)}
                  disabled={selectedElements.some(e => e.element.symbol === element.symbol)}
                  className="justify-start"
                >
                  <Atom className="mr-2 h-3 w-3" />
                  <span className="font-mono font-bold">{element.symbol}</span>
                  <span className="ml-1 text-xs">{element.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {selectedElements.length > 0 && (
            <div>
              <Label>Composition ({totalPercentage.toFixed(1)}%)</Label>
              <div className="space-y-3 mt-2">
                {selectedElements.map((item, index) => (
                  <div key={item.element.symbol} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Badge variant="outline">
                        {item.element.symbol}
                      </Badge>
                      <span className="text-sm truncate">{item.element.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-1">
                      <Slider
                        value={[item.percentage]}
                        onValueChange={([value]) => updatePercentage(index, value)}
                        max={100}
                        step={0.1}
                        className="flex-1"
                      />
                      <span className="text-sm font-mono w-12">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeElement(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                
                <div className="text-center">
                  <Badge 
                    variant={Math.abs(totalPercentage - 100) < 0.1 ? "default" : "destructive"}
                  >
                    Total: {totalPercentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              onClick={simulateProperties}
              disabled={isSimulating || selectedElements.length === 0}
              className="flex-1"
            >
              {isSimulating ? (
                <>
                  <Lightning className="mr-2 h-4 w-4 animate-pulse" />
                  Simulating...
                </>
              ) : (
                <>
                  <TestTube className="mr-2 h-4 w-4" />
                  Simulate Properties
                </>
              )}
            </Button>
            
            <Button 
              onClick={createMaterial}
              disabled={!simulationResults || !materialName.trim()}
              variant="outline"
            >
              Create Material
            </Button>
          </div>
        </CardContent>
      </Card>

      {simulationResults && (
        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
            <Badge variant="outline">
              Confidence: {simulationResults.confidence}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-3">Performance Scores</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Performance</span>
                    <div className="flex items-center gap-2">
                      <Progress value={simulationResults.performanceScore} className="w-20" />
                      <span className="text-sm font-medium">{simulationResults.performanceScore.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cost Efficiency</span>
                    <div className="flex items-center gap-2">
                      <Progress value={simulationResults.costScore} className="w-20" />
                      <span className="text-sm font-medium">{simulationResults.costScore.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sustainability</span>
                    <div className="flex items-center gap-2">
                      <Progress value={simulationResults.sustainabilityScore} className="w-20" />
                      <span className="text-sm font-medium">{simulationResults.sustainabilityScore.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Predicted Properties</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tensile Strength</span>
                    <span className="font-medium">{simulationResults.properties.tensileStrength.toFixed(0)} MPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Density</span>
                    <span className="font-medium">{simulationResults.properties.density.toFixed(2)} g/cm³</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thermal Conductivity</span>
                    <span className="font-medium">{simulationResults.properties.thermalConductivity.toFixed(0)} W/mK</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Electrical Conductivity</span>
                    <span className="font-medium">{simulationResults.properties.electricalConductivity.toFixed(0)} MS/m</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}