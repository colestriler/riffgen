import './globals.css'
import Header from "@/app/(components)/Header";
import Script from "next/script";
import Head from "next/head";
import {PAGE_DESCRIPTION, PAGE_TITLE} from "@/utils/constants";

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-background flex flex-col items-center">
          <Script strategy='lazyOnload' id='hotjar-tracking'>
            {`
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `}
          </Script>
          {children}
        </main>
      </body>
    </html>
  )
}
