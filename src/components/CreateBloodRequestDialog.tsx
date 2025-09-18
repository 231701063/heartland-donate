import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertCircle, Heart, CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CreateBloodRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestType: 'emergency' | 'normal';
  onRequestCreated: () => void;
}

export const CreateBloodRequestDialog = ({ 
  open, 
  onOpenChange, 
  requestType,
  onRequestCreated 
}: CreateBloodRequestDialogProps) => {
  const [bloodType, setBloodType] = useState("");
  const [notes, setNotes] = useState("");
  const [upToDate, setUpToDate] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !bloodType) {
      toast({
        title: "Error",
        description: "Please select a blood type",
        variant: "destructive",
      });
      return;
    }

    if (!upToDate) {
      toast({
        title: "Error",
        description: "Please select a valid until date",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('blood_requests')
        .insert({
          patient_id: user.id,
          blood_type: bloodType,
          request_type: requestType,
          notes: notes.trim() || null,
          up_to_date: upToDate?.toISOString().split('T')[0]
        });

      if (error) {
        console.error('Error creating blood request:', error);
        toast({
          title: "Error",
          description: "Failed to create blood request. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Request Created",
          description: `Your ${requestType} blood request has been created successfully.`,
        });
        
        // Reset form
        setBloodType("");
        setNotes("");
        setUpToDate(undefined);
        onOpenChange(false);
        onRequestCreated();
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isEmergency = requestType === 'emergency';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEmergency ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : (
              <Heart className="h-5 w-5 text-primary" />
            )}
            Create {isEmergency ? 'Emergency' : ''} Blood Request
          </DialogTitle>
          <DialogDescription>
            {isEmergency 
              ? "Create an urgent blood request. This will be prioritized and shown to all available donors immediately."
              : "Create a blood request. Donors in your area will be notified and can schedule donations."
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bloodType">Blood Type *</Label>
            <Select value={bloodType} onValueChange={setBloodType}>
              <SelectTrigger>
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                {bloodTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="upToDate">Valid Until Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !upToDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {upToDate ? format(upToDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={upToDate}
                  onSelect={setUpToDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information about your request..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
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
              type="submit"
              disabled={loading || !bloodType || !upToDate}
              className={isEmergency ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {loading ? "Creating..." : `Create ${isEmergency ? 'Emergency' : ''} Request`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};