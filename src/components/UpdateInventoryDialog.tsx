import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hospital } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useHospitalInventory } from '@/hooks/useHospitalInventory';
import { toast } from '@/hooks/use-toast';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const UpdateInventoryDialog = () => {
  const { user } = useAuth();
  const { addInventory } = useHospitalInventory();
  const [open, setOpen] = useState(false);
  const [units, setUnits] = useState<Record<string, number>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    let successCount = 0;
    for (const bloodType of bloodTypes) {
      const change = units[bloodType];
      if (change !== undefined && change !== 0) {
        const success = await addInventory(bloodType, change, user.id);
        if (success) successCount++;
      }
    }

    if (successCount > 0) {
      toast({
        title: "Success",
        description: `Updated ${successCount} blood type(s) in inventory`,
      });
      setOpen(false);
      setUnits({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="bg-white text-success hover:bg-white/90">
          <Hospital className="mr-2 h-4 w-4" />
          Update Inventory
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Blood Inventory</DialogTitle>
          <DialogDescription>
            Enter positive numbers to add units or negative numbers to decrease units for each blood type
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {bloodTypes.map((bloodType) => (
              <div key={bloodType} className="space-y-2">
                <Label htmlFor={bloodType}>{bloodType}</Label>
                <Input
                  id={bloodType}
                  type="number"
                  placeholder="e.g., +10 or -5"
                  value={units[bloodType] ?? ''}
                  onChange={(e) => setUnits({ ...units, [bloodType]: parseInt(e.target.value) || 0 })}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="hero">
              Update Inventory
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
