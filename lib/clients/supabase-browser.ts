import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import {NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL} from "@/lib/env-public";
import {Database} from "@/lib/types/supabase";

/**
 * Creates a Supabase client intended for the browser, using our
 * anonymous key. This is safe to use in the browser.
 */
export const createBrowserClient = () =>
  createBrowserSupabaseClient<Database>({
    supabaseUrl: NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: NEXT_PUBLIC_SUPABASE_ANON_KEY
  });