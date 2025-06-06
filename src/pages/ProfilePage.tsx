import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, User, Upload } from 'lucide-react';
import { validateProfileInput } from '@/utils/authUtils';
import { validateEmail, validateFile } from '@/utils/validation';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [errors, setErrors] = useState<{
    fullName?: string;
    username?: string;
    email?: string;
    bio?: string;
    location?: string;
    phone?: string;
    website?: string;
    avatar?: string;
  }>({});

  // Fetch profile data or create if it doesn't exist
  useEffect(() => {
    const fetchOrCreateProfile = async () => {
      if (!user?.id) return;
      
      try {
        setFetchingProfile(true);
        
        // Try to fetch existing profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          // Profile exists, populate fields
          setFullName(data.full_name || '');
          setUsername(data.username || '');
          setEmail(data.email || user.email || '');
          setBio(data.bio || '');
          setLocation(data.location || '');
          setPhone(data.phone || '');
          setWebsite(data.website || '');
          setAvatarUrl(data.avatar_url || null);
        } else {
          // Profile doesn't exist, create one
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: user.name || '',
              username: user.email?.split('@')[0] || '',
              email: user.email || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (insertError) {
            console.error('Error creating profile:', insertError);
          } else {
            // Set default values
            setFullName(user.name || '');
            setUsername(user.email?.split('@')[0] || '');
            setEmail(user.email || '');
          }
        }
      } catch (error) {
        console.error('Error fetching/creating profile:', error);
        toast({
          title: 'Profile Setup',
          description: 'Setting up your profile for the first time',
        });
      } finally {
        setFetchingProfile(false);
      }
    };
    
    fetchOrCreateProfile();
  }, [user?.id, toast, user?.name, user?.email]);
  
  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    // Validate full name
    if (fullName.trim()) {
      const validation = validateProfileInput('full_name', fullName);
      if (!validation.isValid) {
        newErrors.fullName = validation.errors[0];
      }
    }
    
    // Validate username
    if (username.trim()) {
      const validation = validateProfileInput('name', username);
      if (!validation.isValid) {
        newErrors.username = validation.errors[0];
      }
    }
    
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.errors[0];
    }
    
    // Validate bio
    if (bio.trim()) {
      const validation = validateProfileInput('bio', bio);
      if (!validation.isValid) {
        newErrors.bio = validation.errors[0];
      }
    }
    
    // Validate location
    if (location.trim()) {
      const validation = validateProfileInput('location', location);
      if (!validation.isValid) {
        newErrors.location = validation.errors[0];
      }
    }
    
    // Validate phone
    if (phone.trim()) {
      const validation = validateProfileInput('phone', phone);
      if (!validation.isValid) {
        newErrors.phone = validation.errors[0];
      }
    }
    
    // Validate website
    if (website.trim()) {
      const validation = validateProfileInput('website', website);
      if (!validation.isValid) {
        newErrors.website = validation.errors[0];
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file
    const validation = validateFile(file, {
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    });
    
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, avatar: validation.errors[0] }));
      return;
    }
    
    setErrors(prev => ({ ...prev, avatar: undefined }));
    setAvatar(file);
    setAvatarUrl(URL.createObjectURL(file));
  };
  
  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatar || !user?.id) return avatarUrl;
    
    try {
      const fileExt = avatar.name.split('.').pop();
      const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatar);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Revoke object URL to avoid memory leaks
      if (avatarUrl && avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl);
      }
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to update your profile',
        variant: 'destructive'
      });
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload avatar if changed
      let updatedAvatarUrl = avatarUrl;
      if (avatar) {
        updatedAvatarUrl = await uploadAvatar();
      }
      
      // Sanitize all inputs
      const fullNameValidation = validateProfileInput('full_name', fullName);
      const usernameValidation = validateProfileInput('name', username);
      const emailValidation = validateEmail(email);
      const bioValidation = validateProfileInput('bio', bio);
      const locationValidation = validateProfileInput('location', location);
      const phoneValidation = validateProfileInput('phone', phone);
      const websiteValidation = validateProfileInput('website', website);
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullNameValidation.sanitized || null,
          username: usernameValidation.sanitized || null,
          email: emailValidation.sanitized,
          bio: bioValidation.sanitized || null,
          location: locationValidation.sanitized || null,
          phone: phoneValidation.sanitized || null,
          website: websiteValidation.sanitized || null,
          avatar_url: updatedAvatarUrl,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Update local auth context
      const profileData = {
        name: fullNameValidation.sanitized || user.name,
        avatar: updatedAvatarUrl,
      };
      
      await updateProfile(profileData);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (field: keyof typeof errors, value: string) => {
    // Update the field value
    switch (field) {
      case 'fullName':
        setFullName(value);
        break;
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'bio':
        setBio(value);
        break;
      case 'location':
        setLocation(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'website':
        setWebsite(value);
        break;
    }
    
    // Clear error if input becomes valid
    if (errors[field] && value.trim()) {
      let validation;
      if (field === 'email') {
        validation = validateEmail(value);
      } else {
        const fieldMap: { [key: string]: string } = {
          fullName: 'full_name',
          username: 'name'
        };
        validation = validateProfileInput(fieldMap[field] || field, value);
      }
      
      if (validation.isValid) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    }
  };
  
  if (fetchingProfile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Upload a profile picture to personalize your account
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="w-32 h-32">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt="Profile picture" />
                    ) : (
                      <AvatarFallback>
                        <User className="h-12 w-12 text-muted-foreground" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Label
                    htmlFor="avatar"
                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="sr-only">Upload new picture</span>
                  </Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="sr-only"
                  />
                </div>
                {errors.avatar && (
                  <p className="text-red-500 text-sm mb-2">{errors.avatar}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Click the upload icon to change your profile picture
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setAvatarUrl(null);
                    setAvatar(null);
                    setErrors(prev => ({ ...prev, avatar: undefined }));
                  }}
                  disabled={!avatarUrl}
                >
                  Remove Picture
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Your full name"
                        className={`mt-1 ${errors.fullName ? 'border-red-500' : ''}`}
                        maxLength={50}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        placeholder="Choose a username"
                        className={`mt-1 ${errors.username ? 'border-red-500' : ''}`}
                        maxLength={50}
                      />
                      {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                        required
                        maxLength={254}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        This email will be visible to other users for contact purposes
                      </p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us a bit about yourself"
                        className={`mt-1 ${errors.bio ? 'border-red-500' : ''}`}
                        rows={3}
                        maxLength={500}
                      />
                      {errors.bio && (
                        <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {bio.length}/500 characters
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="City, Country"
                        className={`mt-1 ${errors.location ? 'border-red-500' : ''}`}
                        maxLength={100}
                      />
                      {errors.location && (
                        <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Your phone number"
                        className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                        maxLength={20}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        This will be visible to other users for contact purposes
                      </p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://your-website.com"
                        className={`mt-1 ${errors.website ? 'border-red-500' : ''}`}
                        maxLength={255}
                      />
                      {errors.website && (
                        <p className="text-red-500 text-sm mt-1">{errors.website}</p>
                      )}
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
