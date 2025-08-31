import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { UserTypeSelection } from "@/components/UserTypeSelection";

const Index = () => {
  const handleUserTypeSelect = (type: 'donor' | 'patient' | 'hospital') => {
    // This can be extended later for role-based routing
    console.log(`Selected user type: ${type}`);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <UserTypeSelection onUserTypeSelect={handleUserTypeSelect} />
    </div>
  );
};

export default Index;
