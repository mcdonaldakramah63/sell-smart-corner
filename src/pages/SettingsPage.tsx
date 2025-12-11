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

      // Call the edge function to delete the account
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      const response = await fetch('/functions/v1/delete-user-account', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete account');
      }

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
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="mb-4 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Settings className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Settings
              </h1>
            </div>
            <p className="text-xs sm:text-base text-slate-600">Manage your account preferences and settings</p>
          </div>
          
          <div className="grid gap-3 sm:gap-6 max-w-4xl">
            {/* Account Settings */}
            <Card className="shadow-lg border-slate-200 bg-white">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg p-3 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1 sm:p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <CardTitle className="text-sm sm:text-base text-slate-800">Account Settings</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  Manage your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-6 p-3 sm:p-6 pt-3 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-xs sm:text-base text-slate-800">Profile Information</p>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Update your personal details and profile picture
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="hover:bg-blue-50 border-blue-200 text-xs sm:text-sm w-full sm:w-auto">
                    <Link to="/profile">Edit Profile</Link>
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-xs sm:text-base text-slate-800">Email</p>
                    <p className="text-xs sm:text-sm text-slate-600 truncate max-w-[200px] sm:max-w-none">
                      {user?.email || 'No email set'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled className="opacity-50 text-xs sm:text-sm w-full sm:w-auto">
                    Change Email
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-xs sm:text-base text-slate-800">Password</p>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Last updated: Never
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled className="opacity-50 text-xs sm:text-sm w-full sm:w-auto">
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
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg p-3 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1 sm:p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <CardTitle className="text-sm sm:text-base text-slate-800">Privacy & Security</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  Manage your privacy settings and account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-6 p-3 sm:p-6 pt-3 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-xs sm:text-base text-slate-800">Download Data</p>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Download a copy of your personal data
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled className="opacity-50 text-xs sm:text-sm w-full sm:w-auto">
                    Request Download
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-xs sm:text-base text-red-800">Delete Account</p>
                    <p className="text-xs sm:text-sm text-red-600">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={isDeleting} className="text-xs sm:text-sm w-full sm:w-auto">
                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-base sm:text-lg">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs sm:text-sm">
                          This action cannot be undone. This will permanently delete your account
                          and remove all of your data from our servers, including:
                          <ul className="list-disc list-inside mt-2 space-y-1 text-xs sm:text-sm">
                            <li>Your profile information</li>
                            <li>All your product listings</li>
                            <li>Your messages and conversations</li>
                            <li>Your reviews and ratings</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="text-xs sm:text-sm">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm"
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
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg p-3 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1 sm:p-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-md">
                    <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <CardTitle className="text-sm sm:text-base text-slate-800">Help & Support</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  Get help and support for using the marketplace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-6 p-3 sm:p-6 pt-3 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-xs sm:text-base text-slate-800">Help Center</p>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Browse our help articles and guides
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled className="opacity-50 text-xs sm:text-sm w-full sm:w-auto">
                    Visit Help Center
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-xs sm:text-base text-slate-800">Contact Support</p>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Get in touch with our support team
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled className="opacity-50 text-xs sm:text-sm w-full sm:w-auto">
                    Contact Us
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sign Out */}
            <Card className="shadow-lg border-slate-200 bg-white">
              <CardContent className="p-3 sm:p-6 pt-3 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1 sm:p-1.5 bg-red-500 rounded-md">
                      <LogOut className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-xs sm:text-base text-red-800">Sign Out</p>
                      <p className="text-xs sm:text-sm text-red-600">
                        Sign out of your account on this device
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSignOut} 
                    variant="outline" 
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-50 text-xs sm:text-sm w-full sm:w-auto"
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
