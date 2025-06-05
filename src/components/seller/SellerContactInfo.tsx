
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin, Globe, Calendar } from 'lucide-react';

interface SellerProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  created_at: string;
}

interface SellerContactInfoProps {
  seller: SellerProfile;
}

export const SellerContactInfo = ({ seller }: SellerContactInfoProps) => {
  const displayName = seller.full_name || seller.username || 'Unknown Seller';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Seller Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-16 w-16">
            {seller.avatar_url ? (
              <AvatarImage src={seller.avatar_url} alt={displayName} />
            ) : (
              <AvatarFallback className="text-lg">{displayName[0]}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{displayName}</h3>
            {seller.username && seller.full_name && (
              <p className="text-sm text-muted-foreground">@{seller.username}</p>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Calendar size={14} />
              <span>Member since {new Date(seller.created_at).getFullYear()}</span>
            </div>
          </div>
        </div>

        {seller.bio && (
          <div>
            <h4 className="font-medium mb-1">About</h4>
            <p className="text-sm text-muted-foreground">{seller.bio}</p>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium">Contact Information</h4>
          
          {seller.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail size={16} className="text-muted-foreground" />
              <a 
                href={`mailto:${seller.email}`}
                className="text-blue-600 hover:underline"
              >
                {seller.email}
              </a>
            </div>
          )}

          {seller.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone size={16} className="text-muted-foreground" />
              <a 
                href={`tel:${seller.phone}`}
                className="text-blue-600 hover:underline"
              >
                {seller.phone}
              </a>
            </div>
          )}

          {seller.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-muted-foreground" />
              <span>{seller.location}</span>
            </div>
          )}

          {seller.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe size={16} className="text-muted-foreground" />
              <a 
                href={seller.website.startsWith('http') ? seller.website : `https://${seller.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {seller.website}
              </a>
            </div>
          )}

          {!seller.email && !seller.phone && !seller.location && !seller.website && (
            <p className="text-sm text-muted-foreground">No contact information provided</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
