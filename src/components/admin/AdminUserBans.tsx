import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Ban, UserX, Shield, Plus, Loader2 } from 'lucide-react';

interface UserBan {
  id: string;
  user_id: string;
  banned_by: string;
  reason: string | null;
  banned_at: string;
  expires_at: string | null;
  is_permanent: boolean;
  profiles?: { full_name: string | null; email: string | null } | null;
}

interface User {
  id: string;
  full_name: string | null;
  email: string | null;
}

export default function AdminUserBans() {
  const [bans, setBans] = useState<UserBan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [banReason, setBanReason] = useState('');
  const [isPermanent, setIsPermanent] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchBans = async () => {
    try {
      const { data, error } = await supabase
        .from('user_bans')
        .select(`
          *,
          profiles(full_name, email)
        `)
        .order('banned_at', { ascending: false });

      if (error) throw error;
      setBans((data as any) || []);
    } catch (error) {
      console.error('Error fetching bans:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user bans',
        variant: 'destructive'
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const banUser = async () => {
    if (!selectedUser || !banReason.trim()) {
      toast({
        title: 'Validation error',
        description: 'Please select a user and provide a reason',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const banData: any = {
        user_id: selectedUser,
        reason: banReason.trim(),
        is_permanent: isPermanent
      };

      if (!isPermanent && expiresAt) {
        banData.expires_at = new Date(expiresAt).toISOString();
      }

      const { error } = await supabase
        .from('user_bans')
        .insert(banData);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'User already banned',
            description: 'This user is already banned',
            variant: 'destructive'
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'User banned',
          description: 'User has been banned successfully'
        });

        setShowBanDialog(false);
        setSelectedUser('');
        setBanReason('');
        setIsPermanent(false);
        setExpiresAt('');
        fetchBans();
      }
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        title: 'Error',
        description: 'Failed to ban user. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const unbanUser = async (banId: string) => {
    try {
      const { error } = await supabase
        .from('user_bans')
        .delete()
        .eq('id', banId);

      if (error) throw error;

      toast({
        title: 'User unbanned',
        description: 'User ban has been removed'
      });

      fetchBans();
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast({
        title: 'Error',
        description: 'Failed to unban user',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBans(), fetchUsers()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredBans = bans.filter(ban => {
    const matchesSearch = 
      ban.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ban.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ban.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return searchTerm === '' || matchesSearch;
  });

  const availableUsers = users.filter(user => 
    !bans.some(ban => ban.user_id === user.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserX className="h-5 w-5" />
          User Bans Management
        </CardTitle>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search banned users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ban User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Ban className="h-5 w-5" />
                  Ban User
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user">Select User</Label>
                  <select
                    id="user"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Choose a user...</option>
                    {availableUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.full_name || user.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Provide a reason for the ban..."
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="permanent"
                    checked={isPermanent}
                    onCheckedChange={(checked) => setIsPermanent(checked as boolean)}
                  />
                  <Label htmlFor="permanent">Permanent ban</Label>
                </div>

                {!isPermanent && (
                  <div className="space-y-2">
                    <Label htmlFor="expires">Expires at</Label>
                    <Input
                      id="expires"
                      type="datetime-local"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowBanDialog(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={banUser}
                    disabled={isSubmitting || !selectedUser || !banReason.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Banning...
                      </>
                    ) : (
                      <>
                        <Ban className="h-4 w-4 mr-2" />
                        Ban User
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Banned At</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBans.map((ban) => (
                <TableRow key={ban.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {ban.profiles?.full_name || 'Unknown User'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {ban.profiles?.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={ban.reason || undefined}>
                      {ban.reason || 'No reason provided'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ban.is_permanent ? 'destructive' : 'secondary'}>
                      {ban.is_permanent ? 'Permanent' : 'Temporary'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(ban.banned_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {ban.is_permanent ? 
                      'Never' : 
                      ban.expires_at ? 
                        new Date(ban.expires_at).toLocaleDateString() : 
                        'Not set'
                    }
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => unbanUser(ban.id)}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Unban
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}