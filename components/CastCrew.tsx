import Ornament from "./Ornament";
import { useScrollReveal } from "./useScrollReveal";

const cast = [
  { name: "Cast Member One", role: "Wolfgang" },
  { name: "Cast Member Two", role: "The Narrator" },
  { name: "Cast Member Three", role: "The Tooth Fairy" },
  { name: "Cast Member Four", role: "Charon (Uber Driver)" },
  { name: "Cast Member Five", role: "Greek Chorus" },
  { name: "Cast Member Six", role: "Greek Chorus" },
];

const crew = [
  { name: "Crew Member One", role: "Director" },
  { name: "Crew Member Two", role: "Writer" },
  { name: "Crew Member Three", role: "Musical Director" },
  { name: "Crew Member Four", role: "Stage Manager" },
  { name: "Crew Member Five", role: "Set Design" },
  { name: "Crew Member Six", role: "Lighting Design" },
];

function PersonList({
  people,
}: {
  people: { name: string; role: string }[];
}) {
  return (
    <ul className="space-y-4">
      {people.map((person) => (
        <li key={`${person.name}-${person.role}`} className="text-center">
          <p className="text-gold text-lg">{person.name}</p>
          <p className="text-text-primary/60 text-sm tracking-wide">
            {person.role}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function CastCrew() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="animate-on-scroll bg-bg-mid py-20 px-6">
      <Ornament />
      <div className="mx-auto max-w-3xl">
        <h2 className="font-heading text-3xl text-gold tracking-wider uppercase mb-12 text-center">
          Cast
        </h2>
        <PersonList people={cast} />

        <div className="my-16">
          <Ornament />
        </div>

        <h2 className="font-heading text-3xl text-gold tracking-wider uppercase mb-12 text-center">
          Creative Team
        </h2>
        <PersonList people={crew} />
      </div>
    </section>
  );
}
