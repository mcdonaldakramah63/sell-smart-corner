
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileFormData {
  full_name: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  website: string;
}

interface ProfileFormFieldsProps {
  formData: ProfileFormData;
  errors: Record<string, string>;
  loading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProfileFormFields({
  formData,
  errors,
  loading,
  onInputChange,
  onSubmit
}: ProfileFormFieldsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => onInputChange('full_name', e.target.value)}
                placeholder="Enter your full name"
              />
              {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name}</p>}
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => onInputChange('username', e.target.value)}
                placeholder="Enter your username"
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => onInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself"
              rows={3}
            />
            {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => onInputChange('location', e.target.value)}
                placeholder="Enter your location"
              />
              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => onInputChange('website', e.target.value)}
                placeholder="Enter your website URL"
              />
              {errors.website && <p className="text-red-500 text-sm">{errors.website}</p>}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
