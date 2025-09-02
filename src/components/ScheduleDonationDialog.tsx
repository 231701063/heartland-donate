import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Calendar as CalendarLucide } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ScheduleDonationDialogProps {
  children: React.ReactNode;
  onScheduled?: () => void;
}

export const ScheduleDonationDialog = ({ children, onScheduled }: ScheduleDonationDialogProps) => {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSchedule = async () => {
    if (!date || !user) {
      toast({
        title: "Error",
        description: "Please select a date and ensure you're logged in",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('scheduled_donations')
        .insert([
          {
            user_id: user.id,
            scheduled_date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
            status: 'scheduled'
          }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Donation scheduled for ${format(date, "PPP")}`,
      });

      setOpen(false);
      setDate(undefined);
      onScheduled?.();
    } catch (error) {
      console.error('Error scheduling donation:', error);
      toast({
        title: "Error",
        description: "Failed to schedule donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Disable past dates
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarLucide className="h-5 w-5" />
            Schedule Donation
          </DialogTitle>
          <DialogDescription>
            Choose a convenient date for your blood donation. You can donate every 56 days.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Date</label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    setDatePickerOpen(false);
                  }}
                  disabled={isPastDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedule} disabled={!date || loading}>
              {loading ? "Scheduling..." : "Schedule Donation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};