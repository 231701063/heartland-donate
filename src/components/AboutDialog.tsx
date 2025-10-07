import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, Target, Users } from 'lucide-react';

export const AboutDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-foreground hover:text-primary transition-colors">
          About
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>About BloodConnect</DialogTitle>
          <DialogDescription>
            Saving lives through efficient blood donation coordination
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Our Mission</h3>
              </div>
              <p className="text-muted-foreground">
                BloodConnect is dedicated to bridging the gap between blood donors and those in need. We believe that every person deserves timely access to life-saving blood, and every willing donor should have a simple, efficient way to contribute.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-secondary" />
                <h3 className="font-semibold text-lg">What We Do</h3>
              </div>
              <p className="text-muted-foreground mb-3">
                Our platform connects three key stakeholders in the blood donation ecosystem:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-4">
                <li>• <strong>Patients:</strong> Create urgent or normal blood requests visible to all donors</li>
                <li>• <strong>Donors:</strong> View requests, accept matches, and schedule donations conveniently</li>
                <li>• <strong>Hospitals:</strong> Manage inventory, track donations, and ensure smooth operations</li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-lg">Our Impact</h3>
              </div>
              <p className="text-muted-foreground">
                Through technology and community collaboration, BloodConnect streamlines the blood donation process, reduces response time for emergency requests, and maintains transparency in blood availability. Together, we're building a healthier, more connected community where no one has to face a blood shortage alone.
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground italic">
                "Every donation matters. Every connection saves lives. Together, we make a difference."
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
