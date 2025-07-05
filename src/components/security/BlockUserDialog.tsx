import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Ban, Loader2 } from 'lucide-react';

interface BlockUserDialogProps {
  userId: string;
  userName: string;
  trigger?: React.ReactNode;
}

export default function BlockUserDialog({ userId, userName, trigger }: BlockUserDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);

  const handleBlock = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to block users',
        variant: 'destructive'
      });
      return;
    }

    if (user.id === userId) {
      toast({
        title: 'Cannot block yourself',
        description: 'You cannot block your own account',
        variant: 'destructive'
      });
      return;
    }

    setIsBlocking(true);

    try {
      const { error } = await supabase
        .from('user_blocks')
        .insert({
          blocker_id: user.id,
          blocked_id: userId
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'User already blocked',
            description: 'This user is already in your blocked list',
            variant: 'destructive'
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'User blocked',
          description: `${userName} has been blocked and won't be able to contact you`
        });
      }

      setOpen(false);
    } catch (error) {
      console.error('Error blocking user:', error);
      toast({
        title: 'Error',
        description: 'Failed to block user. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsBlocking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Ban className="h-4 w-4 mr-2" />
            Block User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Block User
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to block <strong>{userName}</strong>?
          </p>
          <p className="text-sm text-muted-foreground">
            Blocked users won't be able to:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
            <li>Send you messages</li>
            <li>Contact you about your listings</li>
            <li>See your profile information</li>
          </ul>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isBlocking}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleBlock}
            disabled={isBlocking}
          >
            {isBlocking ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Blocking...
              </>
            ) : (
              <>
                <Ban className="h-4 w-4 mr-2" />
                Block User
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}