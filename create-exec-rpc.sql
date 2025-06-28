-- Create the exec RPC function that other functions depend on
CREATE OR REPLACE FUNCTION public.exec(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Grant execute permission to the service role
GRANT EXECUTE ON FUNCTION public.exec(text) TO service_role;
