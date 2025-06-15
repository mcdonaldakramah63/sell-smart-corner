
import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useFeaturedProducts(limit: number = 4) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      try {
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select(
            `
            *,
            profiles (
              id,
              username,
              full_name,
              avatar_url
            )
          `
          )
          .eq("is_sold", false)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (productError) throw productError;

        const productsWithImages = await Promise.all(
          (productData || []).map(async (product) => {
            const { data: imageData } = await supabase
              .from("product_images")
              .select("image_url")
              .eq("product_id", product.id)
              .order("is_primary", { ascending: false });

            return {
              id: product.id,
              title: product.title,
              description: product.description || "",
              price: parseFloat(product.price.toString()),
              images: imageData ? imageData.map((img) => img.image_url) : [],
              category: product.category_id || "other",
              condition: (product.condition || "good") as Product["condition"],
              seller: {
                id: product.profiles?.id || "",
                name: product.profiles?.full_name || product.profiles?.username || "Unknown",
                avatar: product.profiles?.avatar_url || undefined,
              },
              createdAt: product.created_at,
              location: product.location || "",
              is_sold: product.is_sold,
            } as Product;
          })
        );
        setFeaturedProducts(productsWithImages);
      } catch (e) {
        toast({
          title: "Error",
          description: "Failed to load featured products.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, [toast, limit]);

  return { featuredProducts, loading };
}
