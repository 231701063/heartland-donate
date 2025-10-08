import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { UserTypeSelection } from "@/components/UserTypeSelection";
import { Dashboard } from "@/pages/Dashboard";
import { Button } from "@/components/ui/button";
import { Heart, Droplets } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [userType, setUserType] = useState<'donor' | 'patient' | 'hospital' | null>(null);

  const handleUserTypeSelect = (type: 'donor' | 'patient' | 'hospital') => {
    setUserType(type);
    setCurrentView('dashboard');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setUserType(null);
  };

  if (currentView === 'dashboard' && userType) {
    return (
      <>
        <Navigation />
        <Dashboard userType={userType} />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      
      {/* Main Dashboard Actions */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Get Started</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleUserTypeSelect('donor')}>
              <CardContent className="p-8 text-center">
                <Heart className="h-16 w-16 text-secondary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Donate Blood</h3>
                <p className="text-muted-foreground">Help save lives by donating blood</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleUserTypeSelect('patient')}>
              <CardContent className="p-8 text-center">
                <Droplets className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Need Blood</h3>
                <p className="text-muted-foreground">Request blood for yourself or others</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <UserTypeSelection onUserTypeSelect={handleUserTypeSelect} />
    </div>
  );
};

export default Index;
