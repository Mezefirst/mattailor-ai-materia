// MatTailor AI - Intelligent Material Discovery Platform
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/Header';
import { Overview } from '@/components/tabs/Overview';
import { NewMaterial } from '@/components/tabs/NewMaterial';
import { AIRecommendation } from '@/components/tabs/AIRecommendation';
import { MLEnhanced } from '@/components/tabs/MLEnhanced';
import { Properties } from '@/components/tabs/Properties';
import { Sustainability } from '@/components/tabs/Sustainability';
import { useKV } from '@github/spark/hooks';

function App() {
  const [activeTab, setActiveTab] = useKV('active-tab', 'overview');
  const [materials, setMaterials] = useKV('materials', []);
  const [selectedMaterial, setSelectedMaterial] = useKV('selected-material', null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="new-material">New Material</TabsTrigger>
            <TabsTrigger value="ai-recommendation">AI Recommendation</TabsTrigger>
            <TabsTrigger value="ml-enhanced">ML Enhanced</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Overview 
              materials={materials}
              selectedMaterial={selectedMaterial}
              onSelectMaterial={setSelectedMaterial}
            />
          </TabsContent>
          
          <TabsContent value="new-material">
            <NewMaterial 
              onMaterialCreated={(material) => setMaterials(prev => [...prev, material])}
            />
          </TabsContent>
          
          <TabsContent value="ai-recommendation">
            <AIRecommendation 
              onMaterialsFound={(newMaterials) => setMaterials(newMaterials)}
            />
          </TabsContent>
          
          <TabsContent value="ml-enhanced">
            <MLEnhanced 
              materials={materials}
              onMaterialsUpdated={setMaterials}
            />
          </TabsContent>
          
          <TabsContent value="properties">
            <Properties 
              selectedMaterial={selectedMaterial}
              materials={materials}
            />
          </TabsContent>
          
          <TabsContent value="sustainability">
            <Sustainability 
              selectedMaterial={selectedMaterial}
              materials={materials}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;