
// src/json-overrides.d.ts
import '@supabase/supabase-js'

declare module '@supabase/supabase-js' {
  /** 
   * Collapse Supabase's infinitely-recursive Json type to a simple `unknown`.
   * This stops TS from ever trying to inline it.
   */
  export type Json = unknown
}
