import {createServerComponentClient} from '@supabase/auth-helpers-nextjs'
import { headers, cookies } from 'next/headers'
import Link from 'next/link'
import LogoutButton from "@/app/(components)/LogoutButton";
import NextJsLogo from "@/app/(components)/NextJsLogo";
import SupabaseLogo from "@/app/(components)/SupabaseLogo";
import {redirect} from "next/navigation";
import FacebookMusicGen from "@/app/generate/FacebookMusicGen";
import BackButton from "@/app/(components)/BackButton";

export const dynamic = 'force-dynamic'

export default async function Generate() {
  const supabase = createServerComponentClient({ cookies })
  // const supabase = createServerComponentSupabaseClient({ headers, cookies})

  const session = await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

 // if (!user) {
 //   redirect('/login');
 // }

  return (
    <div className="w-full flex flex-col items-center">
      <BackButton />
      <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
        <FacebookMusicGen session={session} user={user} />
      </div>
    </div>
  )
}
