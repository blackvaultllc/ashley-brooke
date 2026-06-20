import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const requireOwner = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error("Unauthorized");
    const isOwner = !!data?.some((r) => r.role === "owner");
    if (!isOwner) throw new Error("Forbidden");
    return { isOwner: true as const };
  });
