-- Hide inventory column from public Data API reads
REVOKE SELECT (inventory) ON public.products FROM anon, authenticated;

-- app_config is read only by SECURITY DEFINER functions; add explicit deny
-- policy so the table is not "RLS enabled with no policy" and stays locked.
REVOKE ALL ON public.app_config FROM anon, authenticated;
GRANT ALL ON public.app_config TO service_role;
CREATE POLICY "No direct client access to app_config"
  ON public.app_config FOR SELECT
  TO anon, authenticated
  USING (false);