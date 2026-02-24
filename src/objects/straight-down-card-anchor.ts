import { CardAnchor } from "./card-anchor";

export class StraightDownCardAnchor extends CardAnchor {
  xPositionFor(index: number): number {
    const modified = Math.floor(index / 10)
    return modified * 1
  }

  yPositionFor(index: number): number {
    const modified = Math.floor(index / 10)
    return modified * 2
  }
}