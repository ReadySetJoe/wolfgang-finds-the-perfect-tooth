import Head from "next/head";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Details from "@/components/Details";

export default function Home() {
  return (
    <>
      <Head>
        <title>Wolfgang Finds the Perfect Tooth</title>
      </Head>
      <main>
        <Hero />
        <About />
        <Details />
      </main>
    </>
  );
}
