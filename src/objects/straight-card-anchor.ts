import { CardAnchor } from "./card-anchor";

export class StraightCardAnchor extends CardAnchor {
  xPositionFor(index: number): number {
    const modified = Math.floor(index / 3)
    return modified * 2
  }

  yPositionFor(index: number): number {
    const modified = Math.floor(index / 3)
    return modified * 8
  }
}