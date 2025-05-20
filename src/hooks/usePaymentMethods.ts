
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define the type for the payment method
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
  return useQuery<PaymentMethod[], Error>({
    queryKey: ["payment_methods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Filter the data to ensure it matches our PaymentMethod interface
      const paymentMethods = data?.filter((item): item is PaymentMethod => {
        return (
          'brand' in item && 
          'last4' in item && 
          'exp_month' in item && 
          'exp_year' in item &&
          'is_default' in item
        );
      }) || [];
      
      return paymentMethods;
    }
  });
}
