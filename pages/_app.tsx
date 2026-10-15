import "@/styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { Londrina_Solid } from "next/font/google";
import { captureSource } from "@/lib/attribution";
import KonamiEasterEgg from "@/components/KonamiEasterEgg";

const londrinaSolid = Londrina_Solid({
  subsets: ["latin"],
  weight: ["400", "900"],
  variable: "--font-londrina-solid",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    captureSource();
  }, [router.asPath]);

  return (
    <div className={londrinaSolid.variable}>
      <Component {...pageProps} />
      <KonamiEasterEgg />
    </div>
  );
}
