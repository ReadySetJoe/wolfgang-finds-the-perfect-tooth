import Head from "next/head";
import Splash from "@/components/Splash";

export default function SplashPage() {
  return (
    <>
      <Head>
        <title>Wolfgang Finds the Perfect Tooth &mdash; Info</title>
      </Head>
      <main>
        <Splash />
      </main>
    </>
  );
}
