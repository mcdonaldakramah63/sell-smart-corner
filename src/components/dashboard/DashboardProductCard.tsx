
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PenSquare, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardProductCardProps {
  product: Product;
  onProductDeleted?: () => void;
}

export default function DashboardProductCard({ product, onProductDeleted }: DashboardProductCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // First delete associated product images
      const { error: imageError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', product.id);

      if (imageError) {
        console.error('Error deleting product images:', imageError);
      }

      // Then delete the product
      const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (productError) throw productError;

      toast({
        title: "Product deleted",
        description: "Your product has been successfully deleted.",
      });

      // Call the callback to refresh the parent component
      if (onProductDeleted) {
        onProductDeleted();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-product/${product.id}`);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square bg-gray-50">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.images[0] || '/placeholder.svg'}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
            loading="lazy"
          />
          {product.is_sold && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge className="text-lg py-1 px-3 bg-red-500 hover:bg-red-600">
                Sold
              </Badge>
            </div>
          )}
        </Link>
      </div>
      <CardContent className="p-4">
        <Link to={`/products/${product.id}`} className="hover:underline">
          <h3 className="font-medium line-clamp-1">{product.title}</h3>
        </Link>
        <div className="flex justify-between items-center mt-1">
          <p className="font-semibold text-primary">
            ${parseFloat(product.price.toString()).toFixed(2)}
          </p>
          <Badge variant="outline" className="text-xs">
            {product.condition}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1" 
          onClick={handleEdit}
        >
          <PenSquare className="mr-1 h-3 w-3" />
          Edit
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              <Trash2 className="mr-1 h-3 w-3" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your product listing.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
