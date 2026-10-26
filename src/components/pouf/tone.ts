/** The palette, and the semantic aliases screens should prefer.
 *
 * Screens say what a thing MEANS ("up", "down", "warn") rather than what colour
 * it is ("mint", "pink"). Re-theming then happens in pouf.css alone. */
export type Tone =
  | 'pink'
  | 'purple'
  | 'blue'
  | 'mint'
  | 'yellow'
  | 'orange'
  | 'up'
  | 'down'
  | 'warn'
  | 'info'
  | 'idle';

export const toneClass = (tone?: Tone): string | undefined => (tone ? `tone-${tone}` : undefined);
