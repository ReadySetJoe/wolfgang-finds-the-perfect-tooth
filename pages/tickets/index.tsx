import Head from "next/head";
import Tickets from "@/components/Tickets";
import { SITE_URL, OG_IMAGE_URL } from "@/lib/site";

export default function TicketsPage() {
  return (
    <>
      <Head>
        <title>Tickets — Wolfgang Finds the Perfect Tooth</title>
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Tickets — Wolfgang Finds the Perfect Tooth"
        />
        <meta
          property="og:description"
          content="An absurdist emo theater road trip through hell."
        />
        <meta property="og:url" content={`${SITE_URL}/tickets`} />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Tickets — Wolfgang Finds the Perfect Tooth"
        />
        <meta
          name="twitter:description"
          content="An absurdist emo theater road trip through hell."
        />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
      </Head>
      <main>
        <Tickets />
      </main>
    </>
  );
}
