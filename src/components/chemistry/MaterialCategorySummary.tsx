// Material Category Summary Component
// Overview of all available material categories with descriptions and examples

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Atom, 
  FlaskConical, 
  Zap,
  Thermometer,
  Shield,
  Wrench,
  Leaf,
  Factory,
  Cpu,
  Heart,
  Sparkles,
  Lightning
} from '@phosphor-icons/react';
import { MATERIAL_CATEGORIES, MaterialCategory } from '@/data/material-categories';

interface MaterialCategorySummaryProps {
  onCategorySelect?: (categoryId: string) => void;
}

export function MaterialCategorySummary({ onCategorySelect }: MaterialCategorySummaryProps) {
  const getCategoryIcon = (categoryId: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      'ferrous-metals': <Wrench className="w-5 h-5" />,
      'non-ferrous-metals': <Atom className="w-5 h-5" />,
      'ceramics': <FlaskConical className="w-5 h-5" />,
      'polymers': <Factory className="w-5 h-5" />,
      'composites': <Sparkles className="w-5 h-5" />,
      'semiconductors': <Cpu className="w-5 h-5" />,
      'biomaterials': <Heart className="w-5 h-5" />,
      'nanomaterials': <Atom className="w-5 h-5" />,
      'smart-materials': <Lightning className="w-5 h-5" />,
      'energy-materials': <Zap className="w-5 h-5" />,
      'refractory-materials': <Thermometer className="w-5 h-5" />,
      'magnetic-materials': <Sparkles className="w-5 h-5" />
    };
    return iconMap[categoryId] || <FlaskConical className="w-5 h-5" />;
  };

  const getPropertyIcon = (property: string, value: string) => {
    switch (property) {
      case 'strength':
        return <Wrench className="w-3 h-3" />;
      case 'conductivity':
        return <Zap className="w-3 h-3" />;
      case 'corrosionResistance':
        return <Shield className="w-3 h-3" />;
      case 'temperature':
        return <Thermometer className="w-3 h-3" />;
      default:
        return <Atom className="w-3 h-3" />;
    }
  };

  const getPropertyColor = (property: string, value: string) => {
    const colorMap: Record<string, string> = {
      'low': 'text-red-500',
      'medium': 'text-yellow-500',
      'high': 'text-green-500',
      'very-high': 'text-emerald-600',
      'ultra-high': 'text-blue-600',
      'poor': 'text-red-500',
      'fair': 'text-yellow-500',
      'good': 'text-green-500',
      'excellent': 'text-emerald-600',
      'insulator': 'text-gray-500',
      'semiconductor': 'text-purple-500',
      'conductor': 'text-blue-500',
      'superconductor': 'text-indigo-600'
    };
    return colorMap[value] || 'text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <FlaskConical className="text-primary" />
          Material Categories Overview
        </h2>
        <p className="text-muted-foreground">
          Explore {MATERIAL_CATEGORIES.length} comprehensive material categories with detailed compositions
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MATERIAL_CATEGORIES.map((category) => (
          <Card 
            key={category.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => onCategorySelect?.(category.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {getCategoryIcon(category.id)}
                {category.name}
              </CardTitle>
              <Badge variant="outline" className="w-fit">
                {category.subcategories.length} subcategories
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {category.description}
              </p>

              <Separator />

              {/* Base Elements */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Base Elements</h4>
                <div className="flex flex-wrap gap-1">
                  {category.baseElements.slice(0, 6).map(element => (
                    <Badge key={element} variant="secondary" className="text-xs font-mono">
                      {element}
                    </Badge>
                  ))}
                  {category.baseElements.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{category.baseElements.length - 6} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Properties */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Key Properties</h4>
                <div className="space-y-1">
                  {Object.entries(category.properties).map(([property, value]) => (
                    <div key={property} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        {getPropertyIcon(property, value)}
                        <span className="capitalize">
                          {property.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                      </div>
                      <span className={`font-medium capitalize ${getPropertyColor(property, value)}`}>
                        {value.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Applications */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Applications</h4>
                <div className="flex flex-wrap gap-1">
                  {category.applications.slice(0, 3).map(app => (
                    <Badge key={app} variant="outline" className="text-xs">
                      {app}
                    </Badge>
                  ))}
                  {category.applications.length > 3 && (
                    <Badge variant="outline" className="text-xs opacity-60">
                      +{category.applications.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Subcategory Preview */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Subcategories</h4>
                <div className="space-y-1">
                  {category.subcategories.slice(0, 2).map(sub => (
                    <div key={sub.id} className="text-xs text-muted-foreground">
                      • {sub.name}
                    </div>
                  ))}
                  {category.subcategories.length > 2 && (
                    <div className="text-xs text-muted-foreground opacity-60">
                      • +{category.subcategories.length - 2} more subcategories
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Atom className="w-5 h-5" />
            Database Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">
                {MATERIAL_CATEGORIES.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Categories</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-secondary">
                {MATERIAL_CATEGORIES.reduce((sum, cat) => sum + cat.subcategories.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Subcategories</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-accent">
                {new Set(MATERIAL_CATEGORIES.flatMap(cat => cat.baseElements)).size}
              </div>
              <div className="text-sm text-muted-foreground">Unique Elements</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-emerald-600">
                {MATERIAL_CATEGORIES.reduce((sum, cat) => sum + cat.applications.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Applications</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">🎯 For Beginners</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Start with <strong>Ferrous Metals</strong> for structural applications</li>
                <li>• Try <strong>Polymers</strong> for lightweight, flexible materials</li>
                <li>• Explore <strong>Composites</strong> for high-performance needs</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">⚡ Advanced Users</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Use <strong>Smart Materials</strong> for responsive applications</li>
                <li>• Try <strong>Nanomaterials</strong> for cutting-edge properties</li>
                <li>• Explore <strong>Energy Materials</strong> for battery/solar tech</li>
              </ul>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FlaskConical className="w-4 h-4" />
            <span>
              Click on any category card above to start creating custom materials with tailored compositions
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}