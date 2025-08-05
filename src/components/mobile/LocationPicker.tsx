
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { useCapacitorFeatures } from '@/hooks/useCapacitorFeatures';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface LocationPickerProps {
  onLocationSelect: (location: { address: string; lat?: number; lng?: number }) => void;
  currentLocation?: string;
}

export const LocationPicker = ({ onLocationSelect, currentLocation }: LocationPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [manualLocation, setManualLocation] = useState(currentLocation || '');
  const { getCurrentLocation } = useCapacitorFeatures();
  const { toast } = useToast();

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    
    try {
      const coords = await getCurrentLocation();
      
      if (coords) {
        // In a real app, you'd use a geocoding service to convert coords to address
        // For now, we'll just use the coordinates
        const location = {
          address: `Location: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
          lat: coords.lat,
          lng: coords.lng
        };
        
        onLocationSelect(location);
        setManualLocation(location.address);
        toast({
          title: 'Location Found',
          description: 'Your current location has been detected.'
        });
      }
    } catch (error) {
      toast({
        title: 'Location Error',
        description: 'Failed to get your current location. Please enter manually.',
        variant: 'destructive'
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleManualSubmit = () => {
    if (manualLocation.trim()) {
      onLocationSelect({
        address: manualLocation.trim()
      });
      setIsOpen(false);
      toast({
        title: 'Location Set',
        description: 'Location has been updated.'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 justify-start">
          <MapPin className="h-4 w-4" />
          {currentLocation || 'Set Location'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Location</DialogTitle>
          <DialogDescription>
            Choose your location for this listing
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={handleGetCurrentLocation}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                {isGettingLocation ? (
                  <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                ) : (
                  <Navigation className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Use Current Location</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically detect your current location
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Enter Manually</h3>
                <p className="text-sm text-muted-foreground">
                  Type your location address
                </p>
              </div>
            </div>
            
            <Input
              placeholder="Enter city, state or address"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleManualSubmit}
              disabled={!manualLocation.trim()}
            >
              Set Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
