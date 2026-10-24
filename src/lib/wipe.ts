/**
 * Shared motion settings for swapping pictures.
 * A swap is a slow dissolve with a small drift along a diagonal and a short zoom-out,
 * the same for a mouse hover, a tap, the keyboard and the slider arrows.
 * `dir` is 1 when the next place is further down the list and -1 when it is above.
 */
export type WipeDir = 1 | -1;

export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_SOFT: [number, number, number, number] = [0.45, 0, 0.2, 1];

/** Seconds the incoming picture takes to appear. The outgoing one stays underneath a bit longer. */
export const SWAP_IN = 1.5;
export const SWAP_OUT = 1.8;
