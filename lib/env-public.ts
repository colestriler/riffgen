
//// Environment

// FIXME
import Env from "@/lib/env-utils";

export const ENVIRONMENT_NAME = (
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
    ? 'staging'
    : process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'production'
    : 'development'
);

//// Supabase

export const NEXT_PUBLIC_SUPABASE_URL = Env.require(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "NEXT_PUBLIC_SUPABASE_URL"
);
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = Env.require(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
);

//// Web

export const NEXT_PUBLIC_ORIGIN = Env.require(
  process.env.NEXT_PUBLIC_ORIGIN,
  "NEXT_PUBLIC_ORIGIN"
);