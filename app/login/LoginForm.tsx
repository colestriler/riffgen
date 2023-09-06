'use client'

/**
 * Followed this guide for authentication:
 * https://supabase.com/docs/guides/auth/auth-helpers/nextjs-server-components
 */
import {FC} from "react";
import {useRouter} from "next/navigation";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
// import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";

const LoginForm: FC = () => {
  // const supabase = createBrowserClient();
  const supabase = createClientComponentClient();
  // const supabase = createBrowserSupabaseClient();
  const router = useRouter();


  const handleGoogleAuth = async (event: any) => {
    // event.preventDefault();

    try {
      const {data, error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/auth/callback`,
        }
      })

      if (error) throw error;
    } catch (e) {
      console.log('error', e);
    }
  }


  return (
    <>




      {/*<form*/}
      {/*  className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"*/}
      {/*  action="/auth/sign-in"*/}
      {/*  method="post"*/}
      {/*>*/}
      {/*  <label className="text-md" htmlFor="email">*/}
      {/*    Email*/}
      {/*  </label>*/}
      {/*  <input*/}
      {/*    className="rounded-md px-4 py-2 bg-inherit border mb-6"*/}
      {/*    name="email"*/}
      {/*    placeholder="you@example.com"*/}
      {/*    required*/}
      {/*  />*/}
      {/*  <label className="text-md" htmlFor="password">*/}
      {/*    Password*/}
      {/*  </label>*/}
      {/*  <input*/}
      {/*    className="rounded-md px-4 py-2 bg-inherit border mb-6"*/}
      {/*    type="password"*/}
      {/*    name="password"*/}
      {/*    placeholder="••••••••"*/}
      {/*    required*/}
      {/*  />*/}
      {/*  <button className="bg-green-700 rounded px-4 py-2 text-white mb-2">*/}
      {/*    Sign In*/}
      {/*  </button>*/}
      {/*  <button*/}
      {/*    formAction="/auth/sign-up"*/}
      {/*    className="border border-gray-700 rounded px-4 py-2 text-white mb-2"*/}
      {/*  >*/}
      {/*    Sign Up*/}
      {/*  </button>*/}
      {/*  <Messages/>*/}
      {/*</form>*/}
    </>
  )
}

export default LoginForm;
