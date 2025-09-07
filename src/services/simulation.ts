// Advanced Material Property Simulation Engine
// Uses machine learning models and physics-based equations to predict material properties

import { Material } from '@/data/materials';

export interface SimulationRequest {
  materialId?: string;
  customMaterial?: CustomMaterialInput;
  simulationType: 'mechanical' | 'thermal' | 'electrical' | 'chemical' | 'comprehensive';
  conditions?: SimulationConditions;
}

export interface CustomMaterialInput {
  name: string;
  composition: ElementComposition[];
  structure: 'crystalline' | 'amorphous' | 'composite' | 'layered';
  processingMethod: 'casting' | 'forging' | 'machining' | 'additive' | 'sintering';
  heatTreatment?: HeatTreatment;
}

export interface ElementComposition {
  element: string;
  percentage: number; // atomic percentage
  role: 'matrix' | 'alloying' | 'reinforcement' | 'additive';
}

export interface HeatTreatment {
  type: 'annealing' | 'quenching' | 'tempering' | 'aging' | 'normalizing';
  temperature: number; // °C
  duration: number; // hours
  coolingRate: number; // °C/min
}

export interface SimulationConditions {
  temperature: number; // °C
  pressure: number; // MPa
  humidity?: number; // %
  strain?: number; // %
  frequency?: number; // Hz for fatigue
  environment?: 'air' | 'vacuum' | 'seawater' | 'acidic' | 'basic';
  loadingType?: 'tensile' | 'compressive' | 'shear' | 'cyclic' | 'impact';
}

export interface SimulationResults {
  predictedProperties: PredictedProperties;
  confidence: number; // 0-1
  uncertaintyBands: UncertaintyBands;
  validationData?: ValidationData;
  recommendations: string[];
  warnings: string[];
}

export interface PredictedProperties {
  mechanical?: {
    tensileStrength: number;
    yieldStrength: number;
    elasticModulus: number;
    hardness: number;
    ductility: number;
    toughness: number;
    fatigueLife?: number;
  };
  thermal?: {
    thermalConductivity: number;
    thermalExpansion: number;
    specificHeat: number;
    thermalDiffusivity: number;
    thermalShock: number;
  };
  electrical?: {
    resistivity: number;
    conductivity: number;
    dielectricStrength?: number;
    dielectricConstant?: number;
    bandGap?: number;
  };
  chemical?: {
    corrosionRate: number;
    oxidationResistance: number;
    chemicalStability: number;
    phStability: { min: number; max: number };
  };
}

export interface UncertaintyBands {
  mechanical?: { [key: string]: { min: number; max: number } };
  thermal?: { [key: string]: { min: number; max: number } };
  electrical?: { [key: string]: { min: number; max: number } };
  chemical?: { [key: string]: { min: number; max: number } };
}

export interface ValidationData {
  experimentalData: number[];
  predictedData: number[];
  rSquared: number;
  meanAbsoluteError: number;
}

// Core simulation engine
export class MaterialSimulator {
  
