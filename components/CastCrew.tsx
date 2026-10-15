import Ornament from "./Ornament";
import { useScrollReveal } from "./useScrollReveal";

const characters = [
  {
    name: "The Patient",
    actor: "Matthew Wallace",
    description: "Our reluctant hero with a hidden streak of courage",
  },
  {
    name: "The Dentist",
    actor: "Joe Powers",
    description:
      "A charming but sinister figure obsessed with power and perfection",
  },
  {
    name: "Wolfman",
    actor: "Tim Spears",
    description:
      "A vengeful creature seeking revenge for the destruction of the moon and his kind",
  },
  {
    name: "The Hygienist",
    actor: "Laura Connell",
    description:
      "Warm, capable, and quietly fierce — with a past that's about to catch up with her",
  },
  {
    name: "The Hag",
    actor: "Amanda Neal",
    description: "An ancient, wish-granting being of terrible power",
  },
  {
    name: "The Demon/The Judge of Hell",
    actor: "Jake Williams",
    description:
      "Hell's resident musical duelist and potent grudge holder. Also a judge.",
  },
  {
    name: "The Jury",
    actor: "You!",
    description: "Spectators who will judge the Patient's fate",
  },
];

const crew = [
  { name: "Billy Francis", role: "Producer" },
  { name: "Jake Erwin", role: "Producer" },
  { name: "Tiff Bunch", role: "Director" },
  { name: "Matthew C. Wallace", role: "Script, Music & Lyrics" },
  { name: "Alan Hester", role: "Art" },
  { name: "Joe Powers", role: "Helped Out I Guess" },
  { name: "Wolfgang Wallace", role: "Live Band" },
];

export default function CastCrew() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="animate-on-scroll bg-bg-mid py-14 px-6">
      <Ornament />
      <div className="mx-auto max-w-3xl">
        <h2 className="font-heading text-3xl text-gold tracking-wider uppercase mb-12 text-center">
          Characters
        </h2>
        <ul className="space-y-6">
          {characters.map(character => (
            <li key={character.name} className="text-center">
              <p className="text-gold text-lg">{character.name}</p>
              <p className="text-text-primary/80 text-sm italic">
                {character.actor}
              </p>
              <p className="text-text-primary/60 text-sm tracking-wide">
                {character.description}
              </p>
            </li>
          ))}
        </ul>

        <div className="my-10">
          <Ornament />
        </div>

        <h2 className="font-heading text-3xl text-gold tracking-wider uppercase mb-12 text-center">
          Creative Team
        </h2>
        <ul className="space-y-4">
          {crew.map(person => (
            <li key={person.name} className="text-center">
              <p className="text-gold text-lg">{person.name}</p>
              <p className="text-text-primary/60 text-sm tracking-wide">
                {person.role}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
