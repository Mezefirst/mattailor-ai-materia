import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Robot, Lightning, Send, TestTube } from '@phosphor-icons/react';
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

interface AIRecommendationProps {
  onMaterialsFound: (materials: Material[]) => void;
}

const exampleQueries = [
  "Suggest a corrosion-resistant material for marine use under €30/kg",
  "What's the best composite for lightweight packaging in cold climates?",
  "Simulate a copper-aluminum alloy for electrical conductivity and cost",
  "Find materials for aerospace applications with high strength-to-weight ratio",
  "Recommend sustainable materials for food packaging applications"
];

export function AIRecommendation({ onMaterialsFound }: AIRecommendationProps) {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'ai';
    content: string;
    materials?: Material[];
  }>>([
    {
      type: 'ai',
      content: 'Hello! I\'m your AI materials expert. Describe your application requirements and I\'ll recommend the best materials for your needs. You can specify mechanical properties, environmental conditions, budget constraints, or ask about specific material combinations.'
    }
  ]);

  const processQuery = async () => {
    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }

    setIsProcessing(true);
    
    // Add user message to conversation
    const userMessage = { type: 'user' as const, content: query };
    setConversation(prev => [...prev, userMessage]);
    
    const currentQuery = query;
    setQuery('');

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI response based on query keywords
      const materials = generateMockMaterials(currentQuery);
      
      const aiResponse = {
        type: 'ai' as const,
        content: generateAIResponse(currentQuery, materials),
        materials
      };
      
      setConversation(prev => [...prev, aiResponse]);
      onMaterialsFound(materials);
      toast.success(`Found ${materials.length} material recommendations`);
      
    } catch (error) {
      toast.error('Failed to process query. Please try again.');
      setConversation(prev => [...prev, {
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your request. Please try rephrasing your query or contact support if the issue persists.'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateMockMaterials = (query: string): Material[] => {
    const queryLower = query.toLowerCase();
    
    // Keywords to material mappings
    const materials: Material[] = [];
    
    if (queryLower.includes('marine') || queryLower.includes('corrosion')) {
      materials.push({
        id: '1',
        name: 'Stainless Steel 316L',
        type: 'Stainless Steel',
        performanceScore: 88,
        costScore: 72,
        sustainabilityScore: 85,
        overallScore: 82,
        properties: {
          tensileStrength: 580,
          density: 8.0,
          thermalConductivity: 16,
          electricalConductivity: 1.4
        },
        suppliers: [
          { name: 'Marine Metals Ltd', region: 'Europe', price: 28, availability: 'In Stock' }
        ]
      });
    }
    
    if (queryLower.includes('lightweight') || queryLower.includes('aerospace')) {
      materials.push({
        id: '2',
        name: 'Carbon Fiber Composite',
        type: 'Composite',
        performanceScore: 95,
        costScore: 45,
        sustainabilityScore: 60,
        overallScore: 67,
        properties: {
          tensileStrength: 3500,
          density: 1.6,
          thermalConductivity: 100,
          electricalConductivity: 0.01
        },
        suppliers: [
          { name: 'Aerospace Composites Inc', region: 'North America', price: 120, availability: 'Custom Order' }
        ]
      });
      
      materials.push({
        id: '3',
        name: 'Titanium Alloy Ti-6Al-4V',
        type: 'Titanium Alloy',
        performanceScore: 92,
        costScore: 35,
        sustainabilityScore: 75,
        overallScore: 67,
        properties: {
          tensileStrength: 1170,
          density: 4.43,
          thermalConductivity: 7,
          electricalConductivity: 0.6
        },
        suppliers: [
          { name: 'Titan Materials Corp', region: 'Europe', price: 85, availability: 'Limited Stock' }
        ]
      });
    }
    
    if (queryLower.includes('electrical') || queryLower.includes('copper') || queryLower.includes('aluminum')) {
      materials.push({
        id: '4',
        name: 'Aluminum Alloy 6061',
        type: 'Aluminum Alloy',
        performanceScore: 75,
        costScore: 90,
        sustainabilityScore: 88,
        overallScore: 84,
        properties: {
          tensileStrength: 310,
          density: 2.7,
          thermalConductivity: 167,
          electricalConductivity: 38
        },
        suppliers: [
          { name: 'Euro Aluminum Solutions', region: 'Europe', price: 12, availability: 'In Stock' }
        ]
      });
    }
    
    if (queryLower.includes('packaging') || queryLower.includes('food')) {
      materials.push({
        id: '5',
        name: 'PET (Recycled)',
        type: 'Polymer',
        performanceScore: 70,
        costScore: 95,
        sustainabilityScore: 92,
        overallScore: 86,
        properties: {
          tensileStrength: 55,
          density: 1.38,
          thermalConductivity: 0.15,
          electricalConductivity: 0.00001
        },
        suppliers: [
          { name: 'GreenPack Materials', region: 'Europe', price: 3.5, availability: 'In Stock' }
        ]
      });
    }
    
    // Always include at least one material
    if (materials.length === 0) {
      materials.push({
        id: '6',
        name: 'General Purpose Steel',
        type: 'Carbon Steel',
        performanceScore: 80,
        costScore: 85,
        sustainabilityScore: 70,
        overallScore: 78,
        properties: {
          tensileStrength: 400,
          density: 7.85,
          thermalConductivity: 50,
          electricalConductivity: 10
        },
        suppliers: [
          { name: 'Industrial Steel Supply', region: 'Europe', price: 8, availability: 'In Stock' }
        ]
      });
    }
    
    return materials;
  };

  const generateAIResponse = (query: string, materials: Material[]): string => {
    const queryLower = query.toLowerCase();
    
    let response = `Based on your requirements, I've identified ${materials.length} optimal material${materials.length > 1 ? 's' : ''} for your application:\n\n`;
    
    materials.forEach((material, index) => {
      response += `${index + 1}. **${material.name}** (${material.type})\n`;
      response += `   - Overall Score: ${material.overallScore}%\n`;
      response += `   - Performance: ${material.performanceScore}%, Cost: ${material.costScore}%, Sustainability: ${material.sustainabilityScore}%\n`;
      response += `   - Price: €${material.suppliers[0]?.price || 'N/A'}/kg\n\n`;
    });
    
    if (queryLower.includes('marine') || queryLower.includes('corrosion')) {
      response += "For marine applications, I prioritized corrosion resistance and durability in saltwater environments.";
    } else if (queryLower.includes('lightweight') || queryLower.includes('aerospace')) {
      response += "For aerospace applications, I focused on high strength-to-weight ratios and temperature resistance.";
    } else if (queryLower.includes('electrical')) {
      response += "For electrical applications, I prioritized thermal and electrical conductivity properties.";
    } else if (queryLower.includes('packaging')) {
      response += "For packaging applications, I considered food safety, sustainability, and cost-effectiveness.";
    } else {
      response += "These materials balance performance, cost, and environmental impact for general engineering applications.";
    }
    
    response += "\n\nWould you like me to simulate specific properties, compare materials, or provide more details about manufacturing processes?";
    
    return response;
  };

  const useExampleQuery = (example: string) => {
    setQuery(example);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Robot className="h-5 w-5" />
            AI Materials Expert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto space-y-4 p-4 border rounded-lg bg-muted/20">
              {conversation.map((message, index) => (
                <div key={index} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground ml-12' 
                      : 'bg-card border mr-12'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    
                    {message.materials && message.materials.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.materials.map((material) => (
                          <div key={material.id} className="p-2 border rounded bg-background/50">
                            <div className="font-medium text-sm">{material.name}</div>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{material.type}</Badge>
                              <Badge variant="secondary" className="text-xs">Score: {material.overallScore}%</Badge>
                            </div>
                            <div className="flex gap-4 mt-2 text-xs">
                              <div className="flex items-center gap-1">
                                <span>Performance:</span>
                                <Progress value={material.performanceScore} className="w-12 h-1" />
                                <span>{material.performanceScore}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex gap-3 justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-card border mr-12">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lightning className="h-4 w-4 animate-pulse" />
                      Analyzing your requirements...
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Textarea
                placeholder="Describe your material requirements... (e.g., 'I need a lightweight, corrosion-resistant material for outdoor applications under €50/kg')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    processQuery();
                  }
                }}
                className="min-h-[60px] resize-none"
              />
              <Button 
                onClick={processQuery}
                disabled={isProcessing || !query.trim()}
                size="sm"
                className="px-3"
              >
                {isProcessing ? (
                  <Lightning className="h-4 w-4 animate-pulse" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Example Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {exampleQueries.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => useExampleQuery(example)}
                className="justify-start text-left h-auto p-3 whitespace-normal"
              >
                <TestTube className="mr-2 h-3 w-3 flex-shrink-0 mt-0.5" />
                <span className="text-xs">{example}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}