import Head from "next/head";
import TicketsThankYou from "@/components/TicketsThankYou";
import { SITE_URL } from "@/lib/site";

export default function TicketsThankYouPage() {
  return (
    <>
      <Head>
        <title>Thank You — Wolfgang Finds the Perfect Tooth</title>
        <meta name="robots" content="noindex" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Thank You — Wolfgang Finds the Perfect Tooth"
        />
        <meta property="og:url" content={`${SITE_URL}/tickets/thank-you`} />
      </Head>
      <main>
        <TicketsThankYou />
      </main>
    </>
  );
}
