import Ornament from "./Ornament";
import { useScrollReveal } from "./useScrollReveal";

export default function About() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="animate-on-scroll bg-bg-mid py-20 px-6">
      <Ornament />
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl text-gold tracking-wider uppercase mb-8">
          The Show
        </h2>
        <div className="space-y-6 text-base leading-relaxed text-text-primary/90">
          <p>
            A routine dental procedure goes sideways when the Dentist discovers
            a mythical wish-granting tooth inside the mouth of his most
            unremarkable Patient. But he&rsquo;s not the only one who wants it.
            A vengeful Wolfman and a rhyme-obsessed Colonel wait in the lobby,
            and they&rsquo;re not here for a cleaning.
          </p>
          <p>
            What follows is a grenade explosion, a journey through Hell, a
            musical duel with a demon, a trial before a jury of audience
            members, and a love story between a Dentist and an ancient Hag. All
            set to original songs that are sure to have you asking,
            &quot;What?&quot;.
          </p>
          <p>
            <em>Wolfgang Finds the Perfect Tooth </em>is a live-band musical
            about revenge, redemption, and the lengths we&rsquo;ll go to for the
            people we love. Even if those people are supernatural beings who
            haunt children and the elderly.
          </p>
          <p>
            Leave your expectations at the door. As well as any dental
            instruments. Please.
          </p>
        </div>
      </div>
    </section>
  );
}
