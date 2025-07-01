
import Layout from '@/components/layout/Layout';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfilePictureCard from '@/components/profile/ProfilePictureCard';
import PhoneVerificationCard from '@/components/profile/PhoneVerificationCard';
import TwoFactorAuthCard from '@/components/profile/TwoFactorAuthCard';
import { User, Settings } from 'lucide-react';

export default function ProfilePage() {
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
            {/* Profile Picture */}
            <ProfilePictureCard />
            
            {/* Profile Information */}
            <ProfileForm />

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
