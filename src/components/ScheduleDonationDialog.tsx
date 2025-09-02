import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ScheduleDonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduled?: () => void;
}

export const ScheduleDonationDialog = ({ 
  open, 
  onOpenChange, 
  onScheduled 
}: ScheduleDonationDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleScheduleDonation = async () => {
    if (!selectedDate || !user) return;

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('scheduled_donations')
        .insert({
          user_id: user.id,
          scheduled_date: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
          status: 'scheduled'
        });

      if (error) {
        console.error('Error scheduling donation:', error);
        toast({
          title: "Error",
          description: "Failed to schedule donation. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Donation Scheduled",
          description: `Your donation has been scheduled for ${format(selectedDate, "PPP")}`,
        });
        onScheduled?.();
        onOpenChange(false);
        setSelectedDate(undefined);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-secondary" />
            Schedule Blood Donation
          </DialogTitle>
          <DialogDescription>
            Select a date for your upcoming blood donation. You can only schedule dates in the future.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={isDateDisabled}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleScheduleDonation}
              disabled={!selectedDate || isSubmitting}
              className="bg-secondary hover:bg-secondary/90"
            >
              {isSubmitting ? "Scheduling..." : "Schedule Donation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};