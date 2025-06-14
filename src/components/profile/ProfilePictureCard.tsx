
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Upload } from 'lucide-react';

interface ProfilePictureCardProps {
  avatarUrl: string | null;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePicture: () => void;
  error?: string;
}

export const ProfilePictureCard = ({ 
  avatarUrl, 
  onAvatarChange, 
  onRemovePicture, 
  error 
}: ProfilePictureCardProps) => {
  return (
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
            onChange={onAvatarChange}
            className="sr-only"
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Click the upload icon to change your profile picture
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onRemovePicture}
          disabled={!avatarUrl}
        >
          Remove Picture
        </Button>
      </CardFooter>
    </Card>
  );
};
