
import { ProfilePictureCard } from '@/components/profile/ProfilePictureCard';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useProfileForm } from '@/hooks/useProfileForm';

export default function ProfilePage() {
  const {
    formData,
    avatarUrl,
    loading,
    fetchingProfile,
    errors,
    handleInputChange,
    handleAvatarChange,
    handleRemoveAvatar,
    handleSubmit
  } = useProfileForm();
  
  if (fetchingProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <ProfilePictureCard
            avatarUrl={avatarUrl}
            onAvatarChange={handleAvatarChange}
            onRemovePicture={handleRemoveAvatar}
            error={errors.avatar}
          />
        </div>
        
        <div className="md:col-span-2">
          <ProfileForm
            formData={formData}
            errors={errors}
            loading={loading}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
