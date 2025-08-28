import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, User, Hospital, ArrowRight } from "lucide-react";

interface UserTypeSelectionProps {
  onUserTypeSelect: (type: 'donor' | 'patient' | 'hospital') => void;
}

export const UserTypeSelection = ({ onUserTypeSelect }: UserTypeSelectionProps) => {
  const userTypes = [
    {
      type: 'donor' as const,
      title: 'Blood Donor',
      description: 'Help save lives by donating blood. Track your donations and get matched with those in need.',
      icon: Heart,
      features: ['Track donation history', 'Get matched with recipients', 'Earn reward points', 'Health reminders'],
      gradient: 'bg-gradient-hero',
      shadowClass: 'shadow-medium'
    },
    {
      type: 'patient' as const,
      title: 'Patient',
      description: 'Find blood donors quickly when you need them most. Connect with verified donors in your area.',
      icon: User,
      features: ['Emergency blood requests', 'Find nearby donors', 'Hospital connections', 'Real-time updates'],
      gradient: 'bg-gradient-emergency',
      shadowClass: 'shadow-emergency'
    },
    {
      type: 'hospital' as const,
      title: 'Hospital',
      description: 'Manage blood inventory, connect with donors, and coordinate with patients efficiently.',
      icon: Hospital,
      features: ['Blood inventory management', 'Donor coordination', 'Patient verification', 'Analytics dashboard'],
      gradient: 'bg-gradient-success',
      shadowClass: 'shadow-soft'
    }
  ];

  return (
    <div className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Choose Your Role</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select how you'd like to participate in our life-saving community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {userTypes.map((userType) => {
            const IconComponent = userType.icon;
            return (
              <Card key={userType.type} className={`p-8 relative overflow-hidden group hover:scale-105 transition-all duration-300 ${userType.shadowClass} border-border/50`}>
                {/* Background gradient */}
                <div className={`absolute inset-0 ${userType.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-6">
                    <div className={`p-4 rounded-full ${userType.gradient}`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-center mb-4">{userType.title}</h3>
                  <p className="text-muted-foreground text-center mb-6">{userType.description}</p>

                  <ul className="space-y-3 mb-8">
                    {userType.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => onUserTypeSelect(userType.type)}
                    className="w-full group-hover:shadow-lg transition-all"
                    variant="outline"
                  >
                    Get Started as {userType.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};