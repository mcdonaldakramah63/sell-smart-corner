
import Layout from '@/components/layout/Layout';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ProfilePictureCard } from '@/components/profile/ProfilePictureCard';
import PhoneVerificationCard from '@/components/profile/PhoneVerificationCard';
import TwoFactorAuthCard from '@/components/profile/TwoFactorAuthCard';
import { User, LayoutDashboard, ChevronRight } from 'lucide-react';
import { useProfileForm } from '@/hooks/useProfileForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const {
    formData,
    avatarUrl,
    loading,
    errors,
    handleInputChange,
    handleAvatarChange,
    handleRemoveAvatar,
    handleSubmit
  } = useProfileForm();
  
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Profile Settings
              </h1>
            </div>
            <p className="text-slate-600">Manage your personal information and security settings</p>
          </div>
          
          <div className="grid gap-6 max-w-4xl">
            {/* Mobile Dashboard Option */}
            {isMobile && (
              <Card>
                <CardContent className="p-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto"
                    onClick={() => navigate('/dashboard')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <LayoutDashboard className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Dashboard</div>
                        <div className="text-sm text-muted-foreground">View your account overview</div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Profile Picture */}
            <ProfilePictureCard 
              avatarUrl={avatarUrl}
              onAvatarChange={handleAvatarChange}
              onRemovePicture={handleRemoveAvatar}
            />
            
            {/* Profile Information */}
            <ProfileForm 
              formData={formData}
              errors={errors}
              loading={loading}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
            />

            {/* Phone Verification */}
            <PhoneVerificationCard />

            {/* Two-Factor Authentication */}
            <TwoFactorAuthCard />
          </div>
        </div>
      </div>
    </Layout>
  );
}