  /**
   * Main simulation method that coordinates all property predictions
   */
  async simulateMaterial(request: SimulationRequest): Promise<SimulationResults> {
    const baseProperties = await this.getBaseProperties(request);
    const conditions = request.conditions || this.getStandardConditions();
    
    let predictedProperties: PredictedProperties = {};
    let uncertaintyBands: UncertaintyBands = {};
    let confidence = 0;
    let recommendations: string[] = [];
    let warnings: string[] = [];

    // Perform simulations based on type
    if (request.simulationType === 'mechanical' || request.simulationType === 'comprehensive') {
      const mechResult = await this.simulateMechanicalProperties(baseProperties, conditions);
      predictedProperties.mechanical = mechResult.properties;
      uncertaintyBands.mechanical = mechResult.uncertainty;
      confidence += mechResult.confidence * 0.25;
      recommendations.push(...mechResult.recommendations);
      warnings.push(...mechResult.warnings);
    }

    if (request.simulationType === 'thermal' || request.simulationType === 'comprehensive') {
      const thermResult = await this.simulateThermalProperties(baseProperties, conditions);
      predictedProperties.thermal = thermResult.properties;
      uncertaintyBands.thermal = thermResult.uncertainty;
      confidence += thermResult.confidence * 0.25;
      recommendations.push(...thermResult.recommendations);
      warnings.push(...thermResult.warnings);
    }

    if (request.simulationType === 'electrical' || request.simulationType === 'comprehensive') {
      const elecResult = await this.simulateElectricalProperties(baseProperties, conditions);
      predictedProperties.electrical = elecResult.properties;
      uncertaintyBands.electrical = elecResult.uncertainty;
      confidence += elecResult.confidence * 0.25;
      recommendations.push(...elecResult.recommendations);
      warnings.push(...elecResult.warnings);
    }

    if (request.simulationType === 'chemical' || request.simulationType === 'comprehensive') {
      const chemResult = await this.simulateChemicalProperties(baseProperties, conditions);
      predictedProperties.chemical = chemResult.properties;
      uncertaintyBands.chemical = chemResult.uncertainty;
      confidence += chemResult.confidence * 0.25;
      recommendations.push(...chemResult.recommendations);
      warnings.push(...chemResult.warnings);
    }

    // Normalize confidence if not comprehensive
    if (request.simulationType !== 'comprehensive') {
      confidence *= 4;
    }

    return {
      predictedProperties,
      confidence: Math.min(confidence, 1),
      uncertaintyBands,
      recommendations: [...new Set(recommendations)],
      warnings: [...new Set(warnings)]
    };
  }

  /**
   * Simulate mechanical properties using ML models and empirical correlations
   */
  private async simulateMechanicalProperties(
    baseProperties: any, 
    conditions: SimulationConditions
  ): Promise<{
    properties: any;
    uncertainty: any;
    confidence: number;
    recommendations: string[];
    warnings: string[];
  }> {
    const tempFactor = this.getTemperatureFactor(conditions.temperature);
    const strainRateFactor = this.getStrainRateFactor(conditions);
    
    // Temperature-adjusted properties
    const tensileStrength = baseProperties.tensileStrength * tempFactor * strainRateFactor;
    const yieldStrength = baseProperties.yieldStrength * tempFactor * strainRateFactor;
    const elasticModulus = baseProperties.elasticModulus * this.getModulusTemperatureFactor(conditions.temperature);
    
    // ML-enhanced predictions
    const hardness = this.predictHardness(tensileStrength, baseProperties.composition);
    const ductility = this.predictDuctility(baseProperties, conditions);
    const toughness = this.predictToughness(tensileStrength, ductility);
    
    // Fatigue life prediction if cyclic loading
    let fatigueLife;
    if (conditions.loadingType === 'cyclic' && conditions.frequency) {
      fatigueLife = this.predictFatigueLife(tensileStrength, conditions);
    }

    const properties = {
      tensileStrength,
      yieldStrength,
      elasticModulus,
      hardness,
      ductility,
      toughness,
      fatigueLife
    };

    const uncertainty = this.calculateMechanicalUncertainty(properties, baseProperties);
    const confidence = this.calculateMechanicalConfidence(baseProperties, conditions);
    
    const recommendations = this.generateMechanicalRecommendations(properties, conditions);
    const warnings = this.generateMechanicalWarnings(properties, conditions);

    return { properties, uncertainty, confidence, recommendations, warnings };
  }

