import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendUp, TrendDown, Minus, Award, Target } from '@phosphor-icons/react';

interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  category: string;
}

interface CompositionData {
  elements: Array<{element: Element, percentage: number}>;
  properties?: {
    tensileStrength: number;
    density: number;
    thermalConductivity: number;
    electricalConductivity: number;
  };
  scores?: {
    performanceScore: number;
    costScore: number;
    sustainabilityScore: number;
    overallScore: number;
  };
  label: string;
  timestamp?: Date;
}

interface OptimizationComparisonProps {
  originalComposition?: CompositionData;
  optimizedComposition?: CompositionData;
  showPropertyChanges?: boolean;
}

export function OptimizationComparison({ 
  originalComposition, 
  optimizedComposition, 
  showPropertyChanges = true 
}: OptimizationComparisonProps) {
  
  if (!originalComposition || !optimizedComposition) {
    return null;
  }

  const calculatePercentageChange = (original: number, optimized: number): number => {
    if (original === 0) return optimized > 0 ? 100 : 0;
    return ((optimized - original) / original) * 100;
  };

  const renderPropertyComparison = (
    label: string,
    original: number,
    optimized: number,
    unit: string,
    higherIsBetter: boolean = true
  ) => {
    const change = calculatePercentageChange(original, optimized);
    const isImprovement = higherIsBetter ? change > 0 : change < 0;
    const isSignificant = Math.abs(change) > 5;

    return (
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{label}</span>
            {isSignificant && (
              <div className={`flex items-center gap-1 text-xs ${
                isImprovement ? 'text-green-600' : 'text-red-600'
              }`}>
                {isImprovement ? (
                  <TrendUp className="h-3 w-3" />
                ) : (
                  <TrendDown className="h-3 w-3" />
                )}
                {Math.abs(change).toFixed(1)}%
              </div>
            )}
            {!isSignificant && Math.abs(change) > 0.1 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Minus className="h-3 w-3" />
                {Math.abs(change).toFixed(1)}%
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Before: {original.toFixed(1)} {unit}</span>
            <span>After: {optimized.toFixed(1)} {unit}</span>
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          isImprovement && isSignificant 
            ? 'bg-green-100 text-green-700' 
            : !isImprovement && isSignificant
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-600'
        }`}>
          {isImprovement && isSignificant ? '✓ Better' : 
           !isImprovement && isSignificant ? '⚠ Worse' : '~ Similar'}
        </div>
      </div>
    );
  };

  const renderScoreComparison = (
    label: string,
    original: number,
    optimized: number
  ) => {
    const change = calculatePercentageChange(original, optimized);
    const isImprovement = change > 0;
    const isSignificant = Math.abs(change) > 3;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{label}</span>
          <div className={`flex items-center gap-1 text-xs ${
            isImprovement && isSignificant ? 'text-green-600' : 
            !isImprovement && isSignificant ? 'text-red-600' : 'text-muted-foreground'
          }`}>
            {isSignificant && (isImprovement ? <TrendUp className="h-3 w-3" /> : <TrendDown className="h-3 w-3" />)}
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Before</span>
              <span>{original.toFixed(0)}%</span>
            </div>
            <Progress value={original} className="h-2" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>After</span>
              <span>{optimized.toFixed(0)}%</span>
            </div>
            <Progress 
              value={optimized} 
              className={`h-2 ${isImprovement && isSignificant ? 'bg-green-100' : ''}`}
            />
          </div>
        </div>
      </div>
    );
  };

  const getCompositionChanges = () => {
    const changes: Array<{
      element: string;
      originalPercentage: number;
      optimizedPercentage: number;
      change: number;
      changeType: 'added' | 'removed' | 'increased' | 'decreased' | 'unchanged';
    }> = [];

    // Get all unique elements
    const allElements = new Set([
      ...originalComposition.elements.map(e => e.element.symbol),
      ...optimizedComposition.elements.map(e => e.element.symbol)
    ]);

    allElements.forEach(symbol => {
      const original = originalComposition.elements.find(e => e.element.symbol === symbol);
      const optimized = optimizedComposition.elements.find(e => e.element.symbol === symbol);
      
      const originalPercentage = original?.percentage || 0;
      const optimizedPercentage = optimized?.percentage || 0;
      const change = calculatePercentageChange(originalPercentage, optimizedPercentage);

      let changeType: 'added' | 'removed' | 'increased' | 'decreased' | 'unchanged';
      
      if (originalPercentage === 0 && optimizedPercentage > 0) {
        changeType = 'added';
      } else if (originalPercentage > 0 && optimizedPercentage === 0) {
        changeType = 'removed';
      } else if (Math.abs(change) < 1) {
        changeType = 'unchanged';
      } else if (change > 0) {
        changeType = 'increased';
      } else {
        changeType = 'decreased';
      }

      changes.push({
        element: symbol,
        originalPercentage,
        optimizedPercentage,
        change,
        changeType
      });
    });

    return changes.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  };

  const compositionChanges = getCompositionChanges();
  const hasSignificantChanges = compositionChanges.some(c => Math.abs(c.change) > 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Optimization Results Comparison
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="outline">{originalComposition.label}</Badge>
          <span className="text-muted-foreground">→</span>
          <Badge variant="default">{optimizedComposition.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Composition Changes */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Composition Changes
          </h4>
          {hasSignificantChanges ? (
            <div className="grid gap-2">
              {compositionChanges
                .filter(change => change.changeType !== 'unchanged')
                .slice(0, 6)
                .map((change) => (
                  <div key={change.element} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {change.element}
                      </Badge>
                      <span className="text-sm">
                        {change.originalPercentage.toFixed(1)}% → {change.optimizedPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                      change.changeType === 'added' ? 'bg-green-100 text-green-700' :
                      change.changeType === 'removed' ? 'bg-red-100 text-red-700' :
                      change.changeType === 'increased' ? 'bg-blue-100 text-blue-700' :
                      change.changeType === 'decreased' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {change.changeType === 'added' && '+ Added'}
                      {change.changeType === 'removed' && '- Removed'}
                      {change.changeType === 'increased' && `↑ +${change.change.toFixed(1)}%`}
                      {change.changeType === 'decreased' && `↓ ${change.change.toFixed(1)}%`}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No significant composition changes detected.</p>
          )}
        </div>

        {/* Property Comparison */}
        {showPropertyChanges && originalComposition.properties && optimizedComposition.properties && (
          <div>
            <h4 className="font-medium mb-3">Property Improvements</h4>
            <div className="space-y-3">
              {renderPropertyComparison(
                'Tensile Strength',
                originalComposition.properties.tensileStrength,
                optimizedComposition.properties.tensileStrength,
                'MPa',
                true
              )}
              {renderPropertyComparison(
                'Density',
                originalComposition.properties.density,
                optimizedComposition.properties.density,
                'g/cm³',
                false
              )}
              {renderPropertyComparison(
                'Thermal Conductivity',
                originalComposition.properties.thermalConductivity,
                optimizedComposition.properties.thermalConductivity,
                'W/mK',
                true
              )}
              {renderPropertyComparison(
                'Electrical Conductivity',
                originalComposition.properties.electricalConductivity,
                optimizedComposition.properties.electricalConductivity,
                'MS/m',
                true
              )}
            </div>
          </div>
        )}

        {/* Score Comparison */}
        {originalComposition.scores && optimizedComposition.scores && (
          <div>
            <h4 className="font-medium mb-3">Performance Scores</h4>
            <div className="grid gap-4 md:grid-cols-2">
              {renderScoreComparison(
                'Performance',
                originalComposition.scores.performanceScore,
                optimizedComposition.scores.performanceScore
              )}
              {renderScoreComparison(
                'Cost Efficiency',
                originalComposition.scores.costScore,
                optimizedComposition.scores.costScore
              )}
              {renderScoreComparison(
                'Sustainability',
                originalComposition.scores.sustainabilityScore,
                optimizedComposition.scores.sustainabilityScore
              )}
              {renderScoreComparison(
                'Overall Score',
                originalComposition.scores.overallScore,
                optimizedComposition.scores.overallScore
              )}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h5 className="font-medium mb-2">Optimization Summary</h5>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• {compositionChanges.filter(c => c.changeType === 'added').length} elements added</p>
            <p>• {compositionChanges.filter(c => c.changeType === 'removed').length} elements removed</p>
            <p>• {compositionChanges.filter(c => ['increased', 'decreased'].includes(c.changeType)).length} elements adjusted</p>
            {originalComposition.scores && optimizedComposition.scores && (
              <p>• Overall score change: {
                (optimizedComposition.scores.overallScore - originalComposition.scores.overallScore).toFixed(1)
              } points</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}