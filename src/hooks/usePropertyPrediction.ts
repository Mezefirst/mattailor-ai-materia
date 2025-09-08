import { useState, useEffect, useCallback } from 'react';
import { Element } from '@/components/periodic/PeriodicTable';

export interface PredictedProperties {
  tensileStrength: number;
  yieldStrength: number;
  density: number;
  thermalConductivity: number;
  electricalConductivity: number;
  hardness: number;
  meltingPoint: number;
  elasticModulus: number;
  corrosionResistance: number;
  formability: number;
  weldability: number;
  machinability: number;
}

export interface PropertyScores {
  performanceScore: number;
  costScore: number;
  sustainabilityScore: number;
  overallScore: number;
  confidence: number;
}

export interface CompositionElement {
  element: Element;
  percentage: number;
}

export interface PredictionResult {
  properties: PredictedProperties;
  scores: PropertyScores;
  isValid: boolean;
  validationMessage?: string;
}

// Element property data for calculations
const ELEMENT_PROPERTIES: Record<string, {
  density: number;
  meltingPoint: number;
  thermalConductivity: number;
  electricalConductivity: number;
  strength: number;
  cost: number;
  sustainability: number;
  hardness: number;
  elasticModulus: number;
}> = {
  Fe: { density: 7.87, meltingPoint: 1538, thermalConductivity: 80, electricalConductivity: 10, strength: 400, cost: 0.8, sustainability: 0.7, hardness: 200, elasticModulus: 200 },
  Al: { density: 2.70, meltingPoint: 660, thermalConductivity: 237, electricalConductivity: 38, strength: 276, cost: 1.8, sustainability: 0.9, hardness: 75, elasticModulus: 70 },
  Cu: { density: 8.96, meltingPoint: 1085, thermalConductivity: 401, electricalConductivity: 59, strength: 220, cost: 6.5, sustainability: 0.8, hardness: 87, elasticModulus: 130 },
  Ti: { density: 4.51, meltingPoint: 1668, thermalConductivity: 22, electricalConductivity: 2.3, strength: 880, cost: 35, sustainability: 0.6, hardness: 349, elasticModulus: 116 },
  C: { density: 2.27, meltingPoint: 3550, thermalConductivity: 2000, electricalConductivity: 0.01, strength: 100, cost: 0.5, sustainability: 0.9, hardness: 10, elasticModulus: 1000 },
  Ni: { density: 8.91, meltingPoint: 1455, thermalConductivity: 91, electricalConductivity: 14, strength: 317, cost: 15, sustainability: 0.6, hardness: 200, elasticModulus: 200 },
  Cr: { density: 7.19, meltingPoint: 1907, thermalConductivity: 94, electricalConductivity: 7.9, strength: 279, cost: 7, sustainability: 0.5, hardness: 687, elasticModulus: 279 },
  Mn: { density: 7.44, meltingPoint: 1246, thermalConductivity: 7.8, electricalConductivity: 0.69, strength: 400, cost: 2, sustainability: 0.7, hardness: 196, elasticModulus: 198 },
  Si: { density: 2.33, meltingPoint: 1414, thermalConductivity: 149, electricalConductivity: 0.0001, strength: 47, cost: 1.5, sustainability: 0.8, hardness: 1000, elasticModulus: 107 },
  Mg: { density: 1.74, meltingPoint: 650, thermalConductivity: 156, electricalConductivity: 22, strength: 290, cost: 3, sustainability: 0.8, hardness: 44, elasticModulus: 45 },
  Zn: { density: 7.14, meltingPoint: 420, thermalConductivity: 116, electricalConductivity: 17, strength: 283, cost: 2.5, sustainability: 0.8, hardness: 412, elasticModulus: 108 },
  Pb: { density: 11.34, meltingPoint: 327, thermalConductivity: 35, electricalConductivity: 4.8, strength: 18, cost: 2, sustainability: 0.3, hardness: 5, elasticModulus: 16 },
  Sn: { density: 7.31, meltingPoint: 232, thermalConductivity: 67, electricalConductivity: 9.1, strength: 220, cost: 20, sustainability: 0.7, hardness: 51, elasticModulus: 50 },
  Au: { density: 19.32, meltingPoint: 1064, thermalConductivity: 317, electricalConductivity: 45, strength: 220, cost: 60000, sustainability: 0.4, hardness: 188, elasticModulus: 78 },
  Ag: { density: 10.49, meltingPoint: 962, thermalConductivity: 429, electricalConductivity: 63, strength: 290, cost: 800, sustainability: 0.5, hardness: 251, elasticModulus: 83 },
  Pt: { density: 21.45, meltingPoint: 1768, thermalConductivity: 72, electricalConductivity: 9.4, strength: 240, cost: 30000, sustainability: 0.3, hardness: 392, elasticModulus: 168 },
  W: { density: 19.25, meltingPoint: 3414, thermalConductivity: 173, electricalConductivity: 18, strength: 1510, cost: 40, sustainability: 0.5, hardness: 3430, elasticModulus: 411 },
  Mo: { density: 10.28, meltingPoint: 2623, thermalConductivity: 138, electricalConductivity: 18, strength: 324, cost: 60, sustainability: 0.6, hardness: 1500, elasticModulus: 329 },
  V: { density: 6.11, meltingPoint: 1910, thermalConductivity: 31, electricalConductivity: 5, strength: 308, cost: 300, sustainability: 0.5, hardness: 628, elasticModulus: 128 },
  Co: { density: 8.86, meltingPoint: 1495, thermalConductivity: 100, electricalConductivity: 17, strength: 760, cost: 50, sustainability: 0.4, hardness: 470, elasticModulus: 209 },
};

