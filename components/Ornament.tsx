export default function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
      <div className="text-red-deep text-lg">&#10013;</div>
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
    </div>
  );
}
