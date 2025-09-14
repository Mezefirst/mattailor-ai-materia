import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lightbulb, Plus, ChartBar, Atom } from '@phosphor-icons/react';
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
}

export function ElementSuggestions({ currentElements, onElementsAdded }: ElementSuggestionsProps) {
  const { t } = useTranslation();
  const [selectedApplication, setSelectedApplication] = useState('');
  const [suggestions, setSuggestions] = useState<AlloyRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const applications = [
    'aerospace', 'automotive', 'marine', 'electronics', 'medical', 
    'construction', 'energy', 'tooling', 'packaging', 'defense'
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
      challenges: ["Expensive", "Difficult to machine", "Requires controlled atmosphere processing"]
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
      challenges: ["Work hardens rapidly", "Lower strength than martensitic grades"]
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
      challenges: ["Lower strength than steel", "Galvanic corrosion with dissimilar metals"]
    },
    {
      name: "Inconel 718",
      application: "aerospace",
      elements: [
        { symbol: "Ni", percentage: 50.0, role: "Primary matrix, high temperature strength" },
        { symbol: "Cr", percentage: 19.0, role: "Oxidation resistance" },
        { symbol: "Fe", percentage: 18.5, role: "Cost reduction, strengthening" },
        { symbol: "Nb", percentage: 5.1, role: "Precipitation hardening" },
        { symbol: "Mo", percentage: 3.0, role: "Solid solution strengthening" },
        { symbol: "Ti", percentage: 0.9, role: "Precipitation hardening" },
        { symbol: "Al", percentage: 0.5, role: "Precipitation hardening" }
      ],
      properties: ["Excellent high-temperature strength", "Outstanding oxidation resistance", "Good fatigue properties"],
      advantages: ["Maintains properties to 650°C", "Excellent creep resistance", "Good fabricability"],
      challenges: ["Very expensive", "Difficult to machine", "Special welding requirements"]
    },
    {
      name: "Brass (70/30)",
      application: "marine",
      elements: [
        { symbol: "Cu", percentage: 70.0, role: "Primary matrix, corrosion resistance" },
        { symbol: "Zn", percentage: 30.0, role: "Improves strength and machinability" }
      ],
      properties: ["Good corrosion resistance", "Excellent machinability", "Antimicrobial properties"],
      advantages: ["Easy to work", "Good electrical conductivity", "Attractive appearance"],
      challenges: ["Dezincification in aggressive environments", "Lower strength than steel"]
    },
    {
      name: "Tool Steel (D2)",
      application: "tooling",
      elements: [
        { symbol: "Fe", percentage: 87.0, role: "Primary matrix" },
        { symbol: "C", percentage: 1.5, role: "High hardness potential" },
        { symbol: "Cr", percentage: 11.5, role: "Wear resistance, hardenability" },
        { symbol: "Mo", percentage: 0.8, role: "Toughness, hardenability" },
        { symbol: "V", percentage: 0.8, role: "Carbide formation, wear resistance" }
      ],
      properties: ["High hardness", "Excellent wear resistance", "Good dimensional stability"],
      advantages: ["Air hardenable", "High compressive strength", "Good machinability when annealed"],
      challenges: ["Brittle when hardened", "Requires careful heat treatment", "Susceptible to chipping"]
    }
  ];

  const generateSuggestions = async () => {
    if (!selectedApplication) {
      toast.error('Please select an application first');
      return;
    }

    setIsGenerating(true);

    try {
      const currentSymbols = currentElements.map(e => e.element.symbol);
      
      const prompt = spark.llmPrompt`
      You are an expert metallurgist. Based on the current elements: ${currentSymbols.join(', ')}, suggest additional elements or alternative compositions for ${selectedApplication} applications.
      
      Consider:
      1. Missing elements that would improve properties for ${selectedApplication}
      2. Potential element substitutions for cost or availability
      3. Trace elements that could provide significant benefits
      4. Phase stability and processing considerations
      
      For ${selectedApplication} applications, prioritize:
      ${selectedApplication === 'aerospace' ? '- High strength-to-weight ratio\n- Fatigue resistance\n- Temperature stability' : ''}
      ${selectedApplication === 'automotive' ? '- Formability and weldability\n- Crash performance\n- Cost effectiveness' : ''}
      ${selectedApplication === 'marine' ? '- Corrosion resistance in saltwater\n- Stress corrosion cracking resistance\n- Biofouling resistance' : ''}
      ${selectedApplication === 'electronics' ? '- Electrical/thermal conductivity\n- Dimensional stability\n- Low outgassing' : ''}
      ${selectedApplication === 'medical' ? '- Biocompatibility\n- Corrosion resistance in body fluids\n- Non-magnetic properties' : ''}
      
      Return as JSON:
      {
        "recommendations": [
          {
            "name": "Enhanced Steel Alloy",
            "elements": [{"symbol": "Cr", "reason": "Adds corrosion resistance"}, ...],
            "expectedBenefits": ["improved corrosion resistance", "higher strength"],
            "composition": [{"symbol": "Fe", "percentage": 80}, {"symbol": "Cr", "percentage": 18}, ...],
            "confidence": 85
          }
        ]
      }
      `;

      const result = await spark.llm(prompt, 'gpt-4o', true);
      const aiSuggestions = JSON.parse(result);
      
      // Filter existing alloys by application and convert to recommendation format
      const relevantAlloys = knownAlloys
        .filter(alloy => alloy.application === selectedApplication || alloy.application === 'general')
        .map(alloy => ({
          name: alloy.name,
          application: alloy.application,
          elements: alloy.elements.map(e => ({ symbol: e.symbol, percentage: e.percentage, role: e.role })),
          properties: alloy.properties,
          advantages: alloy.advantages,
          challenges: alloy.challenges
        }));

      // Combine AI suggestions with known alloys
      const combinedSuggestions = [
        ...relevantAlloys,
        ...(aiSuggestions.recommendations || [])
      ];

      setSuggestions(combinedSuggestions.slice(0, 6)); // Limit to 6 suggestions
      
      toast.success(`Generated ${combinedSuggestions.length} alloy suggestions for ${selectedApplication}`, {
        description: 'Review recommendations below and apply compositions'
      });

    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      
      // Fallback to known alloys only
      const fallbackSuggestions = knownAlloys.filter(alloy => 
        alloy.application === selectedApplication || alloy.application === 'general'
      );
      
      setSuggestions(fallbackSuggestions);
      toast.success(`Showing ${fallbackSuggestions.length} proven alloy compositions for ${selectedApplication}`);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Smart Element Suggestions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get AI-powered recommendations for optimal element combinations based on application requirements
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Select value={selectedApplication} onValueChange={setSelectedApplication}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select target application..." />
            </SelectTrigger>
            <SelectContent>
              {applications.map((app) => (
                <SelectItem key={app} value={app}>
                  {app.charAt(0).toUpperCase() + app.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={generateSuggestions}
            disabled={isGenerating || !selectedApplication}
          >
            {isGenerating ? (
              <>
                <ChartBar className="mr-2 h-4 w-4 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Atom className="mr-2 h-4 w-4" />
                Get Suggestions
              </>
            )}
          </Button>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Recommended Alloy Compositions</h4>
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-4 border rounded-lg bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-medium">{suggestion.name}</h5>
                    <Badge variant="outline" className="mt-1">
                      {suggestion.application}
                    </Badge>
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

                  {suggestion.properties && (
                    <div>
                      <h6 className="text-sm font-medium mb-1">Key Properties:</h6>
                      <p className="text-xs text-muted-foreground">
                        {suggestion.properties.slice(0, 3).join(', ')}
                      </p>
                    </div>
                  )}

                  {suggestion.advantages && (
                    <div>
                      <h6 className="text-sm font-medium mb-1">Advantages:</h6>
                      <p className="text-xs text-green-600">
                        ✓ {suggestion.advantages.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  )}

                  {suggestion.challenges && (
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
        )}

        {currentElements.length > 0 && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <h6 className="text-sm font-medium mb-2">Current Elements:</h6>
            <div className="flex flex-wrap gap-1">
              {currentElements.map((elem) => (
                <Badge key={elem.element.symbol} variant="outline" className="text-xs">
                  {elem.element.symbol}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}