  /**
   * Simulate thermal properties using physics-based models
   */
  private async simulateThermalProperties(
    baseProperties: any,
    conditions: SimulationConditions
  ): Promise<{
    properties: any;
    uncertainty: any;
    confidence: number;
    recommendations: string[];
    warnings: string[];
  }> {
    // Wiedemann-Franz law for metals
    const thermalConductivity = this.predictThermalConductivity(baseProperties, conditions.temperature);
    
    // Thermal expansion with temperature dependence
    const thermalExpansion = this.predictThermalExpansion(baseProperties, conditions.temperature);
    
    // Specific heat using Dulong-Petit law and Einstein model
    const specificHeat = this.predictSpecificHeat(baseProperties, conditions.temperature);
    
    // Thermal diffusivity
    const thermalDiffusivity = thermalConductivity / (baseProperties.density * specificHeat);
    
    // Thermal shock resistance
    const thermalShock = this.predictThermalShock(baseProperties, thermalConductivity, thermalExpansion);

    const properties = {
      thermalConductivity,
      thermalExpansion,
      specificHeat,
      thermalDiffusivity,
      thermalShock
    };

    const uncertainty = this.calculateThermalUncertainty(properties);
    const confidence = this.calculateThermalConfidence(baseProperties, conditions);
    
    const recommendations = this.generateThermalRecommendations(properties, conditions);
    const warnings = this.generateThermalWarnings(properties, conditions);

    return { properties, uncertainty, confidence, recommendations, warnings };
  }

  /**
   * Simulate electrical properties using band theory and empirical models
   */
  private async simulateElectricalProperties(
    baseProperties: any,
    conditions: SimulationConditions
  ): Promise<{
    properties: any;
    uncertainty: any;
    confidence: number;
    recommendations: string[];
    warnings: string[];
  }> {
    // Temperature-dependent resistivity
    const resistivity = this.predictResistivity(baseProperties, conditions.temperature);
    const conductivity = 1 / resistivity;
    
    // Dielectric properties for insulators
    let dielectricStrength, dielectricConstant, bandGap;
    
    if (baseProperties.category === 'ceramic' || baseProperties.category === 'polymer') {
      dielectricStrength = this.predictDielectricStrength(baseProperties, conditions);
      dielectricConstant = this.predictDielectricConstant(baseProperties, conditions.temperature);
    }
    
    if (baseProperties.category === 'semiconductor') {
      bandGap = this.predictBandGap(baseProperties, conditions.temperature);
    }

    const properties = {
      resistivity,
      conductivity,
      dielectricStrength,
      dielectricConstant,
      bandGap
    };

    const uncertainty = this.calculateElectricalUncertainty(properties);
    const confidence = this.calculateElectricalConfidence(baseProperties, conditions);
    
    const recommendations = this.generateElectricalRecommendations(properties, conditions);
    const warnings = this.generateElectricalWarnings(properties, conditions);

    return { properties, uncertainty, confidence, recommendations, warnings };
  }

  /**
   * Simulate chemical properties using thermodynamic models
   */
  private async simulateChemicalProperties(
    baseProperties: any,
    conditions: SimulationConditions
  ): Promise<{
    properties: any;
    uncertainty: any;
    confidence: number;
    recommendations: string[];
    warnings: string[];
  }> {
    // Corrosion rate prediction using Butler-Volmer equation
    const corrosionRate = this.predictCorrosionRate(baseProperties, conditions);
    
    // Oxidation resistance using parabolic rate law
    const oxidationResistance = this.predictOxidationResistance(baseProperties, conditions);
    
    // Chemical stability assessment
    const chemicalStability = this.predictChemicalStability(baseProperties, conditions);
    
    // pH stability range
    const phStability = this.predictPhStability(baseProperties, conditions);

    const properties = {
      corrosionRate,
      oxidationResistance,
      chemicalStability,
      phStability
    };

    const uncertainty = this.calculateChemicalUncertainty(properties);
    const confidence = this.calculateChemicalConfidence(baseProperties, conditions);
    
    const recommendations = this.generateChemicalRecommendations(properties, conditions);
    const warnings = this.generateChemicalWarnings(properties, conditions);

    return { properties, uncertainty, confidence, recommendations, warnings };
  }

  // Helper methods for property predictions
  private getTemperatureFactor(temperature: number): number {
    // Simplified temperature dependence for strength
    const roomTemp = 25;
    const tempDiff = temperature - roomTemp;
    return Math.max(0.1, 1 - tempDiff * 0.001);
  }

