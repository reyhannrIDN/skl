/* Toy catalogue for ClawCaptcha. The art is a set of soft-3D vinyl renders
 * (PNG with transparent background), served from `assetBase` + `<id>.png`.
 * `accent` tints the toy's name in the challenge line. */

export type ToyId =
  | 'snorlax'
  | 'eevee'
  | 'pikachu'
  | 'charmander'
  | 'squirtle'
  | 'bulbasaur'
  | 'psyduck'
  | 'jigglypuff'
  | 'togepi'
  | 'mew'
  | 'meowth'
  | 'gengar'

export const TOY_META: Record<ToyId, { label: string; accent: string }> = {
  snorlax: { label: 'Snorlax', accent: '#375A63' },
  eevee: { label: 'Eevee', accent: '#C98A4B' },
  pikachu: { label: 'Pikachu', accent: '#F5C63B' },
  charmander: { label: 'Charmander', accent: '#D66A30' },
  squirtle: { label: 'Squirtle', accent: '#5A93C9' },
  bulbasaur: { label: 'Bulbasaur', accent: '#5CA86A' },
  psyduck: { label: 'Psyduck', accent: '#E8A33D' },
  jigglypuff: { label: 'Jigglypuff', accent: '#E58AB0' },
  togepi: { label: 'Togepi', accent: '#E3C1B6' },
  mew: { label: 'Mew', accent: '#EAA2B8' },
  meowth: { label: 'Meowth', accent: '#E8CA97' },
  gengar: { label: 'Gengar', accent: '#6E497A' },
}
