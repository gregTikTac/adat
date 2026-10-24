/**
 * Diagonal wipe for clip-path. A triangle grows out of one corner until it covers the frame.
 * dir = 1 starts in the top-left corner, dir = -1 in the bottom-right one.
 * Every value has the same shape (3 points, percentages), so the browser can interpolate them.
 */
export type WipeDir = 1 | -1;

/**
 * How one picture replaces another.
 * "wipe" is a diagonal sweep (click, tap, keyboard); "fade" is a slow dissolve (mouse hover).
 */
export type SwapMode = "wipe" | "fade";

export const wipeHidden = (dir: WipeDir) =>
  dir === 1 ? "polygon(0% 0%, 0% 0%, 0% 0%)" : "polygon(100% 100%, 100% 100%, 100% 100%)";

export const wipeShown = (dir: WipeDir) =>
  dir === 1 ? "polygon(0% 0%, 260% 0%, 0% 260%)" : "polygon(100% 100%, -160% 100%, 100% -160%)";

export const EASE_WIPE: [number, number, number, number] = [0.76, 0, 0.24, 1];
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