export function usePropertyPrediction(composition: CompositionElement[], debounceMs: number = 300) {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateProperties = useCallback(async (elements: CompositionElement[]): Promise<PredictionResult> => {
    // Validate composition
    const totalPercentage = elements.reduce((sum, e) => sum + e.percentage, 0);
    const isNormalized = Math.abs(totalPercentage - 100) < 0.01;
    
    if (elements.length === 0) {
      return {
        properties: {} as PredictedProperties,
        scores: {} as PropertyScores,
        isValid: false,
        validationMessage: 'No elements selected'
      };
    }

    if (!isNormalized && totalPercentage > 0) {
      // Auto-normalize for calculation purposes
      const normalizedElements = elements.map(e => ({
        ...e,
        percentage: (e.percentage / totalPercentage) * 100
      }));
      elements = normalizedElements;
    }

    // Calculate weighted average properties
    let density = 0;
    let meltingPoint = 0;
    let thermalConductivity = 0;
    let electricalConductivity = 0;
    let strength = 0;
    let cost = 0;
    let sustainability = 0;
    let hardness = 0;
    let elasticModulus = 0;
    let confidence = 70; // Base confidence

    for (const { element, percentage } of elements) {
      const weight = percentage / 100;
      const props = ELEMENT_PROPERTIES[element.symbol];
      
      if (props) {
        density += props.density * weight;
        meltingPoint += props.meltingPoint * weight;
        thermalConductivity += props.thermalConductivity * weight;
        electricalConductivity += props.electricalConductivity * weight;
        strength += props.strength * weight;
        cost += props.cost * weight;
        sustainability += props.sustainability * weight;
        hardness += props.hardness * weight;
        elasticModulus += props.elasticModulus * weight;
        confidence += 5; // Increase confidence for known elements
      } else {
        // Unknown element - use estimated values based on periodic table position
        const atomicNumber = element.atomicNumber;
        const estimatedDensity = Math.max(1, atomicNumber * 0.2);
        const estimatedStrength = Math.max(50, atomicNumber * 5);
        
        density += estimatedDensity * weight;
        strength += estimatedStrength * weight;
        confidence -= 10; // Decrease confidence for unknown elements
      }
    }

    // Apply alloy effects and synergies
    const hasIron = elements.some(e => e.element.symbol === 'Fe');
    const hasCarbon = elements.some(e => e.element.symbol === 'C');
    const hasChromium = elements.some(e => e.element.symbol === 'Cr');
    const hasNickel = elements.some(e => e.element.symbol === 'Ni');
    const hasAluminum = elements.some(e => e.element.symbol === 'Al');
    const hasTitanium = elements.some(e => e.element.symbol === 'Ti');

    // Steel alloy effects
    if (hasIron && hasCarbon) {
      const carbonPercentage = elements.find(e => e.element.symbol === 'C')?.percentage || 0;
      strength *= (1 + carbonPercentage * 0.1); // Carbon increases strength
      hardness *= (1 + carbonPercentage * 0.15);
      confidence += 10;
    }

    // Stainless steel effects
    if (hasIron && hasChromium) {
      const chromiumPercentage = elements.find(e => e.element.symbol === 'Cr')?.percentage || 0;
      if (chromiumPercentage >= 10.5) {
        sustainability *= 1.2; // Better corrosion resistance
        confidence += 15;
      }
    }

    // Superalloy effects
    if (hasNickel && hasChromium) {
      meltingPoint *= 1.1;
      strength *= 1.2;
      confidence += 10;
    }

    // Aluminum alloy effects
    if (hasAluminum) {
      const alPercentage = elements.find(e => e.element.symbol === 'Al')?.percentage || 0;
      if (alPercentage > 50) {
        density *= 0.9; // Lightweight
        sustainability *= 1.1;
        confidence += 10;
      }
    }

    // Titanium alloy effects
    if (hasTitanium) {
      const tiPercentage = elements.find(e => e.element.symbol === 'Ti')?.percentage || 0;
      if (tiPercentage > 30) {
        strength *= 1.3;
        cost *= 2; // Expensive
        confidence += 5;
      }
    }

    // Calculate derived properties
    const yieldStrength = strength * 0.7;
    const corrosionResistance = hasChromium ? 85 : hasAluminum ? 75 : 60;
    const formability = density < 5 ? 80 : density < 8 ? 65 : 50;
    const weldability = hasCarbon ? 60 : hasAluminum ? 85 : 75;
    const machinability = hardness < 200 ? 85 : hardness < 500 ? 70 : 50;

    // Calculate performance scores
    const performanceScore = Math.min(95, Math.max(20, 
      (strength / 1000 * 40) + 
      (hardness / 1000 * 30) + 
      (elasticModulus / 400 * 30)
    ));

    const costScore = Math.min(95, Math.max(20, 100 - (cost * 10)));
    
    const sustainabilityScore = Math.min(95, Math.max(30, sustainability * 100));
    
    const overallScore = (performanceScore + costScore + sustainabilityScore) / 3;

    confidence = Math.min(95, Math.max(30, confidence));

    return {
      properties: {
        tensileStrength: Math.round(strength),
        yieldStrength: Math.round(yieldStrength),
        density: Math.round(density * 1000) / 1000,
        thermalConductivity: Math.round(thermalConductivity),
        electricalConductivity: Math.round(electricalConductivity),
        hardness: Math.round(hardness),
        meltingPoint: Math.round(meltingPoint),
        elasticModulus: Math.round(elasticModulus),
        corrosionResistance: Math.round(corrosionResistance),
        formability: Math.round(formability),
        weldability: Math.round(weldability),
        machinability: Math.round(machinability),
      },
      scores: {
        performanceScore: Math.round(performanceScore),
        costScore: Math.round(costScore),
        sustainabilityScore: Math.round(sustainabilityScore),
        overallScore: Math.round(overallScore),
        confidence: Math.round(confidence),
      },
      isValid: elements.length > 0,
      validationMessage: !isNormalized && totalPercentage !== 100 ? 
        `Composition calculated with auto-normalization (${totalPercentage.toFixed(1)}% → 100%)` : 
        undefined
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (composition.length === 0) {
        setPrediction(null);
        return;
      }

      setIsCalculating(true);
      try {
        const result = await calculateProperties(composition);
        setPrediction(result);
      } catch (error) {
        console.error('Property prediction error:', error);
        setPrediction({
          properties: {} as PredictedProperties,
          scores: {} as PropertyScores,
          isValid: false,
          validationMessage: 'Calculation error occurred'
        });
      } finally {
        setIsCalculating(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [composition, calculateProperties, debounceMs]);

  return {
    prediction,
    isCalculating,
    recalculate: () => calculateProperties(composition)
  };
}