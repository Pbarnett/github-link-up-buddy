
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Export a typed alias for use elsewhere in the app
export type PaymentMethod = Database["public"]["Tables"]["payment_methods"]["Row"];

export function usePaymentMethods() {
  const query = useQuery<PaymentMethod[], Error>({
    queryKey: ["payment_methods"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("payment_methods")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error("Error fetching payment methods:", error); // Preserving this console.error
        throw error; // Ensure error is re-thrown for useQuery to handle
      }
    }
  });

  return {
    paymentMethods: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
