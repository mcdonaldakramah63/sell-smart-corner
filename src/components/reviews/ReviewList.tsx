
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
  profiles: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

interface ReviewListProps {
  productId: string;
  refreshTrigger?: number;
}

export const ReviewList = ({ productId, refreshTrigger }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('product_reviews')
          .select(`
            id,
            rating,
            title,
            comment,
            created_at,
            profiles!product_reviews_reviewer_id_fkey (
              id,
              full_name,
              username,
              avatar_url
            )
          `)
          .eq('product_id', productId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setReviews(data || []);
        
        // Calculate average rating
        if (data && data.length > 0) {
          const avg = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
          setAverageRating(Math.round(avg * 10) / 10);
        } else {
          setAverageRating(0);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, refreshTrigger]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }
      />
    ));
  };

  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">{renderStars(Math.round(averageRating))}</div>
          <span className="font-medium">{averageRating}</span>
          <span className="text-muted-foreground">
            ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
          </span>
        </div>
      )}

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {review.profiles.avatar_url ? (
                        <AvatarImage src={review.profiles.avatar_url} />
                      ) : (
                        <AvatarFallback>
                          {(review.profiles.full_name || review.profiles.username || 'U')[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {review.profiles.full_name || review.profiles.username || 'Anonymous'}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {review.title && (
                  <h4 className="font-medium mb-2">{review.title}</h4>
                )}
                {review.comment && (
                  <p className="text-muted-foreground">{review.comment}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
