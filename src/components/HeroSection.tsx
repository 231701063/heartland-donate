import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Hospital, AlertCircle } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-gradient-subtle overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-8">
            <Heart className="h-4 w-4" />
            <span className="text-sm font-medium">Saving Lives Together</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            BloodConnect
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            Connecting donors, patients, and hospitals
          </p>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Every drop counts. Join our community platform that bridges the gap between blood donors and those in need, making life-saving connections possible.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="lg" className="shadow-medium">
              <Heart className="mr-2 h-5 w-5" />
              Donate Blood
            </Button>
            <Button variant="emergency" size="lg" className="shadow-emergency">
              <AlertCircle className="mr-2 h-5 w-5" />
              Need Blood
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 shadow-soft">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">10,000+</h3>
              <p className="text-muted-foreground">Active Donors</p>
            </Card>
            
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-secondary/20 shadow-soft">
              <div className="flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">25,000+</h3>
              <p className="text-muted-foreground">Lives Saved</p>
            </Card>
            
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-success/20 shadow-soft">
              <div className="flex items-center justify-center mb-4">
                <Hospital className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-2xl font-bold mb-2">500+</h3>
              <p className="text-muted-foreground">Partner Hospitals</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};