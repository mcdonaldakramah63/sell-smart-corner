
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validateName, validateEmail, validateTextContent, validateFile, validateAndSanitizeUrl, validatePhone } from '@/utils/validation';

export const useProfileForm = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    bio: '',
    location: '',
    phone: '',
    website: ''
  });
  
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
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          setFormData({
            fullName: data.full_name || '',
            username: data.username || '',
            email: data.email || user.email || '',
            bio: data.bio || '',
            location: data.location || '',
            phone: data.phone || '',
            website: data.website || ''
          });
          setAvatarUrl(data.avatar_url || null);
        } else {
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
            setFormData({
              fullName: user.name || '',
              username: user.email?.split('@')[0] || '',
              email: user.email || '',
              bio: '',
              location: '',
              phone: '',
              website: ''
            });
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
    
    if (formData.fullName.trim()) {
      const validation = validateName(formData.fullName);
      if (!validation.isValid) {
        newErrors.fullName = validation.errors[0];
      }
    }
    
    if (formData.username.trim()) {
      const validation = validateName(formData.username);
      if (!validation.isValid) {
        newErrors.username = validation.errors[0];
      }
    }
    
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.errors[0];
    }
    
    if (formData.bio.trim()) {
      const validation = validateTextContent(formData.bio, { maxLength: 500 });
      if (!validation.isValid) {
        newErrors.bio = validation.errors[0];
      }
    }
    
    if (formData.location.trim()) {
      const validation = validateTextContent(formData.location, { maxLength: 100 });
      if (!validation.isValid) {
        newErrors.location = validation.errors[0];
      }
    }
    
    if (formData.phone.trim()) {
      const validation = validatePhone(formData.phone);
      if (!validation.isValid) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    if (formData.website.trim()) {
      const sanitizedUrl = validateAndSanitizeUrl(formData.website);
      if (!sanitizedUrl) {
        newErrors.website = 'Please enter a valid website URL';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const validation = validateFile(file, {
      maxSize: 2 * 1024 * 1024,
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
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      if (avatarUrl && avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl);
      }
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof typeof errors] && value.trim()) {
      let validation;
      if (field === 'email') {
        validation = validateEmail(value);
      } else if (field === 'fullName' || field === 'username') {
        validation = validateName(value);
      } else if (field === 'bio') {
        validation = validateTextContent(value, { maxLength: 500 });
      } else if (field === 'location') {
        validation = validateTextContent(value, { maxLength: 100 });
      } else if (field === 'phone') {
        validation = validatePhone(value);
      } else if (field === 'website') {
        const sanitizedUrl = validateAndSanitizeUrl(value);
        validation = { isValid: !!sanitizedUrl };
      }
      
      if (validation && validation.isValid) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    setAvatar(null);
    setErrors(prev => ({ ...prev, avatar: undefined }));
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
      
      let updatedAvatarUrl = avatarUrl;
      if (avatar) {
        updatedAvatarUrl = await uploadAvatar();
      }
      
      const emailValidation = validateEmail(formData.email);
      const fullNameValidation = validateName(formData.fullName);
      const usernameValidation = validateName(formData.username);
      const bioValidation = validateTextContent(formData.bio, { maxLength: 500 });
      const locationValidation = validateTextContent(formData.location, { maxLength: 100 });
      const phoneValidation = validatePhone(formData.phone);
      const websiteUrl = validateAndSanitizeUrl(formData.website);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullNameValidation.isValid ? formData.fullName : null,
          username: usernameValidation.isValid ? formData.username : null,
          email: emailValidation.sanitized,
          bio: bioValidation.isValid ? bioValidation.sanitized : null,
          location: locationValidation.isValid ? locationValidation.sanitized : null,
          phone: phoneValidation.isValid ? phoneValidation.sanitized : null,
          website: websiteUrl || null,
          avatar_url: updatedAvatarUrl,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      const profileData = {
        name: formData.fullName || user.name,
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

  return {
    formData,
    avatar,
    avatarUrl,
    loading,
    fetchingProfile,
    errors,
    handleInputChange,
    handleAvatarChange,
    handleRemoveAvatar,
    handleSubmit
  };
};
