
import type { Json } from "@/integrations/supabase/types";

/**
 * Recursively convert any Date properties to ISO strings,
 * and ensure the entire structure is valid for a JSONB column.
 */
export function toJsonSafe(value: unknown): Json {
  // 1. Primitives & null
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  // 2. Date → ISO string
  if (value instanceof Date) {
    return value.toISOString();
  }

  // 3. Array → map over elements
  if (Array.isArray(value)) {
    return value.map((el) => toJsonSafe(el)) as Json[];
  }

  // 4. Plain object → recurse on each entry
  if (typeof value === "object") {
    const plain: { [key: string]: Json } = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      // Skip undefined-valued keys so we don't insert `"key": undefined`
      if (val === undefined) continue;
      plain[key] = toJsonSafe(val);
    }
    return plain;
  }

  // 5. Anything else (function, Map, Set) – convert to null
  // In our domain, we shouldn't hit these, but just in case:
  return null;
}
