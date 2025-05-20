
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define the PaymentMethod interface since it's not in the generated types
export interface PaymentMethod {
  id: string;
  user_id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
  created_at: string;
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: ["payment_methods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .order("created_at", { ascending: false }) as any; // Use type assertion here
      
      if (error) throw error;
      return data as PaymentMethod[];
    }
  });
}
