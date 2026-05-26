import { useEffect, useState } from "react";

export default function CurtainIntro() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // requestAnimationFrame ensures the browser has painted the closed
    // state before we apply `is-open`, so the transition actually runs
    // instead of jumping straight to the open state.
    const raf = requestAnimationFrame(() => {
      setIsOpen(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Under reduced motion there's no animation, so there's nothing to
    // scroll-lock around. Leave the body as-is.
    if (prefersReducedMotion) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      className={`curtain-root${isOpen ? " is-open" : ""}`}
      aria-hidden="true"
      onTransitionEnd={(event) => {
        // Both panels fire transitionend; either one signals completion.
        // Guard against firing on unrelated property transitions.
        if (event.propertyName === "transform") {
          setIsDone(true);
        }
      }}
    >
      <div className="curtain-panel curtain-panel--left" />
      <div className="curtain-panel curtain-panel--right" />
    </div>
  );
}
