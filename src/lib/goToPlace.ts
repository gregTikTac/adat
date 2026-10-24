/**
 * Takes the visitor to the detailed programme of a place on this same page.
 * The page scrolls there smoothly and the block rises into view along a diagonal
 * (the `.arrive` animation in globals.css). With reduced motion it simply jumps.
 */
export function goToPlace(id: string) {
  const el = document.getElementById(`tour-${id}`);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  if (reduce) return;
  el.classList.remove("arrive");
  void el.offsetWidth;
  el.classList.add("arrive");
  el.addEventListener("animationend", () => el.classList.remove("arrive"), { once: true });
}
