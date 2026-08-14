import "@/styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { Cinzel } from "next/font/google";
import { captureSource } from "@/lib/attribution";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    captureSource();
  }, [router.asPath]);

  return (
    <div className={cinzel.variable}>
      <Component {...pageProps} />
    </div>
  );
}
