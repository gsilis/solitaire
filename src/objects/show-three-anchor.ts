import { CardAnchor } from "./card-anchor";

export class ShowThreeAnchor extends CardAnchor {
  yPositionFor(index: number): number {
    return 0
  }

  xPositionFor(index: number): number {
    return (index % 3) * 28
  }
}