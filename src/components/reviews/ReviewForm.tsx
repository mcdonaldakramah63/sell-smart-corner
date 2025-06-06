
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { validateTextContent } from '@/utils/validation';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
}

export const ReviewForm = ({ productId, onReviewSubmitted }: ReviewFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; comment?: string }>({});

  const validateForm = () => {
    const newErrors: { title?: string; comment?: string } = {};
    
    // Validate title if provided
    if (title.trim()) {
      const titleValidation = validateTextContent(title, { maxLength: 100 });
      if (!titleValidation.isValid) {
        newErrors.title = titleValidation.errors[0];
      }
    }
    
    // Validate comment if provided
    if (comment.trim()) {
      const commentValidation = validateTextContent(comment, { maxLength: 500 });
      if (!commentValidation.isValid) {
        newErrors.comment = commentValidation.errors[0];
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please log in to submit a review',
        variant: 'destructive'
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating',
        variant: 'destructive'
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Sanitize inputs
      const titleValidation = validateTextContent(title, { maxLength: 100 });
      const commentValidation = validateTextContent(comment, { maxLength: 500 });
      
      const { error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          reviewer_id: user.id,
          rating,
          title: titleValidation.sanitized.trim() || null,
          comment: commentValidation.sanitized.trim() || null
        });

      if (error) throw error;

      toast({
        title: 'Review submitted',
        description: 'Thank you for your review!'
      });

      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setErrors({});
      onReviewSubmitted();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review. You may have already reviewed this product.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    
    // Clear error when user starts typing valid input
    if (errors.title && value.trim()) {
      const validation = validateTextContent(value, { maxLength: 100 });
      if (validation.isValid) {
        setErrors(prev => ({ ...prev, title: undefined }));
      }
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setComment(value);
    
    // Clear error when user starts typing valid input
    if (errors.comment && value.trim()) {
      const validation = validateTextContent(value, { maxLength: 500 });
      if (validation.isValid) {
        setErrors(prev => ({ ...prev, comment: undefined }));
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Rating *</Label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    size={24}
                    className={
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Review Title (Optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Summary of your review"
              maxLength={100}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {title.length}/100 characters
            </p>
          </div>

          <div>
            <Label htmlFor="comment">Review Comment (Optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Tell others about your experience with this product"
              rows={4}
              maxLength={500}
              className={errors.comment ? "border-red-500" : ""}
            />
            {errors.comment && (
              <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          <Button type="submit" disabled={loading || rating === 0}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
