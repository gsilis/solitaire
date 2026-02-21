import { CardAnchor } from "./card-anchor";

export class HangingCardAnchor extends CardAnchor {
  yPositionFor(index: number): number {
    return index * 16
  }

  xPositionFor(index: number): number {
    return 0
  }
}