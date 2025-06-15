
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useProductsData() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
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

        setAllProducts(productsWithImages);
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