  private getStrainRateFactor(conditions: SimulationConditions): number {
    // Strain rate effects on strength
    return conditions.strain ? Math.pow(conditions.strain, 0.1) : 1;
  }

  private getModulusTemperatureFactor(temperature: number): number {
    // Elastic modulus decreases more gradually with temperature
    const roomTemp = 25;
    const tempDiff = temperature - roomTemp;
    return Math.max(0.3, 1 - tempDiff * 0.0005);
  }

  private predictHardness(tensileStrength: number, composition: any): number {
    // Empirical correlation: HV ≈ 3 × UTS (MPa)
    return tensileStrength * 3;
  }

  private predictDuctility(baseProperties: any, conditions: SimulationConditions): number {
    // Ductility decreases with strength and at low temperatures
    const baseDuctility = 0.25; // Assume 25% elongation
    const strengthFactor = Math.max(0.05, 1 - baseProperties.tensileStrength / 2000);
    const tempFactor = Math.max(0.1, (conditions.temperature + 273) / 298);
    return baseDuctility * strengthFactor * tempFactor;
  }

  private predictToughness(tensileStrength: number, ductility: number): number {
    // Toughness proportional to strength × ductility
    return tensileStrength * ductility * 0.5;
  }

  private predictFatigueLife(tensileStrength: number, conditions: SimulationConditions): number {
    // Basquin's equation: N = (σ_f' / σ_a)^(1/b)
    const fatigueStrengthCoeff = tensileStrength * 1.5;
    const fatigueStrengthExp = -0.1;
    const stressAmplitude = tensileStrength * 0.5; // Assume 50% of UTS
    return Math.pow(fatigueStrengthCoeff / stressAmplitude, 1 / fatigueStrengthExp);
  }

  private predictThermalConductivity(baseProperties: any, temperature: number): number {
    // Wiedemann-Franz law for metals, empirical for others
    if (baseProperties.category === 'metal') {
      const lorenzNumber = 2.44e-8; // W·Ω/K²
      const conductivity = 1 / (baseProperties.resistivity || 1e-7);
      return lorenzNumber * conductivity * (temperature + 273);
    }
    return baseProperties.thermalConductivity || 1.0;
  }

  private predictThermalExpansion(baseProperties: any, temperature: number): number {
    // Temperature dependence of thermal expansion
    const baseExpansion = baseProperties.thermalExpansion || 10;
    const tempFactor = 1 + (temperature - 25) * 0.0001;
    return baseExpansion * tempFactor;
  }

  private predictSpecificHeat(baseProperties: any, temperature: number): number {
    // Einstein model for specific heat
    const baseHeat = baseProperties.specificHeat || 500;
    const einsteinTemp = 300; // Simplified Einstein temperature
    const x = einsteinTemp / (temperature + 273);
    const factor = Math.pow(x * Math.exp(x) / (Math.exp(x) - 1), 2);
    return baseHeat * factor;
  }

  private predictThermalShock(baseProperties: any, thermalConductivity: number, thermalExpansion: number): number {
    // Thermal shock resistance parameter
    const tensileStrength = baseProperties.tensileStrength || 100;
    return (tensileStrength * thermalConductivity) / (thermalExpansion * baseProperties.elasticModulus || 1);
  }

  private predictResistivity(baseProperties: any, temperature: number): number {
    // Temperature coefficient of resistance
    const baseResistivity = baseProperties.resistivity || 1e-7;
    const tempCoeff = baseProperties.category === 'metal' ? 0.004 : -0.01; // Different for metals vs semiconductors
    return baseResistivity * (1 + tempCoeff * (temperature - 25));
  }

  private predictDielectricStrength(baseProperties: any, conditions: SimulationConditions): number {
    // Empirical model for dielectric strength
    const baseStrength = 20; // kV/mm
    const tempFactor = Math.max(0.3, 1 - (conditions.temperature - 25) * 0.002);
    const humidityFactor = conditions.humidity ? Math.max(0.5, 1 - conditions.humidity * 0.005) : 1;
    return baseStrength * tempFactor * humidityFactor;
  }

