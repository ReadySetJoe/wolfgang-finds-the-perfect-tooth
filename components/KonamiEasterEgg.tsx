import { useEffect, useState } from "react";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const WISHES = [
  "Your wish is granted. It was not the wish you wanted.",
  "Somewhere, a Wolfman howls in disappointment.",
  "The tooth has seen your search history. It grants nothing.",
  "A demon hums four bars of your wish. Royalties pending.",
  "The Hag says hello. She says nothing else.",
];

const DISMISS_AFTER_MS = 3500;

export default function KonamiEasterEgg() {
  const [wish, setWish] = useState<string | null>(null);

  useEffect(() => {
    let progress = 0;

    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const expected = KONAMI_SEQUENCE[progress];

      progress = key === expected ? progress + 1 : key === KONAMI_SEQUENCE[0] ? 1 : 0;

      if (progress === KONAMI_SEQUENCE.length) {
        progress = 0;
        setWish(WISHES[Math.floor(Math.random() * WISHES.length)]);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!wish) return;

    const timer = window.setTimeout(() => setWish(null), DISMISS_AFTER_MS);
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setWish(null);
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [wish]);

  if (!wish) return null;

  return (
    <div className="konami-overlay" role="status" onClick={() => setWish(null)}>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="konami-overlay__glyph h-16 w-16 fill-gold"
      >
        <path d="M10.5 2h3v8.5H22v3h-8.5V22h-3v-8.5H2v-3h8.5V2z" />
      </svg>
      <p className="font-heading text-xl text-gold tracking-wider uppercase mt-6 px-6 text-center max-w-md">
        {wish}
      </p>
    </div>
  );
}
