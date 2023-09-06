import LoginForm from "@/app/login/LoginForm";
import Link from "next/link";
// import clsx from "clsx/clsx";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import BackButton from "@/app/(components)/BackButton";
import LoginButton from "@/app/(components)/LoginButton";

export default function Login() {

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <BackButton />
      <div className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <LoginButton />
      </div>
      <LoginForm/>
    </div>
  )
}