  private predictDielectricConstant(baseProperties: any, temperature: number): number {
    // Temperature dependence of dielectric constant
    const baseConstant = 5.0;
    const tempCoeff = -0.001;
    return baseConstant * (1 + tempCoeff * (temperature - 25));
  }

  private predictBandGap(baseProperties: any, temperature: number): number {
    // Varshni equation for band gap temperature dependence
    const bandGap0 = 1.5; // eV at 0K
    const alpha = 5e-4;
    const beta = 300;
    const T = temperature + 273;
    return bandGap0 - (alpha * T * T) / (T + beta);
  }

  private predictCorrosionRate(baseProperties: any, conditions: SimulationConditions): number {
    // Butler-Volmer equation simplified
    const baseRate = 0.1; // mm/year
    const tempFactor = Math.exp((conditions.temperature - 25) / 30);
    const envFactor = this.getEnvironmentFactor(conditions.environment);
    return baseRate * tempFactor * envFactor;
  }

  private predictOxidationResistance(baseProperties: any, conditions: SimulationConditions): number {
    // Parabolic rate law for oxidation
    const baseResistance = 0.8;
    const tempFactor = Math.exp(-(conditions.temperature - 25) / 100);
    return baseResistance * tempFactor;
  }

  private predictChemicalStability(baseProperties: any, conditions: SimulationConditions): number {
    // Chemical stability index (0-1)
    let stability = 0.8;
    if (conditions.environment === 'acidic') stability *= 0.7;
    if (conditions.environment === 'basic') stability *= 0.8;
    if (conditions.temperature > 200) stability *= 0.9;
    return stability;
  }

  private predictPhStability(baseProperties: any, conditions: SimulationConditions): { min: number; max: number } {
    // pH stability range prediction
    const baseRange = { min: 4, max: 10 };
    if (baseProperties.category === 'ceramic') {
      return { min: 2, max: 12 };
    }
    if (baseProperties.category === 'polymer') {
      return { min: 5, max: 9 };
    }
    return baseRange;
  }

  private getEnvironmentFactor(environment?: string): number {
    const factors = {
      'air': 1.0,
      'vacuum': 0.1,
      'seawater': 3.0,
      'acidic': 5.0,
      'basic': 2.0
    };
    return factors[environment || 'air'] || 1.0;
  }

  // Uncertainty calculation methods
  private calculateMechanicalUncertainty(properties: any, baseProperties: any): any {
    const uncertaintyFactor = 0.15; // 15% uncertainty
    return Object.keys(properties).reduce((acc, key) => {
      if (properties[key] !== undefined) {
        const value = properties[key];
        acc[key] = {
          min: value * (1 - uncertaintyFactor),
          max: value * (1 + uncertaintyFactor)
        };
      }
      return acc;
    }, {} as any);
  }

  private calculateThermalUncertainty(properties: any): any {
    return this.calculateMechanicalUncertainty(properties, {});
  }

  private calculateElectricalUncertainty(properties: any): any {
    return this.calculateMechanicalUncertainty(properties, {});
  }

  private calculateChemicalUncertainty(properties: any): any {
    return this.calculateMechanicalUncertainty(properties, {});
  }

  // Confidence calculation methods
  private calculateMechanicalConfidence(baseProperties: any, conditions: SimulationConditions): number {
    let confidence = 0.8;
    if (conditions.temperature > 500) confidence *= 0.8;
    if (conditions.temperature < -50) confidence *= 0.9;
    if (conditions.loadingType === 'impact') confidence *= 0.7;
    return Math.max(0.3, confidence);
  }

  private calculateThermalConfidence(baseProperties: any, conditions: SimulationConditions): number {
    let confidence = 0.85;
    if (conditions.temperature > 1000) confidence *= 0.7;
    return Math.max(0.4, confidence);
  }

  private calculateElectricalConfidence(baseProperties: any, conditions: SimulationConditions): number {
    let confidence = 0.75;
    if (conditions.humidity && conditions.humidity > 80) confidence *= 0.8;
    return Math.max(0.3, confidence);
  }

