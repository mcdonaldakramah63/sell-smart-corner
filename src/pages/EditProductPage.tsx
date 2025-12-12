import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/useCategories";
import { useProductForm } from "@/hooks/products/useProductForm";
import { useImageUpload } from "@/hooks/products/useImageUpload";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductDetailsCard from "@/components/products/forms/ProductDetailsCard";
import { Loader2, Save, ArrowLeft, X, Upload, ImagePlus } from "lucide-react";
import { validatePrice } from "@/utils/validation";

interface ExistingImage {
  id: string;
  image_url: string;
}

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const {
    images: newImages,
    previewUrls: newPreviewUrls,
    error: imageError,
    handleImageSelect,
    removeImage: removeNewImage,
  } = useImageUpload();

  const {
    fields,
    errors,
    setFields,
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

        const { data: images } = await supabase
          .from("product_images")
          .select("id, image_url")
          .eq("product_id", id);

        if (images) {
          setExistingImages(images);
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

  const handleRemoveExistingImage = (imageId: string) => {
    setImagesToDelete((prev) => [...prev, imageId]);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !id) {
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

    const totalImages = existingImages.length + newImages.length;
    if (totalImages === 0) {
      toast({
        title: "Error",
        description: "Please add at least one image.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const priceValidation = validatePrice(fields.price);

      // Update product details
      const { error: updateError } = await supabase
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

      if (updateError) throw updateError;

      // Delete removed images
      for (const imageId of imagesToDelete) {
        const imageToDelete = existingImages.find((img) => img.id === imageId);
        if (imageToDelete) {
          // Extract path from URL for storage deletion
          const urlParts = imageToDelete.image_url.split("/product-images/");
          if (urlParts[1]) {
            await supabase.storage.from("product-images").remove([urlParts[1]]);
          }
        }
        await supabase.from("product_images").delete().eq("id", imageId);
      }

      // Upload new images
      for (let i = 0; i < newImages.length; i++) {
        const file = newImages[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${id}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        await supabase.from("product_images").insert({
          product_id: id,
          image_url: publicUrlData.publicUrl,
          is_primary: existingImages.length === 0 && i === 0,
        });
      }

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

  const totalImageCount = existingImages.length + newImages.length;

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
            <p className="text-muted-foreground">Update your product details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Image Management Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImagePlus className="h-5 w-5" />
                  Product Images ({totalImageCount}/5)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Current Images
                    </Label>
                    <div className="flex gap-4 flex-wrap">
                      {existingImages.map((img) => (
                        <div key={img.id} className="relative group">
                          <img
                            src={img.image_url}
                            alt="Product"
                            className="w-24 h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(img.id)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Preview */}
                {newPreviewUrls.length > 0 && (
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      New Images
                    </Label>
                    <div className="flex gap-4 flex-wrap">
                      {newPreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`New image ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-lg border border-primary"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                {totalImageCount < 5 && (
                  <div>
                    <Label
                      htmlFor="image-upload"
                      className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                    >
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Add more images ({5 - totalImageCount} remaining)
                      </span>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageSelect(e.target.files)}
                    />
                  </div>
                )}

                {imageError && (
                  <p className="text-sm text-destructive">{imageError}</p>
                )}
              </CardContent>
            </Card>

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
