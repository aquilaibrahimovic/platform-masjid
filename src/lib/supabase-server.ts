// lib/supabase-server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies as nextCookies } from "next/headers";

export const createSupabaseServerClient = async () => {
  const cookieStore = await nextCookies(); // ✅ await it!

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );
};
