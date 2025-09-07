// Settings Tab Component
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APIConfig } from '@/components/settings/APIConfig';
import { Settings as SettingsIcon, Key, Database, Info } from '@phosphor-icons/react';

export function Settings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Settings
          </CardTitle>
          <CardDescription>
            Configure MatTailor AI settings and external integrations
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="api-config" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="api-config" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            API Configuration
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-config" className="mt-6">
          <APIConfig />
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>MatTailor AI</CardTitle>
                <CardDescription>
                  Intelligent Material Discovery Platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <p>
                    MatTailor AI empowers engineers, designers, and manufacturers to discover, 
                    simulate, tailor, and source optimal materials for specific applications.
                  </p>
                  <p>
                    Our platform combines artificial intelligence with comprehensive material 
                    databases to provide intelligent recommendations that balance performance, 
                    cost, and sustainability.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Key Features</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    <li>AI-powered material recommendations</li>
                    <li>Custom material property simulation</li>
                    <li>Integration with MatWeb and Materials Project databases</li>
                    <li>Sustainability and cost analysis</li>
                    <li>Supplier information and sourcing</li>
                    <li>Multi-criteria decision support</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Supported Data Sources</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="w-4 h-4" />
                        <span className="font-medium text-sm">MatWeb</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        150,000+ commercial material records with comprehensive properties
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="w-4 h-4" />
                        <span className="font-medium text-sm">Materials Project</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Computational materials database with DFT-calculated properties
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t text-xs text-muted-foreground">
                  <p>
                    Version 1.0.0 • Built with modern web technologies for optimal performance
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}