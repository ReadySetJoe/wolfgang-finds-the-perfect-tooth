export default function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4 fill-red-deep"
      >
        <path d="M10.5 2h3v8.5H22v3h-8.5V22h-3v-8.5H2v-3h8.5V2z" />
      </svg>
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
    </div>
  );
}
