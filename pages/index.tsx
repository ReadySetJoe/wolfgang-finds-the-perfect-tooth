import Head from "next/head";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Head>
        <title>Wolfgang Finds the Perfect Tooth</title>
      </Head>
      <main>
        <Hero />
      </main>
    </>
  );
}
