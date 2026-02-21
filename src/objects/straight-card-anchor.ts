import { CardAnchor } from "./card-anchor";

export class StraightCardAnchor extends CardAnchor {
  xPositionFor(index: number): number {
    const modified = Math.floor(index / 5)
    return modified * 1
  }

  yPositionFor(index: number): number {
    const modified = Math.floor(index / 5)
    return modified * 2
  }
}