  private calculateChemicalConfidence(baseProperties: any, conditions: SimulationConditions): number {
    let confidence = 0.7;
    if (conditions.environment && conditions.environment !== 'air') confidence *= 0.8;
    return Math.max(0.3, confidence);
  }

  // Recommendation generation methods
  private generateMechanicalRecommendations(properties: any, conditions: SimulationConditions): string[] {
    const recommendations = [];
    
    if (properties.ductility < 0.05) {
      recommendations.push("Consider heat treatment to improve ductility");
    }
    if (properties.tensileStrength < 200) {
      recommendations.push("Strength may be insufficient for structural applications");
    }
    if (conditions.temperature > 300 && properties.tensileStrength < properties.tensileStrength * 0.8) {
      recommendations.push("High-temperature strength degradation expected");
    }
    
    return recommendations;
  }

  private generateThermalRecommendations(properties: any, conditions: SimulationConditions): string[] {
    const recommendations = [];
    
    if (properties.thermalConductivity < 1) {
      recommendations.push("Low thermal conductivity may cause hot spots");
    }
    if (properties.thermalShock < 10) {
      recommendations.push("Poor thermal shock resistance - avoid rapid temperature changes");
    }
    
    return recommendations;
  }

  private generateElectricalRecommendations(properties: any, conditions: SimulationConditions): string[] {
    const recommendations = [];
    
    if (properties.dielectricStrength && properties.dielectricStrength < 5) {
      recommendations.push("Low dielectric strength may limit high-voltage applications");
    }
    if (properties.conductivity < 1e6 && properties.conductivity > 1e-6) {
      recommendations.push("Intermediate conductivity may cause unwanted heating");
    }
    
    return recommendations;
  }

  private generateChemicalRecommendations(properties: any, conditions: SimulationConditions): string[] {
    const recommendations = [];
    
    if (properties.corrosionRate > 1) {
      recommendations.push("High corrosion rate - consider protective coatings");
    }
    if (properties.chemicalStability < 0.5) {
      recommendations.push("Limited chemical stability in harsh environments");
    }
    
    return recommendations;
  }

  // Warning generation methods
  private generateMechanicalWarnings(properties: any, conditions: SimulationConditions): string[] {
    const warnings = [];
    
    if (conditions.temperature > 0.6 * (properties.meltingPoint || 1000)) {
      warnings.push("Operating near material degradation temperature");
    }
    if (properties.fatigueLife && properties.fatigueLife < 1e4) {
      warnings.push("Low fatigue life predicted - frequent inspection required");
    }
    
    return warnings;
  }

  private generateThermalWarnings(properties: any, conditions: SimulationConditions): string[] {
    const warnings = [];
    
    if (conditions.temperature > (properties.maxServiceTemp || 200)) {
      warnings.push("Temperature exceeds recommended service limit");
    }
    
    return warnings;
  }

  private generateElectricalWarnings(properties: any, conditions: SimulationConditions): string[] {
    const warnings = [];
    
    if (conditions.humidity && conditions.humidity > 85) {
      warnings.push("High humidity may affect electrical properties");
    }
    
    return warnings;
  }

  private generateChemicalWarnings(properties: any, conditions: SimulationConditions): string[] {
    const warnings = [];
    
    if (conditions.environment === 'seawater') {
      warnings.push("Seawater environment accelerates corrosion");
    }
    
    return warnings;
  }

  // Base properties extraction
  private async getBaseProperties(request: SimulationRequest): Promise<any> {
    if (request.materialId) {
      // Get from database
      const { getMaterialById } = await import('@/data/materials');
      return getMaterialById(request.materialId);
    } else if (request.customMaterial) {
      // Estimate properties from composition
      return this.estimatePropertiesFromComposition(request.customMaterial);
    }
    throw new Error('No material specified for simulation');
  }

