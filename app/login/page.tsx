import LoginForm from "@/app/login/LoginForm";
import Link from "next/link";
// import clsx from "clsx/clsx";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";

export default function Login() {

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        {' '}
        Back
      </Link>
      <div className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <a
          href="/auth/google"
          // formAction="/auth/sign-in/google"
          className={
            `flex items-center justify-center bg-transparent hover:bg-gray-900 shadow border-2 border-border  
              focus:shadow-outline focus:outline-none 
              text-white font-bold py-4 px-4 rounded-xl w-full`
          }
        >
          <img src="images/google.png" className="h-6 w-6" alt="YouTube Logo"/>
          <p className="ml-4">Continue with Google →</p>
        </a>

      </div>

      <LoginForm/>
    </div>
  )
}
