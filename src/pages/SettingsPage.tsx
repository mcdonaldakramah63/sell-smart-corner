import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Shield, HelpCircle, LogOut } from 'lucide-react';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSignOut = async () => {
    try {
      await logout();
      toast({
        title: 'Signed out successfully',
        description: 'You have been signed out of your account'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'No user found to delete',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsDeleting(true);

      // Delete user's data from our tables first
      console.log('Deleting user data for:', user.id);

      // Delete user's products first
      const { error: productsError } = await supabase
        .from('products')
        .delete()
        .eq('user_id', user.id);

      if (productsError) {
        console.error('Error deleting products:', productsError);
      }

      // Delete user's messages
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('sender_id', user.id);

      if (messagesError) {
        console.error('Error deleting messages:', messagesError);
      }

      // Delete user's notifications
      const { error: notificationsError } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (notificationsError) {
        console.error('Error deleting notifications:', notificationsError);
      }

      // Delete user's profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
      }

      // Sign out the user first
      await supabase.auth.signOut();

      toast({
        title: 'Account deleted',
        description: 'Your account has been permanently deleted',
      });

      // Redirect to home page
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);

    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete account. Please try again or contact support.',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Settings
              </h1>
            </div>
            <p className="text-slate-600">Manage your account preferences and settings</p>
          </div>
          
          <div className="grid gap-6 max-w-4xl">
            {/* Account Settings */}
            <Card className="shadow-lg border-slate-200 bg-white">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-slate-800">Account Settings</CardTitle>
                </div>
                <CardDescription>
                  Manage your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">Profile Information</p>
                    <p className="text-sm text-slate-600">
                      Update your personal details and profile picture
                    </p>
                  </div>
                  <Button asChild variant="outline" className="hover:bg-blue-50 border-blue-200">
                    <Link to="/profile">Edit Profile</Link>
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">Email</p>
                    <p className="text-sm text-slate-600">
                      {user?.email || 'No email set'}
                    </p>
                  </div>
                  <Button variant="outline" disabled className="opacity-50">
                    Change Email
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">Password</p>
                    <p className="text-sm text-slate-600">
                      Last updated: Never
                    </p>
                  </div>
                  <Button variant="outline" disabled className="opacity-50">
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <NotificationSettings
              emailNotifications={emailNotifications}
              pushNotifications={pushNotifications}
              onEmailNotificationsChange={setEmailNotifications}
              onPushNotificationsChange={setPushNotifications}
            />

            {/* Privacy & Security */}
            <Card className="shadow-lg border-slate-200 bg-white">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-slate-800">Privacy & Security</CardTitle>
                </div>
                <CardDescription>
                  Manage your privacy settings and account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">Download Data</p>
                    <p className="text-sm text-slate-600">
                      Download a copy of your personal data
                    </p>
                  </div>
                  <Button variant="outline" disabled className="opacity-50">
                    Request Download
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-red-800">Delete Account</p>
                    <p className="text-sm text-red-600">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={isDeleting}>
                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove all of your data from our servers, including:
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Your profile information</li>
                            <li>All your product listings</li>
                            <li>Your messages and conversations</li>
                            <li>Your reviews and ratings</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Deleting...' : 'Yes, delete my account'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card className="shadow-lg border-slate-200 bg-white">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-md">
                    <HelpCircle className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-slate-800">Help & Support</CardTitle>
                </div>
                <CardDescription>
                  Get help and support for using the marketplace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">Help Center</p>
                    <p className="text-sm text-slate-600">
                      Browse our help articles and guides
                    </p>
                  </div>
                  <Button variant="outline" disabled className="opacity-50">
                    Visit Help Center
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">Contact Support</p>
                    <p className="text-sm text-slate-600">
                      Get in touch with our support team
                    </p>
                  </div>
                  <Button variant="outline" disabled className="opacity-50">
                    Contact Us
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sign Out */}
            <Card className="shadow-lg border-slate-200 bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-red-500 rounded-md">
                      <LogOut className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-red-800">Sign Out</p>
                      <p className="text-sm text-red-600">
                        Sign out of your account on this device
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSignOut} 
                    variant="outline" 
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
