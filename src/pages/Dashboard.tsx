import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Calendar, AlertCircle, Hospital, MapPin, Clock, ArrowLeft } from "lucide-react";

interface DashboardProps {
  userType: 'donor' | 'patient' | 'hospital';
  onBack: () => void;
}

export const Dashboard = ({ userType, onBack }: DashboardProps) => {
  const renderDonorDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-hero text-white p-8 rounded-lg shadow-medium">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Sarah!</h1>
        <p className="text-white/90 mb-4">Your next donation eligibility: March 15, 2024</p>
        <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Donation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Heart className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Total Donations</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">36</p>
              <p className="text-sm text-muted-foreground">Lives Impacted</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <MapPin className="h-8 w-8 text-success" />
            <div>
              <p className="text-2xl font-bold">2.5km</p>
              <p className="text-sm text-muted-foreground">Nearest Center</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <AlertCircle className="h-8 w-8 text-warning" />
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Urgent Requests</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Blood Requests</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((req) => (
            <div key={req} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <Badge variant="destructive">O+</Badge>
                <div>
                  <p className="font-medium">Emergency Request</p>
                  <p className="text-sm text-muted-foreground">City Hospital - 2.1 km away</p>
                </div>
              </div>
              <Button variant="hero" size="sm">Respond</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderPatientDashboard = () => (
    <div className="space-y-8">
      {/* Emergency Section */}
      <div className="bg-gradient-emergency text-white p-8 rounded-lg shadow-emergency">
        <h1 className="text-3xl font-bold mb-2">Patient Portal</h1>
        <p className="text-white/90 mb-4">Need blood urgently? We're here to help connect you with donors.</p>
        <Button variant="secondary" className="bg-white text-secondary hover:bg-white/90">
          <AlertCircle className="mr-2 h-4 w-4" />
          Create Emergency Request
        </Button>
      </div>

      {/* Active Requests */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Your Active Requests</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
            <div className="flex items-center gap-4">
              <Badge variant="destructive">B+</Badge>
              <div>
                <p className="font-medium">Urgent Request</p>
                <p className="text-sm text-muted-foreground">Created 2 hours ago</p>
              </div>
              <Badge className="bg-warning text-warning-foreground">Active</Badge>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">5 Donors Found</p>
              <p className="text-sm text-muted-foreground">In your area</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Available Donors */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Available Donors (B+)</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((donor) => (
            <div key={donor} className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Donor #{donor}</p>
                    <p className="text-sm text-muted-foreground">Verified</p>
                  </div>
                </div>
                <Badge className="bg-success text-success-foreground">Available</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  1.2 km away
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last donated: 2 months ago
                </span>
              </div>
              <Button variant="outline" size="sm" className="w-full">Contact Donor</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderHospitalDashboard = () => (
    <div className="space-y-8">
      {/* Hospital Overview */}
      <div className="bg-gradient-success text-white p-8 rounded-lg shadow-medium">
        <h1 className="text-3xl font-bold mb-2">City General Hospital</h1>
        <p className="text-white/90 mb-4">Managing blood inventory and coordinating donations</p>
        <Button variant="secondary" className="bg-white text-success hover:bg-white/90">
          <Hospital className="mr-2 h-4 w-4" />
          Update Inventory
        </Button>
      </div>

      {/* Blood Inventory */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Current Blood Inventory</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((type) => (
            <div key={type} className="p-4 border border-border rounded-lg text-center">
              <Badge variant="outline" className="mb-2">{type}</Badge>
              <p className="text-2xl font-bold mb-1">
                {Math.floor(Math.random() * 50) + 10} units
              </p>
              <p className="text-sm text-muted-foreground">
                {Math.random() > 0.7 ? 'Low Stock' : 'Good Stock'}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Requests */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Pending Requests</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((req) => (
              <div key={req} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Patient #{req}</p>
                  <p className="text-sm text-muted-foreground">Needs: O+ blood</p>
                </div>
                <Button variant="outline" size="sm">Process</Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Available Donors</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((donor) => (
              <div key={donor} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Donor #{donor}</p>
                  <p className="text-sm text-muted-foreground">Type: O+, Available</p>
                </div>
                <Button variant="outline" size="sm">Contact</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20 pb-16">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        {userType === 'donor' && renderDonorDashboard()}
        {userType === 'patient' && renderPatientDashboard()}
        {userType === 'hospital' && renderHospitalDashboard()}
      </div>
    </div>
  );
};