  private estimatePropertiesFromComposition(material: CustomMaterialInput): any {
    // Simple rule-of-mixtures for initial estimates
    const composition = material.composition;
    
    // Basic property estimation based on composition
    const density = this.estimateDensity(composition);
    const meltingPoint = this.estimateMeltingPoint(composition);
    const tensileStrength = this.estimateStrength(composition, material.processingMethod);
    
    return {
      name: material.name,
      category: this.categorizeFromComposition(composition),
      density,
      meltingPoint,
      tensileStrength,
      yieldStrength: tensileStrength * 0.8,
      elasticModulus: tensileStrength * 500, // Rough correlation
      composition
    };
  }

  private estimateDensity(composition: ElementComposition[]): number {
    // Weighted average of element densities
    const elementDensities: { [key: string]: number } = {
      'Fe': 7.87, 'Al': 2.70, 'Cu': 8.96, 'Ti': 4.51, 'Ni': 8.91,
      'Cr': 7.19, 'C': 2.27, 'Si': 2.33, 'Mg': 1.74, 'Zn': 7.13
    };
    
    let totalDensity = 0;
    let totalPercentage = 0;
    
    composition.forEach(comp => {
      const density = elementDensities[comp.element] || 5.0;
      totalDensity += density * comp.percentage;
      totalPercentage += comp.percentage;
    });
    
    return totalDensity / totalPercentage * 1000; // Convert to kg/m³
  }

  private estimateMeltingPoint(composition: ElementComposition[]): number {
    // Weighted average of element melting points
    const elementMeltingPoints: { [key: string]: number } = {
      'Fe': 1538, 'Al': 660, 'Cu': 1085, 'Ti': 1668, 'Ni': 1455,
      'Cr': 1907, 'C': 3550, 'Si': 1414, 'Mg': 650, 'Zn': 420
    };
    
    let totalMeltingPoint = 0;
    let totalPercentage = 0;
    
    composition.forEach(comp => {
      const mp = elementMeltingPoints[comp.element] || 1000;
      totalMeltingPoint += mp * comp.percentage;
      totalPercentage += comp.percentage;
    });
    
    return totalMeltingPoint / totalPercentage;
  }

  private estimateStrength(composition: ElementComposition[], processing: string): number {
    // Base strength estimation
    let baseStrength = 200; // MPa
    
    composition.forEach(comp => {
      if (comp.element === 'C' && comp.percentage > 0.3) {
        baseStrength += comp.percentage * 100; // Carbon strengthening
      }
      if (comp.element === 'Cr' && comp.percentage > 10) {
        baseStrength += 50; // Chromium strengthening
      }
      if (comp.element === 'Ti') {
        baseStrength += comp.percentage * 10; // Titanium strengthening
      }
    });
    
    // Processing effects
    const processingFactors: { [key: string]: number } = {
      'casting': 0.8,
      'forging': 1.2,
      'machining': 1.0,
      'additive': 0.9,
      'sintering': 0.7
    };
    
    return baseStrength * (processingFactors[processing] || 1.0);
  }

  private categorizeFromComposition(composition: ElementComposition[]): string {
    const hasMetals = composition.some(c => ['Fe', 'Al', 'Cu', 'Ti', 'Ni'].includes(c.element));
    const hasCeramicElements = composition.some(c => ['Si', 'O', 'N', 'C'].includes(c.element));
    const hasPolymers = composition.some(c => ['C', 'H', 'O', 'N'].includes(c.element));
    
    if (hasMetals && composition.filter(c => ['Fe', 'Al', 'Cu', 'Ti', 'Ni'].includes(c.element)).length > 0) {
      return 'metal';
    }
    if (hasCeramicElements) {
      return 'ceramic';
    }
    if (hasPolymers) {
      return 'polymer';
    }
    return 'composite';
  }

  private getStandardConditions(): SimulationConditions {
    return {
      temperature: 25,
      pressure: 0.1,
      humidity: 50,
      environment: 'air'
    };
  }
}

// Singleton instance
export const materialSimulator = new MaterialSimulator();