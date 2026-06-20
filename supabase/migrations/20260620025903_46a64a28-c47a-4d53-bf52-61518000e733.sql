
-- 1) Restrict INSERT/UPDATE/DELETE on user_roles to owners only
CREATE POLICY "Owners insert roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owners update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'owner'))
  WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owners delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'owner'));

-- 2) Hide internal inventory counts from public reads (column-level revoke)
REVOKE SELECT (inventory) ON public.products FROM anon, authenticated;
GRANT SELECT (inventory) ON public.products TO service_role;

-- 3) Move owner email out of source code into a locked config table.
CREATE TABLE IF NOT EXISTS public.app_config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
GRANT ALL ON public.app_config TO service_role;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
-- No policies = no anon/authenticated access. Only service_role and SECURITY DEFINER funcs.

INSERT INTO public.app_config(key, value) VALUES ('owner_email', 'ashleydalton1984@gmail.com')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Replace trigger to read the configured owner email from app_config instead of hardcoding it.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  configured_owner text;
BEGIN
  SELECT value INTO configured_owner FROM public.app_config WHERE key = 'owner_email';

  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  IF configured_owner IS NOT NULL AND lower(NEW.email) = lower(configured_owner) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'owner') ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'applicant') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
