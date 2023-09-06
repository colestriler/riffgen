import {FC} from "react";
import Link from "next/link";

const LoginButton: FC<{}> = (props) => {
  return (
    <Link
      href="/auth/google"
      // formAction="/auth/sign-in/google"
      className={
        `w-fit py-3 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-mono`
      }
    >
      <img src="images/google.png" className="h-7 w-7" alt="YouTube Logo"/>
      <p className="ml-4 mr-2">Sign in with Google</p>
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
        className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1"
      >
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </Link>
  );
};

export default LoginButton;
