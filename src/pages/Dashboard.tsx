// Dashboard imports
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Calendar, AlertCircle, Hospital, MapPin, Clock } from "lucide-react";
import { useState, useEffect } from "react";

// Dialog components
import { ScheduleDonationDialog } from "@/components/ScheduleDonationDialog";
import { CreateBloodRequestDialog } from "@/components/CreateBloodRequestDialog";
import { AcceptRequestDialog } from "@/components/AcceptRequestDialog";
import { UpdateInventoryDialog } from "@/components/UpdateInventoryDialog";

// Hooks and utilities
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useBloodRequests, BloodRequest } from "@/hooks/useBloodRequests";
import { useHospitalInventory } from "@/hooks/useHospitalInventory";
import { format } from "date-fns";

interface DashboardProps {
  userType: 'donor' | 'patient' | 'hospital';
}

interface ScheduledDonation {
  id: string;
  scheduled_date: string;
  status: string;
}

export const Dashboard = ({ userType }: DashboardProps) => {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showEmergencyRequestDialog, setShowEmergencyRequestDialog] = useState(false);
  const [showNormalRequestDialog, setShowNormalRequestDialog] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [scheduledDonations, setScheduledDonations] = useState<ScheduledDonation[]>([]);
  const { user } = useAuth();
  const bloodRequestsHook = useBloodRequests();
  const hospitalInventoryHook = useHospitalInventory(user?.id);

  const fetchScheduledDonations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('scheduled_donations')
        .select('id, scheduled_date, status')
        .eq('user_id', user.id)
        .eq('status', 'scheduled')
        .order('scheduled_date', { ascending: true });

      if (error) {
        console.error('Error fetching scheduled donations:', error);
      } else {
        setScheduledDonations(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (userType === 'donor' && user) {
      fetchScheduledDonations();
      bloodRequestsHook.fetchDonorRequests();
    } else if (userType === 'patient' && user) {
      bloodRequestsHook.fetchPatientRequests();
    } else if (userType === 'hospital' && user) {
      bloodRequestsHook.fetchAllRequests();
      hospitalInventoryHook.fetchInventory();
    }
  }, [userType, user]);

  const handleAcceptRequest = (request: BloodRequest) => {
    setSelectedRequest(request);
    setShowAcceptDialog(true);
  };

  const handleRequestCreated = () => {
    if (userType === 'patient') {
      bloodRequestsHook.fetchPatientRequests();
    }
  };
  
  const renderDonorDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-hero text-white p-8 rounded-lg shadow-medium">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Sarah!</h1>
        <p className="text-white/90 mb-4">Your next donation eligibility: March 15, 2024</p>
        <Button 
          variant="secondary" 
          className="bg-white text-primary hover:bg-white/90"
          onClick={() => setShowScheduleDialog(true)}
        >
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

      {/* Scheduled Donations */}
      {scheduledDonations.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Your Scheduled Donations</h3>
          <div className="space-y-4">
            {scheduledDonations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <div className="flex items-center gap-4">
                  <Calendar className="h-5 w-5 text-secondary" />
                  <div>
                    <p className="font-medium">Scheduled Donation</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(donation.scheduled_date), "PPP")}
                    </p>
                  </div>
                </div>
                <Badge className="bg-secondary text-secondary-foreground">
                  {donation.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Requests */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Blood Requests</h3>
        <div className="space-y-4">
          {bloodRequestsHook.loading ? (
            <p className="text-muted-foreground">Loading requests...</p>
          ) : bloodRequestsHook.requests.filter(r => r.status === 'pending').length === 0 ? (
            <p className="text-muted-foreground">No pending requests at the moment.</p>
          ) : (
            bloodRequestsHook.requests
              .filter(r => r.status === 'pending')
              .map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge variant={request.request_type === 'emergency' ? 'destructive' : 'secondary'}>
                      {request.blood_type}
                    </Badge>
                    <div>
                      <p className="font-medium">
                        {request.request_type === 'emergency' ? 'Emergency' : 'Normal'} Request
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Created {format(new Date(request.created_at), "PPP")}
                      </p>
                      {request.up_to_date && (
                        <p className="text-sm text-muted-foreground">
                          Valid until {format(new Date(request.up_to_date), "PPP")}
                        </p>
                      )}
                      {request.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{request.notes}</p>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="hero" 
                    size="sm"
                    onClick={() => handleAcceptRequest(request)}
                  >
                    Accept
                  </Button>
                </div>
              ))
          )}
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
        <div className="flex gap-4">
          <Button 
            variant="secondary" 
            className="bg-white text-secondary hover:bg-white/90"
            onClick={() => setShowEmergencyRequestDialog(true)}
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            Create Emergency Request
          </Button>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-white/10"
            onClick={() => setShowNormalRequestDialog(true)}
          >
            <Heart className="mr-2 h-4 w-4" />
            Create Request
          </Button>
        </div>
      </div>

      {/* Active Requests */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Your Blood Requests</h3>
        <div className="space-y-4">
          {bloodRequestsHook.loading ? (
            <p className="text-muted-foreground">Loading your requests...</p>
          ) : bloodRequestsHook.requests.length === 0 ? (
            <p className="text-muted-foreground">No requests created yet.</p>
          ) : (
            bloodRequestsHook.requests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant={request.request_type === 'emergency' ? 'destructive' : 'secondary'}>
                    {request.blood_type}
                  </Badge>
                  <div>
                    <p className="font-medium">
                      {request.request_type === 'emergency' ? 'Emergency' : 'Normal'} Request
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created {format(new Date(request.created_at), "PPP")}
                    </p>
                    {request.up_to_date && (
                      <p className="text-sm text-muted-foreground">
                        Valid until {format(new Date(request.up_to_date), "PPP")}
                      </p>
                    )}
                    {request.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{request.notes}</p>
                    )}
                  </div>
                  <Badge className={`${
                    request.status === 'pending' ? 'bg-warning text-warning-foreground' :
                    request.status === 'accepted' ? 'bg-success text-success-foreground' :
                    request.status === 'completed' ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {request.status}
                  </Badge>
                </div>
                <div className="text-right">
                  {request.status === 'accepted' && request.scheduled_date && (
                    <>
                      <p className="font-bold text-primary">Donation Scheduled</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(request.scheduled_date), "PPP")}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
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
        <UpdateInventoryDialog />
      </div>

      {/* Blood Inventory */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Current Blood Inventory</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {hospitalInventoryHook.loading ? (
            <p className="col-span-4 text-muted-foreground">Loading inventory...</p>
          ) : (
            hospitalInventoryHook.inventory.map((item) => (
              <div key={item.blood_type} className="p-4 border border-border rounded-lg text-center">
                <Badge variant="outline" className="mb-2">{item.blood_type}</Badge>
                <p className="text-2xl font-bold mb-1">{item.units_available} units</p>
                <p className="text-sm text-muted-foreground">
                  {item.units_available < 20 ? 'Low Stock' : 'Good Stock'}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Recent Requests */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">All Blood Requests</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {bloodRequestsHook.loading ? (
              <p className="text-muted-foreground">Loading requests...</p>
            ) : bloodRequestsHook.requests.length === 0 ? (
              <p className="text-muted-foreground">No requests found.</p>
            ) : (
              bloodRequestsHook.requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">
                      {request.request_type === 'emergency' ? 'Emergency' : 'Normal'} Request
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Blood Type: {request.blood_type} | Status: {request.status}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created: {format(new Date(request.created_at), "PPP")}
                    </p>
                    {request.up_to_date && (
                      <p className="text-sm text-muted-foreground">
                        Valid until: {format(new Date(request.up_to_date), "PPP")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${
                      request.status === 'pending' ? 'bg-warning text-warning-foreground' :
                      request.status === 'accepted' ? 'bg-success text-success-foreground' :
                      request.status === 'completed' ? 'bg-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {request.status}
                    </Badge>
                    {request.status === 'accepted' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => bloodRequestsHook.completeRequest(request.id)}
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Completed Donations</h3>
          <div className="space-y-4">
            {bloodRequestsHook.requests
              .filter(r => r.status === 'completed')
              .slice(0, 5)
              .map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Donation Completed</p>
                    <p className="text-sm text-muted-foreground">
                      Blood Type: {request.blood_type}
                    </p>
                    {request.scheduled_date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Date: {format(new Date(request.scheduled_date), 'dd-MMM-yyyy, hh:mm a')}
                      </p>
                    )}
                    {request.created_at && (
                      <p className="text-xs text-muted-foreground">
                        Created: {format(new Date(request.created_at), 'dd-MMM-yyyy')}
                      </p>
                    )}
                    {request.up_to_date && (
                      <p className="text-xs text-muted-foreground">
                        Valid Until: {format(new Date(request.up_to_date), 'dd-MMM-yyyy')}
                      </p>
                    )}
                  </div>
                  <Badge className="bg-primary text-primary-foreground">Completed</Badge>
                </div>
              ))}
            {bloodRequestsHook.requests.filter(r => r.status === 'completed').length === 0 && (
              <p className="text-muted-foreground">No completed donations yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20 pb-16">
      <div className="container mx-auto px-4">
        {userType === 'donor' && renderDonorDashboard()}
        {userType === 'patient' && renderPatientDashboard()}
        {userType === 'hospital' && renderHospitalDashboard()}
      </div>
      
      {/* Dialogs */}
      <ScheduleDonationDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        onScheduled={fetchScheduledDonations}
      />
      
      <CreateBloodRequestDialog
        open={showEmergencyRequestDialog}
        onOpenChange={setShowEmergencyRequestDialog}
        requestType="emergency"
        onRequestCreated={handleRequestCreated}
      />
      
      <CreateBloodRequestDialog
        open={showNormalRequestDialog}
        onOpenChange={setShowNormalRequestDialog}
        requestType="normal"
        onRequestCreated={handleRequestCreated}
      />
      
      <AcceptRequestDialog
        open={showAcceptDialog}
        onOpenChange={setShowAcceptDialog}
        request={selectedRequest}
        onAccept={bloodRequestsHook.acceptRequest}
      />
    </div>
  );
};