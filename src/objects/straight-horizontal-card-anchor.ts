import { CardAnchor } from "./card-anchor";

export class StraightHorizontalCardAnchor extends CardAnchor {
  xPositionFor(index: number): number {
    const modified = Math.floor(index / 10)
    return modified * 2
  }

  yPositionFor(index: number): number {
    return 0
  }
}