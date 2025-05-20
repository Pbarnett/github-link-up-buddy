
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Export the type for convenience when using this hook elsewhere
export type PaymentMethod = Database["public"]["Tables"]["payment_methods"]["Row"];

export function usePaymentMethods() {
  return useQuery<PaymentMethod[], Error>({
    queryKey: ["payment_methods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
}
