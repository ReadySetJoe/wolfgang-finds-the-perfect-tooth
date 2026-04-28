import Ornament from "./Ornament";

export default function About() {
  return (
    <section className="bg-bg-mid py-20 px-6">
      <Ornament />
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl text-gold tracking-wider uppercase mb-8">
          The Show
        </h2>
        <div className="space-y-6 text-base leading-relaxed text-text-primary/90">
          <p>
            Wolfgang has lost something. Not his keys. Not his dignity — that
            was gone long before the first act. No, Wolfgang has lost a tooth,
            and he will stop at absolutely nothing to find it. Even if
            &ldquo;nothing&rdquo; means hitchhiking through the underworld with
            a Greek chorus that only speaks in Dashboard Confessional lyrics.
          </p>
          <p>
            Part fever dream, part group therapy session, part road trip through
            the nine circles of hell with unreliable GPS,{" "}
            <em>Wolfgang Finds the Perfect Tooth</em> is the emo theater
            experience you didn&rsquo;t know you needed and definitely
            can&rsquo;t explain to your parents.
          </p>
          <p>
            Bring tissues. Bring eyeliner. Bring a willingness to question
            everything you thought you knew about dental hygiene and the
            afterlife.
          </p>
        </div>
      </div>
    </section>
  );
}
