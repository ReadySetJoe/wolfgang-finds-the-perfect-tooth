import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={cinzel.variable}>
      <Component {...pageProps} />
    </div>
  );
}
