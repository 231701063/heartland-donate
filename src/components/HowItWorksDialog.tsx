import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserCheck, Heart, Hospital, CheckCircle } from 'lucide-react';

export const HowItWorksDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-foreground hover:text-primary transition-colors">
          How It Works
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>How BloodConnect Works</DialogTitle>
          <DialogDescription>
            A simple, efficient process to connect patients, donors, and hospitals
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">1. Patient Creates Request</h3>
                <p className="text-muted-foreground">
                  Patients in need of blood create a request specifying their blood type, request type (normal or emergency), and validity period. The request is immediately visible to all registered donors.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-secondary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Donor Accepts Request</h3>
                <p className="text-muted-foreground">
                  Donors browse available requests and can accept those matching their blood type. They schedule a convenient date for donation and commit to fulfilling the request.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Hospital className="h-5 w-5 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Donation Completion</h3>
                <p className="text-muted-foreground">
                  Donors visit the hospital on the scheduled date to complete the donation. Hospital staff verify the donation and update the blood inventory accordingly.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">4. Inventory Update</h3>
                <p className="text-muted-foreground">
                  Hospital staff update the blood inventory system with newly received units. This information is available in real-time to all users, ensuring accurate availability data for future requests.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
