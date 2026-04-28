import Ornament from "./Ornament";
import { useScrollReveal } from "./useScrollReveal";

const characters = [
  { name: "The Patient", description: "A nervous and reluctant hero with a hidden streak of courage" },
  { name: "The Dentist", description: "A charming but sinister figure obsessed with power and perfection" },
  { name: "Wolfman", description: "A vengeful creature with a bone to pick (literally) and a love for chaos" },
  { name: "The Colonel", description: "An eccentric military man seeking redemption, who only speaks in rhymes" },
  { name: "The Hag", description: "An ancient, wish-granting being of terrible power" },
  { name: "The Hygienist", description: "The Dentist's lovestruck assistant caught in the crossfire" },
  { name: "The Demon", description: "Hell's resident musical duelist and grudge holder" },
  { name: "The Receptionist", description: "A no-nonsense gatekeeper from Shreveport" },
];

const crew = [
  { name: "Matthew C. Wallace", role: "Script, Music & Lyrics" },
  { name: "Joseph Powers", role: "Editor" },
  { name: "Wolfgang Wallace", role: "Live Band" },
];

export default function CastCrew() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="animate-on-scroll bg-bg-mid py-20 px-6">
      <Ornament />
      <div className="mx-auto max-w-3xl">
        <h2 className="font-heading text-3xl text-gold tracking-wider uppercase mb-12 text-center">
          Characters
        </h2>
        <ul className="space-y-6">
          {characters.map((character) => (
            <li key={character.name} className="text-center">
              <p className="text-gold text-lg">{character.name}</p>
              <p className="text-text-primary/60 text-sm tracking-wide">
                {character.description}
              </p>
            </li>
          ))}
        </ul>

        <div className="my-16">
          <Ornament />
        </div>

        <h2 className="font-heading text-3xl text-gold tracking-wider uppercase mb-12 text-center">
          Creative Team
        </h2>
        <ul className="space-y-4">
          {crew.map((person) => (
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
