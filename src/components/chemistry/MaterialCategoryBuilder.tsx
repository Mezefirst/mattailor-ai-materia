// Material Category Selection and Composition Tailoring Components
// Comprehensive interface for creating materials by tailoring compositions

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Minus, 
  Atom, 
  FlaskConical, 
  Target, 
  Zap,
  Thermometer,
  Shield,
  Wrench,
  BarChart3,
  ChevronRight
} from '@phosphor-icons/react';
import { 
  MATERIAL_CATEGORIES, 
  MaterialCategory, 
  MaterialSubcategory,
  ElementComposition,
  getCategoryById,
  getSubcategoryById,
  normalizeComposition,
  addElement,
  removeElement,
  updateElementPercentage,
  getAllElements
} from '@/data/material-categories';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MaterialCategorySummary } from './MaterialCategorySummary';

interface MaterialCategoryBuilderProps {
  onMaterialCreated?: (material: any) => void;
  selectedMaterial?: any;
}

export function MaterialCategoryBuilder({ onMaterialCreated, selectedMaterial }: MaterialCategoryBuilderProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [composition, setComposition] = useState<ElementComposition[]>([]);
  const [materialName, setMaterialName] = useState('');
  const [customElements, setCustomElements] = useState<ElementComposition[]>([]);

  // Load selected material if provided
  useEffect(() => {
    if (selectedMaterial?.composition) {
      setComposition(selectedMaterial.composition);
      setMaterialName(selectedMaterial.name || '');
    }
  }, [selectedMaterial]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');
    
    const category = getCategoryById(categoryId);
    if (category) {
      setComposition(normalizeComposition([...category.typicalComposition]));
      setMaterialName(`Custom ${category.name}`);
    }
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    
    const subcategory = getSubcategoryById(selectedCategory, subcategoryId);
    if (subcategory) {
      setComposition(normalizeComposition([...subcategory.composition]));
      setMaterialName(`Custom ${subcategory.name}`);
    }
  };

  const handleElementPercentageChange = (symbol: string, percentage: number) => {
    const updatedComposition = updateElementPercentage(composition, symbol, Math.max(0, Math.min(100, percentage)));
    setComposition(normalizeComposition(updatedComposition));
  };

  const handleAddElement = (elementSymbol: string) => {
    if (!elementSymbol) return;
    
    const newElement: ElementComposition = {
      symbol: elementSymbol,
      name: getElementName(elementSymbol),
      percentage: 1,
      atomicNumber: getAtomicNumber(elementSymbol),
      role: 'alloying'
    };
    
    const updatedComposition = addElement(composition, newElement);
    setComposition(normalizeComposition(updatedComposition));
  };

  const handleRemoveElement = (symbol: string) => {
    const updatedComposition = removeElement(composition, symbol);
    setComposition(normalizeComposition(updatedComposition));
  };

  const handleCreateMaterial = () => {
    if (!materialName.trim() || composition.length === 0) return;

    const newMaterial = {
      id: `custom-${Date.now()}`,
      name: materialName,
      category: selectedCategory || 'custom',
      subcategory: selectedSubcategory || 'tailored',
      composition: composition,
      properties: predictProperties(composition),
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    if (onMaterialCreated) {
      onMaterialCreated(newMaterial);
    }
  };

  const currentCategory = selectedCategory ? getCategoryById(selectedCategory) : null;
  const currentSubcategory = selectedSubcategory ? getSubcategoryById(selectedCategory, selectedSubcategory) : null;

  // Color scheme for pie chart
  const COLORS = [
    '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#f97316', '#84cc16',
    '#ec4899', '#14b8a6', '#f472b6', '#a855f7', '#3b82f6', '#22c55e', '#eab308', '#dc2626'
  ];

  const pieChartData = composition.map((comp, index) => ({
    name: comp.symbol,
    value: comp.percentage,
    fill: COLORS[index % COLORS.length]
  }));

  return (
    <div className="space-y-6">
      {!selectedCategory ? (
        <MaterialCategorySummary onCategorySelect={handleCategorySelect} />
      ) : (
        <>
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <FlaskConical className="text-primary" />
              Material Category Builder
            </h2>
            <p className="text-muted-foreground">
              Create custom materials by selecting categories and tailoring element compositions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Category Selection */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Material Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Back to Overview Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedSubcategory('');
                      setComposition([]);
                      setMaterialName('');
                    }}
                    className="w-full"
                  >
                    ← Back to Overview
                  </Button>
                  
                  {/* Category Selection */}
                  <div className="space-y-2">
                    <Label>Base Category</Label>
                    <Select value={selectedCategory} onValueChange={handleCategorySelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select material category" />
                      </SelectTrigger>
                      <SelectContent>
                        {MATERIAL_CATEGORIES.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subcategory Selection */}
                  {currentCategory && (
                    <div className="space-y-2">
                      <Label>Subcategory</Label>
                      <Select value={selectedSubcategory} onValueChange={handleSubcategorySelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentCategory.subcategories.map(sub => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Category Info */}
                  {currentCategory && (
                    <div className="space-y-3 pt-4 border-t">
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">{currentCategory.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Base Elements</h4>
                        <div className="flex flex-wrap gap-1">
                          {currentCategory.baseElements.map(element => (
                            <Badge key={element} variant="secondary" className="text-xs">
                              {element}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Properties</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Wrench className="w-3 h-3" />
                            <span>Strength: {currentCategory.properties.strength}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            <span>Conductivity: {currentCategory.properties.conductivity}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            <span>Corrosion: {currentCategory.properties.corrosionResistance}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Thermometer className="w-3 h-3" />
                            <span>Temperature: {currentCategory.properties.temperature}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Applications</h4>
                        <div className="flex flex-wrap gap-1">
                          {currentCategory.applications.slice(0, 4).map(app => (
                            <Badge key={app} variant="outline" className="text-xs">
                              {app}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Composition Editor */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Atom className="w-5 h-5" />
                    Element Composition
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Material Name */}
                  <div className="space-y-2">
                    <Label>Material Name</Label>
                    <Input
                      value={materialName}
                      onChange={(e) => setMaterialName(e.target.value)}
                      placeholder="Enter material name"
                    />
                  </div>

                  <Separator />

                  {/* Current Composition */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold">Elements</Label>
                      <Badge variant="secondary">{composition.length} elements</Badge>
                    </div>
                    
                    {composition.map((element, index) => (
                      <div key={element.symbol} className="space-y-2 p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={element.role === 'base' ? 'default' : 'secondary'} 
                              className="text-xs"
                            >
                              {element.symbol}
                            </Badge>
                            <span className="text-sm font-medium">{element.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {element.role}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveElement(element.symbol)}
                            disabled={composition.length <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Percentage</span>
                            <span>{element.percentage.toFixed(2)}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={element.percentage.toFixed(2)}
                              onChange={(e) => handleElementPercentageChange(element.symbol, parseFloat(e.target.value) || 0)}
                              className="text-xs"
                            />
                            <Progress 
                              value={element.percentage} 
                              className="flex-1 h-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Add New Element */}
                  <div className="space-y-2">
                    <Label>Add Element</Label>
                    <div className="flex gap-2">
                      <Select onValueChange={handleAddElement}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select element" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAllElements().filter(el => !composition.find(c => c.symbol === el)).map(element => (
                            <SelectItem key={element} value={element}>
                              {element} - {getElementName(element)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Create Material Button */}
                  <Button 
                    onClick={handleCreateMaterial}
                    className="w-full"
                    disabled={!materialName.trim() || composition.length === 0}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Material
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Visualization and Properties */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Composition Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {composition.length > 0 ? (
                    <div className="space-y-4">
                      {/* Pie Chart */}
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                            >
                              {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: any) => [`${value.toFixed(2)}%`, 'Percentage']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Element List */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Element Distribution</h4>
                        {composition
                          .sort((a, b) => b.percentage - a.percentage)
                          .map((element, index) => (
                            <div key={element.symbol} className="flex items-center gap-2 text-sm">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[composition.findIndex(c => c.symbol === element.symbol) % COLORS.length] }}
                              />
                              <span className="font-medium">{element.symbol}</span>
                              <span className="text-muted-foreground flex-1">{element.name}</span>
                              <span className="font-medium">{element.percentage.toFixed(1)}%</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      <div className="text-center">
                        <FlaskConical className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Select a category to start</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Predicted Properties */}
              {composition.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Predicted Properties
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PredictedProperties composition={composition} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Helper component for predicted properties
function PredictedProperties({ composition }: { composition: ElementComposition[] }) {
  const properties = predictProperties(composition);
  
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Wrench className="w-3 h-3" />
            <span className="font-medium">Strength</span>
          </div>
          <Badge variant="secondary">{properties.strength}</Badge>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span className="font-medium">Conductivity</span>
          </div>
          <Badge variant="secondary">{properties.conductivity}</Badge>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span className="font-medium">Corrosion Resistance</span>
          </div>
          <Badge variant="secondary">{properties.corrosionResistance}</Badge>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Thermometer className="w-3 h-3" />
            <span className="font-medium">Temperature Rating</span>
          </div>
          <Badge variant="secondary">{properties.temperature}</Badge>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Estimated Values</h4>
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="flex justify-between">
            <span>Density:</span>
            <span>{properties.estimatedDensity} kg/m³</span>
          </div>
          <div className="flex justify-between">
            <span>Melting Point:</span>
            <span>{properties.estimatedMeltingPoint}°C</span>
          </div>
          <div className="flex justify-between">
            <span>Sustainability Score:</span>
            <span>{properties.sustainabilityScore}/10</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility functions
function getElementName(symbol: string): string {
  const elementNames: Record<string, string> = {
    'H': 'Hydrogen', 'He': 'Helium', 'Li': 'Lithium', 'Be': 'Beryllium', 'B': 'Boron',
    'C': 'Carbon', 'N': 'Nitrogen', 'O': 'Oxygen', 'F': 'Fluorine', 'Ne': 'Neon',
    'Na': 'Sodium', 'Mg': 'Magnesium', 'Al': 'Aluminum', 'Si': 'Silicon', 'P': 'Phosphorus',
    'S': 'Sulfur', 'Cl': 'Chlorine', 'Ar': 'Argon', 'K': 'Potassium', 'Ca': 'Calcium',
    'Sc': 'Scandium', 'Ti': 'Titanium', 'V': 'Vanadium', 'Cr': 'Chromium', 'Mn': 'Manganese', 
    'Fe': 'Iron', 'Co': 'Cobalt', 'Ni': 'Nickel', 'Cu': 'Copper', 'Zn': 'Zinc', 
    'Ga': 'Gallium', 'Ge': 'Germanium', 'As': 'Arsenic', 'Se': 'Selenium', 'Br': 'Bromine',
    'Kr': 'Krypton', 'Rb': 'Rubidium', 'Sr': 'Strontium', 'Y': 'Yttrium', 'Zr': 'Zirconium',
    'Nb': 'Niobium', 'Mo': 'Molybdenum', 'Tc': 'Technetium', 'Ru': 'Ruthenium', 'Rh': 'Rhodium',
    'Pd': 'Palladium', 'Ag': 'Silver', 'Cd': 'Cadmium', 'In': 'Indium', 'Sn': 'Tin',
    'Sb': 'Antimony', 'Te': 'Tellurium', 'I': 'Iodine', 'Xe': 'Xenon', 'Cs': 'Cesium',
    'Ba': 'Barium', 'La': 'Lanthanum', 'Ce': 'Cerium', 'Pr': 'Praseodymium', 'Nd': 'Neodymium',
    'Pm': 'Promethium', 'Sm': 'Samarium', 'Eu': 'Europium', 'Gd': 'Gadolinium', 'Tb': 'Terbium',
    'Dy': 'Dysprosium', 'Ho': 'Holmium', 'Er': 'Erbium', 'Tm': 'Thulium', 'Yb': 'Ytterbium',
    'Lu': 'Lutetium', 'Hf': 'Hafnium', 'Ta': 'Tantalum', 'W': 'Tungsten', 'Re': 'Rhenium',
    'Os': 'Osmium', 'Ir': 'Iridium', 'Pt': 'Platinum', 'Au': 'Gold', 'Hg': 'Mercury',
    'Tl': 'Thallium', 'Pb': 'Lead', 'Bi': 'Bismuth', 'Po': 'Polonium', 'At': 'Astatine',
    'Rn': 'Radon', 'Fr': 'Francium', 'Ra': 'Radium', 'Ac': 'Actinium', 'Th': 'Thorium',
    'Pa': 'Protactinium', 'U': 'Uranium'
  };
  return elementNames[symbol] || symbol;
}

function getAtomicNumber(symbol: string): number {
  const atomicNumbers: Record<string, number> = {
    'H': 1, 'He': 2, 'Li': 3, 'Be': 4, 'B': 5, 'C': 6, 'N': 7, 'O': 8, 'F': 9, 'Ne': 10,
    'Na': 11, 'Mg': 12, 'Al': 13, 'Si': 14, 'P': 15, 'S': 16, 'Cl': 17, 'Ar': 18,
    'K': 19, 'Ca': 20, 'Sc': 21, 'Ti': 22, 'V': 23, 'Cr': 24, 'Mn': 25, 'Fe': 26, 'Co': 27,
    'Ni': 28, 'Cu': 29, 'Zn': 30, 'Ga': 31, 'Ge': 32, 'As': 33, 'Se': 34, 'Br': 35, 'Kr': 36,
    'Rb': 37, 'Sr': 38, 'Y': 39, 'Zr': 40, 'Nb': 41, 'Mo': 42, 'Tc': 43, 'Ru': 44, 'Rh': 45,
    'Pd': 46, 'Ag': 47, 'Cd': 48, 'In': 49, 'Sn': 50, 'Sb': 51, 'Te': 52, 'I': 53, 'Xe': 54,
    'Cs': 55, 'Ba': 56, 'La': 57, 'Ce': 58, 'Pr': 59, 'Nd': 60, 'Pm': 61, 'Sm': 62, 'Eu': 63,
    'Gd': 64, 'Tb': 65, 'Dy': 66, 'Ho': 67, 'Er': 68, 'Tm': 69, 'Yb': 70, 'Lu': 71,
    'Hf': 72, 'Ta': 73, 'W': 74, 'Re': 75, 'Os': 76, 'Ir': 77, 'Pt': 78, 'Au': 79, 'Hg': 80,
    'Tl': 81, 'Pb': 82, 'Bi': 83, 'Po': 84, 'At': 85, 'Rn': 86, 'Fr': 87, 'Ra': 88,
    'Ac': 89, 'Th': 90, 'Pa': 91, 'U': 92
  };
  return atomicNumbers[symbol] || 0;
}

function predictProperties(composition: ElementComposition[]) {
  // Advanced property prediction based on element composition and materials science principles
  const hasMetals = composition.some(c => ['Fe', 'Al', 'Cu', 'Ti', 'Ni', 'Cr', 'Co', 'W', 'Mo'].includes(c.symbol));
  const hasCeramics = composition.some(c => ['Si', 'O', 'C', 'N', 'Al'].includes(c.symbol));
  const hasPolymers = composition.some(c => c.symbol === 'C' && c.percentage > 50);
  const hasRareEarths = composition.some(c => ['Nd', 'Sm', 'Dy', 'La', 'Ce'].includes(c.symbol));
  const hasBatteryElements = composition.some(c => ['Li', 'Co', 'Mn', 'P'].includes(c.symbol));
  const hasRefractoryElements = composition.some(c => ['W', 'Mo', 'Ta', 'Re'].includes(c.symbol));
  
  let strength = 'medium';
  let conductivity = 'insulator';
  let corrosionResistance = 'fair';
  let temperature = 'medium';
  
  // Metallic materials
  if (hasMetals) {
    strength = 'high';
    conductivity = 'conductor';
    
    // Stainless steel properties
    if (composition.some(c => c.symbol === 'Cr' && c.percentage > 10)) {
      corrosionResistance = 'excellent';
    }
    
    // Superalloy properties  
    if (composition.some(c => c.symbol === 'Ni' && c.percentage > 40)) {
      temperature = 'high';
      strength = 'very-high';
    }
    
    // Refractory metals
    if (hasRefractoryElements) {
      temperature = 'ultra-high';
      strength = 'very-high';
    }
  }
  
  // Ceramic materials
  if (hasCeramics) {
    strength = 'very-high';
    temperature = 'ultra-high';
    corrosionResistance = 'excellent';
    conductivity = 'insulator';
    
    // Special ceramics
    if (composition.some(c => c.symbol === 'Si' && composition.some(d => d.symbol === 'C'))) {
      conductivity = 'semiconductor'; // SiC
    }
  }
  
  // Polymer materials
  if (hasPolymers) {
    strength = 'medium';
    temperature = 'low';
    conductivity = 'insulator';
    
    // Engineering polymers
    if (composition.some(c => c.symbol === 'O' && c.percentage > 20)) {
      temperature = 'medium';
      corrosionResistance = 'good';
    }
  }
  
  // Battery materials
  if (hasBatteryElements) {
    conductivity = 'conductor';
    corrosionResistance = 'good';
    
    if (composition.some(c => c.symbol === 'Li')) {
      strength = 'low';
      temperature = 'low';
    }
  }
  
  // Magnetic materials
  if (hasRareEarths || composition.some(c => ['Fe', 'Co', 'Ni'].includes(c.symbol))) {
    strength = 'high';
    conductivity = 'conductor';
  }
  
  // Estimated numerical values with more realistic calculations
  const estimatedDensity = composition.reduce((acc, comp) => {
    const densities: Record<string, number> = {
      'Al': 2700, 'Fe': 7850, 'Cu': 8960, 'Ti': 4510, 'C': 2200, 'Si': 2330,
      'Ni': 8908, 'Cr': 7190, 'W': 19250, 'Mo': 10280, 'Co': 8900, 'Li': 534,
      'Nd': 7010, 'Ta': 16650, 'Re': 21020, 'O': 1429, 'Pb': 11340, 'Zr': 6511
    };
    return acc + (densities[comp.symbol] || 3000) * (comp.percentage / 100);
  }, 0);
  
  const estimatedMeltingPoint = composition.reduce((acc, comp) => {
    const meltingPoints: Record<string, number> = {
      'Al': 660, 'Fe': 1538, 'Cu': 1085, 'Ti': 1668, 'C': 3550, 'Si': 1414,
      'Ni': 1455, 'Cr': 1907, 'W': 3695, 'Mo': 2896, 'Co': 1495, 'Li': 181,
      'Nd': 1021, 'Ta': 3290, 'Re': 3459, 'O': -218, 'Pb': 327, 'Zr': 1855
    };
    return acc + (meltingPoints[comp.symbol] || 1000) * (comp.percentage / 100);
  }, 0);
  
  const sustainabilityScore = composition.reduce((acc, comp) => {
    const sustainability: Record<string, number> = {
      'Al': 9, 'Fe': 8, 'Cu': 8, 'Ti': 6, 'C': 7, 'Si': 8, 'Ni': 6, 'Cr': 7,
      'W': 4, 'Mo': 5, 'Co': 4, 'Li': 5, 'Nd': 3, 'Ta': 2, 'Re': 2, 'O': 10,
      'Pb': 3, 'Zr': 6
    };
    return acc + (sustainability[comp.symbol] || 5) * (comp.percentage / 100);
  }, 0) / 10;
  
  return {
    strength,
    conductivity,
    corrosionResistance,
    temperature,
    estimatedDensity: Math.round(estimatedDensity),
    estimatedMeltingPoint: Math.round(Math.max(0, estimatedMeltingPoint)), // Ensure non-negative
    sustainabilityScore: Math.round(sustainabilityScore * 10) / 10
  };
}