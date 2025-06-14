
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FormField } from './ProfileFormFields';

interface ProfileFormProps {
  formData: {
    fullName: string;
    username: string;
    email: string;
    bio: string;
    location: string;
    phone: string;
    website: string;
  };
  errors: {
    fullName?: string;
    username?: string;
    email?: string;
    bio?: string;
    location?: string;
    phone?: string;
    website?: string;
  };
  loading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProfileForm = ({
  formData,
  errors,
  loading,
  onInputChange,
  onSubmit
}: ProfileFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal information and contact details
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="fullName"
              label="Full Name"
              value={formData.fullName}
              onChange={(value) => onInputChange('fullName', value)}
              placeholder="Your full name"
              error={errors.fullName}
              maxLength={50}
            />
            
            <FormField
              id="username"
              label="Username"
              value={formData.username}
              onChange={(value) => onInputChange('username', value)}
              placeholder="Choose a username"
              error={errors.username}
              maxLength={50}
            />

            <div className="md:col-span-2">
              <FormField
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(value) => onInputChange('email', value)}
                placeholder="your.email@example.com"
                error={errors.email}
                required
                maxLength={254}
                description="This email will be visible to other users for contact purposes"
              />
            </div>
            
            <div className="md:col-span-2">
              <FormField
                id="bio"
                label="Bio"
                value={formData.bio}
                onChange={(value) => onInputChange('bio', value)}
                placeholder="Tell us a bit about yourself"
                error={errors.bio}
                rows={3}
                maxLength={500}
                showCharCount
              />
            </div>
            
            <FormField
              id="location"
              label="Location"
              value={formData.location}
              onChange={(value) => onInputChange('location', value)}
              placeholder="City, Country"
              error={errors.location}
              maxLength={100}
            />
            
            <FormField
              id="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={(value) => onInputChange('phone', value)}
              placeholder="Your phone number"
              error={errors.phone}
              maxLength={20}
              description="This will be visible to other users for contact purposes"
            />
            
            <div className="md:col-span-2">
              <FormField
                id="website"
                label="Website"
                value={formData.website}
                onChange={(value) => onInputChange('website', value)}
                placeholder="https://your-website.com"
                error={errors.website}
                maxLength={255}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
