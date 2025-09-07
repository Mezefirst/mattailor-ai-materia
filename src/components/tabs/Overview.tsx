import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChartBar, TestTube, Atom, Lightning } from '@phosphor-icons/react';

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

interface OverviewProps {
  materials: Material[];
  selectedMaterial: Material | null;
  onSelectMaterial: (material: Material) => void;
}

export function Overview({ materials, selectedMaterial, onSelectMaterial }: OverviewProps) {
  const topMaterials = materials.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materials Analyzed</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last search
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performance</CardTitle>
            <Lightning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {materials.length > 0 ? Math.max(...materials.map(m => m.performanceScore)) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Carbon fiber composite
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Value</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€12/kg</div>
            <p className="text-xs text-muted-foreground">
              Aluminum alloy 6061
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sustainability</CardTitle>
            <Atom className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">
              Recycled steel composite
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMaterials.length > 0 ? topMaterials.map((material) => (
                <div 
                  key={material.id}
                  className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onSelectMaterial(material)}
                >
                  <div className="space-y-1">
                    <div className="font-medium">{material.name}</div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{material.type}</Badge>
                      <Badge variant="outline">Score: {material.overallScore}%</Badge>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm text-muted-foreground">Performance</div>
                    <Progress value={material.performanceScore} className="w-20" />
                  </div>
                </div>
              )) : (
                <div className="text-center text-muted-foreground py-8">
                  <TestTube size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No materials analyzed yet</p>
                  <p className="text-sm">Use AI Recommendation to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <TestTube className="mr-2 h-4 w-4" />
                Analyze New Material
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Lightning className="mr-2 h-4 w-4" />
                Run Property Simulation
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ChartBar className="mr-2 h-4 w-4" />
                Compare Materials
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Atom className="mr-2 h-4 w-4" />
                View Sustainability Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedMaterial && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Material: {selectedMaterial.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-sm font-medium mb-2">Performance Scores</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Performance</span>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedMaterial.performanceScore} className="w-16" />
                      <span className="text-sm">{selectedMaterial.performanceScore}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cost</span>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedMaterial.costScore} className="w-16" />
                      <span className="text-sm">{selectedMaterial.costScore}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sustainability</span>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedMaterial.sustainabilityScore} className="w-16" />
                      <span className="text-sm">{selectedMaterial.sustainabilityScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Key Properties</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Tensile Strength</span>
                    <span>{selectedMaterial.properties.tensileStrength} MPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Density</span>
                    <span>{selectedMaterial.properties.density} g/cm³</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thermal Conductivity</span>
                    <span>{selectedMaterial.properties.thermalConductivity} W/mK</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Top Supplier</div>
                {selectedMaterial.suppliers.length > 0 && (
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">{selectedMaterial.suppliers[0].name}</div>
                    <div className="text-muted-foreground">{selectedMaterial.suppliers[0].region}</div>
                    <div>€{selectedMaterial.suppliers[0].price}/kg</div>
                    <Badge variant="outline" className="text-xs">
                      {selectedMaterial.suppliers[0].availability}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}