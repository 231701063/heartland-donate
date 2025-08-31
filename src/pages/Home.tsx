import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, MapPin } from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <nav className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">BloodConnect</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to BloodConnect
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting life-savers with those in need. Join our community of blood donors and 
            help save lives in your area. Every donation counts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Heart className="w-12 h-12 text-secondary mx-auto mb-4" />
              <CardTitle>Save Lives</CardTitle>
              <CardDescription>
                Your blood donation can save up to three lives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Join thousands of donors who have already made a difference in their communities.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Find Donors</CardTitle>
              <CardDescription>
                Connect with compatible blood donors nearby
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Patients and hospitals can easily find and request blood from available donors.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MapPin className="w-12 h-12 text-success mx-auto mb-4" />
              <CardTitle>Local Network</CardTitle>
              <CardDescription>
                Build a strong local blood donation network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create connections within your community for faster emergency response.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Ready to Make a Difference?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Join as Donor
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Login to Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};