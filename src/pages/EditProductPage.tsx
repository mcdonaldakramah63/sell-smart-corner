import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/useCategories";
import { useProductForm } from "@/hooks/products/useProductForm";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductDetailsCard from "@/components/products/forms/ProductDetailsCard";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { validatePrice } from "@/utils/validation";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const {
    fields,
    errors,
    setFields,
    setErrors,
    handleInputChange,
    validateForm,
  } = useProductForm({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || !user) return;

      try {
        const { data: product, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        // Check if user owns this product
        if (product.seller_id !== user.id && product.user_id !== user.id) {
          toast({
            title: "Unauthorized",
            description: "You can only edit your own listings.",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }

        setFields({
          title: product.title || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          category: product.category_id || "",
          condition: product.condition || "",
          location: product.location || "",
        });

        // Fetch images
        const { data: images } = await supabase
          .from("product_images")
          .select("image_url")
          .eq("product_id", id);

        if (images) {
          setExistingImages(images.map((img) => img.image_url));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user, navigate, toast, setFields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to edit a listing.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const priceValidation = validatePrice(fields.price);
      
      const { error } = await supabase
        .from("products")
        .update({
          title: fields.title.trim(),
          description: fields.description.trim(),
          price: priceValidation.value,
          category_id: fields.category || null,
          condition: fields.condition,
          location: fields.location.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your listing has been updated.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Listing</h1>
            <p className="text-muted-foreground">
              Update your product details
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {existingImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 flex-wrap">
                    {existingImages.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <ProductDetailsCard
              fields={fields}
              errors={errors}
              handleInputChange={handleInputChange}
              categories={categories}
              categoriesLoading={categoriesLoading}
            />

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditProductPage;
