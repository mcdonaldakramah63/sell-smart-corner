
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

// Helper function to get premium ad priority (lower number = higher priority)
const getPremiumPriority = (adType?: string): number => {
  switch (adType) {
    case 'spotlight': return 1;
    case 'vip': return 2;
    case 'featured': return 3;
    case 'bump': return 4;
    default: return 999; // Regular ads
  }
};

export function useProductsData() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // First get premium ads to sort products with premium status
        const { data: premiumAds } = await supabase
          .from("premium_ads")
          .select("product_id, ad_type")
          .gt("expires_at", new Date().toISOString())
          .eq("status", "active");

        const { data: productData, error: productError } = await supabase
          .from("products")
          .select(`
            *,
            profiles (
              id,
              username,
              full_name,
              avatar_url
            )
          `)
          .eq("is_sold", false)
          .order("created_at", { ascending: false });
        if (productError) throw productError;
        const productsWithImages = await Promise.all(
          (productData || []).map(async (product) => {
            const { data: imageData } = await supabase
              .from("product_images")
              .select("image_url")
              .eq("product_id", product.id)
              .order("is_primary", { ascending: false });
            
            // Check if product has premium ad
            const premiumAd = premiumAds?.find(ad => ad.product_id === product.id);
            
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
              premiumAdType: premiumAd?.ad_type
            } as Product & { premiumAdType?: string };
          })
        );

        // Sort products: premium ads first, then by creation date
        const sortedProducts = productsWithImages.sort((a, b) => {
          const aPriority = getPremiumPriority(a.premiumAdType);
          const bPriority = getPremiumPriority(b.premiumAdType);
          
          if (aPriority !== bPriority) {
            return aPriority - bPriority; // Lower priority number = higher priority
          }
          
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setAllProducts(sortedProducts);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load products.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  return { allProducts, loading };
}
