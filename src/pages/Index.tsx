import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { UserTypeSelection } from "@/components/UserTypeSelection";
import { Dashboard } from "@/pages/Dashboard";

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
        <Dashboard userType={userType} onBack={handleBackToLanding} />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <UserTypeSelection onUserTypeSelect={handleUserTypeSelect} />
    </div>
  );
};

export default Index;
