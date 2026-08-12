import Head from "next/head";
import CurtainIntro from "@/components/CurtainIntro";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Details from "@/components/Details";
import CastCrew from "@/components/CastCrew";
import Footer from "@/components/Footer";
import { SITE_URL, OG_IMAGE_URL } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Head>
        <title>Wolfgang Finds the Perfect Tooth</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Wolfgang Finds the Perfect Tooth" />
        <meta
          property="og:description"
          content="An absurdist emo theater road trip through hell."
        />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wolfgang Finds the Perfect Tooth" />
        <meta
          name="twitter:description"
          content="An absurdist emo theater road trip through hell."
        />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
      </Head>
      <main>
        <CurtainIntro />
        <Hero />
        <About />
        <Details />
        <CastCrew />
        <Footer />
      </main>
    </>
  );
}
