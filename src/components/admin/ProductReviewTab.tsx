import React, { useState } from 'react';
import { useProductReview } from '@/hooks/useProductReview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

export const ProductReviewTab = () => {
  const { products, loading, approveProduct, rejectProduct, fetchProducts } = useProductReview();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  const handleStatusFilterChange = (value: string) => {
    const filter = value as 'pending' | 'approved' | 'rejected' | 'all';
    setStatusFilter(filter);
    if (filter === 'all') {
      fetchProducts();
    } else {
      fetchProducts(filter);
    }
  };

  const handleReject = async () => {
    if (selectedProduct && rejectionReason) {
      await rejectProduct(selectedProduct.id, rejectionReason);
      setSelectedProduct(null);
      setRejectionReason('');
    }
  };

  const getPrimaryImage = (product: any) => {
    return product.product_images?.find((img: any) => img.is_primary)?.image_url || 
           product.product_images?.[0]?.image_url || 
           '/placeholder.svg';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Product Review</h2>
          <p className="text-muted-foreground">Review and approve/reject products</p>
        </div>
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 text-muted-foreground">
            No products found with status: {statusFilter}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{product.title}</CardTitle>
                    <CardDescription>
                      Seller: {product.profiles?.full_name || 'Unknown'}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={
                      product.status === 'approved' ? 'default' : 
                      product.status === 'rejected' ? 'destructive' : 
                      'secondary'
                    }
                  >
                    {product.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.product_images && product.product_images.length > 0 && (
                    <img 
                      src={getPrimaryImage(product)} 
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  
                  <div className="text-sm space-y-1">
                    <p><strong>Price:</strong> GHS {product.price}</p>
                    <p><strong>Category:</strong> {product.categories?.name || 'N/A'}</p>
                    <p><strong>Location:</strong> {product.location || 'N/A'}</p>
                    <p><strong>Created:</strong> {new Date(product.created_at).toLocaleDateString()}</p>
                  </div>

                  {product.description && (
                    <div>
                      <strong className="text-sm">Description:</strong>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                        {product.description}
                      </p>
                    </div>
                  )}

                  {product.rejection_reason && (
                    <div className="bg-destructive/10 p-2 rounded">
                      <strong className="text-sm text-destructive">Rejection Reason:</strong>
                      <p className="text-sm text-destructive mt-1">{product.rejection_reason}</p>
                    </div>
                  )}

                  {product.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        className="flex-1"
                        variant="default"
                        onClick={() => approveProduct(product.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="flex-1" 
                            variant="destructive"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Product</DialogTitle>
                            <DialogDescription>
                              Please provide a reason for rejecting this product.
                            </DialogDescription>
                          </DialogHeader>
                          <Textarea
                            placeholder="Enter rejection reason..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={4}
                          />
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={handleReject}
                              disabled={!rejectionReason}
                            >
                              Reject Product
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => window.open(`/products/${product.id}`, '_blank')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
