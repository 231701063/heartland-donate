import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BloodRequest } from "@/hooks/useBloodRequests";

interface AcceptRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: BloodRequest | null;
  onAccept: (requestId: string, scheduledDate: string) => Promise<boolean>;
}

export const AcceptRequestDialog = ({ 
  open, 
  onOpenChange, 
  request,
  onAccept 
}: AcceptRequestDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (!request || !selectedDate) return;

    setLoading(true);
    const success = await onAccept(request.id, selectedDate.toISOString().split('T')[0]);
    
    if (success) {
      setSelectedDate(undefined);
      onOpenChange(false);
    }
    
    setLoading(false);
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Accept Blood Request</DialogTitle>
          <DialogDescription>
            You are accepting a {request.request_type} request for {request.blood_type} blood.
            Please select a date for your donation appointment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Request Details</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Blood Type:</strong> {request.blood_type}</p>
              <p><strong>Type:</strong> {request.request_type === 'emergency' ? 'Emergency' : 'Normal'}</p>
              <p><strong>Created:</strong> {format(new Date(request.created_at), "PPP")}</p>
              {request.notes && (
                <p><strong>Notes:</strong> {request.notes}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Donation Date</label>
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
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAccept}
              disabled={loading || !selectedDate}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? "Accepting..." : "Accept Request"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};