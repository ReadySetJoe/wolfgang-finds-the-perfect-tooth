import Head from "next/head";
import Splash from "@/components/Splash";
import { SITE_URL, OG_IMAGE_URL } from "@/lib/site";

export default function SplashPage() {
  return (
    <>
      <Head>
        <title>Wolfgang Finds the Perfect Tooth &mdash; Info</title>
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Wolfgang Finds the Perfect Tooth — Info"
        />
        <meta
          property="og:description"
          content="An absurdist emo theater road trip through hell."
        />
        <meta property="og:url" content={`${SITE_URL}/splash`} />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Wolfgang Finds the Perfect Tooth — Info"
        />
        <meta
          name="twitter:description"
          content="An absurdist emo theater road trip through hell."
        />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
      </Head>
      <main>
        <Splash />
      </main>
    </>
  );
}
