import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Wolfgang Finds the Perfect Tooth — An absurdist emo theater road trip through hell. October 17, 2026 at Centre Stage, Greenville, SC."
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
